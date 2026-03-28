import Link from "next/link";
import { MapPin, Star } from "lucide-react";

// Props mein 'image' hi rehne do, par database se hum 'main_image' bhejenge
export default function PropertyCard({ id, title, price, location, rating, image }: any) {
  return (
    <Link href={`/property/${id}`}>
      <div className="group bg-white rounded-[2rem] p-2 shadow-sm border border-slate-100 hover:shadow-xl transition-all duration-300 active:scale-95 cursor-pointer">
        
        {/* IMAGE SECTION */}
        <div className="relative aspect-[4/3] rounded-[1.8rem] overflow-hidden bg-slate-100">
          <img 
            src={image || "https://images.unsplash.com/photo-1564013799919-ab600027ffc6"} 
            alt={title}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute top-3 right-3 z-10 bg-white/90 backdrop-blur-md px-2 py-1 rounded-lg flex items-center gap-1 shadow-sm">
            <Star className="size-3 text-yellow-500 fill-yellow-500" />
            <span className="text-[10px] font-black text-slate-700">{rating || "4.9"}</span>
          </div>
        </div>

        {/* DETAILS SECTION */}
        <div className="mt-4 px-3 pb-3">
          <div className="flex flex-col">
            <span className="text-[#0051A1] font-black text-lg italic tracking-tighter leading-none">
              ₹{price}
            </span>
            <h3 className="text-[13px] font-black text-slate-900 truncate mt-2 uppercase tracking-tight">
              {title}
            </h3>
          </div>
          
          <div className="flex items-center gap-1 mt-2 opacity-60">
            <MapPin className="size-3 text-slate-400" />
            <span className="text-[10px] font-bold text-slate-500 truncate">{location}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}