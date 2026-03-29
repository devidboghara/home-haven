"use client";

import Navbar from "@/components/Navbar";
import PropertyCard from "@/components/PropertyCard";
import { supabase } from "@/lib/supabase";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Search, Sparkles, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function Home() {
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getProperties() {
      // Step 1: Limit to 8 properties for Home Page
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .limit(8); 
      
      if (!error) setListings(data);
      setLoading(false);
    }
    getProperties();
  }, []);

  return (
    <main className="relative min-h-screen bg-[#F8FAFC]">
      <Navbar />

      {/* HERO SECTION - Compact Size */}
      <section className="relative w-full h-[50vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0 bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1600&q=80')" }} />
        <div className="absolute inset-0 bg-slate-900/50 z-10" />
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-20 text-center text-white px-6"
        >
          <h2 className="text-5xl md:text-8xl font-black tracking-tighter uppercase italic leading-none">Luxe<span className="text-blue-400">Lair.</span></h2>
          <p className="mt-2 text-blue-100 font-bold uppercase tracking-[0.4em] text-[8px] md:text-[10px]">Ahmedabad's Elite Collection</p>
        </motion.div>
      </section>

      {/* SEARCH & NAVIGATION SECTION */}
      <section className="relative z-30 -mt-8 pb-20 px-4 md:px-6">
        <div className="max-w-xl mx-auto mb-16">
          <div className="flex bg-white shadow-2xl rounded-full p-1.5 border border-slate-100 items-center">
            <div className="flex-1 flex items-center px-4 gap-2">
              <Search size={16} className="text-slate-400" />
              <input type="text" placeholder="Search Satellite, Bopal..." className="w-full bg-transparent outline-none text-[10px] font-bold" />
            </div>
            {/* EXPLORE BUTTON */}
            <Link href="/explore">
               <button className="bg-[#0051A1] text-white px-6 py-3 rounded-full text-[9px] font-black uppercase tracking-widest hover:bg-blue-700 transition-all shadow-lg active:scale-95">
                 Explore All
               </button>
            </Link>
          </div>
        </div>

        {/* SECTION HEADER */}
        <div className="max-w-7xl mx-auto mb-10 flex justify-between items-end">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="text-blue-600" size={14} />
              <span className="text-[#0051A1] font-black text-[9px] uppercase tracking-[0.3em]">Editor's Choice</span>
            </div>
            <h3 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tighter uppercase italic">Featured Estates</h3>
          </div>
          
          <Link href="/explore" className="group flex items-center gap-2 text-[10px] font-black uppercase text-blue-600 border-b-2 border-blue-600 pb-1 hover:text-blue-800 transition-colors">
            View All 18 Properties <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform"/>
          </Link>
        </div>

        {/* LISTINGS GRID */}
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {loading ? (
              <div className="col-span-full py-20 text-center font-black text-slate-300 italic tracking-widest uppercase">Fetching Luxury...</div>
            ) : (
              listings.map((item, i) => (
                <motion.div 
                  key={item.id} 
                  initial={{ opacity: 0, scale: 0.9, y: 30 }} 
                  whileInView={{ opacity: 1, scale: 1, y: 0 }}
                  // 🟢 FIX 1: Animates only once per session
                  viewport={{ once: true, margin: "-50px" }} 
                  // 🟢 FIX 2: Faster duration for snappy feel
                  transition={{ duration: 0.4, ease: "easeOut", delay: i * 0.05 }} 
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
            )}
          </div>
        </div>

        {/* BOTTOM CALL TO ACTION */}
        <div className="max-w-7xl mx-auto mt-20 text-center border-t border-slate-200 pt-20">
             <h4 className="text-slate-400 font-black uppercase text-[10px] tracking-[0.5em] mb-4">Didn't find what you're looking for?</h4>
             <Link href="/explore">
               <button className="bg-slate-900 text-white px-10 py-5 rounded-2xl font-black uppercase text-[11px] tracking-widest hover:bg-blue-600 transition-all shadow-2xl">
                 Open Full Catalog
               </button>
             </Link>
        </div>
      </section>
    </main>
  );
}