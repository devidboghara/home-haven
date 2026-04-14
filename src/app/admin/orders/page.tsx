"use client";

import { useEffect, useState } from "react";
import {
  Download, Search, ShoppingCart, Activity, Clock,
  CheckCircle2, DollarSign, AlertCircle, Plus, ChevronRight,
} from "lucide-react";
import { supabase } from "@/lib/supabase";

// ── Types ─────────────────────────────────────────────────────────────────────

type PipelineStage =
  | "New Leads" | "No Contact Made" | "Contact Made" | "Appointment Set"
  | "Follow Up" | "Due Diligence" | "Closed Won" | "Closed Lost";

type DealType = "Wholesale" | "Fix & Flip" | "Rental" | "Primary";

interface OrderRow {
  id: string;
  property_address: string;
  contact_name: string;
  contact_email: string;
  deal_type: DealType;
  pipeline_stage: PipelineStage;
  asking_price: number;
  accepted_price: number | null;
  expected_close_date: string | null;
  created_at: string;
  deposit_paid: number;
  installments_paid: number;
  balance_due: number;
}

// ── Config ────────────────────────────────────────────────────────────────────

const STAGES: PipelineStage[] = [
  "New Leads", "No Contact Made", "Contact Made", "Appointment Set",
  "Follow Up", "Due Diligence", "Closed Won", "Closed Lost",
];

const STAGE_GROUPS: Record<string, PipelineStage[]> = {
  Active:        ["New Leads", "No Contact Made", "Contact Made", "Appointment Set", "Follow Up"],
  "Pending Close": ["Due Diligence"],
  Closed:        ["Closed Won", "Closed Lost"],
};

const DEAL_TYPE_BADGE: Record<DealType, string> = {
  "Wholesale":  "bg-violet-100 text-violet-700",
  "Fix & Flip": "bg-amber-100 text-amber-700",
  "Rental":     "bg-emerald-100 text-emerald-700",
  "Primary":    "bg-blue-100 text-blue-700",
};

// ── Mock data ─────────────────────────────────────────────────────────────────

const MOCK_ORDERS: OrderRow[] = [
  { id: "ORD-001", property_address: "42 Maple Street, Toronto, ON",      contact_name: "Thomas Morrison", contact_email: "thomas@example.com", deal_type: "Fix & Flip", pipeline_stage: "New Leads",       asking_price: 480000, accepted_price: null,   expected_close_date: null,         created_at: "2026-01-10T10:00:00Z", deposit_paid: 0,      installments_paid: 0,      balance_due: 480000 },
  { id: "ORD-002", property_address: "18 Lakeview Drive, Vancouver, BC",  contact_name: "Aisha Patel",     contact_email: "aisha@example.com",  deal_type: "Rental",     pipeline_stage: "Contact Made",    asking_price: 920000, accepted_price: 900000, expected_close_date: "2026-05-01", created_at: "2026-01-15T09:00:00Z", deposit_paid: 46000,  installments_paid: 230000, balance_due: 624000 },
  { id: "ORD-003", property_address: "34 Cedar Hills Dr, Regina, SK",     contact_name: "Carlos Mendez",   contact_email: "carlos@example.com", deal_type: "Wholesale",  pipeline_stage: "Appointment Set", asking_price: 310000, accepted_price: 305000, expected_close_date: "2026-04-15", created_at: "2026-01-20T11:00:00Z", deposit_paid: 30500,  installments_paid: 0,      balance_due: 274500 },
  { id: "ORD-004", property_address: "93 Harbor Blvd, Montreal, QC",      contact_name: "Linda Cheng",     contact_email: "linda@example.com",  deal_type: "Primary",    pipeline_stage: "Follow Up",       asking_price: 625000, accepted_price: 610000, expected_close_date: "2026-06-01", created_at: "2026-02-01T08:00:00Z", deposit_paid: 62500,  installments_paid: 0,      balance_due: 547500 },
  { id: "ORD-005", property_address: "5 Birchwood Court, Ottawa, ON",     contact_name: "Marcus Reid",     contact_email: "marcus@example.com", deal_type: "Fix & Flip", pipeline_stage: "Due Diligence",   asking_price: 395000, accepted_price: 390000, expected_close_date: "2026-04-30", created_at: "2026-02-05T14:00:00Z", deposit_paid: 19750,  installments_paid: 97500,  balance_due: 272750 },
  { id: "ORD-006", property_address: "8 Oakridge Terrace, Victoria, BC",  contact_name: "Nina Torres",     contact_email: "nina@example.com",   deal_type: "Fix & Flip", pipeline_stage: "Closed Won",      asking_price: 1750000,accepted_price: 1700000,expected_close_date: "2026-03-15", created_at: "2026-02-10T10:00:00Z", deposit_paid: 170000, installments_paid: 850000, balance_due: 680000 },
  { id: "ORD-007", property_address: "66 Willow Creek Rd, Halifax, NS",   contact_name: "James Liu",       contact_email: "james@example.com",  deal_type: "Rental",     pipeline_stage: "Closed Lost",     asking_price: 275000, accepted_price: null,   expected_close_date: null,         created_at: "2026-02-12T09:00:00Z", deposit_paid: 0,      installments_paid: 0,      balance_due: 0      },
  { id: "ORD-008", property_address: "11 Rosewood Blvd, Winnipeg, MB",    contact_name: "Mike Roberts",    contact_email: "mike@example.com",   deal_type: "Primary",    pipeline_stage: "No Contact Made", asking_price: 425000, accepted_price: null,   expected_close_date: null,         created_at: "2026-02-18T13:00:00Z", deposit_paid: 0,      installments_paid: 0,      balance_due: 425000 },
];

