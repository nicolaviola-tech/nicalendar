import type { CalendarEvent } from "../types";

const BASE_YEAR = 2026;
const BASE_MONTH = 2; // March (0-indexed)

export const mockEvents: CalendarEvent[] = [
  {
    id: "evt-001",
    title: "Policy renewal",
    date: new Date(BASE_YEAR, BASE_MONTH, 3),
    start: "10:00",
    end: "11:00",
    client: "Northwind Corp",
    assignee: "Nico",
    status: "pending",
    priority: "normal",
    type: "manual",
    tags: [{ id: "tag-call", label: "Call", color: "#ecfeff", textColor: "#0f766e" }],
  },
  {
    id: "evt-002",
    title: "ABTG follow-up",
    date: new Date(BASE_YEAR, BASE_MONTH, 4),
    start: "13:00",
    end: "14:00",
    client: "ABTG",
    assignee: "Marco",
    status: "pending",
    priority: "high",
    type: "recurring",
    tags: [{ id: "tag-task", label: "Task", color: "#eef2ff", textColor: "#4338ca" }],
  },
  {
    id: "evt-003",
    title: "Rights request review",
    date: new Date(BASE_YEAR, BASE_MONTH, 5),
    start: "15:00",
    end: "16:00",
    client: "Contoso",
    assignee: "Nico",
    status: "overdue",
    priority: "critical",
    type: "system",
  },
  {
    id: "evt-004",
    title: "Client sync",
    date: new Date(BASE_YEAR, BASE_MONTH, 19),
    start: "09:30",
    end: "10:15",
    client: "Fabrikam",
    assignee: "Laura",
    status: "completed",
    priority: "normal",
    type: "manual",
  },
  {
    id: "evt-005",
    title: "DPIA internal review",
    date: new Date(BASE_YEAR, BASE_MONTH, 12),
    start: "14:00",
    end: "15:30",
    client: "Initech",
    assignee: "Nico",
    status: "pending",
    priority: "high",
    type: "manual",
  },
  {
    id: "evt-006",
    title: "Complaint triage",
    date: new Date(BASE_YEAR, BASE_MONTH, 14),
    start: "11:00",
    end: "12:00",
    client: "Globex",
    assignee: "Marco",
    status: "overdue",
    priority: "critical",
    type: "system",
  },
];

export const criticalEventsOnly: CalendarEvent[] = mockEvents.filter((event) => event.priority === "critical");
export const completedEventsOnly: CalendarEvent[] = mockEvents.filter((event) => event.status === "completed");

export const manyEvents: CalendarEvent[] = Array.from({ length: 120 }, (_, index) => {
  const day = (index % 28) + 1;
  const status = index % 3 === 0 ? "pending" : index % 3 === 1 ? "overdue" : "completed";
  const priority = index % 3 === 0 ? "normal" : index % 3 === 1 ? "high" : "critical";
  const type = index % 3 === 0 ? "manual" : index % 3 === 1 ? "recurring" : "system";

  return {
    id: `stress-${index + 1}`,
    title: `Load test event ${index + 1}`,
    date: new Date(BASE_YEAR, BASE_MONTH, day),
    start: `${String(8 + (index % 9)).padStart(2, "0")}:00`,
    end: `${String(9 + (index % 9)).padStart(2, "0")}:00`,
    client: `Client ${index + 1}`,
    assignee: index % 2 === 0 ? "Nico" : "Marco",
    status,
    priority,
    type,
  };
});
