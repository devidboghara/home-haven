"use client";

import { useState } from "react";
import {
  User, Bell, Shield, Palette, Building2, Users2,
  CreditCard, Globe, Mail, Phone, Save, Camera,
  ToggleLeft, ToggleRight, ChevronRight, Key, Eye, EyeOff,
} from "lucide-react";

type SettingsTab = "profile" | "notifications" | "security" | "appearance" | "company" | "team" | "billing";

const tabs: { id: SettingsTab; label: string; icon: React.ElementType }[] = [
  { id: "profile", label: "Profile", icon: User },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "security", label: "Security", icon: Shield },
  { id: "appearance", label: "Appearance", icon: Palette },
  { id: "company", label: "Company", icon: Building2 },
  { id: "team", label: "Team & Roles", icon: Users2 },
  { id: "billing", label: "Billing", icon: CreditCard },
];

const notificationSettings = [
  { label: "New Lead Alerts", description: "Get notified when a new lead is added", key: "newLead", default: true },
  { label: "Offer Updates", description: "Notifications when offer status changes", key: "offers", default: true },
  { label: "Deal Closed", description: "Alert when a deal is successfully closed", key: "dealClosed", default: true },
  { label: "Workflow Failures", description: "Alert when an automation workflow fails", key: "workflowFail", default: true },
  { label: "Agent Activity", description: "Daily summary of agent performance", key: "agentActivity", default: false },
  { label: "Weekly Reports", description: "Auto-generate weekly analytics report", key: "weeklyReport", default: false },
  { label: "System Maintenance", description: "Downtime and maintenance alerts", key: "maintenance", default: true },
];

