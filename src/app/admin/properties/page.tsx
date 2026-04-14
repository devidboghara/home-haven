"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Search, Filter, Plus, Grid3X3, List, MapPin, Bed, Bath,
  Maximize2, Eye, Pencil, Trash2, ChevronDown, ChevronLeft,
  ChevronRight, Building2, TrendingUp, Home, DollarSign,
  Loader, AlertCircle,
} from "lucide-react";
import { supabase, Property } from "@/lib/supabase";

type DealType = "All" | "Wholesale" | "Fix & Flip" | "Rental" | "Primary";
type Status = "All" | "Available" | "Pending" | "Sold" | "Off Market" | "Rented" | "Under Contract";
type ViewMode = "grid" | "list";

interface PropertyDisplay extends Property {
  agent?: string;
  agentInitials?: string;
  listedDate: string;
  priceFormatted: string;
}

// Helper function to format currency
const formatPrice = (price: number | null) => {
  if (!price) return "N/A";
  return new Intl.NumberFormat('en-CA', {
    style: 'currency',
    currency: 'CAD',
    minimumFractionDigits: 0,
  }).format(price);
};

// Helper function to get agent initials
const getInitials = (name?: string) => {
  if (!name) return "NA";
  return name.split(' ').map(n => n[0]).join('').toUpperCase();
};

const dealTypeBadge: Record<string, string> = {
  "Wholesale": "bg-violet-100 text-violet-700",
  "Fix & Flip": "bg-amber-100 text-amber-700",
  "Rental": "bg-emerald-100 text-emerald-700",
  "Primary": "bg-blue-100 text-blue-700",
};

const statusBadge: Record<string, string> = {
  "Available": "bg-emerald-100 text-emerald-700",
  "Pending": "bg-amber-100 text-amber-700",
  "Sold": "bg-slate-100 text-slate-600",
  "Off Market": "bg-rose-100 text-rose-700",
  "Rented": "bg-teal-100 text-teal-700",
  "Under Contract": "bg-indigo-100 text-indigo-700",
};

const agentColors: Record<string, string> = {
  "SK": "bg-indigo-500", "MR": "bg-violet-500",
  "PS": "bg-emerald-500", "JL": "bg-amber-500", "NT": "bg-rose-500",
};

