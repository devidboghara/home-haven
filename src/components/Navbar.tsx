"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { User, LogOut, MessageSquare, Heart } from "lucide-react";

export default function Navbar() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
    };
    getUser();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.reload();
  };

  return (
    <nav className="fixed top-0 w-full z-[100] px-6 py-4 flex justify-between items-center bg-white/80 backdrop-blur-xl border-b border-slate-100">
      <Link href="/" className="text-2xl font-black italic tracking-tighter uppercase">
        Luxe<span className="text-blue-600">Lair.</span>
      </Link>

      <div className="flex items-center gap-6">
        <Link href="/explore" className="text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-blue-600 transition-all">Explore</Link>
        
        {user ? (
          <div className="group relative flex items-center gap-2 cursor-pointer bg-slate-50 px-3 py-2 rounded-xl border border-slate-200">
            <User size={16} className="text-blue-600" />
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-900">Account</span>
            
            {/* DROPDOWN */}
            <div className="absolute top-full right-0 mt-2 w-48 bg-white shadow-2xl rounded-2xl border border-slate-100 p-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
               <Link href="/profile" className="flex items-center gap-3 p-3 hover:bg-slate-50 rounded-xl text-[10px] font-black uppercase text-slate-600">
                 <MessageSquare size={14}/> My Chats
               </Link>
               <Link href="/profile" className="flex items-center gap-3 p-3 hover:bg-slate-50 rounded-xl text-[10px] font-black uppercase text-slate-600">
                 <Heart size={14}/> Favorites
               </Link>
               <button onClick={handleLogout} className="w-full flex items-center gap-3 p-3 hover:bg-red-50 rounded-xl text-[10px] font-black uppercase text-red-500 border-t border-slate-50 mt-2">
                 <LogOut size={14}/> Logout
               </button>
            </div>
          </div>
        ) : (
          <Link href="/login" className="bg-slate-900 text-white px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-600 transition-all">
            Login
          </Link>
        )}
      </div>
    </nav>
  );
}