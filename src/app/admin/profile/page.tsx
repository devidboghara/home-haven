"use client";

import { useEffect, useState } from "react";
import {
  Camera, Save, Mail, Phone, Globe, MapPin,
  Lock, Eye, EyeOff, Bell, Shield, Palette,
  Activity, Star, TrendingUp, DollarSign,
  CheckCircle2, Clock, Calendar, Edit3,
  Key, Smartphone, LogOut, Download, Trash2,
  ToggleLeft, ToggleRight, X, Check, Award,
} from "lucide-react";
import { supabase } from "@/lib/supabase";

// ── Types ─────────────────────────────────────────────────────────────────────

type ProfileTab = "overview" | "edit" | "security" | "preferences" | "activity";

interface ActivityItem {
  id: string;
  action: string;
  entity: string;
  time: string;
  icon: React.ElementType;
  color: string;
}

// ── Mock activity ─────────────────────────────────────────────────────────────

const MOCK_ACTIVITY: ActivityItem[] = [
  { id:"ac1",  action:"Closed deal",        entity:"42 Maple Street — CA$480,000",       time:"2 hours ago",  icon:CheckCircle2, color:"text-emerald-600 bg-emerald-100" },
  { id:"ac2",  action:"Added contact",       entity:"Carlos Mendez (Investor)",            time:"4 hours ago",  icon:Star,         color:"text-indigo-600 bg-indigo-100"   },
  { id:"ac3",  action:"Sent contract",       entity:"Purchase Agreement — Lakeview Drive", time:"Yesterday",    icon:Mail,         color:"text-blue-600 bg-blue-100"       },
  { id:"ac4",  action:"Updated pipeline",    entity:"Moved deal to Due Diligence",         time:"Yesterday",    icon:TrendingUp,   color:"text-violet-600 bg-violet-100"   },
  { id:"ac5",  action:"Created invoice",     entity:"INV-2026-004 — CA$3,955",            time:"2 days ago",   icon:DollarSign,   color:"text-amber-600 bg-amber-100"     },
  { id:"ac6",  action:"Scheduled appointment",entity:"Site Visit — 5 Birchwood Court",    time:"3 days ago",   icon:Calendar,     color:"text-teal-600 bg-teal-100"       },
  { id:"ac7",  action:"Replied to review",   entity:"Thomas Morrison — 5★ review",        time:"4 days ago",   icon:Star,         color:"text-rose-600 bg-rose-100"       },
  { id:"ac8",  action:"Updated property",    entity:"7 Pine Avenue — Status changed",      time:"5 days ago",   icon:Edit3,        color:"text-slate-600 bg-slate-100"     },
];

const ACCENT_COLORS = [
  { name: "Indigo", value: "#6366F1", bg: "bg-indigo-500" },
  { name: "Violet", value: "#8B5CF6", bg: "bg-violet-500" },
  { name: "Emerald",value: "#10B981", bg: "bg-emerald-500"},
  { name: "Amber",  value: "#F59E0B", bg: "bg-amber-500"  },
  { name: "Rose",   value: "#F43F5E", bg: "bg-rose-500"   },
  { name: "Teal",   value: "#14B8A6", bg: "bg-teal-500"   },
  { name: "Black",  value: "#111111", bg: "bg-[#111]"     },
];

// ── Stat Card ─────────────────────────────────────────────────────────────────

