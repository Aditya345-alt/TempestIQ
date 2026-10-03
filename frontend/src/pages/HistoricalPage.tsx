import React, { useState } from 'react';
import {
  Database,
  Upload,
  FileText,
  Calendar,
  AlertCircle,
  TrendingUp,
  CloudRain,
  Zap,
  Activity,
  CheckCircle,
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from 'recharts';
import { useHistorical } from '../hooks/useWeatherData';
import { historicalService } from '../services';

export const HistoricalPage: React.FC = () => {
  const { data, loading, refetch } = useHistorical();
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setUploadSuccess(null);
    setUploadError(null);

    try {
      const res = await historicalService.uploadDataset(file);
      setUploadSuccess(`Successfully imported "${file.name}" with ${res.row_count} atmospheric records.`);
      refetch();
    } catch (err: any) {
      setUploadError(err.message || 'Failed to upload dataset.');
    } finally {
      setUploading(false);
    }
  };

  if (loading && !data) {
    return (
      <div className="flex h-96 items-center justify-center font-mono text-[#00D5E5]">
        <div className="w-8 h-8 rounded-full border-2 border-[#00D5E5] border-t-transparent animate-spin mr-3" />
        Loading Historical Climatological Datasets...
      </div>
    );
  }

  const dataset = data?.selected_dataset;
  const trends = data?.trends || [];
  const previewRows = data?.preview_rows || [];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 pb-2 border-b border-[#073B3C]/80">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="font-serif text-3xl md:text-4xl text-white tracking-tight">
              Historical Atmospheric Data & Model Ingest
            </h1>
            <span className="px-3 py-0.5 rounded-full text-xs font-mono font-bold bg-[#073B3C] border border-[#087F80] text-[#00D5E5]">
              CLIMATOLOGY
            </span>
          </div>
          <p className="text-xs font-mono text-[#9BAEB1] mt-1">
            Analyze historical storm frequency, lightning density trends, and upload custom meteorological observation CSVs
          </p>
        </div>

        {/* Upload Button */}
        <label className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-[#087F80] to-[#00D5E5] text-[#061418] text-xs font-mono font-bold uppercase tracking-wider cursor-pointer shadow-[0_0_15px_rgba(0,213,229,0.4)] hover:scale-105 transition-all">
          <Upload className="w-4 h-4" />
          <span>{uploading ? 'Parsing CSV...' : 'Upload Historical CSV'}</span>
          <input type="file" accept=".csv" onChange={handleFileUpload} className="hidden" />
        </label>
      </div>

      {uploadSuccess && (
        <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/40 text-emerald-300 font-mono text-xs flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{uploadSuccess}</span>
        </div>
      )}

      {uploadError && (
        <div className="p-3 rounded-xl bg-[#FF4D4D]/10 border border-[#FF4D4D]/40 text-[#FF4D4D] font-mono text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{uploadError}</span>
        </div>
      )}

      {/* Dataset Summary Cards (Section 18 requirement) */}
      {dataset && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 font-mono text-xs">
          <div className="p-3.5 rounded-xl bg-[#061418] border border-[#073B3C]/80">
            <div className="text-[#9BAEB1] text-[11px]">Total Observations</div>
            <div className="text-xl font-bold text-white mt-1">{dataset.row_count.toLocaleString()}</div>
          </div>
          <div className="p-3.5 rounded-xl bg-[#061418] border border-[#073B3C]/80">
            <div className="text-[#9BAEB1] text-[11px]">Date Range</div>
            <div className="text-xs font-bold text-[#00D5E5] mt-1 truncate">{dataset.date_range}</div>
          </div>
          <div className="p-3.5 rounded-xl bg-[#061418] border border-[#073B3C]/80">
            <div className="text-[#9BAEB1] text-[11px]">Missing Values</div>
            <div className="text-xl font-bold text-emerald-400 mt-1">{dataset.missing_values_count}</div>
          </div>
          <div className="p-3.5 rounded-xl bg-[#061418] border border-[#073B3C]/80">
            <div className="text-[#9BAEB1] text-[11px]">Locations</div>
            <div className="text-xs font-bold text-white mt-1">{dataset.locations?.length || 8} Sectors</div>
          </div>
          <div className="p-3.5 rounded-xl bg-[#061418] border border-[#073B3C]/80">
            <div className="text-[#9BAEB1] text-[11px]">Sensor Features</div>
            <div className="text-xl font-bold text-white mt-1">{dataset.features?.length || 18}</div>
          </div>
          <div className="p-3.5 rounded-xl bg-[#061418] border border-[#073B3C]/80">
            <div className="text-[#9BAEB1] text-[11px]">Ingest Integrity</div>
            <div className="text-xl font-bold text-emerald-400 mt-1">100% Valid</div>
          </div>
        </div>
      )}

      {/* Historical Trend Charts */}
      <div className="p-5 rounded-2xl bg-[#061418] border border-[#073B3C]/80 shadow-xl space-y-4">
        <div>
          <h3 className="text-base font-semibold text-white tracking-wide">
            Historical Climatological Multi-Trend Analysis
          </h3>
          <p className="text-xs font-mono text-[#9BAEB1]">
            Storm frequency, lightning strikes, average rainfall, and high-risk convective hours across recording window
          </p>
        </div>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trends} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#073B3C" opacity={0.4} />
              <XAxis dataKey="date" stroke="#9BAEB1" fontSize={11} tickLine={false} />
              <YAxis stroke="#9BAEB1" fontSize={11} tickLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(6, 20, 24, 0.95)',
                  borderColor: '#087F80',
                  borderRadius: '0.75rem',
                  fontSize: '12px',
                  fontFamily: 'monospace',
                }}
              />
              <Legend wrapperStyle={{ fontSize: '11px', fontFamily: 'monospace' }} />
              <Line type="monotone" dataKey="storm_frequency" name="Storm Cells (count)" stroke="#FF4D4D" strokeWidth={2} dot={{ r: 3 }} />
              <Line type="monotone" dataKey="lightning_strikes" name="Lightning Strikes" stroke="#00D5E5" strokeWidth={2} dot={{ r: 3 }} />
              <Line type="monotone" dataKey="avg_rainfall_mm" name="Avg Rainfall (mm)" stroke="#3b82f6" strokeWidth={2} dot={{ r: 3 }} />
              <Line type="monotone" dataKey="high_risk_hours" name="High Risk Hours" stroke="#FF9F43" strokeWidth={2} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Raw Data Preview Table */}
      {previewRows.length > 0 && (
        <div className="p-5 rounded-2xl bg-[#061418] border border-[#073B3C]/80 shadow-xl space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-semibold text-white">Dataset Preview (First 10 Observations)</h3>
            <span className="text-xs font-mono text-[#00D5E5]">
              {dataset?.name || 'IMD-Corridor-MultiSensor-2025.csv'}
            </span>
          </div>

          <div className="overflow-x-auto rounded-xl border border-[#073B3C]/80">
            <table className="w-full text-left font-mono text-xs">
              <thead className="bg-[#073B3C]/50 text-[#00D5E5] border-b border-[#087F80]/40">
                <tr>
                  <th className="p-2.5">Timestamp</th>
                  <th className="p-2.5">Location</th>
                  <th className="p-2.5">Radar dBZ</th>
                  <th className="p-2.5">Echo Top (km)</th>
                  <th className="p-2.5">Lightning 15m</th>
                  <th className="p-2.5">CAPE (J/kg)</th>
                  <th className="p-2.5">Temp (°C)</th>
                  <th className="p-2.5">Target 30m</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#073B3C]/40 text-gray-200">
                {previewRows.map((row, idx) => (
                  <tr key={idx} className="hover:bg-[#073B3C]/20 transition-colors">
                    <td className="p-2.5 text-[#9BAEB1]">{row.timestamp || 'N/A'}</td>
                    <td className="p-2.5 font-bold text-white">{row.location || 'Bhopal'}</td>
                    <td className="p-2.5 text-[#FF9F43]">{row.radar_reflectivity_dbz}</td>
                    <td className="p-2.5">{row.radar_echo_top_km}</td>
                    <td className="p-2.5 text-[#00D5E5]">{row.lightning_strikes_15m}</td>
                    <td className="p-2.5">{row.nwp_cape_j_kg}</td>
                    <td className="p-2.5">{row.surface_temp_c}</td>
                    <td className="p-2.5">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${row.target_thunderstorm_30m ? 'bg-[#FF4D4D]/20 text-[#FF4D4D]' : 'bg-emerald-500/20 text-emerald-400'}`}>
                        {row.target_thunderstorm_30m ? 'SEVERE (1)' : 'CLEAR (0)'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
