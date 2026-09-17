// ==============================================================================
// THE VEDIC SCHOOL — BUILD-TIME STATIC PRERENDER SCRIPT
// ==============================================================================
// Prerenders all public routes into static HTML files for SEO crawlers and fast
// initial page loads.
// ==============================================================================

import fs from 'fs';
import path from 'path';
import http from 'http';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';
import puppeteer from 'puppeteer';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DIST_DIR = path.resolve(__dirname, '../dist/public');

// MIME types for the temporary static server
const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.json': 'application/json',
  '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
};

// Static public routes to prerender
const STATIC_PUBLIC_ROUTES = [
  '/',
  '/vedic-maths',
  '/curriculum-aligned',
  '/about',
  '/contact',
  '/blog',
  '/blog/vedic-maths-vs-abacus',
  '/blog/is-vedic-maths-useful',
  '/blog/best-vedic-maths-online-classes-for-kids',
  '/authors/meenakshi-koul',
  '/privacy-policy',
  '/terms-of-service',
  '/cookie-policy',
];

// Read environment variables (supports .env and .env.local)
function loadEnv() {
  const env = { ...process.env };
  const envFiles = [
    path.resolve(__dirname, '../.env'),
    path.resolve(__dirname, '../.env.local'),
  ];
  for (const f of envFiles) {
    if (fs.existsSync(f)) {
      const content = fs.readFileSync(f, 'utf-8');
      for (const line of content.split('\n')) {
        const trimmed = line.trim();
        if (trimmed && !trimmed.startsWith('#') && trimmed.includes('=')) {
          const idx = trimmed.indexOf('=');
          const k = trimmed.slice(0, idx).trim();
          const v = trimmed.slice(idx + 1).trim();
          if (!env[k]) {
            env[k] = v;
          }
        }
      }
    }
  }
  return env;
}

// Fetch published blog slugs from Supabase
async function fetchPublishedBlogSlugs(env) {
  const supabaseUrl = env.VITE_SUPABASE_URL;
  const supabaseKey = env.VITE_SUPABASE_PUBLISHABLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    console.log('[prerender] No Supabase credentials found. Skipping blog article prerendering.');
    return [];
  }

  try {
    const res = await fetch(
      `${supabaseUrl}/rest/v1/blog_posts?select=slug&status=eq.published`,
      {
        headers: {
          apikey: supabaseKey,
          Authorization: `Bearer ${supabaseKey}`,
        },
      }
    );
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data)) {
        return data.map((item) => `/blog/${item.slug}`);
      }
    } else {
      console.warn(`[prerender] Supabase query returned status ${res.status}`);
    }
  } catch (err) {
    console.warn('[prerender] Could not connect to Supabase for blog slugs:', err.message);
  }
  return [];
}

// Fetch published author slugs from Supabase
async function fetchPublishedAuthorSlugs(env) {
  const supabaseUrl = env.VITE_SUPABASE_URL;
  const supabaseKey = env.VITE_SUPABASE_PUBLISHABLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return [];
  }

  try {
    const res = await fetch(
      `${supabaseUrl}/rest/v1/authors?select=slug`,
      {
        headers: {
          apikey: supabaseKey,
          Authorization: `Bearer ${supabaseKey}`,
        },
      }
    );
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data)) {
        return data.map((item) => `/authors/${item.slug}`);
      }
    } else {
      console.warn(`[prerender] Supabase query for authors returned status ${res.status}`);
    }
  } catch (err) {
    console.warn('[prerender] Could not connect to Supabase for author slugs:', err.message);
  }
  return [];
}

// Start ephemeral static HTTP server
function startServer(appShellHtml) {
  return new Promise((resolve, reject) => {
    const server = http.createServer((req, res) => {
      try {
        const urlPath = new URL(req.url, 'http://localhost').pathname;
        const filePath = path.join(DIST_DIR, urlPath);

        // Serve existing assets if requested file exists and is not a directory
        if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
          const ext = path.extname(filePath).toLowerCase();
          const mime = MIME_TYPES[ext] || 'application/octet-stream';
          res.writeHead(200, { 'Content-Type': mime });
          fs.createReadStream(filePath).pipe(res);
          return;
        }

        // SPA fallback: serve original app-shell for all HTML navigation requests
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end(appShellHtml);
      } catch (err) {
        res.writeHead(500);
        res.end('Internal Server Error: ' + err.message);
      }
    });

    server.listen(0, '127.0.0.1', () => {
      const port = server.address().port;
      resolve({ server, port });
    });

    server.on('error', reject);
  });
}

