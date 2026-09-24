import fs from 'fs';
import path from 'path';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig, loadEnv } from 'vite';

import runtimeErrorOverlay from '@replit/vite-plugin-runtime-error-modal';

const rawPort = process.env.PORT;

if (!rawPort) {
  throw new Error(
    'PORT environment variable is required but was not provided.',
  );
}

const port = Number(rawPort);

if (Number.isNaN(port) || port <= 0) {
  throw new Error(`Invalid PORT value: "${rawPort}"`);
}

const basePath = process.env.BASE_PATH;

if (!basePath) {
  throw new Error(
    'BASE_PATH environment variable is required but was not provided.',
  );
}

const VALID_STATIC_ROUTES = new Set([
  '/',
  '/vedic-maths',
  '/about',
  '/curriculum-aligned',
  '/contact',
  '/blog',
  '/privacy-policy',
  '/terms-of-service',
  '/cookie-policy',
  '/admin',
  '/authors/meenakshi-koul',
]);

const ASSET_EXT_REGEX = /\.(js|mjs|cjs|ts|tsx|css|svg|png|jpg|jpeg|gif|webp|ico|woff|woff2|ttf|eot|json|map|txt|xml|pdf)$/i;

const publishedSlugsCache = new Map<string, { valid: boolean; timestamp: number }>();
const CACHE_TTL_MS = 30000;

async function isPublishedBlogSlug(slug: string, supabaseUrl?: string, supabaseKey?: string): Promise<boolean> {
  if (slug === 'vedic-maths-vs-abacus') {
    return true;
  }

  const cached = publishedSlugsCache.get(slug);
  const now = Date.now();
  if (cached && now - cached.timestamp < CACHE_TTL_MS) {
    return cached.valid;
  }

  if (!supabaseUrl || !supabaseKey) {
    return false;
  }

  try {
    const res = await fetch(
      `${supabaseUrl}/rest/v1/blog_posts?select=id&slug=eq.${encodeURIComponent(slug)}&status=eq.published&limit=1`,
      {
        headers: {
          apikey: supabaseKey,
          Authorization: `Bearer ${supabaseKey}`,
        },
      }
    );
    if (res.ok) {
      const data = await res.json();
      const valid = Array.isArray(data) && data.length > 0;
      publishedSlugsCache.set(slug, { valid, timestamp: now });
      return valid;
    }
  } catch (err) {
    console.error('Error verifying blog slug in 404 middleware:', err);
  }
  return false;
}

