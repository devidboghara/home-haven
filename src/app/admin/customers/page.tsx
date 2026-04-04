"use client";

import { useEffect, useState } from "react";
import {
  Plus, Search, Filter, Eye, Pencil, Trash2,
  Phone, Mail, MapPin, Star, TrendingUp,
  Users, DollarSign, Flame, Thermometer,
  Snowflake, Grid3X3, List, X, ChevronDown,
  Home, Calendar, Tag,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import type { Contact } from "@/lib/supabase";

// ── Config ────────────────────────────────────────────────────────────────────

const LEAD_SCORE_CFG = {
  Hot:  { icon: Flame,       color: "text-rose-600",  bg: "bg-rose-100"  },
  Warm: { icon: Thermometer, color: "text-amber-600", bg: "bg-amber-100" },
  Cold: { icon: Snowflake,   color: "text-slate-500", bg: "bg-slate-100" },
};

const SOURCE_BADGE: Record<string, string> = {
  Website:      "bg-indigo-100 text-indigo-700",
  Referral:     "bg-emerald-100 text-emerald-700",
  "Social Media":"bg-violet-100 text-violet-700",
  "Cold Call":  "bg-amber-100 text-amber-700",
  Portal:       "bg-blue-100 text-blue-700",
  "Walk-in":    "bg-teal-100 text-teal-700",
  Other:        "bg-slate-100 text-slate-600",
};

const AVATAR_COLORS = [
  "bg-indigo-500","bg-violet-500","bg-emerald-500",
  "bg-amber-500","bg-rose-500","bg-teal-500",
  "bg-orange-500","bg-cyan-500","bg-lime-600",
];

// ── Mock data ─────────────────────────────────────────────────────────────────

const MOCK_CUSTOMERS: Contact[] = [
  { id:"c1", full_name:"Thomas Morrison", email:"t.morrison@email.com", phone:"+1 (416) 555-0182", contact_type:"Buyer",    lead_score:"Hot",  status:"Active", city:"Toronto",   province:"ON", budget_min:400000, budget_max:550000, source:"Website",  tags:["Cash Buyer","Repeat"],        assigned_agent_id:null, last_contact_at:new Date(Date.now()-3600000).toISOString(),    created_at:new Date(Date.now()-30*86400000).toISOString(), updated_at:"" },
  { id:"c2", full_name:"Aisha Patel",     email:"aisha.p@invest.com",   phone:"+1 (604) 555-0247", contact_type:"Investor", lead_score:"Hot",  status:"Active", city:"Vancouver", province:"BC", budget_min:800000, budget_max:2000000,source:"Referral", tags:["Investor","Portfolio"],       assigned_agent_id:null, last_contact_at:new Date(Date.now()-86400000).toISOString(),   created_at:new Date(Date.now()-60*86400000).toISOString(), updated_at:"" },
  { id:"c3", full_name:"Derek Walsh",     email:"d.walsh@home.ca",      phone:"+1 (403) 555-0391", contact_type:"Seller",   lead_score:"Warm", status:"Active", city:"Calgary",   province:"AB", budget_min:null,   budget_max:null,   source:"Portal",   tags:["Motivated Seller"],           assigned_agent_id:null, last_contact_at:new Date(Date.now()-3*86400000).toISOString(), created_at:new Date(Date.now()-15*86400000).toISOString(), updated_at:"" },
  { id:"c4", full_name:"Linda Cheng",     email:"lindacheng@mail.com",  phone:"+1 (514) 555-0128", contact_type:"Buyer",    lead_score:"Cold", status:"Active", city:"Montreal",  province:"QC", budget_min:900000, budget_max:1300000,source:"Website",  tags:["First-Time Buyer"],          assigned_agent_id:null, last_contact_at:new Date(Date.now()-14*86400000).toISOString(),created_at:new Date(Date.now()-45*86400000).toISOString(), updated_at:"" },
  { id:"c5", full_name:"Marcus Reid",     email:"m.reid@outlook.ca",    phone:"+1 (613) 555-0456", contact_type:"Buyer",    lead_score:"Warm", status:"Active", city:"Ottawa",    province:"ON", budget_min:350000, budget_max:420000, source:"Referral", tags:["First-Time Buyer","Pre-Approved"],assigned_agent_id:null,last_contact_at:new Date(Date.now()-5*86400000).toISOString(),created_at:new Date(Date.now()-20*86400000).toISOString(), updated_at:"" },
  { id:"c6", full_name:"Fatima Hassan",   email:"fhassan@ventures.com", phone:"+1 (204) 555-0673", contact_type:"Investor", lead_score:"Warm", status:"Active", city:"Winnipeg",  province:"MB", budget_min:500000, budget_max:2000000,source:"Cold Call",tags:["Investor","Fix & Flip"],     assigned_agent_id:null, last_contact_at:new Date(Date.now()-7*86400000).toISOString(), created_at:new Date(Date.now()-90*86400000).toISOString(), updated_at:"" },
  { id:"c7", full_name:"Carlos Mendez",   email:"c.mendez@realty.ca",   phone:"+1 (306) 555-0784", contact_type:"Investor", lead_score:"Hot",  status:"Active", city:"Regina",    province:"SK", budget_min:400000, budget_max:3000000,source:"Website",  tags:["Investor","Cash Buyer","VIP"],assigned_agent_id:null, last_contact_at:new Date(Date.now()-3600000).toISOString(),    created_at:new Date(Date.now()-10*86400000).toISOString(), updated_at:"" },
  { id:"c8", full_name:"John Davidson",   email:"j.davidson@gmail.com", phone:"+1 (416) 555-0183", contact_type:"Seller",   lead_score:"Warm", status:"Active", city:"Toronto",   province:"ON", budget_min:null,   budget_max:null,   source:"Cold Call",tags:["Motivated Seller","Flexible"],assigned_agent_id:null,last_contact_at:new Date(Date.now()-2*86400000).toISOString(), created_at:new Date(Date.now()-8*86400000).toISOString(),  updated_at:"" },
  { id:"c9", full_name:"Sophie Martin",   email:"s.martin@email.ca",    phone:"+1 (902) 555-0991", contact_type:"Tenant",   lead_score:"Cold", status:"Inactive",city:"Halifax",  province:"NS", budget_min:1800,   budget_max:2500,   source:"Portal",   tags:["Long-Term Tenant"],          assigned_agent_id:null, last_contact_at:new Date(Date.now()-30*86400000).toISOString(),created_at:new Date(Date.now()-120*86400000).toISOString(),updated_at:"" },
];

// ── Customer Form Modal ───────────────────────────────────────────────────────

function CustomerModal({
  customer,
  onClose,
  onSave,
}: {
  customer?: Contact;
  onClose: () => void;
  onSave: (data: Partial<Contact>) => void;
}) {
  const [form, setForm] = useState({
    full_name:    customer?.full_name    || "",
    email:        customer?.email        || "",
    phone:        customer?.phone        || "",
    contact_type: customer?.contact_type || "Buyer",
    lead_score:   customer?.lead_score   || "Cold",
    status:       customer?.status       || "Active",
    city:         customer?.city         || "",
    province:     customer?.province     || "",
    budget_min:   customer?.budget_min   || "",
    budget_max:   customer?.budget_max   || "",
    source:       customer?.source       || "Website",
    tags:         customer?.tags?.join(", ") || "",
    notes:        "",
  });

  const set = (k: string, v: string | number) =>
    setForm((f) => ({ ...f, [k]: v }));

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl border border-[#E8E6E0] shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-5 border-b border-[#F0EDE6]">
          <h2 className="text-[16px] font-bold text-[#111]">{customer ? "Edit Customer" : "New Customer"}</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-[#F4F5F7] text-[#A8A49C]"><X size={15} /></button>
        </div>
        <div className="p-5 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2">
              <label className="block text-[11px] font-semibold text-[#7C7870] uppercase tracking-wide mb-1">Full Name *</label>
              <input value={form.full_name} onChange={(e) => set("full_name", e.target.value)} placeholder="Full name"
                className="w-full bg-[#F4F5F7] border border-[#E8E6E0] rounded-xl px-3 py-2.5 text-[13px] text-[#111] outline-none focus:border-indigo-400" />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-[#7C7870] uppercase tracking-wide mb-1">Email</label>
              <input value={form.email} onChange={(e) => set("email", e.target.value)} placeholder="email@example.com"
                className="w-full bg-[#F4F5F7] border border-[#E8E6E0] rounded-xl px-3 py-2.5 text-[13px] text-[#111] outline-none focus:border-indigo-400" />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-[#7C7870] uppercase tracking-wide mb-1">Phone</label>
              <input value={form.phone} onChange={(e) => set("phone", e.target.value)} placeholder="+1 (000) 000-0000"
                className="w-full bg-[#F4F5F7] border border-[#E8E6E0] rounded-xl px-3 py-2.5 text-[13px] text-[#111] outline-none focus:border-indigo-400" />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-[#7C7870] uppercase tracking-wide mb-1">Type</label>
              <select value={form.contact_type} onChange={(e) => set("contact_type", e.target.value)}
                className="w-full bg-[#F4F5F7] border border-[#E8E6E0] rounded-xl px-3 py-2.5 text-[13px] text-[#7C7870] outline-none">
                {["Buyer","Seller","Investor","Tenant","Vendor","Other"].map((t) => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-[#7C7870] uppercase tracking-wide mb-1">Lead Score</label>
              <select value={form.lead_score} onChange={(e) => set("lead_score", e.target.value)}
                className="w-full bg-[#F4F5F7] border border-[#E8E6E0] rounded-xl px-3 py-2.5 text-[13px] text-[#7C7870] outline-none">
                {["Hot","Warm","Cold"].map((s) => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-[#7C7870] uppercase tracking-wide mb-1">City</label>
              <input value={form.city} onChange={(e) => set("city", e.target.value)} placeholder="City"
                className="w-full bg-[#F4F5F7] border border-[#E8E6E0] rounded-xl px-3 py-2.5 text-[13px] text-[#111] outline-none focus:border-indigo-400" />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-[#7C7870] uppercase tracking-wide mb-1">Province</label>
              <input value={form.province} onChange={(e) => set("province", e.target.value)} placeholder="ON"
                className="w-full bg-[#F4F5F7] border border-[#E8E6E0] rounded-xl px-3 py-2.5 text-[13px] text-[#111] outline-none focus:border-indigo-400" />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-[#7C7870] uppercase tracking-wide mb-1">Budget Min</label>
              <input type="number" value={form.budget_min} onChange={(e) => set("budget_min", e.target.value)} placeholder="0"
                className="w-full bg-[#F4F5F7] border border-[#E8E6E0] rounded-xl px-3 py-2.5 text-[13px] text-[#111] outline-none focus:border-indigo-400" />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-[#7C7870] uppercase tracking-wide mb-1">Budget Max</label>
              <input type="number" value={form.budget_max} onChange={(e) => set("budget_max", e.target.value)} placeholder="0"
                className="w-full bg-[#F4F5F7] border border-[#E8E6E0] rounded-xl px-3 py-2.5 text-[13px] text-[#111] outline-none focus:border-indigo-400" />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-[#7C7870] uppercase tracking-wide mb-1">Source</label>
              <select value={form.source} onChange={(e) => set("source", e.target.value)}
                className="w-full bg-[#F4F5F7] border border-[#E8E6E0] rounded-xl px-3 py-2.5 text-[13px] text-[#7C7870] outline-none">
                {["Website","Referral","Social Media","Cold Call","Portal","Walk-in","Other"].map((s) => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-[#7C7870] uppercase tracking-wide mb-1">Status</label>
              <select value={form.status} onChange={(e) => set("status", e.target.value)}
                className="w-full bg-[#F4F5F7] border border-[#E8E6E0] rounded-xl px-3 py-2.5 text-[13px] text-[#7C7870] outline-none">
                {["Active","Inactive","Archived"].map((s) => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div className="col-span-2">
              <label className="block text-[11px] font-semibold text-[#7C7870] uppercase tracking-wide mb-1">Tags (comma separated)</label>
              <input value={form.tags} onChange={(e) => set("tags", e.target.value)} placeholder="e.g. Cash Buyer, VIP, Repeat"
                className="w-full bg-[#F4F5F7] border border-[#E8E6E0] rounded-xl px-3 py-2.5 text-[13px] text-[#111] outline-none focus:border-indigo-400" />
            </div>
            <div className="col-span-2">
              <label className="block text-[11px] font-semibold text-[#7C7870] uppercase tracking-wide mb-1">Notes</label>
              <textarea value={form.notes} onChange={(e) => set("notes", e.target.value)} rows={2} placeholder="Any notes..."
                className="w-full bg-[#F4F5F7] border border-[#E8E6E0] rounded-xl px-3 py-2.5 text-[13px] text-[#111] outline-none focus:border-indigo-400 resize-none" />
            </div>
          </div>
          <div className="flex gap-2 pt-1">
            <button
              onClick={() => onSave({ ...form, tags: form.tags ? form.tags.split(",").map((t) => t.trim()) : [], budget_min: form.budget_min ? Number(form.budget_min) : null, budget_max: form.budget_max ? Number(form.budget_max) : null })}
              disabled={!form.full_name}
              className="flex-1 bg-[#111] hover:bg-[#222] disabled:opacity-40 text-white text-[13px] font-semibold py-2.5 rounded-xl transition-colors"
            >
              {customer ? "Update" : "Add Customer"}
            </button>
            <button onClick={onClose} className="flex-1 bg-[#F4F5F7] text-[#7C7870] text-[13px] font-semibold py-2.5 rounded-xl hover:bg-[#EDEAE3]">Cancel</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Contact[]>(MOCK_CUSTOMERS);
  const [loading, setLoading]     = useState(true);
  const [search, setSearch]       = useState("");
  const [typeFilter, setTypeFilter]   = useState("All");
  const [scoreFilter, setScoreFilter] = useState("All");
  const [view, setView]           = useState<"grid"|"list">("list");
  const [showModal, setShowModal] = useState(false);
  const [editCustomer, setEditCustomer] = useState<Contact | undefined>(undefined);
  const [selected, setSelected]   = useState<Contact | null>(null);

  useEffect(() => { fetchCustomers(); }, []);

  const fetchCustomers = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("contacts")
      .select("*")
      .order("created_at", { ascending: false });
    if (data && data.length > 0) setCustomers(data as Contact[]);
    setLoading(false);
  };

  const handleSave = async (form: Partial<Contact>) => {
    if (editCustomer) {
      await supabase.from("contacts").update(form).eq("id", editCustomer.id);
      setCustomers((prev) => prev.map((c) => c.id === editCustomer.id ? { ...c, ...form } : c));
    } else {
      const { data } = await supabase.from("contacts").insert(form).select().single();
      const newC = data || { ...form, id: Date.now().toString(), created_at: new Date().toISOString(), updated_at: "" } as Contact;
      setCustomers((prev) => [newC, ...prev]);
    }
    setShowModal(false);
    setEditCustomer(undefined);
  };

  const handleDelete = async (id: string) => {
    await supabase.from("contacts").delete().eq("id", id);
    setCustomers((prev) => prev.filter((c) => c.id !== id));
    if (selected?.id === id) setSelected(null);
  };

  const filtered = customers.filter((c) => {
    const s = search.toLowerCase();
    const matchSearch =
      c.full_name.toLowerCase().includes(s) ||
      (c.email || "").toLowerCase().includes(s) ||
      (c.city  || "").toLowerCase().includes(s);
    const matchType  = typeFilter  === "All" || c.contact_type === typeFilter;
    const matchScore = scoreFilter === "All" || c.lead_score   === scoreFilter;
    return matchSearch && matchType && matchScore;
  });

  const stats = [
    { label: "Total",     value: customers.length,                                      color: "bg-indigo-50 text-indigo-600"  },
    { label: "Buyers",    value: customers.filter((c) => c.contact_type === "Buyer").length,  color: "bg-emerald-50 text-emerald-600"},
    { label: "Investors", value: customers.filter((c) => c.contact_type === "Investor").length,color:"bg-violet-50 text-violet-600"  },
    { label: "Hot Leads", value: customers.filter((c) => c.lead_score   === "Hot").length,    color: "bg-rose-50 text-rose-600"     },
  ];

  function timeAgo(iso: string | null) {
    if (!iso) return "Never";
    const d = Math.floor((Date.now() - new Date(iso).getTime()) / 86400000);
    if (d === 0) return "Today";
    if (d === 1) return "Yesterday";
    return `${d} days ago`;
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-6 py-5 bg-white border-b border-[#E8E6E0] flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-[20px] font-bold text-[#111] tracking-tight">Customers</h1>
          <p className="text-[13px] text-[#A8A49C] mt-0.5">Dashboard › Customers</p>
        </div>
        <button onClick={() => { setEditCustomer(undefined); setShowModal(true); }}
          className="flex items-center gap-2 bg-[#111] hover:bg-[#222] text-white text-[13px] font-semibold px-4 py-2 rounded-xl transition-colors shadow-sm">
          <Plus size={15} /> Add Customer
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-5">
        {/* Stats */}
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
          {stats.map(({ label, value, color }) => (
            <div key={label} className={`rounded-xl p-4 ${color}`}>
              <p className="text-[11px] font-semibold uppercase tracking-wide opacity-70">{label}</p>
              <p className="text-[26px] font-bold tracking-tight mt-1">{value}</p>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl border border-[#E8E6E0] p-4 flex flex-wrap items-center gap-3 shadow-sm">
          <div className="flex items-center gap-2 bg-[#F4F5F7] rounded-xl px-3 py-2 flex-1 min-w-[180px]">
            <Search size={14} className="text-[#A8A49C] shrink-0" />
            <input type="text" placeholder="Search name, email, city..." value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-transparent text-[13px] text-[#111] placeholder-[#C5BFB5] outline-none w-full" />
          </div>

          <div className="flex items-center gap-1 bg-[#F4F5F7] rounded-xl p-1">
            {["All","Buyer","Seller","Investor","Tenant","Vendor"].map((t) => (
              <button key={t} onClick={() => setTypeFilter(t)}
                className={`text-[11px] font-semibold px-2.5 py-1.5 rounded-lg transition-colors ${typeFilter === t ? "bg-white text-[#111] shadow-sm" : "text-[#7C7870] hover:text-[#111]"}`}>
                {t}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1 bg-[#F4F5F7] rounded-xl p-1">
            {["All","Hot","Warm","Cold"].map((s) => (
              <button key={s} onClick={() => setScoreFilter(s)}
                className={`text-[11px] font-semibold px-2.5 py-1.5 rounded-lg transition-colors ${scoreFilter === s ? "bg-white text-[#111] shadow-sm" : "text-[#7C7870] hover:text-[#111]"}`}>
                {s}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1 bg-[#F4F5F7] rounded-xl p-1 ml-auto">
            <button onClick={() => setView("list")} className={`p-1.5 rounded-lg ${view==="list" ? "bg-white shadow-sm text-[#111]" : "text-[#A8A49C]"}`}><List size={15} /></button>
            <button onClick={() => setView("grid")} className={`p-1.5 rounded-lg ${view==="grid" ? "bg-white shadow-sm text-[#111]" : "text-[#A8A49C]"}`}><Grid3X3 size={15} /></button>
          </div>
        </div>

        <p className="text-[13px] text-[#A8A49C]">
          Showing <span className="font-semibold text-[#111]">{filtered.length}</span> customers
        </p>

        {/* List view */}
        {view === "list" && (
          <div className="bg-white rounded-xl border border-[#E8E6E0] shadow-sm overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#F0EDE6]">
                  {["Customer","Type","Lead Score","Budget","Location","Source","Last Contact",""].map((h) => (
                    <th key={h} className="text-left px-4 py-3 text-[11px] font-bold text-[#A8A49C] uppercase tracking-wide whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F9F8F6]">
                {filtered.map((c, i) => {
                  const scoreCfg = LEAD_SCORE_CFG[c.lead_score] || LEAD_SCORE_CFG.Cold;
                  const ScoreIcon = scoreCfg.icon;
                  const avatarBg = AVATAR_COLORS[i % AVATAR_COLORS.length];
                  const initials = c.full_name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0,2);
                  return (
                    <tr key={c.id} className="hover:bg-[#FAFAF8] transition-colors group cursor-pointer" onClick={() => setSelected(c)}>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2.5">
                          <div className={`w-8 h-8 rounded-full ${avatarBg} flex items-center justify-center text-white text-[11px] font-bold shrink-0`}>{initials}</div>
                          <div>
                            <p className="text-[13px] font-semibold text-[#111]">{c.full_name}</p>
                            <p className="text-[11px] text-[#A8A49C]">{c.email || "—"}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700">{c.contact_type}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full w-fit ${scoreCfg.bg} ${scoreCfg.color}`}>
                          <ScoreIcon size={10} />{c.lead_score}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-[12px] text-[#7C7870]">
                        {c.budget_min && c.budget_max
                          ? `CA$${(c.budget_min/1000).toFixed(0)}K – $${(c.budget_max/1000).toFixed(0)}K`
                          : "—"}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1 text-[12px] text-[#7C7870]">
                          <MapPin size={11} className="text-[#C5BFB5]" />
                          {c.city || "—"}{c.province ? `, ${c.province}` : ""}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        {c.source && (
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${SOURCE_BADGE[c.source] || SOURCE_BADGE.Other}`}>{c.source}</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-[12px] text-[#A8A49C]">{timeAgo(c.last_contact_at)}</td>
                      <td className="px-4 py-3">
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={(e) => { e.stopPropagation(); setEditCustomer(c); setShowModal(true); }} className="w-7 h-7 rounded-lg flex items-center justify-center text-[#A8A49C] hover:bg-amber-50 hover:text-amber-600"><Pencil size={12} /></button>
                          <button onClick={(e) => { e.stopPropagation(); handleDelete(c.id); }} className="w-7 h-7 rounded-lg flex items-center justify-center text-[#A8A49C] hover:bg-rose-50 hover:text-rose-600"><Trash2 size={12} /></button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {filtered.length === 0 && (
              <div className="text-center py-12 text-[#A8A49C]">
                <Users size={32} className="mx-auto mb-2 opacity-30" />
                <p className="text-[14px] font-medium">No customers found</p>
              </div>
            )}
          </div>
        )}

        {/* Grid view */}
        {view === "grid" && (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filtered.map((c, i) => {
              const scoreCfg = LEAD_SCORE_CFG[c.lead_score] || LEAD_SCORE_CFG.Cold;
              const ScoreIcon = scoreCfg.icon;
              const avatarBg  = AVATAR_COLORS[i % AVATAR_COLORS.length];
              const initials  = c.full_name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0,2);
              return (
                <div key={c.id} className="bg-white rounded-xl border border-[#E8E6E0] shadow-sm hover:shadow-md hover:border-indigo-200 transition-all p-4 cursor-pointer group" onClick={() => setSelected(c)}>
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2.5">
                      <div className={`w-10 h-10 rounded-full ${avatarBg} flex items-center justify-center text-white text-[12px] font-bold shrink-0`}>{initials}</div>
                      <div>
                        <p className="text-[14px] font-bold text-[#111]">{c.full_name}</p>
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-indigo-100 text-indigo-700">{c.contact_type}</span>
                      </div>
                    </div>
                    <span className={`flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.5 rounded-full ${scoreCfg.bg} ${scoreCfg.color}`}>
                      <ScoreIcon size={9} />{c.lead_score}
                    </span>
                  </div>
                  <div className="space-y-1 mb-3">
                    {c.email && <p className="text-[12px] text-[#7C7870] flex items-center gap-1.5"><Mail size={10} className="text-[#C5BFB5]" />{c.email}</p>}
                    {c.phone && <p className="text-[12px] text-[#7C7870] flex items-center gap-1.5"><Phone size={10} className="text-[#C5BFB5]" />{c.phone}</p>}
                    {(c.city || c.province) && <p className="text-[12px] text-[#7C7870] flex items-center gap-1.5"><MapPin size={10} className="text-[#C5BFB5]" />{[c.city, c.province].filter(Boolean).join(", ")}</p>}
                  </div>
                  {c.budget_min && c.budget_max && (
                    <div className="flex items-center gap-1.5 mb-3">
                      <DollarSign size={11} className="text-emerald-500" />
                      <span className="text-[11px] font-semibold text-[#111]">CA${(c.budget_min/1000).toFixed(0)}K – ${(c.budget_max/1000).toFixed(0)}K</span>
                    </div>
                  )}
                  {c.tags && c.tags.length > 0 && (
                    <div className="flex gap-1 flex-wrap mb-3">
                      {c.tags.map((t) => (
                        <span key={t} className="text-[10px] bg-[#F4F5F7] text-[#7C7870] px-2 py-0.5 rounded-md border border-[#E8E6E0]">{t}</span>
                      ))}
                    </div>
                  )}
                  <div className="flex items-center justify-between pt-2 border-t border-[#F0EDE6]">
                    <span className="text-[11px] text-[#A8A49C]">Last contact: {timeAgo(c.last_contact_at)}</span>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={(e) => { e.stopPropagation(); setEditCustomer(c); setShowModal(true); }} className="w-6 h-6 rounded flex items-center justify-center text-[#A8A49C] hover:text-amber-600"><Pencil size={11} /></button>
                      <button onClick={(e) => { e.stopPropagation(); handleDelete(c.id); }} className="w-6 h-6 rounded flex items-center justify-center text-[#A8A49C] hover:text-rose-500"><Trash2 size={11} /></button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {selected && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setSelected(null)}>
          <div className="bg-white rounded-2xl border border-[#E8E6E0] shadow-2xl w-full max-w-md" onClick={(e) => e.stopPropagation()}>
            <div className="p-5 border-b border-[#F0EDE6] flex items-center justify-between">
              <h2 className="text-[16px] font-bold text-[#111]">Customer Profile</h2>
              <button onClick={() => setSelected(null)} className="p-1.5 rounded-lg hover:bg-[#F4F5F7] text-[#A8A49C]"><X size={15} /></button>
            </div>
            <div className="p-5 space-y-4">
              {/* Header */}
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-full ${AVATAR_COLORS[0]} flex items-center justify-center text-white text-[15px] font-bold shrink-0`}>
                  {selected.full_name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0,2)}
                </div>
                <div>
                  <p className="text-[16px] font-bold text-[#111]">{selected.full_name}</p>
                  <div className="flex gap-1.5 mt-0.5">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700">{selected.contact_type}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${LEAD_SCORE_CFG[selected.lead_score]?.bg} ${LEAD_SCORE_CFG[selected.lead_score]?.color}`}>{selected.lead_score}</span>
                  </div>
                </div>
              </div>
              {/* Details grid */}
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label:"Email",        value:selected.email },
                  { label:"Phone",        value:selected.phone },
                  { label:"City",         value:[selected.city,selected.province].filter(Boolean).join(", ") },
                  { label:"Source",       value:selected.source },
                  { label:"Status",       value:selected.status },
                  { label:"Last Contact", value:timeAgo(selected.last_contact_at) },
                  { label:"Budget Min",   value:selected.budget_min ? `CA$${selected.budget_min.toLocaleString()}` : null },
                  { label:"Budget Max",   value:selected.budget_max ? `CA$${selected.budget_max.toLocaleString()}` : null },
                ].map(({ label, value }) => value ? (
                  <div key={label}>
                    <p className="text-[10px] font-semibold text-[#A8A49C] uppercase tracking-wide mb-0.5">{label}</p>
                    <p className="text-[13px] font-semibold text-[#111]">{value}</p>
                  </div>
                ) : null)}
              </div>
              {selected.tags && selected.tags.length > 0 && (
                <div>
                  <p className="text-[10px] font-semibold text-[#A8A49C] uppercase tracking-wide mb-1.5">Tags</p>
                  <div className="flex gap-1.5 flex-wrap">
                    {selected.tags.map((t) => (
                      <span key={t} className="text-[11px] bg-[#F4F5F7] text-[#7C7870] px-2.5 py-1 rounded-lg border border-[#E8E6E0]">{t}</span>
                    ))}
                  </div>
                </div>
              )}
              <div className="flex gap-2 pt-1">
                <button className="flex-1 flex items-center justify-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-[12px] font-semibold py-2.5 rounded-xl"><Phone size={13} />Call</button>
                <button className="flex-1 flex items-center justify-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-[12px] font-semibold py-2.5 rounded-xl"><Mail size={13} />Email</button>
                <button onClick={() => { setEditCustomer(selected); setSelected(null); setShowModal(true); }} className="flex-1 bg-[#F4F5F7] text-[#7C7870] text-[12px] font-semibold py-2.5 rounded-xl hover:bg-[#EDEAE3]">Edit</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showModal && (
        <CustomerModal
          customer={editCustomer}
          onClose={() => { setShowModal(false); setEditCustomer(undefined); }}
          onSave={handleSave}
        />
      )}
    </div>
  );
}