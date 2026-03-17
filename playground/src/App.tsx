import {
  Calendar,
  type CalendarButtonRendererProps,
  type CalendarEvent,
  type CalendarFilterConfig,
  type CalendarFilterOption,
  type CalendarInputRendererProps,
  type CalendarSelectRendererProps,
  type CalendarSwitchRendererProps,
} from "@nicalendar/custom";
import "@nicalendar/custom/styles.css";
import { ChevronLeft, ChevronRight } from "lucide-react";

const today = new Date();
const year = today.getFullYear();
const month = today.getMonth();

const events: CalendarEvent[] = [
  {
    id: "1",
    title: "Policy renewal",
    date: new Date(year, month, 3),
    start: "10:00",
    end: "11:00",
    client: "Northwind Corp",
    assignee: "Nico",
    status: "pending",
    priority: "normal",
    type: "manual",
  },
  {
    id: "2",
    title: "ABTG follow-up",
    date: new Date(year, month, 4),
    start: "13:00",
    end: "14:00",
    client: "Contoso Lab",
    assignee: "Nico",
    status: "pending",
    priority: "high",
    type: "recurring",
  },
  {
    id: "3",
    title: "Rights request review",
    date: new Date(year, month, 5),
    start: "15:00",
    end: "16:00",
    client: "Fabrikam Corp",
    assignee: "Marco",
    status: "overdue",
    priority: "critical",
    type: "system",
  },
];

const calendarStyles = {
  page: "space-y-6 rounded-xl border border-slate-200 bg-white p-4",
  header: "flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between rounded-xl border border-slate-200 bg-white p-4",
  kpisGrid: "grid gap-3 md:grid-cols-2 xl:grid-cols-4",
  periodToolbar: "flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-4 lg:flex-row lg:items-center lg:justify-between",
  legend: "flex flex-wrap items-center gap-x-5 gap-y-2 text-sm",
  contentWrap: "p-3",
  monthGrid: "grid min-w-[980px] grid-cols-7 border border-slate-200",
  monthHeaderCell: "border-b border-r border-slate-200 bg-slate-50 px-3 py-2 text-center text-sm font-semibold text-slate-800 last:border-r-0",
  monthCell: "min-h-[140px] border-b border-r border-slate-200 p-2",
  monthEventButton: "w-full rounded-md border border-slate-200 bg-white px-2 py-1 text-left text-xs text-slate-700 hover:bg-slate-50",
  weekGrid: "grid gap-3 md:grid-cols-2 xl:grid-cols-4",
  weekDayCard: "rounded-xl border border-slate-200 p-3",
  eventButton: "w-full rounded-xl border border-slate-200 p-4 text-left hover:bg-slate-50",
  agendaEventButton: "w-full rounded-xl border border-slate-200 p-3 text-left hover:bg-slate-50",
} as const;

const filters: CalendarFilterConfig[] = [
  {
    id: "search-clients",
    label: "Search clients",
    input: "text",
    placeholder: "Search clients...",
    row: 1,
    predicate: (event, value) => {
      const q = String(value ?? "").trim().toLowerCase();
      if (!q) return true;
      return event.client.toLowerCase().includes(q);
    },
  },
  {
    id: "search-users",
    label: "Search users",
    input: "text",
    placeholder: "Search users...",
    row: 1,
    predicate: (event, value) => {
      const q = String(value ?? "").trim().toLowerCase();
      if (!q) return true;
      return event.assignee.toLowerCase().includes(q);
    },
  },
  {
    id: "statuses",
    label: "Status (3/3)",
    input: "single-select",
    row: 1,
    options: [
      { value: "pending", label: "Pending" },
      { value: "overdue", label: "Overdue" },
      { value: "completed", label: "Completed" },
    ],
    defaultValue: "",
    predicate: (event, value) => (!value ? true : event.status === value),
  },
  {
    id: "priorities",
    label: "Priority (3/3)",
    input: "single-select",
    row: 1,
    options: [
      { value: "normal", label: "Normal" },
      { value: "high", label: "High" },
      { value: "critical", label: "Critical" },
    ],
    defaultValue: "",
    predicate: (event, value) => (!value ? true : event.priority === value),
  },
  {
    id: "types",
    label: "Type (3/3)",
    input: "single-select",
    row: 1,
    options: [
      { value: "manual", label: "Manual" },
      { value: "recurring", label: "Recurring" },
      { value: "system", label: "System" },
    ],
    defaultValue: "",
    predicate: (event, value) => (!value ? true : event.type === value),
  },
  {
    id: "critical-only",
    label: "Solo priorita critica",
    input: "toggle",
    row: 2,
    defaultValue: false,
    predicate: (event, value) => (!value ? true : event.priority === "critical"),
  },
  {
    id: "hide-completed",
    label: "Nascondi completate",
    input: "toggle",
    row: 2,
    defaultValue: false,
    predicate: (event, value) => (!value ? true : event.status !== "completed"),
  },
  {
    id: "only-mine",
    label: "Solo assegnate a me",
    input: "toggle",
    row: 2,
    bindTo: "onlyMine",
  },
];

