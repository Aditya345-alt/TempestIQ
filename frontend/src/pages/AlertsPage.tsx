import React, { useState } from 'react';
import {
  Bell,
  ShieldAlert,
  Plus,
  Trash2,
  CheckCircle,
  Mail,
  Smartphone,
  Radio,
  Clock,
  ShieldCheck,
} from 'lucide-react';
import { useAlerts } from '../hooks/useWeatherData';
import { alertsService } from '../services';
import { RiskBadge } from '../components/common/RiskBadge';

export const AlertsPage: React.FC = () => {
  const { alerts, loading, refetch } = useAlerts();

  // Create rule state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [locName, setLocName] = useState('Bhopal');
  const [tsThreshold, setTsThreshold] = useState(70);
  const [ltgThreshold, setLtgThreshold] = useState(60);
  const [method, setMethod] = useState('Email');
  const [target, setTarget] = useState('ops-center@tempestiq.internal');
  const [creating, setCreating] = useState(false);

  const handleCreateRule = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    try {
      await alertsService.createRule({
        location_name: locName,
        thunderstorm_threshold: tsThreshold,
        lightning_threshold: ltgThreshold,
        notify_method: method,
        notify_target: target,
      });
      setShowCreateModal(false);
      refetch();
    } catch (err) {
      console.error('Failed to create alert rule:', err);
    } finally {
      setCreating(false);
    }
  };

  const handleDeleteRule = async (id: number) => {
    if (confirm(`Remove alert rule ${id}?`)) {
      try {
        await alertsService.deleteRule(id);
        refetch();
      } catch (err) {
        console.error('Failed to delete rule:', err);
      }
    }
  };

  if (loading && !alerts) {
    return (
      <div className="flex h-96 items-center justify-center font-mono text-[#00D5E5]">
        <div className="w-8 h-8 rounded-full border-2 border-[#00D5E5] border-t-transparent animate-spin mr-3" />
        Syncing Alert Dispatch Engine...
      </div>
    );
  }

  const activeAlerts = alerts?.active_alerts || [];
  const alertHistory = alerts?.alert_history || [];
  const rules = alerts?.alert_rules || [];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 pb-2 border-b border-[#073B3C]/80">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="font-serif text-3xl md:text-4xl text-white tracking-tight">
              Atmospheric Convective Early Warning System
            </h1>
            <span className="px-3 py-0.5 rounded-full text-xs font-mono font-bold bg-[#FF4D4D]/20 border border-[#FF4D4D]/50 text-[#FF4D4D]">
              {activeAlerts.length} ACTIVE ALERTS
            </span>
          </div>
          <p className="text-xs font-mono text-[#9BAEB1] mt-1">
            Automated threshold evaluation over Doppler radar cores, lightning flash jumps, and nowcasting probabilities
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-[#087F80] to-[#00D5E5] text-[#061418] text-xs font-mono font-bold uppercase tracking-wider shadow-[0_0_15px_rgba(0,213,229,0.4)] hover:scale-105 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Create Alert Rule</span>
        </button>
      </div>

      {/* Demo Protocol Warning Banner */}
      <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs font-mono text-amber-200 flex items-start gap-3">
        <ShieldAlert className="w-5 h-5 text-[#FFD166] shrink-0 mt-0.5" />
        <div>
          <span className="font-bold uppercase tracking-wider text-[#FFD166]">SAFETY DIRECTIVE: </span>
          {alerts?.safety_notice ||
            'Do not send real emergency warnings based on demo or development data. For official life-safety warnings, consult the India Meteorological Department (IMD) or national meteorological authorities.'}
        </div>
      </div>

      {/* Active Alerts List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="font-serif text-2xl text-white flex items-center gap-2">
            <Bell className="w-5 h-5 text-[#FF4D4D]" />
            <span>Active Severe Weather Warnings</span>
          </h2>
          <span className="text-xs font-mono text-[#9BAEB1]">Auto-Dispatched Telemetry</span>
        </div>

        {activeAlerts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activeAlerts.map((a) => (
              <div
                key={a.id}
                className="p-5 rounded-2xl bg-[#061418] border border-[#FF4D4D]/50 shadow-[0_0_25px_rgba(255,77,77,0.12)] space-y-3 font-mono text-xs"
              >
                <div className="flex items-center justify-between">
                  <div className="font-bold text-white text-base tracking-wide flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#FF4D4D] animate-ping" />
                    <span>Sector: {a.location_name}</span>
                  </div>
                  <RiskBadge level={a.risk_level} />
                </div>

                <p className="text-sm font-sans text-gray-200 leading-relaxed bg-[#073B3C]/20 p-3 rounded-xl border border-[#087F80]/20">
                  {a.reason}
                </p>

                <div className="space-y-1.5 pt-2 border-t border-[#073B3C]/60 text-[#9BAEB1] text-[11px]">
                  <div className="flex justify-between">
                    <span>Source:</span>
                    <span className="text-white">{a.data_source}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Model Engine:</span>
                    <span className="text-[#00D5E5]">XGBoost Nowcasting v{a.model_version}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Timestamp:</span>
                    <span className="text-gray-300">{a.timestamp}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 rounded-2xl bg-[#061418] border border-[#073B3C]/60 text-center text-sm font-mono text-[#9BAEB1]">
            <CheckCircle className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
            No active severe warnings. All sectors within nominal atmospheric thresholds.
          </div>
        )}
      </div>

      {/* Configured Alert Rules */}
      <div className="space-y-3 pt-6 border-t border-[#073B3C]/60">
        <div className="flex items-center justify-between">
          <h2 className="font-serif text-2xl text-white">Configured Automated Alert Rules</h2>
          <span className="text-xs font-mono text-[#9BAEB1]">{rules.length} Rules Active</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
          {rules.map((r) => (
            <div
              key={r.id}
              className="p-4 rounded-2xl bg-[#061418] border border-[#073B3C]/80 shadow-md space-y-3"
            >
              <div className="flex items-center justify-between pb-2 border-b border-[#073B3C]/60">
                <span className="font-bold text-white text-sm">{r.location_name}</span>
                <button
                  onClick={() => handleDeleteRule(r.id)}
                  className="p-1 rounded text-[#9BAEB1] hover:text-[#FF4D4D] transition-colors"
                  title="Remove rule"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="space-y-1.5 text-[#9BAEB1]">
                <div className="flex justify-between">
                  <span>Thunderstorm Trigger:</span>
                  <span className="text-[#FF9F43] font-bold">&ge; {r.thunderstorm_threshold}%</span>
                </div>
                <div className="flex justify-between">
                  <span>Lightning Trigger:</span>
                  <span className="text-[#00D5E5] font-bold">&ge; {r.lightning_threshold}%</span>
                </div>
                <div className="flex justify-between">
                  <span>Method:</span>
                  <span className="text-white">{r.notify_method}</span>
                </div>
                <div className="flex justify-between">
                  <span>Dispatch Target:</span>
                  <span className="text-cyan-300 truncate max-w-[140px]">{r.notify_target}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Alert History */}
      <div className="space-y-3 pt-6 border-t border-[#073B3C]/60">
        <h2 className="font-serif text-2xl text-white">Alert History & Past Dispatches</h2>
        <div className="rounded-2xl bg-[#061418] border border-[#073B3C]/80 overflow-hidden divide-y divide-[#073B3C]/50 font-mono text-xs">
          {alertHistory.map((h) => (
            <div key={h.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-white">{h.location_name}</span>
                  <RiskBadge level={h.risk_level} />
                </div>
                <div className="text-[#9BAEB1] text-xs font-sans mt-0.5">{h.reason}</div>
              </div>
              <div className="text-right text-[#9BAEB1] text-[11px] shrink-0">
                <div>{h.timestamp}</div>
                <div className="text-[10px] text-gray-500">Archived</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Create Rule Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-md p-6 rounded-2xl bg-[#061418] border border-[#00D5E5]/50 shadow-2xl space-y-4 font-mono text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-[#073B3C]">
              <h3 className="text-base font-serif text-white">Create Automated Convective Rule</h3>
              <button onClick={() => setShowCreateModal(false)} className="text-[#9BAEB1] hover:text-white">✕</button>
            </div>

            <form onSubmit={handleCreateRule} className="space-y-3">
              <div>
                <label className="block text-[#9BAEB1] mb-1">Target Sector / Location</label>
                <input
                  type="text"
                  value={locName}
                  onChange={(e) => setLocName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#073B3C]/30 border border-[#087F80] text-white outline-none focus:border-[#00D5E5]"
                  placeholder="e.g. Bhopal"
                  required
                />
              </div>

              <div>
                <label className="block text-[#9BAEB1] mb-1">Thunderstorm Probability Threshold (%)</label>
                <input
                  type="number"
                  min="10"
                  max="100"
                  value={tsThreshold}
                  onChange={(e) => setTsThreshold(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-[#073B3C]/30 border border-[#087F80] text-white outline-none focus:border-[#00D5E5]"
                  required
                />
              </div>

              <div>
                <label className="block text-[#9BAEB1] mb-1">Lightning Risk Threshold (%)</label>
                <input
                  type="number"
                  min="10"
                  max="100"
                  value={ltgThreshold}
                  onChange={(e) => setLtgThreshold(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-[#073B3C]/30 border border-[#087F80] text-white outline-none focus:border-[#00D5E5]"
                  required
                />
              </div>

              <div>
                <label className="block text-[#9BAEB1] mb-1">Notification Method</label>
                <select
                  value={method}
                  onChange={(e) => setMethod(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#073B3C]/30 border border-[#087F80] text-white outline-none focus:border-[#00D5E5]"
                >
                  <option value="Email">Email</option>
                  <option value="SMS / Push">SMS / Push</option>
                  <option value="Webhook / REST API">Webhook / REST API</option>
                </select>
              </div>

              <div>
                <label className="block text-[#9BAEB1] mb-1">Dispatch Target Endpoint / Address</label>
                <input
                  type="text"
                  value={target}
                  onChange={(e) => setTarget(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#073B3C]/30 border border-[#087F80] text-white outline-none focus:border-[#00D5E5]"
                  required
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-[#073B3C]">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-xl border border-[#087F80] text-[#9BAEB1] hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#087F80] to-[#00D5E5] text-[#061418] font-bold uppercase shadow-[0_0_15px_rgba(0,213,229,0.4)]"
                >
                  {creating ? 'Saving...' : 'Deploy Rule'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
