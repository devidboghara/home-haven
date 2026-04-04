"use client";

import { useEffect, useState } from "react";
import {
  Plus, Search, Star, Phone, Mail, MapPin,
  TrendingUp, DollarSign, UserCheck, Award,
  Eye, Pencil, Trash2, X, MoreHorizontal,
  Grid3X3, List, ChevronDown, Filter,
} from "lucide-react";
import { supabase } from "@/lib/supabase";

// ── Types ─────────────────────────────────────────────────────────────────────

interface Agent {
  id: string;
  full_name: string;
  email: string | null;
  phone: string | null;
  role: string;
  status: string;
  commission_pct: number;
  avatar_url: string | null;
  created_at: string;
  // computed
  deals?: number;
  revenue?: number;
  rating?: number;
  city?: string;
}

// ── Mock data ─────────────────────────────────────────────────────────────────

const MOCK_AGENTS: Agent[] = [
  { id: "a1", full_name: "Sarah Kim",    email: "sarah@homehaven.ca",  phone: "+1 (416) 555-0101", role: "agent",   status: "active", commission_pct: 3.0, avatar_url: null, created_at: "2024-01-15", deals: 14, revenue: 2100000, rating: 4.9, city: "Toronto, ON"    },
  { id: "a2", full_name: "Mike Roberts", email: "mike@homehaven.ca",   phone: "+1 (604) 555-0202", role: "agent",   status: "active", commission_pct: 2.5, avatar_url: null, created_at: "2024-02-10", deals: 11, revenue: 1700000, rating: 4.8, city: "Vancouver, BC"  },
  { id: "a3", full_name: "Priya Sharma", email: "priya@homehaven.ca",  phone: "+1 (403) 555-0303", role: "agent",   status: "active", commission_pct: 2.8, avatar_url: null, created_at: "2024-03-05", deals: 9,  revenue: 1400000, rating: 4.7, city: "Calgary, AB"    },
  { id: "a4", full_name: "James Liu",    email: "james@homehaven.ca",  phone: "+1 (514) 555-0404", role: "manager", status: "active", commission_pct: 3.5, avatar_url: null, created_at: "2023-11-20", deals: 8,  revenue: 1200000, rating: 4.6, city: "Montreal, QC"   },
  { id: "a5", full_name: "Nina Torres",  email: "nina@homehaven.ca",   phone: "+1 (613) 555-0505", role: "agent",   status: "inactive", commission_pct: 2.5, avatar_url: null, created_at: "2024-04-01", deals: 6, revenue: 980000, rating: 4.5, city: "Ottawa, ON"     },
];

const ROLE_CONFIG: Record<string, { color: string; bg: string }> = {
  super_admin: { color: "text-rose-700",    bg: "bg-rose-100"    },
  manager:     { color: "text-violet-700",  bg: "bg-violet-100"  },
  agent:       { color: "text-indigo-700",  bg: "bg-indigo-100"  },
  read_only:   { color: "text-slate-600",   bg: "bg-slate-100"   },
};

const AVATAR_COLORS = [
  "bg-indigo-500","bg-violet-500","bg-emerald-500",
  "bg-amber-500","bg-rose-500","bg-teal-500","bg-orange-500",
];

// ── Agent Form Modal ──────────────────────────────────────────────────────────

