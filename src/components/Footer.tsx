import { MapPin, Phone, Mail, Camera, Globe, X, ShieldCheck } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-white pt-20 pb-10 px-6 mt-20">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 border-b border-slate-800 pb-16">
        
        {/* Brand Section */}
        <div className="space-y-6">
          <div className="flex items-center gap-2">
             <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg">
                <span className="text-white font-black text-xs italic">L</span>
             </div>
             <h2 className="text-2xl font-black italic tracking-tighter">Luxe<span className="text-blue-500">Lair.</span></h2>
          </div>
          <p className="text-slate-400 text-sm leading-relaxed font-medium">
            Ahmedabad's most trusted luxury real estate partner. Finding your future haven, one detail at a time.
          </p>
          <div className="flex items-center gap-2 text-blue-400 text-[10px] font-black uppercase tracking-widest">
            <ShieldCheck size={14} /> RERA Registered Properties
          </div>
        </div>

        {/* Navigation */}
        <div>
          <h4 className="font-black mb-8 uppercase text-[10px] tracking-[0.3em] text-blue-500">Navigation</h4>
          <ul className="space-y-4 text-sm text-slate-400 font-bold">
            <li className="hover:text-blue-400 cursor-pointer transition-colors uppercase tracking-tighter">Explore Villas</li>
            <li className="hover:text-blue-400 cursor-pointer transition-colors uppercase tracking-tighter">Luxury Apartments</li>
            <li className="hover:text-blue-400 cursor-pointer transition-colors uppercase tracking-tighter">Our Services</li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="font-black mb-8 uppercase text-[10px] tracking-[0.3em] text-blue-500">Contact</h4>
          <ul className="space-y-5 text-sm text-slate-400 font-bold">
            <li className="flex items-start gap-3 leading-tight">
              <MapPin size={18} className="text-blue-500 shrink-0"/> 
              Satellite, Ahmedabad, GJ
            </li>
            <li className="flex items-center gap-3">
              <Phone size={18} className="text-blue-500"/> 
              +91 98765 43210
            </li>
            <li className="flex items-center gap-3">
              <Mail size={18} className="text-blue-500"/> 
              hello@luxelair.com
            </li>
          </ul>
        </div>

        {/* Socials - ERROR FREE ICONS */}
        <div>
          <h4 className="font-black mb-8 uppercase text-[10px] tracking-[0.3em] text-blue-500">Socials</h4>
          <div className="flex gap-4">
            <div title="Instagram" className="p-3 bg-white/5 rounded-2xl hover:bg-blue-600 transition-all cursor-pointer border border-white/5">
                <Camera size={20}/>
            </div>
            <div title="Website" className="p-3 bg-white/5 rounded-2xl hover:bg-blue-600 transition-all cursor-pointer border border-white/5">
                <Globe size={20}/>
            </div>
            <div title="X" className="p-3 bg-white/5 rounded-2xl hover:bg-blue-600 transition-all cursor-pointer border border-white/5">
                <X size={20}/>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center mt-10 gap-4">
        <p className="text-slate-500 text-[9px] font-black uppercase tracking-[0.4em]">
          © 2026 LuxeLair Real Estate. All Rights Reserved.
        </p>
        <div className="flex gap-6 text-[9px] font-black text-slate-600 uppercase tracking-widest">
           <span className="hover:text-white cursor-pointer">Privacy Policy</span>
           <span className="hover:text-white cursor-pointer">Terms</span>
        </div>
      </div>
    </footer>
  );
}