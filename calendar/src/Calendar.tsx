import React, { useCallback, useEffect, useMemo, useState } from "react";
import type { CSSProperties } from "react";
import type {
  CalendarButtonRendererProps,
  CalendarClassNames,
  CalendarEvent,
  CalendarFilterConfig,
  CalendarFilterOption,
  CalendarFilterState,
  CalendarFilterValue,
  CalendarFilterValues,
  CalendarInputRendererProps,
  CalendarLegendItem,
  CalendarProps,
  CalendarSelectRendererProps,
  CalendarSummaryCard,
  CalendarSwitchRendererProps,
  CalendarThemeTokens,
  CalendarView,
  EventPriority,
  EventStatus,
  EventType,
} from "./types";
import {
  addDays,
  addMonths,
  eachDayOfInterval,
  formatDayKey,
  isSameDay,
  isSameMonth,
  rangeLabel,
  startOfDay,
  startOfMonth,
  startOfWeek,
  toDate,
} from "./utils/date";

const DEFAULT_STATUS_OPTIONS: CalendarFilterOption<EventStatus>[] = [
  { value: "pending", label: "Pending" },
  { value: "overdue", label: "Overdue" },
  { value: "completed", label: "Completed" },
];

const DEFAULT_PRIORITY_OPTIONS: CalendarFilterOption<EventPriority>[] = [
  { value: "normal", label: "Normal" },
  { value: "high", label: "High" },
  { value: "critical", label: "Critical" },
];

const DEFAULT_TYPE_OPTIONS: CalendarFilterOption<EventType>[] = [
  { value: "manual", label: "Manual" },
  { value: "recurring", label: "Recurring" },
  { value: "system", label: "System" },
];

const VIEW_OPTIONS: CalendarView[] = ["month", "week", "day", "agenda"];

const DEFAULT_CLASSNAMES: CalendarClassNames = {
  page: "calendar-container",
  summaryGrid: "calendar-summary",
  summaryCard: "calendar-stat-card",
  filters: "calendar-filters",
  filterRow: "calendar-filter-row",
  filterItem: "calendar-filter-item",
  filterLabel: "calendar-filter-label",
  filterGroup: "calendar-filter-group",
  input: "calendar-input",
  select: "calendar-select",
  selectMulti: "calendar-select-multi",
  switch: "calendar-checkbox",
  chip: "calendar-chip",
  chipSelected: "is-selected",
  header: "calendar-header",
  nav: "calendar-nav",
  navButton: "calendar-button",
  title: "calendar-title",
  views: "calendar-views",
  viewButton: "calendar-button",
  viewButtonActive: "is-active",
  toolbar: "calendar-toolbar",
  legendItem: "calendar-legend-item",
  legendDot: "calendar-legend-dot",
  visibleCount: "calendar-visible-count",
  body: "calendar-body",
  weekdays: "calendar-weekdays",
  weekday: "calendar-weekday",
  monthGrid: "calendar-grid calendar-grid-month",
  weekGrid: "calendar-grid calendar-grid-week",
  cell: "calendar-cell",
  cellSelected: "is-selected",
  cellMuted: "is-muted",
  dayButton: "calendar-day-button",
  events: "calendar-events",
  eventButton: "calendar-event",
  eventContent: "calendar-event-content",
  eventTitle: "calendar-event-title",
  eventTime: "calendar-event-time",
  eventTags: "calendar-event-tags",
  eventTag: "calendar-event-tag",
  more: "calendar-more",
  list: "calendar-list",
  subtitle: "calendar-subtitle",
  empty: "calendar-empty",
  resetButton: "calendar-button",
};

function cn(...parts: Array<string | undefined | false>): string {
  return parts.filter(Boolean).join(" ");
}

function formatEventDate(date: Date, locale: string): string {
  return new Intl.DateTimeFormat(locale, {
    weekday: "short",
    month: "short",
    day: "numeric",
  }).format(date);
}

