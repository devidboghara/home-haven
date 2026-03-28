"use client";

import Navbar from "@/components/Navbar";
import PropertyCard from "@/components/PropertyCard";
import { motion } from "framer-motion";
import { Search, Building2, Palmtree, Warehouse, LayoutGrid } from "lucide-react";

export default function Home() {
  const categories = [
    { name: "All", icon: <LayoutGrid size={18} /> },
    { name: "Villas", icon: <Palmtree size={18} /> },
    { name: "Apartments", icon: <Building2 size={18} /> },
    { name: "Offices", icon: <Warehouse size={18} /> },
  ];

  const listings = [
    { id: 1, title: "Modern Sky Villa", price: "85.5 L", location: "Satellite, Ahmedabad", rating: 4.8, image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c" },
    { id: 2, title: "Royal Heritage", price: "1.2 Cr", location: "SG Highway, Ahmedabad", rating: 4.9, image: "https://images.unsplash.com/photo-1600566753190-17f0bb2a6c3e" },
    { id: 3, title: "Cozy Studio", price: "25.0 L", location: "Bopal, Ahmedabad", rating: 4.5, image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750" },
    { id: 4, title: "Green Valley Resort", price: "60.0 L", location: "GIFT City, Gandhinagar", rating: 4.7, image: "https://images.unsplash.com/photo-1605276374104-ddd2ba1af56e" },
    { id: 5, title: "Lakeview Mansion", price: "3.5 Cr", location: "Kankaria, Ahmedabad", rating: 5.0, image: "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde" },
    { id: 6, title: "City Center Office", price: "45.0 L", location: "Navrangpura, Ahmedabad", rating: 4.6, image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab" },
  ];

  return (
    <main className="relative min-h-screen bg-[#F8FAFC] overflow-x-hidden">
      <Navbar />

      {/* 1. HERO SECTION - Back & Better */}
      <section className="relative w-full py-24 md:py-44 flex items-center justify-center">
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1564013799919-ab600027ffc6?q=80&w=2000&auto=format&fit=crop')" }}
        />
        <div className="absolute inset-0 bg-blue-900/40 z-10" />
        
        <div className="relative z-20 w-full max-w-5xl mx-auto px-6 text-center text-white">
          <motion.span initial={{y:10, opacity:0}} animate={{y:0, opacity:1}} className="text-blue-200 text-xs font-bold tracking-[0.4em] uppercase mb-4 block">
            Find your perfect place to live
          </motion.span>
          <motion.h2 initial={{scale:0.95}} animate={{scale:1}} className="text-5xl md:text-8xl font-black leading-none tracking-tighter">
            Luxe<span className="text-blue-400 italic">Lair.</span>
          </motion.h2>
          <p className="mt-6 text-sm md:text-xl font-medium opacity-90 max-w-xl mx-auto">
             "The magic of a home is that it feels like the world is standing still."
          </p>
        </div>
      </section>

      {/* 2. SEARCH BAR & CATEGORIES (Clean Off-White Style) */}
      <section className="relative z-30 -mt-8">
        <div className="px-4 max-w-2xl mx-auto">
          <div className="flex items-center gap-2 p-1.5 bg-white shadow-xl rounded-full border border-slate-100">
            <div className="pl-5 text-slate-400"><Search size={18} /></div>
            <input type="text" placeholder="Search locality, apartments..." className="flex-1 bg-transparent py-3 text-xs font-bold text-slate-800 outline-none" />
            <button className="bg-[#0051A1] text-white px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg active:scale-95 transition-all">Search</button>
          </div>
        </div>

        {/* Categories Bar */}
        <div className="flex justify-center gap-3 overflow-x-auto no-scrollbar py-8 max-w-7xl mx-auto px-6">
          {categories.map((cat, i) => (
            <button key={i} className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-[9px] font-black uppercase tracking-widest transition-all ${i === 0 ? 'bg-[#0051A1] text-white shadow-md' : 'bg-white text-slate-500 border border-slate-200 hover:border-[#0051A1]'}`}>
              {cat.icon} {cat.name}
            </button>
          ))}
        </div>

        {/* 3. FEATURED LISTINGS */}
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-end mb-10 border-b border-slate-200 pb-4">
            <div>
              <h3 className="text-3xl font-black text-slate-900 tracking-tighter">Latest Properties</h3>
              <p className="text-[#0051A1] text-[10px] font-bold uppercase tracking-[0.3em] mt-1">Gujarat's Most Exclusive Homes</p>
            </div>
            <button className="text-[10px] font-black text-[#0051A1] uppercase tracking-widest border-b-2 border-[#0051A1] pb-1">View All</button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-10">
            {listings.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <PropertyCard {...item} />
              </motion.div>
            ))}
          </div>
        </div>

        {/* CTA Footer */}
        <div className="mt-20 px-6 py-24 bg-white text-center border-t border-slate-100">
          <h4 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight leading-none">Ready to start your <br/> home journey?</h4>
          <button className="mt-10 bg-[#0051A1] text-white px-10 py-4 rounded-full font-black uppercase text-[10px] tracking-widest shadow-xl shadow-blue-100 hover:scale-105 transition-all">Contact Our Experts</button>
        </div>
      </section>
    </main>
  );
}