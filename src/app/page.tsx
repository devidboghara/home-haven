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
      // Step 1: Limit 8 Properties only for Home Page
      const { data } = await supabase.from('properties').select('*').limit(8);
      if (data) setListings(data);
      setLoading(false);
    }
    getFeaturedProperties();
  }, []);

  // 🔍 SEARCH LOGIC (Maintains old important code)
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
      // 🚀 Auto-Scroll & Highlight Logic
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
      
      {/* 🏙️ THE "RICHY-RICH" HERO SECTION */}
      <section className="relative w-full h-[65vh] flex flex-col items-center justify-center overflow-hidden">
        {/* White Villa & Blue Pool High-Res Image */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1600&q=80" 
            className="w-full h-full object-cover scale-105" 
            alt="Luxury White Villa with Pool" 
          />
          {/* Subtle Overlay for Readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-[#FBFCFE]"></div>
        </div>
        
        <motion.div 
          initial={{ opacity: 0, y: 40 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 1, ease: "easeOut" }}
          className="relative z-20 text-center px-6 -mt-8"
        >
          <div className="flex items-center justify-center gap-2 mb-4">
             <div className="h-[1px] w-8 bg-blue-400"></div>
             <p className="text-white/80 text-[10px] font-black uppercase tracking-[0.6em]">Est. 2026</p>
             <div className="h-[1px] w-8 bg-blue-400"></div>
          </div>
          <h1 className="text-7xl md:text-[11rem] font-black text-white tracking-tighter uppercase italic leading-[0.75] drop-shadow-[0_20px_50px_rgba(0,0,0,0.3)]">
            Luxe<span className="text-blue-500 underline decoration-blue-500/30">Lair.</span>
          </h1>
        </motion.div>

        {/* 🔍 FLOATING SEARCH BAR (Bottom of Hero) */}
        <div className="absolute bottom-12 z-30 w-full max-w-2xl px-6">
          <div className="bg-white/10 backdrop-blur-3xl p-1.5 rounded-[2.5rem] shadow-2xl flex items-center border border-white/20 hover:border-white/40 transition-all duration-500">
            <div className="bg-white p-4 rounded-full shadow-xl">
              <Search className="text-blue-600" size={18} />
            </div>
            <input 
              type="text" 
              value={searchTerm} 
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="SATELLITE, BOPAL, VASTRAPUR..." 
              className="flex-1 bg-transparent p-4 outline-none text-[11px] font-black uppercase text-white placeholder:text-white/50 tracking-widest"
            />
          </div>

          {/* AUTO-SUGGESTION DROP-DOWN */}
          <AnimatePresence>
            {suggestions.length > 0 && (
              <motion.div 
                initial={{ opacity: 0, y: 15 }} 
                animate={{ opacity: 1, y: 0 }} 
                exit={{ opacity: 0, y: 15 }} 
                className="absolute w-[calc(100%-3rem)] bg-white/95 backdrop-blur-xl mt-4 rounded-[2.5rem] shadow-[0_30px_60px_-12px_rgba(0,0,0,0.25)] border border-slate-100 overflow-hidden z-[100]"
              >
                {suggestions.map((p) => (
                  <button key={p.id} onClick={() => handleSelect(p)} className="w-full p-6 hover:bg-blue-50/50 flex items-center justify-between border-b border-slate-50 last:border-0 transition-all">
                    <div className="flex items-center gap-4 text-left">
                       <div className="w-10 h-10 rounded-xl bg-slate-100 overflow-hidden">
                          <img src={p.main_image} className="w-full h-full object-cover" />
                       </div>
                       <div>
                         <p className="text-[10px] font-black text-slate-900 uppercase italic">{p.title}</p>
                         <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1"><MapPin size={8}/> {p.location}</p>
                       </div>
                    </div>
                    <ArrowRight size={16} className="text-blue-500 opacity-0 group-hover:opacity-100 transition-all" />
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* 💎 FEATURED PROPERTIES (2 Columns strictly for Mobile) */}
      <section className="max-w-[1700px] mx-auto py-16 px-4 md:px-12">
        <div className="flex justify-between items-end mb-14">
          <div>
            <div className="flex items-center gap-2 mb-1">
               <Sparkles size={12} className="text-blue-500" />
               <p className="text-[9px] font-black text-blue-500 uppercase tracking-[0.4em]">Curated Selection</p>
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 uppercase italic tracking-tighter">Featured <span className="text-slate-200">Inventory</span></h2>
          </div>
          <Link href="/explore" className="text-[9px] font-black uppercase text-slate-400 tracking-[0.2em] border-b border-slate-200 pb-1 hover:text-blue-600 hover:border-blue-600 transition-all">Explore All →</Link>
        </div>

        {/* Responsive Grid Fix: 2 on Mobile, 5 on Ultra-Wide */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-10">
          {listings.map((p) => (
            <div 
              key={p.id} 
              id={`property-${p.id}`} 
              className={`transition-all duration-700 rounded-[2.8rem] ${highlightedId === p.id ? 'ring-[15px] ring-blue-500/10 scale-105 shadow-2xl z-50' : 'hover:translate-y-[-10px]'}`}
            >
              <PropertyCard id={p.id} title={p.title} price={p.price} location={p.location} image={p.main_image} />
            </div>
          ))}
        </div>
      </section>

      {/* 💬 FLOATING VIP CONCIERGE BUTTON */}
      <Link href="/profile" className="fixed bottom-12 right-12 z-[100] bg-white p-6 rounded-full shadow-[0_20px_50px_rgba(0,0,0,0.15)] hover:scale-110 transition-all border border-slate-50 group">
        <MessageCircle size={28} className="text-blue-600" />
        <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white animate-pulse"></span>
      </Link>
    </main>
  );
}