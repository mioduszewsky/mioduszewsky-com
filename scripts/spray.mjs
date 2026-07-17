import { chromium } from 'playwright';
const b = await chromium.launch();
// DESKTOP (pointer fine)
const p = await b.newPage({ viewport:{width:1440,height:900}, hasTouch:false });
await p.goto('http://localhost:4351/', { waitUntil:'domcontentloaded' });
await p.waitForTimeout(6000);
// klikaj w tło (miejsca bez linkow) — lead section
for (const [x,y] of [[300,600],[500,650],[750,600],[950,680],[400,720],[850,700]]) {
  await p.mouse.click(x,y); await p.waitForTimeout(120);
}
await p.waitForTimeout(300);
const n = await p.evaluate(()=>document.querySelectorAll('.splat').length);
console.log('desktop splats:', n);
await p.screenshot({ path:'/tmp/spray-desktop.png' });
// MOBILE (touch, pointer coarse) — spray ma byc WYLACZONY
const m = await b.newPage({ viewport:{width:390,height:844}, hasTouch:true, isMobile:true });
await m.goto('http://localhost:4351/', { waitUntil:'domcontentloaded' });
await m.waitForTimeout(6000);
await m.touchscreen.tap(195, 500); await m.waitForTimeout(150);
await m.touchscreen.tap(195, 600); await m.waitForTimeout(150);
const nm = await m.evaluate(()=>document.querySelectorAll('.splat').length);
console.log('mobile splats (ma byc 0):', nm);
await b.close();
