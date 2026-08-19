import { chromium } from 'playwright';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const root = resolve(import.meta.dirname, '..');
const nohemi = pathToFileURL(resolve(root, 'public/fonts/Nohemi-Variable.woff2')).href;
const generalSans = pathToFileURL(resolve(root, 'public/fonts/GeneralSans-Variable.woff2')).href;

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 2 });
await page.setContent(`<!doctype html>
<html lang="pl"><head><meta charset="utf-8"><style>
  @font-face{font-family:Nohemi;src:url('${nohemi}') format('woff2');font-weight:100 900}
  @font-face{font-family:General;src:url('${generalSans}') format('woff2');font-weight:200 700}
  *{box-sizing:border-box}html,body{margin:0;width:1200px;height:630px;overflow:hidden;background:#f8f9f2;color:#000}
  body{position:relative;padding:62px 68px;font-family:General,sans-serif}
  body:before{content:"";position:absolute;inset:0;background:radial-gradient(circle at 84% 18%,rgba(5,34,255,.11),transparent 31%),radial-gradient(circle at 10% 92%,rgba(255,204,51,.18),transparent 34%)}
  .top{position:relative;display:flex;align-items:center;justify-content:space-between}
  .wordmark{font-family:Nohemi,sans-serif;font-size:34px;font-weight:610;letter-spacing:-.045em}
  .eyebrow{font-size:17px;letter-spacing:.22em;text-transform:uppercase;color:#716d61}
  h1{position:relative;margin:105px 0 0;font-family:Nohemi,sans-serif;font-size:82px;line-height:.93;letter-spacing:-.045em;font-weight:540;max-width:1020px}
  .highlight{position:relative;display:inline-block;z-index:1}
  .highlight:before{content:"";position:absolute;z-index:-1;left:-.04em;right:-.04em;bottom:.06em;height:.48em;background:#ffcc33;transform:rotate(-1.2deg)}
  .bottom{position:absolute;left:68px;right:68px;bottom:54px;display:flex;justify-content:space-between;align-items:end;border-top:2px solid #000;padding-top:18px;font-size:18px}
  .services{font-weight:560}.place{color:#716d61}
  .dot{position:absolute;width:32px;height:32px;border-radius:50%;background:#0522ff;right:73px;top:210px;box-shadow:18px -13px 0 -11px #0522ff,-17px 13px 0 -12px #0522ff}
</style></head><body>
  <div class="top"><div class="wordmark">mioduszewsky</div><div class="eyebrow">Strony · AI · aplikacje</div></div>
  <h1>Strona, za którą<br><span class="highlight">nie musisz</span> się tłumaczyć.</h1>
  <span class="dot"></span>
  <div class="bottom"><span class="services">Plan · treść · design · wdrożenie</span><span class="place">Wrocław / zdalnie</span></div>
</body></html>`);
await page.evaluate(() => document.fonts.ready);
await page.waitForTimeout(250);
await page.screenshot({ path: resolve(root, 'public/og-pl.png') });
await browser.close();
console.log('public/og-pl.png written');
