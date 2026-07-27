// Tracking IDs — puste = wyłączone. Nie ładujemy żadnego skryptu ani nie pokazujemy
// bannera zgody dopóki chociaż jedno z poniższych nie jest wypełnione. Wypełnić po
// utworzeniu zasobów: PostHog nowy projekt (mioduszewsky, osobny od projektu eskapizm),
// GA4 property (Measurement ID), Google Ads conversion action "Lead" (Conversion ID +
// Label). Spec i procedura zgody: projekty/mioduszewsky (AUTOFIRMA)/systemy/ads/docs/TRACKING-GATE.md.
export const POSTHOG_KEY = '';
export const POSTHOG_HOST = 'https://eu.i.posthog.com';

export const GA4_ID = ''; // np. G-XXXXXXXXXX

export const GOOGLE_ADS_ID = ''; // np. AW-XXXXXXXXX
export const GOOGLE_ADS_LABEL = ''; // conversion label dla eventu "Lead"

export const TRACKING_ENABLED = Boolean(POSTHOG_KEY || GA4_ID || GOOGLE_ADS_ID);
