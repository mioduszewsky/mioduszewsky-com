import { chromium } from 'playwright';
const b = await chromium.launch();
const p = await b.newPage({ viewport:{width:1440,height:950} });
await p.goto('http://localhost:4333/', { waitUntil:'networkidle' });
await p.waitForTimeout(800);
await p.evaluate(()=>document.querySelector('.foot')?.scrollIntoView({block:'start'}));
await p.waitForTimeout(1500);
await p.screenshot({ path:'/tmp/foot-top.png' });
await b.close(); console.log('ok');
