"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Navbar from "@/components/Navbar";
import PropertyCard from "@/components/PropertyCard";
import { Search, MapPin, SlidersHorizontal, X } from "lucide-react";

export default function ExplorePage() {
  const [properties, setProperties] = useState<any[]>([]);
  const [filtered, setFiltered] = useState<any[]>([]);
  const [maxPrice, setMaxPrice] = useState(10); // Default 10Cr
  const [selectedArea, setSelectedArea] = useState("all");
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    async function fetchAll() {
      const { data } = await supabase.from('properties').select('*');
      if (data) {
        setProperties(data);
        setFiltered(data);
      }
      setLoading(false);
    }
    fetchAll();
  }, []);

  // 🛠️ CUSTOM FILTER LOGIC
  useEffect(() => {
    let result = properties;
    result = result.filter(p => parseFloat(p.price) <= maxPrice);
    if (selectedArea !== "all") {
      result = result.filter(p => p.location.toLowerCase().includes(selectedArea.toLowerCase()));
    }
    if (searchTerm) {
      result = result.filter(p => p.title.toLowerCase().includes(searchTerm.toLowerCase()));
    }
    setFiltered(result);
  }, [maxPrice, selectedArea, searchTerm, properties]);

  return (
    <main className="min-h-screen bg-[#FDFDFD] pt-24 pb-20">
      <Navbar />
      <div className="max-w-[1600px] mx-auto px-4 md:px-10">
        
        {/* 🔍 GLOBAL SEARCH (Same as Home but Compact) */}
        <div className="bg-white p-2 rounded-[2.5rem] shadow-sm border border-slate-100 flex items-center mb-10 max-w-4xl mx-auto">
          <Search className="ml-5 text-slate-400" size={20} />
          <input 
            type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by name..." 
            className="flex-1 p-4 outline-none text-[11px] font-black uppercase text-slate-900"
          />
        </div>

        <div className="flex flex-col lg:flex-row gap-10">
          
          {/* 🛠️ CUSTOM PRICE & AREA SIDEBAR */}
          <aside className="w-full lg:w-72 shrink-0 bg-white p-8 rounded-[2rem] border border-slate-100 h-fit">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] mb-8 text-blue-600 flex items-center gap-2"><SlidersHorizontal size={14}/> Custom Filters</h3>

            <div className="mb-8">
              <div className="flex justify-between items-center mb-4">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Max Budget</label>
                <span className="text-[11px] font-black text-slate-900 italic">₹{maxPrice} Cr</span>
              </div>
              <input 
                type="range" min="1" max="20" step="0.5" value={maxPrice} 
                onChange={(e) => setMaxPrice(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
            </div>

            <div>
              <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-4">Location</label>
              <select onChange={(e) => setSelectedArea(e.target.value)} className="w-full p-4 bg-slate-50 rounded-2xl text-[10px] font-black uppercase outline-none border border-slate-100">
                <option value="all">Everywhere</option>
                <option value="Satellite">Satellite</option>
                <option value="Bopal">Bopal</option>
                <option value="Bodakdev">Bodakdev</option>
              </select>
            </div>
          </aside>

          {/* 💎 INVENTORY (2-Columns Mobile Fix) */}
          <div className="flex-1">
            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-8">
              {filtered.map(p => (
                <PropertyCard key={p.id} id={p.id} title={p.title} price={p.price} location={p.location} image={p.main_image} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}