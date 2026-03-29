"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Mail, Lock, User as UserIcon, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    if (isLogin) {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (!error) router.push("/");
      else alert(error.message);
    } else {
      const { data, error } = await supabase.auth.signUp({ 
        email, 
        password,
        options: { data: { full_name: fullName } }
      });
      if (!error) alert("Check your email for verification!");
      else alert(error.message);
    }
    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-[#F8FAFC] flex items-center justify-center px-6 py-20">
      <Link href="/" className="absolute top-10 left-10 flex items-center gap-2 text-[10px] font-black uppercase text-slate-400 tracking-widest">
        <ArrowLeft size={14}/> Back to Home
      </Link>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md bg-white p-10 rounded-[2.5rem] shadow-2xl border border-slate-100">
        <div className="text-center mb-10">
          <div className="inline-flex p-3 bg-blue-50 text-blue-600 rounded-2xl mb-4">
            <Sparkles size={24}/>
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tighter uppercase italic">
            {isLogin ? "Welcome Back" : "Join the Elite"}
          </h1>
          <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mt-2">
            {isLogin ? "Access your premium listings" : "Start your luxury journey with us"}
          </p>
        </div>

        <form onSubmit={handleAuth} className="space-y-4">
          {!isLogin && (
            <div className="relative">
              <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16}/>
              <input required type="text" placeholder="Full Name" value={fullName} onChange={(e) => setFullName(e.target.value)} className="w-full p-4 pl-12 bg-slate-50 border border-slate-100 rounded-2xl outline-none font-bold text-xs focus:border-blue-600 transition-all"/>
            </div>
          )}
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16}/>
            <input required type="email" placeholder="Email Address" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full p-4 pl-12 bg-slate-50 border border-slate-100 rounded-2xl outline-none font-bold text-xs focus:border-blue-600 transition-all"/>
          </div>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16}/>
            <input required type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full p-4 pl-12 bg-slate-50 border border-slate-100 rounded-2xl outline-none font-bold text-xs focus:border-blue-600 transition-all"/>
          </div>

          <button disabled={loading} className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl hover:bg-blue-600 transition-all mt-4">
            {loading ? "Processing..." : isLogin ? "Sign In" : "Create Account"}
          </button>
        </form>

        <div className="mt-8 text-center">
          <button onClick={() => setIsLogin(!isLogin)} className="text-[10px] font-black uppercase text-blue-600 tracking-widest">
            {isLogin ? "Don't have an account? Sign Up" : "Already a member? Login"}
          </button>
        </div>
      </motion.div>
    </main>
  );
}