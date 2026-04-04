"use client";

import { useEffect, useState } from "react";
import {
  Plus, Search, Filter, Download, TrendingUp, TrendingDown,
  DollarSign, ArrowUpRight, ArrowDownRight, CheckCircle2,
  Clock, XCircle, RefreshCw, Eye, X, ChevronDown,
  CreditCard, Building2, Banknote, Receipt, AlertCircle,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import type { Payment, PaymentStatus, PaymentType, PaymentMethod } from "@/lib/supabase";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer,
} from "recharts";

// ── Types ─────────────────────────────────────────────────────────────────────

interface Transaction extends Payment {
  contact_name?: string;
  property_address?: string;
}

// ── Config ────────────────────────────────────────────────────────────────────

const STATUS_CFG: Record<string, { color: string; bg: string; icon: React.ElementType }> = {
  Completed: { color: "text-emerald-700", bg: "bg-emerald-100", icon: CheckCircle2 },
  Pending:   { color: "text-amber-700",   bg: "bg-amber-100",   icon: Clock        },
  Failed:    { color: "text-rose-700",    bg: "bg-rose-100",    icon: XCircle      },
  Refunded:  { color: "text-slate-600",   bg: "bg-slate-100",   icon: RefreshCw    },
};

const TYPE_CFG: Record<string, string> = {
  "Deposit":        "bg-indigo-100 text-indigo-700",
  "Installment":    "bg-blue-100 text-blue-700",
  "Final Payment":  "bg-emerald-100 text-emerald-700",
  "Commission":     "bg-violet-100 text-violet-700",
  "Refund":         "bg-rose-100 text-rose-700",
  "Other":          "bg-slate-100 text-slate-600",
};

const METHOD_ICON: Record<string, React.ElementType> = {
  "Bank Transfer": Banknote,
  "Cheque":        Receipt,
  "Credit Card":   CreditCard,
  "Cash":          DollarSign,
  "Wire":          Building2,
  "Other":         DollarSign,
};

// ── Chart data ────────────────────────────────────────────────────────────────

const CHART_DATA = [
  { month: "Oct", inflow: 185000, outflow: 42000 },
  { month: "Nov", inflow: 220000, outflow: 58000 },
  { month: "Dec", inflow: 195000, outflow: 35000 },
  { month: "Jan", inflow: 310000, outflow: 67000 },
  { month: "Feb", inflow: 275000, outflow: 49000 },
  { month: "Mar", inflow: 398000, outflow: 82000 },
];

// ── Mock data ─────────────────────────────────────────────────────────────────

