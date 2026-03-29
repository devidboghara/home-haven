"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Navbar from "@/components/Navbar";
import PropertyCard from "@/components/PropertyCard";
import { Filter, MapPin, Search, ChevronDown, SlidersHorizontal } from "lucide-react";

export default function ExplorePage() {
  const [properties, setProperties] = useState<any[]>([]);
  const [filtered, setFiltered] = useState<any[]>([]);
  const [priceRange, setPriceRange] = useState("all");
  const [selectedArea, setSelectedArea] = useState("all");
  const [loading, setLoading] = useState(true);

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

  // 🛠️ FILTER LOGIC
  useEffect(() => {
    let result = properties;
    
    if (priceRange !== "all") {
      if (priceRange === "under-2") result = result.filter(p => parseFloat(p.price) < 2);
      if (priceRange === "2-5") result = result.filter(p => parseFloat(p.price) >= 2 && parseFloat(p.price) <= 5);
      if (priceRange === "above-5") result = result.filter(p => parseFloat(p.price) > 5);
    }

    if (selectedArea !== "all") {
      result = result.filter(p => p.location.toLowerCase().includes(selectedArea.toLowerCase()));
    }

    setFiltered(result);
  }, [priceRange, selectedArea, properties]);

  return (
    <main className="min-h-screen bg-[#FBFCFE] pt-32 pb-20">
      <Navbar />
      <div className="max-w-[1700px] mx-auto px-8">
        
        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* 🔍 SIDEBAR FILTERS (Laptop Left) */}
          <aside className="w-full lg:w-80 shrink-0">
            <div className="sticky top-32 bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
              <div className="flex items-center gap-3 mb-10">
                <SlidersHorizontal size={20} className="text-blue-600" />
                <h3 className="text-lg font-black uppercase italic tracking-tighter">Refine Search</h3>
              </div>

              {/* AREA FILTER */}
              <div className="mb-10">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-4">Select Location</label>
                <div className="space-y-2">
                  {["all", "Satellite", "Bopal", "Prahlad Nagar", "Bodakdev"].map(area => (
                    <button key={area} onClick={() => setSelectedArea(area)} className={`w-full text-left p-4 rounded-2xl text-[10px] font-black uppercase transition-all ${selectedArea === area ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : 'bg-slate-50 text-slate-400 hover:bg-slate-100'}`}>
                      {area === "all" ? "Whole City" : area}
                    </button>
                  ))}
                </div>
              </div>

              {/* PRICE FILTER */}
              <div className="mb-10">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-4">Budget Range</label>
                <div className="space-y-2">
                  <button onClick={() => setPriceRange("all")} className={`w-full text-left p-4 rounded-2xl text-[10px] font-black uppercase ${priceRange === 'all' ? 'bg-slate-900 text-white' : 'bg-slate-50 text-slate-400'}`}>Any Price</button>
                  <button onClick={() => setPriceRange("under-2")} className={`w-full text-left p-4 rounded-2xl text-[10px] font-black uppercase ${priceRange === 'under-2' ? 'bg-slate-900 text-white' : 'bg-slate-50 text-slate-400'}`}>Under ₹2 Cr</button>
                  <button onClick={() => setPriceRange("2-5")} className={`w-full text-left p-4 rounded-2xl text-[10px] font-black uppercase ${priceRange === '2-5' ? 'bg-slate-900 text-white' : 'bg-slate-50 text-slate-400'}`}>₹2 Cr - ₹5 Cr</button>
                  <button onClick={() => setPriceRange("above-5")} className={`w-full text-left p-4 rounded-2xl text-[10px] font-black uppercase ${priceRange === 'above-5' ? 'bg-slate-900 text-white' : 'bg-slate-50 text-slate-400'}`}>Above ₹5 Cr</button>
                </div>
              </div>
            </div>
          </aside>

          {/* 💎 TOTAL INVENTORY GRID */}
          <div className="flex-1">
            <div className="flex justify-between items-center mb-10">
              <h2 className="text-2xl font-black text-slate-900 uppercase italic">Total Collection ({filtered.length})</h2>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Ahmedabad, GJ</p>
            </div>

            {filtered.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                {filtered.map(p => (
                  <PropertyCard key={p.id} id={p.id} title={p.title} price={p.price} location={p.location} image={p.main_image} />
                ))}
              </div>
            ) : (
              <div className="h-[50vh] flex flex-col items-center justify-center bg-white rounded-[3rem] border-2 border-dashed border-slate-100">
                <Search size={40} className="text-slate-200 mb-4" />
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">No Properties found matching these criteria</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}