import { chromium } from 'playwright';

const base = process.argv[2] ?? 'http://127.0.0.1:4321';
const endpoint = 'https://fdoy7mjmtd.execute-api.eu-central-1.amazonaws.com/';
const browser = await chromium.launch();

async function submitAndCapture(page) {
  let payload;
  await page.route(endpoint, async (route) => {
    payload = route.request().postDataJSON();
    await route.fulfill({ status: 200, contentType: 'application/json', body: '{}' });
  });
  await page.locator('[name="name"]').fill('UTM QA');
  await page.locator('[name="email"]').fill('utm-qa@example.test');
  await page.locator('[name="message"]').fill('Test attribution');
  await page.locator('[name="consent"]').check();
  await page.locator('#ctForm').evaluate((form) => form.requestSubmit());
  await page.waitForFunction(() => document.querySelector('#ctSuccess')?.hidden === false);
  return payload;
}

async function campaignFlow() {
  const context = await browser.newContext();
  const page = await context.newPage();
  await page.goto(`${base}/pl/?utm_source=meta&utm_medium=paid_social&utm_campaign=mo-meta-pl-01`, { waitUntil: 'domcontentloaded' });
  await page.goto(`${base}/pl/kontakt/#ctForm`, { waitUntil: 'domcontentloaded' });
  const payload = await submitAndCapture(page);
  for (const expected of ['utm_source=meta', 'utm_medium=paid_social', 'utm_campaign=mo-meta-pl-01']) {
    if (!payload?.message?.includes(expected)) throw new Error(`Missing campaign attribution: ${expected}`);
  }
  await context.close();
}

async function organicFlow() {
  const context = await browser.newContext();
  const page = await context.newPage();
  await page.goto(`${base}/pl/kontakt/#ctForm`, { waitUntil: 'domcontentloaded' });
  const payload = await submitAndCapture(page);
  if (payload?.message?.includes('[utm]')) throw new Error('Organic visit gained false UTM attribution');
  await context.close();
}

await campaignFlow();
await organicFlow();
await browser.close();
console.log('UTM QA: PASS');
