import React from 'react';
import { Calendar, AlertTriangle, TrendingDown, TrendingUp, Sparkles, Check, Car, Zap, ChefHat, Trash2, ArrowUpDown } from 'lucide-react';
import StatCard from '../components/StatCard';
import OffsetSimulator from '../components/OffsetSimulator';
import { calculateDailyEmissions } from '../utils/calculations';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, AreaChart, Area, XAxis, YAxis, ReferenceLine } from 'recharts';

export default function Dashboard({ logs, settings, completedSuggestions, suggestions, onClaimSuggestion, ecoPoints, setActivePage }) {
  // Get latest log
  const latestLog = logs && logs.length > 0 ? logs[logs.length - 1] : null;
  const latestEmissions = latestLog ? calculateDailyEmissions(latestLog.inputs) : { total: 0, breakdown: { travel: 0, electricity: 0, food: 0, waste: 0 } };

  // Calculate stats
  const todayVal = latestEmissions.total;
  const targetVal = settings.dailyTarget;

  // Calculate 7-day average
  const total7Days = logs.reduce((sum, log) => sum + calculateDailyEmissions(log.inputs).total, 0);
  const avgVal = logs.length > 0 ? parseFloat((total7Days / logs.length).toFixed(2)) : 0;

  // Streak: count days under target (starting from latest)
  let streak = 0;
  for (let i = logs.length - 1; i >= 0; i--) {
    const daily = calculateDailyEmissions(logs[i].inputs);
    if (daily.total <= targetVal) {
      streak++;
    } else {
      break; // break streak on exceeding target
    }
  }

  // Determine Yesterday status
  const getStatus = (val) => {
    if (val <= targetVal * 0.8) return 'success';
    if (val <= targetVal) return 'warning';
    return 'danger';
  };

  // Target comparison message
  const pctDiff = targetVal > 0 ? ((todayVal - targetVal) / targetVal) * 100 : 0;
  const yesterdaySubtitle = todayVal <= targetVal
    ? `${Math.abs(pctDiff).toFixed(0)}% below target limit`
    : `${pctDiff.toFixed(0)}% above target limit`;

  // Pie chart data
  const pieData = [
    { name: 'Travel', value: latestEmissions.breakdown.travel, color: '#3b82f6', icon: Car },
    { name: 'Energy', value: latestEmissions.breakdown.electricity, color: '#f59e0b', icon: Zap },
    { name: 'Food', value: latestEmissions.breakdown.food, color: '#10b981', icon: ChefHat },
    { name: 'Waste', value: latestEmissions.breakdown.waste, color: '#8b5cf6', icon: Trash2 },
  ].filter(item => item.value > 0);

  // Line chart history trend data
  const historyData = logs.map(log => {
    const emissions = calculateDailyEmissions(log.inputs);
    return {
      date: log.date,
      dateLabel: new Date(log.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', timeZone: 'UTC' }),
      total: emissions.total
    };
  });

  // Personalized eco tips based on highest emitter
  const getEcoAdvice = () => {
    const b = latestEmissions.breakdown;
    const max = Math.max(b.travel, b.electricity, b.food, b.waste);
    
    if (max === 0) return { title: "Great work!", tip: "Log your activities daily to calculate your footprint and start shrinking your environmental impact.", category: "general" };
    if (max === b.travel) return { title: "Focus on Transit", tip: "Your travel emissions are currently your largest factor. Consider carpooling, biking for short trips, or using public transit to cut this down.", category: "travel" };
    if (max === b.electricity) return { title: "Reduce Energy Use", tip: "Heating and electronics are driving up your footprint. Try switching off standby appliances and using cold water for laundry cycles.", category: "electricity" };
    if (max === b.food) return { title: "Revamp Food Habits", tip: "Food habits represent your largest impact right now. Replacing just two meat meals with vegetarian options can save up to 10kg CO2 per week.", category: "food" };
    return { title: "Manage Home Waste", tip: "Waste generation is running high. Try composting organic waste and double-checking recyclable packaging details before disposal.", category: "waste" };
  };

  const advice = getEcoAdvice();

  // Find 2 active suggestions that haven't been completed yet
  const uncompletedSugs = suggestions
    .filter(s => !completedSuggestions.includes(s.id))
    .slice(0, 2);

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="glass-panel glass-panel-glow p-6 rounded-3xl relative overflow-hidden flex flex-col md:flex-row md:items-center md:justify-between">
        {/* Background Gradients */}
        <div className="absolute top-0 left-0 -mt-10 -ml-10 w-40 h-40 bg-eco-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 right-0 -mb-10 -mr-10 w-40 h-40 bg-teal-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="space-y-1 relative z-10">
          <h2 className="text-2xl font-extrabold text-white">
            Hello, <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">{settings.userName}</span>
          </h2>
          <p className="text-sm text-slate-400">
            {streak > 0 
              ? `You are on a ${streak}-day carbon target streak! Keep it going.` 
              : 'Start logging your daily habits to build your green streak.'}
          </p>
        </div>

        <div className="mt-4 md:mt-0 flex items-center space-x-3 relative z-10">
          <span className="text-xs font-semibold text-slate-400 flex items-center bg-slate-900/60 px-3.5 py-1.5 rounded-full border border-slate-800">
            <Calendar className="w-3.5 h-3.5 mr-2 text-eco-400" />
            Latest Log: {latestLog ? latestLog.date : 'None'}
          </span>
          <button
            onClick={() => setActivePage('input')}
            className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs shadow-lg shadow-emerald-500/20 hover:shadow-emerald-600/30 transition-all duration-200"
          >
            + Log Activity
          </button>
        </div>
      </div>

      {/* Stats Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Yesterday's Footprint"
          value={latestLog ? todayVal : 'No Log'}
          unit={latestLog ? 'kg CO₂' : ''}
          subtitle={latestLog ? yesterdaySubtitle : 'Log yesterday\'s entries'}
          icon={Calendar}
          status={latestLog ? getStatus(todayVal) : 'neutral'}
          trend={latestLog ? (todayVal <= targetVal ? 'On Track' : 'Over Limit') : null}
        />
        <StatCard
          title="7-Day Avg Footprint"
          value={avgVal}
          unit="kg CO₂"
          subtitle={`Limit target is ${targetVal} kg`}
          icon={TrendingDown}
          status={getStatus(avgVal)}
          trend={avgVal <= targetVal ? 'Good' : 'Needs Work'}
        />
        <StatCard
          title="Daily Budget Target"
          value={targetVal}
          unit="kg CO₂"
          subtitle="Adjustable in Settings"
          icon={Sparkles}
          status="neutral"
        />
        <StatCard
          title="Active Eco Streak"
          value={streak}
          unit="days"
          subtitle="Days staying under limit budget"
          icon={TrendingDown}
          status={streak > 0 ? 'success' : 'neutral'}
          trend={streak > 0 ? `${streak} Days 🔥` : 'No Streak'}
        />
      </div>

      {/* Main Panel Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Charts and Advice */}
        <div className="lg:col-span-2 space-y-6">
          {/* Pie Chart Card */}
          <div className="glass-panel p-6 rounded-2xl">
            <h3 className="text-base font-bold text-white mb-1">Yesterday's Emission Split</h3>
            <p className="text-xs text-slate-400 mb-6">Visual share of your latest logged emissions by activity</p>

            {pieData.length > 0 ? (
              <div className="flex flex-col md:flex-row items-center justify-around h-64">
                {/* Pie Chart container */}
                <div className="w-48 h-48 relative">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={55}
                        outerRadius={75}
                        paddingAngle={3}
                        dataKey="value"
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{ background: '#0b1329', border: '1px solid #1e293b', borderRadius: '8px' }}
                        itemStyle={{ color: '#f1f5f9' }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                  {/* Absolute Center Sum */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-2xl font-extrabold text-white">{todayVal}</span>
                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">kg CO₂</span>
                  </div>
                </div>

                {/* Legends */}
                <div className="space-y-3 shrink-0 mt-4 md:mt-0 w-full md:w-auto">
                  {pieData.map((item, index) => {
                    const ItemIcon = item.icon;
                    return (
                      <div key={index} className="flex items-center justify-between space-x-6 md:space-x-12 px-3 py-1.5 rounded-lg hover:bg-slate-800/20">
                        <div className="flex items-center space-x-3">
                          <div className="p-1.5 rounded-md text-white" style={{ backgroundColor: `${item.color}15` }}>
                            <ItemIcon className="w-4 h-4" style={{ color: item.color }} />
                          </div>
                          <span className="text-xs font-semibold text-slate-300">{item.name}</span>
                        </div>
                        <div className="text-right">
                          <span className="text-xs font-bold text-slate-200">{item.value} kg</span>
                          <span className="text-[10px] text-slate-500 font-bold block">
                            {((item.value / todayVal) * 100).toFixed(0)}%
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-48 text-slate-500">
                <AlertTriangle className="w-8 h-8 mb-2 text-slate-600" />
                <p className="text-sm font-semibold">No carbon emissions logged for yesterday</p>
                <p className="text-xs mt-1">Add activities to see your carbon breakdown here.</p>
              </div>
            )}
          </div>

          {/* Line Chart Card */}
          <div className="glass-panel p-6 rounded-2xl">
            <h3 className="text-base font-bold text-white mb-1">Carbon Footprint Trend</h3>
            <p className="text-xs text-slate-400 mb-6">Daily emissions trend lines showing target thresholds</p>

            {historyData.length > 0 ? (
              <div className="h-48 min-w-0">
                <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                  <AreaChart data={historyData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                    <defs>
                      <linearGradient id="dashboardColorTotal" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0.0}/>
                      </linearGradient>
                    </defs>
                    <XAxis
                      dataKey="dateLabel"
                      stroke="#475569"
                      style={{ fontSize: '9px', fontWeight: 'bold' }}
                      tickLine={false}
                    />
                    <YAxis
                      stroke="#475569"
                      style={{ fontSize: '9px', fontWeight: 'bold' }}
                      tickLine={false}
                    />
                    <Tooltip
                      contentStyle={{ background: '#0b1329', border: '1px solid #1e293b', borderRadius: '8px' }}
                      itemStyle={{ color: '#f1f5f9' }}
                      labelStyle={{ color: '#64748b', fontWeight: 'bold', fontSize: '10px' }}
                    />
                    <ReferenceLine y={targetVal} stroke="#f59e0b" strokeDasharray="3 3" label={{ value: 'Target', fill: '#f59e0b', fontSize: 9, position: 'insideTopRight' }} />
                    <Area
                      type="monotone"
                      dataKey="total"
                      name="CO₂ Output"
                      stroke="#10b981"
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#dashboardColorTotal)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-40 text-slate-500">
                <AlertTriangle className="w-8 h-8 mb-2 text-slate-600" />
                <p className="text-sm font-semibold">No carbon history loaded</p>
              </div>
            )}
          </div>

          {/* Eco Tips Advice Card */}
          <div className="glass-panel p-5 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 border-l-4 border-l-emerald-500">
            <div className="flex items-start space-x-4">
              <div className="bg-emerald-500/10 p-2.5 rounded-xl text-emerald-400 shrink-0">
                <Sparkles className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-emerald-400 uppercase tracking-wider">{advice.title}</h4>
                <p className="text-sm text-slate-200 font-medium leading-relaxed">{advice.tip}</p>
                <button
                  onClick={() => setActivePage('suggestions')}
                  className="text-xs text-emerald-400 hover:text-emerald-300 font-bold underline inline-block pt-1.5"
                >
                  Explore Action Plan &rarr;
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right 1 Col: Offset Simulator and Actions */}
        <div className="space-y-6">
          {/* Embed simulator */}
          <OffsetSimulator initialSaved={Math.max(1, 12 - todayVal)} />

          {/* Quick Challenges Card */}
          <div className="glass-panel p-5 rounded-2xl space-y-4">
            <div>
              <h3 className="text-base font-bold text-white">Quick Eco Challenges</h3>
              <p className="text-xs text-slate-400">Claim suggestions to reduce footprint and earn points</p>
            </div>

            <div className="space-y-3">
              {uncompletedSugs.length > 0 ? (
                uncompletedSugs.map((sug) => (
                  <div key={sug.id} className="bg-slate-900/40 p-3.5 rounded-xl border border-slate-800/40 flex items-start justify-between space-x-2.5 hover:border-slate-700/60 transition-colors">
                    <div className="space-y-1">
                      <h4 className="text-xs font-bold text-slate-200">{sug.title}</h4>
                      <p className="text-[10px] text-slate-500 leading-tight line-clamp-2">{sug.description}</p>
                      <div className="flex items-center space-x-2 pt-1.5">
                        <span className="text-[9px] font-bold text-emerald-400 bg-emerald-500/5 border border-emerald-500/15 px-1.5 py-0.5 rounded-md">
                          -{sug.carbonSaved}kg CO₂/day
                        </span>
                        <span className="text-[9px] font-bold text-amber-500 bg-amber-500/5 border border-amber-500/15 px-1.5 py-0.5 rounded-md">
                          +{sug.points} pts
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => onClaimSuggestion(sug.id, sug.points)}
                      className="bg-emerald-500/10 hover:bg-emerald-500 text-emerald-400 hover:text-slate-950 p-1.5 rounded-lg border border-emerald-500/20 hover:border-transparent transition-all shrink-0 self-center"
                      title="Mark Completed"
                    >
                      <Check className="w-4 h-4 font-extrabold" />
                    </button>
                  </div>
                ))
              ) : (
                <div className="text-center py-4 text-xs text-slate-500 font-semibold">
                  🎉 You've completed all active challenges!
                </div>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
