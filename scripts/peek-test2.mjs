import { chromium } from 'playwright';
const b = await chromium.launch();
const p = await b.newPage({ viewport:{width:1440,height:900} });
await p.goto('http://localhost:4336/', { waitUntil:'networkidle' });
await p.waitForTimeout(1000);
const op = () => p.evaluate(()=>{const el=document.querySelector('.row-peek'); return el?+getComputedStyle(el).opacity:-1;});
// scroll jak user (wheel), potem hover przez playwright (sam pozycjonuje)
await p.mouse.wheel(0, 3000);
await p.waitForTimeout(800);
const row = p.locator('.mrow[data-thumb]').first();
await row.hover();
await p.waitForTimeout(500);
console.log('hover po wcześniejszym scrollu -> opacity:', await op(), '(ma byc ~1)');
await p.mouse.wheel(0, 400);
await p.waitForTimeout(600);
console.log('scroll bez ruchu myszy        -> opacity:', await op(), '(ma byc 0)');
await row.hover(); await p.waitForTimeout(500);
console.log('ponowny hover                 -> opacity:', await op(), '(ma byc ~1)');
await b.close();
