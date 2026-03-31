"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase"; // Real connection
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  Phone,
  Mail,
  MessageSquare,
  Plus,
  MoreHorizontal,
  Bed,
  Bath,
  Maximize2,
  MapPin,
  DollarSign,
  Filter,
  Search,
} from "lucide-react";

// ── Types (As per original code) ──────────────────────────────────────────────
type DealType = "Wholesale" | "Fix & Flip" | "Rental";
type LeadScore = "Hot" | "Warm" | "Cold";

interface Deal {
  id: string;
  address: string;
  city: string;
  beds: number;
  baths: number;
  sqft: number;
  price: string;
  deal_type: DealType; // Map to DB snake_case
  lead_score: LeadScore;
  agent: string;
  agent_initials: string;
  agent_color: string;
  image: string;
  column_id: string;
}

interface Column {
  id: string;
  label: string;
  color: string;
  dotColor: string;
}

const COLUMNS: Column[] = [
  { id: "new-leads", label: "New Leads", color: "bg-indigo-50 border-indigo-200", dotColor: "bg-indigo-500" },
  { id: "no-contact", label: "No Contact Made", color: "bg-slate-50 border-slate-200", dotColor: "bg-slate-400" },
  { id: "contact-made", label: "Contact Made", color: "bg-blue-50 border-blue-200", dotColor: "bg-blue-500" },
  { id: "appointment", label: "Appointment Set", color: "bg-amber-50 border-amber-200", dotColor: "bg-amber-500" },
  { id: "follow-up", label: "Follow Up", color: "bg-orange-50 border-orange-200", dotColor: "bg-orange-500" },
  { id: "due-diligence", label: "Due Diligence", color: "bg-emerald-50 border-emerald-200", dotColor: "bg-emerald-500" },
];

