"use client";

import { useState } from "react";
import {
  Plus, Zap, Mail, MessageSquare, Bell, GitBranch,
  Play, Pause, Trash2, Pencil, ChevronRight,
  Users, Clock, CheckCircle2, ToggleLeft, ToggleRight,
  Webhook, FileText, Phone,
} from "lucide-react";

interface WorkflowStep {
  type: string;
  label: string;
  icon: React.ElementType;
  color: string;
}

interface Workflow {
  id: string;
  name: string;
  trigger: string;
  description: string;
  steps: WorkflowStep[];
  active: boolean;
  runs: number;
  successRate: string;
  lastRun: string;
  category: string;
}

const WORKFLOWS: Workflow[] = [
  {
    id: "w1", name: "New Lead Welcome", trigger: "New Lead Added",
    description: "Automatically welcome new leads with a personalised email and SMS",
    steps: [
      { type: "trigger", label: "New Lead", icon: Users, color: "bg-indigo-100 text-indigo-600" },
      { type: "action", label: "Add CRM Note", icon: FileText, color: "bg-slate-100 text-slate-600" },
      { type: "action", label: "Send Email", icon: Mail, color: "bg-blue-100 text-blue-600" },
      { type: "action", label: "Send SMS", icon: MessageSquare, color: "bg-violet-100 text-violet-600" },
    ],
    active: true, runs: 142, successRate: "98.6%", lastRun: "2 hours ago", category: "Lead Nurture",
  },
  {
    id: "w2", name: "Follow-Up Sequence", trigger: "No Contact in 3 Days",
    description: "Re-engage leads that haven't been contacted in 3 days",
    steps: [
      { type: "trigger", label: "3 Day Inactivity", icon: Clock, color: "bg-amber-100 text-amber-600" },
      { type: "action", label: "Send Email", icon: Mail, color: "bg-blue-100 text-blue-600" },
      { type: "wait", label: "Wait 24h", icon: Clock, color: "bg-slate-100 text-slate-500" },
      { type: "action", label: "Send SMS", icon: MessageSquare, color: "bg-violet-100 text-violet-600" },
      { type: "action", label: "Notify Agent", icon: Bell, color: "bg-rose-100 text-rose-600" },
    ],
    active: true, runs: 87, successRate: "94.2%", lastRun: "Yesterday", category: "Follow-Up",
  },
  {
    id: "w3", name: "Offer Accepted Flow", trigger: "Offer Accepted",
    description: "Trigger contract generation and notify all parties when offer is accepted",
    steps: [
      { type: "trigger", label: "Offer Accepted", icon: CheckCircle2, color: "bg-emerald-100 text-emerald-600" },
      { type: "action", label: "Webhook Fire", icon: Webhook, color: "bg-orange-100 text-orange-600" },
      { type: "action", label: "Generate Contract", icon: FileText, color: "bg-indigo-100 text-indigo-600" },
      { type: "action", label: "Email Buyer", icon: Mail, color: "bg-blue-100 text-blue-600" },
      { type: "action", label: "Email Seller", icon: Mail, color: "bg-blue-100 text-blue-600" },
    ],
    active: true, runs: 34, successRate: "100%", lastRun: "3 days ago", category: "Deal Closing",
  },
  {
    id: "w4", name: "Cold Lead Re-Engage", trigger: "Lead Score drops to Cold",
    description: "Re-engage cold leads with a drip campaign over 2 weeks",
    steps: [
      { type: "trigger", label: "Lead Gone Cold", icon: GitBranch, color: "bg-slate-100 text-slate-600" },
      { type: "action", label: "Send Email D1", icon: Mail, color: "bg-blue-100 text-blue-600" },
      { type: "wait", label: "Wait 7 Days", icon: Clock, color: "bg-slate-100 text-slate-500" },
      { type: "action", label: "Send Email D7", icon: Mail, color: "bg-blue-100 text-blue-600" },
      { type: "wait", label: "Wait 7 Days", icon: Clock, color: "bg-slate-100 text-slate-500" },
      { type: "action", label: "Final SMS", icon: MessageSquare, color: "bg-violet-100 text-violet-600" },
    ],
    active: false, runs: 213, successRate: "71.8%", lastRun: "1 week ago", category: "Lead Nurture",
  },
  {
    id: "w5", name: "Appointment Reminder", trigger: "Appointment Scheduled",
    description: "Send reminders 24h and 1h before scheduled property visits",
    steps: [
      { type: "trigger", label: "Appointment Set", icon: Clock, color: "bg-amber-100 text-amber-600" },
      { type: "wait", label: "Wait until -24h", icon: Clock, color: "bg-slate-100 text-slate-500" },
      { type: "action", label: "Send Reminder Email", icon: Mail, color: "bg-blue-100 text-blue-600" },
      { type: "wait", label: "Wait until -1h", icon: Clock, color: "bg-slate-100 text-slate-500" },
      { type: "action", label: "Send SMS Reminder", icon: MessageSquare, color: "bg-violet-100 text-violet-600" },
    ],
    active: true, runs: 58, successRate: "100%", lastRun: "Today", category: "Appointments",
  },
  {
    id: "w6", name: "Post-Close Review Request", trigger: "Deal Closed",
    description: "Request a review from buyers and sellers after deal closes",
    steps: [
      { type: "trigger", label: "Deal Closed", icon: CheckCircle2, color: "bg-emerald-100 text-emerald-600" },
      { type: "wait", label: "Wait 3 Days", icon: Clock, color: "bg-slate-100 text-slate-500" },
      { type: "action", label: "Send Review Email", icon: Mail, color: "bg-blue-100 text-blue-600" },
      { type: "action", label: "Log Activity", icon: FileText, color: "bg-slate-100 text-slate-600" },
    ],
    active: false, runs: 29, successRate: "89.6%", lastRun: "2 weeks ago", category: "Post-Sale",
  },
];

