"use client";

import { ReactNode } from "react";
import {
  LayoutGrid,
  Home,
  Briefcase,
  Users,
  MessageSquare,
  BarChart3,
  Settings,
} from "lucide-react";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-screen bg-[#f5f6f8]">

      {/* SIDEBAR */}
      <aside className="w-[240px] bg-white border-r border-[#e5e7eb] px-4 py-6 flex flex-col justify-between">

        <div>
          <div className="flex items-center gap-3 mb-8">
            <div className="w-8 h-8 bg-black text-white flex items-center justify-center rounded-md text-xs font-bold">
              B
            </div>
            <span className="text-sm font-medium">Keyvan Akath</span>
          </div>

          <p className="text-[10px] text-gray-400 mb-2">CRM</p>

          <nav className="space-y-1 text-sm">
            <SidebarItem icon={<Home size={16} />} label="Properties" />
            <SidebarItem icon={<Briefcase size={16} />} label="Deals" active />
            <SidebarItem icon={<Users size={16} />} label="Leads" />
            <SidebarItem icon={<LayoutGrid size={16} />} label="Tasks" />
            <SidebarItem icon={<Users size={16} />} label="Contacts" />
            <SidebarItem icon={<MessageSquare size={16} />} label="Messages" />
          </nav>

          <p className="text-[10px] text-gray-400 mt-6 mb-2">ANALYTICS</p>

          <nav className="space-y-1 text-sm">
            <SidebarItem icon={<BarChart3 size={16} />} label="Sales Analytics" />
            <SidebarItem icon={<BarChart3 size={16} />} label="Agent Performance" />
            <SidebarItem icon={<BarChart3 size={16} />} label="Conversion Funnel" />
          </nav>
        </div>

        <div className="text-sm space-y-2">
          <SidebarItem icon={<Settings size={16} />} label="Settings" />
        </div>
      </aside>

      {/* MAIN */}
      <div className="flex-1 flex flex-col">

        {/* TOPBAR */}
        <header className="h-[64px] bg-white border-b border-[#e5e7eb] flex items-center justify-between px-6">

          <input
            placeholder="Search by client, phone or property ID"
            className="bg-[#f3f4f6] px-4 py-2 rounded-lg w-[420px] text-sm outline-none"
          />

          <div className="flex items-center gap-3">
            <button className="border px-3 py-2 rounded-lg text-sm bg-white">
              🇦🇪 United Arab Emirates
            </button>

            <button className="border px-3 py-2 rounded-lg text-sm">
              + Invite Member
            </button>
          </div>
        </header>

        {/* CONTENT */}
        <main className="flex-1 overflow-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}

function SidebarItem({ icon, label, active }: any) {
  return (
    <div
      className={`flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer ${
        active
          ? "bg-[#f3f4f6] text-black font-medium"
          : "text-gray-500 hover:bg-[#f9fafb]"
      }`}
    >
      {icon}
      {label}
    </div>
  );
}