// ── Deal Card Component (As it is) ──────────────────────────────────────────────
function DealCard({ deal, isDragging = false }: { deal: Deal; isDragging?: boolean }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging: isSortableDragging } = useSortable({ id: deal.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isSortableDragging ? 0.4 : 1,
  };

  const dealTypeBadge: any = { "Wholesale": "bg-violet-100 text-violet-700", "Fix & Flip": "bg-amber-100 text-amber-700", "Rental": "bg-emerald-100 text-emerald-700" };
  const leadScoreBadge: any = { Hot: "bg-rose-100 text-rose-600", Warm: "bg-amber-100 text-amber-600", Cold: "bg-slate-100 text-slate-500" };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners} className={`bg-white rounded-xl border border-[#EAECF0] shadow-sm cursor-grab active:cursor-grabbing hover:shadow-md transition-all duration-150 ${isDragging ? "shadow-2xl rotate-1 scale-105 border-indigo-400" : ""}`}>
      <div className="relative h-32 rounded-t-xl overflow-hidden bg-[#F3F4F6]">
        <img src={deal.image} alt={deal.address} className="w-full h-full object-cover" />
        <div className="absolute top-2 left-2 flex gap-1.5">
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${dealTypeBadge[deal.deal_type]}`}>{deal.deal_type}</span>
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${leadScoreBadge[deal.lead_score]}`}>{deal.lead_score}</span>
        </div>
        <div className="absolute bottom-2 right-2 bg-[#1a1d23]/80 backdrop-blur-sm text-white text-[11px] font-bold px-2 py-0.5 rounded-lg">{deal.price}</div>
      </div>
      <div className="p-3">
        <div className="flex items-start gap-1.5 mb-2">
          <MapPin size={12} className="text-indigo-400 mt-0.5 shrink-0" />
          <div>
            <p className="text-[13px] font-semibold text-[#111] leading-tight">{deal.address}</p>
            <p className="text-[11px] text-[#9CA3AF]">{deal.city}</p>
          </div>
        </div>
        <div className="flex items-center gap-3 mb-3 text-[11px] text-[#6B7280]">
          <span className="flex items-center gap-1"><Bed size={11} /> {deal.beds} Beds</span>
          <span className="flex items-center gap-1"><Bath size={11} /> {deal.baths} Baths</span>
          <span className="flex items-center gap-1"><Maximize2 size={11} /> {deal.sqft} ft²</span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <div className={`w-6 h-6 rounded-full ${deal.agent_color} flex items-center justify-center text-white text-[9px] font-bold`}>{deal.agent_initials}</div>
            <span className="text-[11px] text-[#6B7280] font-medium truncate max-w-[80px]">{deal.agent}</span>
          </div>
          <div className="flex items-center gap-1">
            <Phone size={12} className="text-[#9CA3AF] hover:text-emerald-600 cursor-pointer" />
            <Mail size={12} className="text-[#9CA3AF] hover:text-indigo-600 cursor-pointer" />
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Main Page Logic ────────────────────────────────────────────────────────────
export default function PipelinePage() {
  const [deals, setDeals] = useState<Deal[]>([]); // Dynamic state
  const [loading, setLoading] = useState(true);
  const [activeDeal, setActiveDeal] = useState<Deal | null>(null);
  const [search, setSearch] = useState("");

  // 1. Fetch Deals from Supabase
  useEffect(() => {
    async function fetchDeals() {
      const { data, error } = await supabase.from("deals_pipeline").select("*");
      if (data) setDeals(data);
      if (error) console.error("Error fetching deals:", error);
      setLoading(false);
    }
    fetchDeals();
  }, []);

  // 2. Drag & Drop Sensors (As it is)
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }));

  // 3. Update Column ID in Database on Drop
  const updateDealStatus = async (dealId: string, newColumnId: string) => {
    const { error } = await supabase
      .from("deals_pipeline")
      .update({ column_id: newColumnId })
      .eq("id", dealId);
    if (error) console.error("DB Update Failed:", error);
  };

  const handleDragStart = (event: DragStartEvent) => {
    const deal = deals.find((d) => d.id === event.active.id);
    setActiveDeal(deal || null);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;
    const activeId = active.id as string;
    const overId = over.id as string;

    const activeDealItem = deals.find((d) => d.id === activeId);
    if (!activeDealItem) return;

    const overColumn = COLUMNS.find((c) => c.id === overId);
    if (overColumn && activeDealItem.column_id !== overColumn.id) {
      setDeals((prev) => prev.map((d) => (d.id === activeId ? { ...d, column_id: overColumn.id } : d)));
      updateDealStatus(activeId, overColumn.id); // Persistent Sync
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveDeal(null);
    if (!over) return;
    const activeId = active.id as string;
    const overId = over.id as string;
    if (activeId === overId) return;

    setDeals((prev) => {
      const activeIndex = prev.findIndex((d) => d.id === activeId);
      const overIndex = prev.findIndex((d) => d.id === overId);
      return arrayMove(prev, activeIndex, overIndex);
    });
  };

  if (loading) return <div className="p-10 font-black text-slate-300 uppercase tracking-widest animate-pulse">Syncing Pipeline...</div>;

  return (
    <div className="flex flex-col h-full">
      {/* Search Header (As it is) */}
      <div className="px-6 py-5 border-b border-[#EAECF0] bg-white flex items-center justify-between">
        <h1 className="text-[20px] font-bold text-[#111]">Deals Pipeline</h1>
        <div className="flex items-center gap-3 bg-[#F4F5F7] rounded-lg px-3 py-2 w-[300px]">
          <Search size={14} className="text-[#9CA3AF]" />
          <input 
            type="text" 
            placeholder="Search deals..." 
            className="bg-transparent text-[13px] outline-none w-full"
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Kanban Board Container */}
      <div className="flex-1 overflow-x-auto p-6 bg-[#f5f6f8]">
        <DndContext sensors={sensors} collisionDetection={closestCorners} onDragStart={handleDragStart} onDragOver={handleDragOver} onDragEnd={handleDragEnd}>
          <div className="flex gap-4 min-w-max">
            {COLUMNS.map((column) => (
              <div key={column.id} className="flex flex-col w-[280px]">
                <div className={`flex items-center justify-between px-3 py-2.5 rounded-xl border mb-3 ${column.color}`}>
                  <div className="flex items-center gap-2 font-bold text-[12px]">
                    <div className={`w-2 h-2 rounded-full ${column.dotColor}`} />
                    {column.label}
                  </div>
                </div>
                
                <SortableContext items={deals.filter(d => d.column_id === column.id).map(d => d.id)} strategy={verticalListSortingStrategy}>
                  <div className="flex flex-col gap-3 min-h-[500px]">
                    {deals
                      .filter(d => d.column_id === column.id && d.address.toLowerCase().includes(search.toLowerCase()))
                      .map(deal => <DealCard key={deal.id} deal={deal} />)
                    }
                  </div>
                </SortableContext>
              </div>
            ))}
          </div>
          <DragOverlay>{activeDeal ? <DealCard deal={activeDeal} isDragging /> : null}</DragOverlay>
        </DndContext>
      </div>
    </div>
  );
}