const categories = ["All", "Lead Nurture", "Follow-Up", "Deal Closing", "Appointments", "Post-Sale"];

export default function WorkflowsPage() {
  const [workflows, setWorkflows] = useState(WORKFLOWS);
  const [catFilter, setCatFilter] = useState("All");
  const [showBuilder, setShowBuilder] = useState(false);

  const toggleWorkflow = (id: string) => {
    setWorkflows(prev => prev.map(w => w.id === id ? { ...w, active: !w.active } : w));
  };

  const filtered = workflows.filter(w => catFilter === "All" || w.category === catFilter);

  const stats = [
    { label: "Total Workflows", value: workflows.length, color: "bg-indigo-50 text-indigo-600" },
    { label: "Active", value: workflows.filter(w => w.active).length, color: "bg-emerald-50 text-emerald-600" },
    { label: "Total Runs", value: workflows.reduce((s, w) => s + w.runs, 0), color: "bg-amber-50 text-amber-600" },
    { label: "Avg Success", value: "92.4%", color: "bg-violet-50 text-violet-600" },
  ];

  return (
    <div className="flex flex-col h-full">
      <div className="px-6 py-5 bg-white border-b border-[#E8E6E0] flex items-center justify-between">
        <div>
          <h1 className="text-[20px] font-bold text-[#111] tracking-tight">Workflows</h1>
          <p className="text-[13px] text-[#A8A49C] mt-0.5">Dashboard › Workflows</p>
        </div>
        <button onClick={() => setShowBuilder(true)}
          className="flex items-center gap-2 bg-[#111] hover:bg-[#222] text-white text-[13px] font-semibold px-4 py-2 rounded-xl transition-colors shadow-sm">
          <Plus size={15} /> New Workflow
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-5">
        {/* Stats */}
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
          {stats.map(({ label, value, color }) => (
            <div key={label} className={`rounded-xl p-4 flex flex-col gap-1 ${color} bg-opacity-60`}>
              <p className="text-[11px] font-semibold uppercase tracking-wide opacity-70">{label}</p>
              <p className="text-[24px] font-bold tracking-tight">{value}</p>
            </div>
          ))}
        </div>

        {/* Category filter */}
        <div className="flex items-center gap-2 flex-wrap">
          {categories.map((c) => (
            <button key={c} onClick={() => setCatFilter(c)}
              className={`text-[12px] font-semibold px-4 py-2 rounded-xl border transition-colors ${catFilter === c ? "bg-[#111] text-white border-[#111]" : "bg-white text-[#7C7870] border-[#E8E6E0] hover:border-[#111] hover:text-[#111]"}`}>
              {c}
            </button>
          ))}
        </div>

        {/* Workflow cards */}
        <div className="space-y-3">
          {filtered.map((w) => (
            <div key={w.id} className={`bg-white rounded-xl border shadow-sm transition-all ${w.active ? "border-[#E8E6E0]" : "border-[#EDEAE3] opacity-70"}`}>
              <div className="p-4">
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${w.active ? "bg-indigo-100" : "bg-[#F4F5F7]"}`}>
                      <Zap size={16} className={w.active ? "text-indigo-600" : "text-[#A8A49C]"} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-[14px] font-bold text-[#111]">{w.name}</h3>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#F4F5F7] text-[#7C7870] border border-[#E8E6E0]">{w.category}</span>
                        {w.active
                          ? <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700">Active</span>
                          : <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-500">Paused</span>}
                      </div>
                      <p className="text-[12px] text-[#7C7870] mt-0.5">{w.description}</p>
                      <p className="text-[11px] text-[#A8A49C] mt-0.5">Trigger: <span className="font-semibold text-[#7C7870]">{w.trigger}</span></p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button onClick={() => toggleWorkflow(w.id)} className="p-1">
                      {w.active
                        ? <ToggleRight size={28} className="text-indigo-600" />
                        : <ToggleLeft size={28} className="text-[#C5BFB5]" />}
                    </button>
                    <button className="w-7 h-7 rounded-lg flex items-center justify-center text-[#A8A49C] hover:bg-amber-50 hover:text-amber-600"><Pencil size={13} /></button>
                    <button className="w-7 h-7 rounded-lg flex items-center justify-center text-[#A8A49C] hover:bg-rose-50 hover:text-rose-600"><Trash2 size={13} /></button>
                  </div>
                </div>

                {/* Steps flow */}
                <div className="flex items-center gap-1.5 flex-wrap mb-3">
                  {w.steps.map((step, i) => (
                    <div key={i} className="flex items-center gap-1.5">
                      <div className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-[#F0EDE6] ${step.color}`}>
                        <step.icon size={11} />
                        <span className="text-[11px] font-semibold whitespace-nowrap">{step.label}</span>
                      </div>
                      {i < w.steps.length - 1 && <ChevronRight size={12} className="text-[#C5BFB5] shrink-0" />}
                    </div>
                  ))}
                </div>

                {/* Stats row */}
                <div className="flex items-center gap-6 pt-3 border-t border-[#F9F8F6]">
                  <div>
                    <span className="text-[11px] text-[#A8A49C]">Total Runs </span>
                    <span className="text-[12px] font-bold text-[#111]">{w.runs}</span>
                  </div>
                  <div>
                    <span className="text-[11px] text-[#A8A49C]">Success Rate </span>
                    <span className="text-[12px] font-bold text-emerald-600">{w.successRate}</span>
                  </div>
                  <div>
                    <span className="text-[11px] text-[#A8A49C]">Last Run </span>
                    <span className="text-[12px] font-semibold text-[#7C7870]">{w.lastRun}</span>
                  </div>
                  <button className={`ml-auto flex items-center gap-1.5 text-[12px] font-semibold px-3 py-1.5 rounded-lg transition-colors ${w.active ? "text-rose-600 hover:bg-rose-50" : "text-emerald-600 hover:bg-emerald-50"}`}>
                    {w.active ? <><Pause size={13} />Pause</> : <><Play size={13} />Run Now</>}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* New workflow modal */}
      {showBuilder && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowBuilder(false)}>
          <div className="bg-white rounded-2xl border border-[#E8E6E0] shadow-2xl w-full max-w-md" onClick={(e) => e.stopPropagation()}>
            <div className="p-5 border-b border-[#F0EDE6]">
              <h2 className="text-[16px] font-bold text-[#111]">New Workflow</h2>
              <p className="text-[12px] text-[#A8A49C] mt-0.5">Set up an automation for your team</p>
            </div>
            <div className="p-5 space-y-3">
              <div>
                <label className="block text-[11px] font-semibold text-[#7C7870] uppercase tracking-wide mb-1">Workflow Name</label>
                <input type="text" placeholder="e.g. New Lead Welcome"
                  className="w-full bg-[#F4F5F7] border border-[#E8E6E0] rounded-xl px-3 py-2.5 text-[13px] text-[#111] placeholder-[#C5BFB5] outline-none focus:border-indigo-400 transition-colors" />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-[#7C7870] uppercase tracking-wide mb-1">Trigger</label>
                <select className="w-full bg-[#F4F5F7] border border-[#E8E6E0] rounded-xl px-3 py-2.5 text-[13px] text-[#7C7870] outline-none">
                  {["New Lead Added", "Offer Accepted", "Deal Closed", "No Contact in 3 Days", "Appointment Scheduled", "Lead Gone Cold"].map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-[#7C7870] uppercase tracking-wide mb-1">Category</label>
                <select className="w-full bg-[#F4F5F7] border border-[#E8E6E0] rounded-xl px-3 py-2.5 text-[13px] text-[#7C7870] outline-none">
                  {["Lead Nurture", "Follow-Up", "Deal Closing", "Appointments", "Post-Sale"].map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-[#7C7870] uppercase tracking-wide mb-1">Description</label>
                <textarea rows={2} placeholder="Describe what this workflow does..."
                  className="w-full bg-[#F4F5F7] border border-[#E8E6E0] rounded-xl px-3 py-2.5 text-[13px] text-[#111] placeholder-[#C5BFB5] outline-none focus:border-indigo-400 transition-colors resize-none" />
              </div>
              <div className="flex gap-2 pt-2">
                <button className="flex-1 bg-[#111] hover:bg-[#222] text-white text-[13px] font-semibold py-2.5 rounded-xl transition-colors">Create Workflow</button>
                <button className="flex-1 bg-[#F4F5F7] text-[#7C7870] text-[13px] font-semibold py-2.5 rounded-xl hover:bg-[#EDEAE3] transition-colors" onClick={() => setShowBuilder(false)}>Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}