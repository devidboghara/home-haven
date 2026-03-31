"use client";

import { useState } from "react";
import {
  Building2,
  UserCheck,
  Users,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight,
  DollarSign,
  Eye,
  Star,
  MapPin,
  ChevronDown,
} from "lucide-react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

// ── Mock Data ─────────────────────────────────────────────────────────────────

const salesData = [
  { month: "Jan", income: 16500, expenses: 11200 },
  { month: "Feb", income: 17800, expenses: 10500 },
  { month: "Mar", income: 21000, expenses: 12000 },
  { month: "Apr", income: 19500, expenses: 11800 },
  { month: "May", income: 23500, expenses: 13200 },
  { month: "Jun", income: 20800, expenses: 12400 },
  { month: "Jul", income: 22000, expenses: 14000 },
  { month: "Aug", income: 19200, expenses: 11500 },
  { month: "Sep", income: 24500, expenses: 13800 },
  { month: "Oct", income: 21800, expenses: 12200 },
  { month: "Nov", income: 23000, expenses: 13500 },
  { month: "Dec", income: 25000, expenses: 14200 },
];

const weeklyData = [
  { day: "Mon", sales: 4 },
  { day: "Tue", sales: 7 },
  { day: "Wed", sales: 5 },
  { day: "Thu", sales: 9 },
  { day: "Fri", sales: 6 },
  { day: "Sat", sales: 11 },
  { day: "Sun", sales: 3 },
];

const propertyTypeData = [
  { name: "Apartment", value: 42, color: "#6366F1" },
  { name: "Villa", value: 28, color: "#8B5CF6" },
  { name: "Commercial", value: 18, color: "#A78BFA" },
  { name: "Plot", value: 12, color: "#C4B5FD" },
];

const recentDeals = [
  {
    id: 1,
    address: "42 Maple Street, Toronto",
    type: "Fix & Flip",
    agent: "Sarah K.",
    price: "CA$480,000",
    status: "Closed",
    statusColor: "bg-emerald-100 text-emerald-700",
  },
  {
    id: 2,
    address: "18 Lakeview Drive, Vancouver",
    type: "Rental",
    agent: "Mike R.",
    price: "CA$2,200/mo",
    status: "Active",
    statusColor: "bg-indigo-100 text-indigo-700",
  },
  {
    id: 3,
    address: "7 Pine Avenue, Calgary",
    type: "Wholesale",
    agent: "Priya S.",
    price: "CA$310,000",
    status: "Pending",
    statusColor: "bg-amber-100 text-amber-700",
  },
  {
    id: 4,
    address: "93 Harbor Blvd, Montreal",
    type: "Fix & Flip",
    agent: "James L.",
    price: "CA$625,000",
    status: "Closed",
    statusColor: "bg-emerald-100 text-emerald-700",
  },
  {
    id: 5,
    address: "5 Birchwood Ct, Ottawa",
    type: "Rental",
    agent: "Nina T.",
    price: "CA$1,800/mo",
    status: "Due Diligence",
    statusColor: "bg-orange-100 text-orange-700",
  },
];

const topAgents = [
  { name: "Sarah Kim", deals: 14, revenue: "CA$2.1M", rating: 4.9, avatar: "SK" },
  { name: "Mike Roberts", deals: 11, revenue: "CA$1.7M", rating: 4.8, avatar: "MR" },
  { name: "Priya Sharma", deals: 9, revenue: "CA$1.4M", rating: 4.7, avatar: "PS" },
  { name: "James Liu", deals: 8, revenue: "CA$1.2M", rating: 4.6, avatar: "JL" },
];

// ── Sub-components ────────────────────────────────────────────────────────────

