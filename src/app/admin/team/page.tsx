"use client";

import { useEffect, useState } from "react";
import {
  Plus, Search, Star, Phone, Mail, Shield,
  TrendingUp, Award, Crown, ChevronDown,
  Eye, Pencil, Trash2, X, Check, Users2,
  BarChart3, Target, Calendar, MoreHorizontal,
  UserPlus, Settings, Lock, Unlock, RefreshCw,
} from "lucide-react";
import { supabase } from "@/lib/supabase";

// ── Types ─────────────────────────────────────────────────────────────────────

type Role = "super_admin" | "manager" | "agent" | "read_only";
type Status = "active" | "inactive" | "pending";

interface TeamMember {
  id: string;
  full_name: string;
  email: string;
  phone?: string;
  role: Role;
  status: Status;
  commission_pct: number;
  city?: string;
  avatar_color: string;
  initials: string;
  // stats
  deals_closed: number;
  deals_active: number;
  revenue_ytd: number;
  rating: number;
  response_time: string;
  joined_date: string;
  last_active: string;
}

interface Permission {
  key: string;
  label: string;
  description: string;
  roles: Role[];
}

// ── Config ────────────────────────────────────────────────────────────────────

const ROLE_CFG: Record<Role, { label: string; color: string; bg: string; icon: React.ElementType; level: number }> = {
  super_admin: { label: "Super Admin", color: "text-rose-700",   bg: "bg-rose-100",   icon: Crown,  level: 4 },
  manager:     { label: "Manager",     color: "text-violet-700", bg: "bg-violet-100", icon: Shield, level: 3 },
  agent:       { label: "Agent",       color: "text-indigo-700", bg: "bg-indigo-100", icon: Award,  level: 2 },
  read_only:   { label: "Read Only",   color: "text-slate-600",  bg: "bg-slate-100",  icon: Eye,    level: 1 },
};

const STATUS_CFG: Record<Status, { color: string; bg: string }> = {
  active:   { color: "text-emerald-700", bg: "bg-emerald-100" },
  inactive: { color: "text-slate-500",   bg: "bg-slate-100"   },
  pending:  { color: "text-amber-700",   bg: "bg-amber-100"   },
};

const PERMISSIONS: Permission[] = [
  { key: "view_dashboard",      label: "View Dashboard",         description: "Access the main analytics dashboard",          roles: ["super_admin","manager","agent","read_only"] },
  { key: "manage_properties",   label: "Manage Properties",      description: "Add, edit, delete property listings",          roles: ["super_admin","manager","agent"]              },
  { key: "view_properties",     label: "View Properties",        description: "View all property listings and details",        roles: ["super_admin","manager","agent","read_only"] },
  { key: "manage_deals",        label: "Manage Deals",           description: "Create and update deals in pipeline",          roles: ["super_admin","manager","agent"]              },
  { key: "manage_contacts",     label: "Manage Contacts",        description: "Add, edit, delete contacts and leads",         roles: ["super_admin","manager","agent"]              },
  { key: "view_financials",     label: "View Financials",        description: "Access invoices, payments, commissions",       roles: ["super_admin","manager"]                     },
  { key: "manage_invoices",     label: "Manage Invoices",        description: "Create, send, and manage invoices",            roles: ["super_admin","manager"]                     },
  { key: "manage_contracts",    label: "Manage Contracts",       description: "Create and send contracts for signature",      roles: ["super_admin","manager","agent"]              },
  { key: "manage_team",         label: "Manage Team",            description: "Invite, edit, remove team members",            roles: ["super_admin"]                               },
  { key: "manage_workflows",    label: "Manage Workflows",       description: "Create and edit automation workflows",         roles: ["super_admin","manager"]                     },
  { key: "view_reports",        label: "View Reports",           description: "Access analytics and performance reports",     roles: ["super_admin","manager"]                     },
  { key: "manage_settings",     label: "Manage Settings",        description: "Change company and system settings",           roles: ["super_admin"]                               },
  { key: "delete_records",      label: "Delete Records",         description: "Permanently delete any records",               roles: ["super_admin"]                               },
  { key: "export_data",         label: "Export Data",            description: "Export data to CSV or PDF",                    roles: ["super_admin","manager"]                     },
];

const AVATAR_COLORS = [
  "bg-indigo-500","bg-violet-500","bg-emerald-500",
  "bg-amber-500","bg-rose-500","bg-teal-500","bg-orange-500","bg-cyan-500",
];

