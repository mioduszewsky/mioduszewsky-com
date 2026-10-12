// Źródło zgłoszenia (UTM) dla Mail Processora.
// Kontrakt: AUTOFIRMA systemy/mail/docs/KONTRAKT-LEAD-Z-REKLAMY.md
// Strona dopisuje do wiadomości linię "[utm] k=v ...". Wycinamy ją z treści klienta
// i oddajemy jako pierwszą linię maila "Źródło: ...", bo Mail Processor widzi tylko
// początek treści (Gmail snippet, ok. 200 znaków).

const ORDER = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'];
const SAFE = /^[A-Za-z0-9_.\-]{1,80}$/;

export function splitLeadSource(message) {
  const text = String(message || '');
  const found = {};
  const rest = text.replace(/^[ \t]*\[utm\][ \t]*([^\n]*)$/gim, (_line, pairs) => {
    for (const token of pairs.trim().split(/\s+/)) {
      const [key, value] = token.split('=');
      if (ORDER.includes(key) && SAFE.test(value || '') && !(key in found)) found[key] = value;
    }
    return '';
  }).replace(/\n{3,}/g, '\n\n').trim();
  const pairs = ORDER.filter((key) => found[key]).map((key) => `${key}=${found[key]}`);
  return { message: rest, sourceLine: pairs.length ? `Źródło: ${pairs.join(' ')}` : '' };
}
