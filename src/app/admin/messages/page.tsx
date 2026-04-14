"use client";

import { useEffect, useState, useRef } from "react";
import {
  Send, Search, Plus, Phone, Mail, MessageSquare,
  Star, Archive, Trash2, RefreshCw, Paperclip,
  ChevronDown, X, Check, CheckCheck, Clock,
  Globe, Filter, MoreHorizontal, Smile, Image,
  AtSign, Hash,
} from "lucide-react";
import { supabase } from "@/lib/supabase";

// ── Types ─────────────────────────────────────────────────────────────────────

type Channel = "All" | "Email" | "SMS" | "WhatsApp";

interface Contact {
  id: string;
  name: string;
  initials: string;
  avatar_color: string;
  phone?: string;
  email?: string;
  type: string;
  last_message: string;
  last_message_time: string;
  unread: number;
  channel: "Email" | "SMS" | "WhatsApp";
  online: boolean;
}

interface Message {
  id: string;
  contact_id: string;
  body: string;
  direction: "inbound" | "outbound";
  channel: "Email" | "SMS" | "WhatsApp";
  status: "sent" | "delivered" | "read" | "failed";
  timestamp: string;
  subject?: string;
}

// ── Mock contacts ─────────────────────────────────────────────────────────────

const MOCK_CONTACTS: Contact[] = [
  { id:"con1", name:"Thomas Morrison",  initials:"TM", avatar_color:"bg-indigo-500",  phone:"+1 (416) 555-0182", email:"t.morrison@email.com", type:"Buyer",    last_message:"Thank you for sending the counter offer. We are willing to meet at CA$472,000",           last_message_time:new Date(Date.now()-1800000).toISOString(),   unread:2, channel:"SMS",   online:true  },
  { id:"con2", name:"Aisha Patel",      initials:"AP", avatar_color:"bg-emerald-500", phone:"+1 (604) 555-0247", email:"aisha.p@invest.com",   type:"Investor", last_message:"I am very interested in the Vancouver listing. Can we schedule a call this week?",        last_message_time:new Date(Date.now()-3600000).toISOString(),   unread:1, channel:"Email", online:true  },
  { id:"con3", name:"Derek Walsh",      initials:"DW", avatar_color:"bg-violet-500",  phone:"+1 (403) 555-0391", email:"d.walsh@home.ca",      type:"Seller",   last_message:"Hey, just checking if you got my docs? Submitted the inspection report this morning.",  last_message_time:new Date(Date.now()-7200000).toISOString(),   unread:0, channel:"SMS",   online:false },
  { id:"con4", name:"Carlos Mendez",    initials:"CM", avatar_color:"bg-orange-500",  phone:"+1 (306) 555-0784", email:"c.mendez@realty.ca",   type:"Investor", last_message:"I heard you have an off-market property in Edmonton. My criteria: 20% ROI minimum.",    last_message_time:new Date(Date.now()-86400000).toISOString(),  unread:0, channel:"Email", online:false },
  { id:"con5", name:"Marcus Reid",      initials:"MR", avatar_color:"bg-rose-500",    phone:"+1 (613) 555-0456", email:"m.reid@outlook.ca",    type:"Buyer",    last_message:"Please find my mortgage pre-approval letter attached. Approved for CA$420,000.",         last_message_time:new Date(Date.now()-2*86400000).toISOString(),unread:0, channel:"Email", online:false },
  { id:"con6", name:"Sarah Nguyen",     initials:"SN", avatar_color:"bg-cyan-500",    phone:"+1 (780) 555-0912", email:"s.nguyen@realty.com",  type:"Agent",    last_message:"Got 2 new leads from the open house yesterday. Will update CRM tonight!",               last_message_time:new Date(Date.now()-3*86400000).toISOString(),unread:3, channel:"WhatsApp",online:true  },
  { id:"con7", name:"Fatima Hassan",    initials:"FH", avatar_color:"bg-teal-500",    phone:"+1 (204) 555-0673", email:"fhassan@ventures.com", type:"Investor", last_message:"HomeHaven has been my go-to for all investment properties in Winnipeg.",               last_message_time:new Date(Date.now()-4*86400000).toISOString(),unread:0, channel:"SMS",   online:false },
  { id:"con8", name:"Linda Cheng",      initials:"LC", avatar_color:"bg-amber-500",   phone:"+1 (514) 555-0128", email:"lindacheng@mail.com",  type:"Buyer",    last_message:"Is there anything similar available in Montreal? My budget is up to CA$1.3M.",          last_message_time:new Date(Date.now()-5*86400000).toISOString(),unread:0, channel:"Email", online:false },
];