function AgentModal({
  agent,
  onClose,
  onSave,
}: {
  agent?: Agent;
  onClose: () => void;
  onSave: (data: Partial<Agent>) => void;
}) {
  const [form, setForm] = useState({
    full_name:      agent?.full_name      || "",
    email:          agent?.email          || "",
    phone:          agent?.phone          || "",
    role:           agent?.role           || "agent",
    commission_pct: agent?.commission_pct || 3.0,
    status:         agent?.status         || "active",
  });

  const set = (k: string, v: string | number) =>
    setForm((f) => ({ ...f, [k]: v }));

  return (
    <div
      className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl border border-[#E8E6E0] shadow-2xl w-full max-w-md"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-5 border-b border-[#F0EDE6]">
          <h2 className="text-[16px] font-bold text-[#111]">
            {agent ? "Edit Agent" : "Add New Agent"}
          </h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-[#F4F5F7] text-[#A8A49C]">
            <X size={15} />
          </button>
        </div>
        <div className="p-5 space-y-3">
          {[
            { label: "Full Name",  key: "full_name", placeholder: "e.g. Sarah Kim"          },
            { label: "Email",      key: "email",     placeholder: "agent@homehaven.ca"       },
            { label: "Phone",      key: "phone",     placeholder: "+1 (416) 555-0000"        },
          ].map(({ label, key, placeholder }) => (
            <div key={key}>
              <label className="block text-[11px] font-semibold text-[#7C7870] uppercase tracking-wide mb-1">
                {label}
              </label>
              <input
                value={(form as any)[key]}
                onChange={(e) => set(key, e.target.value)}
                placeholder={placeholder}
                className="w-full bg-[#F4F5F7] border border-[#E8E6E0] rounded-xl px-3 py-2.5 text-[13px] text-[#111] outline-none focus:border-indigo-400 transition-colors"
              />
            </div>
          ))}

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-[#7C7870] uppercase tracking-wide mb-1">
                Role
              </label>
              <select
                value={form.role}
                onChange={(e) => set("role", e.target.value)}
                className="w-full bg-[#F4F5F7] border border-[#E8E6E0] rounded-xl px-3 py-2.5 text-[13px] text-[#7C7870] outline-none"
              >
                {["super_admin", "manager", "agent", "read_only"].map((r) => (
                  <option key={r} value={r}>
                    {r.replace("_", " ")}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-[#7C7870] uppercase tracking-wide mb-1">
                Commission %
              </label>
              <input
                type="number"
                step="0.1"
                min="0"
                max="10"
                value={form.commission_pct}
                onChange={(e) => set("commission_pct", parseFloat(e.target.value) || 0)}
                className="w-full bg-[#F4F5F7] border border-[#E8E6E0] rounded-xl px-3 py-2.5 text-[13px] text-[#111] outline-none focus:border-indigo-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-[#7C7870] uppercase tracking-wide mb-1">
              Status
            </label>
            <div className="flex gap-2">
              {["active", "inactive"].map((s) => (
                <button
                  key={s}
                  onClick={() => set("status", s)}
                  className={`flex-1 py-2 rounded-xl text-[12px] font-semibold border transition-colors capitalize ${
                    form.status === s
                      ? "bg-[#111] text-white border-[#111]"
                      : "border-[#E8E6E0] text-[#7C7870] hover:bg-[#F4F5F7]"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <button
              onClick={() => onSave(form)}
              disabled={!form.full_name}
              className="flex-1 bg-[#111] hover:bg-[#222] disabled:opacity-40 text-white text-[13px] font-semibold py-2.5 rounded-xl transition-colors"
            >
              {agent ? "Update Agent" : "Add Agent"}
            </button>
            <button
              onClick={onClose}
              className="flex-1 bg-[#F4F5F7] text-[#7C7870] text-[13px] font-semibold py-2.5 rounded-xl hover:bg-[#EDEAE3]"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function AgentsPage() {
  const [agents, setAgents]       = useState<Agent[]>(MOCK_AGENTS);
  const [loading, setLoading]     = useState(true);
  const [search, setSearch]       = useState("");
  const [roleFilter, setRoleFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [view, setView]           = useState<"grid" | "list">("grid");
  const [showModal, setShowModal] = useState(false);
  const [editAgent, setEditAgent] = useState<Agent | undefined>(undefined);
  const [selected, setSelected]   = useState<Agent | null>(null);

  useEffect(() => { fetchAgents(); }, []);

  const fetchAgents = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .order("created_at", { ascending: false });
    if (data && data.length > 0) setAgents(data as Agent[]);
    setLoading(false);
  };

  const handleSave = async (form: Partial<Agent>) => {
    if (editAgent) {
      const { data } = await supabase
        .from("profiles")
        .update(form)
        .eq("id", editAgent.id)
        .select()
        .single();
      setAgents((prev) =>
        prev.map((a) => (a.id === editAgent.id ? { ...a, ...form } : a))
      );
    } else {
      // New agent — just add optimistically (real auth signup needed for full flow)
      const newAgent: Agent = {
        ...form as Agent,
        id: Date.now().toString(),
        created_at: new Date().toISOString(),
        deals: 0,
        revenue: 0,
        rating: 0,
      };
      setAgents((prev) => [newAgent, ...prev]);
    }
    setShowModal(false);
    setEditAgent(undefined);
  };

  const handleDelete = async (id: string) => {
    await supabase.from("profiles").delete().eq("id", id);
    setAgents((prev) => prev.filter((a) => a.id !== id));
    if (selected?.id === id) setSelected(null);
  };

  const filtered = agents.filter((a) => {
    const s = search.toLowerCase();
    const matchSearch =
      (a.full_name || "").toLowerCase().includes(s) ||
      (a.email || "").toLowerCase().includes(s);
    const matchRole   = roleFilter === "All"   || a.role === roleFilter;
    const matchStatus = statusFilter === "All" || a.status === statusFilter;
    return matchSearch && matchRole && matchStatus;
  });

  const stats = [
    { label: "Total Agents",  value: agents.length,                                           color: "bg-indigo-50 text-indigo-600"  },
    { label: "Active",        value: agents.filter((a) => a.status === "active").length,       color: "bg-emerald-50 text-emerald-600"},
    { label: "Managers",      value: agents.filter((a) => a.role === "manager").length,        color: "bg-violet-50 text-violet-600"  },
    { label: "Avg Commission",value: `${(agents.reduce((s,a)=>s+a.commission_pct,0)/agents.length||0).toFixed(1)}%`, color: "bg-amber-50 text-amber-600" },
  ];

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-6 py-5 bg-white border-b border-[#E8E6E0] flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-[20px] font-bold text-[#111] tracking-tight">Agents</h1>
          <p className="text-[13px] text-[#A8A49C] mt-0.5">Dashboard › Agents</p>
        </div>
        <button
          onClick={() => { setEditAgent(undefined); setShowModal(true); }}
          className="flex items-center gap-2 bg-[#111] hover:bg-[#222] text-white text-[13px] font-semibold px-4 py-2 rounded-xl transition-colors shadow-sm"
        >
          <Plus size={15} /> Add Agent
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-5">
        {/* Stats */}
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
          {stats.map(({ label, value, color }) => (
            <div key={label} className={`rounded-xl p-4 ${color}`}>
              <p className="text-[11px] font-semibold uppercase tracking-wide opacity-70">{label}</p>
              <p className="text-[24px] font-bold tracking-tight mt-1">{value}</p>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl border border-[#E8E6E0] p-4 flex flex-wrap items-center gap-3 shadow-sm">
          <div className="flex items-center gap-2 bg-[#F4F5F7] rounded-xl px-3 py-2 flex-1 min-w-[180px]">
            <Search size={14} className="text-[#A8A49C] shrink-0" />
            <input
              type="text"
              placeholder="Search agents..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-transparent text-[13px] text-[#111] placeholder-[#C5BFB5] outline-none w-full"
            />
          </div>

          <div className="flex items-center gap-1 bg-[#F4F5F7] rounded-xl p-1">
            {["All", "super_admin", "manager", "agent", "read_only"].map((r) => (
              <button
                key={r}
                onClick={() => setRoleFilter(r)}
                className={`text-[11px] font-semibold px-2.5 py-1.5 rounded-lg capitalize transition-colors ${
                  roleFilter === r ? "bg-white text-[#111] shadow-sm" : "text-[#7C7870] hover:text-[#111]"
                }`}
              >
                {r === "All" ? "All" : r.replace("_", " ")}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1 bg-[#F4F5F7] rounded-xl p-1">
            {["All", "active", "inactive"].map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`text-[11px] font-semibold px-2.5 py-1.5 rounded-lg capitalize transition-colors ${
                  statusFilter === s ? "bg-white text-[#111] shadow-sm" : "text-[#7C7870] hover:text-[#111]"
                }`}
              >
                {s}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1 bg-[#F4F5F7] rounded-xl p-1 ml-auto">
            <button
              onClick={() => setView("grid")}
              className={`p-1.5 rounded-lg transition-colors ${view === "grid" ? "bg-white shadow-sm text-[#111]" : "text-[#A8A49C]"}`}
            >
              <Grid3X3 size={15} />
            </button>
            <button
              onClick={() => setView("list")}
              className={`p-1.5 rounded-lg transition-colors ${view === "list" ? "bg-white shadow-sm text-[#111]" : "text-[#A8A49C]"}`}
            >
              <List size={15} />
            </button>
          </div>
        </div>

        {/* Grid view */}
        {view === "grid" && (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filtered.map((agent, i) => {
              const roleCfg  = ROLE_CONFIG[agent.role] || ROLE_CONFIG.agent;
              const avatarBg = AVATAR_COLORS[i % AVATAR_COLORS.length];
              const initials = (agent.full_name || "?")
                .split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase()
                .slice(0, 2);

              return (
                <div
                  key={agent.id}
                  className="bg-white rounded-xl border border-[#E8E6E0] shadow-sm hover:shadow-md hover:border-indigo-200 transition-all p-5 cursor-pointer group"
                  onClick={() => setSelected(agent)}
                >
                  {/* Top row */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 rounded-full ${avatarBg} flex items-center justify-center text-white text-[14px] font-bold shrink-0`}>
                        {initials}
                      </div>
                      <div>
                        <p className="text-[14px] font-bold text-[#111]">{agent.full_name}</p>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize ${roleCfg.bg} ${roleCfg.color}`}>
                          {agent.role?.replace("_", " ")}
                        </span>
                      </div>
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize ${
                      agent.status === "active"
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-slate-100 text-slate-500"
                    }`}>
                      {agent.status}
                    </span>
                  </div>

                  {/* Contact info */}
                  <div className="space-y-1.5 mb-4">
                    {agent.email && (
                      <div className="flex items-center gap-2 text-[12px] text-[#7C7870]">
                        <Mail size={11} className="text-[#C5BFB5] shrink-0" />
                        <span className="truncate">{agent.email}</span>
                      </div>
                    )}
                    {agent.phone && (
                      <div className="flex items-center gap-2 text-[12px] text-[#7C7870]">
                        <Phone size={11} className="text-[#C5BFB5] shrink-0" />
                        {agent.phone}
                      </div>
                    )}
                    {agent.city && (
                      <div className="flex items-center gap-2 text-[12px] text-[#7C7870]">
                        <MapPin size={11} className="text-[#C5BFB5] shrink-0" />
                        {agent.city}
                      </div>
                    )}
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-2 py-3 border-t border-[#F0EDE6] mb-3">
                    <div className="text-center">
                      <p className="text-[16px] font-bold text-[#111]">{agent.deals ?? "—"}</p>
                      <p className="text-[10px] text-[#A8A49C]">Deals</p>
                    </div>
                    <div className="text-center">
                      <p className="text-[13px] font-bold text-[#111]">
                        {agent.revenue ? `$${(agent.revenue / 1000000).toFixed(1)}M` : "—"}
                      </p>
                      <p className="text-[10px] text-[#A8A49C]">Revenue</p>
                    </div>
                    <div className="text-center">
                      <p className="text-[13px] font-bold text-amber-500 flex items-center justify-center gap-0.5">
                        <Star size={11} fill="#F59E0B" />
                        {agent.rating ?? "—"}
                      </p>
                      <p className="text-[10px] text-[#A8A49C]">Rating</p>
                    </div>
                  </div>

                  {/* Commission + actions */}
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-semibold text-[#7C7870]">
                      Commission: <span className="text-[#111]">{agent.commission_pct}%</span>
                    </span>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={(e) => { e.stopPropagation(); setEditAgent(agent); setShowModal(true); }}
                        className="w-7 h-7 rounded-lg flex items-center justify-center text-[#A8A49C] hover:bg-amber-50 hover:text-amber-600"
                      >
                        <Pencil size={12} />
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); handleDelete(agent.id); }}
                        className="w-7 h-7 rounded-lg flex items-center justify-center text-[#A8A49C] hover:bg-rose-50 hover:text-rose-600"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* List view */}
        {view === "list" && (
          <div className="bg-white rounded-xl border border-[#E8E6E0] shadow-sm overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#F0EDE6]">
                  {["Agent", "Role", "Contact", "Deals", "Revenue", "Commission", "Rating", "Status", ""].map((h) => (
                    <th key={h} className="text-left px-4 py-3 text-[11px] font-bold text-[#A8A49C] uppercase tracking-wide whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F9F8F6]">
                {filtered.map((agent, i) => {
                  const avatarBg = AVATAR_COLORS[i % AVATAR_COLORS.length];
                  const initials = (agent.full_name || "?").split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
                  const roleCfg  = ROLE_CONFIG[agent.role] || ROLE_CONFIG.agent;
                  return (
                    <tr key={agent.id} className="hover:bg-[#FAFAF8] transition-colors group cursor-pointer" onClick={() => setSelected(agent)}>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2.5">
                          <div className={`w-8 h-8 rounded-full ${avatarBg} flex items-center justify-center text-white text-[11px] font-bold shrink-0`}>
                            {initials}
                          </div>
                          <div>
                            <p className="text-[13px] font-semibold text-[#111]">{agent.full_name}</p>
                            <p className="text-[11px] text-[#A8A49C]">{agent.city || "—"}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize ${roleCfg.bg} ${roleCfg.color}`}>
                          {agent.role?.replace("_", " ")}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-[12px] text-[#7C7870]">{agent.email || "—"}</p>
                        <p className="text-[11px] text-[#A8A49C]">{agent.phone || "—"}</p>
                      </td>
                      <td className="px-4 py-3 text-[13px] font-bold text-[#111]">{agent.deals ?? "—"}</td>
                      <td className="px-4 py-3 text-[13px] font-semibold text-[#111]">
                        {agent.revenue ? `CA$${(agent.revenue / 1000000).toFixed(1)}M` : "—"}
                      </td>
                      <td className="px-4 py-3 text-[13px] text-[#7C7870]">{agent.commission_pct}%</td>
                      <td className="px-4 py-3">
                        <span className="flex items-center gap-1 text-[12px] font-semibold text-amber-500">
                          <Star size={11} fill="#F59E0B" />{agent.rating ?? "—"}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize ${
                          agent.status === "active" ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-500"
                        }`}>
                          {agent.status}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={(e) => { e.stopPropagation(); setEditAgent(agent); setShowModal(true); }} className="w-7 h-7 rounded-lg flex items-center justify-center text-[#A8A49C] hover:bg-amber-50 hover:text-amber-600"><Pencil size={12} /></button>
                          <button onClick={(e) => { e.stopPropagation(); handleDelete(agent.id); }} className="w-7 h-7 rounded-lg flex items-center justify-center text-[#A8A49C] hover:bg-rose-50 hover:text-rose-600"><Trash2 size={12} /></button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {filtered.length === 0 && (
          <div className="text-center py-16 text-[#A8A49C] bg-white rounded-xl border border-[#E8E6E0]">
            <UserCheck size={36} className="mx-auto mb-3 opacity-25" />
            <p className="text-[14px] font-medium">No agents found</p>
          </div>
        )}
      </div>

      {/* Agent detail sidebar */}
      {selected && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setSelected(null)}>
          <div className="bg-white rounded-2xl border border-[#E8E6E0] shadow-2xl w-full max-w-sm" onClick={(e) => e.stopPropagation()}>
            <div className="p-5 border-b border-[#F0EDE6] flex items-center justify-between">
              <h2 className="text-[16px] font-bold text-[#111]">Agent Profile</h2>
              <button onClick={() => setSelected(null)} className="p-1.5 rounded-lg hover:bg-[#F4F5F7] text-[#A8A49C]"><X size={15} /></button>
            </div>
            <div className="p-5 space-y-4">
              <div className="flex items-center gap-4">
                <div className={`w-14 h-14 rounded-full ${AVATAR_COLORS[0]} flex items-center justify-center text-white text-[18px] font-bold shrink-0`}>
                  {(selected.full_name || "?").split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)}
                </div>
                <div>
                  <p className="text-[16px] font-bold text-[#111]">{selected.full_name}</p>
                  <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full capitalize ${(ROLE_CONFIG[selected.role] || ROLE_CONFIG.agent).bg} ${(ROLE_CONFIG[selected.role] || ROLE_CONFIG.agent).color}`}>
                    {selected.role?.replace("_", " ")}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 py-3 border-y border-[#F0EDE6]">
                {[
                  { label: "Deals",   value: selected.deals ?? "—"   },
                  { label: "Revenue", value: selected.revenue ? `$${(selected.revenue/1000000).toFixed(1)}M` : "—" },
                  { label: "Rating",  value: selected.rating ?? "—"  },
                ].map(({ label, value }) => (
                  <div key={label} className="text-center">
                    <p className="text-[16px] font-bold text-[#111]">{value}</p>
                    <p className="text-[10px] text-[#A8A49C]">{label}</p>
                  </div>
                ))}
              </div>

              <div className="space-y-2">
                {[
                  { label: "Email",      value: selected.email },
                  { label: "Phone",      value: selected.phone },
                  { label: "Commission", value: `${selected.commission_pct}%` },
                  { label: "Status",     value: selected.status },
                  { label: "Joined",     value: new Date(selected.created_at).toLocaleDateString("en-CA", { month: "short", day: "numeric", year: "numeric" }) },
                ].map(({ label, value }) => value ? (
                  <div key={label} className="flex justify-between">
                    <span className="text-[12px] text-[#A8A49C]">{label}</span>
                    <span className="text-[12px] font-semibold text-[#111] capitalize">{value}</span>
                  </div>
                ) : null)}
              </div>

              <div className="flex gap-2 pt-2">
                <button onClick={() => { setEditAgent(selected); setSelected(null); setShowModal(true); }}
                  className="flex-1 bg-[#111] hover:bg-[#222] text-white text-[12px] font-semibold py-2.5 rounded-xl transition-colors">
                  Edit Agent
                </button>
                <button onClick={() => handleDelete(selected.id)}
                  className="flex-1 bg-rose-50 hover:bg-rose-100 text-rose-600 text-[12px] font-semibold py-2.5 rounded-xl transition-colors">
                  Remove
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showModal && (
        <AgentModal
          agent={editAgent}
          onClose={() => { setShowModal(false); setEditAgent(undefined); }}
          onSave={handleSave}
        />
      )}
    </div>
  );
}