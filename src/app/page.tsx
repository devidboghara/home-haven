"use client";

import Navbar from "@/components/Navbar";
import PropertyCard from "@/components/PropertyCard";
import { supabase } from "@/lib/supabase";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { Search, MapPin, MessageCircle } from "lucide-react";
import Link from "next/link";

export default function Home() {
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [highlightedId, setHighlightedId] = useState<string | null>(null);

  useEffect(() => {
    async function getFeaturedProperties() {
      const { data } = await supabase.from('properties').select('*').limit(8);
      if (data) setListings(data);
      setLoading(false);
    }
    getFeaturedProperties();
  }, []);

  useEffect(() => {
    if (searchTerm.length > 1) {
      const filtered = listings.filter(p => 
        p.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
        p.location.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setSuggestions(filtered.slice(0, 5));
    } else {
      setSuggestions([]);
    }
  }, [searchTerm, listings]);

  const handleSelect = (property: any) => {
    setSearchTerm("");
    setSuggestions([]);
    const element = document.getElementById(`property-${property.id}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      setHighlightedId(property.id);
      setTimeout(() => setHighlightedId(null), 3000);
    } else {
      window.location.href = `/explore?search=${property.title}`;
    }
  };

  return (
    <main className="relative min-h-screen bg-[#F8FAFC]">
      <Navbar />
      
      {/* 🏙️ HERO SECTION (60vh Height - Compact) */}
      <section className="relative w-full h-[60vh] flex flex-col items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1600" className="w-full h-full object-cover brightness-[0.45]" alt="Hero" />
        </div>
        
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="relative z-20 text-center px-6 mt-[-5vh]">
          <h1 className="text-6xl md:text-[8rem] font-black text-white tracking-tighter uppercase italic leading-none drop-shadow-2xl">Luxe<span className="text-blue-500">Lair.</span></h1>
        </motion.div>

        {/* 🔍 SEARCH BAR (Positioned at Bottom of Hero) */}
        <div className="absolute bottom-10 z-30 w-full max-w-3xl px-6">
          <div className="bg-white/95 backdrop-blur-md p-2 rounded-[2rem] shadow-2xl flex items-center border border-white/20">
            <Search className="ml-5 text-slate-400" size={22} />
            <input 
              type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search Area or Property Name..." 
              className="flex-1 p-5 outline-none text-[11px] font-black uppercase text-slate-900 placeholder:text-slate-300"
            />
          </div>

          <AnimatePresence>
            {suggestions.length > 0 && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="absolute w-[calc(100%-3rem)] bg-white bottom-full mb-3 rounded-[2rem] shadow-2xl border border-slate-100 overflow-hidden z-[100]">
                {suggestions.map((p) => (
                  <button key={p.id} onClick={() => handleSelect(p)} className="w-full p-5 hover:bg-slate-50 flex items-center justify-between border-b border-slate-50 last:border-0">
                    <div className="flex items-center gap-4 text-left">
                       <MapPin size={14} className="text-blue-600" />
                       <p className="text-[10px] font-black text-slate-900 uppercase">{p.title}</p>
                    </div>
                    <span className="text-[8px] font-black text-blue-600 uppercase">View Property</span>
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* 💎 FEATURED PROPERTIES (2 Columns on Mobile) */}
      <section className="max-w-[1500px] mx-auto py-16 px-4 md:px-10">
        <div className="flex justify-between items-end mb-10">
          <h2 className="text-3xl font-black text-slate-900 uppercase italic tracking-tighter">Featured Listings</h2>
          <Link href="/explore" className="text-[9px] font-black uppercase text-blue-600 tracking-widest border-b-2 border-blue-50">View All →</Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-8">
          {listings.map((p) => (
            <div key={p.id} id={`property-${p.id}`} className={`transition-all duration-700 rounded-[2rem] ${highlightedId === p.id ? 'ring-8 ring-blue-500/30 scale-105' : ''}`}>
              <PropertyCard id={p.id} title={p.title} price={p.price} location={p.location} image={p.main_image} />
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}