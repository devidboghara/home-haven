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

      {/* HERO SECTION - Chhota kiya (h-[50vh]) taaki properties upar dikhen */}
      <section className="relative w-full h-[50vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0 bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2000')" }} />
        <div className="absolute inset-0 bg-slate-900/50 z-10" />
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative z-20 text-center text-white px-6"
        >
          <h2 className="text-5xl md:text-8xl font-black tracking-tighter uppercase italic leading-none">
            Luxe<span className="text-blue-400">Lair.</span>
          </h2>
          <p className="mt-2 text-blue-100 font-bold uppercase tracking-[0.4em] text-[8px] md:text-[10px]">
            Ahmedabad's Most Exclusive Addresses
          </p>
        </motion.div>
      </section>

      {/* SEARCH BAR - Floating higher */}
      <section className="relative z-30 -mt-8 pb-10 px-4 md:px-6">
        <div className="max-w-xl mx-auto mb-12">
          <div className="flex bg-white shadow-2xl rounded-full p-1.5 border border-slate-100">
            <div className="flex-1 flex items-center px-4 gap-2">
              <Search size={16} className="text-slate-400" />
              <input type="text" placeholder="Search Satellite, Bopal..." className="w-full bg-transparent outline-none text-[10px] font-bold" />
            </div>
            <button className="bg-[#0051A1] text-white px-6 py-3 rounded-full text-[9px] font-black uppercase tracking-widest">Search</button>
          </div>
        </div>

        {/* FEATURED SECTION HEADER */}
        <div className="max-w-7xl mx-auto mb-6">
          <div className="flex items-center justify-between items-end">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Sparkles className="text-blue-600" size={14} />
                <span className="text-[#0051A1] font-black text-[9px] uppercase tracking-[0.3em]">Top Picks</span>
              </div>
              <h3 className="text-2xl md:text-4xl font-black text-slate-900 tracking-tighter uppercase italic">Featured Homes</h3>
            </div>
            <button className="text-[9px] font-black text-blue-600 uppercase border-b-2 border-blue-600 pb-1">View All</button>
          </div>
        </div>

        {/* LISTINGS GRID - Fixed: 1 Row contains 2 Properties */}
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6">
            {loading ? (
              <div className="col-span-full py-10 text-center font-black text-slate-300 italic tracking-widest text-xs">
                LOADING ARCHITECTURE...
              </div>
            ) : (
              listings.map((item, i) => (
                <motion.div 
                  key={item.id} 
                  initial={{ opacity: 0, y: 20 }} 
                  whileInView={{ opacity: 1, y: 0 }} 
                  transition={{ delay: i * 0.05 }}
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
      </section>
    </main>
  );
}