import React, { useState } from 'react';
import {
  Cpu,
  CheckCircle,
  BarChart2,
  ShieldCheck,
  Award,
  Layers,
  Activity,
  Sliders,
  AlertTriangle,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from 'recharts';
import { useAIModels } from '../hooks/useWeatherData';

export const AIModelsPage: React.FC = () => {
  const { models, loading } = useAIModels();
  const [selectedHorizon, setSelectedHorizon] = useState<'30m' | '60m' | '120m'>('30m');

  if (loading && models.length === 0) {
    return (
      <div className="flex h-96 items-center justify-center font-mono text-[#00D5E5]">
        <div className="w-8 h-8 rounded-full border-2 border-[#00D5E5] border-t-transparent animate-spin mr-3" />
        Verifying AI/ML Model Artifacts & Evaluation Matrices...
      </div>
    );
  }

  const model = models[0];
  const metrics = model?.metrics?.[selectedHorizon];
  const confMat = metrics?.confusion_matrix;
  const rocCurve = metrics?.roc_curve || [];
  const features = model?.features || [];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 pb-2 border-b border-[#073B3C]/80">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="font-serif text-3xl md:text-4xl text-white tracking-tight">
              AI/ML Model Performance & Meteorological Verification
            </h1>
            <span
              className={`px-3 py-0.5 rounded-full text-xs font-mono font-bold border ${
                model?.status === 'TRAINED'
                  ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300'
                  : 'bg-amber-500/20 border-amber-500/50 text-amber-300'
              }`}
            >
              STATUS: {model?.status || 'TRAINED'}
            </span>
          </div>
          <p className="text-xs font-mono text-[#9BAEB1] mt-1">
            Validated against independent holdout test set using strict Contingency Table and Critical Success Index (CSI)
          </p>
        </div>

        <div className="text-xs font-mono text-[#9BAEB1] text-right">
          <div>Model: <span className="text-white font-bold">{model?.name}</span></div>
          <div>Version: <span className="text-[#00D5E5]">v{model?.version}</span> | Samples: {model?.total_samples?.toLocaleString()}</div>
        </div>
      </div>

      {/* Safety & Integrity Directive Banner (Section 10 requirement) */}
      <div className="p-3.5 rounded-xl bg-[#073B3C]/30 border border-[#087F80]/40 text-xs font-mono text-[#9BAEB1] flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-[#00D5E5] shrink-0 mt-0.5" />
        <div>
          <span className="font-bold text-white uppercase tracking-wider">AI SAFETY & ACCURACY VERIFICATION: </span>
          {model?.safety_disclaimer ||
            'All metrics are computed on a chronological holdout partition of multi-sensor observations. Values are never fabricated or generalized without statistical cross-validation.'}
        </div>
      </div>

      {/* Horizon Selector */}
      <div className="flex items-center gap-2 p-1.5 rounded-xl bg-[#061418] border border-[#073B3C]/80 w-fit font-mono text-xs">
        <span className="text-[#9BAEB1] px-2">Verification Horizon:</span>
        {(['30m', '60m', '120m'] as const).map((h) => (
          <button
            key={h}
            onClick={() => setSelectedHorizon(h)}
            className={`px-3 py-1 rounded-lg transition-all font-bold ${
              selectedHorizon === h
                ? 'bg-[#00D5E5] text-[#061418] shadow-[0_0_10px_rgba(0,213,229,0.3)]'
                : 'text-[#9BAEB1] hover:text-white'
            }`}
          >
            {h === '30m' ? '0–30 MIN HORIZON' : h === '60m' ? '30–60 MIN HORIZON' : '60–120 MIN HORIZON'}
          </button>
        ))}
      </div>

      {/* Primary Verification Metrics Grid */}
      {metrics && (
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 font-mono text-xs">
          <div className="p-3.5 rounded-xl bg-[#061418] border border-[#073B3C]/80">
            <div className="text-[#9BAEB1] text-[11px]">CSI (Threat Score)</div>
            <div className="text-xl font-bold text-[#00D5E5] mt-1">{metrics.csi}</div>
            <div className="text-[10px] text-gray-400">Critical Success</div>
          </div>
          <div className="p-3.5 rounded-xl bg-[#061418] border border-[#073B3C]/80">
            <div className="text-[#9BAEB1] text-[11px]">POD (Hit Rate)</div>
            <div className="text-xl font-bold text-emerald-400 mt-1">{metrics.pod}</div>
            <div className="text-[10px] text-gray-400">Prob of Detection</div>
          </div>
          <div className="p-3.5 rounded-xl bg-[#061418] border border-[#073B3C]/80">
            <div className="text-[#9BAEB1] text-[11px]">FAR (False Alarms)</div>
            <div className="text-xl font-bold text-[#FFD166] mt-1">{metrics.far}</div>
            <div className="text-[10px] text-gray-400">False Alarm Ratio</div>
          </div>
          <div className="p-3.5 rounded-xl bg-[#061418] border border-[#073B3C]/80">
            <div className="text-[#9BAEB1] text-[11px]">Brier Score</div>
            <div className="text-xl font-bold text-purple-300 mt-1">{metrics.brier_score}</div>
            <div className="text-[10px] text-gray-400">Lower is better</div>
          </div>
          <div className="p-3.5 rounded-xl bg-[#061418] border border-[#073B3C]/80">
            <div className="text-[#9BAEB1] text-[11px]">ROC-AUC</div>
            <div className="text-xl font-bold text-cyan-300 mt-1">{metrics.roc_auc}</div>
            <div className="text-[10px] text-gray-400">Discrimination</div>
          </div>
          <div className="p-3.5 rounded-xl bg-[#061418] border border-[#073B3C]/80">
            <div className="text-[#9BAEB1] text-[11px]">F1-Score</div>
            <div className="text-xl font-bold text-white mt-1">{metrics.f1_score}</div>
            <div className="text-[10px] text-gray-400">Harmonic Mean</div>
          </div>
          <div className="p-3.5 rounded-xl bg-[#061418] border border-[#073B3C]/80">
            <div className="text-[#9BAEB1] text-[11px]">Precision</div>
            <div className="text-xl font-bold text-white mt-1">{metrics.precision}</div>
            <div className="text-[10px] text-gray-400">Positive Predictive</div>
          </div>
          <div className="p-3.5 rounded-xl bg-[#061418] border border-[#073B3C]/80">
            <div className="text-[#9BAEB1] text-[11px]">Recall</div>
            <div className="text-xl font-bold text-white mt-1">{metrics.recall}</div>
            <div className="text-[10px] text-gray-400">Sensitivity</div>
          </div>
        </div>
      )}

      {/* Middle Grid: Confusion Matrix & ROC Curve */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Confusion Matrix (2x2 Contingency Table) */}
        <div className="lg:col-span-5 p-5 rounded-2xl bg-[#061418] border border-[#073B3C]/80 shadow-xl space-y-4 font-mono text-xs">
          <div className="flex items-center justify-between pb-2 border-b border-[#073B3C]">
            <h3 className="font-bold text-white text-sm">2x2 Contingency Table (Confusion Matrix)</h3>
            <span className="text-[#9BAEB1] text-[11px]">Test Set Partition</span>
          </div>

          {confMat && (
            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="p-4 rounded-xl bg-[#073B3C]/40 border border-emerald-500/40">
                <div className="text-2xl font-bold text-emerald-400">{confMat.true_positives}</div>
                <div className="text-[11px] font-bold text-white mt-1">Hits (True Positives)</div>
                <div className="text-[10px] text-[#9BAEB1]">Storm predicted & occurred</div>
              </div>

              <div className="p-4 rounded-xl bg-[#073B3C]/40 border border-[#FFD166]/40">
                <div className="text-2xl font-bold text-[#FFD166]">{confMat.false_positives}</div>
                <div className="text-[11px] font-bold text-white mt-1">False Alarms (FP)</div>
                <div className="text-[10px] text-[#9BAEB1]">Storm predicted but did not occur</div>
              </div>

              <div className="p-4 rounded-xl bg-[#073B3C]/40 border border-[#FF4D4D]/40">
                <div className="text-2xl font-bold text-[#FF4D4D]">{confMat.false_negatives}</div>
                <div className="text-[11px] font-bold text-white mt-1">Misses (FN)</div>
                <div className="text-[10px] text-[#9BAEB1]">Storm occurred without warning</div>
              </div>

              <div className="p-4 rounded-xl bg-[#073B3C]/40 border border-teal-500/40">
                <div className="text-2xl font-bold text-cyan-300">{confMat.true_negatives}</div>
                <div className="text-[11px] font-bold text-white mt-1">Correct Nulls (TN)</div>
                <div className="text-[10px] text-[#9BAEB1]">Clear weather predicted & observed</div>
              </div>
            </div>
          )}

          <div className="text-[11px] text-[#9BAEB1] leading-relaxed pt-2">
            Formula: <span className="text-white">CSI = Hits / (Hits + Misses + False Alarms)</span>. Used as the operational benchmark by national weather agencies worldwide.
          </div>
        </div>

        {/* ROC Curve Chart */}
        <div className="lg:col-span-7 p-5 rounded-2xl bg-[#061418] border border-[#073B3C]/80 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#073B3C]">
            <h3 className="font-bold text-white text-sm">Receiver Operating Characteristic (ROC Curve)</h3>
            <span className="text-xs font-mono text-[#00D5E5]">AUC: {metrics?.roc_auc}</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={rocCurve} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#073B3C" opacity={0.4} />
                <XAxis dataKey="fpr" label={{ value: 'False Positive Rate', position: 'insideBottom', offset: -5, fontSize: 10, fill: '#9BAEB1' }} stroke="#9BAEB1" fontSize={11} />
                <YAxis dataKey="tpr" label={{ value: 'True Positive Rate', angle: -90, position: 'insideLeft', fontSize: 10, fill: '#9BAEB1' }} stroke="#9BAEB1" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(6, 20, 24, 0.95)',
                    borderColor: '#087F80',
                    borderRadius: '0.75rem',
                    fontSize: '12px',
                    fontFamily: 'monospace',
                  }}
                />
                <Line type="monotone" dataKey="tpr" name="Model Sensitivity" stroke="#00D5E5" strokeWidth={2.5} dot={{ r: 2 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Feature Importance Ranking Chart */}
      <div className="p-5 rounded-2xl bg-[#061418] border border-[#073B3C]/80 shadow-xl space-y-4">
        <div>
          <h3 className="text-base font-semibold text-white tracking-wide">
            Multi-Sensor Atmospheric Feature Importance (Gain Metric)
          </h3>
          <p className="text-xs font-mono text-[#9BAEB1]">
            Relative contribution of Doppler radar reflectivity, lightning flash rates, satellite cooling rates, and NWP instability indices
          </p>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={features} layout="vertical" margin={{ top: 5, right: 20, left: 100, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#073B3C" opacity={0.4} />
              <XAxis type="number" stroke="#9BAEB1" fontSize={11} />
              <YAxis dataKey="name" type="category" stroke="#9BAEB1" fontSize={10} width={120} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(6, 20, 24, 0.95)',
                  borderColor: '#087F80',
                  borderRadius: '0.75rem',
                  fontSize: '12px',
                  fontFamily: 'monospace',
                }}
              />
              <Bar dataKey="importance" name="Relative Gain" fill="#00D5E5" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
