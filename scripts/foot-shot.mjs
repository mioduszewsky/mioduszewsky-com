import { chromium } from 'playwright';
const b = await chromium.launch();
const p = await b.newPage({ viewport:{width:1440,height:950} });
await p.goto('http://localhost:4333/', { waitUntil:'networkidle' });
await p.waitForTimeout(800);
await p.evaluate(()=>window.scrollTo(0, document.body.scrollHeight));
await p.waitForTimeout(2500);
await p.screenshot({ path:'/tmp/foot.png' });
await b.close(); console.log('ok');
