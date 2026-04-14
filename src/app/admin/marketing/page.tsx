"use client";

import { useEffect, useState } from "react";
import {
  Plus, AlertCircle, Send, Mail, BarChart2,
  FileText, X, CheckCircle2, Trash2, Pencil,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer,
} from "recharts";

// ── Types ─────────────────────────────────────────────────────────────────────

type CampaignStatus = "Draft" | "Scheduled" | "Sent" | "Paused";
type AudienceSegment = "All Contacts" | "Hot Leads" | "Buyers" | "Investors";

interface Campaign {
  id: string;
  name: string;
  subject: string;
  status: CampaignStatus;
  audience: AudienceSegment;
  scheduled_at: string | null;
  sent_count: number;
  open_rate: number;
  click_rate: number;
  template: string;
  created_at: string;
}

// ── Config ────────────────────────────────────────────────────────────────────

const STATUS_CFG: Record<CampaignStatus, { bg: string; text: string }> = {
  Draft:     { bg: "bg-slate-100",  text: "text-slate-600"  },
  Scheduled: { bg: "bg-indigo-100", text: "text-indigo-700" },
  Sent:      { bg: "bg-emerald-100",text: "text-emerald-700"},
  Paused:    { bg: "bg-amber-100",  text: "text-amber-700"  },
};

const TEMPLATES = [
  { id: "invoice",           name: "Invoice Email",              desc: "Send invoice with payment details and due date"    },
  { id: "contract_signature",name: "Contract Signature Request", desc: "Request e-signature on a contract"                },
  { id: "lead_welcome",      name: "Lead Welcome",               desc: "Welcome new leads with agent intro"               },
  { id: "appointment_reminder",name:"Appointment Reminder",      desc: "Remind contacts of upcoming appointments"         },
  { id: "weekly_report",     name: "Weekly Report",              desc: "Weekly performance summary for agents"            },
];

const SEGMENTS: AudienceSegment[] = ["All Contacts", "Hot Leads", "Buyers", "Investors"];

// ── Mock data ─────────────────────────────────────────────────────────────────

const now = Date.now();
const dAgo = (d: number) => new Date(now - d * 86400000).toISOString();

const MOCK_CAMPAIGNS: Campaign[] = [
  { id:"c1", name:"Spring Buyer Outreach",      subject:"Exclusive Spring Listings Just for You",  status:"Sent",      audience:"Buyers",       scheduled_at:dAgo(10), sent_count:342, open_rate:48.2, click_rate:12.1, template:"lead_welcome",            created_at:dAgo(12) },
  { id:"c2", name:"Investor Monthly Digest",    subject:"Top Investment Opportunities – April",    status:"Sent",      audience:"Investors",    scheduled_at:dAgo(5),  sent_count:218, open_rate:52.7, click_rate:14.3, template:"weekly_report",           created_at:dAgo(7)  },
  { id:"c3", name:"Contract Reminder Blast",    subject:"Your Contract Awaits Your Signature",     status:"Sent",      audience:"All Contacts", scheduled_at:dAgo(3),  sent_count:189, open_rate:61.4, click_rate:9.8,  template:"contract_signature",      created_at:dAgo(4)  },
  { id:"c4", name:"Hot Leads Follow-Up",        subject:"We Found Properties That Match You",      status:"Scheduled", audience:"Hot Leads",    scheduled_at:dAgo(-2), sent_count:0,   open_rate:0,    click_rate:0,    template:"lead_welcome",            created_at:dAgo(1)  },
  { id:"c5", name:"April Invoice Reminder",     subject:"Invoice #INV-0042 Due in 3 Days",         status:"Draft",     audience:"All Contacts", scheduled_at:null,     sent_count:0,   open_rate:0,    click_rate:0,    template:"invoice",                 created_at:dAgo(0)  },
  { id:"c6", name:"Appointment Confirmations",  subject:"Reminder: Your Site Visit Tomorrow",      status:"Paused",    audience:"Buyers",       scheduled_at:dAgo(1),  sent_count:74,  open_rate:71.6, click_rate:18.9, template:"appointment_reminder",    created_at:dAgo(2)  },
  { id:"c7", name:"Weekly Agent Report",        subject:"Your Weekly Performance Summary",         status:"Sent",      audience:"All Contacts", scheduled_at:dAgo(7),  sent_count:56,  open_rate:44.6, click_rate:7.2,  template:"weekly_report",           created_at:dAgo(8)  },
];

// ── 30-day chart data ─────────────────────────────────────────────────────────

