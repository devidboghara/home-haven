"use client";

import { LayoutDashboard, Home, Mail, BarChart3, Settings, LogOut, ChevronDown, UserCircle } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const menuItems = [
    { name: "Console", icon: <LayoutDashboard size={18} />, path: "/admin" },
    { name: "Inventory", icon: <Home size={18} />, path: "/admin/properties" },
    { name: "Seller Leads", icon: <Mail size={18} />, path: "/admin/inquiries" },
    { name: "Financials", icon: <BarChart3 size={18} />, path: "/admin/analytics" },
  ];

  return (
    <div className="flex min-h-screen bg-[#F1F3F6] font-inter antialiased text-slate-900">
      
      {/* 🛠️ INDIGO INDUSTRIAL SIDEBAR (Matching 100%) */}
      <aside className="w-56 bg-[#1A1C3B] flex flex-col h-screen sticky top-0 shrink-0 border-r border-slate-700/50">
        <div className="p-6 border-b border-slate-700/50">
          <h1 className="text-sm font-black text-white uppercase tracking-widest leading-none">
            Luxe<span className="text-blue-400">Admin</span>
          </h1>
        </div>

        <nav className="flex-1 px-2 space-y-1 pt-4">
          <p className="px-4 text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-3">Core Portal</p>
          {menuItems.map((item) => (
            <Link 
              key={item.path} 
              href={item.path}
              className={`flex items-center gap-3.5 px-4 py-2.5 rounded-md text-[11px] font-semibold transition-all group ${pathname === item.path ? "text-white" : "text-slate-400 hover:text-white"}`}
            >
              {pathname === item.path && <div className="absolute left-0 h-8 w-1 bg-blue-500 rounded-r-md"></div>}
              {item.icon} {item.name}
            </Link>
          ))}
        </nav>

        {/* BOTTOM SECTION */}
        <div className="p-4 border-t border-slate-700/50 space-y-2">
          <Link href="/admin/settings" className="flex items-center gap-3 px-4 py-2.5 text-[11px] font-semibold text-slate-400 hover:text-white rounded-md">
            <Settings size={18}/> System Control
          </Link>
          <button className="flex items-center gap-3 px-4 py-2.5 w-full text-red-400 text-[11px] font-semibold hover:text-white rounded-md">
            <LogOut size={18} /> Exit Console
          </button>
        </div>
      </aside>

      {/* 🚀 CONTENT AREA WITH TOP NAV */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header Bar (Matching layout) */}
        <header className="sticky top-0 z-40 bg-white border-b border-slate-200 p-4 px-8 flex justify-between items-center h-14">
          <div className="flex-1 max-w-lg bg-slate-50 px-4 py-1.5 rounded-md flex items-center gap-3 border border-slate-100">
            <Search size={14} className="text-slate-400"/>
            <input type="text" placeholder="GLOBAL SEARCH (UID, NAME, ADDRESS)..." className="flex-1 bg-transparent text-[11px] outline-none text-slate-900 font-bold uppercase tracking-widest placeholder:text-slate-300" />
          </div>
          <div className="flex items-center gap-6">
            <button className="p-2.5 bg-white text-slate-400 hover:bg-slate-50 rounded-md border border-slate-100 relative"><Bell size={16} /><div className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border border-white"></div></button>
            <div className="flex items-center gap-3 border-l pl-6 border-slate-200">
              <div className="w-8 h-8 rounded-md bg-blue-600 flex items-center justify-center text-white font-black text-sm italic">DP</div>
              <p className="text-[11px] font-bold text-slate-900 flex items-center gap-1.5">Devid Patel <ChevronDown size={14} className="text-slate-300 ml-1"/></p>
            </div>
          </div>
        </header>

        {/* Main Console Page */}
        <main className="flex-1 p-8 xl:p-10 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

// Simple icons as fallback if they are not imported
const Bell = ({ size, className }: any) => (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>);
const Search = ({ size, className }: any) => (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>);