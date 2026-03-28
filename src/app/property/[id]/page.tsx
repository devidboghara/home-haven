"use client";

import { useParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import { supabase } from "@/lib/supabase"; // Database connection import kiya
import { 
  MapPin, Bed, Bath, Move, Calendar, Share, Heart, Send, 
  ChevronLeft, ChevronRight, X, Car, Layers 
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

export default function PropertyDetail() {
  const { id } = useParams();
  const [data, setData] = useState<any>(null); // Real data yahan save hoga
  const [loading, setLoading] = useState(true);
  const [currentImg, setCurrentImg] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);

  // 📡 DATABASE SE DATA KHINCHNA (FETCHING)
  useEffect(() => {
    async function fetchProperty() {
      const { data: property, error } = await supabase
        .from('properties') // Table ka naam jo tumne SQL mein banaya
        .select('*')
        .eq('id', id) // URL wali ID match karo
        .single();

      if (error) {
        console.error("Error fetching property:", error);
      } else {
        setData(property);
      }
      setLoading(false);
    }
    fetchProperty();
  }, [id]);

  if (loading) return <div className="h-screen flex items-center justify-center font-black text-[#0051A1] animate-pulse">LUXELAIR LOADING...</div>;
  if (!data) return <div className="h-screen flex items-center justify-center">Property Not Found!</div>;

  const nextImg = () => setCurrentImg((prev) => (prev + 1) % data.additional_images.length);
  const prevImg = () => setCurrentImg((prev) => (prev - 1 + data.additional_images.length) % data.additional_images.length);

  // Specs Array for Grid (Mapping database columns)
  const specsGrid = [
    { label: "Beds", val: data.beds, icon: <Bed size={18}/> },
    { label: "Baths", val: data.baths, icon: <Bath size={18}/> },
    { label: "Area", val: data.sqft, icon: <Move size={18}/> },
    { label: "Floors", val: data.floors, icon: <Layers size={18}/> },
    { label: "Parking", val: data.parking, icon: <Car size={18}/> },
    { label: "Built", val: data.built_year, icon: <Calendar size={18}/> }
  ];

  return (
    <main className="min-h-screen bg-[#F8FAFC] pb-20 relative">
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 pt-32">
        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
          <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }}>
            <h1 className="text-4xl md:text-7xl font-black text-slate-900 tracking-tighter uppercase leading-none">{data.title}</h1>
            <div className="flex items-center gap-2 mt-4 text-slate-500 font-bold italic"><MapPin size={18} className="text-[#0051A1]"/> {data.location}</div>
          </motion.div>
          
          <div className="flex items-center gap-6">
            <span className="text-[#0051A1] text-5xl md:text-7xl font-black tracking-tighter italic">₹{data.price}</span>
            <div className="flex flex-col gap-2">
               <button className="p-3 bg-white border border-slate-200 rounded-xl shadow-sm hover:text-red-500 transition-all"><Heart size={20} /></button>
               <button className="p-3 bg-white border border-slate-200 rounded-xl shadow-sm hover:text-[#0051A1] transition-all"><Share size={20} /></button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-10">
            {/* CAROUSEL */}
            <div className="relative aspect-video rounded-[2rem] overflow-hidden shadow-2xl group border-4 border-white">
              <motion.img 
                key={currentImg} 
                src={data.additional_images[currentImg]} 
                className="w-full h-full object-cover cursor-zoom-in" 
                onClick={() => setIsZoomed(true)}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              />
              <button onClick={prevImg} className="absolute left-6 top-1/2 p-2 bg-white/20 rounded-full text-white"><ChevronLeft/></button>
              <button onClick={nextImg} className="absolute right-6 top-1/2 p-2 bg-white/20 rounded-full text-white"><ChevronRight/></button>
            </div>

            {/* 6 SPECS GRID */}
            <div className="grid grid-cols-3 gap-4">
              {specsGrid.map((s, i) => (
                <div key={i} className="bg-white p-5 rounded-3xl border border-slate-100 text-center shadow-sm">
                  <div className="text-[#0051A1] flex justify-center mb-2">{s.icon}</div>
                  <p className="text-[8px] font-black text-slate-400 uppercase tracking-tighter">{s.label}</p>
                  <p className="font-black text-slate-900 text-xs">{s.val}</p>
                </div>
              ))}
            </div>

            {/* DESC */}
            <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-slate-100">
               <h3 className="text-xl font-black text-slate-900 mb-6 uppercase italic">The Concept</h3>
               <p className="text-slate-600 font-medium leading-relaxed">{data.description}</p>
            </div>
          </div>

          {/* FORM */}
          <div className="lg:col-span-1">
             <form className="sticky top-28 bg-slate-900 p-8 rounded-[2.5rem] shadow-2xl text-white">
                <h3 className="text-2xl font-black mb-1 italic uppercase">Inquire Now</h3>
                <div className="space-y-4 mt-8">
                   <input required type="text" placeholder="Full Name" className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl outline-none font-bold text-sm" />
                   <input required type="email" placeholder="Email" className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl outline-none font-bold text-sm" />
                   <textarea required placeholder="Message" className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl outline-none font-bold text-sm resize-none" rows={3}></textarea>
                   <button type="submit" className="w-full py-5 bg-[#0051A1] text-white rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl flex items-center justify-center gap-3">
                     Send Message <Send size={16}/>
                   </button>
                </div>
             </form>
          </div>
        </div>
      </div>

      {/* ZOOM LIGHTBOX */}
      <AnimatePresence>
        {isZoomed && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[200] bg-black/95 flex items-center justify-center p-4">
            <button onClick={() => setIsZoomed(false)} className="absolute top-10 right-10 text-white"><X size={40} /></button>
            <img src={data.additional_images[currentImg]} className="max-w-full max-h-full rounded-lg shadow-2xl" onClick={() => setIsZoomed(false)} />
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}