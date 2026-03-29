"use client";

import { motion } from "framer-motion";
import { TrendingUp, Users, Home, IndianRupee, Activity, ArrowUpRight, ArrowDownRight } from "lucide-react";

export default function AdminDashboard() {
  const stats = [
    { label: "Pipeline Value", val: "₹51.27 Cr", icon: <IndianRupee size={16}/>, up: true, trend: "12.5%" },
    { label: "Active Deals", val: "18", icon: <Home size={16}/>, up: true, trend: "5.2%" },
    { label: "Total Inquiries", val: "1,284", icon: <Users size={16}/>, up: false, trend: "2.1%" },
    { label: "System Uptime", val: "99.9%", icon: <Activity size={16}/>, up: true, trend: "0.1%" },
  ];

  const recentDeads = [
    { title: "Skyline Villa", area: "Satellite", price: "4.5Cr", status: "Negotiating", date: "29 Mar" },
    { title: "Aura Penthouse", area: "Bopal", price: "2.8Cr", status: "New Lead", date: "28 Mar" },
    { title: "Gaurang Heights", area: "Vastrapur", price: "5.2Cr", status: "Closed", date: "25 Mar" },
    { title: "Empire Estate", area: "Bodakdev", price: "12Cr", status: "Contacted", date: "24 Mar" },
  ];

  return (
    <div className="max-w-[1400px] mx-auto space-y-8">
      {/* HEADER SECTION */}
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-800">Operational Dashboard</h2>
          <p className="text-[11px] text-slate-400 mt-1 uppercase tracking-widest font-semibold">Real-time property metrics & pipeline tracking</p>
        </div>
        <button className="bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-bold px-6 py-2.5 rounded-md shadow-lg transition-all">
          Generate Full Report
        </button>
      </div>

      {/* STATS ROW */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((item, i) => (
          <div key={i} className="bg-white p-5 rounded-lg border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">{item.label}</p>
              <h4 className="text-xl font-bold text-slate-800 tracking-tight">{item.val}</h4>
              <div className="flex items-center gap-1 mt-2">
                {item.up ? <ArrowUpRight size={12} className="text-green-500"/> : <ArrowDownRight size={12} className="text-red-500"/>}
                <span className={`text-[10px] font-bold ${item.up ? 'text-green-500' : 'text-red-500'}`}>{item.trend}</span>
                <span className="text-[10px] text-slate-300">vs last month</span>
              </div>
            </div>
            <div className="p-3 bg-slate-50 text-slate-400 rounded-md border border-slate-100">
              {item.icon}
            </div>
          </div>
        ))}
      </div>

      {/* MAIN CONTENT SPLIT */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* RECENT ACTIVITY TABLE (The Video Style) */}
        <div className="lg:col-span-2 bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
            <h3 className="text-[11px] font-bold uppercase tracking-widest">Active Deal Pipeline</h3>
            <span className="text-[10px] text-blue-600 font-bold cursor-pointer">View All →</span>
          </div>
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="px-6 py-3 text-[10px] font-bold text-slate-400 uppercase">Property Name</th>
                <th className="px-6 py-3 text-[10px] font-bold text-slate-400 uppercase">Area</th>
                <th className="px-6 py-3 text-[10px] font-bold text-slate-400 uppercase">Price</th>
                <th className="px-6 py-3 text-[10px] font-bold text-slate-400 uppercase">Status</th>
                <th className="px-6 py-3 text-[10px] font-bold text-slate-400 uppercase">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {recentDeads.map((deal, i) => (
                <tr key={i} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 text-[11px] font-bold text-slate-700">{deal.title}</td>
                  <td className="px-6 py-4 text-[11px] text-slate-500">{deal.area}</td>
                  <td className="px-6 py-4 text-[11px] font-bold text-slate-800">{deal.price}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-[9px] font-bold uppercase ${deal.status === 'Closed' ? 'bg-green-50 text-green-600' : 'bg-blue-50 text-blue-600'}`}>
                      {deal.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-[10px] text-slate-400">{deal.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* REVENUE CHART / DATA VIZ (Minimalist) */}
        <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-8">
          <h3 className="text-[11px] font-bold uppercase tracking-widest mb-6">Inventory Status</h3>
          <div className="space-y-6">
            {[
              { label: "Available", percent: 65, color: "bg-blue-600" },
              { label: "Reserved", percent: 25, color: "bg-slate-800" },
              { label: "Under Review", percent: 10, color: "bg-slate-200" }
            ].map((item, i) => (
              <div key={i}>
                <div className="flex justify-between text-[11px] font-bold mb-2">
                  <span>{item.label}</span>
                  <span>{item.percent}%</span>
                </div>
                <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                  <motion.div initial={{ width: 0 }} animate={{ width: `${item.percent}%` }} className={`h-full ${item.color}`} />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-12 pt-8 border-t border-slate-50">
            <p className="text-[10px] text-slate-400 leading-relaxed italic">
              "Note: Revenue projection for Q2 has increased by 15% due to high-value listings in Satellite area."
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}