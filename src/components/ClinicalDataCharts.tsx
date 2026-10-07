import React, { useState } from 'react';
import { AlertTriangle, AlertCircle, Info, Activity, ShieldCheck, PieChart, BarChart3 } from 'lucide-react';
import { AnalysisResult } from '../utils/interactionEngine';

interface ClinicalDataChartsProps {
  analysis: AnalysisResult;
}

export const ClinicalDataCharts: React.FC<ClinicalDataChartsProps> = ({ analysis }) => {
  const [hoveredSlice, setHoveredSlice] = useState<string | null>(null);

  const { high, moderate, info, total } = analysis.riskCounts;
  const totalItems = Math.max(1, high + moderate + info);

  const highPct = Math.round((high / totalItems) * 100);
  const modPct = Math.round((moderate / totalItems) * 100);
  const infoPct = 100 - highPct - modPct;

  // Donut chart trigonometry calculations
  const radius = 42;
  const circumference = 2 * Math.PI * radius;

  // Segment strokeDasharray calculations
  const highDash = (high / totalItems) * circumference;
  const modDash = (moderate / totalItems) * circumference;
  const infoDash = (info / totalItems) * circumference;

  const highOffset = 0;
  const modOffset = -highDash;
  const infoOffset = -(highDash + modDash);

  return (
    <div className="bg-[#FFFFFF] rounded-[14px] border border-[#D9E0DC] p-5 sm:p-6 shadow-[0_2px_8px_rgba(23,53,47,0.04)] space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#D9E0DC] gap-2">
        <div className="flex items-center gap-2">
          <BarChart3 className="w-4 h-4 text-[#285C50]" />
          <h4 className="font-heading font-bold text-sm text-[#17352F] uppercase tracking-wider">
            Clinical Risk Distribution & Regimen Burden Analytics
          </h4>
        </div>
        <span className="text-[11px] font-mono text-[#5E6863]">
          Grounded in detected formulary interactions
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        
        {/* 1. Donut / Ring Chart: Proportional Risk Breakdown */}
        <div className="lg:col-span-5 flex flex-col sm:flex-row items-center gap-5 justify-center sm:justify-start">
          <div className="relative w-32 h-32 shrink-0">
            <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
              {/* Background track circle */}
              <circle
                cx="50"
                cy="50"
                r={radius}
                fill="none"
                stroke="#EEF3EF"
                strokeWidth="14"
              />

              {/* High risk slice */}
              {high > 0 && (
                <circle
                  cx="50"
                  cy="50"
                  r={radius}
                  fill="none"
                  stroke="#B6423A"
                  strokeWidth={hoveredSlice === 'high' ? 16 : 14}
                  strokeDasharray={`${highDash} ${circumference}`}
                  strokeDashoffset={highOffset}
                  className="transition-all duration-300 cursor-pointer"
                  onMouseEnter={() => setHoveredSlice('high')}
                  onMouseLeave={() => setHoveredSlice(null)}
                />
              )}

              {/* Moderate risk slice */}
              {moderate > 0 && (
                <circle
                  cx="50"
                  cy="50"
                  r={radius}
                  fill="none"
                  stroke="#C9792B"
                  strokeWidth={hoveredSlice === 'moderate' ? 16 : 14}
                  strokeDasharray={`${modDash} ${circumference}`}
                  strokeDashoffset={modOffset}
                  className="transition-all duration-300 cursor-pointer"
                  onMouseEnter={() => setHoveredSlice('moderate')}
                  onMouseLeave={() => setHoveredSlice(null)}
                />
              )}

              {/* Dietary / Info slice */}
              {info > 0 && (
                <circle
                  cx="50"
                  cy="50"
                  r={radius}
                  fill="none"
                  stroke="#285C50"
                  strokeWidth={hoveredSlice === 'info' ? 16 : 14}
                  strokeDasharray={`${infoDash} ${circumference}`}
                  strokeDashoffset={infoOffset}
                  className="transition-all duration-300 cursor-pointer"
                  onMouseEnter={() => setHoveredSlice('info')}
                  onMouseLeave={() => setHoveredSlice(null)}
                />
              )}
            </svg>

            {/* Inner Center Label */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center select-none pointer-events-none">
              <span className="font-heading font-extrabold text-xl text-[#17352F] leading-none">
                {total}
              </span>
              <span className="text-[10px] text-[#5E6863] uppercase tracking-wider font-semibold mt-0.5">
                Total
              </span>
            </div>
          </div>

          {/* Interactive Legend with live focus feedback */}
          <div className="space-y-1.5 text-xs w-full sm:w-auto">
            <div
              onMouseEnter={() => setHoveredSlice('high')}
              onMouseLeave={() => setHoveredSlice(null)}
              className={`p-1.5 rounded-[6px] transition-colors cursor-pointer flex items-center justify-between sm:justify-start gap-3 ${
                hoveredSlice === 'high' ? 'bg-[#B6423A]/10 font-bold' : ''
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#B6423A]" />
                <span className="text-[#17352F]">High Risk Alerts</span>
              </div>
              <span className="font-mono text-[#B6423A] font-bold">{high} ({highPct}%)</span>
            </div>

            <div
              onMouseEnter={() => setHoveredSlice('moderate')}
              onMouseLeave={() => setHoveredSlice(null)}
              className={`p-1.5 rounded-[6px] transition-colors cursor-pointer flex items-center justify-between sm:justify-start gap-3 ${
                hoveredSlice === 'moderate' ? 'bg-[#C9792B]/10 font-bold' : ''
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#C9792B]" />
                <span className="text-[#17352F]">Moderate Warnings</span>
              </div>
              <span className="font-mono text-[#C9792B] font-bold">{moderate} ({modPct}%)</span>
            </div>

            <div
              onMouseEnter={() => setHoveredSlice('info')}
              onMouseLeave={() => setHoveredSlice(null)}
              className={`p-1.5 rounded-[6px] transition-colors cursor-pointer flex items-center justify-between sm:justify-start gap-3 ${
                hoveredSlice === 'info' ? 'bg-[#285C50]/10 font-bold' : ''
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#285C50]" />
                <span className="text-[#17352F]">Dietary Factors</span>
              </div>
              <span className="font-mono text-[#285C50] font-bold">{info} ({infoPct}%)</span>
            </div>
          </div>
        </div>

        {/* 2. Medication Risk Stacked Segmented Bar & Polypharmacy Index */}
        <div className="lg:col-span-7 space-y-4 pl-0 lg:pl-4 border-t lg:border-t-0 lg:border-l border-[#D9E0DC] pt-4 lg:pt-0">
          
          {/* Segmented Risk Bar */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-heading font-bold text-[#17352F]">
                Medication Risk Profile Stack
              </span>
              <span className="text-[#5E6863] text-[11px] font-mono">
                {analysis.analyzedMedications.length} concurrent Rx
              </span>
            </div>

            {/* Visual Multi-Segment Bar */}
            <div className="h-3.5 w-full bg-[#EEF3EF] rounded-[6px] overflow-hidden flex shadow-inner">
              {high > 0 && (
                <div
                  style={{ width: `${highPct}%` }}
                  className="h-full bg-[#B6423A] transition-all duration-500 hover:brightness-110"
                  title={`High Risk: ${high}`}
                />
              )}
              {moderate > 0 && (
                <div
                  style={{ width: `${modPct}%` }}
                  className="h-full bg-[#C9792B] transition-all duration-500 hover:brightness-110"
                  title={`Moderate Risk: ${moderate}`}
                />
              )}
              {info > 0 && (
                <div
                  style={{ width: `${infoPct}%` }}
                  className="h-full bg-[#285C50] transition-all duration-500 hover:brightness-110"
                  title={`Dietary / Info: ${info}`}
                />
              )}
            </div>
          </div>

          {/* Polypharmacy Burden Meter */}
          <div className="space-y-1.5 bg-[#EEF3EF]/60 p-3.5 rounded-[10px] border border-[#D9E0DC]">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-[#17352F] flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-[#285C50]" />
                <span>Polypharmacy Complexity Index</span>
              </span>
              <span className="font-mono font-extrabold text-[#17352F]">
                {analysis.polypharmacyScore} / 100
              </span>
            </div>

            {/* Threshold progress bar */}
            <div className="h-2 w-full bg-[#D9E0DC] rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-700 ${
                  analysis.polypharmacyScore >= 60
                    ? 'bg-[#B6423A]'
                    : analysis.polypharmacyScore >= 35
                    ? 'bg-[#C9792B]'
                    : 'bg-[#3F8068]'
                }`}
                style={{ width: `${Math.min(100, analysis.polypharmacyScore)}%` }}
              />
            </div>

            <div className="flex items-center justify-between text-[10px] text-[#5E6863] pt-0.5">
              <span>0-34 Standard (Monitored)</span>
              <span>35-59 Elevated (Frequent Review)</span>
              <span>60+ High Complexity Triage</span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