const CHART_DATA = Array.from({ length: 30 }, (_, i) => {
  const d = new Date(now - (29 - i) * 86400000);
  const label = d.toLocaleDateString("en-CA", { month: "short", day: "numeric" });
  const sent   = Math.floor(Math.random() * 151) + 50;
  const opened = Math.floor(sent * (0.30 + Math.random() * 0.30));
  const clicked= Math.floor(sent * (0.05 + Math.random() * 0.10));
  return { date: label, sent, opened, clicked };
});

// ── New Campaign Modal ────────────────────────────────────────────────────────

function CampaignModal({ onClose, onSave }: {
  onClose: () => void;
  onSave: (c: Campaign) => void;
}) {
  const [form, setForm] = useState({
    name: "", subject: "", audience: "All Contacts" as AudienceSegment,
    scheduled_at: "", template: TEMPLATES[0].id,
  });
  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = () => {
    if (!form.name || !form.subject) return;
    onSave({
      id: Date.now().toString(),
      name: form.name,
      subject: form.subject,
      status: "Draft",
      audience: form.audience,
      scheduled_at: form.scheduled_at || null,
      sent_count: 0,
      open_rate: 0,
      click_rate: 0,
      template: form.template,
      created_at: new Date().toISOString(),
    });
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl border border-[#E8E6E0] shadow-2xl w-full max-w-md" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-5 border-b border-[#F0EDE6]">
          <h2 className="text-[16px] font-bold text-[#111]">New Campaign</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-[#F4F5F7] text-[#A8A49C]"><X size={15} /></button>
        </div>
        <div className="p-5 space-y-3">
          {[
            { label: "Campaign Name", key: "name",    type: "text",  placeholder: "e.g. Spring Buyer Outreach" },
            { label: "Subject Line",  key: "subject", type: "text",  placeholder: "e.g. Exclusive Listings Just for You" },
          ].map(({ label, key, type, placeholder }) => (
            <div key={key}>
              <label className="block text-[11px] font-semibold text-[#7C7870] uppercase tracking-wide mb-1">{label}</label>
              <input type={type} value={(form as Record<string, string>)[key]} placeholder={placeholder}
                onChange={(e) => set(key, e.target.value)}
                className="w-full bg-[#F4F5F7] border border-[#E8E6E0] rounded-xl px-3 py-2.5 text-[13px] text-[#111] outline-none focus:border-indigo-400" />
            </div>
          ))}
          <div>
            <label className="block text-[11px] font-semibold text-[#7C7870] uppercase tracking-wide mb-1">Audience Segment</label>
            <select value={form.audience} onChange={(e) => set("audience", e.target.value)}
              className="w-full bg-[#F4F5F7] border border-[#E8E6E0] rounded-xl px-3 py-2.5 text-[13px] text-[#7C7870] outline-none">
              {SEGMENTS.map((s) => <option key={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-[#7C7870] uppercase tracking-wide mb-1">Scheduled Date / Time</label>
            <input type="datetime-local" value={form.scheduled_at} onChange={(e) => set("scheduled_at", e.target.value)}
              className="w-full bg-[#F4F5F7] border border-[#E8E6E0] rounded-xl px-3 py-2.5 text-[13px] text-[#111] outline-none focus:border-indigo-400" />
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-[#7C7870] uppercase tracking-wide mb-1">Template</label>
            <select value={form.template} onChange={(e) => set("template", e.target.value)}
              className="w-full bg-[#F4F5F7] border border-[#E8E6E0] rounded-xl px-3 py-2.5 text-[13px] text-[#7C7870] outline-none">
              {TEMPLATES.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
            </select>
          </div>
          <div className="flex gap-2 pt-1">
            <button onClick={onClose}
              className="flex-1 border border-[#E8E6E0] rounded-xl py-2.5 text-[13px] font-semibold text-[#7C7870] hover:bg-[#F4F5F7] transition-colors">
              Cancel
            </button>
            <button onClick={handleSubmit} disabled={!form.name || !form.subject}
              className="flex-1 bg-[#111] hover:bg-[#222] disabled:opacity-40 text-white text-[13px] font-semibold py-2.5 rounded-xl transition-colors">
              Create Campaign
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Toast ─────────────────────────────────────────────────────────────────────

function Toast({ message, onDone }: { message: string; onDone: () => void }) {
  useEffect(() => { const t = setTimeout(onDone, 2500); return () => clearTimeout(t); }, [onDone]);
  return (
    <div className="fixed bottom-6 right-6 z-50 bg-[#111] text-white text-[13px] font-semibold px-4 py-3 rounded-xl shadow-xl flex items-center gap-2">
      <CheckCircle2 size={15} className="text-emerald-400" /> {message}
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function MarketingPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>(MOCK_CAMPAIGNS);
  const [usingMock, setUsingMock] = useState(true);
  const [statusFilter, setStatusFilter] = useState("All");
  const [showModal, setShowModal] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    supabase.from("campaigns").select("*").order("created_at", { ascending: false })
      .then(({ data }) => {
        if (data && data.length > 0) { setCampaigns(data as Campaign[]); setUsingMock(false); }
      });
  }, []);

  // ── KPI stats ──────────────────────────────────────────────────────────────

  const totalCampaigns = campaigns.length;
  const totalSent      = campaigns.reduce((s, c) => s + c.sent_count, 0);
  const sentCampaigns  = campaigns.filter((c) => c.sent_count > 0);
  const avgOpen  = sentCampaigns.length ? (sentCampaigns.reduce((s, c) => s + c.open_rate,  0) / sentCampaigns.length).toFixed(1) : "0.0";
  const avgClick = sentCampaigns.length ? (sentCampaigns.reduce((s, c) => s + c.click_rate, 0) / sentCampaigns.length).toFixed(1) : "0.0";

  // ── Send Now ───────────────────────────────────────────────────────────────

  const handleSendNow = async (id: string) => {
    const campaign = campaigns.find((c) => c.id === id);
    if (!campaign) return;
    setCampaigns((prev) => prev.map((c) => c.id === id ? { ...c, status: "Sent", sent_count: Math.floor(Math.random() * 200) + 50 } : c));
    try {
      await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ to: "segment@example.com", template: campaign.template, subject: campaign.subject }),
      });
    } catch { /* optimistic — ignore network errors */ }
    setToast(`"${campaign.name}" sent successfully!`);
  };

  const handleDelete = (id: string) =>
    setCampaigns((prev) => prev.filter((c) => c.id !== id));

  const handleSave = (c: Campaign) => { setCampaigns((prev) => [c, ...prev]); setShowModal(false); };

  const filtered = campaigns.filter((c) => statusFilter === "All" || c.status === statusFilter);

  const fmtDate = (iso: string | null) => {
    if (!iso) return "—";
    return new Date(iso).toLocaleDateString("en-CA", { month: "short", day: "numeric", year: "numeric" });
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-6 py-5 bg-white border-b border-[#E8E6E0] flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-[20px] font-bold text-[#111] tracking-tight">Marketing</h1>
          <p className="text-[13px] text-[#A8A49C] mt-0.5">Dashboard › Marketing</p>
        </div>
        <button onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-[#111] hover:bg-[#222] text-white text-[13px] font-semibold px-4 py-2 rounded-xl transition-colors shadow-sm">
          <Plus size={15} /> New Campaign
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-5">

        {/* Sample banner */}
        {usingMock && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-2.5 text-[13px] text-amber-700 flex items-center gap-2">
            <AlertCircle size={14} /> Showing sample data — connect Supabase to load live campaigns.
          </div>
        )}

        {/* KPI cards */}
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
          {[
            { label: "Total Campaigns", value: totalCampaigns,    icon: BarChart2,  color: "bg-indigo-50 text-indigo-600"  },
            { label: "Emails Sent",     value: totalSent.toLocaleString(), icon: Send, color: "bg-emerald-50 text-emerald-600" },
            { label: "Avg Open Rate",   value: `${avgOpen}%`,     icon: Mail,       color: "bg-amber-50 text-amber-600"    },
            { label: "Avg Click Rate",  value: `${avgClick}%`,    icon: FileText,   color: "bg-violet-50 text-violet-600"  },
          ].map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="bg-white rounded-xl border border-[#E8E6E0] shadow-sm p-4 flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${color}`}>
                <Icon size={18} />
              </div>
              <div>
                <p className="text-[11px] font-semibold text-[#7C7870] uppercase tracking-wide">{label}</p>
                <p className="text-[22px] font-bold text-[#111] tracking-tight leading-none mt-0.5">{value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Analytics chart */}
        <div className="bg-white rounded-xl border border-[#E8E6E0] shadow-sm p-5">
          <h3 className="text-[14px] font-bold text-[#111] mb-4">30-Day Email Trends</h3>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={CHART_DATA} margin={{ top: 0, right: 8, bottom: 0, left: -10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F0EDE6" vertical={false} />
              <XAxis dataKey="date" tick={{ fontSize: 10, fill: "#A8A49C" }} axisLine={false} tickLine={false}
                interval={4} />
              <YAxis tick={{ fontSize: 10, fill: "#A8A49C" }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: "#111", border: "none", borderRadius: "10px", color: "#fff", fontSize: "12px" }} />
              <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: "11px", color: "#7C7870" }} />
              <Line type="monotone" dataKey="sent"   stroke="#6366F1" strokeWidth={2} dot={false} name="Sent"   />
              <Line type="monotone" dataKey="opened" stroke="#10B981" strokeWidth={2} dot={false} name="Opened" />
              <Line type="monotone" dataKey="clicked"stroke="#F59E0B" strokeWidth={2} dot={false} name="Clicked"/>
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Filter bar */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1 bg-white border border-[#E8E6E0] rounded-xl p-1 shadow-sm">
            {(["All", "Draft", "Scheduled", "Sent", "Paused"] as const).map((s) => (
              <button key={s} onClick={() => setStatusFilter(s)}
                className={`text-[11px] font-semibold px-3 py-1.5 rounded-lg transition-colors ${statusFilter === s ? "bg-[#111] text-white shadow-sm" : "text-[#7C7870] hover:text-[#111]"}`}>
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Campaign table */}
        <div className="bg-white rounded-xl border border-[#E8E6E0] shadow-sm overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#F0EDE6]">
                {["Campaign","Status","Audience","Scheduled","Sent","Open Rate","Click Rate",""].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-[11px] font-semibold text-[#7C7870] uppercase tracking-wide whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F9F8F6]">
              {filtered.length === 0 ? (
                <tr><td colSpan={8} className="px-4 py-10 text-center text-[13px] text-[#A8A49C]">No campaigns match this filter.</td></tr>
              ) : filtered.map((c) => {
                const sc = STATUS_CFG[c.status];
                return (
                  <tr key={c.id} className="hover:bg-[#FAFAF8] transition-colors group">
                    <td className="px-4 py-3">
                      <p className="text-[13px] font-semibold text-[#111]">{c.name}</p>
                      <p className="text-[11px] text-[#A8A49C] truncate max-w-[200px]">{c.subject}</p>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${sc.bg} ${sc.text}`}>{c.status}</span>
                    </td>
                    <td className="px-4 py-3 text-[12px] text-[#7C7870]">{c.audience}</td>
                    <td className="px-4 py-3 text-[12px] text-[#7C7870] whitespace-nowrap">{fmtDate(c.scheduled_at)}</td>
                    <td className="px-4 py-3 text-[13px] font-semibold text-[#111]">{c.sent_count > 0 ? c.sent_count.toLocaleString() : "—"}</td>
                    <td className="px-4 py-3 text-[13px] text-emerald-600 font-semibold">{c.open_rate > 0 ? `${c.open_rate}%` : "—"}</td>
                    <td className="px-4 py-3 text-[13px] text-indigo-600 font-semibold">{c.click_rate > 0 ? `${c.click_rate}%` : "—"}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        {c.status === "Draft" && (
                          <button onClick={() => handleSendNow(c.id)}
                            className="flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1.5 rounded-lg bg-[#111] text-white hover:bg-[#333] transition-colors whitespace-nowrap">
                            <Send size={11} /> Send Now
                          </button>
                        )}
                        <button className="w-7 h-7 rounded-lg flex items-center justify-center text-[#A8A49C] hover:bg-[#F4F5F7] border border-[#E8E6E0] transition-colors">
                          <Pencil size={12} />
                        </button>
                        <button onClick={() => handleDelete(c.id)}
                          className="w-7 h-7 rounded-lg flex items-center justify-center text-[#A8A49C] hover:bg-rose-50 hover:text-rose-500 border border-[#E8E6E0] transition-colors">
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Template library */}
        <div>
          <h3 className="text-[14px] font-bold text-[#111] mb-3">Template Library</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {TEMPLATES.map((t) => (
              <div key={t.id} className="bg-white rounded-xl border border-[#E8E6E0] shadow-sm p-4 flex flex-col gap-3">
                <div className="w-9 h-9 rounded-xl bg-indigo-50 flex items-center justify-center shrink-0">
                  <Mail size={16} className="text-indigo-500" />
                </div>
                <div className="flex-1">
                  <p className="text-[13px] font-semibold text-[#111]">{t.name}</p>
                  <p className="text-[12px] text-[#7C7870] mt-0.5">{t.desc}</p>
                </div>
                <button
                  onClick={() => { setShowModal(true); }}
                  className="border border-[#E8E6E0] rounded-xl px-3 py-1.5 text-[12px] font-semibold text-[#7C7870] hover:bg-[#F4F5F7] transition-colors w-fit">
                  Use Template
                </button>
              </div>
            ))}
          </div>
        </div>

      </div>

      {showModal && <CampaignModal onClose={() => setShowModal(false)} onSave={handleSave} />}
      {toast && <Toast message={toast} onDone={() => setToast(null)} />}
    </div>
  );
}
