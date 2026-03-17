import type { ReactNode } from "react";

export type CalendarView = "month" | "week" | "day" | "agenda";
export type EventStatus = "pending" | "overdue" | "completed";
export type EventPriority = "normal" | "high" | "critical";
export type EventType = "manual" | "recurring" | "system";

export type CalendarTag = {
  id: string;
  label: string;
  color?: string;
  textColor?: string;
};

export type CalendarEvent = {
  id: string;
  title: string;
  date: Date;
  start: string;
  end: string;
  client: string;
  assignee: string;
  status: EventStatus;
  priority: EventPriority;
  type: EventType;
  color?: string;
  tags?: CalendarTag[];
};

export type CalendarFilterState = {
  search: string;
  statuses: EventStatus[];
  priorities: EventPriority[];
  types: EventType[];
  onlyMine: boolean;
};

export type CalendarFilterInputType =
  | "text"
  | "toggle"
  | "single-select"
  | "multi-select"
  | "chips-single"
  | "chips-multi";

export type CalendarFilterValue = string | boolean | string[];
export type CalendarFilterValues = Record<string, CalendarFilterValue>;

export type CalendarFilterBinding =
  | "search"
  | "onlyMine"
  | "statuses"
  | "priorities"
  | "types";

export type CalendarThemeTokens = {
  background: string;
  panel: string;
  panelStrong: string;
  border: string;
  text: string;
  muted: string;
  accent: string;
  accentSoft: string;
  focus: string;
  priorityNormal: string;
  priorityHigh: string;
  priorityCritical: string;
  success: string;
  warning: string;
  danger: string;
  chipBackground: string;
  buttonBackground: string;
};

export type CalendarFilterOption<T extends string> = {
  value: T;
  label: string;
  color?: string;
};

export type CalendarFilterConfig = {
  id: string;
  label: string;
  input: CalendarFilterInputType;
  options?: CalendarFilterOption<string>[];
  placeholder?: string;
  defaultValue?: CalendarFilterValue;
  bindTo?: CalendarFilterBinding;
  row?: 1 | 2;
  predicate?: (
    event: CalendarEvent,
    value: CalendarFilterValue,
    context: { currentUser?: string; allValues: CalendarFilterValues },
  ) => boolean;
};

export type CalendarSummaryCard = {
  id: string;
  label: string;
  value: number;
  color?: string;
};

export type CalendarLegendItem = {
  id: string;
  label: string;
  color: string;
};

export type CalendarButtonRendererProps = {
  children: ReactNode;
  className?: string;
  ariaLabel?: string;
  active?: boolean;
  role?: string;
  ariaSelected?: boolean;
  onClick?: () => void;
};

export type CalendarInputRendererProps = {
  className?: string;
  ariaLabel?: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
};

export type CalendarSelectRendererProps = {
  className?: string;
  ariaLabel?: string;
  multiple?: boolean;
  options: CalendarFilterOption<string>[];
  value: string | string[];
  onChange: (value: string | string[]) => void;
};

export type CalendarSwitchRendererProps = {
  className?: string;
  ariaLabel?: string;
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
};

export type CalendarChipRendererProps = {
  className?: string;
  ariaLabel?: string;
  label: string;
  color?: string;
  selected: boolean;
  onClick: () => void;
};

export type CalendarStatCardRendererProps = {
  className?: string;
  label: string;
  value: number;
  color?: string;
};

export type CalendarEventTagRendererProps = {
  className?: string;
  label: string;
  color?: string;
  textColor?: string;
};

export type CalendarRenderers = {
  Button?: (props: CalendarButtonRendererProps) => ReactNode;
  Input?: (props: CalendarInputRendererProps) => ReactNode;
  Select?: (props: CalendarSelectRendererProps) => ReactNode;
  Switch?: (props: CalendarSwitchRendererProps) => ReactNode;
  Chip?: (props: CalendarChipRendererProps) => ReactNode;
  StatCard?: (props: CalendarStatCardRendererProps) => ReactNode;
  EventTag?: (props: CalendarEventTagRendererProps) => ReactNode;
};

export type CalendarClassNames = {
  page: string;
  summaryGrid: string;
  summaryCard: string;
  filters: string;
  filterRow: string;
  filterItem: string;
  filterLabel: string;
  filterGroup: string;
  input: string;
  select: string;
  selectMulti: string;
  switch: string;
  chip: string;
  chipSelected: string;
  header: string;
  nav: string;
  navButton: string;
  title: string;
  views: string;
  viewButton: string;
  viewButtonActive: string;
  toolbar: string;
  legendItem: string;
  legendDot: string;
  visibleCount: string;
  body: string;
  weekdays: string;
  weekday: string;
  monthGrid: string;
  weekGrid: string;
  cell: string;
  cellSelected: string;
  cellMuted: string;
  dayButton: string;
  events: string;
  eventButton: string;
  eventContent: string;
  eventTitle: string;
  eventTime: string;
  eventTags: string;
  eventTag: string;
  more: string;
  list: string;
  subtitle: string;
  empty: string;
  resetButton: string;
};

export type CalendarEventColorMode = "priority" | "status" | "type" | "custom";

export type CalendarProps = {
  events: CalendarEvent[];
  onEventClick?: (event: CalendarEvent) => void;
  onDateSelect?: (date: Date) => void;
  initialView?: CalendarView;
  initialDate?: Date;
  currentUser?: string;
  className?: string;
  locale?: string;
  weekStartsOn?: 0 | 1;
  showFilters?: boolean;
  showSummary?: boolean;
  showLegend?: boolean;
  summaryCards?: CalendarSummaryCard[];
  legendItems?: CalendarLegendItem[];
  visibleEventsLabel?: (count: number) => string;
  statusOptions?: CalendarFilterOption<EventStatus>[];
  priorityOptions?: CalendarFilterOption<EventPriority>[];
  typeOptions?: CalendarFilterOption<EventType>[];
  filters?: CalendarFilterConfig[];
  eventColorMode?: CalendarEventColorMode;
  priorityColors?: Partial<Record<EventPriority, string>>;
  statusColors?: Partial<Record<EventStatus, string>>;
  typeColors?: Partial<Record<EventType, string>>;
  renderEventContent?: (event: CalendarEvent) => ReactNode;
  defaultFilters?: Partial<CalendarFilterState>;
  onFiltersChange?: (filters: CalendarFilterState) => void;
  onFilterValuesChange?: (values: CalendarFilterValues) => void;
  theme?: Partial<CalendarThemeTokens>;
  renderers?: CalendarRenderers;
  classNames?: Partial<CalendarClassNames>;
};
