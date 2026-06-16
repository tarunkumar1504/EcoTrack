import React from 'react';

export default function SliderInput({
  label,
  value,
  min,
  max,
  step = 1,
  unit = '',
  description,
  onChange,
  ariaLabel,
  hideValue = false,
  accentClass = 'accent-blue-500',
  inputProps = {}
}) {
  return (
    <div className="bg-slate-900/30 p-4 rounded-xl border border-slate-800/40">
      <div className="flex justify-between mb-2">
        <div>
          <span className="text-xs font-bold text-slate-300 block">{label}</span>
          {description ? <span className="text-[10px] text-slate-500 block">{description}</span> : null}
        </div>
        {!hideValue && (
          <span className="text-xs font-bold text-blue-400">
            {value} {unit}
          </span>
        )}
      </div>
      <input
        type="range"
        aria-label={ariaLabel || label}
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={onChange}
        className={`w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer ${accentClass}`}
        {...inputProps}
      />
    </div>
  );
}
