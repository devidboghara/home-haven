"use client";

import { useEffect, useState } from "react";
import {
  DollarSign, Plus, Search, Download, Eye, Pencil, Trash2,
  CheckCircle2, Clock, XCircle, AlertCircle, Send, X,
  FileText, User, Building2,
} from "lucide-react";
import { supabase } from "@/lib/supabase";

// ── Types ─────────────────────────────────────────────────────────────────────

type InvoiceStatus = "Draft" | "Sent" | "Viewed" | "Paid" | "Overdue" | "Cancelled";

interface LineItem {
  description: string;
  quantity: number;
  unit_price: number;
  amount: number;
}

interface Invoice {
  id: string;
  invoice_number: string;
  contact_name: string;
  property_address: string | null;
  status: InvoiceStatus;
  issue_date: string;
  due_date: string | null;
  paid_date: string | null;
  subtotal: number;
  tax_rate: number;
  tax_amount: number;
  total_amount: number;
  amount_paid: number;
  currency: string;
  line_items: LineItem[];
  created_at: string;
}

// ── Config ────────────────────────────────────────────────────────────────────

const STATUS_CFG: Record<InvoiceStatus, { color: string; bg: string; icon: React.ElementType }> = {
  Draft:     { color: "text-slate-600",   bg: "bg-slate-100",   icon: FileText     },
  Sent:      { color: "text-indigo-700",  bg: "bg-indigo-100",  icon: Send         },
  Viewed:    { color: "text-blue-700",    bg: "bg-blue-100",    icon: Eye          },
  Paid:      { color: "text-emerald-700", bg: "bg-emerald-100", icon: CheckCircle2 },
  Overdue:   { color: "text-rose-700",    bg: "bg-rose-100",    icon: Clock        },
  Cancelled: { color: "text-slate-600",   bg: "bg-slate-100",   icon: XCircle      },
};

// ── Mock data ─────────────────────────────────────────────────────────────────

const MOCK_INVOICES: Invoice[] = [
  {
    id:"inv1", invoice_number:"INV-2026-001", contact_name:"Thomas Morrison",  property_address:"42 Maple Street, Toronto",
    status:"Paid",    issue_date:"2026-03-01", due_date:"2026-03-15", paid_date:"2026-03-12",
    subtotal:14400, tax_rate:13, tax_amount:1872, total_amount:16272, amount_paid:16272, currency:"CAD",
    line_items:[{ description:"Commission — Fix & Flip Sale", quantity:1, unit_price:14400, amount:14400 }],
    created_at:"2026-03-01T10:00:00Z",
  },
  {
    id:"inv2", invoice_number:"INV-2026-002", contact_name:"Aisha Patel",      property_address:"18 Lakeview Drive, Vancouver",
    status:"Sent",    issue_date:"2026-04-01", due_date:"2026-04-15", paid_date:null,
    subtotal:23000, tax_rate:13, tax_amount:2990, total_amount:25990, amount_paid:0, currency:"CAD",
    line_items:[{ description:"Commission — Rental Property", quantity:1, unit_price:23000, amount:23000 }],
    created_at:"2026-04-01T09:00:00Z",
  },
  {
    id:"inv3", invoice_number:"INV-2026-003", contact_name:"Carlos Mendez",    property_address:"34 Cedar Hills Dr, Regina",
    status:"Draft",   issue_date:"2026-04-05", due_date:"2026-04-20", paid_date:null,
    subtotal:8500, tax_rate:13, tax_amount:1105, total_amount:9605, amount_paid:0, currency:"CAD",
    line_items:[
      { description:"Listing Fee", quantity:1, unit_price:5000, amount:5000 },
      { description:"Photography & Virtual Tour", quantity:1, unit_price:2500, amount:2500 },
      { description:"Marketing Package", quantity:1, unit_price:1000, amount:1000 },
    ],
    created_at:"2026-04-05T11:00:00Z",
  },
  {
    id:"inv4", invoice_number:"INV-2026-004", contact_name:"Linda Cheng",      property_address:"93 Harbor Blvd, Montreal",
    status:"Overdue", issue_date:"2026-03-10", due_date:"2026-03-25", paid_date:null,
    subtotal:43750, tax_rate:14.975, tax_amount:6552, total_amount:50302, amount_paid:0, currency:"CAD",
    line_items:[{ description:"Commission — Fix & Flip Sale", quantity:1, unit_price:43750, amount:43750 }],
    created_at:"2026-03-10T08:00:00Z",
  },
  {
    id:"inv5", invoice_number:"INV-2026-005", contact_name:"Marcus Reid",      property_address:"5 Birchwood Court, Ottawa",
    status:"Paid",    issue_date:"2026-02-15", due_date:"2026-03-01", paid_date:"2026-02-28",
    subtotal:9875, tax_rate:13, tax_amount:1284, total_amount:11159, amount_paid:11159, currency:"CAD",
    line_items:[{ description:"Commission — Rental Property", quantity:1, unit_price:9875, amount:9875 }],
    created_at:"2026-02-15T14:00:00Z",
  },
  {
    id:"inv6", invoice_number:"INV-2026-006", contact_name:"Nina Torres",      property_address:"8 Oakridge Terrace, Victoria",
    status:"Viewed",  issue_date:"2026-04-08", due_date:"2026-04-22", paid_date:null,
    subtotal:51000, tax_rate:12, tax_amount:6120, total_amount:57120, amount_paid:0, currency:"CAD",
    line_items:[{ description:"Commission — Fix & Flip Sale", quantity:1, unit_price:51000, amount:51000 }],
    created_at:"2026-04-08T10:00:00Z",
  },
];