// ── Mock messages ─────────────────────────────────────────────────────────────

const MOCK_MESSAGES: Record<string, Message[]> = {
  con1: [
    { id:"m1",  contact_id:"con1", body:"Hi, I am interested in the property at 42 Maple Street. Can we schedule a viewing?",                    direction:"inbound",  channel:"SMS",   status:"read",      timestamp:new Date(Date.now()-86400000*2).toISOString() },
    { id:"m2",  contact_id:"con1", body:"Hi Thomas! Absolutely. I have availability this Saturday at 10 AM or Sunday at 2 PM. Which works best?", direction:"outbound", channel:"SMS",   status:"read",      timestamp:new Date(Date.now()-86400000*2+3600000).toISOString() },
    { id:"m3",  contact_id:"con1", body:"Saturday at 10 AM works perfectly. Looking forward to it!",                                              direction:"inbound",  channel:"SMS",   status:"read",      timestamp:new Date(Date.now()-86400000*2+7200000).toISOString() },
    { id:"m4",  contact_id:"con1", body:"Great! I have sent you the address details and a brief property overview. See you Saturday!",            direction:"outbound", channel:"SMS",   status:"read",      timestamp:new Date(Date.now()-86400000*2+10800000).toISOString() },
    { id:"m5",  contact_id:"con1", body:"Just toured the property. We are very interested. What is the asking price and are there other offers?", direction:"inbound",  channel:"SMS",   status:"read",      timestamp:new Date(Date.now()-86400000).toISOString() },
    { id:"m6",  contact_id:"con1", body:"The asking price is CA$480,000. We currently have one other interested party but no formal offers yet.",  direction:"outbound", channel:"SMS",   status:"read",      timestamp:new Date(Date.now()-86400000+3600000).toISOString() },
    { id:"m7",  contact_id:"con1", body:"Thank you for sending the counter offer. We are willing to meet at CA$472,000 with a 30-day closing.",   direction:"inbound",  channel:"SMS",   status:"delivered", timestamp:new Date(Date.now()-1800000).toISOString() },
    { id:"m8",  contact_id:"con1", body:"We are very motivated buyers and ready to move forward quickly. Please let us know!",                    direction:"inbound",  channel:"SMS",   status:"delivered", timestamp:new Date(Date.now()-900000).toISOString() },
  ],
  con2: [
    { id:"m9",  contact_id:"con2", body:"Good morning Aisha, following up on the three properties we discussed last week.",                       direction:"outbound", channel:"Email", status:"read",      timestamp:new Date(Date.now()-3*86400000).toISOString(),  subject:"Follow-up: Portfolio Properties" },
    { id:"m10", contact_id:"con2", body:"Thanks for reaching out. I am particularly interested in the Vancouver listing and Ottawa property.",    direction:"inbound",  channel:"Email", status:"read",      timestamp:new Date(Date.now()-2*86400000).toISOString(),  subject:"Re: Follow-up: Portfolio Properties" },
    { id:"m11", contact_id:"con2", body:"Great choices! I will put together detailed ROI analysis for both and send them over today.",            direction:"outbound", channel:"Email", status:"read",      timestamp:new Date(Date.now()-2*86400000+3600000).toISOString(), subject:"Re: Follow-up: Portfolio Properties" },
    { id:"m12", contact_id:"con2", body:"I am very interested in the Vancouver listing. Can we schedule a call this week to go over the numbers?",direction:"inbound",  channel:"Email", status:"delivered", timestamp:new Date(Date.now()-3600000).toISOString(),     subject:"Re: Follow-up: Portfolio Properties" },
  ],
  con6: [
    { id:"m13", contact_id:"con6", body:"Hey! Open house went really well today 🏠",                                                              direction:"inbound",  channel:"WhatsApp", status:"read",   timestamp:new Date(Date.now()-4*86400000).toISOString() },
    { id:"m14", contact_id:"con6", body:"Amazing! How many people came through?",                                                                 direction:"outbound", channel:"WhatsApp", status:"read",   timestamp:new Date(Date.now()-4*86400000+1800000).toISOString() },
    { id:"m15", contact_id:"con6", body:"About 18 couples! 4 seemed really serious. Getting their contact info now",                             direction:"inbound",  channel:"WhatsApp", status:"read",   timestamp:new Date(Date.now()-4*86400000+3600000).toISOString() },
    { id:"m16", contact_id:"con6", body:"That is excellent Sarah! Please add them to CRM as soon as possible 🎯",                                direction:"outbound", channel:"WhatsApp", status:"read",   timestamp:new Date(Date.now()-3*86400000).toISOString() },
    { id:"m17", contact_id:"con6", body:"Got 2 new leads from the open house yesterday. Will update CRM tonight!",                               direction:"inbound",  channel:"WhatsApp", status:"delivered",timestamp:new Date(Date.now()-3*86400000+86400000).toISOString() },
    { id:"m18", contact_id:"con6", body:"Both seem qualified! One is pre-approved for 600K 🔥🔥",                                                 direction:"inbound",  channel:"WhatsApp", status:"delivered",timestamp:new Date(Date.now()-3*86400000+90000000).toISOString() },
    { id:"m19", contact_id:"con6", body:"Great job! I will follow up with them first thing tomorrow",                                             direction:"outbound", channel:"WhatsApp", status:"sent",   timestamp:new Date(Date.now()-3*86400000+93600000).toISOString() },
  ],
};

