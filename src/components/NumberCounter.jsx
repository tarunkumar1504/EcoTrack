import React from 'react';

export default function NumberCounter({
  label,
  value,
  onIncrement,
  onDecrement,
  unit = '',
  description,
  ariaLabel
}) {
  return (
    <div className="bg-slate-900/30 p-4 rounded-xl border border-slate-800/40 flex items-center justify-between">
      <div>
        <span className="text-xs font-bold text-slate-200 block">{label}</span>
        {description && <span className="text-[10px] text-slate-500 block">{description}</span>}
      </div>
      <div className="flex items-center space-x-3">
        <button
          type="button"
          onClick={onDecrement}
          className="p-1 border border-slate-700 hover:border-slate-500 text-slate-400 hover:text-slate-200 rounded-md transition"
          aria-label={`Decrease ${ariaLabel || label}`}
        >
          -
        </button>
        <span className="text-sm font-extrabold text-white w-5 text-center">{value}</span>
        <button
          type="button"
          onClick={onIncrement}
          className="p-1 border border-slate-700 hover:border-slate-500 text-slate-400 hover:text-slate-200 rounded-md transition"
          aria-label={`Increase ${ariaLabel || label}`}
        >
          +
        </button>
      </div>
    </div>
  );
}
