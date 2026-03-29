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
  Clock,
  Mail,
  Trash2,
  ChevronDown
} from "lucide-react";

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

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  // Helper to format the login date
  const formatLoginDate = (dateString: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleString('en-IN', { 
      day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' 
    });
  };

  if (loading) return (
    <div className="h-screen flex items-center justify-center bg-white italic font-black text-slate-200 tracking-[0.5em] animate-pulse uppercase">
      LuxeLair Profile...
    </div>
  );

  if (!user) return (
    <div className="h-screen flex flex-col items-center justify-center gap-6">
      <p className="font-black uppercase tracking-widest text-slate-400">Auth Required</p>
      <button onClick={() => window.location.href = "/"} className="bg-slate-900 text-white px-10 py-4 rounded-full text-[10px] font-black uppercase tracking-widest">Return Home</button>
    </div>
  );

  return (
    <main className="min-h-screen bg-[#F8FAFC] pt-32 pb-20">
      <Navbar />
      
      <div className="max-w-6xl mx-auto px-6">
        
        {/* 🏆 HEADER SECTION: EXACT USER SPECIFIED LAYOUT */}
        <div className="bg-white rounded-[2rem] p-8 md:p-10 shadow-sm border border-slate-100 mb-8">
          
          {/* TOP ROW: [LOGO] [NAME] [BUTTONS] */}
          <div className="flex flex-col md:flex-row items-start gap-8 md:items-center">
            {/* [profile logo] */}
            <div className="w-24 h-24 md:w-28 md:h-28 rounded-2xl overflow-hidden border-2 border-slate-100 shadow-sm shrink-0">
              <img 
                src={user.user_metadata?.avatar_url || `https://ui-avatars.com/api/?name=${user.email}&background=0051A1&color=fff`} 
                className="w-full h-full object-cover" 
                alt="User Logo" 
              />
            </div>

            {/* [user name] & [user gmail] + date */}
            <div className="flex-1 space-y-1">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight uppercase italic leading-none">
                    {user.user_metadata?.full_name || "Luxe Member"}
                  </h2>
                  <div className="mt-3 space-y-1">
                    <div className="flex items-center gap-2 text-slate-400">
                      <Mail size={12} /> <span className="text-[10px] font-bold">{user.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-500">
                      <Clock size={12} /> <span className="text-[9px] font-black uppercase tracking-wider">Last Login: {formatLoginDate(user.last_sign_in_at)}</span>
                    </div>
                  </div>
                </div>

                {/* [setting button] [log out button] */}
                <div className="flex gap-2">
                  <button className="flex items-center gap-2 px-5 py-2.5 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-xl border border-slate-100 transition-all text-[10px] font-black uppercase tracking-widest">
                    <Settings size={14} /> Settings
                  </button>
                  <button onClick={handleLogout} className="flex items-center gap-2 px-5 py-2.5 bg-red-50 hover:bg-red-100 text-red-500 rounded-xl border border-red-100 transition-all text-[10px] font-black uppercase tracking-widest">
                    <LogOut size={14} /> Logout
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* STATS ROW (Below Header) */}
          <div className="grid grid-cols-3 gap-4 mt-10 pt-8 border-t border-slate-50 text-center md:text-left">
            <div>
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Properties Liked</p>
              <p className="text-2xl font-black text-slate-900 leading-none">08 <span className="text-[10px] text-slate-300 font-bold ml-1 tracking-normal italic">Count</span></p>
            </div>
            <div className="border-x border-slate-100 px-4 md:px-10">
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Membership</p>
              <p className="text-2xl font-black text-blue-600 leading-none">YES <span className="text-[10px] text-slate-300 font-bold ml-1 tracking-normal italic">Elite Tier</span></p>
            </div>
            <div className="flex flex-col md:flex-row md:items-end justify-between">
              <div>
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Verified Status</p>
                <p className="text-2xl font-black text-green-500 leading-none flex items-center gap-2 justify-center md:justify-start">
                  DONE <CheckCircle size={18} />
                </p>
              </div>
              <ChevronDown size={20} className="text-slate-200 hidden md:block" />
            </div>
          </div>
        </div>

        {/* 📑 TAB NAVIGATION: [MY WISHLIST] [CONVERSION] */}
        <div className="flex gap-4 mb-8">
          <button 
            onClick={() => setActiveTab("wishlist")}
            className={`flex-1 md:flex-none flex items-center justify-center gap-3 px-10 py-5 rounded-[1.5rem] text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-300 ${activeTab === 'wishlist' ? 'bg-slate-900 text-white shadow-2xl scale-105' : 'bg-white text-slate-400 border border-slate-100 hover:bg-slate-50'}`}
          >
            <Heart size={16} fill={activeTab === 'wishlist' ? "white" : "none"} /> My Wishlist
          </button>
          <button 
            onClick={() => setActiveTab("chat")}
            className={`flex-1 md:flex-none flex items-center justify-center gap-3 px-10 py-5 rounded-[1.5rem] text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-300 ${activeTab === 'chat' ? 'bg-slate-900 text-white shadow-2xl scale-105' : 'bg-white text-slate-400 border border-slate-100 hover:bg-slate-50'}`}
          >
            <MessageSquare size={16} fill={activeTab === 'chat' ? "white" : "none"} /> Conversation
          </button>
        </div>

        {/* 📦 CONTENT AREA */}
        <div className="min-h-[500px]">
          <AnimatePresence mode="wait">
            
            {activeTab === "wishlist" ? (
              <motion.div 
                key="wishlist"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {/* Real Context Property Card */}
                <div className="bg-white rounded-[2rem] overflow-hidden border border-slate-100 group shadow-sm hover:shadow-xl transition-all duration-500">
                  <div className="h-56 overflow-hidden relative">
                    <img src="https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800" className="w-full h-full object-cover group-hover:scale-110 transition-all duration-500" alt="Home" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                    <div className="absolute bottom-4 left-4">
                      <p className="text-[9px] font-black text-blue-400 uppercase tracking-[0.3em]">Exclusive Villa</p>
                      <h4 className="text-white font-black text-lg tracking-tight uppercase italic">Aura Penthouse</h4>
                    </div>
                    <button className="absolute top-4 right-4 bg-white/10 backdrop-blur-md p-2 rounded-xl text-white hover:bg-red-500 transition-colors shadow-lg border border-white/20"><Trash2 size={16}/></button>
                  </div>
                  <div className="p-6">
                    <div className="flex justify-between items-center pb-4 border-b border-slate-50 mb-4">
                      <span className="text-xl font-black text-slate-900 italic tracking-tighter">₹4.25 Cr</span>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1"><MapPin size={10}/> Satellite</span>
                    </div>
                    <button className="w-full bg-slate-900 text-white py-4 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-blue-600 transition-all flex items-center justify-center gap-2 group">
                      Check Details <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform"/>
                    </button>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div 
                key="chat"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="max-w-4xl mx-auto bg-white rounded-[2.5rem] border border-slate-100 shadow-2xl overflow-hidden h-[600px] flex flex-col"
              >
                {/* Professional Chat UI */}
                <div className="px-10 py-8 bg-slate-900 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center text-white font-black text-sm shadow-2xl shadow-blue-500/50 italic">LL</div>
                    <div>
                      <h4 className="text-white text-[11px] font-black uppercase tracking-[0.3em]">LuxeLair Concierge</h4>
                      <div className="flex items-center gap-1 mt-1"><div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div><p className="text-blue-400 text-[9px] font-bold uppercase">Online Support</p></div>
                    </div>
                  </div>
                </div>

                <div className="flex-1 p-10 overflow-y-auto space-y-8 bg-[#FBFBFC]">
                  <div className="flex gap-4">
                    <div className="bg-white p-6 rounded-[1.8rem] rounded-tl-none shadow-sm border border-slate-100 max-w-[85%]">
                      <p className="text-[11px] font-medium text-slate-600 leading-relaxed italic">
                        Namaste! <span className="font-black text-slate-900">{user.user_metadata?.full_name?.split(' ')[0]}</span>, LuxeLair VIP support mein aapka swagat hai. Aapki property inquiries ya kisi bhi help ke liye hum yahan hain.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-8 bg-white border-t border-slate-50 flex gap-4">
                  <input type="text" placeholder="Type your message..." className="flex-1 bg-slate-50 rounded-2xl px-8 py-5 text-xs font-bold outline-none border border-slate-100 focus:border-blue-600 transition-all placeholder:text-slate-300" />
                  <button className="bg-slate-900 text-white p-5 rounded-2xl hover:bg-blue-600 transition-all shadow-xl active:scale-95 flex items-center justify-center"><Send size={22} /></button>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </div>
    </main>
  );
}

// ArrowRight as simple icon if not imported
const ArrowRight = ({ size, className }: any) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M5 12h14m-7-7 7 7-7 7"/>
  </svg>
);