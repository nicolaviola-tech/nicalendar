import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";
import { Calendar } from "../Calendar";
import type {
  CalendarEvent,
  CalendarFilterConfig,
  CalendarFilterOption,
  CalendarLegendItem,
  CalendarProps,
  CalendarSummaryCard,
  EventPriority,
  EventStatus,
  EventType,
} from "../types";
import { completedEventsOnly, criticalEventsOnly, manyEvents, mockEvents } from "./mockEvents";

const controlsSummaryCards: CalendarSummaryCard[] = [
  { id: "due", label: "Due This Week", value: 4, color: "#2563eb" },
  { id: "overdue", label: "Overdue", value: 2, color: "#e11d48" },
  { id: "pending", label: "Pending", value: 7, color: "#f59e0b" },
  { id: "completed", label: "Completed", value: 10, color: "#16a34a" },
];

const controlsLegendItems: CalendarLegendItem[] = [
  { id: "normal", label: "Normal", color: "#2f6fed" },
  { id: "high", label: "High", color: "#f59e0b" },
  { id: "critical", label: "Critical", color: "#e11d48" },
  { id: "call", label: "Call", color: "#0d9a6b" },
  { id: "task", label: "Task", color: "#4f46e5" },
];

const controlsStatusOptions: CalendarFilterOption<EventStatus>[] = [
  { value: "pending", label: "Pending" },
  { value: "overdue", label: "Overdue" },
  { value: "completed", label: "Completed" },
];

const controlsPriorityOptions: CalendarFilterOption<EventPriority>[] = [
  { value: "normal", label: "Normal" },
  { value: "high", label: "High" },
  { value: "critical", label: "Critical" },
];

const controlsTypeOptions: CalendarFilterOption<EventType>[] = [
  { value: "manual", label: "Manual" },
  { value: "recurring", label: "Recurring" },
  { value: "system", label: "System" },
];

const controlsFilters: CalendarFilterConfig[] = [
  {
    id: "searchClients",
    label: "Search clients",
    input: "text",
    placeholder: "Search clients...",
    row: 1,
  },
  {
    id: "searchUsers",
    label: "Search users",
    input: "text",
    placeholder: "Search users...",
    row: 1,
  },
  {
    id: "statuses",
    label: "Status",
    input: "single-select",
    bindTo: "statuses",
    defaultValue: "",
    row: 1,
    options: [
      { value: "", label: "All" },
      { value: "pending", label: "Pending" },
      { value: "overdue", label: "Overdue" },
      { value: "completed", label: "Completed" },
    ],
  },
];

