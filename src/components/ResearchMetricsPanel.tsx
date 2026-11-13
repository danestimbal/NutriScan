import React, { useEffect, useState } from 'react';
import { doc, getDocFromServer, onSnapshot, setDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { readResearchMetrics, useApp } from '../context/AppContext';

/** Targets from the research plan (Section C1). */
const TARGET_ACCURACY_PCT = 95;
const TARGET_COMPLETION_PCT = 90;
const TARGET_MRT_MS = 1500;
const TARGET_RND_SCORE = 4.5;

const RND_CRITERIA = [
  {
    title: '1. Usability & User Experience',
    desc: 'Ease of camera barcode targeting, scan detection, and the mobile web interface.',
  },
  {
    title: '2. Allergen Risk Accuracy & Clarity',
    desc: 'How correctly and clearly products are checked against a user profile.',
  },
  {
    title: '3. Scientific Translation of Food Jargon',
    desc: 'Plain-language explanation of additives, emulsifiers, preservatives and E-codes.',
  },
  {
    title: '4. Relevance of Dietary Recommendations',
    desc: 'Usefulness of the Nutri-Score grade and the recommendations shown.',
  },
  {
    title: '5. Accessibility & Readability',
    desc: 'Contrast, text size, and how easy the screens are to read.',
  },
];

/** Observations entered by the researchers. Stored in Firestore at siteSettings/research. */
interface ResearchRecords {
  /** Mean Likert score (1–5) per criterion, or null when not yet recorded. */
  rndScores: Array<number | null>;
  rndEvaluators: number | null;
  tasksAttempted: number | null;
  tasksCompleted: number | null;
}

const EMPTY_RECORDS: ResearchRecords = {
  rndScores: RND_CRITERIA.map(() => null),
  rndEvaluators: null,
  tasksAttempted: null,
  tasksCompleted: null,
};

const researchDoc = () => doc(db, 'siteSettings', 'research');

const toNumberOrNull = (value: unknown): number | null =>
  typeof value === 'number' && Number.isFinite(value) ? value : null;

const parseRecords = (raw: Record<string, unknown> | undefined): ResearchRecords => ({
  rndScores: RND_CRITERIA.map((_, i) => toNumberOrNull((raw?.rndScores as unknown[] | undefined)?.[i])),
  rndEvaluators: toNumberOrNull(raw?.rndEvaluators),
  tasksAttempted: toNumberOrNull(raw?.tasksAttempted),
  tasksCompleted: toNumberOrNull(raw?.tasksCompleted),
});

type Status = 'pass' | 'fail' | 'none';
const STATUS_TEXT: Record<Status, string> = { pass: 'Meets target', fail: 'Below target', none: 'No data yet' };
const STATUS_CLASS: Record<Status, string> = {
  pass: 'text-[#16a34a]',
  fail: 'text-[#e11d48]',
  none: 'text-[#64748b]',
};
const STATUS_ICON: Record<Status, string> = { pass: 'check_circle', fail: 'cancel', none: 'hourglass_empty' };

const StatusLine: React.FC<{ target: string; status: Status }> = ({ target, status }) => (
  <div className="mt-4 pt-3 border-t border-slate-200 flex items-center justify-between text-xs text-[#64748b]">
    <span>Target: {target}</span>
    <span className={`font-bold inline-flex items-center gap-1 ${STATUS_CLASS[status]}`}>
      <span className="material-symbols-outlined text-sm">{STATUS_ICON[status]}</span> {STATUS_TEXT[status]}
    </span>
  </div>
);

const numberInputClass =
  'w-24 h-9 px-3 rounded-xl bg-white border border-slate-200 text-xs text-[#0f172a] outline-none focus:border-[#5379EE]';

export const ResearchMetricsPanel: React.FC = () => {
  const { userProfile, products, recordLookupTrial, resetResearchMetrics } = useApp();
  const [activeTab, setActiveTab] = useState<'metrics' | 'rnd-panel' | 'trial-tester' | 'ethics'>('metrics');
  const [isTesting, setIsTesting] = useState(false);
  const [lastTest, setLastTest] = useState<string | null>(null);
  const [records, setRecords] = useState<ResearchRecords>(EMPTY_RECORDS);
  const [draft, setDraft] = useState<ResearchRecords>(EMPTY_RECORDS);
  const [dirty, setDirty] = useState(false);
  const [saveNote, setSaveNote] = useState<string | null>(null);

  useEffect(
    () =>
      onSnapshot(
        researchDoc(),
        (snap) => setRecords(parseRecords(snap.exists() ? snap.data() : undefined)),
        (error) => console.warn('Research records listener:', error)
      ),
    []
  );
  useEffect(() => {
    if (!dirty) setDraft(records);
  }, [records, dirty]);

  // --- Automatically recorded scan measurements (this account's scans) ---
  const metrics = readResearchMetrics(userProfile);
  const { trialCount, successfulScans, retrievalTimes } = metrics;
  const hasTrials = trialCount > 0;
  const lookupRate = hasTrials ? Math.round((successfulScans / trialCount) * 1000) / 10 : null;
  const meanMs = retrievalTimes.length
    ? Math.round(retrievalTimes.reduce((sum, t) => sum + t, 0) / retrievalTimes.length)
    : null;

  // --- Researcher-entered observations ---
  const completionRate =
    records.tasksAttempted && records.tasksCompleted !== null
      ? Math.round((records.tasksCompleted / records.tasksAttempted) * 1000) / 10
      : null;
  const enteredScores = records.rndScores.filter((s): s is number => s !== null);
  const rndComposite =
    enteredScores.length === RND_CRITERIA.length
      ? Math.round((enteredScores.reduce((a, b) => a + b, 0) / enteredScores.length) * 100) / 100
      : null;

  const statusOf = (value: number | null, passes: (v: number) => boolean): Status =>
    value === null ? 'none' : passes(value) ? 'pass' : 'fail';
  const lookupStatus = statusOf(lookupRate, (v) => v >= TARGET_ACCURACY_PCT);
  const completionStatus = statusOf(completionRate, (v) => v >= TARGET_COMPLETION_PCT);
  const mrtStatus = statusOf(meanMs, (v) => v < TARGET_MRT_MS);

  /** Times one real read of a catalog product from the database server. */
  const runLiveLookup = async () => {
    if (products.length === 0) return;
    setIsTesting(true);
    const target = products[Math.floor(Math.random() * products.length)];
    const start = performance.now();
    try {
      const snap = await getDocFromServer(doc(db, 'products', target.id));
      const elapsed = performance.now() - start;
      recordLookupTrial(snap.exists(), elapsed);
      setLastTest(
        snap.exists()
          ? `Read “${target.name}” from the database in ${Math.round(elapsed)} ms.`
          : `“${target.name}” is not in the database yet (${Math.round(elapsed)} ms). Counted as a failed lookup.`
      );
    } catch (error: any) {
      setLastTest(`The lookup could not reach the database (${error?.code || 'network error'}). Nothing was recorded.`);
    } finally {
      setIsTesting(false);
    }
  };

  const setDraftField = (patch: Partial<ResearchRecords>) => {
    setDraft((prev) => ({ ...prev, ...patch }));
    setDirty(true);
    setSaveNote(null);
  };
  const parseInput = (value: string, min: number, max: number): number | null => {
    if (value.trim() === '') return null;
    const n = Number(value);
    return Number.isFinite(n) ? Math.min(max, Math.max(min, n)) : null;
  };

  const saveRecords = async () => {
    if (draft.tasksAttempted !== null && draft.tasksCompleted !== null && draft.tasksCompleted > draft.tasksAttempted) {
      setSaveNote('Completed tasks cannot be more than attempted tasks.');
      return;
    }
    try {
      await setDoc(researchDoc(), { ...draft, updatedAt: new Date().toISOString() });
      setDirty(false);
      setSaveNote('Saved.');
    } catch (error: any) {
      setSaveNote(
        error?.code === 'permission-denied'
          ? 'Not saved: the database refused the change. Check that the latest Firestore rules are deployed.'
          : `Not saved: ${error?.message || 'unknown error'}`
      );
    }
  };

  const handleExportEvaluationReport = () => {
    const cell = (value: string) => `"${value.replace(/"/g, '""')}"`;
    const rows: string[][] = [
      ['Parameter', 'Formula / Source', 'Observed Value', 'Target', 'Status'],
      [
        'Barcode lookup success (%)',
        'Auto-recorded: products found / lookups attempted',
        lookupRate === null ? 'No data' : `${lookupRate}% (${successfulScans}/${trialCount})`,
        `>= ${TARGET_ACCURACY_PCT}%`,
        STATUS_TEXT[lookupStatus],
      ],
      [
        'Task completion rate (%)',
        'Entered by researchers: completed / attempted',
        completionRate === null ? 'No data' : `${completionRate}% (${records.tasksCompleted}/${records.tasksAttempted})`,
        `>= ${TARGET_COMPLETION_PCT}%`,
        STATUS_TEXT[completionStatus],
      ],
      [
        'Mean information retrieval time',
        'Auto-recorded: MRT = (1/n) * sum(ti)',
        meanMs === null ? 'No data' : `${meanMs} ms (n=${retrievalTimes.length})`,
        `< ${TARGET_MRT_MS} ms`,
        STATUS_TEXT[mrtStatus],
      ],
      ...RND_CRITERIA.map((c, i) => {
        const score = records.rndScores[i];
        return [
          `RND: ${c.title}`,
          `5-point Likert mean${records.rndEvaluators ? ` (${records.rndEvaluators} evaluators)` : ''}`,
          score === null ? 'Not recorded' : `${score} / 5`,
          `>= ${TARGET_RND_SCORE}`,
          STATUS_TEXT[statusOf(score, (v) => v >= TARGET_RND_SCORE)],
        ];
      }),
    ];
    const csv = rows.map((r) => r.map(cell).join(',')).join('\n');
    const link = document.createElement('a');
    link.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
    link.download = `IngreGuide_Evaluation_Report_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(link.href);
  };

  const tabs = [
    { id: 'metrics', label: '1. Quantitative Parameters (C1)' },
    { id: 'rnd-panel', label: '2. RND Expert Scorecard (C3)' },
    { id: 'trial-tester', label: '3. Live Lookup Test' },
    { id: 'ethics', label: '4. Data Privacy & Accessibility (C2)' },
  ] as const;

  return (
    <div className="bg-white rounded-3xl border border-slate-100 shadow-xs overflow-hidden">
      {/* Header */}
      <div className="p-6 sm:p-7 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-white via-[#EEF2FF]/60 to-white">
        <div>
          <span className="text-[11px] text-[#64748b] font-medium">Sept 2026 – Feb 2027 Research Period</span>
          <h2 className="text-xl font-extrabold text-[#0f172a] mt-1 flex items-center gap-2">
            <span>IngreGuide Scientific Evaluation &amp; Metrics</span>
            <span className="material-symbols-outlined text-[#5379EE] text-xl">analytics</span>
          </h2>
          <p className="text-xs text-[#64748b] mt-0.5">
            Proponents: <strong>Micharre Ayonei P. Virgo</strong>, <strong>Charlize P. Cataag</strong>, &amp;{' '}
            <strong>Precious Abby H. Pacleb</strong>. Scan figures are measured by the app on this account; scores and
            task counts are entered by the researchers.
          </p>
        </div>
        <button
          onClick={handleExportEvaluationReport}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#f0f3ff] hover:bg-[#e2e8f0] text-[#0f172a] text-xs font-bold transition-all shadow-xs shrink-0 cursor-pointer"
        >
          <span className="material-symbols-outlined text-sm">download</span>
          <span>Export CSV</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-100 px-6 bg-[#fafbff] overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`py-3 px-4 text-xs font-bold border-b-2 transition-all shrink-0 cursor-pointer ${
              activeTab === tab.id
                ? 'border-[#5379EE] text-[#5379EE]'
                : 'border-transparent text-[#64748b] hover:text-[#0f172a]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab 1: Quantitative Metrics */}
      {activeTab === 'metrics' && (
        <div className="p-6 sm:p-7 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Metric 1 */}
            <div className="bg-[#f8fafc] border border-slate-200/80 rounded-2xl p-5 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] text-[#5379EE] font-bold uppercase tracking-wider">Formula 1 • Accuracy</span>
                  <span className="px-2 py-0.5 bg-[#EEF2FF] text-[#2563EB] rounded-full text-[10px] font-bold">
                    Lai &amp; Wong (2023)
                  </span>
                </div>
                <h3 className="font-bold text-sm text-[#0f172a]">Barcode Lookup Success</h3>
                <p className="text-[11px] text-[#64748b] mt-1 bg-white p-2 rounded-lg border border-slate-200">
                  (Products Found / Lookups Attempted) × 100
                </p>
                <div className="mt-4 flex items-baseline gap-2">
                  <span className="text-3xl font-extrabold text-[#0f172a]">{lookupRate === null ? '—' : `${lookupRate}%`}</span>
                  <span className="text-xs text-[#64748b]">
                    {hasTrials ? `(${successfulScans}/${trialCount} lookups)` : 'No scans recorded yet'}
                  </span>
                </div>
                <p className="text-[11px] text-[#64748b] mt-2 leading-relaxed">
                  Counts a lookup as successful when a product record is returned. Whether it is the{' '}
                  <em>correct</em> product must be confirmed by the researchers.
                </p>
              </div>
              <StatusLine target={`≥ ${TARGET_ACCURACY_PCT}%`} status={lookupStatus} />
            </div>

            {/* Metric 2 */}
            <div className="bg-[#f8fafc] border border-slate-200/80 rounded-2xl p-5 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] text-[#5379EE] font-bold uppercase tracking-wider">Formula 2 • Usability</span>
                  <span className="px-2 py-0.5 bg-[#EEF2FF] text-[#2563EB] rounded-full text-[10px] font-bold">
                    Park et al. (2024)
                  </span>
                </div>
                <h3 className="font-bold text-sm text-[#0f172a]">Task Completion Rate</h3>
                <p className="text-[11px] text-[#64748b] mt-1 bg-white p-2 rounded-lg border border-slate-200">
                  (Completed / Attempted) × 100
                </p>
                <div className="mt-4 flex items-baseline gap-2">
                  <span className="text-3xl font-extrabold text-[#0f172a]">
                    {completionRate === null ? '—' : `${completionRate}%`}
                  </span>
                  <span className="text-xs text-[#64748b]">
                    {completionRate === null
                      ? 'Not yet recorded'
                      : `(${records.tasksCompleted}/${records.tasksAttempted} tasks)`}
                  </span>
                </div>
                <div className="mt-3 flex flex-wrap items-end gap-2">
                  <label className="text-[11px] text-[#64748b]">
                    Attempted
                    <input
                      type="number"
                      min={0}
                      value={draft.tasksAttempted ?? ''}
                      onChange={(e) => setDraftField({ tasksAttempted: parseInput(e.target.value, 0, 100000) })}
                      className={`${numberInputClass} block mt-1`}
                    />
                  </label>
                  <label className="text-[11px] text-[#64748b]">
                    Completed
                    <input
                      type="number"
                      min={0}
                      value={draft.tasksCompleted ?? ''}
                      onChange={(e) => setDraftField({ tasksCompleted: parseInput(e.target.value, 0, 100000) })}
                      className={`${numberInputClass} block mt-1`}
                    />
                  </label>
                </div>
                <p className="text-[11px] text-[#64748b] mt-2">Enter the counts from your user-testing sessions.</p>
              </div>
              <StatusLine target={`≥ ${TARGET_COMPLETION_PCT}%`} status={completionStatus} />
            </div>

            {/* Metric 3 */}
            <div className="bg-[#f8fafc] border border-slate-200/80 rounded-2xl p-5 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] text-[#5379EE] font-bold uppercase tracking-wider">Formula 3 • Latency</span>
                  <span className="px-2 py-0.5 bg-[#EEF2FF] text-[#2563EB] rounded-full text-[10px] font-bold">MRT</span>
                </div>
                <h3 className="font-bold text-sm text-[#0f172a]">Mean Retrieval Time (MRT)</h3>
                <p className="text-[11px] text-[#64748b] mt-1 bg-white p-2 rounded-lg border border-slate-200">
                  MRT = (1/n) × Σ(t<sub>i</sub>)
                </p>
                <div className="mt-4 flex items-baseline gap-2">
                  <span className="text-3xl font-extrabold text-[#0f172a]">
                    {meanMs === null ? '—' : `${(meanMs / 1000).toFixed(2)}s`}
                  </span>
                  <span className="text-xs text-[#64748b]">
                    {meanMs === null ? 'No timings recorded yet' : `(${meanMs} ms, n=${retrievalTimes.length})`}
                  </span>
                </div>
                <p className="text-[11px] text-[#64748b] mt-2 leading-relaxed">
                  Measured from the moment a barcode is read to the moment the product record is ready.
                </p>
              </div>
              <StatusLine target={`< ${(TARGET_MRT_MS / 1000).toFixed(2)}s`} status={mrtStatus} />
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <button
                type="button"
                disabled={!dirty}
                onClick={saveRecords}
                className="px-4 py-2 rounded-full bg-[#5379EE] hover:bg-[#4368DD] text-white text-xs font-bold disabled:opacity-40 cursor-pointer"
              >
                Save task counts
              </button>
              {saveNote && <span className="text-xs text-[#64748b]">{saveNote}</span>}
            </div>
            <button
              type="button"
              disabled={!hasTrials}
              onClick={() => {
                if (window.confirm('Clear the recorded scan trials and timings for this account?')) resetResearchMetrics();
              }}
              className="px-4 py-2 rounded-full bg-[#f1f5f9] hover:bg-slate-200 text-[#0f172a] text-xs font-bold disabled:opacity-40 cursor-pointer"
            >
              Reset scan measurements
            </button>
          </div>

          <div className="bg-[#EEF2FF] border border-[#C7D2FE] p-4 rounded-2xl flex items-start gap-3">
            <span className="material-symbols-outlined text-[#5379EE] text-xl shrink-0 mt-0.5">school</span>
            <p className="text-xs text-[#1e3a8a] leading-relaxed">
              The study evaluates whether web-based barcode scanning reduces information retrieval time compared with
              reading food labels, with at least {TARGET_ACCURACY_PCT}% accuracy. Scan measurements here cover only
              scans made while signed in to this account.
            </p>
          </div>
        </div>
      )}

      {/* Tab 2: RND Expert Scorecard */}
      {activeTab === 'rnd-panel' && (
        <div className="p-6 sm:p-7 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="font-bold text-sm text-[#0f172a]">
                Registered Nutritionist-Dietitians (RND) Evaluation Matrix
              </h3>
              <p className="text-xs text-[#64748b]">
                Enter the mean score per criterion from your evaluators (5-point Likert scale: 5 = Highly Effective,
                1 = Ineffective).
              </p>
            </div>
            <div className="sm:text-right shrink-0">
              <span className="text-2xl font-extrabold text-[#5379EE]">{rndComposite === null ? '—' : rndComposite}</span>
              <span className="text-xs text-[#64748b]">
                {rndComposite === null ? ' Composite not available yet' : ' / 5.0 Composite'}
              </span>
            </div>
          </div>

          <div className="space-y-3">
            {RND_CRITERIA.map((item, idx) => (
              <div
                key={item.title}
                className="bg-[#f8fafc] border border-slate-200/70 p-4 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="space-y-0.5">
                  <span className="font-bold text-sm text-[#0f172a]">{item.title}</span>
                  <p className="text-xs text-[#64748b]">{item.desc}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <input
                    type="number"
                    min={1}
                    max={5}
                    step={0.01}
                    value={draft.rndScores[idx] ?? ''}
                    placeholder="—"
                    aria-label={`Mean score for ${item.title}`}
                    onChange={(e) =>
                      setDraftField({
                        rndScores: draft.rndScores.map((s, i) => (i === idx ? parseInput(e.target.value, 1, 5) : s)),
                      })
                    }
                    className={numberInputClass}
                  />
                  <span className="text-xs text-[#64748b]">/ 5.0</span>
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <label className="text-xs text-[#64748b] flex items-center gap-2">
              Number of evaluators
              <input
                type="number"
                min={0}
                value={draft.rndEvaluators ?? ''}
                onChange={(e) => setDraftField({ rndEvaluators: parseInput(e.target.value, 0, 10000) })}
                className={numberInputClass}
              />
            </label>
            <button
              type="button"
              disabled={!dirty}
              onClick={saveRecords}
              className="px-4 py-2 rounded-full bg-[#5379EE] hover:bg-[#4368DD] text-white text-xs font-bold disabled:opacity-40 cursor-pointer"
            >
              Save scorecard
            </button>
            {saveNote && <span className="text-xs text-[#64748b]">{saveNote}</span>}
          </div>
        </div>
      )}

      {/* Tab 3: Live lookup test */}
      {activeTab === 'trial-tester' && (
        <div className="p-6 sm:p-7 space-y-6">
          <div className="bg-[#f0f3ff] p-5 rounded-2xl border border-[#dae2fd]/60 flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="font-bold text-sm text-[#0f172a]">Live Database Lookup Test</h3>
              <p className="text-xs text-[#64748b] mt-0.5">
                Reads one random catalog product straight from the database server and times it. Each run is added to
                the measurements above. Real scans from the Scanner are recorded automatically.
              </p>
            </div>
            <button
              onClick={runLiveLookup}
              disabled={isTesting || products.length === 0}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#5379EE] hover:bg-[#4368DD] text-white text-xs font-bold transition-all shadow-sm active:scale-95 disabled:opacity-50 cursor-pointer shrink-0"
            >
              <span className="material-symbols-outlined text-base">play_arrow</span>
              <span>{isTesting ? 'Looking up…' : 'Run lookup'}</span>
            </button>
          </div>

          {lastTest && (
            <div className="p-4 rounded-2xl bg-[#EEF2FF] text-[#1e3a8a] flex items-center gap-2 text-xs font-semibold">
              <span className="material-symbols-outlined">timer</span>
              <span>{lastTest}</span>
            </div>
          )}

          <div>
            <h4 className="text-xs text-[#64748b] uppercase font-bold mb-2">
              Recorded lookup times (most recent {Math.min(40, retrievalTimes.length)} of {retrievalTimes.length}, in ms)
            </h4>
            {retrievalTimes.length === 0 ? (
              <p className="text-xs text-[#64748b]">Nothing recorded yet. Scan a product or run a lookup.</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {retrievalTimes.slice(-40).map((t, i) => (
                  <span
                    key={i}
                    className="px-2.5 py-1 rounded-lg bg-slate-100 text-[#0f172a] text-xs font-medium border border-slate-200"
                  >
                    {t} ms
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 4: Privacy & accessibility */}
      {activeTab === 'ethics' && (
        <div className="p-6 sm:p-7 space-y-4">
          <div className="p-5 rounded-2xl bg-[#f8fafc] border border-slate-200/80 space-y-3">
            <div className="flex items-center gap-2 text-[#0f172a]">
              <span className="material-symbols-outlined text-[#5379EE]">gavel</span>
              <h3 className="font-bold text-sm">Data Privacy Act of 2012 (Republic Act No. 10173)</h3>
            </div>
            <p className="text-xs text-[#64748b] leading-relaxed">
              How the app currently handles personal data. This describes the system; it is not a legal compliance
              certification.
            </p>
            <ul className="text-xs text-[#64748b] space-y-1.5 list-disc list-inside">
              <li>
                <strong>Camera permission:</strong> the browser asks the user before the camera is switched on.
              </li>
              <li>
                <strong>Storage:</strong> allergen profiles and scan history are stored in the project&apos;s Firebase
                database, encrypted in transit and at rest by the provider. They are not end-to-end encrypted.
              </li>
              <li>
                <strong>Access:</strong> each user can read only their own profile. Administrators can also view user
                profiles and scan history to manage accounts.
              </li>
              <li>
                <strong>No advertising:</strong> the app has no ads and does not sell or share data with advertisers.
              </li>
              <li>
                <strong>Erasure:</strong> users can clear their scan history. Full account deletion is done by an
                administrator on request.
              </li>
            </ul>
          </div>

          <div className="p-5 rounded-2xl bg-[#f8fafc] border border-slate-200/80 space-y-3">
            <div className="flex items-center gap-2 text-[#0f172a]">
              <span className="material-symbols-outlined text-[#5379EE]">accessibility_new</span>
              <h3 className="font-bold text-sm">Accessibility (target: WCAG 2.2 Level AA)</h3>
            </div>
            <p className="text-xs text-[#64748b] leading-relaxed">
              The interface uses colour-and-icon alert tags, sound and vibration cues, and layouts that adapt to phone
              screens. It has not been formally audited against WCAG 2.2, so conformance is a goal, not a verified
              result.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
