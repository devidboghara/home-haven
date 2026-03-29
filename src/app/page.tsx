"use client";

import Navbar from "@/components/Navbar";
import PropertyCard from "@/components/PropertyCard";
import { supabase } from "@/lib/supabase";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Search, Sparkles, ArrowRight, MessageCircle } from "lucide-react";
import Link from "next/link";

export default function Home() {
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getProperties() {
      const { data } = await supabase.from('properties').select('*').limit(10);
      if (data) setListings(data);
      setLoading(false);
    }
    getProperties();
  }, []);

  return (
    <main className="relative min-h-screen bg-[#F8FAFC]">
      <Navbar />

      {/* 🏔️ FULL HERO SECTION */}
      <section className="relative w-full h-[60vh] md:h-[80vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1600&q=80" 
            className="w-full h-full object-cover brightness-[0.5]" 
            alt="Hero Background" 
          />
        </div>
        
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="relative z-20 text-center px-6">
          <h2 className="text-6xl md:text-[10rem] font-black text-white tracking-tighter uppercase italic leading-[0.8] drop-shadow-2xl">
            Luxe<span className="text-blue-500">Lair.</span>
          </h2>
          <p className="mt-4 text-white/90 font-bold uppercase tracking-[0.5em] text-[10px] md:text-xs">
            Ahmedabad's Elite Collection
          </p>
        </motion.div>
      </section>

      {/* 🔍 SEARCH & ACTION BAR (Mobile + Laptop Integrated) */}
      <section className="relative z-30 -mt-10 px-4 md:px-6">
        <div className="max-w-4xl mx-auto mb-16">
          <div className="bg-white shadow-2xl rounded-[2.5rem] p-2 border border-slate-100 flex flex-col md:flex-row items-center gap-2">
            <div className="flex-1 flex items-center px-6 gap-3 w-full">
              <Search size={18} className="text-slate-400" />
              <input type="text" placeholder="Search Satellite, Bopal, Penthouses..." className="w-full bg-transparent outline-none text-[11px] font-black uppercase text-slate-900 placeholder:text-slate-300" />
            </div>
            
            <div className="flex gap-2 w-full md:w-auto">
              <Link href="/explore" className="flex-1">
                <button className="w-full bg-[#0051A1] text-white px-8 py-4 rounded-full text-[9px] font-black uppercase tracking-widest hover:bg-blue-700 transition-all">Explore All</button>
              </Link>
              <Link href="/profile" className="flex-1 md:flex-none">
                <button className="w-full bg-slate-900 text-white px-8 py-4 rounded-full text-[9px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all">Enquiry</button>
              </Link>
            </div>
          </div>
        </div>

        {/* 🏗️ PROPERTIES GRID (Fixed Spacing & 5 Columns) */}
        <div className="max-w-[1600px] mx-auto pb-20">
          <div className="flex justify-between items-end mb-10 px-4">
            <div>
              <div className="flex items-center gap-2 mb-1 text-blue-600">
                <Sparkles size={14}/> <span className="font-black uppercase tracking-[0.3em] text-[9px]">Featured Selection</span>
              </div>
              <h3 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tighter uppercase italic">The Collection</h3>
            </div>
            <Link href="/explore" className="hidden md:flex items-center gap-2 text-[10px] font-black uppercase text-blue-600 border-b-2 border-blue-600 pb-1">
              View All 18 Listings <ArrowRight size={14}/>
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
            {loading ? (
              <div className="col-span-full py-20 text-center font-black text-slate-300 italic tracking-widest">LOADING...</div>
            ) : (
              listings.map((item, i) => (
                <motion.div 
                  key={item.id} 
                  initial={{ opacity: 0, scale: 0.9, y: 20 }} 
                  whileInView={{ opacity: 1, scale: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: i * 0.05 }}
                >
                  <PropertyCard id={item.id} title={item.title} price={item.price} location={item.location} image={item.main_image} />
                </motion.div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* FLOATING CHAT */}
            <Link href="/profile" className="fixed bottom-10 right-10 z-50 bg-blue-600/40 backdrop-blur-md text-white p-5 rounded-full shadow-2xl hover:scale-110 hover:bg-blue-600/90 transition-all border border-white/20 group">
  <MessageCircle size={24} />
  {/* Tooltip text ko bhi thoda transparent black rakhte hain */}
  <div className="absolute right-full mr-4 top-1/2 -translate-y-1/2 bg-slate-900/80 backdrop-blur-md text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 whitespace-nowrap transition-all">
    Chat with Admin
  </div>
</Link>
        <MessageCircle size={24} />
    </main>
  );
}