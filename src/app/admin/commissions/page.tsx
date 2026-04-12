"use client";

import { useEffect, useState } from "react";
import {
  Plus, Search, Filter, Download, DollarSign,
  TrendingUp, CheckCircle2, Clock, XCircle,
  X, ChevronDown, Award, Star, BarChart3,
  Eye, Pencil, Trash2, RefreshCw, Calculator,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Cell,
} from "recharts";

// ── Types ─────────────────────────────────────────────────────────────────────

interface Commission {
  id: string;
  deal_id: string | null;
  agent_id: string | null;
  agent_name: string;
  agent_initials: string;
  agent_color: string;
  property_address: string;
  deal_type: string;
  sale_price: number;
  commission_pct: number;
  gross_commission: number;
  split_pct: number;
  agent_commission: number;
  brokerage_fee: number;
  net_commission: number;
  status: "Pending" | "Approved" | "Paid" | "Disputed";
  paid_date: string | null;
  notes: string | null;
  created_at: string;
}

// ── Config ────────────────────────────────────────────────────────────────────

const STATUS_CFG: Record<string, { color: string; bg: string; icon: React.ElementType }> = {
  Pending:  { color: "text-amber-700",   bg: "bg-amber-100",   icon: Clock        },
  Approved: { color: "text-indigo-700",  bg: "bg-indigo-100",  icon: CheckCircle2 },
  Paid:     { color: "text-emerald-700", bg: "bg-emerald-100", icon: CheckCircle2 },
  Disputed: { color: "text-rose-700",    bg: "bg-rose-100",    icon: XCircle      },
};

const AGENT_COLORS = [
  "bg-indigo-500","bg-violet-500","bg-emerald-500",
  "bg-amber-500","bg-rose-500","bg-teal-500","bg-orange-500",
];

// ── Mock data ─────────────────────────────────────────────────────────────────