function toThemeVariables(theme?: Partial<CalendarThemeTokens>): CSSProperties {
  if (!theme) return {};
  return {
    "--calendar-bg": theme.background,
    "--calendar-panel": theme.panel,
    "--calendar-panel-strong": theme.panelStrong,
    "--calendar-border": theme.border,
    "--calendar-text": theme.text,
    "--calendar-muted": theme.muted,
    "--calendar-accent": theme.accent,
    "--calendar-accent-soft": theme.accentSoft,
    "--calendar-focus": theme.focus,
    "--calendar-priority-normal": theme.priorityNormal,
    "--calendar-priority-high": theme.priorityHigh,
    "--calendar-priority-critical": theme.priorityCritical,
    "--calendar-success": theme.success,
    "--calendar-warning": theme.warning,
    "--calendar-danger": theme.danger,
    "--calendar-chip-bg": theme.chipBackground,
    "--calendar-button-bg": theme.buttonBackground,
  } as CSSProperties;
}

function getDefaultSummaryCards(events: CalendarEvent[], weekStartsOn: 0 | 1): CalendarSummaryCard[] {
  const weekStart = startOfWeek(new Date(), weekStartsOn);
  const weekEnd = addDays(weekStart, 6);
  return [
    {
      id: "due_this_week",
      label: "Due This Week",
      value: events.filter((event) => event.date >= weekStart && event.date <= weekEnd).length,
      color: "var(--calendar-priority-normal)",
    },
    {
      id: "overdue",
      label: "Overdue",
      value: events.filter((event) => event.status === "overdue").length,
      color: "var(--calendar-danger)",
    },
    {
      id: "pending",
      label: "Pending",
      value: events.filter((event) => event.status === "pending").length,
      color: "var(--calendar-warning)",
    },
    {
      id: "completed",
      label: "Completed",
      value: events.filter((event) => event.status === "completed").length,
      color: "var(--calendar-success)",
    },
  ];
}

function getDefaultFilterConfigs(
  statusOptions: CalendarFilterOption<EventStatus>[],
  priorityOptions: CalendarFilterOption<EventPriority>[],
  typeOptions: CalendarFilterOption<EventType>[],
): CalendarFilterConfig[] {
  return [
    {
      id: "search",
      label: "Search",
      input: "text",
      placeholder: "Search title, client, assignee",
      bindTo: "search",
      row: 1,
    },
    {
      id: "onlyMine",
      label: "Only my events",
      input: "toggle",
      bindTo: "onlyMine",
      row: 1,
    },
    {
      id: "statuses",
      label: "Status",
      input: "chips-multi",
      bindTo: "statuses",
      options: statusOptions.map((item) => ({ value: item.value, label: item.label, color: item.color })),
      row: 2,
    },
    {
      id: "priorities",
      label: "Priority",
      input: "chips-multi",
      bindTo: "priorities",
      options: priorityOptions.map((item) => ({ value: item.value, label: item.label, color: item.color })),
      row: 2,
    },
    {
      id: "types",
      label: "Type",
      input: "chips-multi",
      bindTo: "types",
      options: typeOptions.map((item) => ({ value: item.value, label: item.label, color: item.color })),
      row: 2,
    },
  ];
}

function buildInitialFilterValues(
  configs: CalendarFilterConfig[],
  defaultFilters: Partial<CalendarFilterState> | undefined,
): CalendarFilterValues {
  const values: CalendarFilterValues = {};
  configs.forEach((config) => {
    if (config.bindTo === "search") {
      values[config.id] = defaultFilters?.search ?? "";
      return;
    }
    if (config.bindTo === "onlyMine") {
      values[config.id] = defaultFilters?.onlyMine ?? false;
      return;
    }
    if (config.bindTo === "statuses") {
      values[config.id] = defaultFilters?.statuses ?? (config.options?.map((item) => item.value) ?? []);
      return;
    }
    if (config.bindTo === "priorities") {
      values[config.id] = defaultFilters?.priorities ?? (config.options?.map((item) => item.value) ?? []);
      return;
    }
    if (config.bindTo === "types") {
      values[config.id] = defaultFilters?.types ?? (config.options?.map((item) => item.value) ?? []);
      return;
    }
    if (config.defaultValue !== undefined) {
      values[config.id] = config.defaultValue;
      return;
    }
    if (config.input === "toggle") {
      values[config.id] = false;
      return;
    }
    if (config.input === "chips-multi" || config.input === "multi-select") {
      values[config.id] = config.options?.map((item) => item.value) ?? [];
      return;
    }
    values[config.id] = "";
  });
  return values;
}

