import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  Area,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
} from 'recharts';
import {
  generate30DayIntakeHistory,
  calculateIntakeStats,
  appendIntakeItemToHistory,
  WHO_RECOMMENDED_SUGAR_LIMIT,
  FDA_MAX_SODIUM_LIMIT,
  RECOMMENDED_PROTEIN_TARGET,
} from '../data/nutritionHistoryData';
import { DailyNutritionalIntake, IntakeLogItem } from '../types';
import { useApp } from '../context/AppContext';

export const NutritionHistoryChart: React.FC = () => {
  const { products, intakeHistory: historyData, updateIntakeHistory: persistData } = useApp();

  const [timeRange, setTimeRange] = useState<'7' | '14' | '30'>('30');
  const [activeMetrics, setActiveMetrics] = useState<{
    sugar: boolean;
    sodium: boolean;
    protein: boolean;
  }>({
    sugar: true,
    sodium: true,
    protein: true,
  });

  const [chartMode, setChartMode] = useState<'area' | 'bar' | 'lines'>('area');
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);
  const [selectedDayDetail, setSelectedDayDetail] = useState<DailyNutritionalIntake | null>(null);

  // Form state for logging a food item to today's record
  const [logForm, setLogForm] = useState<{
    name: string;
    sugar: number;
    sodium: number;
    protein: number;
    calories: number;
  }>({
    name: '',
    sugar: 8,
    sodium: 220,
    protein: 14,
    calories: 210,
  });

  // Filter dataset by selected time range
  const displayedData = useMemo(() => {
    const days = parseInt(timeRange, 10);
    return historyData.slice(-days);
  }, [historyData, timeRange]);

  // Aggregate stats across the displayed period
  const stats = useMemo(() => {
    return calculateIntakeStats(displayedData);
  }, [displayedData]);

  // Quick preset logger from current catalog
  const handleSelectCatalogItem = (productId: string) => {
    const found = products.find((p) => p.id === productId);
    if (!found) return;

    // Parse nutrients safely
    const sugarNum = parseFloat(found.nutrients.sugars.replace(/[^0-9.]/g, '')) || 5;
    const sodiumNum = parseFloat(found.nutrients.sodium.replace(/[^0-9.]/g, '')) || 180;
    const proteinNum = parseFloat(found.nutrients.protein.replace(/[^0-9.]/g, '')) || 8;

    setLogForm({
      name: `${found.brand} ${found.name}`,
      sugar: sugarNum,
      sodium: sodiumNum,
      protein: proteinNum,
      calories: found.nutrients.calories || 200,
    });
  };

  // Add food log to today (synced to Firestore via persistData)
  const handleAddIntake = (e: React.FormEvent) => {
    e.preventDefault();
    if (!logForm.name.trim()) return;

    const newItem: IntakeLogItem = {
      id: `intake-${Date.now()}`,
      name: logForm.name.trim(),
      sugar: Number(logForm.sugar),
      sodium: Number(logForm.sodium),
      protein: Number(logForm.protein),
      calories: Number(logForm.calories),
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
    };

    const updated = appendIntakeItemToHistory(historyData, newItem);
    persistData(updated);

    // Reset form & close modal
    setLogForm({
      name: '',
      sugar: 8,
      sodium: 220,
      protein: 14,
      calories: 210,
    });
    setIsLogModalOpen(false);
  };

  // Reset to clean 30-day timeline
  const handleResetBaseline = () => {
    if (window.confirm('Clear all logged meals and reset your 30-day intake timeline to 0?')) {
      const fresh = generate30DayIntakeHistory();
      persistData(fresh);
      setSelectedDayDetail(null);
    }
  };

  // Export CSV
  const handleExportCSV = () => {
    const headers = ['Date', 'Sugar (g)', 'Sodium (mg)', 'Protein (g)', 'Calories', 'Items Logged'];
    const rows = historyData.map((d) => [
      d.date,
      d.sugar,
      d.sodium,
      d.protein,
      d.calories,
      `"${d.items.map((i) => i.name).join('; ')}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `IngreGuide_30d_nutritional_intake_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-xs space-y-6">
      {/* Header and Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div className="space-y-1">
          <h2 className="text-xl sm:text-2xl font-black text-[#0f172a] tracking-tight">
            30-Day Nutrient Intake History &amp; Trends
          </h2>
          <p className="text-xs text-[#64748b]">
            Continuous tracking of sugar (g), sodium (mg), and protein (g) consumption across all scanned meals and verified foods.
          </p>
        </div>

        {/* Global Toolbar */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Range Selector */}
          <div className="inline-flex bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => setTimeRange('7')}
              className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                timeRange === '7' ? 'bg-white text-[#0f172a] shadow-xs' : 'text-[#64748b] hover:text-[#0f172a]'
              }`}
            >
              7D
            </button>
            <button
              onClick={() => setTimeRange('14')}
              className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                timeRange === '14' ? 'bg-white text-[#0f172a] shadow-xs' : 'text-[#64748b] hover:text-[#0f172a]'
              }`}
            >
              14D
            </button>
            <button
              onClick={() => setTimeRange('30')}
              className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                timeRange === '30' ? 'bg-white text-[#0f172a] shadow-xs' : 'text-[#64748b] hover:text-[#0f172a]'
              }`}
            >
              30D
            </button>
          </div>

          {/* Chart Display Mode */}
          <div className="inline-flex bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => setChartMode('area')}
              title="Smooth Area Trend"
              className={`p-1.5 rounded-lg text-xs transition-all ${
                chartMode === 'area' ? 'bg-white text-[#0f172a] shadow-xs' : 'text-[#64748b] hover:text-[#0f172a]'
              }`}
            >
              <span className="material-symbols-outlined text-base block">area_chart</span>
            </button>
            <button
              onClick={() => setChartMode('bar')}
              title="Daily Bar Breakdown"
              className={`p-1.5 rounded-lg text-xs transition-all ${
                chartMode === 'bar' ? 'bg-white text-[#0f172a] shadow-xs' : 'text-[#64748b] hover:text-[#0f172a]'
              }`}
            >
              <span className="material-symbols-outlined text-base block">bar_chart</span>
            </button>
            <button
              onClick={() => setChartMode('lines')}
              title="Multi-Line Trajectory"
              className={`p-1.5 rounded-lg text-xs transition-all ${
                chartMode === 'lines' ? 'bg-white text-[#0f172a] shadow-xs' : 'text-[#64748b] hover:text-[#0f172a]'
              }`}
            >
              <span className="material-symbols-outlined text-base block">show_chart</span>
            </button>
          </div>

          {/* Action Buttons */}
          <button
            onClick={() => setIsLogModalOpen(true)}
            className="inline-flex items-center gap-1.5 bg-[#5379EE] hover:bg-[#4368DD] text-white px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shadow-xs active:scale-95"
          >
            <span className="material-symbols-outlined text-sm">add</span>
            <span>Log Meal</span>
          </button>

          <button
            onClick={handleExportCSV}
            title="Export CSV Dataset"
            className="p-2 rounded-xl border border-slate-200 text-[#64748b] hover:text-[#0f172a] hover:bg-slate-50 transition-colors"
          >
            <span className="material-symbols-outlined text-base block">download</span>
          </button>

          <button
            onClick={handleResetBaseline}
            title="Reset Timeline to Default 30-Day Set"
            className="p-2 rounded-xl border border-slate-200 text-[#64748b] hover:text-[#e11d48] hover:bg-rose-50 transition-colors"
          >
            <span className="material-symbols-outlined text-base block">refresh</span>
          </button>
        </div>
      </div>

      {/* KPI Metrics Ribbon */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Metric 1: Sugar */}
        <div
          onClick={() => setActiveMetrics((prev) => ({ ...prev, sugar: !prev.sugar }))}
          className={`p-4 rounded-2xl border transition-all cursor-pointer select-none ${
            activeMetrics.sugar
              ? 'bg-[#fffbeb] border-[#fde68a] shadow-xs ring-1 ring-[#f59e0b]'
              : 'bg-slate-50 border-slate-200 opacity-60'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#f59e0b]"></span>
              <span className="text-xs font-bold text-[#b45309]">Avg Sugar Intake</span>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-white text-[#92400e] border border-amber-200 font-bold">
              WHO Limit: 25g/d
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-[#0f172a]">{stats.avgSugar}</span>
            <span className="text-xs font-bold text-[#64748b]">g / day</span>
            <span
              className={`ml-auto text-xs font-bold ${
                stats.avgSugar <= WHO_RECOMMENDED_SUGAR_LIMIT ? 'text-[#2563EB]' : 'text-[#e11d48]'
              }`}
            >
              {stats.sugarThresholdPct}% Limit
            </span>
          </div>
          <p className="text-[11px] text-[#78350f] mt-1">
            {stats.avgSugar <= WHO_RECOMMENDED_SUGAR_LIMIT
              ? '✓ Compliant with World Health Organization bounds'
              : '⚠ Exceeds ideal daily free-sugar threshold'}
          </p>
        </div>

        {/* Metric 2: Sodium */}
        <div
          onClick={() => setActiveMetrics((prev) => ({ ...prev, sodium: !prev.sodium }))}
          className={`p-4 rounded-2xl border transition-all cursor-pointer select-none ${
            activeMetrics.sodium
              ? 'bg-[#f0f9ff] border-[#bae6fd] shadow-xs ring-1 ring-[#0ea5e9]'
              : 'bg-slate-50 border-slate-200 opacity-60'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#0ea5e9]"></span>
              <span className="text-xs font-bold text-[#0369a1]">Avg Sodium Intake</span>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-white text-[#075985] border border-sky-200 font-bold">
              FDA Max: 2,300mg
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-[#0f172a]">{stats.avgSodium.toLocaleString()}</span>
            <span className="text-xs font-bold text-[#64748b]">mg / day</span>
            <span
              className={`ml-auto text-xs font-bold ${
                stats.avgSodium <= FDA_MAX_SODIUM_LIMIT ? 'text-[#2563EB]' : 'text-[#e11d48]'
              }`}
            >
              {stats.sodiumThresholdPct}% Max
            </span>
          </div>
          <p className="text-[11px] text-[#0369a1] mt-1">
            {stats.avgSodium <= 1800
              ? '✓ Optimal cardiovascular retention level'
              : stats.avgSodium <= FDA_MAX_SODIUM_LIMIT
              ? '• Within regulatory upper limit'
              : '⚠ High sodium risk detected'}
          </p>
        </div>

        {/* Metric 3: Protein */}
        <div
          onClick={() => setActiveMetrics((prev) => ({ ...prev, protein: !prev.protein }))}
          className={`p-4 rounded-2xl border transition-all cursor-pointer select-none ${
            activeMetrics.protein
              ? 'bg-[#eef2ff] border-[#c7d2fe] shadow-xs ring-1 ring-[#5379EE]'
              : 'bg-slate-50 border-slate-200 opacity-60'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#5379EE]"></span>
              <span className="text-xs font-bold text-[#4338ca]">Avg Protein Intake</span>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-white text-[#3730a3] border border-indigo-200 font-bold">
              Target: 55g/d
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-[#0f172a]">{stats.avgProtein}</span>
            <span className="text-xs font-bold text-[#64748b]">g / day</span>
            <span className="ml-auto text-xs font-bold text-[#5379EE]">
              {stats.proteinGoalPct}% Goal
            </span>
          </div>
          <p className="text-[11px] text-[#4338ca] mt-1">
            {stats.proteinGoalPct >= 100
              ? '✓ Muscle synthesis & recovery goal attained'
              : '• Approaching ideal amino acid baseline'}
          </p>
        </div>
      </div>

      {/* Recharts Visualization Canvas */}
      <div className="relative w-full h-80 sm:h-96 pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={displayedData}
            margin={{ top: 15, right: 10, left: -10, bottom: 5 }}
            onClick={(state: any) => {
              if (state && state.activePayload && state.activePayload.length > 0) {
                const day = state.activePayload[0].payload as DailyNutritionalIntake;
                setSelectedDayDetail(day);
              }
            }}
          >
            <defs>
              <linearGradient id="sugarGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="sodiumGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.35} />
                <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="proteinGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#5379EE" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#5379EE" stopOpacity={0.0} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />

            <XAxis
              dataKey="displayDate"
              tickLine={false}
              axisLine={{ stroke: '#cbd5e1' }}
              tick={{ fill: '#64748b', fontSize: 11, fontFamily: 'monospace' }}
            />

            {/* Left Y-Axis for Grams (Sugar & Protein) */}
            <YAxis
              yAxisId="left"
              orientation="left"
              domain={[0, 90]}
              tickLine={false}
              axisLine={{ stroke: '#cbd5e1' }}
              tick={{ fill: '#64748b', fontSize: 11, fontFamily: 'monospace' }}
              unit="g"
            />

            {/* Right Y-Axis for Milligrams (Sodium) */}
            {activeMetrics.sodium && (
              <YAxis
                yAxisId="right"
                orientation="right"
                domain={[0, 3000]}
                tickLine={false}
                axisLine={{ stroke: '#cbd5e1' }}
                tick={{ fill: '#0ea5e9', fontSize: 11, fontFamily: 'monospace' }}
                unit="mg"
              />
            )}

            {/* Reference Guidelines */}
            {activeMetrics.sugar && (
              <ReferenceLine
                yAxisId="left"
                y={WHO_RECOMMENDED_SUGAR_LIMIT}
                stroke="#d97706"
                strokeDasharray="4 4"
                label={{
                  value: 'WHO Sugar Limit (25g)',
                  fill: '#d97706',
                  fontSize: 10,
                  position: 'insideTopLeft',
                }}
              />
            )}

            {activeMetrics.protein && (
              <ReferenceLine
                yAxisId="left"
                y={RECOMMENDED_PROTEIN_TARGET}
                stroke="#5379EE"
                strokeDasharray="4 4"
                label={{
                  value: 'Protein Goal (55g)',
                  fill: '#5379EE',
                  fontSize: 10,
                  position: 'insideBottomLeft',
                }}
              />
            )}

            {activeMetrics.sodium && (
              <ReferenceLine
                yAxisId="right"
                y={FDA_MAX_SODIUM_LIMIT}
                stroke="#e11d48"
                strokeDasharray="5 5"
                label={{
                  value: 'FDA Sodium Max (2300mg)',
                  fill: '#e11d48',
                  fontSize: 10,
                  position: 'insideTopRight',
                }}
              />
            )}

            {/* Custom Tooltip */}
            <Tooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload as DailyNutritionalIntake;
                  return (
                    <div className="bg-white/95 backdrop-blur-md p-3.5 rounded-2xl shadow-xl border border-slate-200 text-xs min-w-[210px] space-y-2">
                      <div className="flex items-center justify-between border-b border-slate-100 pb-1.5">
                        <span className="font-bold text-[#0f172a]">{label}</span>
                        <span className="text-[10px] text-[#64748b]">{data.date}</span>
                      </div>

                      <div className="space-y-1">
                        {activeMetrics.sugar && (
                          <div className="flex items-center justify-between text-[#b45309]">
                            <span className="flex items-center gap-1.5">
                              <span className="w-2 h-2 rounded-full bg-[#f59e0b]"></span>
                              Sugar:
                            </span>
                            <span className="font-bold">{data.sugar} g</span>
                          </div>
                        )}
                        {activeMetrics.sodium && (
                          <div className="flex items-center justify-between text-[#0284c7]">
                            <span className="flex items-center gap-1.5">
                              <span className="w-2 h-2 rounded-full bg-[#0ea5e9]"></span>
                              Sodium:
                            </span>
                            <span className="font-bold">{data.sodium.toLocaleString()} mg</span>
                          </div>
                        )}
                        {activeMetrics.protein && (
                          <div className="flex items-center justify-between text-[#2563EB]">
                            <span className="flex items-center gap-1.5">
                              <span className="w-2 h-2 rounded-full bg-[#5379EE]"></span>
                              Protein:
                            </span>
                            <span className="font-bold">{data.protein} g</span>
                          </div>
                        )}
                        <div className="flex items-center justify-between text-[#64748b] pt-1 border-t border-slate-100">
                          <span>Calories:</span>
                          <span className="font-bold text-[#0f172a]">{data.calories} kcal</span>
                        </div>
                      </div>

                      {data.items && data.items.length > 0 && (
                        <div className="pt-1.5 border-t border-slate-100">
                          <span className="text-[10px] font-bold text-[#64748b] block mb-1 uppercase tracking-wider">
                            Logged Meals ({data.items.length}):
                          </span>
                          <div className="space-y-0.5 max-h-24 overflow-y-auto pr-1">
                            {data.items.map((item, idx) => (
                              <div key={idx} className="flex justify-between items-center text-[10px] text-[#334155]">
                                <span className="truncate max-w-[130px]">• {item.name}</span>
                                <span className="text-slate-400">{item.sugar}g S</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      <p className="text-[9px] text-[#5379EE] text-center pt-1">
                        Click data point to inspect breakdown
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />

            {/* Rendering according to active chart mode */}
            {chartMode === 'area' && (
              <>
                {activeMetrics.sugar && (
                  <Area
                    yAxisId="left"
                    type="monotone"
                    dataKey="sugar"
                    stroke="#f59e0b"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#sugarGradient)"
                    name="Sugar (g)"
                  />
                )}
                {activeMetrics.protein && (
                  <Area
                    yAxisId="left"
                    type="monotone"
                    dataKey="protein"
                    stroke="#5379EE"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#proteinGradient)"
                    name="Protein (g)"
                  />
                )}
                {activeMetrics.sodium && (
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="sodium"
                    stroke="#0ea5e9"
                    strokeWidth={2.5}
                    dot={{ r: 2, fill: '#0ea5e9' }}
                    activeDot={{ r: 5 }}
                    name="Sodium (mg)"
                  />
                )}
              </>
            )}

            {chartMode === 'bar' && (
              <>
                {activeMetrics.sugar && (
                  <Bar
                    yAxisId="left"
                    dataKey="sugar"
                    fill="#f59e0b"
                    radius={[4, 4, 0, 0]}
                    maxBarSize={16}
                    name="Sugar (g)"
                  />
                )}
                {activeMetrics.protein && (
                  <Bar
                    yAxisId="left"
                    dataKey="protein"
                    fill="#5379EE"
                    radius={[4, 4, 0, 0]}
                    maxBarSize={16}
                    name="Protein (g)"
                  />
                )}
                {activeMetrics.sodium && (
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="sodium"
                    stroke="#0ea5e9"
                    strokeWidth={2}
                    dot={{ r: 2, fill: '#0ea5e9' }}
                    name="Sodium (mg)"
                  />
                )}
              </>
            )}

            {chartMode === 'lines' && (
              <>
                {activeMetrics.sugar && (
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="sugar"
                    stroke="#f59e0b"
                    strokeWidth={2.5}
                    dot={{ r: 3, fill: '#f59e0b' }}
                    name="Sugar (g)"
                  />
                )}
                {activeMetrics.protein && (
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="protein"
                    stroke="#5379EE"
                    strokeWidth={2.5}
                    dot={{ r: 3, fill: '#5379EE' }}
                    name="Protein (g)"
                  />
                )}
                {activeMetrics.sodium && (
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="sodium"
                    stroke="#0ea5e9"
                    strokeWidth={2.5}
                    dot={{ r: 3, fill: '#0ea5e9' }}
                    name="Sodium (mg)"
                  />
                )}
              </>
            )}
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* Selected Day Deep-Dive Drawer (If clicked) */}
      {selectedDayDetail && (
        <div className="bg-[#f8fafc] rounded-2xl p-4 sm:p-5 border border-slate-200 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#5379EE]">event_note</span>
              <h4 className="text-sm font-bold text-[#0f172a]">
                Intake Detail for {selectedDayDetail.displayDate} ({selectedDayDetail.date})
              </h4>
            </div>
            <button
              onClick={() => setSelectedDayDetail(null)}
              className="text-[#64748b] hover:text-[#0f172a] text-xs"
            >
              ✕ Close
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-white p-3 rounded-xl border border-slate-100">
              <span className="text-[10px] text-[#64748b] uppercase">Sugar Consumed</span>
              <span className="text-base font-bold text-[#b45309] block">{selectedDayDetail.sugar} g</span>
              <span className="text-[10px] text-[#64748b]">
                {Math.round((selectedDayDetail.sugar / WHO_RECOMMENDED_SUGAR_LIMIT) * 100)}% of WHO limit
              </span>
            </div>
            <div className="bg-white p-3 rounded-xl border border-slate-100">
              <span className="text-[10px] text-[#64748b] uppercase">Sodium Consumed</span>
              <span className="text-base font-bold text-[#0284c7] block">
                {selectedDayDetail.sodium.toLocaleString()} mg
              </span>
              <span className="text-[10px] text-[#64748b]">
                {Math.round((selectedDayDetail.sodium / FDA_MAX_SODIUM_LIMIT) * 100)}% of FDA max
              </span>
            </div>
            <div className="bg-white p-3 rounded-xl border border-slate-100">
              <span className="text-[10px] text-[#64748b] uppercase">Protein Target</span>
              <span className="text-base font-bold text-[#2563EB] block">{selectedDayDetail.protein} g</span>
              <span className="text-[10px] text-[#64748b]">
                {Math.round((selectedDayDetail.protein / RECOMMENDED_PROTEIN_TARGET) * 100)}% of goal
              </span>
            </div>
            <div className="bg-white p-3 rounded-xl border border-slate-100">
              <span className="text-[10px] text-[#64748b] uppercase">Total Energy</span>
              <span className="text-base font-bold text-[#0f172a] block">{selectedDayDetail.calories} kcal</span>
              <span className="text-[10px] text-[#5379EE]">Verified pure scans</span>
            </div>
          </div>

          {selectedDayDetail.items && selectedDayDetail.items.length > 0 && (
            <div className="space-y-1.5 pt-1">
              <span className="text-xs font-bold text-[#0f172a] block">Food Items Logged That Day:</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                {selectedDayDetail.items.map((item, i) => (
                  <div key={i} className="bg-white p-2.5 rounded-xl border border-slate-100 text-xs flex justify-between items-center">
                    <div>
                      <p className="font-semibold text-[#0f172a] truncate max-w-[170px]">{item.name}</p>
                      <span className="text-[10px] text-[#64748b]">{item.time || 'Logged'}</span>
                    </div>
                    <div className="text-right text-[10px]">
                      <span className="text-[#b45309] block">{item.sugar}g sugar</span>
                      <span className="text-[#0284c7] block">{item.sodium}mg Na</span>
                      <span className="text-[#2563EB] block">{item.protein}g protein</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Modal: Log Meal / Intake */}
      {isLogModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-lg w-full border border-slate-100 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-xl bg-[#EEF2FF] text-[#5379EE] flex items-center justify-center">
                  <span className="material-symbols-outlined text-lg">restaurant</span>
                </span>
                <div>
                  <h3 className="text-lg font-bold text-[#0f172a]">Log Nutritional Intake</h3>
                  <p className="text-xs text-[#64748b]">Adds sugar, sodium, and protein to today's active radar.</p>
                </div>
              </div>
              <button
                onClick={() => setIsLogModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-[#64748b] flex items-center justify-center transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Quick Catalog Picker */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#64748b] uppercase tracking-wider block">
                Quick autofill from scanned catalog
              </label>
              <div className="flex gap-2 overflow-x-auto pb-1">
                {products.slice(0, 4).map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => handleSelectCatalogItem(p.id)}
                    className="shrink-0 px-2.5 py-1.5 rounded-xl border border-slate-200 hover:border-[#5379EE] hover:bg-[#EEF2FF] text-left transition-colors"
                  >
                    <span className="text-[11px] font-bold text-[#0f172a] block truncate max-w-[120px]">{p.name}</span>
                    <span className="text-[9px] text-[#64748b]">
                      {p.nutrients.sugars} sug • {p.nutrients.protein} prot
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Intake Form */}
            <form onSubmit={handleAddIntake} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-[#0f172a] block mb-1">Food / Product Description *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Avocado Toast with Hemp Hearts"
                  value={logForm.name}
                  onChange={(e) => setLogForm((prev) => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-[#5379EE] focus:outline-hidden text-sm"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-bold text-[#b45309] block mb-1">Sugar (grams)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    value={logForm.sugar}
                    onChange={(e) => setLogForm((prev) => ({ ...prev, sugar: parseFloat(e.target.value) || 0 }))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-[#f59e0b] focus:outline-hidden text-sm"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-[#0284c7] block mb-1">Sodium (mg)</label>
                  <input
                    type="number"
                    step="1"
                    min="0"
                    value={logForm.sodium}
                    onChange={(e) => setLogForm((prev) => ({ ...prev, sodium: parseFloat(e.target.value) || 0 }))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-[#0ea5e9] focus:outline-hidden text-sm"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-[#2563EB] block mb-1">Protein (grams)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    value={logForm.protein}
                    onChange={(e) => setLogForm((prev) => ({ ...prev, protein: parseFloat(e.target.value) || 0 }))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-[#5379EE] focus:outline-hidden text-sm"
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsLogModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-[#64748b] hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#5379EE] hover:bg-[#4368DD] text-white text-xs font-bold transition-all shadow-sm active:scale-95"
                >
                  Commit Intake to Today
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
