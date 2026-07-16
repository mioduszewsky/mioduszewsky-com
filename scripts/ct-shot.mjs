import { chromium } from 'playwright';
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });
// contact full
await p.goto('http://localhost:4331/contact', { waitUntil: 'networkidle' });
await p.waitForTimeout(600);
await p.screenshot({ path: '/tmp/shot-contact.png', fullPage: true });
// mobile contact
await p.setViewportSize({ width: 390, height: 844 });
await p.goto('http://localhost:4331/contact', { waitUntil: 'networkidle' });
await p.waitForTimeout(500);
await p.screenshot({ path: '/tmp/shot-contact-m.png', fullPage: true });
await b.close();
console.log('done');
