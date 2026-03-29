"use client";

import { LayoutDashboard, Home, Mail, FileText, Settings, LogOut, Search, Bell, ChevronDown, Users, BarChart3, Briefcase } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [activeSegment, setActiveSegment] = useState("general");

  const segments = [
    { id: "general", name: "General Management" },
    { id: "project", name: "Project Pipeline" },
  ];

  const menuItems = {
    general: [
      { name: "Dashboard", icon: <LayoutDashboard size={18} />, path: "/admin" },
      { name: "Listings", icon: <Home size={18} />, path: "/admin/listings" },
      { name: "Leads/Inquiries", icon: <Mail size={18} />, path: "/admin/inquiries" },
      { name: "Performance", icon: <BarChart3 size={18} />, path: "/admin/performance" },
    ],
    project: [
      { name: "Active Leads", icon: <Briefcase size={18} />, path: "/admin/leads-pipeline" },
      { name: "Reports", icon: <FileText size={18} />, path: "/admin/reports" },
      { name: "Team Control", icon: <Users size={18} />, path: "/admin/team" },
    ]
  };

  return (
    <div className="flex min-h-screen bg-[#F8FAFC]">
      {/* 🏙️ SIDEBAR (Video Style Compact) */}
      <aside className="w-[280px] bg-white border-r border-slate-100 flex flex-col h-screen sticky top-0 overflow-y-auto">
        <div className="p-8 pb-4">
          <Link href="/" className="text-2xl font-black italic uppercase tracking-tighter text-slate-900 leading-none">
            Luxe<span className="text-blue-600">Admin.</span>
          </Link>
          <div className="h-0.5 w-10 bg-blue-600 mt-2"></div>
        </div>

        {/* Dynamic Segment Buttons */}
        <div className="px-6 py-4 grid grid-cols-2 gap-2 bg-slate-50/50 my-4 border-y border-slate-50">
          {segments.map(s => (
            <button key={s.id} onClick={() => setActiveSegment(s.id)} className={`px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest ${activeSegment === s.id ? 'bg-slate-900 text-white shadow-lg' : 'bg-white text-slate-400 border border-slate-100'}`}>
              {s.name.split(' ')[0]}
            </button>
          ))}
        </div>

        {/* Sidebar Navigation */}
        <nav className="flex-1 px-6 space-y-1.5 pt-2">
          {menuItems[activeSegment as keyof typeof menuItems].map((item) => (
            <Link 
              key={item.path} 
              href={item.path}
              className={`flex items-center gap-4 px-5 py-4 rounded-[1rem] text-[11px] font-black uppercase tracking-widest transition-all ${pathname === item.path ? "bg-blue-600 text-white shadow-xl shadow-blue-200" : "text-slate-400 hover:bg-slate-50 hover:text-slate-900"}`}
            >
              <span className={pathname === item.path ? 'text-white' : 'text-slate-300'}>{item.icon}</span> {item.name}
            </Link>
          ))}
        </nav>

        {/* Bottom Section */}
        <div className="p-6 border-t border-slate-50 space-y-3 mt-auto">
          <Link href="/admin/settings" className="flex items-center gap-4 px-5 py-4 text-slate-400 text-[11px] font-black uppercase tracking-widest hover:bg-slate-50 hover:text-slate-900 rounded-[1rem]">
            <Settings size={20}/> System Control
          </Link>
          <button className="flex items-center gap-4 px-5 py-4 w-full text-red-400 text-[11px] font-black uppercase tracking-widest rounded-[1rem]">
            <LogOut size={20} /> Exit Portal
          </button>
        </div>
      </aside>

      {/* 🚀 MAIN CONTENT AREA WITH TOP NAV */}
      <div className="flex-1 flex flex-col">
        {/* Top Header Bar */}
        <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-lg border-b border-slate-100 p-6 flex justify-between items-center">
          <div className="flex-1 max-w-md bg-slate-50 px-6 py-3 rounded-2xl flex items-center gap-3 border border-slate-100">
            <Search size={18} className="text-slate-400"/>
            <input type="text" placeholder="Quick Search Listings, Inquiries, Leads..." className="flex-1 bg-transparent text-xs outline-none text-slate-900 font-medium placeholder:text-slate-300" />
          </div>
          <div className="flex items-center gap-5">
            <button className="p-3 bg-white text-slate-400 hover:bg-slate-50 rounded-full border border-slate-100 relative"><Bell size={18} /> <div className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full"></div> </button>
            <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-black text-sm italic">DP</div>
            <p className="text-[11px] font-black uppercase tracking-widest text-slate-900 flex items-center gap-1.5">Devid Patel <ChevronDown size={14} className="text-slate-300"/></p>
          </div>
        </header>

        {/* The Page Content */}
        <main className="flex-1 p-10 xl:p-12 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}