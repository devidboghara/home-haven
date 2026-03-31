"use client";

import { useState } from "react";
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

// ── Types ─────────────────────────────────────────────────────────────────────

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
  dealType: DealType;
  leadScore: LeadScore;
  agent: string;
  agentInitials: string;
  agentColor: string;
  image: string;
  columnId: string;
}

interface Column {
  id: string;
  label: string;
  color: string;
  dotColor: string;
}

// ── Data ──────────────────────────────────────────────────────────────────────

const COLUMNS: Column[] = [
  { id: "new-leads", label: "New Leads", color: "bg-indigo-50 border-indigo-200", dotColor: "bg-indigo-500" },
  { id: "no-contact", label: "No Contact Made", color: "bg-slate-50 border-slate-200", dotColor: "bg-slate-400" },
  { id: "contact-made", label: "Contact Made", color: "bg-blue-50 border-blue-200", dotColor: "bg-blue-500" },
  { id: "appointment", label: "Appointment Set", color: "bg-amber-50 border-amber-200", dotColor: "bg-amber-500" },
  { id: "follow-up", label: "Follow Up", color: "bg-orange-50 border-orange-200", dotColor: "bg-orange-500" },
  { id: "due-diligence", label: "Due Diligence", color: "bg-emerald-50 border-emerald-200", dotColor: "bg-emerald-500" },
];

const INITIAL_DEALS: Deal[] = [
  // New Leads
  {
    id: "d1", address: "42 Maple Street", city: "Toronto, ON",
    beds: 3, baths: 2, sqft: 1850, price: "CA$480,000",
    dealType: "Fix & Flip", leadScore: "Hot",
    agent: "Sarah Kim", agentInitials: "SK", agentColor: "bg-indigo-500",
    image: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=400&q=80",
    columnId: "new-leads",
  },
  {
    id: "d2", address: "18 Lakeview Drive", city: "Vancouver, BC",
    beds: 4, baths: 3, sqft: 2400, price: "CA$920,000",
    dealType: "Rental", leadScore: "Warm",
    agent: "Mike Roberts", agentInitials: "MR", agentColor: "bg-violet-500",
    image: "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=400&q=80",
    columnId: "new-leads",
  },
  // No Contact
  {
    id: "d3", address: "7 Pine Avenue", city: "Calgary, AB",
    beds: 2, baths: 1, sqft: 1100, price: "CA$310,000",
    dealType: "Wholesale", leadScore: "Cold",
    agent: "Priya Sharma", agentInitials: "PS", agentColor: "bg-emerald-500",
    image: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=400&q=80",
    columnId: "no-contact",
  },
  {
    id: "d4", address: "93 Harbor Blvd", city: "Montreal, QC",
    beds: 5, baths: 4, sqft: 3200, price: "CA$1,250,000",
    dealType: "Fix & Flip", leadScore: "Warm",
    agent: "James Liu", agentInitials: "JL", agentColor: "bg-amber-500",
    image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400&q=80",
    columnId: "no-contact",
  },
  // Contact Made
  {
    id: "d5", address: "5 Birchwood Court", city: "Ottawa, ON",
    beds: 3, baths: 2, sqft: 1650, price: "CA$395,000",
    dealType: "Rental", leadScore: "Hot",
    agent: "Nina Torres", agentInitials: "NT", agentColor: "bg-rose-500",
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400&q=80",
    columnId: "contact-made",
  },
  {
    id: "d6", address: "29 Elmwood Lane", city: "Edmonton, AB",
    beds: 4, baths: 2, sqft: 2100, price: "CA$540,000",
    dealType: "Wholesale", leadScore: "Warm",
    agent: "Sarah Kim", agentInitials: "SK", agentColor: "bg-indigo-500",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80",
    columnId: "contact-made",
  },
  // Appointment Set
  {
    id: "d7", address: "11 Rosewood Blvd", city: "Winnipeg, MB",
    beds: 3, baths: 2, sqft: 1750, price: "CA$425,000",
    dealType: "Fix & Flip", leadScore: "Hot",
    agent: "Mike Roberts", agentInitials: "MR", agentColor: "bg-violet-500",
    image: "https://images.unsplash.com/photo-1523217582562-09d0def993a6?w=400&q=80",
    columnId: "appointment",
  },
  // Follow Up
  {
    id: "d8", address: "66 Willow Creek Rd", city: "Halifax, NS",
    beds: 2, baths: 1, sqft: 980, price: "CA$275,000",
    dealType: "Rental", leadScore: "Cold",
    agent: "James Liu", agentInitials: "JL", agentColor: "bg-amber-500",
    image: "https://images.unsplash.com/photo-1576941089067-2de3c901e126?w=400&q=80",
    columnId: "follow-up",
  },
  {
    id: "d9", address: "34 Cedar Hills Dr", city: "Regina, SK",
    beds: 4, baths: 3, sqft: 2600, price: "CA$610,000",
    dealType: "Wholesale", leadScore: "Warm",
    agent: "Priya Sharma", agentInitials: "PS", agentColor: "bg-emerald-500",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&q=80",
    columnId: "follow-up",
  },
  // Due Diligence
  {
    id: "d10", address: "8 Oakridge Terrace", city: "Victoria, BC",
    beds: 5, baths: 4, sqft: 3800, price: "CA$1,750,000",
    dealType: "Fix & Flip", leadScore: "Hot",
    agent: "Nina Torres", agentInitials: "NT", agentColor: "bg-rose-500",
    image: "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=400&q=80",
    columnId: "due-diligence",
  },
];