export default function PropertiesPage() {
  const [properties, setProperties] = useState<PropertyDisplay[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [dealType, setDealType] = useState<DealType>("All");
  const [status, setStatus] = useState<Status>("All");
  const [view, setView] = useState<ViewMode>("grid");
  const [page, setPage] = useState(1);
  const PER_PAGE = 6;

  // Fetch properties from Supabase
  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: err } = await supabase
        .from("properties")
        .select("*")
        .order("created_at", { ascending: false });

      if (err) throw err;

      const formatted = (data || []).map((p: Property) => ({
        ...p,
        agent: "Agent",
        agentInitials: "AG",
        listedDate: new Date(p.created_at).toLocaleDateString('en-CA', {
          year: '2-digit',
          month: 'short',
          day: '2-digit'
        }),
        priceFormatted: formatPrice(p.list_price),
        image: p.images?.[0] || "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=600&q=80",
      })) as PropertyDisplay[];

      setProperties(formatted);
    } catch (err: any) {
      setError(err.message);
      console.error("Error fetching properties:", err);
    } finally {
      setLoading(false);
    }
  };

  // Apply filters
  const filtered = properties.filter((p) => {
    const s = search.toLowerCase();
    const matchSearch =
      (p.address?.toLowerCase().includes(s) || false) ||
      (p.city?.toLowerCase().includes(s) || false) ||
      (p.province?.toLowerCase().includes(s) || false);
    const matchType = dealType === "All" || p.deal_type === dealType;
    const matchStatus = status === "All" || p.status === status;
    return matchSearch && matchType && matchStatus;
  });

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  // Calculate stats
  const stats = [
    { label: "Total Properties", value: properties.length, icon: Building2, color: "text-indigo-600 bg-indigo-50" },
    { label: "Available", value: properties.filter(p => p.status === "Available").length, icon: Home, color: "text-emerald-600 bg-emerald-50" },
    {
      label: "Total Value",
      value: formatPrice(properties.reduce((sum, p) => sum + (p.list_price || 0), 0)),
      icon: DollarSign,
      color: "text-amber-600 bg-amber-50"
    },
    { label: "Active Deals", value: properties.filter(p => p.status !== "Sold").length, icon: TrendingUp, color: "text-violet-600 bg-violet-50" },
  ];

  if (error) {
    return (
      <div className="flex flex-col h-full">
        <div className="px-6 py-5 bg-white border-b border-[#E8E6E0]">
          <h1 className="text-[20px] font-bold text-[#111]">Properties</h1>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <AlertCircle size={48} className="mx-auto mb-4 text-rose-600" />
            <h2 className="text-lg font-semibold text-[#111] mb-2">Error Loading Properties</h2>
            <p className="text-[#A8A49C] mb-4">{error}</p>
            <button
              onClick={fetchProperties}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-4 py-2 rounded-lg"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-6 py-5 bg-white border-b border-[#E8E6E0] flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-[20px] font-bold text-[#111] tracking-tight">Properties</h1>
          <p className="text-[13px] text-[#A8A49C] mt-0.5">Dashboard › Properties</p>
        </div>
        <button className="flex items-center gap-2 bg-[#111] hover:bg-[#222] text-white text-[13px] font-semibold px-4 py-2 rounded-xl transition-colors shadow-sm">
          <Plus size={15} /> Add Property
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-5">
        {loading ? (
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <Loader size={40} className="mx-auto mb-4 text-indigo-600 animate-spin" />
              <p className="text-[#A8A49C]">Loading properties...</p>
            </div>
          </div>
        ) : (
          <>
            {/* Stats */}
            <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
              {stats.map(({ label, value, icon: Icon, color }) => (
                <div key={label} className="bg-white rounded-xl border border-[#E8E6E0] p-4 flex items-center gap-3 shadow-sm">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}>
                    <Icon size={18} />
                  </div>
                  <div>
                    <p className="text-[11px] text-[#A8A49C] font-medium uppercase tracking-wide">{label}</p>
                    <p className="text-[18px] font-bold text-[#111] tracking-tight">{value}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Filters */}
            <div className="bg-white rounded-xl border border-[#E8E6E0] p-4 flex flex-wrap items-center gap-3 shadow-sm">
              <div className="flex items-center gap-2 bg-[#F4F5F7] rounded-xl px-3 py-2 flex-1 min-w-[200px]">
                <Search size={14} className="text-[#A8A49C] shrink-0" />
                <input
                  type="text"
                  placeholder="Search address, city..."
                  value={search}
                  onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                  className="bg-transparent text-[13px] text-[#111] placeholder-[#C5BFB5] outline-none w-full"
                />
              </div>

              <div className="flex items-center gap-1 bg-[#F4F5F7] rounded-xl p-1">
                {(["All", "Wholesale", "Fix & Flip", "Rental", "Primary"] as DealType[]).map((t) => (
                  <button
                    key={t}
                    onClick={() => { setDealType(t); setPage(1); }}
                    className={`text-[11px] font-semibold px-3 py-1.5 rounded-lg transition-colors ${dealType === t ? "bg-white text-[#111] shadow-sm" : "text-[#7C7870] hover:text-[#111]"}`}
                  >
                    {t}
                  </button>
                ))}
              </div>

              <select
                value={status}
                onChange={(e) => { setStatus(e.target.value as Status); setPage(1); }}
                className="bg-[#F4F5F7] border-0 rounded-xl px-3 py-2 text-[13px] text-[#7C7870] font-medium outline-none cursor-pointer"
              >
                {["All", "Available", "Pending", "Sold", "Off Market", "Rented", "Under Contract"].map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>

              <div className="flex items-center gap-1 bg-[#F4F5F7] rounded-xl p-1 ml-auto">
                <button
                  onClick={() => setView("grid")}
                  className={`p-1.5 rounded-lg transition-colors ${view === "grid" ? "bg-white shadow-sm text-[#111]" : "text-[#A8A49C]"}`}
                >
                  <Grid3X3 size={15} />
                </button>
                <button
                  onClick={() => setView("list")}
                  className={`p-1.5 rounded-lg transition-colors ${view === "list" ? "bg-white shadow-sm text-[#111]" : "text-[#A8A49C]"}`}
                >
                  <List size={15} />
                </button>
              </div>
            </div>

            {/* Results count */}
            <div className="flex items-center justify-between">
              <p className="text-[13px] text-[#A8A49C]">
                Showing <span className="font-semibold text-[#111]">{filtered.length}</span> properties
              </p>
            </div>

            {/* Content */}
            {filtered.length === 0 ? (
              <div className="bg-white rounded-xl border border-[#E8E6E0] p-12 text-center">
                <p className="text-[#A8A49C] text-[14px]">No properties found matching your filters.</p>
              </div>
            ) : (
              <>
                {/* Grid view */}
                {view === "grid" && (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {paginated.map((p) => (
                      <div key={p.id} className="bg-white rounded-xl border border-[#E8E6E0] shadow-sm hover:shadow-md hover:border-indigo-200 transition-all group">
                        <div className="relative h-44 rounded-t-xl overflow-hidden bg-[#F4F5F7]">
                          <img
                            src={p.images?.[0] ?? "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=600&q=80"}
                            alt={p.address}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            onError={(e) => { (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=600&q=80"; }}
                          />
                          <div className="absolute top-2.5 left-2.5 flex gap-1.5">
                            {p.deal_type && <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${dealTypeBadge[p.deal_type]}`}>{p.deal_type}</span>}
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${statusBadge[p.status]}`}>{p.status}</span>
                          </div>
                          <div className="absolute bottom-2.5 right-2.5 bg-[#111]/80 backdrop-blur-sm text-white text-[12px] font-bold px-2.5 py-1 rounded-lg">
                            {p.priceFormatted}
                          </div>
                        </div>
                        <div className="p-4">
                          <div className="flex items-start gap-1.5 mb-3">
                            <MapPin size={13} className="text-indigo-400 mt-0.5 shrink-0" />
                            <div>
                              <p className="text-[14px] font-bold text-[#111]">{p.address}</p>
                              <p className="text-[12px] text-[#A8A49C]">{p.city}, {p.province}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-4 text-[12px] text-[#7C7870] mb-4">
                            {p.beds !== null && <span className="flex items-center gap-1"><Bed size={12} className="text-[#C5BFB5]" />{p.beds} Beds</span>}
                            {p.baths !== null && <span className="flex items-center gap-1"><Bath size={12} className="text-[#C5BFB5]" />{p.baths} Baths</span>}
                            {p.sqft !== null && <span className="flex items-center gap-1"><Maximize2 size={12} className="text-[#C5BFB5]" />{p.sqft.toLocaleString()} ft²</span>}
                          </div>
                          <div className="flex items-center justify-between pt-3 border-t border-[#F0EDE6]">
                            <div className="flex items-center gap-1.5">
                              <div className={`w-6 h-6 rounded-full ${agentColors[p.agentInitials || "NA"]} flex items-center justify-center text-white text-[9px] font-bold`}>
                                {p.agentInitials}
                              </div>
                              <span className="text-[11px] text-[#7C7870]">Agent</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Link href={`/admin/properties/${p.id}`} className="w-7 h-7 rounded-lg flex items-center justify-center text-[#A8A49C] hover:bg-indigo-50 hover:text-indigo-600 transition-colors">
                                <Eye size={13} />
                              </Link>
                              <button className="w-7 h-7 rounded-lg flex items-center justify-center text-[#A8A49C] hover:bg-amber-50 hover:text-amber-600 transition-colors">
                                <Pencil size={13} />
                              </button>
                              <button className="w-7 h-7 rounded-lg flex items-center justify-center text-[#A8A49C] hover:bg-rose-50 hover:text-rose-600 transition-colors">
                                <Trash2 size={13} />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* List view */}
                {view === "list" && (
                  <div className="bg-white rounded-xl border border-[#E8E6E0] shadow-sm overflow-hidden">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-[#F0EDE6]">
                          {["Property", "Type", "Details", "Price", "Status", "Listed", ""].map((h) => (
                            <th key={h} className="text-left px-4 py-3 text-[11px] font-bold text-[#A8A49C] uppercase tracking-wide">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#F9F8F6]">
                        {paginated.map((p) => (
                          <tr key={p.id} className="hover:bg-[#FAFAF8] transition-colors group">
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-2.5">
                                <img
                                  src={p.images?.[0] ?? "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=100&q=80"}
                                  alt=""
                                  className="w-10 h-10 rounded-lg object-cover shrink-0"
                                  onError={(e) => { (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=100&q=80"; }}
                                />
                                <div>
                                  <p className="text-[13px] font-semibold text-[#111]">{p.address}</p>
                                  <p className="text-[11px] text-[#A8A49C]">{p.city}, {p.province}</p>
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-3">{p.deal_type && <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${dealTypeBadge[p.deal_type]}`}>{p.deal_type}</span>}</td>
                            <td className="px-4 py-3 text-[13px] text-[#7C7870]">{p.beds}b / {p.baths}ba / {p.sqft} ft²</td>
                            <td className="px-4 py-3 text-[13px] font-bold text-[#111]">{p.priceFormatted}</td>
                            <td className="px-4 py-3"><span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${statusBadge[p.status]}`}>{p.status}</span></td>
                            <td className="px-4 py-3 text-[12px] text-[#A8A49C]">{p.listedDate}</td>
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Link href={`/admin/properties/${p.id}`} className="w-7 h-7 rounded-lg flex items-center justify-center text-[#A8A49C] hover:bg-indigo-50 hover:text-indigo-600 transition-colors"><Eye size={13} /></Link>
                                <button className="w-7 h-7 rounded-lg flex items-center justify-center text-[#A8A49C] hover:bg-amber-50 hover:text-amber-600 transition-colors"><Pencil size={13} /></button>
                                <button className="w-7 h-7 rounded-lg flex items-center justify-center text-[#A8A49C] hover:bg-rose-50 hover:text-rose-600 transition-colors"><Trash2 size={13} /></button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-between">
                    <p className="text-[13px] text-[#A8A49C]">Page {page} of {totalPages}</p>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => setPage(p => Math.max(1, p - 1))}
                        disabled={page === 1}
                        className="w-8 h-8 rounded-xl flex items-center justify-center text-[#7C7870] hover:bg-white hover:shadow-sm disabled:opacity-40 transition-all border border-[#E8E6E0]"
                      >
                        <ChevronLeft size={14} />
                      </button>
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                        <button
                          key={n}
                          onClick={() => setPage(n)}
                          className={`w-8 h-8 rounded-xl text-[13px] font-semibold transition-all border ${page === n ? "bg-[#111] text-white border-[#111]" : "text-[#7C7870] hover:bg-white border-[#E8E6E0] hover:shadow-sm"}`}
                        >
                          {n}
                        </button>
                      ))}
                      <button
                        onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                        disabled={page === totalPages}
                        className="w-8 h-8 rounded-xl flex items-center justify-center text-[#7C7870] hover:bg-white hover:shadow-sm disabled:opacity-40 transition-all border border-[#E8E6E0]"
                      >
                        <ChevronRight size={14} />
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}
