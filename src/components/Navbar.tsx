export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 w-full z-[100] px-6 py-4 flex items-center justify-between bg-white/40 backdrop-blur-xl border-b border-white/20">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-200">
          <span className="text-white font-black text-sm italic">L</span>
        </div>
        <h1 className="text-xl font-black tracking-tighter text-slate-900">LuxeLair</h1>
      </div>
      <div className="hidden md:flex gap-8 text-[11px] font-bold uppercase tracking-widest text-slate-600">
        <span className="hover:text-blue-600 cursor-pointer transition-colors">Buy</span>
        <span className="hover:text-blue-600 cursor-pointer transition-colors">Rent</span>
        <span className="hover:text-blue-600 cursor-pointer transition-colors">Sell</span>
      </div>
      <button className="bg-slate-900 text-white px-6 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-blue-600 transition-all shadow-xl active:scale-95">
        Login
      </button>
    </nav>
  );
}