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

      {/* Hero Banner Section - Ab bada aur "Luxe" hai */}
<section className="relative px-6 py-28 md:py-40 bg-gradient-to-br from-blue-600 via-blue-500 to-indigo-700 overflow-hidden">
  {/* Soft UI Glow Effects */}
  <div className="absolute top-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-[120px] -ml-20 -mt-20" />
  <div className="absolute bottom-0 right-0 w-80 h-80 bg-blue-400/20 rounded-full blur-[100px] -mr-10 -mb-10" />

  <div className="relative z-10 max-w-3xl mx-auto text-center">
    <span className="inline-block px-4 py-1.5 mb-6 text-[10px] font-bold tracking-widest text-blue-100 uppercase bg-white/10 backdrop-blur-md rounded-full border border-white/20">
      Premium Real Estate
    </span>
    <h2 className="text-4xl md:text-7xl font-extrabold text-white leading-[1.1] tracking-tight">
      Find your <span className="text-blue-200">Perfect Haven</span> <br /> without the hassle.
    </h2>
    <p className="mt-6 text-sm md:text-xl text-blue-50 max-w-xl mx-auto font-light leading-relaxed">
      "The magic of a home is that it feels like the world is standing still."
    </p>
    
    {/* Modern Search Bar */}
    <div className="mt-12 flex flex-col md:flex-row gap-3 p-2 bg-white/10 backdrop-blur-xl rounded-[2.5rem] border border-white/20 shadow-2xl">
      <input 
        type="text" 
        placeholder="Search City, Locality..." 
        className="flex-1 px-6 py-4 bg-white rounded-[2rem] text-slate-800 focus:outline-none placeholder:text-slate-400"
      />
      <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-[2rem] font-bold transition-all shadow-lg active:scale-95 text-sm">
        Search Now
      </button>
    </div>
  </div>
</section>

      {/* Grid Section - Mobile grid-cols-2 is here! */}
      <section className="px-4 pb-20">
        <div className="flex justify-between items-center mb-5">
          <h3 className="text-lg font-bold text-slate-800">Featured Homes</h3>
          <button className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1.5 rounded-full">View All</button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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