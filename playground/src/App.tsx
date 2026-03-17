import { Calendar, type CalendarEvent } from "@nicola9779/nicalendar-custom";
import "@nicola9779/nicalendar-custom/styles.css";

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

export default function App() {
  return (
    <div style={{ padding: 16 }}>
      <Calendar
        events={events}
        initialView="month"
        currentUser="Nico"
        showSummary
        showLegend
      />
    </div>
  );
}
