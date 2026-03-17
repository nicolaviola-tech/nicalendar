import { Calendar, type CalendarEvent } from "@nicalendar/custom";
import "@nicalendar/custom/styles.css";

const now = new Date();
const events: CalendarEvent[] = [
  {
    id: "a1",
    title: "Kickoff",
    date: now,
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
  return (
    <div style={{ padding: 16 }}>
      <Calendar events={events} initialView="month" currentUser="Nico" />
    </div>
  );
}