async function main() {
  console.log('\n======================================================');
  console.log('THE VEDIC SCHOOL — STATIC PRERENDER BUILD PROCESS');
  console.log('======================================================\n');

  if (!fs.existsSync(DIST_DIR)) {
    console.error(`[prerender] ERROR: Distribution directory not found at ${DIST_DIR}`);
    console.error('[prerender] Please run "vite build" before running prerender.');
    process.exit(1);
  }

  const initialIndexHtmlPath = path.join(DIST_DIR, 'index.html');
  if (!fs.existsSync(initialIndexHtmlPath)) {
    console.error(`[prerender] ERROR: index.html not found at ${initialIndexHtmlPath}`);
    process.exit(1);
  }

  // Preserve original Vite-generated SPA index.html as the shell for the prerendering server
  const appShellHtml = fs.readFileSync(initialIndexHtmlPath, 'utf-8');

  // Load env & fetch dynamic routes
  const env = loadEnv();
  console.log('[prerender] Checking Supabase for published blog articles...');
  const blogRoutes = await fetchPublishedBlogSlugs(env);
  if (blogRoutes.length > 0) {
    console.log(`[prerender] Found ${blogRoutes.length} published blog article(s): ${blogRoutes.join(', ')}`);
  } else {
    console.log('[prerender] No published blog articles found to prerender.');
  }

  const authorRoutes = await fetchPublishedAuthorSlugs(env);
  if (authorRoutes.length > 0) {
    console.log(`[prerender] Found ${authorRoutes.length} author profile(s): ${authorRoutes.join(', ')}`);
  }

  const allRoutes = Array.from(new Set([...STATIC_PUBLIC_ROUTES, ...blogRoutes, ...authorRoutes]));
  console.log(`[prerender] Total public routes to prerender: ${allRoutes.length}`);

  // Start local server
  const { server, port } = await startServer(appShellHtml);
  console.log(`[prerender] Temporary preview server running on http://127.0.0.1:${port}`);

  // Launch headless browser
  console.log('[prerender] Launching headless browser...');
  const launchOptions = {
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-accelerated-2d-canvas',
      '--no-first-run',
      '--no-zygote',
    ],
  };

  let browser;
  try {
    browser = await puppeteer.launch(launchOptions);
  } catch (err) {
    if (err.message && err.message.includes('Could not find Chrome')) {
      console.log('[prerender] Chrome not found in environment cache. Installing Chrome now...');
      execSync('npx puppeteer browsers install chrome', { stdio: 'inherit' });
      browser = await puppeteer.launch(launchOptions);
    } else {
      throw err;
    }
  }

  const results = [];

  try {
    for (const route of allRoutes) {
      const pageUrl = `http://127.0.0.1:${port}${route}`;
      const page = await browser.newPage();
      await page.setViewport({ width: 1280, height: 800 });

      // Navigate to route
      await page.goto(pageUrl, { waitUntil: 'networkidle0', timeout: 30000 });

      // Wait until React renders child nodes into #root
      await page.waitForFunction(
        () => {
          const root = document.getElementById('root');
          return root && root.children.length > 0;
        },
        { timeout: 10000 }
      );

      // Brief grace period for any post-mount microtasks or animations
      await new Promise((resolve) => setTimeout(resolve, 200));

      // Capture rendered DOM
      const renderedHtml = await page.content();
      await page.close();

      // Determine output filepath
      let outFile;
      if (route === '/') {
        outFile = path.join(DIST_DIR, 'index.html');
      } else {
        const routeSubdir = path.join(DIST_DIR, route.replace(/^\//, ''));
        fs.mkdirSync(routeSubdir, { recursive: true });
        outFile = path.join(routeSubdir, 'index.html');
      }

      fs.writeFileSync(outFile, renderedHtml, 'utf-8');
      const sizeKb = (Buffer.byteLength(renderedHtml, 'utf-8') / 1024).toFixed(1);
      results.push({ route, file: path.relative(DIST_DIR, outFile), size: `${sizeKb} KB` });
      console.log(`  ✓ ${route.padEnd(26)} -> ${path.relative(DIST_DIR, outFile)} (${sizeKb} KB)`);
    }
  } finally {
    await browser.close();
    server.close();
  }

  console.log('\n======================================================');
  console.log(`Prerendering successfully complete! (${results.length} pages generated)`);
  console.log('======================================================\n');
}

main().catch((err) => {
  console.error('\n[prerender] Fatal error during prerendering:', err);
  process.exit(1);
});