function deriveLegacyFilterState(configs: CalendarFilterConfig[], values: CalendarFilterValues): CalendarFilterState {
  const initial: CalendarFilterState = {
    search: "",
    onlyMine: false,
    statuses: [],
    priorities: [],
    types: [],
  };
  configs.forEach((config) => {
    const current = values[config.id];
    if (config.bindTo === "search" && typeof current === "string") initial.search = current;
    if (config.bindTo === "onlyMine" && typeof current === "boolean") initial.onlyMine = current;
    if (config.bindTo === "statuses" && Array.isArray(current)) initial.statuses = current as EventStatus[];
    if (config.bindTo === "priorities" && Array.isArray(current)) initial.priorities = current as EventPriority[];
    if (config.bindTo === "types" && Array.isArray(current)) initial.types = current as EventType[];
  });
  return initial;
}

function getEventColor(
  event: CalendarEvent,
  mode: CalendarProps["eventColorMode"],
  priorityColors: Partial<Record<EventPriority, string>>,
  statusColors: Partial<Record<EventStatus, string>>,
  typeColors: Partial<Record<EventType, string>>,
): string {
  if (mode === "custom") {
    return event.color ?? priorityColors[event.priority] ?? "var(--calendar-priority-normal)";
  }
  if (mode === "status") {
    return statusColors[event.status] ?? "var(--calendar-priority-normal)";
  }
  if (mode === "type") {
    return typeColors[event.type] ?? "var(--calendar-priority-normal)";
  }
  return priorityColors[event.priority] ?? "var(--calendar-priority-normal)";
}

