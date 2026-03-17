# @nicola9779/nicalendar-custom

Reusable React calendar library with:
- `month`, `week`, `day`, `agenda` views
- fully prop-driven data (no fetch inside)
- customizable filters, tags, event colors, summary cards
- self-contained CSS (`@nicola9779/nicalendar-custom/styles.css`)

## Install

```bash
npm install @nicola9779/nicalendar-custom
```

Peer dependencies:
- `react` `^18 || ^19`
- `react-dom` `^18 || ^19`

## Basic Usage

```tsx
import { Calendar, type CalendarEvent } from "@nicola9779/nicalendar-custom";
import "@nicola9779/nicalendar-custom/styles.css";

const events: CalendarEvent[] = [
  {
    id: "1",
    title: "Kickoff",
    date: new Date(),
    start: "10:00",
    end: "11:00",
    client: "ACME",
    assignee: "Nico",
    status: "pending",
    priority: "high",
    type: "manual",
    tags: [{ id: "tag-1", label: "Client", color: "#e6f0ff", textColor: "#1d4ed8" }],
  },
];

export default function App() {
  return <Calendar events={events} initialView="month" currentUser="Nico" />;
}
```

If you want full Tailwind control in your app, do not import `@nicola9779/nicalendar-custom/styles.css` and pass `classNames` + `renderers`.

## Main Props

- `events: CalendarEvent[]` Required.
- `showSummary?: boolean` Show/hide top cards.
- `summaryCards?: CalendarSummaryCard[]` Custom card data. If omitted and `showSummary=true`, default cards are auto-generated.
- `showFilters?: boolean` Show/hide filters section.
- `showLegend?: boolean` Show/hide legend.
- `filters?: CalendarFilterConfig[]` Fully custom filters (name + input type + logic).
- `onFilterValuesChange?: (values) => void` Get full custom filter state.
- `legendItems?: CalendarLegendItem[]` Full custom legend row (label + color).
- `visibleEventsLabel?: (count) => string` Custom text for visible-events chip.
- `classNames?: Partial<CalendarClassNames>` Slot-based class override (ideal for Tailwind).
- `renderers?: CalendarRenderers` Replace controls with your UI components.
- `statusOptions?: CalendarFilterOption<EventStatus>[]` Custom status filter labels/colors.
- `priorityOptions?: CalendarFilterOption<EventPriority>[]` Custom priority filter labels/colors.
- `typeOptions?: CalendarFilterOption<EventType>[]` Custom type filter labels/colors.
- `eventColorMode?: "priority" | "status" | "type" | "custom"` Event color source.
- `priorityColors?: Partial<Record<EventPriority, string>>` Priority palette.
- `statusColors?: Partial<Record<EventStatus, string>>` Status palette.
- `typeColors?: Partial<Record<EventType, string>>` Type palette.
- `theme?: Partial<CalendarThemeTokens>` Override all UI tokens (buttons/chips/panels/text/etc).
- `renderEventContent?: (event) => ReactNode` Full custom event rendering.

## Fully Custom Filters (Names + Input Type + Logic)

`filters` gives full control:
- choose filter name (`label`)
- choose input type (`text`, `toggle`, `single-select`, `multi-select`, `chips-single`, `chips-multi`)
- bind to built-in pipeline (`bindTo`) or provide your own `predicate`

```tsx
import type { CalendarFilterConfig } from "@nicola9779/nicalendar-custom";

const filters: CalendarFilterConfig[] = [
  {
    id: "q",
    label: "Search Clients",
    input: "text",
    placeholder: "Type client name...",
    bindTo: "search",
    row: 1,
  },
  {
    id: "mine",
    label: "Assigned to me",
    input: "toggle",
    bindTo: "onlyMine",
    row: 1,
  },
  {
    id: "st",
    label: "Workflow Status",
    input: "chips-multi",
    bindTo: "statuses",
    options: [
      { value: "pending", label: "To Do", color: "#2563eb" },
      { value: "overdue", label: "Late", color: "#e11d48" },
      { value: "completed", label: "Done", color: "#16a34a" },
    ],
    row: 2,
  },
  {
    id: "customerTier",
    label: "Tier",
    input: "single-select",
    options: [
      { value: "enterprise", label: "Enterprise" },
      { value: "startup", label: "Startup" },
    ],
    row: 2,
    predicate: (event, value) => {
      if (!value) return true;
      if (value === "enterprise") return event.client.toLowerCase().includes("corp");
      return event.client.toLowerCase().includes("lab");
    },
  },
];

<Calendar events={events} filters={filters} />
```

