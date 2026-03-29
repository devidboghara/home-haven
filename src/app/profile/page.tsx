"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Heart, 
  LogOut, 
  Mail, 
  Clock, 
  ShieldCheck, 
  MailQuestion, 
  Trash2, 
  ArrowRight,
  Send,
  History
} from "lucide-react";

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("wishlist");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const charLimit = 200;

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      setLoading(false);
    };
    fetchUser();
  }, []);

  const formatDateTime = (date: any) => {
    if(!date) return "N/A";
    return new Date(date).toLocaleString('en-IN', { 
      day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' 
    });
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  if (loading) return (
    <div className="h-screen flex items-center justify-center bg-white">
      <div className="text-blue-600 font-black italic tracking-[0.5em] animate-pulse uppercase text-xs">LuxeLair...</div>
    </div>
  );

  return (
    <main className="min-h-screen bg-[#FBFCFE] flex flex-col">
      <Navbar />
      
      {/* 🏆 THE EXECUTIVE DASHBOARD HEADER */}
      <section className="pt-32 pb-12 px-6 md:px-16 border-b border-slate-100 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center md:items-start gap-8">
            
            {/* LEFT: [LOGO] [GMAIL ID] [TIMINGS] */}
            <div className="flex items-center gap-6">
              {/* (__) Round Profile Logo */}
              <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-blue-600 flex items-center justify-center text-white text-3xl font-black italic shadow-2xl shadow-blue-200 shrink-0">
                {user?.email?.charAt(0).toUpperCase()}
              </div>
              
              <div className="space-y-3">
                <h2 className="text-xl md:text-2xl font-black text-slate-900 lowercase tracking-tight">
                  {user?.email}
                </h2>
                <div className="flex flex-col md:flex-row gap-4 md:gap-10">
                  <div className="flex items-center gap-2 text-slate-400">
                    <Clock size={12} className="text-blue-500" />
                    <span className="text-[9px] font-black uppercase tracking-widest">Login: {formatDateTime(user?.last_sign_in_at)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-400">
                    <History size={12} className="text-red-400" />
                    <span className="text-[9px] font-black uppercase tracking-widest">Logout: 28 Mar 2026, 11:20 PM (Static)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT: LOGOUT BUTTON (__) */}
            <button 
              onClick={handleLogout}
              className="group flex items-center gap-3 px-8 py-4 bg-red-50 hover:bg-red-500 text-red-500 hover:text-white rounded-full transition-all duration-500 border border-red-100 shadow-sm"
            >
              <span className="text-[10px] font-black uppercase tracking-[0.2em]">Log Out</span>
              <LogOut size={16} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </section>

      {/* 📑 TABS SECTION: [MY WISHLIST] | [INQUIRIES] */}
      <section className="flex-1 max-w-7xl mx-auto w-full px-6 md:px-16 py-12">
        <div className="flex gap-12 mb-12 border-b border-slate-50">
          <button 
            onClick={() => setActiveTab("wishlist")}
            className={`pb-6 text-[11px] font-black uppercase tracking-[0.4em] transition-all relative ${activeTab === 'wishlist' ? 'text-blue-600' : 'text-slate-300'}`}
          >
            My Wish List
            {activeTab === 'wishlist' && <motion.div layoutId="underline" className="absolute bottom-0 left-0 w-full h-1 bg-blue-600" />}
          </button>
          <button 
            onClick={() => setActiveTab("inquiry")}
            className={`pb-6 text-[11px] font-black uppercase tracking-[0.4em] transition-all relative ${activeTab === 'inquiry' ? 'text-blue-600' : 'text-slate-300'}`}
          >
            Inquiries
            {activeTab === 'inquiry' && <motion.div layoutId="underline" className="absolute bottom-0 left-0 w-full h-1 bg-blue-600" />}
          </button>
        </div>

        {/* 📦 TAB CONTENT */}
        <AnimatePresence mode="wait">
          {activeTab === "wishlist" ? (
            <motion.div 
              key="wishlist"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
            >
              {/* Static Wishlist Card Example */}
              <div className="bg-white p-3 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-500 group">
                <div className="h-44 rounded-[2rem] overflow-hidden relative">
                  <img src="https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800" className="w-full h-full object-cover" alt="Home" />
                  <button className="absolute top-4 right-4 p-2 bg-white/90 rounded-xl text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 size={16}/></button>
                </div>
                <div className="p-4 flex justify-between items-center">
                   <h4 className="text-[10px] font-black uppercase italic text-slate-900 tracking-tighter">Aura Penthouse</h4>
                   <ArrowRight size={14} className="text-blue-600" />
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="inquiry"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="max-w-3xl"
            >
              {/* ✉️ NEW INQUIRY FORMAT (Write to us) */}
              <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm">
                <h3 className="text-lg font-black uppercase italic tracking-tighter text-slate-900 mb-2">Compose Inquiry</h3>
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-8">Send a private email to LuxeLair Sales Team</p>
                
                <div className="space-y-6">
                  <div className="relative">
                    <textarea 
                      value={message}
                      onChange={(e) => setMessage(e.target.value.slice(0, charLimit))}
                      placeholder="Enter your message here..."
                      className="w-full p-8 bg-slate-50 rounded-[2rem] outline-none border border-slate-50 focus:border-blue-100 focus:bg-white transition-all text-xs font-medium min-h-[150px] resize-none"
                    ></textarea>
                    <div className="absolute bottom-6 right-8 text-[9px] font-black text-slate-300 uppercase tracking-widest">
                      {message.length} / {charLimit} Words
                    </div>
                  </div>
                  
                  <button className="flex items-center gap-3 px-12 py-5 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] hover:bg-blue-600 transition-all shadow-2xl active:scale-95">
                    Send Email <Send size={14} />
                  </button>
                </div>
              </div>

              {/* Inquiry History Example */}
              <div className="mt-12 space-y-4 opacity-50">
                <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest ml-4">Past Conversations</p>
                <div className="p-6 bg-white border border-slate-50 rounded-3xl flex justify-between items-center">
                   <div className="flex items-center gap-4 text-slate-400">
                     <MailQuestion size={18} />
                     <p className="text-[10px] font-bold">Regarding Sky Villa Site Visit...</p>
                   </div>
                   <span className="text-[8px] font-black uppercase tracking-widest text-slate-200">Delivered</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      <Footer />
    </main>
  );
}