export function Calendar({
  events,
  onEventClick,
  onDateSelect,
  initialView = "month",
  initialDate = new Date(),
  currentUser,
  className,
  locale = "en-US",
  weekStartsOn = 1,
  showFilters = true,
  showSummary = false,
  showLegend = true,
  summaryCards,
  legendItems,
  visibleEventsLabel = (count) => `${count} visible events`,
  statusOptions = DEFAULT_STATUS_OPTIONS,
  priorityOptions = DEFAULT_PRIORITY_OPTIONS,
  typeOptions = DEFAULT_TYPE_OPTIONS,
  filters,
  eventColorMode = "priority",
  priorityColors = {
    normal: "var(--calendar-priority-normal)",
    high: "var(--calendar-priority-high)",
    critical: "var(--calendar-priority-critical)",
  },
  statusColors = {
    pending: "var(--calendar-warning)",
    overdue: "var(--calendar-danger)",
    completed: "var(--calendar-success)",
  },
  typeColors = {
    manual: "var(--calendar-priority-normal)",
    recurring: "var(--calendar-priority-high)",
    system: "var(--calendar-priority-critical)",
  },
  renderEventContent,
  defaultFilters,
  onFiltersChange,
  onFilterValuesChange,
  theme,
  renderers,
  classNames,
}: CalendarProps) {
  const [view, setView] = useState<CalendarView>(initialView);
  const [activeDate, setActiveDate] = useState<Date>(startOfDay(initialDate));

  const filterConfigs = useMemo(
    () => filters ?? getDefaultFilterConfigs(statusOptions, priorityOptions, typeOptions),
    [filters, priorityOptions, statusOptions, typeOptions],
  );

  const initialFilterValues = useMemo(
    () => buildInitialFilterValues(filterConfigs, defaultFilters),
    [defaultFilters, filterConfigs],
  );

  const [filterValues, setFilterValues] = useState<CalendarFilterValues>(initialFilterValues);

  const legacyFilters = useMemo(
    () => deriveLegacyFilterState(filterConfigs, filterValues),
    [filterConfigs, filterValues],
  );

  useEffect(() => {
    onFiltersChange?.(legacyFilters);
  }, [legacyFilters, onFiltersChange]);

  useEffect(() => {
    onFilterValuesChange?.(filterValues);
  }, [filterValues, onFilterValuesChange]);

  const normalizedEvents = useMemo(() => {
    return events.map((event) => ({
      ...event,
      date: toDate(event.date),
    }));
  }, [events]);

  const filteredEvents = useMemo(() => {
    return normalizedEvents
      .filter((event) => {
        return filterConfigs.every((config) => {
          const value = filterValues[config.id];
          if (config.bindTo === "search") {
            const search = (value as string).trim().toLowerCase();
            if (!search) return true;
            return [event.title, event.client, event.assignee].some((field) =>
              field.toLowerCase().includes(search),
            );
          }
          if (config.bindTo === "onlyMine") {
            const enabled = Boolean(value);
            if (!enabled) return true;
            return currentUser ? event.assignee === currentUser : true;
          }
          if (config.bindTo === "statuses") {
            const allowed = Array.isArray(value) ? value : [];
            return allowed.length === 0 ? false : allowed.includes(event.status);
          }
          if (config.bindTo === "priorities") {
            const allowed = Array.isArray(value) ? value : [];
            return allowed.length === 0 ? false : allowed.includes(event.priority);
          }
          if (config.bindTo === "types") {
            const allowed = Array.isArray(value) ? value : [];
            return allowed.length === 0 ? false : allowed.includes(event.type);
          }
          if (config.predicate) {
            return config.predicate(event, value, { currentUser, allValues: filterValues });
          }
          return true;
        });
      })
      .sort((a, b) => {
        const byDate = a.date.getTime() - b.date.getTime();
        if (byDate !== 0) return byDate;
        return a.start.localeCompare(b.start);
      });
  }, [currentUser, filterConfigs, filterValues, normalizedEvents]);

  const eventsByDay = useMemo(() => {
    const map = new Map<string, CalendarEvent[]>();
    filteredEvents.forEach((event) => {
      const key = formatDayKey(event.date);
      const items = map.get(key) ?? [];
      items.push(event);
      map.set(key, items);
    });
    return map;
  }, [filteredEvents]);

  const monthDays = useMemo(() => {
    const start = startOfWeek(startOfMonth(activeDate), weekStartsOn);
    return eachDayOfInterval(start, addDays(start, 41));
  }, [activeDate, weekStartsOn]);

  const weekDays = useMemo(() => {
    const start = startOfWeek(activeDate, weekStartsOn);
    return eachDayOfInterval(start, addDays(start, 6));
  }, [activeDate, weekStartsOn]);

  const weekDayLabels = useMemo(() => {
    const start = startOfWeek(activeDate, weekStartsOn);
    return eachDayOfInterval(start, addDays(start, 6)).map((day) =>
      new Intl.DateTimeFormat(locale, { weekday: "short" }).format(day),
    );
  }, [activeDate, locale, weekStartsOn]);

  const dayEvents = useMemo(() => {
    const key = formatDayKey(activeDate);
    return eventsByDay.get(key) ?? [];
  }, [activeDate, eventsByDay]);

  const summaryData = useMemo(() => {
    return summaryCards ?? getDefaultSummaryCards(filteredEvents, weekStartsOn);
  }, [filteredEvents, summaryCards, weekStartsOn]);

  const resolvedLegendItems = useMemo<CalendarLegendItem[]>(() => {
    if (legendItems) return legendItems;
    return [
      {
        id: "normal",
        label: priorityOptions.find((item) => item.value === "normal")?.label ?? "Normal",
        color: priorityColors.normal ?? "var(--calendar-priority-normal)",
      },
      {
        id: "high",
        label: priorityOptions.find((item) => item.value === "high")?.label ?? "High",
        color: priorityColors.high ?? "var(--calendar-priority-high)",
      },
      {
        id: "critical",
        label: priorityOptions.find((item) => item.value === "critical")?.label ?? "Critical",
        color: priorityColors.critical ?? "var(--calendar-priority-critical)",
      },
    ];
  }, [legendItems, priorityColors.critical, priorityColors.high, priorityColors.normal, priorityOptions]);

  const label = rangeLabel(activeDate, view, locale, weekStartsOn);
  const themeStyle = toThemeVariables(theme);
  const classes = useMemo(
    () => ({ ...DEFAULT_CLASSNAMES, ...(classNames ?? {}) }),
    [classNames],
  );

  const setFilterValue = useCallback((id: string, value: CalendarFilterValue) => {
    setFilterValues((prev) => ({ ...prev, [id]: value }));
  }, []);

  const toggleMulti = useCallback((id: string, value: string) => {
    setFilterValues((prev) => {
      const previous = Array.isArray(prev[id]) ? (prev[id] as string[]) : [];
      const next = previous.includes(value)
        ? previous.filter((item) => item !== value)
        : [...previous, value];
      return { ...prev, [id]: next };
    });
  }, []);

  const resetFilters = useCallback(() => {
    setFilterValues(initialFilterValues);
  }, [initialFilterValues]);

  const goToToday = useCallback(() => setActiveDate(startOfDay(new Date())), []);
  const goToNext = useCallback(() => {
    setActiveDate((prev) => {
      if (view === "month") return addMonths(prev, 1);
      if (view === "week") return addDays(prev, 7);
      return addDays(prev, 1);
    });
  }, [view]);
  const goToPrevious = useCallback(() => {
    setActiveDate((prev) => {
      if (view === "month") return addMonths(prev, -1);
      if (view === "week") return addDays(prev, -7);
      return addDays(prev, -1);
    });
  }, [view]);

  const handleKeyboardDateNavigation = useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      let step = 0;
      if (event.key === "ArrowLeft") step = -1;
      if (event.key === "ArrowRight") step = 1;
      if (event.key === "ArrowUp") step = view === "month" ? -7 : -1;
      if (event.key === "ArrowDown") step = view === "month" ? 7 : 1;
      if (step === 0) return;
      event.preventDefault();
      setActiveDate((prev) => addDays(prev, step));
    },
    [view],
  );

  const renderButton = (props: CalendarButtonRendererProps) => {
    if (renderers?.Button) return renderers.Button(props);
    return (
      <button
        type="button"
        className={props.className}
        aria-label={props.ariaLabel}
        role={props.role}
        aria-selected={props.ariaSelected}
        onClick={props.onClick}
      >
        {props.children}
      </button>
    );
  };

  const renderInput = (props: CalendarInputRendererProps) => {
    if (renderers?.Input) return renderers.Input(props);
    return (
      <input
        type="text"
        className={props.className}
        value={props.value}
        onChange={(event) => props.onChange(event.target.value)}
        placeholder={props.placeholder}
        aria-label={props.ariaLabel}
      />
    );
  };

  const renderSelect = (props: CalendarSelectRendererProps) => {
    if (renderers?.Select) return renderers.Select(props);
    return (
      <select
        className={props.className}
        aria-label={props.ariaLabel}
        multiple={props.multiple}
        value={props.value as string | string[]}
        onChange={(event) => {
          if (props.multiple) {
            const value = Array.from(event.target.selectedOptions).map((option) => option.value);
            props.onChange(value);
          } else {
            props.onChange(event.target.value);
          }
        }}
      >
        {props.options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    );
  };

  const renderSwitch = (props: CalendarSwitchRendererProps) => {
    if (renderers?.Switch) return renderers.Switch(props);
    return (
      <label className={props.className}>
        <input
          type="checkbox"
          checked={props.checked}
          onChange={(event) => props.onChange(event.target.checked)}
          aria-label={props.ariaLabel}
        />
        <span>{props.label}</span>
      </label>
    );
  };

  const renderFilterControl = (config: CalendarFilterConfig) => {
    const value = filterValues[config.id];

    if (config.input === "text") {
      return renderInput({
        className: classes.input,
        value: typeof value === "string" ? value : "",
        onChange: (nextValue) => setFilterValue(config.id, nextValue),
        placeholder: config.placeholder,
        ariaLabel: config.label,
      });
    }

    if (config.input === "toggle") {
      return renderSwitch({
        className: classes.switch,
        checked: Boolean(value),
        onChange: (checked) => setFilterValue(config.id, checked),
        label: config.label,
        ariaLabel: config.label,
      });
    }

    if (config.input === "single-select") {
      return renderSelect({
        className: classes.select,
        value: typeof value === "string" ? value : "",
        onChange: (nextValue) => setFilterValue(config.id, nextValue),
        ariaLabel: config.label,
        options: config.options ?? [],
      });
    }

    if (config.input === "multi-select") {
      const selected = Array.isArray(value) ? (value as string[]) : [];
      return renderSelect({
        className: cn(classes.select, classes.selectMulti),
        value: selected,
        multiple: true,
        onChange: (nextValue) => setFilterValue(config.id, nextValue),
        ariaLabel: config.label,
        options: config.options ?? [],
      });
    }

    if (config.input === "chips-single") {
      return (
        <div className={classes.filterGroup} role="group" aria-label={config.label}>
          {config.options?.map((option) => (
            <React.Fragment key={option.value}>
              {renderers?.Chip ? (
                renderers.Chip({
                  className: cn(classes.chip, value === option.value && classes.chipSelected),
                  label: option.label,
                  color: option.color,
                  selected: value === option.value,
                  onClick: () => setFilterValue(config.id, option.value),
                })
              ) : (
                <button
                  type="button"
                  className={cn(classes.chip, value === option.value && classes.chipSelected)}
                  style={{ "--calendar-chip-color": option.color } as CSSProperties}
                  onClick={() => setFilterValue(config.id, option.value)}
                >
                  {option.label}
                </button>
              )}
            </React.Fragment>
          ))}
        </div>
      );
    }

    return (
      <div className={classes.filterGroup} role="group" aria-label={config.label}>
        {config.options?.map((option) => (
          <React.Fragment key={option.value}>
            {renderers?.Chip ? (
              renderers.Chip({
                className: cn(
                  classes.chip,
                  Array.isArray(value) && value.includes(option.value) && classes.chipSelected,
                ),
                label: option.label,
                color: option.color,
                selected: Array.isArray(value) && value.includes(option.value),
                onClick: () => toggleMulti(config.id, option.value),
              })
            ) : (
              <button
                type="button"
                className={cn(
                  classes.chip,
                  Array.isArray(value) && value.includes(option.value) && classes.chipSelected,
                )}
                style={{ "--calendar-chip-color": option.color } as CSSProperties}
                onClick={() => toggleMulti(config.id, option.value)}
              >
                {option.label}
              </button>
            )}
          </React.Fragment>
        ))}
      </div>
    );
  };

  const renderEvent = (eventItem: CalendarEvent) => {
    const eventColor = getEventColor(
      eventItem,
      eventColorMode,
      priorityColors,
      statusColors,
      typeColors,
    );
    const eventStyle = {
      "--calendar-event-color": eventColor,
    } as CSSProperties;

    return (
      <button
        key={eventItem.id}
        type="button"
        className={classes.eventButton}
        style={eventStyle}
        onClick={() => onEventClick?.(eventItem)}
        aria-label={`Open event ${eventItem.title}`}
      >
        {renderEventContent ? (
          renderEventContent(eventItem)
        ) : (
          <span className={classes.eventContent}>
            <span className={classes.eventTitle}>{eventItem.title}</span>
            <span className={classes.eventTime}>
              {eventItem.start}-{eventItem.end}
            </span>
            {eventItem.tags && eventItem.tags.length > 0 && (
              <span className={classes.eventTags}>
                {eventItem.tags.map((tag) => (
                  <React.Fragment key={tag.id}>
                    {renderers?.EventTag ? (
                      renderers.EventTag({
                        className: classes.eventTag,
                        label: tag.label,
                        color: tag.color,
                        textColor: tag.textColor,
                      })
                    ) : (
                      <span
                        className={classes.eventTag}
                        style={
                          {
                            "--calendar-tag-bg": tag.color ?? "var(--calendar-chip-bg)",
                            "--calendar-tag-color": tag.textColor ?? "var(--calendar-text)",
                          } as CSSProperties
                        }
                      >
                        {tag.label}
                      </span>
                    )}
                  </React.Fragment>
                ))}
              </span>
            )}
          </span>
        )}
      </button>
    );
  };

  const filterRows = useMemo(() => {
    const row1 = filterConfigs.filter((config) => (config.row ?? 1) === 1);
    const row2 = filterConfigs.filter((config) => (config.row ?? 1) === 2);
    return [row1, row2].filter((row) => row.length > 0);
  }, [filterConfigs]);

  return (
    <section
      className={cn(classes.page, className)}
      aria-label="Calendar"
      style={themeStyle}
    >
      {showSummary && (
        <section className={classes.summaryGrid} aria-label="Summary cards">
          {summaryData.map((card) => (
            <React.Fragment key={card.id}>
              {renderers?.StatCard ? (
                renderers.StatCard({
                  className: classes.summaryCard,
                  label: card.label,
                  value: card.value,
                  color: card.color,
                })
              ) : (
                <article className={classes.summaryCard}>
                  <h3>{card.label}</h3>
                  <p className="calendar-stat-number" style={{ color: card.color }}>
                    {card.value}
                  </p>
                </article>
              )}
            </React.Fragment>
          ))}
        </section>
      )}

      {showFilters && (
        <section className={classes.filters} aria-label="Filters">
          {filterRows.map((row, rowIndex) => (
            <div key={rowIndex} className={classes.filterRow}>
              {row.map((config) => (
                <div key={config.id} className={classes.filterItem}>
                  {config.input !== "toggle" && (
                    <label className={classes.filterLabel}>{config.label}</label>
                  )}
                  {renderFilterControl(config)}
                </div>
              ))}
              {rowIndex === 0 && (
                renderButton({
                  className: classes.resetButton,
                  onClick: resetFilters,
                  children: "Reset Filters",
                })
              )}
            </div>
          ))}
        </section>
      )}

      <header className={classes.header}>
        <div className={classes.nav} role="group" aria-label="Calendar navigation">
          {renderButton({
            className: classes.navButton,
            onClick: goToPrevious,
            ariaLabel: "Go to previous period",
            children: "Prev",
          })}
          {renderButton({
            className: classes.navButton,
            onClick: goToToday,
            ariaLabel: "Go to today",
            children: "Today",
          })}
          {renderButton({
            className: classes.navButton,
            onClick: goToNext,
            ariaLabel: "Go to next period",
            children: "Next",
          })}
        </div>
        <h2 className={classes.title}>{label}</h2>
        <div className={classes.views} role="tablist" aria-label="Calendar views">
          {VIEW_OPTIONS.map((viewOption) => (
            <React.Fragment key={viewOption}>
              {renderButton({
                className: cn(classes.viewButton, view === viewOption && classes.viewButtonActive),
                active: view === viewOption,
                role: "tab",
                ariaSelected: view === viewOption,
                onClick: () => setView(viewOption),
                children: viewOption,
              })}
            </React.Fragment>
          ))}
        </div>
      </header>

      {showLegend && (
        <div className={classes.toolbar} aria-label="Legend">
          {resolvedLegendItems.map((item) => (
            <span key={item.id} className={classes.legendItem}>
              <span className={classes.legendDot} style={{ background: item.color }} />
              {item.label}
            </span>
          ))}
          <span className={classes.visibleCount}>{visibleEventsLabel(filteredEvents.length)}</span>
        </div>
      )}

      <div className={classes.body} onKeyDown={handleKeyboardDateNavigation} tabIndex={0} aria-label="Calendar content">
        {view === "month" && (
          <>
            <div className={classes.weekdays} aria-hidden="true">
              {weekDayLabels.map((name) => (
                <div key={name} className={classes.weekday}>
                  {name}
                </div>
              ))}
            </div>
            <div className={classes.monthGrid} role="grid" aria-label="Month view">
              {monthDays.map((day) => {
                const key = formatDayKey(day);
                const dayEventsList = eventsByDay.get(key) ?? [];
                const selected = isSameDay(day, activeDate);
                const outside = !isSameMonth(day, activeDate);
                return (
                  <div
                    key={key}
                    className={cn(classes.cell, outside && classes.cellMuted, selected && classes.cellSelected)}
                  >
                    <button
                      type="button"
                      className={classes.dayButton}
                      onClick={() => {
                        setActiveDate(day);
                        onDateSelect?.(day);
                      }}
                      aria-label={`Select ${day.toDateString()}`}
                    >
                      {day.getDate()}
                    </button>
                    <div className={classes.events}>
                      {dayEventsList.slice(0, 3).map(renderEvent)}
                      {dayEventsList.length > 3 && (
                        <span className={classes.more}>+{dayEventsList.length - 3} more</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {view === "week" && (
          <div className={classes.weekGrid} role="grid" aria-label="Week view">
            {weekDays.map((day) => {
              const key = formatDayKey(day);
              const dayEventsList = eventsByDay.get(key) ?? [];
              return (
                <div key={key} className={cn(classes.cell, isSameDay(day, activeDate) && classes.cellSelected)}>
                  <button
                    type="button"
                    className={classes.dayButton}
                    onClick={() => {
                      setActiveDate(day);
                      onDateSelect?.(day);
                    }}
                    aria-label={`Select ${day.toDateString()}`}
                  >
                    {formatEventDate(day, locale)}
                  </button>
                  <div className={classes.events}>{dayEventsList.map(renderEvent)}</div>
                </div>
              );
            })}
          </div>
        )}

        {view === "day" && (
          <section className={classes.list} aria-label="Day view">
            <h3 className={classes.subtitle}>{formatEventDate(activeDate, locale)}</h3>
            {dayEvents.length === 0 && <p className={classes.empty}>No events for this day.</p>}
            {dayEvents.map(renderEvent)}
          </section>
        )}

        {view === "agenda" && (
          <section className={classes.list} aria-label="Agenda view">
            {filteredEvents.length === 0 && <p className={classes.empty}>No events match current filters.</p>}
            {filteredEvents.map(renderEvent)}
          </section>
        )}
      </div>
    </section>
  );
}
