"use client";

import { useEffect, useState } from "react";
import {
  Inbox, Search, Star, Archive, Trash2, Mail, MessageSquare,
  Phone, RefreshCw, AlertCircle, Plus, X, ChevronDown,
  CheckCheck, Eye, Filter,
} from "lucide-react";
import { supabase } from "@/lib/supabase";

// ── Types ─────────────────────────────────────────────────────────────────────

interface InboxMessage {
  id: string;
  from_name: string;
  from_email: string | null;
  from_phone: string | null;
  channel: "Email" | "SMS" | "WhatsApp" | "System";
  subject: string | null;
  body: string;
  is_read: boolean;
  is_starred: boolean;
  is_archived: boolean;
  sent_at: string;
}

// ── Config ────────────────────────────────────────────────────────────────────

const CHANNEL_CFG: Record<string, { color: string; bg: string; icon: React.ElementType }> = {
  Email:    { color: "text-indigo-700",  bg: "bg-indigo-100",  icon: Mail          },
  SMS:      { color: "text-violet-700",  bg: "bg-violet-100",  icon: MessageSquare },
  WhatsApp: { color: "text-emerald-700", bg: "bg-emerald-100", icon: Phone         },
  System:   { color: "text-slate-600",   bg: "bg-slate-100",   icon: Inbox         },
};

// ── Mock data ─────────────────────────────────────────────────────────────────

const now = Date.now();
const ago = (ms: number) => new Date(now - ms).toISOString();

