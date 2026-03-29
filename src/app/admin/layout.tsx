"use client";

import { LayoutDashboard, Home, Mail, BarChart3, Settings, LogOut, ChevronDown, Bell, Search, Briefcase } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [activeSegment, setActiveSegment] = useState("general");

  const segments = [
    { id: "general", name: "Management" },
    { id: "project", name: "Project" },
  ];

  const menuItems = {
    general: [
      { name: "Console", icon: <LayoutDashboard size={18} />, path: "/admin" },
      { name: "Listings", icon: <Home size={18} />, path: "/admin/listings" },
      { name: "Inquiries", icon: <Mail size={18} />, path: "/admin/inquiries" },
      { name: "Analytics", icon: <BarChart3 size={18} />, path: "/admin/performance" },
    ],
    project: [
      { name: "Seller Leads", icon: <Briefcase size={18} />, path: "/admin/seller-leads" },
      { name: "Workflows", icon: <Mail size={18} />, path: "/admin/workflow" },
      { name: "Revenue Reports", icon: <FileText size={18} />, path: "/admin/reports" },
    ]
  };

  return (
    <div className="flex min-h-screen bg-[#F1F3F6] antialiased text-slate-900 font-sans">
      
      {/* 🛠️ INDIGO COMPACT SIDEBAR (Matching 100%) */}
      <aside className="w-64 bg-[#1A1C3B] flex flex-col h-screen sticky top-0 overflow-y-auto shrink-0 border-r border-slate-700/50">
        <div className="p-8 border-b border-slate-700/50">
          <Link href="/" className="text-xl font-black italic uppercase tracking-widest text-white leading-none">
            Luxe<span className="text-blue-400">Admin.</span>
          </Link>
        </div>

        {/* Hudson Segment Buttons (as shown in Video) */}
        <div className="px-6 py-4 grid grid-cols-2 gap-2 border-b border-slate-700/50 bg-[#141A30]/50 my-2">
          {segments.map(s => (
            <button key={s.id} onClick={() => setActiveSegment(s.id)} className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest ${activeSegment === s.id ? 'bg-[#3B82F6] text-white shadow-xl' : 'bg-[#1A1C3B] text-slate-400 border border-slate-700'}`}>
              {s.name.split(' ')[0]}
            </button>
          ))}
        </div>

        {/* Sidebar Navigation */}
        <nav className="flex-1 px-4 pt-2 space-y-1">
          <p className="px-5 text-[9px] font-black text-slate-500 uppercase tracking-widest mb-3">Navigation</p>
          {menuItems[activeSegment as keyof typeof menuItems].map((item) => (
            <Link 
              key={item.path} 
              href={item.path}
              className={`flex items-center gap-4 px-5 py-3 rounded-xl transition-all ${pathname === item.path ? "bg-slate-900 text-white shadow-2xl" : "text-slate-400 hover:text-white"}`}
            >
              <div className={`transition-colors ${pathname === item.path ? 'text-white' : 'text-slate-500'}`}>{item.icon}</div>
              <span className={`text-[11px] font-bold uppercase tracking-widest ${pathname === item.path ? 'text-white' : 'text-slate-400'}`}>{item.name}</span>
            </Link>
          ))}
        </nav>

        {/* Bottom Section */}
        <div className="p-6 border-t border-slate-700/50 mt-auto space-y-3">
          <Link href="/admin/settings" className="flex items-center gap-4 px-5 py-3.5 text-slate-400 text-[11px] font-bold uppercase tracking-widest hover:bg-slate-800/50 rounded-lg transition-all">
            <Settings size={20}/> System Control
          </Link>
          <button className="flex items-center gap-4 px-5 py-3.5 w-full text-red-400 text-[11px] font-bold uppercase tracking-widest rounded-lg">
            <LogOut size={20} /> Exit Console
          </button>
        </div>
      </aside>

      {/* 🚀 MAIN CONTENT AREA WITH TOP NAV */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Hudson 8 Style Top Header Bar (Matching 100%) */}
        <header className="sticky top-0 z-40 bg-white border-b border-slate-200 p-4 px-8 flex justify-between items-center gap-6 h-16">
          <div className="flex-1 max-w-lg bg-slate-50 px-4 py-1.5 rounded-md flex items-center gap-3 border border-slate-100">
            <Search size={16} className="text-slate-400"/>
            <input type="text" placeholder="Global search (UID, Name, ADDRESS)..." className="flex-1 bg-transparent text-[11px] outline-none text-slate-900 placeholder:text-slate-300 font-bold uppercase tracking-widest" />
          </div>
          <div className="flex items-center gap-5">
            <button className="p-2.5 bg-white text-slate-400 hover:bg-slate-100 rounded-md border border-slate-100 relative"><Bell size={18} /><div className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border border-white"></div></button>
            <div className="flex items-center gap-3 border-l pl-6 border-slate-200">
                <div className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center text-white font-black text-sm italic border-2 border-slate-100 shadow-xl">DP</div>
                <p className="text-[11px] font-bold text-slate-900 flex items-center gap-1.5 uppercase tracking-widest leading-none">Devid Patel <ChevronDown size={14} className="text-slate-300 ml-2"/></p>
            </div>
          </div>
        </header>

        {/* The Page Content */}
        <main className="flex-1 p-8 xl:p-10 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

// FileText as simple icon if not imported
const FileText = ({ size, className }: any) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/>
  </svg>
);