"use client";

import { LayoutDashboard, Home, Mail, FileText, Settings, LogOut, Search, Bell, ChevronDown, Users, BarChart3 } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const primaryTabs = [
    { name: "Dashboard", path: "/admin" },
    { name: "Listings", path: "/admin/properties" },
    { name: "Leads/Inquiries", path: "/admin/inquiries" },
    { name: "Team/Reports", path: "/admin/analytics" },
  ];

  const secondaryMenu = [
    { name: "System Settings", icon: <Settings size={18} />, path: "/admin/settings" },
  ];

  return (
    <div className="flex min-h-screen bg-[#F8FAFC]">
      {/* 🏙️ SIDEBAR (Inspired by Screenshot) */}
      <aside className="w-[280px] bg-white border-r border-slate-100 flex flex-col h-screen sticky top-0 shrink-0">
        <div className="p-10 pb-4">
          <Link href="/" className="text-2xl font-black italic uppercase tracking-tighter text-slate-900 leading-none">
            Luxe<span className="text-blue-600">Admin.</span>
          </Link>
          <div className="h-0.5 w-10 bg-blue-600 mt-2"></div>
        </div>

        {/* HUDSON 8 STYLE TABS - Vertical in Sidebar */}
        <nav className="flex-1 px-6 space-y-1.5 pt-6">
          <p className="px-5 text-[9px] font-black text-slate-400 uppercase tracking-widest mb-3">Portfolio Management</p>
          {primaryTabs.map((item) => (
            <Link 
              key={item.path} 
              href={item.path}
              className={`flex items-center gap-4 px-5 py-4 rounded-[1rem] text-[11px] font-black uppercase tracking-widest transition-all ${pathname === item.path ? "bg-slate-900 text-white shadow-xl shadow-slate-900/10" : "text-slate-400 hover:bg-slate-50 hover:text-slate-900"}`}
            >
              <LayoutGrid size={pathname === item.path ? 18 : 16} className={pathname === item.path ? 'text-white' : 'text-slate-300'}/> {item.name}
            </Link>
          ))}
        </nav>

        {/* BOTTOM SECTION */}
        <div className="p-6 border-t border-slate-50 space-y-3 mt-auto">
          {secondaryMenu.map(item => (
             <Link key={item.path} href={item.path} className="flex items-center gap-4 px-5 py-4 text-slate-400 text-[11px] font-black uppercase tracking-widest hover:bg-slate-50 hover:text-slate-900 rounded-[1rem]">
                {item.icon} {item.name}
             </Link>
          ))}
          <button className="flex items-center gap-4 px-5 py-4 w-full text-red-400 text-[11px] font-black uppercase tracking-widest rounded-[1rem]">
            <LogOut size={20} /> Exit Portal
          </button>
        </div>
      </aside>

      {/* 🚀 MAIN CONTENT AREA WITH TOP NAV */}
      <div className="flex-1 flex flex-col">
        {/* Hudson 8 Style Top Header Bar */}
        <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-lg border-b border-slate-100 p-6 flex justify-between items-center gap-8">
          <div className="flex-1 max-w-lg bg-slate-50 px-6 py-3.5 rounded-2xl flex items-center gap-3 border border-slate-100">
            <Search size={18} className="text-slate-400"/>
            <input type="text" placeholder="Global Search (listings, inquries, leads)..." className="flex-1 bg-transparent text-xs outline-none text-slate-900 placeholder:text-slate-300 font-bold uppercase tracking-widest" />
          </div>
          <div className="flex items-center gap-6">
            <button className="p-3 bg-white text-slate-400 hover:bg-slate-50 rounded-full border border-slate-100 relative"><Bell size={18} /></button>
            <div className="flex items-center gap-3 border-l pl-6 border-slate-100">
                <div className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center text-white font-black text-sm italic border-2 border-white shadow-sm">DP</div>
                <div className="text-left">
                    <p className="text-[11px] font-black uppercase tracking-widest text-slate-900 leading-none">Super Admin</p>
                    <p className="text-[9px] font-medium text-slate-400 mt-1 uppercase">Devid Patel</p>
                </div>
                <ChevronDown size={14} className="text-slate-300 ml-2"/>
            </div>
          </div>
        </header>

        {/* The Page Content */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

// ArrowRight as simple icon if not imported
const LayoutGrid = ({ size, className }: any) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/>
  </svg>
);