// ── Helpers ───────────────────────────────────────────────────────────────────

function timeLabel(iso: string) {
  const d = Date.now() - new Date(iso).getTime();
  const m = Math.floor(d / 60000);
  const h = Math.floor(d / 3600000);
  const days = Math.floor(d / 86400000);
  if (m < 1)   return "now";
  if (m < 60)  return `${m}m`;
  if (h < 24)  return `${h}h`;
  if (days < 7) return `${days}d`;
  return new Date(iso).toLocaleDateString("en-CA", { month: "short", day: "numeric" });
}

function fullTime(iso: string) {
  return new Date(iso).toLocaleTimeString("en-CA", { hour: "2-digit", minute: "2-digit" });
}

function groupByDate(messages: Message[]) {
  const groups: Record<string, Message[]> = {};
  messages.forEach((m) => {
    const d = new Date(m.timestamp);
    const today     = new Date();
    const yesterday = new Date(Date.now() - 86400000);
    let key = d.toLocaleDateString("en-CA", { month: "long", day: "numeric" });
    if (d.toDateString() === today.toDateString())     key = "Today";
    if (d.toDateString() === yesterday.toDateString()) key = "Yesterday";
    if (!groups[key]) groups[key] = [];
    groups[key].push(m);
  });
  return groups;
}

const CHANNEL_CFG: Record<string, { icon: React.ElementType; color: string; bg: string }> = {
  Email:    { icon: Mail,           color: "text-indigo-600",  bg: "bg-indigo-100"  },
  SMS:      { icon: MessageSquare,  color: "text-violet-600",  bg: "bg-violet-100"  },
  WhatsApp: { icon: Phone,          color: "text-emerald-600", bg: "bg-emerald-100" },
};

function StatusIcon({ status }: { status: Message["status"] }) {
  if (status === "sent")      return <Check size={12} className="text-[#A8A49C]" />;
  if (status === "delivered") return <CheckCheck size={12} className="text-[#A8A49C]" />;
  if (status === "read")      return <CheckCheck size={12} className="text-indigo-500" />;
  if (status === "failed")    return <X size={12} className="text-rose-500" />;
  return null;
}

// ── New Conversation Modal ────────────────────────────────────────────────────

