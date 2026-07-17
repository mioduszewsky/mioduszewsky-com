import { chromium } from 'playwright';
const b = await chromium.launch();
const p = await b.newPage({ viewport:{width:1440,height:900} });
await p.goto('http://localhost:4338/contact', { waitUntil:'networkidle' });
await p.waitForTimeout(2500);
await p.screenshot({ path:'/tmp/ct-compact.png', fullPage:true });
const h = await p.evaluate(()=>document.body.scrollHeight);
console.log('contact page height:', h, 'px (viewport 900)');
await b.close();
