import { chromium } from 'playwright';
const b = await chromium.launch();
const p = await b.newPage({ viewport:{width:1440,height:900} });
await p.goto('http://localhost:4338/', { waitUntil:'networkidle' });
await p.waitForTimeout(800);
await p.evaluate(()=>document.querySelector('.foot-grid')?.scrollIntoView({block:'center'}));
await p.waitForTimeout(1200);
await p.screenshot({ path:'/tmp/foot-light.png' });
// finale - scroll to very bottom
await p.evaluate(()=>window.scrollTo(0, document.body.scrollHeight));
await p.waitForTimeout(2500);
await p.screenshot({ path:'/tmp/finale.png' });
await b.close(); console.log('ok');
