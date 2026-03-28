import Image from "next/image";
import { MapPin, Star } from "lucide-react";

export default function PropertyCard({ title, price, location, rating, image }: any) {
  return (
    <div className="group bg-white rounded-[1.5rem] p-2 shadow-sm border border-slate-100 hover:shadow-xl transition-all duration-300 active:scale-95 cursor-pointer">
      {/* Image Container */}
      <div className="relative aspect-[4/3] rounded-[1.2rem] overflow-hidden bg-slate-100">
        <img 
          src={image || "https://images.unsplash.com/photo-1564013799919-ab600027ffc6"} 
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute top-2 right-2 z-20 bg-white/90 backdrop-blur-md px-2 py-1 rounded-lg flex items-center gap-1 shadow-sm">
          <Star className="size-3 text-yellow-500 fill-yellow-500" />
          <span className="text-[10px] font-bold text-slate-700">{rating}</span>
        </div>
      </div>

      {/* Content */}
      <div className="mt-3 px-2 pb-2">
        <div className="flex flex-col">
          <span className="text-[#0051A1] font-black text-sm tracking-tight">
            ₹{price}
          </span>
          <h3 className="text-[12px] font-bold text-slate-900 truncate mt-0.5 uppercase tracking-tight">
            {title}
          </h3>
        </div>
        
        <div className="flex items-center gap-1 mt-1 opacity-70">
          <MapPin className="size-2.5 text-slate-400" />
          <span className="text-[9px] font-medium text-slate-500 truncate">{location}</span>
        </div>
      </div>
    </div>
  );
}