const MOCK_MESSAGES: InboxMessage[] = [
  { id:"i1",  from_name:"Thomas Morrison",  from_email:"t.morrison@email.com",   from_phone:null,              channel:"Email",    subject:"Re: Counter Offer on 42 Maple Street",          body:"Thank you for the counter offer. We are willing to meet at CA$472,000 with a 30-day closing. Please let us know if this works.",                                                    is_read:false, is_starred:true,  is_archived:false, sent_at:ago(900000)    },
  { id:"i2",  from_name:"Aisha Patel",      from_email:"aisha.p@invest.com",      from_phone:null,              channel:"Email",    subject:"Vancouver Listing — ROI Analysis Request",      body:"Hi, I am very interested in the Vancouver listing. Could you please send me a detailed ROI analysis? My target is 15% annual return.",                                              is_read:false, is_starred:false, is_archived:false, sent_at:ago(3600000)   },
  { id:"i3",  from_name:"Carlos Mendez",    from_email:null,                      from_phone:"+1 (306) 555-0784",channel:"SMS",     subject:null,                                            body:"Hey, just checking in on the Regina property. Any updates on the inspection report?",                                                                                                is_read:false, is_starred:false, is_archived:false, sent_at:ago(7200000)   },
  { id:"i4",  from_name:"Sarah Nguyen",     from_email:null,                      from_phone:"+1 (780) 555-0912",channel:"WhatsApp",subject:null,                                            body:"Got 2 new leads from the open house yesterday! Both pre-approved. Adding to CRM now 🏠",                                                                                            is_read:true,  is_starred:true,  is_archived:false, sent_at:ago(86400000)  },
  { id:"i5",  from_name:"Marcus Reid",      from_email:"m.reid@outlook.ca",       from_phone:null,              channel:"Email",    subject:"Mortgage Pre-Approval — Ottawa Property",       body:"Please find my mortgage pre-approval letter attached. I am approved for CA$420,000 and ready to move forward on the Birchwood Court property.",                                     is_read:true,  is_starred:false, is_archived:false, sent_at:ago(172800000) },
  { id:"i6",  from_name:"HomeHaven System", from_email:null,                      from_phone:null,              channel:"System",   subject:"New Lead Assigned: Linda Cheng",                body:"A new lead has been assigned to you. Linda Cheng is a buyer looking for properties in Montreal with a budget of CA$1.3M. Please follow up within 24 hours.",                       is_read:true,  is_starred:false, is_archived:false, sent_at:ago(259200000) },
  { id:"i7",  from_name:"Derek Walsh",      from_email:"d.walsh@home.ca",         from_phone:null,              channel:"Email",    subject:"Inspection Report — Cedar Hills Drive",         body:"Hi, I have submitted the inspection report for 34 Cedar Hills Drive. Please review and let me know if there are any concerns before we proceed to closing.",                        is_read:true,  is_starred:false, is_archived:false, sent_at:ago(345600000) },
  { id:"i8",  from_name:"Fatima Hassan",    from_email:"fhassan@ventures.com",    from_phone:null,              channel:"Email",    subject:"Investment Portfolio Review",                   body:"HomeHaven has been my go-to for all investment properties in Winnipeg. I would like to schedule a portfolio review meeting for next week if possible.",                             is_read:true,  is_starred:false, is_archived:true,  sent_at:ago(432000000) },
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

export default function InboxPage() {
  const [messages, setMessages]   = useState<InboxMessage[]>(MOCK_MESSAGES);
  const [usingMock, setUsingMock] = useState(true);
  const [loading, setLoading]     = useState(true);
  const [selected, setSelected]   = useState<InboxMessage | null>(null);
  const [search, setSearch]       = useState("");
  const [tab, setTab]             = useState<"all" | "unread" | "starred" | "archived">("all");
  const [channelFilter, setChannelFilter] = useState("All");

  useEffect(() => {
    supabase.from("messages").select("*").eq("is_archived", false).order("sent_at", { ascending: false })
      .then(({ data }) => {
        if (data && data.length > 0) { setMessages(data as InboxMessage[]); setUsingMock(false); }
        setLoading(false);
      });
  }, []);

  const handleMarkRead = (id: string) => {
    setMessages((prev) => prev.map((m) => m.id === id ? { ...m, is_read: true } : m));
    if (!usingMock) supabase.from("messages").update({ is_read: true }).eq("id", id);
  };

  const handleStar = (id: string) => {
    setMessages((prev) => prev.map((m) => m.id === id ? { ...m, is_starred: !m.is_starred } : m));
  };

  const handleArchive = (id: string) => {
    setMessages((prev) => prev.map((m) => m.id === id ? { ...m, is_archived: true } : m));
    if (selected?.id === id) setSelected(null);
  };

  const handleDelete = (id: string) => {
    setMessages((prev) => prev.filter((m) => m.id !== id));
    if (selected?.id === id) setSelected(null);
  };

  const filtered = messages.filter((m) => {
    const q = search.toLowerCase();
    const matchSearch = m.from_name.toLowerCase().includes(q) ||
      (m.subject ?? "").toLowerCase().includes(q) ||
      m.body.toLowerCase().includes(q);
    const matchTab =
      tab === "all"      ? !m.is_archived :
      tab === "unread"   ? !m.is_read && !m.is_archived :
      tab === "starred"  ? m.is_starred :
      tab === "archived" ? m.is_archived : true;
    const matchChannel = channelFilter === "All" || m.channel === channelFilter;
    return matchSearch && matchTab && matchChannel;
  });

  const unreadCount = messages.filter((m) => !m.is_read && !m.is_archived).length;

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-6 py-5 bg-white border-b border-[#E8E6E0] flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <h1 className="text-[20px] font-bold text-[#111] tracking-tight">Inbox</h1>
          {unreadCount > 0 && (
            <span className="bg-indigo-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">{unreadCount}</span>
          )}
          <p className="text-[13px] text-[#A8A49C]">Dashboard › Inbox</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 border border-[#E8E6E0] rounded-xl px-4 py-2 text-[13px] font-semibold text-[#7C7870] hover:bg-[#F4F5F7] transition-colors">
            <CheckCheck size={14} /> Mark All Read
          </button>
          <button className="flex items-center gap-2 bg-[#111] hover:bg-[#222] text-white text-[13px] font-semibold px-4 py-2 rounded-xl transition-colors shadow-sm">
            <Plus size={15} /> Compose
          </button>
        </div>
      </div>

      {usingMock && !loading && (
        <div className="px-6 py-2.5 bg-amber-50 border-b border-amber-200 flex items-center gap-2">
          <AlertCircle size={14} className="text-amber-600" />
          <span className="text-[13px] text-amber-700">Showing sample data</span>
        </div>
      )}

      <div className="flex flex-1 overflow-hidden">
        {/* Left panel */}
        <div className="w-[340px] min-w-[340px] border-r border-[#E8E6E0] flex flex-col bg-white">
          {/* Search + filters */}
          <div className="p-3 space-y-2 border-b border-[#F0EDE6]">
            <div className="flex items-center gap-2 bg-[#F4F5F7] rounded-xl px-3 py-2">
              <Search size={13} className="text-[#A8A49C] shrink-0" />
              <input type="text" placeholder="Search inbox..." value={search} onChange={(e) => setSearch(e.target.value)}
                className="bg-transparent text-[13px] text-[#111] placeholder-[#C5BFB5] outline-none w-full" />
            </div>
            <div className="flex items-center gap-1 bg-[#F4F5F7] rounded-xl p-1">
              {(["all","unread","starred","archived"] as const).map((t) => (
                <button key={t} onClick={() => setTab(t)}
                  className={`flex-1 text-[10px] font-semibold py-1.5 rounded-lg transition-colors capitalize ${tab === t ? "bg-white text-[#111] shadow-sm" : "text-[#7C7870]"}`}>
                  {t}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-1 bg-[#F4F5F7] rounded-xl p-1">
              {["All","Email","SMS","WhatsApp","System"].map((c) => (
                <button key={c} onClick={() => setChannelFilter(c)}
                  className={`flex-1 text-[9px] font-semibold py-1.5 rounded-lg transition-colors ${channelFilter === c ? "bg-white text-[#111] shadow-sm" : "text-[#7C7870]"}`}>
                  {c}
                </button>
              ))}
            </div>
          </div>

          {/* Message list */}
          <div className="flex-1 overflow-y-auto divide-y divide-[#F9F8F6]">
            {loading ? (
              <div className="flex items-center justify-center h-32 gap-2 text-[#A8A49C]">
                <RefreshCw size={16} className="animate-spin" />
                <span className="text-[13px]">Loading…</span>
              </div>
            ) : filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-32 text-[#A8A49C]">
                <Inbox size={24} className="opacity-30 mb-2" />
                <p className="text-[13px]">No messages</p>
              </div>
            ) : filtered.map((msg) => {
              const cfg = CHANNEL_CFG[msg.channel] ?? CHANNEL_CFG.System;
              const Icon = cfg.icon;
              const isActive = selected?.id === msg.id;
              return (
                <div key={msg.id} onClick={() => { setSelected(msg); handleMarkRead(msg.id); }}
                  className={`flex items-start gap-3 p-4 cursor-pointer transition-colors hover:bg-[#FAFAF8] ${isActive ? "bg-indigo-50 border-l-2 border-indigo-500" : ""}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-[11px] font-bold shrink-0 ${msg.is_read ? "bg-[#C5BFB5]" : "bg-indigo-500"}`}>
                    {msg.from_name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-0.5">
                      <p className={`text-[13px] truncate ${!msg.is_read ? "font-bold text-[#111]" : "font-medium text-[#444]"}`}>
                        {msg.from_name}
                      </p>
                      <span className="text-[10px] text-[#A8A49C] shrink-0 ml-1">{timeAgo(msg.sent_at)}</span>
                    </div>
                    {msg.subject && (
                      <p className={`text-[12px] truncate ${!msg.is_read ? "font-semibold text-[#374151]" : "text-[#7C7870]"}`}>
                        {msg.subject}
                      </p>
                    )}
                    <p className="text-[11px] text-[#A8A49C] truncate mt-0.5">{msg.body}</p>
                    <div className="flex items-center gap-1.5 mt-1">
                      <span className={`flex items-center gap-1 text-[9px] font-semibold px-1.5 py-0.5 rounded-md ${cfg.bg} ${cfg.color}`}>
                        <Icon size={8} />{msg.channel}
                      </span>
                      {msg.is_starred && <Star size={10} fill="#F59E0B" className="text-amber-400" />}
                      {!msg.is_read && <span className="w-2 h-2 rounded-full bg-indigo-500" />}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right panel — message detail */}
        <div className="flex-1 flex flex-col bg-[#F9F8F6] overflow-hidden">
          {selected ? (
            <>
              <div className="px-6 py-4 bg-white border-b border-[#E8E6E0] flex items-center justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <h2 className="text-[15px] font-bold text-[#111] truncate">{selected.subject ?? selected.from_name}</h2>
                  <p className="text-[12px] text-[#7C7870] mt-0.5">
                    From: <span className="font-semibold text-[#111]">{selected.from_name}</span>
                    {selected.from_email && ` <${selected.from_email}>`}
                    {selected.from_phone && ` · ${selected.from_phone}`}
                    <span className="ml-2 text-[#A8A49C]">{timeAgo(selected.sent_at)}</span>
                  </p>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <button onClick={() => handleStar(selected.id)}
                    className={`p-2 rounded-xl transition-colors ${selected.is_starred ? "text-amber-400" : "text-[#A8A49C] hover:bg-[#F4F5F7]"}`}>
                    <Star size={15} fill={selected.is_starred ? "#F59E0B" : "none"} />
                  </button>
                  <button onClick={() => handleArchive(selected.id)}
                    className="p-2 rounded-xl text-[#A8A49C] hover:bg-[#F4F5F7] transition-colors">
                    <Archive size={15} />
                  </button>
                  <button onClick={() => handleDelete(selected.id)}
                    className="p-2 rounded-xl text-[#A8A49C] hover:bg-rose-50 hover:text-rose-500 transition-colors">
                    <Trash2 size={15} />
                  </button>
                  <button onClick={() => setSelected(null)}
                    className="p-2 rounded-xl text-[#A8A49C] hover:bg-[#F4F5F7] transition-colors">
                    <X size={15} />
                  </button>
                </div>
              </div>
              <div className="flex-1 overflow-y-auto p-6">
                <div className="bg-white rounded-xl border border-[#E8E6E0] shadow-sm p-6 max-w-2xl">
                  <p className="text-[14px] text-[#374151] leading-relaxed whitespace-pre-wrap">{selected.body}</p>
                </div>
                <div className="mt-4 max-w-2xl">
                  <textarea rows={4} placeholder="Reply..."
                    className="w-full bg-white border border-[#E8E6E0] rounded-xl px-4 py-3 text-[13px] text-[#111] outline-none focus:border-indigo-400 resize-none" />
                  <div className="flex justify-end mt-2">
                    <button className="flex items-center gap-2 bg-[#111] hover:bg-[#222] text-white text-[13px] font-semibold px-5 py-2.5 rounded-xl transition-colors">
                      Send Reply
                    </button>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-[#A8A49C]">
              <div className="w-20 h-20 rounded-full bg-[#F0EDE6] flex items-center justify-center mb-4">
                <Inbox size={36} className="opacity-40" />
              </div>
              <p className="text-[16px] font-semibold text-[#7C7870]">Select a message</p>
              <p className="text-[13px] mt-1">Choose a message from the list to read it</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
