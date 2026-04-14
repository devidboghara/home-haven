"use client";

import { useEffect, useState } from "react";
import {
  CheckSquare, Plus, Search, X, AlertCircle, Clock,
  CheckCircle2, Circle, Trash2, Pencil, Flag, User,
  Calendar, Filter,
} from "lucide-react";
import { supabase } from "@/lib/supabase";

// ── Types ─────────────────────────────────────────────────────────────────────

type TaskStatus   = "Todo" | "In Progress" | "Done" | "Cancelled";
type TaskPriority = "Low" | "Medium" | "High" | "Urgent";

interface Task {
  id: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  due_date: string | null;
  assigned_to: string | null;
  tags: string[] | null;
  created_at: string;
}

// ── Config ────────────────────────────────────────────────────────────────────

const STATUS_CFG: Record<TaskStatus, { color: string; bg: string; icon: React.ElementType }> = {
  "Todo":       { color: "text-slate-600",   bg: "bg-slate-100",   icon: Circle       },
  "In Progress":{ color: "text-indigo-700",  bg: "bg-indigo-100",  icon: Clock        },
  "Done":       { color: "text-emerald-700", bg: "bg-emerald-100", icon: CheckCircle2 },
  "Cancelled":  { color: "text-rose-700",    bg: "bg-rose-100",    icon: X            },
};

const PRIORITY_CFG: Record<TaskPriority, { color: string; bg: string }> = {
  Low:    { color: "text-slate-600",   bg: "bg-slate-100"   },
  Medium: { color: "text-amber-700",   bg: "bg-amber-100"   },
  High:   { color: "text-orange-700",  bg: "bg-orange-100"  },
  Urgent: { color: "text-rose-700",    bg: "bg-rose-100"    },
};

// ── Mock data ─────────────────────────────────────────────────────────────────

const now = Date.now();
const dAgo = (d: number) => new Date(now - d * 86400000).toISOString().slice(0, 10);
const dFwd = (d: number) => new Date(now + d * 86400000).toISOString().slice(0, 10);

const MOCK_TASKS: Task[] = [
  { id:"t1",  title:"Follow up with Thomas Morrison re: counter offer",  description:"Call or email to confirm acceptance of CA$472,000 counter offer",  status:"Todo",        priority:"Urgent", due_date:dFwd(0),  assigned_to:"Sarah Kim",    tags:["follow-up","offer"],    created_at:new Date(now-86400000).toISOString() },
  { id:"t2",  title:"Send ROI analysis to Aisha Patel",                  description:"Prepare detailed ROI analysis for Vancouver and Ottawa properties", status:"In Progress", priority:"High",   due_date:dFwd(1),  assigned_to:"Mike Roberts", tags:["analysis","investor"],  created_at:new Date(now-2*86400000).toISOString() },
  { id:"t3",  title:"Schedule inspection for Cedar Hills Drive",          description:"Book inspector for 34 Cedar Hills Dr, Regina",                     status:"Todo",        priority:"Medium", due_date:dFwd(3),  assigned_to:"Priya Sharma", tags:["inspection"],           created_at:new Date(now-3*86400000).toISOString() },
  { id:"t4",  title:"Prepare contract for Harbor Blvd",                  description:"Draft purchase agreement for 93 Harbor Blvd, Montreal",            status:"In Progress", priority:"High",   due_date:dFwd(2),  assigned_to:"James Liu",    tags:["contract","legal"],     created_at:new Date(now-4*86400000).toISOString() },
  { id:"t5",  title:"Update CRM with open house leads",                  description:"Add 4 new leads from Rosewood Blvd open house to CRM",             status:"Done",        priority:"Medium", due_date:dAgo(1),  assigned_to:"Sarah Kim",    tags:["crm","leads"],          created_at:new Date(now-5*86400000).toISOString() },
  { id:"t6",  title:"Send weekly performance report",                    description:"Email weekly report to all agents",                                 status:"Done",        priority:"Low",    due_date:dAgo(2),  assigned_to:"Admin",        tags:["report"],               created_at:new Date(now-6*86400000).toISOString() },
  { id:"t7",  title:"Review maintenance request — Birchwood Court",      description:"Assess plumbing issue reported by tenant",                          status:"Todo",        priority:"High",   due_date:dFwd(1),  assigned_to:"Nina Torres",  tags:["maintenance"],          created_at:new Date(now-7*86400000).toISOString() },
  { id:"t8",  title:"Upload property photos — Willow Creek Rd",          description:"Upload and tag 24 photos to property listing",                      status:"Cancelled",   priority:"Low",    due_date:dAgo(3),  assigned_to:"Mike Roberts", tags:["photos","listing"],     created_at:new Date(now-8*86400000).toISOString() },
  { id:"t9",  title:"Prepare commission statement for Sarah Kim",        description:"Calculate and prepare Q1 commission statement",                     status:"Todo",        priority:"Medium", due_date:dFwd(5),  assigned_to:"Admin",        tags:["commission","finance"], created_at:new Date(now-9*86400000).toISOString() },
  { id:"t10", title:"Set up virtual tour for Lakeview Drive",            description:"Configure Matterport virtual tour for Vancouver listing",           status:"In Progress", priority:"Medium", due_date:dFwd(4),  assigned_to:"Priya Sharma", tags:["virtual-tour"],         created_at:new Date(now-10*86400000).toISOString() },
];

