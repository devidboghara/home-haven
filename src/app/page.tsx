"use client";

import Navbar from "@/components/Navbar";
import PropertyCard from "@/components/PropertyCard";
import { supabase } from "@/lib/supabase";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Search, Sparkles } from "lucide-react";

export default function Home() {
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getProperties() {
      const { data, error } = await supabase.from('properties').select('*');
      if (!error) setListings(data);
      setLoading(false);
    }
    getProperties();
  }, []);

  return (
    <main className="relative min-h-screen bg-[#F8FAFC]">
      <Navbar />

      {/* HERO SECTION - Fixed Size (h-[70vh]) */}
      <section className="relative w-full h-[70vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0 bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2000')" }} />
        <div className="absolute inset-0 bg-slate-900/40 z-10" />
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-20 text-center text-white px-6"
        >
          <h2 className="text-6xl md:text-9xl font-black tracking-tighter uppercase italic">Luxe<span className="text-blue-400">Lair.</span></h2>
          <p className="mt-4 text-blue-100 font-bold uppercase tracking-[0.5em] text-[10px]">Premium Real Estate Ahmedabad</p>
        </motion.div>
      </section>

      {/* SEARCH BAR & FEATURED SECTION */}
      <section className="relative z-30 -mt-10 pb-20 px-6">
        <div className="max-w-2xl mx-auto mb-20">
          <div className="flex bg-white shadow-2xl rounded-full p-2 border border-slate-100">
            <div className="flex-1 flex items-center px-6 gap-3">
              <Search size={18} className="text-slate-400" />
              <input type="text" placeholder="Search by area (Satellite, Bopal...)" className="w-full bg-transparent outline-none text-xs font-bold" />
            </div>
            <button className="bg-[#0051A1] text-white px-10 py-4 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-blue-700 transition-all">Search</button>
          </div>
        </div>

        {/* FEATURED TAGLINE - Re-added */}
        <div className="max-w-7xl mx-auto mb-10">
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} className="flex items-center gap-3 mb-2">
            <Sparkles className="text-blue-600" size={20} />
            <span className="text-[#0051A1] font-black text-[10px] uppercase tracking-[0.4em]">Featured Collections</span>
          </motion.div>
          <h3 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tighter uppercase">Properties for you</h3>
        </div>

        {/* LISTINGS GRID */}
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {loading ? (
              <div className="col-span-full py-20 text-center font-black text-slate-300 italic tracking-widest">LOADING LUXURY...</div>
            ) : (
              listings.map((item, i) => (
                <motion.div key={item.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                  <PropertyCard 
                    id={item.id}
                    title={item.title} 
                    price={item.price} 
                    location={item.location} 
                    image={item.main_image}
                  />
                </motion.div>
              ))
            )}
          </div>
        </div>
      </section>
    </main>
  );
}