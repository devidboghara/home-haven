"use client";

import { motion } from "framer-motion";
import { 
  TrendingUp, 
  Users, 
  Home, 
  IndianRupee, 
  Activity, 
  ArrowUpRight, 
  ArrowDownRight,
  Target,
  Clock,
  ExternalLink
} from "lucide-react";

export default function AdminDashboard() {
  const metrics = [
    { label: "Portfolio Value", val: "₹51.27 Cr", sub: "Gross Inventory", up: true, diff: "+12%" },
    { label: "Pipeline Deals", val: "18", sub: "Under Negotiation", up: true, diff: "+3" },
    { label: "New Inquiries", val: "65", sub: "Last 24 Hours", up: false, diff: "-8%" },
    { label: "Conversion Rate", val: "4.2%", sub: "Leads to Deals", up: true, diff: "+0.5%" },
  ];

  const recentActivity = [
    { id: "LX-102", property: "Skyline Villa", area: "Satellite", price: "4.5Cr", status: "Negotiating", time: "10 mins ago" },
    { id: "LX-098", property: "Aura Penthouse", area: "Bopal", price: "2.8Cr", status: "New Lead", time: "1 hr ago" },
    { id: "LX-085", property: "Gaurang Heights", area: "Vastrapur", price: "5.2Cr", status: "Review", time: "4 hrs ago" },
    { id: "LX-072", property: "Empire Estate", area: "Bodakdev", price: "12Cr", status: "Closed", time: "1 day ago" },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-10">
      
      {/* 🔝 DASHBOARD TITLE & ACTIONS */}
      <div className="flex justify-between items-end border-b border-slate-200 pb-8">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tighter uppercase italic leading-none">Management Console</h2>
          <p className="text-[10px] font-black text-slate-400 mt-2 uppercase tracking-[0.3em]">Operational Analytics & Global Property Control</p>
        </div>
        <div className="flex gap-3">
          <button className="px-6 py-3 bg-white border border-slate-200 rounded-xl text-[9px] font-black uppercase tracking-widest text-slate-500 hover:bg-slate-50 transition-all">Audit Logs</button>
          <button className="px-6 py-3 bg-blue-600 text-white rounded-xl text-[9px] font-black uppercase tracking-widest shadow-xl shadow-blue-200 hover:bg-blue-700 transition-all">Export Report</button>
        </div>
      </div>

      {/* 📊 KPI GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((m, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm group hover:border-blue-200 transition-all">
            <div className="flex justify-between items-start mb-4">
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{m.label}</p>
              <div className={`flex items-center gap-1 text-[9px] font-black ${m.up ? 'text-green-500' : 'text-red-500'}`}>
                {m.up ? <ArrowUpRight size={10} /> : <ArrowDownRight size={10} />} {m.diff}
              </div>
            </div>
            <h4 className="text-2xl font-black text-slate-900 italic tracking-tighter">{m.val}</h4>
            <p className="text-[9px] font-bold text-slate-300 mt-2 uppercase tracking-widest">{m.sub}</p>
          </div>
        ))}
      </div>

      {/* 🏛️ CORE ANALYTICS SPLIT */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* RECENT ACTIVITY TABLE */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="px-8 py-6 border-b border-slate-50 flex justify-between items-center">
            <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-900">Live Transaction Pipeline</h3>
            <button className="text-[9px] font-black text-blue-600 uppercase tracking-widest border-b border-blue-600">Sync Data</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/50">
                  <th className="px-8 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest">Property / ID</th>
                  <th className="px-8 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest">Pricing</th>
                  <th className="px-8 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                  <th className="px-8 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest">Activity</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {recentActivity.map((row, i) => (
                  <tr key={i} className="hover:bg-blue-50/20 transition-all cursor-default">
                    <td className="px-8 py-5">
                      <p className="text-[11px] font-black text-slate-900 uppercase italic">{row.property}</p>
                      <p className="text-[9px] font-bold text-slate-300 uppercase tracking-widest">{row.id} • {row.area}</p>
                    </td>
                    <td className="px-8 py-5 text-[11px] font-black text-slate-700 italic">₹{row.price}</td>
                    <td className="px-8 py-5">
                      <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest ${row.status === 'Closed' ? 'bg-green-50 text-green-600' : 'bg-blue-50 text-blue-600'}`}>
                        {row.status}
                      </span>
                    </td>
                    <td className="px-8 py-5 text-[9px] font-black text-slate-400 uppercase italic tracking-widest">
                      <div className="flex items-center gap-2"><Clock size={10} /> {row.time}</div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* DISTRIBUTION & STATUS */}
        <div className="bg-[#0F172A] p-10 rounded-[2.5rem] shadow-2xl text-white">
          <h3 className="text-[11px] font-black uppercase tracking-[0.3em] mb-10 text-white/50 italic">Inventory Capacity</h3>
          <div className="space-y-10">
            {[
              { label: "Available Listings", count: 18, color: "bg-blue-500", total: 40 },
              { label: "Reserved Units", count: 22, color: "bg-slate-700", total: 40 },
            ].map((item, i) => (
              <div key={i}>
                <div className="flex justify-between items-end mb-3">
                  <p className="text-[10px] font-black uppercase tracking-widest text-white">{item.label}</p>
                  <p className="text-xl font-black italic">{item.count} <span className="text-[9px] font-normal text-white/30 tracking-normal">units</span></p>
                </div>
                <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                  <motion.div initial={{ width: 0 }} animate={{ width: `${(item.count / item.total) * 100}%` }} className={`h-full ${item.color}`} />
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-14 pt-8 border-t border-white/5 space-y-4">
             <div className="flex items-center gap-3 text-blue-400">
               <Target size={16} />
               <p className="text-[10px] font-black uppercase tracking-widest leading-none">Monthly Target: 85%</p>
             </div>
             <p className="text-[9px] font-medium text-white/40 leading-relaxed italic">
               System auto-audit scheduled for 00:00 GMT. Please ensure all dealer leads are processed before the cutoff.
             </p>
          </div>
        </div>
      </div>
    </div>
  );
}