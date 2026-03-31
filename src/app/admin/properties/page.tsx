"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Plus, Edit2, Trash2, ExternalLink, MapPin, IndianRupee } from "lucide-react";

export default function AdminInventory() {
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchInventory() {
      const { data } = await supabase.from('properties').select('*');
      if (data) setProperties(data);
      setLoading(false);
    }
    fetchInventory();
  }, []);

  return (
    <div className="p-8 max-w-[1400px]">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-[#111] tracking-tight">Luxe Inventory</h1>
          <p className="text-xs text-[#999] uppercase tracking-widest mt-1">Manage your active property listings</p>
        </div>
        <button className="bg-[#111] text-white px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-widest flex items-center gap-2 hover:bg-blue-600 transition-all shadow-lg shadow-black/10">
          <Plus size={16} /> Add New Listing
        </button>
      </div>

      {/* 📊 INVENTORY TABLE (Industrial Style) */}
      <div className="bg-white border border-[#E5E5E0] rounded-2xl overflow-hidden shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#F9F9F7] border-b border-[#E5E5E0]">
              <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-[#999]">Property Detail</th>
              <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-[#999]">Location</th>
              <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-[#999]">Price</th>
              <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-[#999]">Status</th>
              <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-[#999]">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F0F0EE]">
            {properties.map((p) => (
              <tr key={p.id} className="hover:bg-[#FCFCFA] transition-colors group">
                <td className="px-6 py-5">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg bg-slate-100 overflow-hidden">
                      <img src={p.main_image} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <p className="text-[13px] font-bold text-[#111]">{p.title}</p>
                      <p className="text-[10px] text-[#AAA] uppercase font-medium">{p.type || 'Villa'}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-5">
                  <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#666]">
                    <MapPin size={12} className="text-blue-500" /> {p.location}
                  </div>
                </td>
                <td className="px-6 py-5 text-[12px] font-black text-[#111] italic">
                  ₹{p.price} Cr
                </td>
                <td className="px-6 py-5">
                  <span className="px-3 py-1 bg-green-50 text-green-600 text-[9px] font-black uppercase rounded-full tracking-widest">
                    Available
                  </span>
                </td>
                <td className="px-6 py-5">
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-2 hover:bg-blue-50 text-blue-600 rounded-md transition-all"><Edit2 size={14}/></button>
                    <button className="p-2 hover:bg-red-50 text-red-500 rounded-md transition-all"><Trash2 size={14}/></button>
                    <button className="p-2 hover:bg-slate-100 text-slate-400 rounded-md transition-all"><ExternalLink size={14}/></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}