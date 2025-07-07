# Gonito Editor - Profesjonalny Menedżer Szablonów eBay

## 📋 O Projekcie

Gonito Editor to zaawansowane narzędzie stworzone z myślą o sprzedawcach eBay, którzy chcą wyróżnić swoje aukcje profesjonalnym wyglądem. Aplikacja umożliwia tworzenie, edycję i zarządzanie szablonami aukcji eBay z intuicyjnym interfejsem drag & drop oraz pełną integracją z API eBay.

Dzięki Gonito Editor możesz:
- Projektować piękne szablony aukcji bez znajomości HTML/CSS
- Zarządzać wszystkimi swoimi aukcjami eBay w jednym miejscu
- Masowo aktualizować opisy produktów, oszczędzając cenny czas
- Korzystać z gotowych bloków i szablonów dostosowanych do różnych kategorii produktów

## 🌟 Dlaczego warto używać Gonito Editor?

### Dla sprzedawców:
- **Oszczędność czasu** - masowa aktualizacja opisów aukcji jednym kliknięciem
- **Profesjonalny wygląd** - gotowe szablony dostosowane do różnych branż
- **Łatwość obsługi** - intuicyjny interfejs bez konieczności znajomości kodowania
- **Wyższe konwersje** - atrakcyjne opisy zwiększają sprzedaż

### Dla deweloperów:
- **Nowoczesny stos technologiczny** - React, TypeScript, Zustand, Tailwind CSS
- **Pełna integracja z eBay API** - OAuth 2.0, zarządzanie listingami, aktualizacje
- **Architektura modułowa** - łatwa rozbudowa i utrzymanie kodu
- **Responsywny design** - działa na wszystkich urządzeniach

## 🚀 Główne funkcje

### 📝 Edytor szablonów
- **Wizualny edytor drag & drop** - twórz szablony bez znajomości kodu
- **Podgląd na żywo** - zobacz zmiany w czasie rzeczywistym
- **Biblioteka gotowych bloków** - nagłówki, galerie, tabele specyfikacji i więcej
- **Pełne wsparcie dla HTML/CSS** - dla zaawansowanych użytkowników
- **Responsywne szablony** - idealne wyświetlanie na każdym urządzeniu

### 🔗 Integracja z eBay
- **Bezpieczna autoryzacja OAuth 2.0** - zgodna z najnowszymi standardami eBay
- **Zarządzanie listingami** - przeglądaj, filtruj i aktualizuj swoje aukcje
- **Masowa aktualizacja** - zastosuj szablon do wielu aukcji jednocześnie
- **Monitorowanie statusu** - śledź postęp aktualizacji w czasie rzeczywistym
- **Obsługa błędów** - szczegółowe raporty w przypadku problemów z aktualizacją

### 🎨 Personalizacja i wygoda
- **Ciemny/jasny motyw** - dostosuj interfejs do swoich preferencji
- **Wielojęzyczność** - wsparcie dla języka polskiego i angielskiego
- **Powiadomienia** - bądź na bieżąco z ważnymi informacjami
- **Zarządzanie użytkownikami** - kontroluj dostęp do aplikacji (dla administratorów)
- **Eksport/import szablonów** - łatwe przenoszenie między kontami

## 💻 Technologie

Gonito Editor został zbudowany przy użyciu nowoczesnych technologii:

- **Frontend**: React 18, TypeScript, Zustand (zarządzanie stanem)
- **Stylowanie**: Tailwind CSS, clsx (warunkowe style)
- **Routing**: React Router v6
- **Formularze**: React Hook Form
- **Ikony**: Lucide React
- **Narzędzia developerskie**: Vite, ESLint, TypeScript ESLint
- **Budowanie**: Vite build system

## 🔧 Instalacja i uruchomienie

### Wymagania
- Node.js (wersja 16+)
- npm lub yarn
- Konto deweloperskie eBay (dla integracji API)

### Kroki instalacji

1. **Klonowanie repozytorium**
   ```bash
   git clone https://github.com/karolwiszowaty462/gonitoeditortest.git
   cd gonitoeditortest
   ```

2. **Instalacja zależności**
   ```bash
   npm install
   ```

