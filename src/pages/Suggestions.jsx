import React, { useState } from 'react';
import { Leaf, Award, Lightbulb, Check, Car, Zap, ChefHat, Trash2, ArrowUpDown } from 'lucide-react';

export default function Suggestions({ suggestions, completedSuggestions, onClaimSuggestion }) {
  const [activeCategory, setActiveCategory] = useState('all');
  const [sortBy, setSortBy] = useState('impact'); // impact, points, difficulty

  // Category list
  const categoryFilters = [
    { id: 'all', name: 'All Actions', icon: Leaf },
    { id: 'travel', name: 'Travel', icon: Car },
    { id: 'electricity', name: 'Energy', icon: Zap },
    { id: 'food', name: 'Diet', icon: ChefHat },
    { id: 'waste', name: 'Waste', icon: Trash2 },
  ];

  // Helper for category badge icons
  const getCategoryIcon = (category) => {
    switch (category) {
      case 'travel': return Car;
      case 'electricity': return Zap;
      case 'food': return ChefHat;
      case 'waste': return Trash2;
      default: return Leaf;
    }
  };

  // Helper for difficulty colors
  const getDifficultyStyles = (level) => {
    switch (level) {
      case 'Easy':
        return 'text-emerald-400 bg-emerald-500/5 border-emerald-500/15';
      case 'Medium':
        return 'text-amber-400 bg-amber-500/5 border-amber-500/15';
      case 'Hard':
        return 'text-rose-400 bg-rose-500/5 border-rose-500/15';
      default:
        return 'text-slate-400 border-slate-700 bg-slate-800';
    }
  };

  // Filter suggestions
  const filtered = suggestions.filter(s => activeCategory === 'all' || s.category === activeCategory);

  // Sort suggestions
  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === 'impact') {
      return b.carbonSaved - a.carbonSaved; // High to low
    }
    if (sortBy === 'points') {
      return b.points - a.points; // High to low
    }
    if (sortBy === 'difficulty') {
      const difficultyOrder = { 'Easy': 1, 'Medium': 2, 'Hard': 3 };
      return difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty]; // Easy to hard
    }
    return 0;
  });

  // Calculate stats
  const claimedCount = completedSuggestions.length;
  const totalSavedCO2 = completedSuggestions.reduce((acc, id) => {
    const sug = suggestions.find(s => s.id === id);
    return acc + (sug ? sug.carbonSaved : 0);
  }, 0);

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h2 className="text-2xl font-extrabold text-white">Action Plan & Recommendations</h2>
        <p className="text-sm text-slate-400">Implement habits to decrease your footprint. Claim completed challenges to earn Eco Points.</p>
      </div>

      {/* Analytics Summary Banner */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Total Actions Claimed */}
        <div className="glass-panel p-5 rounded-2xl flex items-center space-x-4">
          <div className="bg-emerald-500/10 p-3 rounded-xl text-emerald-400 shrink-0">
            <Check className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Completed Actions</span>
            <h4 className="text-xl font-extrabold text-white">{claimedCount} challenges</h4>
          </div>
        </div>

        {/* Dynamic Cumulative Savings */}
        <div className="glass-panel p-5 rounded-2xl flex items-center space-x-4">
          <div className="bg-blue-500/10 p-3 rounded-xl text-blue-400 shrink-0">
            <Leaf className="w-6 h-6 animate-pulse-soft" />
          </div>
          <div>
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Daily CO₂ Avoided</span>
            <h4 className="text-xl font-extrabold text-emerald-400">-{totalSavedCO2.toFixed(2)} kg CO₂/day</h4>
          </div>
        </div>

        {/* Global Impact Badge */}
        <div className="glass-panel p-5 rounded-2xl flex items-center space-x-4">
          <div className="bg-amber-500/10 p-3 rounded-xl text-amber-400 shrink-0">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Environmental Tier</span>
            <h4 className="text-xl font-extrabold text-white">
              {claimedCount >= 6 ? 'Green Advocate' : claimedCount >= 3 ? 'Eco Catalyst' : 'Active Learner'}
            </h4>
          </div>
        </div>
      </div>

      {/* Category filters and sorting dropdown */}
      <div className="glass-panel p-4 rounded-2xl flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Filters */}
        <div className="flex flex-wrap gap-1.5">
          {categoryFilters.map((filter) => {
            const FilterIcon = filter.icon;
            const isSelected = activeCategory === filter.id;
            return (
              <button
                key={filter.id}
                onClick={() => setActiveCategory(filter.id)}
                className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                  isSelected
                    ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/10'
                    : 'text-slate-400 hover:text-slate-200 bg-slate-800/40 hover:bg-slate-800/80 border border-slate-800/50'
                }`}
              >
                <FilterIcon className="w-3.5 h-3.5" />
                <span>{filter.name}</span>
              </button>
            );
          })}
        </div>

        {/* Sorting Dropdown */}
        <div className="flex items-center space-x-2.5 bg-slate-900 px-3 py-2 rounded-xl border border-slate-800 shrink-0">
          <ArrowUpDown className="w-3.5 h-3.5 text-slate-500" />
          <span className="text-xs font-semibold text-slate-400">Sort:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-transparent border-0 text-xs font-bold text-slate-200 focus:ring-0 focus:outline-none cursor-pointer"
          >
            <option value="impact">Highest Savings</option>
            <option value="points">Eco Points Reward</option>
            <option value="difficulty">Difficulty Level</option>
          </select>
        </div>
      </div>

      {/* Main Grid: suggestions cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {sorted.map((sug) => {
          const ItemIcon = getCategoryIcon(sug.category);
          const difficultyStyles = getDifficultyStyles(sug.difficulty);
          const isCompleted = completedSuggestions.includes(sug.id);

          return (
            <div
              key={sug.id}
              className={`glass-panel p-5 rounded-2xl flex flex-col justify-between transition-all duration-300 relative overflow-hidden ${
                isCompleted
                  ? 'border-emerald-500/40 bg-emerald-950/5 shadow-md shadow-emerald-950/10'
                  : 'hover:border-slate-800 hover:translate-y-[-2px]'
              }`}
            >
              {/* Completed Check Overlay badge */}
              {isCompleted && (
                <div className="absolute top-0 right-0 bg-emerald-500 text-slate-950 px-2 py-0.5 rounded-bl-xl text-[9px] font-extrabold flex items-center space-x-0.5">
                  <Check className="w-3 h-3" />
                  <span>CLAIMED</span>
                </div>
              )}

              {/* Top info */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-[10px] uppercase font-extrabold text-slate-500">
                    <ItemIcon className="w-3.5 h-3.5 text-slate-400" />
                    <span>{sug.category}</span>
                  </div>
                  <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${difficultyStyles}`}>
                    {sug.difficulty}
                  </span>
                </div>

                <div className="space-y-1.5">
                  <h3 className="text-sm font-bold text-white line-clamp-1">{sug.title}</h3>
                  <p className="text-xs text-slate-400 leading-normal line-clamp-3">{sug.description}</p>
                </div>
              </div>

              {/* Bottom stats and claim button */}
              <div className="mt-5 pt-4 border-t border-slate-800/40 flex flex-col space-y-4">
                {/* Impact details */}
                <div className="flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-[9px] text-slate-500 uppercase font-bold tracking-wider">Savings:</span>
                    <span className="text-xs font-extrabold text-emerald-400">-{sug.carbonSaved} kg CO₂ / day</span>
                  </div>
                  <div className="flex flex-col text-right">
                    <span className="text-[9px] text-slate-500 uppercase font-bold tracking-wider">Reward:</span>
                    <span className="text-xs font-extrabold text-amber-500">+{sug.points} Eco Pts</span>
                  </div>
                </div>

                {/* Helpful Tip Accordion-style item */}
                <div className="bg-slate-900/30 p-2.5 rounded-lg border border-slate-800/50 flex items-start space-x-2">
                  <Lightbulb className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <p className="text-[10px] text-slate-400 font-medium leading-relaxed">{sug.tips}</p>
                </div>

                {/* Claim Button */}
                <button
                  type="button"
                  onClick={() => onClaimSuggestion(sug.id, sug.points)}
                  className={`w-full py-2.5 rounded-xl font-bold text-xs flex items-center justify-center space-x-2 transition ${
                    isCompleted
                      ? 'bg-slate-800 hover:bg-slate-700/80 text-rose-400 border border-slate-700/40'
                      : 'bg-emerald-500 hover:bg-emerald-600 text-slate-950 shadow-lg shadow-emerald-500/10'
                  }`}
                >
                  {isCompleted ? (
                    <>
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Undo Challenge</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Complete Habit</span>
                    </>
                  )}
                </button>
              </div>

            </div>
          );
        })}
      </div>
    </div>
  );
}
