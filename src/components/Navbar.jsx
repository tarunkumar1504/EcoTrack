import React from 'react';
import { LayoutDashboard, Leaf, PenTool, BarChart3, HelpCircle, RefreshCw, Trophy } from 'lucide-react';

export default function Navbar({ activePage, setActivePage, ecoPoints, onReset }) {
  const navItems = [
    { id: 'dashboard', name: 'Dashboard', icon: LayoutDashboard },
    { id: 'input', name: 'Log Activity', icon: PenTool },
    { id: 'analytics', name: 'Analytics', icon: BarChart3 },
    { id: 'suggestions', name: 'Action Plan', icon: Leaf },
  ];

  return (
    <nav className="glass-panel border-b md:border-b-0 md:border-r border-slate-800/60 md:w-64 w-full flex flex-col justify-between shrink-0 md:h-screen sticky top-0 z-40 bg-slate-950/80 md:bg-transparent">
      {/* Top Section */}
      <div>
        {/* Brand / Logo */}
        <div className="flex items-center space-x-3 px-6 py-5 border-b border-slate-800/40">
          <div className="bg-eco-500/10 p-2 rounded-xl border border-eco-500/30 text-eco-400">
            <Leaf className="w-6 h-6 animate-pulse-soft" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
              EcoTrack
            </h1>
            <p className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold">Awareness Engine</p>
          </div>
        </div>

        {/* Eco Points Showcase */}
        <div className="m-4 p-4 rounded-xl bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-800/80 shadow-inner flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="bg-amber-500/10 p-2 rounded-lg text-amber-500">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-medium">Eco Points</p>
              <h4 className="text-lg font-bold text-slate-200">{ecoPoints}</h4>
            </div>
          </div>
          <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
            Level {Math.floor(ecoPoints / 300) + 1}
          </span>
        </div>

        {/* Nav Links */}
        <div className="px-3 py-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activePage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActivePage(item.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-gradient-to-r from-eco-500/20 to-eco-500/5 text-eco-400 border-l-2 border-eco-500 shadow-md shadow-eco-500/5'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 border-l-2 border-transparent'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-eco-400' : 'text-slate-500'}`} />
                <span>{item.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Bottom Section */}
      <div className="p-4 border-t border-slate-800/40 flex items-center justify-between md:flex-col md:space-y-4 md:items-stretch md:border-t-0 md:pt-0">
        <div className="hidden md:block text-[11px] text-slate-500 text-center px-4 leading-relaxed">
          Daily emission average is compared to the 12kg standard limit.
        </div>
        <button
          onClick={onReset}
          className="flex items-center space-x-2 justify-center text-xs text-slate-500 hover:text-rose-400 px-4 py-2 border border-slate-800 rounded-lg hover:border-rose-950/40 transition-all duration-200 bg-slate-900/50 hover:bg-rose-950/10"
          title="Reset application to seed data"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Reset App Data</span>
        </button>
      </div>
    </nav>
  );
}
