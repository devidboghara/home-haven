"use client";

import { ReactNode } from "react";
import { 
  LayoutGrid, Home, Briefcase, Users, MessageSquare, BarChart3, Settings, 
  PlusCircle, Bell, Search, Globe, ChevronDown, PieChart, ShieldCheck, 
  FileText, CreditCard, Layers, UserPlus, Target, Calendar
} from "lucide-react";
import Link from "next/link";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-screen bg-[#F1F3F6] font-sans text-slate-900">
      
      {/* 🛠️ INDUSTRIAL SIDEBAR */}
      <aside className="w-[260px] bg-[#1E293B] text-slate-300 flex flex-col border-r border-slate-800 shrink-0 shadow-2xl">
        
        {/* Profile Section */}
        <div className="p-6 border-b border-slate-800/50 flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-black italic shadow-lg shadow-blue-500/20">L</div>
          <div>
            <p className="text-[11px] font-black uppercase text-white tracking-widest leading-none">LuxeAdmin</p>
            <p className="text-[9px] font-bold text-slate-500 mt-1 uppercase">Devid Patel • Super</p>
          </div>
        </div>

        {/* Scrollable Nav Area */}
        <div className="flex-1 overflow-y-auto custom-scrollbar px-4 py-6 space-y-8">
          
          {/* Section: CRM Core */}
          <div>
            <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em] mb-4 px-2">Core CRM</p>
            <nav className="space-y-1">
              <NavItem icon={<Briefcase size={16}/>} label="Deals Pipeline" active />
              <NavItem icon={<Users size={16}/>} label="Seller Leads" />
              <NavItem icon={<UserPlus size={16}/>} label="Buyers Database" />
              <NavItem icon={<MessageSquare size={16}/>} label="Client Messages" count={12} />
              <NavItem icon={<Calendar size={16}/>} label="Site Visits" />
            </nav>
          </div>

          {/* Section: Inventory */}
          <div>
            <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em] mb-4 px-2">Inventory</p>
            <nav className="space-y-1">
              <NavItem icon={<Home size={16}/>} label="Active Listings" />
              <NavItem icon={<Layers size={16}/>} label="Project Inventory" />
              <NavItem icon={<PlusCircle size={16}/>} label="Add New Property" />
            </nav>
          </div>

          {/* Section: Performance */}
          <div>
            <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em] mb-4 px-2">Analytics</p>
            <nav className="space-y-1">
              <NavItem icon={<BarChart3 size={16}/>} label="Sales Analytics" />
              <NavItem icon={<PieChart size={16}/>} label="Conversion Funnel" />
              <NavItem icon={<Target size={16}/>} label="Marketing ROI" />
            </nav>
          </div>

          {/* Section: Operations */}
          <div>
            <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em] mb-4 px-2">Financials</p>
            <nav className="space-y-1">
              <NavItem icon={<IndianRupeeIcon size={16}/>} label="Commission Tracking" />
              <NavItem icon={<FileText size={16}/>} label="Legal Docs" />
              <NavItem icon={<CreditCard size={16}/>} label="Payments" />
            </nav>
          </div>
        </div>

        {/* Footer Sidebar */}
        <div className="p-6 border-t border-slate-800/50 bg-[#141A30]">
          <NavItem icon={<Settings size={16}/>} label="System Control" />
        </div>
      </aside>

      {/* 🚀 MAIN INTERFACE */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* TOPBAR CONSOLE */}
        <header className="h-[70px] bg-white border-b border-slate-200 flex items-center justify-between px-10 shadow-sm">
          <div className="flex items-center gap-4 bg-slate-50 px-4 py-2.5 rounded-xl border border-slate-100 w-[500px] group focus-within:border-blue-400 transition-all">
            <Search size={16} className="text-slate-400" />
            <input 
              placeholder="Search Client Name, Property ID, Phone or Deal Status..." 
              className="bg-transparent text-[11px] font-bold outline-none w-full text-slate-900 placeholder:text-slate-300 uppercase tracking-widest"
            />
          </div>

          <div className="flex items-center gap-6">
            <button className="flex items-center gap-2 px-4 py-2.5 border border-slate-100 rounded-xl text-[10px] font-black uppercase text-slate-500 hover:bg-slate-50 transition-all">
              <Globe size={14}/> Gujarat Zone <ChevronDown size={14}/>
            </button>
            <div className="h-8 w-[1px] bg-slate-100"></div>
            <button className="relative p-2 text-slate-400 hover:text-blue-600">
              <Bell size={20}/>
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white shadow-sm"></span>
            </button>
            <button className="bg-slate-900 text-white px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-slate-900/10 hover:bg-blue-600 transition-all">
              + New Deal
            </button>
          </div>
        </header>

        {/* CONTENT AREA */}
        <main className="flex-1 overflow-auto p-10 bg-[#F1F3F6]">
          {children}
        </main>
      </div>
    </div>
  );
}

function NavItem({ icon, label, active, count }: any) {
  return (
    <div className={`flex items-center justify-between px-4 py-3 rounded-xl cursor-pointer transition-all ${active ? "bg-blue-600 text-white shadow-xl shadow-blue-900/20" : "text-slate-400 hover:text-white hover:bg-white/5"}`}>
      <div className="flex items-center gap-4">
        {icon}
        <span className="text-[11px] font-black uppercase tracking-widest">{label}</span>
      </div>
      {count && <span className="bg-blue-400 text-white text-[9px] px-2 py-0.5 rounded-full font-black tracking-normal">{count}</span>}
    </div>
  );
}

const IndianRupeeIcon = ({ size }: any) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 3h12"/><path d="M6 8h12"/><path d="m6 13 8.5 8"/><path d="M6 13h3"/><path d="M9 13c6.667 0 6.667-10 0-10"/></svg>
);