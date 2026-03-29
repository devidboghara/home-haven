"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Navbar from "@/components/Navbar";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, Heart, Settings, Bookmark, CheckCircle, MapPin, ArrowRight } from "lucide-react";

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("inquiries");

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    fetchUser();
  }, []);

  if (!user) return <div className="h-screen flex items-center justify-center font-black text-slate-200 uppercase tracking-widest animate-pulse">LuxeLair...</div>;

  return (
    <main className="min-h-screen bg-[#FDFDFD] pt-32 pb-20">
      <Navbar />
      <div className="max-w-5xl mx-auto px-6">
        
        {/* 👤 PROFESSIONAL HEADER (Left Icon, Right Content) */}
        <header className="flex flex-col md:flex-row items-center md:items-start gap-12 mb-16 bg-white p-10 rounded-[2rem] border border-slate-100 shadow-sm">
          {/* LEFT: Profile Picture */}
          <div className="relative">
            <div className="w-32 h-32 md:w-44 md:h-44 rounded-full border-4 border-blue-50 p-1 shadow-inner">
               <img 
                 src={user.user_metadata?.avatar_url || "https://ui-avatars.com/api/?name=User"} 
                 className="w-full h-full rounded-full object-cover shadow-md" 
                 alt="Profile" 
               />
            </div>
            <div className="absolute bottom-2 right-2 bg-blue-600 text-white p-1.5 rounded-full border-4 border-white">
              <CheckCircle size={16} fill="currentColor" className="text-white"/>
            </div>
          </div>

          {/* RIGHT: User Details & Stats */}
          <div className="flex-1 text-center md:text-left pt-2">
            <div className="flex flex-col md:flex-row items-center gap-6 mb-6">
              <h2 className="text-3xl font-black text-slate-900 tracking-tight uppercase italic italic">
                {user.user_metadata?.full_name || "Luxe Member"}
              </h2>
              <div className="flex gap-3">
                 <button className="px-6 py-2 bg-slate-900 text-white rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-blue-600 transition-all shadow-lg active:scale-95">Edit Account</button>
                 <button className="p-2 border border-slate-200 rounded-full hover:bg-slate-50 transition-all text-slate-400"><Settings size={18}/></button>
              </div>
            </div>

            <div className="flex justify-center md:justify-start gap-12 mb-8">
              <div className="text-center md:text-left">
                <p className="text-xl font-black text-slate-900 leading-none">12</p>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Saved Properties</p>
              </div>
              <div className="text-center md:text-left">
                <p className="text-xl font-black text-slate-900 leading-none">04</p>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Active Inquiries</p>
              </div>
              <div className="text-center md:text-left">
                <p className="text-xl font-black text-blue-600 leading-none underline">Elite</p>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Membership</p>
              </div>
            </div>

            <div className="flex items-center justify-center md:justify-start gap-2 text-slate-500">
              <MapPin size={14} className="text-blue-600"/>
              <span className="text-[11px] font-bold uppercase tracking-wider">Ahmedabad, Gujarat</span>
            </div>
          </div>
        </header>

        {/* 📑 LUXE TABS */}
        <div className="flex justify-start gap-10 border-b border-slate-100 mb-10 px-4">
          {[
            { id: "inquiries", label: "My Inquiries", icon: <MessageSquare size={16}/> },
            { id: "favs", label: "Saved Listings", icon: <Bookmark size={16}/> },
          ].map(tab => (
            <button 
              key={tab.id} 
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 py-4 border-b-2 transition-all text-[11px] font-black uppercase tracking-[0.2em] ${activeTab === tab.id ? "border-blue-600 text-blue-600" : "border-transparent text-slate-300"}`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {/* 📦 CONTENT SECTION */}
        <section className="min-h-[400px]">
           <AnimatePresence mode="wait">
             {activeTab === "inquiries" ? (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="grid md:grid-cols-2 gap-6">
                   {/* Inquiry Card Example */}
                   <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center justify-between group hover:border-blue-200 transition-all">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 font-black">01</div>
                        <div>
                          <h4 className="text-[12px] font-black text-slate-900 uppercase">Skyline Penthouse</h4>
                          <p className="text-[10px] font-bold text-slate-400 uppercase">Status: In Progress</p>
                        </div>
                      </div>
                      <ArrowRight size={18} className="text-slate-300 group-hover:text-blue-600 transition-all"/>
                   </div>
                </motion.div>
             ) : (
                <div className="text-center py-20 bg-slate-50 rounded-[3rem] border border-dashed border-slate-200">
                   <Heart size={40} className="mx-auto text-slate-200 mb-4"/>
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">No properties saved yet</p>
                </div>
             )}
           </AnimatePresence>
        </section>
      </div>
    </main>
  );
}