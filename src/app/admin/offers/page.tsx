"use client";

import { useState } from "react";
import {
  Plus, Search, Filter, ChevronDown, Eye, Pencil, Trash2,
  CheckCircle2, Clock, XCircle, DollarSign, Calendar,
  FileText, TrendingUp, Users, MoreHorizontal,
} from "lucide-react";

interface Offer {
  id: string;
  property: string;
  city: string;
  buyer: string;
  buyerInitials: string;
  agent: string;
  offeredPrice: string;
  askingPrice: string;
  closingDate: string;
  contingencies: string[];
  status: "Active" | "Accepted" | "Expired" | "Rejected" | "Countered";
  submittedDate: string;
  notes: string;
}

const OFFERS: Offer[] = [
  { id: "o1", property: "42 Maple Street", city: "Toronto, ON", buyer: "Thomas Morrison", buyerInitials: "TM", agent: "Sarah Kim", offeredPrice: "CA$465,000", askingPrice: "CA$480,000", closingDate: "Apr 15, 2026", contingencies: ["Financing", "Inspection"], status: "Active", submittedDate: "Mar 25, 2026", notes: "Pre-approved buyer, flexible on closing" },
  { id: "o2", property: "18 Lakeview Drive", city: "Vancouver, BC", buyer: "Aisha Patel", buyerInitials: "AP", agent: "Mike Roberts", offeredPrice: "CA$910,000", askingPrice: "CA$920,000", closingDate: "May 1, 2026", contingencies: ["Financing"], status: "Accepted", submittedDate: "Mar 20, 2026", notes: "Cash offer, waived inspection" },
  { id: "o3", property: "7 Pine Avenue", city: "Calgary, AB", buyer: "Derek Walsh", buyerInitials: "DW", agent: "Priya Sharma", offeredPrice: "CA$295,000", askingPrice: "CA$310,000", closingDate: "Apr 30, 2026", contingencies: ["Financing", "Inspection", "Appraisal"], status: "Countered", submittedDate: "Mar 18, 2026", notes: "Counter sent at CA$305,000" },
  { id: "o4", property: "93 Harbor Blvd", city: "Montreal, QC", buyer: "Linda Cheng", buyerInitials: "LC", agent: "James Liu", offeredPrice: "CA$1,200,000", askingPrice: "CA$1,250,000", closingDate: "Mar 31, 2026", contingencies: ["Inspection"], status: "Expired", submittedDate: "Feb 28, 2026", notes: "Buyer went with another property" },
  { id: "o5", property: "5 Birchwood Court", city: "Ottawa, ON", buyer: "Marcus Reid", buyerInitials: "MR", agent: "Nina Torres", offeredPrice: "CA$388,000", askingPrice: "CA$395,000", closingDate: "Apr 22, 2026", contingencies: ["Financing", "Inspection"], status: "Active", submittedDate: "Mar 22, 2026", notes: "First-time buyer, needs 30 day close" },
  { id: "o6", property: "11 Rosewood Blvd", city: "Winnipeg, MB", buyer: "Fatima Hassan", buyerInitials: "FH", agent: "Mike Roberts", offeredPrice: "CA$415,000", askingPrice: "CA$425,000", closingDate: "May 10, 2026", contingencies: ["Financing"], status: "Rejected", submittedDate: "Mar 15, 2026", notes: "Price too low, seller declined" },
  { id: "o7", property: "34 Cedar Hills Dr", city: "Regina, SK", buyer: "Carlos Mendez", buyerInitials: "CM", agent: "Priya Sharma", offeredPrice: "CA$598,000", askingPrice: "CA$610,000", closingDate: "Apr 28, 2026", contingencies: ["Appraisal"], status: "Active", submittedDate: "Mar 24, 2026", notes: "Strong offer, investor buyer" },
];

const statusConfig = {
  Active: { color: "bg-indigo-100 text-indigo-700", icon: Clock },
  Accepted: { color: "bg-emerald-100 text-emerald-700", icon: CheckCircle2 },
  Expired: { color: "bg-slate-100 text-slate-500", icon: XCircle },
  Rejected: { color: "bg-rose-100 text-rose-600", icon: XCircle },
  Countered: { color: "bg-amber-100 text-amber-700", icon: TrendingUp },
};

const buyerColors: Record<string, string> = {
  TM: "bg-indigo-500", AP: "bg-emerald-500", DW: "bg-violet-500",
  LC: "bg-amber-500", MR: "bg-rose-500", FH: "bg-teal-500", CM: "bg-orange-500",
};

