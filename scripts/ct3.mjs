import { chromium } from 'playwright';
const b = await chromium.launch();
const p = await b.newPage({ viewport:{width:1440,height:900} });
await p.goto('http://localhost:4340/contact', { waitUntil:'domcontentloaded' });
await p.waitForTimeout(3500);
await p.screenshot({ path:'/tmp/ct-new.png' });
const H = await p.evaluate(()=>document.body.scrollHeight);
console.log('contact height:', H);
await b.close();
