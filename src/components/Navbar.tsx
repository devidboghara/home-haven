export default function Navbar() {
  return (
    <nav className="flex items-center justify-between px-6 py-4 bg-white/70 backdrop-blur-md sticky top-0 z-50 border-b border-slate-100">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-blue-600 rounded-xl flex items-center justify-center">
          <span className="text-white font-bold text-sm">L</span>
        </div>
        <h1 className="text-xl font-bold tracking-tight text-slate-900">LuxeLair</h1>
      </div>
      <button className="bg-blue-600 text-white px-4 py-2 rounded-2xl text-xs font-semibold shadow-lg shadow-blue-200">
        Login
      </button>
    </nav>
  );
}