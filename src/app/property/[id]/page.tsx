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
  const [hasSwiped, setHasSwiped] = useState(false);

  useEffect(() => {
    async function fetchProperty() {
      // Step 1: Database se data mangwana
      const { data: property, error } = await supabase
        .from('properties')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error("Supabase Fetch Error:", error.message);
      } else {
        setData(property);
      }
      setLoading(false);
    }
    fetchProperty();
  }, [id]);

  // 🔄 AUTO HINT ANIMATION (Peek effect if user hasn't swiped)
  useEffect(() => {
    if (loading || hasSwiped || currentImg !== 0) return;
    const interval = setInterval(() => {
      setHasSwiped(false); 
    }, 2000);
    return () => clearInterval(interval);
  }, [loading, hasSwiped, currentImg]);

  if (loading) return (
    <div className="h-screen flex items-center justify-center bg-white">
      <div className="text-[#0051A1] font-black italic text-2xl uppercase animate-pulse">LuxeLair...</div>
    </div>
  );

  // Agar data nahi mila toh ye dikhayega
  if (!data) return (
    <div className="h-screen flex flex-col items-center justify-center gap-4 bg-[#F8FAFC]">
      <h1 className="font-black text-2xl uppercase text-slate-400">Property Not Found</h1>
      <button onClick={() => router.push('/')} className="px-8 py-3 bg-slate-900 text-white rounded-full font-bold text-xs uppercase tracking-widest">Return to Home</button>
    </div>
  );

  const nextImg = () => { 
    if (!data.gallery) return;
    setCurrentImg((prev) => (prev + 1) % data.gallery.length); 
    setHasSwiped(true); 
  };
  
  const prevImg = () => { 
    if (!data.gallery) return;
    setCurrentImg((prev) => (prev - 1 + data.gallery.length) % data.gallery.length); 
    setHasSwiped(true); 
  };

  const specsGrid = [
    { label: "Beds", val: data.beds, icon: <Bed size={18}/> },
    { label: "Baths", val: data.baths, icon: <Bath size={18}/> },
    { label: "Area", val: data.sqft, icon: <Move size={18}/> },
    { label: "Floors", val: data.floors, icon: <Layers size={18}/> },
    { label: "Parking", val: data.parking, icon: <Car size={18}/> },
    { label: "Built", val: data.built_year, icon: <Calendar size={18}/> }
  ];

  return (
    <main className="min-h-screen bg-[#F8FAFC] pb-20 pt-32 px-6">
      <Navbar />
      <div className="max-w-7xl mx-auto">
        
        {/* BACK BUTTON */}
        <button onClick={() => router.back()} className="flex items-center gap-2 text-slate-400 font-black uppercase text-[10px] tracking-[0.3em] mb-8 hover:text-slate-900 transition-all">
          <ArrowLeft size={14}/> Back to Listings
        </button>

        {/* HEADER SECTION */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <h1 className="text-4xl md:text-7xl font-black text-slate-900 tracking-tighter uppercase leading-[0.9]">{data.title}</h1>
            <div className="flex items-center gap-2 mt-4 text-slate-500 font-bold italic tracking-tight">
              <MapPin size={20} className="text-[#0051A1]"/> {data.location}
            </div>
          </motion.div>

          <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-end">
            <span className="text-[#0051A1] text-5xl md:text-8xl font-black tracking-tighter italic leading-none">₹{data.price}</span>
            <div className="flex flex-col gap-2 min-w-[120px]">
               <button className="flex items-center justify-between px-4 py-2 bg-white border border-slate-200 rounded-xl shadow-sm text-[10px] font-black uppercase text-red-500 hover:bg-red-50 transition-all">
                 Like <Heart size={14}/>
               </button>
               <button className="flex items-center justify-between px-4 py-2 bg-white border border-slate-200 rounded-xl shadow-sm text-[10px] font-black uppercase text-slate-600 hover:bg-slate-50 transition-all">
                 Share <Share size={14}/>
               </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-10">
            
            {/* 📸 IMAGE VIEWER WITH PEEKING HINT */}
            <div className="relative aspect-video rounded-[2.5rem] overflow-hidden shadow-2xl bg-slate-200 border-4 border-white group">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentImg}
                  initial={{ opacity: 1 }} // No entry animation for speed
                  animate={!hasSwiped && currentImg === 0 ? { x: [0, -50, 0] } : { x: 0 }}
                  transition={{ duration: 1.5, repeat: !hasSwiped ? Infinity : 0, repeatDelay: 2 }}
                  drag="x"
                  dragConstraints={{ left: 0, right: 0 }}
                  onDragEnd={(e, { offset }) => {
                    const swipe = offset.x;
                    if (swipe < -50) nextImg();
                    else if (swipe > 50) prevImg();
                  }}
                  className="w-full h-full cursor-grab active:cursor-grabbing relative"
                  onClick={() => setIsZoomed(true)}
                >
                  {/* JSON Data format: data.gallery[i].url */}
                  <img 
                    src={data.gallery && data.gallery[currentImg] ? data.gallery[currentImg].url : data.main_image} 
                    className="w-full h-full object-cover pointer-events-none" 
                    alt="Property" 
                  />

                  {/* DYNAMIC LABEL FROM DATABASE */}
                  <div className="absolute bottom-6 left-6 px-5 py-2.5 bg-white/90 backdrop-blur-md rounded-2xl border border-white shadow-xl">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#0051A1]">
                      {data.gallery && data.gallery[currentImg] ? data.gallery[currentImg].label : "Luxury Interior"}
                    </p>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Peeking hint overlay */}
              {!hasSwiped && currentImg === 0 && (
                <div className="absolute top-0 right-0 w-8 h-full bg-gradient-to-l from-black/10 to-transparent pointer-events-none" />
              )}
            </div>

            {/* SPECS GRID */}
            <div className="grid grid-cols-3 gap-4">
              {specsGrid.map((s, idx) => (
                <div key={idx} className="bg-white p-6 rounded-[2rem] border border-slate-100 text-center shadow-sm hover:shadow-md transition-all">
                  <div className="text-[#0051A1] flex justify-center mb-3">{s.icon}</div>
                  <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">{s.label}</p>
                  <p className="font-black text-slate-900 text-xs italic">{s.val || "N/A"}</p>
                </div>
              ))}
            </div>

            {/* DESCRIPTION */}
            <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-slate-100">
               <h3 className="text-xl font-black text-slate-900 mb-6 uppercase italic tracking-tighter">Property Description</h3>
               <p className="text-slate-600 font-medium leading-relaxed text-lg">{data.description}</p>
            </div>
          </div>

          {/* SIDEBAR INQUIRY FORM */}
          <div className="lg:col-span-1">
             <form className="sticky top-32 bg-slate-900 p-8 rounded-[3rem] shadow-2xl text-white">
                <h3 className="text-2xl font-black mb-2 italic uppercase tracking-tighter">Inquiry</h3>
                <p className="text-slate-500 text-[10px] font-bold uppercase mb-8 tracking-widest">Private Viewing Request</p>
                <div className="space-y-4">
                   <input required type="text" placeholder="Your Name" className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl outline-none font-bold text-xs focus:border-[#0051A1]" />
                   <input required type="email" placeholder="Email Address" className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl outline-none font-bold text-xs focus:border-[#0051A1]" />
                   <textarea required placeholder="Write your message..." className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl outline-none font-bold text-xs resize-none" rows={4}></textarea>
                   <button type="submit" className="w-full py-5 bg-[#0051A1] text-white rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] shadow-xl flex items-center justify-center gap-3 hover:bg-blue-600 transition-all">
                     Submit Inquiry <Send size={16}/>
                   </button>
                </div>
             </form>
          </div>
        </div>
      </div>

      {/* LIGHTBOX FOR ZOOM */}
      <AnimatePresence>
        {isZoomed && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[200] bg-black/95 flex items-center justify-center p-4 cursor-zoom-out" onClick={() => setIsZoomed(false)}>
            <button className="absolute top-10 right-10 text-white"><X size={40} /></button>
            <img 
  src={data.gallery?.[currentImg]?.url || data.main_image} 
  className="max-w-full max-h-[90vh] rounded-xl shadow-2xl" 
/> </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}