"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft, MapPin, Bed, Bath, Maximize2, Calendar, Zap,
  Phone, Mail, MessageSquare, Star, TrendingUp, Wrench,
  BarChart3, FileText, ChevronRight, Plus, CheckCircle2,
  Circle, DollarSign, Home, Thermometer, Car, Building2,
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, LineChart, Line,
} from "recharts";

type Tab = "overview" | "details" | "comps" | "repairs" | "analyzer";

const revenueData = [
  { name: "Purchase", value: 480000 },
  { name: "Rehab", value: 65000 },
  { name: "Selling Cost", value: 38000 },
  { name: "ARV", value: 680000 },
];

const roiData = [
  { month: "M1", value: 0 },
  { month: "M2", value: 12000 },
  { month: "M3", value: 28000 },
  { month: "M4", value: 51000 },
  { month: "M5", value: 78000 },
  { month: "M6", value: 97000 },
];

const repairItems = [
  { category: "Roofing", items: ["Replace shingles", "Fix flashing"], cost: 8500, done: false },
  { category: "Painting", items: ["Interior repaint", "Exterior touch-up"], cost: 4200, done: true },
  { category: "Plumbing", items: ["Replace water heater", "Fix kitchen sink"], cost: 3800, done: false },
  { category: "Electrical", items: ["Panel upgrade", "Rewire basement"], cost: 6200, done: false },
  { category: "Flooring", items: ["Hardwood refinish", "Bathroom tile"], cost: 7100, done: true },
  { category: "Kitchen", items: ["Cabinet refacing", "Countertop replace"], cost: 12400, done: false },
  { category: "HVAC", items: ["Furnace replace"], cost: 5800, done: false },
  { category: "Windows", items: ["Replace 6 windows"], cost: 9600, done: false },
];

const comps = [
  { address: "38 Maple Street", city: "Toronto, ON", beds: 3, baths: 2, sqft: 1820, salePrice: "CA$510,000", daysAgo: 12, distance: "0.2 mi" },
  { address: "55 Oak Drive", city: "Toronto, ON", beds: 3, baths: 2, sqft: 1900, salePrice: "CA$495,000", daysAgo: 28, distance: "0.4 mi" },
  { address: "12 Cedar Lane", city: "Toronto, ON", beds: 4, baths: 2, sqft: 2100, salePrice: "CA$560,000", daysAgo: 45, distance: "0.6 mi" },
  { address: "78 Pine Blvd", city: "Toronto, ON", beds: 3, baths: 3, sqft: 1950, salePrice: "CA$525,000", daysAgo: 60, distance: "0.8 mi" },
];

const activityLog = [
  { type: "email", text: "Follow-up email sent to seller", time: "2h ago", icon: Mail, color: "bg-indigo-100 text-indigo-600" },
  { type: "call", text: "Call with owner — 18 min", time: "Yesterday", icon: Phone, color: "bg-emerald-100 text-emerald-600" },
  { type: "note", text: "CRM note added: Motivated seller", time: "2 days ago", icon: FileText, color: "bg-amber-100 text-amber-600" },
  { type: "email", text: "Intro email opened (2x)", time: "3 days ago", icon: Mail, color: "bg-indigo-100 text-indigo-600" },
];

