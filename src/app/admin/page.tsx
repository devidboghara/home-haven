"use client";

import { motion } from "framer-motion";
import { DollarSign, Home, UserCheck, TrendingUp, Sparkles, MapPin, Target, LayoutGrid, MailQuestion, Trash2, ArrowRight } from "lucide-react";
import { useState } from "react";

export default function AdminDashboard() {
  const [activeSegment, setActiveSegment] = useState("leads");

  const segments = [
    { id: "leads", name: "Seller Leads" },
    { id: "favs", name: "Property Favs" },
    { id: "msgs", name: "User Messages" },
  ];

  const primaryStats = [
    { title: "Project Revenue Pipeline", val: "₹51.27 Cr+", icon: <DollarSign size={20}/>, change: "+15.8%" },
    { title: "Active Listings", val: "28", icon: <Home size={20}/>, change: "+5.2%" },
    { title: "Seller Leads Today", val: "65", icon: <UserCheck size={20}/>, change: "+21.0%" },
  ];

  return (
    <div className="space-y-12">
      {/* 🏙️ HERO TITLE SECTION (Luxe Edition Hudson 8 style) */}
      <div className="flex justify-between items-end border-b border-slate-100 p-10 xl:p-12 pb-8">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
             <LayoutGrid size={14} className="text-blue-500" />
             <p className="text-[10px] font-black text-blue-500 uppercase tracking-[0.4em]">Portfolio Summary</p>
          </div>
          <h1 className="text-5xl font-black text-slate-900 uppercase italic tracking-tighter leading-none">Luxe<span className="text-slate-200">Portfolio</span></h1>
          <p className="text-[10px] font-bold text-slate-400 mt-2 flex items-center gap-1.5 tracking-widest uppercase"><MapPin size={10}/> Ahmedabad & Gujarat Zone</p>
        </div>
        <div className="text-right space-y-1">
          <p className="text-sm font-black text-slate-900 tracking-widest">{new Date().toDateString()}</p>
          <p className="text-[10px] font-medium text-slate-400">Time: {new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</p>
        </div>
      </div>

      {/* 💎 PRIMARY METRICS GRID (As it is Video layout) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 px-10 xl:px-12">
        {primaryStats.map((item, i) => (
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} key={i} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col justify-between group hover:border-blue-200 transition-all hover:translate-y-[-5px]">
            <div className="flex justify-between items-start mb-6">
              <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl group-hover:bg-blue-600 group-hover:text-white transition-all"> {item.icon} </div>
              <div className={`px-3 py-1 text-[9px] font-black rounded-full flex gap-1 items-center ${item.change.startsWith('+') ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}> <TrendingUp size={10}/> {item.change} </div>
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">{item.title}</p>
              <h4 className="text-3xl font-black text-slate-900 italic tracking-tighter leading-none">{item.val}</h4>
            </div>
          </motion.div>
        ))}

        {/* Membership Status (Rich Context Card) */}
        <div className="bg-slate-900 p-8 rounded-[2.5rem] shadow-2xl text-white">
           <div className="flex items-center gap-2 mb-6">
             <Sparkles size={14} className="text-blue-400"/>
             <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-white">VIP Agent Membership</h4>
           </div>
           <p className="text-2xl font-black text-blue-400 italic mb-2 tracking-tighter">ELITE TIER</p>
           <p className="text-[9px] font-medium text-white/50 tracking-wide uppercase">Expires: 25 Oct 2026</p>
           <div className="h-1.5 bg-white/10 rounded-full mt-6 overflow-hidden"> <div className="h-full w-[80%] bg-blue-500 rounded-full"></div> </div>
        </div>
      </div>

      {/* 📊 HUDSON 8 STYLE TABS OVER CONTENT (Exact Screenshot) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 px-10 xl:px-12">
        
        {/* LEADS ACTIVITY Chart + Mini Kanban Stage (Kanban style from Hudson) */}
        <div className="lg:col-span-2 space-y-10">
            {/* Real Chart Placeholder */}
            <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm">
                <div className="flex justify-between items-center mb-10">
                    <h3 className="text-sm font-black uppercase tracking-widest text-slate-900 italic">Seller Leads Generated (Daily)</h3>
                    <div className="flex gap-2">
                        <button className="px-4 py-2 bg-blue-50 text-blue-600 rounded-xl text-[9px] font-black uppercase tracking-widest">This Month</button>
                        <button className="px-4 py-2 text-slate-400 rounded-xl text-[9px] font-black uppercase tracking-widest">All Time</button>
                    </div>
                </div>
                {/* Real Bar Chart BARS */}
                <div className="h-60 flex items-end justify-between gap-1.5 px-4 relative">
                    <div className="absolute top-1/2 left-0 w-full h-0.5 border-t border-dashed border-slate-100"></div>
                    {[50, 60, 45, 80, 70, 95, 40, 110, 65, 85, 55, 90, 75, 100].map((h, i) => (
                        <motion.div key={i} initial={{ height: 0 }} animate={{ height: `${h}%` }} className="w-full bg-slate-100 rounded-t-lg group hover:bg-blue-600 hover:scale-105 transition-all cursor-pointer relative">
                            <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[8px] p-2 rounded opacity-0 group-hover:opacity-100 transition-all shadow-xl">{h} leads</div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Stage Pipeline Hudson style */}
            <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm space-y-6">
                <h3 className="text-sm font-black uppercase tracking-widest text-slate-900 italic mb-8">Leads Pipeline Overview</h3>
                {[
                  { id: 1, title: "New Inquiries", count: 18, color: "bg-blue-600" },
                  { id: 2, title: "Contact Made", count: 21, color: "bg-orange-500" },
                  { id: 3, title: "Offer Under Contract", count: 11, color: "bg-green-500" },
                ].map(stage => (
                  <div key={stage.id} className="p-5 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-between gap-3 hover:border-blue-100 transition-all">
                      <div className={`w-3 h-3 ${stage.color} rounded-full`}></div>
                      <p className="text-[10px] font-black uppercase text-slate-900 flex-1">{stage.title}</p>
                      <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">{stage.count} Leads</p>
                  </div>
                ))}
            </div>
        </div>

        {/* PROFILE SIDEBAR Hudson style */}
        <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm flex flex-col items-center text-center">
          <div className="w-24 h-24 rounded-full bg-slate-900 flex items-center justify-center text-white font-black text-4xl italic border-4 border-slate-100 shadow-xl mb-6">JC</div>
          <p className="text-[9px] font-black text-blue-600 uppercase tracking-[0.2em] mb-1.5">Seller Account</p>
          <h4 className="text-xl font-black text-slate-900 uppercase italic tracking-tighter leading-none">Jane Cooper</h4>
          <div className="text-[9px] font-medium text-slate-400 mt-3 uppercase tracking-widest flex items-center gap-1.5 leading-none"><MapPin size={10}/> Satellite, Ahmedabad</div>
          
          <div className="w-full mt-10 pt-8 border-t border-slate-50 space-y-5">
             {[
               { icon: <UserCheck size={14}/>, label: "Last Inquiry Date", value: "25 Mar 2026" },
               { icon: <Target size={14}/>, label: "Interested Property", value: "Aura Penthouse" },
             ].map((m, i) => (
                <div key={i} className="flex justify-between items-center text-[10px] font-black">
                   <div className="flex items-center gap-3 text-slate-400"> {m.icon} {m.label} </div>
                   <div className="text-slate-900 tracking-widest uppercase"> {m.value} </div>
                </div>
             ))}
          </div>

          <button className="w-full mt-12 py-4 bg-slate-900 text-white rounded-[1rem] text-[9px] font-black uppercase tracking-widest hover:bg-blue-600 transition-all flex items-center justify-center gap-2">View Full Lead Cycle <ArrowRight size={14} fill="currentColor"/></button>
        </div>
      </div>
    </div>
  );
}