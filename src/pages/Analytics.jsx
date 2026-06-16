import { Calendar, Trash2, ShieldAlert, BarChart3, TrendingDown, HelpCircle } from 'lucide-react';
import { calculateDailyEmissions } from '../utils/calculations';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, BarChart, Bar, Cell } from 'recharts';

export default function Analytics({ logs, settings, onDeleteLog }) {
  // Parse emission values for charts
  const historyData = logs.map(log => {
    const emissions = calculateDailyEmissions(log.inputs);
    return {
      date: log.date,
      // Format date like 'Jun 15'
      dateLabel: new Date(log.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', timeZone: 'UTC' }),
      total: emissions.total,
      travel: emissions.breakdown.travel,
      energy: emissions.breakdown.electricity,
      food: emissions.breakdown.food,
      waste: emissions.breakdown.waste,
    };
  });

  // Calculate Average
  const totalEmissionsSum = historyData.reduce((sum, r) => sum + r.total, 0);
  const avgEmissions = historyData.length > 0 ? parseFloat((totalEmissionsSum / historyData.length).toFixed(1)) : 0;

  // Comparison chart data (User Avg vs Global Standards)
  const comparisonData = [
    { name: 'Your 7-Day Avg', value: avgEmissions, color: avgEmissions <= settings.dailyTarget ? '#10b981' : '#f59e0b' },
    { name: 'Target Budget', value: settings.dailyTarget, color: '#10b981' },
    { name: 'Global Average', value: 12.0, color: '#3b82f6' },
    { name: 'US Avg / Capita', value: 44.0, color: '#ef4444' },
  ];

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h2 className="text-2xl font-extrabold text-white">Analytics & Environmental Impact</h2>
        <p className="text-sm text-slate-400">Deep-dive analysis of your carbon emissions, historical trends, and global comparisons.</p>
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Area: 7-Day trend Area Chart */}
        <div className="lg:col-span-2 glass-panel p-5 rounded-2xl flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-white mb-0.5">Carbon Trend History</h3>
            <p className="text-xs text-slate-400 mb-6">Visual tracking of daily carbon emissions (kg CO₂ equivalent)</p>
          </div>

          {historyData.length > 0 ? (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={historyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.25}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0.0}/>
                    </linearGradient>
                  </defs>
                  <XAxis
                    dataKey="dateLabel"
                    stroke="#475569"
                    style={{ fontSize: '10px', fontWeight: 'bold' }}
                    tickLine={false}
                  />
                  <YAxis
                    stroke="#475569"
                    style={{ fontSize: '10px', fontWeight: 'bold' }}
                    tickLine={false}
                  />
                  <Tooltip
                    contentStyle={{ background: '#0b1329', border: '1px solid #1e293b', borderRadius: '8px' }}
                    itemStyle={{ color: '#f1f5f9' }}
                    labelStyle={{ color: '#64748b', fontWeight: 'bold', fontSize: '11px' }}
                  />
                  <Area
                    type="monotone"
                    dataKey="total"
                    name="Emissions"
                    stroke="#10b981"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#colorTotal)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-52 text-slate-500">
              <ShieldAlert className="w-8 h-8 mb-2 text-slate-600" />
              <p className="text-sm font-semibold">No historical log data available</p>
              <p className="text-xs mt-1">Please log your activities in the entry form to start tracking progress.</p>
            </div>
          )}
        </div>

        {/* Right Area: Comparative Bar Chart */}
        <div className="glass-panel p-5 rounded-2xl flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-white mb-0.5">Benchmark Comparison</h3>
            <p className="text-xs text-slate-400 mb-6">Comparing your daily average to global & target standards (kg/day)</p>
          </div>

          <div className="h-64 flex flex-col justify-around">
            <ResponsiveContainer width="100%" height="80%">
              <BarChart data={comparisonData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <XAxis
                  dataKey="name"
                  stroke="#475569"
                  style={{ fontSize: '9px', fontWeight: 'bold' }}
                  tickLine={false}
                  tickFormatter={(name) => name.split(' ')[0]} // Shorten labels
                />
                <YAxis
                  stroke="#475569"
                  style={{ fontSize: '10px', fontWeight: 'bold' }}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{ background: '#0b1329', border: '1px solid #1e293b', borderRadius: '8px' }}
                  itemStyle={{ color: '#f1f5f9' }}
                  cursor={{ fill: 'rgba(255, 255, 255, 0.02)' }}
                />
                <Bar dataKey="value" name="kg CO₂/day" radius={[4, 4, 0, 0]}>
                  {comparisonData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>

            {/* Explanations */}
            <div className="space-y-1.5 px-2">
              {comparisonData.map((item, index) => (
                <div key={index} className="flex items-center justify-between text-[10px] font-semibold">
                  <div className="flex items-center space-x-2">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }}></span>
                    <span className="text-slate-400">{item.name}</span>
                  </div>
                  <span className="text-slate-200">{item.value} kg</span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* History Log Table */}
      <div className="glass-panel p-5 rounded-2xl">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="text-base font-bold text-white">Daily Entry Logs</h3>
            <p className="text-xs text-slate-400">Detailed list of past calculations. Manage or delete records below.</p>
          </div>
          <span className="text-xs font-bold text-slate-400 bg-slate-900/60 px-3 py-1 rounded-lg border border-slate-800">
            Total Logs: {logs.length}
          </span>
        </div>

        {logs.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Travel (kg)</th>
                  <th className="py-3 px-4">Energy (kg)</th>
                  <th className="py-3 px-4">Diet (kg)</th>
                  <th className="py-3 px-4">Waste (kg)</th>
                  <th className="py-3 px-4 text-emerald-400">Total (kg)</th>
                  <th className="py-3 px-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/40">
                {logs.map((log) => {
                  const emission = calculateDailyEmissions(log.inputs);
                  return (
                    <tr key={log.id} className="hover:bg-slate-800/15 transition duration-150">
                      <td className="py-3.5 px-4 font-semibold text-slate-200 flex items-center space-x-2">
                        <Calendar className="w-3.5 h-3.5 text-slate-500" />
                        <span>{log.date}</span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-300">{emission.breakdown.travel}</td>
                      <td className="py-3.5 px-4 text-slate-300">{emission.breakdown.electricity}</td>
                      <td className="py-3.5 px-4 text-slate-300">{emission.breakdown.food}</td>
                      <td className="py-3.5 px-4 text-slate-300">{emission.breakdown.waste}</td>
                      <td className={`py-3.5 px-4 font-bold ${emission.total <= settings.dailyTarget ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {emission.total}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <button
                          onClick={() => onDeleteLog(log.id)}
                          className="text-slate-500 hover:text-rose-400 p-1 rounded-md transition"
                          title="Delete log record"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8 text-slate-500 font-semibold">
            No entries found. Visit "Log Activity" to add carbon emission details.
          </div>
        )}
      </div>
    </div>
  );
}
