"use client";

import { useParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import {
  MapPin,
  Bed,
  Bath,
  Move,
  Calendar,
  Share,
  Heart,
  Send,
  ChevronLeft,
  ChevronRight,
  X,
  Car,
  Layers,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

// DATA
const propertiesData: any = {
  "1": {
    title: "Modern Sky Villa",
    price: "85.5 L",
    location: "Satellite, Ahmedabad",
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
      { label: "Area", val: "2400 sqft", icon: <Move size={18}/> },
      { label: "Floors", val: "2", icon: <Layers size={18}/> },
      { label: "Parking", val: "Yes", icon: <Car size={18}/> },
      { label: "Built", val: "2024", icon: <Calendar size={18}/> }
    ],
    desc: "A masterpiece of modern architecture in Satellite."
  },
  "2": {
    title: "Royal Heritage",
    price: "1.2 Cr",
    location: "SG Highway, Ahmedabad",
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

  const nextImg = () =>
    setCurrentImg((prev) => (prev + 1) % data.images.length);

  const prevImg = () =>
    setCurrentImg((prev) => (prev - 1 + data.images.length) % data.images.length);

  return (
    <main className="min-h-screen bg-[#F8FAFC] pb-20 relative">
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 pt-32">
        
        {/* ✅ UPDATED HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12 pl-2 md:pl-20">
          
          {/* LEFT */}
          <div>
            <h1 className="text-4xl md:text-7xl font-black text-slate-900 tracking-tighter uppercase leading-none">
              {data.title}
            </h1>

            <div className="flex items-center gap-2 mt-4 text-slate-500 font-bold italic">
              <MapPin size={18} className="text-[#0051A1]" />
              {data.location}
            </div>
          </div>

          {/* RIGHT */}
          <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-end">
            
            <span className="text-[#0051A1] text-5xl md:text-7xl font-black tracking-tighter italic leading-none">
              ₹{data.price}
            </span>

            <div className="flex flex-col gap-2">
              <button className="p-3 bg-white border border-slate-200 rounded-xl shadow-sm hover:bg-red-50 hover:text-red-500 transition-all text-slate-400">
                <Heart size={20} />
              </button>

              <button className="p-3 bg-white border border-slate-200 rounded-xl shadow-sm hover:bg-blue-50 hover:text-[#0051A1] transition-all text-slate-400">
                <Share size={20} />
              </button>
            </div>

          </div>
        </div>

        {/* MAIN GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          <div className="lg:col-span-2 space-y-10">

            {/* IMAGE */}
            <div className="relative aspect-video rounded-[2rem] overflow-hidden shadow-2xl group border-4 border-white">
              <motion.div
                key={currentImg}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                onDragEnd={(_, info) =>
                  info.offset.x > 50
                    ? prevImg()
                    : info.offset.x < -50
                    ? nextImg()
                    : null
                }
                className="w-full h-full"
                onClick={() => setIsZoomed(true)}
              >
                <img
                  src={data.images[currentImg].url}
                  className="w-full h-full object-cover"
                />

                <motion.div
                  key={`label-${currentImg}`}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  className="absolute bottom-10 right-10 px-6 py-3 bg-white/90 rounded-2xl shadow-xl"
                >
                  <p className="text-[10px] font-black uppercase text-[#0051A1]">
                    {data.images[currentImg].label}
                  </p>
                </motion.div>
              </motion.div>

              <button onClick={prevImg} className="absolute left-6 top-1/2">
                <ChevronLeft />
              </button>
              <button onClick={nextImg} className="absolute right-6 top-1/2">
                <ChevronRight />
              </button>
            </div>

          </div>
        </div>
      </div>

      {/* ZOOM */}
      <AnimatePresence>
        {isZoomed && (
          <motion.div className="fixed inset-0 bg-black/90 flex items-center justify-center">
            <button onClick={() => setIsZoomed(false)}>
              <X size={40} />
            </button>
            <img src={data.images[currentImg].url} />
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}