### `bindTo` values
- `"search"`
- `"onlyMine"`
- `"statuses"`
- `"priorities"`
- `"types"`

If you do not use `bindTo`, use `predicate` to define custom behavior.

## Custom Legend (Tags Row Like Your Screenshot)

```tsx
<Calendar
  events={events}
  showLegend
  legendItems={[
    { id: "n", label: "Normal", color: "#356fe3" },
    { id: "h", label: "High", color: "#f59e0b" },
    { id: "c", label: "Critical", color: "#e11d48" },
  ]}
  visibleEventsLabel={(count) => `${count} visible events`}
/>
```

## Exact Integration Mode (Use Your Own shadcn Components)

If you want it to look exactly like your app, pass your own UI primitives via `renderers`.

```tsx
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

<Calendar
  events={events}
  renderers={{
    Button: ({ children, className, onClick, ariaLabel }) => (
      <Button variant="outline" className={className} onClick={onClick} aria-label={ariaLabel}>
        {children}
      </Button>
    ),
    Input: ({ value, onChange, placeholder, className, ariaLabel }) => (
      <Input
        className={className}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label={ariaLabel}
      />
    ),
    Switch: ({ checked, onChange, label, className, ariaLabel }) => (
      <label className={className}>
        <Switch checked={checked} onCheckedChange={onChange} aria-label={ariaLabel} />
        <span>{label}</span>
      </label>
    ),
    Select: ({ value, onChange, options, className }) => (
      <Select value={String(value)} onValueChange={(v) => onChange(v)}>
        <SelectTrigger className={className}>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {options.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    ),
  }}
/>
```

## Tailwind Slot Mapping (Your `calendarStyles` Object)

You can map your style object directly:

```tsx
import { Calendar } from "@nicola9779/nicalendar-custom";

export const calendarStyles = {
  page: "space-y-6",
  header: "flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between",
  periodToolbar: "flex flex-col gap-4 rounded-xl border bg-card p-4 lg:flex-row lg:items-center lg:justify-between",
  legend: "flex flex-wrap items-center gap-x-5 gap-y-2 text-sm",
  monthGrid: "grid min-w-[980px] grid-cols-7 border",
  monthHeaderCell: "border-b border-r bg-muted/50 px-3 py-2 text-center text-sm font-semibold last:border-r-0",
  monthCell: "min-h-[140px] border-b border-r p-2",
  monthEventButton: "w-full rounded-md border bg-background px-2 py-1 text-left text-xs hover:bg-muted",
} as const;

<Calendar
  events={events}
  classNames={{
    page: calendarStyles.page,
    header: calendarStyles.header,
    toolbar: calendarStyles.legend,
    monthGrid: calendarStyles.monthGrid,
    weekday: calendarStyles.monthHeaderCell,
    cell: calendarStyles.monthCell,
    eventButton: calendarStyles.monthEventButton,
  }}
/>
```

## Event Shape

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
  color?: string; // used when eventColorMode="custom"
  tags?: {
    id: string;
    label: string;
    color?: string;
    textColor?: string;
  }[];
};
```

## Summary Cards

Use cards only when needed:

```tsx
<Calendar
  events={events}
  showSummary={true}
  summaryCards={[
    { id: "open", label: "Open", value: 14, color: "#2563eb" },
    { id: "late", label: "Late", value: 3, color: "#e11d48" },
  ]}
/>
```

## Theme Example (Base White -> Custom)

```tsx
<Calendar
  events={events}
  theme={{
    background: "#ffffff",
    panel: "#f8fafc",
    panelStrong: "#f3f7ff",
    border: "#d9e1ef",
    text: "#17233a",
    muted: "#5f7192",
    accent: "#2f6fed",
    accentSoft: "#e9f0ff",
    focus: "#2f6fed",
    chipBackground: "#f4f7fc",
    buttonBackground: "#ffffff",
    priorityNormal: "#2f6fed",
    priorityHigh: "#f59e0b",
    priorityCritical: "#e11d48",
    success: "#16a34a",
    warning: "#f59e0b",
    danger: "#e11d48",
  }}
/>
```

## Build

```bash
npm run typecheck
npm run build
```

Output:
- ESM + CJS bundles
- TypeScript declarations
- CSS bundle exported as `@nicola9779/nicalendar-custom/styles.css`
