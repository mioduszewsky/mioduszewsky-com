import { chromium } from 'playwright';
const b = await chromium.launch();
const p = await b.newPage({ viewport:{width:1440,height:900} });
await p.goto('http://localhost:4343/', { waitUntil:'domcontentloaded' });
await p.waitForTimeout(5000); // przeczekaj intro
const H = await p.evaluate(()=>document.body.scrollHeight);
for (let s=H-2400; s<=H; s+=300){ await p.evaluate((y)=>window.scrollTo(0,y), s); await p.waitForTimeout(100); }
await p.evaluate((h)=>window.scrollTo(0, h), H);
await p.waitForTimeout(1500);
const navClass = await p.evaluate(()=>document.querySelector('.nav')?.className);
const footBottom = await p.evaluate(()=>Math.round(document.querySelector('.foot').getBoundingClientRect().bottom));
console.log('nav class:', navClass, '| foot.bottom:', footBottom, '| innerH*0.55:', Math.round(900*0.55));
await p.screenshot({ path:'/tmp/fin2.png' });
await b.close();
