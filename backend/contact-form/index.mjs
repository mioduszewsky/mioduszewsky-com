// mioduszewsky.com — handler formularza kontaktowego.
// AWS Lambda (Node.js 20, region eu-central-1) za Lambda Function URL.
// Odbiera POST JSON { name, email, message, consent, hp } z /contact,
// waliduje, wysyła powiadomienie przez SES na kacper@mioduszewsky.com.
// Nadawca i odbiorca są na zweryfikowanej domenie mioduszewsky.com,
// więc działa nawet w sandboxie SES (nie trzeba production access).
//
// Zmienne środowiskowe (ustawiane przy deployu, NIE sekrety):
//   TO_ADDR   = kacper@mioduszewsky.com
//   FROM_ADDR = formularz@mioduszewsky.com
//   ALLOWED_ORIGINS = "https://mioduszewsky.com,https://www.mioduszewsky.com,https://mioduszewsky-com.vercel.app,http://localhost:4321"

import { SESv2Client, SendEmailCommand } from '@aws-sdk/client-sesv2';

const ses = new SESv2Client({ region: process.env.AWS_REGION || 'eu-central-1' });

const TO_ADDR = process.env.TO_ADDR || 'kacper@mioduszewsky.com';
const FROM_ADDR = process.env.FROM_ADDR || 'formularz@mioduszewsky.com';
const ALLOWED = (process.env.ALLOWED_ORIGINS ||
  'https://mioduszewsky.com,https://www.mioduszewsky.com,https://mioduszewsky-com.vercel.app,http://localhost:4321'
).split(',').map((s) => s.trim());

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const clip = (s, n) => String(s || '').slice(0, n);
const esc = (s) => String(s || '').replace(/[<>&]/g, (c) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;' }[c]));

function cors(origin) {
  const allow = ALLOWED.includes(origin) ? origin : ALLOWED[0];
  return {
    'Access-Control-Allow-Origin': allow,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400',
    'Content-Type': 'application/json',
  };
}

const reply = (status, body, origin) => ({ statusCode: status, headers: cors(origin), body: JSON.stringify(body) });

export const handler = async (event) => {
  const origin = event?.headers?.origin || event?.headers?.Origin || '';
  const method = event?.requestContext?.http?.method || event?.httpMethod || 'POST';

  if (method === 'OPTIONS') return reply(204, {}, origin);
  if (method !== 'POST') return reply(405, { error: 'method_not_allowed' }, origin);

  let data;
  try {
    data = JSON.parse(event.body || '{}');
  } catch {
    return reply(400, { error: 'bad_json' }, origin);
  }

  // Honeypot — boty wypełniają ukryte pole "hp", ludzie nie.
  if (data.hp) return reply(200, { ok: true }, origin);

  const name = clip(data.name, 120).trim();
  const email = clip(data.email, 200).trim();
  const message = clip(data.message, 4000).trim();
  const consent = data.consent === true || data.consent === 'true' || data.consent === 'on';

  if (!name || !email || !message) return reply(400, { error: 'missing_fields' }, origin);
  if (!EMAIL_RE.test(email)) return reply(400, { error: 'bad_email' }, origin);
  if (!consent) return reply(400, { error: 'no_consent' }, origin);

  const subject = `Nowy kontakt ze strony — ${name}`;
  const text =
    `Imię:  ${name}\n` +
    `Mail:  ${email}\n` +
    `Zgoda RODO: tak\n\n` +
    `Wiadomość:\n${message}\n`;
  const html =
    `<div style="font-family:system-ui,sans-serif;font-size:15px;line-height:1.6;color:#111">` +
    `<p><strong>Imię:</strong> ${esc(name)}<br>` +
    `<strong>Mail:</strong> <a href="mailto:${esc(email)}">${esc(email)}</a><br>` +
    `<strong>Zgoda RODO:</strong> tak</p>` +
    `<p><strong>Wiadomość:</strong></p>` +
    `<p style="white-space:pre-wrap;border-left:3px solid #0522ff;padding-left:12px">${esc(message)}</p>` +
    `</div>`;

  try {
    await ses.send(new SendEmailCommand({
      FromEmailAddress: `Formularz mioduszewsky <${FROM_ADDR}>`,
      Destination: { ToAddresses: [TO_ADDR] },
      ReplyToAddresses: [email],
      Content: { Simple: {
        Subject: { Data: subject, Charset: 'UTF-8' },
        Body: {
          Text: { Data: text, Charset: 'UTF-8' },
          Html: { Data: html, Charset: 'UTF-8' },
        },
      } },
    }));
    return reply(200, { ok: true }, origin);
  } catch (err) {
    // Nie logujemy treści wiadomości ani maila (PII). Tylko typ błędu.
    console.error('SES send failed:', err?.name || 'unknown');
    return reply(502, { error: 'send_failed' }, origin);
  }
};
