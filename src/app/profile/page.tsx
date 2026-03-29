"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Navbar from "@/components/Navbar";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Settings, LogOut, Mail, Clock, ShieldCheck, MailQuestion, Trash2, ArrowRight, MapPin, Send } from "lucide-react";

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("wishlist");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      setLoading(false);
    };
    fetchUser();
  }, []);

  const formatDate = (date: any) => new Date(date).toLocaleString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });

  if (loading) return <div className="h-screen flex items-center justify-center font-black text-slate-200 uppercase tracking-widest animate-pulse">LuxeLair...</div>;

  return (
    <main className="min-h-screen bg-[#FDFDFD] pt-24 pb-20"> {/* PT-24 to match Navbar height and remove gap */}
      <Navbar />
      <div className="max-w-6xl mx-auto px-6">
        
        {/* 🏆 USER DASHBOARD HEADER (Left-Logo Layout) */}
        <header className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm mb-10">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-10">
            {/* Logo Left */}
            <div className="w-28 h-28 md:w-36 md:h-36 rounded-2xl bg-[#0051A1] flex items-center justify-center text-white text-5xl font-black italic shadow-xl shrink-0">
               {user?.user_metadata?.full_name?.charAt(0) || user?.email?.charAt(0).toUpperCase()}
            </div>

            {/* Details Right */}
            <div className="flex-1 w-full text-center md:text-left">
              <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
                <div>
                  <h2 className="text-3xl font-black text-slate-900 tracking-tighter uppercase italic italic italic italic">{user?.user_metadata?.full_name || "New User"}</h2>
                  <p className="text-[10px] font-bold text-slate-400 mt-1 flex items-center justify-center md:justify-start gap-2 uppercase tracking-widest"><Mail size={12}/> {user?.email}</p>
                  <p className="text-[9px] font-black text-slate-400 mt-1 flex items-center justify-center md:justify-start gap-2 uppercase tracking-[0.2em] italic"><Clock size={12}/> Last Login: {formatDate(user?.last_sign_in_at)}</p>
                </div>
                <div className="flex gap-2 justify-center">
                  <button className="flex items-center gap-2 px-6 py-3 border border-slate-100 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:bg-slate-50 transition-all"><Settings size={14}/> Settings</button>
                  <button onClick={() => supabase.auth.signOut().then(() => window.location.href="/")} className="flex items-center gap-2 px-6 py-3 border border-red-50 rounded-2xl text-[10px] font-black uppercase tracking-widest text-red-500 hover:bg-red-50 transition-all"><LogOut size={14}/> Logout</button>
                </div>
              </div>

              {/* Stats Row */}
              <div className="grid grid-cols-3 gap-6 pt-8 border-t border-slate-50">
                <div className="text-center md:text-left"><p className="text-2xl font-black text-slate-900 leading-none">08</p><p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">Properties Liked</p></div>
                <div className="text-center md:text-left"><p className="text-2xl font-black text-blue-600 leading-none">YES</p><p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1 italic">Membership</p></div>
                <div className="text-center md:text-left"><p className="text-2xl font-black text-green-500 leading-none">DONE</p><p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1 flex items-center justify-center md:justify-start gap-1">Verified <ShieldCheck size={12}/></p></div>
              </div>
            </div>
          </div>
        </header>

        {/* TABS */}
        <div className="flex gap-4 mb-10">
          <button onClick={() => setActiveTab("wishlist")} className={`flex-1 py-5 rounded-[1.5rem] text-[10px] font-black uppercase tracking-[0.3em] transition-all flex items-center justify-center gap-3 ${activeTab === 'wishlist' ? 'bg-slate-900 text-white shadow-2xl' : 'bg-white text-slate-400 border border-slate-100'}`}><Heart size={16} fill={activeTab === 'wishlist' ? "white" : "none"}/> My Wishlist</button>
          <button onClick={() => setActiveTab("history")} className={`flex-1 py-5 rounded-[1.5rem] text-[10px] font-black uppercase tracking-[0.3em] transition-all flex items-center justify-center gap-3 ${activeTab === 'history' ? 'bg-slate-900 text-white shadow-2xl' : 'bg-white text-slate-400 border border-slate-100'}`}><MailQuestion size={16}/> Conversation</button>
        </div>

        {/* CONTENT */}
        <section className="min-h-[400px]">
          <AnimatePresence mode="wait">
            {activeTab === 'wishlist' ? (
              <motion.div key="wishlist" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid md:grid-cols-3 gap-8">
                <div className="bg-white p-3 rounded-[2.5rem] border border-slate-100 shadow-sm group">
                  <div className="h-48 rounded-[2rem] overflow-hidden relative"><img src="https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800" className="w-full h-full object-cover"/><button className="absolute top-4 right-4 p-2 bg-white/90 rounded-xl text-red-500 shadow-xl"><Trash2 size={16}/></button></div>
                  <div className="p-4 flex justify-between items-center"><h4 className="text-[12px] font-black uppercase italic tracking-tighter">Skyline Penthouse</h4><ArrowRight size={14} className="text-blue-600"/></div>
                </div>
              </motion.div>
            ) : (
              <motion.div key="history" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-sm">
                <h3 className="text-xl font-black text-slate-900 uppercase italic tracking-tighter mb-8">Inquiry & Email History</h3>
                <div className="space-y-4">
                  <div className="flex flex-col md:flex-row items-center justify-between p-6 bg-slate-50 rounded-2xl border border-slate-100 group hover:border-blue-200 transition-all">
                    <div className="flex items-center gap-4"><MailQuestion size={20} className="text-blue-600"/><div><p className="text-[11px] font-black text-slate-900 uppercase">Aura Penthouse Inquiry</p><p className="text-[9px] font-bold text-slate-400 italic">"I want to visit this place tomorrow."</p></div></div>
                    <span className="text-[9px] font-black text-slate-300 uppercase">29 Mar 2026</span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </section>
      </div>
    </main>
  );
}