export default function PropertyDetailPage() {
  const [tab, setTab] = useState<Tab>("overview");
  const [analyzerMode, setAnalyzerMode] = useState<"wholesale" | "flip" | "rental">("flip");

  const tabs: { id: Tab; label: string }[] = [
    { id: "overview", label: "Overview" },
    { id: "details", label: "Property Details" },
    { id: "comps", label: "Comps" },
    { id: "repairs", label: "Repair List" },
    { id: "analyzer", label: "Analyzer" },
  ];

  const totalRepairCost = repairItems.reduce((s, r) => s + r.cost, 0);
  const doneRepairCost = repairItems.filter(r => r.done).reduce((s, r) => s + r.cost, 0);

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-6 py-4 bg-white border-b border-[#E8E6E0] flex items-center gap-4">
        <Link href="/admin/properties" className="p-2 rounded-xl text-[#7C7870] hover:bg-[#F4F5F7] transition-colors">
          <ArrowLeft size={18} />
        </Link>
        <div className="flex-1">
          <h1 className="text-[18px] font-bold text-[#111] tracking-tight">42 Maple Street</h1>
          <div className="flex items-center gap-1.5 text-[12px] text-[#A8A49C]">
            <MapPin size={11} /> Toronto, ON
            <ChevronRight size={11} />
            <span className="text-amber-600 font-semibold">Fix & Flip</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="bg-emerald-100 text-emerald-700 text-[11px] font-bold px-3 py-1 rounded-full">Available</span>
          <button className="flex items-center gap-1.5 bg-[#111] text-white text-[13px] font-semibold px-4 py-2 rounded-xl hover:bg-[#222] transition-colors">
            <Plus size={14} /> Add Offer
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="flex gap-0 h-full">
          {/* Main content */}
          <div className="flex-1 min-w-0 p-6 space-y-5">
            {/* Property image + quick stats */}
            <div className="bg-white rounded-xl border border-[#E8E6E0] shadow-sm overflow-hidden">
              <div className="relative h-52">
                <img src="https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=1200&q=80"
                  alt="Property" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#111]/60 to-transparent" />
                <div className="absolute bottom-4 left-4 text-white">
                  <p className="text-[24px] font-bold tracking-tight">CA$480,000</p>
                  <p className="text-[13px] text-white/80">Listed Mar 12, 2026 · Year Built: 1998</p>
                </div>
              </div>
              <div className="grid grid-cols-4 divide-x divide-[#F0EDE6] border-t border-[#E8E6E0]">
                {[
                  { icon: Bed, label: "Bedrooms", value: "3" },
                  { icon: Bath, label: "Bathrooms", value: "2" },
                  { icon: Maximize2, label: "Square Feet", value: "1,850" },
                  { icon: TrendingUp, label: "Est. ROI", value: "18.4%" },
                ].map(({ icon: Icon, label, value }) => (
                  <div key={label} className="flex flex-col items-center py-3 gap-1">
                    <Icon size={15} className="text-indigo-400" />
                    <p className="text-[18px] font-bold text-[#111]">{value}</p>
                    <p className="text-[10px] text-[#A8A49C] font-medium uppercase tracking-wide">{label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Tabs */}
            <div className="flex items-center gap-1 bg-white rounded-xl border border-[#E8E6E0] p-1 shadow-sm">
              {tabs.map((t) => (
                <button key={t.id} onClick={() => setTab(t.id)}
                  className={`flex-1 text-[12px] font-semibold py-2 px-3 rounded-lg transition-colors ${tab === t.id ? "bg-[#111] text-white shadow-sm" : "text-[#7C7870] hover:text-[#111] hover:bg-[#F4F5F7]"}`}>
                  {t.label}
                </button>
              ))}
            </div>

            {/* Tab content */}
            {tab === "overview" && (
              <div className="space-y-4">
                <div className="bg-white rounded-xl border border-[#E8E6E0] shadow-sm p-5">
                  <h3 className="text-[14px] font-bold text-[#111] mb-4">Revenue Projection</h3>
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={revenueData} margin={{ top: 0, right: 0, bottom: 0, left: -10 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#F0EDE6" vertical={false} />
                      <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#A8A49C" }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 10, fill: "#A8A49C" }} axisLine={false} tickLine={false}
                        tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
                      <Tooltip formatter={(value) => {
                        const numberValue = typeof value === "number" ? value : typeof value === "string" ? Number(value) : NaN;
                        return Number.isNaN(numberValue) ? ["", ""] : [`CA$${numberValue.toLocaleString()}`, ""];
                      }}
                        contentStyle={{ background: "#111", border: "none", borderRadius: "10px", color: "#fff", fontSize: "12px" }} />
                      <Bar dataKey="value" radius={[6, 6, 0, 0]}
                        fill="#6366F1" />
                    </BarChart>
                  </ResponsiveContainer>
                  <div className="grid grid-cols-4 gap-3 mt-4 pt-4 border-t border-[#F0EDE6]">
                    {[
                      { label: "Purchase Price", value: "CA$480,000", color: "text-indigo-600" },
                      { label: "Rehab Cost", value: "CA$65,000", color: "text-amber-600" },
                      { label: "Selling Cost", value: "CA$38,000", color: "text-rose-500" },
                      { label: "ARV", value: "CA$680,000", color: "text-emerald-600" },
                    ].map(({ label, value, color }) => (
                      <div key={label} className="text-center">
                        <p className="text-[11px] text-[#A8A49C] font-medium">{label}</p>
                        <p className={`text-[14px] font-bold mt-0.5 ${color}`}>{value}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="bg-white rounded-xl border border-[#E8E6E0] shadow-sm p-5">
                  <h3 className="text-[14px] font-bold text-[#111] mb-4">Projected Profit Over Time</h3>
                  <ResponsiveContainer width="100%" height={150}>
                    <LineChart data={roiData} margin={{ top: 0, right: 0, bottom: 0, left: -20 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#F0EDE6" vertical={false} />
                      <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#A8A49C" }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 10, fill: "#A8A49C" }} axisLine={false} tickLine={false}
                        tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
                      <Tooltip formatter={(value) => {
                        const numberValue = typeof value === "number" ? value : typeof value === "string" ? Number(value) : NaN;
                        return Number.isNaN(numberValue) ? ["", ""] : [`CA$${numberValue.toLocaleString()}`, "Profit"];
                      }}
                        contentStyle={{ background: "#111", border: "none", borderRadius: "10px", color: "#fff", fontSize: "12px" }} />
                      <Line type="monotone" dataKey="value" stroke="#10B981" strokeWidth={2.5} dot={false} activeDot={{ r: 4 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}

            {tab === "details" && (
              <div className="bg-white rounded-xl border border-[#E8E6E0] shadow-sm p-5">
                <h3 className="text-[14px] font-bold text-[#111] mb-4">Property Specifications</h3>
                <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                  {[
                    { icon: Calendar, label: "Year Built", value: "1998" },
                    { icon: Maximize2, label: "Square Footage", value: "1,850 ft²" },
                    { icon: Home, label: "Lot Size", value: "0.24 acres" },
                    { icon: Car, label: "Parking", value: "2-car garage" },
                    { icon: Thermometer, label: "Heating", value: "Forced Air / Gas" },
                    { icon: Zap, label: "Cooling", value: "Central A/C" },
                    { icon: Building2, label: "Property Type", value: "Single Family" },
                    { icon: DollarSign, label: "Property Tax", value: "CA$4,200/yr" },
                    { icon: Star, label: "Condition", value: "Fair — Needs Rehab" },
                    { icon: MapPin, label: "Zoning", value: "Residential (R1)" },
                  ].map(({ icon: Icon, label, value }) => (
                    <div key={label} className="flex items-center gap-3 py-3 border-b border-[#F9F8F6]">
                      <div className="w-8 h-8 rounded-lg bg-[#F4F5F7] flex items-center justify-center shrink-0">
                        <Icon size={14} className="text-[#7C7870]" />
                      </div>
                      <div>
                        <p className="text-[11px] text-[#A8A49C] font-medium">{label}</p>
                        <p className="text-[13px] font-semibold text-[#111]">{value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {tab === "comps" && (
              <div className="space-y-4">
                <div className="bg-white rounded-xl border border-[#E8E6E0] shadow-sm p-5">
                  <h3 className="text-[14px] font-bold text-[#111] mb-1">Comparable Sales</h3>
                  <p className="text-[12px] text-[#A8A49C] mb-4">Recently sold properties near 42 Maple Street</p>
                  <div className="space-y-3">
                    {comps.map((c, i) => (
                      <div key={i} className="flex items-center gap-4 p-3 rounded-xl bg-[#FAFAF8] border border-[#F0EDE6] hover:border-indigo-200 transition-colors">
                        <div className="w-8 h-8 rounded-xl bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-[12px] shrink-0">{i + 1}</div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[13px] font-semibold text-[#111]">{c.address}</p>
                          <div className="flex items-center gap-3 text-[11px] text-[#A8A49C] mt-0.5">
                            <span className="flex items-center gap-1"><Bed size={10} />{c.beds}bd</span>
                            <span className="flex items-center gap-1"><Bath size={10} />{c.baths}ba</span>
                            <span>{c.sqft.toLocaleString()} ft²</span>
                            <span>{c.distance}</span>
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="text-[14px] font-bold text-[#111]">{c.salePrice}</p>
                          <p className="text-[11px] text-[#A8A49C]">{c.daysAgo} days ago</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 p-3 rounded-xl bg-indigo-50 border border-indigo-100">
                    <p className="text-[12px] font-semibold text-indigo-700">Suggested ARV based on comps: <span className="text-[14px]">CA$522,500</span></p>
                  </div>
                </div>
              </div>
            )}

            {tab === "repairs" && (
              <div className="bg-white rounded-xl border border-[#E8E6E0] shadow-sm p-5">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-[14px] font-bold text-[#111]">Repair Checklist</h3>
                    <p className="text-[12px] text-[#A8A49C] mt-0.5">
                      Total: <span className="font-bold text-[#111]">CA${totalRepairCost.toLocaleString()}</span>
                      {" "}· Done: <span className="font-bold text-emerald-600">CA${doneRepairCost.toLocaleString()}</span>
                    </p>
                  </div>
                  <button className="flex items-center gap-1.5 text-[12px] font-semibold text-indigo-600 hover:text-indigo-700">
                    <Plus size={13} /> Add Item
                  </button>
                </div>
                {/* Progress */}
                <div className="mb-4">
                  <div className="flex justify-between text-[11px] text-[#A8A49C] mb-1">
                    <span>Progress</span>
                    <span>{Math.round((doneRepairCost / totalRepairCost) * 100)}% complete</span>
                  </div>
                  <div className="h-2 bg-[#F0EDE6] rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 rounded-full transition-all"
                      style={{ width: `${(doneRepairCost / totalRepairCost) * 100}%` }} />
                  </div>
                </div>
                <div className="space-y-2">
                  {repairItems.map((r) => (
                    <div key={r.category} className={`flex items-center gap-3 p-3 rounded-xl border transition-colors ${r.done ? "bg-emerald-50 border-emerald-100" : "bg-[#FAFAF8] border-[#F0EDE6]"}`}>
                      {r.done
                        ? <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />
                        : <Circle size={16} className="text-[#C5BFB5] shrink-0" />}
                      <div className="flex-1 min-w-0">
                        <p className={`text-[13px] font-semibold ${r.done ? "text-emerald-700 line-through" : "text-[#111]"}`}>{r.category}</p>
                        <p className="text-[11px] text-[#A8A49C]">{r.items.join(" · ")}</p>
                      </div>
                      <span className={`text-[12px] font-bold shrink-0 ${r.done ? "text-emerald-600" : "text-[#111]"}`}>
                        CA${r.cost.toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {tab === "analyzer" && (
              <div className="space-y-4">
                <div className="flex items-center gap-1 bg-white rounded-xl border border-[#E8E6E0] p-1 shadow-sm">
                  {(["wholesale", "flip", "rental"] as const).map((m) => (
                    <button key={m} onClick={() => setAnalyzerMode(m)}
                      className={`flex-1 text-[12px] font-semibold py-2 px-3 rounded-lg transition-colors capitalize ${analyzerMode === m ? "bg-[#111] text-white shadow-sm" : "text-[#7C7870] hover:text-[#111]"}`}>
                      {m === "flip" ? "Fix & Flip" : m.charAt(0).toUpperCase() + m.slice(1)}
                    </button>
                  ))}
                </div>

                <div className="grid grid-cols-3 gap-4">
                  {analyzerMode === "flip" && [
                    { label: "Net Profit", value: "CA$97,000", color: "text-emerald-600", bg: "bg-emerald-50 border-emerald-100" },
                    { label: "ROI", value: "18.4%", color: "text-indigo-600", bg: "bg-indigo-50 border-indigo-100" },
                    { label: "Cash-on-Cash", value: "22.1%", color: "text-violet-600", bg: "bg-violet-50 border-violet-100" },
                  ].map(({ label, value, color, bg }) => (
                    <div key={label} className={`rounded-xl border p-4 ${bg}`}>
                      <p className="text-[11px] font-medium text-[#A8A49C] uppercase tracking-wide mb-1">{label}</p>
                      <p className={`text-[24px] font-bold tracking-tight ${color}`}>{value}</p>
                    </div>
                  ))}
                  {analyzerMode === "wholesale" && [
                    { label: "Assignment Fee", value: "CA$28,000", color: "text-emerald-600", bg: "bg-emerald-50 border-emerald-100" },
                    { label: "Max Allowable Offer", value: "CA$354,000", color: "text-indigo-600", bg: "bg-indigo-50 border-indigo-100" },
                    { label: "Spread", value: "CA$42,000", color: "text-violet-600", bg: "bg-violet-50 border-violet-100" },
                  ].map(({ label, value, color, bg }) => (
                    <div key={label} className={`rounded-xl border p-4 ${bg}`}>
                      <p className="text-[11px] font-medium text-[#A8A49C] uppercase tracking-wide mb-1">{label}</p>
                      <p className={`text-[24px] font-bold tracking-tight ${color}`}>{value}</p>
                    </div>
                  ))}
                  {analyzerMode === "rental" && [
                    { label: "Monthly NOI", value: "CA$1,840", color: "text-emerald-600", bg: "bg-emerald-50 border-emerald-100" },
                    { label: "Cap Rate", value: "4.6%", color: "text-indigo-600", bg: "bg-indigo-50 border-indigo-100" },
                    { label: "Cash-on-Cash", value: "6.2%", color: "text-violet-600", bg: "bg-violet-50 border-violet-100" },
                  ].map(({ label, value, color, bg }) => (
                    <div key={label} className={`rounded-xl border p-4 ${bg}`}>
                      <p className="text-[11px] font-medium text-[#A8A49C] uppercase tracking-wide mb-1">{label}</p>
                      <p className={`text-[24px] font-bold tracking-tight ${color}`}>{value}</p>
                    </div>
                  ))}
                </div>

                <div className="bg-white rounded-xl border border-[#E8E6E0] shadow-sm p-5">
                  <h3 className="text-[14px] font-bold text-[#111] mb-4">Deal Breakdown</h3>
                  <div className="space-y-3">
                    {[
                      { label: "Purchase Price", value: "CA$480,000" },
                      { label: "Estimated Rehab", value: "CA$65,000" },
                      { label: "Closing Costs (buy)", value: "CA$9,600" },
                      { label: "Holding Costs (6mo)", value: "CA$14,400" },
                      { label: "Selling Costs", value: "CA$38,000" },
                      { label: "ARV", value: "CA$680,000", highlight: true },
                      { label: "Net Profit", value: "CA$73,000", highlight: true, green: true },
                    ].map(({ label, value, highlight, green }) => (
                      <div key={label} className={`flex items-center justify-between py-2 border-b border-[#F9F8F6] ${highlight ? "font-bold" : ""}`}>
                        <span className={`text-[13px] ${highlight ? "text-[#111]" : "text-[#7C7870]"}`}>{label}</span>
                        <span className={`text-[13px] font-bold ${green ? "text-emerald-600" : highlight ? "text-[#111]" : "text-[#7C7870]"}`}>{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right sidebar — contact + activity */}
          <div className="w-[280px] min-w-[280px] border-l border-[#E8E6E0] bg-white p-4 space-y-4 overflow-y-auto">
            {/* Lead info */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-[13px] font-bold text-[#111]">Lead Contact</h3>
                <span className="bg-amber-100 text-amber-700 text-[10px] font-bold px-2 py-0.5 rounded-full">Warm</span>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-[#FAFAF8] border border-[#F0EDE6]">
                  <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-white text-[11px] font-bold shrink-0">JD</div>
                  <div>
                    <p className="text-[12px] font-bold text-[#111]">John Davidson</p>
                    <p className="text-[10px] text-[#A8A49C]">Property Owner</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  {[
                    { icon: Phone, label: "Call", color: "hover:bg-emerald-50 hover:text-emerald-600 hover:border-emerald-200" },
                    { icon: Mail, label: "Email", color: "hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200" },
                    { icon: MessageSquare, label: "SMS", color: "hover:bg-violet-50 hover:text-violet-600 hover:border-violet-200" },
                  ].map(({ icon: Icon, label, color }) => (
                    <button key={label} className={`flex-1 flex flex-col items-center gap-1 py-2 rounded-xl border border-[#E8E6E0] text-[#7C7870] transition-colors ${color}`}>
                      <Icon size={14} />
                      <span className="text-[10px] font-medium">{label}</span>
                    </button>
                  ))}
                </div>
                <div className="space-y-2 pt-1">
                  {[
                    { label: "Phone", value: "+1 (416) 555-0182" },
                    { label: "Email", value: "jdavidson@mail.com" },
                    { label: "Preferred", value: "Email" },
                  ].map(({ label, value }) => (
                    <div key={label} className="flex justify-between">
                      <span className="text-[11px] text-[#A8A49C]">{label}</span>
                      <span className="text-[11px] font-semibold text-[#111]">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="border-t border-[#F0EDE6]" />

            {/* Assigned agent */}
            <div>
              <h3 className="text-[13px] font-bold text-[#111] mb-3">Assigned Agent</h3>
              <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-[#FAFAF8] border border-[#F0EDE6]">
                <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-white text-[11px] font-bold shrink-0">SK</div>
                <div className="flex-1">
                  <p className="text-[12px] font-bold text-[#111]">Sarah Kim</p>
                  <div className="flex items-center gap-0.5">
                    {[1,2,3,4,5].map(i => <Star key={i} size={9} fill="#F59E0B" className="text-amber-400" />)}
                    <span className="text-[10px] text-[#A8A49C] ml-1">4.9</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-[#F0EDE6]" />

            {/* Activity log */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-[13px] font-bold text-[#111]">Activity</h3>
                <button className="text-[11px] font-semibold text-indigo-600">+ Log</button>
              </div>
              <div className="space-y-2.5">
                {activityLog.map((a, i) => (
                  <div key={i} className="flex items-start gap-2.5">
                    <div className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${a.color}`}>
                      <a.icon size={11} />
                    </div>
                    <div>
                      <p className="text-[12px] text-[#111] font-medium leading-tight">{a.text}</p>
                      <p className="text-[10px] text-[#A8A49C] mt-0.5">{a.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t border-[#F0EDE6]" />

            {/* Offers */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-[13px] font-bold text-[#111]">Offers (2)</h3>
                <button className="text-[11px] font-semibold text-indigo-600">View All</button>
              </div>
              <div className="space-y-2">
                {[
                  { buyer: "T. Morrison", price: "CA$465,000", date: "Mar 25", status: "Active" },
                  { buyer: "R. Patel", price: "CA$455,000", date: "Mar 22", status: "Expired" },
                ].map((o, i) => (
                  <div key={i} className="p-2.5 rounded-xl bg-[#FAFAF8] border border-[#F0EDE6]">
                    <div className="flex justify-between">
                      <span className="text-[12px] font-semibold text-[#111]">{o.buyer}</span>
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${o.status === "Active" ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-500"}`}>{o.status}</span>
                    </div>
                    <div className="flex justify-between mt-1">
                      <span className="text-[13px] font-bold text-[#111]">{o.price}</span>
                      <span className="text-[10px] text-[#A8A49C]">{o.date}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}