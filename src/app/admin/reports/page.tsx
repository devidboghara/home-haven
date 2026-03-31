"use client";

import { useState } from "react";
import {
  TrendingUp, TrendingDown, DollarSign, Building2,
  Users, UserCheck, Download, ChevronDown, BarChart3,
  ArrowUpRight, ArrowDownRight,
} from "lucide-react";
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend,
} from "recharts";

const monthlyRevenue = [
  { month: "Jan", revenue: 185000, expenses: 112000, profit: 73000 },
  { month: "Feb", revenue: 210000, expenses: 125000, profit: 85000 },
  { month: "Mar", revenue: 195000, expenses: 108000, profit: 87000 },
  { month: "Apr", revenue: 245000, expenses: 138000, profit: 107000 },
  { month: "May", revenue: 228000, expenses: 132000, profit: 96000 },
  { month: "Jun", revenue: 267000, expenses: 148000, profit: 119000 },
  { month: "Jul", revenue: 251000, expenses: 142000, profit: 109000 },
  { month: "Aug", revenue: 289000, expenses: 155000, profit: 134000 },
  { month: "Sep", revenue: 312000, expenses: 168000, profit: 144000 },
  { month: "Oct", revenue: 295000, expenses: 162000, profit: 133000 },
  { month: "Nov", revenue: 334000, expenses: 178000, profit: 156000 },
  { month: "Dec", revenue: 358000, expenses: 191000, profit: 167000 },
];

const dealsByType = [
  { name: "Fix & Flip", value: 38, color: "#6366F1" },
  { name: "Rental", value: 32, color: "#8B5CF6" },
  { name: "Wholesale", value: 30, color: "#A78BFA" },
];

const agentPerformance = [
  { agent: "Sarah Kim", deals: 14, revenue: 2100000, rating: 4.9 },
  { agent: "Mike Roberts", deals: 11, revenue: 1700000, rating: 4.8 },
  { agent: "Priya Sharma", deals: 9, revenue: 1400000, rating: 4.7 },
  { agent: "James Liu", deals: 8, revenue: 1200000, rating: 4.6 },
  { agent: "Nina Torres", deals: 6, revenue: 980000, rating: 4.5 },
];

const leadSourceData = [
  { source: "Website", leads: 142, color: "#6366F1" },
  { source: "Referral", leads: 98, color: "#8B5CF6" },
  { source: "Social Media", leads: 76, color: "#10B981" },
  { source: "Cold Call", leads: 54, color: "#F59E0B" },
  { source: "Portal", leads: 89, color: "#F43F5E" },
];

const conversionFunnel = [
  { stage: "Leads", count: 459, pct: 100 },
  { stage: "Contacted", count: 312, pct: 68 },
  { stage: "Appointment", count: 187, pct: 41 },
  { stage: "Offer Made", count: 94, pct: 20 },
  { stage: "Closed", count: 48, pct: 10 },
];

