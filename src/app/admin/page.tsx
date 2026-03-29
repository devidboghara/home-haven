"use client";

import { motion } from "framer-motion";
import { DollarSign, Home, UserCheck, TrendingUp, Sparkles, MapPin, Target, LayoutGrid, ChevronRight, UserCircle } from "lucide-react";
import { useState } from "react";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("leads");

  const hudsonTabs = [
    { id: "leads", name: "Seller Leads Pipeline" },
    { id: "listings", name: "LuxeInventory" },
    { id: "inquiries", name: "VIP Inquiries" },
    { id: "reports", name: "Team Reports" },
  ];

  const pipelineStages = [
    { id: 1, name: "New Lead", count: 18, color: "bg-blue-600" },
    { id: 2, name: "Offer Under Contract", count: 11, color: "bg-green-500" },
    { id: 3, name: "Deal Processing", count: 8, color: "bg-orange-500" },
    { id: 4, name: "Deal Terminated", count: 4, color: "bg-red-500" },
  ];

  return (
    <div className="space-y-10">
      
      {/* 🏙️ HERO TITLE SECTION (Luxe Edition Hudson 8 style) */}
      <div className="flex justify-between items-end border-b border-slate-100 pb-8">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
             <LayoutGrid size={14} className="text-blue-500" />
             <p className="text-[10px] font-black text-blue-500 uppercase tracking-[0.4em]">Operational Metrics</p>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 uppercase italic tracking-tighter leading-none">Luxe<span className="text-slate-200">Portfolio</span></h1>
          <p className="text-[10px] font-bold text-slate-400 mt-2 flex items-center gap-1.5 tracking-widest uppercase"><MapPin size={10}/> Ahmedabad Headquarters Zone</p>
        </div>
        <div className="text-right space-y-1">
          <p className="text-sm font-black text-slate-900 tracking-widest">{new Date().toDateString()}</p>
          <p className="text-[10px] font-medium text-slate-400 uppercase">System Status: <span className="text-green-500">Live</span></p>
        </div>
      </div>

      {/* 📊 HUDSON 8 STYLE TABS OVER CONTENT (Exact Screenshot) */}
      <div className="flex gap-1.5 border-b border-slate-50 relative pb-5">
        {hudsonTabs.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`px-6 py-4 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all relative ${activeTab === tab.id ? 'bg-slate-900 text-white shadow-xl' : 'bg-white text-slate-300 border border-slate-100'}`}>
                {tab.name}
            </button>
        ))}
      </div>

      {/* 💎 PRIMARY METRICS & UNIFIED CONSOLE (No Tukde tukde) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        {/* LEADS ACTIVITY CHART + KANBAN Pipeline (The Unified Console) */}
        <div className="lg:col-span-2 space-y-10">
            {/* Seller Leads Daily Generation (Activity Chart from Video) */}
            <div className="bg-white p-10 xl:p-12 rounded-[2rem] border border-slate-100 shadow-sm relative">
                <div className="absolute top-8 left-10 flex items-center gap-3">
                   <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-black italic">LL</div>
                   <div>
                       <h4 className="text-[12px] font-black uppercase text-slate-900 leading-none tracking-tight">Daily Generation Flow</h4>
                       <p className="text-[8px] font-bold text-slate-400 uppercase mt-1 tracking-widest">Seller Leads Generated</p>
                   </div>
                </div>
                {/* DYNAMIC METRIC (Hudson style count animation will add later) */}
                <div className="text-center mt-12 mb-10">
                    <p className="text-5xl font-black italic text-slate-900 tracking-tighter">₹51,273,000 <span className="text-green-500 text-[10px] font-bold tracking-normal italic">+15.8%</span></p>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Project Revenue Pipeline Estimate</p>
                </div>
                {/* Real Chart BARS Placeholder */}
                <div className="h-60 flex items-end justify-between gap-1.5 px-4 relative">
                    <div className="absolute top-1/2 left-0 w-full h-0.5 border-t border-dashed border-slate-100"></div>
                    {[50, 60, 45, 80, 70, 95, 40, 110, 65, 85, 55, 90, 75, 100].map((h, i) => (
                        <motion.div key={i} initial={{ height: 0 }} animate={{ height: `${h}%` }} className="w-full bg-slate-100 rounded-t-lg group hover:bg-blue-600 hover:scale-105 transition-all cursor-pointer relative">
                            <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[8px] p-2 rounded opacity-0 group-hover:opacity-100 transition-all shadow-xl">{h} leads</div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Leads Pipeline Stage (Kanban style from Video) */}
            <div className="bg-slate-900 p-10 rounded-[2rem] shadow-2xl text-white">
                <h3 className="text-sm font-black uppercase tracking-widest mb-10 text-white italic">Deal Pipeline Breakdown</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {pipelineStages.map(stage => (
                        <div key={stage.id} className="p-6 bg-white/5 border border-white/10 rounded-xl text-center flex flex-col items-center group hover:border-blue-500/30 transition-all">
                           <div className={`w-3 h-3 ${stage.color} rounded-full mb-3`}></div>
                           <p className="text-2xl font-black italic tracking-tighter mb-0.5">{stage.count}</p>
                           <p className="text-[9px] font-bold text-white/50 uppercase tracking-widest leading-none">{stage.name}</p>
                           <ChevronRight size={14} className="text-blue-400 mt-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                    ))}
                </div>
            </div>
        </div>

        {/* ACTIVE PROFILE SIDEBAR Hudson style */}
        <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col items-center text-center">
            <div className="w-24 h-24 rounded-full bg-slate-900 border-4 border-white shadow-xl flex items-center justify-center text-white font-black text-4xl italic mb-6">JC</div>
            <p className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em] mb-1.5">Active Listing Owner</p>
            <h4 className="text-xl font-black text-slate-900 uppercase italic tracking-tighter leading-none">Jane Cooper</h4>
            <div className="text-[9px] font-medium text-slate-400 mt-3 uppercase tracking-widest flex items-center gap-1.5 leading-none"><MapPin size={10}/> Satellite, Ahmedabad</div>
            
            <div className="w-full mt-12 space-y-6 pt-10 border-t border-slate-50">
               {[
                 { label: "Active Deals", value: "08 Units" },
                 { label: "Pipeline Rev", value: "₹4.2 Cr" },
                 { label: "Site Visits", value: "03 Booked" },
               ].map((m, i) => (
                    <div key={i} className="flex justify-between items-center text-[11px] font-black">
                       <div className="text-slate-400 uppercase tracking-widest">{m.label}</div>
                       <div className="text-slate-900 tracking-widest uppercase italic">{m.value}</div>
                    </div>
               ))}
            </div>

            <button className="w-full mt-14 py-4 bg-slate-900 text-white rounded-[1rem] text-[9px] font-black uppercase tracking-widest hover:bg-blue-600 transition-all flex items-center justify-center gap-2 group">View Full Dealer Cycle <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform"/></button>
        </div>
      </div>
    </div>
  );
}