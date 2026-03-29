"use client";

import Navbar from "@/components/Navbar";
import PropertyCard from "@/components/PropertyCard";
import { supabase } from "@/lib/supabase";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { Search, MapPin, MessageCircle, ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";

export default function Home() {
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [highlightedId, setHighlightedId] = useState<string | null>(null);

  useEffect(() => {
    async function getFeaturedProperties() {
      // 8 properties limit for Home
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
    <main className="relative min-h-screen bg-[#FBFCFE]">
      <Navbar />
      
      {/* 🏙️ RICH HERO SECTION */}
      <section className="relative w-full h-[60vh] flex flex-col items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1600&q=80" 
            className="w-full h-full object-cover" 
            alt="Luxury White Villa" 
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-[#FBFCFE]"></div>
        </div>
        
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="relative z-20 text-center px-6 -mt-10">
          <h1 className="text-7xl md:text-[10rem] font-black text-white tracking-tighter uppercase italic leading-[0.8] drop-shadow-2xl">
            Luxe<span className="text-blue-500">Lair.</span>
          </h1>
        </motion.div>

        {/* 🔍 BLUISH SEARCH BAR (Hero Bottom) */}
        <div className="absolute bottom-8 z-30 w-full max-w-2xl px-6">
          <div className="bg-blue-50/90 backdrop-blur-2xl p-1.5 rounded-[2.5rem] shadow-2xl flex items-center border border-blue-100 hover:border-blue-300 transition-all duration-500">
            <div className="bg-blue-600 p-4 rounded-full shadow-xl shadow-blue-500/30">
              <Search className="text-white" size={18} />
            </div>
            <input 
              type="text" 
              value={searchTerm} 
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search Area (Satellite, Bopal) or Property..." 
              className="flex-1 bg-transparent p-4 outline-none text-[11px] font-black uppercase text-blue-900 placeholder:text-blue-900/40 tracking-widest"
            />
          </div>

          <AnimatePresence>
            {suggestions.length > 0 && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="absolute w-[calc(100%-3rem)] bg-white/95 backdrop-blur-xl mt-4 rounded-[2.5rem] shadow-2xl border border-blue-50 overflow-hidden z-[100]">
                {suggestions.map((p) => (
                  <button key={p.id} onClick={() => handleSelect(p)} className="w-full p-6 hover:bg-blue-50/50 flex items-center justify-between border-b border-slate-50 last:border-0 transition-all">
                    <div className="flex items-center gap-4 text-left">
                       <MapPin size={14} className="text-blue-600" />
                       <p className="text-[10px] font-black text-slate-900 uppercase italic">{p.title}</p>
                    </div>
                    <ArrowRight size={16} className="text-blue-500" />
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* 💎 FEATURED SECTION (No Gap) */}
      <section className="max-w-[1700px] mx-auto pt-10 pb-20 px-4 md:px-12">
        <div className="flex items-end justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
               <Sparkles size={12} className="text-blue-500" />
               <p className="text-[9px] font-black text-blue-500 uppercase tracking-[0.4em]">Handpicked</p>
            </div>
            <h2 className="text-4xl font-black text-slate-900 uppercase italic tracking-tighter leading-none">Featured Inventory</h2>
          </div>
        </div>

        {/* 2-Columns Mobile Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-10">
          {listings.map((p) => (
            <div 
              key={p.id} 
              id={`property-${p.id}`} 
              className={`transition-all duration-700 rounded-[2.8rem] ${highlightedId === p.id ? 'ring-[15px] ring-blue-500/10 scale-105 shadow-2xl' : ''}`}
            >
              <PropertyCard id={p.id} title={p.title} price={p.price} location={p.location} image={p.main_image} />
            </div>
          ))}
        </div>

        {/* 🚀 EXPLORE ALL BUTTON (After 8 Items) */}
        <div className="mt-20 flex justify-center">
          <Link href="/explore" className="group relative flex items-center gap-4 bg-slate-900 text-white px-12 py-6 rounded-[2rem] overflow-hidden shadow-2xl hover:bg-blue-600 transition-all duration-500">
            <span className="relative z-10 text-[10px] font-black uppercase tracking-[0.3em]">Explore All Properties</span>
            <ArrowRight size={18} className="relative z-10 group-hover:translate-x-2 transition-transform" />
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-400 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          </Link>
        </div>
      </section>

      <Link href="/profile" className="fixed bottom-12 right-12 z-[100] bg-white p-6 rounded-full shadow-2xl border border-slate-50 hover:scale-110 transition-all">
        <MessageCircle size={28} className="text-blue-600" />
      </Link>
    </main>
  );
}