// ── Helpers ───────────────────────────────────────────────────────────────────

function fmt(n: number) {
  return `CA$${n.toLocaleString()}`;
}

function fmtDate(d: string | null) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-CA", { month: "short", day: "numeric", year: "numeric" });
}

function stageIndex(s: PipelineStage) {
  return STAGES.indexOf(s);
}

// ── Stage Indicator ───────────────────────────────────────────────────────────

function StageIndicator({ current }: { current: PipelineStage }) {
  const currentIdx = stageIndex(current);
  return (
    <div className="flex items-center w-full overflow-x-auto py-1">
      {STAGES.map((stage, i) => {
        const isActive  = i === currentIdx;
        const isDone    = i < currentIdx;
        const isLast    = i === STAGES.length - 1;
        return (
          <div key={stage} className="flex items-center flex-1 min-w-0">
            <div className="flex flex-col items-center shrink-0">
              <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold border-2 transition-colors ${
                isActive ? "bg-indigo-500 border-indigo-500 text-white" :
                isDone   ? "bg-indigo-200 border-indigo-200 text-indigo-700" :
                           "bg-[#F4F5F7] border-[#E8E6E0] text-[#C5BFB5]"
              }`}>
                {isDone ? <CheckCircle2 size={10} /> : i + 1}
              </div>
              <span className={`text-[8px] font-semibold mt-0.5 whitespace-nowrap leading-tight text-center max-w-[52px] truncate ${
                isActive ? "text-indigo-600" : isDone ? "text-indigo-400" : "text-[#C5BFB5]"
              }`}>
                {stage}
              </span>
            </div>
            {!isLast && (
              <div className={`flex-1 h-0.5 mx-0.5 mb-3 rounded-full ${isDone ? "bg-indigo-200" : "bg-[#E8E6E0]"}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ── Order Card ────────────────────────────────────────────────────────────────

function OrderCard({
  order,
  onStageChange,
}: {
  order: OrderRow;
  onStageChange: (id: string, stage: PipelineStage) => void;
}) {
  return (
    <div className="bg-white rounded-xl border border-[#E8E6E0] shadow-sm overflow-hidden">
      {/* Top row */}
      <div className="px-5 py-3 flex items-start justify-between gap-3 flex-wrap border-b border-[#F0EDE6]">
        <div className="flex-1 min-w-0">
          <p className="text-[13px] font-bold text-[#111] truncate">{order.property_address}</p>
          <p className="text-[11px] text-[#7C7870] mt-0.5">{order.contact_name} · {order.contact_email}</p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${DEAL_TYPE_BADGE[order.deal_type]}`}>
            {order.deal_type}
          </span>
          <span className="text-[10px] text-[#A8A49C]">{fmtDate(order.created_at)}</span>
          <span className="text-[10px] font-semibold text-[#A8A49C] bg-[#F4F5F7] px-2 py-0.5 rounded-lg">{order.id}</span>
        </div>
      </div>

      {/* Stage indicator */}
      <div className="px-5 pt-3 pb-1">
        <StageIndicator current={order.pipeline_stage} />
      </div>

      {/* Bottom row: payment summary + actions */}
      <div className="px-5 py-3 flex items-center gap-4 flex-wrap border-t border-[#F0EDE6] bg-[#FAFAF8]">
        {/* Payment summary */}
        <div className="flex items-center gap-4 flex-1 flex-wrap">
          {[
            { label: "Deposit",      value: order.deposit_paid,      color: "text-emerald-600" },
            { label: "Installments", value: order.installments_paid, color: "text-blue-600"    },
            { label: "Balance Due",  value: order.balance_due,       color: "text-rose-600"    },
          ].map(({ label, value, color }) => (
            <div key={label}>
              <p className="text-[10px] font-semibold text-[#A8A49C] uppercase tracking-wide">{label}</p>
              <p className={`text-[12px] font-bold ${color}`}>{fmt(value)}</p>
            </div>
          ))}
          {order.accepted_price && (
            <div>
              <p className="text-[10px] font-semibold text-[#A8A49C] uppercase tracking-wide">Accepted</p>
              <p className="text-[12px] font-bold text-[#111]">{fmt(order.accepted_price)}</p>
            </div>
          )}
        </div>

        {/* Stage dropdown + view */}
        <div className="flex items-center gap-2 ml-auto">
          <select
            value={order.pipeline_stage}
            onChange={(e) => onStageChange(order.id, e.target.value as PipelineStage)}
            className="bg-[#F4F5F7] border border-[#E8E6E0] rounded-xl px-3 py-2 text-[12px] text-[#111] outline-none cursor-pointer hover:border-indigo-300 transition-colors"
          >
            {STAGES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          <button className="flex items-center gap-1 border border-[#E8E6E0] rounded-xl px-3 py-2 text-[12px] font-semibold text-[#7C7870] hover:bg-[#F4F5F7] transition-colors">
            View <ChevronRight size={12} />
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function OrdersPage() {
  const [orders, setOrders]         = useState<OrderRow[]>(MOCK_ORDERS);
  const [usingMock, setUsingMock]   = useState(true);
  const [loading, setLoading]       = useState(true);
  const [search, setSearch]         = useState("");
  const [stageGroup, setStageGroup] = useState<string>("All");
  const [dealType, setDealType]     = useState<string>("All");

  useEffect(() => {
    supabase
      .from("deals")
      .select("*, properties(address, city), contacts(full_name, email)")
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        if (data && data.length > 0) {
          const mapped: OrderRow[] = (data as any[]).map((d) => ({
            id:                  d.id,
            property_address:    d.properties ? `${d.properties.address}${d.properties.city ? ", " + d.properties.city : ""}` : "—",
            contact_name:        d.contacts?.full_name  ?? "—",
            contact_email:       d.contacts?.email      ?? "—",
            deal_type:           (d.deal_type as DealType) ?? "Primary",
            pipeline_stage:      d.pipeline_stage as PipelineStage,
            asking_price:        d.asking_price  ?? 0,
            accepted_price:      d.accepted_price ?? null,
            expected_close_date: d.expected_close_date ?? null,
            created_at:          d.created_at,
            deposit_paid:        0,
            installments_paid:   0,
            balance_due:         d.asking_price ?? 0,
          }));
          setOrders(mapped);
          setUsingMock(false);
        }
        setLoading(false);
      });
  }, []);

  // ── Optimistic stage update ───────────────────────────────────────────────

  const handleStageChange = async (id: string, stage: PipelineStage) => {
    const prev = orders.find((o) => o.id === id);
    setOrders((os) => os.map((o) => o.id === id ? { ...o, pipeline_stage: stage } : o));
    try {
      const res = await fetch("/api/deals", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, pipeline_stage: stage }),
      });
      if (!res.ok && prev) {
        setOrders((os) => os.map((o) => o.id === id ? prev : o));
      }
    } catch {
      if (prev) setOrders((os) => os.map((o) => o.id === id ? prev : o));
    }
  };

  // ── KPIs ──────────────────────────────────────────────────────────────────

  const totalOrders   = orders.length;
  const activeOrders  = orders.filter((o) => STAGE_GROUPS["Active"].includes(o.pipeline_stage)).length;
  const pendingClose  = orders.filter((o) => STAGE_GROUPS["Pending Close"].includes(o.pipeline_stage)).length;
  const closedWon     = orders.filter((o) => o.pipeline_stage === "Closed Won").length;
  const totalValue    = orders.reduce((s, o) => s + (o.accepted_price ?? o.asking_price), 0);

  // ── Filtering ─────────────────────────────────────────────────────────────

  const filtered = orders.filter((o) => {
    const q = search.toLowerCase();
    const matchSearch =
      o.property_address.toLowerCase().includes(q) ||
      o.contact_name.toLowerCase().includes(q) ||
      o.id.toLowerCase().includes(q);
    const matchGroup =
      stageGroup === "All" ||
      (STAGE_GROUPS[stageGroup] ?? []).includes(o.pipeline_stage);
    const matchType = dealType === "All" || o.deal_type === dealType;
    return matchSearch && matchGroup && matchType;
  });

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-6 py-5 bg-white border-b border-[#E8E6E0] flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-[20px] font-bold text-[#111] tracking-tight">Orders</h1>
          <p className="text-[13px] text-[#A8A49C] mt-0.5">Dashboard › Orders</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 border border-[#E8E6E0] rounded-xl px-4 py-2 text-[13px] font-medium text-[#7C7870] hover:bg-[#F4F5F7] transition-colors">
            <Download size={14} /> Export
          </button>
          <button className="flex items-center gap-2 bg-[#111] hover:bg-[#222] text-white text-[13px] font-semibold px-4 py-2 rounded-xl transition-colors shadow-sm">
            <Plus size={15} /> New Order
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-5 bg-[#F4F5F7]">
        {/* Sample data banner */}
        {usingMock && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-2.5 text-[13px] text-amber-700 flex items-center gap-2">
            <AlertCircle size={14} /> Showing sample data — connect Supabase to see live orders
          </div>
        )}

        {/* KPI cards */}
        <div className="grid grid-cols-2 xl:grid-cols-5 gap-4">
          {[
            { label: "Total Orders",   value: totalOrders,       icon: ShoppingCart, iconBg: "bg-indigo-50",  iconColor: "text-indigo-600"  },
            { label: "Active Orders",  value: activeOrders,      icon: Activity,     iconBg: "bg-blue-50",    iconColor: "text-blue-600"    },
            { label: "Pending Close",  value: pendingClose,      icon: Clock,        iconBg: "bg-amber-50",   iconColor: "text-amber-600"   },
            { label: "Closed Won",     value: closedWon,         icon: CheckCircle2, iconBg: "bg-emerald-50", iconColor: "text-emerald-600" },
            { label: "Total Value",    value: fmt(totalValue),   icon: DollarSign,   iconBg: "bg-violet-50",  iconColor: "text-violet-600"  },
          ].map(({ label, value, icon: Icon, iconBg, iconColor }) => (
            <div key={label} className="bg-white rounded-xl border border-[#E8E6E0] shadow-sm p-4 flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${iconBg}`}>
                <Icon size={18} className={iconColor} />
              </div>
              <div className="min-w-0">
                <p className="text-[11px] font-semibold text-[#7C7870] uppercase tracking-wide">{label}</p>
                <p className="text-[18px] font-bold text-[#111] tracking-tight truncate">{value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Filter bar */}
        <div className="bg-white rounded-xl border border-[#E8E6E0] shadow-sm p-4 flex flex-wrap items-center gap-3">
          {/* Search */}
          <div className="flex items-center gap-2 bg-[#F4F5F7] border border-[#E8E6E0] rounded-xl px-3 py-2.5 flex-1 min-w-[200px]">
            <Search size={14} className="text-[#A8A49C] shrink-0" />
            <input
              type="text"
              placeholder="Search address, contact, deal ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-transparent text-[13px] text-[#111] placeholder-[#C5BFB5] outline-none w-full"
            />
          </div>

          {/* Stage group pills */}
          <div className="flex items-center gap-1 bg-[#F4F5F7] rounded-xl p-1">
            {["All", "Active", "Pending Close", "Closed"].map((g) => (
              <button
                key={g}
                onClick={() => setStageGroup(g)}
                className={`text-[11px] font-semibold px-2.5 py-1.5 rounded-lg transition-colors whitespace-nowrap ${
                  stageGroup === g ? "bg-white text-indigo-600 shadow-sm" : "text-[#7C7870] hover:text-[#111]"
                }`}
              >
                {g}
              </button>
            ))}
          </div>

          {/* Deal type pills */}
          <div className="flex items-center gap-1 bg-[#F4F5F7] rounded-xl p-1">
            {(["All", "Wholesale", "Fix & Flip", "Rental", "Primary"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setDealType(t)}
                className={`text-[11px] font-semibold px-2.5 py-1.5 rounded-lg transition-colors whitespace-nowrap ${
                  dealType === t ? "bg-white text-indigo-600 shadow-sm" : "text-[#7C7870] hover:text-[#111]"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Orders list */}
        {loading ? (
          <div className="text-center py-12 text-[13px] text-[#A8A49C]">Loading orders…</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-12 text-[13px] text-[#A8A49C]">No orders match your filters.</div>
        ) : (
          <div className="space-y-4">
            {filtered.map((order) => (
              <OrderCard key={order.id} order={order} onStageChange={handleStageChange} />
            ))}
          </div>
        )}

        {/* Footer count */}
        {!loading && filtered.length > 0 && (
          <div className="bg-white rounded-xl border border-[#E8E6E0] shadow-sm px-5 py-3 flex items-center justify-between">
            <p className="text-[12px] text-[#A8A49C]">{filtered.length} order{filtered.length !== 1 ? "s" : ""}</p>
            <p className="text-[13px] font-bold text-[#111]">
              Total: {fmt(filtered.reduce((s, o) => s + (o.accepted_price ?? o.asking_price), 0))}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