3. **Konfiguracja eBay API**
   - Skopiuj plik przykładowy: `cp .env.example .env`
   - Zarejestruj aplikację w [eBay Developers Program](https://developer.ebay.com/)
   - Uzupełnij dane w pliku `.env`:
     ```
     REACT_APP_EBAY_CLIENT_ID=twój_client_id
     REACT_APP_EBAY_CLIENT_SECRET=twój_client_secret
     REACT_APP_EBAY_REDIRECT_URI=http://localhost:5173/ebay/callback
     REACT_APP_EBAY_ENVIRONMENT=sandbox
     ```

4. **Uruchomienie aplikacji**
   ```bash
   npm run dev
   ```
   
   Aplikacja będzie dostępna pod adresem: `http://localhost:5173`

## 👨‍💻 Jak korzystać z aplikacji

### Pierwsze kroki

1. **Logowanie**
   - Użyj domyślnego konta: `admin@gonito.pl` / `gonito123`
   - Lub zarejestruj nowe konto

2. **Połączenie z eBay**
   - Przejdź do zakładki "eBay"
   - Kliknij "Połącz z eBay"
   - Przejdź przez proces autoryzacji OAuth

3. **Tworzenie pierwszego szablonu**
   - Przejdź do "Edytor"
   - Wybierz "Nowy szablon"
   - Przeciągaj bloki z biblioteki do obszaru edycji
   - Dostosuj treść i wygląd
   - Zapisz szablon nadając mu nazwę

4. **Zastosowanie szablonu do aukcji**
   - Przejdź do zakładki "eBay"
   - Wybierz aukcje do aktualizacji
   - Kliknij "Zastosuj szablon"
   - Wybierz szablon z listy
   - Potwierdź operację

### Zaawansowane funkcje

- **Tagi dynamiczne** - używaj tagów jak `[nazwa_produktu]`, `[cena]`, które zostaną automatycznie zastąpione danymi z aukcji
- **Własny CSS** - dodawaj niestandardowe style do szablonów
- **Duplikowanie szablonów** - twórz warianty istniejących szablonów
- **Filtrowanie aukcji** - szybko znajdź odpowiednie aukcje do aktualizacji

## 🔒 Bezpieczeństwo

- **OAuth 2.0** - bezpieczna autoryzacja bez przechowywania haseł eBay
- **Szyfrowane tokeny** - bezpieczne przechowywanie danych uwierzytelniających
- **Limity API** - inteligentne zarządzanie limitami zapytań eBay
- **Środowisko Sandbox** - testowanie bez ryzyka dla prawdziwych aukcji

### Środowiska eBay

#### Sandbox (testowe)
- Użyj środowiska `sandbox` do testów i rozwoju
- Utwórz testowe konto eBay w [Sandbox](https://developer.ebay.com/sandbox)
- Bezpieczne testowanie bez wpływu na prawdziwe aukcje

#### Produkcja
- Zmień `REACT_APP_EBAY_ENVIRONMENT=production` w pliku `.env`
- Zaktualizuj `REACT_APP_EBAY_REDIRECT_URI` na domenę produkcyjną
- Używaj z prawdziwym kontem eBay

## 🤝 Wsparcie i rozwiązywanie problemów

Jeśli napotkasz problemy z aplikacją:

1. **Problemy z autoryzacją eBay**
   - Sprawdź poprawność Client ID i Client Secret
   - Upewnij się, że URI przekierowania jest dokładnie taki sam jak w konfiguracji aplikacji eBay
   - Sprawdź, czy masz odpowiednie uprawnienia (scopes) w aplikacji eBay:
     - `https://api.ebay.com/oauth/api_scope`
     - `https://api.ebay.com/oauth/api_scope/sell.inventory`
     - `https://api.ebay.com/oauth/api_scope/sell.inventory.readonly`
     - `https://api.ebay.com/oauth/api_scope/sell.marketing`
     - `https://api.ebay.com/oauth/api_scope/sell.account.readonly`

2. **Problemy z aktualizacją aukcji**
   - Sprawdź logi błędów w konsoli
   - Upewnij się, że nie przekraczasz limitów API eBay
   - Sprawdź, czy token autoryzacyjny nie wygasł

3. **Problemy z edytorem**
   - Wyczyść pamięć podręczną przeglądarki
   - Sprawdź zgodność przeglądarki (zalecane najnowsze wersje Chrome, Firefox, Edge)

## 📦 Struktura projektu

```
src/
├── components/          # Komponenty React
│   ├── Layout/         # Layout aplikacji
│   ├── Templates/      # Komponenty szablonów
│   └── EbayIntegration/ # Komponenty eBay
├── pages/              # Strony aplikacji
├── services/           # Usługi API
│   └── ebayApi.ts     # Integracja eBay API
├── store/              # Zustand stores
│   ├── authStore.ts   # Autoryzacja
│   ├── templateStore.ts # Szablony
│   └── ebayStore.ts   # eBay integration
└── types/              # TypeScript types
```

## 📈 Plany rozwoju

- Integracja z innymi platformami sprzedażowymi (Allegro, Amazon)
- Zaawansowana analityka sprzedaży
- Automatyzacja aktualizacji na podstawie harmonogramu
- Mobilna aplikacja towarzysząca
- Rozszerzone opcje personalizacji szablonów

## 📄 Licencja

Gonito Editor jest udostępniany na licencji MIT. Szczegółowe informacje znajdziesz w pliku LICENSE.

---

Stworzono z ❤️ przez zespół Gonito dla społeczności sprzedawców eBay