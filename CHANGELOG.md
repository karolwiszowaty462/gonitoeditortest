# Gonito Editor - Historia Zmian

## Beta 0.2 (31.07.2025)

### 🔧 Naprawione błędy
- **Naprawiono błędy w szablonach**: Skorygowano niezgodności tagów w pierwszych 3 szablonach
  - Klasyczny eBay: `[nazwa_aukcji]` → `[nazwa]`, dodano brakujące tagi do baselinkerTags
  - Nowoczesny Gradient: `[nazwa_aukcji]` → `[nazwa]`, zastąpiono `[cechy_lista]` konkretną treścią
  - Minimalistyczny: `[nazwa_aukcji]` → `[nazwa]`, zastąpiono `[cechy_lista]` konkretną treścią

- **Naprawiono parser HTML**: Poprawiono rozpoznawanie bloków w edytorze
  - Dodano rozpoznawanie klas CSS z naszych szablonów (`title`, `price`, `image-section`)
  - Poprawiono parsowanie elementów z `data-editable="true"`
  - Elementy są teraz poprawnie rozpoznawane jako osobne bloki

- **NAPRAWIONO DUPLIKOWANIE BLOKÓW**: Całkowicie rozwiązano problem kopiowania bloków
  - Usunięto problematyczny useEffect, który powodował re-parsowanie HTML
  - Funkcja `parseHtmlIntoBlocks` nie modyfikuje już oryginalnego DOM
  - Funkcje `moveBlock` i `removeBlock`: Dodano aktualizację pozycji po zmianie
  - Pozycje bloków są teraz zawsze spójne i nie duplikują się

### ✨ Nowe funkcje
- **Dodano 2 nowe szablony podstawowe**:
  - **Podstawowy Starter** (template-7): Prosty szablon do szybkiej edycji
  - **Uniwersalny Baselinker** (template-8): Zawiera wszystkie popularne tagi Baselinker

- **Ulepszona synchronizacja szablonów**: 
  - Automatyczne ładowanie nowych szablonów bez czyszczenia cache
  - Funkcja `resetTemplates` do wymuszenia pełnego odświeżenia
  - Lepsze zarządzanie defaultTemplates

### 🎯 Ulepszenia
- **Zwiększona liczba szablonów**: Z 6 do 8 szablonów
- **Poprawiona stabilność edytora**: Bloki nie duplikują się podczas przenoszenia
- **Lepsze tagowanie Baselinker**: Spójne używanie tagów we wszystkich szablonach
- **Responsywne szablony**: Wszystkie nowe szablony są responsywne

### 📋 Stan aplikacji
- ✅ 8 działających szablonów eBay
- ✅ Edytor z poprawnym parsowaniem bloków  
- ✅ Funkcjonalne zarządzanie kolejnością bloków
- ✅ Automatyczne odświeżanie zmian (HMR)
- ✅ Spójne tagi Baselinker we wszystkich szablonach

### 🔍 Szczegóły techniczne
- Naprawiono funkcję `parseHtmlIntoBlocks` w Editor.tsx
- Dodano rozpoznawanie klas: `title`, `price`, `image-section`, `description-section`
- Poprawiono funkcje `moveBlock` i `removeBlock` - aktualizacja pozycji bloków
- Rozszerzono `initializeTemplates` o automatyczne dodawanie nowych szablonów
- Dodano funkcję `resetTemplates` do wymuszenia pełnego odświeżenia

---

## Planowane w następnych wersjach

### Beta 0.3 (planowane)
- Eksport szablonów do HTML/CSS
- Import własnych szablonów
- Zaawansowane opcje stylowania

### Beta 0.4 (planowane)  
- Integracja z eBay API
- Podgląd na różnych urządzeniach
- Biblioteka komponentów

---

**Deweloper**: Cascade AI Assistant  
**Data**: 31 lipca 2025  
**Wersja**: Beta 0.2
