import { chromium } from 'playwright';
const b = await chromium.launch();
const p = await b.newPage({ viewport:{width:1440,height:950} });
await p.goto('http://localhost:4332/', { waitUntil:'networkidle' });
await p.waitForTimeout(800);
// scroll do proc
await p.evaluate(()=>document.querySelector('.proc')?.scrollIntoView({block:'start'}));
await p.waitForTimeout(1200);
await p.screenshot({ path:'/tmp/proc.png' });
// mobile
await p.setViewportSize({width:390,height:844});
await p.evaluate(()=>document.querySelector('.proc')?.scrollIntoView({block:'start'}));
await p.waitForTimeout(800);
await p.screenshot({ path:'/tmp/proc-m.png' });
await b.close(); console.log('ok');
