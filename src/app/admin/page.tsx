"use client";

import { useState } from "react";
import {
  CheckSquare,
  Building,
  Tag,
  ChevronDown,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

// ── Mock Data ─────────────────────────────────────────────────────────────────

const leadsData = [
  { day: "1 May", leads: 45 },
  { day: "2 May", leads: 72 },
  { day: "3 May", leads: 58 },
  { day: "4 May", leads: 88 },
  { day: "5 May", leads: 65 },
  { day: "6 May", leads: 91 },
  { day: "7 May", leads: 78 },
  { day: "8 May", leads: 55 },
  { day: "9 May", leads: 84 },
  { day: "10 May", leads: 69 },
  { day: "11 May", leads: 95 },
  { day: "12 May", leads: 73 },
  { day: "13 May", leads: 82 },
  { day: "14 May", leads: 60 },
  { day: "15 May", leads: 77 },
  { day: "16 May", leads: 88 },
  { day: "17 May", leads: 65 },
];

const unitStatusData = {
  available: 18,
  reserved: 21,
  offered: 11,
  sold: 28,
};

const total =
  unitStatusData.available +
  unitStatusData.reserved +
  unitStatusData.offered +
  unitStatusData.sold;

const pct = (n: number) => `${((n / total) * 100).toFixed(1)}%`;

// ── Custom Tooltip ─────────────────────────────────────────────────────────────

const CustomTooltip = ({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: { value: number }[];
  label?: string;
}) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#111] text-white text-[12px] px-3 py-2 rounded-md shadow-lg">
        <p className="font-semibold">{payload[0].value} leads</p>
        <p className="text-[#AAA]">{label}</p>
      </div>
    );
  }
  return null;
};

// ── Page ───────────────────────────────────────────────────────────────────────

