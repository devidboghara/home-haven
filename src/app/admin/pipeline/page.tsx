"use client";

import { useState, useEffect } from "react";
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
  Phone, Mail, MessageSquare, Plus, MoreHorizontal,
  Bed, Bath, Maximize2, MapPin, DollarSign, Filter,
  Search, RefreshCw,
} from "lucide-react";
import { supabase } from "@/lib/supabase";

// ── Types ─────────────────────────────────────────────────────────────────────

type DealType = "Wholesale" | "Fix & Flip" | "Rental";
type LeadScore = "Hot" | "Warm" | "Cold";
type PipelineStage =
  | "New Leads"
  | "No Contact Made"
  | "Contact Made"
  | "Appointment Set"
  | "Follow Up"
  | "Due Diligence";

interface DealCard {
  id: string;
  pipeline_stage: PipelineStage;
  deal_type: DealType | null;
  asking_price: number | null;
  notes: string | null;
  // joined from properties
  property?: {
    address: string;
    city: string | null;
    beds: number | null;
    baths: number | null;
    sqft: number | null;
    images: string[] | null;
  } | null;
  // joined from contacts
  contact?: {
    full_name: string;
    lead_score: LeadScore;
  } | null;
  // joined from profiles
  agent?: {
    full_name: string | null;
  } | null;
}

interface Column {
  id: PipelineStage;
  label: string;
  color: string;
  dotColor: string;
}

// ── Static data ───────────────────────────────────────────────────────────────

const COLUMNS: Column[] = [
  { id: "New Leads",       label: "New Leads",       color: "bg-indigo-50 border-indigo-200",  dotColor: "bg-indigo-500"  },
  { id: "No Contact Made", label: "No Contact Made", color: "bg-slate-50 border-slate-200",    dotColor: "bg-slate-400"   },
  { id: "Contact Made",    label: "Contact Made",    color: "bg-blue-50 border-blue-200",      dotColor: "bg-blue-500"    },
  { id: "Appointment Set", label: "Appointment Set", color: "bg-amber-50 border-amber-200",    dotColor: "bg-amber-500"   },
  { id: "Follow Up",       label: "Follow Up",       color: "bg-orange-50 border-orange-200",  dotColor: "bg-orange-500"  },
  { id: "Due Diligence",   label: "Due Diligence",   color: "bg-emerald-50 border-emerald-200",dotColor: "bg-emerald-500" },
];

const DEAL_TYPE_BADGE: Record<string, string> = {
  "Wholesale":  "bg-violet-100 text-violet-700",
  "Fix & Flip": "bg-amber-100 text-amber-700",
  "Rental":     "bg-emerald-100 text-emerald-700",
};

const LEAD_SCORE_BADGE: Record<string, string> = {
  Hot:  "bg-rose-100 text-rose-600",
  Warm: "bg-amber-100 text-amber-600",
  Cold: "bg-slate-100 text-slate-500",
};

// ── Fallback mock data (shown when DB is empty) ───────────────────────────────

