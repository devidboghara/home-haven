"use client";

import { useParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import { MapPin, Bed, Bath, Move, Calendar, Share, Heart, CheckCircle2, Send, ChevronLeft, ChevronRight, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

// Mock Database (Har ID ke liye alag data)
const propertiesData: any = {
  "1": {
    title: "Modern Sky Villa", price: "85.5 L", location: "Satellite, Ahmedabad",
    images: [
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c",
      "https://images.unsplash.com/photo-1600566753190-17f0bb2a6c3e",
      "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0",
      "https://images.unsplash.com/photo-1600573472591-ee6b68d14c68",
      "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde"
    ],
    specs: { beds: 4, baths: 3, sqft: "2400", year: "2024" },
    desc: "Experience sky-high luxury with panoramic city views and a private terrace garden."
  },
  "2": {
    title: "Royal Heritage", price: "1.2 Cr", location: "SG Highway, Ahmedabad",
    images: [
      "https://images.unsplash.com/photo-1613490493576-7fde63acd811",
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750",
      "https://images.unsplash.com/photo-1613977257363-707ba9348227",
      "https://images.unsplash.com/photo-1613545325278-f24b0cae1224",
      "https://images.unsplash.com/photo-1560184897-ae75f418493e"
    ],
    specs: { beds: 5, baths: 5, sqft: "4500", year: "2023" },
    desc: "A palatial estate designed with traditional aesthetics and modern amenities."
  }
};

export default function PropertyDetail() {
  const { id } = useParams();
  const data = propertiesData[id as string] || propertiesData["1"]; // Default to 1 if not found
  
  const [currentImg, setCurrentImg] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);

  const nextImg = () => setCurrentImg((prev) => (prev + 1) % data.images.length);
  const prevImg = () => setCurrentImg((prev) => (prev - 1 + data.images.length) % data.images.length);

  return (
    <main className="min-h-screen bg-[#F8FAFC] pb-20">
      <Navbar />

      {/* Lightbox / Zoom Mode */}
      <AnimatePresence>
        {isZoomed && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-black/95 flex items-center justify-center p-4 md:p-20"
          >
            <button onClick={() => setIsZoomed(false)} className="absolute top-10 right-10 text-white hover:rotate-90 transition-transform">
              <X size={40} />
            </button>
            <motion.img 
              initial={{ scale: 0.8 }} animate={{ scale: 1 }}
              src={data.images[currentImg]} 
              className="max-w-full max-h-full rounded-lg shadow-2xl cursor-zoom-out"
              onClick={() => setIsZoomed(false)}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto px-6 pt-32">
        {/* Header Info */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-10">
          <div>
            <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter uppercase">{data.title}</h1>
            <div className="flex items-center gap-2 mt-2 text-slate-500 font-bold italic"><MapPin size={16}/> {data.location}</div>
          </div>
          <div className="text-right">
            <span className="text-[#0051A1] text-5xl font-black tracking-tighter italic block">₹{data.price}</span>
            <div className="flex gap-2 mt-4 justify-end">
               <button className="flex items-center gap-2 px-5 py-2 bg-white border border-slate-200 rounded-full text-[10px] font-black uppercase tracking-widest">Share <Share size={14}/></button>
               <button className="flex items-center gap-2 px-5 py-2 bg-white border border-slate-200 rounded-full text-[10px] font-black uppercase tracking-widest text-red-500">Like <Heart size={14}/></button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-10">
            
            {/* IMAGE CAROUSEL WITH SWIPE LOGIC */}
            <div className="relative aspect-video rounded-3xl overflow-hidden shadow-2xl group border-4 border-white">
              <motion.div 
                key={currentImg}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                onDragEnd={(e, info) => {
                  if (info.offset.x > 50) prevImg();
                  else if (info.offset.x < -50) nextImg();
                }}
                className="w-full h-full cursor-zoom-in"
                onClick={() => setIsZoomed(true)}
              >
                <img src={data.images[currentImg]} className="w-full h-full object-cover pointer-events-none" />
              </motion.div>

              {/* Navigation Arrows */}
              <button onClick={prevImg} className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white/20 backdrop-blur-md text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-20">
                <ChevronLeft size={24}/>
              </button>
              <button onClick={nextImg} className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white/20 backdrop-blur-md text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-20">
                <ChevronRight size={24}/>
              </button>

              {/* Indicator dots */}
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-20">
                {data.images.map((_: any, i: number) => (
                  <div key={i} className={`h-1.5 transition-all rounded-full ${i === currentImg ? 'w-8 bg-white' : 'w-2 bg-white/40'}`} />
                ))}
              </div>
            </div>

            {/* QUICK SPECS */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white p-6 rounded-2xl border border-slate-100 text-center shadow-sm">
                <Bed className="mx-auto mb-2 text-[#0051A1]" />
                <p className="text-[10px] font-black text-slate-400 uppercase">Beds</p>
                <p className="font-black text-slate-900">{data.specs.beds}</p>
              </div>
              {/* ... Other specs similarly ... */}
            </div>

            {/* DESC */}
            <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-slate-100">
               <h3 className="text-xl font-black text-slate-900 mb-6 uppercase tracking-tight italic">The Concept</h3>
               <p className="text-slate-600 font-medium text-lg leading-relaxed">{data.desc}</p>
            </div>
          </div>

          {/* SIDEBAR FORM */}
          <div className="lg:col-span-1">
             <div className="sticky top-28 bg-slate-900 p-8 rounded-[2.5rem] shadow-2xl text-white">
                <h3 className="text-2xl font-black mb-1 uppercase tracking-tighter italic">Get Exclusive Access</h3>
                <p className="text-slate-400 text-[10px] font-bold uppercase mb-8">Direct inquiry to LuxeLair Premium</p>
                <div className="space-y-4">
                   <input type="text" placeholder="Your Name" className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl outline-none font-bold text-sm" />
                   <textarea placeholder="Message" className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl outline-none font-bold text-sm resize-none" rows={3}></textarea>
                   <button className="w-full py-5 bg-[#0051A1] text-white rounded-2xl font-black uppercase text-[11px] tracking-widest shadow-xl flex items-center justify-center gap-3">
                     Send Inquiry <Send size={16}/>
                   </button>
                </div>
             </div>
          </div>
        </div>
      </div>
    </main>
  );
}