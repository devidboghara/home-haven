"use client";

import Navbar from "@/components/Navbar";
import { MapPin, Bed, Bath, Move, Calendar, Share, Heart, CheckCircle2, Send } from "lucide-react";
import { motion } from "framer-motion";

export default function PropertyDetail() {
  const property = {
    title: "Modern Sky Villa with Private Pool",
    price: "85.5 L",
    location: "Satellite, Ahmedabad, Gujarat",
    description: "Experience the pinnacle of luxury in this architecturally significant villa. Featuring double-height ceilings, a private temperature-controlled pool, and seamless indoor-outdoor living spaces.",
    specs: { beds: 4, baths: 3, sqft: "2400", year: "2024" },
    features: ["Private Pool", "Smart Home", "Modular Kitchen", "Gym Access", "24/7 Security"],
    image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?q=80&w=1200"
  };

  return (
    <main className="min-h-screen bg-[#F8FAFC] pb-20">
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 pt-32">
        {/* HEADER SECTION */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-10"
        >
          <div>
            <span className="text-[#0051A1] text-[10px] font-black tracking-[0.4em] uppercase mb-2 block">Premium Listing</span>
            <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter uppercase leading-none">{property.title}</h1>
            <div className="flex items-center gap-2 mt-4 text-slate-500">
              <MapPin size={16} className="text-[#0051A1]" />
              <span className="font-bold text-sm tracking-tight">{property.location}</span>
            </div>
          </div>

          <div className="flex flex-col items-start md:items-end gap-4 w-full md:w-auto">
             <span className="text-[#0051A1] text-5xl font-black tracking-tighter italic leading-none">₹{property.price}</span>
             
             {/* SLIM CURVE ACTION BUTTONS */}
             <div className="flex gap-2 w-full md:w-auto">
               <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-2.5 bg-white border border-slate-200 rounded-full hover:bg-slate-50 transition-all shadow-sm text-[10px] font-black uppercase tracking-widest text-slate-700">
                 Share <Share size={14} />
               </button>
               <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-2.5 bg-white border border-slate-200 rounded-full hover:bg-slate-50 transition-all shadow-sm text-[10px] font-black uppercase tracking-widest text-red-500">
                 Like <Heart size={14} fill="currentColor" className="opacity-10" />
               </button>
             </div>
          </div>
        </motion.div>

        {/* CONTENT GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          <div className="lg:col-span-2 space-y-10">
            {/* Main Image - Reduced Curve (Soft Edge) */}
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8 }}
              className="relative aspect-video rounded-3xl overflow-hidden shadow-2xl border border-white"
            >
              <img src={property.image} className="w-full h-full object-cover" alt="Main" />
            </motion.div>

            {/* QUICK SPECS - Animated entrance */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: "Beds", val: property.specs.beds, icon: <Bed size={20}/> },
                { label: "Baths", val: property.specs.baths, icon: <Bath size={20}/> },
                { label: "Area", val: property.specs.sqft + " sqft", icon: <Move size={20}/> },
                { label: "Built", val: property.specs.year, icon: <Calendar size={20}/> }
              ].map((item, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-white p-6 rounded-2xl border border-slate-100 flex flex-col items-center text-center shadow-sm"
                >
                  <div className="text-[#0051A1] mb-2">{item.icon}</div>
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{item.label}</p>
                  <p className="font-black text-slate-900 text-sm">{item.val}</p>
                </motion.div>
              ))}
            </div>

            {/* DESCRIPTION */}
            <motion.div 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm"
            >
              <h3 className="text-xl font-black text-slate-900 mb-6 uppercase tracking-tight flex items-center gap-2">
                About this haven <div className="h-1 w-10 bg-[#0051A1]" />
              </h3>
              <p className="text-slate-600 leading-relaxed font-medium text-lg">{property.description}</p>
            </motion.div>
          </div>

          {/* RIGHT SIDEBAR: PREMIUM INQUIRY FORM */}
          <div className="lg:col-span-1">
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="sticky top-28 bg-white p-1 shadow-2xl rounded-[2.5rem] border border-slate-100 overflow-hidden"
            >
              <div className="bg-slate-900 p-8 rounded-[2.2rem] text-white">
                <h3 className="text-2xl font-black mb-1 tracking-tighter uppercase italic">Get in Touch</h3>
                <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-8">Direct Agent Connection</p>
                
                <div className="space-y-4">
                  <div className="group relative">
                    <input type="text" placeholder="Full Name" className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl outline-none focus:border-blue-500 transition-all text-sm font-bold" />
                  </div>
                  <div className="group relative">
                    <input type="email" placeholder="Email Address" className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl outline-none focus:border-blue-500 transition-all text-sm font-bold" />
                  </div>
                  <textarea placeholder="Your message..." rows={3} className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl outline-none focus:border-blue-500 transition-all text-sm font-bold resize-none"></textarea>
                  
                  <button className="w-full group py-5 bg-[#0051A1] hover:bg-blue-600 text-white rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] transition-all flex items-center justify-center gap-3 active:scale-95 shadow-xl shadow-blue-900/20">
                    Send Inquiry <Send size={14} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            </motion.div>
          </div>

        </div>
      </div>
    </main>
  );
}