const CustomAreaTooltip = ({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: { value: number; name: string }[];
  label?: string;
}) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#1a1d23] text-white text-[12px] px-3 py-2.5 rounded-lg shadow-xl border border-white/10">
        <p className="font-semibold text-[#aaa] mb-1">{label}</p>
        {payload.map((p) => (
          <p key={p.name} className="font-bold">
            {p.name === "income" ? "Income" : "Expenses"}:{" "}
            <span className={p.name === "income" ? "text-indigo-400" : "text-rose-400"}>
              ${p.value.toLocaleString()}
            </span>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

// ── KPI Card ──────────────────────────────────────────────────────────────────

function KpiCard({
  label,
  value,
  change,
  positive,
  icon: Icon,
  iconBg,
  sparkData,
  sparkColor,
}: {
  label: string;
  value: string;
  change: string;
  positive: boolean;
  icon: React.ElementType;
  iconBg: string;
  sparkData: { v: number }[];
  sparkColor: string;
}) {
  return (
    <div className="bg-white rounded-xl p-5 border border-[#EAECF0] shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div>
          <p className="text-[11px] font-semibold text-[#9CA3AF] uppercase tracking-wide mb-1">
            {label}
          </p>
          <p className="text-[22px] font-bold text-[#111] tracking-tight">{value}</p>
        </div>
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${iconBg}`}>
          <Icon size={18} className="text-white" />
        </div>
      </div>
      <div className="flex items-center justify-between">
        <span
          className={`flex items-center gap-1 text-[12px] font-semibold ${
            positive ? "text-emerald-600" : "text-rose-500"
          }`}
        >
          {positive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
          {change}
        </span>
        {/* Sparkline */}
        <div className="w-20 h-8">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={sparkData} margin={{ top: 2, right: 0, bottom: 0, left: 0 }}>
              <defs>
                <linearGradient id={`sg-${sparkColor}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={sparkColor} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={sparkColor} stopOpacity={0} />
                </linearGradient>
              </defs>
              <Area
                type="monotone"
                dataKey="v"
                stroke={sparkColor}
                strokeWidth={1.5}
                fill={`url(#sg-${sparkColor})`}
                dot={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

// ── Page ───────────────────────────────────────────────────────────────────────

export default function AdminDashboardPage() {
  const [salesPeriod, setSalesPeriod] = useState("This Year");

  const spark1 = [2, 5, 4, 7, 6, 9, 8].map((v) => ({ v }));
  const spark2 = [3, 4, 6, 5, 8, 7, 9].map((v) => ({ v }));
  const spark3 = [5, 3, 6, 4, 7, 5, 8].map((v) => ({ v }));
  const spark4 = [4, 6, 5, 8, 7, 9, 8].map((v) => ({ v }));

  return (
    <div className="p-6 space-y-6 max-w-[1400px]">

      {/* ── Page header ── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[20px] font-bold text-[#111] tracking-tight">Analytics</h1>
          <p className="text-[13px] text-[#9CA3AF] mt-0.5">
            Dashboard &rsaquo; Analytics
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 bg-white border border-[#EAECF0] rounded-lg px-4 py-2 text-[13px] font-medium text-[#555] hover:bg-[#F9FAFB] transition-colors shadow-sm">
            <span>This Month</span>
            <ChevronDown size={13} />
          </button>
          <button className="bg-indigo-600 hover:bg-indigo-700 text-white text-[13px] font-semibold px-4 py-2 rounded-lg transition-colors shadow-sm">
            + Add Property
          </button>
        </div>
      </div>

      {/* ── KPI Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <KpiCard
          label="No. of Properties"
          value="2,854"
          change="+7.34% vs last month"
          positive={true}
          icon={Building2}
          iconBg="bg-indigo-600"
          sparkData={spark1}
          sparkColor="#6366F1"
        />
        <KpiCard
          label="Registered Agents"
          value="705"
          change="+76.89% vs last month"
          positive={true}
          icon={UserCheck}
          iconBg="bg-violet-500"
          sparkData={spark2}
          sparkColor="#8B5CF6"
        />
        <KpiCard
          label="Customers"
          value="9,431"
          change="+45.00% vs last month"
          positive={true}
          icon={Users}
          iconBg="bg-emerald-500"
          sparkData={spark3}
          sparkColor="#10B981"
        />
        <KpiCard
          label="Revenue"
          value="$78.3M"
          change="+8.76% vs last month"
          positive={true}
          icon={DollarSign}
          iconBg="bg-amber-500"
          sparkData={spark4}
          sparkColor="#F59E0B"
        />
      </div>

      {/* ── Main charts row ── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">

        {/* Sales Analytics (wide) */}
        <div className="xl:col-span-2 bg-white rounded-xl border border-[#EAECF0] shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-[15px] font-bold text-[#111]">Sales Analytics</h2>
              <p className="text-[12px] text-[#9CA3AF] mt-0.5">
                Earnings:{" "}
                <span className="font-semibold text-indigo-600">$85,934</span>
              </p>
            </div>
            <button
              className="flex items-center gap-2 border border-[#EAECF0] rounded-lg px-3 py-1.5 text-[12px] font-medium text-[#555] hover:bg-[#F9FAFB] transition-colors"
              onClick={() =>
                setSalesPeriod((p) =>
                  p === "This Year" ? "Last Year" : "This Year"
                )
              }
            >
              {salesPeriod}
              <ChevronDown size={12} />
            </button>
          </div>

          <ResponsiveContainer width="100%" height={220}>
            <AreaChart
              data={salesData}
              margin={{ top: 4, right: 4, bottom: 0, left: -20 }}
            >
              <defs>
                <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366F1" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#6366F1" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
              <XAxis
                dataKey="month"
                tick={{ fontSize: 11, fill: "#9CA3AF" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 11, fill: "#9CA3AF" }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
              />
              <Tooltip content={<CustomAreaTooltip />} />
              <Area
                type="monotone"
                dataKey="income"
                stroke="#6366F1"
                strokeWidth={2.5}
                fill="url(#colorIncome)"
                dot={false}
                activeDot={{ r: 4, fill: "#6366F1" }}
              />
              <Area
                type="monotone"
                dataKey="expenses"
                stroke="#10B981"
                strokeWidth={2.5}
                fill="url(#colorExpenses)"
                dot={false}
                activeDot={{ r: 4, fill: "#10B981" }}
              />
            </AreaChart>
          </ResponsiveContainer>

          {/* Summary row */}
          <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-[#F3F4F6]">
            {[
              { label: "Income", value: "23,675.00", change: "+0.06%", up: true },
              { label: "Expenses", value: "11,562.00", change: "+5.38%", up: false },
              { label: "Balance", value: "67,365.00", change: "+2.69%", up: true },
            ].map(({ label, value, change, up }) => (
              <div key={label}>
                <p className="text-[11px] text-[#9CA3AF] font-medium">{label}</p>
                <p className="text-[15px] font-bold text-[#111] mt-0.5">{value}</p>
                <span
                  className={`text-[11px] font-semibold flex items-center gap-0.5 mt-0.5 ${
                    up ? "text-emerald-600" : "text-rose-500"
                  }`}
                >
                  {up ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
                  {change}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Balance card */}
        <div className="flex flex-col gap-4">
          <div className="bg-indigo-600 rounded-xl p-5 text-white relative overflow-hidden flex-1">
            {/* Background decoration */}
            <div className="absolute -right-6 -top-6 w-28 h-28 rounded-full bg-white/10" />
            <div className="absolute -right-2 top-8 w-16 h-16 rounded-full bg-white/5" />

            <p className="text-[12px] font-medium text-indigo-200 mb-1">My Balance</p>
            <p className="text-[28px] font-bold tracking-tight">$117,000.43</p>

            <div className="flex gap-3 mt-4">
              <div className="flex-1 bg-white/10 rounded-lg px-3 py-2">
                <div className="flex items-center gap-1.5 mb-1">
                  <div className="w-5 h-5 rounded-full bg-emerald-400/30 flex items-center justify-center">
                    <ArrowUpRight size={11} className="text-emerald-300" />
                  </div>
                  <span className="text-[10px] text-indigo-200">Income</span>
                </div>
                <p className="text-[14px] font-bold">$13,321.12</p>
              </div>
              <div className="flex-1 bg-white/10 rounded-lg px-3 py-2">
                <div className="flex items-center gap-1.5 mb-1">
                  <div className="w-5 h-5 rounded-full bg-rose-400/30 flex items-center justify-center">
                    <ArrowDownRight size={11} className="text-rose-300" />
                  </div>
                  <span className="text-[10px] text-indigo-200">Expense</span>
                </div>
                <p className="text-[14px] font-bold">$7,566.11</p>
              </div>
            </div>

            <div className="flex gap-2 mt-4">
              <button className="flex-1 bg-amber-400 hover:bg-amber-300 text-[#111] text-[12px] font-bold py-2 rounded-lg transition-colors">
                Send
              </button>
              <button className="flex-1 bg-white/15 hover:bg-white/25 text-white text-[12px] font-bold py-2 rounded-lg transition-colors">
                Receive
              </button>
            </div>
          </div>

          {/* Property type pie */}
          <div className="bg-white rounded-xl border border-[#EAECF0] shadow-sm p-5">
            <h3 className="text-[13px] font-bold text-[#111] mb-3">Property Types</h3>
            <div className="flex items-center gap-3">
              <PieChart width={80} height={80}>
                <Pie
                  data={propertyTypeData}
                  cx={35}
                  cy={35}
                  innerRadius={22}
                  outerRadius={38}
                  dataKey="value"
                  strokeWidth={0}
                >
                  {propertyTypeData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
              <div className="flex-1 space-y-1.5">
                {propertyTypeData.map(({ name, value, color }) => (
                  <div key={name} className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <div
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: color }}
                      />
                      <span className="text-[11px] text-[#666]">{name}</span>
                    </div>
                    <span className="text-[11px] font-bold text-[#111]">{value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Bottom row ── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">

        {/* Recent Deals */}
        <div className="xl:col-span-2 bg-white rounded-xl border border-[#EAECF0] shadow-sm">
          <div className="flex items-center justify-between px-5 py-4 border-b border-[#F3F4F6]">
            <h2 className="text-[15px] font-bold text-[#111]">Recent Deals</h2>
            <button className="text-[12px] font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1">
              View All <Eye size={12} />
            </button>
          </div>
          <div className="divide-y divide-[#F9FAFB]">
            {recentDeals.map((deal) => (
              <div
                key={deal.id}
                className="flex items-center gap-4 px-5 py-3 hover:bg-[#FAFAFA] transition-colors"
              >
                <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center shrink-0">
                  <MapPin size={14} className="text-indigo-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-semibold text-[#111] truncate">
                    {deal.address}
                  </p>
                  <p className="text-[11px] text-[#9CA3AF]">
                    {deal.type} &middot; {deal.agent}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-[13px] font-bold text-[#111]">{deal.price}</p>
                  <span
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${deal.statusColor}`}
                  >
                    {deal.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right column */}
        <div className="flex flex-col gap-4">

          {/* Weekly sales bar */}
          <div className="bg-white rounded-xl border border-[#EAECF0] shadow-sm p-5">
            <h3 className="text-[13px] font-bold text-[#111] mb-3">Weekly Sales</h3>
            <ResponsiveContainer width="100%" height={100}>
              <BarChart
                data={weeklyData}
                barSize={18}
                margin={{ top: 0, right: 0, bottom: 0, left: -30 }}
              >
                <CartesianGrid vertical={false} stroke="#F3F4F6" />
                <XAxis
                  dataKey="day"
                  tick={{ fontSize: 10, fill: "#9CA3AF" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 10, fill: "#9CA3AF" }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{
                    background: "#1a1d23",
                    border: "none",
                    borderRadius: "8px",
                    color: "#fff",
                    fontSize: "12px",
                  }}
                  cursor={{ fill: "#F9FAFB" }}
                />
                <Bar dataKey="sales" fill="#6366F1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Top Agents */}
          <div className="bg-white rounded-xl border border-[#EAECF0] shadow-sm p-5 flex-1">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-[13px] font-bold text-[#111]">Top Agents</h3>
              <button className="text-[11px] font-semibold text-indigo-600">
                View All
              </button>
            </div>
            <div className="space-y-3">
              {topAgents.map((agent, i) => (
                <div key={agent.name} className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-full bg-indigo-600 flex items-center justify-center text-white text-[10px] font-bold shrink-0">
                    {agent.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[12px] font-semibold text-[#111] truncate">
                      {agent.name}
                    </p>
                    <p className="text-[10px] text-[#9CA3AF]">
                      {agent.deals} deals · {agent.revenue}
                    </p>
                  </div>
                  <div className="flex items-center gap-0.5 text-amber-400 shrink-0">
                    <Star size={10} fill="#F59E0B" />
                    <span className="text-[11px] font-bold text-[#111]">
                      {agent.rating}
                    </span>
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