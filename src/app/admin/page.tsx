"use client";

import { motion } from "framer-motion";
import { 
  Users, TrendingUp, IndianRupee, Target, Eye, 
  MapPin, Clock, MoreVertical, MessageSquare, 
  CheckCircle, AlertCircle, Calendar 
} from "lucide-react";

const columns = [
  { title: "New Opportunities", color: "border-t-purple-500", count: 4, bg: "bg-purple-50" },
  { title: "Site Viewing", color: "border-t-orange-500", count: 12, bg: "bg-orange-50" },
  { title: "Negotiation", color: "border-t-blue-500", count: 3, bg: "bg-blue-50" },
  { title: "Closing & Legal", color: "border-t-green-500", count: 5, bg: "bg-green-50" },
];

export default function AdminPage() {
  return (
    <div className="space-y-10">
      
      {/* 🚀 CONSOLE DASHBOARD HEADER */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black text-slate-900 uppercase italic tracking-tighter leading-none">Deals Pipeline</h1>
          <p className="text-[10px] font-black text-slate-400 mt-3 uppercase tracking-[0.4em]">Advanced CRM Portfolio Management Console</p>
        </div>
        <div className="flex gap-4">
          <div className="flex -space-x-3">
             {[1,2,3,4].map(i => <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-slate-200 flex items-center justify-center text-[10px] font-black uppercase italic">A{i}</div>)}
             <div className="w-8 h-8 rounded-full border-2 border-white bg-slate-900 text-white flex items-center justify-center text-[10px] font-black">+5</div>
          </div>
        </div>
      </div>

      {/* 📊 KPI ROW: BUSINESS INTELLIGENCE */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Stat icon={<IndianRupee size={14}/>} title="Asset Vol." value="24.5M" trend="+12.5%" />
        <Stat icon={<TrendingUp size={14}/>} title="Est. Commission" value="₹4.90L" trend="+8.2%" />
        <Stat icon={<Eye size={14}/>} title="Viewings" value="120" trend="+40" />
        <Stat icon={<Target size={14}/>} title="Closure Rate" value="12.8%" trend="+0.4%" />
      </div>

      {/* 📦 KANBAN INTERFACE */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8 h-full overflow-hidden">
        {columns.map((col, i) => (
          <div key={i} className="flex flex-col min-h-[600px]">
            <div className={`flex items-center justify-between mb-6 p-4 bg-white border-t-4 ${col.color} rounded-2xl shadow-sm`}>
              <h3 className="text-[11px] font-black uppercase text-slate-900 tracking-widest italic">{col.title}</h3>
              <span className={`px-3 py-1 rounded-full text-[10px] font-black ${col.bg} text-slate-600`}>{col.count}</span>
            </div>

            <div className="space-y-5">
              <DealCard 
                property="Modern Villa" 
                location="Satellite, Ahmedabad" 
                price="₹4.50 Cr" 
                client="Aarav Shah" 
                status="High Priority"
                date="Today, 04:30 PM"
              />
              <DealCard 
                property="Aura Penthouse" 
                location="Bopal" 
                price="₹2.80 Cr" 
                client="Rahul Mehta" 
                status="Site Visit Done"
                date="28 Mar, 11:20 AM"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Stat({ title, value, icon, trend }: any) {
  return (
    <div className="bg-white border border-slate-100 p-6 rounded-[2rem] shadow-sm group hover:border-blue-200 transition-all">
      <div className="flex justify-between items-start mb-4">
        <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl group-hover:bg-blue-600 group-hover:text-white transition-all">
          {icon}
        </div>
        <span className="text-[9px] font-black text-green-500 bg-green-50 px-2 py-1 rounded-lg uppercase">{trend}</span>
      </div>
      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{title}</p>
      <h2 className="text-2xl font-black text-slate-900 mt-1 italic tracking-tighter uppercase">{value}</h2>
    </div>
  );
}

function DealCard({ property, location, price, client, status, date }: any) {
  return (
    <motion.div whileHover={{ y: -5 }} className="bg-white p-5 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all group">
      <div className="flex gap-4 mb-5">
        <div className="w-16 h-16 bg-slate-100 rounded-2xl overflow-hidden shrink-0 group-hover:scale-105 transition-transform duration-500">
           <img src="https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=400" className="w-full h-full object-cover" />
        </div>
        <div>
          <div className="flex items-center gap-1 text-[9px] font-black text-blue-600 uppercase tracking-widest mb-1">
             <MapPin size={10} /> {location}
          </div>
          <h4 className="text-[12px] font-black text-slate-900 uppercase italic tracking-tighter leading-none">{property}</h4>
          <p className="text-[11px] font-black text-slate-400 mt-2 uppercase tracking-tight">{price}</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between pt-4 border-t border-slate-50">
           <div className="flex items-center gap-2">
             <div className="w-6 h-6 rounded-full bg-slate-900 text-white text-[8px] font-black flex items-center justify-center">AS</div>
             <span className="text-[10px] font-bold text-slate-600 tracking-tight">{client}</span>
           </div>
           <button className="text-slate-300 hover:text-slate-900"><MoreVertical size={16}/></button>
        </div>

        <div className="flex items-center justify-between">
           <span className="text-[8px] font-black text-blue-500 bg-blue-50 px-3 py-1 rounded-full uppercase tracking-widest">{status}</span>
           <div className="flex items-center gap-1 text-[8px] font-bold text-slate-300">
              <Clock size={10} /> {date}
           </div>
        </div>
      </div>
    </motion.div>
  );
}