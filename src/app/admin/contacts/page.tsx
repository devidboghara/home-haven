"use client";

import { useState } from "react";
import {
  Search, Plus, Phone, Mail, MessageSquare, Star,
  Filter, Grid3X3, List, MapPin, TrendingUp, Users,
  UserCheck, Flame, Thermometer, Snowflake, MoreHorizontal,
  ChevronDown,
} from "lucide-react";

type LeadScore = "Hot" | "Warm" | "Cold";
type ContactType = "All" | "Buyer" | "Seller" | "Agent" | "Investor";

interface Contact {
  id: string;
  name: string;
  initials: string;
  type: Exclude<ContactType, "All">;
  email: string;
  phone: string;
  city: string;
  leadScore: LeadScore;
  deals: number;
  totalValue: string;
  lastContact: string;
  tags: string[];
  rating: number;
  color: string;
}

const CONTACTS: Contact[] = [
  { id: "c1", name: "Thomas Morrison", initials: "TM", type: "Buyer", email: "t.morrison@email.com", phone: "+1 (416) 555-0182", city: "Toronto, ON", leadScore: "Hot", deals: 3, totalValue: "CA$1.2M", lastContact: "2 hours ago", tags: ["Cash Buyer", "Repeat"], rating: 5, color: "bg-indigo-500" },
  { id: "c2", name: "Aisha Patel", initials: "AP", type: "Investor", email: "aisha.p@invest.com", phone: "+1 (604) 555-0247", city: "Vancouver, BC", leadScore: "Hot", deals: 7, totalValue: "CA$4.8M", lastContact: "Yesterday", tags: ["Investor", "Portfolio"], rating: 5, color: "bg-emerald-500" },
  { id: "c3", name: "Derek Walsh", initials: "DW", type: "Seller", email: "d.walsh@home.ca", phone: "+1 (403) 555-0391", city: "Calgary, AB", leadScore: "Warm", deals: 1, totalValue: "CA$310,000", lastContact: "3 days ago", tags: ["Motivated Seller"], rating: 3, color: "bg-violet-500" },
  { id: "c4", name: "Linda Cheng", initials: "LC", type: "Buyer", email: "lindacheng@mail.com", phone: "+1 (514) 555-0128", city: "Montreal, QC", leadScore: "Cold", deals: 0, totalValue: "—", lastContact: "2 weeks ago", tags: ["First-Time Buyer"], rating: 2, color: "bg-amber-500" },
  { id: "c5", name: "Marcus Reid", initials: "MR", type: "Buyer", email: "m.reid@outlook.ca", phone: "+1 (613) 555-0456", city: "Ottawa, ON", leadScore: "Warm", deals: 1, totalValue: "CA$395,000", lastContact: "5 days ago", tags: ["First-Time Buyer", "Pre-Approved"], rating: 4, color: "bg-rose-500" },
  { id: "c6", name: "Fatima Hassan", initials: "FH", type: "Investor", email: "fhassan@ventures.com", phone: "+1 (204) 555-0673", city: "Winnipeg, MB", leadScore: "Warm", deals: 4, totalValue: "CA$2.1M", lastContact: "1 week ago", tags: ["Investor", "Fix & Flip"], rating: 4, color: "bg-teal-500" },
  { id: "c7", name: "Carlos Mendez", initials: "CM", type: "Investor", email: "c.mendez@realty.ca", phone: "+1 (306) 555-0784", city: "Regina, SK", leadScore: "Hot", deals: 5, totalValue: "CA$3.0M", lastContact: "Today", tags: ["Investor", "Cash Buyer", "VIP"], rating: 5, color: "bg-orange-500" },
  { id: "c8", name: "Sarah Nguyen", initials: "SN", type: "Agent", email: "s.nguyen@realty.com", phone: "+1 (780) 555-0912", city: "Edmonton, AB", leadScore: "Hot", deals: 12, totalValue: "CA$6.2M", lastContact: "Today", tags: ["Agent", "Top Producer"], rating: 5, color: "bg-cyan-500" },
  { id: "c9", name: "John Davidson", initials: "JD", type: "Seller", email: "j.davidson@gmail.com", phone: "+1 (416) 555-0183", city: "Toronto, ON", leadScore: "Warm", deals: 1, totalValue: "CA$480,000", lastContact: "2 days ago", tags: ["Motivated Seller", "Flexible"], rating: 3, color: "bg-lime-600" },
];

