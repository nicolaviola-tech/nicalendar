# Playground - @nicalendar/custom

App demo per sviluppare e validare visivamente il calendario.

## Scopo

- provare rapidamente nuove modifiche della libreria
- testare stile, filtri, renderers e classNames
- verificare che il componente resti integrabile in un'app reale

## Avvio

```bash
npm install
npm run dev
```

Build produzione locale:

```bash
npm run build
```

## Collegamento libreria

Questo playground usa la libreria locale:

```json
"@nicalendar/custom": "file:../calendar"
```

Così ogni modifica in `../calendar` è immediatamente testabile qui.

## File principale demo

- `src/App.tsx`: configurazione completa con:
  - filtri custom
  - renderers custom (bottoni/input/select/switch)
  - classNames custom (stile Tailwind-like)
  - legenda custom

## Note utili

- Se vedi errori di import Vite, esegui `npm install` nel playground dopo modifiche a `calendar/package.json`.
- Se una porta è occupata, usa:

```bash
npm run dev -- --port 4174
```
