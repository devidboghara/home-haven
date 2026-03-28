"use client";

import { useParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import { MapPin, Bed, Bath, Move, Calendar, Share, Heart, CheckCircle2, Send, ChevronLeft, ChevronRight, X, Car, Layers } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

// MEGA DATA OBJECT (Har property ki apni 5 images aur labels)
const propertiesData: any = {
  "1": {
    title: "Modern Sky Villa", price: "85.5 L", location: "Satellite, Ahmedabad",
    images: [
      { url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c", label: "Exterior View" },
      { url: "https://images.unsplash.com/photo-1600121848594-d8644e57abab", label: "Luxury Living Room" },
      { url: "https://images.unsplash.com/photo-1556912177-c54030639a45", label: "Modern Kitchen" },
      { url: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a", label: "Master Bathroom" },
      { url: "https://images.unsplash.com/photo-1513694203232-719a280e022f", label: "Cozy Bedroom" }
    ],
    specs: [
      { label: "Beds", val: "4", icon: <Bed size={18}/> },
      { label: "Baths", val: "3", icon: <Bath size={18}/> },
      { url: "Area", val: "2400 sqft", icon: <Move size={18}/> },
      { label: "Floors", val: "2", icon: <Layers size={18}/> },
      { label: "Parking", val: "Yes", icon: <Car size={18}/> },
      { label: "Built", val: "2024", icon: <Calendar size={18}/> }
    ],
    desc: "A masterpiece of modern architecture in Satellite."
  },
  "2": {
    title: "Royal Heritage", price: "1.2 Cr", location: "SG Highway, Ahmedabad",
    images: [
      { url: "https://images.unsplash.com/photo-1613490493576-7fde63acd811", label: "Grand Entrance" },
      { url: "https://images.unsplash.com/photo-1512918766775-d2427672f3b4", label: "Royal Suite" },
      { url: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f", label: "Gourmet Kitchen" },
      { url: "https://images.unsplash.com/photo-1620626011761-9963d7b59675", label: "Guest Bathroom" },
      { url: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688", label: "Backyard Pool" }
    ],
    specs: [
      { label: "Beds", val: "5", icon: <Bed size={18}/> },
      { label: "Baths", val: "5", icon: <Bath size={18}/> },
      { label: "Area", val: "4500 sqft", icon: <Move size={18}/> },
      { label: "Floors", val: "3", icon: <Layers size={18}/> },
      { label: "Parking", val: "2 Cars", icon: <Car size={18}/> },
      { label: "Built", val: "2023", icon: <Calendar size={18}/> }
    ],
    desc: "Tradition meets luxury in this expansive SG Highway estate."
  }
};

export default function PropertyDetail() {
  const { id } = useParams();
  const data = propertiesData[id as string] || propertiesData["1"];
  
  const [currentImg, setCurrentImg] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);

  const nextImg = () => setCurrentImg((prev) => (prev + 1) % data.images.length);
  const prevImg = () => setCurrentImg((prev) => (prev - 1 + data.images.length) % data.images.length);

  return (
    <main className="min-h-screen bg-[#F8FAFC] pb-20 relative">
      <Navbar />

      {/* LEFT TOP FLOATING ACTIONS */}
      <div className="fixed top-24 left-6 z-[100] flex flex-col gap-3">
         <button className="p-4 bg-white/80 backdrop-blur-md rounded-2xl shadow-xl border border-white hover:bg-white transition-all text-[#0051A1]"><Share size={20}/></button>
         <button className="p-4 bg-white/80 backdrop-blur-md rounded-2xl shadow-xl border border-white hover:bg-white transition-all text-red-500"><Heart size={20}/></button>
      </div>

      <div className="max-w-7xl mx-auto px-6 pt-32">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12 pl-2 md:pl-20">
          <div>
            <h1 className="text-4xl md:text-7xl font-black text-slate-900 tracking-tighter uppercase leading-none">{data.title}</h1>
            <div className="flex items-center gap-2 mt-4 text-slate-500 font-bold"><MapPin size={18} className="text-[#0051A1]"/> {data.location}</div>
          </div>
          <span className="text-[#0051A1] text-5xl md:text-7xl font-black tracking-tighter italic">₹{data.price}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-10">
            
            {/* CAROUSEL WITH DYNAMIC LABELS */}
            <div className="relative aspect-video rounded-[2rem] overflow-hidden shadow-2xl group border-4 border-white">
              <motion.div 
                key={currentImg}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                drag="x" dragConstraints={{ left: 0, right: 0 }}
                onDragEnd={(_, info) => info.offset.x > 50 ? prevImg() : info.offset.x < -50 ? nextImg() : null}
                className="w-full h-full"
                onClick={() => setIsZoomed(true)}
              >
                <img src={data.images[currentImg].url} className="w-full h-full object-cover pointer-events-none" />
                
                {/* BOUNCING LABEL BOX */}
                <motion.div 
                  key={`label-${currentImg}`}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 200 }}
                  className="absolute bottom-10 right-10 px-6 py-3 bg-white/90 backdrop-blur-md rounded-2xl border border-white shadow-xl"
                >
                  <p className="text-[10px] font-black uppercase tracking-widest text-[#0051A1]">{data.images[currentImg].label}</p>
                </motion.div>
              </motion.div>

              <button onClick={prevImg} className="absolute left-6 top-1/2 p-3 bg-white/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"><ChevronLeft text-white/></button>
              <button onClick={nextImg} className="absolute right-6 top-1/2 p-3 bg-white/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"><ChevronRight text-white/></button>
            </div>

            {/* 6 SPECS GRID (2 Rows of 3) */}
            <div className="grid grid-cols-3 gap-4">
              {data.specs.map((s: any, i: number) => (
                <motion.div 
                  key={i} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                  className="bg-white p-5 rounded-3xl border border-slate-100 text-center shadow-sm"
                >
                  <div className="text-[#0051A1] flex justify-center mb-2">{s.icon}</div>
                  <p className="text-[8px] font-black text-slate-400 uppercase tracking-tighter">{s.label}</p>
                  <p className="font-black text-slate-900 text-xs">{s.val}</p>
                </motion.div>
              ))}
            </div>

            <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-slate-100">
               <h3 className="text-xl font-black text-slate-900 mb-6 uppercase italic">Description</h3>
               <p className="text-slate-600 font-medium leading-relaxed">{data.desc}</p>
            </div>
          </div>

          {/* SIDEBAR FORM WITH VALIDATION */}
          <div className="lg:col-span-1">
             <form className="sticky top-28 bg-slate-900 p-8 rounded-[2.5rem] shadow-2xl text-white">
                <h3 className="text-2xl font-black mb-1 italic">Inquire Now</h3>
                <p className="text-slate-500 text-[10px] font-bold uppercase mb-8">Premium Agent Connect</p>
                <div className="space-y-4">
                   <input required type="text" placeholder="Full Name" className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl outline-none font-bold text-sm focus:border-blue-500" />
                   <input required type="email" placeholder="Email (@required)" className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl outline-none font-bold text-sm focus:border-blue-500" />
                   <textarea required placeholder="Message" className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl outline-none font-bold text-sm resize-none" rows={3}></textarea>
                   <button type="submit" className="w-full py-5 bg-[#0051A1] text-white rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl flex items-center justify-center gap-3 active:scale-95">
                     Send Message <Send size={16}/>
                   </button>
                </div>
             </form>
          </div>
        </div>
      </div>

      {/* Zoom Mode Lightbox */}
      <AnimatePresence>
        {isZoomed && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[200] bg-black/95 flex items-center justify-center p-4">
            <button onClick={() => setIsZoomed(false)} className="absolute top-10 right-10 text-white"><X size={40} /></button>
            <img src={data.images[currentImg].url} className="max-w-full max-h-full rounded-lg shadow-2xl cursor-zoom-out" onClick={() => setIsZoomed(false)} />
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}