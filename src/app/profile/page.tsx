"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Navbar from "@/components/Navbar";
import { motion, AnimatePresence } from "framer-motion";
import { 
  MessageSquare, 
  Heart, 
  Settings, 
  Send, 
  Bookmark, 
  CheckCircle, 
  MapPin, 
  LogOut,
  User as UserIcon,
  Trash2
} from "lucide-react";

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("wishlist"); // wishlist or chat
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      setLoading(false);
    };
    fetchUser();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Loading Profile</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="h-screen flex flex-col items-center justify-center gap-6">
        <p className="font-black uppercase tracking-widest text-slate-400">Please login to view profile</p>
        <button onClick={() => window.location.href = "/"} className="bg-slate-900 text-white px-8 py-3 rounded-full text-[10px] font-black uppercase">Go to Home</button>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#FBFCFE] pt-28 md:pt-36 pb-20">
      <Navbar />
      
      <div className="max-w-6xl mx-auto px-6">
        
        {/* 👤 TOP SECTION: PROFILE HEADER (Left: Icon, Right: Info) */}
        <div className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.05)] border border-slate-100 flex flex-col md:flex-row items-center md:items-start gap-10 mb-10">
          
          {/* LEFT SIDE: AVATAR */}
          <div className="relative group">
            <div className="w-32 h-32 md:w-48 md:h-48 rounded-[2.5rem] overflow-hidden border-4 border-blue-50 shadow-xl rotate-3 group-hover:rotate-0 transition-all duration-500">
              <img 
                src={user.user_metadata?.avatar_url || `https://ui-avatars.com/api/?name=${user.email}&background=0051A1&color=fff`} 
                className="w-full h-full object-cover scale-110 group-hover:scale-100 transition-transform duration-500" 
                alt="User Profile" 
              />
            </div>
            <div className="absolute -bottom-2 -right-2 bg-blue-600 text-white p-2 rounded-2xl border-4 border-white shadow-lg">
              <CheckCircle size={20} fill="currentColor" className="text-white" />
            </div>
          </div>

          {/* RIGHT SIDE: USER DETAILS */}
          <div className="flex-1 text-center md:text-left space-y-4">
            <div className="flex flex-col md:flex-row md:items-center gap-4 justify-between">
              <div>
                <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tighter uppercase italic leading-none">
                  {user.user_metadata?.full_name || "Luxe Member"}
                </h2>
                <div className="flex items-center justify-center md:justify-start gap-2 mt-2 text-slate-400">
                  <MapPin size={14} className="text-blue-600" />
                  <span className="text-[10px] font-black uppercase tracking-widest">Ahmedabad, Gujarat</span>
                </div>
              </div>
              <div className="flex gap-2 justify-center">
                <button className="p-3 border border-slate-100 rounded-2xl hover:bg-slate-50 transition-all text-slate-400 hover:text-blue-600"><Settings size={18} /></button>
                <button onClick={handleLogout} className="p-3 border border-red-50 rounded-2xl hover:bg-red-50 transition-all text-red-400"><LogOut size={18} /></button>
              </div>
            </div>

            <hr className="border-slate-50" />

            {/* QUICK STATS */}
            <div className="flex justify-center md:justify-start gap-10">
              <div className="space-y-1">
                <p className="text-2xl font-black text-slate-900 leading-none">08</p>
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Properties Liked</p>
              </div>
              <div className="space-y-1 border-l border-slate-100 pl-10">
                <p className="text-2xl font-black text-slate-900 leading-none">03</p>
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Total Chats</p>
              </div>
              <div className="space-y-1 border-l border-slate-100 pl-10">
                <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-full">Elite Member</p>
              </div>
            </div>
          </div>
        </div>

        {/* 📑 BOTTOM SECTION: TABS & CONTENT */}
        <div className="flex gap-4 mb-6">
          <button 
            onClick={() => setActiveTab("wishlist")}
            className={`flex-1 md:flex-none flex items-center justify-center gap-3 px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'wishlist' ? 'bg-slate-900 text-white shadow-xl' : 'bg-white text-slate-400 border border-slate-100 hover:bg-slate-50'}`}
          >
            <Heart size={16} fill={activeTab === 'wishlist' ? "white" : "none"} /> My Wishlist
          </button>
          <button 
            onClick={() => setActiveTab("chat")}
            className={`flex-1 md:flex-none flex items-center justify-center gap-3 px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'chat' ? 'bg-slate-900 text-white shadow-xl' : 'bg-white text-slate-400 border border-slate-100 hover:bg-slate-50'}`}
          >
            <MessageSquare size={16} fill={activeTab === 'chat' ? "white" : "none"} /> Conversation
          </button>
        </div>

        {/* 📦 CONTENT AREA (DYNAMIC SWITCH) */}
        <div className="min-h-[400px]">
          <AnimatePresence mode="wait">
            
            {/* WISHLIST SECTION */}
            {activeTab === "wishlist" && (
              <motion.div 
                key="wishlist"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {/* Wishlist Card Example */}
                <div className="bg-white rounded-[2rem] overflow-hidden border border-slate-100 group shadow-sm">
                  <div className="h-48 overflow-hidden relative">
                    <img src="https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800" className="w-full h-full object-cover group-hover:scale-110 transition-all duration-500" alt="Home" />
                    <button className="absolute top-4 right-4 bg-white/90 backdrop-blur-md p-2 rounded-full text-red-500 shadow-lg"><Trash2 size={16}/></button>
                  </div>
                  <div className="p-6">
                    <h4 className="text-sm font-black uppercase tracking-tight text-slate-900">Modern Penthouse</h4>
                    <p className="text-[10px] font-bold text-slate-400 uppercase mt-1">Satellite, Ahmedabad</p>
                    <div className="mt-4 flex justify-between items-center pt-4 border-t border-slate-50">
                      <span className="text-blue-600 font-black text-sm">₹4.5 Cr</span>
                      <button className="text-[9px] font-black uppercase text-slate-900 flex items-center gap-1">View Property <Bookmark size={12}/></button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* CHAT SECTION */}
            {activeTab === "chat" && (
              <motion.div 
                key="chat"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="max-w-3xl mx-auto bg-white rounded-[2.5rem] border border-slate-100 shadow-2xl overflow-hidden h-[550px] flex flex-col"
              >
                {/* Chat Header */}
                <div className="px-8 py-6 bg-slate-900 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-black text-xs shadow-lg shadow-blue-500/30">LL</div>
                  <div>
                    <h4 className="text-white text-[11px] font-black uppercase tracking-widest leading-none">LuxeLair Concierge</h4>
                    <p className="text-blue-400 text-[9px] font-bold uppercase mt-1">Available 24/7</p>
                  </div>
                </div>

                {/* Chat Messages */}
                <div className="flex-1 p-8 overflow-y-auto space-y-6 bg-slate-50/50">
                  <div className="flex gap-4">
                    <div className="bg-white p-5 rounded-[1.5rem] rounded-tl-none shadow-sm border border-slate-100 max-w-[80%]">
                      <p className="text-[11px] font-medium text-slate-600 leading-relaxed">
                        Namaste! {user.user_metadata?.full_name?.split(' ')[0] || "User"}, LuxeLair VIP support mein aapka swagat hai. Batayiye hum aapki kaise madad kar sakte hain?
                      </p>
                    </div>
                  </div>
                </div>

                {/* Chat Input */}
                <div className="p-6 bg-white border-t border-slate-50 flex gap-4">
                  <input 
                    type="text" 
                    placeholder="Type your message here..." 
                    className="flex-1 bg-slate-50 rounded-2xl px-6 py-4 text-xs font-bold outline-none border border-slate-100 focus:border-blue-600 transition-all placeholder:text-slate-300"
                  />
                  <button className="bg-slate-900 text-white p-4 rounded-2xl hover:bg-blue-600 transition-all shadow-lg active:scale-95">
                    <Send size={20} />
                  </button>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </div>
    </main>
  );
}