const MOCK_COMMISSIONS: Commission[] = [
  { id:"cm1",  deal_id:"d1", agent_id:"t3", agent_name:"Sarah Kim",    agent_initials:"SK", agent_color:"bg-indigo-500",  property_address:"42 Maple Street, Toronto",    deal_type:"Fix & Flip", sale_price:480000,  commission_pct:3.0, gross_commission:14400, split_pct:100, agent_commission:14400, brokerage_fee:2160, net_commission:12240, status:"Paid",     paid_date:"2026-03-10", notes:"Closed on time",         created_at:new Date(Date.now()-10*86400000).toISOString() },
  { id:"cm2",  deal_id:"d2", agent_id:"t4", agent_name:"Mike Roberts", agent_initials:"MR", agent_color:"bg-violet-500",  property_address:"18 Lakeview Drive, Vancouver", deal_type:"Rental",    sale_price:920000,  commission_pct:2.5, gross_commission:23000, split_pct:100, agent_commission:23000, brokerage_fee:3450, net_commission:19550, status:"Approved", paid_date:null,          notes:null,                      created_at:new Date(Date.now()-5*86400000).toISOString()  },
  { id:"cm3",  deal_id:"d3", agent_id:"t5", agent_name:"Priya Sharma", agent_initials:"PS", agent_color:"bg-emerald-500", property_address:"34 Cedar Hills Dr, Regina",    deal_type:"Wholesale", sale_price:610000,  commission_pct:2.8, gross_commission:17080, split_pct:80,  agent_commission:13664, brokerage_fee:2562, net_commission:11102, status:"Paid",     paid_date:"2026-03-05", notes:"Split 80/20 with broker", created_at:new Date(Date.now()-15*86400000).toISOString() },
  { id:"cm4",  deal_id:"d4", agent_id:"t2", agent_name:"James Liu",    agent_initials:"JL", agent_color:"bg-amber-500",   property_address:"93 Harbor Blvd, Montreal",     deal_type:"Fix & Flip", sale_price:1250000, commission_pct:3.5, gross_commission:43750, split_pct:100, agent_commission:43750, brokerage_fee:6563, net_commission:37188, status:"Pending",  paid_date:null,          notes:"Awaiting final closing",  created_at:new Date(Date.now()-3*86400000).toISOString()  },
  { id:"cm5",  deal_id:"d5", agent_id:"t6", agent_name:"Nina Torres",  agent_initials:"NT", agent_color:"bg-rose-500",    property_address:"5 Birchwood Court, Ottawa",    deal_type:"Rental",    sale_price:395000,  commission_pct:2.5, gross_commission:9875,  split_pct:100, agent_commission:9875,  brokerage_fee:1481, net_commission:8394,  status:"Disputed", paid_date:null,          notes:"Commission % in dispute", created_at:new Date(Date.now()-7*86400000).toISOString()  },
  { id:"cm6",  deal_id:"d6", agent_id:"t3", agent_name:"Sarah Kim",    agent_initials:"SK", agent_color:"bg-indigo-500",  property_address:"11 Rosewood Blvd, Winnipeg",   deal_type:"Fix & Flip", sale_price:425000,  commission_pct:3.0, gross_commission:12750, split_pct:100, agent_commission:12750, brokerage_fee:1913, net_commission:10838, status:"Approved", paid_date:null,          notes:null,                      created_at:new Date(Date.now()-2*86400000).toISOString()  },
  { id:"cm7",  deal_id:"d7", agent_id:"t4", agent_name:"Mike Roberts", agent_initials:"MR", agent_color:"bg-violet-500",  property_address:"66 Willow Creek Rd, Halifax",  deal_type:"Rental",    sale_price:275000,  commission_pct:2.5, gross_commission:6875,  split_pct:90,  agent_commission:6188,  brokerage_fee:1031, net_commission:5157,  status:"Paid",     paid_date:"2026-03-08", notes:null,                      created_at:new Date(Date.now()-12*86400000).toISOString() },
  { id:"cm8",  deal_id:"d8", agent_id:"t5", agent_name:"Priya Sharma", agent_initials:"PS", agent_color:"bg-emerald-500", property_address:"7 Pine Avenue, Calgary",       deal_type:"Wholesale", sale_price:310000,  commission_pct:2.8, gross_commission:8680,  split_pct:100, agent_commission:8680,  brokerage_fee:1302, net_commission:7378,  status:"Pending",  paid_date:null,          notes:null,                      created_at:new Date(Date.now()-1*86400000).toISOString()  },
];

// ── Commission Calculator Modal ───────────────────────────────────────────────

