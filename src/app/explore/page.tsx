"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import PropertyCard from "@/components/PropertyCard";
import { supabase } from "@/lib/supabase";
import { Filter, SlidersHorizontal, Search } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function ExplorePage() {
  const [properties, setProperties] = useState<any[]>([]);
  const [filtered, setFiltered] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("All");

  const categories = ["All", "Penthouse", "Flat", "Villa"];

  useEffect(() => {
    async function fetchAll() {
      const { data, error } = await supabase.from('properties').select('*');
      if (!error) {
        setProperties(data);
        setFiltered(data);
      }
      setLoading(false);
    }
    fetchAll();
  }, []);

  // 🛠️ FILTER LOGIC
  useEffect(() => {
    if (activeTab === "All") {
      setFiltered(properties);
    } else {
      setFiltered(properties.filter(p => p.category === activeTab));
    }
  }, [activeTab, properties]);

  return (
    <main className="min-h-screen bg-[#F8FAFC] pt-32 px-6 pb-20">
      <Navbar />
      
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
          <div>
            <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter uppercase italic">Explore <span className="text-blue-600">Luxury.</span></h1>
            <p className="text-slate-500 font-bold uppercase tracking-[0.3em] text-[10px] mt-2">Discover Ahmedabad's Prime Real Estate</p>
          </div>

          {/* 🔘 CATEGORY TABS */}
          <div className="flex bg-white p-1.5 rounded-2xl shadow-sm border border-slate-100 overflow-x-auto max-w-full">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveTab(cat)}
                className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                  activeTab === cat ? "bg-[#0051A1] text-white shadow-lg" : "text-slate-400 hover:text-slate-900"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* 🏗️ GRID */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
          <AnimatePresence mode="popLayout">
            {loading ? (
              <div className="col-span-full py-20 text-center font-black text-slate-300 italic animate-pulse tracking-widest">LOADING DATABASE...</div>
            ) : filtered.length > 0 ? (
              filtered.map((item) => (
                <motion.div
                  layout
                  key={item.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.2 }}
                >
                  <PropertyCard 
                    id={item.id}
                    title={item.title}
                    price={item.price}
                    location={item.location}
                    image={item.main_image}
                  />
                </motion.div>
              ))
            ) : (
              <div className="col-span-full py-20 text-center font-black text-slate-400">NO PROPERTIES FOUND IN THIS CATEGORY.</div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </main>
  );
}