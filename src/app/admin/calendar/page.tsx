"use client";

import { useEffect, useState } from "react";
import {
  CalendarDays, ChevronLeft, ChevronRight, Plus, X,
  Clock, MapPin, User, Phone, Video, AlertCircle,
  CheckCircle2, Building2,
} from "lucide-react";
import { supabase } from "@/lib/supabase";

// ── Types ─────────────────────────────────────────────────────────────────────

type AppointmentType = "Site Visit" | "Client Meeting" | "Contract Signing" | "Inspection" | "Open House" | "Team Meeting" | "Call" | "Other";

interface Appointment {
  id: string;
  title: string;
  appointment_type: AppointmentType;
  status: "Scheduled" | "Completed" | "Cancelled" | "No Show";
  start_time: string;
  end_time: string;
  location: string | null;
  is_virtual: boolean;
  contact_name: string | null;
  notes: string | null;
}

// ── Config ────────────────────────────────────────────────────────────────────

const TYPE_CFG: Record<AppointmentType, { color: string; bg: string; dot: string }> = {
  "Site Visit":       { color: "text-indigo-700",  bg: "bg-indigo-100",  dot: "bg-indigo-500"  },
  "Client Meeting":   { color: "text-violet-700",  bg: "bg-violet-100",  dot: "bg-violet-500"  },
  "Contract Signing": { color: "text-emerald-700", bg: "bg-emerald-100", dot: "bg-emerald-500" },
  "Inspection":       { color: "text-amber-700",   bg: "bg-amber-100",   dot: "bg-amber-500"   },
  "Open House":       { color: "text-rose-700",    bg: "bg-rose-100",    dot: "bg-rose-500"    },
  "Team Meeting":     { color: "text-blue-700",    bg: "bg-blue-100",    dot: "bg-blue-500"    },
  "Call":             { color: "text-teal-700",    bg: "bg-teal-100",    dot: "bg-teal-500"    },
  "Other":            { color: "text-slate-600",   bg: "bg-slate-100",   dot: "bg-slate-400"   },
};

const DAYS = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const APPOINTMENT_TYPES: AppointmentType[] = ["Site Visit","Client Meeting","Contract Signing","Inspection","Open House","Team Meeting","Call","Other"];

// ── Mock data ─────────────────────────────────────────────────────────────────

const today = new Date();
const y = today.getFullYear();
const m = today.getMonth();

function makeAppt(id: string, title: string, type: AppointmentType, day: number, startH: number, endH: number, location: string | null, contact: string | null, virtual = false): Appointment {
  return {
    id, title, appointment_type: type, status: "Scheduled",
    start_time: new Date(y, m, day, startH, 0).toISOString(),
    end_time:   new Date(y, m, day, endH, 0).toISOString(),
    location, is_virtual: virtual, contact_name: contact, notes: null,
  };
}

const MOCK_APPOINTMENTS: Appointment[] = [
  makeAppt("a1","Site Visit — 42 Maple Street",       "Site Visit",       today.getDate(),     10, 11, "42 Maple Street, Toronto",      "Thomas Morrison"),
  makeAppt("a2","Contract Signing — Lakeview Drive",  "Contract Signing", today.getDate(),     14, 15, "HomeHaven Office",              "Aisha Patel"),
  makeAppt("a3","Client Meeting — Aisha Patel",       "Client Meeting",   today.getDate() + 1, 9,  10, null,                            "Aisha Patel", true),
  makeAppt("a4","Open House — Cedar Hills Drive",     "Open House",       today.getDate() + 2, 11, 14, "34 Cedar Hills Dr, Regina",     null),
  makeAppt("a5","Inspection — Harbor Blvd",           "Inspection",       today.getDate() + 2, 15, 16, "93 Harbor Blvd, Montreal",      "Linda Cheng"),
  makeAppt("a6","Team Meeting — Weekly Sync",         "Team Meeting",     today.getDate() + 3, 9,  10, "HomeHaven Office",              null),
  makeAppt("a7","Call — Marcus Reid Follow-up",       "Call",             today.getDate() + 4, 11, 11, null,                            "Marcus Reid", true),
  makeAppt("a8","Site Visit — Rosewood Blvd",         "Site Visit",       today.getDate() + 5, 13, 14, "11 Rosewood Blvd, Winnipeg",    "Mike Roberts"),
];

// ── New Appointment Modal ─────────────────────────────────────────────────────

