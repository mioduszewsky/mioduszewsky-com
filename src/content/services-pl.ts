/** Copy: SERVICE-LANDINGS.md, 9 September 2026. Owner-approved application hero is verbatim.
 * Consultation is parked, excluded from public routes until sales terms are settled. */
export type Service = {
  slug: string; name: string; label: string; title: string; accent: string;
  /** slug of the same service in the other language, for hreflang and the switch */
  altSlug?: string;
  lead: string; description: string; cta: string; price: string; consultation: boolean;
  sections: { title: string; paragraphs: string[] }[];
};
export const services: Service[] = [
  {
    "slug": "wdrozenie-ai",
    "altSlug": "ai-implementation",
    "name": "Automatyzacja procesów z AI",
    "label": "Automatyzacja procesów z AI",
    "title": "Zautomatyzuj powtarzalną pracę w swojej firmie.",
    "accent": "powtarzalną pracę",
    "lead": "Przepisujesz dane między narzędziami, przygotowujesz podobne odpowiedzi albo ręcznie składasz raporty? Ustalimy, które czynności może przejąć system. Zbuduję potrzebne automatyzacje i narzędzia AI, żeby Twój zespół miał mniej ręcznej pracy przy obsłudze tych spraw.",
    "cta": "Porozmawiajmy o Twojej firmie",
    "price": "od 4 500 zł",
    "consultation": false,
    "description": "Przepisujesz dane między narzędziami, przygotowujesz podobne odpowiedzi albo ręcznie składasz raporty? Ustalimy, które czynności może przejąć system. Zbuduję potrzebne automatyzacje i narzędzia AI, żeby Twój zespół miał mniej ręcznej pracy przy obsłudze tych spraw.",
    "sections": [
      {
        "title": "Co możesz oddać systemowi?",
        "paragraphs": [
          "Informacje z zapytania mogą trafiać do właściwego narzędzia. Odpowiedź może powstawać na podstawie ustalonych materiałów i czekać na Twoją akceptację. Dane do raportu mogą zbierać się z kilku źródeł. Wybieramy zastosowanie, które odpowiada na konkretną potrzebę Twojej firmy."
        ]
      },
      /* Teksty: cmo-oferta TEKSTY.md (końcowe 17.11.2026). */
      {
        "title": "Zaczynamy od jednej czynności",
        "paragraphs": [
          "Pokażesz mi, jak wykonujecie ją dzisiaj. Robię mapę procesu: liczę czas i sprawdzam narzędzia oraz połączenia. Potem ustalamy zakres, koszt wdrożenia i koszty jego działania. Przed rozpoczęciem pracy wiesz, co ma powstać i jak sprawdzimy wynik."
        ]
      },
      {
        "title": "Ustalamy też, gdzie potrzebna jest Twoja decyzja",
        "paragraphs": [
          "Wysyłka odpowiedzi, zmiana danych czy zatwierdzenie dokumentu mogą wymagać sprawdzenia przez człowieka. Określamy to przed budową, razem z zasadami dostępu do informacji i obsługi błędów."
        ]
      },
      {
        "title": "Uruchamiamy na prawdziwych sprawach",
        "paragraphs": [
          "Sprawdzamy system na sprawach z bieżącej pracy. Zespół dostaje krótką instrukcję, a my porównujemy czas przed i po. Przez 30 dni poprawiam to, co nie działa tak, jak ustaliliśmy. Potem możemy umówić opiekę miesięczną albo kolejny proces."
        ]
      },
      {
        "title": "Masz już stronę i swoje narzędzia?",
        "paragraphs": [
          "Możemy pracować nad samym procesem. Możliwość połączenia z obecnymi narzędziami sprawdzam przy ustalaniu zakresu.",
          "Automatyzacja pierwszego procesu od 4 500 zł. Finalna wycena zależy od uzgodnionej pracy."
        ]
      }
    ]
  },
  {
    "slug": "aplikacje-i-systemy",
    "altSlug": "apps-and-systems",
    "name": "Aplikacja lub system",
    "label": "Aplikacja lub system",
    "title": "Zbuduj własną aplikację. Bez szukania wspólnika technicznego.",
    "accent": "własną aplikację",
    "lead": "Masz pomysł na produkt dla klientów albo narzędzie dla swojej firmy? Ustalimy, co warto zbudować i ile to będzie kosztować. Zaprojektuję aplikację i ją uruchomię, żebyś mógł oddać ją użytkownikom i rozwijać swój biznes.",
    "cta": "Porozmawiajmy o Twoim pomyśle",
    "price": "od 11 000 zł",
    "consultation": false,
    "description": "Masz pomysł na produkt dla klientów albo narzędzie dla swojej firmy? Ustalimy, co warto zbudować i ile to będzie kosztować. Zaprojektuję aplikację i ją uruchomię, żebyś mógł oddać ją użytkownikom i rozwijać swój biznes.",
    "sections": [
      {
        "title": "Co ma być możliwe dzięki tej aplikacji?",
        "paragraphs": [
          "Przy własnym produkcie ustalimy, kto ma z niego korzystać i do czego go potrzebuje. Przy narzędziu dla firmy przyjrzymy się pracy, którą ma ułatwić. Od tego zależy zakres pierwszej wersji.",
          "Nie potrzebujesz gotowej specyfikacji. Opowiedz, co chcesz zrobić, jak wygląda to dzisiaj i czego brakuje w dostępnych rozwiązaniach."
        ]
      },
      {
        "title": "Wiesz, co powstanie, zanim zaczniemy budować",
        "paragraphs": [
          "Ustalimy funkcje potrzebne na start, sposób działania aplikacji i połączenia z innymi narzędziami. Dostaniesz wycenę uzgodnionego zakresu. Jeśli wcześniej warto sprawdzić pomysł prostszym sposobem, powiem Ci o tym.",
          "Projektuję ekrany, buduję aplikację i sprawdzam jej działanie przed uruchomieniem. Rozmawiasz ze mną przez cały projekt. Potrzebuję od Ciebie wiedzy o biznesie i decyzji; wybory techniczne wyjaśnię wraz z ich konsekwencjami."
        ]
      },
      {
        "title": "Pierwsza wersja, którą oddasz użytkownikom",
        "paragraphs": [
          "Po uruchomieniu możesz sprawdzić, jak ludzie korzystają z aplikacji i czego im brakuje. Kolejne funkcje ustalamy na tej podstawie. Dalszy rozwój i utrzymanie są częścią tej usługi, a warunki ustalamy osobno - zależą od tego, jak duża jest aplikacja i ile się w niej dzieje.",
          "Samo zbudowanie produktu nie potwierdza jeszcze, że znajdą się na niego klienci. Dlatego rozdzielamy to, co wiemy, od tego, co trzeba dopiero sprawdzić."
        ]
      },
      {
        "title": "Ile kosztuje aplikacja?",
        "paragraphs": [
          "Od 11 000 zł. Cena zależy od funkcji, integracji i uzgodnionego zakresu. Opisz pomysł, a ustalimy, czego potrzebuje pierwsza wersja i czy mieści się w Twoim budżecie."
        ]
      }
    ]
  },
  {
    /* Usługa 03 od 17.11.2026 (ciężar strony głównej przeszedł na automatyzację).
       Treść przeniesiona ze strony głównej (home-pl.ts: hero, offer, process, faq),
       bez nowych obietnic. Brak altSlug: wersja EN strony głównej nadal jest ofertą www. */
    "slug": "strona-internetowa",
    "name": "Strona internetowa",
    "label": "Kompletna strona internetowa",
    "title": "Dobra strona mówi za Ciebie.",
    "accent": "mówi",
    "lead": "Nie przychodzisz do mnie po sam design albo samo wdrożenie. Ustalamy, czego potrzebuje Twój biznes, a potem biorę na siebie treść, projekt, technologię i publikację.",
    "cta": "Porozmawiajmy o Twojej stronie",
    "price": "od 3 500 zł",
    "consultation": false,
    "description": "Kompletna strona internetowa od 3 500 zł. Treść, projekt, technologia i publikacja po jednej stronie, 30 dni poprawek po starcie.",
    "sections": [
      {
        "title": "Co dostajesz",
        "paragraphs": [
          "Treść i strukturę strony, projekt przygotowany pod Twój biznes, wersję mobilną, formularze i potrzebne integracje, podpięcie domeny i SSL, podstawowy pomiar od dnia publikacji oraz 30 dni poprawek po starcie."
        ]
      },
      {
        "title": "Jak pracujemy",
        "paragraphs": [
          "Nie musisz wiedzieć, ile ma być podstron ani na czym to ma być zbudowane. Od tego jest pierwsza rozmowa: mówisz, co robi Twoja firma, a ja mówię, co trzeba zbudować i ile to kosztuje. Od pierwszej rozmowy do publikacji rozmawiasz z tą samą osobą."
        ]
      },
      {
        "title": "30 dni poprawek",
        "paragraphs": [
          "Przez 30 dni po publikacji bez dodatkowej opłaty naprawiam rzeczy z uzgodnionego zakresu, które nie działają tak, jak ustaliliśmy. Nowe elementy i zmiany wyceniam osobno."
        ]
      },
      {
        "title": "Pytania o strony",
        "paragraphs": [
          "Czy AI może zbudować stronę za mnie? Może wygenerować tekst, layout i kod. Sam też korzystam z AI. Trudniejsza część to decyzje: co zostawić, co wyrzucić i czy całość pasuje do biznesu.",
          "Czy muszę mieć gotowe teksty? Nie. Mogę je stworzyć w ramach projektu, ale potrzebuję od Ciebie prawdziwych informacji o ofercie, klientach i biznesie. Nie wymyślam wyników ani opinii.",
          "Kompletna strona internetowa od 3 500 zł. Zakres i cena są znane przed startem."
        ]
      }
    ]
  },
  {
    "slug": "cofounder-as-a-service",
    "altSlug": "cofounder-as-a-service",
    "name": "Cofounder as a Service",
    "label": "Cofounder as a Service",
    "title": "Rozwijaj swój biznes z partnerem do decyzji i codziennej pracy.",
    "accent": "Rozwijaj swój biznes",
    "lead": "Cofounder to wspólnik. Dołączam do Twojego projektu w stałej współpracy. Wspólnie ustalamy kierunek biznesowy, organizujemy pracę i wybieramy potrzebną technologię. Biorę na siebie uzgodnioną część realizacji, a kolejne działania planujemy na podstawie tego, co dzieje się w firmie.",
    "cta": "Chcę wsparcia w rozwoju projektu",
    "price": "",
    "consultation": false,
    "description": "Cofounder to wspólnik w projekcie. Stała współpraca: kierunek biznesowy, organizacja pracy i technologia. Wspólnie ustalamy priorytety i dzielimy realizację. Kacper Mioduszewski.",
    "sections": [
      {
        "title": "Ustalamy, czym warto zająć się teraz",
        "paragraphs": [
          "Masz projekt do uruchomienia albo firmę, w której kolejne pomysły konkurują z codzienną pracą. Przyglądamy się temu, co chcesz osiągnąć, czego potrzebują klienci i jakie masz zasoby.",
          "Wybieramy najbliższy cel, dzielimy pracę i ustalamy, co na razie może poczekać. Wiesz, na czym skupiamy czas i po czym ocenimy postęp."
        ]
      },
      {
        "title": "Łączymy decyzje z wykonaniem",
        "paragraphs": [
          "Kierunek biznesowy: dopracowanie oferty, sprawdzenie założeń i wybór kolejnych działań.",
          "Organizacja pracy: priorytety, podział odpowiedzialności i sposób śledzenia postępu.",
          "Technologia: strona, aplikacja, automatyzacja lub narzędzie wewnętrzne, jeśli wynika to z potrzeb projektu.",
          "Przed startem ustalamy, które zadania biorę na siebie, nad czym pracujemy wspólnie i jakie decyzje zostają po Twojej stronie."
        ]
      },
      {
        "title": "Masz z kim przegadać kolejną decyzję",
        "paragraphs": [
          "Przy stałej współpracy znam projekt, wcześniejsze ustalenia i powody, dla których coś odłożyliśmy. Możesz wrócić z wątpliwością albo nowym pomysłem bez opowiadania wszystkiego od początku.",
          "Możemy też powiedzieć sobie wprost, że czegoś jeszcze nie wiemy. Ustalamy wtedy, co trzeba sprawdzić przed kolejnym wydatkiem lub zmianą kierunku. Gdy w projekcie pracują inne osoby, mają jasność, co ustaliliśmy i kto zajmuje się kolejnym krokiem."
        ]
      },
      {
        "title": "Znam tę pracę z różnych branż",
        "paragraphs": [
          "W startupie edukacyjnym Stanversity odpowiadałem za codzienne działanie firmy i współpracę marketingu, researchu oraz sprzedaży. Przy Revive i Insist zajmowałem się zespołami, finansami i uruchomieniem agencji muzycznej.",
          "Pracowałem też w rodzinnej firmie transportowej. Dzisiaj współprowadzę eskapizm i sam buduję narzędzia do jego działania.",
          "Przy własnej marce Hemp of Mind mieliśmy przygotowany produkt, branding i partnerów. Zatrzymałem projekt przed produkcją, po ponownym sprawdzeniu rynku. Dzisiaj wcześniej sprawdzam potrzebę i możliwość sprzedaży.",
          "To doświadczenia, z którymi wchodzę do współpracy. Twój projekt wymaga poznania jego własnych warunków."
        ]
      },
      {
        "title": "Zakres i rozliczenie dopasowujemy do projektu",
        "paragraphs": [
          "Zaczynamy od tego, co już działa, czego brakuje i jakiego zaangażowania potrzebujesz. Na tej podstawie ustalamy zakres, odpowiedzialność, sposób pracy i wynagrodzenie.",
          "Rozliczyć się możemy na kilka sposobów. Stała kwota za uzgodniony zakres, kwota niższa razem z udziałami w firmie albo inny podział, jeśli tak jest uczciwiej dla obu stron. Nie pracuję za same udziały.",
          "Cofounder as a Service to tutaj nazwa stałej współpracy przy projekcie. Szczegółowe warunki ustalamy indywidualnie przed rozpoczęciem pracy."
        ]
      }
    ]
  },
  {
    "slug": "konsultacja-biznesowa",
    "name": "Konsultacja biznesowa",
    "label": "Konsultacja biznesowa",
    "title": "Masz pomysł na biznes. Od czego zacząć?",
    "accent": "Od czego zacząć?",
    "lead": "Wiesz, co chcesz sprzedawać, ale nie wiesz jeszcze, jak sprawdzić zainteresowanie, czego potrzebujesz na start i na co warto wydać pieniądze. Przejdziemy przez Twój pomysł i ustalimy najbliższe działania.",
    "cta": "Porozmawiajmy o Twoim pomyśle",
    "price": "",
    "consultation": true,
    "description": "Wiesz, co chcesz sprzedawać, ale nie wiesz jeszcze, jak sprawdzić zainteresowanie, czego potrzebujesz na start i na co warto wydać pieniądze. Przejdziemy przez Twój pomysł i ustalimy najbliższe działania.",
    "sections": [
      {
        "title": "Przegadajmy decyzje, które masz przed sobą",
        "paragraphs": [
          "Czy najpierw potrzebujesz strony, produktu, rozmów z klientami czy znalezienia wykonawcy? Co możesz zrobić samodzielnie? Które wydatki mają uzasadnienie już teraz?",
          "Przyjrzymy się temu, komu chcesz sprzedawać, co ta osoba ma otrzymać i jak sprawdzić jej zainteresowanie. Uwzględnimy Twój czas, budżet oraz to, co masz już przygotowane."
        ]
      },
      {
        "title": "Znam tę pracę od strony operacyjnej",
        "paragraphs": [
          "W startupie edukacyjnym Stanversity odpowiadałem za codzienne działanie firmy i współpracę marketingu, researchu oraz sprzedaży. W projektach muzycznych zajmowałem się zespołami, finansami i uruchomieniem agencji. Dzisiaj współprowadzę eskapizm i sam buduję narzędzia do jego działania.",
          "Przy własnej marce Hemp of Mind mieliśmy już przygotowany produkt, branding i partnerów. Zatrzymałem projekt przed produkcją, po ponownym sprawdzeniu rynku. To doświadczenie zmieniło kolejność, w jakiej podchodzę do kolejnych pomysłów: wcześniej sprawdzam potrzebę i możliwość sprzedaży."
        ]
      },
      {
        "title": "Co zyskasz z tej rozmowy?",
        "paragraphs": [
          "Ustalimy, co możesz zrobić jako następne, co jeszcze wymaga sprawdzenia i które przygotowania mogą poczekać. Będziesz mieć podstawę do podjęcia kolejnej decyzji o swoim projekcie.",
          "Nie musisz później zlecać mi strony ani aplikacji. Możesz działać samodzielnie lub z wybranym wykonawcą. Jeśli temat wykracza poza moje doświadczenie, powiem to przed umówieniem konsultacji.",
          "Opisz pomysł i decyzję, którą chcesz przegadać. Potwierdzimy temat oraz warunki spotkania."
        ]
      }
    ]
  }
];
export const servicePath = (s: Service) => `/pl/uslugi/${s.slug}/`;
export const serviceContact = (s: Service) => s.consultation
  ? '/pl/konsultacja/kontakt/#ctForm'
  : `/pl/kontakt/?service=${encodeURIComponent(s.name)}#ctForm`;