function CalculatorModal({ onClose }: { onClose: () => void }) {
  const [salePrice,     setSalePrice]     = useState(500000);
  const [commPct,       setCommPct]       = useState(3.0);
  const [splitPct,      setSplitPct]      = useState(100);
  const [brokeragePct,  setBrokeragePct]  = useState(15);

  const gross    = salePrice * (commPct / 100);
  const agentAmt = gross * (splitPct / 100);
  const brokFee  = agentAmt * (brokeragePct / 100);
  const net      = agentAmt - brokFee;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl border border-[#E8E6E0] shadow-2xl w-full max-w-md" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-5 border-b border-[#F0EDE6]">
          <div className="flex items-center gap-2">
            <Calculator size={18} className="text-indigo-600" />
            <h2 className="text-[16px] font-bold text-[#111]">Commission Calculator</h2>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-[#F4F5F7] text-[#A8A49C]"><X size={15} /></button>
        </div>
        <div className="p-5 space-y-4">
          {/* Inputs */}
          <div className="space-y-3">
            {[
              { label:"Sale Price (CA$)",      val:salePrice,    set:setSalePrice,    step:10000, min:0     },
              { label:"Commission Rate (%)",   val:commPct,      set:setCommPct,      step:0.1,  min:0     },
              { label:"Agent Split (%)",       val:splitPct,     set:setSplitPct,     step:5,    min:0, max:100 },
              { label:"Brokerage Fee (%)",     val:brokeragePct, set:setBrokeragePct, step:1,    min:0, max:50  },
            ].map(({ label, val, set, step, min, max }) => (
              <div key={label}>
                <label className="block text-[11px] font-semibold text-[#7C7870] uppercase tracking-wide mb-1">{label}</label>
                <input
                  type="number"
                  value={val}
                  step={step}
                  min={min}
                  max={max}
                  onChange={(e) => set(parseFloat(e.target.value) || 0)}
                  className="w-full bg-[#F4F5F7] border border-[#E8E6E0] rounded-xl px-3 py-2.5 text-[13px] text-[#111] outline-none focus:border-indigo-400"
                />
              </div>
            ))}
          </div>

          {/* Results */}
          <div className="bg-[#FAFAF8] rounded-xl border border-[#F0EDE6] p-4 space-y-3">
            {[
              { label:"Gross Commission",  value:gross,    color:"text-[#111]"        },
              { label:"Agent Commission",  value:agentAmt, color:"text-indigo-600"    },
              { label:"Brokerage Fee",     value:brokFee,  color:"text-rose-500"      },
              { label:"Net Commission",    value:net,      color:"text-emerald-600",  bold:true },
            ].map(({ label, value, color, bold }) => (
              <div key={label} className={`flex items-center justify-between ${bold ? "pt-3 border-t border-[#E8E6E0]" : ""}`}>
                <span className={`text-[13px] ${bold ? "font-bold text-[#111]" : "text-[#7C7870]"}`}>{label}</span>
                <span className={`text-[${bold ? "16" : "13"}px] font-bold ${color}`}>
                  CA${value.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                </span>
              </div>
            ))}
          </div>

          <button onClick={onClose}
            className="w-full bg-[#111] hover:bg-[#222] text-white text-[13px] font-semibold py-2.5 rounded-xl transition-colors">
            Close Calculator
          </button>
        </div>
      </div>
    </div>
  );
}

// ── New Commission Modal ──────────────────────────────────────────────────────

function CommissionModal({ onClose, onSave }: {
  onClose: () => void;
  onSave: (data: Partial<Commission>) => void;
}) {
  const [form, setForm] = useState({
    agent_name: "", property_address: "", deal_type: "Fix & Flip",
    sale_price: "", commission_pct: "3.0", split_pct: "100",
    brokerage_fee: "", status: "Pending", notes: "",
  });

  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const salePrice    = parseFloat(form.sale_price)    || 0;
  const commPct      = parseFloat(form.commission_pct) || 0;
  const splitPct     = parseFloat(form.split_pct)     || 100;
  const gross        = salePrice * (commPct / 100);
  const agentComm    = gross * (splitPct / 100);
  const brokFee      = parseFloat(form.brokerage_fee) || agentComm * 0.15;
  const net          = agentComm - brokFee;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl border border-[#E8E6E0] shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-5 border-b border-[#F0EDE6]">
          <h2 className="text-[16px] font-bold text-[#111]">New Commission Record</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-[#F4F5F7] text-[#A8A49C]"><X size={15} /></button>
        </div>
        <div className="p-5 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2">
              <label className="block text-[11px] font-semibold text-[#7C7870] uppercase tracking-wide mb-1">Agent Name *</label>
              <input value={form.agent_name} onChange={(e) => set("agent_name", e.target.value)} placeholder="Agent full name"
                className="w-full bg-[#F4F5F7] border border-[#E8E6E0] rounded-xl px-3 py-2.5 text-[13px] text-[#111] outline-none focus:border-indigo-400" />
            </div>
            <div className="col-span-2">
              <label className="block text-[11px] font-semibold text-[#7C7870] uppercase tracking-wide mb-1">Property Address *</label>
              <input value={form.property_address} onChange={(e) => set("property_address", e.target.value)} placeholder="Full property address"
                className="w-full bg-[#F4F5F7] border border-[#E8E6E0] rounded-xl px-3 py-2.5 text-[13px] text-[#111] outline-none focus:border-indigo-400" />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-[#7C7870] uppercase tracking-wide mb-1">Deal Type</label>
              <select value={form.deal_type} onChange={(e) => set("deal_type", e.target.value)}
                className="w-full bg-[#F4F5F7] border border-[#E8E6E0] rounded-xl px-3 py-2.5 text-[13px] text-[#7C7870] outline-none">
                {["Fix & Flip","Rental","Wholesale","Primary"].map((t) => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-[#7C7870] uppercase tracking-wide mb-1">Sale Price (CA$)</label>
              <input type="number" value={form.sale_price} onChange={(e) => set("sale_price", e.target.value)} placeholder="0"
                className="w-full bg-[#F4F5F7] border border-[#E8E6E0] rounded-xl px-3 py-2.5 text-[13px] text-[#111] outline-none focus:border-indigo-400" />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-[#7C7870] uppercase tracking-wide mb-1">Commission % </label>
              <input type="number" step="0.1" value={form.commission_pct} onChange={(e) => set("commission_pct", e.target.value)} placeholder="3.0"
                className="w-full bg-[#F4F5F7] border border-[#E8E6E0] rounded-xl px-3 py-2.5 text-[13px] text-[#111] outline-none focus:border-indigo-400" />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-[#7C7870] uppercase tracking-wide mb-1">Agent Split %</label>
              <input type="number" value={form.split_pct} onChange={(e) => set("split_pct", e.target.value)} placeholder="100"
                className="w-full bg-[#F4F5F7] border border-[#E8E6E0] rounded-xl px-3 py-2.5 text-[13px] text-[#111] outline-none focus:border-indigo-400" />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-[#7C7870] uppercase tracking-wide mb-1">Status</label>
              <select value={form.status} onChange={(e) => set("status", e.target.value)}
                className="w-full bg-[#F4F5F7] border border-[#E8E6E0] rounded-xl px-3 py-2.5 text-[13px] text-[#7C7870] outline-none">
                {["Pending","Approved","Paid","Disputed"].map((s) => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div className="col-span-2">
              <label className="block text-[11px] font-semibold text-[#7C7870] uppercase tracking-wide mb-1">Notes</label>
              <textarea value={form.notes} onChange={(e) => set("notes", e.target.value)} rows={2}
                className="w-full bg-[#F4F5F7] border border-[#E8E6E0] rounded-xl px-3 py-2.5 text-[13px] text-[#111] outline-none focus:border-indigo-400 resize-none" />
            </div>
          </div>

          {/* Live preview */}
          {salePrice > 0 && (
            <div className="bg-indigo-50 rounded-xl border border-indigo-100 p-3">
              <p className="text-[11px] font-bold text-indigo-600 uppercase tracking-wide mb-2">Commission Preview</p>
              <div className="grid grid-cols-2 gap-2 text-[12px]">
                {[
                  { label:"Gross Commission", value:`CA$${gross.toLocaleString(undefined,{maximumFractionDigits:0})}` },
                  { label:"Agent Gets",       value:`CA$${agentComm.toLocaleString(undefined,{maximumFractionDigits:0})}` },
                  { label:"Brokerage Fee",    value:`CA$${brokFee.toLocaleString(undefined,{maximumFractionDigits:0})}` },
                  { label:"Net Commission",   value:`CA$${net.toLocaleString(undefined,{maximumFractionDigits:0})}` },
                ].map(({ label, value }) => (
                  <div key={label} className="flex justify-between">
                    <span className="text-indigo-700">{label}</span>
                    <span className="font-bold text-indigo-800">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-2">
            <button
              onClick={() => onSave({
                ...form,
                sale_price:       salePrice,
                commission_pct:   commPct,
                split_pct:        splitPct,
                gross_commission: gross,
                agent_commission: agentComm,
                brokerage_fee:    brokFee,
                net_commission:   net,
                status:           form.status as Commission["status"],
                agent_initials:   form.agent_name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2),
                agent_color:      AGENT_COLORS[0],
              })}
              disabled={!form.agent_name || !form.sale_price}
              className="flex-1 bg-[#111] hover:bg-[#222] disabled:opacity-40 text-white text-[13px] font-semibold py-2.5 rounded-xl transition-colors"
            >
              Save Commission
            </button>
            <button onClick={onClose} className="flex-1 bg-[#F4F5F7] text-[#7C7870] text-[13px] font-semibold py-2.5 rounded-xl hover:bg-[#EDEAE3]">
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function CommissionsPage() {
  const [commissions, setCommissions] = useState<Commission[]>(MOCK_COMMISSIONS);
  const [loading, setLoading]         = useState(true);
  const [search, setSearch]           = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [showModal, setShowModal]     = useState(false);
  const [showCalc, setShowCalc]       = useState(false);
  const [selected, setSelected]       = useState<Commission | null>(null);

  useEffect(() => { fetchCommissions(); }, []);

  const fetchCommissions = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("commissions")
      .select("*")
      .order("created_at", { ascending: false });
    if (data && data.length > 0) setCommissions(data as Commission[]);
    setLoading(false);
  };

  const handleSave = async (form: Partial<Commission>) => {
    const { data } = await supabase.from("commissions").insert(form).select().single();
    const newC = data || { ...form, id: Date.now().toString(), created_at: new Date().toISOString() } as Commission;
    setCommissions((prev) => [newC, ...prev]);
    setShowModal(false);
  };

  const updateStatus = async (id: string, status: string) => {
    const update: Partial<Commission> = {
      status: status as Commission["status"],
      ...(status === "Paid" ? { paid_date: new Date().toISOString().slice(0, 10) } : {}),
    };
    await supabase.from("commissions").update(update).eq("id", id);
    setCommissions((prev) => prev.map((c) => c.id === id ? { ...c, ...update } : c));
    setSelected((prev) => prev?.id === id ? { ...prev, ...update } : prev);
  };

  const handleDelete = async (id: string) => {
    await supabase.from("commissions").delete().eq("id", id);
    setCommissions((prev) => prev.filter((c) => c.id !== id));
    if (selected?.id === id) setSelected(null);
  };

  const filtered = commissions.filter((c) => {
    const s = search.toLowerCase();
    const matchSearch =
      c.agent_name.toLowerCase().includes(s) ||
      c.property_address.toLowerCase().includes(s);
    const matchStatus = statusFilter === "All" || c.status === statusFilter;
    return matchSearch && matchStatus;
  });

  // Summary stats
  const totalGross   = commissions.reduce((s, c) => s + c.gross_commission, 0);
  const totalPaid    = commissions.filter((c) => c.status === "Paid").reduce((s, c) => s + c.net_commission, 0);
  const totalPending = commissions.filter((c) => c.status !== "Paid").reduce((s, c) => s + c.net_commission, 0);
  const disputed     = commissions.filter((c) => c.status === "Disputed").length;

  // Agent performance chart data
  const agentData = Array.from(
    commissions.reduce((map, c) => {
      const existing = map.get(c.agent_name) || { name: c.agent_name.split(" ")[0], total: 0, count: 0 };
      existing.total += c.net_commission;
      existing.count += 1;
      map.set(c.agent_name, existing);
      return map;
    }, new Map<string, { name: string; total: number; count: number }>())
  ).map(([, v]) => v).sort((a, b) => b.total - a.total);

  const CHART_COLORS = ["#6366F1","#8B5CF6","#10B981","#F59E0B","#F43F5E"];

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-6 py-5 bg-white border-b border-[#E8E6E0] flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-[20px] font-bold text-[#111] tracking-tight">Commissions</h1>
          <p className="text-[13px] text-[#A8A49C] mt-0.5">Dashboard › Commissions</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setShowCalc(true)}
            className="flex items-center gap-2 border border-[#E8E6E0] rounded-xl px-4 py-2 text-[13px] font-semibold text-[#7C7870] hover:bg-[#F4F5F7] transition-colors">
            <Calculator size={14} /> Calculator
          </button>
          <button onClick={() => setShowModal(true)}
            className="flex items-center gap-2 bg-[#111] hover:bg-[#222] text-white text-[13px] font-semibold px-4 py-2 rounded-xl transition-colors shadow-sm">
            <Plus size={15} /> Add Commission
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-5">
        {/* KPI cards */}
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
          {[
            { label:"Gross Commissions", value:`CA$${(totalGross/1000).toFixed(1)}K`, color:"bg-indigo-50 text-indigo-600"   },
            { label:"Total Paid Out",    value:`CA$${(totalPaid/1000).toFixed(1)}K`,  color:"bg-emerald-50 text-emerald-600" },
            { label:"Pending Payout",    value:`CA$${(totalPending/1000).toFixed(1)}K`,color:"bg-amber-50 text-amber-600"   },
            { label:"Disputed",          value:disputed,                               color:"bg-rose-50 text-rose-600"      },
          ].map(({ label, value, color }) => (
            <div key={label} className={`rounded-xl p-4 ${color}`}>
              <p className="text-[11px] font-semibold uppercase tracking-wide opacity-70">{label}</p>
              <p className="text-[24px] font-bold tracking-tight mt-1">{value}</p>
            </div>
          ))}
        </div>

        {/* Chart + Top agents */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          {/* Bar chart */}
          <div className="bg-white rounded-xl border border-[#E8E6E0] shadow-sm p-5">
            <h3 className="text-[14px] font-bold text-[#111] mb-4">Net Commission by Agent</h3>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={agentData} barSize={32} margin={{ top: 0, right: 0, bottom: 0, left: -10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F0EDE6" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#A8A49C" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: "#A8A49C" }} axisLine={false} tickLine={false}
                  tickFormatter={(v) => `$${(v / 1000).toFixed(0)}K`} />
                <Tooltip
                  formatter={(v: any) => {
                    const value = typeof v === 'number' ? v : 0;
                    return [`CA$${value.toLocaleString()}`, "Net Commission"];
                  }}
                  contentStyle={{ background: "#111", border: "none", borderRadius: "10px", color: "#fff", fontSize: "12px" }}
                />
                <Bar dataKey="total" radius={[6, 6, 0, 0]}>
                  {agentData.map((_, i) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Agent leaderboard */}
          <div className="bg-white rounded-xl border border-[#E8E6E0] shadow-sm p-5">
            <h3 className="text-[14px] font-bold text-[#111] mb-4">Commission Leaderboard</h3>
            <div className="space-y-3">
              {agentData.map((agent, i) => {
                const medals = ["🥇", "🥈", "🥉"];
                const maxTotal = agentData[0]?.total || 1;
                return (
                  <div key={agent.name} className="flex items-center gap-3">
                    <div className="w-6 text-center">
                      {i < 3
                        ? <span className="text-[16px]">{medals[i]}</span>
                        : <span className="text-[12px] font-bold text-[#A8A49C]">#{i + 1}</span>}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between text-[12px] mb-1">
                        <span className="font-semibold text-[#111]">{agent.name}</span>
                        <span className="font-bold text-indigo-600">CA${(agent.total / 1000).toFixed(1)}K</span>
                      </div>
                      <div className="h-1.5 bg-[#F0EDE6] rounded-full overflow-hidden">
                        <div className="h-full bg-indigo-500 rounded-full"
                          style={{ width: `${(agent.total / maxTotal) * 100}%` }} />
                      </div>
                      <p className="text-[10px] text-[#A8A49C] mt-0.5">{agent.count} deal{agent.count !== 1 ? "s" : ""}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl border border-[#E8E6E0] p-4 flex flex-wrap items-center gap-3 shadow-sm">
          <div className="flex items-center gap-2 bg-[#F4F5F7] rounded-xl px-3 py-2 flex-1 min-w-[180px]">
            <Search size={14} className="text-[#A8A49C] shrink-0" />
            <input type="text" placeholder="Search agent, property..." value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-transparent text-[13px] text-[#111] placeholder-[#C5BFB5] outline-none w-full" />
          </div>
          <div className="flex items-center gap-1 bg-[#F4F5F7] rounded-xl p-1">
            {["All","Pending","Approved","Paid","Disputed"].map((s) => (
              <button key={s} onClick={() => setStatusFilter(s)}
                className={`text-[11px] font-semibold px-3 py-1.5 rounded-lg transition-colors ${statusFilter === s ? "bg-white text-[#111] shadow-sm" : "text-[#7C7870] hover:text-[#111]"}`}>
                {s}
              </button>
            ))}
          </div>
          <button className="flex items-center gap-1.5 border border-[#E8E6E0] rounded-xl px-3 py-2 text-[12px] font-semibold text-[#7C7870] hover:bg-[#F4F5F7]">
            <Download size={13} /> Export
          </button>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl border border-[#E8E6E0] shadow-sm overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#F0EDE6]">
                {["Agent","Property","Deal Type","Sale Price","Gross Comm.","Agent Split","Brokerage","Net Comm.","Status",""].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-[11px] font-bold text-[#A8A49C] uppercase tracking-wide whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F9F8F6]">
              {filtered.map((c) => {
                const statusCfg  = STATUS_CFG[c.status] || STATUS_CFG.Pending;
                const StatusIcon = statusCfg.icon;
                return (
                  <tr key={c.id} className="hover:bg-[#FAFAF8] transition-colors group cursor-pointer" onClick={() => setSelected(c)}>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className={`w-7 h-7 rounded-full ${c.agent_color} flex items-center justify-center text-white text-[10px] font-bold shrink-0`}>
                          {c.agent_initials}
                        </div>
                        <span className="text-[13px] font-semibold text-[#111]">{c.agent_name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-[12px] text-[#7C7870] max-w-[160px] truncate">{c.property_address}</td>
                    <td className="px-4 py-3">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700">{c.deal_type}</span>
                    </td>
                    <td className="px-4 py-3 text-[13px] font-semibold text-[#111]">CA${c.sale_price.toLocaleString()}</td>
                    <td className="px-4 py-3 text-[13px] text-[#7C7870]">CA${c.gross_commission.toLocaleString()}</td>
                    <td className="px-4 py-3 text-[12px] text-[#7C7870]">{c.split_pct}%</td>
                    <td className="px-4 py-3 text-[12px] text-rose-500">CA${c.brokerage_fee.toLocaleString()}</td>
                    <td className="px-4 py-3 text-[13px] font-bold text-emerald-600">CA${c.net_commission.toLocaleString()}</td>
                    <td className="px-4 py-3">
                      <span className={`flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full w-fit ${statusCfg.bg} ${statusCfg.color}`}>
                        <StatusIcon size={10} />{c.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        {c.status === "Approved" && (
                          <button onClick={(e) => { e.stopPropagation(); updateStatus(c.id, "Paid"); }}
                            className="w-7 h-7 rounded-lg flex items-center justify-center text-[#A8A49C] hover:bg-emerald-50 hover:text-emerald-600" title="Mark Paid">
                            <CheckCircle2 size={13} />
                          </button>
                        )}
                        {c.status === "Pending" && (
                          <button onClick={(e) => { e.stopPropagation(); updateStatus(c.id, "Approved"); }}
                            className="w-7 h-7 rounded-lg flex items-center justify-center text-[#A8A49C] hover:bg-indigo-50 hover:text-indigo-600" title="Approve">
                            <CheckCircle2 size={13} />
                          </button>
                        )}
                        <button onClick={(e) => { e.stopPropagation(); handleDelete(c.id); }}
                          className="w-7 h-7 rounded-lg flex items-center justify-center text-[#A8A49C] hover:bg-rose-50 hover:text-rose-600">
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {/* Footer total */}
          <div className="px-4 py-3 bg-[#FAFAF8] border-t border-[#F0EDE6] flex items-center justify-between">
            <p className="text-[12px] text-[#A8A49C]">{filtered.length} records</p>
            <div className="flex items-center gap-6 text-[12px]">
              <span className="text-[#7C7870]">Gross: <span className="font-bold text-[#111]">CA${filtered.reduce((s, c) => s + c.gross_commission, 0).toLocaleString()}</span></span>
              <span className="text-[#7C7870]">Net: <span className="font-bold text-emerald-600">CA${filtered.reduce((s, c) => s + c.net_commission, 0).toLocaleString()}</span></span>
            </div>
          </div>
        </div>
      </div>

      {/* Detail Modal */}
      {selected && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setSelected(null)}>
          <div className="bg-white rounded-2xl border border-[#E8E6E0] shadow-2xl w-full max-w-md" onClick={(e) => e.stopPropagation()}>
            <div className="p-5 border-b border-[#F0EDE6] flex items-center justify-between">
              <h2 className="text-[16px] font-bold text-[#111]">Commission Details</h2>
              <button onClick={() => setSelected(null)} className="p-1.5 rounded-lg hover:bg-[#F4F5F7] text-[#A8A49C]"><X size={15} /></button>
            </div>
            <div className="p-5 space-y-4">
              <div className="flex items-center gap-3 p-3 bg-[#FAFAF8] rounded-xl border border-[#F0EDE6]">
                <div className={`w-10 h-10 rounded-full ${selected.agent_color} flex items-center justify-center text-white text-[12px] font-bold shrink-0`}>
                  {selected.agent_initials}
                </div>
                <div>
                  <p className="text-[14px] font-bold text-[#111]">{selected.agent_name}</p>
                  <p className="text-[12px] text-[#A8A49C]">{selected.property_address}</p>
                </div>
                <span className={`ml-auto text-[11px] font-bold px-2 py-0.5 rounded-full ${(STATUS_CFG[selected.status] || STATUS_CFG.Pending).bg} ${(STATUS_CFG[selected.status] || STATUS_CFG.Pending).color}`}>
                  {selected.status}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {[
                  { label:"Sale Price",       value:`CA$${selected.sale_price.toLocaleString()}`       },
                  { label:"Commission Rate",  value:`${selected.commission_pct}%`                      },
                  { label:"Gross Commission", value:`CA$${selected.gross_commission.toLocaleString()}`  },
                  { label:"Agent Split",      value:`${selected.split_pct}%`                           },
                  { label:"Agent Commission", value:`CA$${selected.agent_commission.toLocaleString()}`  },
                  { label:"Brokerage Fee",    value:`CA$${selected.brokerage_fee.toLocaleString()}`     },
                  { label:"Deal Type",        value:selected.deal_type                                  },
                  { label:"Paid Date",        value:selected.paid_date || "—"                          },
                ].map(({ label, value }) => (
                  <div key={label}>
                    <p className="text-[10px] font-semibold text-[#A8A49C] uppercase tracking-wide mb-0.5">{label}</p>
                    <p className="text-[13px] font-semibold text-[#111]">{value}</p>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between p-3 bg-emerald-50 rounded-xl border border-emerald-100">
                <span className="text-[13px] font-bold text-emerald-700">Net Commission</span>
                <span className="text-[20px] font-bold text-emerald-600">CA${selected.net_commission.toLocaleString()}</span>
              </div>

              {selected.notes && (
                <p className="text-[12px] text-[#7C7870] bg-[#FAFAF8] p-3 rounded-xl border border-[#F0EDE6]">{selected.notes}</p>
              )}

              <div className="flex gap-2">
                {selected.status === "Pending" && (
                  <button onClick={() => updateStatus(selected.id, "Approved")}
                    className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white text-[12px] font-semibold py-2.5 rounded-xl">
                    Approve
                  </button>
                )}
                {selected.status === "Approved" && (
                  <button onClick={() => updateStatus(selected.id, "Paid")}
                    className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white text-[12px] font-semibold py-2.5 rounded-xl">
                    Mark Paid
                  </button>
                )}
                <button onClick={() => handleDelete(selected.id)}
                  className="flex-1 bg-rose-50 hover:bg-rose-100 text-rose-600 text-[12px] font-semibold py-2.5 rounded-xl">
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showModal && <CommissionModal onClose={() => setShowModal(false)} onSave={handleSave} />}
      {showCalc  && <CalculatorModal onClose={() => setShowCalc(false)} />}
    </div>
  );
}