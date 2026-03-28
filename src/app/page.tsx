import Navbar from "@/components/Navbar"; // Ye hai 'Import' line

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-50">
      <Navbar /> {/* Navbar yahan dikhega */}
      
      {/* 2. Banner + Quote Section */}
      <section className="relative h-[60vh] w-full flex items-center justify-center overflow-hidden">
        {/* Background Image/Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-indigo-600/10 z-0" />
        
        <div className="relative z-10 text-center px-4">
          <h2 className="text-4xl md:text-6xl font-bold text-slate-900 tracking-tight">
            Find Your <span className="text-blue-600">Dream Haven</span>
          </h2>
          <p className="mt-4 text-lg text-slate-600 max-w-lg mx-auto italic">
            "The magic of a home is that it feels like the world is standing still."
          </p>
        </div>
      </section>

      {/* 3. Property Grid (Mobile: 2 Columns) */}
      <section className="p-4 max-w-7xl mx-auto">
        <h3 className="text-xl font-semibold mb-6 text-slate-800">Featured Properties</h3>
        
        {/* grid-cols-2 mobile ke liye hai, md:grid-cols-4 desktop ke liye */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {/* Ye ek Dummy Card hai, ise baad mein component banayenge */}
          {[1, 2, 3, 4].map((item) => (
            <div key={item} className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
              <div className="aspect-square bg-slate-200" />
              <div className="p-2">
                <p className="text-sm font-bold text-blue-600">$2,500</p>
                <p className="text-[10px] text-slate-500 truncate">Modern Villa, Gujarat</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}