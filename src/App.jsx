import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import InputForm from './pages/InputForm';
import Analytics from './pages/Analytics';
import Suggestions from './pages/Suggestions';

import {
  getLogs,
  saveLogForDate,
  saveLogs,
  getSettings,
  saveSettings,
  getCompletedSuggestions,
  toggleSuggestionCompleted,
  getPoints,
  resetAppData
} from './utils/storage';
import { SUGGESTIONS } from './data/suggestionsData';
import { Leaf, Award, Shield, User, Settings } from 'lucide-react';

export default function App() {
  const [activePage, setActivePage] = useState('dashboard');
  const [logs, setLogs] = useState([]);
  const [settings, setSettings] = useState({ userName: 'Eco Explorer', dailyTarget: 12.0 });
  const [completedSuggestions, setCompletedSuggestions] = useState([]);
  const [ecoPoints, setEcoPoints] = useState(150);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [tempSettings, setTempSettings] = useState({ userName: '', dailyTarget: 12.0 });

  // Initialize data on mount
  useEffect(() => {
    setLogs(getLogs());
    const savedSettings = getSettings();
    setSettings(savedSettings);
    setTempSettings(savedSettings);
    setCompletedSuggestions(getCompletedSuggestions());
    setEcoPoints(getPoints());
  }, []);

  // Handler to save/update a day's emissions
  const handleSaveLog = (date, inputs) => {
    const updatedLogs = saveLogForDate(date, inputs);
    setLogs(updatedLogs);
  };

  // Handler to delete a specific day log
  const handleDeleteLog = (id) => {
    const nextLogs = logs.filter(l => l.id !== id);
    saveLogs(nextLogs);
    setLogs(nextLogs);
  };

  // Handler to toggle suggestion completion and adjust points
  const handleClaimSuggestion = (id, points) => {
    const { completed, isCompleted } = toggleSuggestionCompleted(id, points);
    setCompletedSuggestions(completed);
    setEcoPoints(getPoints());
  };

  // Reset all application data
  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset all tracking data and restore mock seed levels?')) {
      const reset = resetAppData();
      setLogs(reset.logs);
      setSettings(reset.settings);
      setTempSettings(reset.settings);
      setCompletedSuggestions(reset.completedSuggestions);
      setEcoPoints(reset.points);
      setActivePage('dashboard');
    }
  };

  // Save Settings Modal form
  const handleSaveSettings = (e) => {
    e.preventDefault();
    const targetVal = Math.max(1, parseFloat(tempSettings.dailyTarget) || 12.0);
    const updated = {
      userName: tempSettings.userName.trim() || 'Eco Explorer',
      dailyTarget: parseFloat(targetVal.toFixed(1))
    };
    saveSettings(updated);
    setSettings(updated);
    setShowSettingsModal(false);
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#080c15]">
      {/* Sidebar Navigation */}
      <Navbar
        activePage={activePage}
        setActivePage={setActivePage}
        ecoPoints={ecoPoints}
        onReset={handleReset}
      />

      {/* Main Content Pane */}
      <main className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto">
        {/* Top Header / Profile Bar */}
        <header className="glass-panel border-b border-slate-800/40 px-6 py-4 flex items-center justify-between shrink-0 bg-slate-950/20 backdrop-blur-md">
          <div className="flex items-center space-x-2">
            <span className="text-[10px] uppercase font-extrabold tracking-wider text-slate-500">Active Node:</span>
            <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-md border border-emerald-500/20">
              Earth-Grid Beta
            </span>
          </div>

          <div className="flex items-center space-x-4">
            {/* Settings Button */}
            <button
              onClick={() => {
                setTempSettings(settings);
                setShowSettingsModal(true);
              }}
              className="p-2 border border-slate-800 hover:border-slate-700 bg-slate-900/50 hover:bg-slate-800/50 text-slate-400 hover:text-slate-200 rounded-xl transition duration-200"
              title="Application Settings"
            >
              <Settings className="w-4 h-4" />
            </button>

            {/* Profile Pill */}
            <div className="flex items-center space-x-2 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl">
              <div className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs">
                <User className="w-3.5 h-3.5" />
              </div>
              <span className="text-xs font-bold text-slate-200 hidden sm:inline">
                {settings.userName}
              </span>
            </div>
          </div>
        </header>

        {/* Dynamic Pages Container */}
        <div className="flex-1 p-6 max-w-7xl w-full mx-auto pb-16">
          {activePage === 'dashboard' && (
            <Dashboard
              logs={logs}
              settings={settings}
              completedSuggestions={completedSuggestions}
              suggestions={SUGGESTIONS}
              onClaimSuggestion={handleClaimSuggestion}
              ecoPoints={ecoPoints}
              setActivePage={setActivePage}
            />
          )}

          {activePage === 'input' && (
            <InputForm
              onSaveLog={handleSaveLog}
            />
          )}

          {activePage === 'analytics' && (
            <Analytics
              logs={logs}
              settings={settings}
              onDeleteLog={handleDeleteLog}
            />
          )}

          {activePage === 'suggestions' && (
            <Suggestions
              suggestions={SUGGESTIONS}
              completedSuggestions={completedSuggestions}
              onClaimSuggestion={handleClaimSuggestion}
            />
          )}
        </div>
      </main>

      {/* Settings Modal */}
      {showSettingsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
          <div className="glass-panel p-6 rounded-2xl w-full max-w-md bg-slate-900 border border-slate-800 shadow-2xl relative">
            <h3 className="text-lg font-bold text-white mb-2">Adjust Tracker Limits</h3>
            <p className="text-xs text-slate-400 mb-5">Configure your user profile details and standard carbon benchmarks.</p>

            <form onSubmit={handleSaveSettings} className="space-y-4">
              {/* User Name */}
              <div className="flex flex-col space-y-1.5">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wide">Explorer Username</label>
                <input
                  type="text"
                  value={tempSettings.userName}
                  onChange={(e) => setTempSettings({ ...tempSettings, userName: e.target.value })}
                  placeholder="Enter Explorer Name"
                  className="glass-input text-sm text-slate-200 px-4 py-2.5 rounded-xl bg-slate-950 w-full"
                  required
                />
              </div>

              {/* Daily Limit Target */}
              <div className="flex flex-col space-y-1.5">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wide">Daily Limit Budget (kg CO₂)</label>
                <input
                  type="number"
                  step="0.1"
                  min="1"
                  max="100"
                  value={tempSettings.dailyTarget}
                  onChange={(e) => setTempSettings({ ...tempSettings, dailyTarget: e.target.value })}
                  className="glass-input text-sm text-slate-200 px-4 py-2.5 rounded-xl bg-slate-950 w-full font-bold"
                  required
                />
                <span className="text-[10px] text-slate-500 leading-normal">
                  Standard environment budgets suggest around 10-15 kg per capita.
                </span>
              </div>

              {/* Modal Buttons */}
              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-850">
                <button
                  type="button"
                  onClick={() => setShowSettingsModal(false)}
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
      )}
    </div>
  );
}