// ── New Task Modal ────────────────────────────────────────────────────────────

function NewTaskModal({ onClose, onSave }: { onClose: () => void; onSave: (t: Task) => void }) {
  const [form, setForm] = useState({ title: "", description: "", priority: "Medium" as TaskPriority, due_date: "", assigned_to: "" });
  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = () => {
    if (!form.title) return;
    onSave({ id: Date.now().toString(), ...form, status: "Todo", description: form.description || null, due_date: form.due_date || null, assigned_to: form.assigned_to || null, tags: null, created_at: new Date().toISOString() });
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl border border-[#E8E6E0] shadow-2xl w-full max-w-md" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-5 border-b border-[#F0EDE6]">
          <h2 className="text-[16px] font-bold text-[#111]">New Task</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-[#F4F5F7] text-[#A8A49C]"><X size={15} /></button>
        </div>
        <div className="p-5 space-y-3">
          <div>
            <label className="block text-[11px] font-semibold text-[#7C7870] uppercase tracking-wide mb-1">Title</label>
            <input value={form.title} onChange={(e) => set("title", e.target.value)} placeholder="Task title"
              className="w-full bg-[#F4F5F7] border border-[#E8E6E0] rounded-xl px-3 py-2.5 text-[13px] text-[#111] outline-none focus:border-indigo-400" />
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-[#7C7870] uppercase tracking-wide mb-1">Description</label>
            <textarea value={form.description} onChange={(e) => set("description", e.target.value)} rows={3} placeholder="Optional description"
              className="w-full bg-[#F4F5F7] border border-[#E8E6E0] rounded-xl px-3 py-2.5 text-[13px] text-[#111] outline-none focus:border-indigo-400 resize-none" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-[#7C7870] uppercase tracking-wide mb-1">Priority</label>
              <select value={form.priority} onChange={(e) => set("priority", e.target.value)}
                className="w-full bg-[#F4F5F7] border border-[#E8E6E0] rounded-xl px-3 py-2.5 text-[13px] text-[#7C7870] outline-none">
                {(["Low","Medium","High","Urgent"] as TaskPriority[]).map((p) => <option key={p}>{p}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-[#7C7870] uppercase tracking-wide mb-1">Due Date</label>
              <input type="date" value={form.due_date} onChange={(e) => set("due_date", e.target.value)}
                className="w-full bg-[#F4F5F7] border border-[#E8E6E0] rounded-xl px-3 py-2.5 text-[13px] text-[#111] outline-none focus:border-indigo-400" />
            </div>
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-[#7C7870] uppercase tracking-wide mb-1">Assign To</label>
            <input value={form.assigned_to} onChange={(e) => set("assigned_to", e.target.value)} placeholder="Agent name"
              className="w-full bg-[#F4F5F7] border border-[#E8E6E0] rounded-xl px-3 py-2.5 text-[13px] text-[#111] outline-none focus:border-indigo-400" />
          </div>
          <div className="flex gap-2 pt-1">
            <button onClick={onClose} className="flex-1 border border-[#E8E6E0] rounded-xl py-2.5 text-[13px] font-semibold text-[#7C7870] hover:bg-[#F4F5F7] transition-colors">Cancel</button>
            <button onClick={handleSubmit} disabled={!form.title}
              className="flex-1 bg-[#111] hover:bg-[#222] disabled:opacity-40 text-white text-[13px] font-semibold py-2.5 rounded-xl transition-colors">
              Create Task
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Task Row ──────────────────────────────────────────────────────────────────

function TaskRow({ task, onStatusChange, onDelete }: {
  task: Task;
  onStatusChange: (id: string, status: TaskStatus) => void;
  onDelete: (id: string) => void;
}) {
  const sc = STATUS_CFG[task.status];
  const pc = PRIORITY_CFG[task.priority];
  const StatusIcon = sc.icon;
  const isOverdue = task.due_date && task.due_date < new Date().toISOString().slice(0, 10) && task.status !== "Done" && task.status !== "Cancelled";

  return (
    <div className={`flex items-start gap-3 p-4 rounded-xl border transition-colors group hover:border-indigo-200 ${task.status === "Done" ? "bg-[#FAFAF8] border-[#F0EDE6] opacity-70" : "bg-white border-[#E8E6E0]"}`}>
      {/* Status toggle */}
      <button onClick={() => onStatusChange(task.id, task.status === "Done" ? "Todo" : task.status === "Todo" ? "In Progress" : "Done")}
        className={`mt-0.5 shrink-0 w-5 h-5 rounded-full flex items-center justify-center transition-colors ${sc.bg} ${sc.color}`}>
        <StatusIcon size={12} />
      </button>

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <p className={`text-[13px] font-semibold ${task.status === "Done" ? "line-through text-[#A8A49C]" : "text-[#111]"}`}>{task.title}</p>
          <div className="flex items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
            <button className="w-6 h-6 rounded-lg flex items-center justify-center text-[#A8A49C] hover:bg-[#F4F5F7] border border-[#E8E6E0]">
              <Pencil size={11} />
            </button>
            <button onClick={() => onDelete(task.id)} className="w-6 h-6 rounded-lg flex items-center justify-center text-[#A8A49C] hover:bg-rose-50 hover:text-rose-500 border border-[#E8E6E0]">
              <Trash2 size={11} />
            </button>
          </div>
        </div>
        {task.description && <p className="text-[12px] text-[#7C7870] mt-0.5 truncate">{task.description}</p>}
        <div className="flex items-center gap-2 mt-2 flex-wrap">
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${pc.bg} ${pc.color}`}>
            <Flag size={8} className="inline mr-0.5" />{task.priority}
          </span>
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${sc.bg} ${sc.color}`}>{task.status}</span>
          {task.due_date && (
            <span className={`flex items-center gap-1 text-[10px] font-semibold ${isOverdue ? "text-rose-600" : "text-[#A8A49C]"}`}>
              <Calendar size={9} />{task.due_date}
              {isOverdue && " (Overdue)"}
            </span>
          )}
          {task.assigned_to && (
            <span className="flex items-center gap-1 text-[10px] text-[#A8A49C]">
              <User size={9} />{task.assigned_to}
            </span>
          )}
          {task.tags?.map((tag) => (
            <span key={tag} className="text-[9px] font-semibold px-1.5 py-0.5 rounded-md bg-[#F0EDE6] text-[#7C7870]">#{tag}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function TasksPage() {
  const [tasks, setTasks]         = useState<Task[]>(MOCK_TASKS);
  const [usingMock, setUsingMock] = useState(true);
  const [loading, setLoading]     = useState(true);
  const [search, setSearch]       = useState("");
  const [statusFilter, setStatusFilter]     = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    supabase.from("tasks").select("*").order("due_date", { ascending: true })
      .then(({ data }) => {
        if (data && data.length > 0) { setTasks(data as Task[]); setUsingMock(false); }
        setLoading(false);
      });
  }, []);

  const handleStatusChange = (id: string, status: TaskStatus) => {
    setTasks((prev) => prev.map((t) => t.id === id ? { ...t, status } : t));
    if (!usingMock) supabase.from("tasks").update({ status }).eq("id", id);
  };

  const handleDelete = (id: string) => setTasks((prev) => prev.filter((t) => t.id !== id));
  const handleSave   = (t: Task) => { setTasks((prev) => [t, ...prev]); setShowModal(false); };

  const filtered = tasks.filter((t) => {
    const q = search.toLowerCase();
    const matchSearch = t.title.toLowerCase().includes(q) || (t.description ?? "").toLowerCase().includes(q) || (t.assigned_to ?? "").toLowerCase().includes(q);
    const matchStatus   = statusFilter   === "All" || t.status   === statusFilter;
    const matchPriority = priorityFilter === "All" || t.priority === priorityFilter;
    return matchSearch && matchStatus && matchPriority;
  });

  const stats = {
    total:      tasks.length,
    todo:       tasks.filter((t) => t.status === "Todo").length,
    inProgress: tasks.filter((t) => t.status === "In Progress").length,
    done:       tasks.filter((t) => t.status === "Done").length,
    overdue:    tasks.filter((t) => t.due_date && t.due_date < new Date().toISOString().slice(0, 10) && !["Done","Cancelled"].includes(t.status)).length,
  };

  return (
    <div className="flex flex-col h-full">
      <div className="px-6 py-5 bg-white border-b border-[#E8E6E0] flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-[20px] font-bold text-[#111] tracking-tight">Tasks</h1>
          <p className="text-[13px] text-[#A8A49C] mt-0.5">Dashboard › Tasks</p>
        </div>
        <button onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-[#111] hover:bg-[#222] text-white text-[13px] font-semibold px-4 py-2 rounded-xl transition-colors shadow-sm">
          <Plus size={15} /> New Task
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-5">
        {usingMock && !loading && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-2.5 text-[13px] text-amber-700 flex items-center gap-2">
            <AlertCircle size={14} /> Showing sample data
          </div>
        )}

        {/* KPI cards */}
        <div className="grid grid-cols-2 xl:grid-cols-5 gap-4">
          {[
            { label: "Total",       value: stats.total,      color: "bg-indigo-50 text-indigo-600"  },
            { label: "To Do",       value: stats.todo,       color: "bg-slate-50 text-slate-600"    },
            { label: "In Progress", value: stats.inProgress, color: "bg-blue-50 text-blue-600"      },
            { label: "Done",        value: stats.done,       color: "bg-emerald-50 text-emerald-600"},
            { label: "Overdue",     value: stats.overdue,    color: "bg-rose-50 text-rose-600"      },
          ].map(({ label, value, color }) => (
            <div key={label} className="bg-white rounded-xl border border-[#E8E6E0] shadow-sm p-4 flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${color}`}>
                <CheckSquare size={18} />
              </div>
              <div>
                <p className="text-[11px] font-semibold text-[#7C7870] uppercase tracking-wide">{label}</p>
                <p className="text-[22px] font-bold text-[#111] tracking-tight">{value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Filter bar */}
        <div className="bg-white rounded-xl border border-[#E8E6E0] shadow-sm p-4 flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 bg-[#F4F5F7] border border-[#E8E6E0] rounded-xl px-3 py-2.5 flex-1 min-w-[200px]">
            <Search size={14} className="text-[#A8A49C] shrink-0" />
            <input type="text" placeholder="Search tasks..." value={search} onChange={(e) => setSearch(e.target.value)}
              className="bg-transparent text-[13px] text-[#111] placeholder-[#C5BFB5] outline-none w-full" />
          </div>
          <div className="flex items-center gap-1 bg-[#F4F5F7] rounded-xl p-1">
            {["All","Todo","In Progress","Done","Cancelled"].map((s) => (
              <button key={s} onClick={() => setStatusFilter(s)}
                className={`text-[11px] font-semibold px-2.5 py-1.5 rounded-lg transition-colors whitespace-nowrap ${statusFilter === s ? "bg-white text-[#111] shadow-sm" : "text-[#7C7870] hover:text-[#111]"}`}>
                {s}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-1 bg-[#F4F5F7] rounded-xl p-1">
            {["All","Low","Medium","High","Urgent"].map((p) => (
              <button key={p} onClick={() => setPriorityFilter(p)}
                className={`text-[11px] font-semibold px-2.5 py-1.5 rounded-lg transition-colors ${priorityFilter === p ? "bg-white text-[#111] shadow-sm" : "text-[#7C7870] hover:text-[#111]"}`}>
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* Task list */}
        {loading ? (
          <div className="text-center py-12 text-[13px] text-[#A8A49C]">Loading tasks…</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-12 text-[13px] text-[#A8A49C]">No tasks match your filters.</div>
        ) : (
          <div className="space-y-2">
            {filtered.map((task) => (
              <TaskRow key={task.id} task={task} onStatusChange={handleStatusChange} onDelete={handleDelete} />
            ))}
          </div>
        )}
      </div>

      {showModal && <NewTaskModal onClose={() => setShowModal(false)} onSave={handleSave} />}
    </div>
  );
}