function NewConversationModal({ onClose }: { onClose: () => void }) {
  const [channel, setChannel] = useState<"SMS"|"Email"|"WhatsApp">("SMS");
  const [to, setTo] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl border border-[#E8E6E0] shadow-2xl w-full max-w-lg" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-5 border-b border-[#F0EDE6]">
          <h2 className="text-[15px] font-bold text-[#111]">New Conversation</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-[#F4F5F7] text-[#A8A49C]"><X size={14} /></button>
        </div>
        <div className="p-5 space-y-3">
          {/* Channel selector */}
          <div>
            <label className="block text-[11px] font-semibold text-[#7C7870] uppercase tracking-wide mb-1.5">Channel</label>
            <div className="flex gap-2">
              {(["SMS","Email","WhatsApp"] as const).map((c) => {
                const cfg = CHANNEL_CFG[c];
                const Icon = cfg.icon;
                return (
                  <button key={c} onClick={() => setChannel(c)}
                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border text-[12px] font-semibold transition-colors ${channel === c ? "bg-[#111] text-white border-[#111]" : "border-[#E8E6E0] text-[#7C7870] hover:bg-[#F4F5F7]"}`}>
                    <Icon size={14} />{c}
                  </button>
                );
              })}
            </div>
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-[#7C7870] uppercase tracking-wide mb-1">
              {channel === "Email" ? "Email Address" : "Phone Number"}
            </label>
            <input value={to} onChange={(e) => setTo(e.target.value)}
              placeholder={channel === "Email" ? "contact@email.com" : "+1 (000) 000-0000"}
              className="w-full bg-[#F4F5F7] border border-[#E8E6E0] rounded-xl px-3 py-2.5 text-[13px] text-[#111] outline-none focus:border-indigo-400" />
          </div>
          {channel === "Email" && (
            <div>
              <label className="block text-[11px] font-semibold text-[#7C7870] uppercase tracking-wide mb-1">Subject</label>
              <input value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Email subject"
                className="w-full bg-[#F4F5F7] border border-[#E8E6E0] rounded-xl px-3 py-2.5 text-[13px] text-[#111] outline-none focus:border-indigo-400" />
            </div>
          )}
          <div>
            <label className="block text-[11px] font-semibold text-[#7C7870] uppercase tracking-wide mb-1">Message</label>
            <textarea value={body} onChange={(e) => setBody(e.target.value)} rows={4} placeholder="Type your message..."
              className="w-full bg-[#F4F5F7] border border-[#E8E6E0] rounded-xl px-3 py-2.5 text-[13px] text-[#111] outline-none focus:border-indigo-400 resize-none" />
          </div>
          <div className="flex gap-2">
            <button disabled={!to || !body}
              className="flex-1 flex items-center justify-center gap-2 bg-[#111] hover:bg-[#222] disabled:opacity-40 text-white text-[13px] font-semibold py-2.5 rounded-xl transition-colors">
              <Send size={14} /> Send Message
            </button>
            <button onClick={onClose} className="flex-1 bg-[#F4F5F7] text-[#7C7870] text-[13px] font-semibold py-2.5 rounded-xl hover:bg-[#EDEAE3]">Cancel</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function MessagesPage() {
  const [contacts, setContacts]         = useState<Contact[]>(MOCK_CONTACTS);
  const [messages, setMessages]         = useState<Record<string, Message[]>>(MOCK_MESSAGES);
  const [activeContact, setActiveContact] = useState<Contact | null>(null);
  const [channelFilter, setChannelFilter] = useState<Channel>("All");
  const [search, setSearch]             = useState("");
  const [compose, setCompose]           = useState("");
  const [showNew, setShowNew]           = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeContact, messages]);

  // Supabase Realtime subscription for incoming messages
  useEffect(() => {
    const channel = supabase
      .channel("messages-realtime")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages" },
        (payload) => {
          setMessages((prev) => {
            const newMsg = payload.new as Message;
            const contactId = newMsg.contact_id;
            return {
              ...prev,
              [contactId]: [newMsg, ...(prev[contactId] || [])],
            };
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handleSelectContact = (contact: Contact) => {
    setActiveContact(contact);
    // Mark as read
    setContacts((prev) =>
      prev.map((c) => c.id === contact.id ? { ...c, unread: 0 } : c)
    );
  };

  const handleSend = () => {
    if (!compose.trim() || !activeContact) return;
    const newMsg: Message = {
      id:         Date.now().toString(),
      contact_id: activeContact.id,
      body:       compose.trim(),
      direction:  "outbound",
      channel:    activeContact.channel,
      status:     "sent",
      timestamp:  new Date().toISOString(),
    };
    setMessages((prev) => ({
      ...prev,
      [activeContact.id]: [...(prev[activeContact.id] || []), newMsg],
    }));
    setContacts((prev) =>
      prev.map((c) => c.id === activeContact.id
        ? { ...c, last_message: compose.trim(), last_message_time: new Date().toISOString() }
        : c
      )
    );
    setCompose("");

    // Simulate delivered status after 1s
    setTimeout(() => {
      setMessages((prev) => ({
        ...prev,
        [activeContact.id]: (prev[activeContact.id] || []).map((m) =>
          m.id === newMsg.id ? { ...m, status: "delivered" } : m
        ),
      }));
    }, 1000);
  };

  const filteredContacts = contacts.filter((c) => {
    const s = search.toLowerCase();
    const matchSearch = c.name.toLowerCase().includes(s) || c.last_message.toLowerCase().includes(s);
    const matchChannel = channelFilter === "All" || c.channel === channelFilter;
    return matchSearch && matchChannel;
  });

  const totalUnread = contacts.reduce((s, c) => s + c.unread, 0);
  const activeMessages = activeContact ? (messages[activeContact.id] || []) : [];
  const groupedMessages = groupByDate(activeMessages);

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-6 py-5 bg-white border-b border-[#E8E6E0] flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <h1 className="text-[20px] font-bold text-[#111] tracking-tight">Messages</h1>
          {totalUnread > 0 && (
            <span className="bg-indigo-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">{totalUnread}</span>
          )}
          <p className="text-[13px] text-[#A8A49C]">Dashboard › Messages</p>
        </div>
        <button onClick={() => setShowNew(true)}
          className="flex items-center gap-2 bg-[#111] hover:bg-[#222] text-white text-[13px] font-semibold px-4 py-2 rounded-xl transition-colors shadow-sm">
          <Plus size={15} /> New Message
        </button>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* ── Left: contact list ── */}
        <div className="w-[300px] min-w-[300px] border-r border-[#E8E6E0] flex flex-col bg-white">
          {/* Search + channel filter */}
          <div className="p-3 space-y-2 border-b border-[#F0EDE6]">
            <div className="flex items-center gap-2 bg-[#F4F5F7] rounded-xl px-3 py-2">
              <Search size={13} className="text-[#A8A49C] shrink-0" />
              <input type="text" placeholder="Search messages..." value={search} onChange={(e) => setSearch(e.target.value)}
                className="bg-transparent text-[13px] text-[#111] placeholder-[#C5BFB5] outline-none w-full" />
            </div>
            <div className="flex items-center gap-1 bg-[#F4F5F7] rounded-xl p-1">
              {(["All","SMS","Email","WhatsApp"] as Channel[]).map((c) => (
                <button key={c} onClick={() => setChannelFilter(c)}
                  className={`flex-1 text-[10px] font-semibold py-1.5 rounded-lg transition-colors ${channelFilter === c ? "bg-white text-[#111] shadow-sm" : "text-[#7C7870]"}`}>
                  {c}
                </button>
              ))}
            </div>
          </div>

          {/* Contact list */}
          <div className="flex-1 overflow-y-auto divide-y divide-[#F9F8F6]">
            {filteredContacts.map((contact) => {
              const cfg = CHANNEL_CFG[contact.channel];
              const ChanIcon = cfg.icon;
              const isActive = activeContact?.id === contact.id;
              return (
                <div key={contact.id}
                  onClick={() => handleSelectContact(contact)}
                  className={`flex items-start gap-3 p-4 cursor-pointer transition-colors hover:bg-[#FAFAF8] ${isActive ? "bg-indigo-50 border-l-2 border-indigo-500" : ""}`}
                >
                  <div className="relative shrink-0">
                    <div className={`w-10 h-10 rounded-full ${contact.avatar_color} flex items-center justify-center text-white text-[12px] font-bold`}>
                      {contact.initials}
                    </div>
                    {contact.online && (
                      <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-400 border-2 border-white" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-0.5">
                      <p className={`text-[13px] truncate ${contact.unread > 0 ? "font-bold text-[#111]" : "font-medium text-[#444]"}`}>
                        {contact.name}
                      </p>
                      <div className="flex items-center gap-1.5 shrink-0 ml-1">
                        {contact.unread > 0 && (
                          <span className="w-4 h-4 bg-indigo-600 text-white text-[9px] font-bold rounded-full flex items-center justify-center">{contact.unread}</span>
                        )}
                        <span className="text-[10px] text-[#A8A49C]">{timeLabel(contact.last_message_time)}</span>
                      </div>
                    </div>
                    <p className={`text-[11px] truncate ${contact.unread > 0 ? "text-[#555] font-medium" : "text-[#A8A49C]"}`}>
                      {contact.last_message}
                    </p>
                    <div className="flex items-center gap-1.5 mt-1">
                      <span className={`flex items-center gap-1 text-[10px] font-semibold px-1.5 py-0.5 rounded-md ${cfg.bg} ${cfg.color}`}>
                        <ChanIcon size={9} />{contact.channel}
                      </span>
                      <span className="text-[10px] text-[#C5BFB5]">{contact.type}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Right: chat window ── */}
        <div className="flex-1 flex flex-col bg-[#F9F8F6] overflow-hidden">
          {activeContact ? (
            <>
              {/* Chat header */}
              <div className="flex items-center justify-between px-5 py-3.5 bg-white border-b border-[#E8E6E0] shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className={`w-9 h-9 rounded-full ${activeContact.avatar_color} flex items-center justify-center text-white text-[11px] font-bold`}>
                      {activeContact.initials}
                    </div>
                    {activeContact.online && (
                      <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-white" />
                    )}
                  </div>
                  <div>
                    <p className="text-[14px] font-bold text-[#111]">{activeContact.name}</p>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] text-[#A8A49C]">{activeContact.type}</span>
                      {activeContact.online
                        ? <span className="text-[10px] text-emerald-600 font-semibold">● Online</span>
                        : <span className="text-[10px] text-[#A8A49C]">● Offline</span>}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  {activeContact.phone && (
                    <a href={`tel:${activeContact.phone}`}
                      className="p-2 rounded-xl text-[#7C7870] hover:bg-[#F4F5F7] transition-colors" title="Call">
                      <Phone size={16} />
                    </a>
                  )}
                  {activeContact.email && (
                    <a href={`mailto:${activeContact.email}`}
                      className="p-2 rounded-xl text-[#7C7870] hover:bg-[#F4F5F7] transition-colors" title="Email">
                      <Mail size={16} />
                    </a>
                  )}
                  <button className="p-2 rounded-xl text-[#7C7870] hover:bg-[#F4F5F7] transition-colors">
                    <MoreHorizontal size={16} />
                  </button>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto px-5 py-4 space-y-6">
                {Object.entries(groupedMessages).map(([date, msgs]) => (
                  <div key={date}>
                    {/* Date label */}
                    <div className="flex items-center gap-3 mb-4">
                      <div className="flex-1 h-px bg-[#E8E6E0]" />
                      <span className="text-[11px] font-semibold text-[#A8A49C] bg-[#F0EDE6] px-3 py-1 rounded-full">{date}</span>
                      <div className="flex-1 h-px bg-[#E8E6E0]" />
                    </div>

                    <div className="space-y-2">
                      {msgs.map((msg) => {
                        const isOut = msg.direction === "outbound";
                        return (
                          <div key={msg.id} className={`flex ${isOut ? "justify-end" : "justify-start"}`}>
                            {!isOut && (
                              <div className={`w-7 h-7 rounded-full ${activeContact.avatar_color} flex items-center justify-center text-white text-[9px] font-bold mr-2 mt-1 shrink-0`}>
                                {activeContact.initials}
                              </div>
                            )}
                            <div className={`max-w-[70%] ${isOut ? "items-end" : "items-start"} flex flex-col`}>
                              {msg.subject && (
                                <p className="text-[10px] font-semibold text-[#A8A49C] mb-0.5 px-1">
                                  📧 {msg.subject}
                                </p>
                              )}
                              <div className={`px-4 py-2.5 rounded-2xl text-[13px] leading-relaxed ${
                                isOut
                                  ? "bg-[#111] text-white rounded-br-sm"
                                  : "bg-white text-[#111] rounded-bl-sm border border-[#E8E6E0] shadow-sm"
                              }`}>
                                {msg.body}
                              </div>
                              <div className={`flex items-center gap-1 mt-0.5 px-1 ${isOut ? "flex-row-reverse" : ""}`}>
                                <span className="text-[10px] text-[#A8A49C]">{fullTime(msg.timestamp)}</span>
                                {isOut && <StatusIcon status={msg.status} />}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
                {activeMessages.length === 0 && (
                  <div className="flex flex-col items-center justify-center h-full text-[#A8A49C]">
                    <MessageSquare size={32} className="mb-2 opacity-30" />
                    <p className="text-[13px]">No messages yet. Start the conversation!</p>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Compose bar */}
              <div className="px-5 py-4 bg-white border-t border-[#E8E6E0]">
                {/* Channel indicator */}
                <div className="flex items-center gap-2 mb-2">
                  <span className={`flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-md ${CHANNEL_CFG[activeContact.channel].bg} ${CHANNEL_CFG[activeContact.channel].color}`}>
                    {(() => { const Icon = CHANNEL_CFG[activeContact.channel].icon; return <Icon size={9} />; })()}
                    Replying via {activeContact.channel}
                  </span>
                  {activeContact.phone && <span className="text-[10px] text-[#A8A49C]">{activeContact.phone}</span>}
                </div>

                <div className="flex items-end gap-3">
                  <div className="flex-1 bg-[#F4F5F7] rounded-2xl px-4 py-3 border border-[#E8E6E0] focus-within:border-indigo-300 transition-colors">
                    <textarea
                      value={compose}
                      onChange={(e) => setCompose(e.target.value)}
                      onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                      rows={1}
                      placeholder={`Message ${activeContact.name}...`}
                      className="w-full bg-transparent text-[13px] text-[#111] outline-none resize-none placeholder-[#C5BFB5] max-h-24"
                      style={{ minHeight: "24px" }}
                    />
                    <div className="flex items-center gap-1 mt-2">
                      <button className="p-1 rounded-lg text-[#C5BFB5] hover:text-[#7C7870] hover:bg-[#EDEAE3]"><Paperclip size={14} /></button>
                      <button className="p-1 rounded-lg text-[#C5BFB5] hover:text-[#7C7870] hover:bg-[#EDEAE3]"><Image size={14} /></button>
                      <button className="p-1 rounded-lg text-[#C5BFB5] hover:text-[#7C7870] hover:bg-[#EDEAE3]"><Smile size={14} /></button>
                    </div>
                  </div>
                  <button
                    onClick={handleSend}
                    disabled={!compose.trim()}
                    className="w-11 h-11 rounded-2xl bg-[#111] hover:bg-[#222] disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center text-white transition-colors shadow-sm"
                  >
                    <Send size={16} />
                  </button>
                </div>
                <p className="text-[10px] text-[#C5BFB5] mt-1.5 text-center">Press Enter to send · Shift+Enter for new line</p>
              </div>
            </>
          ) : (
            /* Empty state */
            <div className="flex-1 flex flex-col items-center justify-center text-[#A8A49C]">
              <div className="w-20 h-20 rounded-full bg-[#F0EDE6] flex items-center justify-center mb-4">
                <MessageSquare size={36} className="opacity-40" />
              </div>
              <p className="text-[16px] font-semibold text-[#7C7870]">Select a conversation</p>
              <p className="text-[13px] mt-1">or start a new one</p>
              <button onClick={() => setShowNew(true)}
                className="mt-4 flex items-center gap-2 bg-[#111] hover:bg-[#222] text-white text-[13px] font-semibold px-5 py-2.5 rounded-xl transition-colors">
                <Plus size={15} /> New Message
              </button>
            </div>
          )}
        </div>
      </div>

      {showNew && <NewConversationModal onClose={() => setShowNew(false)} />}
    </div>
  );
}