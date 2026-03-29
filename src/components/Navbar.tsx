"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { User, LogOut, MessageSquare, Heart, Home as HomeIcon } from "lucide-react";

export default function Navbar() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
    };
    getUser();
  }, []);

  const signInWithGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin }
    });
  };

  return (
    <nav className="fixed top-0 w-full z-[100] px-6 py-4 flex justify-between items-center bg-white/90 backdrop-blur-md border-b border-slate-200">
      <div className="flex items-center gap-8">
        <Link href="/" className="text-2xl font-black italic tracking-tighter uppercase text-slate-900">
          Luxe<span className="text-blue-600">Lair.</span>
        </Link>
        {/* Home Button for Explore/Profile Pages */}
        <Link href="/" className="hidden md:flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-blue-600 transition-all">
          <HomeIcon size={14}/> Home
        </Link>
      </div>

      <div className="flex items-center gap-6">
        <Link href="/explore" className="text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-blue-600">Explore</Link>
        
        {user ? (
          <div className="group relative flex items-center gap-3 cursor-pointer bg-slate-100 px-4 py-2 rounded-full border border-slate-200">
            <img src={user.user_metadata.avatar_url} className="w-6 h-6 rounded-full" alt="Profile" />
            <span className="text-[10px] font-black uppercase text-slate-900">{user.user_metadata.full_name?.split(' ')[0]}</span>
            
            <div className="absolute top-full right-0 mt-2 w-48 bg-white shadow-2xl rounded-2xl border border-slate-100 p-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
               <Link href="/profile" className="flex items-center gap-3 p-3 hover:bg-slate-50 rounded-xl text-[10px] font-black uppercase text-slate-600"><MessageSquare size={14}/> Dashboard</Link>
               <button onClick={() => supabase.auth.signOut().then(() => window.location.reload())} className="w-full flex items-center gap-3 p-3 hover:bg-red-50 rounded-xl text-[10px] font-black uppercase text-red-500 mt-2 border-t border-slate-50">
                 <LogOut size={14}/> Logout
               </button>
            </div>
          </div>
        ) : (
          <button onClick={signInWithGoogle} className="bg-slate-900 text-white px-6 py-3 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-blue-600 transition-all">
            Sign In with Google
          </button>
        )}
      </div>
    </nav>
  );
}