export default function OffersPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [showModal, setShowModal] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null);

  const filtered = OFFERS.filter((o) => {
    const s = search.toLowerCase();
    const matchSearch = o.property.toLowerCase().includes(s) || o.buyer.toLowerCase().includes(s) || o.agent.toLowerCase().includes(s);
    const matchStatus = statusFilter === "All" || o.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const stats = [
    { label: "Total Offers", value: OFFERS.length, icon: FileText, color: "bg-indigo-50 text-indigo-600" },
    { label: "Active", value: OFFERS.filter(o => o.status === "Active").length, icon: Clock, color: "bg-amber-50 text-amber-600" },
    { label: "Accepted", value: OFFERS.filter(o => o.status === "Accepted").length, icon: CheckCircle2, color: "bg-emerald-50 text-emerald-600" },
    { label: "Total Value", value: "CA$4.27M", icon: DollarSign, color: "bg-violet-50 text-violet-600" },
  ];

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-6 py-5 bg-white border-b border-[#E8E6E0] flex items-center justify-between">
        <div>
          <h1 className="text-[20px] font-bold text-[#111] tracking-tight">Offers</h1>
          <p className="text-[13px] text-[#A8A49C] mt-0.5">Dashboard › Offers</p>
        </div>
        <button onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-[#111] hover:bg-[#222] text-white text-[13px] font-semibold px-4 py-2 rounded-xl transition-colors shadow-sm">
          <Plus size={15} /> New Offer
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-5">
        {/* Stats */}
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
          {stats.map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="bg-white rounded-xl border border-[#E8E6E0] p-4 flex items-center gap-3 shadow-sm">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}><Icon size={18} /></div>
              <div>
                <p className="text-[11px] text-[#A8A49C] font-medium uppercase tracking-wide">{label}</p>
                <p className="text-[20px] font-bold text-[#111] tracking-tight">{value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl border border-[#E8E6E0] p-4 flex flex-wrap items-center gap-3 shadow-sm">
          <div className="flex items-center gap-2 bg-[#F4F5F7] rounded-xl px-3 py-2 flex-1 min-w-[200px]">
            <Search size={14} className="text-[#A8A49C] shrink-0" />
            <input type="text" placeholder="Search property, buyer, agent..." value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-transparent text-[13px] text-[#111] placeholder-[#C5BFB5] outline-none w-full" />
          </div>
          <div className="flex items-center gap-1 bg-[#F4F5F7] rounded-xl p-1">
            {["All", "Active", "Accepted", "Countered", "Expired", "Rejected"].map((s) => (
              <button key={s} onClick={() => setStatusFilter(s)}
                className={`text-[11px] font-semibold px-3 py-1.5 rounded-lg transition-colors ${statusFilter === s ? "bg-white text-[#111] shadow-sm" : "text-[#7C7870] hover:text-[#111]"}`}>
                {s}
              </button>
            ))}
          </div>
          <button className="flex items-center gap-1.5 border border-[#E8E6E0] rounded-xl px-3 py-2 text-[12px] text-[#7C7870] hover:bg-[#F4F5F7]">
            <Filter size={13} /> Filters
          </button>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl border border-[#E8E6E0] shadow-sm overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#F0EDE6]">
                {["Property", "Buyer", "Offered Price", "Asking Price", "Closing Date", "Contingencies", "Status", "Agent", ""].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-[11px] font-bold text-[#A8A49C] uppercase tracking-wide whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F9F8F6]">
              {filtered.map((o) => {
                const { color, icon: StatusIcon } = statusConfig[o.status];
                return (
                  <tr key={o.id} className="hover:bg-[#FAFAF8] transition-colors group cursor-pointer" onClick={() => setSelectedOffer(o)}>
                    <td className="px-4 py-3">
                      <p className="text-[13px] font-semibold text-[#111]">{o.property}</p>
                      <p className="text-[11px] text-[#A8A49C]">{o.city}</p>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className={`w-7 h-7 rounded-full ${buyerColors[o.buyerInitials]} flex items-center justify-center text-white text-[10px] font-bold shrink-0`}>{o.buyerInitials}</div>
                        <span className="text-[13px] font-medium text-[#111]">{o.buyer}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-[13px] font-bold text-[#111]">{o.offeredPrice}</td>
                    <td className="px-4 py-3 text-[13px] text-[#7C7870]">{o.askingPrice}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5 text-[12px] text-[#7C7870]">
                        <Calendar size={12} className="text-[#C5BFB5]" /> {o.closingDate}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1 flex-wrap">
                        {o.contingencies.map((c) => (
                          <span key={c} className="text-[10px] bg-[#F4F5F7] text-[#7C7870] px-1.5 py-0.5 rounded-md font-medium">{c}</span>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`flex items-center gap-1 text-[11px] font-bold px-2 py-1 rounded-full w-fit ${color}`}>
                        <StatusIcon size={11} /> {o.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-[12px] text-[#7C7870]">{o.agent}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={(e) => { e.stopPropagation(); setSelectedOffer(o); }} className="w-7 h-7 rounded-lg flex items-center justify-center text-[#A8A49C] hover:bg-indigo-50 hover:text-indigo-600"><Eye size={13} /></button>
                        <button onClick={(e) => e.stopPropagation()} className="w-7 h-7 rounded-lg flex items-center justify-center text-[#A8A49C] hover:bg-amber-50 hover:text-amber-600"><Pencil size={13} /></button>
                        <button onClick={(e) => e.stopPropagation()} className="w-7 h-7 rounded-lg flex items-center justify-center text-[#A8A49C] hover:bg-rose-50 hover:text-rose-600"><Trash2 size={13} /></button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="text-center py-12 text-[#A8A49C]">
              <FileText size={32} className="mx-auto mb-2 opacity-40" />
              <p className="text-[14px] font-medium">No offers found</p>
            </div>
          )}
        </div>
      </div>

      {/* Offer detail modal */}
      {selectedOffer && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setSelectedOffer(null)}>
          <div className="bg-white rounded-2xl border border-[#E8E6E0] shadow-2xl w-full max-w-lg" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-5 border-b border-[#F0EDE6]">
              <div>
                <h2 className="text-[16px] font-bold text-[#111]">{selectedOffer.property}</h2>
                <p className="text-[12px] text-[#A8A49C]">{selectedOffer.city}</p>
              </div>
              <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${statusConfig[selectedOffer.status].color}`}>{selectedOffer.status}</span>
            </div>
            <div className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: "Buyer", value: selectedOffer.buyer },
                  { label: "Agent", value: selectedOffer.agent },
                  { label: "Offered Price", value: selectedOffer.offeredPrice },
                  { label: "Asking Price", value: selectedOffer.askingPrice },
                  { label: "Closing Date", value: selectedOffer.closingDate },
                  { label: "Submitted", value: selectedOffer.submittedDate },
                ].map(({ label, value }) => (
                  <div key={label}>
                    <p className="text-[10px] font-semibold text-[#A8A49C] uppercase tracking-wide mb-0.5">{label}</p>
                    <p className="text-[13px] font-semibold text-[#111]">{value}</p>
                  </div>
                ))}
              </div>
              <div>
                <p className="text-[10px] font-semibold text-[#A8A49C] uppercase tracking-wide mb-1">Contingencies</p>
                <div className="flex gap-1.5 flex-wrap">
                  {selectedOffer.contingencies.map((c) => (
                    <span key={c} className="text-[11px] bg-[#F4F5F7] text-[#7C7870] px-2.5 py-1 rounded-lg font-medium border border-[#E8E6E0]">{c}</span>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-[10px] font-semibold text-[#A8A49C] uppercase tracking-wide mb-1">Notes</p>
                <p className="text-[13px] text-[#7C7870] bg-[#FAFAF8] p-3 rounded-xl border border-[#F0EDE6]">{selectedOffer.notes}</p>
              </div>
              <div className="flex gap-2 pt-2">
                <button className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white text-[13px] font-semibold py-2.5 rounded-xl transition-colors">Accept Offer</button>
                <button className="flex-1 bg-amber-500 hover:bg-amber-600 text-white text-[13px] font-semibold py-2.5 rounded-xl transition-colors">Counter</button>
                <button className="flex-1 bg-[#F4F5F7] hover:bg-[#EDEAE3] text-[#7C7870] text-[13px] font-semibold py-2.5 rounded-xl transition-colors" onClick={() => setSelectedOffer(null)}>Close</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add offer modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-2xl border border-[#E8E6E0] shadow-2xl w-full max-w-md" onClick={(e) => e.stopPropagation()}>
            <div className="p-5 border-b border-[#F0EDE6]">
              <h2 className="text-[16px] font-bold text-[#111]">New Offer</h2>
              <p className="text-[12px] text-[#A8A49C] mt-0.5">Add a new offer to a property</p>
            </div>
            <div className="p-5 space-y-3">
              {[
                { label: "Property Address", placeholder: "e.g. 42 Maple Street" },
                { label: "Buyer Name", placeholder: "Full name" },
                { label: "Offered Price", placeholder: "CA$000,000" },
                { label: "Closing Date", placeholder: "MM/DD/YYYY" },
              ].map(({ label, placeholder }) => (
                <div key={label}>
                  <label className="block text-[11px] font-semibold text-[#7C7870] uppercase tracking-wide mb-1">{label}</label>
                  <input type="text" placeholder={placeholder}
                    className="w-full bg-[#F4F5F7] border border-[#E8E6E0] rounded-xl px-3 py-2.5 text-[13px] text-[#111] placeholder-[#C5BFB5] outline-none focus:border-indigo-400 transition-colors" />
                </div>
              ))}
              <div className="flex gap-2 pt-2">
                <button className="flex-1 bg-[#111] hover:bg-[#222] text-white text-[13px] font-semibold py-2.5 rounded-xl transition-colors">Submit Offer</button>
                <button className="flex-1 bg-[#F4F5F7] text-[#7C7870] text-[13px] font-semibold py-2.5 rounded-xl hover:bg-[#EDEAE3] transition-colors" onClick={() => setShowModal(false)}>Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}