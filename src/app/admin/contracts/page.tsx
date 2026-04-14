"use client";

import { useEffect, useState } from "react";
import {
  FileText, Search, Plus, Download, Eye, Pencil, Trash2,
  CheckCircle2, Clock, XCircle, AlertCircle, Send, X,
  Calendar, User, Building2, RefreshCw,
} from "lucide-react";
import { supabase } from "@/lib/supabase";

// ── Types ─────────────────────────────────────────────────────────────────────

type ContractStatus = "Draft" | "Sent" | "Viewed" | "Signed" | "Expired" | "Cancelled";

interface Contract {
  id: string;
  title: string;
  contract_type: string | null;
  status: ContractStatus;
  contact_name: string;
  property_address: string;
  agent_name: string;
  expiry_date: string | null;
  signed_at: string | null;
  sent_at: string | null;
  created_at: string;
}

// ── Config ────────────────────────────────────────────────────────────────────

const STATUS_CFG: Record<ContractStatus, { color: string; bg: string; icon: React.ElementType }> = {
  Draft:     { color: "text-slate-600",   bg: "bg-slate-100",   icon: FileText     },
  Sent:      { color: "text-indigo-700",  bg: "bg-indigo-100",  icon: Send         },
  Viewed:    { color: "text-blue-700",    bg: "bg-blue-100",    icon: Eye          },
  Signed:    { color: "text-emerald-700", bg: "bg-emerald-100", icon: CheckCircle2 },
  Expired:   { color: "text-amber-700",   bg: "bg-amber-100",   icon: Clock        },
  Cancelled: { color: "text-rose-700",    bg: "bg-rose-100",    icon: XCircle      },
};

const CONTRACT_TYPES = ["Purchase Agreement", "Lease Agreement", "Listing Agreement", "Assignment Contract", "Option Agreement", "NDA"];

// ── Mock data ─────────────────────────────────────────────────────────────────

const MOCK_CONTRACTS: Contract[] = [
  { id:"c1",  title:"Purchase Agreement — 42 Maple Street",    contract_type:"Purchase Agreement",  status:"Signed",    contact_name:"Thomas Morrison",  property_address:"42 Maple Street, Toronto",      agent_name:"Sarah Kim",    expiry_date:null,         signed_at:"2026-03-20", sent_at:"2026-03-15", created_at:"2026-03-10T10:00:00Z" },
  { id:"c2",  title:"Lease Agreement — 18 Lakeview Drive",     contract_type:"Lease Agreement",     status:"Sent",      contact_name:"Aisha Patel",      property_address:"18 Lakeview Drive, Vancouver",  agent_name:"Mike Roberts", expiry_date:"2026-05-01", signed_at:null,         sent_at:"2026-04-01", created_at:"2026-03-28T09:00:00Z" },
  { id:"c3",  title:"Listing Agreement — Cedar Hills Drive",   contract_type:"Listing Agreement",   status:"Draft",     contact_name:"Carlos Mendez",    property_address:"34 Cedar Hills Dr, Regina",     agent_name:"Priya Sharma", expiry_date:"2026-06-30", signed_at:null,         sent_at:null,         created_at:"2026-04-02T11:00:00Z" },
  { id:"c4",  title:"Assignment Contract — Harbor Blvd",       contract_type:"Assignment Contract", status:"Viewed",    contact_name:"Linda Cheng",      property_address:"93 Harbor Blvd, Montreal",      agent_name:"James Liu",    expiry_date:"2026-04-20", signed_at:null,         sent_at:"2026-04-05", created_at:"2026-04-01T08:00:00Z" },
  { id:"c5",  title:"Purchase Agreement — Birchwood Court",    contract_type:"Purchase Agreement",  status:"Expired",   contact_name:"Marcus Reid",      property_address:"5 Birchwood Court, Ottawa",     agent_name:"Nina Torres",  expiry_date:"2026-03-31", signed_at:null,         sent_at:"2026-03-01", created_at:"2026-02-28T14:00:00Z" },
  { id:"c6",  title:"Option Agreement — Oakridge Terrace",     contract_type:"Option Agreement",    status:"Signed",    contact_name:"Nina Torres",      property_address:"8 Oakridge Terrace, Victoria",  agent_name:"Sarah Kim",    expiry_date:null,         signed_at:"2026-03-10", sent_at:"2026-03-05", created_at:"2026-03-01T10:00:00Z" },
  { id:"c7",  title:"NDA — Willow Creek Road",                 contract_type:"NDA",                 status:"Cancelled", contact_name:"James Liu",        property_address:"66 Willow Creek Rd, Halifax",   agent_name:"Mike Roberts", expiry_date:null,         signed_at:null,         sent_at:"2026-02-15", created_at:"2026-02-12T09:00:00Z" },
  { id:"c8",  title:"Lease Agreement — Rosewood Blvd",         contract_type:"Lease Agreement",     status:"Draft",     contact_name:"Mike Roberts",     property_address:"11 Rosewood Blvd, Winnipeg",    agent_name:"Priya Sharma", expiry_date:"2026-07-01", signed_at:null,         sent_at:null,         created_at:"2026-04-05T13:00:00Z" },
];