const MOCK_DEALS: DealCard[] = [
  { id: "d1", pipeline_stage: "New Leads",       deal_type: "Fix & Flip", asking_price: 480000, notes: null, property: { address: "42 Maple Street",    city: "Toronto, ON",    beds: 3, baths: 2, sqft: 1850, images: ["https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=400&q=80"] }, contact: { full_name: "Thomas Morrison", lead_score: "Hot"  }, agent: { full_name: "Sarah Kim"    } },
  { id: "d2", pipeline_stage: "New Leads",       deal_type: "Rental",     asking_price: 920000, notes: null, property: { address: "18 Lakeview Drive",  city: "Vancouver, BC",  beds: 4, baths: 3, sqft: 2400, images: ["https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=400&q=80"] }, contact: { full_name: "Aisha Patel",     lead_score: "Warm" }, agent: { full_name: "Mike Roberts" } },
  { id: "d3", pipeline_stage: "No Contact Made", deal_type: "Wholesale",  asking_price: 310000, notes: null, property: { address: "7 Pine Avenue",       city: "Calgary, AB",    beds: 2, baths: 1, sqft: 1100, images: ["https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=400&q=80"] }, contact: { full_name: "Derek Walsh",     lead_score: "Cold" }, agent: { full_name: "Priya Sharma" } },
  { id: "d4", pipeline_stage: "Contact Made",    deal_type: "Fix & Flip", asking_price: 395000, notes: null, property: { address: "5 Birchwood Court",  city: "Ottawa, ON",     beds: 3, baths: 2, sqft: 1650, images: ["https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400&q=80"] }, contact: { full_name: "Marcus Reid",     lead_score: "Warm" }, agent: { full_name: "Nina Torres"  } },
  { id: "d5", pipeline_stage: "Appointment Set", deal_type: "Fix & Flip", asking_price: 425000, notes: null, property: { address: "11 Rosewood Blvd",   city: "Winnipeg, MB",   beds: 3, baths: 2, sqft: 1750, images: ["https://images.unsplash.com/photo-1523217582562-09d0def993a6?w=400&q=80"] }, contact: { full_name: "Mike Roberts",    lead_score: "Hot"  }, agent: { full_name: "Mike Roberts" } },
  { id: "d6", pipeline_stage: "Follow Up",       deal_type: "Rental",     asking_price: 275000, notes: null, property: { address: "66 Willow Creek Rd", city: "Halifax, NS",    beds: 2, baths: 1, sqft: 980,  images: ["https://images.unsplash.com/photo-1576941089067-2de3c901e126?w=400&q=80"] }, contact: { full_name: "James Liu",       lead_score: "Cold" }, agent: { full_name: "James Liu"    } },
  { id: "d7", pipeline_stage: "Due Diligence",   deal_type: "Fix & Flip", asking_price: 1750000,notes: null, property: { address: "8 Oakridge Terrace", city: "Victoria, BC",   beds: 5, baths: 4, sqft: 3800, images: ["https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=400&q=80"] }, contact: { full_name: "Nina Torres",     lead_score: "Hot"  }, agent: { full_name: "Nina Torres"  } },
];

// ── Deal Card Component ───────────────────────────────────────────────────────

