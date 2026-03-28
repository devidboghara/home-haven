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
    <main className="min-h-screen bg-white">
      <Navbar />

      {/* HERO SECTION */}
      <section className="relative h-[70vh] md:h-[80vh] flex flex-col items-center justify-start overflow-hidden">
        {/* BACKGROUND IMAGE - Crystal Clear (No Blur) */}
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center transition-transform duration-1000 hover:scale-105"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2000&auto=format&fit=crop')" }}
        />
        
        {/* LIGHT OVERLAY - Only for text readability */}
        <div className="absolute inset-0 z-10 bg-black/40" />

        {/* BOTTOM GRADIENT - To fix the Hard-Cut issue */}
        <div className="absolute inset-x-0 bottom-0 h-32 z-20 bg-gradient-to-t from-white to-transparent" />

        <div className="relative z-30 w-full max-w-5xl mx-auto px-6 pt-16 md:pt-24 text-center">
          {/* Quote - Pushed Higher */}
          <p className="mb-4 text-blue-300 text-xs md:text-sm font-bold tracking-[0.3em] uppercase opacity-90">
             "Luxury is in each detail"
          </p>
          <h2 className="text-4xl md:text-7xl font-black text-white leading-[1.1] drop-shadow-2xl">
            Find Your <span className="text-blue-400">Haven</span>
          </h2>
          <p className="mt-4 text-sm md:text-lg text-slate-100 max-w-xl mx-auto font-medium opacity-90">
            The magic of a home is that it feels like the world is standing still.
          </p>
        </div>

        {/* STYLISH SEARCH BAR - Positioned near the bottom (3% gap) */}
        <div className="relative z-30 mt-auto mb-8 w-full max-w-3xl px-6">
          <div className="flex items-center p-1.5 bg-white/20 backdrop-blur-xl rounded-2xl border border-white/30 shadow-2xl overflow-hidden">
            <input 
              type="text" 
              placeholder="Where do you want to live?" 
              className="flex-1 px-6 py-3 md:py-4 rounded-xl bg-white text-slate-900 focus:outline-none placeholder:text-slate-400 text-sm font-semibold"
            />
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 md:px-10 py-3 md:py-4 rounded-xl font-bold transition-all text-xs md:text-sm uppercase tracking-widest ml-2">
              Search
            </button>
          </div>
        </div>
      </section>

      {/* LISTINGS SECTION */}
      <section className="relative z-30 px-4 py-12 max-w-7xl mx-auto">
        <div className="flex justify-between items-end mb-10 px-2">
          <div>
            <h3 className="text-2xl font-black text-slate-900 tracking-tight">Featured Listings</h3>
            <div className="h-1 w-12 bg-blue-600 mt-1 rounded-full" />
          </div>
          <button className="text-[10px] font-black text-blue-600 uppercase tracking-widest border-b-2 border-blue-600 pb-1">
            View All
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
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