"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import {
  LayoutDashboard,
  GitBranch,
  Building2,
  Users,
  UserCheck,
  ShoppingCart,
  ArrowLeftRight,
  Star,
  MessageSquare,
  Inbox,
  Tag,
  FileText,
  CalendarDays,
  BarChart3,
  Users2,
  UserCircle,
  Settings,
  Bell,
  Search,
  Moon,
  Sun,
  Maximize2,
  ChevronDown,
  ChevronRight,
  Home,
  Menu,
  X,
} from "lucide-react";

// ── Nav Structure ─────────────────────────────────────────────────────────────

const navGroups = [
  {
    label: "MENU",
    items: [
      { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
      { label: "Pipeline", href: "/admin/pipeline", icon: GitBranch },
      { label: "Properties", href: "/admin/properties", icon: Building2 },
      { label: "Agents", href: "/admin/agents", icon: UserCheck },
      { label: "Customers", href: "/admin/customers", icon: Users },
      { label: "Orders", href: "/admin/orders", icon: ShoppingCart },
      { label: "Transactions", href: "/admin/transactions", icon: ArrowLeftRight },
      { label: "Reviews", href: "/admin/reviews", icon: Star },
      { label: "Messages", href: "/admin/messages", icon: MessageSquare },
      { label: "Inbox", href: "/admin/inbox", icon: Inbox },
    ],
  },
  {
    label: "MANAGEMENT",
    items: [
      { label: "Offers", href: "/admin/offers", icon: Tag },
      { label: "Contracts", href: "/admin/contracts", icon: FileText },
      { label: "Calendar", href: "/admin/calendar", icon: CalendarDays },
      { label: "Reports", href: "/admin/reports", icon: BarChart3 },
    ],
  },
  {
    label: "SETTINGS",
    items: [
      { label: "Team", href: "/admin/team", icon: Users2 },
      { label: "Profile", href: "/admin/profile", icon: UserCircle },
      { label: "Settings", href: "/admin/settings", icon: Settings },
    ],
  },
];

// ── Sidebar Nav Item ──────────────────────────────────────────────────────────

function NavItem({
  item,
  isActive,
  collapsed,
}: {
  item: { label: string; href: string; icon: React.ElementType };
  isActive: boolean;
  collapsed: boolean;
}) {
  const Icon = item.icon;
  return (
    <Link
      href={item.href}
      title={collapsed ? item.label : undefined}
      className={`
        flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] font-medium
        transition-all duration-150 group relative
        ${
          isActive
            ? "bg-indigo-600 text-white shadow-lg shadow-indigo-900/30"
            : "text-[#8b8fa8] hover:bg-white/5 hover:text-white"
        }
      `}
    >
      <Icon
        size={16}
        className={`shrink-0 ${
          isActive ? "text-white" : "text-[#8b8fa8] group-hover:text-white"
        }`}
      />
      {!collapsed && <span className="truncate">{item.label}</span>}

      {/* Tooltip when collapsed */}
      {collapsed && (
        <div
          className="
            absolute left-full ml-3 px-2.5 py-1.5 bg-[#111318] text-white text-[12px]
            font-medium rounded-md whitespace-nowrap opacity-0 pointer-events-none
            group-hover:opacity-100 transition-opacity z-50 shadow-xl border border-white/10
          "
        >
          {item.label}
        </div>
      )}
    </Link>
  );
}

// ── Layout ────────────────────────────────────────────────────────────────────

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [notifications] = useState(3);
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const sidebarWidth = collapsed ? "w-[68px]" : "w-[240px]";

  return (
    <div
      className={`flex h-screen overflow-hidden ${
        darkMode ? "bg-[#0f1117]" : "bg-[#F4F5F7]"
      }`}
    >
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* ── Sidebar ── */}
      <aside
        className={`
          ${sidebarWidth} bg-[#1a1d23] flex flex-col shrink-0
          transition-all duration-300 ease-in-out z-40
          fixed lg:relative h-full
          ${mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        {/* Logo */}
        <div
          className={`flex items-center gap-3 px-4 py-5 border-b border-white/5 ${
            collapsed ? "justify-center" : ""
          }`}
        >
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center shrink-0 shadow-lg shadow-indigo-900/40">
            <Home size={16} className="text-white" />
          </div>
          {!collapsed && (
            <div>
              <p className="text-white text-[15px] font-bold tracking-tight leading-none">
                Home<span className="text-indigo-400">Haven</span>
              </p>
              <p className="text-[#8b8fa8] text-[10px] tracking-widest uppercase mt-0.5">
                Admin Panel
              </p>
            </div>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-6 scrollbar-none">
          {navGroups.map((group) => (
            <div key={group.label}>
              {!collapsed ? (
                <p className="text-[10px] font-semibold text-[#4a4d5e] tracking-widest uppercase px-3 mb-2">
                  {group.label}
                </p>
              ) : (
                <div className="border-t border-white/5 mb-2" />
              )}
              <div className="space-y-0.5">
                {group.items.map((item) => (
                  <NavItem
                    key={item.href}
                    item={item}
                    isActive={pathname === item.href}
                    collapsed={collapsed}
                  />
                ))}
              </div>
            </div>
          ))}
        </nav>

        {/* Collapse toggle */}
        <div className="hidden lg:flex border-t border-white/5 p-3">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-[#8b8fa8] hover:bg-white/5 hover:text-white transition-colors text-[12px] font-medium"
          >
            {collapsed ? (
              <ChevronRight size={14} />
            ) : (
              <>
                <ChevronDown size={14} className="rotate-90" />
                <span>Collapse</span>
              </>
            )}
          </button>
        </div>
      </aside>

      {/* ── Main area ── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

        {/* ── Topbar ── */}
        <header
          className={`
            h-[60px] shrink-0 flex items-center gap-3 px-5
            ${
              darkMode
                ? "bg-[#1a1d23] border-white/5"
                : "bg-white border-[#E8E9EC]"
            }
            border-b
          `}
        >
          {/* Mobile toggle */}
          <button
            className="lg:hidden p-2 rounded-lg text-[#666] hover:bg-[#F4F5F7] transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            <Menu size={18} />
          </button>

          {/* Desktop sidebar toggle */}
          <button
            className="hidden lg:flex p-2 rounded-lg text-[#666] hover:bg-[#F4F5F7] transition-colors"
            onClick={() => setCollapsed(!collapsed)}
          >
            <Menu size={18} />
          </button>

          {/* Search */}
          <div className="flex-1 max-w-[400px]">
            {searchOpen ? (
              <div className="flex items-center gap-2 bg-[#F4F5F7] rounded-lg px-3 py-2">
                <Search size={14} className="text-[#999] shrink-0" />
                <input
                  autoFocus
                  type="text"
                  placeholder="Search properties, agents, deals..."
                  className="bg-transparent text-[13px] text-[#333] placeholder-[#AAA] outline-none w-full"
                  onBlur={() => setSearchOpen(false)}
                />
                <button onClick={() => setSearchOpen(false)}>
                  <X size={14} className="text-[#999]" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setSearchOpen(true)}
                className="flex items-center gap-2 bg-[#F4F5F7] rounded-lg px-3 py-2 text-[#AAA] text-[13px] w-full hover:bg-[#EEEEF0] transition-colors"
              >
                <Search size={14} />
                <span>Search...</span>
              </button>
            )}
          </div>

          <div className="ml-auto flex items-center gap-1">
            {/* Dark mode */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-lg text-[#666] hover:bg-[#F4F5F7] transition-colors"
            >
              {darkMode ? <Sun size={17} /> : <Moon size={17} />}
            </button>

            {/* Fullscreen */}
            <button
              className="p-2 rounded-lg text-[#666] hover:bg-[#F4F5F7] transition-colors"
              onClick={() => {
                if (!document.fullscreenElement) {
                  document.documentElement.requestFullscreen();
                } else {
                  document.exitFullscreen();
                }
              }}
            >
              <Maximize2 size={17} />
            </button>

            {/* Notifications */}
            <button className="relative p-2 rounded-lg text-[#666] hover:bg-[#F4F5F7] transition-colors">
              <Bell size={17} />
              {notifications > 0 && (
                <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-indigo-600 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                  {notifications}
                </span>
              )}
            </button>

            {/* Settings link */}
            <Link
              href="/admin/settings"
              className="p-2 rounded-lg text-[#666] hover:bg-[#F4F5F7] transition-colors"
            >
              <Settings size={17} />
            </Link>

            <div className="w-px h-6 bg-[#E8E9EC] mx-1" />

            {/* Avatar */}
            <Link
              href="/admin/profile"
              className="flex items-center gap-2 pl-1 group"
            >
              <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white text-[12px] font-bold shadow-md">
                AD
              </div>
              <div className="hidden sm:block">
                <p className="text-[12px] font-semibold text-[#111] leading-none">
                  Admin
                </p>
                <p className="text-[10px] text-[#AAA] mt-0.5">Super Admin</p>
              </div>
              <ChevronDown size={12} className="text-[#AAA] hidden sm:block" />
            </Link>
          </div>
        </header>

        {/* ── Page content ── */}
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}