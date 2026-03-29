"use client";

import { ArrowUpRight, Users, Home, IndianRupee, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";

export default function AdminDashboard() {
  const stats = [
    { label: "Total Revenue", val: "₹45.8 Cr", icon: <IndianRupee size={24}/>, trend: "+12%" },
    { label: "Units Sold", val: "24", icon: <Home size={24}/>, trend: "+4%" },
    { label: "Active Leads", val: "182", icon: <Users size={24}/>, trend: "+18%" },
    { label: "Avg Price/SqFt", val: "₹18,500", icon: <TrendingUp size={24}/>, trend: "-2%" },
  ];

  return (
    <div className="space-y-10">
      {/* HEADER */}
      <div className="flex justify-between items-end">
        <div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mb-1">Overview</p>
          <h2 className="text-4xl font-black text-slate-900 uppercase italic tracking-tighter leading-none">Management Dashboard</h2>
        </div>
        <div className="text-right">
          <p className="text-[10px] font-black text-slate-900 uppercase tracking-widest">{new Date().toDateString()}</p>
          <p className="text-[9px] font-bold text-blue-600 uppercase tracking-widest">Ahmedabad HQ</p>
        </div>
      </div>

      {/* STATS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((item, i) => (
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
            key={i} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm group hover:border-blue-200 transition-all"
          >
            <div className="flex justify-between items-start mb-6">
              <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl group-hover:bg-blue-600 group-hover:text-white transition-all">
                {item.icon}
              </div>
              <span className={`text-[10px] font-black px-3 py-1 rounded-full ${item.trend.startsWith('+') ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                {item.trend}
              </span>
            </div>
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">{item.label}</p>
            <h4 className="text-2xl font-black text-slate-900 italic">{item.val}</h4>
          </motion.div>
        ))}
      </div>

      {/* MAIN DATA SECTION (Screenshot Style) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* LEADS CHART PLACEHOLDER */}
        <div className="lg:col-span-2 bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm">
          <div className="flex justify-between items-center mb-10">
             <h3 className="text-sm font-black uppercase tracking-widest text-slate-900">Total Leads by Day</h3>
             <select className="text-[9px] font-black uppercase bg-slate-50 p-2 rounded-xl outline-none border-none">
                <option>This Month</option>
                <option>Last Month</option>
             </select>
          </div>
          {/* FAKE CHART BARS */}
          <div className="h-64 flex items-end justify-between gap-2 px-4">
            {[40, 70, 45, 90, 65, 80, 30, 100, 50, 75, 40, 85].map((h, i) => (
              <motion.div 
                key={i} initial={{ height: 0 }} animate={{ height: `${h}%` }}
                className="w-full bg-slate-100 rounded-t-lg hover:bg-blue-600 transition-all cursor-pointer relative group"
              >
                <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[8px] p-2 rounded opacity-0 group-hover:opacity-100 transition-all">{h} Leads</div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* STATUS BREAKDOWN */}
        <div className="bg-slate-900 p-10 rounded-[3rem] shadow-2xl text-white">
          <h3 className="text-sm font-black uppercase tracking-widest mb-8 italic">Units Status</h3>
          <div className="space-y-8">
            {[
              { label: "Available", count: 18, color: "bg-blue-500" },
              { label: "Sold", count: 28, color: "bg-green-500" },
              { label: "Under Negotiation", count: 11, color: "bg-orange-500" }
            ].map((s, i) => (
              <div key={i}>
                <div className="flex justify-between text-[10px] font-black uppercase mb-2">
                  <span>{s.label}</span>
                  <span>{s.count} Units</span>
                </div>
                <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                  <motion.div initial={{ width: 0 }} animate={{ width: `${(s.count / 57) * 100}%` }} className={`h-full ${s.color}`} />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-12 pt-8 border-t border-white/10">
             <p className="text-[9px] font-black text-white/40 uppercase tracking-widest mb-4">Quick Summary</p>
             <p className="text-xs font-medium leading-relaxed text-white/70">Total inventory value is currently 42% realized. Next auction scheduled for 15th April.</p>
          </div>
        </div>
      </div>
    </div>
  );
}