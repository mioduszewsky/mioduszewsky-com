import { chromium } from 'playwright';
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1440, height: 1000 } });
await p.goto('https://mioduszewsky-com.vercel.app/contact', { waitUntil: 'networkidle' });
await p.waitForTimeout(4000);
await p.screenshot({ path: '/tmp/ct-live.png', fullPage: false });
await b.close(); console.log('ok');
