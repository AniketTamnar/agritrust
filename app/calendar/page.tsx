"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

// 🔴 Holidays (Red)
const holidays: Record<string, string[]> = {
  "2025-01-01": ["New Year"],
  "2025-01-14": ["Makar Sankranti"],
  "2025-03-17": ["Holi"],
  "2025-04-14": ["Ambedkar Jayanti"],
  "2025-08-15": ["Independence Day"],
  "2025-10-02": ["Gandhi Jayanti"],
  "2025-10-20": ["Dussehra"],
  "2025-11-01": ["Diwali"],
  "2025-12-25": ["Christmas"],
  "2025-01-26": ["Republic Day"],
};

export default function CalendarPage() {
  const today = new Date();
  const [dark, setDark] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());

  // Events
  const [events, setEvents] = useState<any[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<any | null>(null);

  // Add event form
  const [newDate, setNewDate] = useState("");
  const [newTitle, setNewTitle] = useState("");
  const [repeat, setRepeat] = useState("none");

  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("agritrust-auth")
      : null;

  const monthNames = [
    "January","February","March","April","May","June",
    "July","August","September","October","November","December",
  ];

  // Load events
  const loadEvents = async () => {
    const res = await fetch("http://localhost:4000/api/events", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setEvents(data);
  };

  useEffect(() => {
    loadEvents();
  }, []);

  // Add event
  const handleAddEvent = async () => {
    if (!newDate || !newTitle) return alert("Please fill all fields!");

    await fetch("http://localhost:4000/api/events", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ title: newTitle, date: newDate, repeat }),
    });

    setNewDate("");
    setNewTitle("");
    setRepeat("none");

    loadEvents();
  };

  // Delete event
  const deleteEvent = async (id: string) => {
    if (!confirm("Delete this event?")) return;

    await fetch(`http://localhost:4000/api/events/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    loadEvents();
  };

  // Edit event
  const editEvent = async () => {
    if (!selectedEvent) return;

    await fetch(`http://localhost:4000/api/events/${selectedEvent._id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(selectedEvent),
    });

    setSelectedEvent(null);
    loadEvents();
  };

  // Calendar logic
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDay = new Date(currentYear, currentMonth, 1).getDay();

  const goMonth = (offset: number) => {
    let m = currentMonth + offset;
    let y = currentYear;

    if (m < 0) { m = 11; y--; }
    else if (m > 11) { m = 0; y++; }

    setCurrentMonth(m);
    setCurrentYear(y);
  };

  // Group user events by date
  const eventsByDate: Record<string, any[]> = {};
  events.forEach((e) => {
    if (!eventsByDate[e.date]) eventsByDate[e.date] = [];
    eventsByDate[e.date].push(e);
  });

  return (
    <div className={`min-h-screen flex transition-all ${dark ? "bg-gray-900 text-white" : "bg-gray-100"}`}>

      {/* ------------------------------------ */}
      {/* LEFT SIDEBAR (Add Event + Lists) */}
      {/* ------------------------------------ */}
      <div className={`w-80 p-6 shadow-xl h-screen overflow-y-auto ${dark ? "bg-gray-800" : "bg-white"}`}>
        
        {/* Theme Switch */}
        <button
          onClick={() => setDark(!dark)}
          className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg mb-6"
        >
          {dark ? "🌞 Light Mode" : "🌙 Dark Mode"}
        </button>

        {/* Add Event */}
        <div className={`${dark ? "bg-gray-700" : "bg-gray-50"} p-4 rounded-lg shadow mb-6`}>
          <h3 className="text-xl font-bold mb-3">➕ Add Event</h3>

          <input
            type="date"
            value={newDate}
            onChange={(e) => setNewDate(e.target.value)}
            className="w-full p-2 border rounded mb-2 text-black"
          />

          <input
            type="text"
            placeholder="Event Title"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            className="w-full p-2 border rounded mb-2 text-black"
          />

          <select
            value={repeat}
            onChange={(e) => setRepeat(e.target.value)}
            className="w-full p-2 border rounded mb-3 text-black"
          >
            <option value="none">One Time</option>
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
            <option value="yearly">Yearly</option>
          </select>

          <button
            onClick={handleAddEvent}
            className="w-full bg-green-600 py-2 text-white rounded"
          >
            Save Event
          </button>
        </div>

        {/* User Events List */}
        <div className="mb-6">
          <h3 className="font-bold text-lg mb-2">📝 Your Events</h3>

          {events.map((ev, i) => (
            <div
              key={i}
              className="p-2 bg-blue-50 text-blue-800 rounded mb-2 cursor-pointer"
              onClick={() => setSelectedEvent(ev)}
            >
              📌 {ev.title}  
              <br />
              <span className="text-xs text-gray-500">{ev.date}</span>
            </div>
          ))}
        </div>

        {/* Holiday List */}
        <div>
          <h3 className="font-bold text-lg mb-2">🎉 Holidays</h3>

          {Object.entries(holidays).map(([date, list], i) => (
            <div key={i} className="p-2 bg-red-100 text-red-700 rounded mb-2">
              <b>{date}</b>  
              <br />
              {list.join(", ")}
            </div>
          ))}
        </div>
      </div>

      {/* ------------------------------------ */}
      {/* MAIN CALENDAR */}
      {/* ------------------------------------ */}
      <div className="flex-1 p-10">

        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <button onClick={() => goMonth(-1)} className="px-4 py-2 bg-blue-600 text-white rounded">
            ⬅ Prev
          </button>

          <h1 className="text-4xl font-bold">
            {monthNames[currentMonth]} {currentYear}
          </h1>

          <button onClick={() => goMonth(1)} className="px-4 py-2 bg-blue-600 text-white rounded">
            Next ➡
          </button>
        </div>

        {/* Weekdays */}
        <div className="grid grid-cols-7 gap-3 text-center font-bold opacity-70 mb-3">
          {["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map((d) => (
            <div key={d}>{d}</div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-4">
          {Array.from({ length: firstDay }).map((_, i) => <div key={i}></div>)}

          {Array.from({ length: daysInMonth }, (_, d) => {
            const day = d + 1;
            const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2,"0")}-${String(day).padStart(2,"0")}`;

            const isHoliday = holidays[dateStr];
            const userEventsHere = eventsByDate[dateStr] || [];

            const isToday =
              today.getDate() === day &&
              today.getMonth() === currentMonth &&
              today.getFullYear() === currentYear;

            return (
              <motion.div
                key={day}
                whileHover={{ scale: 1.05 }}
                className={`p-4 rounded-xl shadow cursor-pointer transition
                  ${dark ? "bg-gray-800" : "bg-white"}
                  ${isToday ? "border-2 border-blue-500" : ""}
                `}
              >
                {/* Date Number */}
                <div
                  className={`text-lg font-bold w-10 h-10 flex items-center justify-center rounded-full mx-auto mb-2 ${
                    isHoliday
                      ? "bg-red-600 text-white"
                      : isToday
                      ? "bg-blue-600 text-white"
                      : dark
                      ? "text-white"
                      : "text-gray-800"
                  }`}
                >
                  {day}
                </div>

                {/* Holiday Label */}
                {isHoliday &&
                  isHoliday.map((h, idx) => (
                    <div key={idx} className="text-xs text-red-600 text-center mb-1">
                      {h}
                    </div>
                  ))}

                {/* User Events */}
                {userEventsHere.map((ev, idx) => (
                  <div
                    key={idx}
                    onClick={() => setSelectedEvent(ev)}
                    className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded mb-1"
                  >
                    {ev.title}
                  </div>
                ))}
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* EDIT MODAL */}
      {selectedEvent && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center">
          <div className="bg-white text-black p-6 rounded-lg w-96">
            <h2 className="text-xl font-bold mb-3">Edit Event</h2>

            <input
              type="text"
              value={selectedEvent.title}
              onChange={(e) =>
                setSelectedEvent({ ...selectedEvent, title: e.target.value })
              }
              className="w-full mb-2 border p-2 rounded"
            />

            <input
              type="date"
              value={selectedEvent.date}
              onChange={(e) =>
                setSelectedEvent({ ...selectedEvent, date: e.target.value })
              }
              className="w-full mb-2 border p-2 rounded"
            />

            <select
              value={selectedEvent.repeat}
              onChange={(e) =>
                setSelectedEvent({ ...selectedEvent, repeat: e.target.value })
              }
              className="w-full mb-4 border p-2 rounded"
            >
              <option value="none">One Time</option>
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly</option>
            </select>

            <div className="flex gap-3">
              <button
                onClick={editEvent}
                className="px-4 py-2 bg-green-600 text-white rounded"
              >
                Save
              </button>

              <button
                onClick={() => deleteEvent(selectedEvent._id)}
                className="px-4 py-2 bg-red-600 text-white rounded"
              >
                Delete
              </button>

              <button
                onClick={() => setSelectedEvent(null)}
                className="px-4 py-2 bg-gray-500 text-white rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
