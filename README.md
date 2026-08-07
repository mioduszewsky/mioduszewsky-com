# mioduszewsky.com

Source of my own site. Astro, Tailwind, and a small AWS backend for the contact form.

Live at [mioduszewsky.com](https://mioduszewsky.com).

---

## Why this stack

The site is content and motion, not application state. That makes Astro the obvious pick: pages ship as static HTML, so search engines and AI crawlers get real markup instead of an empty div, and the JavaScript that does exist is there because a specific interaction needs it.

Animation is GSAP free tier with Lenis for smooth scroll and Motion for component-level work. I evaluated the paid GSAP plugins and turned them down, the effects on this site do not justify the licence.

Fonts are self-hosted. The display face is a custom one with full Polish diacritics, which ruled out several otherwise good options.

---

## Structure

```
src/           pages, components, styles
assets/        images, video, 3D logo renders and the Blender scripts behind them
backend/       AWS Lambda handler for the contact form
scripts/       one-off browser automation used while building, see below
public/        static files served as-is
```

---

## The contact form backend

`backend/contact-form/` is the part of this repository worth reading if you only read one thing.

`index.mjs` is a Lambda handler: validation, a honeypot field, HTML escaping, an origin allowlist for CORS, and SES for delivery. No secrets, the two addresses and the allowed origins come in as environment variables.

`deploy.sh` provisions the whole thing and is idempotent, so re-running it updates rather than duplicates. It sets up:

- an IAM role scoped to `ses:SendEmail` on a single verified identity, no wildcards
- the Lambda itself, and a log group created explicitly so retention applies from the first invocation rather than the first request
- an API Gateway HTTP API with throttling and structured access logs
- two CloudWatch alarms, on Lambda errors and API 5xx

There is a comment in there explaining why the public endpoint is API Gateway rather than a Lambda Function URL: `auth=NONE` returned a persistent 403 on this account despite a correct resource policy, and the account is not in an organisation, so it was not an SCP. API Gateway invokes the function with its own permission and sidesteps the problem entirely. I left the note in because the next person to hit that will lose an hour to it.

---

## About `scripts/`

Forty-odd single-purpose Playwright scripts, written while building the site to check what a change actually looked like in a browser: take a screenshot at a given viewport, scroll to a section, measure an element, compare two variants.

They are throwaway by design and the names show it. None of them are wired into `package.json`, nothing in the build depends on them, and they are kept rather than deleted because a few still get reused when a section changes.

If you are looking for representative code, read `backend/contact-form/` or `src/`, not this folder.

---

## Running it

```sh
npm install
npm run dev      # localhost:4321
npm run build
npm run preview
```

Deploying the contact form backend needs AWS credentials with permission to create the resources listed above, and a verified SES domain identity:

```sh
bash backend/contact-form/deploy.sh
```

---

Built by [Kacper Mioduszewski](https://mioduszewsky.com). Architecture write-ups for my larger systems: [eskapizm-architecture](https://github.com/mioduszewsky/eskapizm-architecture), [finch-architecture](https://github.com/mioduszewsky/finch-architecture).