function NewApptModal({ onClose, onSave }: { onClose: () => void; onSave: (a: Appointment) => void }) {
  const [form, setForm] = useState({
    title: "", appointment_type: "Site Visit" as AppointmentType,
    start_time: "", end_time: "", location: "", contact_name: "", is_virtual: false, notes: "",
  });
  const set = (k: string, v: string | boolean) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = () => {
    if (!form.title || !form.start_time) return;
    onSave({ id: Date.now().toString(), ...form, status: "Scheduled", location: form.location || null, contact_name: form.contact_name || null, notes: form.notes || null });
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl border border-[#E8E6E0] shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-5 border-b border-[#F0EDE6] sticky top-0 bg-white">
          <h2 className="text-[16px] font-bold text-[#111]">New Appointment</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-[#F4F5F7] text-[#A8A49C]"><X size={15} /></button>
        </div>
        <div className="p-5 space-y-3">
          <div>
            <label className="block text-[11px] font-semibold text-[#7C7870] uppercase tracking-wide mb-1">Title</label>
            <input value={form.title} onChange={(e) => set("title", e.target.value)} placeholder="Appointment title"
              className="w-full bg-[#F4F5F7] border border-[#E8E6E0] rounded-xl px-3 py-2.5 text-[13px] text-[#111] outline-none focus:border-indigo-400" />
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-[#7C7870] uppercase tracking-wide mb-1">Type</label>
            <select value={form.appointment_type} onChange={(e) => set("appointment_type", e.target.value)}
              className="w-full bg-[#F4F5F7] border border-[#E8E6E0] rounded-xl px-3 py-2.5 text-[13px] text-[#7C7870] outline-none">
              {APPOINTMENT_TYPES.map((t) => <option key={t}>{t}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-[#7C7870] uppercase tracking-wide mb-1">Start</label>
              <input type="datetime-local" value={form.start_time} onChange={(e) => set("start_time", e.target.value)}
                className="w-full bg-[#F4F5F7] border border-[#E8E6E0] rounded-xl px-3 py-2.5 text-[13px] text-[#111] outline-none focus:border-indigo-400" />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-[#7C7870] uppercase tracking-wide mb-1">End</label>
              <input type="datetime-local" value={form.end_time} onChange={(e) => set("end_time", e.target.value)}
                className="w-full bg-[#F4F5F7] border border-[#E8E6E0] rounded-xl px-3 py-2.5 text-[13px] text-[#111] outline-none focus:border-indigo-400" />
            </div>
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-[#7C7870] uppercase tracking-wide mb-1">Location</label>
            <input value={form.location} onChange={(e) => set("location", e.target.value)} placeholder="Address or meeting link"
              className="w-full bg-[#F4F5F7] border border-[#E8E6E0] rounded-xl px-3 py-2.5 text-[13px] text-[#111] outline-none focus:border-indigo-400" />
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-[#7C7870] uppercase tracking-wide mb-1">Contact</label>
            <input value={form.contact_name} onChange={(e) => set("contact_name", e.target.value)} placeholder="Contact name"
              className="w-full bg-[#F4F5F7] border border-[#E8E6E0] rounded-xl px-3 py-2.5 text-[13px] text-[#111] outline-none focus:border-indigo-400" />
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={form.is_virtual} onChange={(e) => set("is_virtual", e.target.checked)}
              className="w-4 h-4 rounded accent-indigo-500" />
            <span className="text-[13px] text-[#7C7870]">Virtual meeting</span>
          </label>
          <div className="flex gap-2 pt-1">
            <button onClick={onClose} className="flex-1 border border-[#E8E6E0] rounded-xl py-2.5 text-[13px] font-semibold text-[#7C7870] hover:bg-[#F4F5F7] transition-colors">Cancel</button>
            <button onClick={handleSubmit} disabled={!form.title || !form.start_time}
              className="flex-1 bg-[#111] hover:bg-[#222] disabled:opacity-40 text-white text-[13px] font-semibold py-2.5 rounded-xl transition-colors">
              Save Appointment
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function CalendarPage() {
  const [appointments, setAppointments] = useState<Appointment[]>(MOCK_APPOINTMENTS);
  const [usingMock, setUsingMock]       = useState(true);
  const [loading, setLoading]           = useState(true);
  const [currentDate, setCurrentDate]   = useState(new Date());
  const [showModal, setShowModal]       = useState(false);
  const [selected, setSelected]         = useState<Appointment | null>(null);

  useEffect(() => {
    supabase.from("appointments").select("*").order("start_time", { ascending: true })
      .then(({ data }) => {
        if (data && data.length > 0) { setAppointments(data as Appointment[]); setUsingMock(false); }
        setLoading(false);
      });
  }, []);

  const year  = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  const apptsByDay = appointments.reduce<Record<number, Appointment[]>>((acc, a) => {
    const d = new Date(a.start_time);
    if (d.getFullYear() === year && d.getMonth() === month) {
      const day = d.getDate();
      if (!acc[day]) acc[day] = [];
      acc[day].push(a);
    }
    return acc;
  }, {});

  const todayAppts = appointments.filter((a) => {
    const d = new Date(a.start_time);
    const t = new Date();
    return d.getDate() === t.getDate() && d.getMonth() === t.getMonth() && d.getFullYear() === t.getFullYear();
  });

  const upcomingAppts = appointments
    .filter((a) => new Date(a.start_time) >= new Date())
    .sort((a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime())
    .slice(0, 8);

  const fmtTime = (iso: string) => new Date(iso).toLocaleTimeString("en-CA", { hour: "2-digit", minute: "2-digit" });
  const fmtDate = (iso: string) => new Date(iso).toLocaleDateString("en-CA", { month: "short", day: "numeric" });

  return (
    <div className="flex flex-col h-full">
      <div className="px-6 py-5 bg-white border-b border-[#E8E6E0] flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-[20px] font-bold text-[#111] tracking-tight">Calendar</h1>
          <p className="text-[13px] text-[#A8A49C] mt-0.5">Dashboard › Calendar</p>
        </div>
        <button onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-[#111] hover:bg-[#222] text-white text-[13px] font-semibold px-4 py-2 rounded-xl transition-colors shadow-sm">
          <Plus size={15} /> New Appointment
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-5">
        {usingMock && !loading && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-2.5 text-[13px] text-amber-700 flex items-center gap-2">
            <AlertCircle size={14} /> Showing sample data
          </div>
        )}

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
          {/* Calendar grid */}
          <div className="xl:col-span-2 bg-white rounded-xl border border-[#E8E6E0] shadow-sm p-5">
            {/* Month nav */}
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-[16px] font-bold text-[#111]">{MONTHS[month]} {year}</h2>
              <div className="flex items-center gap-1">
                <button onClick={prevMonth} className="p-2 rounded-xl hover:bg-[#F4F5F7] text-[#7C7870] transition-colors"><ChevronLeft size={16} /></button>
                <button onClick={() => setCurrentDate(new Date())} className="px-3 py-1.5 text-[12px] font-semibold text-indigo-600 hover:bg-indigo-50 rounded-xl transition-colors">Today</button>
                <button onClick={nextMonth} className="p-2 rounded-xl hover:bg-[#F4F5F7] text-[#7C7870] transition-colors"><ChevronRight size={16} /></button>
              </div>
            </div>

            {/* Day headers */}
            <div className="grid grid-cols-7 mb-2">
              {DAYS.map((d) => (
                <div key={d} className="text-center text-[11px] font-semibold text-[#A8A49C] uppercase tracking-wide py-2">{d}</div>
              ))}
            </div>

            {/* Calendar cells */}
            <div className="grid grid-cols-7 gap-1">
              {Array.from({ length: firstDay }).map((_, i) => <div key={`empty-${i}`} />)}
              {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day) => {
                const isToday = day === new Date().getDate() && month === new Date().getMonth() && year === new Date().getFullYear();
                const dayAppts = apptsByDay[day] ?? [];
                return (
                  <div key={day} className={`min-h-[72px] rounded-xl p-1.5 border transition-colors cursor-pointer hover:border-indigo-300 ${isToday ? "bg-indigo-50 border-indigo-300" : "border-[#F0EDE6] hover:bg-[#FAFAF8]"}`}>
                    <p className={`text-[12px] font-bold mb-1 ${isToday ? "text-indigo-600" : "text-[#374151]"}`}>{day}</p>
                    <div className="space-y-0.5">
                      {dayAppts.slice(0, 2).map((a) => {
                        const cfg = TYPE_CFG[a.appointment_type];
                        return (
                          <div key={a.id} onClick={() => setSelected(a)}
                            className={`text-[9px] font-semibold px-1.5 py-0.5 rounded-md truncate cursor-pointer ${cfg.bg} ${cfg.color}`}>
                            {fmtTime(a.start_time)} {a.title}
                          </div>
                        );
                      })}
                      {dayAppts.length > 2 && (
                        <p className="text-[9px] text-[#A8A49C] font-semibold pl-1">+{dayAppts.length - 2} more</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right sidebar */}
          <div className="space-y-4">
            {/* Today's appointments */}
            <div className="bg-white rounded-xl border border-[#E8E6E0] shadow-sm p-4">
              <h3 className="text-[14px] font-bold text-[#111] mb-3">Today — {new Date().toLocaleDateString("en-CA", { month: "long", day: "numeric" })}</h3>
              {todayAppts.length === 0 ? (
                <p className="text-[13px] text-[#A8A49C] text-center py-4">No appointments today</p>
              ) : (
                <div className="space-y-2">
                  {todayAppts.map((a) => {
                    const cfg = TYPE_CFG[a.appointment_type];
                    return (
                      <div key={a.id} onClick={() => setSelected(a)}
                        className="flex items-start gap-3 p-3 rounded-xl bg-[#FAFAF8] border border-[#F0EDE6] cursor-pointer hover:border-indigo-200 transition-colors">
                        <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${cfg.dot}`} />
                        <div className="flex-1 min-w-0">
                          <p className="text-[12px] font-semibold text-[#111] truncate">{a.title}</p>
                          <p className="text-[11px] text-[#A8A49C] mt-0.5">{fmtTime(a.start_time)} – {fmtTime(a.end_time)}</p>
                          {a.location && <p className="text-[10px] text-[#A8A49C] flex items-center gap-1 mt-0.5"><MapPin size={9} />{a.location}</p>}
                        </div>
                        {a.is_virtual && <Video size={12} className="text-indigo-400 shrink-0 mt-0.5" />}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Upcoming */}
            <div className="bg-white rounded-xl border border-[#E8E6E0] shadow-sm p-4">
              <h3 className="text-[14px] font-bold text-[#111] mb-3">Upcoming</h3>
              <div className="space-y-2">
                {upcomingAppts.map((a) => {
                  const cfg = TYPE_CFG[a.appointment_type];
                  return (
                    <div key={a.id} onClick={() => setSelected(a)}
                      className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-[#FAFAF8] cursor-pointer transition-colors">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${cfg.bg}`}>
                        <CalendarDays size={14} className={cfg.color} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[12px] font-semibold text-[#111] truncate">{a.title}</p>
                        <p className="text-[10px] text-[#A8A49C]">{fmtDate(a.start_time)} · {fmtTime(a.start_time)}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Appointment detail modal */}
      {selected && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setSelected(null)}>
          <div className="bg-white rounded-2xl border border-[#E8E6E0] shadow-2xl w-full max-w-sm" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-5 border-b border-[#F0EDE6]">
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${TYPE_CFG[selected.appointment_type].dot}`} />
                <h2 className="text-[15px] font-bold text-[#111]">{selected.title}</h2>
              </div>
              <button onClick={() => setSelected(null)} className="p-1.5 rounded-lg hover:bg-[#F4F5F7] text-[#A8A49C]"><X size={15} /></button>
            </div>
            <div className="p-5 space-y-3">
              <div className="flex items-center gap-2 text-[13px] text-[#7C7870]">
                <Clock size={14} className="text-[#A8A49C]" />
                {fmtDate(selected.start_time)} · {fmtTime(selected.start_time)} – {fmtTime(selected.end_time)}
              </div>
              {selected.location && (
                <div className="flex items-center gap-2 text-[13px] text-[#7C7870]">
                  {selected.is_virtual ? <Video size={14} className="text-indigo-400" /> : <MapPin size={14} className="text-[#A8A49C]" />}
                  {selected.location}
                </div>
              )}
              {selected.contact_name && (
                <div className="flex items-center gap-2 text-[13px] text-[#7C7870]">
                  <User size={14} className="text-[#A8A49C]" />
                  {selected.contact_name}
                </div>
              )}
              <span className={`inline-flex text-[10px] font-bold px-2 py-0.5 rounded-full ${TYPE_CFG[selected.appointment_type].bg} ${TYPE_CFG[selected.appointment_type].color}`}>
                {selected.appointment_type}
              </span>
            </div>
          </div>
        </div>
      )}

      {showModal && <NewApptModal onClose={() => setShowModal(false)} onSave={(a) => { setAppointments((prev) => [a, ...prev]); setShowModal(false); }} />}
    </div>
  );
}
