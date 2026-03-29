"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Navbar from "@/components/Navbar";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Settings, LogOut, Mail, Clock, ShieldCheck, MailQuestion, Trash2, ArrowRight } from "lucide-react";

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

  const formatDate = (date: any) => {
    if(!date) return "N/A";
    return new Date(date).toLocaleString('en-IN', { 
      day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' 
    });
  };

  if (loading) return <div className="h-screen flex items-center justify-center bg-white font-black text-slate-200 uppercase tracking-widest animate-pulse">LuxeLair...</div>;

  return (
    <main className="min-h-screen bg-[#FDFDFD] pt-24 pb-20"> {/* Fixed gap: pt-24 only */}
      <Navbar />
      <div className="max-w-6xl mx-auto px-6">
        
        {/* 🏆 HEADER SECTION: EXACT SCREENSHOT LAYOUT */}
        <header className="bg-white p-8 md:p-12 rounded-[2.5rem] border border-slate-100 shadow-sm mb-10">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-12">
            
            {/* Logo Left - Small Circle */}
            <div className="w-24 h-24 md:w-32 md:h-32 rounded-3xl bg-[#0051A1] flex items-center justify-center text-white text-4xl font-black italic shadow-2xl shrink-0 rotate-2">
               {user?.user_metadata?.full_name?.charAt(0) || "L"}
            </div>

            {/* Details Right */}
            <div className="flex-1 w-full text-center md:text-left">
              <div className="flex flex-col md:flex-row justify-between items-start mb-6">
                <div>
                  <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tighter uppercase italic">{user?.user_metadata?.full_name || "Luxe Member"}</h2>
                  <div className="mt-4 space-y-1">
                    <p className="text-[10px] font-bold text-slate-400 flex items-center justify-center md:justify-start gap-2 uppercase tracking-widest"><Mail size={12}/> {user?.email}</p>
                    <p className="text-[9px] font-black text-slate-500 mt-2 flex items-center justify-center md:justify-start gap-2 uppercase tracking-[0.2em] italic">
                      <Clock size={12}/> Last Login: {formatDate(user?.last_sign_in_at)}
                    </p>
                  </div>
                </div>
                
                {/* Right Corner Buttons */}
                <div className="flex gap-2 mt-6 md:mt-0">
                  <button className="flex items-center gap-2 px-6 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-[10px] font-black uppercase text-slate-400 hover:text-blue-600 transition-all"><Settings size={14}/> Settings</button>
                  <button onClick={() => supabase.auth.signOut().then(() => window.location.href="/")} className="flex items-center gap-2 px-6 py-3 bg-red-50 border border-red-100 rounded-2xl text-[10px] font-black uppercase text-red-500 hover:bg-red-100 transition-all"><LogOut size={14}/> Logout</button>
                </div>
              </div>

              {/* Stats Row (Real-world style) */}
              <div className="grid grid-cols-3 gap-6 pt-10 border-t border-slate-50">
                <div>
                  <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest mb-1">Properties Liked</p>
                  <p className="text-3xl font-black text-slate-900 italic">08 <span className="text-[10px] font-bold text-slate-200 ml-1">Count</span></p>
                </div>
                <div className="border-x border-slate-50 px-6">
                  <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest mb-1">Membership</p>
                  <p className="text-3xl font-black text-blue-600 italic">YES <span className="text-[10px] font-bold text-slate-200 ml-1">Elite</span></p>
                </div>
                <div>
                  <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest mb-1">Status</p>
                  <p className="text-3xl font-black text-green-500 italic flex items-center gap-2">DONE <ShieldCheck size={20}/></p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* CONTENT TABS */}
        <div className="flex gap-4 mb-10">
          <button onClick={() => setActiveTab("wishlist")} className={`flex-1 py-5 rounded-[2rem] text-[10px] font-black uppercase tracking-[0.3em] transition-all flex items-center justify-center gap-3 ${activeTab === 'wishlist' ? 'bg-slate-900 text-white shadow-2xl scale-[1.02]' : 'bg-white text-slate-300 border border-slate-100'}`}><Heart size={16} fill={activeTab === 'wishlist' ? "white" : "none"}/> My Wishlist</button>
          <button onClick={() => setActiveTab("history")} className={`flex-1 py-5 rounded-[2rem] text-[10px] font-black uppercase tracking-[0.3em] transition-all flex items-center justify-center gap-3 ${activeTab === 'history' ? 'bg-slate-900 text-white shadow-2xl scale-[1.02]' : 'bg-white text-slate-300 border border-slate-100'}`}><MailQuestion size={16}/> Inquiries</button>
        </div>

        {/* TAB CONTENT */}
        <section className="min-h-[500px]">
          <AnimatePresence mode="wait">
            {activeTab === 'wishlist' ? (
              <motion.div key="wishlist" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {/* Static Example - To be linked to Real DB later */}
                <div className="bg-white p-3 rounded-[2.5rem] border border-slate-100 shadow-sm group">
                  <div className="h-52 rounded-[2rem] overflow-hidden relative"><img src="https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800" className="w-full h-full object-cover"/><button className="absolute top-4 right-4 p-2 bg-white/90 rounded-xl text-red-500 shadow-xl"><Trash2 size={16}/></button></div>
                  <div className="p-6 flex justify-between items-center"><div><h4 className="text-[12px] font-black uppercase italic tracking-tighter">Aura Penthouse</h4><p className="text-[8px] font-bold text-slate-400 uppercase">Ahmedabad</p></div><ArrowRight size={14} className="text-blue-600"/></div>
                </div>
              </motion.div>
            ) : (
              <motion.div key="history" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-[3rem] p-12 border border-slate-100">
                <h3 className="text-xl font-black text-slate-900 uppercase italic tracking-tighter mb-10">Email & Inquiry History</h3>
                <div className="space-y-4">
                  <div className="flex flex-col md:flex-row items-center justify-between p-6 bg-slate-50 rounded-[2rem] border border-slate-100 hover:border-blue-200 transition-all cursor-pointer">
                    <div className="flex items-center gap-5"><MailQuestion size={24} className="text-blue-600"/><div><p className="text-[11px] font-black text-slate-900 uppercase">Inquiry: Aura Penthouse</p><p className="text-[9px] font-bold text-slate-400 italic">"Sent to LuxeLair Sales Team..."</p></div></div>
                    <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest">29 Mar 2026</span>
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