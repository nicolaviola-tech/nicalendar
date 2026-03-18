import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Calendar } from "./Calendar";
import type { CalendarEvent } from "./types";

const baseDate = new Date("2026-03-03T09:00:00.000Z");

const sampleEvents: CalendarEvent[] = [
  {
    id: "evt-1",
    title: "Policy renewal",
    date: new Date("2026-03-03T00:00:00.000Z"),
    start: "10:00",
    end: "11:00",
    client: "Northwind",
    assignee: "Nico",
    status: "pending",
    priority: "normal",
    type: "manual",
  },
];

describe("Calendar", () => {
  it("renders safely with undefined events", () => {
    render(<Calendar events={undefined} initialDate={baseDate} />);
    expect(screen.getByLabelText("Calendar")).toBeInTheDocument();
    expect(screen.getByText("0 visible events")).toBeInTheDocument();
  });

  it("renders events in month view", () => {
    render(<Calendar events={sampleEvents} initialDate={baseDate} />);
    expect(screen.getByText("Policy renewal")).toBeInTheDocument();
  });

  it("switches to week view", () => {
    render(<Calendar events={sampleEvents} initialDate={baseDate} />);
    fireEvent.click(screen.getByRole("tab", { name: "Week" }));
    expect(screen.getByLabelText("Week view")).toBeInTheDocument();
  });

  it("calls onEventClick when an event is clicked", () => {
    const onEventClick = vi.fn();
    render(<Calendar events={sampleEvents} initialDate={baseDate} onEventClick={onEventClick} />);
    fireEvent.click(screen.getByRole("button", { name: /open event policy renewal/i }));
    expect(onEventClick).toHaveBeenCalledTimes(1);
    expect(onEventClick).toHaveBeenCalledWith(expect.objectContaining({ id: "evt-1" }));
  });
});
