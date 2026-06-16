import React, { useState, useEffect, Suspense, lazy } from 'react';
import Navbar from './components/Navbar';
import SettingsModal from './components/SettingsModal';

const Dashboard = lazy(() => import('./pages/Dashboard'));
const InputForm = lazy(() => import('./pages/InputForm'));
const Analytics = lazy(() => import('./pages/Analytics'));
const Suggestions = lazy(() => import('./pages/Suggestions'));

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
import { User, Settings } from 'lucide-react';

const PAGE_IDS = {
  DASHBOARD: 'dashboard',
  INPUT: 'input',
  ANALYTICS: 'analytics',
  SUGGESTIONS: 'suggestions'
};

const DEFAULT_SETTINGS = {
  userName: 'Eco Explorer',
  dailyTarget: 12.0
};

export default function App() {
  const [activePage, setActivePage] = useState(PAGE_IDS.DASHBOARD);
  const [logs, setLogs] = useState([]);
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [completedSuggestions, setCompletedSuggestions] = useState([]);
  const [ecoPoints, setEcoPoints] = useState(150);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [tempSettings, setTempSettings] = useState(DEFAULT_SETTINGS);

  const handleTempSettingChange = (field, value) => {
    setTempSettings((prevSettings) => ({ ...prevSettings, [field]: value }));
  };

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
    const { completed } = toggleSuggestionCompleted(id, points);
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
      setActivePage(PAGE_IDS.DASHBOARD);
    }
  };

  const handleSaveSettings = (e) => {
    e.preventDefault();
    const targetVal = Math.max(1, Number(tempSettings.dailyTarget) || 12.0);
    const updated = {
      userName: tempSettings.userName.trim() || DEFAULT_SETTINGS.userName,
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
          <Suspense fallback={<div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-6 text-slate-300">Loading EcoTrack experience…</div>}>
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
          </Suspense>
        </div>
      </main>

      {/* Settings Modal */}
      {showSettingsModal && (
        <SettingsModal
          tempSettings={tempSettings}
          onTempChange={handleTempSettingChange}
          onClose={() => setShowSettingsModal(false)}
          onSave={handleSaveSettings}
        />
      )}
    </div>
  );
}