const teamMembers = [
  { name: "Sarah Kim", email: "sarah@homehaven.ca", role: "Agent", initials: "SK", color: "bg-indigo-500", status: "Active" },
  { name: "Mike Roberts", email: "mike@homehaven.ca", role: "Agent", initials: "MR", color: "bg-violet-500", status: "Active" },
  { name: "Priya Sharma", email: "priya@homehaven.ca", role: "Agent", initials: "PS", color: "bg-emerald-500", status: "Active" },
  { name: "James Liu", email: "james@homehaven.ca", role: "Manager", initials: "JL", color: "bg-amber-500", status: "Active" },
  { name: "Nina Torres", email: "nina@homehaven.ca", role: "Agent", initials: "NT", color: "bg-rose-500", status: "Inactive" },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<SettingsTab>("profile");
  const [notifications, setNotifications] = useState<Record<string, boolean>>(
    Object.fromEntries(notificationSettings.map(n => [n.key, n.default]))
  );
  const [showPassword, setShowPassword] = useState(false);
  const [accentColor, setAccentColor] = useState("#6366F1");

  const toggleNotif = (key: string) => setNotifications(prev => ({ ...prev, [key]: !prev[key] }));

  return (
    <div className="flex flex-col h-full">
      <div className="px-6 py-5 bg-white border-b border-[#E8E6E0]">
        <h1 className="text-[20px] font-bold text-[#111] tracking-tight">Settings</h1>
        <p className="text-[13px] text-[#A8A49C] mt-0.5">Dashboard › Settings</p>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Settings sidebar */}
        <div className="w-[200px] min-w-[200px] border-r border-[#E8E6E0] bg-white p-3 overflow-y-auto">
          <div className="space-y-0.5">
            {tabs.map(({ id, label, icon: Icon }) => (
              <button key={id} onClick={() => setActiveTab(id)}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-[13px] font-medium transition-colors text-left ${activeTab === id ? "bg-[#111] text-white" : "text-[#7C7870] hover:bg-[#F4F5F7] hover:text-[#111]"}`}>
                <Icon size={14} className={activeTab === id ? "text-white" : "text-[#A8A49C]"} />
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Settings content */}
        <div className="flex-1 overflow-y-auto p-6">

          {/* Profile */}
          {activeTab === "profile" && (
            <div className="max-w-xl space-y-5">
              <div>
                <h2 className="text-[16px] font-bold text-[#111]">Profile Settings</h2>
                <p className="text-[13px] text-[#A8A49C] mt-0.5">Update your personal information</p>
              </div>
              {/* Avatar */}
              <div className="bg-white rounded-xl border border-[#E8E6E0] p-5 shadow-sm">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div className="w-16 h-16 rounded-full bg-[#111] flex items-center justify-center text-white text-[20px] font-bold">AD</div>
                    <button className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-indigo-600 flex items-center justify-center text-white shadow-md hover:bg-indigo-700">
                      <Camera size={11} />
                    </button>
                  </div>
                  <div>
                    <p className="text-[14px] font-bold text-[#111]">Admin User</p>
                    <p className="text-[12px] text-[#A8A49C]">Super Admin</p>
                    <button className="text-[11px] font-semibold text-indigo-600 hover:text-indigo-700 mt-1">Change Photo</button>
                  </div>
                </div>
              </div>
              {/* Form */}
              <div className="bg-white rounded-xl border border-[#E8E6E0] p-5 shadow-sm space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  {[["First Name", "Admin"], ["Last Name", "User"]].map(([label, val]) => (
                    <div key={label}>
                      <label className="block text-[11px] font-semibold text-[#7C7870] uppercase tracking-wide mb-1">{label}</label>
                      <input defaultValue={val} className="w-full bg-[#F4F5F7] border border-[#E8E6E0] rounded-xl px-3 py-2.5 text-[13px] text-[#111] outline-none focus:border-indigo-400 transition-colors" />
                    </div>
                  ))}
                </div>
                {[
                  { label: "Email Address", value: "admin@homehaven.ca", icon: Mail },
                  { label: "Phone Number", value: "+1 (416) 555-0100", icon: Phone },
                  { label: "Website", value: "www.homehaven.ca", icon: Globe },
                ].map(({ label, value, icon: Icon }) => (
                  <div key={label}>
                    <label className="block text-[11px] font-semibold text-[#7C7870] uppercase tracking-wide mb-1">{label}</label>
                    <div className="relative">
                      <Icon size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A8A49C]" />
                      <input defaultValue={value} className="w-full bg-[#F4F5F7] border border-[#E8E6E0] rounded-xl pl-9 pr-3 py-2.5 text-[13px] text-[#111] outline-none focus:border-indigo-400 transition-colors" />
                    </div>
                  </div>
                ))}
                <button className="flex items-center gap-2 bg-[#111] hover:bg-[#222] text-white text-[13px] font-semibold px-5 py-2.5 rounded-xl transition-colors">
                  <Save size={14} /> Save Changes
                </button>
              </div>
            </div>
          )}

          {/* Notifications */}
          {activeTab === "notifications" && (
            <div className="max-w-xl space-y-5">
              <div>
                <h2 className="text-[16px] font-bold text-[#111]">Notification Preferences</h2>
                <p className="text-[13px] text-[#A8A49C] mt-0.5">Choose what you want to be notified about</p>
              </div>
              <div className="bg-white rounded-xl border border-[#E8E6E0] shadow-sm divide-y divide-[#F9F8F6]">
                {notificationSettings.map(({ label, description, key }) => (
                  <div key={key} className="flex items-center justify-between p-4 hover:bg-[#FAFAF8] transition-colors">
                    <div>
                      <p className="text-[13px] font-semibold text-[#111]">{label}</p>
                      <p className="text-[12px] text-[#A8A49C] mt-0.5">{description}</p>
                    </div>
                    <button onClick={() => toggleNotif(key)} className="ml-4 shrink-0">
                      {notifications[key]
                        ? <ToggleRight size={28} className="text-indigo-600" />
                        : <ToggleLeft size={28} className="text-[#C5BFB5]" />}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Security */}
          {activeTab === "security" && (
            <div className="max-w-xl space-y-5">
              <div>
                <h2 className="text-[16px] font-bold text-[#111]">Security Settings</h2>
                <p className="text-[13px] text-[#A8A49C] mt-0.5">Manage your password and account security</p>
              </div>
              <div className="bg-white rounded-xl border border-[#E8E6E0] shadow-sm p-5 space-y-4">
                <h3 className="text-[14px] font-bold text-[#111]">Change Password</h3>
                {["Current Password", "New Password", "Confirm New Password"].map((label, i) => (
                  <div key={label}>
                    <label className="block text-[11px] font-semibold text-[#7C7870] uppercase tracking-wide mb-1">{label}</label>
                    <div className="relative">
                      <Key size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A8A49C]" />
                      <input type={showPassword ? "text" : "password"} placeholder="••••••••"
                        className="w-full bg-[#F4F5F7] border border-[#E8E6E0] rounded-xl pl-9 pr-10 py-2.5 text-[13px] text-[#111] outline-none focus:border-indigo-400 transition-colors" />
                      {i === 0 && (
                        <button onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#A8A49C] hover:text-[#7C7870]">
                          {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                        </button>
                      )}
                    </div>
                  </div>
                ))}
                <button className="flex items-center gap-2 bg-[#111] hover:bg-[#222] text-white text-[13px] font-semibold px-5 py-2.5 rounded-xl transition-colors">
                  <Save size={14} /> Update Password
                </button>
              </div>
              <div className="bg-white rounded-xl border border-[#E8E6E0] shadow-sm p-5">
                <h3 className="text-[14px] font-bold text-[#111] mb-3">Two-Factor Authentication</h3>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[13px] text-[#7C7870]">Add an extra layer of security to your account</p>
                    <span className="text-[11px] font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full mt-1 inline-block">Not Enabled</span>
                  </div>
                  <button className="text-[13px] font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1">Enable <ChevronRight size={13} /></button>
                </div>
              </div>
            </div>
          )}

          {/* Appearance */}
          {activeTab === "appearance" && (
            <div className="max-w-xl space-y-5">
              <div>
                <h2 className="text-[16px] font-bold text-[#111]">Appearance</h2>
                <p className="text-[13px] text-[#A8A49C] mt-0.5">Customise how the admin panel looks</p>
              </div>
              <div className="bg-white rounded-xl border border-[#E8E6E0] shadow-sm p-5 space-y-5">
                <div>
                  <p className="text-[13px] font-bold text-[#111] mb-3">Accent Color</p>
                  <div className="flex items-center gap-3 flex-wrap">
                    {["#6366F1", "#8B5CF6", "#10B981", "#F59E0B", "#F43F5E", "#06B6D4", "#111111"].map((c) => (
                      <button key={c} onClick={() => setAccentColor(c)}
                        className={`w-8 h-8 rounded-full border-2 transition-all ${accentColor === c ? "border-[#111] scale-110" : "border-transparent"}`}
                        style={{ background: c }} />
                    ))}
                  </div>
                </div>
                <div className="border-t border-[#F0EDE6] pt-4">
                  <p className="text-[13px] font-bold text-[#111] mb-3">Sidebar Style</p>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { label: "Light (Current)", preview: "bg-[#FAFAF8]" },
                      { label: "Dark", preview: "bg-[#1a1d23]" },
                    ].map(({ label, preview }) => (
                      <div key={label} className="border-2 border-[#E8E6E0] rounded-xl overflow-hidden cursor-pointer hover:border-indigo-400 transition-colors">
                        <div className={`h-12 ${preview}`} />
                        <p className="text-[11px] font-semibold text-[#7C7870] text-center py-2">{label}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <button className="flex items-center gap-2 bg-[#111] hover:bg-[#222] text-white text-[13px] font-semibold px-5 py-2.5 rounded-xl transition-colors">
                  <Save size={14} /> Save Appearance
                </button>
              </div>
            </div>
          )}

          {/* Company */}
          {activeTab === "company" && (
            <div className="max-w-xl space-y-5">
              <div>
                <h2 className="text-[16px] font-bold text-[#111]">Company Information</h2>
                <p className="text-[13px] text-[#A8A49C] mt-0.5">Update your company details and branding</p>
              </div>
              <div className="bg-white rounded-xl border border-[#E8E6E0] shadow-sm p-5 space-y-4">
                {[
                  { label: "Company Name", value: "Home Haven Realty Inc." },
                  { label: "License Number", value: "RB-0042891-ON" },
                  { label: "Business Email", value: "hello@homehaven.ca" },
                  { label: "Business Phone", value: "+1 (416) 555-0100" },
                  { label: "Address", value: "100 King Street West, Toronto, ON" },
                  { label: "Website", value: "www.homehaven.ca" },
                ].map(({ label, value }) => (
                  <div key={label}>
                    <label className="block text-[11px] font-semibold text-[#7C7870] uppercase tracking-wide mb-1">{label}</label>
                    <input defaultValue={value} className="w-full bg-[#F4F5F7] border border-[#E8E6E0] rounded-xl px-3 py-2.5 text-[13px] text-[#111] outline-none focus:border-indigo-400 transition-colors" />
                  </div>
                ))}
                <button className="flex items-center gap-2 bg-[#111] hover:bg-[#222] text-white text-[13px] font-semibold px-5 py-2.5 rounded-xl transition-colors">
                  <Save size={14} /> Save Company Info
                </button>
              </div>
            </div>
          )}

          {/* Team */}
          {activeTab === "team" && (
            <div className="max-w-2xl space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-[16px] font-bold text-[#111]">Team & Roles</h2>
                  <p className="text-[13px] text-[#A8A49C] mt-0.5">Manage your team members and permissions</p>
                </div>
                <button className="flex items-center gap-2 bg-[#111] text-white text-[13px] font-semibold px-4 py-2 rounded-xl hover:bg-[#222] transition-colors">
                  + Invite Member
                </button>
              </div>
              <div className="bg-white rounded-xl border border-[#E8E6E0] shadow-sm divide-y divide-[#F9F8F6]">
                {teamMembers.map((m) => (
                  <div key={m.name} className="flex items-center gap-3 p-4 hover:bg-[#FAFAF8] transition-colors">
                    <div className={`w-9 h-9 rounded-full ${m.color} flex items-center justify-center text-white text-[11px] font-bold shrink-0`}>{m.initials}</div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] font-semibold text-[#111]">{m.name}</p>
                      <p className="text-[11px] text-[#A8A49C]">{m.email}</p>
                    </div>
                    <select defaultValue={m.role}
                      className="bg-[#F4F5F7] border border-[#E8E6E0] rounded-lg px-2.5 py-1.5 text-[12px] font-medium text-[#7C7870] outline-none">
                      {["Super Admin", "Manager", "Agent", "Read Only"].map(r => <option key={r}>{r}</option>)}
                    </select>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${m.status === "Active" ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-500"}`}>{m.status}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Billing */}
          {activeTab === "billing" && (
            <div className="max-w-xl space-y-5">
              <div>
                <h2 className="text-[16px] font-bold text-[#111]">Billing & Plan</h2>
                <p className="text-[13px] text-[#A8A49C] mt-0.5">Manage your subscription and payment details</p>
              </div>
              <div className="bg-indigo-600 rounded-xl p-5 text-white relative overflow-hidden">
                <div className="absolute -right-8 -top-8 w-32 h-32 rounded-full bg-white/10" />
                <p className="text-[12px] font-medium text-indigo-200 mb-1">Current Plan</p>
                <p className="text-[24px] font-bold tracking-tight">Pro Plan</p>
                <p className="text-[13px] text-indigo-200 mt-1">CA$99/month · Renews Apr 1, 2026</p>
                <div className="flex gap-3 mt-4">
                  <button className="bg-white text-indigo-600 text-[12px] font-bold px-4 py-2 rounded-lg hover:bg-indigo-50 transition-colors">Upgrade</button>
                  <button className="bg-white/15 text-white text-[12px] font-bold px-4 py-2 rounded-lg hover:bg-white/25 transition-colors">Manage</button>
                </div>
              </div>
              <div className="bg-white rounded-xl border border-[#E8E6E0] shadow-sm p-5">
                <h3 className="text-[14px] font-bold text-[#111] mb-3">Plan Features</h3>
                <div className="space-y-2">
                  {["Unlimited Properties", "Up to 10 Team Members", "Advanced Analytics", "Workflow Automation", "API Access", "Priority Support"].map((f) => (
                    <div key={f} className="flex items-center gap-2.5 text-[13px] text-[#7C7870]">
                      <div className="w-4 h-4 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      </div>
                      {f}
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-white rounded-xl border border-[#E8E6E0] shadow-sm p-5">
                <h3 className="text-[14px] font-bold text-[#111] mb-3">Payment Method</h3>
                <div className="flex items-center gap-3 p-3 rounded-xl bg-[#FAFAF8] border border-[#F0EDE6]">
                  <div className="w-10 h-7 bg-[#111] rounded-md flex items-center justify-center">
                    <CreditCard size={14} className="text-white" />
                  </div>
                  <div>
                    <p className="text-[13px] font-semibold text-[#111]">•••• •••• •••• 4242</p>
                    <p className="text-[11px] text-[#A8A49C]">Expires 09/27</p>
                  </div>
                  <button className="ml-auto text-[12px] font-semibold text-indigo-600 hover:text-indigo-700">Update</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}