// ── Invoice Detail Modal ──────────────────────────────────────────────────────

function InvoiceModal({ invoice, onClose }: { invoice: Invoice; onClose: () => void }) {
  const cfg = STATUS_CFG[invoice.status];
  const StatusIcon = cfg.icon;
  const fmt = (n: number) => `CA$${n.toLocaleString("en-CA", { minimumFractionDigits: 2 })}`;
  const fmtDate = (d: string | null) => d ? new Date(d).toLocaleDateString("en-CA", { month: "long", day: "numeric", year: "numeric" }) : "—";

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl border border-[#E8E6E0] shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-5 border-b border-[#F0EDE6] sticky top-0 bg-white">
          <div>
            <h2 className="text-[16px] font-bold text-[#111]">{invoice.invoice_number}</h2>
            <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full mt-1 ${cfg.bg} ${cfg.color}`}>
              <StatusIcon size={10} />{invoice.status}
            </span>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-[#F4F5F7] text-[#A8A49C]"><X size={15} /></button>
        </div>
        <div className="p-5 space-y-4">
          {/* Header info */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-[11px] font-semibold text-[#7C7870] uppercase tracking-wide mb-1">Bill To</p>
              <p className="text-[13px] font-semibold text-[#111]">{invoice.contact_name}</p>
              {invoice.property_address && <p className="text-[12px] text-[#7C7870]">{invoice.property_address}</p>}
            </div>
            <div className="text-right">
              <p className="text-[11px] font-semibold text-[#7C7870] uppercase tracking-wide mb-1">Invoice Date</p>
              <p className="text-[13px] text-[#111]">{fmtDate(invoice.issue_date)}</p>
              <p className="text-[11px] text-[#7C7870] mt-1">Due: {fmtDate(invoice.due_date)}</p>
            </div>
          </div>

          {/* Line items */}
          <div className="border border-[#E8E6E0] rounded-xl overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-[#F4F5F7] border-b border-[#E8E6E0]">
                  {["Description","Qty","Unit Price","Amount"].map((h) => (
                    <th key={h} className="text-left px-4 py-2.5 text-[11px] font-semibold text-[#7C7870] uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F9F8F6]">
                {invoice.line_items.map((item, i) => (
                  <tr key={i}>
                    <td className="px-4 py-3 text-[13px] text-[#111]">{item.description}</td>
                    <td className="px-4 py-3 text-[13px] text-[#7C7870]">{item.quantity}</td>
                    <td className="px-4 py-3 text-[13px] text-[#7C7870]">{fmt(item.unit_price)}</td>
                    <td className="px-4 py-3 text-[13px] font-semibold text-[#111]">{fmt(item.amount)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals */}
          <div className="space-y-2 pt-2">
            {[
              { label: "Subtotal", value: fmt(invoice.subtotal) },
              { label: `Tax (${invoice.tax_rate}%)`, value: fmt(invoice.tax_amount) },
            ].map(({ label, value }) => (
              <div key={label} className="flex justify-between text-[13px]">
                <span className="text-[#7C7870]">{label}</span>
                <span className="text-[#111]">{value}</span>
              </div>
            ))}
            <div className="flex justify-between text-[15px] font-bold border-t border-[#E8E6E0] pt-2">
              <span className="text-[#111]">Total</span>
              <span className="text-indigo-600">{fmt(invoice.total_amount)}</span>
            </div>
            {invoice.amount_paid > 0 && (
              <div className="flex justify-between text-[13px]">
                <span className="text-emerald-600 font-semibold">Amount Paid</span>
                <span className="text-emerald-600 font-semibold">{fmt(invoice.amount_paid)}</span>
              </div>
            )}
          </div>

          <div className="flex gap-2 pt-2">
            <button className="flex-1 flex items-center justify-center gap-2 border border-[#E8E6E0] rounded-xl py-2.5 text-[13px] font-semibold text-[#7C7870] hover:bg-[#F4F5F7] transition-colors">
              <Download size={14} /> Download PDF
            </button>
            {invoice.status === "Draft" && (
              <button className="flex-1 flex items-center justify-center gap-2 bg-[#111] hover:bg-[#222] text-white text-[13px] font-semibold py-2.5 rounded-xl transition-colors">
                <Send size={14} /> Send Invoice
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function InvoicesPage() {
  const [invoices, setInvoices]   = useState<Invoice[]>(MOCK_INVOICES);
  const [usingMock, setUsingMock] = useState(true);
  const [loading, setLoading]     = useState(true);
  const [search, setSearch]       = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selected, setSelected]   = useState<Invoice | null>(null);

  useEffect(() => {
    supabase.from("invoices").select("*, invoice_line_items(*)").order("created_at", { ascending: false })
      .then(({ data }) => {
        if (data && data.length > 0) { setInvoices(data as Invoice[]); setUsingMock(false); }
        setLoading(false);
      });
  }, []);

  const handleDelete = (id: string) => setInvoices((prev) => prev.filter((i) => i.id !== id));

  const filtered = invoices.filter((inv) => {
    const q = search.toLowerCase();
    const matchSearch = inv.invoice_number.toLowerCase().includes(q) || inv.contact_name.toLowerCase().includes(q) || (inv.property_address ?? "").toLowerCase().includes(q);
    const matchStatus = statusFilter === "All" || inv.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const fmt = (n: number) => `CA$${n.toLocaleString()}`;
  const fmtDate = (d: string | null) => d ? new Date(d).toLocaleDateString("en-CA", { month: "short", day: "numeric", year: "numeric" }) : "—";

  const stats = {
    total:    invoices.reduce((s, i) => s + i.total_amount, 0),
    paid:     invoices.filter((i) => i.status === "Paid").reduce((s, i) => s + i.total_amount, 0),
    pending:  invoices.filter((i) => ["Sent","Viewed"].includes(i.status)).reduce((s, i) => s + i.total_amount, 0),
    overdue:  invoices.filter((i) => i.status === "Overdue").length,
  };

  return (
    <div className="flex flex-col h-full">
      <div className="px-6 py-5 bg-white border-b border-[#E8E6E0] flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-[20px] font-bold text-[#111] tracking-tight">Invoices</h1>
          <p className="text-[13px] text-[#A8A49C] mt-0.5">Dashboard › Invoices</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 border border-[#E8E6E0] rounded-xl px-4 py-2 text-[13px] font-semibold text-[#7C7870] hover:bg-[#F4F5F7] transition-colors">
            <Download size={14} /> Export
          </button>
          <button className="flex items-center gap-2 bg-[#111] hover:bg-[#222] text-white text-[13px] font-semibold px-4 py-2 rounded-xl transition-colors shadow-sm">
            <Plus size={15} /> New Invoice
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-5">
        {usingMock && !loading && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-2.5 text-[13px] text-amber-700 flex items-center gap-2">
            <AlertCircle size={14} /> Showing sample data
          </div>
        )}

        {/* KPI cards */}
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
          {[
            { label: "Total Invoiced", value: fmt(stats.total),   icon: DollarSign,   color: "bg-indigo-50 text-indigo-600"  },
            { label: "Collected",      value: fmt(stats.paid),    icon: CheckCircle2, color: "bg-emerald-50 text-emerald-600"},
            { label: "Pending",        value: fmt(stats.pending), icon: Clock,        color: "bg-amber-50 text-amber-600"    },
            { label: "Overdue",        value: stats.overdue,      icon: AlertCircle,  color: "bg-rose-50 text-rose-600"      },
          ].map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="bg-white rounded-xl border border-[#E8E6E0] shadow-sm p-4 flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${color}`}>
                <Icon size={18} />
              </div>
              <div>
                <p className="text-[11px] font-semibold text-[#7C7870] uppercase tracking-wide">{label}</p>
                <p className="text-[18px] font-bold text-[#111] tracking-tight">{value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Filter bar */}
        <div className="bg-white rounded-xl border border-[#E8E6E0] shadow-sm p-4 flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 bg-[#F4F5F7] border border-[#E8E6E0] rounded-xl px-3 py-2.5 flex-1 min-w-[200px]">
            <Search size={14} className="text-[#A8A49C] shrink-0" />
            <input type="text" placeholder="Search invoices..." value={search} onChange={(e) => setSearch(e.target.value)}
              className="bg-transparent text-[13px] text-[#111] placeholder-[#C5BFB5] outline-none w-full" />
          </div>
          <div className="flex items-center gap-1 bg-[#F4F5F7] rounded-xl p-1">
            {["All","Draft","Sent","Viewed","Paid","Overdue","Cancelled"].map((s) => (
              <button key={s} onClick={() => setStatusFilter(s)}
                className={`text-[11px] font-semibold px-2.5 py-1.5 rounded-lg transition-colors whitespace-nowrap ${statusFilter === s ? "bg-white text-[#111] shadow-sm" : "text-[#7C7870] hover:text-[#111]"}`}>
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl border border-[#E8E6E0] shadow-sm overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#F0EDE6]">
                {["Invoice","Contact","Property","Status","Issue Date","Due Date","Amount","Paid",""].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-[11px] font-semibold text-[#7C7870] uppercase tracking-wide whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F9F8F6]">
              {loading ? (
                <tr><td colSpan={9} className="px-4 py-10 text-center text-[13px] text-[#A8A49C]">Loading…</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={9} className="px-4 py-10 text-center text-[13px] text-[#A8A49C]">No invoices found.</td></tr>
              ) : filtered.map((inv) => {
                const cfg = STATUS_CFG[inv.status];
                const StatusIcon = cfg.icon;
                return (
                  <tr key={inv.id} className="hover:bg-[#FAFAF8] transition-colors group">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center shrink-0">
                          <FileText size={14} className="text-indigo-500" />
                        </div>
                        <p className="text-[13px] font-bold text-[#111]">{inv.invoice_number}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        <User size={12} className="text-[#A8A49C]" />
                        <span className="text-[12px] text-[#7C7870]">{inv.contact_name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-[12px] text-[#7C7870] max-w-[140px] truncate block">{inv.property_address ?? "—"}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full w-fit ${cfg.bg} ${cfg.color}`}>
                        <StatusIcon size={10} />{inv.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-[12px] text-[#7C7870] whitespace-nowrap">{fmtDate(inv.issue_date)}</td>
                    <td className="px-4 py-3 text-[12px] text-[#7C7870] whitespace-nowrap">{fmtDate(inv.due_date)}</td>
                    <td className="px-4 py-3 text-[13px] font-bold text-[#111] whitespace-nowrap">{fmt(inv.total_amount)}</td>
                    <td className="px-4 py-3 text-[13px] font-semibold whitespace-nowrap">
                      <span className={inv.amount_paid > 0 ? "text-emerald-600" : "text-[#A8A49C]"}>
                        {inv.amount_paid > 0 ? fmt(inv.amount_paid) : "—"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => setSelected(inv)}
                          className="w-7 h-7 rounded-lg flex items-center justify-center text-[#A8A49C] hover:bg-[#F4F5F7] border border-[#E8E6E0]">
                          <Eye size={12} />
                        </button>
                        <button className="w-7 h-7 rounded-lg flex items-center justify-center text-[#A8A49C] hover:bg-[#F4F5F7] border border-[#E8E6E0]">
                          <Pencil size={12} />
                        </button>
                        <button onClick={() => handleDelete(inv.id)}
                          className="w-7 h-7 rounded-lg flex items-center justify-center text-[#A8A49C] hover:bg-rose-50 hover:text-rose-500 border border-[#E8E6E0]">
                          <Trash2 size={12} />
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

      {selected && <InvoiceModal invoice={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}
