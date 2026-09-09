# Service subpages QA — 2026-09-09

## Current delivery — consultation hidden, Cofounder added
Supersedes the handoff below. Three public secondary pages: AI, applications, Cofounder as a Service. Consultation data and `src/components/ConsultationContact.astro` retained but both public routes excluded from the build. No checkout.

- Build: 21 pages; public URL guard 2/2; landing tests 8/8 PASS.
- Render: 320/390/768/1280/1920, zero overflowing main elements and page errors on all three pages. Next section stays below first viewport. Reduced motion pauses logo. Cofounder CTA bottom 728px at 320px width, 645px at 390px width (844px viewport).
- Visual review of Cofounder mobile 390 and desktop 1280 screenshots: clear hierarchy, original W5 type/marker/buttons, aligned body copy, complete footer. No invented images, claims, rates or equity terms.
- Interaction script: all three keyboard CTA paths, focus, cursor, service context and UTM, failure/retry/success on mocked POSTs, local editor/export, no-JS content PASS. No real form submission.
- In-app Browser unavailable (runtime discovery returned no browsers). Used isolated Chromium with external requests blocked.
- Independent Ghost review supplied five JTBD hypotheses and source-backed copy. Main agent integrated and reviewed UI using frontend-design.
- Evidence: `/tmp/service-landings-review/`; reproduce with `service-landings-render.mjs`, `service-landings-interactions.mjs`, `service-homepage-review.mjs` while dev serves port 4330.

Production has not been changed. Current scope documented at the top of Drive `docs/SERVICE-LANDINGS.md`.

## Final handoff — owner explicitly paused publication, 2026-09-09
All code saved locally, uncommitted; no push/deploy. Resume from Drive `mioduszewsky-com/docs/SERVICE-LANDINGS.md` (opening handoff), not older iteration notes below.
- Homepage PL: one desktop row, consultation (200 zł netto + VAT), AI, application, Cofounder as a Service. Application development remains on its subpage, omitted from homepage.
- Cofounder covers business direction, operations and technology for a project; direct contact. Owner agreed no separate landing yet, pending offer definition.
- Next conversation: direct payment for consultation, scheduling and formal terms. No payment provider chosen or integration built. Duration/summary not agreed. Landing still says price confirmed before scheduling; reconcile with approved homepage price when designing checkout. Keep noindex until ready.
- Final build passed after card order/price changes; generated HTML checked for order, price and development copy placement. Four-column layout checked at 900/1280/1920 and overflow at 390. Latest Cofounder text-only change subsequently checked with git diff --check, not rebuilt.
- Brand markers now share exact homepage gradient (72% opacity); computed styles compared across all three landings.
- Design constraint for future edits: homepage secondary services stay compact, four across on desktop; foreground the complete website offer. Derive markers from existing W5 rule rather than duplicating colors/opacity.
Earlier notes below document previous iterations and must not override this handoff.

Result: three local subpages ready for owner review. Publication remains gated by consultation public price/terms and approval. Task: https://app.clickup.com/t/869ez8u9z

Preview: `npm run dev -- --host 127.0.0.1 --port 4330`.
- `/pl/uslugi/wdrozenie-ai/`
- `/pl/uslugi/aplikacje-i-systemy/`
- `/pl/uslugi/konsultacja-biznesowa/`
Append `?edit=1` for the dev-only text editor with JSON export. Edits affect preview only; export before closing. Editor absent from production HTML.

## UI correction after owner feedback
- Calmer heading scale (desktop maximum 80px), viewport-height hero with content-driven growth, generous section spacing.
- Body text remains at full contrast during scroll. Paragraph breaks, semantic lists, strong emphasis and brand yellow/blue make outcomes easier to scan without changing source words.
- Footer exposes the mailto contact. W5 pointer dot restored for fine pointers, grows over buttons; hides for keyboard and reduced motion. Hover growth and keyboard fallback tested on all three routes after entrance settles.
- Review: first screen separation, mobile wrapping, CTA contrast and focus, readable paragraph width, explicit contact. No unresolved UI defects found in tested sizes; owner visual acceptance pending. Conversion uplift has not been measured.

## Validation
- `npm run build`: PASS, 22 static routes. Public URL guard 2/2.
- `node --test scripts/service-landings.test.mjs`: PASS 8/8: H1/canonical/local links, paid/free separation, contextual payload and UTM, validation, error handling, complete rendered copy and three-page route set.
- `node scripts/service-landings-render.mjs`: all three at widths 320/390/768/1280/1920, zero out-of-bounds main elements and no page errors. Height 844 on phones, 900 on larger screens. Hero CTA bottom max 698px at 320 and 645px at 390. First following section starts at or below the viewport bottom in all 15 renders (asserted). This does not claim all content fits very short 568px screens. Reduced-motion pauses logo video.
- `node scripts/service-landings-interactions.mjs`: three real keyboard CTA navigations, focus-visible, preserved UTM across navigation, failed submission and successful retry, consultation without free calendar, copy editor/export, no-JS content visible. All outgoing calls blocked or mocked; no real lead sent.
- Desktop/mobile screenshots reviewed manually, including the area under the cookie banner after dismissal. Mobile headings and copy are left-aligned. Long source lead deliberately retained intact; narrow CTA wraps without clipping.
- Contrast: body 8.62:1, dim 4.53:1, button default 19.82:1 / hover 7.40:1, focus 7.40:1 against ivory.
- Tastemaker scanners do not parse `.astro` (reported 0 files), so no scanner PASS claimed. Manual brief-scoped audit recorded in `.tastemaker/style-lock.md`. Text-first layout and literal W5 motion override generic style recommendations.
- Ghost criteria: supplied text retained verbatim in rendered HTML; biography verified against Historia.md, confirmed Hemp of Mind story, and client status. No 60-minute duration, summary promise or assumed VAT. AI 4,500/application 11,000 from oferta.md.

## Scope and remaining gates
Main W5 changes limited to secondary direct links and development as continuation. Existing English offer unchanged. Latest main `5d69691` entity-graph layout copied into this older branch so preview does not regress the SEO update. Before any commit/merge, reconcile with main normally; no history rewritten.

Consultation visibly paid; price and date confirmed after enquiry. No checkout or booking. It and its form are `noindex, follow` and excluded from sitemap until terms/public price are approved. AI/application included with unique canonicals. No hub or development landing generated. Rejected hub preserved as `src/pages/pl/uslugi/index.astro.rejected` and pre-change snapshot in `/tmp/mioduszewsky-landings-before-20260909.tar.gz`.

Screenshots/metrics/interactions: `/tmp/service-landings-review/` (regenerable via scripts). Review screenshot generation uses isolated Chromium because Browser runtime exposed no available browsers.

No commit, push, deploy or changes to campaigns. Main worktree remains clean. ClickUp stays in progress pending owner acceptance/terms; not falsely closed.
