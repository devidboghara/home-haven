"use client";

import Navbar from "@/components/Navbar";
import PropertyCard from "@/components/PropertyCard";
import { supabase } from "@/lib/supabase";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Search, LayoutGrid, Palmtree, Building2, Warehouse } from "lucide-react";

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

  const categories = [
    { name: "All", icon: <LayoutGrid size={18} /> },
    { name: "Villas", icon: <Palmtree size={18} /> },
    { name: "Apartments", icon: <Building2 size={18} /> },
    { name: "Offices", icon: <Warehouse size={18} /> },
  ];

  return (
    <main className="relative min-h-screen bg-[#F8FAFC]">
      <Navbar />

      {/* HERO SECTION */}
      <section className="relative w-full py-24 md:py-44 flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0 bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1564013799919-ab600027ffc6?q=80&w=2000')" }} />
        <div className="absolute inset-0 bg-blue-900/40 z-10" />
        <div className="relative z-20 text-center text-white px-6">
          <h2 className="text-6xl md:text-9xl font-black tracking-tighter">Luxe<span className="text-blue-400 italic">Lair.</span></h2>
          <p className="mt-4 text-blue-100 font-bold uppercase tracking-[0.5em] text-[10px]">Find your perfect place to live</p>
        </div>
      </section>

      {/* SEARCH & LISTINGS */}
      <section className="relative z-30 -mt-8 bg-white/50 backdrop-blur-md pb-20">
        <div className="max-w-2xl mx-auto px-4 -translate-y-1/2">
          <div className="flex bg-white shadow-2xl rounded-full p-1.5 border border-slate-100">
            <div className="flex-1 flex items-center px-5 gap-3">
              <Search size={18} className="text-slate-400" />
              <input type="text" placeholder="Search Gujarat's finest..." className="w-full bg-transparent outline-none text-xs font-bold" />
            </div>
            <button className="bg-[#0051A1] text-white px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-widest">Search</button>
          </div>
        </div>

        {/* PROPERTIES GRID */}
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {loading ? (
              <div className="col-span-full text-center py-20 font-black text-[#0051A1] animate-pulse">FETCHING FROM DATABASE...</div>
            ) : (
              listings.map((item) => (
                <PropertyCard 
                  key={item.id} 
                  id={item.id}
                  title={item.title} 
                  price={item.price} 
                  location={item.location} 
                  image={item.main_image} // Database column name
                  rating="4.9" 
                />
              ))
            )}
          </div>
        </div>
      </section>
    </main>
  );
}