const leadScoreConfig: Record<LeadScore, { color: string; bg: string; icon: React.ElementType }> = {
  Hot: { color: "text-rose-600", bg: "bg-rose-100", icon: Flame },
  Warm: { color: "text-amber-600", bg: "bg-amber-100", icon: Thermometer },
  Cold: { color: "text-slate-500", bg: "bg-slate-100", icon: Snowflake },
};

const typeColors: Record<string, string> = {
  Buyer: "bg-indigo-100 text-indigo-700",
  Seller: "bg-amber-100 text-amber-700",
  Agent: "bg-emerald-100 text-emerald-700",
  Investor: "bg-violet-100 text-violet-700",
};

export default function ContactsPage() {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<ContactType>("All");
  const [scoreFilter, setScoreFilter] = useState("All");
  const [view, setView] = useState<"grid" | "list">("list");
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);

  const filtered = CONTACTS.filter((c) => {
    const s = search.toLowerCase();
    const matchSearch = c.name.toLowerCase().includes(s) || c.email.toLowerCase().includes(s) || c.city.toLowerCase().includes(s);
    const matchType = typeFilter === "All" || c.type === typeFilter;
    const matchScore = scoreFilter === "All" || c.leadScore === scoreFilter;
    return matchSearch && matchType && matchScore;
  });

  const stats = [
    { label: "Total Contacts", value: CONTACTS.length, icon: Users, color: "bg-indigo-50 text-indigo-600" },
    { label: "Hot Leads", value: CONTACTS.filter(c => c.leadScore === "Hot").length, icon: Flame, color: "bg-rose-50 text-rose-600" },
    { label: "Active Agents", value: CONTACTS.filter(c => c.type === "Agent").length, icon: UserCheck, color: "bg-emerald-50 text-emerald-600" },
    { label: "Investors", value: CONTACTS.filter(c => c.type === "Investor").length, icon: TrendingUp, color: "bg-violet-50 text-violet-600" },
  ];

  return (
    <div className="flex flex-col h-full">
      <div className="px-6 py-5 bg-white border-b border-[#E8E6E0] flex items-center justify-between">
        <div>
          <h1 className="text-[20px] font-bold text-[#111] tracking-tight">Contacts</h1>
          <p className="text-[13px] text-[#A8A49C] mt-0.5">Dashboard › Contacts</p>
        </div>
        <button className="flex items-center gap-2 bg-[#111] hover:bg-[#222] text-white text-[13px] font-semibold px-4 py-2 rounded-xl transition-colors shadow-sm">
          <Plus size={15} /> Add Contact
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-5">
        {/* Stats */}
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
          {stats.map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="bg-white rounded-xl border border-[#E8E6E0] p-4 flex items-center gap-3 shadow-sm">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}><Icon size={18} /></div>
              <div>
                <p className="text-[11px] text-[#A8A49C] font-medium uppercase tracking-wide">{label}</p>
                <p className="text-[20px] font-bold text-[#111] tracking-tight">{value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl border border-[#E8E6E0] p-4 flex flex-wrap items-center gap-3 shadow-sm">
          <div className="flex items-center gap-2 bg-[#F4F5F7] rounded-xl px-3 py-2 flex-1 min-w-[200px]">
            <Search size={14} className="text-[#A8A49C] shrink-0" />
            <input type="text" placeholder="Search name, email, city..." value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-transparent text-[13px] text-[#111] placeholder-[#C5BFB5] outline-none w-full" />
          </div>
          <div className="flex items-center gap-1 bg-[#F4F5F7] rounded-xl p-1">
            {(["All", "Buyer", "Seller", "Agent", "Investor"] as ContactType[]).map((t) => (
              <button key={t} onClick={() => setTypeFilter(t)}
                className={`text-[11px] font-semibold px-3 py-1.5 rounded-lg transition-colors ${typeFilter === t ? "bg-white text-[#111] shadow-sm" : "text-[#7C7870] hover:text-[#111]"}`}>
                {t}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-1 bg-[#F4F5F7] rounded-xl p-1">
            {["All", "Hot", "Warm", "Cold"].map((s) => (
              <button key={s} onClick={() => setScoreFilter(s)}
                className={`text-[11px] font-semibold px-3 py-1.5 rounded-lg transition-colors ${scoreFilter === s ? "bg-white text-[#111] shadow-sm" : "text-[#7C7870] hover:text-[#111]"}`}>
                {s}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-1 bg-[#F4F5F7] rounded-xl p-1 ml-auto">
            <button onClick={() => setView("list")} className={`p-1.5 rounded-lg ${view === "list" ? "bg-white shadow-sm text-[#111]" : "text-[#A8A49C]"}`}><List size={15} /></button>
            <button onClick={() => setView("grid")} className={`p-1.5 rounded-lg ${view === "grid" ? "bg-white shadow-sm text-[#111]" : "text-[#A8A49C]"}`}><Grid3X3 size={15} /></button>
          </div>
        </div>

        {/* List view */}
        {view === "list" && (
          <div className="bg-white rounded-xl border border-[#E8E6E0] shadow-sm overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#F0EDE6]">
                  {["Contact", "Type", "Lead Score", "Location", "Deals", "Total Value", "Last Contact", ""].map((h) => (
                    <th key={h} className="text-left px-4 py-3 text-[11px] font-bold text-[#A8A49C] uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F9F8F6]">
                {filtered.map((c) => {
                  const { color: scoreColor, bg: scoreBg, icon: ScoreIcon } = leadScoreConfig[c.leadScore];
                  return (
                    <tr key={c.id} className="hover:bg-[#FAFAF8] transition-colors group cursor-pointer" onClick={() => setSelectedContact(c)}>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2.5">
                          <div className={`w-9 h-9 rounded-full ${c.color} flex items-center justify-center text-white text-[11px] font-bold shrink-0`}>{c.initials}</div>
                          <div>
                            <p className="text-[13px] font-semibold text-[#111]">{c.name}</p>
                            <p className="text-[11px] text-[#A8A49C]">{c.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3"><span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${typeColors[c.type]}`}>{c.type}</span></td>
                      <td className="px-4 py-3">
                        <span className={`flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full w-fit ${scoreBg} ${scoreColor}`}>
                          <ScoreIcon size={11} /> {c.leadScore}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1 text-[12px] text-[#7C7870]"><MapPin size={11} className="text-[#C5BFB5]" />{c.city}</div>
                      </td>
                      <td className="px-4 py-3 text-[13px] font-semibold text-[#111]">{c.deals}</td>
                      <td className="px-4 py-3 text-[13px] font-bold text-[#111]">{c.totalValue}</td>
                      <td className="px-4 py-3 text-[12px] text-[#A8A49C]">{c.lastContact}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={(e) => { e.stopPropagation(); }} className="w-7 h-7 rounded-lg flex items-center justify-center text-[#A8A49C] hover:bg-emerald-50 hover:text-emerald-600"><Phone size={12} /></button>
                          <button onClick={(e) => { e.stopPropagation(); }} className="w-7 h-7 rounded-lg flex items-center justify-center text-[#A8A49C] hover:bg-indigo-50 hover:text-indigo-600"><Mail size={12} /></button>
                          <button onClick={(e) => { e.stopPropagation(); }} className="w-7 h-7 rounded-lg flex items-center justify-center text-[#A8A49C] hover:bg-violet-50 hover:text-violet-600"><MessageSquare size={12} /></button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Grid view */}
        {view === "grid" && (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filtered.map((c) => {
              const { color: scoreColor, bg: scoreBg, icon: ScoreIcon } = leadScoreConfig[c.leadScore];
              return (
                <div key={c.id} className="bg-white rounded-xl border border-[#E8E6E0] shadow-sm hover:shadow-md hover:border-indigo-200 transition-all p-4 cursor-pointer" onClick={() => setSelectedContact(c)}>
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2.5">
                      <div className={`w-10 h-10 rounded-full ${c.color} flex items-center justify-center text-white text-[12px] font-bold shrink-0`}>{c.initials}</div>
                      <div>
                        <p className="text-[14px] font-bold text-[#111]">{c.name}</p>
                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${typeColors[c.type]}`}>{c.type}</span>
                      </div>
                    </div>
                    <span className={`flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${scoreBg} ${scoreColor}`}>
                      <ScoreIcon size={10} />{c.leadScore}
                    </span>
                  </div>
                  <div className="space-y-1.5 mb-3">
                    <div className="flex items-center gap-1.5 text-[12px] text-[#7C7870]"><Mail size={11} className="text-[#C5BFB5]" />{c.email}</div>
                    <div className="flex items-center gap-1.5 text-[12px] text-[#7C7870]"><Phone size={11} className="text-[#C5BFB5]" />{c.phone}</div>
                    <div className="flex items-center gap-1.5 text-[12px] text-[#7C7870]"><MapPin size={11} className="text-[#C5BFB5]" />{c.city}</div>
                  </div>
                  <div className="flex items-center gap-2 mb-3 flex-wrap">
                    {c.tags.map((tag) => (<span key={tag} className="text-[10px] bg-[#F4F5F7] text-[#7C7870] px-2 py-0.5 rounded-md font-medium border border-[#E8E6E0]">{tag}</span>))}
                  </div>
                  <div className="flex items-center justify-between pt-3 border-t border-[#F0EDE6]">
                    <div className="text-center">
                      <p className="text-[14px] font-bold text-[#111]">{c.deals}</p>
                      <p className="text-[10px] text-[#A8A49C]">Deals</p>
                    </div>
                    <div className="text-center">
                      <p className="text-[12px] font-bold text-[#111]">{c.totalValue}</p>
                      <p className="text-[10px] text-[#A8A49C]">Value</p>
                    </div>
                    <div className="flex gap-1">
                      <button className="w-7 h-7 rounded-lg flex items-center justify-center text-[#A8A49C] hover:bg-emerald-50 hover:text-emerald-600 border border-[#E8E6E0]"><Phone size={12} /></button>
                      <button className="w-7 h-7 rounded-lg flex items-center justify-center text-[#A8A49C] hover:bg-indigo-50 hover:text-indigo-600 border border-[#E8E6E0]"><Mail size={12} /></button>
                      <button className="w-7 h-7 rounded-lg flex items-center justify-center text-[#A8A49C] hover:bg-violet-50 hover:text-violet-600 border border-[#E8E6E0]"><MessageSquare size={12} /></button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Contact detail modal */}
      {selectedContact && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setSelectedContact(null)}>
          <div className="bg-white rounded-2xl border border-[#E8E6E0] shadow-2xl w-full max-w-md" onClick={(e) => e.stopPropagation()}>
            <div className="p-5 border-b border-[#F0EDE6] flex items-center gap-3">
              <div className={`w-12 h-12 rounded-full ${selectedContact.color} flex items-center justify-center text-white text-[14px] font-bold shrink-0`}>{selectedContact.initials}</div>
              <div className="flex-1">
                <h2 className="text-[16px] font-bold text-[#111]">{selectedContact.name}</h2>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${typeColors[selectedContact.type]}`}>{selectedContact.type}</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${leadScoreConfig[selectedContact.leadScore].bg} ${leadScoreConfig[selectedContact.leadScore].color}`}>{selectedContact.leadScore}</span>
                </div>
              </div>
            </div>
            <div className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "Email", value: selectedContact.email },
                  { label: "Phone", value: selectedContact.phone },
                  { label: "City", value: selectedContact.city },
                  { label: "Last Contact", value: selectedContact.lastContact },
                  { label: "Total Deals", value: String(selectedContact.deals) },
                  { label: "Total Value", value: selectedContact.totalValue },
                ].map(({ label, value }) => (
                  <div key={label}>
                    <p className="text-[10px] font-semibold text-[#A8A49C] uppercase tracking-wide mb-0.5">{label}</p>
                    <p className="text-[13px] font-semibold text-[#111]">{value}</p>
                  </div>
                ))}
              </div>
              <div>
                <p className="text-[10px] font-semibold text-[#A8A49C] uppercase tracking-wide mb-1.5">Tags</p>
                <div className="flex gap-1.5 flex-wrap">
                  {selectedContact.tags.map((t) => (<span key={t} className="text-[11px] bg-[#F4F5F7] text-[#7C7870] px-2.5 py-1 rounded-lg border border-[#E8E6E0] font-medium">{t}</span>))}
                </div>
              </div>
              <div className="flex gap-2 pt-2">
                <button className="flex-1 flex items-center justify-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-[12px] font-semibold py-2.5 rounded-xl"><Phone size={13} />Call</button>
                <button className="flex-1 flex items-center justify-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-[12px] font-semibold py-2.5 rounded-xl"><Mail size={13} />Email</button>
                <button className="flex-1 flex items-center justify-center gap-1.5 bg-[#F4F5F7] text-[#7C7870] text-[12px] font-semibold py-2.5 rounded-xl hover:bg-[#EDEAE3]" onClick={() => setSelectedContact(null)}>Close</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}