const MOCK_TRANSACTIONS: Transaction[] = [
  { id:"tx1", invoice_id:null, deal_id:null, contact_id:null, payment_type:"Commission",    amount:16272,   currency:"CAD", status:"Completed", payment_method:"Bank Transfer", reference_no:"REF-2026-001", payment_date:"2026-03-10", notes:"Commission — 42 Maple St",     created_at:new Date(Date.now()-5*86400000).toISOString(),  updated_at:"", contact_name:"Thomas Morrison", property_address:"42 Maple Street"    },
  { id:"tx2", invoice_id:null, deal_id:null, contact_id:null, payment_type:"Deposit",       amount:46000,   currency:"CAD", status:"Completed", payment_method:"Wire",          reference_no:"REF-2026-002", payment_date:"2026-03-12", notes:"10% deposit — Lakeview Drive",created_at:new Date(Date.now()-3*86400000).toISOString(),  updated_at:"", contact_name:"Aisha Patel",     property_address:"18 Lakeview Drive"  },
  { id:"tx3", invoice_id:null, deal_id:null, contact_id:null, payment_type:"Installment",   amount:125000,  currency:"CAD", status:"Pending",   payment_method:"Bank Transfer", reference_no:"REF-2026-003", payment_date:"2026-03-20", notes:"1st installment — Harbor Blvd",created_at:new Date(Date.now()-1*86400000).toISOString(),  updated_at:"", contact_name:"Linda Cheng",     property_address:"93 Harbor Blvd"     },
  { id:"tx4", invoice_id:null, deal_id:null, contact_id:null, payment_type:"Final Payment", amount:850000,  currency:"CAD", status:"Completed", payment_method:"Wire",          reference_no:"REF-2026-004", payment_date:"2026-03-08", notes:"Final closing payment",       created_at:new Date(Date.now()-7*86400000).toISOString(),  updated_at:"", contact_name:"Carlos Mendez",   property_address:"34 Cedar Hills Dr"  },
  { id:"tx5", invoice_id:null, deal_id:null, contact_id:null, payment_type:"Commission",    amount:27500,   currency:"CAD", status:"Completed", payment_method:"Cheque",        reference_no:"REF-2026-005", payment_date:"2026-03-05", notes:"Agent commission — Cedar Hills",created_at:new Date(Date.now()-10*86400000).toISOString(), updated_at:"", contact_name:"James Liu",       property_address:"34 Cedar Hills Dr"  },
  { id:"tx6", invoice_id:null, deal_id:null, contact_id:null, payment_type:"Deposit",       amount:19750,   currency:"CAD", status:"Completed", payment_method:"Bank Transfer", reference_no:"REF-2026-006", payment_date:"2026-03-15", notes:"5% deposit — Birchwood Ct",   created_at:new Date(Date.now()-2*86400000).toISOString(),  updated_at:"", contact_name:"Marcus Reid",     property_address:"5 Birchwood Court"  },
  { id:"tx7", invoice_id:null, deal_id:null, contact_id:null, payment_type:"Refund",        amount:8500,    currency:"CAD", status:"Refunded",  payment_method:"Bank Transfer", reference_no:"REF-2026-007", payment_date:"2026-03-18", notes:"Inspection fee refund",       created_at:new Date(Date.now()-4*86400000).toISOString(),  updated_at:"", contact_name:"Derek Walsh",     property_address:"7 Pine Avenue"      },
  { id:"tx8", invoice_id:null, deal_id:null, contact_id:null, payment_type:"Installment",   amount:62500,   currency:"CAD", status:"Failed",    payment_method:"Credit Card",   reference_no:"REF-2026-008", payment_date:"2026-03-22", notes:"Payment failed — card declined",created_at:new Date(Date.now()-86400000).toISOString(),    updated_at:"", contact_name:"Fatima Hassan",   property_address:"66 Willow Creek Rd" },
  { id:"tx9", invoice_id:null, deal_id:null, contact_id:null, payment_type:"Commission",    amount:14700,   currency:"CAD", status:"Pending",   payment_method:"Bank Transfer", reference_no:"REF-2026-009", payment_date:"2026-03-25", notes:"Commission pending approval", created_at:new Date(Date.now()-3600000).toISOString(),     updated_at:"", contact_name:"Sarah Kim",       property_address:"11 Rosewood Blvd"   },
  { id:"tx10",invoice_id:null, deal_id:null, contact_id:null, payment_type:"Final Payment", amount:395000,  currency:"CAD", status:"Completed", payment_method:"Wire",          reference_no:"REF-2026-010", payment_date:"2026-02-28", notes:"Closing — Birchwood Court",   created_at:new Date(Date.now()-20*86400000).toISOString(), updated_at:"", contact_name:"Marcus Reid",     property_address:"5 Birchwood Court"  },
];

// ── New Transaction Modal ─────────────────────────────────────────────────────

