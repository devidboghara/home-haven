"use client";

import Navbar from "@/components/Navbar";
import PropertyCard from "@/components/PropertyCard";
import { supabase } from "@/lib/supabase";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { Search, MapPin, MessageCircle, ArrowRight } from "lucide-react";
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
    <main className="relative min-h-screen bg-[#FDFDFD]">
      <Navbar />
      
      {/* 🏙️ THE SEXY HERO (Compact & Powerful) */}
      <section className="relative w-full h-[65vh] flex flex-col items-center justify-center">
        <div className="absolute inset-0 z-0">
          <img src="https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=1600" className="w-full h-full object-cover brightness-[0.4]" alt="Hero" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#FDFDFD]"></div>
        </div>
        
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="relative z-20 text-center px-6 -mt-10">
          <h1 className="text-7xl md:text-[10rem] font-black text-white tracking-tighter uppercase italic leading-[0.8] drop-shadow-2xl">Luxe<span className="text-blue-600">Lair.</span></h1>
          <p className="text-white/50 text-[9px] font-black uppercase tracking-[0.6em] mt-8">Redefining Urban Living</p>
        </motion.div>

        {/* 🔍 SEARCH BAR (Bottom Floating) */}
        <div className="absolute bottom-6 z-30 w-full max-w-2xl px-6">
          <div className="bg-white/10 backdrop-blur-2xl p-1.5 rounded-full shadow-2xl flex items-center border border-white/20">
            <div className="bg-white p-4 rounded-full shadow-lg"><Search className="text-blue-600" size={18} /></div>
            <input 
              type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="SATELLITE, BOPAL, VASTRAPUR..." 
              className="flex-1 bg-transparent p-4 outline-none text-[10px] font-black uppercase text-white placeholder:text-white/40"
            />
          </div>

          <AnimatePresence>
            {suggestions.length > 0 && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="absolute w-[calc(100%-3rem)] bg-white bottom-full mb-4 rounded-[2rem] shadow-2xl border border-slate-100 overflow-hidden z-[100]">
                {suggestions.map((p) => (
                  <button key={p.id} onClick={() => handleSelect(p)} className="w-full p-5 hover:bg-slate-50 flex items-center justify-between border-b border-slate-50 last:border-0 transition-all">
                    <div className="flex items-center gap-4 text-left">
                       <MapPin size={14} className="text-blue-600" />
                       <p className="text-[10px] font-black text-slate-900 uppercase italic">{p.title}</p>
                    </div>
                    <ArrowRight size={14} className="text-slate-300"/>
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* 💎 GRID (2 Columns Mobile Fix) */}
      <section className="max-w-[1500px] mx-auto py-12 px-4 md:px-10">
        <div className="flex justify-between items-end mb-12 border-b border-slate-50 pb-6">
          <h2 className="text-4xl font-black text-slate-900 uppercase italic tracking-tighter">Featured <span className="text-blue-600">.</span></h2>
          <Link href="/explore" className="text-[9px] font-black uppercase text-slate-400 tracking-[0.2em] hover:text-blue-600 transition-all">Inventory →</Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-10">
          {listings.map((p) => (
            <div key={p.id} id={`property-${p.id}`} className={`transition-all duration-700 rounded-[2.5rem] ${highlightedId === p.id ? 'ring-[12px] ring-blue-500/10 scale-105 shadow-2xl' : ''}`}>
              <PropertyCard id={p.id} title={p.title} price={p.price} location={p.location} image={p.main_image} />
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}