export default function AdminDashboardPage() {
  const [region, setRegion] = useState("All Regions");
  const [period, setPeriod] = useState("This month");

  return (
    <div className="p-6 max-w-[1100px]">
      {/* Page title */}
      <h1 className="text-[22px] font-semibold text-[#111] mb-5 tracking-tight">
        Dashboard
      </h1>

      <div className="flex gap-5">
        {/* Left column — wide */}
        <div className="flex-1 flex flex-col gap-4">

          {/* KPI Cards row */}
          <div className="grid grid-cols-3 gap-4">
            {/* Total Sales */}
            <div className="bg-white rounded-xl border border-[#E5E5E0] p-4 flex flex-col gap-2">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[11px] font-medium text-[#999] uppercase tracking-wide">
                    Total Sales
                  </p>
                  <p className="text-[20px] font-bold text-[#111] mt-1 tracking-tight">
                    CA$15,182,000
                  </p>
                </div>
                <div className="w-8 h-8 rounded-md bg-[#F2F2F0] flex items-center justify-center">
                  <CheckSquare size={16} className="text-[#555]" />
                </div>
              </div>
              <p className="text-[11px] text-[#27AE60] font-medium">
                ↑ 12.4% vs last month
              </p>
            </div>

            {/* Units Sold */}
            <div className="bg-white rounded-xl border border-[#E5E5E0] p-4 flex flex-col gap-2">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[11px] font-medium text-[#999] uppercase tracking-wide">
                    Units Sold
                  </p>
                  <p className="text-[20px] font-bold text-[#111] mt-1 tracking-tight">
                    28
                  </p>
                </div>
                <div className="w-8 h-8 rounded-md bg-[#F2F2F0] flex items-center justify-center">
                  <Building size={16} className="text-[#555]" />
                </div>
              </div>
              <p className="text-[11px] text-[#27AE60] font-medium">
                ↑ 4 units this week
              </p>
            </div>

            {/* Avg Price / sq ft */}
            <div className="bg-white rounded-xl border border-[#E5E5E0] p-4 flex flex-col gap-2">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[11px] font-medium text-[#999] uppercase tracking-wide">
                    Ave Price per Sq. Ft
                  </p>
                  <p className="text-[20px] font-bold text-[#111] mt-1 tracking-tight">
                    CA$42
                  </p>
                </div>
                <div className="w-8 h-8 rounded-md bg-[#F2F2F0] flex items-center justify-center">
                  <Tag size={16} className="text-[#555]" />
                </div>
              </div>
              <p className="text-[11px] text-[#E07B3A] font-medium">
                ↓ 2.1% vs last month
              </p>
            </div>
          </div>

          {/* Units per Status */}
          <div className="bg-white rounded-xl border border-[#E5E5E0] p-5">
            <h2 className="text-[14px] font-semibold text-[#111] mb-4">
              Units per Status
            </h2>

            {/* Status numbers */}
            <div className="grid grid-cols-4 gap-2 mb-4">
              {[
                { label: "AVAILABLE UNITS", value: unitStatusData.available, color: "#FFD600" },
                { label: "RESERVED UNITS", value: unitStatusData.reserved, color: "#888" },
                { label: "OFFERED UNITS", value: unitStatusData.offered, color: "#BBB" },
                { label: "SOLD UNITS", value: unitStatusData.sold, color: "#111" },
              ].map(({ label, value, color }) => (
                <div key={label} className="flex flex-col gap-0.5">
                  <div
                    className="w-3 h-3 rounded-sm mb-1"
                    style={{ backgroundColor: color }}
                  />
                  <span className="text-[20px] font-bold text-[#111] tracking-tight">
                    {value}
                  </span>
                  <span className="text-[10px] font-medium text-[#999] uppercase tracking-wide">
                    {label}
                  </span>
                </div>
              ))}
            </div>

            {/* Stacked bar */}
            <div className="flex rounded-md overflow-hidden h-10 w-full">
              <div
                className="bg-[#FFD600] transition-all"
                style={{ width: pct(unitStatusData.available) }}
                title={`Available: ${unitStatusData.available}`}
              />
              <div
                className="bg-[#888] transition-all"
                style={{ width: pct(unitStatusData.reserved) }}
                title={`Reserved: ${unitStatusData.reserved}`}
              />
              <div
                className="bg-[#BBBBBB] transition-all"
                style={{ width: pct(unitStatusData.offered) }}
                title={`Offered: ${unitStatusData.offered}`}
              />
              <div
                className="bg-[#111] transition-all"
                style={{ width: pct(unitStatusData.sold) }}
                title={`Sold: ${unitStatusData.sold}`}
              />
            </div>
          </div>

          {/* Total Leads by Day */}
          <div className="bg-white rounded-xl border border-[#E5E5E0] p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-[14px] font-semibold text-[#111]">
                Total Leads by Day
              </h2>
              <div className="flex gap-2">
                {/* Region dropdown */}
                <button
                  className="flex items-center gap-1.5 text-[12px] font-medium text-[#555] border border-[#E5E5E0] rounded-md px-3 py-1.5 hover:bg-[#F5F5F3] transition-colors"
                  onClick={() =>
                    setRegion((r) =>
                      r === "All Regions" ? "Canada" : "All Regions"
                    )
                  }
                >
                  {region}
                  <ChevronDown size={12} />
                </button>

                {/* Period dropdown */}
                <button
                  className="flex items-center gap-1.5 text-[12px] font-medium text-[#555] border border-[#E5E5E0] rounded-md px-3 py-1.5 hover:bg-[#F5F5F3] transition-colors"
                  onClick={() =>
                    setPeriod((p) =>
                      p === "This month" ? "Last month" : "This month"
                    )
                  }
                >
                  {period}
                  <ChevronDown size={12} />
                </button>
              </div>
            </div>

            <ResponsiveContainer width="100%" height={200}>
              <BarChart
                data={leadsData}
                barSize={14}
                margin={{ top: 4, right: 0, bottom: 0, left: -20 }}
              >
                <CartesianGrid vertical={false} stroke="#F0F0EE" />
                <XAxis
                  dataKey="day"
                  tick={{ fontSize: 10, fill: "#AAA" }}
                  axisLine={false}
                  tickLine={false}
                  interval={2}
                />
                <YAxis
                  tick={{ fontSize: 10, fill: "#AAA" }}
                  axisLine={false}
                  tickLine={false}
                  domain={[0, 100]}
                  ticks={[0, 20, 40, 60, 80, 100]}
                />
                <Tooltip
                  content={<CustomTooltip />}
                  cursor={{ fill: "#F5F5F3" }}
                />
                <Bar dataKey="leads" fill="#111" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right column — narrow */}
        <div className="w-[220px] min-w-[220px] flex flex-col gap-4">
          {/* Remaining Units */}
          <div className="bg-white rounded-xl border border-[#E5E5E0] p-4">
            <p className="text-[11px] font-medium text-[#999] uppercase tracking-wide mb-1">
              Remaining Units
            </p>
            <p className="text-[26px] font-bold text-[#111] tracking-tight">
              18
            </p>
            <div className="my-3 border-t border-[#F0F0EE]" />
            <p className="text-[11px] font-medium text-[#999] uppercase tracking-wide mb-1">
              Total Amount
            </p>
            <p className="text-[16px] font-bold text-[#111] tracking-tight">
              CA$11,273,000
            </p>
            <div className="my-3 border-t border-[#F0F0EE]" />
            <p className="text-[11px] font-medium text-[#999] uppercase tracking-wide mb-1">
              Ave Price per Sq. Ft
            </p>
            <p className="text-[16px] font-bold text-[#111] tracking-tight">
              CA$39
            </p>
          </div>

          {/* Sold vs Remaining legend + bars */}
          <div className="bg-white rounded-xl border border-[#E5E5E0] p-4">
            <div className="flex items-center gap-3 mb-3 text-[12px] font-medium text-[#555]">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-[#111] inline-block" />
                Sold
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-[#FFD600] inline-block" />
                Remaining
              </span>
            </div>

            {/* Sold bar */}
            <div className="mb-2">
              <div className="text-[10px] text-[#AAA] mb-1">Sold — 28</div>
              <div className="h-8 bg-[#111] rounded-md w-full" />
            </div>

            {/* Remaining bar */}
            <div>
              <div className="text-[10px] text-[#AAA] mb-1">Remaining — 18</div>
              <div className="h-8 bg-[#FFD600] rounded-md w-[64%]" />
            </div>
          </div>

          {/* Quick Stats */}
          <div className="bg-white rounded-xl border border-[#E5E5E0] p-4 flex flex-col gap-3">
            <p className="text-[11px] font-semibold text-[#999] uppercase tracking-wide">
              Quick Stats
            </p>
            {[
              { label: "Active Listings", value: "34" },
              { label: "New Inquiries", value: "12" },
              { label: "Site Visits Today", value: "8" },
              { label: "Conversion Rate", value: "6.3%" },
            ].map(({ label, value }) => (
              <div
                key={label}
                className="flex items-center justify-between text-[12px]"
              >
                <span className="text-[#777]">{label}</span>
                <span className="font-bold text-[#111]">{value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}