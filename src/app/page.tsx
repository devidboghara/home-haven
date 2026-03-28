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

      {/* Hero Banner Section */}
      <section className="px-4 py-12 bg-gradient-to-b from-blue-50 to-[#F8FAFC]">
        <div className="max-w-xl mx-auto text-center">
          <h2 className="text-3xl font-extrabold text-slate-900 leading-tight">
            Find your <span className="text-blue-600">Perfect Place</span> to live.
          </h2>
          <p className="mt-3 text-sm text-slate-500 italic">
            "The magic of a home is that it feels like the world is standing still."
          </p>
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