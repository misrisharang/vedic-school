import puppeteer from 'puppeteer';

async function runQA() {
  console.log('Starting Local QA Verification on http://localhost:5173 ...\n');
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();

  const consoleErrors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text());
    }
  });
  page.on('pageerror', err => {
    consoleErrors.push(err.message);
  });

  // 1. Visit http://localhost:5173/authors/meenakshi-koul
  console.log('1. Checking Author Profile Page: /authors/meenakshi-koul ...');
  await page.goto('http://localhost:5173/authors/meenakshi-koul', { waitUntil: 'networkidle0' });
  const authorData = await page.evaluate(() => {
    const h1 = document.querySelector('h1')?.textContent?.trim();
    const role = document.querySelector('section p.text-stone-600')?.textContent?.trim();
    const img = document.querySelector('section img')?.getAttribute('src');
    const articlesCount = document.querySelectorAll('section article').length;
    const jsonLd = document.querySelector('script[type="application/ld+json"]')?.textContent;
    return { h1, role, img, articlesCount, hasSchema: Boolean(jsonLd) };
  });
  console.log('   Author Profile Loaded:', authorData);

  // 2. Visit http://localhost:5173/blog/vedic-maths-vs-abacus
  console.log('\n2. Checking Blog Post Page: /blog/vedic-maths-vs-abacus ...');
  await page.goto('http://localhost:5173/blog/vedic-maths-vs-abacus', { waitUntil: 'networkidle0' });
  const blogData = await page.evaluate(() => {
    const h1 = document.querySelector('h1')?.textContent?.trim();
    const authorLink = document.querySelector('a[href^="/authors/"]')?.textContent?.trim();
    const tocItems = document.querySelectorAll('nav a[href^="#"]').length;
    const hasSources = document.body.innerText.includes('Barner, D. et al.');
    return { h1, authorLink, tocItems, hasSources };
  });
  console.log('   Blog Post Loaded:', blogData);

  // 3. Test CMS Author Update Event / Cache Reactivity
  console.log('\n3. Testing Real-time Author Update Reactivity ...');
  await page.goto('http://localhost:5173/authors/meenakshi-koul', { waitUntil: 'networkidle0' });

  // Update author in localStorage and dispatch the custom event
  await page.evaluate(() => {
    const cacheKey = 'the_vedic_school_authors_cache';
    const updatedAuthor = {
      id: 'meenakshi-koul',
      name: 'Meenakshi Koul',
      slug: 'meenakshi-koul',
      role: 'Master Educator & Founder, The Vedic School',
      bio: 'Updated live bio: Teaching mathematics for over two decades with concept-first mastery.',
      photo: 'https://ozhoummzmwevssuchiss.supabase.co/storage/v1/object/public/blog-images/authors/1789666481147-meenakshi-koul.jpeg',
      photo_alt: 'Meenakshi Koul Master Educator',
      linkedin: 'https://www.linkedin.com/in/meenakshi-koul-14b101135/'
    };
    localStorage.setItem(cacheKey, JSON.stringify([updatedAuthor]));
    window.dispatchEvent(new CustomEvent('vedic_school_author_updated', { detail: updatedAuthor }));
  });

  // Give React 100ms to re-render
  await new Promise(r => setTimeout(r, 100));

  const liveUpdateResult = await page.evaluate(() => {
    return {
      displayedRole: document.querySelector('section p.text-stone-600')?.textContent?.trim(),
      displayedBioSnippet: document.querySelector('section .prose')?.textContent?.trim().slice(0, 100)
    };
  });
  console.log('   Live Update Result:', liveUpdateResult);

  // Clean up cache override after test
  await page.evaluate(() => {
    localStorage.removeItem('the_vedic_school_authors_cache');
  });

  // 4. Check console errors
  console.log('\n4. Console Errors Summary:');
  const filteredErrors = consoleErrors.filter(e => !e.includes('favicon'));
  if (filteredErrors.length === 0) {
    console.log('   ✓ ZERO console errors detected across all tested routes!');
  } else {
    console.log('   Errors found:', filteredErrors);
  }

  await browser.close();
  console.log('\n✓ Local QA Verification Complete!');
}

runQA().catch(err => {
  console.error('QA Failed:', err);
  process.exit(1);
});