// ── New Contract Modal ────────────────────────────────────────────────────────

function NewContractModal({ onClose, onSave }: { onClose: () => void; onSave: (c: Contract) => void }) {
  const [form, setForm] = useState({ title: "", contract_type: CONTRACT_TYPES[0], contact_name: "", property_address: "", agent_name: "", expiry_date: "" });
  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = () => {
    if (!form.title || !form.contact_name) return;
    onSave({ id: Date.now().toString(), ...form, status: "Draft", signed_at: null, sent_at: null, created_at: new Date().toISOString() });
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl border border-[#E8E6E0] shadow-2xl w-full max-w-md" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-5 border-b border-[#F0EDE6]">
          <h2 className="text-[16px] font-bold text-[#111]">New Contract</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-[#F4F5F7] text-[#A8A49C]"><X size={15} /></button>
        </div>
        <div className="p-5 space-y-3">
          {[
            { label: "Contract Title", key: "title", placeholder: "e.g. Purchase Agreement — 42 Maple St" },
            { label: "Contact Name",   key: "contact_name", placeholder: "Buyer / Seller name" },
            { label: "Property Address", key: "property_address", placeholder: "Property address" },
            { label: "Agent Name",     key: "agent_name", placeholder: "Assigned agent" },
          ].map(({ label, key, placeholder }) => (
            <div key={key}>
              <label className="block text-[11px] font-semibold text-[#7C7870] uppercase tracking-wide mb-1">{label}</label>
              <input value={(form as Record<string, string>)[key]} placeholder={placeholder} onChange={(e) => set(key, e.target.value)}
                className="w-full bg-[#F4F5F7] border border-[#E8E6E0] rounded-xl px-3 py-2.5 text-[13px] text-[#111] outline-none focus:border-indigo-400" />
            </div>
          ))}
          <div>
            <label className="block text-[11px] font-semibold text-[#7C7870] uppercase tracking-wide mb-1">Contract Type</label>
            <select value={form.contract_type} onChange={(e) => set("contract_type", e.target.value)}
              className="w-full bg-[#F4F5F7] border border-[#E8E6E0] rounded-xl px-3 py-2.5 text-[13px] text-[#7C7870] outline-none">
              {CONTRACT_TYPES.map((t) => <option key={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-[#7C7870] uppercase tracking-wide mb-1">Expiry Date</label>
            <input type="date" value={form.expiry_date} onChange={(e) => set("expiry_date", e.target.value)}
              className="w-full bg-[#F4F5F7] border border-[#E8E6E0] rounded-xl px-3 py-2.5 text-[13px] text-[#111] outline-none focus:border-indigo-400" />
          </div>
          <div className="flex gap-2 pt-1">
            <button onClick={onClose} className="flex-1 border border-[#E8E6E0] rounded-xl py-2.5 text-[13px] font-semibold text-[#7C7870] hover:bg-[#F4F5F7] transition-colors">Cancel</button>
            <button onClick={handleSubmit} disabled={!form.title || !form.contact_name}
              className="flex-1 bg-[#111] hover:bg-[#222] disabled:opacity-40 text-white text-[13px] font-semibold py-2.5 rounded-xl transition-colors">
              Create Contract
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function ContractsPage() {
  const [contracts, setContracts] = useState<Contract[]>(MOCK_CONTRACTS);
  const [usingMock, setUsingMock] = useState(true);
  const [loading, setLoading]     = useState(true);
  const [search, setSearch]       = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    supabase.from("contracts").select("*").order("created_at", { ascending: false })
      .then(({ data }) => {
        if (data && data.length > 0) { setContracts(data as Contract[]); setUsingMock(false); }
        setLoading(false);
      });
  }, []);

  const handleSend = (id: string) => setContracts((prev) => prev.map((c) => c.id === id ? { ...c, status: "Sent" as ContractStatus, sent_at: new Date().toISOString() } : c));
  const handleDelete = (id: string) => setContracts((prev) => prev.filter((c) => c.id !== id));
  const handleSave = (c: Contract) => { setContracts((prev) => [c, ...prev]); setShowModal(false); };

  const filtered = contracts.filter((c) => {
    const q = search.toLowerCase();
    const matchSearch = c.title.toLowerCase().includes(q) || c.contact_name.toLowerCase().includes(q) || c.property_address.toLowerCase().includes(q);
    const matchStatus = statusFilter === "All" || c.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const stats = {
    total:  contracts.length,
    signed: contracts.filter((c) => c.status === "Signed").length,
    pending:contracts.filter((c) => ["Sent","Viewed"].includes(c.status)).length,
    draft:  contracts.filter((c) => c.status === "Draft").length,
  };

  const fmtDate = (d: string | null) => d ? new Date(d).toLocaleDateString("en-CA", { month: "short", day: "numeric", year: "numeric" }) : "—";

  return (
    <div className="flex flex-col h-full">
      <div className="px-6 py-5 bg-white border-b border-[#E8E6E0] flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-[20px] font-bold text-[#111] tracking-tight">Contracts</h1>
          <p className="text-[13px] text-[#A8A49C] mt-0.5">Dashboard › Contracts</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 border border-[#E8E6E0] rounded-xl px-4 py-2 text-[13px] font-semibold text-[#7C7870] hover:bg-[#F4F5F7] transition-colors">
            <Download size={14} /> Export
          </button>
          <button onClick={() => setShowModal(true)}
            className="flex items-center gap-2 bg-[#111] hover:bg-[#222] text-white text-[13px] font-semibold px-4 py-2 rounded-xl transition-colors shadow-sm">
            <Plus size={15} /> New Contract
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
            { label: "Total Contracts", value: stats.total,   icon: FileText,     color: "bg-indigo-50 text-indigo-600"  },
            { label: "Signed",          value: stats.signed,  icon: CheckCircle2, color: "bg-emerald-50 text-emerald-600"},
            { label: "Pending Signature",value:stats.pending, icon: Clock,        color: "bg-amber-50 text-amber-600"    },
            { label: "Drafts",          value: stats.draft,   icon: FileText,     color: "bg-slate-50 text-slate-600"    },
          ].map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="bg-white rounded-xl border border-[#E8E6E0] shadow-sm p-4 flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${color}`}>
                <Icon size={18} />
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
            <input type="text" placeholder="Search contracts..." value={search} onChange={(e) => setSearch(e.target.value)}
              className="bg-transparent text-[13px] text-[#111] placeholder-[#C5BFB5] outline-none w-full" />
          </div>
          <div className="flex items-center gap-1 bg-[#F4F5F7] rounded-xl p-1">
            {["All","Draft","Sent","Viewed","Signed","Expired","Cancelled"].map((s) => (
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
                {["Contract","Type","Status","Contact","Property","Agent","Expiry","Signed",""].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-[11px] font-semibold text-[#7C7870] uppercase tracking-wide whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F9F8F6]">
              {loading ? (
                <tr><td colSpan={9} className="px-4 py-10 text-center text-[13px] text-[#A8A49C]">
                  <RefreshCw size={16} className="animate-spin inline mr-2" />Loading…
                </td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={9} className="px-4 py-10 text-center text-[13px] text-[#A8A49C]">No contracts found.</td></tr>
              ) : filtered.map((c) => {
                const cfg = STATUS_CFG[c.status];
                const StatusIcon = cfg.icon;
                return (
                  <tr key={c.id} className="hover:bg-[#FAFAF8] transition-colors group">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center shrink-0">
                          <FileText size={14} className="text-indigo-500" />
                        </div>
                        <p className="text-[13px] font-semibold text-[#111] max-w-[180px] truncate">{c.title}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-[12px] text-[#7C7870] whitespace-nowrap">{c.contract_type ?? "—"}</td>
                    <td className="px-4 py-3">
                      <span className={`flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full w-fit ${cfg.bg} ${cfg.color}`}>
                        <StatusIcon size={10} />{c.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        <User size={12} className="text-[#A8A49C]" />
                        <span className="text-[12px] text-[#7C7870]">{c.contact_name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        <Building2 size={12} className="text-[#A8A49C]" />
                        <span className="text-[12px] text-[#7C7870] max-w-[140px] truncate">{c.property_address}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-[12px] text-[#7C7870]">{c.agent_name}</td>
                    <td className="px-4 py-3 text-[12px] text-[#7C7870] whitespace-nowrap">{fmtDate(c.expiry_date)}</td>
                    <td className="px-4 py-3 text-[12px] text-[#7C7870] whitespace-nowrap">{fmtDate(c.signed_at)}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        {c.status === "Draft" && (
                          <button onClick={() => handleSend(c.id)}
                            className="flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1.5 rounded-lg bg-[#111] text-white hover:bg-[#333] transition-colors whitespace-nowrap">
                            <Send size={11} /> Send
                          </button>
                        )}
                        <button className="w-7 h-7 rounded-lg flex items-center justify-center text-[#A8A49C] hover:bg-[#F4F5F7] border border-[#E8E6E0]">
                          <Eye size={12} />
                        </button>
                        <button className="w-7 h-7 rounded-lg flex items-center justify-center text-[#A8A49C] hover:bg-[#F4F5F7] border border-[#E8E6E0]">
                          <Pencil size={12} />
                        </button>
                        <button onClick={() => handleDelete(c.id)}
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

      {showModal && <NewContractModal onClose={() => setShowModal(false)} onSave={handleSave} />}
    </div>
  );
}
