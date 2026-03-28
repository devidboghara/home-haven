"use client";

import { useParams, useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import { supabase } from "@/lib/supabase";
import {
  MapPin, Bed, Bath, Move, Calendar, Share, Heart, Send,
  ChevronLeft, ChevronRight, X, Car, Layers, ArrowLeft
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

export default function PropertyDetail() {
  const { id } = useParams();
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [currentImg, setCurrentImg] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);

  useEffect(() => {
    async function fetchProperty() {
      const { data: property, error } = await supabase
        .from('properties')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error("Error fetching:", error);
      } else {
        setData(property);
      }
      setLoading(false);
    }
    fetchProperty();
  }, [id]);

  if (loading) return (
    <div className="h-screen flex items-center justify-center bg-white">
      <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity }} className="text-[#0051A1] font-black italic text-2xl tracking-tighter uppercase">
        LuxeLair...
      </motion.div>
    </div>
  );

  if (!data) return <div className="h-screen flex flex-col items-center justify-center gap-4">
    <h1 className="font-black text-2xl uppercase">Property Not Found</h1>
    <button onClick={() => router.push('/')} className="px-6 py-2 bg-slate-900 text-white rounded-full font-bold text-xs uppercase">Go Home</button>
  </div>;

  const nextImg = () => setCurrentImg((prev) => (prev + 1) % data.additional_images.length);
  const prevImg = () => setCurrentImg((prev) => (prev - 1 + data.additional_images.length) % data.additional_images.length);

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
        {/* BACK BUTTON */}
        <button onClick={() => router.back()} className="flex items-center gap-2 text-slate-400 hover:text-slate-900 transition-all font-black uppercase text-[10px] tracking-widest mb-8 group">
          <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> Back to Listings
        </button>
        
        {/* HEADER SECTION */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <h1 className="text-4xl md:text-7xl font-black text-slate-900 tracking-tighter uppercase leading-[0.9] mb-4">
              {data.title}
            </h1>
            <div className="flex items-center gap-2 text-slate-500 font-bold italic tracking-tight">
              <MapPin size={20} className="text-[#0051A1]" /> {data.location}
            </div>
          </motion.div>

          <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-end">
            <span className="text-[#0051A1] text-5xl md:text-8xl font-black tracking-tighter italic leading-none">
              ₹{data.price}
            </span>
            
            {/* RIGHT SIDE VERTICAL BUTTONS */}
            <div className="flex flex-col gap-2 min-w-[110px]">
               <button className="flex items-center justify-between px-4 py-2.5 bg-white border border-slate-200 rounded-xl shadow-sm text-[10px] font-black uppercase text-red-500 hover:bg-red-50 transition-all active:scale-95">
                 Like <Heart size={16} fill="currentColor" className="opacity-20" />
               </button>
               <button className="flex items-center justify-between px-4 py-2.5 bg-white border border-slate-200 rounded-xl shadow-sm text-[10px] font-black uppercase text-slate-600 hover:bg-slate-50 transition-all active:scale-95">
                 Share <Share size={16} />
               </button>
            </div>
          </div>
        </div>

        {/* CONTENT GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-10">
            
            {/* IMAGE CAROUSEL WITH SWIPE */}
            <div className="relative aspect-video rounded-[2.5rem] overflow-hidden shadow-2xl group border-4 border-white bg-slate-200">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentImg}
                  initial={{ opacity: 0, x: 100 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  drag="x"
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={1}
                  onDragEnd={(e, { offset, velocity }) => {
                    const swipe = offset.x;
                    if (swipe < -50) nextImg();
                    else if (swipe > 50) prevImg();
                  }}
                  className="w-full h-full cursor-grab active:cursor-grabbing"
                  onClick={() => setIsZoomed(true)}
                >
                  <img src={data.additional_images[currentImg]} className="w-full h-full object-cover pointer-events-none" alt="Property" />
                  
                  {/* BOUNCING LABEL */}
                  <motion.div 
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="absolute bottom-8 left-8 px-6 py-3 bg-white/90 backdrop-blur-md rounded-2xl border border-white shadow-xl"
                  >
                    <p className="text-[10px] font-black uppercase tracking-widest text-[#0051A1]">Luxury Preview {currentImg + 1}</p>
                  </motion.div>
                </motion.div>
              </AnimatePresence>

              {/* Desktop Arrows */}
              <button onClick={prevImg} className="absolute left-6 top-1/2 -translate-y-1/2 p-3 bg-white/20 backdrop-blur-md rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity z-10"><ChevronLeft size={24}/></button>
              <button onClick={nextImg} className="absolute right-6 top-1/2 -translate-y-1/2 p-3 bg-white/20 backdrop-blur-md rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity z-10"><ChevronRight size={24}/></button>
            </div>

            {/* 6 SPECS GRID - (2 Rows of 3) */}
            <div className="grid grid-cols-3 gap-4">
              {specsGrid.map((s, i) => (
                <motion.div 
                  key={i} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                  className="bg-white p-6 rounded-[2rem] border border-slate-100 text-center shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="text-[#0051A1] flex justify-center mb-3">{s.icon}</div>
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">{s.label}</p>
                  <p className="font-black text-slate-900 text-sm tracking-tight italic">{s.val || "N/A"}</p>
                </motion.div>
              ))}
            </div>

            {/* DESCRIPTION */}
            <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} className="bg-white p-10 rounded-[3rem] shadow-sm border border-slate-100">
               <h3 className="text-xl font-black text-slate-900 mb-6 uppercase italic tracking-tighter flex items-center gap-4">
                  Property Narrative <div className="h-[2px] w-12 bg-[#0051A1]"/>
               </h3>
               <p className="text-slate-600 font-medium leading-relaxed text-lg">{data.description}</p>
            </motion.div>
          </div>

          {/* SIDEBAR FORM */}
          <div className="lg:col-span-1">
             <motion.form 
               initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
               className="sticky top-28 bg-slate-900 p-8 rounded-[3rem] shadow-2xl text-white"
             >
                <h3 className="text-2xl font-black mb-1 italic uppercase tracking-tighter">Secure Inquiry</h3>
                <p className="text-slate-500 text-[10px] font-bold uppercase mb-8 tracking-widest">Connect with our Prime Agents</p>
                <div className="space-y-4">
                   <input required type="text" placeholder="Your Full Name" className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl outline-none font-bold text-sm focus:border-[#0051A1] transition-all" />
                   <input required type="email" placeholder="Email Address (@)" className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl outline-none font-bold text-sm focus:border-[#0051A1] transition-all" />
                   <textarea required placeholder="I am interested in this property..." className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl outline-none font-bold text-sm resize-none" rows={4}></textarea>
                   <button type="submit" className="w-full py-5 bg-[#0051A1] text-white rounded-2xl font-black uppercase text-[11px] tracking-[0.2em] shadow-xl flex items-center justify-center gap-3 hover:bg-blue-600 active:scale-95 transition-all">
                     Send Inquiry <Send size={16}/>
                   </button>
                </div>
             </motion.form>
          </div>
        </div>
      </div>

      {/* ZOOM LIGHTBOX */}
      <AnimatePresence>
        {isZoomed && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[200] bg-black/98 flex items-center justify-center p-4 cursor-zoom-out" onClick={() => setIsZoomed(false)}>
            <button className="absolute top-10 right-10 text-white hover:rotate-90 transition-all"><X size={40} /></button>
            <motion.img initial={{ scale: 0.9 }} animate={{ scale: 1 }} src={data.additional_images[currentImg]} className="max-w-full max-h-[90vh] rounded-xl shadow-2xl" />
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}