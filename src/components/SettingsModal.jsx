import React from 'react';
import { Settings } from 'lucide-react';

export default function SettingsModal({ tempSettings, onTempChange, onClose, onSave }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
      <div className="glass-panel p-6 rounded-2xl w-full max-w-md bg-slate-900 border border-slate-800 shadow-2xl relative">
        <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
          <Settings className="w-5 h-5 text-emerald-400" />
          Adjust Tracker Limits
        </h3>
        <p className="text-xs text-slate-400 mb-5">Configure your user profile details and standard carbon benchmarks.</p>

        <form onSubmit={onSave} className="space-y-4">
          <div className="flex flex-col space-y-1.5">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wide" htmlFor="settings-username">
              Explorer Username
            </label>
            <input
              id="settings-username"
              type="text"
              value={tempSettings.userName}
              onChange={(e) => onTempChange('userName', e.target.value)}
              placeholder="Enter Explorer Name"
              className="glass-input text-sm text-slate-200 px-4 py-2.5 rounded-xl bg-slate-950 w-full"
              required
            />
          </div>

          <div className="flex flex-col space-y-1.5">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wide" htmlFor="settings-daily-target">
              Daily Limit Budget (kg CO₂)
            </label>
            <input
              id="settings-daily-target"
              type="number"
              step="0.1"
              min="1"
              max="100"
              value={tempSettings.dailyTarget}
              onChange={(e) => onTempChange('dailyTarget', Number(e.target.value))}
              className="glass-input text-sm text-slate-200 px-4 py-2.5 rounded-xl bg-slate-950 w-full font-bold"
              required
            />
            <span className="text-[10px] text-slate-500 leading-normal">
              Standard environment budgets suggest around 10-15 kg per capita.
            </span>
          </div>

          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-850">
            <button
              type="button"
              onClick={onClose}
              className="text-xs font-bold text-slate-400 hover:text-slate-200 px-4 py-2 border border-slate-850 hover:bg-slate-850 rounded-xl transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-extrabold text-xs px-5 py-2.5 rounded-xl transition"
            >
              Apply Settings
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
