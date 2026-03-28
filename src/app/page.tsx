"use client";

import Navbar from "@/components/Navbar";
import PropertyCard from "@/components/PropertyCard";
import { motion } from "framer-motion";
import { Search, SlidersHorizontal, Home as HomeIcon, Building2, Palmtree, Warehouse } from "lucide-react";

export default function Home() {
  const categories = [
    { name: "All", icon: <HomeIcon size={18} /> },
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
    <main className="min-h-screen bg-[#FDFDFD] overflow-x-hidden">
      {/* Navbar will be inside Navbar.tsx, make sure it has 'sticky top-0 z-50' */}
      <Navbar />

      {/* HERO SECTION - Refined Height & Smooth Image */}
      <section className="relative h-[65vh] flex items-center justify-center overflow-hidden">
        <motion.div 
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5 }}
          className="absolute inset-0 z-0 bg-cover bg-center"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2000&auto=format&fit=crop')" }}
        />
        <div className="absolute inset-0 z-10 bg-black/30" />

        <div className="relative z-20 text-center px-6 -mt-10">
          <motion.p 
             initial={{ opacity: 0, y: -20 }}
             animate={{ opacity: 1, y: 0 }}
             className="text-blue-400 text-[10px] md:text-xs font-black tracking-[0.5em] uppercase mb-4"
          >
            Luxury Real Estate
          </motion.p>
          <motion.h2 
  initial={{ opacity: 0, filter: "blur(10px)" }}
  animate={{ opacity: 1, filter: "blur(0px)" }}
  transition={{ duration: 0.8 }}
  className="text-5xl md:text-8xl font-black text-white leading-tight drop-shadow-lg"
>
  Luxe<span className="text-blue-500">Lair.</span>
</motion.h2>
        </div>
      </section>

      {/* SEXY SLIM SEARCH BAR - Overlapping Hero */}
      <div className="relative z-40 -mt-8 px-4 max-w-3xl mx-auto">
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="flex items-center gap-2 p-1.5 bg-white/90 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] rounded-full border border-white/50"
        >
          <div className="pl-5 text-slate-400">
            <Search size={18} />
          </div>
          <input 
            type="text" 
            placeholder="Search location..." 
            className="flex-1 bg-transparent py-3 md:py-4 px-2 outline-none text-sm font-semibold text-slate-800 placeholder:text-slate-400"
          />
          <button className="hidden md:flex items-center gap-2 px-4 text-slate-500 hover:text-blue-600 border-l border-slate-200 ml-2">
            <SlidersHorizontal size={16} />
            <span className="text-xs font-bold">Filters</span>
          </button>
          <button className="bg-blue-600 hover:bg-blue-700 text-white p-3 md:px-8 md:py-4 rounded-full transition-all active:scale-95 shadow-lg shadow-blue-200">
            <span className="hidden md:inline font-bold text-xs uppercase tracking-widest">Search</span>
            <Search size={18} className="md:hidden" />
          </button>
        </motion.div>
      </div>

      {/* CATEGORIES SECTION */}
      <section className="pt-16 pb-8 px-6 max-w-7xl mx-auto overflow-x-auto no-scrollbar">
        <div className="flex justify-center gap-4 md:gap-8 min-w-max mx-auto">
          {categories.map((cat, i) => (
            <motion.button
              key={i}
              whileHover={{ y: -5 }}
              className={`flex items-center gap-2 px-6 py-3 rounded-2xl text-xs font-bold transition-all ${
                i === 0 ? "bg-blue-600 text-white shadow-lg shadow-blue-100" : "bg-white text-slate-500 border border-slate-100 hover:border-blue-200"
              }`}
            >
              {cat.icon}
              {cat.name}
            </motion.button>
          ))}
        </div>
      </section>

      {/* FEATURED LISTINGS */}
      <section className="px-6 py-12 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12">
          <div>
            <h3 className="text-3xl font-black text-slate-900 tracking-tight">Handpicked Collection</h3>
            <p className="text-slate-500 text-sm mt-2 font-medium">Discover the most exclusive properties in Ahmedabad</p>
          </div>
          <button className="mt-4 md:mt-0 text-xs font-black text-blue-600 uppercase tracking-widest border-b-2 border-blue-600 pb-1">
            Explore All
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6 md:gap-10">
          {listings.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <PropertyCard {...item} />
            </motion.div>
          ))}
        </div>
      </section>

      {/* NEW SECTION: WHY CHOOSE US */}
      <section className="mt-12 mb-24 px-6 py-20 bg-blue-600 rounded-[3rem] max-w-[95%] mx-auto text-center text-white relative overflow-hidden">
          <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -ml-20 -mt-20" />
          <h4 className="relative z-10 text-2xl md:text-4xl font-black">Ready to find your dream home?</h4>
          <p className="relative z-10 mt-4 text-blue-100 text-sm md:text-lg opacity-80 max-w-xl mx-auto">
            Join 10,000+ families who found their haven with LuxeLair.
          </p>
          <button className="relative z-10 mt-10 bg-white text-blue-600 px-10 py-4 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-blue-50 transition-all">
            Contact An Agent
          </button>
      </section>
    </main>
  );
}