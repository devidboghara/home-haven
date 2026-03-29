"use client";

import { useParams, useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import { supabase } from "@/lib/supabase";
import { MapPin, Bed, Bath, Move, Calendar, Share, Heart, Send, ChevronLeft, ChevronRight, X, Car, Layers, ArrowLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

export default function PropertyDetail() {
  const { id } = useParams();
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [currentImg, setCurrentImg] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [hasSwiped, setHasSwiped] = useState(false); // User ne swipe kiya ya nahi

  // Smart Labels Logic
  const imageLabels = ["Living Area", "Master Bedroom", "Modern Kitchen", "Luxury Bath", "Interior View", "Balcony"];

  useEffect(() => {
    async function fetchProperty() {
      const { data: p, error } = await supabase.from('properties').select('*').eq('id', id).single();
// Iske neeche kuch change nahi karna, fetch same rahega.
      if (!error) setData(p);
      setLoading(false);
    }
    fetchProperty();
  }, [id]);

  // 🔄 AUTO HINT ANIMATION (Peeking effect)
  useEffect(() => {
    if (loading || hasSwiped || currentImg !== 0) return;
    const interval = setInterval(() => {
      setHasSwiped(false); // Reset to trigger animation
    }, 1500);
    return () => clearInterval(interval);
  }, [loading, hasSwiped, currentImg]);

  if (loading) return <div className="h-screen flex items-center justify-center bg-white font-black italic text-[#0051A1]">LUXELAIR...</div>;
  if (!data) return <div className="h-screen flex items-center justify-center">Property Not Found</div>;

  const nextImg = () => { setCurrentImg((prev) => (prev + 1) % data.gallery.length); setHasSwiped(true); };
  const prevImg = () => { setCurrentImg((prev) => (prev - 1 + data.gallery.length) % data.gallery.length); setHasSwiped(true); };

  return (
    <main className="min-h-screen bg-[#F8FAFC] pb-20 pt-32 px-6">
      <Navbar />
      <div className="max-w-7xl mx-auto">
        
        {/* HEADER SECTION */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
             <button onClick={() => router.back()} className="flex items-center gap-2 text-slate-400 font-black uppercase text-[10px] tracking-[0.3em] mb-4">
               <ArrowLeft size={14}/> Back
             </button>
            <h1 className="text-4xl md:text-7xl font-black text-slate-900 tracking-tighter uppercase leading-[0.9]">{data.title}</h1>
            <div className="flex items-center gap-2 mt-4 text-slate-500 font-bold italic"><MapPin size={18} className="text-[#0051A1]"/> {data.location}</div>
          </motion.div>

          <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-end">
            <span className="text-[#0051A1] text-5xl md:text-8xl font-black tracking-tighter italic leading-none">₹{data.price}</span>
            <div className="flex flex-col gap-2 min-w-[120px]">
               <button className="flex items-center justify-between px-4 py-2 bg-white border border-slate-200 rounded-xl shadow-sm text-[10px] font-black uppercase text-red-500">Like <Heart size={14}/></button>
               <button className="flex items-center justify-between px-4 py-2 bg-white border border-slate-200 rounded-xl shadow-sm text-[10px] font-black uppercase text-slate-600">Share <Share size={14}/></button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-10">
            
            {/* 📸 IMAGE VIEWER WITH PEEKING HINT */}
            <div className="relative aspect-video rounded-[2.5rem] overflow-hidden shadow-2xl bg-slate-200 border-4 border-white group">
              <motion.div
                key={currentImg}
                // HINT ANIMATION: Agar user ne swipe nahi kiya, toh ye hilega
                animate={!hasSwiped && currentImg === 0 ? { x: [0, -40, 0] } : { x: 0 }}
                transition={{ duration: 1.2, repeat: !hasSwiped ? Infinity : 0, repeatDelay: 1.5 }}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                onDragEnd={(e, { offset }) => {
                  if (offset.x < -50) nextImg();
                  else if (offset.x > 50) prevImg();
                }}
                className="w-full h-full cursor-grab active:cursor-grabbing relative"
              >
                <img 
                  src={data.gallery[currentImg].url} 
                  className="w-full h-full object-cover pointer-events-none" 
                  alt="Property" 
                />

                {/* DYNAMIC LABEL (Hall, Kitchen, etc.) */}
                <div className="absolute bottom-6 left-6 px-5 py-2.5 bg-white/90 backdrop-blur-md rounded-2xl border border-white shadow-xl">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#0051A1]">
                    {data.gallery[currentImg].label || "Luxury Interior"}
                  </p>
                </div>
              </motion.div>

              {/* NEXT IMAGE PEEK (Right side se thoda dikhega) */}
              {!hasSwiped && currentImg === 0 && (
                <div className="absolute top-0 right-0 w-10 h-full bg-slate-300/20 backdrop-blur-[2px] pointer-events-none border-l border-white/20" />
              )}
            </div>

            {/* SPECS GRID */}
            <div className="grid grid-cols-3 gap-4">
              {[
                { l: "Beds", v: data.beds, i: <Bed size={18}/> },
                { l: "Baths", v: data.baths, i: <Bath size={18}/> },
                { l: "Area", v: data.sqft, i: <Move size={18}/> },
                { l: "Floors", v: data.floors, i: <Layers size={18}/> },
                { l: "Parking", v: data.parking, i: <Car size={18}/> },
                { l: "Built", v: data.built_year, i: <Calendar size={18}/> }
              ].map((s, idx) => (
                <div key={idx} className="bg-white p-5 rounded-[2rem] border border-slate-100 text-center shadow-sm">
                  <div className="text-[#0051A1] flex justify-center mb-2">{s.i}</div>
                  <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">{s.l}</p>
                  <p className="font-black text-slate-900 text-xs italic">{s.v || "N/A"}</p>
                </div>
              ))}
            </div>

            {/* DESCRIPTION */}
            <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-slate-100">
               <h3 className="text-xl font-black text-slate-900 mb-6 uppercase italic">The Narrative</h3>
               <p className="text-slate-600 font-medium leading-relaxed">{data.description}</p>
            </div>
          </div>

          {/* FORM */}
          <div className="lg:col-span-1">
             <form className="sticky top-32 bg-slate-900 p-8 rounded-[2.5rem] shadow-2xl text-white">
                <h3 className="text-2xl font-black mb-6 italic uppercase tracking-tighter">Inquire</h3>
                <div className="space-y-4">
                   <input required type="text" placeholder="Full Name" className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl outline-none font-bold text-xs" />
                   <input required type="email" placeholder="Email" className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl outline-none font-bold text-xs" />
                   <textarea required placeholder="Message" className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl outline-none font-bold text-xs resize-none" rows={4}></textarea>
                   <button type="submit" className="w-full py-5 bg-[#0051A1] text-white rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl flex items-center justify-center gap-3">
                     Send Inquiry <Send size={16}/>
                   </button>
                </div>
             </form>
          </div>
        </div>
      </div>
    </main>
  );
}