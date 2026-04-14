"use client";

import { useEffect, useState } from "react";
import {
  Bell, Check, CheckCheck, Trash2, RefreshCw,
  AlertCircle, Home, Users, GitBranch, FileText,
  CreditCard, Calendar, Settings, Workflow,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import type { Notification, NotificationType } from "@/lib/supabase";

// ── Config ────────────────────────────────────────────────────────────────────

const TYPE_CFG: Record<
  NotificationType,
  { icon: React.ElementType; color: string; bg: string }
> = {
  new_lead:       { icon: Users,      color: "text-indigo-600",  bg: "bg-indigo-100"  },
  offer_update:   { icon: Home,       color: "text-emerald-600", bg: "bg-emerald-100" },
  deal_closed:    { icon: GitBranch,  color: "text-violet-600",  bg: "bg-violet-100"  },
  task_due:       { icon: CheckCheck, color: "text-amber-600",   bg: "bg-amber-100"   },
  appointment:    { icon: Calendar,   color: "text-blue-600",    bg: "bg-blue-100"    },
  contract:       { icon: FileText,   color: "text-rose-600",    bg: "bg-rose-100"    },
  payment:        { icon: CreditCard, color: "text-teal-600",    bg: "bg-teal-100"    },
  system:         { icon: Settings,   color: "text-slate-600",   bg: "bg-slate-100"   },
  workflow:       { icon: Workflow,   color: "text-orange-600",  bg: "bg-orange-100"  },
};

// ── Mock data ─────────────────────────────────────────────────────────────────

const MOCK_NOTIFICATIONS: Notification[] = [
  { id: "n1",  user_id: "u1", title: "New lead assigned",          body: "Thomas Morrison has been assigned to you as a new buyer lead.",          type: "new_lead",     is_read: false, link: "/admin/leads",        related_id: null, related_type: null, created_at: new Date(Date.now() - 600000).toISOString()    },
  { id: "n2",  user_id: "u1", title: "Offer updated",              body: "Counter offer of CA$472,000 received on 42 Maple Street.",               type: "offer_update", is_read: false, link: "/admin/offers",       related_id: null, related_type: null, created_at: new Date(Date.now() - 1800000).toISOString()   },
  { id: "n3",  user_id: "u1", title: "Deal closed",                body: "Congratulations! Deal on 8 Oakridge Terrace has been closed.",           type: "deal_closed",  is_read: false, link: "/admin/pipeline",     related_id: null, related_type: null, created_at: new Date(Date.now() - 3600000).toISOString()   },
  { id: "n4",  user_id: "u1", title: "Task due today",             body: "Follow up with Aisha Patel regarding Vancouver listing ROI analysis.",   type: "task_due",     is_read: true,  link: "/admin/leads",        related_id: null, related_type: null, created_at: new Date(Date.now() - 7200000).toISOString()   },
  { id: "n5",  user_id: "u1", title: "Appointment reminder",       body: "Site visit at 42 Maple Street tomorrow at 10:00 AM with Thomas Morrison.",type: "appointment",  is_read: true,  link: "/admin/leads",        related_id: null, related_type: null, created_at: new Date(Date.now() - 86400000).toISOString()  },
  { id: "n6",  user_id: "u1", title: "Contract sent for signing",  body: "Purchase agreement for 5 Birchwood Court has been sent to Marcus Reid.", type: "contract",     is_read: true,  link: "/admin/documents",    related_id: null, related_type: null, created_at: new Date(Date.now() - 2*86400000).toISOString()},
  { id: "n7",  user_id: "u1", title: "Payment received",           body: "Deposit of CA$48,000 received for 11 Rosewood Blvd transaction.",        type: "payment",      is_read: true,  link: "/admin/payments",     related_id: null, related_type: null, created_at: new Date(Date.now() - 3*86400000).toISOString()},
  { id: "n8",  user_id: "u1", title: "System update",              body: "HomeHaven has been updated to the latest version. New features available.",type: "system",      is_read: true,  link: null,                  related_id: null, related_type: null, created_at: new Date(Date.now() - 4*86400000).toISOString()},
];

// ── Helpers ───────────────────────────────────────────────────────────────────

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  const h = Math.floor(diff / 3600000);
  const d = Math.floor(diff / 86400000);
  if (m < 1)   return "just now";
  if (m < 60)  return `${m}m ago`;
  if (h < 24)  return `${h}h ago`;
  if (d < 7)   return `${d}d ago`;
  return new Date(iso).toLocaleDateString("en-CA", { month: "short", day: "numeric" });
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>(MOCK_NOTIFICATIONS);
  const [unreadCount, setUnreadCount] = useState(
    MOCK_NOTIFICATIONS.filter((n) => !n.is_read).length
  );
  const [usingMock, setUsingMock] = useState(true);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "unread">("all");

  // Fetch notifications from Supabase
  useEffect(() => {
    const fetchNotifications = async () => {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("notifications")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (!error && data && data.length > 0) {
        setNotifications(data);
        setUnreadCount(data.filter((n: Notification) => !n.is_read).length);
        setUsingMock(false);
      }
      setLoading(false);
    };

    fetchNotifications();
  }, []);

  // Supabase Realtime subscription for new notifications
  useEffect(() => {
    const channel = supabase
      .channel("notifications-realtime")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "notifications" },
        () => {
          setUnreadCount((c) => c + 1);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handleMarkRead = async (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
    );
    setUnreadCount((c) => Math.max(0, c - 1));

    if (!usingMock) {
      await supabase.from("notifications").update({ is_read: true }).eq("id", id);
    }
  };

  const handleMarkAllRead = async () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
    setUnreadCount(0);

    if (!usingMock) {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase
          .from("notifications")
          .update({ is_read: true })
          .eq("user_id", user.id);
      }
    }
  };

  const handleDelete = (id: string) => {
    const n = notifications.find((n) => n.id === id);
    if (n && !n.is_read) setUnreadCount((c) => Math.max(0, c - 1));
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const filtered = filter === "unread"
    ? notifications.filter((n) => !n.is_read)
    : notifications;

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-6 py-5 border-b border-[#E8E6E0] bg-white flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <h1 className="text-[20px] font-bold text-[#111] tracking-tight">Notifications</h1>
          {unreadCount > 0 && (
            <span className="bg-indigo-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
              {unreadCount}
            </span>
          )}
          <p className="text-[13px] text-[#A8A49C]">Dashboard › Notifications</p>
        </div>
        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllRead}
              className="flex items-center gap-2 border border-[#E8E6E0] rounded-xl px-4 py-2 text-[13px] font-semibold text-[#7C7870] hover:bg-[#F4F5F7] transition-colors"
            >
              <CheckCheck size={14} /> Mark all read
            </button>
          )}
        </div>
      </div>

      {/* Sample data banner */}
      {usingMock && !loading && (
        <div className="px-6 py-2.5 bg-amber-50 border-b border-amber-200 flex items-center gap-2">
          <AlertCircle size={14} className="text-amber-600" />
          <span className="text-[13px] text-amber-700">Showing sample data</span>
        </div>
      )}

      {/* Filter tabs */}
      <div className="px-6 py-3 bg-white border-b border-[#E8E6E0] flex items-center gap-1">
        {(["all", "unread"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`text-[12px] font-semibold px-3 py-1.5 rounded-lg transition-colors capitalize ${
              filter === f
                ? "bg-[#111] text-white"
                : "text-[#7C7870] hover:bg-[#F4F5F7]"
            }`}
          >
            {f}
            {f === "unread" && unreadCount > 0 && (
              <span className="ml-1.5 bg-indigo-100 text-indigo-700 text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                {unreadCount}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Notifications list */}
      <div className="flex-1 overflow-y-auto p-6">
        {loading ? (
          <div className="flex items-center justify-center h-40 gap-2 text-[#A8A49C]">
            <RefreshCw size={18} className="animate-spin" />
            <span className="text-[14px]">Loading notifications…</span>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-40 gap-3 text-[#A8A49C]">
            <Bell size={32} className="opacity-30" />
            <p className="text-[14px]">
              {filter === "unread" ? "No unread notifications" : "No notifications yet"}
            </p>
          </div>
        ) : (
          <div className="space-y-2 max-w-3xl">
            {filtered.map((n) => {
              const cfg = TYPE_CFG[n.type] ?? TYPE_CFG.system;
              const Icon = cfg.icon;
              return (
                <div
                  key={n.id}
                  className={`flex items-start gap-4 p-4 rounded-xl border transition-colors ${
                    n.is_read
                      ? "bg-white border-[#E8E6E0]"
                      : "bg-indigo-50/50 border-indigo-200"
                  }`}
                >
                  {/* Icon */}
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${cfg.bg}`}
                  >
                    <Icon size={16} className={cfg.color} />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <p
                        className={`text-[13px] leading-snug ${
                          n.is_read ? "font-medium text-[#374151]" : "font-bold text-[#111]"
                        }`}
                      >
                        {n.title}
                      </p>
                      <span className="text-[11px] text-[#A8A49C] shrink-0">
                        {timeAgo(n.created_at)}
                      </span>
                    </div>
                    {n.body && (
                      <p className="text-[12px] text-[#7C7870] mt-0.5 leading-relaxed">
                        {n.body}
                      </p>
                    )}
                    {n.link && (
                      <a
                        href={n.link}
                        className="inline-block mt-1.5 text-[11px] font-semibold text-indigo-600 hover:text-indigo-800 transition-colors"
                      >
                        View →
                      </a>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1 shrink-0">
                    {!n.is_read && (
                      <button
                        onClick={() => handleMarkRead(n.id)}
                        title="Mark as read"
                        className="p-1.5 rounded-lg text-[#A8A49C] hover:bg-indigo-100 hover:text-indigo-600 transition-colors"
                      >
                        <Check size={13} />
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(n.id)}
                      title="Delete"
                      className="p-1.5 rounded-lg text-[#A8A49C] hover:bg-rose-100 hover:text-rose-600 transition-colors"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
