import React, { useState } from 'react';
import {
  FileText,
  AlertTriangle,
  AlertCircle,
  Info,
  ShieldCheck,
  Printer,
  Copy,
  Check,
  Download,
  Share2,
  RefreshCw,
  Sparkles,
  Coffee,
  ExternalLink,
} from 'lucide-react';
import { AnalysisResult } from '../utils/interactionEngine';
import { InteractionCard } from './InteractionCard';
import { RiskBadge } from './RiskBadge';
import { ClinicalDataCharts } from './ClinicalDataCharts';

interface SafetyReportProps {
  analysis: AnalysisResult;
  onReset: () => void;
  onJumpToPatientMode: () => void;
}

export const SafetyReport: React.FC<SafetyReportProps> = ({
  analysis,
  onReset,
  onJumpToPatientMode,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopyReport = () => {
    const textSummary = `WebSafe Medication Safety Report
Medicines Screened (${analysis.analyzedMedications.length}): ${analysis.analyzedMedications.map((m) => m.name).join(', ')}
Interactions Detected: ${analysis.interactions.length} (${analysis.riskCounts.high} High, ${analysis.riskCounts.moderate} Moderate, ${analysis.riskCounts.info} Informational)
${analysis.interactions.map((i) => `\n- [${i.severity.toUpperCase()}] ${i.drugAName} + ${i.drugBName}: ${i.title}\n  Action: ${i.clinicalAction}`).join('')}

Note: WebSafe is a medication-safety decision support tool and does not replace medical advice.`;

    navigator.clipboard.writeText(textSummary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-8 my-8 animate-fadeIn" id="safety-report-container">
      {/* Report Header Card */}
      <div className="bg-[#FFFFFF] rounded-[18px] border border-[#D9E0DC] p-6 sm:p-8 shadow-[0_8px_24px_rgba(23,53,47,0.08)]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#D9E0DC]">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#3F8068]" />
              <span className="text-xs font-bold uppercase tracking-wider text-[#285C50] font-heading">
                Verified Clinical Evaluation Pipeline
              </span>
            </div>
            <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-[#17352F] mt-1 tracking-tight">
              Medication Safety Report
            </h2>
            <p className="text-xs sm:text-sm text-[#5E6863] mt-0.5">
              Report ID: <span className="font-mono text-[#17352F]">WS-2026-{Math.floor(100000 + Math.random() * 900000)}</span> • Generated on {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </p>
          </div>

          {/* Action Toolbar */}
          <div className="flex flex-wrap items-center gap-2 no-print">
            <button
              onClick={handleCopyReport}
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-[#EEF3EF] hover:bg-[#dfe8e1] text-[#17352F] text-xs font-semibold rounded-[8px] border border-[#D9E0DC] transition-colors cursor-pointer"
              title="Copy Summary to Clipboard"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-[#3F8068]" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied to Clipboard' : 'Copy Summary'}</span>
            </button>

            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-[#EEF3EF] hover:bg-[#dfe8e1] text-[#17352F] text-xs font-semibold rounded-[8px] border border-[#D9E0DC] transition-colors cursor-pointer"
              title="Print Clinical Report"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Report</span>
            </button>

            <button
              onClick={onReset}
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-[#FFFFFF] hover:bg-[#EEF3EF] text-[#5E6863] hover:text-[#17352F] text-xs font-semibold rounded-[8px] border border-[#D9E0DC] transition-colors cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>New Analysis</span>
            </button>
          </div>
        </div>

        {/* Medicines Detected Strip */}
        <div className="py-6 border-b border-[#D9E0DC] space-y-3">
          <div className="flex items-center justify-between">
            <div className="text-xs font-bold uppercase tracking-wider text-[#5E6863] font-heading">
              Medicines Detected ({analysis.analyzedMedications.length})
            </div>
            <span className="text-xs font-mono text-[#285C50]">
              Polypharmacy Index: {analysis.polypharmacyScore}/100
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {analysis.analyzedMedications.map((med) => (
              <div
                key={med.id}
                className="p-3 rounded-[10px] bg-[#EEF3EF]/60 border border-[#D9E0DC] space-y-1"
              >
                <div className="font-heading font-bold text-sm text-[#17352F]">
                  {med.name}
                </div>
                <div className="text-xs text-[#5E6863] flex items-center justify-between">
                  <span>{med.dosage}</span>
                  <span className="font-medium text-[#285C50] text-[11px]">{med.category}</span>
                </div>
                {med.cypPathways && med.cypPathways.length > 0 && (
                  <div className="text-[10px] font-mono text-[#5E6863] truncate">
                    {med.cypPathways[0]}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Interaction Summary & Risk Distribution */}
        <div className="pt-6 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          {/* Large Count */}
          <div className="md:col-span-5 space-y-1">
            <div className="text-xs font-bold uppercase tracking-wider text-[#5E6863] font-heading">
              Interaction Summary
            </div>
            <div className="font-heading font-extrabold text-3xl sm:text-4xl text-[#17352F] tracking-tight">
              {analysis.interactions.length} Potential Interaction{analysis.interactions.length === 1 ? '' : 's'}
            </div>
            <p className="text-xs text-[#5E6863]">
              Identified across {analysis.analyzedMedications.length} concurrent pharmacological agents.
            </p>
          </div>

          {/* Risk Distribution Pills: Color + Text + Icon */}
          <div className="md:col-span-7 flex flex-wrap items-center gap-3">
            <div className="flex-1 min-w-[130px] p-3 rounded-[10px] bg-[#B6423A]/10 border border-[#B6423A]/30 flex items-center gap-2.5">
              <AlertTriangle className="w-5 h-5 text-[#B6423A] shrink-0" />
              <div>
                <div className="font-heading font-extrabold text-lg text-[#B6423A]">
                  {analysis.riskCounts.high} High
                </div>
                <div className="text-[11px] text-[#5E6863] font-medium">Critical attention</div>
              </div>
            </div>

            <div className="flex-1 min-w-[130px] p-3 rounded-[10px] bg-[#C9792B]/10 border border-[#C9792B]/30 flex items-center gap-2.5">
              <AlertCircle className="w-5 h-5 text-[#C9792B] shrink-0" />
              <div>
                <div className="font-heading font-extrabold text-lg text-[#C9792B]">
                  {analysis.riskCounts.moderate} Moderate
                </div>
                <div className="text-[11px] text-[#5E6863] font-medium">Monitor or adjust</div>
              </div>
            </div>

            <div className="flex-1 min-w-[130px] p-3 rounded-[10px] bg-[#285C50]/10 border border-[#285C50]/30 flex items-center gap-2.5">
              <Info className="w-5 h-5 text-[#285C50] shrink-0" />
              <div>
                <div className="font-heading font-extrabold text-lg text-[#285C50]">
                  {analysis.foodInteractions.length} Dietary
                </div>
                <div className="text-[11px] text-[#5E6863] font-medium">Food considerations</div>
              </div>
            </div>
          </div>
        </div>

        {/* Data Visualization Analytics */}
        <div className="pt-6 border-t border-[#D9E0DC]">
          <ClinicalDataCharts analysis={analysis} />
        </div>

        {/* Patient Mode CTA Banner */}
        <div className="mt-6 p-4 rounded-[12px] bg-[#EEF3EF] border border-[#285C50]/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 no-print">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#285C50] text-[#FFFFFF] flex items-center justify-center shrink-0">
              <Sparkles className="w-4 h-4 text-[#D89A28]" />
            </div>
            <div>
              <div className="font-heading font-bold text-sm text-[#17352F]">
                Need plain language or audio explanation?
              </div>
              <p className="text-xs text-[#5E6863]">
                Switch to Patient Mode with multi-lingual voice reading (English, Hindi, Bengali, Spanish).
              </p>
            </div>
          </div>

          <button
            onClick={onJumpToPatientMode}
            className="px-4 py-2 bg-[#285C50] hover:bg-[#17352F] text-[#FFFFFF] text-xs font-bold rounded-[8px] transition-colors whitespace-nowrap cursor-pointer"
          >
            Open Patient Mode →
          </button>
        </div>
      </div>

      {/* Interaction Cards List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-heading font-extrabold text-xl text-[#17352F] tracking-tight">
            Detailed Clinical Interaction Screening ({analysis.interactions.length})
          </h3>
          <span className="text-xs text-[#5E6863]">
            Ranked by clinical severity
          </span>
        </div>

        {analysis.interactions.length > 0 ? (
          analysis.interactions.map((interaction) => (
            <InteractionCard key={interaction.id} interaction={interaction} />
          ))
        ) : (
          <div className="p-8 rounded-[14px] bg-[#FFFFFF] border border-[#3F8068]/30 text-center space-y-2">
            <div className="w-12 h-12 rounded-full bg-[#3F8068]/10 text-[#3F8068] mx-auto flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h4 className="font-heading font-bold text-base text-[#17352F]">
              No Known High-Severity Interactions Detected
            </h4>
            <p className="text-xs text-[#5E6863] max-w-md mx-auto">
              No direct contraindications found between these specific medications in the current formulary. Always review with your pharmacist when starting any new medication.
            </p>
          </div>
        )}
      </div>

      {/* Food & Nutrition Interactions Section */}
      {analysis.foodInteractions.length > 0 && (
        <div className="space-y-3">
          <h3 className="font-heading font-bold text-lg text-[#17352F] flex items-center gap-2">
            <Coffee className="w-5 h-5 text-[#285C50]" />
            <span>Food & Dietary Factors to Monitor ({analysis.foodInteractions.length})</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {analysis.foodInteractions.map((food) => (
              <div
                key={food.id}
                className="bg-[#FFFFFF] border border-[#D9E0DC] rounded-[12px] p-4 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="font-heading font-bold text-sm text-[#17352F]">
                    {food.drugName} + {food.foodName}
                  </div>
                  <RiskBadge level={food.severity} size="sm" />
                </div>
                <p className="text-xs text-[#5E6863] leading-relaxed">
                  {food.summary}
                </p>
                <div className="text-xs font-medium text-[#285C50] bg-[#EEF3EF] p-2.5 rounded-[6px]">
                  <span className="font-bold">Guidance: </span>
                  {food.recommendation}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Grounding and Educational Disclaimer */}
      <div className="p-4 rounded-[12px] bg-[#EEF3EF]/60 border border-[#D9E0DC] text-xs text-[#5E6863] space-y-1">
        <div className="font-bold text-[#17352F] flex items-center gap-1.5">
          <Info className="w-4 h-4 text-[#285C50]" />
          <span>Clinical Validation Notice (Innovation Prototype)</span>
        </div>
        <p>
          Illustrative demonstration result grounded in public clinical pharmacology guidelines. Never stop, change doses, or alter medications without consulting a licensed physician or pharmacist.
        </p>
      </div>
    </div>
  );
};