function spa404Plugin(supabaseUrl?: string, supabaseKey?: string) {
  return {
    name: 'vite-plugin-spa-404',
    configureServer(server: any) {
      server.middlewares.use(async (req: any, res: any, next: any) => {
        if (!req.url || (req.method !== 'GET' && req.method !== 'HEAD')) {
          return next();
        }

        const urlObj = new URL(req.url, 'http://localhost');
        const pathname = urlObj.pathname.replace(/\/$/, '') || '/';

        if (
          urlObj.pathname.startsWith('/@') ||
          urlObj.pathname.startsWith('/src/') ||
          urlObj.pathname.startsWith('/node_modules/') ||
          urlObj.search.includes('import') ||
          ASSET_EXT_REGEX.test(urlObj.pathname)
        ) {
          return next();
        }

        const accept = req.headers['accept'] || '';
        const isDocRequest = accept.includes('text/html') || !accept || accept.includes('*/*');
        if (!isDocRequest) {
          return next();
        }

        if (VALID_STATIC_ROUTES.has(pathname) || pathname.startsWith('/admin') || pathname.startsWith('/authors/')) {
          return next();
        }

        if (pathname.startsWith('/blog/')) {
          const slug = pathname.replace(/^\/blog\//, '').replace(/\/$/, '');
          if (slug) {
            const isValid = await isPublishedBlogSlug(slug, supabaseUrl, supabaseKey);
            if (isValid) {
              return next();
            }
          }
        }

        // Unknown route -> Genuine HTTP 404
        try {
          const templatePath = path.resolve(import.meta.dirname, 'public/404.html');
          if (fs.existsSync(templatePath)) {
            const rawHtml = fs.readFileSync(templatePath, 'utf-8');
            const transformed = await server.transformIndexHtml(req.url, rawHtml);
            res.statusCode = 404;
            res.setHeader('Content-Type', 'text/html; charset=utf-8');
            res.end(transformed);
            return;
          }
        } catch (err) {
          console.error('Failed to render 404 template:', err);
        }

        res.statusCode = 404;
        res.setHeader('Content-Type', 'text/html; charset=utf-8');
        res.end('<!DOCTYPE html><html><head><title>Page not found | The Vedic School</title></head><body><h1>404 Not Found</h1></body></html>');
      });
    },
    configurePreviewServer(server: any) {
      server.middlewares.use(async (req: any, res: any, next: any) => {
        if (!req.url || (req.method !== 'GET' && req.method !== 'HEAD')) {
          return next();
        }

        const urlObj = new URL(req.url, 'http://localhost');

        if (ASSET_EXT_REGEX.test(urlObj.pathname)) {
          return next();
        }

        const accept = req.headers['accept'] || '';
        const isDocRequest = accept.includes('text/html') || !accept || accept.includes('*/*');
        if (!isDocRequest) {
          return next();
        }

        // Trailing slash redirect: non-root paths ending with / return 301 to canonical no-slash URL
        if (urlObj.pathname !== '/' && urlObj.pathname.endsWith('/')) {
          const cleanPath = urlObj.pathname.replace(/\/+$/, '');
          res.statusCode = 301;
          res.setHeader('Location', `${cleanPath}${urlObj.search}`);
          res.end();
          return;
        }

        const pathname = urlObj.pathname.replace(/\/$/, '') || '/';

        const outDir = path.resolve(import.meta.dirname, 'dist/public');

        // 1. Check if a prerendered static HTML file exists for this route
        let targetFile = '';
        if (pathname === '/') {
          targetFile = path.resolve(outDir, 'index.html');
        } else {
          const cleanRoute = pathname.replace(/^\//, '');
          targetFile = path.resolve(outDir, `${cleanRoute}.html`);
          if (!fs.existsSync(targetFile)) {
            targetFile = path.resolve(outDir, cleanRoute, 'index.html');
          }
        }

        if (fs.existsSync(targetFile)) {
          const content = fs.readFileSync(targetFile, 'utf-8');
          res.statusCode = 200;
          res.setHeader('Content-Type', 'text/html; charset=utf-8');
          res.end(content);
          return;
        }

        // 2. Client-side SPA routes (e.g. /admin, /admin/*)
        if (pathname === '/admin' || pathname.startsWith('/admin/')) {
          const shellFile = path.resolve(outDir, 'index.html');
          if (fs.existsSync(shellFile)) {
            const content = fs.readFileSync(shellFile, 'utf-8');
            res.statusCode = 200;
            res.setHeader('Content-Type', 'text/html; charset=utf-8');
            res.end(content);
            return;
          }
        }

        // 3. Dynamic published blog post check if not prerendered at build time
        if (pathname.startsWith('/blog/')) {
          const slug = pathname.replace(/^\/blog\//, '').replace(/\/$/, '');
          if (slug) {
            const isValid = await isPublishedBlogSlug(slug, supabaseUrl, supabaseKey);
            if (isValid) {
              const shellFile = path.resolve(outDir, 'index.html');
              if (fs.existsSync(shellFile)) {
                const content = fs.readFileSync(shellFile, 'utf-8');
                res.statusCode = 200;
                res.setHeader('Content-Type', 'text/html; charset=utf-8');
                res.end(content);
                return;
              }
            }
          }
        }

        // 4. Unknown route -> Genuine HTTP 404
        try {
          const file404 = path.resolve(outDir, '404.html');
          if (fs.existsSync(file404)) {
            const content = fs.readFileSync(file404, 'utf-8');
            res.statusCode = 404;
            res.setHeader('Content-Type', 'text/html; charset=utf-8');
            res.end(content);
            return;
          }
        } catch {}

        res.statusCode = 404;
        res.setHeader('Content-Type', 'text/html; charset=utf-8');
        res.end('<!DOCTYPE html><html><head><title>Page not found | The Vedic School</title></head><body><h1>404 Not Found</h1></body></html>');
      });
    },
  };
}

const loadedEnv = loadEnv(process.env.NODE_ENV || 'development', import.meta.dirname, '');
const resolvedSupabaseUrl = process.env.VITE_SUPABASE_URL || loadedEnv.VITE_SUPABASE_URL;
const resolvedSupabaseKey = process.env.VITE_SUPABASE_PUBLISHABLE_KEY || loadedEnv.VITE_SUPABASE_PUBLISHABLE_KEY;

export default defineConfig({
  base: basePath,
  plugins: [
    spa404Plugin(resolvedSupabaseUrl, resolvedSupabaseKey),
    react(),
    tailwindcss(),
    runtimeErrorOverlay(),
    ...(process.env.NODE_ENV !== 'production' &&
    process.env.REPL_ID !== undefined
      ? [
          await import('@replit/vite-plugin-cartographer').then((m) =>
            m.cartographer({
              root: path.resolve(import.meta.dirname, '..'),
            }),
          ),
          await import('@replit/vite-plugin-dev-banner').then((m) =>
            m.devBanner(),
          ),
        ]
      : []),
  ],
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, 'src'),
      '@assets': path.resolve(
        import.meta.dirname,
        '..',
        '..',
        'attached_assets',
      ),
    },
    dedupe: ['react', 'react-dom'],
  },
  root: path.resolve(import.meta.dirname),
  build: {
    outDir: path.resolve(import.meta.dirname, 'dist/public'),
    emptyOutDir: true,
  },
  server: {
    port,
    strictPort: true,
    host: '0.0.0.0',
    allowedHosts: true,
    fs: {
      strict: true,
    },
  },
  preview: {
    port,
    host: '0.0.0.0',
    allowedHosts: true,
  },
});