const meta: Meta<typeof Calendar> = {
  title: "Components/Calendar",
  component: Calendar,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div style={{ padding: 16 }}>
        <Story />
      </div>
    ),
  ],
  args: {
    events: mockEvents,
    initialView: "month",
    showFilters: true,
    showSummary: true,
    showLegend: true,
    currentUser: "Nico",
    summaryCards: controlsSummaryCards,
    legendItems: controlsLegendItems,
    statusOptions: controlsStatusOptions,
    priorityOptions: controlsPriorityOptions,
    typeOptions: controlsTypeOptions,
    defaultFilters: {
      search: "",
      statuses: [],
      priorities: [],
      types: [],
      onlyMine: false,
    },
    theme: {
      background: "#f1f4fa",
      panel: "#ffffff",
      panelStrong: "#f6f8fc",
      border: "#d6deea",
      text: "#1f2a3d",
      muted: "#61718f",
      accent: "#2563eb",
      accentSoft: "#e8efff",
      chipBackground: "#f8fafc",
      buttonBackground: "#ffffff",
    },
    priorityColors: {
      normal: "#2f6fed",
      high: "#f59e0b",
      critical: "#e11d48",
    },
    statusColors: {
      pending: "#f59e0b",
      overdue: "#e11d48",
      completed: "#16a34a",
    },
    typeColors: {
      manual: "#2f6fed",
      recurring: "#f59e0b",
      system: "#e11d48",
    },
    onEventClick: fn(),
  } satisfies Partial<CalendarProps>,
  argTypes: {
    events: { control: "object", description: "Calendar events array" },
    initialView: {
      control: { type: "select" },
      options: ["month", "week", "day", "agenda"],
      description: "Initial visible calendar view",
    },
    showFilters: { control: "boolean", description: "Toggle filter section visibility" },
    showSummary: { control: "boolean", description: "Toggle summary cards visibility" },
    showLegend: { control: "boolean", description: "Toggle legend visibility" },
    currentUser: { control: "text", description: "Current user for only-mine filtering behavior" },
    summaryCards: {
      control: "object",
      description: "Custom KPI cards [{ id, label, value, color }]",
      table: { defaultValue: { summary: "Array<SummaryCard>" } },
    },
    legendItems: {
      control: "object",
      description: "Custom legend items [{ id, label, color }]",
      table: { defaultValue: { summary: "Array<LegendItem>" } },
    },
    filters: {
      control: "object",
      description: "Custom filter configuration array",
      table: { defaultValue: { summary: "Array<FilterConfig>" } },
    },
    statusOptions: {
      control: "object",
      description: "Status options for built-in filters",
      table: { defaultValue: { summary: "Array<StatusOption>" } },
    },
    priorityOptions: {
      control: "object",
      description: "Priority options for built-in filters",
      table: { defaultValue: { summary: "Array<PriorityOption>" } },
    },
    typeOptions: {
      control: "object",
      description: "Type options for built-in filters",
      table: { defaultValue: { summary: "Array<TypeOption>" } },
    },
    defaultFilters: { control: "object", description: "Default legacy filter state" },
    theme: { control: "object", description: "Theme tokens override" },
    classNames: { control: "object", description: "Class slot overrides" },
    renderers: { control: "object", description: "Renderer overrides (advanced)" },
    priorityColors: { control: "object", description: "Priority color overrides" },
    statusColors: { control: "object", description: "Status color overrides" },
    typeColors: { control: "object", description: "Type color overrides" },
    eventColorMode: {
      control: { type: "select" },
      options: ["priority", "status", "type", "custom"],
      description: "Event color strategy",
    },
    visibleEventsLabel: { control: false, description: "Function prop - disabled in controls" },
    renderEventContent: { control: false, description: "Function prop - disabled in controls" },
    onDateSelect: { control: false, description: "Function prop - disabled in controls" },
    onFiltersChange: { control: false, description: "Function prop - disabled in controls" },
    onFilterValuesChange: { control: false, description: "Function prop - disabled in controls" },
    onEventClick: { action: "event-click", description: "Triggered when an event is clicked" },
  },
  parameters: {
    docs: {
      description: {
        component:
          "Reusable calendar component for npm distribution. Fully prop-driven, with month/week/day/agenda views, filtering pipeline, and customizable renderers/classNames/theme tokens.",
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof Calendar>;

export const Default: Story = {
  name: "Default",
  args: {
    events: mockEvents,
  },
};

export const EmptyState: Story = {
  name: "Empty state",
  args: {
    events: [],
  },
  parameters: {
    docs: {
      description: {
        story: "Renders safely with no events and keeps all UI interactive.",
      },
    },
  },
};

export const MonthView: Story = {
  name: "Views / Month",
  args: {
    events: mockEvents,
    initialView: "month",
  },
};

export const WeekView: Story = {
  name: "Views / Week",
  args: {
    events: mockEvents,
    initialView: "week",
  },
};

export const DayView: Story = {
  name: "Views / Day",
  args: {
    events: mockEvents,
    initialView: "day",
  },
};

export const AgendaView: Story = {
  name: "Views / Agenda",
  args: {
    events: mockEvents,
    initialView: "agenda",
  },
};

export const InteractionEventClick: Story = {
  name: "Interaction / Event click handling",
  args: {
    events: mockEvents,
    onEventClick: fn<(event: CalendarEvent) => void>(),
  },
  parameters: {
    docs: {
      description: {
        story: "Click an event and verify the action payload in Storybook Actions panel.",
      },
    },
  },
};

export const InteractionFiltersEnabled: Story = {
  name: "Interaction / Filters enabled",
  args: {
    events: mockEvents,
    showFilters: true,
  },
  parameters: {
    docs: {
      description: {
        story: "Use search/select/toggle controls and verify filtered event count and calendar cells update.",
      },
    },
  },
};

export const InteractionCustomFilters: Story = {
  name: "Interaction / Custom filters (example)",
  args: {
    events: mockEvents,
    showFilters: true,
    filters: controlsFilters,
  },
  parameters: {
    docs: {
      description: {
        story:
          "Example with a custom filters array. Use this only if you want to replace the default filter layout.",
      },
    },
  },
};

export const EdgeManyEvents: Story = {
  name: "Edge cases / Many events (stress test)",
  args: {
    events: manyEvents,
    initialView: "month",
  },
};

export const EdgeOnlyCriticalEvents: Story = {
  name: "Edge cases / Only critical events",
  args: {
    events: criticalEventsOnly,
    initialView: "month",
  },
};

export const EdgeOnlyCompletedEvents: Story = {
  name: "Edge cases / Only completed events",
  args: {
    events: completedEventsOnly,
    initialView: "month",
  },
};
