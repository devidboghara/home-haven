"use client";

import { ReactNode } from "react";
import { 
  LayoutGrid, Home, Briefcase, Users, MessageSquare, BarChart3, Settings, 
  Bell, Search, Globe, ChevronDown, PieChart, FileText, CreditCard, Calendar
} from "lucide-react";
import Link from "next/link";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-screen bg-[#F9F7F2] font-sans text-[#4A4036]">
      
      {/* 🏛️ PREMIUM SIDEBAR (Beige & Cream Theme) */}
      <aside className="w-[280px] bg-[#FAF9F6] flex flex-col border-r border-[#E8E2D9] shrink-0">
        
        {/* Brand Header */}
        <div className="p-10 border-b border-[#F0EDE8] flex items-center gap-4">
          <div className="w-10 h-10 bg-[#C5A27D] rounded-full flex items-center justify-center text-white font-black italic shadow-md">L</div>
          <div>
            <p className="text-[11px] font-black uppercase text-[#8D7B68] tracking-[0.3em] leading-none">LuxeAdmin</p>
            <p className="text-[9px] font-bold text-[#BCB1A1] mt-1 uppercase">Executive Portal</p>
          </div>
        </div>

        {/* Navigation Section */}
        <div className="flex-1 overflow-y-auto px-6 py-10 space-y-10">
          <nav className="space-y-2">
            <p className="text-[10px] font-black text-[#BCB1A1] uppercase tracking-[0.2em] mb-6 px-4 italic">Management</p>
            <NavItem icon={<Briefcase size={18}/>} label="Deals Board" active />
            <NavItem icon={<Home size={18}/>} label="Listings" />
            <NavItem icon={<Users size={18}/>} label="Leads" />
            <NavItem icon={<MessageSquare size={18}/>} label="Inbox" />
            <NavItem icon={<BarChart3 size={18}/>} label="Analytics" />
          </nav>
        </div>

        {/* Settings at Bottom */}
        <div className="p-8 border-t border-[#F0EDE8]">
          <NavItem icon={<Settings size={18}/>} label="System" />
        </div>
      </aside>

      {/* 🚀 MAIN INTERFACE */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* TOPBAR (Clean White) */}
        <header className="h-[80px] bg-white border-b border-[#E8E2D9] flex items-center justify-between px-12">
          <div className="flex items-center gap-4 bg-[#F9F7F2] px-6 py-3 rounded-full border border-[#E8E2D9] w-[450px]">
            <Search size={16} className="text-[#BCB1A1]" />
            <input 
              placeholder="SEARCH PROPERTY ID OR CLIENT..." 
              className="bg-transparent text-[10px] font-bold outline-none w-full text-[#4A4036] placeholder:text-[#BCB1A1] uppercase tracking-widest"
            />
          </div>

          <div className="flex items-center gap-8">
            <button className="relative p-2 text-[#BCB1A1] hover:text-[#C5A27D] transition-colors">
              <Bell size={22}/>
              <span className="absolute top-2 right-2 w-2 h-2 bg-[#C5A27D] rounded-full border-2 border-white"></span>
            </button>
            <div className="h-8 w-[1px] bg-[#E8E2D9]"></div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-[10px] font-black text-[#4A4036] uppercase tracking-widest leading-none">Devid Patel</p>
                <p className="text-[9px] font-bold text-[#BCB1A1] mt-1 uppercase">Administrator</p>
              </div>
              <div className="w-11 h-11 rounded-full bg-[#E8E2D9] border-2 border-white shadow-sm flex items-center justify-center font-black text-[#8D7B68]">DP</div>
            </div>
          </div>
        </header>

        {/* CONTENT AREA */}
        <main className="flex-1 overflow-auto p-12">
          {children}
        </main>
      </div>
    </div>
  );
}

function NavItem({ icon, label, active }: any) {
  return (
    <div className={`flex items-center gap-5 px-5 py-4 rounded-2xl cursor-pointer transition-all ${active ? "bg-white text-[#C5A27D] shadow-sm border border-[#E8E2D9]" : "text-[#BCB1A1] hover:text-[#8D7B68] hover:bg-[#F2EFE9]"}`}>
      {icon}
      <span className="text-[11px] font-black uppercase tracking-[0.2em]">{label}</span>
    </div>
  );
}