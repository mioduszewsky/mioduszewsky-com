import { chromium } from 'playwright';
const b = await chromium.launch();
const p = await b.newPage({ viewport:{width:1440,height:900} });
await p.goto('http://localhost:4345/', { waitUntil:'domcontentloaded' });
await p.waitForTimeout(5500); // przeczekaj intro
await p.evaluate(()=>{ const f=document.querySelector('.foot'); window.scrollTo(0, f.offsetTop); });
await p.waitForTimeout(1300);
await p.screenshot({ path:'/tmp/foot-final.png' });
await b.close(); console.log('ok');
