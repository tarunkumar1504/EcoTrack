import React from 'react';

export default function StatCard({ title, value, unit = 'kg', subtitle, icon: Icon, trend, status }) {
  // Determine color theme based on status or type
  const getThemeClasses = () => {
    switch (status) {
      case 'success':
        return {
          bg: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400',
          badge: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
          iconBg: 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400'
        };
      case 'warning':
        return {
          bg: 'bg-amber-500/10 border-amber-500/20 text-amber-400',
          badge: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
          iconBg: 'bg-amber-500/10 border border-amber-500/20 text-amber-400'
        };
      case 'danger':
        return {
          bg: 'bg-rose-500/10 border-rose-500/20 text-rose-400',
          badge: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
          iconBg: 'bg-rose-500/10 border border-rose-500/20 text-rose-400'
        };
      default:
        return {
          bg: 'bg-slate-800/10 border-slate-800/60 text-slate-400',
          badge: 'bg-slate-800 text-slate-400 border-slate-700',
          iconBg: 'bg-slate-800 border border-slate-700/60 text-slate-300'
        };
    }
  };

  const theme = getThemeClasses();

  return (
    <div className="glass-panel glass-panel-glow p-5 rounded-2xl flex flex-col justify-between transition-all duration-300 hover:border-slate-700/50 hover:translate-y-[-2px]">
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm font-semibold text-slate-400">{title}</span>
        {Icon && (
          <div className={`p-2.5 rounded-xl ${theme.iconBg}`}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>

      <div className="flex items-baseline space-x-1.5">
        <span className="text-3xl font-extrabold tracking-tight text-white">{value}</span>
        {unit && <span className="text-sm font-bold text-slate-500">{unit}</span>}
      </div>

      <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-800/30">
        <span className="text-xs text-slate-500 font-medium">{subtitle}</span>
        {trend && (
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${theme.badge}`}>
            {trend}
          </span>
        )}
      </div>
    </div>
  );
}
