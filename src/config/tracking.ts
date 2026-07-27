// Tracking IDs — puste = wyłączone. Nie ładujemy żadnego skryptu ani nie pokazujemy
// bannera zgody dopóki chociaż jedno z poniższych nie jest wypełnione. Wypełnić po
// utworzeniu zasobów: PostHog nowy projekt (mioduszewsky, osobny od projektu eskapizm),
// GA4 property (Measurement ID), Google Ads conversion action "Lead" (Conversion ID +
// Label). Spec i procedura zgody: projekty/mioduszewsky (AUTOFIRMA)/systemy/ads/docs/TRACKING-GATE.md.
export const POSTHOG_KEY = 'phc_nf8ejaUCGGeuQE4Vav2QWv64eqPwnN5wnkL2vfpKBJb7';
export const POSTHOG_HOST = 'https://eu.i.posthog.com';

export const GA4_ID = ''; // np. G-XXXXXXXXXX

export const GOOGLE_ADS_ID = ''; // np. AW-XXXXXXXXX
export const GOOGLE_ADS_LABEL = ''; // conversion label dla eventu "Lead"

// Google Ads jest kompletne dopiero jako para ID + label. Dzięki temu przypadkowe
// wpisanie samego ID nie pokaże bannera ani nie załaduje tagu bez działającego celu.
export const GOOGLE_ADS_LEAD_CONFIGURED = Boolean(GOOGLE_ADS_ID && GOOGLE_ADS_LABEL);
export const TRACKING_ENABLED = Boolean(POSTHOG_KEY || GA4_ID || GOOGLE_ADS_LEAD_CONFIGURED);
