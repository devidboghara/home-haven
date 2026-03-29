"use client";

import { ReactNode } from "react";
import {
  LayoutDashboard,
  Home,
  Users,
  MessageSquare,
  Settings,
} from "lucide-react";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-screen bg-[#f6f7f9]">

      {/* SIDEBAR */}
      <aside className="w-64 bg-white border-r border-gray-200 p-5 flex flex-col justify-between">
        
        <div>
          <h1 className="text-xl font-bold mb-10">🏠 Estate</h1>

          <nav className="space-y-3 text-sm">
            <SidebarItem icon={<LayoutDashboard size={18} />} label="Deals" active />
            <SidebarItem icon={<Home size={18} />} label="Properties" />
            <SidebarItem icon={<Users size={18} />} label="Clients" />
            <SidebarItem icon={<MessageSquare size={18} />} label="Messages" />
          </nav>
        </div>

        <div className="space-y-3 text-sm">
          <SidebarItem icon={<Settings size={18} />} label="Settings" />
        </div>
      </aside>

      {/* MAIN AREA */}
      <div className="flex-1 flex flex-col">

        {/* TOPBAR */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
          <input
            placeholder="Search by client, phone or property ID"
            className="bg-gray-100 px-4 py-2 rounded-lg w-1/3 text-sm outline-none"
          />

          <div className="flex items-center gap-4">
            <button className="bg-gray-100 px-3 py-2 rounded-lg text-sm">
              UAE 🇦🇪
            </button>
            <button className="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm">
              + Invite Member
            </button>
          </div>
        </header>

        {/* PAGE CONTENT */}
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}

function SidebarItem({ icon, label, active }: any) {
  return (
    <div
      className={`flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer ${
        active ? "bg-gray-100 font-semibold" : "text-gray-500 hover:bg-gray-50"
      }`}
    >
      {icon}
      {label}
    </div>
  );
}