export default function App() {
  const sizePresets = {
    xs: {
      title: "text-[16px]",
      controlHeight: "h-8",
      controlText: "text-[11px]",
      labelText: "text-[11px]",
      bodyText: "text-[11px]",
      eventText: "text-[11px]",
      subtitle: "text-[16px]",
      inputWidth: "w-[190px]",
      navPadding: "px-2 py-1",
      viewPadding: "px-2.5 py-1",
      resetPadding: "px-3 py-1",
      navCircle: "h-7 w-7 rounded-xl",
      navIcon: "h-3.5 w-3.5",
      todayText: "text-[12px]",
      switchTrack: "h-5 w-[34px]",
      switchThumb: "h-3.5 w-3.5",
      switchTranslateOn: "translate-x-4",
      switchTranslateOff: "translate-x-0.5",
      switchGap: "gap-1",
    },
    sm: {
      title: "text-[28px]",
      controlHeight: "h-10",
      controlText: "text-[13px]",
      labelText: "text-[12px]",
      bodyText: "text-[13px]",
      eventText: "text-[12px]",
      subtitle: "text-[22px]",
      inputWidth: "w-[250px]",
      navPadding: "px-3 py-2",
      viewPadding: "px-4 py-2",
      resetPadding: "px-4 py-2",
      navCircle: "h-10 w-10 rounded-2xl",
      navIcon: "h-4.5 w-4.5",
      todayText: "text-[14px]",
      switchTrack: "h-7 w-[52px]",
      switchThumb: "h-5 w-5",
      switchTranslateOn: "translate-x-6",
      switchTranslateOff: "translate-x-0.5",
      switchGap: "gap-2",
    },
    md: {
      title: "text-[40px]",
      controlHeight: "h-12",
      controlText: "text-[16px]",
      labelText: "text-[13px]",
      bodyText: "text-[15px]",
      eventText: "text-[13px]",
      subtitle: "text-[28px]",
      inputWidth: "w-[320px]",
      navPadding: "px-4 py-2",
      viewPadding: "px-5 py-2",
      resetPadding: "px-5 py-2",
      navCircle: "h-11 w-11 rounded-2xl",
      navIcon: "h-5 w-5",
      todayText: "text-[15px]",
      switchTrack: "h-8 w-[64px]",
      switchThumb: "h-6 w-6",
      switchTranslateOn: "translate-x-7",
      switchTranslateOff: "translate-x-1",
      switchGap: "gap-3",
    },
    lg: {
      title: "text-[46px]",
      controlHeight: "h-14",
      controlText: "text-[18px]",
      labelText: "text-[14px]",
      bodyText: "text-[16px]",
      eventText: "text-[14px]",
      subtitle: "text-[32px]",
      inputWidth: "w-[380px]",
      navPadding: "px-4 py-2",
      viewPadding: "px-5 py-2",
      resetPadding: "px-6 py-3",
      navCircle: "h-12 w-12 rounded-3xl",
      navIcon: "h-5 w-5",
      todayText: "text-[16px]",
      switchTrack: "h-10 w-[84px]",
      switchThumb: "h-8 w-8",
      switchTranslateOn: "translate-x-10",
      switchTranslateOff: "translate-x-1",
      switchGap: "gap-4",
    },
  };
  const sizePreset: keyof typeof sizePresets = "xs";
  const size = sizePresets[sizePreset];

  const renderers = {
    Button: ({ className, children, onClick, ariaLabel }: CalendarButtonRendererProps) => {
      const label = String(children);

      if (label === "Prev") {
        return (
          <button
            type="button"
            onClick={onClick}
            aria-label={ariaLabel}
            className={`inline-flex ${size.navCircle} items-center justify-center border border-slate-300 bg-slate-100 text-slate-800 hover:bg-slate-200`}
          >
            <ChevronLeft className={size.navIcon} />
          </button>
        );
      }

      if (label === "Next") {
        return (
          <button
            type="button"
            onClick={onClick}
            aria-label={ariaLabel}
            className={`inline-flex ${size.navCircle} items-center justify-center border border-slate-300 bg-slate-100 text-slate-800 hover:bg-slate-200`}
          >
            <ChevronRight className={size.navIcon} />
          </button>
        );
      }

      if (label === "Today") {
        return (
          <button
            type="button"
            onClick={onClick}
            aria-label={ariaLabel}
            className={`${size.todayText} font-medium text-slate-800`}
          >
            Today
          </button>
        );
      }

      return (
        <button type="button" className={className} onClick={onClick} aria-label={ariaLabel}>
          {children}
        </button>
      );
    },
    Input: ({ className, value, onChange, placeholder, ariaLabel }: CalendarInputRendererProps) => (
      <input
        className={className}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label={ariaLabel}
      />
    ),
    Select: ({ className, value, onChange, options, ariaLabel }: CalendarSelectRendererProps) => (
      <select
        className={className}
        value={String(value)}
        onChange={(e) => onChange(e.target.value)}
        aria-label={ariaLabel}
      >
        <option value="">All</option>
        {options.map((opt: CalendarFilterOption<string>) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    ),
    Switch: ({ className, checked, onChange, label, ariaLabel }: CalendarSwitchRendererProps) => (
      <label className={className}>
        <button
          type="button"
          role="switch"
          aria-checked={checked}
          aria-label={ariaLabel}
          onClick={() => onChange(!checked)}
          className={`relative inline-flex ${size.switchTrack} items-center rounded-full border transition ${
            checked ? "bg-slate-300 border-slate-300" : "bg-slate-200 border-slate-200"
          }`}
        >
          <span
            className={`inline-block ${size.switchThumb} rounded-full bg-white shadow transition ${
              checked ? size.switchTranslateOn : size.switchTranslateOff
            }`}
          />
        </button>
        <span>{label}</span>
      </label>
    ),
  };

  return (
    <div className="p-4">
      <Calendar
        events={events}
        initialView="month"
        currentUser="Nico"
        showSummary={false}
        showLegend
        filters={filters}
        renderers={renderers}
        classNames={{
          page: calendarStyles.page,
          header: calendarStyles.periodToolbar,
          nav: "flex items-center gap-4",
          navButton: `rounded-xl border border-slate-200 bg-white ${size.navPadding} ${size.bodyText} font-medium text-slate-800 hover:bg-slate-50`,
          title: `${size.title} font-semibold tracking-tight text-slate-900`,
          views: "flex items-center gap-2",
          viewButton: `rounded-xl border border-slate-200 bg-white ${size.viewPadding} ${size.bodyText} font-medium text-slate-800 hover:bg-slate-50`,
          viewButtonActive: "bg-slate-100",
          filters: "space-y-6 rounded-xl border border-slate-200 bg-white p-4",
          filterRow: "flex flex-wrap items-center gap-4",
          filterItem: "flex flex-col gap-2",
          filterLabel: `${size.labelText} font-semibold text-slate-500`,
          filterGroup: "flex flex-wrap items-center gap-2",
          input: `${size.controlHeight} ${size.inputWidth} rounded-[22px] border border-slate-300 bg-slate-100 px-5 ${size.controlText} font-medium text-slate-600 placeholder:text-slate-500`,
          select: `${size.controlHeight} ${size.inputWidth} rounded-[22px] border border-slate-300 bg-slate-100 px-5 ${size.controlText} font-medium text-slate-800`,
          switch: `inline-flex items-center ${size.switchGap} ${size.controlText} font-medium text-slate-800`,
          resetButton: `self-center rounded-2xl border border-slate-300 bg-slate-100 ${size.resetPadding} ${size.controlText} font-medium text-slate-800 hover:bg-slate-200`,
          toolbar: calendarStyles.legend,
          legendItem: `inline-flex items-center gap-2 ${size.bodyText} font-medium text-slate-700`,
          legendDot: "h-4 w-4 rounded-full",
          visibleCount: `rounded-full border border-slate-300 bg-slate-100 px-4 py-1 ${size.bodyText} font-medium text-slate-700`,
          body: "rounded-xl border border-slate-200 bg-white p-4 overflow-x-auto",
          weekdays: "grid min-w-[980px] grid-cols-7",
          weekday: "border-b border-r border-slate-200 bg-slate-50 px-2 py-1.5 text-center text-sm font-semibold text-slate-800 last:border-r-0",
          monthGrid: calendarStyles.monthGrid,
          weekGrid: calendarStyles.weekGrid,
          cell: "min-h-[180px] border-b border-r border-slate-200 p-2",
          cellSelected: "bg-slate-50/80",
          cellMuted: "opacity-60",
          dayButton: "text-sm font-medium text-slate-800",
          events: "space-y-2",
          eventButton: `w-full rounded-xl border border-slate-300 bg-slate-100 px-3 py-2 text-left ${size.eventText} font-medium text-slate-700 hover:bg-slate-200`,
          eventContent: "space-y-1",
          eventTitle: "text-xs text-slate-700",
          eventTime: "text-[11px] text-slate-500",
          eventTags: "flex flex-wrap gap-1",
          eventTag: "rounded-full border border-slate-300 bg-white px-1.5 py-0.5 text-[10px] text-slate-600",
          more: "text-xs text-slate-500",
          list: "space-y-3",
          subtitle: `${size.subtitle} font-semibold text-slate-900`,
          empty: "text-sm text-slate-500",
        }}
        legendItems={[
          { id: "normal", label: "Normal", color: "#2563eb" },
          { id: "high", label: "High", color: "#f59e0b" },
          { id: "critical", label: "Critical", color: "#e11d48" },
          { id: "call", label: "Call", color: "#059669" },
          { id: "task", label: "Task", color: "#4f46e5" },
        ]}
        visibleEventsLabel={(count) => `${count} eventi visibili`}
      />
    </div>
  );
}
