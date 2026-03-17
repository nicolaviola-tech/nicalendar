# Nicalendar

Calendario React riutilizzabile, estratto come libreria standalone.

Repository con 3 parti:
- `calendar`: libreria pubblicabile (`@nicola9779/nicalendar-custom`)
- `playground`: app demo per sviluppo e test visivo
- `release-consumer`: app minimale per smoke test da consumer esterno

## Cosa fa la libreria

`@nicola9779/nicalendar-custom` include:
- viste `month`, `week`, `day`, `agenda`
- layout default in card unica (filtri + toolbar mese + legenda + griglia)
- pipeline filtri completa (testo, select, multi-select, chips, toggle)
- eventi completamente guidati da `props` (nessun fetch interno)
- styling self-contained tramite `@nicola9779/nicalendar-custom/styles.css`
- personalizzazione avanzata via `classNames`, `renderers`, `theme`, `filters`, `legendItems`

## Struttura repo

```text
.
├─ calendar/
│  ├─ src/
│  │  ├─ Calendar.tsx
│  │  ├─ types.ts
│  │  ├─ styles.css
│  │  └─ utils/
│  ├─ index.ts
│  ├─ package.json
│  └─ README.md
├─ playground/
└─ release-consumer/
```

## Quick Start locale

### 1) Build libreria

```bash
cd calendar
npm install
npm run build
```

### 2) Avvia playground

```bash
cd ../playground
npm install
npm run dev
```

Il playground usa dipendenza locale:

```json
"@nicola9779/nicalendar-custom": "file:../calendar"
```

quindi riflette subito le modifiche della libreria.

## Come usare la libreria in un progetto React

```bash
npm i @nicola9779/nicalendar-custom
```

```tsx
import { Calendar, type CalendarEvent } from "@nicola9779/nicalendar-custom";
import "@nicola9779/nicalendar-custom/styles.css";

const events: CalendarEvent[] = [
  {
    id: "1",
    title: "Kickoff",
    date: new Date(),
    start: "09:00",
    end: "10:00",
    client: "ACME",
    assignee: "Nico",
    status: "pending",
    priority: "high",
    type: "manual",
  },
];

export default function App() {
  return <Calendar events={events} initialView="month" currentUser="Nico" />;
}
```

## Come funziona (architettura)

- Input principale: `events` (`CalendarEvent[]`)
- Stato interno UI: vista attiva, data corrente, filtri correnti
- Pipeline rendering:
  1. normalizzazione date/eventi
  2. applicazione filtri built-in + custom
  3. raggruppamento eventi per vista (`month/week/day/agenda`)
  4. rendering celle + event chips
- Personalizzazione:
  - `filters` per definire nomi/input/logica dei filtri
  - `renderers` per sostituire controlli (button/input/select/switch/chip)
  - `classNames` per mapping stile a slot
  - `theme` per token visuali

## Personalizzazione consigliata

Per look identico al tuo progetto:
- usa i tuoi componenti UI via `renderers`
- usa le tue classi Tailwind via `classNames`
- importa font del progetto host (es. Manrope)

Per setup completo e API dettagliata, vedi:
- [calendar/README.md](./calendar/README.md)

## Sviluppo e qualità

### Libreria

```bash
cd calendar
npm run typecheck
npm run build
```

### Playground

```bash
cd playground
npm run lint
npm run build
npm run dev
```

### Smoke test consumer

```bash
cd release-consumer
npm run build
```

## Publish

### NPM

```bash
cd calendar
npm login
npm publish --access public
```

### GitHub

```bash
git tag -a v0.1.0 -m "Initial release"
git push origin main
git push origin v0.1.0
```

Poi crea una GitHub Release dal tag `v0.1.0`.
