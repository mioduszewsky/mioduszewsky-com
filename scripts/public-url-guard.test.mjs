import assert from 'node:assert/strict';
import test from 'node:test';
import { assertPublicUrl } from './public-url-guard.mjs';

test('accepts production HTTPS URLs and relative production redirects', () => {
  assert.equal(assertPublicUrl('https://mioduszewsky.com/pl/?utm_source=linkedin').hostname, 'mioduszewsky.com');
  assert.equal(assertPublicUrl('/pl/?utm_source=instagram').hostname, 'mioduszewsky.com');
});

test('rejects localhost, loopback, test domains and HTTP', () => {
  for (const value of [
    'http://localhost:4321',
    'https://127.0.0.1/path',
    'https://preview.test/path',
    'http://mioduszewsky.com/pl/',
  ]) {
    assert.throws(() => assertPublicUrl(value), /blocked non-public host|must use HTTPS/);
  }
});
