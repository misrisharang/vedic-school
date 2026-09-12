import puppeteer from 'puppeteer';

async function run() {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();
  const consoleErrors = [];
  page.on('console', (msg) => {
    if (msg.type() === 'error' && !msg.text().includes('404 (Not Found)')) {
      consoleErrors.push(msg.text());
    }
  });
  page.on('pageerror', (err) => {
    consoleErrors.push(err.toString());
  });

  const baseUrl = 'http://localhost:4173';
  let passed = true;

  // 1. Homepage
  console.log('\nTesting /');
  await page.goto(`${baseUrl}/`, { waitUntil: 'networkidle0' });
  const homeLdJson = await page.evaluate(() => {
    const el = document.querySelector('script[type="application/ld+json"]');
    return el ? JSON.parse(el.textContent) : null;
  });
  const homeTypes = homeLdJson?.['@graph']?.map((e) => e['@type']) || [];
  console.log('Homepage entities:', homeTypes);
  if (!homeTypes.includes('EducationalOrganization') || !homeTypes.includes('WebSite') || !homeTypes.includes('WebPage')) {
    console.error('FAIL: Homepage missing core entities');
    passed = false;
  }
  if (homeTypes.includes('FAQPage') || homeTypes.includes('Service') || homeTypes.includes('BlogPosting')) {
    console.error('FAIL: Homepage contains prohibited entities');
    passed = false;
  }

  // 2. /vedic-maths
  console.log('\nTesting /vedic-maths');
  await page.goto(`${baseUrl}/vedic-maths`, { waitUntil: 'networkidle0' });
  const vmJson = await page.evaluate(() => {
    const el = document.querySelector('script[type="application/ld+json"]');
    return el ? JSON.parse(el.textContent) : null;
  });
  const vmTypes = vmJson?.['@graph']?.map((e) => e['@type']) || [];
  console.log('Vedic Maths entities:', vmTypes);
  const vmFaq = vmJson?.['@graph']?.find((e) => e['@type'] === 'FAQPage');
  if (!vmTypes.includes('Service') || !vmTypes.includes('FAQPage') || vmFaq?.mainEntity?.length !== 5) {
    console.error('FAIL: Vedic maths missing Service or 5 FAQs');
    passed = false;
  }

  // 3. /curriculum-aligned
  console.log('\nTesting /curriculum-aligned');
  await page.goto(`${baseUrl}/curriculum-aligned`, { waitUntil: 'networkidle0' });
  const caJson = await page.evaluate(() => {
    const el = document.querySelector('script[type="application/ld+json"]');
    return el ? JSON.parse(el.textContent) : null;
  });
  const caTypes = caJson?.['@graph']?.map((e) => e['@type']) || [];
  console.log('Curriculum-aligned entities:', caTypes);
  const caFaq = caJson?.['@graph']?.find((e) => e['@type'] === 'FAQPage');
  if (!caTypes.includes('Service') || !caTypes.includes('FAQPage') || caFaq?.mainEntity?.length !== 5) {
    console.error('FAIL: Curriculum-aligned missing Service or 5 FAQs');
    passed = false;
  }

  // 4. /about
  console.log('\nTesting /about');
  await page.goto(`${baseUrl}/about`, { waitUntil: 'networkidle0' });
  const aboutJson = await page.evaluate(() => {
    const el = document.querySelector('script[type="application/ld+json"]');
    return el ? JSON.parse(el.textContent) : null;
  });
  const aboutTypes = aboutJson?.['@graph']?.map((e) => e['@type']) || [];
  console.log('About entities:', aboutTypes);
  const person = aboutJson?.['@graph']?.find((e) => e['@type'] === 'Person');
  if (!aboutTypes.includes('ProfilePage') || !person || person.name !== 'Meenakshi Koul') {
    console.error('FAIL: About missing ProfilePage or Meenakshi Koul Person entity');
    passed = false;
  }

  // 5. /contact
  console.log('\nTesting /contact');
  await page.goto(`${baseUrl}/contact`, { waitUntil: 'networkidle0' });
  const contactJson = await page.evaluate(() => {
    const el = document.querySelector('script[type="application/ld+json"]');
    return el ? JSON.parse(el.textContent) : null;
  });
  const contactTypes = contactJson?.['@graph']?.map((e) => e['@type']) || [];
  console.log('Contact entities:', contactTypes);
  if (!contactTypes.includes('ContactPage')) {
    console.error('FAIL: Contact missing ContactPage');
    passed = false;
  }

  // 6. /blog
  console.log('\nTesting /blog');
  await page.goto(`${baseUrl}/blog`, { waitUntil: 'networkidle0' });
  const blogJson = await page.evaluate(() => {
    const el = document.querySelector('script[type="application/ld+json"]');
    return el ? JSON.parse(el.textContent) : null;
  });
  const blogTypes = blogJson?.['@graph']?.map((e) => e['@type']) || [];
  console.log('Blog entities:', blogTypes);
  if (!blogTypes.includes('Blog') || blogTypes.includes('BlogPosting')) {
    console.error('FAIL: Blog page schema mismatch');
    passed = false;
  }

  // 7. /does-not-exist
  console.log('\nTesting /does-not-exist');
  await page.goto(`${baseUrl}/does-not-exist`, { waitUntil: 'networkidle0' });
  const notFoundLdCount = await page.evaluate(() => {
    return document.querySelectorAll('script[type="application/ld+json"]').length;
  });
  const notFoundRobots = await page.evaluate(() => {
    return document.querySelector('meta[name="robots"]')?.getAttribute('content');
  });
  console.log('404 JSON-LD count:', notFoundLdCount, 'robots:', notFoundRobots);
  if (notFoundLdCount !== 0 || !notFoundRobots?.includes('noindex')) {
    console.error('FAIL: 404 page has JSON-LD or missing noindex');
    passed = false;
  }

  // Check client-side navigation back to home
  console.log('\nTesting client navigation back to home');
  await page.evaluate(() => {
    const btn = Array.from(document.querySelectorAll('a, button')).find((el) =>
      el.textContent.includes('Back to home')
    );
    if (btn) btn.click();
  });
  await new Promise((r) => setTimeout(r, 800));
  const restoredHomeTypes = await page.evaluate(() => {
    const el = document.querySelector('script[type="application/ld+json"]');
    return el ? JSON.parse(el.textContent)?.['@graph']?.map((e) => e['@type']) : null;
  });
  console.log('Restored Home entities after navigation:', restoredHomeTypes);

  console.log('\nTotal console errors during audit:', consoleErrors.length);
  if (consoleErrors.length > 0) {
    console.log('Console errors:', consoleErrors);
  }

  await browser.close();

  if (passed && consoleErrors.length === 0) {
    console.log('\n=== ALL PUPPETEER BROWSER TESTS PASSED! ===\n');
    process.exit(0);
  } else {
    console.error('\n=== PUPPETEER BROWSER TESTS FAILED! ===\n');
    process.exit(1);
  }
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
