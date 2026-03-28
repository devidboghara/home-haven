import Link from "next/link";
import { MapPin, Star } from "lucide-react";

export default function PropertyCard({ id, title, price, location, rating, image }: any) {
  return (
    // ID ke basis par dynamic link banaya
    <Link href={`/property/${id}`}>
      <div className="group bg-white rounded-3xl p-2 shadow-sm border border-slate-100 hover:shadow-xl transition-all duration-300 active:scale-95 cursor-pointer">
        <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-slate-200">
          <img 
            src={image} 
            alt={title}
            loading="lazy" // Performance fix
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute top-2 right-2 z-10 bg-white/90 backdrop-blur-md px-2 py-1 rounded-lg flex items-center gap-1 shadow-sm">
            <Star className="size-3 text-yellow-500 fill-yellow-500" />
            <span className="text-[10px] font-bold text-slate-700">{rating}</span>
          </div>
        </div>

        <div className="mt-3 px-2 pb-2">
          <span className="text-[#0051A1] font-black text-sm italic">₹{price}</span>
          <h3 className="text-[12px] font-extrabold text-slate-900 truncate uppercase mt-0.5">{title}</h3>
          <div className="flex items-center gap-1 mt-1 opacity-70">
            <MapPin className="size-2.5 text-slate-400" />
            <span className="text-[9px] font-medium text-slate-500 truncate">{location}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}