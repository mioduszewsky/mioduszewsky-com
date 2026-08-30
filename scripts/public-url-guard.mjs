import { readFile } from 'node:fs/promises';

const PRODUCTION_ORIGIN = 'https://mioduszewsky.com';
const blockedHostPatterns = [
  /^localhost$/i,
  /\.localhost$/i,
  /^127(?:\.\d{1,3}){3}$/,
  /^0\.0\.0\.0$/,
  /^\[?::1\]?$/,
  /\.(?:local|test|invalid|example)$/i,
];

export function assertPublicUrl(value, label = value) {
  let url;
  try {
    url = new URL(value, PRODUCTION_ORIGIN);
  } catch {
    throw new Error(`${label}: invalid URL`);
  }

  if (url.protocol !== 'https:') {
    throw new Error(`${label}: public URL must use HTTPS, got ${url.protocol}`);
  }

  if (blockedHostPatterns.some((pattern) => pattern.test(url.hostname))) {
    throw new Error(`${label}: blocked non-public host ${url.hostname}`);
  }

  return url;
}

export async function validateRedirects(configPath = new URL('../vercel.json', import.meta.url)) {
  const config = JSON.parse(await readFile(configPath, 'utf8'));
  for (const [index, redirect] of (config.redirects ?? []).entries()) {
    assertPublicUrl(redirect.destination, `vercel.json redirect #${index + 1}`);
  }
  return config.redirects?.length ?? 0;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const redirectCount = await validateRedirects();
  for (const [index, value] of process.argv.slice(2).entries()) {
    assertPublicUrl(value, `argument #${index + 1}`);
  }
  console.log(`Public URL guard: PASS (${redirectCount} redirects, ${process.argv.length - 2} supplied URLs)`);
}
