"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Search, Filter, Plus, Grid3X3, List, MapPin, Bed, Bath,
  Maximize2, Eye, Pencil, Trash2, ChevronDown, ChevronLeft,
  ChevronRight, Building2, TrendingUp, Home, DollarSign,
} from "lucide-react";

type DealType = "All" | "Wholesale" | "Fix & Flip" | "Rental";
type Status = "All" | "Available" | "Pending" | "Sold" | "Off Market";
type ViewMode = "grid" | "list";

interface Property {
  id: string;
  address: string;
  city: string;
  beds: number;
  baths: number;
  sqft: number;
  price: string;
  priceNum: number;
  dealType: Exclude<DealType, "All">;
  status: Exclude<Status, "All">;
  yearBuilt: number;
  agent: string;
  agentInitials: string;
  image: string;
  listedDate: string;
  roi: string;
}

const PROPERTIES: Property[] = [
  { id: "p1", address: "42 Maple Street", city: "Toronto, ON", beds: 3, baths: 2, sqft: 1850, price: "CA$480,000", priceNum: 480000, dealType: "Fix & Flip", status: "Available", yearBuilt: 1998, agent: "Sarah Kim", agentInitials: "SK", image: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=600&q=80", listedDate: "Mar 12, 2026", roi: "18.4%" },
  { id: "p2", address: "18 Lakeview Drive", city: "Vancouver, BC", beds: 4, baths: 3, sqft: 2400, price: "CA$920,000", priceNum: 920000, dealType: "Rental", status: "Pending", yearBuilt: 2005, agent: "Mike Roberts", agentInitials: "MR", image: "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=600&q=80", listedDate: "Mar 8, 2026", roi: "7.2%" },
  { id: "p3", address: "7 Pine Avenue", city: "Calgary, AB", beds: 2, baths: 1, sqft: 1100, price: "CA$310,000", priceNum: 310000, dealType: "Wholesale", status: "Available", yearBuilt: 1985, agent: "Priya Sharma", agentInitials: "PS", image: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=600&q=80", listedDate: "Mar 15, 2026", roi: "24.1%" },
  { id: "p4", address: "93 Harbor Blvd", city: "Montreal, QC", beds: 5, baths: 4, sqft: 3200, price: "CA$1,250,000", priceNum: 1250000, dealType: "Fix & Flip", status: "Sold", yearBuilt: 2010, agent: "James Liu", agentInitials: "JL", image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=600&q=80", listedDate: "Feb 28, 2026", roi: "21.6%" },
  { id: "p5", address: "5 Birchwood Court", city: "Ottawa, ON", beds: 3, baths: 2, sqft: 1650, price: "CA$395,000", priceNum: 395000, dealType: "Rental", status: "Available", yearBuilt: 2001, agent: "Nina Torres", agentInitials: "NT", image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&q=80", listedDate: "Mar 20, 2026", roi: "9.8%" },
  { id: "p6", address: "29 Elmwood Lane", city: "Edmonton, AB", beds: 4, baths: 2, sqft: 2100, price: "CA$540,000", priceNum: 540000, dealType: "Wholesale", status: "Off Market", yearBuilt: 1995, agent: "Sarah Kim", agentInitials: "SK", image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80", listedDate: "Mar 5, 2026", roi: "28.3%" },
  { id: "p7", address: "11 Rosewood Blvd", city: "Winnipeg, MB", beds: 3, baths: 2, sqft: 1750, price: "CA$425,000", priceNum: 425000, dealType: "Fix & Flip", status: "Pending", yearBuilt: 2003, agent: "Mike Roberts", agentInitials: "MR", image: "https://images.unsplash.com/photo-1523217582562-09d0def993a6?w=600&q=80", listedDate: "Mar 18, 2026", roi: "16.9%" },
  { id: "p8", address: "66 Willow Creek Rd", city: "Halifax, NS", beds: 2, baths: 1, sqft: 980, price: "CA$275,000", priceNum: 275000, dealType: "Rental", status: "Available", yearBuilt: 1992, agent: "James Liu", agentInitials: "JL", image: "https://images.unsplash.com/photo-1576941089067-2de3c901e126?w=600&q=80", listedDate: "Mar 22, 2026", roi: "8.5%" },
  { id: "p9", address: "34 Cedar Hills Dr", city: "Regina, SK", beds: 4, baths: 3, sqft: 2600, price: "CA$610,000", priceNum: 610000, dealType: "Wholesale", status: "Available", yearBuilt: 2008, agent: "Priya Sharma", agentInitials: "PS", image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&q=80", listedDate: "Mar 10, 2026", roi: "31.2%" },
  { id: "p10", address: "8 Oakridge Terrace", city: "Victoria, BC", beds: 5, baths: 4, sqft: 3800, price: "CA$1,750,000", priceNum: 1750000, dealType: "Fix & Flip", status: "Sold", yearBuilt: 2015, agent: "Nina Torres", agentInitials: "NT", image: "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=600&q=80", listedDate: "Feb 20, 2026", roi: "19.7%" },
];

const dealTypeBadge: Record<string, string> = {
  "Wholesale": "bg-violet-100 text-violet-700",
  "Fix & Flip": "bg-amber-100 text-amber-700",
  "Rental": "bg-emerald-100 text-emerald-700",
};

const statusBadge: Record<string, string> = {
  "Available": "bg-emerald-100 text-emerald-700",
  "Pending": "bg-amber-100 text-amber-700",
  "Sold": "bg-slate-100 text-slate-600",
  "Off Market": "bg-rose-100 text-rose-700",
};

const agentColors: Record<string, string> = {
  SK: "bg-indigo-500", MR: "bg-violet-500",
  PS: "bg-emerald-500", JL: "bg-amber-500", NT: "bg-rose-500",
};

export default function PropertiesPage() {
  const [search, setSearch] = useState("");
  const [dealType, setDealType] = useState<DealType>("All");
  const [status, setStatus] = useState<Status>("All");
  const [view, setView] = useState<ViewMode>("grid");
  const [page, setPage] = useState(1);
  const PER_PAGE = 6;

  const filtered = PROPERTIES.filter((p) => {
    const s = search.toLowerCase();
    const matchSearch = p.address.toLowerCase().includes(s) || p.city.toLowerCase().includes(s) || p.agent.toLowerCase().includes(s);
    const matchType = dealType === "All" || p.dealType === dealType;
    const matchStatus = status === "All" || p.status === status;
    return matchSearch && matchType && matchStatus;
  });

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const stats = [
    { label: "Total Properties", value: PROPERTIES.length, icon: Building2, color: "text-indigo-600 bg-indigo-50" },
    { label: "Available", value: PROPERTIES.filter(p => p.status === "Available").length, icon: Home, color: "text-emerald-600 bg-emerald-50" },
    { label: "Total Value", value: "CA$9.5M", icon: DollarSign, color: "text-amber-600 bg-amber-50" },
    { label: "Avg ROI", value: "18.9%", icon: TrendingUp, color: "text-violet-600 bg-violet-50" },
  ];

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
            <input type="text" placeholder="Search address, city, agent..." value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="bg-transparent text-[13px] text-[#111] placeholder-[#C5BFB5] outline-none w-full" />
          </div>

          <div className="flex items-center gap-1 bg-[#F4F5F7] rounded-xl p-1">
            {(["All", "Wholesale", "Fix & Flip", "Rental"] as DealType[]).map((t) => (
              <button key={t} onClick={() => { setDealType(t); setPage(1); }}
                className={`text-[11px] font-semibold px-3 py-1.5 rounded-lg transition-colors ${dealType === t ? "bg-white text-[#111] shadow-sm" : "text-[#7C7870] hover:text-[#111]"}`}>
                {t}
              </button>
            ))}
          </div>

          <select value={status} onChange={(e) => { setStatus(e.target.value as Status); setPage(1); }}
            className="bg-[#F4F5F7] border-0 rounded-xl px-3 py-2 text-[13px] text-[#7C7870] font-medium outline-none cursor-pointer">
            {["All", "Available", "Pending", "Sold", "Off Market"].map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>

          <div className="flex items-center gap-1 bg-[#F4F5F7] rounded-xl p-1 ml-auto">
            <button onClick={() => setView("grid")} className={`p-1.5 rounded-lg transition-colors ${view === "grid" ? "bg-white shadow-sm text-[#111]" : "text-[#A8A49C]"}`}>
              <Grid3X3 size={15} />
            </button>
            <button onClick={() => setView("list")} className={`p-1.5 rounded-lg transition-colors ${view === "list" ? "bg-white shadow-sm text-[#111]" : "text-[#A8A49C]"}`}>
              <List size={15} />
            </button>
          </div>
        </div>

        {/* Results count */}
        <div className="flex items-center justify-between">
          <p className="text-[13px] text-[#A8A49C]">
            Showing <span className="font-semibold text-[#111]">{filtered.length}</span> properties
          </p>
          <div className="flex items-center gap-2 text-[12px] text-[#7C7870]">
            <Filter size={13} />
            <span>Sort by: </span>
            <button className="font-semibold text-[#111] flex items-center gap-1">
              Newest <ChevronDown size={12} />
            </button>
          </div>
        </div>

        {/* Grid view */}
        {view === "grid" && (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {paginated.map((p) => (
              <div key={p.id} className="bg-white rounded-xl border border-[#E8E6E0] shadow-sm hover:shadow-md hover:border-indigo-200 transition-all group">
                <div className="relative h-44 rounded-t-xl overflow-hidden bg-[#F4F5F7]">
                  <img src={p.image} alt={p.address} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => { (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=600&q=80"; }} />
                  <div className="absolute top-2.5 left-2.5 flex gap-1.5">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${dealTypeBadge[p.dealType]}`}>{p.dealType}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${statusBadge[p.status]}`}>{p.status}</span>
                  </div>
                  <div className="absolute bottom-2.5 right-2.5 bg-[#111]/80 backdrop-blur-sm text-white text-[12px] font-bold px-2.5 py-1 rounded-lg">
                    {p.price}
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex items-start gap-1.5 mb-3">
                    <MapPin size={13} className="text-indigo-400 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-[14px] font-bold text-[#111]">{p.address}</p>
                      <p className="text-[12px] text-[#A8A49C]">{p.city}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-[12px] text-[#7C7870] mb-4">
                    <span className="flex items-center gap-1"><Bed size={12} className="text-[#C5BFB5]" />{p.beds} Beds</span>
                    <span className="flex items-center gap-1"><Bath size={12} className="text-[#C5BFB5]" />{p.baths} Baths</span>
                    <span className="flex items-center gap-1"><Maximize2 size={12} className="text-[#C5BFB5]" />{p.sqft.toLocaleString()} ft²</span>
                  </div>
                  <div className="flex items-center justify-between pt-3 border-t border-[#F0EDE6]">
                    <div className="flex items-center gap-1.5">
                      <div className={`w-6 h-6 rounded-full ${agentColors[p.agentInitials]} flex items-center justify-center text-white text-[9px] font-bold`}>
                        {p.agentInitials}
                      </div>
                      <span className="text-[11px] text-[#7C7870]">{p.agent}</span>
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
                  {["Property", "Type", "Beds/Baths", "Area", "Price", "ROI", "Status", "Agent", "Listed", ""].map((h) => (
                    <th key={h} className="text-left px-4 py-3 text-[11px] font-bold text-[#A8A49C] uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F9F8F6]">
                {paginated.map((p) => (
                  <tr key={p.id} className="hover:bg-[#FAFAF8] transition-colors group">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <img src={p.image} alt="" className="w-10 h-10 rounded-lg object-cover shrink-0"
                          onError={(e) => { (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=100&q=80"; }} />
                        <div>
                          <p className="text-[13px] font-semibold text-[#111]">{p.address}</p>
                          <p className="text-[11px] text-[#A8A49C]">{p.city}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3"><span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${dealTypeBadge[p.dealType]}`}>{p.dealType}</span></td>
                    <td className="px-4 py-3 text-[13px] text-[#7C7870]">{p.beds}b / {p.baths}ba</td>
                    <td className="px-4 py-3 text-[13px] text-[#7C7870]">{p.sqft.toLocaleString()} ft²</td>
                    <td className="px-4 py-3 text-[13px] font-bold text-[#111]">{p.price}</td>
                    <td className="px-4 py-3 text-[13px] font-semibold text-emerald-600">{p.roi}</td>
                    <td className="px-4 py-3"><span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${statusBadge[p.status]}`}>{p.status}</span></td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        <div className={`w-6 h-6 rounded-full ${agentColors[p.agentInitials]} flex items-center justify-center text-white text-[9px] font-bold`}>{p.agentInitials}</div>
                        <span className="text-[12px] text-[#7C7870]">{p.agent}</span>
                      </div>
                    </td>
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
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                className="w-8 h-8 rounded-xl flex items-center justify-center text-[#7C7870] hover:bg-white hover:shadow-sm disabled:opacity-40 transition-all border border-[#E8E6E0]">
                <ChevronLeft size={14} />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                <button key={n} onClick={() => setPage(n)}
                  className={`w-8 h-8 rounded-xl text-[13px] font-semibold transition-all border ${page === n ? "bg-[#111] text-white border-[#111]" : "text-[#7C7870] hover:bg-white border-[#E8E6E0] hover:shadow-sm"}`}>
                  {n}
                </button>
              ))}
              <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                className="w-8 h-8 rounded-xl flex items-center justify-center text-[#7C7870] hover:bg-white hover:shadow-sm disabled:opacity-40 transition-all border border-[#E8E6E0]">
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}