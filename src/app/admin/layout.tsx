"use client";

import { LayoutDashboard, Home, Mail, FileText, Settings, LogOut, Search, Bell, ChevronDown, Users, BarChart3, PieChart } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const menuItems = [
    { name: "Dashboard", icon: <LayoutDashboard size={16} />, path: "/admin" },
    { name: "Inventory", icon: <Home size={16} />, path: "/admin/properties" },
    { name: "Seller Leads", icon: <Mail size={16} />, path: "/admin/inquiries" },
    { name: "Financials", icon: <PieChart size={16} />, path: "/admin/finance" },
    { name: "Reports", icon: <FileText size={16} />, path: "/admin/reports" },
  ];

  return (
    <div className="flex min-h-screen bg-[#F1F3F6] font-sans antialiased text-slate-900">
      {/* 🛠️ INDUSTRIAL SIDEBAR */}
      <aside className="w-56 bg-[#1E293B] flex flex-col h-screen sticky top-0 shrink-0">
        <div className="p-6 border-b border-slate-700/50">
          <h1 className="text-sm font-black text-white uppercase tracking-widest italic">
            Luxe<span className="text-blue-400">Admin</span>
          </h1>
        </div>

        <nav className="flex-1 px-3 mt-4 space-y-1">
          <p className="px-4 text-[9px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-2">Main Menu</p>
          {menuItems.map((item) => (
            <Link 
              key={item.path} 
              href={item.path}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-[11px] font-semibold transition-all ${pathname === item.path ? "bg-blue-600 text-white shadow-lg" : "text-slate-400 hover:text-white hover:bg-slate-800"}`}
            >
              {item.icon} {item.name}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-700/50">
          <button className="flex items-center gap-3 w-full px-4 py-2 text-[11px] font-semibold text-slate-400 hover:text-red-400 transition-colors">
            <LogOut size={16} /> Sign Out
          </button>
        </div>
      </aside>

      {/* 🚀 CONTENT AREA */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-14 bg-white border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-50">
          <div className="flex items-center gap-4 bg-slate-100 px-3 py-1.5 rounded-md border border-slate-200 w-80">
            <Search size={14} className="text-slate-400"/>
            <input type="text" placeholder="Search data..." className="bg-transparent text-[11px] outline-none w-full" />
          </div>
          <div className="flex items-center gap-6">
            <Bell size={16} className="text-slate-400 cursor-pointer hover:text-blue-600 transition-colors" />
            <div className="flex items-center gap-3 border-l pl-6 border-slate-200">
              <div className="text-right">
                <p className="text-[11px] font-bold leading-none">Admin Portal</p>
                <p className="text-[9px] text-slate-400 mt-1">Devid Patel</p>
              </div>
              <div className="w-8 h-8 rounded-md bg-blue-600 flex items-center justify-center text-white text-[10px] font-bold">DP</div>
            </div>
          </div>
        </header>

        <main className="p-8">
          {children}
        </main>
      </div>
    </div>
  );
}