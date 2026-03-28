"use client";

import Navbar from "@/components/Navbar";
import PropertyCard from "@/components/PropertyCard";
import { motion, useScroll, useTransform } from "framer-motion"; // Import check karo
import { useRef } from "react";
import { Search, Building2, Palmtree, Warehouse } from "lucide-react"; // Icons check karo

export default function Home() {
  // Hooks humesha yahan hone chahiye (Inside the function)
  const { scrollYProgress } = useScroll();
  
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 1.1]);
  const opacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);

  const categories = [
    { name: "Villas", icon: <Palmtree size={18} /> },
    { name: "Apartments", icon: <Building2 size={18} /> },
    { name: "Offices", icon: <Warehouse size={18} /> },
  ];

  const listings = [
    { id: 1, title: "Modern Sky Villa", price: "85.5 L", location: "Satellite, Ahmedabad", rating: 4.8 },
    { id: 2, title: "Royal Heritage", price: "1.2 Cr", location: "SG Highway, Ahmedabad", rating: 4.9 },
    { id: 3, title: "Cozy Studio", price: "25.0 L", location: "Bopal, Ahmedabad", rating: 4.5 },
    { id: 4, title: "Green Valley", price: "60.0 L", location: "GIFT City, Gandhinagar", rating: 4.7 },
    { id: 5, title: "Sunset Penthouse", price: "2.5 Cr", location: "Prahladnagar, Ahmedabad", rating: 4.9 },
    { id: 6, title: "Urban Loft", price: "40.0 L", location: "Navrangpura, Ahmedabad", rating: 4.6 },
  ];

  return (
    <main className="relative min-h-screen bg-white overflow-x-hidden">
      <Navbar />

      {/* FIXED HERO SECTION */}
      <section className="fixed inset-0 h-screen z-0">
        <motion.div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ 
            backgroundImage: "url('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2000&auto=format&fit=crop')",
            scale: scale // Ye wala scale hook se aa raha hai
          }}
        />
        <div className="absolute inset-0 bg-black/40 z-10" />
        
        <motion.div 
          style={{ opacity }}
          className="relative z-20 h-full flex flex-col items-center justify-center text-center px-6"
        >
          <span className="text-blue-400 text-[10px] font-black tracking-[0.6em] uppercase mb-6">
            Find your perfect place to live
          </span>
          <h2 className="text-6xl md:text-9xl font-black text-white leading-none tracking-tighter">
            Luxe<span className="text-blue-500 italic">Lair.</span>
          </h2>
        </motion.div>
      </section>

      {/* SCROLLABLE CONTENT */}
      <section className="relative z-30 mt-[100vh] bg-[#FDFDFD] rounded-t-[3.5rem] shadow-[0_-50px_100px_rgba(0,0,0,0.3)]">
        
        {/* SEARCH BAR OVERLAP */}
        <div className="px-4 -translate-y-1/2 max-w-xl mx-auto">
          <div className="flex items-center gap-2 p-1.5 bg-white/90 backdrop-blur-3xl shadow-2xl rounded-full border border-white">
            <div className="pl-5 text-slate-400"><Search size={16} /></div>
            <input type="text" placeholder="Locality..." className="flex-1 bg-transparent py-3 text-xs font-bold text-slate-800 outline-none" />
            <button className="bg-blue-600 text-white px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-widest">Search</button>
          </div>
        </div>

        {/* CATEGORIES */}
        <div className="flex justify-center gap-4 px-6 overflow-x-auto no-scrollbar py-8">
          {categories.map((cat, i) => (
            <button key={i} className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-100 rounded-2xl text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] hover:border-blue-600 transition-all">
              {cat.icon} {cat.name}
            </button>
          ))}
        </div>

        {/* FEATURED LISTINGS */}
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8 md:gap-12">
            {listings.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <PropertyCard {...item} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}