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
      const { data } = await supabase.from('properties').select('*').limit(10); // 2 rows of 5
      if (data) setListings(data);
      setLoading(false);
    }
    getProperties();
  }, []);

  return (
    <main className="relative min-h-screen bg-[#F8FAFC]">
      <Navbar />

      {/* 🏔️ FULL HERO SECTION (Laptop: 85vh, Mobile: 60vh) */}
      <section className="relative w-full h-[60vh] md:h-[85vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1600&q=80" 
            className="w-full h-full object-cover scale-105 brightness-[0.6]" 
            alt="Hero Background" 
          />
        </div>
        
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-20 text-center px-6"
        >
          <h2 className="text-6xl md:text-[10rem] font-black text-white tracking-tighter uppercase italic leading-[0.8] drop-shadow-2xl">
            Luxe<span className="text-blue-500">Lair.</span>
          </h2>
          <p className="mt-6 text-white/80 font-bold uppercase tracking-[0.5em] text-[10px] md:text-xs">
            Ahmedabad's Elite Collection
          </p>
          
          {/* Floating Search Bar inside Hero for Laptop */}
          <div className="hidden md:flex mt-12 bg-white/10 backdrop-blur-xl p-2 rounded-full border border-white/20 w-full max-w-2xl mx-auto shadow-2xl">
             <div className="flex-1 flex items-center px-6 gap-3">
                <Search size={20} className="text-white" />
                <input type="text" placeholder="Explore Penthouses, Villas..." className="bg-transparent border-none outline-none text-white font-bold placeholder:text-white/50 w-full" />
             </div>
             <Link href="/explore">
               <button className="bg-blue-600 text-white px-10 py-4 rounded-full font-black uppercase text-[10px] tracking-widest hover:bg-white hover:text-blue-600 transition-all">Search</button>
             </Link>
          </div>
        </motion.div>
      </section>

      {/* 🏗️ PROPERTIES GRID (5 Columns for Laptop) */}
      <section className="py-24 px-6 max-w-[1600px] mx-auto">
        <div className="flex justify-between items-end mb-16 px-4">
          <div>
            <div className="flex items-center gap-2 mb-2 text-blue-600">
               <Sparkles size={16}/> <span className="font-black uppercase tracking-widest text-[10px]">Curated Selection</span>
            </div>
            <h3 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter uppercase italic">The Collection</h3>
          </div>
          <Link href="/explore" className="group flex items-center gap-3 text-[10px] font-black uppercase text-slate-900 border-b-4 border-blue-600 pb-2 hover:text-blue-600 transition-all">
            Explore All 18 Listings <ArrowRight size={16}/>
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 md:gap-8">
          {loading ? (
             <div className="col-span-full text-center py-20 font-black text-slate-200 text-4xl italic uppercase animate-pulse">LuxeLair Loading...</div>
          ) : (
            listings.map((item, i) => (
              <motion.div 
                key={item.id} 
                initial={{ opacity: 0, scale: 0.95 }} 
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
              >
                <PropertyCard id={item.id} title={item.title} price={item.price} location={item.location} image={item.main_image} />
              </motion.div>
            ))
          )}
        </div>
      </section>
    </main>
  );
}