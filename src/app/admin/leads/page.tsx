"use client";

import { useEffect, useState } from "react";
import {
  Search, Plus, Download, X, AlertCircle,
  Users, Flame, Thermometer, Snowflake, TrendingUp, CalendarDays,
  Home, Eye,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import {
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer,
} from "recharts";

// ── Types ─────────────────────────────────────────────────────────────────────

type LeadScore = "Hot" | "Warm" | "Cold";

interface Lead {
  id: string;
  full_name: string;
  email: string | null;
  phone: string | null;
  contact_type: "Buyer" | "Investor" | "Tenant";
  lead_score: LeadScore;
  source: string | null;
  budget_min: number | null;
  budget_max: number | null;
  assigned_agent: string | null;
  last_contact_at: string | null;
  created_at: string;
  pipeline_stage: string | null;
}

interface MatchedProperty {
  id: string;
  address: string;
  list_price: number;
  beds: number | null;
  baths: number | null;
  status: string;
}

// ── Config ────────────────────────────────────────────────────────────────────

const SCORE_CFG: Record<LeadScore, { bg: string; text: string; icon: React.ElementType }> = {
  Hot:  { bg: "bg-rose-100",  text: "text-rose-700",  icon: Flame       },
  Warm: { bg: "bg-amber-100", text: "text-amber-700", icon: Thermometer },
  Cold: { bg: "bg-slate-100", text: "text-slate-600", icon: Snowflake   },
};

const TYPE_CFG: Record<string, string> = {
  Buyer:    "bg-indigo-100 text-indigo-700",
  Investor: "bg-violet-100 text-violet-700",
  Tenant:   "bg-teal-100 text-teal-700",
};

const PIE_COLORS = ["#6366F1","#10B981","#F59E0B","#F43F5E","#8B5CF6","#06B6D4","#F97316"];

const FUNNEL_STAGES = [
  { label: "New",             count: 38 },
  { label: "Contacted",       count: 27 },
  { label: "Appointment",     count: 18 },
  { label: "Due Diligence",   count: 9  },
  { label: "Closed",          count: 5  },
];

// ── Mock data ─────────────────────────────────────────────────────────────────

const now = Date.now();
const daysAgo = (d: number) => new Date(now - d * 86400000).toISOString();

const MOCK_LEADS: Lead[] = [
  { id:"l1",  full_name:"Thomas Morrison",  email:"t.morrison@email.com",    phone:"+1 (416) 555-0182", contact_type:"Buyer",    lead_score:"Hot",  source:"Website",       budget_min:400000,  budget_max:650000,  assigned_agent:"Sarah Kim",    last_contact_at:daysAgo(1),  created_at:daysAgo(3),  pipeline_stage:"Appointment"   },
  { id:"l2",  full_name:"Aisha Patel",      email:"aisha.p@invest.com",      phone:"+1 (604) 555-0247", contact_type:"Investor", lead_score:"Hot",  source:"Referral",      budget_min:800000,  budget_max:1500000, assigned_agent:"Mike Roberts", last_contact_at:daysAgo(0),  created_at:daysAgo(1),  pipeline_stage:"Due Diligence" },
  { id:"l3",  full_name:"Derek Walsh",      email:"d.walsh@home.ca",         phone:"+1 (403) 555-0391", contact_type:"Buyer",    lead_score:"Warm", source:"Open House",    budget_min:300000,  budget_max:480000,  assigned_agent:"Priya Sharma", last_contact_at:daysAgo(3),  created_at:daysAgo(8),  pipeline_stage:"Contacted"     },
  { id:"l4",  full_name:"Linda Cheng",      email:"lindacheng@mail.com",     phone:"+1 (514) 555-0128", contact_type:"Tenant",   lead_score:"Cold", source:"Social Media",  budget_min:1500,    budget_max:2500,    assigned_agent:null,           last_contact_at:daysAgo(14), created_at:daysAgo(20), pipeline_stage:"New"           },
  { id:"l5",  full_name:"Marcus Reid",      email:"m.reid@outlook.ca",       phone:"+1 (613) 555-0456", contact_type:"Buyer",    lead_score:"Warm", source:"Zillow",        budget_min:350000,  budget_max:520000,  assigned_agent:"Sarah Kim",    last_contact_at:daysAgo(5),  created_at:daysAgo(10), pipeline_stage:"Contacted"     },
  { id:"l6",  full_name:"Fatima Hassan",    email:"fhassan@ventures.com",    phone:"+1 (204) 555-0673", contact_type:"Investor", lead_score:"Warm", source:"Agent Referral",budget_min:600000,  budget_max:1200000, assigned_agent:"James Liu",    last_contact_at:daysAgo(7),  created_at:daysAgo(12), pipeline_stage:"Appointment"   },
  { id:"l7",  full_name:"Carlos Mendez",    email:"c.mendez@realty.ca",      phone:"+1 (306) 555-0784", contact_type:"Investor", lead_score:"Hot",  source:"Cold Call",     budget_min:500000,  budget_max:900000,  assigned_agent:"Mike Roberts", last_contact_at:daysAgo(0),  created_at:daysAgo(2),  pipeline_stage:"Due Diligence" },
  { id:"l8",  full_name:"Sarah Nguyen",     email:"s.nguyen@realty.com",     phone:"+1 (780) 555-0912", contact_type:"Buyer",    lead_score:"Hot",  source:"Referral",      budget_min:450000,  budget_max:700000,  assigned_agent:"Priya Sharma", last_contact_at:daysAgo(0),  created_at:daysAgo(4),  pipeline_stage:"Closed"        },
  { id:"l9",  full_name:"John Davidson",    email:"j.davidson@gmail.com",    phone:"+1 (416) 555-0183", contact_type:"Buyer",    lead_score:"Warm", source:"Website",       budget_min:380000,  budget_max:560000,  assigned_agent:"Sarah Kim",    last_contact_at:daysAgo(2),  created_at:daysAgo(6),  pipeline_stage:"Contacted"     },
  { id:"l10", full_name:"Nina Torres",      email:"n.torres@outlook.com",    phone:"+1 (902) 555-0341", contact_type:"Tenant",   lead_score:"Cold", source:"Social Media",  budget_min:1200,    budget_max:2000,    assigned_agent:null,           last_contact_at:daysAgo(10), created_at:daysAgo(15), pipeline_stage:"New"           },
];

const MOCK_PROPERTIES: MatchedProperty[] = [
  { id:"p1", address:"42 Maple Street, Toronto, ON",       list_price:520000,  beds:3, baths:2, status:"Available"       },
  { id:"p2", address:"18 Lakeview Drive, Vancouver, BC",   list_price:890000,  beds:4, baths:3, status:"Available"       },
  { id:"p3", address:"34 Cedar Hills Dr, Regina, SK",      list_price:415000,  beds:3, baths:2, status:"Pending"         },
  { id:"p4", address:"93 Harbor Blvd, Montreal, QC",       list_price:1100000, beds:5, baths:4, status:"Available"       },
  { id:"p5", address:"5 Birchwood Court, Ottawa, ON",      list_price:375000,  beds:2, baths:1, status:"Available"       },
  { id:"p6", address:"11 Rosewood Blvd, Winnipeg, MB",     list_price:460000,  beds:3, baths:2, status:"Under Contract"  },
  { id:"p7", address:"66 Willow Creek Rd, Halifax, NS",    list_price:295000,  beds:2, baths:1, status:"Available"       },
  { id:"p8", address:"7 Pine Avenue, Calgary, AB",         list_price:610000,  beds:4, baths:3, status:"Available"       },
];

// ── Helpers ───────────────────────────────────────────────────────────────────

function fmt(n: number) {
  if (n >= 1000000) return `CA$${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000)    return `CA$${(n / 1000).toFixed(0)}K`;
  return `CA$${n.toLocaleString()}`;
}

function fmtDate(iso: string | null) {
  if (!iso) return "—";
  const d = new Date(iso);
  const diff = Math.floor((Date.now() - d.getTime()) / 86400000);
  if (diff === 0) return "Today";
  if (diff === 1) return "Yesterday";
  if (diff < 7)  return `${diff}d ago`;
  return d.toLocaleDateString("en-CA", { month: "short", day: "numeric" });
}

// ── Match Properties Modal ────────────────────────────────────────────────────

function MatchModal({ lead, onClose }: { lead: Lead; onClose: () => void }) {
  const matched = MOCK_PROPERTIES.filter((p) => {
    if (!lead.budget_min && !lead.budget_max) return true;
    const min = lead.budget_min ?? 0;
    const max = lead.budget_max ?? Infinity;
    return p.list_price >= min && p.list_price <= max;
  });

  const STATUS_BADGE: Record<string, string> = {
    Available:       "bg-emerald-100 text-emerald-700",
    Pending:         "bg-amber-100 text-amber-700",
    "Under Contract":"bg-indigo-100 text-indigo-700",
    Sold:            "bg-slate-100 text-slate-600",
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl border border-[#E8E6E0] shadow-2xl w-full max-w-lg max-h-[85vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-5 border-b border-[#F0EDE6] shrink-0">
          <div>
            <h2 className="text-[16px] font-bold text-[#111]">Matched Properties</h2>
            <p className="text-[12px] text-[#7C7870] mt-0.5">
              Budget: {lead.budget_min ? fmt(lead.budget_min) : "—"} – {lead.budget_max ? fmt(lead.budget_max) : "—"} · {lead.full_name}
            </p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-[#F4F5F7] text-[#A8A49C]"><X size={15} /></button>
        </div>
        <div className="overflow-y-auto p-5 space-y-3">
          {matched.length === 0 ? (
            <div className="text-center py-10 text-[13px] text-[#A8A49C]">No properties match this budget range.</div>
          ) : matched.map((p) => (
            <div key={p.id} className="bg-[#FAFAF8] rounded-xl border border-[#E8E6E0] p-4 flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-indigo-50 flex items-center justify-center shrink-0">
                <Home size={16} className="text-indigo-500" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-semibold text-[#111] truncate">{p.address}</p>
                <div className="flex items-center gap-3 mt-0.5">
                  <span className="text-[12px] font-bold text-indigo-600">{fmt(p.list_price)}</span>
                  {p.beds && <span className="text-[11px] text-[#7C7870]">{p.beds} bd</span>}
                  {p.baths && <span className="text-[11px] text-[#7C7870]">{p.baths} ba</span>}
                </div>
              </div>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${STATUS_BADGE[p.status] ?? "bg-slate-100 text-slate-600"}`}>
                {p.status}
              </span>
            </div>
          ))}
        </div>
        <div className="p-5 border-t border-[#F0EDE6] shrink-0">
          <button onClick={onClose} className="w-full bg-[#111] hover:bg-[#222] text-white text-[13px] font-semibold py-2.5 rounded-xl transition-colors">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function LeadsPage() {
  const [leads, setLeads]           = useState<Lead[]>(MOCK_LEADS);
  const [usingMock, setUsingMock]   = useState(true);
  const [loading, setLoading]       = useState(true);
  const [search, setSearch]         = useState("");
  const [scoreFilter, setScoreFilter] = useState("All");
  const [sourceFilter, setSourceFilter] = useState("All");
  const [matchLead, setMatchLead]   = useState<Lead | null>(null);

  useEffect(() => {
    supabase
      .from("contacts")
      .select("*")
      .in("contact_type", ["Buyer", "Investor", "Tenant"])
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        if (data && data.length > 0) {
          setLeads(data as Lead[]);
          setUsingMock(false);
        }
        setLoading(false);
      });
  }, []);

  // ── Derived stats ──────────────────────────────────────────────────────────

  const total      = leads.length;
  const hotCount   = leads.filter((l) => l.lead_score === "Hot").length;
  const warmCount  = leads.filter((l) => l.lead_score === "Warm").length;
  const coldCount  = leads.filter((l) => l.lead_score === "Cold").length;
  const closedCount = leads.filter((l) => l.pipeline_stage === "Closed").length;
  const convRate   = total > 0 ? ((closedCount / total) * 100).toFixed(1) : "0.0";
  const weekAgo    = new Date(Date.now() - 7 * 86400000).toISOString();
  const newThisWeek = leads.filter((l) => l.created_at >= weekAgo).length;

  // ── Source pie data ────────────────────────────────────────────────────────

  const sourceMap = leads.reduce<Record<string, number>>((acc, l) => {
    const s = l.source ?? "Unknown";
    acc[s] = (acc[s] ?? 0) + 1;
    return acc;
  }, {});
  const pieData = Object.entries(sourceMap).map(([name, value]) => ({ name, value }));

  // ── Unique sources for filter ──────────────────────────────────────────────

  const allSources = ["All", ...Array.from(new Set(leads.map((l) => l.source ?? "Unknown")))];

  // ── Filtered leads ─────────────────────────────────────────────────────────

  const filtered = leads.filter((l) => {
    const s = search.toLowerCase();
    const matchSearch =
      l.full_name.toLowerCase().includes(s) ||
      (l.email ?? "").toLowerCase().includes(s) ||
      (l.phone ?? "").toLowerCase().includes(s);
    const matchScore  = scoreFilter  === "All" || l.lead_score === scoreFilter;
    const matchSource = sourceFilter === "All" || (l.source ?? "Unknown") === sourceFilter;
    return matchSearch && matchScore && matchSource;
  });

  // ── Funnel max for bar widths ──────────────────────────────────────────────

  const funnelMax = Math.max(...FUNNEL_STAGES.map((s) => s.count));

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-6 py-5 bg-white border-b border-[#E8E6E0] flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-[20px] font-bold text-[#111] tracking-tight">Leads</h1>
          <p className="text-[13px] text-[#A8A49C] mt-0.5">Dashboard › Leads</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 border border-[#E8E6E0] rounded-xl px-4 py-2 text-[13px] font-semibold text-[#7C7870] hover:bg-[#F4F5F7] transition-colors">
            <Download size={14} /> Export
          </button>
          <button className="flex items-center gap-2 bg-[#111] hover:bg-[#222] text-white text-[13px] font-semibold px-4 py-2 rounded-xl transition-colors shadow-sm">
            <Plus size={15} /> Add Lead
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-5">

        {/* Sample banner */}
        {usingMock && !loading && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-2.5 text-[13px] text-amber-700 flex items-center gap-2">
            <AlertCircle size={14} /> Showing sample data — connect Supabase to load live leads.
          </div>
        )}

        {/* KPI cards */}
        <div className="grid grid-cols-2 xl:grid-cols-3 gap-4">
          {[
            { label:"Total Leads",      value:total,          icon:Users,        color:"bg-indigo-50 text-indigo-600"  },
            { label:"Hot Leads",        value:hotCount,       icon:Flame,        color:"bg-rose-50 text-rose-600"      },
            { label:"Warm Leads",       value:warmCount,      icon:Thermometer,  color:"bg-amber-50 text-amber-600"    },
            { label:"Cold Leads",       value:coldCount,      icon:Snowflake,    color:"bg-slate-50 text-slate-600"    },
            { label:"Conversion Rate",  value:`${convRate}%`, icon:TrendingUp,   color:"bg-emerald-50 text-emerald-600"},
            { label:"New This Week",    value:newThisWeek,    icon:CalendarDays, color:"bg-violet-50 text-violet-600"  },
          ].map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="bg-white rounded-xl border border-[#E8E6E0] shadow-sm p-4 flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${color}`}>
                <Icon size={18} />
              </div>
              <div>
                <p className="text-[11px] font-semibold text-[#7C7870] uppercase tracking-wide">{label}</p>
                <p className="text-[22px] font-bold text-[#111] tracking-tight leading-none mt-0.5">{value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Charts row */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">

          {/* Pie chart — source breakdown */}
          <div className="bg-white rounded-xl border border-[#E8E6E0] shadow-sm p-5">
            <h3 className="text-[14px] font-bold text-[#111] mb-4">Lead Source Breakdown</h3>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3} dataKey="value">
                  {pieData.map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ background:"#111", border:"none", borderRadius:"10px", color:"#fff", fontSize:"12px" }}
                />
                <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize:"11px", color:"#7C7870" }} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Conversion funnel — horizontal bars */}
          <div className="bg-white rounded-xl border border-[#E8E6E0] shadow-sm p-5">
            <h3 className="text-[14px] font-bold text-[#111] mb-4">Conversion Funnel</h3>
            <div className="space-y-3">
              {FUNNEL_STAGES.map(({ label, count }) => (
                <div key={label} className="flex items-center gap-3">
                  <span className="text-[12px] text-[#7C7870] w-28 shrink-0">{label}</span>
                  <div className="flex-1 h-6 bg-[#F4F5F7] rounded-lg overflow-hidden">
                    <div
                      className="h-full bg-indigo-500 rounded-lg transition-all"
                      style={{ width: `${(count / funnelMax) * 100}%` }}
                    />
                  </div>
                  <span className="text-[12px] font-bold text-[#111] w-6 text-right shrink-0">{count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Filter bar */}
        <div className="bg-white rounded-xl border border-[#E8E6E0] shadow-sm p-4 flex flex-wrap items-center gap-3">
          {/* Search */}
          <div className="flex items-center gap-2 bg-[#F4F5F7] border border-[#E8E6E0] rounded-xl px-3 py-2.5 flex-1 min-w-[200px]">
            <Search size={14} className="text-[#A8A49C] shrink-0" />
            <input
              type="text"
              placeholder="Search name, email, phone..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-transparent text-[13px] text-[#111] placeholder-[#C5BFB5] outline-none w-full"
            />
          </div>

          {/* Score pills */}
          <div className="flex items-center gap-1 bg-[#F4F5F7] rounded-xl p-1">
            {["All","Hot","Warm","Cold"].map((s) => (
              <button key={s} onClick={() => setScoreFilter(s)}
                className={`text-[11px] font-semibold px-3 py-1.5 rounded-lg transition-colors ${scoreFilter === s ? "bg-white text-[#111] shadow-sm" : "text-[#7C7870] hover:text-[#111]"}`}>
                {s}
              </button>
            ))}
          </div>

          {/* Source dropdown */}
          <select
            value={sourceFilter}
            onChange={(e) => setSourceFilter(e.target.value)}
            className="bg-[#F4F5F7] border border-[#E8E6E0] rounded-xl px-3 py-2.5 text-[13px] text-[#7C7870] outline-none"
          >
            {allSources.map((s) => <option key={s}>{s}</option>)}
          </select>
        </div>

        {/* Leads table */}
        <div className="bg-white rounded-xl border border-[#E8E6E0] shadow-sm overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#F0EDE6]">
                {["Lead","Type","Score","Source","Budget","Agent","Last Contact",""].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-[11px] font-semibold text-[#7C7870] uppercase tracking-wide whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F9F8F6]">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-10 text-center text-[13px] text-[#A8A49C]">No leads match your filters.</td>
                </tr>
              ) : filtered.map((lead) => {
                const sc = SCORE_CFG[lead.lead_score];
                const ScoreIcon = sc.icon;
                return (
                  <tr key={lead.id} className="hover:bg-[#FAFAF8] transition-colors group">
                    <td className="px-4 py-3">
                      <p className="text-[13px] font-semibold text-[#111]">{lead.full_name}</p>
                      <p className="text-[11px] text-[#A8A49C]">{lead.email ?? lead.phone ?? "—"}</p>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${TYPE_CFG[lead.contact_type] ?? "bg-slate-100 text-slate-600"}`}>
                        {lead.contact_type}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full w-fit ${sc.bg} ${sc.text}`}>
                        <ScoreIcon size={11} /> {lead.lead_score}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-[12px] text-[#7C7870]">{lead.source ?? "—"}</td>
                    <td className="px-4 py-3 text-[12px] text-[#7C7870] whitespace-nowrap">
                      {lead.budget_min || lead.budget_max
                        ? `${lead.budget_min ? fmt(lead.budget_min) : "—"} – ${lead.budget_max ? fmt(lead.budget_max) : "—"}`
                        : "—"}
                    </td>
                    <td className="px-4 py-3 text-[12px] text-[#7C7870]">{lead.assigned_agent ?? "Unassigned"}</td>
                    <td className="px-4 py-3 text-[12px] text-[#A8A49C]">{fmtDate(lead.last_contact_at)}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => setMatchLead(lead)}
                          className="flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1.5 rounded-lg border border-[#E8E6E0] text-[#7C7870] hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200 transition-colors whitespace-nowrap"
                        >
                          <Home size={11} /> Match
                        </button>
                        <button className="w-7 h-7 rounded-lg flex items-center justify-center text-[#A8A49C] hover:bg-[#F4F5F7] border border-[#E8E6E0] transition-colors">
                          <Eye size={12} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Match Properties Modal */}
      {matchLead && <MatchModal lead={matchLead} onClose={() => setMatchLead(null)} />}
    </div>
  );
}