// ── Helper ────────────────────────────────────────────────────────────────────

const dealTypeBadge: Record<DealType, string> = {
  "Wholesale": "bg-violet-100 text-violet-700",
  "Fix & Flip": "bg-amber-100 text-amber-700",
  "Rental": "bg-emerald-100 text-emerald-700",
};

const leadScoreBadge: Record<LeadScore, string> = {
  Hot: "bg-rose-100 text-rose-600",
  Warm: "bg-amber-100 text-amber-600",
  Cold: "bg-slate-100 text-slate-500",
};

// ── Deal Card ─────────────────────────────────────────────────────────────────

function DealCard({ deal, isDragging = false }: { deal: Deal; isDragging?: boolean }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: isSortableDragging,
  } = useSortable({ id: deal.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isSortableDragging ? 0.4 : 1,
  };

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
      {/* Property image */}
      <div className="relative h-32 rounded-t-xl overflow-hidden bg-[#F3F4F6]">
        <img
          src={deal.image}
          alt={deal.address}
          className="w-full h-full object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&q=80";
          }}
        />
        {/* Badges */}
        <div className="absolute top-2 left-2 flex gap-1.5">
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${dealTypeBadge[deal.dealType]}`}>
            {deal.dealType}
          </span>
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${leadScoreBadge[deal.leadScore]}`}>
            {deal.leadScore}
          </span>
        </div>
        {/* Price */}
        <div className="absolute bottom-2 right-2 bg-[#1a1d23]/80 backdrop-blur-sm text-white text-[11px] font-bold px-2 py-0.5 rounded-lg">
          {deal.price}
        </div>
      </div>

      {/* Card body */}
      <div className="p-3">
        {/* Address */}
        <div className="flex items-start gap-1.5 mb-2">
          <MapPin size={12} className="text-indigo-400 mt-0.5 shrink-0" />
          <div>
            <p className="text-[13px] font-semibold text-[#111] leading-tight">
              {deal.address}
            </p>
            <p className="text-[11px] text-[#9CA3AF]">{deal.city}</p>
          </div>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-3 mb-3 text-[11px] text-[#6B7280]">
          <span className="flex items-center gap-1">
            <Bed size={11} className="text-[#9CA3AF]" />
            {deal.beds} Beds
          </span>
          <span className="flex items-center gap-1">
            <Bath size={11} className="text-[#9CA3AF]" />
            {deal.baths} Baths
          </span>
          <span className="flex items-center gap-1">
            <Maximize2 size={11} className="text-[#9CA3AF]" />
            {deal.sqft.toLocaleString()} ft²
          </span>
        </div>

        {/* Footer: agent + actions */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <div
              className={`w-6 h-6 rounded-full ${deal.agentColor} flex items-center justify-center text-white text-[9px] font-bold`}
            >
              {deal.agentInitials}
            </div>
            <span className="text-[11px] text-[#6B7280] font-medium truncate max-w-[80px]">
              {deal.agent}
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
                className={`w-6 h-6 rounded-md flex items-center justify-center text-[#9CA3AF] transition-colors ${color}`}
              >
                <Icon size={12} />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Column ────────────────────────────────────────────────────────────────────

function KanbanColumn({
  column,
  deals,
}: {
  column: Column;
  deals: Deal[];
}) {
  const totalValue = deals.reduce((sum, d) => {
    const num = parseFloat(d.price.replace(/[^0-9.]/g, ""));
    return sum + (isNaN(num) ? 0 : num);
  }, 0);

  return (
    <div className="flex flex-col w-[260px] min-w-[260px]">
      {/* Column header */}
      <div className={`flex items-center justify-between px-3 py-2.5 rounded-xl border mb-3 ${column.color}`}>
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${column.dotColor}`} />
          <span className="text-[12px] font-bold text-[#374151]">
            {column.label}
          </span>
          <span className="bg-white text-[#6B7280] text-[10px] font-bold px-1.5 py-0.5 rounded-md border border-[#E5E7EB]">
            {deals.length}
          </span>
        </div>
        <button className="w-5 h-5 rounded flex items-center justify-center text-[#9CA3AF] hover:text-[#374151] hover:bg-white/60 transition-colors">
          <MoreHorizontal size={13} />
        </button>
      </div>

      {/* Total value */}
      {deals.length > 0 && (
        <div className="flex items-center gap-1 px-1 mb-2">
          <DollarSign size={10} className="text-[#9CA3AF]" />
          <span className="text-[10px] text-[#9CA3AF] font-medium">
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
        <div className="flex flex-col gap-3 flex-1 min-h-[120px]">
          {deals.map((deal) => (
            <DealCard key={deal.id} deal={deal} />
          ))}
        </div>
      </SortableContext>

      {/* Add deal */}
      <button className="mt-3 flex items-center justify-center gap-1.5 w-full py-2 rounded-lg border border-dashed border-[#D1D5DB] text-[12px] text-[#9CA3AF] hover:border-indigo-400 hover:text-indigo-600 hover:bg-indigo-50/50 transition-all">
        <Plus size={13} />
        Add Deal
      </button>
    </div>
  );
}

// ── Page ───────────────────────────────────────────────────────────────────────

export default function PipelinePage() {
  const [deals, setDeals] = useState<Deal[]>(INITIAL_DEALS);
  const [activeDeal, setActiveDeal] = useState<Deal | null>(null);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState<DealType | "All">("All");

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
  );

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

    // Check if over a column
    const overColumn = COLUMNS.find((c) => c.id === overId);
    if (overColumn && activeDealItem.columnId !== overColumn.id) {
      setDeals((prev) =>
        prev.map((d) =>
          d.id === activeId ? { ...d, columnId: overColumn.id } : d
        )
      );
      return;
    }

    // Check if over another deal
    const overDeal = deals.find((d) => d.id === overId);
    if (overDeal && activeDealItem.columnId !== overDeal.columnId) {
      setDeals((prev) =>
        prev.map((d) =>
          d.id === activeId ? { ...d, columnId: overDeal.columnId } : d
        )
      );
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
      if (activeIndex !== -1 && overIndex !== -1) {
        return arrayMove(prev, activeIndex, overIndex);
      }
      return prev;
    });
  };

  // Filter
  const filteredDeals = deals.filter((d) => {
    const matchSearch =
      d.address.toLowerCase().includes(search.toLowerCase()) ||
      d.city.toLowerCase().includes(search.toLowerCase()) ||
      d.agent.toLowerCase().includes(search.toLowerCase());
    const matchType = filterType === "All" || d.dealType === filterType;
    return matchSearch && matchType;
  });

  const dealsForColumn = (colId: string) =>
    filteredDeals.filter((d) => d.columnId === colId);

  return (
    <div className="flex flex-col h-full">
      {/* Page header */}
      <div className="px-6 py-5 border-b border-[#EAECF0] bg-white flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-[20px] font-bold text-[#111] tracking-tight">
            Pipeline
          </h1>
          <p className="text-[13px] text-[#9CA3AF] mt-0.5">
            Dashboard &rsaquo; Pipeline
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Search */}
          <div className="flex items-center gap-2 bg-[#F4F5F7] rounded-lg px-3 py-2 w-[220px]">
            <Search size={14} className="text-[#9CA3AF] shrink-0" />
            <input
              type="text"
              placeholder="Search deals..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-transparent text-[13px] text-[#333] placeholder-[#AAA] outline-none w-full"
            />
          </div>

          {/* Filter by type */}
          <div className="flex items-center gap-1.5 bg-[#F4F5F7] rounded-lg p-1">
            {(["All", "Wholesale", "Fix & Flip", "Rental"] as const).map(
              (type) => (
                <button
                  key={type}
                  onClick={() => setFilterType(type)}
                  className={`text-[11px] font-semibold px-3 py-1.5 rounded-md transition-colors ${
                    filterType === type
                      ? "bg-white text-indigo-600 shadow-sm"
                      : "text-[#6B7280] hover:text-[#374151]"
                  }`}
                >
                  {type}
                </button>
              )
            )}
          </div>

          {/* Add deal */}
          <button className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-[13px] font-semibold px-4 py-2 rounded-lg transition-colors shadow-sm">
            <Plus size={15} />
            Add Deal
          </button>

          <button className="p-2 rounded-lg border border-[#EAECF0] text-[#6B7280] hover:bg-[#F9FAFB] transition-colors">
            <Filter size={16} />
          </button>
        </div>
      </div>

      {/* Stats bar */}
      <div className="px-6 py-3 bg-white border-b border-[#EAECF0] flex items-center gap-6">
        {COLUMNS.map((col) => {
          const count = dealsForColumn(col.id).length;
          return (
            <div key={col.id} className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${col.dotColor}`} />
              <span className="text-[12px] text-[#6B7280]">{col.label}</span>
              <span className="text-[12px] font-bold text-[#111]">{count}</span>
            </div>
          );
        })}
        <div className="ml-auto text-[12px] text-[#6B7280]">
          Total deals:{" "}
          <span className="font-bold text-[#111]">{filteredDeals.length}</span>
        </div>
      </div>

      {/* Kanban board */}
      <div className="flex-1 overflow-x-auto overflow-y-auto p-6">
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

          {/* Drag overlay */}
          <DragOverlay>
            {activeDeal ? (
              <DealCard deal={activeDeal} isDragging />
            ) : null}
          </DragOverlay>
        </DndContext>
      </div>
    </div>
  );
}