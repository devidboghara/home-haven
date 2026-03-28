"use client";

import Navbar from "@/components/Navbar";
import { MapPin, Bed, Bath, Move, Calendar, Share2, Heart, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

export default function PropertyDetail() {
  // Dummy Data (Baad mein ye ID ke hisab se fetch hoga)
  const property = {
    title: "Modern Sky Villa with Private Pool",
    price: "85.5 L",
    location: "Satellite, Ahmedabad, Gujarat",
    description: "A stunning modern villa featuring 4 spacious bedrooms, a private infinity pool, and a panoramic view of the city skyline. Designed for those who seek luxury and comfort in the heart of Ahmedabad.",
    specs: { beds: 4, baths: 3, sqft: "2400", year: "2024" },
    features: ["Private Pool", "Smart Home", "Modular Kitchen", "Gym Access", "24/7 Security"],
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2000"
  };

  return (
    <main className="min-h-screen bg-[#F8FAFC]">
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 py-24">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-8">
          <div>
            <h1 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tighter uppercase">{property.title}</h1>
            <div className="flex items-center gap-2 mt-2 text-slate-500">
              <MapPin size={18} className="text-[#0051A1]" />
              <span className="font-medium text-sm md:text-lg">{property.location}</span>
            </div>
          </div>
          <div className="flex flex-col items-end">
             <span className="text-[#0051A1] text-4xl font-black tracking-tighter italic">₹{property.price}</span>
             <div className="flex gap-3 mt-4">
               <button className="p-3 bg-white border border-slate-200 rounded-2xl hover:bg-slate-50 shadow-sm"><Share2 size={18} /></button>
               <button className="p-3 bg-white border border-slate-200 rounded-2xl hover:bg-slate-50 shadow-sm text-red-500"><Heart size={18} /></button>
             </div>
          </div>
        </div>

        {/* Hero Gallery Overlay Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left: Main Content */}
          <div className="lg:col-span-2 space-y-8">
            <div className="relative aspect-video rounded-[2.5rem] overflow-hidden shadow-2xl">
              <img src={property.image} className="w-full h-full object-cover" alt="Main View" />
            </div>

            {/* Quick Specs Bar */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100">
              <div className="flex items-center gap-3 border-r border-slate-100">
                <div className="p-3 bg-blue-50 text-[#0051A1] rounded-2xl"><Bed size={20}/></div>
                <div><p className="text-[10px] font-bold text-slate-400 uppercase">Beds</p><p className="font-black text-slate-900">{property.specs.beds}</p></div>
              </div>
              <div className="flex items-center gap-3 border-r border-slate-100">
                <div className="p-3 bg-blue-50 text-[#0051A1] rounded-2xl"><Bath size={20}/></div>
                <div><p className="text-[10px] font-bold text-slate-400 uppercase">Baths</p><p className="font-black text-slate-900">{property.specs.baths}</p></div>
              </div>
              <div className="flex items-center gap-3 border-r border-slate-100">
                <div className="p-3 bg-blue-50 text-[#0051A1] rounded-2xl"><Move size={20}/></div>
                <div><p className="text-[10px] font-bold text-slate-400 uppercase">Sq Ft</p><p className="font-black text-slate-900">{property.specs.sqft}</p></div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-3 bg-blue-50 text-[#0051A1] rounded-2xl"><Calendar size={20}/></div>
                <div><p className="text-[10px] font-bold text-slate-400 uppercase">Built</p><p className="font-black text-slate-900">{property.specs.year}</p></div>
              </div>
            </div>

            {/* Description */}
            <div className="bg-white p-8 rounded-[2rem] border border-slate-100">
              <h3 className="text-xl font-black text-slate-900 mb-4 uppercase tracking-tight">Property Description</h3>
              <p className="text-slate-600 leading-relaxed font-medium">{property.description}</p>
              
              <div className="mt-8 grid grid-cols-2 gap-4">
                {property.features.map((f, i) => (
                  <div key={i} className="flex items-center gap-2 text-slate-700 font-bold text-sm">
                    <CheckCircle2 size={16} className="text-[#0051A1]" /> {f}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Sidebar Form */}
          <div className="lg:col-span-1">
            <div className="sticky top-28 bg-[#0051A1] p-8 rounded-[2.5rem] shadow-2xl text-white">
              <h3 className="text-xl font-black mb-2 uppercase tracking-tight">Interested?</h3>
              <p className="text-blue-200 text-sm mb-6">Send a message to the agent.</p>
              
              <div className="space-y-4">
                <input type="text" placeholder="Your Name" className="w-full p-4 bg-white/10 rounded-2xl border border-white/20 outline-none placeholder:text-blue-200 font-bold text-sm" />
                <input type="email" placeholder="Your Email" className="w-full p-4 bg-white/10 rounded-2xl border border-white/20 outline-none placeholder:text-blue-200 font-bold text-sm" />
                <textarea placeholder="Message..." rows={4} className="w-full p-4 bg-white/10 rounded-2xl border border-white/20 outline-none placeholder:text-blue-200 font-bold text-sm"></textarea>
                <button className="w-full py-5 bg-white text-[#0051A1] rounded-2xl font-black uppercase tracking-[0.2em] text-xs hover:bg-blue-50 transition-all shadow-xl active:scale-95">
                  Send Inquiry
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}