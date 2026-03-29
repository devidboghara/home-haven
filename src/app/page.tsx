"use client";

import Navbar from "@/components/Navbar";
import PropertyCard from "@/components/PropertyCard";
import { supabase } from "@/lib/supabase";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Search, Sparkles, MessageCircle, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function Home() {
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getProperties() {
      const { data, error } = await supabase.from('properties').select('*').limit(8);
      if (!error) setListings(data);
      setLoading(false);
    }
    getProperties();
  }, []);

  return (
    <main className="relative min-h-screen bg-[#F8FAFC]">
      <Navbar />

      {/* HERO SECTION - Laptop (Split) vs Mobile (Centered) */}
      <section className="relative w-full min-h-[60vh] md:h-[85vh] flex items-center pt-20 px-6 overflow-hidden bg-slate-900">
        <div className="max-w-7xl mx-auto w-full grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          
          {/* LEFT SIDE: TYPOGRAPHY */}
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} className="z-20">
            <div className="inline-flex items-center gap-2 bg-blue-600/20 text-blue-400 px-4 py-2 rounded-full border border-blue-600/30 mb-6">
               <Sparkles size={14}/>
               <span className="text-[10px] font-black uppercase tracking-[0.3em]">Ahmedabad's #1 Luxury Portal</span>
            </div>
            <h2 className="text-6xl md:text-9xl font-black text-white tracking-tighter uppercase italic leading-[0.85] mb-8">
              Luxe<span className="text-blue-500">Lair.</span>
            </h2>
            <p className="text-slate-400 text-sm md:text-lg max-w-md font-medium leading-relaxed mb-10">
              Discover a curated selection of premium Penthouses, Flats, and Villas in Ahmedabad's most elite neighborhoods.
            </p>
            <div className="flex flex-wrap gap-4">
               <Link href="/explore" className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-black uppercase text-[11px] tracking-widest shadow-2xl hover:bg-blue-700 transition-all">Explore Properties</Link>
               <Link href="/profile" className="bg-white/5 backdrop-blur-md border border-white/10 text-white px-8 py-4 rounded-2xl font-black uppercase text-[11px] tracking-widest hover:bg-white/10 transition-all">Direct Inquiry</Link>
            </div>
          </motion.div>

          {/* RIGHT SIDE: PREMIUM CARD (Only for Laptop) */}
          <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="hidden md:block relative z-20">
             <div className="aspect-[4/5] rounded-[3rem] overflow-hidden border-8 border-white/5 shadow-2xl rotate-3">
                <img src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=80" className="w-full h-full object-cover" alt="Luxury Villa" />
                <div className="absolute bottom-10 left-10 bg-white/90 backdrop-blur-md p-6 rounded-3xl shadow-2xl -rotate-3">
                   <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-1">Starting From</p>
                   <p className="text-4xl font-black text-slate-900 italic tracking-tighter">₹85.5 L</p>
                </div>
             </div>
          </motion.div>
        </div>
        
        {/* Background Overlay Decor */}
        <div className="absolute top-0 right-0 w-1/3 h-full bg-blue-600/10 blur-[150px] pointer-events-none" />
      </section>

      {/* SEARCH BAR (Floating) */}
      <div className="max-w-2xl mx-auto -mt-10 px-6 relative z-50">
          <div className="bg-white p-2 rounded-[2rem] shadow-2xl border border-slate-100 flex items-center gap-4">
             <div className="flex-1 flex items-center px-4 gap-3 border-r border-slate-100">
                <Search size={18} className="text-slate-400" />
                <input type="text" placeholder="Search areas like Satellite, Bopal..." className="w-full bg-transparent outline-none text-xs font-black uppercase text-slate-900 placeholder:text-slate-300" />
             </div>
             <Link href="/explore">
               <button className="bg-blue-600 text-white px-8 py-4 rounded-[1.5rem] text-[10px] font-black uppercase tracking-widest">Find Home</button>
             </Link>
          </div>
      </div>

      {/* PROPERTIES GRID */}
      <section className="py-20 px-6 max-w-7xl mx-auto">
        <div className="flex justify-between items-end mb-12">
          <h3 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tighter uppercase italic">Featured Estates</h3>
          <Link href="/explore" className="text-[10px] font-black uppercase text-blue-600 border-b-2 border-blue-600 pb-1">All 18 listings <ArrowRight size={14} className="inline ml-1"/></Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
          {listings.map((item, i) => (
            <motion.div key={item.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.05 }}>
              <PropertyCard id={item.id} title={item.title} price={item.price} location={item.location} image={item.main_image} />
            </motion.div>
          ))}
        </div>
      </section>

      {/* CHAT TRIGGER (Floating) */}
      <Link href="/profile" className="fixed bottom-10 right-10 z-[100] bg-blue-600 text-white p-5 rounded-full shadow-2xl hover:scale-110 active:scale-95 transition-all group">
         <MessageCircle size={28} />
         <div className="absolute right-full mr-4 top-1/2 -translate-y-1/2 bg-slate-900 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 whitespace-nowrap transition-all">
            Chat with Admin
         </div>
      </Link>
    </main>
  );
}