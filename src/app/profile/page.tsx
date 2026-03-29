"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Navbar from "@/components/Navbar";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Heart, 
  Settings, 
  LogOut, 
  Mail, 
  Clock, 
  ShieldCheck, 
  MailQuestion, 
  Trash2, 
  ArrowRight,
  MapPin,
  Calendar,
  ExternalLink
} from "lucide-react";

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("wishlist");
  const [loading, setLoading] = useState(true);

  // 🔄 FETCH AUTH USER DATA
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

  // 🕒 FORMAT DATE LOGIC
  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleString('en-IN', { 
      day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' 
    });
  };

  if (loading) return (
    <div className="h-screen flex items-center justify-center bg-white">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Syncing Luxe Profile</p>
      </div>
    </div>
  );

  if (!user) return (
    <div className="h-screen flex flex-col items-center justify-center gap-6 bg-[#F8FAFC]">
      <p className="font-black uppercase tracking-[0.2em] text-slate-400">Session Expired</p>
      <button onClick={() => window.location.href = "/"} className="bg-slate-900 text-white px-10 py-4 rounded-full text-[10px] font-black uppercase tracking-widest shadow-xl">Back to Home</button>
    </div>
  );

  return (
    <main className="min-h-screen bg-[#FDFDFD] pt-28 pb-20">
      <Navbar />
      
      <div className="max-w-6xl mx-auto px-6">
        
        {/* 🏆 PREMIUM HEADER: [LOGO LEFT] [DETAILS RIGHT] */}
        <div className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 mb-10">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-10 lg:gap-14">
            
            {/* [profile logo] - CIRCLE & SMALL */}
            <div className="relative shrink-0">
              <div className="w-28 h-28 md:w-36 md:h-36 rounded-full border-4 border-blue-50 p-1 shadow-inner overflow-hidden">
                 <img 
                   src={user?.user_metadata?.avatar_url || `https://ui-avatars.com/api/?name=${user.email}&background=0051A1&color=fff`} 
                   className="w-full h-full rounded-full object-cover" 
                   alt="User" 
                 />
              </div>
              <div className="absolute bottom-1 right-1 bg-green-500 p-2 rounded-full border-4 border-white shadow-lg">
                <ShieldCheck size={14} className="text-white" />
              </div>
            </div>

            {/* [user details] - RIGHT SIDE CONTENT */}
            <div className="flex-1 w-full">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                <div className="text-center md:text-left">
                  <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tighter uppercase italic leading-none">
                    {user?.user_metadata?.full_name || "Luxe Member"}
                  </h2>
                  <div className="mt-4 space-y-2">
                    <div className="flex items-center justify-center md:justify-start gap-2 text-slate-400">
                      <Mail size={14} className="text-blue-600"/> 
                      <span className="text-[11px] font-bold">{user?.email}</span>
                    </div>
                    <div className="flex items-center justify-center md:justify-start gap-2 text-slate-500">
                      <Clock size={14} className="text-slate-300"/> 
                      <span className="text-[9px] font-black uppercase tracking-widest">
                        Last Login: {formatDate(user?.last_sign_in_at)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* [setting & logout buttons] */}
                <div className="flex gap-3 justify-center md:justify-end">
                  <button className="flex items-center gap-2 px-6 py-3 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-2xl border border-slate-100 transition-all text-[10px] font-black uppercase tracking-widest">
                    <Settings size={14} /> Settings
                  </button>
                  <button onClick={handleLogout} className="flex items-center gap-2 px-6 py-3 bg-red-50 hover:bg-red-100 text-red-500 rounded-2xl border border-red-100 transition-all text-[10px] font-black uppercase tracking-widest">
                    <LogOut size={14} /> Logout
                  </button>
                </div>
              </div>

              {/* STATS SECTION (Replacing Membership/Verified) */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6 pt-8 border-t border-slate-50">
                <div className="text-center md:text-left">
                  <p className="text-2xl font-black text-slate-900 leading-none">08</p>
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">Properties Liked</p>
                </div>
                <div className="text-center md:text-left border-l border-slate-50 pl-6 md:pl-10">
                  <p className="text-2xl font-black text-slate-900 leading-none">03</p>
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">Inquiries Sent</p>
                </div>
                <div className="hidden md:block border-l border-slate-50 pl-10">
                  <p className="text-[10px] font-black text-blue-600 bg-blue-50 px-4 py-1.5 rounded-full inline-block uppercase tracking-widest">
                    Luxe VIP Member
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 📑 TABS: [MY WISHLIST] [EMAIL HISTORY] */}
        <div className="flex gap-4 mb-8">
          <button 
            onClick={() => setActiveTab("wishlist")}
            className={`flex-1 md:flex-none flex items-center justify-center gap-3 px-10 py-5 rounded-[1.8rem] text-[10px] font-black uppercase tracking-[0.2em] transition-all ${activeTab === 'wishlist' ? 'bg-slate-900 text-white shadow-2xl scale-105' : 'bg-white text-slate-400 border border-slate-100 hover:bg-slate-50'}`}
          >
            <Heart size={16} fill={activeTab === 'wishlist' ? "white" : "none"} /> My Wishlist
          </button>
          <button 
            onClick={() => setActiveTab("inquiry")}
            className={`flex-1 md:flex-none flex items-center justify-center gap-3 px-10 py-5 rounded-[1.8rem] text-[10px] font-black uppercase tracking-[0.2em] transition-all ${activeTab === 'inquiry' ? 'bg-slate-900 text-white shadow-2xl scale-105' : 'bg-white text-slate-400 border border-slate-100 hover:bg-slate-50'}`}
          >
            <MailQuestion size={16} /> Inquiry History
          </button>
        </div>

        {/* 📦 CONTENT AREA */}
        <div className="min-h-[500px]">
          <AnimatePresence mode="wait">
            
            {activeTab === "wishlist" ? (
              <motion.div 
                key="wishlist"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              >
                {/* Real Wishlist Card Example */}
                <div className="bg-white rounded-[2.5rem] overflow-hidden border border-slate-100 group shadow-sm hover:shadow-xl transition-all duration-500 p-2">
                  <div className="h-56 overflow-hidden relative rounded-[2rem]">
                    <img src="https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800" className="w-full h-full object-cover group-hover:scale-110 transition-all duration-500" alt="Home" />
                    <button className="absolute top-4 right-4 bg-white/90 backdrop-blur-md p-2.5 rounded-2xl text-red-500 shadow-xl hover:bg-red-500 hover:text-white transition-all"><Trash2 size={16}/></button>
                  </div>
                  <div className="p-6">
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="text-[12px] font-black uppercase tracking-tight text-slate-900 italic">Skyline Villa</h4>
                      <span className="text-blue-600 font-black text-xs italic tracking-tighter">₹4.25 Cr</span>
                    </div>
                    <button className="w-full bg-slate-900 text-white py-4 rounded-2xl text-[9px] font-black uppercase tracking-[0.2em] hover:bg-blue-600 transition-all flex items-center justify-center gap-2">
                      View Details <ExternalLink size={12}/>
                    </button>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div 
                key="inquiry"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-4 max-w-4xl mx-auto"
              >
                {/* Professional Inquiry/Email History List */}
                <div className="bg-white p-6 md:p-8 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6 hover:border-blue-100 transition-all group">
                   <div className="flex items-center gap-5">
                      <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600">
                        <MailQuestion size={24}/>
                      </div>
                      <div>
                        <h4 className="text-[12px] font-black text-slate-900 uppercase italic">Inquiry: Aura Penthouse</h4>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1 italic">Message: "Is a site visit possible this weekend?"</p>
                      </div>
                   </div>
                   <div className="text-right shrink-0">
                      <p className="text-[9px] font-black text-slate-300 uppercase tracking-[0.2em] mb-2">29 MAR 2026</p>
                      <button className="text-[10px] font-black uppercase text-blue-600 border-b border-blue-600 pb-0.5 hover:text-blue-800 transition-all">View Full Email</button>
                   </div>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </div>
    </main>
  );
}