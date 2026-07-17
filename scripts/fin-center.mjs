import { chromium } from 'playwright';
const b = await chromium.launch();
const p = await b.newPage({ viewport:{width:1440,height:900} });
await p.goto('http://localhost:4347/', { waitUntil:'domcontentloaded' });
await p.waitForTimeout(5500);
const H = await p.evaluate(()=>document.body.scrollHeight);
for (let s=H-2400; s<=H; s+=300){ await p.evaluate((y)=>window.scrollTo(0,y), s); await p.waitForTimeout(80); }
await p.evaluate((h)=>window.scrollTo(0, h), H); await p.waitForTimeout(1500);
const m = await p.evaluate(()=>{
  const d=document.querySelector('.finale-dal').getBoundingClientRect();
  const t=document.querySelector('.finale-top').getBoundingClientRect();
  const c=document.querySelector('.finale-cta-wrap').getBoundingClientRect();
  return { dalCenterY: Math.round(d.top+d.height/2), viewportCenter: Math.round(innerHeight/2), dalBottom: Math.round(d.bottom), ctaTop: Math.round(c.top), topY: Math.round(t.top) };
});
console.log(JSON.stringify(m,null,0));
await p.screenshot({ path:'/tmp/fin-center.png' });
await b.close();
