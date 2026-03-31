"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  LayoutDashboard,
  Tag,
  Mail,
  Calendar,
  FileText,
  Users,
  BookUser,
  TrendingUp,
  Bell,
  BarChart2,
  UserCircle,
  Plus,
  ChevronDown,
  Building2,
} from "lucide-react";

const navItems = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Offers", href: "/admin/offers", icon: Tag },
  { label: "Email Inbox", href: "/admin/inbox", icon: Mail },
  { label: "Calendar", href: "/admin/calendar", icon: Calendar },
  { label: "Contract Templates", href: "/admin/contracts", icon: FileText },
  {
    label: "Team",
    href: "/admin/team",
    icon: Users,
    hasDropdown: true,
  },
  { label: "Contacts", href: "/admin/contacts", icon: BookUser },
];

const bottomNav = [
  {
    label: "Sales Pipeline",
    href: "/admin/pipeline",
    icon: TrendingUp,
    hasDropdown: true,
  },
  { label: "Notifications", href: "/admin/notifications", icon: Bell },
  { label: "Reports", href: "/admin/reports", icon: BarChart2 },
];

const profileNav = [
  { label: "Profile", href: "/admin/profile", icon: UserCircle },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [activeProject] = useState("Hudson 8");

  return (
    <div className="flex h-screen bg-[#F2F2F0] font-sans overflow-hidden">
      {/* Sidebar */}
      <aside className="w-[260px] min-w-[260px] bg-white flex flex-col border-r border-[#E5E5E0] z-10">
        {/* Logo + Project Header */}
        <div className="flex items-center gap-3 px-5 py-5 border-b border-[#E5E5E0]">
          <div className="w-8 h-8 bg-black rounded-sm flex items-center justify-center">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path
                d="M8 1L1 8l7 7 7-7-7-7z"
                fill="#FFD600"
                stroke="#FFD600"
                strokeWidth="0.5"
              />
            </svg>
          </div>
          <span className="text-[15px] font-semibold text-[#111] tracking-tight">
            {activeProject}
          </span>
        </div>

        {/* Tabs: General / Project */}
        <div className="flex items-center gap-1 px-4 py-3 border-b border-[#E5E5E0]">
          <div className="w-8 h-8 bg-[#FFD600] rounded-sm flex items-center justify-center font-bold text-[13px] text-black">
            H
          </div>
          <div className="flex ml-2 rounded-md overflow-hidden border border-[#E5E5E0] text-[12px] font-medium">
            <Link
              href="/admin"
              className="px-3 py-1.5 bg-[#111] text-white hover:bg-[#222] transition-colors"
            >
              General
            </Link>
            <Link
              href="/admin/project"
              className="px-3 py-1.5 bg-white text-[#555] hover:bg-[#F5F5F3] transition-colors"
            >
              Project
            </Link>
          </div>
          <button className="ml-auto w-6 h-6 flex items-center justify-center rounded hover:bg-[#F2F2F0]">
            <Plus size={14} className="text-[#888]" />
          </button>
        </div>

        {/* Main Nav */}
        <nav className="flex-1 overflow-y-auto py-2 px-2">
          <div className="space-y-0.5">
            {navItems.map(({ label, href, icon: Icon, hasDropdown }) => {
              const isActive = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  className={`flex items-center gap-3 px-3 py-2 rounded-md text-[13px] font-medium transition-colors group ${
                    isActive
                      ? "bg-[#F2F2F0] text-[#111]"
                      : "text-[#666] hover:bg-[#F5F5F3] hover:text-[#111]"
                  }`}
                >
                  <Icon size={15} className={isActive ? "text-[#111]" : "text-[#999]"} />
                  <span className="flex-1">{label}</span>
                  {hasDropdown && (
                    <ChevronDown size={12} className="text-[#BBB]" />
                  )}
                </Link>
              );
            })}
          </div>

          <div className="my-3 border-t border-[#E5E5E0]" />

          <div className="space-y-0.5">
            {bottomNav.map(({ label, href, icon: Icon, hasDropdown }) => {
              const isActive = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  className={`flex items-center gap-3 px-3 py-2 rounded-md text-[13px] font-medium transition-colors ${
                    isActive
                      ? "bg-[#F2F2F0] text-[#111]"
                      : "text-[#666] hover:bg-[#F5F5F3] hover:text-[#111]"
                  }`}
                >
                  <Icon size={15} className={isActive ? "text-[#111]" : "text-[#999]"} />
                  <span className="flex-1">{label}</span>
                  {hasDropdown && (
                    <ChevronDown size={12} className="text-[#BBB]" />
                  )}
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Profile at bottom */}
        <div className="border-t border-[#E5E5E0] px-2 py-2">
          {profileNav.map(({ label, href, icon: Icon }) => {
            const isActive = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-3 px-3 py-2 rounded-md text-[13px] font-medium transition-colors ${
                  isActive
                    ? "bg-[#F2F2F0] text-[#111]"
                    : "text-[#666] hover:bg-[#F5F5F3] hover:text-[#111]"
                }`}
              >
                <Icon size={15} className={isActive ? "text-[#111]" : "text-[#999]"} />
                <span>{label}</span>
              </Link>
            );
          })}
        </div>
      </aside>

      {/* Main content area */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="h-14 bg-white border-b border-[#E5E5E0] flex items-center px-6 gap-4 shrink-0">
          <div className="flex items-center gap-2 text-[13px] text-[#888]">
            <Building2 size={14} />
            <span>Real Estate Admin</span>
            <span className="text-[#CCC]">/</span>
            <span className="text-[#111] font-medium">Hudson 8</span>
          </div>
          <div className="ml-auto flex items-center gap-3">
            <button className="relative w-8 h-8 flex items-center justify-center rounded-full hover:bg-[#F2F2F0]">
              <Bell size={16} className="text-[#666]" />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-[#FFD600] rounded-full" />
            </button>
            <div className="w-8 h-8 rounded-full bg-[#111] flex items-center justify-center text-white text-[11px] font-bold">
              AD
            </div>
          </div>
        </header>

        {/* Page content */}
        <div className="flex-1 overflow-y-auto">{children}</div>
      </main>
    </div>
  );
}