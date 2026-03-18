# @nicola9779/nicalendar-custom

Reusable React calendar library with an opinionated default UI and full customization APIs.

## What You Get

- Views: `month`, `week`, `day`, `agenda`
- Fully prop-driven data model (no internal fetching)
- One main layout card by default:
  - filters section
  - calendar toolbar (`prev/today/next + month label + view tabs`)
  - legend
  - calendar grid/list
- Summary KPI cards (enabled by default)
- Filter system with custom input type + custom predicates
- Self-contained style via `@nicola9779/nicalendar-custom/styles.css`
- Runtime customization via:
  - `filters`
  - `summaryCards`
  - `legendItems`
  - `theme`
  - `classNames`
  - `renderers`

## Install

```bash
npm i @nicola9779/nicalendar-custom
```

Peer dependencies:

- `react` `^18 || ^19`
- `react-dom` `^18 || ^19`

## Quick Start

```tsx
import { Calendar, type CalendarEvent } from "@nicola9779/nicalendar-custom";
import "@nicola9779/nicalendar-custom/styles.css";

const events: CalendarEvent[] = [
  {
    id: "1",
    title: "Policy renewal",
    date: new Date(),
    start: "10:00",
    end: "11:00",
    client: "Northwind Corp",
    assignee: "Nico",
    status: "pending",
    priority: "normal",
    type: "manual",
  },
];

export default function App() {
  return (
    <Calendar
      events={events}
      initialView="month"
      currentUser="Nico"
      showSummary
      showFilters
      showLegend
    />
  );
}
```

## Default Behaviors

- `showSummary`: `true`
- `showFilters`: `true`
- `showLegend`: `true`
- Filter section is collapsible (`Nascondi/Mostra`)
- Legend defaults include: `Normal`, `High`, `Critical`, `Call`, `Task`
- Event marker uses a colored dot based on `eventColorMode`

## Custom Summary Cards

```tsx
<Calendar
  events={events}
  summaryCards={[
    { id: "due", label: "Due This Week", value: 7, color: "#2563eb" },
    { id: "overdue", label: "Overdue", value: 2, color: "#e11d48" },
    { id: "pending", label: "Pending", value: 11, color: "#f59e0b" },
    { id: "completed", label: "Completed", value: 4, color: "#16a34a" },
  ]}
/>
```

## Custom Filters (names + input type + logic)

```tsx
import type { CalendarFilterConfig } from "@nicola9779/nicalendar-custom";

const filters: CalendarFilterConfig[] = [
  {
    id: "clientSearch",
    label: "Filtro Clienti",
    input: "text",
    placeholder: "Search clients...",
    row: 1,
    predicate: (event, value) => {
      const q = String(value ?? "").trim().toLowerCase();
      return !q || event.client.toLowerCase().includes(q);
    },
  },
  {
    id: "status",
    label: "Status",
    input: "single-select",
    row: 1,
    options: [
      { value: "", label: "All" },
      { value: "pending", label: "Pending" },
      { value: "overdue", label: "Overdue" },
      { value: "completed", label: "Completed" },
    ],
    bindTo: "statuses",
    defaultValue: "",
  },
  {
    id: "onlyMine",
    label: "Solo assegnate a me",
    input: "toggle",
    bindTo: "onlyMine",
    row: 2,
  },
];

<Calendar events={events} filters={filters} />
```

## Theme Tokens

```tsx
<Calendar
  events={events}
  theme={{
    background: "#eef2f8",
    panel: "#ffffff",
    panelStrong: "#f7f9fc",
    border: "#d3dceb",
    text: "#1e293b",
    muted: "#64748b",
    accent: "#2563eb",
    accentSoft: "#e8efff",
    chipBackground: "#f8fafc",
    buttonBackground: "#ffffff",
  }}
/>
```

## Bring Your Own UI (shadcn/radix/custom)

Use `renderers` to replace default controls/components.

```tsx
<Calendar
  events={events}
  renderers={{
    Button: ({ className, children, onClick, ariaLabel }) => (
      <button type="button" className={className} onClick={onClick} aria-label={ariaLabel}>
        {children}
      </button>
    ),
  }}
/>
```

## Core Props

- `events: CalendarEvent[]` (required)
- `onEventClick?: (event: CalendarEvent) => void`
- `initialView?: "month" | "week" | "day" | "agenda"`
- `currentUser?: string`
- `showSummary?: boolean`
- `showFilters?: boolean`
- `showLegend?: boolean`
- `summaryCards?: CalendarSummaryCard[]`
- `legendItems?: CalendarLegendItem[]`
- `filters?: CalendarFilterConfig[]`
- `eventColorMode?: "priority" | "status" | "type" | "custom"`
- `classNames?: Partial<CalendarClassNames>`
- `renderers?: CalendarRenderers`
- `theme?: Partial<CalendarThemeTokens>`

## Event Type

```ts
type CalendarEvent = {
  id: string;
  title: string;
  date: Date;
  start: string;
  end: string;
  client: string;
  assignee: string;
  status: "pending" | "overdue" | "completed";
  priority: "normal" | "high" | "critical";
  type: "manual" | "recurring" | "system";
  color?: string;
  tags?: { id: string; label: string; color?: string; textColor?: string }[];
};
```

## Development

```bash
npm run typecheck
npm run build
npm run test:run
```

## Storybook

Storybook is configured to document and test the calendar in isolation.

### Run locally

```bash
npm run storybook
```

Open `http://localhost:6006`.

### Build static docs

```bash
npm run build-storybook
```

### Publish Storybook online (GitHub Pages)

Questo repository include il workflow:
- `.github/workflows/storybook-pages.yml`

Per abilitarlo:
1. Push su `main` (o run manuale del workflow da Actions)
2. In GitHub: `Settings -> Pages -> Source: GitHub Actions`
3. Usa l'URL Pages del repository per condividere Storybook con il team

### Included stories

- Default
- Empty state
- Views: Month / Week / Day / Agenda
- Interaction: event click handling, filters enabled
- Edge cases: many events, only critical events, only completed events

## Quality Gates

Before release, the package runs:

- TypeScript checks
- Unit/integration tests with Vitest + React Testing Library
- Build generation (`.mjs`, `.cjs`, `.d.ts`, `dist/styles.css`)

`prepublishOnly` runs all checks automatically.

## Versioning & Release Management

This package follows strict semantic versioning:

- `patch`: bug fixes only
- `minor`: non-breaking improvements
- `major`: breaking API changes

Changes are tracked with **Changesets**:

```bash
npm run changeset
npm run version-packages
npm run release
```

Every release includes an explicit change type and bump reason.

## npm Publish automation (recommended)

Workflow:
- `.github/workflows/publish-npm.yml`

Requisito:
- Secret GitHub `NPM_TOKEN` con permessi publish sul package scoped.

Trigger:
- manuale da Actions
- automatico quando pubblichi una GitHub Release

Comando locale consigliato prima di creare la release:

```bash
npm version patch
git push origin main --follow-tags
```

## Troubleshooting (important for local dev)

If you update library styles and do not see changes in `playground`, clear Vite cache and force reload:

```bash
cd ../calendar
npm run build

cd ../playground
rm -rf node_modules/.vite
npm run dev -- --force
```
