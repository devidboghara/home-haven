"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Navbar from "@/components/Navbar";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, Heart, Settings, Send, Grid, Bookmark, CheckCircle, LayoutGrid } from "lucide-react";

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("chat");

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    fetchUser();
  }, []);

  if (!user) return <div className="h-screen flex items-center justify-center font-black text-slate-200 uppercase tracking-[0.5em] animate-pulse">LuxeLair...</div>;

  const stats = [
    { label: "Saved", value: "12", icon: <Bookmark size={14}/> },
    { label: "Inquiries", value: "04", icon: <MessageSquare size={14}/> },
    { label: "Verified", value: "Yes", icon: <CheckCircle size={14} className="text-blue-500"/> }
  ];

  return (
    <main className="min-h-screen bg-white pt-24 md:pt-32 pb-20">
      <Navbar />
      <div className="max-w-4xl mx-auto px-6">
        
        {/* HEADER */}
        <header className="flex flex-col md:flex-row items-center gap-10 mb-16">
          <div className="relative group">
            <div className="w-24 h-24 md:w-40 md:h-40 rounded-full bg-gradient-to-tr from-blue-600 to-blue-400 p-[3px]">
               <div className="w-full h-full bg-white rounded-full p-1">
                 <img 
                   src={user.user_metadata?.avatar_url || "https://ui-avatars.com/api/?name=User"} 
                   className="w-full h-full rounded-full object-cover" 
                   alt="Profile" 
                 />
               </div>
            </div>
          </div>

          <div className="flex-1">
            <div className="flex flex-col md:flex-row items-center gap-6 mb-6">
              <h2 className="text-xl font-medium text-slate-900">{user.user_metadata?.full_name || "Premium Member"}</h2>
              <div className="flex gap-2">
                 <button className="px-5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-900 rounded-lg text-[11px] font-bold transition-all">Edit profile</button>
                 <button className="px-5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-900 rounded-lg text-[11px] font-bold transition-all">View archive</button>
                 <button className="p-1.5"><Settings size={20}/></button>
              </div>
            </div>

            <div className="flex gap-8 mb-6">
              {stats.map((s, i) => (
                <div key={i} className="flex gap-1.5 items-center">
                  <span className="font-bold text-slate-900">{s.value}</span>
                  <span className="text-sm text-slate-500">{s.label}</span>
                </div>
              ))}
            </div>

            <p className="text-sm font-semibold text-slate-900">Elite Investor</p>
            <p className="text-sm text-slate-500 max-w-sm">Exploring high-end real estate in Ahmedabad. VIP member since 2026.</p>
          </div>
        </header>

        {/* TAB BAR */}
        <div className="flex justify-center border-t border-slate-200">
           <div className="flex gap-16">
              {[
                { id: "activity", label: "POSTS", icon: <LayoutGrid size={12}/> },
                { id: "chat", label: "MESSAGES", icon: <MessageSquare size={12}/> },
                { id: "favs", label: "SAVED", icon: <Bookmark size={12}/> }
              ].map(tab => (
                <button 
                  key={tab.id} 
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-1.5 py-4 border-t transition-all text-[11px] font-bold tracking-widest ${activeTab === tab.id ? "border-slate-900 text-slate-900" : "border-transparent text-slate-400"}`}
                >
                  {tab.icon} {tab.label}
                </button>
              ))}
           </div>
        </div>

        {/* CONTENT */}
        <section className="py-8 min-h-[400px]">
           <AnimatePresence mode="wait">
             {activeTab === "chat" ? (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="max-w-2xl mx-auto border border-slate-200 rounded-xl overflow-hidden h-[500px] flex flex-col shadow-sm">
                   <div className="p-4 border-b border-slate-200 font-bold text-center text-sm">Concierge Support</div>
                   <div className="flex-1 p-6 bg-white overflow-y-auto space-y-4">
                      <div className="flex gap-3">
                         <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-[10px] font-black">LL</div>
                         <div className="bg-slate-100 p-3 rounded-2xl rounded-tl-none text-xs text-slate-700 max-w-[80%]">
                           Hello! Welcome to LuxeLair Elite Concierge. How can we assist with your property search?
                         </div>
                      </div>
                   </div>
                   <div className="p-4 border-t border-slate-200 flex gap-4">
                      <input type="text" placeholder="Message..." className="flex-1 text-sm outline-none px-2"/>
                      <button className="text-blue-500 font-bold text-sm hover:text-blue-700">Send</button>
                   </div>
                </motion.div>
             ) : (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-3 gap-1 md:gap-2">
                   {[1,2,3].map(i => (
                     <div key={i} className="aspect-square bg-slate-50 border border-slate-100 flex items-center justify-center group cursor-pointer relative">
                        <Bookmark size={24} className="text-slate-200 group-hover:scale-110 transition-transform" />
                        <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-all"></div>
                     </div>
                   ))}
                </motion.div>
             )}
           </AnimatePresence>
        </section>
      </div>
    </main>
  );
}