function StatCard({ label, value, sub, icon: Icon, color }: {
  label: string; value: string | number; sub?: string;
  icon: React.ElementType; color: string;
}) {
  return (
    <div className="bg-white rounded-xl border border-[#E8E6E0] p-4 shadow-sm">
      <div className="flex items-start justify-between mb-2">
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${color}`}>
          <Icon size={16} className="text-white" />
        </div>
      </div>
      <p className="text-[22px] font-bold text-[#111] tracking-tight">{value}</p>
      <p className="text-[11px] font-medium text-[#A8A49C] uppercase tracking-wide mt-0.5">{label}</p>
      {sub && <p className="text-[11px] text-emerald-600 font-semibold mt-0.5">{sub}</p>}
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function ProfilePage() {
  const [tab, setTab]         = useState<ProfileTab>("overview");
  const [loading, setLoading] = useState(true);
  const [saved, setSaved]     = useState(false);

  // Profile form state
  const [profile, setProfile] = useState({
    full_name:    "Admin User",
    email:        "admin@homehaven.ca",
    phone:        "+1 (416) 555-0100",
    city:         "Toronto",
    province:     "ON",
    country:      "Canada",
    website:      "www.homehaven.ca",
    bio:          "Senior Real Estate Administrator with 8+ years of experience in the Canadian property market. Specializing in residential and investment properties across Ontario and BC.",
    license_no:   "RB-0042891-ON",
    company:      "HomeHaven Realty Inc.",
  });

  // Security state
  const [passwords, setPasswords] = useState({ current: "", new_pass: "", confirm: "" });
  const [showPass, setShowPass]   = useState({ current: false, new_pass: false, confirm: false });
  const [twoFA, setTwoFA]         = useState(false);

  // Preferences state
  const [prefs, setPrefs] = useState({
    email_notifications:   true,
    sms_notifications:     false,
    deal_alerts:           true,
    lead_alerts:           true,
    weekly_report:         true,
    dark_mode:             false,
    accent_color:          "#6366F1",
    language:              "English",
    timezone:              "America/Toronto",
    currency:              "CAD",
    date_format:           "MM/DD/YYYY",
  });

  useEffect(() => { fetchProfile(); }, []);

  const fetchProfile = async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data } = await supabase.from("profiles").select("*").eq("id", user.id).single();
      if (data) {
        setProfile((prev) => ({
          ...prev,
          full_name: data.full_name || prev.full_name,
          email:     data.email     || prev.email,
          phone:     data.phone     || prev.phone,
        }));
      }
    }
    setLoading(false);
  };

  const handleSaveProfile = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      await supabase.from("profiles").update({
        full_name: profile.full_name,
        phone:     profile.phone,
      }).eq("id", user.id);
    }
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const setP = (k: string, v: string) => setProfile((f) => ({ ...f, [k]: v }));
  const setPref = (k: string, v: boolean | string) => setPrefs((f) => ({ ...f, [k]: v }));

  const initials = profile.full_name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);

  const tabs: { id: ProfileTab; label: string; icon: React.ElementType }[] = [
    { id: "overview",    label: "Overview",    icon: Star     },
    { id: "edit",        label: "Edit Profile",icon: Edit3    },
    { id: "security",    label: "Security",    icon: Shield   },
    { id: "preferences", label: "Preferences", icon: Palette  },
    { id: "activity",    label: "Activity",    icon: Activity },
  ];

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-6 py-5 bg-white border-b border-[#E8E6E0]">
        <h1 className="text-[20px] font-bold text-[#111] tracking-tight">Profile</h1>
        <p className="text-[13px] text-[#A8A49C] mt-0.5">Dashboard › Profile</p>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-5 max-w-[900px]">
        {/* Profile hero card */}
        <div className="bg-white rounded-xl border border-[#E8E6E0] shadow-sm p-6">
          <div className="flex items-center gap-5">
            {/* Avatar */}
            <div className="relative shrink-0">
              <div className="w-20 h-20 rounded-full bg-[#111] flex items-center justify-center text-white text-[24px] font-bold">
                {initials}
              </div>
              <button className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-indigo-600 flex items-center justify-center text-white shadow-md hover:bg-indigo-700 transition-colors">
                <Camera size={13} />
              </button>
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-[20px] font-bold text-[#111] tracking-tight">{profile.full_name}</h2>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 flex items-center gap-1">
                  <Award size={9} /> Super Admin
                </span>
              </div>
              <p className="text-[13px] text-[#7C7870] mt-0.5">{profile.company}</p>
              <div className="flex items-center gap-4 mt-1.5 flex-wrap">
                <span className="flex items-center gap-1.5 text-[12px] text-[#A8A49C]">
                  <Mail size={11} />{profile.email}
                </span>
                <span className="flex items-center gap-1.5 text-[12px] text-[#A8A49C]">
                  <MapPin size={11} />{profile.city}, {profile.province}
                </span>
                <span className="flex items-center gap-1.5 text-[12px] text-[#A8A49C]">
                  <Shield size={11} />License: {profile.license_no}
                </span>
              </div>
            </div>

            <button
              onClick={() => setTab("edit")}
              className="flex items-center gap-2 border border-[#E8E6E0] rounded-xl px-4 py-2 text-[12px] font-semibold text-[#7C7870] hover:bg-[#F4F5F7] transition-colors shrink-0"
            >
              <Edit3 size={13} /> Edit Profile
            </button>
          </div>

          {profile.bio && (
            <p className="text-[13px] text-[#7C7870] mt-4 pt-4 border-t border-[#F0EDE6] leading-relaxed">
              {profile.bio}
            </p>
          )}
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1 bg-white rounded-xl border border-[#E8E6E0] p-1 shadow-sm overflow-x-auto">
          {tabs.map(({ id, label, icon: Icon }) => (
            <button key={id} onClick={() => setTab(id)}
              className={`flex items-center gap-1.5 text-[12px] font-semibold px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${tab === id ? "bg-[#111] text-white shadow-sm" : "text-[#7C7870] hover:text-[#111]"}`}>
              <Icon size={13} />{label}
            </button>
          ))}
        </div>

        {/* ── Overview ── */}
        {tab === "overview" && (
          <div className="space-y-5">
            <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
              <StatCard label="Deals Closed"  value="48"       sub="+12 this quarter" icon={CheckCircle2} color="bg-emerald-500" />
              <StatCard label="Revenue YTD"   value="CA$3.2M"  sub="+24% vs last year" icon={DollarSign}   color="bg-indigo-500" />
              <StatCard label="Active Deals"  value="9"        icon={TrendingUp}  color="bg-violet-500" />
              <StatCard label="Avg Response"  value="< 30 min" icon={Clock}       color="bg-amber-500"  />
            </div>

            {/* Quick info */}
            <div className="bg-white rounded-xl border border-[#E8E6E0] shadow-sm p-5">
              <h3 className="text-[14px] font-bold text-[#111] mb-4">Personal Information</h3>
              <div className="grid grid-cols-2 gap-x-8 gap-y-3">
                {[
                  { label: "Full Name",    value: profile.full_name    },
                  { label: "Email",        value: profile.email         },
                  { label: "Phone",        value: profile.phone         },
                  { label: "Company",      value: profile.company       },
                  { label: "License No.",  value: profile.license_no    },
                  { label: "City",         value: `${profile.city}, ${profile.province}` },
                  { label: "Website",      value: profile.website       },
                  { label: "Country",      value: profile.country       },
                ].map(({ label, value }) => (
                  <div key={label} className="flex flex-col">
                    <span className="text-[10px] font-semibold text-[#A8A49C] uppercase tracking-wide mb-0.5">{label}</span>
                    <span className="text-[13px] font-semibold text-[#111]">{value || "—"}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent activity preview */}
            <div className="bg-white rounded-xl border border-[#E8E6E0] shadow-sm p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-[14px] font-bold text-[#111]">Recent Activity</h3>
                <button onClick={() => setTab("activity")} className="text-[12px] font-semibold text-indigo-600 hover:text-indigo-700">View All</button>
              </div>
              <div className="space-y-3">
                {MOCK_ACTIVITY.slice(0, 4).map((item) => {
                  const [iconColor, iconBg] = item.color.split(" ");
                  const Icon = item.icon;
                  return (
                    <div key={item.id} className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${iconBg}`}>
                        <Icon size={14} className={iconColor} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[13px] font-semibold text-[#111]">{item.action}</p>
                        <p className="text-[11px] text-[#A8A49C] truncate">{item.entity}</p>
                      </div>
                      <span className="text-[11px] text-[#C5BFB5] shrink-0">{item.time}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ── Edit Profile ── */}
        {tab === "edit" && (
          <div className="bg-white rounded-xl border border-[#E8E6E0] shadow-sm p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-[14px] font-bold text-[#111]">Edit Profile</h3>
              {saved && (
                <span className="flex items-center gap-1.5 text-[12px] font-semibold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-xl">
                  <Check size={13} /> Saved successfully!
                </span>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              {[
                { label:"Full Name",      key:"full_name",   placeholder:"Your full name"           },
                { label:"Phone",          key:"phone",       placeholder:"+1 (000) 000-0000"        },
                { label:"City",           key:"city",        placeholder:"City"                      },
                { label:"Province",       key:"province",    placeholder:"ON"                        },
                { label:"Country",        key:"country",     placeholder:"Canada"                    },
                { label:"Website",        key:"website",     placeholder:"www.yoursite.com"          },
                { label:"Company",        key:"company",     placeholder:"Company name"              },
                { label:"License No.",    key:"license_no",  placeholder:"RB-000000-ON"              },
              ].map(({ label, key, placeholder }) => (
                <div key={key}>
                  <label className="block text-[11px] font-semibold text-[#7C7870] uppercase tracking-wide mb-1">{label}</label>
                  <input
                    value={(profile as any)[key]}
                    onChange={(e) => setP(key, e.target.value)}
                    placeholder={placeholder}
                    className="w-full bg-[#F4F5F7] border border-[#E8E6E0] rounded-xl px-3 py-2.5 text-[13px] text-[#111] outline-none focus:border-indigo-400 transition-colors"
                  />
                </div>
              ))}
              <div className="col-span-2">
                <label className="block text-[11px] font-semibold text-[#7C7870] uppercase tracking-wide mb-1">Email (read-only)</label>
                <input value={profile.email} disabled
                  className="w-full bg-[#F4F5F7] border border-[#E8E6E0] rounded-xl px-3 py-2.5 text-[13px] text-[#A8A49C] outline-none cursor-not-allowed" />
              </div>
              <div className="col-span-2">
                <label className="block text-[11px] font-semibold text-[#7C7870] uppercase tracking-wide mb-1">Bio</label>
                <textarea
                  value={profile.bio}
                  onChange={(e) => setP("bio", e.target.value)}
                  rows={3}
                  className="w-full bg-[#F4F5F7] border border-[#E8E6E0] rounded-xl px-3 py-2.5 text-[13px] text-[#111] outline-none focus:border-indigo-400 resize-none"
                />
              </div>
            </div>

            <button onClick={handleSaveProfile}
              className="flex items-center gap-2 bg-[#111] hover:bg-[#222] text-white text-[13px] font-semibold px-5 py-2.5 rounded-xl transition-colors">
              <Save size={14} /> Save Changes
            </button>
          </div>
        )}

        {/* ── Security ── */}
        {tab === "security" && (
          <div className="space-y-4">
            {/* Change password */}
            <div className="bg-white rounded-xl border border-[#E8E6E0] shadow-sm p-5 space-y-4">
              <h3 className="text-[14px] font-bold text-[#111]">Change Password</h3>
              {(["current","new_pass","confirm"] as const).map((k) => {
                const labels = { current: "Current Password", new_pass: "New Password", confirm: "Confirm New Password" };
                return (
                  <div key={k}>
                    <label className="block text-[11px] font-semibold text-[#7C7870] uppercase tracking-wide mb-1">{labels[k]}</label>
                    <div className="relative">
                      <Key size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A8A49C]" />
                      <input
                        type={showPass[k] ? "text" : "password"}
                        value={passwords[k]}
                        onChange={(e) => setPasswords((prev) => ({ ...prev, [k]: e.target.value }))}
                        placeholder="••••••••"
                        className="w-full bg-[#F4F5F7] border border-[#E8E6E0] rounded-xl pl-9 pr-10 py-2.5 text-[13px] text-[#111] outline-none focus:border-indigo-400"
                      />
                      <button
                        onClick={() => setShowPass((prev) => ({ ...prev, [k]: !prev[k] }))}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#A8A49C] hover:text-[#7C7870]"
                      >
                        {showPass[k] ? <EyeOff size={14} /> : <Eye size={14} />}
                      </button>
                    </div>
                  </div>
                );
              })}
              <button className="flex items-center gap-2 bg-[#111] hover:bg-[#222] text-white text-[13px] font-semibold px-5 py-2.5 rounded-xl transition-colors">
                <Lock size={14} /> Update Password
              </button>
            </div>

            {/* 2FA */}
            <div className="bg-white rounded-xl border border-[#E8E6E0] shadow-sm p-5">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="text-[14px] font-bold text-[#111]">Two-Factor Authentication</h3>
                  <p className="text-[12px] text-[#A8A49C] mt-0.5">Add an extra layer of security to your account</p>
                </div>
                <button onClick={() => setTwoFA(!twoFA)}>
                  {twoFA
                    ? <ToggleRight size={30} className="text-indigo-600" />
                    : <ToggleLeft  size={30} className="text-[#C5BFB5]" />}
                </button>
              </div>
              {!twoFA ? (
                <div className="flex items-center gap-2 text-[12px] text-rose-600 bg-rose-50 px-3 py-2 rounded-xl border border-rose-100">
                  <Shield size={13} /> 2FA is not enabled — your account is less secure
                </div>
              ) : (
                <div className="flex items-center gap-2 text-[12px] text-emerald-700 bg-emerald-50 px-3 py-2 rounded-xl border border-emerald-100">
                  <CheckCircle2 size={13} /> 2FA is enabled — your account is protected
                </div>
              )}
            </div>

            {/* Sessions + Danger */}
            <div className="bg-white rounded-xl border border-[#E8E6E0] shadow-sm p-5 space-y-3">
              <h3 className="text-[14px] font-bold text-[#111]">Active Sessions</h3>
              {[
                { device: "Chrome — MacBook Pro", location: "Toronto, ON", current: true,  time: "Now" },
                { device: "Safari — iPhone 15",    location: "Toronto, ON", current: false, time: "2 hours ago" },
              ].map((session, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-[#FAFAF8] border border-[#F0EDE6]">
                  <div className="flex items-center gap-3">
                    <Smartphone size={16} className="text-[#A8A49C]" />
                    <div>
                      <p className="text-[12px] font-semibold text-[#111]">{session.device}</p>
                      <p className="text-[11px] text-[#A8A49C]">{session.location} · {session.time}</p>
                    </div>
                  </div>
                  {session.current
                    ? <span className="text-[10px] font-bold text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded-full">Current</span>
                    : <button className="text-[11px] font-semibold text-rose-500 hover:text-rose-600">Revoke</button>}
                </div>
              ))}
            </div>

            {/* Danger zone */}
            <div className="bg-white rounded-xl border border-rose-200 shadow-sm p-5 space-y-3">
              <h3 className="text-[14px] font-bold text-rose-600">Danger Zone</h3>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[13px] font-semibold text-[#111]">Export My Data</p>
                  <p className="text-[11px] text-[#A8A49C]">Download all your data as a CSV file</p>
                </div>
                <button className="flex items-center gap-1.5 border border-[#E8E6E0] rounded-xl px-3 py-2 text-[12px] font-semibold text-[#7C7870] hover:bg-[#F4F5F7]">
                  <Download size={13} /> Export
                </button>
              </div>
              <div className="flex items-center justify-between pt-3 border-t border-rose-100">
                <div>
                  <p className="text-[13px] font-semibold text-rose-600">Delete Account</p>
                  <p className="text-[11px] text-[#A8A49C]">This action cannot be undone</p>
                </div>
                <button className="flex items-center gap-1.5 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-xl px-3 py-2 text-[12px] font-semibold text-rose-600 transition-colors">
                  <Trash2 size={13} /> Delete
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── Preferences ── */}
        {tab === "preferences" && (
          <div className="space-y-4">
            {/* Notifications */}
            <div className="bg-white rounded-xl border border-[#E8E6E0] shadow-sm p-5">
              <h3 className="text-[14px] font-bold text-[#111] mb-4">Notifications</h3>
              <div className="space-y-3">
                {[
                  { key:"email_notifications", label:"Email Notifications",  desc:"Receive all alerts via email"         },
                  { key:"sms_notifications",   label:"SMS Notifications",    desc:"Receive urgent alerts via SMS"        },
                  { key:"deal_alerts",         label:"Deal Alerts",          desc:"Notified on deal status changes"      },
                  { key:"lead_alerts",         label:"Lead Alerts",          desc:"Notified when new leads arrive"       },
                  { key:"weekly_report",       label:"Weekly Report",        desc:"Auto-generated performance summary"   },
                ].map(({ key, label, desc }) => (
                  <div key={key} className="flex items-center justify-between py-2 border-b border-[#F9F8F6] last:border-0">
                    <div>
                      <p className="text-[13px] font-semibold text-[#111]">{label}</p>
                      <p className="text-[11px] text-[#A8A49C]">{desc}</p>
                    </div>
                    <button onClick={() => setPref(key, !(prefs as any)[key])}>
                      {(prefs as any)[key]
                        ? <ToggleRight size={26} className="text-indigo-600" />
                        : <ToggleLeft  size={26} className="text-[#C5BFB5]" />}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Appearance */}
            <div className="bg-white rounded-xl border border-[#E8E6E0] shadow-sm p-5">
              <h3 className="text-[14px] font-bold text-[#111] mb-4">Appearance</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-[11px] font-semibold text-[#7C7870] uppercase tracking-wide mb-2">Accent Color</label>
                  <div className="flex items-center gap-2.5 flex-wrap">
                    {ACCENT_COLORS.map(({ name, value, bg }) => (
                      <button key={value} onClick={() => setPref("accent_color", value)} title={name}
                        className={`w-8 h-8 rounded-full ${bg} transition-all ${prefs.accent_color === value ? "ring-2 ring-offset-2 ring-[#111] scale-110" : "hover:scale-105"}`} />
                    ))}
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[13px] font-semibold text-[#111]">Dark Mode</p>
                    <p className="text-[11px] text-[#A8A49C]">Switch to dark theme</p>
                  </div>
                  <button onClick={() => setPref("dark_mode", !prefs.dark_mode)}>
                    {prefs.dark_mode
                      ? <ToggleRight size={26} className="text-indigo-600" />
                      : <ToggleLeft  size={26} className="text-[#C5BFB5]" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Regional */}
            <div className="bg-white rounded-xl border border-[#E8E6E0] shadow-sm p-5">
              <h3 className="text-[14px] font-bold text-[#111] mb-4">Regional Settings</h3>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label:"Language",    key:"language",    options:["English","French","Spanish"]                           },
                  { label:"Timezone",    key:"timezone",    options:["America/Toronto","America/Vancouver","America/New_York"] },
                  { label:"Currency",    key:"currency",    options:["CAD","USD","EUR","GBP"]                                },
                  { label:"Date Format", key:"date_format", options:["MM/DD/YYYY","DD/MM/YYYY","YYYY-MM-DD"]                 },
                ].map(({ label, key, options }) => (
                  <div key={key}>
                    <label className="block text-[11px] font-semibold text-[#7C7870] uppercase tracking-wide mb-1">{label}</label>
                    <select value={(prefs as any)[key]} onChange={(e) => setPref(key, e.target.value)}
                      className="w-full bg-[#F4F5F7] border border-[#E8E6E0] rounded-xl px-3 py-2.5 text-[13px] text-[#7C7870] outline-none">
                      {options.map((o) => <option key={o}>{o}</option>)}
                    </select>
                  </div>
                ))}
              </div>
              <button className="mt-4 flex items-center gap-2 bg-[#111] hover:bg-[#222] text-white text-[13px] font-semibold px-5 py-2.5 rounded-xl transition-colors">
                <Save size={14} /> Save Preferences
              </button>
            </div>
          </div>
        )}

        {/* ── Activity ── */}
        {tab === "activity" && (
          <div className="bg-white rounded-xl border border-[#E8E6E0] shadow-sm p-5">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-[14px] font-bold text-[#111]">Activity Log</h3>
              <span className="text-[12px] text-[#A8A49C]">{MOCK_ACTIVITY.length} recent actions</span>
            </div>
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-[19px] top-0 bottom-0 w-px bg-[#F0EDE6]" />
              <div className="space-y-4">
                {MOCK_ACTIVITY.map((item) => {
                  const [iconColor, iconBg] = item.color.split(" ");
                  const Icon = item.icon;
                  return (
                    <div key={item.id} className="flex items-start gap-4 relative">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 z-10 ${iconBg} border-2 border-white`}>
                        <Icon size={15} className={iconColor} />
                      </div>
                      <div className="flex-1 min-w-0 pt-1.5">
                        <div className="flex items-center justify-between gap-2">
                          <p className="text-[13px] font-semibold text-[#111]">{item.action}</p>
                          <span className="text-[11px] text-[#C5BFB5] shrink-0">{item.time}</span>
                        </div>
                        <p className="text-[12px] text-[#7C7870] mt-0.5">{item.entity}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}