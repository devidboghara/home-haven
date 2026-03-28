"use client";

import Navbar from "@/components/Navbar";
import PropertyCard from "@/components/PropertyCard";
import { motion } from "framer-motion";
import { Building2, Palmtree, Warehouse, Search, LayoutGrid } from "lucide-react";

export default function Home() {
  const categories = [
    { name: "All", icon: <LayoutGrid size={18} /> },
    { name: "Villas", icon: <Palmtree size={18} /> },
    { name: "Apartments", icon: <Building2 size={18} /> },
    { name: "Offices", icon: <Warehouse size={18} /> },
  ];

  const listings = [
    { id: 1, title: "Modern Sky Villa", price: "85.5 L", location: "Satellite, Ahmedabad", rating: 4.8, image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=800&auto=format&fit=crop" },
    { id: 2, title: "Royal Heritage", price: "1.2 Cr", location: "SG Highway, Ahmedabad", rating: 4.9, image: "https://images.unsplash.com/photo-1600607687940-297c0e5a6a68?q=80&w=800&auto=format&fit=crop" },
    { id: 3, title: "Cozy Studio", price: "25.0 L", location: "Bopal, Ahmedabad", rating: 4.5, image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=800&auto=format&fit=crop" },
    { id: 4, title: "Green Valley", price: "60.0 L", location: "GIFT City, Gandhinagar", rating: 4.7, image: "https://images.unsplash.com/photo-1605276374104-ddd2ba1af56e?q=80&w=800&auto=format&fit=crop" },
    { id: 5, title: "Sunset Penthouse", price: "2.5 Cr", location: "Prahladnagar, Ahmedabad", rating: 4.9, image: "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?q=80&w=800&auto=format&fit=crop" },
    { id: 6, title: "Urban Loft", price: "40.0 L", location: "Navrangpura, Ahmedabad", rating: 4.6, image: "https://images.unsplash.com/photo-1560184897-ae75f418493e?q=80&w=800&auto=format&fit=crop" },
  ];

  return (
<main className="relative min-h-screen bg-[#0f172a] overflow-x-hidden">      <Navbar />

      {/* 1. HERO SECTION (Remains Perfect) */}
      <section className="relative z-30 -mt-10 bg-[#0f172a] rounded-none">
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2000&auto=format&fit=crop')" }}
        />
        <div className="flex items-center gap-2 p-1.5 bg-slate-800/50 backdrop-blur-2xl shadow-2xl rounded-full border border-slate-700">
        </div>
        <div className="relative z-20 w-full max-w-5xl mx-auto px-6 text-center">
          <motion.span 
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-blue-400 text-[10px] md:text-xs font-black tracking-[0.5em] uppercase mb-4 block"
          >
            Find your perfect place to live
          </motion.span>
          <motion.h2 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-6xl md:text-9xl font-black text-white leading-none tracking-tighter"
          >
            Luxe<span className="text-blue-500 italic">Lair.</span>
          </motion.h2>
          <p className="mt-5 text-sm md:text-xl text-slate-100 italic max-w-xl mx-auto opacity-80">
             "The magic of a home is that it feels like the world is standing still."
          </p>
        </div>
      </section>

      {/* 2. SEARCH & CONTENT SECTION (Dark Theme) */}
      <section className="relative z-30 -mt-10 bg-[#020617] rounded-none">
        
        {/* SLIM SEARCH BAR */}
        <div className="px-4 -translate-y-1/2 max-w-xl mx-auto">
          <div className="flex items-center gap-2 p-1.5 bg-slate-900/80 backdrop-blur-2xl shadow-2xl rounded-full border border-slate-800">
            <div className="pl-5 text-slate-500"><Search size={16} /></div>
            <input type="text" placeholder="Locality, Project..." className="flex-1 bg-transparent py-3 text-xs font-bold text-white outline-none placeholder:text-slate-600" />
            <button className="bg-blue-600 text-white px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg active:scale-95">Search</button>
          </div>
        </div>

        {/* CATEGORIES (Space Filler) */}
        <div className="max-w-7xl mx-auto px-6 mb-4">
          <div className="flex justify-center gap-3 overflow-x-auto no-scrollbar py-4 border-b border-slate-900">
            {categories.map((cat, i) => (
              <button key={i} className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-[9px] font-black uppercase tracking-widest transition-all ${i === 0 ? 'bg-blue-600 text-white' : 'bg-slate-900 text-slate-400 border border-slate-800 hover:border-blue-600'}`}>
                {cat.icon} {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* FEATURED LISTINGS */}
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-2">
            <div>
              <h3 className="text-3xl font-black text-white tracking-tighter">Featured Listings</h3>
              <p className="text-blue-500 text-[10px] font-bold uppercase tracking-[0.3em]">Top properties in Gujarat</p>
            </div>
            <button className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-800 pb-1 hover:text-blue-500 transition-colors">
              View All
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-10">
            {listings.map((item, index) => (
              <motion.div
                key={item.id}
                // First two cards (index 0 and 1) will fade in immediately
                initial={index < 2 ? { opacity: 0 } : { opacity: 0, y: 40 }}
                animate={index < 2 ? { opacity: 1 } : {}}
                whileInView={index >= 2 ? { opacity: 1, y: 0 } : {}}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ 
                  delay: index < 2 ? 0.2 : (index * 0.1), 
                  duration: 0.5 
                }}
              >
                {/* Yahan aapka PropertyCard component dark mode support karna chahiye */}
                <PropertyCard {...item} />
              </motion.div>
            ))}
          </div>
        </div>

        {/* DARK CTA SECTION */}
        <div className="px-6 py-24 text-center bg-slate-950 border-t border-slate-900 mt-20">
           <span className="text-[10px] font-black text-blue-500 uppercase tracking-[0.5em]">Exclusive Service</span>
           <h4 className="text-3xl md:text-5xl font-black text-white leading-tight mt-6">Ready to find <br className="hidden md:block"/> your dream home?</h4>
           <button className="mt-10 bg-blue-600 text-white px-10 py-4 rounded-full font-black uppercase text-[10px] tracking-[0.3em] shadow-2xl shadow-blue-900/20 hover:bg-blue-700 transition-all active:scale-95">
             Contact Luxury Expert
           </button>
        </div>
      </section>
    </main>
  );
}