// ── Mock data ─────────────────────────────────────────────────────────────────

const MOCK_TEAM: TeamMember[] = [
  { id:"t1", full_name:"Admin User",     email:"admin@homehaven.ca",   phone:"+1 (416) 555-0100", role:"super_admin", status:"active",   commission_pct:0,   city:"Toronto, ON",   avatar_color:"bg-rose-500",    initials:"AU", deals_closed:0,  deals_active:0,  revenue_ytd:0,       rating:0,   response_time:"—",    joined_date:"2023-01-01", last_active:"Just now"     },
  { id:"t2", full_name:"James Liu",      email:"james@homehaven.ca",   phone:"+1 (514) 555-0404", role:"manager",     status:"active",   commission_pct:3.5, city:"Montreal, QC",  avatar_color:"bg-amber-500",   initials:"JL", deals_closed:8,  deals_active:3,  revenue_ytd:1200000, rating:4.6, response_time:"< 1h", joined_date:"2023-11-20", last_active:"2h ago"       },
  { id:"t3", full_name:"Sarah Kim",      email:"sarah@homehaven.ca",   phone:"+1 (416) 555-0101", role:"agent",       status:"active",   commission_pct:3.0, city:"Toronto, ON",   avatar_color:"bg-indigo-500",  initials:"SK", deals_closed:14, deals_active:5,  revenue_ytd:2100000, rating:4.9, response_time:"< 30m",joined_date:"2024-01-15", last_active:"Today"        },
  { id:"t4", full_name:"Mike Roberts",   email:"mike@homehaven.ca",    phone:"+1 (604) 555-0202", role:"agent",       status:"active",   commission_pct:2.5, city:"Vancouver, BC", avatar_color:"bg-violet-500",  initials:"MR", deals_closed:11, deals_active:4,  revenue_ytd:1700000, rating:4.8, response_time:"< 1h", joined_date:"2024-02-10", last_active:"Yesterday"    },
  { id:"t5", full_name:"Priya Sharma",   email:"priya@homehaven.ca",   phone:"+1 (403) 555-0303", role:"agent",       status:"active",   commission_pct:2.8, city:"Calgary, AB",   avatar_color:"bg-emerald-500", initials:"PS", deals_closed:9,  deals_active:3,  revenue_ytd:1400000, rating:4.7, response_time:"< 2h", joined_date:"2024-03-05", last_active:"Today"        },
  { id:"t6", full_name:"Nina Torres",    email:"nina@homehaven.ca",    phone:"+1 (613) 555-0505", role:"agent",       status:"inactive", commission_pct:2.5, city:"Ottawa, ON",    avatar_color:"bg-teal-500",    initials:"NT", deals_closed:6,  deals_active:0,  revenue_ytd:980000,  rating:4.5, response_time:"—",    joined_date:"2024-04-01", last_active:"2 weeks ago"  },
  { id:"t7", full_name:"Sarah Nguyen",   email:"snguyen@homehaven.ca", phone:"+1 (780) 555-0912", role:"agent",       status:"pending",  commission_pct:2.5, city:"Edmonton, AB",  avatar_color:"bg-cyan-500",    initials:"SN", deals_closed:0,  deals_active:0,  revenue_ytd:0,       rating:0,   response_time:"—",    joined_date:"2026-03-20", last_active:"Never"        },
];

// ── Invite Modal ──────────────────────────────────────────────────────────────

