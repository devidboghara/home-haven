"use client";

import { useEffect, useState } from "react";
import {
  Plus, Search, Filter, Eye, Pencil, Trash2,
  Wrench, AlertTriangle, CheckCircle2, Clock,
  X, ChevronDown, MapPin, DollarSign, Calendar,
  User, Building2, Zap, Droplets, Wind, Hammer,
  PaintBucket, Package, Bug, HelpCircle, RefreshCw,
  Camera, Phone, Star,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import type { MaintenanceRequest } from "@/lib/supabase";

// ── Config ────────────────────────────────────────────────────────────────────

const PRIORITY_CFG: Record<string, { color: string; bg: string; dot: string }> = {
  Low:       { color: "text-slate-600",   bg: "bg-slate-100",   dot: "bg-slate-400"   },
  Medium:    { color: "text-amber-700",   bg: "bg-amber-100",   dot: "bg-amber-500"   },
  High:      { color: "text-orange-700",  bg: "bg-orange-100",  dot: "bg-orange-500"  },
  Emergency: { color: "text-rose-700",    bg: "bg-rose-100",    dot: "bg-rose-500"    },
};

const STATUS_CFG: Record<string, { color: string; bg: string; icon: React.ElementType }> = {
  "Open":          { color: "text-indigo-700",  bg: "bg-indigo-100",  icon: Clock         },
  "In Progress":   { color: "text-amber-700",   bg: "bg-amber-100",   icon: RefreshCw     },
  "Pending Parts": { color: "text-violet-700",  bg: "bg-violet-100",  icon: Package       },
  "Completed":     { color: "text-emerald-700", bg: "bg-emerald-100", icon: CheckCircle2  },
  "Cancelled":     { color: "text-slate-500",   bg: "bg-slate-100",   icon: X             },
};

const CATEGORY_ICONS: Record<string, React.ElementType> = {
  Plumbing:    Droplets,
  Electrical:  Zap,
  HVAC:        Wind,
  Roofing:     Building2,
  Appliance:   Package,
  Flooring:    Hammer,
  Painting:    PaintBucket,
  Structural:  Building2,
  Pest:        Bug,
  Other:       Wrench,
};

const CATEGORIES = ["Plumbing","Electrical","HVAC","Roofing","Appliance","Flooring","Painting","Structural","Pest","Other"];
const PRIORITIES  = ["Low","Medium","High","Emergency"];
const STATUSES    = ["Open","In Progress","Pending Parts","Completed","Cancelled"];

// ── Mock data ─────────────────────────────────────────────────────────────────

const MOCK_REQUESTS: (MaintenanceRequest & { property_address?: string; contact_name?: string; agent_name?: string })[] = [
  { id:"mr1",  property_id:"p1", contact_id:null, assigned_to:null, title:"Burst pipe in basement bathroom",        description:"Water is leaking from under the sink. Floor is getting damaged.",             category:"Plumbing",   priority:"Emergency", status:"In Progress",   estimated_cost:2800,  actual_cost:null,  images:null, vendor_name:"GTA Plumbing Co.",  scheduled_date:"2026-03-25", completed_date:null,         notes:"Vendor on site today",       created_at:new Date(Date.now()-86400000).toISOString(),    updated_at:"", property_address:"42 Maple Street, Toronto",    contact_name:"Thomas Morrison", agent_name:"Sarah Kim"    },
  { id:"mr2",  property_id:"p2", contact_id:null, assigned_to:null, title:"HVAC not heating properly",               description:"Tenant reports heating is inconsistent. Some rooms are cold.",              category:"HVAC",       priority:"High",      status:"Open",          estimated_cost:1500,  actual_cost:null,  images:null, vendor_name:null,                scheduled_date:null,         completed_date:null,         notes:null,                         created_at:new Date(Date.now()-2*86400000).toISOString(),  updated_at:"", property_address:"18 Lakeview Drive, Vancouver", contact_name:"Aisha Patel",     agent_name:"Mike Roberts" },
  { id:"mr3",  property_id:"p3", contact_id:null, assigned_to:null, title:"Electrical panel tripping breakers",      description:"Circuit breaker trips frequently when multiple appliances are in use.",     category:"Electrical", priority:"High",      status:"Pending Parts", estimated_cost:3200,  actual_cost:null,  images:null, vendor_name:"PowerPro Electric", scheduled_date:"2026-03-28", completed_date:null,         notes:"Waiting for panel parts",    created_at:new Date(Date.now()-3*86400000).toISOString(),  updated_at:"", property_address:"7 Pine Avenue, Calgary",       contact_name:"Derek Walsh",     agent_name:"Priya Sharma" },
  { id:"mr4",  property_id:"p4", contact_id:null, assigned_to:null, title:"Roof shingles damaged after storm",       description:"Several shingles blown off during last week's storm. Minor leak detected.",  category:"Roofing",    priority:"High",      status:"Open",          estimated_cost:8500,  actual_cost:null,  images:null, vendor_name:null,                scheduled_date:null,         completed_date:null,         notes:null,                         created_at:new Date(Date.now()-86400000*4).toISOString(),  updated_at:"", property_address:"93 Harbor Blvd, Montreal",     contact_name:"Linda Cheng",     agent_name:"James Liu"    },
  { id:"mr5",  property_id:"p5", contact_id:null, assigned_to:null, title:"Interior repainting - 3 bedrooms",        description:"Tenant moving out. All 3 bedrooms need fresh coat of paint.",              category:"Painting",   priority:"Medium",    status:"Completed",     estimated_cost:2200,  actual_cost:2050,  images:null, vendor_name:"CityPaint Pros",    scheduled_date:"2026-03-15", completed_date:"2026-03-18", notes:"Job done, looks great",      created_at:new Date(Date.now()-14*86400000).toISOString(), updated_at:"", property_address:"5 Birchwood Court, Ottawa",    contact_name:"Marcus Reid",     agent_name:"Nina Torres"  },
  { id:"mr6",  property_id:"p1", contact_id:null, assigned_to:null, title:"Hardwood floor scratches and dents",      description:"Significant scratches in living room hardwood. Needs refinishing.",          category:"Flooring",   priority:"Medium",    status:"Open",          estimated_cost:3800,  actual_cost:null,  images:null, vendor_name:null,                scheduled_date:null,         completed_date:null,         notes:null,                         created_at:new Date(Date.now()-5*86400000).toISOString(),  updated_at:"", property_address:"42 Maple Street, Toronto",    contact_name:"Thomas Morrison", agent_name:"Sarah Kim"    },
  { id:"mr7",  property_id:"p2", contact_id:null, assigned_to:null, title:"Dishwasher not draining",                 description:"Dishwasher fills with water but doesn't drain. Standing water inside.",    category:"Appliance",  priority:"Medium",    status:"In Progress",   estimated_cost:450,   actual_cost:null,  images:null, vendor_name:"ApplianceFix Inc.", scheduled_date:"2026-03-26", completed_date:null,         notes:"Technician coming Thursday", created_at:new Date(Date.now()-6*86400000).toISOString(),  updated_at:"", property_address:"18 Lakeview Drive, Vancouver", contact_name:"Aisha Patel",     agent_name:"Mike Roberts" },
  { id:"mr8",  property_id:"p3", contact_id:null, assigned_to:null, title:"Pest control - mice in basement",         description:"Tenant reports seeing mice in basement storage area.",                      category:"Pest",       priority:"High",      status:"Completed",     estimated_cost:600,   actual_cost:580,   images:null, vendor_name:"PestAway Services", scheduled_date:"2026-03-20", completed_date:"2026-03-21", notes:"Bait stations placed",       created_at:new Date(Date.now()-10*86400000).toISOString(), updated_at:"", property_address:"7 Pine Avenue, Calgary",       contact_name:"Derek Walsh",     agent_name:"Priya Sharma" },
  { id:"mr9",  property_id:"p5", contact_id:null, assigned_to:null, title:"Water heater leaking",                    description:"Small leak at base of water heater. Age: 12 years. May need replacement.", category:"Plumbing",   priority:"High",      status:"Open",          estimated_cost:1800,  actual_cost:null,  images:null, vendor_name:null,                scheduled_date:null,         completed_date:null,         notes:null,                         created_at:new Date(Date.now()-2*86400000).toISOString(),  updated_at:"", property_address:"5 Birchwood Court, Ottawa",    contact_name:"Marcus Reid",     agent_name:"Nina Torres"  },
  { id:"mr10", property_id:"p4", contact_id:null, assigned_to:null, title:"Structural crack in foundation wall",     description:"Visible crack in basement foundation wall. Approximately 3 feet long.",     category:"Structural", priority:"Emergency", status:"Open",          estimated_cost:12000, actual_cost:null,  images:null, vendor_name:null,                scheduled_date:null,         completed_date:null,         notes:"Structural engineer needed", created_at:new Date(Date.now()-86400000).toISOString(),    updated_at:"", property_address:"93 Harbor Blvd, Montreal",     contact_name:"Linda Cheng",     agent_name:"James Liu"    },
];

type ExtendedRequest = typeof MOCK_REQUESTS[0];

// ── Request Form Modal ────────────────────────────────────────────────────────

function RequestModal({
  request,
  onClose,
  onSave,
}: {
  request?: ExtendedRequest;
  onClose: () => void;
  onSave: (data: Partial<ExtendedRequest>) => void;
}) {
  const [form, setForm] = useState({
    title:           request?.title           || "",
    description:     request?.description     || "",
    category:        request?.category        || "Plumbing",
    priority:        request?.priority        || "Medium",
    status:          request?.status          || "Open",
    estimated_cost:  request?.estimated_cost  || "",
    vendor_name:     request?.vendor_name     || "",
    scheduled_date:  request?.scheduled_date  || "",
    notes:           request?.notes           || "",
    property_address:request?.property_address|| "",
    contact_name:    request?.contact_name    || "",
  });

  const set = (k: string, v: string | number) =>
    setForm((f) => ({ ...f, [k]: v }));

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl border border-[#E8E6E0] shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-5 border-b border-[#F0EDE6]">
          <h2 className="text-[16px] font-bold text-[#111]">
            {request ? "Edit Request" : "New Maintenance Request"}
          </h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-[#F4F5F7] text-[#A8A49C]">
            <X size={15} />
          </button>
        </div>
        <div className="p-5 space-y-3">
          <div>
            <label className="block text-[11px] font-semibold text-[#7C7870] uppercase tracking-wide mb-1">Title *</label>
            <input value={form.title} onChange={(e) => set("title", e.target.value)}
              placeholder="e.g. Burst pipe in basement"
              className="w-full bg-[#F4F5F7] border border-[#E8E6E0] rounded-xl px-3 py-2.5 text-[13px] text-[#111] outline-none focus:border-indigo-400" />
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-[#7C7870] uppercase tracking-wide mb-1">Description</label>
            <textarea value={form.description} onChange={(e) => set("description", e.target.value)}
              rows={3} placeholder="Describe the issue in detail..."
              className="w-full bg-[#F4F5F7] border border-[#E8E6E0] rounded-xl px-3 py-2.5 text-[13px] text-[#111] outline-none focus:border-indigo-400 resize-none" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-[#7C7870] uppercase tracking-wide mb-1">Category</label>
              <select value={form.category} onChange={(e) => set("category", e.target.value)}
                className="w-full bg-[#F4F5F7] border border-[#E8E6E0] rounded-xl px-3 py-2.5 text-[13px] text-[#7C7870] outline-none">
                {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-[#7C7870] uppercase tracking-wide mb-1">Priority</label>
              <select value={form.priority} onChange={(e) => set("priority", e.target.value)}
                className="w-full bg-[#F4F5F7] border border-[#E8E6E0] rounded-xl px-3 py-2.5 text-[13px] text-[#7C7870] outline-none">
                {PRIORITIES.map((p) => <option key={p}>{p}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-[#7C7870] uppercase tracking-wide mb-1">Status</label>
              <select value={form.status} onChange={(e) => set("status", e.target.value)}
                className="w-full bg-[#F4F5F7] border border-[#E8E6E0] rounded-xl px-3 py-2.5 text-[13px] text-[#7C7870] outline-none">
                {STATUSES.map((s) => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-[#7C7870] uppercase tracking-wide mb-1">Est. Cost (CA$)</label>
              <input type="number" value={form.estimated_cost} onChange={(e) => set("estimated_cost", e.target.value)}
                placeholder="0"
                className="w-full bg-[#F4F5F7] border border-[#E8E6E0] rounded-xl px-3 py-2.5 text-[13px] text-[#111] outline-none focus:border-indigo-400" />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-[#7C7870] uppercase tracking-wide mb-1">Vendor / Contractor</label>
              <input value={form.vendor_name} onChange={(e) => set("vendor_name", e.target.value)}
                placeholder="Vendor name"
                className="w-full bg-[#F4F5F7] border border-[#E8E6E0] rounded-xl px-3 py-2.5 text-[13px] text-[#111] outline-none focus:border-indigo-400" />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-[#7C7870] uppercase tracking-wide mb-1">Scheduled Date</label>
              <input type="date" value={form.scheduled_date} onChange={(e) => set("scheduled_date", e.target.value)}
                className="w-full bg-[#F4F5F7] border border-[#E8E6E0] rounded-xl px-3 py-2.5 text-[13px] text-[#111] outline-none focus:border-indigo-400" />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-[#7C7870] uppercase tracking-wide mb-1">Property</label>
              <input value={form.property_address} onChange={(e) => set("property_address", e.target.value)}
                placeholder="Property address"
                className="w-full bg-[#F4F5F7] border border-[#E8E6E0] rounded-xl px-3 py-2.5 text-[13px] text-[#111] outline-none focus:border-indigo-400" />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-[#7C7870] uppercase tracking-wide mb-1">Reported By</label>
              <input value={form.contact_name} onChange={(e) => set("contact_name", e.target.value)}
                placeholder="Tenant / Owner name"
                className="w-full bg-[#F4F5F7] border border-[#E8E6E0] rounded-xl px-3 py-2.5 text-[13px] text-[#111] outline-none focus:border-indigo-400" />
            </div>
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-[#7C7870] uppercase tracking-wide mb-1">Internal Notes</label>
            <textarea value={form.notes} onChange={(e) => set("notes", e.target.value)} rows={2}
              className="w-full bg-[#F4F5F7] border border-[#E8E6E0] rounded-xl px-3 py-2.5 text-[13px] text-[#111] outline-none focus:border-indigo-400 resize-none" />
          </div>
          <div className="flex gap-2 pt-1">
            <button onClick={() => onSave({ ...form, estimated_cost: form.estimated_cost ? Number(form.estimated_cost) : null })}
              disabled={!form.title}
              className="flex-1 bg-[#111] hover:bg-[#222] disabled:opacity-40 text-white text-[13px] font-semibold py-2.5 rounded-xl transition-colors">
              {request ? "Update Request" : "Create Request"}
            </button>
            <button onClick={onClose} className="flex-1 bg-[#F4F5F7] text-[#7C7870] text-[13px] font-semibold py-2.5 rounded-xl hover:bg-[#EDEAE3]">
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function MaintenancePage() {
  const [requests, setRequests]     = useState<ExtendedRequest[]>(MOCK_REQUESTS);
  const [loading, setLoading]       = useState(true);
  const [search, setSearch]         = useState("");
  const [statusFilter, setStatusFilter]     = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [showModal, setShowModal]   = useState(false);
  const [editRequest, setEditRequest] = useState<ExtendedRequest | undefined>(undefined);
  const [selected, setSelected]     = useState<ExtendedRequest | null>(null);
  const [view, setView]             = useState<"list"|"kanban">("list");

  useEffect(() => { fetchRequests(); }, []);

  const fetchRequests = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("maintenance_requests")
      .select("*")
      .order("created_at", { ascending: false });
    if (data && data.length > 0) setRequests(data as ExtendedRequest[]);
    setLoading(false);
  };

  const handleSave = async (form: Partial<ExtendedRequest>) => {
    if (editRequest) {
      await supabase.from("maintenance_requests").update(form).eq("id", editRequest.id);
      setRequests((prev) => prev.map((r) => r.id === editRequest.id ? { ...r, ...form } : r));
    } else {
      const { data } = await supabase.from("maintenance_requests").insert(form).select().single();
      const newR = data || { ...form, id: Date.now().toString(), created_at: new Date().toISOString(), updated_at: "" } as ExtendedRequest;
      setRequests((prev) => [newR, ...prev]);
    }
    setShowModal(false);
    setEditRequest(undefined);
  };

  const handleStatusChange = async (id: string, status: string) => {
    await supabase.from("maintenance_requests").update({ status, ...(status === "Completed" ? { completed_date: new Date().toISOString().slice(0, 10) } : {}) }).eq("id", id);
    setRequests((prev) => prev.map((r) => r.id === id ? { ...r, status: status as MaintenanceRequest["status"] } : r));
    setSelected((prev) => prev?.id === id ? { ...prev, status: status as MaintenanceRequest["status"] } : prev);
  };

  const handleDelete = async (id: string) => {
    await supabase.from("maintenance_requests").delete().eq("id", id);
    setRequests((prev) => prev.filter((r) => r.id !== id));
    if (selected?.id === id) setSelected(null);
  };

  const filtered = requests.filter((r) => {
    const s = search.toLowerCase();
    const matchSearch =
      r.title.toLowerCase().includes(s) ||
      (r.property_address || "").toLowerCase().includes(s) ||
      (r.vendor_name || "").toLowerCase().includes(s) ||
      (r.contact_name || "").toLowerCase().includes(s);
    const matchStatus   = statusFilter   === "All" || r.status   === statusFilter;
    const matchPriority = priorityFilter === "All" || r.priority === priorityFilter;
    const matchCategory = categoryFilter === "All" || r.category === categoryFilter;
    return matchSearch && matchStatus && matchPriority && matchCategory;
  });

  const totalCost    = requests.reduce((s, r) => s + (r.estimated_cost || 0), 0);
  const completedCost= requests.filter((r) => r.status === "Completed").reduce((s, r) => s + (r.actual_cost || r.estimated_cost || 0), 0);
  const emergencies  = requests.filter((r) => r.priority === "Emergency" && r.status !== "Completed").length;
  const openCount    = requests.filter((r) => r.status === "Open").length;

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-6 py-5 bg-white border-b border-[#E8E6E0] flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-[20px] font-bold text-[#111] tracking-tight">Maintenance</h1>
          <p className="text-[13px] text-[#A8A49C] mt-0.5">Dashboard › Maintenance</p>
        </div>
        <div className="flex items-center gap-2">
          {emergencies > 0 && (
            <div className="flex items-center gap-1.5 bg-rose-50 border border-rose-200 text-rose-700 text-[12px] font-semibold px-3 py-2 rounded-xl">
              <AlertTriangle size={13} /> {emergencies} Emergency
            </div>
          )}
          <button onClick={() => { setEditRequest(undefined); setShowModal(true); }}
            className="flex items-center gap-2 bg-[#111] hover:bg-[#222] text-white text-[13px] font-semibold px-4 py-2 rounded-xl transition-colors shadow-sm">
            <Plus size={15} /> New Request
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-5">
        {/* Stats */}
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
          {[
            { label:"Total Requests", value:requests.length,                                      color:"bg-indigo-50 text-indigo-600"  },
            { label:"Open",           value:openCount,                                             color:"bg-amber-50 text-amber-600"   },
            { label:"Emergencies",    value:emergencies,                                           color:"bg-rose-50 text-rose-600"     },
            { label:"Est. Total Cost",value:`CA$${(totalCost/1000).toFixed(0)}K`,                 color:"bg-violet-50 text-violet-600" },
          ].map(({ label, value, color }) => (
            <div key={label} className={`rounded-xl p-4 ${color}`}>
              <p className="text-[11px] font-semibold uppercase tracking-wide opacity-70">{label}</p>
              <p className="text-[26px] font-bold tracking-tight mt-1">{value}</p>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl border border-[#E8E6E0] p-4 flex flex-wrap items-center gap-3 shadow-sm">
          <div className="flex items-center gap-2 bg-[#F4F5F7] rounded-xl px-3 py-2 flex-1 min-w-[180px]">
            <Search size={14} className="text-[#A8A49C] shrink-0" />
            <input type="text" placeholder="Search requests, property, vendor..." value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-transparent text-[13px] text-[#111] placeholder-[#C5BFB5] outline-none w-full" />
          </div>

          <div className="flex items-center gap-1 bg-[#F4F5F7] rounded-xl p-1">
            {["All","Open","In Progress","Pending Parts","Completed","Cancelled"].map((s) => (
              <button key={s} onClick={() => setStatusFilter(s)}
                className={`text-[11px] font-semibold px-2.5 py-1.5 rounded-lg whitespace-nowrap transition-colors ${statusFilter === s ? "bg-white text-[#111] shadow-sm" : "text-[#7C7870] hover:text-[#111]"}`}>
                {s}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1 bg-[#F4F5F7] rounded-xl p-1">
            {["All","Emergency","High","Medium","Low"].map((p) => (
              <button key={p} onClick={() => setPriorityFilter(p)}
                className={`text-[11px] font-semibold px-2.5 py-1.5 rounded-lg transition-colors ${priorityFilter === p ? "bg-white text-[#111] shadow-sm" : "text-[#7C7870] hover:text-[#111]"}`}>
                {p}
              </button>
            ))}
          </div>

          <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-[#F4F5F7] border-0 rounded-xl px-3 py-2 text-[12px] font-medium text-[#7C7870] outline-none">
            <option value="All">All Categories</option>
            {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
          </select>
        </div>

        <p className="text-[13px] text-[#A8A49C]">
          Showing <span className="font-semibold text-[#111]">{filtered.length}</span> requests
        </p>

        {/* Request list */}
        <div className="space-y-3">
          {filtered.map((req) => {
            const statusCfg   = STATUS_CFG[req.status]   || STATUS_CFG.Open;
            const priorityCfg = PRIORITY_CFG[req.priority] || PRIORITY_CFG.Medium;
            const StatusIcon  = statusCfg.icon;
            const CatIcon     = CATEGORY_ICONS[req.category || ""] || Wrench;
            const isEmergency = req.priority === "Emergency";

            return (
              <div key={req.id}
                className={`bg-white rounded-xl border shadow-sm hover:shadow-md transition-all cursor-pointer group ${
                  isEmergency ? "border-rose-200 hover:border-rose-400" : "border-[#E8E6E0] hover:border-indigo-200"
                }`}
                onClick={() => setSelected(req)}
              >
                <div className="p-4">
                  <div className="flex items-start gap-4">
                    {/* Category icon */}
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                      isEmergency ? "bg-rose-100" : "bg-[#F4F5F7]"
                    }`}>
                      <CatIcon size={18} className={isEmergency ? "text-rose-600" : "text-[#7C7870]"} />
                    </div>

                    {/* Main content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 flex-wrap mb-1">
                            <h3 className="text-[14px] font-bold text-[#111]">{req.title}</h3>
                            {isEmergency && (
                              <span className="flex items-center gap-0.5 text-[10px] font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
                                <AlertTriangle size={9} /> Emergency
                              </span>
                            )}
                          </div>
                          {req.description && (
                            <p className="text-[12px] text-[#7C7870] line-clamp-1 mb-2">{req.description}</p>
                          )}
                          <div className="flex items-center gap-3 flex-wrap text-[11px] text-[#A8A49C]">
                            {req.property_address && (
                              <span className="flex items-center gap-1"><MapPin size={10} />{req.property_address}</span>
                            )}
                            {req.contact_name && (
                              <span className="flex items-center gap-1"><User size={10} />{req.contact_name}</span>
                            )}
                            {req.vendor_name && (
                              <span className="flex items-center gap-1"><Wrench size={10} />{req.vendor_name}</span>
                            )}
                            {req.scheduled_date && (
                              <span className="flex items-center gap-1"><Calendar size={10} />
                                {new Date(req.scheduled_date).toLocaleDateString("en-CA", { month:"short", day:"numeric" })}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Right side */}
                        <div className="flex flex-col items-end gap-2 shrink-0">
                          <span className={`flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full ${statusCfg.bg} ${statusCfg.color}`}>
                            <StatusIcon size={10} />{req.status}
                          </span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${priorityCfg.bg} ${priorityCfg.color}`}>
                            {req.priority}
                          </span>
                          {req.estimated_cost && (
                            <span className="text-[12px] font-bold text-[#111]">
                              CA${req.estimated_cost.toLocaleString()}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Actions row */}
                      <div className="flex items-center justify-between mt-3 pt-3 border-t border-[#F9F8F6]">
                        <div className="flex items-center gap-1.5">
                          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-md bg-[#F4F5F7] text-[#7C7870] border border-[#E8E6E0]`}>
                            {req.category}
                          </span>
                          <span className="text-[10px] text-[#C5BFB5]">
                            {new Date(req.created_at).toLocaleDateString("en-CA", { month:"short", day:"numeric", year:"numeric" })}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          {["Open","In Progress"].includes(req.status) && (
                            <button onClick={(e) => { e.stopPropagation(); handleStatusChange(req.id, "Completed"); }}
                              className="flex items-center gap-1 text-[11px] font-semibold text-emerald-600 hover:bg-emerald-50 px-2 py-1 rounded-lg transition-colors">
                              <CheckCircle2 size={12} /> Complete
                            </button>
                          )}
                          <button onClick={(e) => { e.stopPropagation(); setEditRequest(req); setShowModal(true); }}
                            className="w-7 h-7 rounded-lg flex items-center justify-center text-[#A8A49C] hover:bg-amber-50 hover:text-amber-600">
                            <Pencil size={12} />
                          </button>
                          <button onClick={(e) => { e.stopPropagation(); handleDelete(req.id); }}
                            className="w-7 h-7 rounded-lg flex items-center justify-center text-[#A8A49C] hover:bg-rose-50 hover:text-rose-600">
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          {filtered.length === 0 && (
            <div className="text-center py-16 text-[#A8A49C] bg-white rounded-xl border border-[#E8E6E0]">
              <Wrench size={36} className="mx-auto mb-3 opacity-25" />
              <p className="text-[14px] font-medium">No maintenance requests found</p>
            </div>
          )}
        </div>
      </div>

      {/* Detail Modal */}
      {selected && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setSelected(null)}>
          <div className="bg-white rounded-2xl border border-[#E8E6E0] shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-start justify-between p-5 border-b border-[#F0EDE6]">
              <div>
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${(STATUS_CFG[selected.status] || STATUS_CFG.Open).bg} ${(STATUS_CFG[selected.status] || STATUS_CFG.Open).color}`}>
                    {selected.status}
                  </span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${(PRIORITY_CFG[selected.priority] || PRIORITY_CFG.Medium).bg} ${(PRIORITY_CFG[selected.priority] || PRIORITY_CFG.Medium).color}`}>
                    {selected.priority}
                  </span>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-[#F4F5F7] text-[#7C7870] border border-[#E8E6E0]">{selected.category}</span>
                </div>
                <h2 className="text-[16px] font-bold text-[#111]">{selected.title}</h2>
              </div>
              <button onClick={() => setSelected(null)} className="p-1.5 rounded-lg hover:bg-[#F4F5F7] text-[#A8A49C] shrink-0"><X size={15} /></button>
            </div>
            <div className="p-5 space-y-4">
              {selected.description && (
                <div>
                  <p className="text-[10px] font-semibold text-[#A8A49C] uppercase tracking-wide mb-1">Description</p>
                  <p className="text-[13px] text-[#7C7870] bg-[#FAFAF8] p-3 rounded-xl border border-[#F0EDE6] leading-relaxed">{selected.description}</p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                {[
                  { label:"Property",      value:selected.property_address },
                  { label:"Reported By",   value:selected.contact_name     },
                  { label:"Agent",         value:selected.agent_name       },
                  { label:"Vendor",        value:selected.vendor_name      },
                  { label:"Scheduled",     value:selected.scheduled_date ? new Date(selected.scheduled_date).toLocaleDateString("en-CA", { month:"long", day:"numeric", year:"numeric" }) : null },
                  { label:"Completed",     value:selected.completed_date ? new Date(selected.completed_date).toLocaleDateString("en-CA", { month:"long", day:"numeric", year:"numeric" }) : null },
                  { label:"Est. Cost",     value:selected.estimated_cost ? `CA$${selected.estimated_cost.toLocaleString()}` : null },
                  { label:"Actual Cost",   value:selected.actual_cost ? `CA$${selected.actual_cost.toLocaleString()}` : null },
                ].map(({ label, value }) => value ? (
                  <div key={label}>
                    <p className="text-[10px] font-semibold text-[#A8A49C] uppercase tracking-wide mb-0.5">{label}</p>
                    <p className="text-[13px] font-semibold text-[#111]">{value}</p>
                  </div>
                ) : null)}
              </div>

              {selected.notes && (
                <div>
                  <p className="text-[10px] font-semibold text-[#A8A49C] uppercase tracking-wide mb-1">Internal Notes</p>
                  <p className="text-[12px] text-[#7C7870] bg-amber-50 p-3 rounded-xl border border-amber-100">{selected.notes}</p>
                </div>
              )}

              {/* Status update buttons */}
              <div>
                <p className="text-[10px] font-semibold text-[#A8A49C] uppercase tracking-wide mb-2">Update Status</p>
                <div className="flex gap-1.5 flex-wrap">
                  {STATUSES.map((s) => (
                    <button key={s} onClick={() => handleStatusChange(selected.id, s)}
                      className={`text-[11px] font-semibold px-3 py-1.5 rounded-lg border transition-colors ${
                        selected.status === s ? "bg-[#111] text-white border-[#111]" : "border-[#E8E6E0] text-[#7C7870] hover:bg-[#F4F5F7]"
                      }`}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-2 pt-1">
                <button onClick={() => { setEditRequest(selected); setSelected(null); setShowModal(true); }}
                  className="flex-1 bg-[#111] hover:bg-[#222] text-white text-[13px] font-semibold py-2.5 rounded-xl transition-colors">
                  Edit Request
                </button>
                <button onClick={() => handleDelete(selected.id)}
                  className="flex-1 bg-rose-50 hover:bg-rose-100 text-rose-600 text-[13px] font-semibold py-2.5 rounded-xl transition-colors">
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showModal && (
        <RequestModal
          request={editRequest}
          onClose={() => { setShowModal(false); setEditRequest(undefined); }}
          onSave={handleSave}
        />
      )}
    </div>
  );
}