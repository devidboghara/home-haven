"use client";

import { 
  LayoutDashboard, 
  Home, 
  Mail, 
  PieChart, 
  Settings, 
  LogOut, 
  Search, 
  Bell, 
  User as UserIcon,
  ChevronRight
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const navLinks = [
    { name: "Console", icon: <LayoutDashboard size={16} />, path: "/admin" },
    { name: "Inventory", icon: <Home size={16} />, path: "/admin/properties" },
    { name: "Leads", icon: <Mail size={16} />, path: "/admin/inquiries" },
    { name: "Financials", icon: <PieChart size={16} />, path: "/admin/finance" },
  ];

  return (
    <div className="flex min-h-screen bg-[#F1F5F9] font-sans antialiased selection:bg-blue-100">
      
      {/* 🛠️ FIXED SIDEBAR (Industrial Design) */}
      <aside className="w-60 bg-[#0F172A] flex flex-col h-screen sticky top-0 shrink-0 border-r border-slate-800">
        <div className="p-8">
          <h1 className="text-sm font-black text-white uppercase tracking-[0.3em] italic">
            Luxe<span className="text-blue-500">Admin</span>
          </h1>
        </div>

        <nav className="flex-1 px-4 mt-2 space-y-1">
          {navLinks.map((link) => (
            <Link 
              key={link.path} 
              href={link.path}
              className={`flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-300 ${pathname === link.path ? "bg-blue-600 text-white shadow-lg shadow-blue-900/20" : "text-slate-400 hover:text-white hover:bg-slate-800/50"}`}
            >
              <div className="flex items-center gap-3 text-[11px] font-bold uppercase tracking-widest">
                {link.icon} {link.name}
              </div>
              {pathname === link.path && <ChevronRight size={12} />}
            </Link>
          ))}
        </nav>

        <div className="p-6 border-t border-slate-800/50 space-y-4">
          <button className="flex items-center gap-3 px-4 py-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest hover:text-red-400 transition-colors">
            <LogOut size={16} /> Terminate Session
          </button>
        </div>
      </aside>

      {/* 🚀 MAIN INTERFACE */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        
        {/* TOP CONSOLE HEADER (Replacing User Navbar) */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-10 sticky top-0 z-50">
          <div className="flex items-center gap-4 bg-slate-50 px-4 py-2 rounded-xl border border-slate-100 w-96 group focus-within:border-blue-400 transition-all">
            <Search size={14} className="text-slate-400" />
            <input 
              type="text" 
              placeholder="GLOBAL SEARCH (PROPERTIES, LEADS, UID)..." 
              className="bg-transparent text-[10px] font-bold outline-none w-full text-slate-900 placeholder:text-slate-300 uppercase tracking-widest" 
            />
          </div>

          <div className="flex items-center gap-8">
            <div className="relative cursor-pointer group">
              <Bell size={18} className="text-slate-400 group-hover:text-blue-600 transition-colors" />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-blue-600 rounded-full border-2 border-white"></span>
            </div>
            
            <div className="flex items-center gap-4 border-l pl-8 border-slate-100">
              <div className="text-right">
                <p className="text-[10px] font-black text-slate-900 uppercase tracking-widest leading-none">Super Admin</p>
                <p className="text-[9px] font-bold text-blue-500 mt-1 uppercase tracking-tighter">Devid Patel</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-white text-[10px] font-black italic border-2 border-slate-100 shadow-sm">
                DP
              </div>
            </div>
          </div>
        </header>

        {/* PAGE CONTENT */}
        <main className="p-10 overflow-y-auto bg-[#F8FAFC]">
          {children}
        </main>
      </div>
    </div>
  );
}