"use client";

import Navbar from "@/components/Navbar";
import PropertyCard from "@/components/PropertyCard";
import { motion } from "framer-motion";
import { Building2, Palmtree, Warehouse, Search } from "lucide-react";

export default function Home() {
  const categories = [
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
    <main className="relative min-h-screen bg-white overflow-x-hidden">
      <Navbar />

      {/* 1. HERO SECTION - Now Balanced (Not Full Screen) */}
      <section className="relative w-full py-24 md:py-32 flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center transition-transform duration-1000 hover:scale-105"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2000&auto=format&fit=crop')" }}
        />
        <div className="absolute inset-0 bg-black/50 z-10" />
        
        <div className="relative z-20 w-full max-w-5xl mx-auto px-6 text-center">
          {/* New Line - Higher */}
          <motion.span 
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-blue-300 text-[10px] md:text-xs font-black tracking-[0.5em] uppercase mb-4 block"
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
          <p className="mt-5 text-sm md:text-xl text-slate-100 italic max-w-xl mx-auto opacity-90">
             "The magic of a home is that it feels like the world is standing still."
          </p>
        </div>
      </section>

      {/* 2. SEARCH & LISTINGS SECTION - Overlapping with Square Corners */}
      <section className="relative z-30 -mt-10 bg-white shadow-[0_-20px_60px_rgba(0,0,0,0.15)] rounded-none">
        
        {/* SLIM SEARCH BAR - Perfectly Overlapping */}
        <div className="px-4 -translate-y-1/2 max-w-xl mx-auto">
          <div className="flex items-center gap-2 p-1.5 bg-white/90 backdrop-blur-xl shadow-2xl rounded-full border border-slate-100">
            <div className="pl-5 text-slate-400"><Search size={16} /></div>
            <input type="text" placeholder="Locality, Project..." className="flex-1 bg-transparent py-3 text-xs font-bold text-slate-800 outline-none" />
            <button className="bg-blue-600 text-white px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg active:scale-95">Search</button>
          </div>
        </div>

        {/* CATEGORIES */}
        <div className="flex justify-center gap-4 px-6 overflow-x-auto no-scrollbar py-6 border-b border-slate-100">
          {categories.map((cat, i) => (
            <button key={i} className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-100 rounded-2xl text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] hover:border-blue-600 transition-all">
              {cat.icon} {cat.name}
            </button>
          ))}
        </div>

        {/* FEATURED LISTINGS */}
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-4">
            <div>
              <h3 className="text-4xl font-black text-slate-900 tracking-tighter">Featured Listings</h3>
              <p className="text-slate-400 text-[10px] font-bold mt-2 uppercase tracking-[0.3em]">Ahmedabad's Finest Selection</p>
            </div>
            <button className="text-[10px] font-black text-blue-600 border-b-2 border-blue-600 pb-1 tracking-widest uppercase">
              View All
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-8 md:gap-12">
            {listings.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ delay: index * 0.1 }}
              >
                <PropertyCard {...item} />
              </motion.div>
            ))}
          </div>
        </div>

        {/* 4. Real Website Detail Section (CTA) */}
        <div className="px-6 py-32 text-center bg-slate-50 mt-12 border-t border-slate-100">
           <span className="text-xs font-black text-blue-600 uppercase tracking-[0.4em]">Get Started</span>
           <h4 className="text-3xl md:text-6xl font-black text-slate-900 leading-tight mt-6">Ready to find <br className="hidden md:block"/> your dream home?</h4>
           <p className="mt-6 text-slate-500 font-medium text-sm md:text-xl max-w-2xl mx-auto leading-relaxed">Join 10,000+ families who found their perfect haven with LuxeLair.</p>
           <button className="mt-12 bg-slate-900 text-white px-12 py-5 rounded-full font-black uppercase text-[10px] tracking-[0.3em] shadow-2xl shadow-slate-200 hover:bg-blue-600 transition-all active:scale-95">
             Talk to an Expert
           </button>
        </div>
      </section>
    </main>
  );
}