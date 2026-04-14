"use client";

import { useEffect, useState } from "react";
import {
  Download, Search, DollarSign, CheckCircle2, Clock,
  AlertCircle, Plus, X, Bell, ChevronRight,
} from "lucide-react";
import { supabase } from "@/lib/supabase";

// ── Types ─────────────────────────────────────────────────────────────────────

interface PaymentRow {
  id: string;
  reference_no: string;
  contact_name: string;
  property_address: string;
  payment_type: "Deposit" | "Installment" | "Final Payment" | "Commission" | "Refund";
  amount: number;
  status: "Completed" | "Pending" | "Failed" | "Refunded";
  payment_date: string | null;
  deal_id: string | null;
  payment_method: string;
}

// ── Config ────────────────────────────────────────────────────────────────────

const STATUS_CFG: Record<string, { color: string; bg: string }> = {
  Completed: { color: "text-emerald-700", bg: "bg-emerald-100" },
  Pending:   { color: "text-amber-700",   bg: "bg-amber-100"   },
  Failed:    { color: "text-rose-700",    bg: "bg-rose-100"    },
  Refunded:  { color: "text-slate-600",   bg: "bg-slate-100"   },
};

const TYPE_CFG: Record<string, string> = {
  "Deposit":       "bg-indigo-100 text-indigo-700",
  "Installment":   "bg-blue-100 text-blue-700",
  "Final Payment": "bg-emerald-100 text-emerald-700",
  "Commission":    "bg-violet-100 text-violet-700",
  "Refund":        "bg-rose-100 text-rose-700",
};

const TYPE_ORDER = ["Deposit", "Installment", "Final Payment"];

// ── Mock data ─────────────────────────────────────────────────────────────────

const MOCK_PAYMENTS: PaymentRow[] = [
  { id:"p1",  reference_no:"REF-2026-001", contact_name:"Aisha Patel",     property_address:"18 Lakeview Drive, Vancouver", payment_type:"Deposit",       amount:46000,  status:"Completed", payment_date:"2026-03-01", deal_id:"deal-A", payment_method:"Wire"          },
  { id:"p2",  reference_no:"REF-2026-002", contact_name:"Aisha Patel",     property_address:"18 Lakeview Drive, Vancouver", payment_type:"Installment",   amount:230000, status:"Completed", payment_date:"2026-03-15", deal_id:"deal-A", payment_method:"Bank Transfer" },
  { id:"p3",  reference_no:"REF-2026-003", contact_name:"Aisha Patel",     property_address:"18 Lakeview Drive, Vancouver", payment_type:"Final Payment", amount:644000, status:"Pending",   payment_date:"2026-04-10", deal_id:"deal-A", payment_method:"Wire"          },
  { id:"p4",  reference_no:"REF-2026-004", contact_name:"Carlos Mendez",   property_address:"34 Cedar Hills Dr, Regina",    payment_type:"Deposit",       amount:30500,  status:"Completed", payment_date:"2026-02-20", deal_id:"deal-B", payment_method:"Bank Transfer" },
  { id:"p5",  reference_no:"REF-2026-005", contact_name:"Carlos Mendez",   property_address:"34 Cedar Hills Dr, Regina",    payment_type:"Installment",   amount:152500, status:"Pending",   payment_date:"2026-03-20", deal_id:"deal-B", payment_method:"Bank Transfer" },
  { id:"p6",  reference_no:"REF-2026-006", contact_name:"Carlos Mendez",   property_address:"34 Cedar Hills Dr, Regina",    payment_type:"Final Payment", amount:427000, status:"Pending",   payment_date:"2026-04-05", deal_id:"deal-B", payment_method:"Wire"          },
  { id:"p7",  reference_no:"REF-2026-007", contact_name:"Linda Cheng",     property_address:"93 Harbor Blvd, Montreal",     payment_type:"Deposit",       amount:62500,  status:"Completed", payment_date:"2026-03-05", deal_id:"deal-C", payment_method:"Cheque"        },
  { id:"p8",  reference_no:"REF-2026-008", contact_name:"Linda Cheng",     property_address:"93 Harbor Blvd, Montreal",     payment_type:"Installment",   amount:312500, status:"Failed",    payment_date:"2026-03-22", deal_id:"deal-C", payment_method:"Credit Card"   },
  { id:"p9",  reference_no:"REF-2026-009", contact_name:"Marcus Reid",     property_address:"5 Birchwood Court, Ottawa",    payment_type:"Deposit",       amount:19750,  status:"Completed", payment_date:"2026-02-28", deal_id:"deal-D", payment_method:"Bank Transfer" },
  { id:"p10", reference_no:"REF-2026-010", contact_name:"Marcus Reid",     property_address:"5 Birchwood Court, Ottawa",    payment_type:"Final Payment", amount:375250, status:"Refunded",  payment_date:"2026-03-18", deal_id:"deal-D", payment_method:"Bank Transfer" },
];