function InviteModal({ onClose, onInvite }: { onClose: () => void; onInvite: (email: string, role: Role) => void }) {
  const [email, setEmail]   = useState("");
  const [role, setRole]     = useState<Role>("agent");
  const [sent, setSent]     = useState(false);

  const handleSend = () => {
    if (!email) return;
    onInvite(email, role);
    setSent(true);
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl border border-[#E8E6E0] shadow-2xl w-full max-w-md" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-5 border-b border-[#F0EDE6]">
          <h2 className="text-[16px] font-bold text-[#111]">Invite Team Member</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-[#F4F5F7] text-[#A8A49C]"><X size={15} /></button>
        </div>
        {sent ? (
          <div className="p-8 text-center">
            <div className="w-14 h-14 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-3">
              <Check size={24} className="text-emerald-600" />
            </div>
            <p className="text-[16px] font-bold text-[#111]">Invitation Sent!</p>
            <p className="text-[13px] text-[#A8A49C] mt-1">
              An invitation email has been sent to <span className="font-semibold text-[#111]">{email}</span>
            </p>
            <button onClick={onClose} className="mt-4 bg-[#111] text-white text-[13px] font-semibold px-6 py-2.5 rounded-xl hover:bg-[#222] transition-colors">
              Done
            </button>
          </div>
        ) : (
          <div className="p-5 space-y-4">
            <div>
              <label className="block text-[11px] font-semibold text-[#7C7870] uppercase tracking-wide mb-1">Email Address *</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="colleague@email.com"
                className="w-full bg-[#F4F5F7] border border-[#E8E6E0] rounded-xl px-3 py-2.5 text-[13px] text-[#111] outline-none focus:border-indigo-400 transition-colors"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-[#7C7870] uppercase tracking-wide mb-2">Role</label>
              <div className="grid grid-cols-2 gap-2">
                {(Object.keys(ROLE_CFG) as Role[]).map((r) => {
                  const cfg = ROLE_CFG[r];
                  const Icon = cfg.icon;
                  return (
                    <button key={r} onClick={() => setRole(r)}
                      className={`flex items-center gap-2.5 p-3 rounded-xl border text-left transition-all ${role === r ? "border-indigo-400 bg-indigo-50" : "border-[#E8E6E0] hover:border-[#C5BFB5] hover:bg-[#FAFAF8]"}`}>
                      <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${role === r ? "bg-indigo-100" : "bg-[#F4F5F7]"}`}>
                        <Icon size={14} className={role === r ? "text-indigo-600" : "text-[#A8A49C]"} />
                      </div>
                      <div>
                        <p className={`text-[12px] font-bold ${role === r ? "text-indigo-700" : "text-[#111]"}`}>{cfg.label}</p>
                        <p className="text-[10px] text-[#A8A49C]">Level {cfg.level}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
            <div className="bg-[#FAFAF8] rounded-xl p-3 border border-[#F0EDE6]">
              <p className="text-[11px] font-semibold text-[#7C7870] mb-1">This role can:</p>
              <div className="space-y-1">
                {PERMISSIONS.filter((p) => p.roles.includes(role)).slice(0, 4).map((p) => (
                  <div key={p.key} className="flex items-center gap-1.5 text-[11px] text-[#7C7870]">
                    <Check size={10} className="text-emerald-500 shrink-0" />
                    {p.label}
                  </div>
                ))}
                {PERMISSIONS.filter((p) => p.roles.includes(role)).length > 4 && (
                  <p className="text-[11px] text-indigo-600 font-medium">+{PERMISSIONS.filter((p) => p.roles.includes(role)).length - 4} more permissions</p>
                )}
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={handleSend} disabled={!email}
                className="flex-1 flex items-center justify-center gap-2 bg-[#111] hover:bg-[#222] disabled:opacity-40 text-white text-[13px] font-semibold py-2.5 rounded-xl transition-colors">
                <UserPlus size={14} /> Send Invite
              </button>
              <button onClick={onClose} className="flex-1 bg-[#F4F5F7] text-[#7C7870] text-[13px] font-semibold py-2.5 rounded-xl hover:bg-[#EDEAE3]">Cancel</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Member Detail Modal ───────────────────────────────────────────────────────

function MemberModal({
  member,
  onClose,
  onUpdate,
}: {
  member: TeamMember;
  onClose: () => void;
  onUpdate: (id: string, data: Partial<TeamMember>) => void;
}) {
  const [role, setRole]     = useState<Role>(member.role);
  const [status, setStatus] = useState<Status>(member.status);
  const [commission, setCommission] = useState(member.commission_pct);
  const roleCfg = ROLE_CFG[role];
  const RoleIcon = roleCfg.icon;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl border border-[#E8E6E0] shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-5 border-b border-[#F0EDE6]">
          <h2 className="text-[16px] font-bold text-[#111]">Edit Team Member</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-[#F4F5F7] text-[#A8A49C]"><X size={15} /></button>
        </div>
        <div className="p-5 space-y-5">
          {/* Profile header */}
          <div className="flex items-center gap-4 p-4 bg-[#FAFAF8] rounded-xl border border-[#F0EDE6]">
            <div className={`w-12 h-12 rounded-full ${member.avatar_color} flex items-center justify-center text-white text-[15px] font-bold shrink-0`}>
              {member.initials}
            </div>
            <div>
              <p className="text-[15px] font-bold text-[#111]">{member.full_name}</p>
              <p className="text-[12px] text-[#A8A49C]">{member.email}</p>
              <p className="text-[11px] text-[#A8A49C]">Joined {new Date(member.joined_date).toLocaleDateString("en-CA", { month: "long", year: "numeric" })}</p>
            </div>
          </div>

          {/* Role */}
          <div>
            <label className="block text-[11px] font-semibold text-[#7C7870] uppercase tracking-wide mb-2">Role</label>
            <div className="grid grid-cols-2 gap-2">
              {(Object.keys(ROLE_CFG) as Role[]).map((r) => {
                const cfg = ROLE_CFG[r];
                const Icon = cfg.icon;
                return (
                  <button key={r} onClick={() => setRole(r)}
                    className={`flex items-center gap-2 p-2.5 rounded-xl border transition-all ${role === r ? "border-indigo-400 bg-indigo-50" : "border-[#E8E6E0] hover:bg-[#FAFAF8]"}`}>
                    <div className={`w-6 h-6 rounded-lg flex items-center justify-center ${role === r ? "bg-indigo-100" : "bg-[#F4F5F7]"}`}>
                      <Icon size={12} className={role === r ? "text-indigo-600" : "text-[#A8A49C]"} />
                    </div>
                    <span className={`text-[12px] font-semibold ${role === r ? "text-indigo-700" : "text-[#7C7870]"}`}>{cfg.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Status + Commission */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-[#7C7870] uppercase tracking-wide mb-1">Status</label>
              <select value={status} onChange={(e) => setStatus(e.target.value as Status)}
                className="w-full bg-[#F4F5F7] border border-[#E8E6E0] rounded-xl px-3 py-2.5 text-[13px] text-[#7C7870] outline-none">
                {["active","inactive","pending"].map((s) => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-[#7C7870] uppercase tracking-wide mb-1">Commission %</label>
              <input type="number" step="0.1" min="0" max="10" value={commission}
                onChange={(e) => setCommission(parseFloat(e.target.value) || 0)}
                className="w-full bg-[#F4F5F7] border border-[#E8E6E0] rounded-xl px-3 py-2.5 text-[13px] text-[#111] outline-none focus:border-indigo-400" />
            </div>
          </div>

          {/* Permissions preview */}
          <div>
            <label className="block text-[11px] font-semibold text-[#7C7870] uppercase tracking-wide mb-2">Permissions for {roleCfg.label}</label>
            <div className="bg-[#FAFAF8] rounded-xl border border-[#F0EDE6] divide-y divide-[#F0EDE6]">
              {PERMISSIONS.map((p) => {
                const hasAccess = p.roles.includes(role);
                return (
                  <div key={p.key} className="flex items-center justify-between px-4 py-2.5">
                    <div>
                      <p className={`text-[12px] font-semibold ${hasAccess ? "text-[#111]" : "text-[#C5BFB5]"}`}>{p.label}</p>
                      <p className="text-[10px] text-[#A8A49C]">{p.description}</p>
                    </div>
                    {hasAccess
                      ? <Unlock size={13} className="text-emerald-500 shrink-0" />
                      : <Lock    size={13} className="text-[#D1CDC8] shrink-0"  />}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex gap-2">
            <button onClick={() => { onUpdate(member.id, { role, status, commission_pct: commission }); onClose(); }}
              className="flex-1 bg-[#111] hover:bg-[#222] text-white text-[13px] font-semibold py-2.5 rounded-xl transition-colors">
              Save Changes
            </button>
            <button onClick={onClose} className="flex-1 bg-[#F4F5F7] text-[#7C7870] text-[13px] font-semibold py-2.5 rounded-xl hover:bg-[#EDEAE3]">Cancel</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function TeamPage() {
  const [team, setTeam]             = useState<TeamMember[]>(MOCK_TEAM);
  const [loading, setLoading]       = useState(true);
  const [search, setSearch]         = useState("");
  const [roleFilter, setRoleFilter] = useState("All");
  const [activeTab, setActiveTab]   = useState<"members"|"permissions"|"performance">("members");
  const [showInvite, setShowInvite] = useState(false);
  const [editMember, setEditMember] = useState<TeamMember | null>(null);

  useEffect(() => { fetchTeam(); }, []);

  const fetchTeam = async () => {
    setLoading(true);
    const { data } = await supabase.from("profiles").select("*").order("created_at");
    if (data && data.length > 0) {
      const mapped = data.map((d: any, i: number) => ({
        ...d,
        avatar_color: AVATAR_COLORS[i % AVATAR_COLORS.length],
        initials: (d.full_name || "?").split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2),
        deals_closed: 0, deals_active: 0, revenue_ytd: 0,
        rating: 0, response_time: "—", joined_date: d.created_at,
        last_active: "—", city: "",
      }));
      setTeam(mapped);
    }
    setLoading(false);
  };

  const handleUpdate = async (id: string, data: Partial<TeamMember>) => {
    await supabase.from("profiles").update(data).eq("id", id);
    setTeam((prev) => prev.map((m) => m.id === id ? { ...m, ...data } : m));
  };

  const handleRemove = async (id: string) => {
    await supabase.from("profiles").delete().eq("id", id);
    setTeam((prev) => prev.filter((m) => m.id !== id));
  };

  const handleInvite = (email: string, role: Role) => {
    const newMember: TeamMember = {
      id: Date.now().toString(), full_name: email.split("@")[0],
      email, role, status: "pending", commission_pct: 2.5,
      avatar_color: AVATAR_COLORS[team.length % AVATAR_COLORS.length],
      initials: email.slice(0, 2).toUpperCase(),
      deals_closed: 0, deals_active: 0, revenue_ytd: 0,
      rating: 0, response_time: "—",
      joined_date: new Date().toISOString(), last_active: "Never",
    };
    setTeam((prev) => [...prev, newMember]);
  };

  const filtered = team.filter((m) => {
    const s = search.toLowerCase();
    const matchSearch = m.full_name.toLowerCase().includes(s) || m.email.toLowerCase().includes(s);
    const matchRole   = roleFilter === "All" || m.role === roleFilter;
    return matchSearch && matchRole;
  });

  // Leaderboard sorted by revenue
  const leaderboard = [...team].filter((m) => m.revenue_ytd > 0).sort((a, b) => b.revenue_ytd - a.revenue_ytd);

  const stats = [
    { label:"Total Members", value: team.length,                                        color:"bg-indigo-50 text-indigo-600"  },
    { label:"Active",        value: team.filter((m) => m.status === "active").length,   color:"bg-emerald-50 text-emerald-600"},
    { label:"Pending",       value: team.filter((m) => m.status === "pending").length,  color:"bg-amber-50 text-amber-600"   },
    { label:"Managers",      value: team.filter((m) => ["manager","super_admin"].includes(m.role)).length, color:"bg-violet-50 text-violet-600" },
  ];

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-6 py-5 bg-white border-b border-[#E8E6E0] flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-[20px] font-bold text-[#111] tracking-tight">Team</h1>
          <p className="text-[13px] text-[#A8A49C] mt-0.5">Dashboard › Team</p>
        </div>
        <button onClick={() => setShowInvite(true)}
          className="flex items-center gap-2 bg-[#111] hover:bg-[#222] text-white text-[13px] font-semibold px-4 py-2 rounded-xl transition-colors shadow-sm">
          <UserPlus size={15} /> Invite Member
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-5">
        {/* Stats */}
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
          {stats.map(({ label, value, color }) => (
            <div key={label} className={`rounded-xl p-4 ${color}`}>
              <p className="text-[11px] font-semibold uppercase tracking-wide opacity-70">{label}</p>
              <p className="text-[26px] font-bold tracking-tight mt-1">{value}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1 bg-white rounded-xl border border-[#E8E6E0] p-1 shadow-sm w-fit">
          {(["members","permissions","performance"] as const).map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`text-[12px] font-semibold px-4 py-2 rounded-lg capitalize transition-colors ${activeTab === tab ? "bg-[#111] text-white shadow-sm" : "text-[#7C7870] hover:text-[#111]"}`}>
              {tab}
            </button>
          ))}
        </div>

        {/* ── Members Tab ── */}
        {activeTab === "members" && (
          <>
            {/* Filters */}
            <div className="bg-white rounded-xl border border-[#E8E6E0] p-4 flex flex-wrap items-center gap-3 shadow-sm">
              <div className="flex items-center gap-2 bg-[#F4F5F7] rounded-xl px-3 py-2 flex-1 min-w-[180px]">
                <Search size={14} className="text-[#A8A49C] shrink-0" />
                <input type="text" placeholder="Search members..." value={search} onChange={(e) => setSearch(e.target.value)}
                  className="bg-transparent text-[13px] text-[#111] placeholder-[#C5BFB5] outline-none w-full" />
              </div>
              <div className="flex items-center gap-1 bg-[#F4F5F7] rounded-xl p-1">
                {["All","super_admin","manager","agent","read_only"].map((r) => (
                  <button key={r} onClick={() => setRoleFilter(r)}
                    className={`text-[11px] font-semibold px-2.5 py-1.5 rounded-lg capitalize transition-colors ${roleFilter === r ? "bg-white text-[#111] shadow-sm" : "text-[#7C7870] hover:text-[#111]"}`}>
                    {r === "All" ? "All" : r.replace("_", " ")}
                  </button>
                ))}
              </div>
            </div>

            {/* Members grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {filtered.map((member) => {
                const roleCfg   = ROLE_CFG[member.role];
                const statusCfg = STATUS_CFG[member.status];
                const RoleIcon  = roleCfg.icon;
                return (
                  <div key={member.id} className="bg-white rounded-xl border border-[#E8E6E0] shadow-sm hover:shadow-md hover:border-indigo-200 transition-all p-5 group">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-11 h-11 rounded-full ${member.avatar_color} flex items-center justify-center text-white text-[13px] font-bold shrink-0`}>
                          {member.initials}
                        </div>
                        <div>
                          <p className="text-[14px] font-bold text-[#111]">{member.full_name}</p>
                          <p className="text-[11px] text-[#A8A49C] truncate max-w-[140px]">{member.email}</p>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <span className={`flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${roleCfg.bg} ${roleCfg.color}`}>
                          <RoleIcon size={9} />{roleCfg.label}
                        </span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize ${statusCfg.bg} ${statusCfg.color}`}>
                          {member.status}
                        </span>
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-2 py-3 border-y border-[#F0EDE6] mb-3">
                      <div className="text-center">
                        <p className="text-[15px] font-bold text-[#111]">{member.deals_closed || "—"}</p>
                        <p className="text-[10px] text-[#A8A49C]">Closed</p>
                      </div>
                      <div className="text-center">
                        <p className="text-[13px] font-bold text-[#111]">
                          {member.revenue_ytd ? `$${(member.revenue_ytd/1000000).toFixed(1)}M` : "—"}
                        </p>
                        <p className="text-[10px] text-[#A8A49C]">Revenue</p>
                      </div>
                      <div className="text-center">
                        <p className="text-[13px] font-bold text-amber-500 flex items-center justify-center gap-0.5">
                          {member.rating > 0 ? <><Star size={10} fill="#F59E0B" />{member.rating}</> : "—"}
                        </p>
                        <p className="text-[10px] text-[#A8A49C]">Rating</p>
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <p className="text-[11px] text-[#A8A49C]">Commission: <span className="font-semibold text-[#7C7870]">{member.commission_pct}%</span></p>
                        <p className="text-[10px] text-[#C5BFB5]">Last active: {member.last_active}</p>
                      </div>
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => setEditMember(member)}
                          className="w-7 h-7 rounded-lg flex items-center justify-center text-[#A8A49C] hover:bg-indigo-50 hover:text-indigo-600">
                          <Pencil size={12} />
                        </button>
                        {member.role !== "super_admin" && (
                          <button onClick={() => handleRemove(member.id)}
                            className="w-7 h-7 rounded-lg flex items-center justify-center text-[#A8A49C] hover:bg-rose-50 hover:text-rose-600">
                            <Trash2 size={12} />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {/* ── Permissions Tab ── */}
        {activeTab === "permissions" && (
          <div className="bg-white rounded-xl border border-[#E8E6E0] shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-[#F0EDE6]">
              <h3 className="text-[14px] font-bold text-[#111]">Role Permissions Matrix</h3>
              <p className="text-[12px] text-[#A8A49C] mt-0.5">Which roles have access to which features</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#F0EDE6] bg-[#FAFAF8]">
                    <th className="text-left px-5 py-3 text-[11px] font-bold text-[#A8A49C] uppercase tracking-wide w-64">Permission</th>
                    {(Object.keys(ROLE_CFG) as Role[]).map((r) => {
                      const cfg = ROLE_CFG[r];
                      const Icon = cfg.icon;
                      return (
                        <th key={r} className="px-4 py-3 text-center">
                          <div className={`inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-full ${cfg.bg} ${cfg.color}`}>
                            <Icon size={10} />{cfg.label}
                          </div>
                        </th>
                      );
                    })}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F9F8F6]">
                  {PERMISSIONS.map((p) => (
                    <tr key={p.key} className="hover:bg-[#FAFAF8] transition-colors">
                      <td className="px-5 py-3">
                        <p className="text-[13px] font-semibold text-[#111]">{p.label}</p>
                        <p className="text-[11px] text-[#A8A49C]">{p.description}</p>
                      </td>
                      {(Object.keys(ROLE_CFG) as Role[]).map((r) => (
                        <td key={r} className="px-4 py-3 text-center">
                          {p.roles.includes(r)
                            ? <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center mx-auto"><Check size={13} className="text-emerald-600" /></div>
                            : <div className="w-6 h-6 rounded-full bg-[#F4F5F7] flex items-center justify-center mx-auto"><X size={13} className="text-[#C5BFB5]" /></div>}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── Performance Tab ── */}
        {activeTab === "performance" && (
          <div className="space-y-4">
            {/* Leaderboard */}
            <div className="bg-white rounded-xl border border-[#E8E6E0] shadow-sm p-5">
              <h3 className="text-[14px] font-bold text-[#111] mb-4">Agent Leaderboard — YTD</h3>
              {team.filter((m) => m.role === "agent" || m.role === "manager").map((member, i) => {
                const maxRevenue = Math.max(...team.map((m) => m.revenue_ytd), 1);
                const pct = (member.revenue_ytd / maxRevenue) * 100;
                const medals = ["🥇", "🥈", "🥉"];
                return (
                  <div key={member.id} className="flex items-center gap-4 mb-4">
                    <div className="w-8 text-center">
                      {i < 3
                        ? <span className="text-[18px]">{medals[i]}</span>
                        : <span className="text-[13px] font-bold text-[#A8A49C]">#{i + 1}</span>}
                    </div>
                    <div className={`w-8 h-8 rounded-full ${member.avatar_color} flex items-center justify-center text-white text-[10px] font-bold shrink-0`}>
                      {member.initials}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-[13px] font-semibold text-[#111]">{member.full_name}</p>
                        <div className="flex items-center gap-3 text-[12px] shrink-0">
                          <span className="text-[#A8A49C]">{member.deals_closed} deals</span>
                          <span className="font-bold text-[#111]">
                            {member.revenue_ytd ? `CA$${(member.revenue_ytd/1000000).toFixed(1)}M` : "CA$0"}
                          </span>
                        </div>
                      </div>
                      <div className="h-2 bg-[#F0EDE6] rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${i === 0 ? "bg-amber-400" : i === 1 ? "bg-slate-400" : i === 2 ? "bg-amber-700" : "bg-indigo-400"}`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Individual stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {team.filter((m) => m.status === "active").map((member) => {
                const roleCfg = ROLE_CFG[member.role];
                return (
                  <div key={member.id} className="bg-white rounded-xl border border-[#E8E6E0] shadow-sm p-4">
                    <div className="flex items-center gap-2.5 mb-3">
                      <div className={`w-8 h-8 rounded-full ${member.avatar_color} flex items-center justify-center text-white text-[10px] font-bold shrink-0`}>
                        {member.initials}
                      </div>
                      <div>
                        <p className="text-[13px] font-bold text-[#111]">{member.full_name}</p>
                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${roleCfg.bg} ${roleCfg.color}`}>{roleCfg.label}</span>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { label:"Deals Closed", value: member.deals_closed || "0"        },
                        { label:"Active Deals", value: member.deals_active  || "0"        },
                        { label:"Revenue YTD",  value: member.revenue_ytd ? `$${(member.revenue_ytd/1000000).toFixed(1)}M` : "—" },
                        { label:"Rating",       value: member.rating ? `${member.rating}★` : "—" },
                        { label:"Response",     value: member.response_time },
                        { label:"Commission",   value: `${member.commission_pct}%`        },
                      ].map(({ label, value }) => (
                        <div key={label} className="bg-[#FAFAF8] rounded-lg p-2">
                          <p className="text-[10px] text-[#A8A49C] font-medium">{label}</p>
                          <p className="text-[12px] font-bold text-[#111] mt-0.5">{value}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {showInvite && (
        <InviteModal onClose={() => setShowInvite(false)} onInvite={handleInvite} />
      )}
      {editMember && (
        <MemberModal member={editMember} onClose={() => setEditMember(null)} onUpdate={handleUpdate} />
      )}
    </div>
  );
}