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
      // Limit to 8 for Home Page as requested
      const { data } = await supabase.from('properties').select('*').limit(8);
      if (data) setListings(data);
      setLoading(false);
    }
    getFeaturedProperties();
  }, []);

  // 🔍 AUTO-SUGGESTION LOGIC (Search Name or Area)
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
      // Redirect to explore if not on home featured list
      window.location.href = `/explore?search=${property.title}`;
    }
  };

  return (
    <main className="relative min-h-screen bg-[#F8FAFC]">
      <Navbar />
      
      {/* 🏙️ HERO SECTION (Old Clean Look) */}
      <section className="relative w-full h-[75vh] flex flex-col items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1600" className="w-full h-full object-cover brightness-[0.45]" alt="Hero" />
        </div>
        
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="relative z-20 text-center px-6 mb-12">
          <h1 className="text-7xl md:text-[9rem] font-black text-white tracking-tighter uppercase italic leading-[0.85] drop-shadow-2xl">Luxe<span className="text-blue-500">Lair.</span></h1>
          <p className="text-white/60 text-[10px] font-black uppercase tracking-[0.5em] mt-6">Ahmedabad's Premier Real Estate</p>
        </motion.div>

        {/* 🔍 SEARCH BAR WITH AUTO-SUGGEST */}
        <div className="relative z-30 w-full max-w-2xl px-6">
          <div className="bg-white/95 backdrop-blur-md p-2 rounded-[2.5rem] shadow-2xl flex items-center border border-white/20">
            <Search className="ml-5 text-slate-400" size={22} />
            <input 
              type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search Area (Satellite, Bopal) or Property..." 
              className="flex-1 p-5 outline-none text-[11px] font-black uppercase text-slate-900 placeholder:text-slate-300"
            />
          </div>

          <AnimatePresence>
            {suggestions.length > 0 && (
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="absolute w-[calc(100%-3rem)] bg-white mt-3 rounded-[2rem] shadow-2xl border border-slate-100 overflow-hidden z-[100]">
                {suggestions.map((p) => (
                  <button key={p.id} onClick={() => handleSelect(p)} className="w-full p-5 hover:bg-slate-50 flex items-center justify-between border-b border-slate-50 last:border-0 transition-all">
                    <div className="flex items-center gap-4 text-left">
                       <MapPin size={14} className="text-blue-600" />
                       <div>
                         <p className="text-[10px] font-black text-slate-900 uppercase">{p.title}</p>
                         <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">{p.location}</p>
                       </div>
                    </div>
                    <span className="text-[8px] font-black text-blue-600 uppercase tracking-widest">View Property</span>
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* 💎 FEATURED PROPERTIES (Limit 8) */}
      <section className="max-w-[1500px] mx-auto py-24 px-6">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-4xl font-black text-slate-900 uppercase italic tracking-tighter">Featured Listings</h2>
            <div className="h-1 w-20 bg-blue-600 mt-2"></div>
          </div>
          <Link href="/explore" className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-blue-600 transition-all border-b-2 border-slate-100 pb-1">Explore All Inventory →</Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {listings.map((p) => (
            <div key={p.id} id={`property-${p.id}`} className={`transition-all duration-700 rounded-[2.5rem] ${highlightedId === p.id ? 'ring-[10px] ring-blue-500/20 scale-[1.03] shadow-2xl' : ''}`}>
              <PropertyCard id={p.id} title={p.title} price={p.price} location={p.location} image={p.main_image} />
            </div>
          ))}
        </div>
      </section>

      {/* 💬 FLOATING PROFILE BUTTON */}
      <Link href="/profile" className="fixed bottom-12 right-12 z-[100] bg-white p-6 rounded-full shadow-2xl hover:scale-110 transition-all border border-slate-100 group">
        <MessageCircle size={28} className="text-blue-600 group-hover:rotate-12 transition-transform" />
      </Link>
    </main>
  );
}