// ── Helpers ───────────────────────────────────────────────────────────────────

function fmt(n: number) {
  return `CA$${n.toLocaleString()}`;
}

function fmtDate(d: string | null) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-CA", { month: "short", day: "numeric", year: "numeric" });
}

function isOverdue(p: PaymentRow) {
  return p.status === "Pending" && p.payment_date !== null && p.payment_date < new Date().toISOString().slice(0, 10);
}

// ── Timeline Group ────────────────────────────────────────────────────────────

function DealGroup({
  dealId,
  rows,
  onMarkPaid,
  onSendReminder,
}: {
  dealId: string;
  rows: PaymentRow[];
  onMarkPaid: (id: string) => void;
  onSendReminder: (p: PaymentRow) => void;
}) {
  const sorted = [...rows].sort((a, b) => TYPE_ORDER.indexOf(a.payment_type) - TYPE_ORDER.indexOf(b.payment_type));
  const first = sorted[0];

  return (
    <div className="bg-white rounded-xl border border-[#E8E6E0] shadow-sm overflow-hidden">
      {/* Deal header */}
      <div className="px-5 py-3 bg-[#FAFAF8] border-b border-[#F0EDE6] flex items-center justify-between">
        <div>
          <p className="text-[13px] font-bold text-[#111]">{first?.contact_name ?? "—"}</p>
          <p className="text-[11px] text-[#A8A49C] mt-0.5">{first?.property_address ?? "—"}</p>
        </div>
        <span className="text-[10px] font-semibold text-[#A8A49C] uppercase tracking-wide">Deal {dealId}</span>
      </div>

      {/* Step progress */}
      <div className="px-5 py-4">
        <div className="flex items-center gap-0">
          {TYPE_ORDER.map((type, i) => {
            const match = sorted.find((r) => r.payment_type === type);
            const done = match?.status === "Completed";
            const failed = match?.status === "Failed";
            const isLast = i === TYPE_ORDER.length - 1;
            return (
              <div key={type} className="flex items-center flex-1 min-w-0">
                <div className="flex flex-col items-center shrink-0">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold border-2 transition-colors ${
                    done    ? "bg-emerald-500 border-emerald-500 text-white" :
                    failed  ? "bg-rose-500 border-rose-500 text-white" :
                    match   ? "bg-amber-400 border-amber-400 text-white" :
                              "bg-[#F4F5F7] border-[#E8E6E0] text-[#C5BFB5]"
                  }`}>
                    {done ? <CheckCircle2 size={12} /> : i + 1}
                  </div>
                  <span className="text-[9px] font-semibold text-[#A8A49C] mt-1 whitespace-nowrap">{type}</span>
                </div>
                {!isLast && (
                  <div className={`flex-1 h-0.5 mx-1 mb-4 rounded-full ${done ? "bg-emerald-400" : "bg-[#E8E6E0]"}`} />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Payment rows */}
      <div className="divide-y divide-[#F9F8F6]">
        {sorted.map((p) => {
          const cfg = STATUS_CFG[p.status] ?? STATUS_CFG.Pending;
          const overdue = isOverdue(p);
          return (
            <div key={p.id} className="px-5 py-3 flex items-center gap-3 flex-wrap hover:bg-[#FAFAF8] transition-colors">
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap ${TYPE_CFG[p.payment_type] ?? "bg-slate-100 text-slate-600"}`}>
                {p.payment_type}
              </span>
              <span className="text-[12px] font-bold text-[#111] min-w-[90px]">{fmt(p.amount)}</span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${cfg.bg} ${cfg.color}`}>
                {p.status}
              </span>
              {overdue && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-700">Overdue</span>
              )}
              <span className="text-[11px] text-[#A8A49C] flex-1">{fmtDate(p.payment_date)}</span>
              <span className="text-[11px] text-[#A8A49C] hidden sm:block">{p.reference_no}</span>
              <div className="flex items-center gap-1.5 ml-auto">
                {p.status === "Pending" && (
                  <button
                    onClick={() => onMarkPaid(p.id)}
                    className="flex items-center gap-1 bg-[#111] hover:bg-[#222] text-white text-[11px] font-semibold px-3 py-1.5 rounded-xl transition-colors"
                  >
                    <CheckCircle2 size={11} /> Mark Paid
                  </button>
                )}
                <button
                  onClick={() => onSendReminder(p)}
                  className="flex items-center gap-1 border border-[#E8E6E0] rounded-xl px-3 py-1.5 text-[11px] font-semibold text-[#7C7870] hover:bg-[#F4F5F7] transition-colors"
                >
                  <Bell size={11} /> Remind
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function PaymentsPage() {
  const [payments, setPayments]     = useState<PaymentRow[]>(MOCK_PAYMENTS);
  const [usingMock, setUsingMock]   = useState(true);
  const [loading, setLoading]       = useState(true);
  const [search, setSearch]         = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [typeFilter, setTypeFilter]     = useState("All");
  const [reminderSent, setReminderSent] = useState<string | null>(null);

  useEffect(() => {
    supabase
      .from("payments")
      .select("*")
      .order("payment_date", { ascending: true })
      .then(({ data }) => {
        if (data && data.length > 0) {
          setPayments(data as PaymentRow[]);
          setUsingMock(false);
        }
        setLoading(false);
      });
  }, []);

  // ── KPI calculations ────────────────────────────────────────────────────────

  const today = new Date().toISOString().slice(0, 10);
  const totalScheduled  = payments.reduce((s, p) => s + p.amount, 0);
  const totalCollected  = payments.filter((p) => p.status === "Completed").reduce((s, p) => s + p.amount, 0);
  const totalOutstanding = payments.filter((p) => p.status === "Pending").reduce((s, p) => s + p.amount, 0);
  const overdueCount    = payments.filter((p) => p.status === "Pending" && p.payment_date !== null && p.payment_date < today).length;

  // ── Mark Paid (optimistic) ──────────────────────────────────────────────────

  const handleMarkPaid = async (id: string) => {
    const todayStr = today;
    const prev = payments.find((p) => p.id === id);
    // Optimistic update
    setPayments((ps) =>
      ps.map((p) => p.id === id ? { ...p, status: "Completed", payment_date: todayStr } : p)
    );
    const { error } = await supabase
      .from("payments")
      .update({ status: "Completed", payment_date: todayStr })
      .eq("id", id);
    if (error && prev) {
      // Revert on error
      setPayments((ps) => ps.map((p) => p.id === id ? prev : p));
    }
  };

  // ── Send Reminder ───────────────────────────────────────────────────────────

  const handleSendReminder = async (p: PaymentRow) => {
    setReminderSent(p.id);
    try {
      await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: `${p.contact_name.toLowerCase().replace(/\s+/g, ".")}@example.com`,
          template: "appointment_reminder",
          data: { contactName: p.contact_name, amount: p.amount, dueDate: p.payment_date },
        }),
      });
    } catch {
      // silently ignore — reminder is best-effort
    }
    setTimeout(() => setReminderSent(null), 2000);
  };

  // ── Filtering ───────────────────────────────────────────────────────────────

  const filtered = payments.filter((p) => {
    const q = search.toLowerCase();
    const matchSearch =
      p.reference_no.toLowerCase().includes(q) ||
      p.contact_name.toLowerCase().includes(q) ||
      p.property_address.toLowerCase().includes(q);
    const matchStatus = statusFilter === "All" || p.status === statusFilter;
    const matchType   = typeFilter   === "All" || p.payment_type === typeFilter;
    return matchSearch && matchStatus && matchType;
  });

  // Group by deal_id
  const dealGroups = Array.from(
    filtered.reduce((map, p) => {
      const key = p.deal_id ?? p.id;
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(p);
      return map;
    }, new Map<string, PaymentRow[]>())
  );

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-6 py-5 bg-white border-b border-[#E8E6E0] flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-[20px] font-bold text-[#111] tracking-tight">Payments</h1>
          <p className="text-[13px] text-[#A8A49C] mt-0.5">Dashboard › Payments</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 border border-[#E8E6E0] rounded-xl px-4 py-2 text-[13px] font-medium text-[#7C7870] hover:bg-[#F4F5F7] transition-colors">
            <Download size={14} /> Export
          </button>
          <button className="flex items-center gap-2 bg-[#111] hover:bg-[#222] text-white text-[13px] font-semibold px-4 py-2 rounded-xl transition-colors shadow-sm">
            <Plus size={15} /> Add Payment
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-5">
        {/* Sample data banner */}
        {usingMock && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-2.5 text-[13px] text-amber-700 flex items-center gap-2">
            <AlertCircle size={14} /> Showing sample data
          </div>
        )}

        {/* KPI cards */}
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
          {[
            { label: "Total Scheduled",  value: fmt(totalScheduled),  icon: DollarSign,   iconBg: "bg-indigo-50",  iconColor: "text-indigo-600"  },
            { label: "Total Collected",  value: fmt(totalCollected),  icon: CheckCircle2, iconBg: "bg-emerald-50", iconColor: "text-emerald-600" },
            { label: "Total Outstanding",value: fmt(totalOutstanding),icon: Clock,        iconBg: "bg-amber-50",   iconColor: "text-amber-600"   },
            { label: "Overdue",          value: overdueCount,         icon: AlertCircle,  iconBg: "bg-rose-50",    iconColor: "text-rose-600"    },
          ].map(({ label, value, icon: Icon, iconBg, iconColor }) => (
            <div key={label} className="bg-white rounded-xl border border-[#E8E6E0] shadow-sm p-4 flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${iconBg}`}>
                <Icon size={18} className={iconColor} />
              </div>
              <div>
                <p className="text-[11px] font-semibold text-[#A8A49C] uppercase tracking-wide">{label}</p>
                <p className="text-[18px] font-bold text-[#111] tracking-tight">{value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Filter bar */}
        <div className="bg-white rounded-xl border border-[#E8E6E0] shadow-sm p-4 flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 bg-[#F4F5F7] rounded-xl px-3 py-2 flex-1 min-w-[180px]">
            <Search size={14} className="text-[#A8A49C] shrink-0" />
            <input
              type="text"
              placeholder="Search reference, contact, property..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-transparent text-[13px] text-[#111] placeholder-[#C5BFB5] outline-none w-full"
            />
          </div>

          {/* Status pills */}
          <div className="flex items-center gap-1 bg-[#F4F5F7] rounded-xl p-1">
            {["All", "Completed", "Pending", "Failed", "Refunded"].map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`text-[11px] font-semibold px-2.5 py-1.5 rounded-lg transition-colors whitespace-nowrap ${
                  statusFilter === s ? "bg-white text-[#111] shadow-sm" : "text-[#7C7870] hover:text-[#111]"
                }`}
              >
                {s}
              </button>
            ))}
          </div>

          {/* Type pills */}
          <div className="flex items-center gap-1 bg-[#F4F5F7] rounded-xl p-1">
            {["All", "Deposit", "Installment", "Final Payment"].map((t) => (
              <button
                key={t}
                onClick={() => setTypeFilter(t)}
                className={`text-[11px] font-semibold px-2.5 py-1.5 rounded-lg transition-colors whitespace-nowrap ${
                  typeFilter === t ? "bg-white text-[#111] shadow-sm" : "text-[#7C7870] hover:text-[#111]"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Reminder toast */}
        {reminderSent && (
          <div className="bg-indigo-50 border border-indigo-200 rounded-xl px-4 py-2.5 text-[13px] text-indigo-700 flex items-center gap-2">
            <Bell size={14} /> Reminder sent successfully.
          </div>
        )}

        {/* Timeline groups */}
        {loading ? (
          <div className="text-center py-12 text-[13px] text-[#A8A49C]">Loading payments…</div>
        ) : dealGroups.length === 0 ? (
          <div className="text-center py-12 text-[13px] text-[#A8A49C]">No payments match your filters.</div>
        ) : (
          <div className="space-y-4">
            {dealGroups.map(([dealId, rows]) => (
              <DealGroup
                key={dealId}
                dealId={dealId}
                rows={rows}
                onMarkPaid={handleMarkPaid}
                onSendReminder={handleSendReminder}
              />
            ))}
          </div>
        )}

        {/* Footer summary */}
        <div className="bg-white rounded-xl border border-[#E8E6E0] shadow-sm px-5 py-3 flex items-center justify-between">
          <p className="text-[12px] text-[#A8A49C]">{filtered.length} payment{filtered.length !== 1 ? "s" : ""}</p>
          <p className="text-[13px] font-bold text-[#111]">
            Total: {fmt(filtered.reduce((s, p) => s + p.amount, 0))}
          </p>
        </div>
      </div>
    </div>
  );
}
