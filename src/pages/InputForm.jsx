import React, { useState } from 'react';
import { Car, Zap, ChefHat, Trash2, Save, Sparkles, Plus, Minus } from 'lucide-react';
import { calculateDailyEmissions } from '../utils/calculations';

const CATEGORIES = [
  { id: 'travel', name: 'Travel', icon: Car, color: 'text-blue-400 bg-blue-500/10 border-blue-500/20' },
  { id: 'electricity', name: 'Energy', icon: Zap, color: 'text-amber-400 bg-amber-500/10 border-amber-500/20' },
  { id: 'food', name: 'Diet', icon: ChefHat, color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' },
  { id: 'waste', name: 'Waste', icon: Trash2, color: 'text-purple-400 bg-purple-500/10 border-purple-500/20' }
];

export default function InputForm({ onSaveLog }) {
  const [selectedTab, setSelectedTab] = useState('travel');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [showSuccess, setShowSuccess] = useState(false);
  const [savedCO2, setSavedCO2] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState('');

  // Form State
  const [formState, setFormState] = useState({
    travel: {
      carPetrol: 0,
      carDiesel: 0,
      carHybrid: 0,
      carElectric: 0,
      motorcycle: 0,
      bus: 0,
      train: 0,
      flight: 0
    },
    electricity: {
      kwh: 0,
      renewableKwh: 0
    },
    food: {
      vegan: 0,
      vegetarian: 0,
      nonVegLight: 0,
      nonVegHeavy: 0
    },
    waste: {
      landfill: 0,
      recycled: 0
    }
  });

  // Calculate live estimate
  const liveEstimate = calculateDailyEmissions(formState);

  // Update logic helpers
  const handleTravelChange = (field, val) => {
    const num = Math.max(0, parseFloat(val) || 0);
    setFormState(prev => ({
      ...prev,
      travel: { ...prev.travel, [field]: num }
    }));
  };

  const handleElectricityChange = (field, val) => {
    const num = Math.max(0, parseFloat(val) || 0);
    setFormState(prev => ({
      ...prev,
      electricity: { ...prev.electricity, [field]: num }
    }));
  };

  const handleFoodChange = (field, val) => {
    const num = Math.max(0, parseInt(val) || 0);
    setFormState(prev => ({
      ...prev,
      food: { ...prev.food, [field]: num }
    }));
  };

  const handleWasteChange = (field, val) => {
    const num = Math.max(0, parseFloat(val) || 0);
    setFormState(prev => ({
      ...prev,
      waste: { ...prev.waste, [field]: num }
    }));
  };

  const handleFoodCounter = (field, amount) => {
    setFormState(prev => {
      const current = prev.food[field] || 0;
      const next = Math.max(0, current + amount);
      return {
        ...prev,
        food: { ...prev.food, [field]: next }
      };
    });
  };

  // Quick Seed profiles
  const applyProfile = (profileType) => {
    if (profileType === 'eco') {
      setFormState({
        travel: { carPetrol: 0, carDiesel: 0, carHybrid: 0, carElectric: 0, motorcycle: 0, bus: 5, train: 0, flight: 0 },
        electricity: { kwh: 3, renewableKwh: 6 },
        food: { vegan: 3, vegetarian: 0, nonVegLight: 0, nonVegHeavy: 0 },
        waste: { landfill: 0.5, recycled: 3 }
      });
    } else if (profileType === 'average') {
      setFormState({
        travel: { carPetrol: 25, carDiesel: 0, carHybrid: 0, carElectric: 0, motorcycle: 0, bus: 0, train: 0, flight: 0 },
        electricity: { kwh: 10, renewableKwh: 0 },
        food: { vegan: 0, vegetarian: 1, nonVegLight: 2, nonVegHeavy: 0 },
        waste: { landfill: 2, recycled: 1.5 }
      });
    } else if (profileType === 'high') {
      setFormState({
        travel: { carPetrol: 60, carDiesel: 0, carHybrid: 0, carElectric: 0, motorcycle: 0, bus: 0, train: 0, flight: 0 },
        electricity: { kwh: 22, renewableKwh: 0 },
        food: { vegan: 0, vegetarian: 0, nonVegLight: 1, nonVegHeavy: 2 },
        waste: { landfill: 5, recycled: 0.5 }
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (liveEstimate.total <= 0) {
      setFeedbackMessage('Add at least one activity value before saving your log.');
      setShowSuccess(false);
      return;
    }

    setIsSaving(true);
    setFeedbackMessage('');

    try {
      onSaveLog(date, formState);
      setSavedCO2(liveEstimate.total);
      setShowSuccess(true);
      window.setTimeout(() => {
        setShowSuccess(false);
        setIsSaving(false);
      }, 2600);
    } catch (error) {
      setFeedbackMessage('We could not save your log. Please try again.');
      setIsSaving(false);
      console.error('Failed to save log', error);
    }
  };

  const currentCategory = CATEGORIES.find(c => c.id === selectedTab);
  const TabIcon = currentCategory ? currentCategory.icon : Car;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Title */}
      <div>
        <h2 className="text-2xl font-extrabold text-white">Log Daily Activities</h2>
        <p className="text-sm text-slate-400">Record your transport, energy use, meals, and waste to compute emissions.</p>
      </div>

      {/* Success Notification Alert */}
      {feedbackMessage && (
        <p className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-100" role="alert" aria-live="assertive">{feedbackMessage}</p>
      )}

      {showSuccess && (
        <div className="bg-emerald-500/10 border-l-4 border-emerald-500 p-5 rounded-2xl animate-fade-in flex flex-col md:flex-row items-center justify-between space-y-3 md:space-y-0" role="status" aria-live="polite">
          <div className="flex items-center space-x-3.5">
            <div className="bg-emerald-500/20 p-2.5 rounded-xl text-emerald-400">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Daily Log Saved Successfully!</h4>
              <p className="text-xs text-slate-300 leading-normal">
                Your activities for <span className="font-bold text-slate-200">{date}</span> totaled{' '}
                <span className="font-bold text-emerald-400">{savedCO2} kg CO₂</span>.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setShowSuccess(false)}
            className="text-xs font-bold text-emerald-400 hover:text-emerald-300 border border-emerald-500/20 px-4 py-1.5 rounded-lg hover:bg-emerald-500/5 transition"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Quick seeds and Date Row */}
      <div className="glass-panel p-5 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Date Selector */}
        <div className="flex flex-col space-y-1.5">
          <label htmlFor="logging-date" className="text-xs font-bold text-slate-400 uppercase tracking-wider">Logging Date:</label>
          <input
            id="logging-date"
            type="date"
            aria-label="Logging date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="glass-input text-sm text-slate-200 px-4 py-2.5 rounded-xl bg-slate-900 w-full md:w-56"
          />
        </div>

        {/* Quick Profiles */}
        <div className="flex flex-col space-y-1.5">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Quick Setup Presets:</label>
          <div className="flex flex-wrap gap-2.5">
            <button
              type="button"
              aria-label="Load the eco day preset"
              onClick={() => applyProfile('eco')}
              className="px-3.5 py-2 border border-emerald-500/30 bg-emerald-500/5 text-emerald-400 hover:bg-emerald-500/10 rounded-xl text-xs font-bold transition"
            >
              🌱 Eco Day
            </button>
            <button
              type="button"
              aria-label="Load the commuter preset"
              onClick={() => applyProfile('average')}
              className="px-3.5 py-2 border border-slate-700 bg-slate-800/40 text-slate-300 hover:bg-slate-800/80 rounded-xl text-xs font-bold transition"
            >
              🚗 Commuter / Average
            </button>
            <button
              type="button"
              aria-label="Load the high emissions preset"
              onClick={() => applyProfile('high')}
              className="px-3.5 py-2 border border-rose-500/20 bg-rose-500/5 text-rose-400 hover:bg-rose-500/10 rounded-xl text-xs font-bold transition"
            >
              🥩 High Emissions
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid: Form Layout vs Estimator */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Form Inputs (2 Cols) */}
        <form onSubmit={handleSubmit} className="lg:col-span-2 glass-panel rounded-2xl overflow-hidden flex flex-col">
          {/* Tabs */}
          <div className="flex border-b border-slate-800/60 bg-slate-950/45">
            {CATEGORIES.map((tab) => {
              const TabItemIcon = tab.icon;
              const isSelected = selectedTab === tab.id;
              return (
                <button
                  type="button"
                  key={tab.id}
                  onClick={() => setSelectedTab(tab.id)}
                  className={`flex-1 flex items-center justify-center space-x-2 py-4 border-b-2 font-bold text-xs md:text-sm tracking-wide transition-all ${
                    isSelected
                      ? 'border-emerald-500 text-emerald-400 bg-slate-900/30'
                      : 'border-transparent text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <TabItemIcon className="w-4 h-4" />
                  <span className="hidden sm:inline">{tab.name}</span>
                </button>
              );
            })}
          </div>

          {/* Form Body */}
          <div className="p-6 flex-1 min-h-[300px]">
            {/* Travel Tab */}
            {selectedTab === 'travel' && (
              <div className="space-y-5">
                <div>
                  <h4 className="text-sm font-bold text-white flex items-center mb-1">
                    <Car className="w-4 h-4 mr-2 text-blue-400" />
                    Transportation Habits
                  </h4>
                  <p className="text-xs text-slate-400">Enter distance traveled in kilometers for each transit type today.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Petrol Car */}
                  <div className="bg-slate-900/30 p-4 rounded-xl border border-slate-800/40">
                    <div className="flex justify-between mb-2">
                      <span className="text-xs font-bold text-slate-300">Petrol Car</span>
                      <span className="text-xs font-bold text-blue-400">{formState.travel.carPetrol} km</span>
                    </div>
                    <input
                      type="range"
                      aria-label="Petrol car distance in km"
                      min="0"
                      max="150"
                      value={formState.travel.carPetrol}
                      onChange={(e) => handleTravelChange('carPetrol', e.target.value)}
                      className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
                    />
                  </div>

                  {/* Diesel Car */}
                  <div className="bg-slate-900/30 p-4 rounded-xl border border-slate-800/40">
                    <div className="flex justify-between mb-2">
                      <span className="text-xs font-bold text-slate-300">Diesel Car</span>
                      <span className="text-xs font-bold text-blue-400">{formState.travel.carDiesel} km</span>
                    </div>
                    <input
                      type="range"
                      aria-label="Diesel car distance in km"
                      min="0"
                      max="150"
                      value={formState.travel.carDiesel}
                      onChange={(e) => handleTravelChange('carDiesel', e.target.value)}
                      className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
                    />
                  </div>

                  {/* Hybrid Car */}
                  <div className="bg-slate-900/30 p-4 rounded-xl border border-slate-800/40">
                    <div className="flex justify-between mb-2">
                      <span className="text-xs font-bold text-slate-300">Hybrid Car</span>
                      <span className="text-xs font-bold text-blue-400">{formState.travel.carHybrid} km</span>
                    </div>
                    <input
                      type="range"
                      aria-label="Hybrid car distance in km"
                      min="0"
                      max="150"
                      value={formState.travel.carHybrid}
                      onChange={(e) => handleTravelChange('carHybrid', e.target.value)}
                      className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
                    />
                  </div>

                  {/* Electric Car */}
                  <div className="bg-slate-900/30 p-4 rounded-xl border border-slate-800/40">
                    <div className="flex justify-between mb-2">
                      <span className="text-xs font-bold text-slate-300">Electric Car (EV)</span>
                      <span className="text-xs font-bold text-blue-400">{formState.travel.carElectric} km</span>
                    </div>
                    <input
                      type="range"
                      aria-label="Electric car distance in km"
                      min="0"
                      max="150"
                      value={formState.travel.carElectric}
                      onChange={(e) => handleTravelChange('carElectric', e.target.value)}
                      className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
                    />
                  </div>

                  {/* Public Bus */}
                  <div className="bg-slate-900/30 p-4 rounded-xl border border-slate-800/40">
                    <div className="flex justify-between mb-2">
                      <span className="text-xs font-bold text-slate-300">Public Bus Commute</span>
                      <span className="text-xs font-bold text-blue-400">{formState.travel.bus} km</span>
                    </div>
                    <input
                      type="range"
                      aria-label="Bus distance in km"
                      min="0"
                      max="100"
                      value={formState.travel.bus}
                      onChange={(e) => handleTravelChange('bus', e.target.value)}
                      className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
                    />
                  </div>

                  {/* Train */}
                  <div className="bg-slate-900/30 p-4 rounded-xl border border-slate-800/40">
                    <div className="flex justify-between mb-2">
                      <span className="text-xs font-bold text-slate-300">Train/Metro Transit</span>
                      <span className="text-xs font-bold text-blue-400">{formState.travel.train} km</span>
                    </div>
                    <input
                      type="range"
                      aria-label="Train distance in km"
                      min="0"
                      max="200"
                      value={formState.travel.train}
                      onChange={(e) => handleTravelChange('train', e.target.value)}
                      className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
                    />
                  </div>

                  {/* Flights */}
                  <div className="bg-slate-900/30 p-4 rounded-xl border border-slate-800/40 md:col-span-2">
                    <div className="flex justify-between items-center mb-1.5">
                      <span className="text-xs font-bold text-slate-300">Flights (Long/Short distance)</span>
                      <div className="flex items-center space-x-2">
                        <input
                          type="number"
                          aria-label="Flight distance in km"
                          value={formState.travel.flight}
                          onChange={(e) => handleTravelChange('flight', e.target.value)}
                          className="glass-input text-xs w-20 px-2.5 py-1 rounded bg-slate-900 text-center font-bold text-blue-400"
                        />
                        <span className="text-xs text-slate-500">km</span>
                      </div>
                    </div>
                    <input
                      type="range"
                      aria-label="Flight distance slider"
                      min="0"
                      max="1500"
                      step="50"
                      value={formState.travel.flight}
                      onChange={(e) => handleTravelChange('flight', e.target.value)}
                      className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Energy Tab */}
            {selectedTab === 'electricity' && (
              <div className="space-y-5">
                <div>
                  <h4 className="text-sm font-bold text-white flex items-center mb-1">
                    <Zap className="w-4 h-4 mr-2 text-amber-400" />
                    Home Electricity & Power
                  </h4>
                  <p className="text-xs text-slate-400">Specify grid power consumed vs self-generated solar/wind power.</p>
                </div>

                <div className="space-y-6">
                  {/* Grid Electricity */}
                  <div className="bg-slate-900/30 p-5 rounded-xl border border-slate-800/40">
                    <div className="flex justify-between items-center mb-2">
                      <div>
                        <span className="text-xs font-bold text-slate-200 block">Standard Grid Electricity</span>
                        <span className="text-[10px] text-slate-500 block">Power pulled from local regional grid mix</span>
                      </div>
                      <span className="text-sm font-extrabold text-amber-400">{formState.electricity.kwh} kWh</span>
                    </div>
                    <input
                      type="range"
                      aria-label="Grid electricity use in kWh"
                      min="0"
                      max="50"
                      step="0.5"
                      value={formState.electricity.kwh}
                      onChange={(e) => handleElectricityChange('kwh', e.target.value)}
                      className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
                    />
                  </div>

                  {/* Clean Renewable Energy */}
                  <div className="bg-slate-900/30 p-5 rounded-xl border border-slate-800/40">
                    <div className="flex justify-between items-center mb-2">
                      <div>
                        <span className="text-xs font-bold text-slate-200 block">Clean Renewable Energy Offset</span>
                        <span className="text-[10px] text-slate-500 block">Solar, wind, or purchased certified clean power</span>
                      </div>
                      <span className="text-sm font-extrabold text-emerald-400">{formState.electricity.renewableKwh} kWh</span>
                    </div>
                    <input
                      type="range"
                      aria-label="Renewable electricity use in kWh"
                      min="0"
                      max="50"
                      step="0.5"
                      value={formState.electricity.renewableKwh}
                      onChange={(e) => handleElectricityChange('renewableKwh', e.target.value)}
                      className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Diet Tab */}
            {selectedTab === 'food' && (
              <div className="space-y-5">
                <div>
                  <h4 className="text-sm font-bold text-white flex items-center mb-1">
                    <ChefHat className="w-4 h-4 mr-2 text-emerald-400" />
                    Daily Meal Choices
                  </h4>
                  <p className="text-xs text-slate-400">Specify the number of vegan, vegetarian, or meat meals consumed today.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Vegan */}
                  <div className="bg-slate-900/30 p-4 rounded-xl border border-slate-800/40 flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-slate-200 block">Vegan Meals</span>
                      <span className="text-[10px] text-slate-500">Fully plant-based, 0.35kg CO₂</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <button
                        type="button"
                        onClick={() => handleFoodCounter('vegan', -1)}
                        className="p-1 border border-slate-700 hover:border-slate-500 text-slate-400 hover:text-slate-200 rounded-md transition"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="text-sm font-extrabold text-white w-5 text-center">{formState.food.vegan}</span>
                      <button
                        type="button"
                        onClick={() => handleFoodCounter('vegan', 1)}
                        className="p-1 border border-slate-700 hover:border-slate-500 text-slate-400 hover:text-slate-200 rounded-md transition"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Vegetarian */}
                  <div className="bg-slate-900/30 p-4 rounded-xl border border-slate-800/40 flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-slate-200 block">Vegetarian Meals</span>
                      <span className="text-[10px] text-slate-500">Contains dairy / eggs, 0.60kg CO₂</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <button
                        type="button"
                        onClick={() => handleFoodCounter('vegetarian', -1)}
                        className="p-1 border border-slate-700 hover:border-slate-500 text-slate-400 hover:text-slate-200 rounded-md transition"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="text-sm font-extrabold text-white w-5 text-center">{formState.food.vegetarian}</span>
                      <button
                        type="button"
                        onClick={() => handleFoodCounter('vegetarian', 1)}
                        className="p-1 border border-slate-700 hover:border-slate-500 text-slate-400 hover:text-slate-200 rounded-md transition"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Light Meat */}
                  <div className="bg-slate-900/30 p-4 rounded-xl border border-slate-800/40 flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-slate-200 block">Light Meat / Fish</span>
                      <span className="text-[10px] text-slate-500">Poultry, fish, seafood, 1.40kg CO₂</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <button
                        type="button"
                        onClick={() => handleFoodCounter('nonVegLight', -1)}
                        className="p-1 border border-slate-700 hover:border-slate-500 text-slate-400 hover:text-slate-200 rounded-md transition"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="text-sm font-extrabold text-white w-5 text-center">{formState.food.nonVegLight}</span>
                      <button
                        type="button"
                        onClick={() => handleFoodCounter('nonVegLight', 1)}
                        className="p-1 border border-slate-700 hover:border-slate-500 text-slate-400 hover:text-slate-200 rounded-md transition"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Heavy Meat */}
                  <div className="bg-slate-900/30 p-4 rounded-xl border border-slate-800/40 flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-slate-200 block">Heavy Meat Meals</span>
                      <span className="text-[10px] text-slate-500">Beef, lamb, pork, 2.80kg CO₂</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <button
                        type="button"
                        onClick={() => handleFoodCounter('nonVegHeavy', -1)}
                        className="p-1 border border-slate-700 hover:border-slate-500 text-slate-400 hover:text-slate-200 rounded-md transition"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="text-sm font-extrabold text-white w-5 text-center">{formState.food.nonVegHeavy}</span>
                      <button
                        type="button"
                        onClick={() => handleFoodCounter('nonVegHeavy', 1)}
                        className="p-1 border border-slate-700 hover:border-slate-500 text-slate-400 hover:text-slate-200 rounded-md transition"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Waste Tab */}
            {selectedTab === 'waste' && (
              <div className="space-y-5">
                <div>
                  <h4 className="text-sm font-bold text-white flex items-center mb-1">
                    <Trash2 className="w-4 h-4 mr-2 text-purple-400" />
                    House Waste & Disposal
                  </h4>
                  <p className="text-xs text-slate-400">Estimate weight of trash sent to landfills versus sorted and recycled trash.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Landfill Trash */}
                  <div className="bg-slate-900/30 p-4 rounded-xl border border-slate-800/40">
                    <div className="flex justify-between mb-2">
                      <span className="text-xs font-bold text-slate-300">Landfill Unsorted Waste</span>
                      <span className="text-xs font-bold text-purple-400">{formState.waste.landfill} kg</span>
                    </div>
                    <input
                      type="range"
                      aria-label="Landfill waste in kilograms"
                      min="0"
                      max="15"
                      step="0.2"
                      value={formState.waste.landfill}
                      onChange={(e) => handleWasteChange('landfill', e.target.value)}
                      className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-purple-500"
                    />
                  </div>

                  {/* Recycled Trash */}
                  <div className="bg-slate-900/30 p-4 rounded-xl border border-slate-800/40">
                    <div className="flex justify-between mb-2">
                      <span className="text-xs font-bold text-slate-300">Sorted Recycled Waste</span>
                      <span className="text-xs font-bold text-purple-400">{formState.waste.recycled} kg</span>
                    </div>
                    <input
                      type="range"
                      aria-label="Recycled waste in kilograms"
                      min="0"
                      max="15"
                      step="0.2"
                      value={formState.waste.recycled}
                      onChange={(e) => handleWasteChange('recycled', e.target.value)}
                      className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-purple-500"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Form Footer */}
          <div className="p-5 border-t border-slate-800/60 bg-slate-950/20 flex items-center justify-end">
            <button
              type="submit"
              aria-label="Save log data"
              className="flex items-center space-x-2 bg-emerald-500 hover:bg-emerald-600 text-slate-950 px-6 py-2.5 rounded-xl font-bold text-xs md:text-sm shadow-lg shadow-emerald-500/15 hover:shadow-emerald-600/20 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
            >
              <Save className="w-4 h-4" />
              <span>Save Log Data</span>
            </button>
          </div>
        </form>

        {/* Live Estimator Sidebar */}
        <div className="glass-panel p-5 rounded-2xl flex flex-col justify-between relative overflow-hidden bg-gradient-to-b from-slate-900 via-slate-950 to-slate-950">
          <div className="absolute top-0 right-0 -mt-6 -mr-6 w-24 h-24 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none"></div>

          <div>
            <h3 className="text-base font-bold text-white mb-0.5">Live Calculator</h3>
            <p className="text-xs text-slate-400 mb-5">Estimated carbon footprint for current tab configurations</p>

            {/* Total CO2 Display */}
            <div className="bg-slate-950/80 p-5 rounded-xl border border-slate-800/80 text-center mb-6">
              <span className="text-4xl font-extrabold text-white block leading-none">
                {liveEstimate.total}
              </span>
              <span className="text-[10px] text-slate-500 font-bold block uppercase tracking-wider mt-1.5">
                kg CO₂ equivalent
              </span>
            </div>

            {/* Category Bars breakdown */}
            <div className="space-y-4">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Share Breakdown</h4>

              {/* Transit bar */}
              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-slate-300">Travel</span>
                  <span className="text-slate-200">{liveEstimate.breakdown.travel} kg</span>
                </div>
                <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-500 transition-all duration-300"
                    style={{ width: `${liveEstimate.total > 0 ? (liveEstimate.breakdown.travel / liveEstimate.total) * 100 : 0}%` }}
                  ></div>
                </div>
              </div>

              {/* Electricity bar */}
              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-slate-300">Energy / Electricity</span>
                  <span className="text-slate-200">{liveEstimate.breakdown.electricity} kg</span>
                </div>
                <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-amber-500 transition-all duration-300"
                    style={{ width: `${liveEstimate.total > 0 ? (liveEstimate.breakdown.electricity / liveEstimate.total) * 100 : 0}%` }}
                  ></div>
                </div>
              </div>

              {/* Diet bar */}
              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-slate-300">Diet</span>
                  <span className="text-slate-200">{liveEstimate.breakdown.food} kg</span>
                </div>
                <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 transition-all duration-300"
                    style={{ width: `${liveEstimate.total > 0 ? (liveEstimate.breakdown.food / liveEstimate.total) * 100 : 0}%` }}
                  ></div>
                </div>
              </div>

              {/* Waste bar */}
              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-slate-300">Waste</span>
                  <span className="text-slate-200">{liveEstimate.breakdown.waste} kg</span>
                </div>
                <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-purple-500 transition-all duration-300"
                    style={{ width: `${liveEstimate.total > 0 ? (liveEstimate.breakdown.waste / liveEstimate.total) * 100 : 0}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-800/40 text-[10px] text-slate-500 text-center leading-relaxed">
            Values are dynamically generated from coefficients based on standard emission databases.
          </div>
        </div>

      </div>
    </div>
  );
}
