"use client";

import { LayoutDashboard, Home, Mail, BarChart3, Settings, LogOut, PlusCircle } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const menuItems = [
    { name: "Dashboard", icon: <LayoutDashboard size={20} />, path: "/admin" },
    { name: "Properties", icon: <Home size={20} />, path: "/admin/properties" },
    { name: "Inquiries", icon: <Mail size={20} />, path: "/admin/inquiries" },
    { name: "Analytics", icon: <BarChart3 size={20} />, path: "/admin/analytics" },
  ];

  return (
    <div className="flex min-h-screen bg-[#F8FAFC]">
      {/* 🏙️ SIDEBAR (LuxeLair Theme) */}
      <aside className="w-64 bg-white border-r border-slate-100 flex flex-col sticky top-0 h-screen">
        <div className="p-8">
          <h1 className="text-2xl font-black italic uppercase tracking-tighter text-slate-900">
            Luxe<span className="text-blue-600">Admin.</span>
          </h1>
        </div>

        <nav className="flex-1 px-4 space-y-2">
          {menuItems.map((item) => (
            <Link 
              key={item.path} 
              href={item.path}
              className={`flex items-center gap-4 px-6 py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all ${pathname === item.path ? "bg-blue-600 text-white shadow-xl shadow-blue-100" : "text-slate-400 hover:bg-slate-50 hover:text-slate-900"}`}
            >
              {item.icon} {item.name}
            </Link>
          ))}
        </nav>

        <div className="p-8 space-y-4">
          <Link href="/admin/add-property" className="flex items-center justify-center gap-2 w-full py-4 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-600 transition-all">
            <PlusCircle size={14} /> New Listing
          </Link>
          <button className="flex items-center gap-4 px-6 py-4 text-red-400 text-[11px] font-black uppercase tracking-widest">
            <LogOut size={20} /> Exit
          </button>
        </div>
      </aside>

      {/* 🚀 MAIN CONTENT AREA */}
      <main className="flex-1 p-10 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}