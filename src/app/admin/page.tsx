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
  ExternalLink,
  ChevronDown
} from "lucide-react";
import { useState } from "react";

export default function AdminDashboard() {
  const [activeSegment, setActiveSegment] = useState("leads");

  const segments = [
    { id: "leads", name: "Seller Leads" },
    { id: "msgs", name: "User Messages" },
  ];

  const recentActivity = [
    { id: "LX-102", property: "Skyline Villa", area: "Satellite", price: "4.5Cr", status: "Negotiating", time: "10 mins ago" },
    { id: "LX-098", property: "Aura Penthouse", area: "Bopal", price: "2.8Cr", status: "New Lead", time: "1 hr ago" },
    { id: "LX-085", property: "Gaurang Heights", area: "Vastrapur", price: "5.2Cr", status: "Review", time: "4 hrs ago" },
    { id: "LX-072", property: "Empire Estate", area: "Bodakdev", price: "12Cr", status: "Closed", time: "1 day ago" },
  ];

  return (
    <div className="space-y-8">
      
      {/* 🔝 CONSOLE ACTIONS BAR (Minimalist, No title) */}
      <div className="flex justify-between items-center border-b border-slate-200 pb-6 mb-8">
        <h2 className="text-xl font-bold tracking-tight text-slate-800">Operational Console</h2>
        <div className="flex gap-2">
          <button className="px-5 py-2.5 bg-white border border-slate-200 rounded-md text-[10px] font-semibold text-slate-500 hover:bg-slate-50">Filter <ChevronDown size={14} className="inline ml-1"/></button>
          <button className="px-5 py-2.5 bg-blue-600 text-white rounded-md text-[10px] font-semibold hover:bg-blue-700 shadow-xl shadow-blue-200">Process New Data</button>
        </div>
      </div>

      {/* 💎 PRIMARY METRICS (Matching 100% style) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Portfolio Value", val: "₹51.27 Cr", up: true, trend: "12%" },
          { label: "Units Sold", val: "24", up: true, trend: "4%" },
          { label: "Gross Revenue", val: "₹12.4 Cr", up: false, trend: "8%" },
          { label: "New Leads", val: "65", up: true, trend: "21%" },
        ].map((item, i) => (
          <div key={i} className="bg-white p-6 rounded-lg border border-slate-100 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{item.label}</p>
              <h4 className="text-2xl font-black text-slate-900 italic tracking-tighter">{item.val}</h4>
              <div className="flex items-center gap-1.5 mt-2">
                {item.up ? <ArrowUpRight size={12} className="text-green-500" /> : <ArrowDownRight size={12} className="text-red-500" />}
                <span className={`text-[11px] font-bold ${item.up ? 'text-green-500' : 'text-red-500'}`}>{item.trend} vs last month</span>
              </div>
            </div>
            <div className="p-3.5 bg-slate-100 text-slate-400 rounded-lg border border-slate-200">
              <TrendingUp size={16}/>
            </div>
          </div>
        ))}
      </div>

      {/* 📊 DUAL PANEL CONSOLE (Matching Hudson 8 style) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* RECENT ACTIVITY TABLE (Hudson style) */}
        <div className="lg:col-span-2 bg-white rounded-lg border border-slate-100 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-50 flex gap-6 items-center">
            {segments.map(s => (
                <button key={s.id} onClick={() => setActiveSegment(s.id)} className={`pb-3 text-[11px] font-black uppercase tracking-widest transition-all relative ${activeSegment === s.id ? 'text-blue-600' : 'text-slate-300'}`}>
                    {s.name}
                    {activeSegment === s.id && <div className="absolute bottom-0 left-0 w-full h-1 bg-blue-600" />}
                </button>
            ))}
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/50">
                  <th className="px-6 py-3.5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Property / ID</th>
                  <th className="px-6 py-3.5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Area</th>
                  <th className="px-6 py-3.5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Price</th>
                  <th className="px-6 py-3.5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                  <th className="px-6 py-3.5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {recentActivity.map((row, i) => (
                  <tr key={i} className="hover:bg-blue-50/20 transition-all cursor-default">
                    <td className="px-6 py-4">
                      <p className="text-[11px] font-black text-slate-900 uppercase italic tracking-tighter">{row.property}</p>
                      <p className="text-[9px] font-bold text-slate-300 uppercase tracking-widest">{row.id}</p>
                    </td>
                    <td className="px-6 py-4 text-[10px] font-medium text-slate-500">{row.area}</td>
                    <td className="px-6 py-4 text-[11px] font-black text-slate-900 italic tracking-tighter">₹{row.price}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded text-[8px] font-black uppercase tracking-widest ${row.status === 'Closed' ? 'bg-green-50 text-green-600' : 'bg-blue-50 text-blue-600'}`}>
                        {row.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-[9px] font-black text-slate-400 uppercase italic tracking-widest">{row.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* DISTRIBUTION & STATUS (Side panel Hudson style) */}
        <div className="bg-[#1A1C3B] p-10 rounded-lg shadow-2xl text-white">
          <h3 className="text-[11px] font-black uppercase tracking-[0.3em] mb-10 text-white italic">Capacity overview</h3>
          <div className="space-y-8">
            {[
              { label: "Available Listings", count: 18, total: 40, color: "bg-blue-500" },
              { label: "Under Review", count: 22, total: 40, color: "bg-slate-700" },
            ].map((item, i) => (
              <div key={i}>
                <div className="flex justify-between text-[11px] font-bold mb-2">
                  <span>{item.label}</span>
                  <span>{item.count} / {item.total} units</span>
                </div>
                <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                  <motion.div initial={{ width: 0 }} animate={{ width: `${(item.count / item.total) * 100}%` }} className={`h-full ${item.color}`} />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-12 pt-8 border-t border-white/5 space-y-4">
             <p className="text-[10px] font-black uppercase text-blue-400 tracking-widest">Active Dealers: 12 Active</p>
             <p className="text-[9px] font-medium text-white/50 leading-relaxed italic">
               System auto-audit scheduled for 00:00 GMT. Ensure dealer data is synchronized.
             </p>
          </div>
        </div>
      </div>
    </div>
  );
}