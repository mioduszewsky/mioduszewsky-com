import { chromium } from 'playwright';
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 2 });
await p.goto('file:///tmp/og-card.html');
await p.waitForTimeout(400);
await p.screenshot({ path: process.env.HOME + '/mioduszewsky-com/public/og.png' });
await b.close();
console.log('og.png written');