function KanbanCard({
  deal,
  isDragging = false,
}: {
  deal: DealCard;
  isDragging?: boolean;
}) {
  const {
    attributes, listeners, setNodeRef,
    transform, transition, isDragging: isSortableDragging,
  } = useSortable({ id: deal.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isSortableDragging ? 0.4 : 1,
  };

  const image = deal.property?.images?.[0];
  const priceStr = deal.asking_price
    ? `CA$${(deal.asking_price / 1000).toFixed(0)}K`
    : "—";

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`
        bg-white rounded-xl border border-[#EAECF0] shadow-sm
        cursor-grab active:cursor-grabbing select-none
        hover:shadow-md hover:border-indigo-200 transition-all duration-150
        ${isDragging ? "shadow-2xl rotate-1 scale-105 border-indigo-400" : ""}
      `}
    >
      {/* Image */}
      <div className="relative h-32 rounded-t-xl overflow-hidden bg-[#F4F5F7]">
        {image ? (
          <img
            src={image}
            alt={deal.property?.address}
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&q=80";
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <MapPin size={24} className="text-[#C5BFB5]" />
          </div>
        )}

        {/* Badges */}
        <div className="absolute top-2 left-2 flex gap-1.5 flex-wrap">
          {deal.deal_type && (
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${DEAL_TYPE_BADGE[deal.deal_type] || "bg-gray-100 text-gray-600"}`}>
              {deal.deal_type}
            </span>
          )}
          {deal.contact?.lead_score && (
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${LEAD_SCORE_BADGE[deal.contact.lead_score] || ""}`}>
              {deal.contact.lead_score}
            </span>
          )}
        </div>

        {/* Price */}
        <div className="absolute bottom-2 right-2 bg-[#1a1d23]/80 backdrop-blur-sm text-white text-[11px] font-bold px-2 py-0.5 rounded-lg">
          {priceStr}
        </div>
      </div>

      {/* Body */}
      <div className="p-3">
        {/* Address */}
        <div className="flex items-start gap-1.5 mb-2">
          <MapPin size={12} className="text-indigo-400 mt-0.5 shrink-0" />
          <div>
            <p className="text-[13px] font-semibold text-[#111] leading-tight">
              {deal.property?.address || "No address"}
            </p>
            <p className="text-[11px] text-[#A8A49C]">
              {deal.property?.city || "—"}
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-3 mb-3 text-[11px] text-[#6B7280]">
          {deal.property?.beds != null && (
            <span className="flex items-center gap-1">
              <Bed size={11} className="text-[#C5BFB5]" />
              {deal.property.beds} Beds
            </span>
          )}
          {deal.property?.baths != null && (
            <span className="flex items-center gap-1">
              <Bath size={11} className="text-[#C5BFB5]" />
              {deal.property.baths} Baths
            </span>
          )}
          {deal.property?.sqft != null && (
            <span className="flex items-center gap-1">
              <Maximize2 size={11} className="text-[#C5BFB5]" />
              {deal.property.sqft.toLocaleString()} ft²
            </span>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-2 border-t border-[#F0EDE6]">
          {/* Contact */}
          <div className="flex items-center gap-1.5">
            <div className="w-5 h-5 rounded-full bg-indigo-500 flex items-center justify-center text-white text-[8px] font-bold shrink-0">
              {(deal.contact?.full_name || "?").charAt(0)}
            </div>
            <span className="text-[11px] text-[#7C7870] truncate max-w-[80px]">
              {deal.contact?.full_name || "No contact"}
            </span>
          </div>

          {/* Quick actions */}
          <div className="flex items-center gap-1">
            {[
              { Icon: Phone, title: "Call", color: "hover:bg-emerald-50 hover:text-emerald-600" },
              { Icon: Mail, title: "Email", color: "hover:bg-indigo-50 hover:text-indigo-600" },
              { Icon: MessageSquare, title: "SMS", color: "hover:bg-violet-50 hover:text-violet-600" },
            ].map(({ Icon, title, color }) => (
              <button
                key={title}
                title={title}
                onPointerDown={(e) => e.stopPropagation()}
                onClick={(e) => e.stopPropagation()}
                className={`w-6 h-6 rounded-md flex items-center justify-center text-[#A8A49C] transition-colors ${color}`}
              >
                <Icon size={11} />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Kanban Column ─────────────────────────────────────────────────────────────

function KanbanColumn({
  column,
  deals,
}: {
  column: Column;
  deals: DealCard[];
}) {
  const totalValue = deals.reduce((sum, d) => sum + (d.asking_price || 0), 0);

  return (
    <div className="flex flex-col w-[260px] min-w-[260px]">
      {/* Header */}
      <div className={`flex items-center justify-between px-3 py-2.5 rounded-xl border mb-3 ${column.color}`}>
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${column.dotColor}`} />
          <span className="text-[12px] font-bold text-[#374151]">{column.label}</span>
          <span className="bg-white text-[#6B7280] text-[10px] font-bold px-1.5 py-0.5 rounded-md border border-[#E5E7EB]">
            {deals.length}
          </span>
        </div>
        <button className="w-5 h-5 rounded flex items-center justify-center text-[#9CA3AF] hover:text-[#374151] hover:bg-white/60 transition-colors">
          <MoreHorizontal size={13} />
        </button>
      </div>

      {/* Total value */}
      {totalValue > 0 && (
        <div className="flex items-center gap-1 px-1 mb-2">
          <DollarSign size={10} className="text-[#A8A49C]" />
          <span className="text-[10px] text-[#A8A49C] font-medium">
            Total:{" "}
            <span className="text-[#374151] font-bold">
              CA${(totalValue / 1000).toFixed(0)}K
            </span>
          </span>
        </div>
      )}

      {/* Cards */}
      <SortableContext
        items={deals.map((d) => d.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="flex flex-col gap-3 flex-1 min-h-[80px]">
          {deals.map((deal) => (
            <KanbanCard key={deal.id} deal={deal} />
          ))}
          {deals.length === 0 && (
            <div className="flex-1 rounded-xl border-2 border-dashed border-[#E8E6E0] flex items-center justify-center min-h-[80px]">
              <p className="text-[11px] text-[#C5BFB5]">Drop here</p>
            </div>
          )}
        </div>
      </SortableContext>

      {/* Add deal */}
      <button className="mt-3 flex items-center justify-center gap-1.5 w-full py-2 rounded-lg border border-dashed border-[#D1D5DB] text-[12px] text-[#A8A49C] hover:border-indigo-400 hover:text-indigo-600 hover:bg-indigo-50/50 transition-all">
        <Plus size={13} /> Add Deal
      </button>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function PipelinePage() {
  const [deals, setDeals] = useState<DealCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeDeal, setActiveDeal] = useState<DealCard | null>(null);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState<DealType | "All">("All");
  const [usingMock, setUsingMock] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
  );

  useEffect(() => {
    fetchDeals();
  }, []);

  const fetchDeals = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("deals")                          // ✅ correct table name
        .select(`
          id,
          pipeline_stage,
          deal_type,
          asking_price,
          notes,
          properties (
            address,
            city,
            beds,
            baths,
            sqft,
            images
          ),
          contacts (
            full_name,
            lead_score
          ),
          profiles (
            full_name
          )
        `)
        .not("pipeline_stage", "in", '("Closed Won","Closed Lost")')
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Supabase error:", error.message);
        // Use mock data if DB is empty or error
        setDeals(MOCK_DEALS);
        setUsingMock(true);
      } else if (!data || data.length === 0) {
        // DB connected but no deals yet — show mock
        setDeals(MOCK_DEALS);
        setUsingMock(true);
      } else {
        // Map joined data to flat structure
        const mapped: DealCard[] = data.map((d: any) => ({
          id: d.id,
          pipeline_stage: d.pipeline_stage,
          deal_type: d.deal_type,
          asking_price: d.asking_price,
          notes: d.notes,
          property: d.properties || null,
          contact: d.contacts || null,
          agent: d.profiles || null,
        }));
        setDeals(mapped);
        setUsingMock(false);
      }
    } catch (err) {
      console.error("Unexpected error:", err);
      setDeals(MOCK_DEALS);
      setUsingMock(true);
    }
    setLoading(false);
  };

  // ── Drag handlers ─────────────────────────────────────────────────────────

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

    // Over a column header
    const overColumn = COLUMNS.find((c) => c.id === overId);
    if (overColumn && activeDealItem.pipeline_stage !== overColumn.id) {
      setDeals((prev) =>
        prev.map((d) =>
          d.id === activeId ? { ...d, pipeline_stage: overColumn.id } : d
        )
      );
      return;
    }

    // Over another card
    const overDeal = deals.find((d) => d.id === overId);
    if (overDeal && activeDealItem.pipeline_stage !== overDeal.pipeline_stage) {
      setDeals((prev) =>
        prev.map((d) =>
          d.id === activeId ? { ...d, pipeline_stage: overDeal.pipeline_stage } : d
        )
      );
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveDeal(null);
    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    // Reorder within column
    if (activeId !== overId) {
      setDeals((prev) => {
        const activeIndex = prev.findIndex((d) => d.id === activeId);
        const overIndex = prev.findIndex((d) => d.id === overId);
        if (activeIndex !== -1 && overIndex !== -1) {
          return arrayMove(prev, activeIndex, overIndex);
        }
        return prev;
      });
    }

    // Save new stage to Supabase (only if real data)
    if (!usingMock) {
      const movedDeal = deals.find((d) => d.id === activeId);
      if (movedDeal) {
        const { error } = await supabase
          .from("deals")
          .update({ pipeline_stage: movedDeal.pipeline_stage })
          .eq("id", activeId);
        if (error) console.error("Failed to update stage:", error.message);
      }
    }
  };

  // ── Filter ────────────────────────────────────────────────────────────────

  const filteredDeals = deals.filter((d) => {
    const s = search.toLowerCase();
    const matchSearch =
      (d.property?.address || "").toLowerCase().includes(s) ||
      (d.property?.city || "").toLowerCase().includes(s) ||
      (d.contact?.full_name || "").toLowerCase().includes(s);
    const matchType = filterType === "All" || d.deal_type === filterType;
    return matchSearch && matchType;
  });

  const dealsForColumn = (colId: PipelineStage) =>
    filteredDeals.filter((d) => d.pipeline_stage === colId);

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-6 py-5 border-b border-[#E8E6E0] bg-white flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-[20px] font-bold text-[#111] tracking-tight">Pipeline</h1>
          <p className="text-[13px] text-[#A8A49C] mt-0.5">Dashboard › Pipeline</p>
        </div>
        <div className="flex items-center gap-3">
          {/* Search */}
          <div className="flex items-center gap-2 bg-[#F4F5F7] rounded-xl px-3 py-2 w-[200px]">
            <Search size={14} className="text-[#A8A49C] shrink-0" />
            <input
              type="text"
              placeholder="Search deals..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-transparent text-[13px] text-[#333] placeholder-[#C5BFB5] outline-none w-full"
            />
          </div>

          {/* Type filter */}
          <div className="flex items-center gap-1 bg-[#F4F5F7] rounded-xl p-1">
            {(["All", "Wholesale", "Fix & Flip", "Rental"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setFilterType(t)}
                className={`text-[11px] font-semibold px-2.5 py-1.5 rounded-lg transition-colors ${
                  filterType === t
                    ? "bg-white text-indigo-600 shadow-sm"
                    : "text-[#7C7870] hover:text-[#111]"
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          {/* Add deal */}
          <button className="flex items-center gap-2 bg-[#111] hover:bg-[#222] text-white text-[13px] font-semibold px-4 py-2 rounded-xl transition-colors shadow-sm">
            <Plus size={15} /> Add Deal
          </button>

          {/* Refresh */}
          <button
            onClick={fetchDeals}
            className="p-2 rounded-xl border border-[#E8E6E0] text-[#7C7870] hover:bg-[#F4F5F7] transition-colors"
            title="Refresh"
          >
            <RefreshCw size={15} className={loading ? "animate-spin" : ""} />
          </button>

          <button className="p-2 rounded-xl border border-[#E8E6E0] text-[#7C7870] hover:bg-[#F4F5F7] transition-colors">
            <Filter size={15} />
          </button>
        </div>
      </div>

      {/* Mock data notice */}
      {usingMock && !loading && (
        <div className="px-6 py-2 bg-amber-50 border-b border-amber-200 flex items-center gap-2">
          <span className="text-[12px] text-amber-700 font-medium">
            📋 Showing sample data — Add deals from your database to see real pipeline
          </span>
        </div>
      )}

      {/* Stats bar */}
      <div className="px-6 py-3 bg-white border-b border-[#E8E6E0] flex items-center gap-6 overflow-x-auto">
        {COLUMNS.map((col) => {
          const count = dealsForColumn(col.id).length;
          return (
            <div key={col.id} className="flex items-center gap-2 shrink-0">
              <div className={`w-2 h-2 rounded-full ${col.dotColor}`} />
              <span className="text-[12px] text-[#7C7870] whitespace-nowrap">{col.label}</span>
              <span className="text-[12px] font-bold text-[#111]">{count}</span>
            </div>
          );
        })}
        <div className="ml-auto text-[12px] text-[#7C7870] shrink-0">
          Total:{" "}
          <span className="font-bold text-[#111]">{filteredDeals.length}</span>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="flex-1 overflow-x-auto overflow-y-auto p-6">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="flex flex-col items-center gap-3 text-[#A8A49C]">
              <RefreshCw size={24} className="animate-spin" />
              <p className="text-[14px]">Loading pipeline...</p>
            </div>
          </div>
        ) : (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCorners}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDragEnd={handleDragEnd}
          >
            <div className="flex gap-4 min-w-max">
              {COLUMNS.map((column) => (
                <KanbanColumn
                  key={column.id}
                  column={column}
                  deals={dealsForColumn(column.id)}
                />
              ))}
            </div>

            <DragOverlay>
              {activeDeal ? <KanbanCard deal={activeDeal} isDragging /> : null}
            </DragOverlay>
          </DndContext>
        )}
      </div>
    </div>
  );
}