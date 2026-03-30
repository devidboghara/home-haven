"use client";

import { motion } from "framer-motion";
import { MapPin, Clock, MoreVertical, IndianRupee, ArrowUpRight, TrendingUp } from "lucide-react";

export default function AdminPage() {
  return (
    <div className="space-y-12">
      
      {/* 🏛️ HEADER SECTION */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-black text-[#4A4036] uppercase italic tracking-tighter leading-none">Executive Dashboard</h1>
          <p className="text-[10px] font-black text-[#BCB1A1] mt-3 uppercase tracking-[0.4em]">Portfolio & Deals Overview</p>
        </div>
        <button className="bg-[#C5A27D] text-white px-10 py-4 rounded-full text-[10px] font-black uppercase tracking-widest shadow-xl shadow-[#C5A27D]/20 hover:bg-[#8D7B68] transition-all">
          + Initialize New Deal
        </button>
      </div>

      {/* 📊 ANALYTICS SECTION (Seamless Design) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <Stat title="Pipeline Value" value="₹24.5 Cr" trend="+12.5%" />
        <Stat title="Commission" value="₹4.90 L" trend="+8.2%" />
        <Stat title="Booked Tours" value="48" trend="+15" />
        <Stat title="Conversion" value="14.2%" trend="+1.4%" />
      </div>

      {/* 📦 KANBAN PIPELINE SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        
        {/* MAIN BOARD SECTION */}
        <div className="lg:col-span-2 space-y-8">
          <h3 className="text-[12px] font-black uppercase tracking-[0.3em] text-[#8D7B68] border-b border-[#E8E2D9] pb-4 italic">Active Pipeline</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
             <DealCard 
               property="Saffron Villa" 
               location="Satellite" 
               price="₹4.50 Cr" 
               status="In Negotiation"
               client="Aarav Shah"
             />
             <DealCard 
               property="Skyline Penthouse" 
               location="Bopal" 
               price="₹2.80 Cr" 
               status="Viewing Scheduled"
               client="Meera Gupta"
             />
          </div>
        </div>

        {/* SIDE CONTEXT SECTION (Activity) */}
        <div className="bg-white p-10 rounded-[3rem] border border-[#E8E2D9] shadow-sm">
           <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-[#8D7B68] mb-8 border-b border-[#F9F7F2] pb-4">Recent Activity</h3>
           <div className="space-y-8">
              <ActivityItem label="New Inquiry" detail="3-BHK Apartment in Ahmedabad" time="10m ago" />
              <ActivityItem label="Visit Completed" detail="Saffron Villa - Aarav Shah" time="2h ago" />
              <ActivityItem label="Deal Closed" detail="Luxe Studio #104" time="5h ago" />
           </div>
        </div>
      </div>
    </div>
  );
}

function Stat({ title, value, trend }: any) {
  return (
    <div className="bg-white p-8 rounded-[2.5rem] border border-[#E8E2D9] shadow-sm flex flex-col justify-between h-40">
      <div className="flex justify-between items-start">
        <p className="text-[9px] font-black text-[#BCB1A1] uppercase tracking-widest">{title}</p>
        <span className="text-[9px] font-black text-[#C5A27D] bg-[#F9F7F2] px-2 py-1 rounded-lg">{trend}</span>
      </div>
      <h2 className="text-3xl font-black text-[#4A4036] italic tracking-tighter uppercase">{value}</h2>
    </div>
  );
}

function DealCard({ property, location, price, status, client }: any) {
  return (
    <div className="bg-white p-8 rounded-[3rem] border border-[#E8E2D9] shadow-sm hover:border-[#C5A27D] transition-all group">
      <div className="flex items-center gap-2 mb-4">
        <MapPin size={12} className="text-[#C5A27D]" />
        <span className="text-[9px] font-black text-[#BCB1A1] uppercase tracking-[0.2em]">{location}</span>
      </div>
      <h4 className="text-xl font-black text-[#4A4036] uppercase italic tracking-tighter leading-none">{property}</h4>
      <p className="text-2xl font-black text-[#C5A27D] mt-4 tracking-tighter">{price}</p>
      
      <div className="mt-8 pt-8 border-t border-[#F9F7F2] flex justify-between items-center">
        <div>
          <p className="text-[8px] font-black text-[#BCB1A1] uppercase tracking-widest mb-1">Client</p>
          <p className="text-[10px] font-bold text-[#8D7B68]">{client}</p>
        </div>
        <div className="bg-[#F9F7F2] px-4 py-2 rounded-full text-[8px] font-black text-[#C5A27D] uppercase tracking-widest">
          {status}
        </div>
      </div>
    </div>
  );
}

function ActivityItem({ label, detail, time }: any) {
  return (
    <div className="flex justify-between items-start">
      <div>
        <p className="text-[10px] font-black text-[#4A4036] uppercase tracking-widest">{label}</p>
        <p className="text-[9px] font-medium text-[#BCB1A1] mt-1">{detail}</p>
      </div>
      <span className="text-[8px] font-black text-[#E8E2D9] uppercase">{time}</span>
    </div>
  );
}