const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: { name: string; value: number }[]; label?: string }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#111] text-white text-[12px] px-3 py-2.5 rounded-lg shadow-xl border border-white/10">
        <p className="text-[#aaa] font-medium mb-1">{label}</p>
        {payload.map((p) => (
          <p key={p.name} className="font-bold">
            {p.name}: <span className="text-indigo-300">${(p.value / 1000).toFixed(0)}k</span>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function ReportsPage() {
  const [period, setPeriod] = useState("This Year");

  const kpis = [
    { label: "Total Revenue", value: "$3.17M", change: "+24.8%", up: true, icon: DollarSign, color: "bg-indigo-50 text-indigo-600" },
    { label: "Total Deals", value: "48", change: "+12.4%", up: true, icon: Building2, color: "bg-emerald-50 text-emerald-600" },
    { label: "New Contacts", value: "459", change: "+31.2%", up: true, icon: Users, color: "bg-violet-50 text-violet-600" },
    { label: "Active Agents", value: "5", change: "-1", up: false, icon: UserCheck, color: "bg-amber-50 text-amber-600" },
  ];

  return (
    <div className="flex flex-col h-full">
      <div className="px-6 py-5 bg-white border-b border-[#E8E6E0] flex items-center justify-between">
        <div>
          <h1 className="text-[20px] font-bold text-[#111] tracking-tight">Reports</h1>
          <p className="text-[13px] text-[#A8A49C] mt-0.5">Dashboard › Reports</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 border border-[#E8E6E0] rounded-xl px-4 py-2 text-[13px] font-medium text-[#7C7870] hover:bg-[#F4F5F7] transition-colors"
            onClick={() => setPeriod(p => p === "This Year" ? "Last Year" : "This Year")}>
            {period} <ChevronDown size={13} />
          </button>
          <button className="flex items-center gap-2 bg-[#111] hover:bg-[#222] text-white text-[13px] font-semibold px-4 py-2 rounded-xl transition-colors shadow-sm">
            <Download size={15} /> Export PDF
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-5">
        {/* KPIs */}
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
          {kpis.map(({ label, value, change, up, icon: Icon, color }) => (
            <div key={label} className="bg-white rounded-xl border border-[#E8E6E0] p-4 shadow-sm">
              <div className="flex items-start justify-between mb-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}><Icon size={18} /></div>
                <span className={`flex items-center gap-0.5 text-[12px] font-bold ${up ? "text-emerald-600" : "text-rose-500"}`}>
                  {up ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />} {change}
                </span>
              </div>
              <p className="text-[22px] font-bold text-[#111] tracking-tight">{value}</p>
              <p className="text-[11px] text-[#A8A49C] font-medium mt-0.5">{label}</p>
            </div>
          ))}
        </div>

        {/* Revenue chart */}
        <div className="bg-white rounded-xl border border-[#E8E6E0] shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[15px] font-bold text-[#111]">Revenue vs Expenses vs Profit</h3>
            <div className="flex items-center gap-4 text-[11px] font-semibold">
              <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-indigo-500 inline-block" />Revenue</span>
              <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-rose-400 inline-block" />Expenses</span>
              <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-emerald-500 inline-block" />Profit</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={monthlyRevenue} margin={{ top: 4, right: 4, bottom: 0, left: -10 }}>
              <defs>
                {[["revenue", "#6366F1"], ["expenses", "#F43F5E"], ["profit", "#10B981"]].map(([k, c]) => (
                  <linearGradient key={k} id={`g-${k}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={c} stopOpacity={0.15} />
                    <stop offset="95%" stopColor={c} stopOpacity={0} />
                  </linearGradient>
                ))}
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#F0EDE6" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#A8A49C" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: "#A8A49C" }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="revenue" stroke="#6366F1" strokeWidth={2} fill="url(#g-revenue)" dot={false} name="Revenue" />
              <Area type="monotone" dataKey="expenses" stroke="#F43F5E" strokeWidth={2} fill="url(#g-expenses)" dot={false} name="Expenses" />
              <Area type="monotone" dataKey="profit" stroke="#10B981" strokeWidth={2} fill="url(#g-profit)" dot={false} name="Profit" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Row: Deal types + Lead sources */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          {/* Deal types pie */}
          <div className="bg-white rounded-xl border border-[#E8E6E0] shadow-sm p-5">
            <h3 className="text-[14px] font-bold text-[#111] mb-4">Deals by Type</h3>
            <div className="flex items-center gap-6">
              <PieChart width={140} height={140}>
                <Pie data={dealsByType} cx={65} cy={65} innerRadius={38} outerRadius={65} dataKey="value" strokeWidth={0}>
                  {dealsByType.map((e, i) => <Cell key={i} fill={e.color} />)}
                </Pie>
              </PieChart>
              <div className="flex-1 space-y-3">
                {dealsByType.map(({ name, value, color }) => (
                  <div key={name}>
                    <div className="flex justify-between text-[12px] mb-1">
                      <span className="flex items-center gap-1.5 font-medium text-[#7C7870]">
                        <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }} />{name}
                      </span>
                      <span className="font-bold text-[#111]">{value}%</span>
                    </div>
                    <div className="h-1.5 bg-[#F0EDE6] rounded-full overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: `${value}%`, backgroundColor: color }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Lead sources */}
          <div className="bg-white rounded-xl border border-[#E8E6E0] shadow-sm p-5">
            <h3 className="text-[14px] font-bold text-[#111] mb-4">Lead Sources</h3>
            <ResponsiveContainer width="100%" height={160}>
              <BarChart data={leadSourceData} barSize={24} margin={{ top: 0, right: 0, bottom: 0, left: -20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F0EDE6" vertical={false} />
                <XAxis dataKey="source" tick={{ fontSize: 10, fill: "#A8A49C" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: "#A8A49C" }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: "#111", border: "none", borderRadius: "10px", color: "#fff", fontSize: "12px" }} />
                <Bar dataKey="leads" radius={[4, 4, 0, 0]}>
                  {leadSourceData.map((e, i) => <Cell key={i} fill={e.color} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Row: Funnel + Agent performance */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          {/* Conversion funnel */}
          <div className="bg-white rounded-xl border border-[#E8E6E0] shadow-sm p-5">
            <h3 className="text-[14px] font-bold text-[#111] mb-4">Conversion Funnel</h3>
            <div className="space-y-2.5">
              {conversionFunnel.map(({ stage, count, pct }, i) => (
                <div key={stage}>
                  <div className="flex justify-between text-[12px] mb-1">
                    <span className="font-semibold text-[#7C7870]">{stage}</span>
                    <span className="font-bold text-[#111]">{count} <span className="text-[#A8A49C] font-normal">({pct}%)</span></span>
                  </div>
                  <div className="h-6 bg-[#F4F5F7] rounded-lg overflow-hidden">
                    <div className="h-full rounded-lg flex items-center justify-end pr-2 transition-all"
                      style={{ width: `${pct}%`, background: `rgba(99,102,241,${0.3 + i * 0.15})` }}>
                      {pct > 20 && <span className="text-[10px] font-bold text-indigo-700">{pct}%</span>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Agent performance */}
          <div className="bg-white rounded-xl border border-[#E8E6E0] shadow-sm p-5">
            <h3 className="text-[14px] font-bold text-[#111] mb-4">Agent Performance</h3>
            <div className="space-y-3">
              {agentPerformance.map((a, i) => (
                <div key={a.agent} className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-indigo-600 flex items-center justify-center text-white text-[10px] font-bold shrink-0">
                    {i + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between text-[12px] mb-1">
                      <span className="font-semibold text-[#111]">{a.agent}</span>
                      <span className="font-bold text-[#111]">{a.deals} deals</span>
                    </div>
                    <div className="h-1.5 bg-[#F0EDE6] rounded-full overflow-hidden">
                      <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${(a.deals / 14) * 100}%` }} />
                    </div>
                    <p className="text-[10px] text-[#A8A49C] mt-0.5">CA${(a.revenue / 1000000).toFixed(1)}M · ★ {a.rating}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}