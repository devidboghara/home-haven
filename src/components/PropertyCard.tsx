import Image from "next/image";
import { MapPin, Star } from "lucide-react"; // Icons ke liye

export default function PropertyCard({ title, price, location, rating }: any) {
  return (
    <div className="group bg-white rounded-[2rem] p-2 shadow-sm border border-slate-100 hover:shadow-md transition-all active:scale-95">
      {/* Image Container - Aspect Square for 2-column grid */}
      <div className="relative aspect-square rounded-[1.8rem] overflow-hidden bg-slate-100">
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent z-10" />
        <div className="absolute top-2 right-2 z-20 bg-white/80 backdrop-blur-md px-2 py-1 rounded-xl flex items-center gap-1">
          <Star className="size-3 text-yellow-500 fill-yellow-500" />
          <span className="text-[10px] font-bold text-slate-700">{rating}</span>
        </div>
        {/* Placeholder Box - Baad mein Image tag se replace karenge */}
        <div className="w-full h-full bg-blue-50 flex items-center justify-center text-blue-300 font-bold text-xs">
          LuxeLair
        </div>
      </div>

      {/* Content */}
      <div className="mt-3 px-2 pb-2">
        <div className="flex flex-col">
          <span className="text-blue-600 font-extrabold text-sm tracking-tight">
            ₹{price}
          </span>
          <h3 className="text-[11px] font-semibold text-slate-800 truncate mt-0.5">
            {title}
          </h3>
        </div>
        
        <div className="flex items-center gap-1 mt-1 opacity-70">
          <MapPin className="size-2.5 text-slate-400" />
          <span className="text-[9px] text-slate-500 truncate">{location}</span>
        </div>
      </div>
    </div>
  );
}