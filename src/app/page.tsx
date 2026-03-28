import Navbar from "@/components/Navbar";
import PropertyCard from "@/components/PropertyCard";

export default function Home() {
  const listings = [
    { id: 1, title: "Modern Sky Villa", price: "85.5 L", location: "Satellite, Ahmedabad", rating: 4.8 },
    { id: 2, title: "Royal Heritage", price: "1.2 Cr", location: "SG Highway, Ahmedabad", rating: 4.9 },
    { id: 3, title: "Cozy Studio", price: "25.0 L", location: "Bopal, Ahmedabad", rating: 4.5 },
    { id: 4, title: "Green Valley", price: "60.0 L", location: "GIFT City, Gandhinagar", rating: 4.7 },
  ];

  return (
    <main className="min-h-screen bg-[#F8FAFC]">
      <Navbar />

      {/* HERO SECTION - Now with Image, Overlay, and Balanced Height */}
      <section className="relative px-6 py-28 md:py-36 overflow-hidden">
        {/* BACKGROUND IMAGE - Using Unsplash for now */}
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=2000&auto=format&fit=crop')" }}
        />
        
        {/* DARK OVERLAY - To make text readable */}
        <div className="absolute inset-0 z-10 bg-black/60 backdrop-blur-sm" />

        <div className="relative z-20 max-w-4xl mx-auto text-center">
          <span className="inline-block px-4 py-1.5 mb-6 text-[10px] font-bold tracking-widest text-blue-100 uppercase bg-blue-600/30 backdrop-blur-md rounded-full border border-blue-400/20">
            Premium Real Estate Experience
          </span>
          <h2 className="text-4xl md:text-6xl font-black text-white leading-[1.1] tracking-tight">
            Find your <span className="text-blue-300">Perfect Haven</span> <br /> without the hassle.
          </h2>
          <p className="mt-6 text-sm md:text-lg text-slate-100 max-w-2xl mx-auto font-light leading-relaxed opacity-95">
            "The magic of a home is that it feels like the world is standing still."
          </p>
          
          {/* MODERN SEARCH BAR (Glassmorphism Effect) */}
          <div className="mt-12 flex flex-col md:flex-row gap-2 p-2.5 bg-white/10 backdrop-blur-2xl rounded-[3rem] border border-white/10 shadow-2xl">
            <input 
              type="text" 
              placeholder="Search by City or Locality..." 
              className="flex-1 px-8 py-5 rounded-[2.5rem] bg-white text-slate-900 focus:outline-none placeholder:text-slate-400 text-sm md:text-base font-semibold"
            />
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-5 rounded-[2.5rem] font-bold transition-all shadow-xl active:scale-95 text-sm uppercase tracking-wider">
              Search Now
            </button>
          </div>
        </div>
      </section>

      {/* GRID SECTION - Mobile 2 Columns (Rest remains same) */}
      <section className="px-4 py-12 md:py-16 max-w-7xl mx-auto">
        <div className="flex justify-between items-end mb-8 px-2 border-b border-slate-100 pb-4">
          <div>
            <h3 className="text-2xl font-black text-slate-900">Featured Homes</h3>
            <p className="text-sm text-slate-500 font-medium">Handpicked properties just for you</p>
          </div>
          <button className="text-xs font-bold text-blue-600 bg-blue-50 px-4 py-2 rounded-full hover:bg-blue-100 transition-colors">View All</button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 px-1">
          {listings.map((item) => (
            <PropertyCard 
              key={item.id}
              title={item.title}
              price={item.price}
              location={item.location}
              rating={item.rating}
            />
          ))}
        </div>
      </section>
    </main>
  );
}