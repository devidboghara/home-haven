"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Navbar from "@/components/Navbar";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, Heart, Settings, Send, Grid, Bookmark, CheckCircle } from "lucide-react";

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("chat");
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");

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
    { label: "Verified", value: "Yes", icon: <CheckCircle size={14}/> }
  ];

  return (
    <main className="min-h-screen bg-white pt-24 md:pt-32 pb-20">
      <Navbar />
      <div className="max-w-4xl mx-auto px-6">
        
        {/* INSTAGRAM STYLE HEADER */}
        <header className="flex flex-col md:flex-row items-center gap-10 mb-12 border-b border-slate-100 pb-12">
          <div className="relative">
            <div className="w-24 h-24 md:w-40 md:h-40 rounded-full border-2 border-slate-100 p-1">
               <img 
                 src={user.user_metadata?.avatar_url || "https://ui-avatars.com/api/?name=User"} 
                 className="w-full h-full rounded-full object-cover shadow-xl" 
                 alt="Profile" 
               />
            </div>
          </div>

          <div className="flex-1 text-center md:text-left">
            <div className="flex flex-col md:flex-row items-center gap-6 mb-6">
              <h2 className="text-2xl font-light text-slate-900 tracking-tight">{user.user_metadata?.full_name || "Premium Member"}</h2>
              <div className="flex gap-2">
                 <button className="px-6 py-2 bg-slate-900 text-white rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-blue-600 transition-all shadow-lg">Edit Profile</button>
                 <button className="p-2 border border-slate-200 rounded-lg hover:bg-slate-50 transition-all"><Settings size={16}/></button>
              </div>
            </div>

            <div className="flex justify-center md:justify-start gap-10">
              {stats.map((s, i) => (
                <div key={i} className="flex flex-col md:flex-row items-center gap-2">
                  <span className="font-black text-slate-900">{s.value}</span>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">{s.icon} {s.label}</span>
                </div>
              ))}
            </div>

            <p className="mt-6 text-xs font-medium text-slate-500 max-w-sm leading-relaxed">
              Exclusively searching for Luxury Penthouses and Villas in Ahmedabad. <br/>
              <span className="text-blue-600 font-bold">#LuxeLairElite</span>
            </p>
          </div>
        </header>

        {/* TABS NAVIGATION */}
        <div className="flex justify-center border-t border-slate-100 -mt-12 mb-8">
           <div className="flex gap-12">
              {[
                { id: "chat", label: "Messages", icon: <MessageSquare size={16}/> },
                { id: "favs", label: "Favorites", icon: <Heart size={16}/> },
                { id: "activity", label: "Activity", icon: <Grid size={16}/> }
              ].map(tab => (
                <button 
                  key={tab.id} 
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 py-4 border-t-2 transition-all text-[10px] font-black uppercase tracking-[0.2em] ${activeTab === tab.id ? "border-slate-900 text-slate-900" : "border-transparent text-slate-400"}`}
                >
                  {tab.icon} {tab.label}
                </button>
              ))}
           </div>
        </div>

        {/* CONTENT AREA */}
        <section className="min-h-[400px]">
           <AnimatePresence mode="wait">
             {activeTab === "chat" ? (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-2xl mx-auto bg-slate-50 rounded-[2rem] overflow-hidden border border-slate-100 shadow-sm flex flex-col h-[500px]">
                   <div className="p-4 bg-white border-b border-slate-100 flex items-center gap-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-[10px] font-black uppercase text-slate-400">Concierge Support</span>
                   </div>
                   
                   <div className="flex-1 p-6 overflow-y-auto space-y-4">
                      <div className="flex justify-start">
                         <div className="bg-white p-4 rounded-2xl rounded-tl-none border border-slate-200 text-[11px] font-medium text-slate-600 max-w-[80%]">
                           Welcome to LuxeLair! How can we help you with your property search today?
                         </div>
                      </div>
                   </div>

                   <div className="p-4 bg-white flex gap-3">
                      <input type="text" placeholder="Send a message..." className="flex-1 bg-slate-50 p-3 rounded-xl outline-none text-xs font-bold border border-slate-100 focus:border-blue-600"/>
                      <button className="bg-slate-900 text-white p-3 rounded-xl hover:bg-blue-600 transition-all"><Send size={18}/></button>
                   </div>
                </motion.div>
             ) : (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-3 gap-1 md:gap-4">
                   {/* Empty State Grid */}
                   {[1,2,3,4,5,6].map(i => (
                     <div key={i} className="aspect-square bg-slate-100 rounded-lg animate-pulse flex items-center justify-center">
                        <Bookmark size={24} className="text-slate-200" />
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