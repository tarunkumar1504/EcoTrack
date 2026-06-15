import React, { useState } from 'react';
import { Trees, Car, Smartphone, Trash2, HelpCircle } from 'lucide-react';

export default function OffsetSimulator({ initialSaved = 15 }) {
  const [simulationValue, setSimulationValue] = useState(initialSaved || 15);

  // Equivalencies calculations based on EPA Greenhouse Gas Equivalencies Calculator
  // 1 tree absorbs approx 0.06 kg CO2 per day (22 kg / year)
  const treeDays = (simulationValue / 0.06).toFixed(0);
  
  // 1 km of driving petrol car emits ~0.18 kg CO2
  const carKmSaved = (simulationValue / 0.18).toFixed(1);
  
  // Charging 1 smartphone emits ~0.008 kg CO2
  const phoneCharges = (simulationValue / 0.008).toFixed(0);
  
  // 1 kg of waste in landfill emits ~0.5 kg CO2
  const landfillAvoided = (simulationValue / 0.5).toFixed(1);

  return (
    <div className="glass-panel p-6 rounded-2xl relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 -mt-6 -mr-6 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none"></div>

      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-lg font-bold text-white">Eco-Offset Simulator</h3>
          <p className="text-xs text-slate-400">See what carbon savings actually mean in the real world</p>
        </div>
        <div className="bg-emerald-500/10 p-2 rounded-xl text-emerald-400">
          <Trees className="w-5 h-5" />
        </div>
      </div>

      {/* Slider Control */}
      <div className="bg-slate-900/40 p-4 rounded-xl border border-slate-800/40 mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs text-slate-400 font-semibold">Simulate Savings Amount:</span>
          <span className="text-sm font-extrabold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-md">
            {simulationValue} kg CO₂
          </span>
        </div>
        <input
          type="range"
          min="1"
          max="200"
          value={simulationValue}
          onChange={(e) => setSimulationValue(Number(e.target.value))}
          className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
        />
        <div className="flex justify-between text-[10px] text-slate-500 mt-1 font-semibold">
          <span>1 kg</span>
          <span>100 kg</span>
          <span>200 kg</span>
        </div>
      </div>

      {/* Equivalency Grid */}
      <div className="grid grid-cols-2 gap-4">
        {/* Tree Card */}
        <div className="bg-slate-900/30 p-3.5 rounded-xl border border-slate-800/40 flex items-start space-x-3 hover:border-emerald-500/10 transition-colors duration-200">
          <div className="bg-emerald-500/10 p-2 rounded-lg text-emerald-400 shrink-0">
            <Trees className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-lg font-extrabold text-slate-100">{Number(treeDays).toLocaleString()}</h4>
            <p className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">Tree-Days</p>
            <p className="text-[10px] text-slate-500 mt-0.5 leading-tight">Daily carbon absorption by 1 mature tree</p>
          </div>
        </div>

        {/* Car Card */}
        <div className="bg-slate-900/30 p-3.5 rounded-xl border border-slate-800/40 flex items-start space-x-3 hover:border-emerald-500/10 transition-colors duration-200">
          <div className="bg-blue-500/10 p-2 rounded-lg text-blue-400 shrink-0">
            <Car className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-lg font-extrabold text-slate-100">{Number(carKmSaved).toLocaleString()} km</h4>
            <p className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">Driving Avoided</p>
            <p className="text-[10px] text-slate-500 mt-0.5 leading-tight">Kilometers driven by an average petrol car</p>
          </div>
        </div>

        {/* Smartphone Card */}
        <div className="bg-slate-900/30 p-3.5 rounded-xl border border-slate-800/40 flex items-start space-x-3 hover:border-emerald-500/10 transition-colors duration-200">
          <div className="bg-purple-500/10 p-2 rounded-lg text-purple-400 shrink-0">
            <Smartphone className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-lg font-extrabold text-slate-100">{Number(phoneCharges).toLocaleString()}</h4>
            <p className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">Phone Charges</p>
            <p className="text-[10px] text-slate-500 mt-0.5 leading-tight">Smartphones fully charged from empty</p>
          </div>
        </div>

        {/* Waste Card */}
        <div className="bg-slate-900/30 p-3.5 rounded-xl border border-slate-800/40 flex items-start space-x-3 hover:border-emerald-500/10 transition-colors duration-200">
          <div className="bg-amber-500/10 p-2 rounded-lg text-amber-400 shrink-0">
            <Trash2 className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-lg font-extrabold text-slate-100">{landfillAvoided} kg</h4>
            <p className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">Landfill Diverted</p>
            <p className="text-[10px] text-slate-500 mt-0.5 leading-tight">Average organic waste sent to compost</p>
          </div>
        </div>
      </div>
    </div>
  );
}
