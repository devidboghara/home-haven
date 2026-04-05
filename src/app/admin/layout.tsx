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
  Home,
  Menu,
  X,
  PanelLeftClose,
  PanelLeft,
} from "lucide-react";

// ── Nav Structure ─────────────────────────────────────────────────────────────

const navGroups = [
  {
    label: "Menu",
    items: [
      { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
      { label: "Pipeline", href: "/admin/pipeline", icon: GitBranch, badge: "10" },
      { label: "Properties", href: "/admin/properties", icon: Building2 },
      { label: "Agents", href: "/admin/agents", icon: UserCheck },
      { label: "Contacts", href: "/admin/contacts", icon: Users },
      { label: "Customers", href: "/admin/customers", icon: Users },
      { label: "Orders", href: "/admin/orders", icon: ShoppingCart },
      { label: "Transactions", href: "/admin/transactions", icon: ArrowLeftRight },
      { label: "Reviews", href: "/admin/reviews", icon: Star },
      { label: "Messages", href: "/admin/messages", icon: MessageSquare, badge: "5" },
      { label: "Inbox", href: "/admin/inbox", icon: Inbox },
    ],
  },
  {
    label: "Management",
    items: [
      { label: "Offers", href: "/admin/offers", icon: Tag },
      { label: "Contracts", href: "/admin/contracts", icon: FileText },
      { label: "Calendar", href: "/admin/calendar", icon: CalendarDays },
      { label: "Reports", href: "/admin/reports", icon: BarChart3 },
    ],
  },
  {
    label: "Settings",
    items: [
      { label: "Team", href: "/admin/team", icon: Users2 },
      { label: "Profile", href: "/admin/profile", icon: UserCircle },
      { label: "Settings", href: "/admin/settings", icon: Settings },
    ],
  },
];

// ── Nav Item ──────────────────────────────────────────────────────────────────

function NavItem({
  item,
  isActive,
  collapsed,
}: {
  item: {
    label: string;
    href: string;
    icon: React.ElementType;
    badge?: string;
  };
  isActive: boolean;
  collapsed: boolean;
}) {
  const Icon = item.icon;

  return (
    <Link
      href={item.href}
      title={collapsed ? item.label : undefined}
      className={`
        flex items-center gap-2.5 px-3 py-2 rounded-xl text-[13px] font-medium
        transition-all duration-150 group relative
        ${
          isActive
            ? "bg-[#111] text-white shadow-sm"
            : "text-[#7C7870] hover:bg-[#F0EDE6] hover:text-[#111]"
        }
      `}
    >
      <Icon
        size={15}
        className={`shrink-0 transition-colors ${
          isActive
            ? "text-white"
            : "text-[#A8A49C] group-hover:text-[#111]"
        }`}
      />

      {!collapsed && (
        <>
          <span className="flex-1 truncate">{item.label}</span>
          {item.badge && (
            <span className="bg-indigo-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full leading-none">
              {item.badge}
            </span>
          )}
        </>
      )}

      {/* Tooltip when collapsed */}
      {collapsed && (
        <div className="
          absolute left-full ml-3 px-2.5 py-1.5
          bg-[#111] text-white text-[12px] font-medium
          rounded-lg whitespace-nowrap z-50 shadow-xl
          opacity-0 pointer-events-none group-hover:opacity-100
          transition-opacity duration-100
        ">
          {item.label}
          {item.badge && (
            <span className="ml-1.5 bg-indigo-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full">
              {item.badge}
            </span>
          )}
          {/* Arrow */}
          <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-[#111]" />
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

  return (
    <div
      className={`flex h-screen overflow-hidden ${
        darkMode ? "bg-[#0f1117]" : "bg-[#F4F5F7]"
      }`}
    >
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-30 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* ── Sidebar ── */}
      <aside
        className={`
          ${collapsed ? "w-[68px]" : "w-[240px]"}
          flex flex-col shrink-0 transition-all duration-300 ease-in-out z-40
          fixed lg:relative h-full
          ${mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
          bg-[#FAFAF8] border-r border-[#E8E6E0]
        `}
      >
        {/* Logo */}
        <div
          className={`flex items-center gap-2.5 px-4 py-5 border-b border-[#EDEAE3] shrink-0 ${
            collapsed ? "justify-center px-0" : ""
          }`}
        >
          <div className="w-[34px] h-[34px] rounded-xl bg-[#111] flex items-center justify-center shrink-0">
            <Home size={15} className="text-white" />
          </div>
          {!collapsed && (
            <div>
              <p className="text-[15px] font-bold text-[#111] tracking-tight leading-none">
                Home<span className="text-indigo-500">Haven</span>
              </p>
              <p className="text-[10px] text-[#A8A49C] tracking-widest uppercase mt-0.5">
                Admin Panel
              </p>
            </div>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-4 px-2.5 space-y-5 scrollbar-none">
          {navGroups.map((group) => (
            <div key={group.label}>
              {!collapsed && (
                <p className="text-[10px] font-bold text-[#C5BFB5] tracking-widest uppercase px-3 mb-2">
                  {group.label}
                </p>
              )}
              {collapsed && <div className="border-t border-[#EDEAE3] mb-2" />}
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

        {/* User profile at bottom */}
        {!collapsed && (
          <div className="border-t border-[#EDEAE3] p-3 shrink-0">
            <Link
              href="/admin/profile"
              className="flex items-center gap-2.5 px-2 py-2 rounded-xl hover:bg-[#F0EDE6] transition-colors group"
            >
              <div className="w-8 h-8 rounded-full bg-[#111] flex items-center justify-center text-white text-[11px] font-bold shrink-0">
                AD
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[12px] font-bold text-[#111] truncate">
                  Admin User
                </p>
                <p className="text-[10px] text-[#A8A49C] truncate">
                  Super Admin
                </p>
              </div>
              <Settings
                size={13}
                className="text-[#C5BFB5] group-hover:text-[#7C7870] shrink-0"
              />
            </Link>
          </div>
        )}

        {/* Collapse toggle */}
        <div
          className={`hidden lg:flex border-t border-[#EDEAE3] p-2.5 shrink-0 ${
            collapsed ? "justify-center" : ""
          }`}
        >
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="flex items-center gap-2 px-3 py-2 rounded-xl text-[#A8A49C] hover:bg-[#F0EDE6] hover:text-[#111] transition-colors text-[12px] font-medium w-full"
          >
            {collapsed ? (
              <PanelLeft size={14} />
            ) : (
              <>
                <PanelLeftClose size={14} />
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
            bg-white border-b border-[#E8E6E0]
          `}
        >
          {/* Mobile toggle */}
          <button
            className="lg:hidden p-2 rounded-xl text-[#7C7870] hover:bg-[#F4F5F7] transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            <Menu size={18} />
          </button>

          {/* Desktop sidebar toggle */}
          <button
            className="hidden lg:flex p-2 rounded-xl text-[#7C7870] hover:bg-[#F4F5F7] transition-colors"
            onClick={() => setCollapsed(!collapsed)}
          >
            <Menu size={18} />
          </button>

          {/* Search */}
          <div className="flex-1 max-w-[380px]">
            {searchOpen ? (
              <div className="flex items-center gap-2 bg-[#F4F5F7] rounded-xl px-3 py-2 border border-[#E0DDD8]">
                <Search size={14} className="text-[#A8A49C] shrink-0" />
                <input
                  autoFocus
                  type="text"
                  placeholder="Search properties, agents, deals..."
                  className="bg-transparent text-[13px] text-[#111] placeholder-[#C5BFB5] outline-none w-full"
                  onBlur={() => setSearchOpen(false)}
                />
                <button
                  onClick={() => setSearchOpen(false)}
                  className="text-[#A8A49C] hover:text-[#111]"
                >
                  <X size={13} />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setSearchOpen(true)}
                className="flex items-center gap-2 bg-[#F4F5F7] rounded-xl px-3 py-2 text-[#A8A49C] text-[13px] w-full hover:bg-[#EDEAE3] transition-colors border border-transparent hover:border-[#E0DDD8]"
              >
                <Search size={14} />
                <span>Search...</span>
                <span className="ml-auto text-[11px] bg-[#E8E6E0] text-[#A8A49C] px-1.5 py-0.5 rounded-md font-medium">
                  ⌘K
                </span>
              </button>
            )}
          </div>

          <div className="ml-auto flex items-center gap-1">
            {/* Dark mode */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-xl text-[#7C7870] hover:bg-[#F4F5F7] transition-colors"
              title="Toggle dark mode"
            >
              {darkMode ? <Sun size={17} /> : <Moon size={17} />}
            </button>

            {/* Fullscreen */}
            <button
              className="p-2 rounded-xl text-[#7C7870] hover:bg-[#F4F5F7] transition-colors"
              title="Fullscreen"
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
            <button className="relative p-2 rounded-xl text-[#7C7870] hover:bg-[#F4F5F7] transition-colors">
              <Bell size={17} />
              {notifications > 0 && (
                <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-indigo-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                  {notifications}
                </span>
              )}
            </button>

            {/* Settings */}
            <Link
              href="/admin/settings"
              className="p-2 rounded-xl text-[#7C7870] hover:bg-[#F4F5F7] transition-colors"
            >
              <Settings size={17} />
            </Link>

            {/* Divider */}
            <div className="w-px h-6 bg-[#E8E6E0] mx-1" />

            {/* Avatar */}
            <Link
              href="/admin/profile"
              className="flex items-center gap-2 pl-1 rounded-xl hover:bg-[#F4F5F7] px-2 py-1.5 transition-colors group"
            >
              <div className="w-7 h-7 rounded-full bg-[#111] flex items-center justify-center text-white text-[11px] font-bold">
                AD
              </div>
              <div className="hidden sm:block">
                <p className="text-[12px] font-bold text-[#111] leading-none">
                  Admin
                </p>
                <p className="text-[10px] text-[#A8A49C] mt-0.5">
                  Super Admin
                </p>
              </div>
              <ChevronDown
                size={12}
                className="text-[#C5BFB5] hidden sm:block"
              />
            </Link>
          </div>
        </header>

        {/* ── Page content ── */}
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}