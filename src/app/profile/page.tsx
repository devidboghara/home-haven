"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Navbar from "@/components/Navbar";
import { motion } from "framer-motion";
import { MessageSquare, Heart, Settings, Send, User as UserIcon } from "lucide-react";

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [activeTab, setActiveTab] = useState("chat");

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      if (user) fetchMessages();
    };
    fetchUser();
  }, []);

  const fetchMessages = async () => {
    const { data } = await supabase.from('messages').select('*').order('created_at', { ascending: true });
    if (data) setMessages(data);
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    const { error } = await supabase.from('messages').insert([{ message: newMessage, sender_id: user.id }]);
    if (!error) {
      setNewMessage("");
      fetchMessages();
    }
  };

  if (!user) return <div className="h-screen flex items-center justify-center font-black uppercase tracking-widest text-slate-300 animate-pulse">Authenticating...</div>;

  return (
    <main className="min-h-screen bg-[#F8FAFC] pt-32 px-6 pb-20">
      <Navbar />
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-10">
        
        {/* SIDEBAR */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm text-center">
            <div className="w-20 h-20 bg-blue-600 rounded-3xl mx-auto mb-4 flex items-center justify-center text-white">
               <UserIcon size={32}/>
            </div>
            <h3 className="font-black text-slate-900 uppercase italic leading-none">{user.user_metadata?.full_name || "Luxe User"}</h3>
            <p className="text-[10px] font-bold text-slate-400 mt-2 uppercase tracking-widest">{user.email}</p>
          </div>

          <div className="bg-white p-4 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col gap-2">
            {[
              { id: "chat", label: "Inquiries & Chat", icon: <MessageSquare size={16}/> },
              { id: "favs", label: "My Wishlist", icon: <Heart size={16}/> },
              { id: "settings", label: "Account Settings", icon: <Settings size={16}/> }
            ].map(item => (
              <button key={item.id} onClick={() => setActiveTab(item.id)} className={`flex items-center gap-4 p-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === item.id ? "bg-slate-900 text-white" : "text-slate-400 hover:bg-slate-50"}`}>
                {item.icon} {item.label}
              </button>
            ))}
          </div>
        </div>

        {/* CONTENT AREA */}
        <div className="lg:col-span-3 bg-white rounded-[3rem] border border-slate-100 shadow-2xl overflow-hidden flex flex-col min-h-[600px]">
          {activeTab === "chat" ? (
            <>
              <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-900 text-white">
                <h2 className="font-black uppercase italic tracking-tighter">Direct Chat with Admin</h2>
                <div className="w-2 h-2 bg-green-500 rounded-full animate-ping"></div>
              </div>

              <div className="flex-1 p-8 overflow-y-auto space-y-6 bg-slate-50/50">
                {messages.map((msg, i) => (
                  <div key={i} className={`flex ${msg.sender_id === user.id ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-[70%] p-4 rounded-2xl text-xs font-bold ${msg.sender_id === user.id ? "bg-blue-600 text-white rounded-tr-none" : "bg-white text-slate-600 border border-slate-100 rounded-tl-none"}`}>
                      {msg.message}
                    </div>
                  </div>
                ))}
              </div>

              <form onSubmit={sendMessage} className="p-6 bg-white border-t border-slate-100 flex gap-4">
                <input type="text" value={newMessage} onChange={(e) => setNewMessage(e.target.value)} placeholder="Type your message..." className="flex-1 bg-slate-50 p-4 rounded-2xl outline-none font-bold text-xs border border-slate-100 focus:border-blue-600"/>
                <button type="submit" className="bg-blue-600 text-white p-4 rounded-2xl hover:bg-slate-900 transition-all">
                  <Send size={20}/>
                </button>
              </form>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center flex-col text-slate-300">
               <Heart size={48} className="mb-4 opacity-20"/>
               <p className="font-black uppercase text-[10px] tracking-[0.3em]">No saved properties yet</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}