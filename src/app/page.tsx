"use client";

import Navbar from "@/components/Navbar";
import PropertyCard from "@/components/PropertyCard";
import { supabase } from "@/lib/supabase";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState, useRef } from "react";
import { Search, Sparkles, ArrowRight, MessageCircle, MapPin } from "lucide-react";
import Link from "next/link";

export default function Home() {
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [highlightedId, setHighlightedId] = useState<string | null>(null);

  useEffect(() => {
    async function getProperties() {
      const { data } = await supabase.from('properties').select('*');
      if (data) setListings(data);
      setLoading(false);
    }
    getProperties();
  }, []);

  // 🔍 AUTO-SUGGESTION LOGIC
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
      // 🚀 SCROLL LOGIC
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      setHighlightedId(property.id);
      // 3 second baad highlight hata do
      setTimeout(() => setHighlightedId(null), 3000);
    } else {
      // Redirect if not on this page (Advanced)
      window.location.href = `/explore?search=${property.title}`;
    }
  };

  return (
    <main className="relative min-h-screen bg-[#F8FAFC]">
      <Navbar />
      
      {/* HERO & SEARCH */}
      <section className="relative w-full h-[70vh] flex flex-col items-center justify-center pt-20">
        <div className="absolute inset-0 z-0">
          <img src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1600" className="w-full h-full object-cover brightness-[0.4]" alt="Hero" />
        </div>
        
        <div className="relative z-20 text-center mb-10">
          <h2 className="text-6xl md:text-8xl font-black text-white tracking-tighter uppercase italic italic italic">Luxe<span className="text-blue-500">Lair.</span></h2>
        </div>

        {/* SEARCH BOX WITH DROP-DOWN */}
        <div className="relative z-30 w-full max-w-2xl px-6">
          <div className="bg-white p-2 rounded-[2rem] shadow-2xl flex items-center border border-slate-100">
            <Search className="ml-4 text-slate-400" size={20} />
            <input 
              type="text" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search Name or Area (Satellite, Bopal...)" 
              className="flex-1 p-4 outline-none text-[11px] font-black uppercase text-slate-900 placeholder:text-slate-300"
            />
          </div>

          {/* SUGGESTIONS LIST */}
          <AnimatePresence>
            {suggestions.length > 0 && (
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="absolute w-[calc(100%-3rem)] bg-white mt-2 rounded-3xl shadow-2xl border border-slate-100 overflow-hidden z-[100]">
                {suggestions.map((p) => (
                  <button key={p.id} onClick={() => handleSelect(p)} className="w-full p-4 hover:bg-slate-50 flex items-center justify-between border-b border-slate-50 last:border-0 transition-all">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-slate-100 rounded-xl overflow-hidden"><img src={p.main_image} className="w-full h-full object-cover" /></div>
                      <div className="text-left">
                        <p className="text-[10px] font-black text-slate-900 uppercase tracking-tight">{p.title}</p>
                        <p className="text-[8px] font-bold text-slate-400 uppercase flex items-center gap-1"><MapPin size={8}/> {p.location}</p>
                      </div>
                    </div>
                    <span className="text-[8px] font-black text-blue-600 bg-blue-50 px-2 py-1 rounded-md uppercase tracking-widest">
                      {document.getElementById(`property-${p.id}`) ? "On Page" : "Explore →"}
                    </span>
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* PROPERTIES GRID */}
      <section className="max-w-[1600px] mx-auto py-20 px-6">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {listings.map((p) => (
            <div key={p.id} id={`property-${p.id}`} className={`transition-all duration-500 rounded-[2rem] ${highlightedId === p.id ? 'ring-4 ring-blue-500 ring-offset-8 scale-105 shadow-2xl' : ''}`}>
              <PropertyCard id={p.id} title={p.title} price={p.price} location={p.location} image={p.main_image} />
            </div>
          ))}
        </div>
      </section>

      {/* FLOATING BUTTON (Transparent Fix) */}
      <Link href="/profile" className="fixed bottom-10 right-10 z-[100] bg-white/10 backdrop-blur-xl p-5 rounded-full border border-white/40 shadow-2xl hover:scale-110 transition-all">
        <MessageCircle size={24} className="text-blue-600" />
      </Link>
    </main>
  );
}