function TransactionModal({
  onClose,
  onSave,
}: {
  onClose: () => void;
  onSave: (data: Partial<Transaction>) => void;
}) {
  const [form, setForm] = useState({
    payment_type:   "Deposit",
    amount:         "",
    currency:       "CAD",
    status:         "Pending",
    payment_method: "Bank Transfer",
    reference_no:   "",
    payment_date:   new Date().toISOString().slice(0, 10),
    notes:          "",
    contact_name:   "",
    property_address: "",
  });

  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl border border-[#E8E6E0] shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-5 border-b border-[#F0EDE6]">
          <h2 className="text-[16px] font-bold text-[#111]">New Transaction</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-[#F4F5F7] text-[#A8A49C]"><X size={15} /></button>
        </div>
        <div className="p-5 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-[#7C7870] uppercase tracking-wide mb-1">Type</label>
              <select value={form.payment_type} onChange={(e) => set("payment_type", e.target.value)}
                className="w-full bg-[#F4F5F7] border border-[#E8E6E0] rounded-xl px-3 py-2.5 text-[13px] text-[#7C7870] outline-none">
                {["Deposit","Installment","Final Payment","Commission","Refund","Other"].map((t) => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-[#7C7870] uppercase tracking-wide mb-1">Amount (CAD) *</label>
              <input type="number" value={form.amount} onChange={(e) => set("amount", e.target.value)} placeholder="0.00"
                className="w-full bg-[#F4F5F7] border border-[#E8E6E0] rounded-xl px-3 py-2.5 text-[13px] text-[#111] outline-none focus:border-indigo-400" />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-[#7C7870] uppercase tracking-wide mb-1">Payment Method</label>
              <select value={form.payment_method} onChange={(e) => set("payment_method", e.target.value)}
                className="w-full bg-[#F4F5F7] border border-[#E8E6E0] rounded-xl px-3 py-2.5 text-[13px] text-[#7C7870] outline-none">
                {["Bank Transfer","Cheque","Credit Card","Cash","Wire","Other"].map((m) => <option key={m}>{m}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-[#7C7870] uppercase tracking-wide mb-1">Status</label>
              <select value={form.status} onChange={(e) => set("status", e.target.value)}
                className="w-full bg-[#F4F5F7] border border-[#E8E6E0] rounded-xl px-3 py-2.5 text-[13px] text-[#7C7870] outline-none">
                {["Pending","Completed","Failed","Refunded"].map((s) => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-[#7C7870] uppercase tracking-wide mb-1">Payment Date</label>
              <input type="date" value={form.payment_date} onChange={(e) => set("payment_date", e.target.value)}
                className="w-full bg-[#F4F5F7] border border-[#E8E6E0] rounded-xl px-3 py-2.5 text-[13px] text-[#111] outline-none focus:border-indigo-400" />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-[#7C7870] uppercase tracking-wide mb-1">Reference No.</label>
              <input value={form.reference_no} onChange={(e) => set("reference_no", e.target.value)} placeholder="REF-0000"
                className="w-full bg-[#F4F5F7] border border-[#E8E6E0] rounded-xl px-3 py-2.5 text-[13px] text-[#111] outline-none focus:border-indigo-400" />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-[#7C7870] uppercase tracking-wide mb-1">Contact Name</label>
              <input value={form.contact_name} onChange={(e) => set("contact_name", e.target.value)} placeholder="Buyer / Seller name"
                className="w-full bg-[#F4F5F7] border border-[#E8E6E0] rounded-xl px-3 py-2.5 text-[13px] text-[#111] outline-none focus:border-indigo-400" />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-[#7C7870] uppercase tracking-wide mb-1">Property</label>
              <input value={form.property_address} onChange={(e) => set("property_address", e.target.value)} placeholder="Property address"
                className="w-full bg-[#F4F5F7] border border-[#E8E6E0] rounded-xl px-3 py-2.5 text-[13px] text-[#111] outline-none focus:border-indigo-400" />
            </div>
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-[#7C7870] uppercase tracking-wide mb-1">Notes</label>
            <textarea value={form.notes} onChange={(e) => set("notes", e.target.value)} rows={2}
              className="w-full bg-[#F4F5F7] border border-[#E8E6E0] rounded-xl px-3 py-2.5 text-[13px] text-[#111] outline-none focus:border-indigo-400 resize-none" />
          </div>
          <div className="flex gap-2 pt-1">
            <button
              onClick={() => onSave({
                payment_type: form.payment_type as PaymentType,
                amount: parseFloat(form.amount) || 0,
                currency: form.currency,
                status: form.status as PaymentStatus,
                payment_method: form.payment_method as PaymentMethod,
                reference_no: form.reference_no,
                payment_date: form.payment_date,
                notes: form.notes,
                contact_name: form.contact_name,
                property_address: form.property_address,
              })}
              disabled={!form.amount}
              className="flex-1 bg-[#111] hover:bg-[#222] disabled:opacity-40 text-white text-[13px] font-semibold py-2.5 rounded-xl transition-colors"
            >
              Save Transaction
            </button>
            <button onClick={onClose} className="flex-1 bg-[#F4F5F7] text-[#7C7870] text-[13px] font-semibold py-2.5 rounded-xl hover:bg-[#EDEAE3]">Cancel</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Custom Tooltip ────────────────────────────────────────────────────────────

function ChartTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[#111] text-white text-[12px] px-3 py-2 rounded-lg shadow-xl border border-white/10">
      <p className="text-[#aaa] mb-1 font-medium">{label}</p>
      {payload.map((p: any) => (
        <p key={p.name} className="font-bold">
          {p.name === "inflow" ? "Inflow" : "Outflow"}:{" "}
          <span className={p.name === "inflow" ? "text-emerald-400" : "text-rose-400"}>
            CA${(p.value / 1000).toFixed(0)}K
          </span>
        </p>
      ))}
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>(MOCK_TRANSACTIONS);
  const [loading, setLoading]     = useState(true);
  const [search, setSearch]       = useState("");
  const [typeFilter, setTypeFilter]   = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [showModal, setShowModal] = useState(false);
  const [selected, setSelected]   = useState<Transaction | null>(null);
  const [dateRange, setDateRange] = useState("This Month");

  useEffect(() => { fetchTransactions(); }, []);

  const fetchTransactions = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("payments")
      .select("*")
      .order("created_at", { ascending: false });
    if (data && data.length > 0) setTransactions(data as Transaction[]);
    setLoading(false);
  };

  const handleSave = async (form: Partial<Transaction>) => {
    const { data } = await supabase.from("payments").insert(form).select().single();
    const newTx = data || { ...form, id: Date.now().toString(), created_at: new Date().toISOString(), updated_at: "" } as Transaction;
    setTransactions((prev) => [newTx, ...prev]);
    setShowModal(false);
  };

  const updateStatus = async (id: string, status: string) => {
    await supabase.from("payments").update({ status }).eq("id", id);
    setTransactions((prev) => prev.map((t) => t.id === id ? { ...t, status: status as Payment["status"] } : t));
    setSelected((prev) => prev?.id === id ? { ...prev, status: status as Payment["status"] } : prev);
  };

  const filtered = transactions.filter((t) => {
    const s = search.toLowerCase();
    const matchSearch =
      (t.reference_no || "").toLowerCase().includes(s) ||
      (t.contact_name || "").toLowerCase().includes(s) ||
      (t.property_address || "").toLowerCase().includes(s) ||
      (t.notes || "").toLowerCase().includes(s);
    const matchType   = typeFilter   === "All" || t.payment_type === typeFilter;
    const matchStatus = statusFilter === "All" || t.status       === statusFilter;
    return matchSearch && matchType && matchStatus;
  });

  // Summary calculations
  const totalInflow  = transactions.filter((t) => t.status === "Completed" && t.payment_type !== "Refund").reduce((s, t) => s + t.amount, 0);
  const totalPending = transactions.filter((t) => t.status === "Pending").reduce((s, t) => s + t.amount, 0);
  const totalFailed  = transactions.filter((t) => t.status === "Failed").reduce((s, t) => s + t.amount, 0);
  const totalRefunded= transactions.filter((t) => t.status === "Refunded").reduce((s, t) => s + t.amount, 0);

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-6 py-5 bg-white border-b border-[#E8E6E0] flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-[20px] font-bold text-[#111] tracking-tight">Transactions</h1>
          <p className="text-[13px] text-[#A8A49C] mt-0.5">Dashboard › Transactions</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 border border-[#E8E6E0] rounded-xl px-4 py-2 text-[13px] font-medium text-[#7C7870] hover:bg-[#F4F5F7]">
            <Download size={14} /> Export CSV
          </button>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 bg-[#111] hover:bg-[#222] text-white text-[13px] font-semibold px-4 py-2 rounded-xl transition-colors shadow-sm"
          >
            <Plus size={15} /> Add Transaction
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-5">
        {/* KPI cards */}
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
          {[
            { label: "Total Inflow",  value: `CA$${(totalInflow/1000).toFixed(0)}K`,   icon: ArrowUpRight,   color: "bg-emerald-50 text-emerald-600", iconBg: "bg-emerald-100" },
            { label: "Pending",       value: `CA$${(totalPending/1000).toFixed(0)}K`,  icon: Clock,          color: "bg-amber-50 text-amber-600",   iconBg: "bg-amber-100"   },
            { label: "Failed",        value: `CA$${(totalFailed/1000).toFixed(0)}K`,   icon: AlertCircle,    color: "bg-rose-50 text-rose-600",     iconBg: "bg-rose-100"    },
            { label: "Refunded",      value: `CA$${(totalRefunded/1000).toFixed(0)}K`, icon: RefreshCw,      color: "bg-slate-50 text-slate-600",   iconBg: "bg-slate-100"   },
          ].map(({ label, value, icon: Icon, color, iconBg }) => (
            <div key={label} className={`bg-white rounded-xl border border-[#E8E6E0] p-4 flex items-center gap-3 shadow-sm`}>
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${iconBg}`}>
                <Icon size={18} className={color.split(" ")[1]} />
              </div>
              <div>
                <p className="text-[11px] font-medium text-[#A8A49C] uppercase tracking-wide">{label}</p>
                <p className="text-[18px] font-bold text-[#111] tracking-tight">{value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Chart */}
        <div className="bg-white rounded-xl border border-[#E8E6E0] shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[14px] font-bold text-[#111]">Cash Flow — Last 6 Months</h3>
            <div className="flex items-center gap-4 text-[11px] font-semibold">
              <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-emerald-500 inline-block" />Inflow</span>
              <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-rose-400 inline-block" />Outflow</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={CHART_DATA} margin={{ top: 4, right: 4, bottom: 0, left: -10 }}>
              <defs>
                {[["inflow","#10B981"],["outflow","#F43F5E"]].map(([k, c]) => (
                  <linearGradient key={k} id={`g-${k}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor={c} stopOpacity={0.15} />
                    <stop offset="95%" stopColor={c} stopOpacity={0}    />
                  </linearGradient>
                ))}
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#F0EDE6" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize:11, fill:"#A8A49C" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize:10, fill:"#A8A49C" }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${(v/1000).toFixed(0)}K`} />
              <Tooltip content={<ChartTooltip />} />
              <Area type="monotone" dataKey="inflow"  stroke="#10B981" strokeWidth={2} fill="url(#g-inflow)"  dot={false} />
              <Area type="monotone" dataKey="outflow" stroke="#F43F5E" strokeWidth={2} fill="url(#g-outflow)" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl border border-[#E8E6E0] p-4 flex flex-wrap items-center gap-3 shadow-sm">
          <div className="flex items-center gap-2 bg-[#F4F5F7] rounded-xl px-3 py-2 flex-1 min-w-[180px]">
            <Search size={14} className="text-[#A8A49C] shrink-0" />
            <input type="text" placeholder="Search reference, contact, property..." value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-transparent text-[13px] text-[#111] placeholder-[#C5BFB5] outline-none w-full" />
          </div>

          <div className="flex items-center gap-1 bg-[#F4F5F7] rounded-xl p-1">
            {["All","Deposit","Installment","Final Payment","Commission","Refund"].map((t) => (
              <button key={t} onClick={() => setTypeFilter(t)}
                className={`text-[11px] font-semibold px-2.5 py-1.5 rounded-lg transition-colors whitespace-nowrap ${typeFilter === t ? "bg-white text-[#111] shadow-sm" : "text-[#7C7870] hover:text-[#111]"}`}>
                {t}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1 bg-[#F4F5F7] rounded-xl p-1">
            {["All","Completed","Pending","Failed","Refunded"].map((s) => (
              <button key={s} onClick={() => setStatusFilter(s)}
                className={`text-[11px] font-semibold px-2.5 py-1.5 rounded-lg transition-colors ${statusFilter === s ? "bg-white text-[#111] shadow-sm" : "text-[#7C7870] hover:text-[#111]"}`}>
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Transactions table */}
        <div className="bg-white rounded-xl border border-[#E8E6E0] shadow-sm overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#F0EDE6]">
                {["Reference","Type","Contact","Property","Amount","Method","Date","Status",""].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-[11px] font-bold text-[#A8A49C] uppercase tracking-wide whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F9F8F6]">
              {filtered.map((tx) => {
                const statusCfg = STATUS_CFG[tx.status] || STATUS_CFG.Pending;
                const StatusIcon = statusCfg.icon;
                const MethodIcon = METHOD_ICON[tx.payment_method || ""] || DollarSign;
                return (
                  <tr key={tx.id} className="hover:bg-[#FAFAF8] transition-colors group cursor-pointer" onClick={() => setSelected(tx)}>
                    <td className="px-4 py-3">
                      <p className="text-[13px] font-bold text-indigo-600">{tx.reference_no || "—"}</p>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap ${TYPE_CFG[tx.payment_type || ""] || TYPE_CFG.Other}`}>
                        {tx.payment_type}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-[12px] text-[#7C7870]">{tx.contact_name || "—"}</td>
                    <td className="px-4 py-3 text-[12px] text-[#7C7870] max-w-[160px] truncate">{tx.property_address || "—"}</td>
                    <td className="px-4 py-3">
                      <p className={`text-[13px] font-bold ${tx.payment_type === "Refund" ? "text-rose-500" : "text-[#111]"}`}>
                        {tx.payment_type === "Refund" ? "-" : ""}CA${tx.amount.toLocaleString()}
                      </p>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5 text-[12px] text-[#7C7870]">
                        <MethodIcon size={12} className="text-[#C5BFB5]" />
                        {tx.payment_method}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-[12px] text-[#A8A49C]">
                      {tx.payment_date ? new Date(tx.payment_date).toLocaleDateString("en-CA", { month:"short", day:"numeric", year:"numeric" }) : "—"}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full w-fit ${statusCfg.bg} ${statusCfg.color}`}>
                        <StatusIcon size={10} />{tx.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        {tx.status === "Pending" && (
                          <button onClick={(e) => { e.stopPropagation(); updateStatus(tx.id, "Completed"); }}
                            className="w-7 h-7 rounded-lg flex items-center justify-center text-[#A8A49C] hover:bg-emerald-50 hover:text-emerald-600" title="Mark Complete">
                            <CheckCircle2 size={13} />
                          </button>
                        )}
                        <button onClick={(e) => { e.stopPropagation(); setSelected(tx); }}
                          className="w-7 h-7 rounded-lg flex items-center justify-center text-[#A8A49C] hover:bg-indigo-50 hover:text-indigo-600">
                          <Eye size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {/* Footer summary */}
          <div className="px-4 py-3 bg-[#FAFAF8] border-t border-[#F0EDE6] flex items-center justify-between">
            <p className="text-[12px] text-[#A8A49C]">{filtered.length} transactions</p>
            <p className="text-[13px] font-bold text-[#111]">
              Total: CA${filtered.reduce((s, t) => s + t.amount, 0).toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      {/* Detail Modal */}
      {selected && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setSelected(null)}>
          <div className="bg-white rounded-2xl border border-[#E8E6E0] shadow-2xl w-full max-w-md" onClick={(e) => e.stopPropagation()}>
            <div className="p-5 border-b border-[#F0EDE6] flex items-center justify-between">
              <div>
                <h2 className="text-[16px] font-bold text-[#111]">{selected.reference_no || "Transaction"}</h2>
                <p className="text-[12px] text-[#A8A49C] mt-0.5">{selected.payment_type}</p>
              </div>
              <button onClick={() => setSelected(null)} className="p-1.5 rounded-lg hover:bg-[#F4F5F7] text-[#A8A49C]"><X size={15} /></button>
            </div>
            <div className="p-5 space-y-4">
              {/* Amount hero */}
              <div className={`rounded-xl p-4 text-center ${selected.payment_type === "Refund" ? "bg-rose-50" : "bg-emerald-50"}`}>
                <p className="text-[11px] font-semibold text-[#A8A49C] uppercase tracking-wide mb-1">Amount</p>
                <p className={`text-[28px] font-bold tracking-tight ${selected.payment_type === "Refund" ? "text-rose-600" : "text-emerald-600"}`}>
                  CA${selected.amount.toLocaleString()}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {[
                  { label:"Status",     value: selected.status       },
                  { label:"Method",     value: selected.payment_method },
                  { label:"Date",       value: selected.payment_date  },
                  { label:"Contact",    value: selected.contact_name  },
                  { label:"Property",   value: selected.property_address },
                  { label:"Reference",  value: selected.reference_no  },
                ].map(({ label, value }) => value ? (
                  <div key={label}>
                    <p className="text-[10px] font-semibold text-[#A8A49C] uppercase tracking-wide mb-0.5">{label}</p>
                    <p className="text-[13px] font-semibold text-[#111]">{value}</p>
                  </div>
                ) : null)}
              </div>

              {selected.notes && (
                <div>
                  <p className="text-[10px] font-semibold text-[#A8A49C] uppercase tracking-wide mb-1">Notes</p>
                  <p className="text-[12px] text-[#7C7870] bg-[#FAFAF8] p-3 rounded-xl border border-[#F0EDE6]">{selected.notes}</p>
                </div>
              )}

              {selected.status === "Pending" && (
                <div className="flex gap-2">
                  <button onClick={() => updateStatus(selected.id, "Completed")}
                    className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white text-[12px] font-semibold py-2.5 rounded-xl transition-colors">
                    Mark Completed
                  </button>
                  <button onClick={() => updateStatus(selected.id, "Failed")}
                    className="flex-1 bg-rose-50 hover:bg-rose-100 text-rose-600 text-[12px] font-semibold py-2.5 rounded-xl transition-colors">
                    Mark Failed
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {showModal && (
        <TransactionModal onClose={() => setShowModal(false)} onSave={handleSave} />
      )}
    </div>
  );
}