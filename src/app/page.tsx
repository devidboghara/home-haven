"use client"; // Animations ke liye zaroori hai

import Navbar from "@/components/Navbar";
import PropertyCard from "@/components/PropertyCard";
import { motion } from "framer-motion";

export default function Home() {
  const listings = [
    { id: 1, title: "Modern Sky Villa", price: "85.5 L", location: "Satellite, Ahmedabad", rating: 4.8 },
    { id: 2, title: "Royal Heritage", price: "1.2 Cr", location: "SG Highway, Ahmedabad", rating: 4.9 },
    { id: 3, title: "Cozy Studio", price: "25.0 L", location: "Bopal, Ahmedabad", rating: 4.5 },
    { id: 4, title: "Green Valley", price: "60.0 L", location: "GIFT City, Gandhinagar", rating: 4.7 },
  ];

  return (
    <main className="min-h-screen bg-white overflow-x-hidden">
      <Navbar />

      {/* HERO SECTION - Ab Clean hai, bina Search Bar ke */}
      <section className="relative h-[60vh] flex flex-col items-center justify-center">
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center bg-fixed" // bg-fixed se Parallax effect aayega
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2000&auto=format&fit=crop')" }}
        />
        <div className="absolute inset-0 z-10 bg-black/40" />

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="relative z-20 text-center px-6"
        >
          <p className="mb-4 text-blue-300 text-xs font-bold tracking-[0.4em] uppercase">
             Luxury is in each detail
          </p>
          <h2 className="text-5xl md:text-8xl font-black text-white leading-tight">
            Luxe<span className="text-blue-500">Lair</span>
          </h2>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.9 }}
            transition={{ delay: 0.5, duration: 1 }}
            className="mt-4 text-sm md:text-xl text-slate-100 italic"
          >
            "The magic of a home is that it feels like the world is standing still."
          </motion.p>
        </motion.div>
      </section>

      {/* SEARCH SECTION - Ab ye Hero ke niche float kar raha hai */}
      <div className="relative z-30 -mt-10 px-6 max-w-4xl mx-auto">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="flex items-center p-2 bg-white shadow-[0_20px_50px_rgba(8,_112,_184,_0.1)] rounded-3xl border border-slate-100"
        >
          <input 
            type="text" 
            placeholder="Search by location, price or BHK..." 
            className="flex-1 px-6 py-4 rounded-2xl bg-transparent text-slate-900 focus:outline-none font-medium"
          />
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-2xl font-bold transition-all shadow-lg shadow-blue-200 active:scale-95">
            Find Home
          </button>
        </motion.div>
      </div>

      {/* LISTINGS SECTION - Scroll Animations ke saath */}
      <section className="px-4 py-16 max-w-7xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="flex justify-between items-end mb-12 px-2"
        >
          <div>
            <h3 className="text-3xl font-black text-slate-900">Featured Listings</h3>
            <div className="h-1.5 w-16 bg-blue-600 mt-2 rounded-full" />
          </div>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-10">
          {listings.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }} // Ek ke baad ek card aayega
            >
              <PropertyCard {...item} />
            </motion.div>
          ))}
        </div>
      </section>
    </main>
  );
}