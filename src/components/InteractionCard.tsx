import React, { useState } from 'react';
import {
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  AlertCircle,
  HelpCircle,
  ExternalLink,
  BookOpen,
  Coffee,
  Info,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import { DrugInteraction } from '../types/medication';
import { RiskBadge } from './RiskBadge';

interface InteractionCardProps {
  interaction: DrugInteraction;
}

export const InteractionCard: React.FC<InteractionCardProps> = ({ interaction }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div
      className={`rounded-[14px] bg-[#FFFFFF] border transition-all shadow-[0_2px_8px_rgba(23,53,47,0.04)] hover:shadow-[0_4px_16px_rgba(23,53,47,0.08)] overflow-hidden ${
        interaction.severity === 'high'
          ? 'border-[#B6423A]/40'
          : interaction.severity === 'moderate'
          ? 'border-[#C9792B]/40'
          : 'border-[#3F8068]/40'
      }`}
    >
      {/* Header Bar */}
      <div className="p-5 sm:p-6 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <RiskBadge level={interaction.severity} label={interaction.severityLabel} />
            {interaction.isDemo && (
              <span className="text-[11px] font-medium text-[#5E6863] bg-[#EEF3EF] px-2 py-0.5 rounded-[4px] border border-[#D9E0DC]">
                Illustrative demo result
              </span>
            )}
          </div>

          <span className="text-xs font-mono text-[#5E6863]">
            Rule ID: {interaction.id}
          </span>
        </div>

        {/* Drug Pair Title */}
        <div>
          <h3 className="font-heading font-extrabold text-lg sm:text-xl text-[#17352F] tracking-tight">
            {interaction.drugAName} + {interaction.drugBName}
          </h3>
          <p className="text-xs sm:text-sm font-semibold text-[#285C50] mt-0.5">
            {interaction.title}
          </p>
        </div>

        {/* Why this matters (Plain-language explanation) */}
        <div className="bg-[#EEF3EF]/60 rounded-[10px] p-3.5 border border-[#D9E0DC]/70">
          <div className="text-xs font-bold text-[#17352F] uppercase tracking-wider mb-1 flex items-center gap-1.5 font-heading">
            <HelpCircle className="w-3.5 h-3.5 text-[#285C50]" />
            <span>Why this matters</span>
          </div>
          <p className="text-sm text-[#17201D] leading-relaxed">
            {interaction.whyItMatters}
          </p>
        </div>

        {/* What to do (Clinical guidance) */}
        <div className="bg-[#FFFFFF] rounded-[10px] p-3.5 border border-[#D9E0DC] space-y-1">
          <div className="text-xs font-bold text-[#285C50] uppercase tracking-wider flex items-center gap-1.5 font-heading">
            <ShieldCheck className="w-3.5 h-3.5 text-[#3F8068]" />
            <span>What to do</span>
          </div>
          <p className="text-sm text-[#17201D] font-medium leading-relaxed">
            {interaction.clinicalAction}
          </p>
          <p className="text-[11px] text-[#5E6863] italic pt-0.5">
            Discuss this combination with a qualified doctor or pharmacist before making any medication changes.
          </p>
        </div>

        {/* Food / Dietary Considerations (if present) */}
        {interaction.foodConsiderations && (
          <div className="flex items-start gap-2 text-xs text-[#5E6863] bg-[#F7F5EF] p-2.5 rounded-[8px] border border-[#D9E0DC]/70">
            <Coffee className="w-4 h-4 text-[#C9792B] shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-[#17352F]">Dietary Consideration: </span>
              {interaction.foodConsiderations}
            </div>
          </div>
        )}

        {/* Toggle Expand for Evidence and Mechanism */}
        <div className="pt-2 flex items-center justify-between border-t border-[#D9E0DC]/60">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-xs font-bold text-[#285C50] hover:text-[#17352F] inline-flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>{isExpanded ? 'Hide clinical evidence & mechanism' : 'View evidence / source & pharmacokinetics'}</span>
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          <span className="text-[11px] text-[#5E6863]">
            CYP / Pharmacodynamic Screening
          </span>
        </div>
      </div>

      {/* Expanded Clinical Evidence & Pharmacokinetics */}
      {isExpanded && (
        <div className="bg-[#EEF3EF] px-5 sm:px-6 py-4 border-t border-[#D9E0DC] space-y-3 text-xs text-[#17201D]">
          <div>
            <div className="font-heading font-bold text-xs uppercase tracking-wider text-[#17352F] mb-1">
              Biological Mechanism & Pharmacokinetics
            </div>
            <p className="text-[#5E6863] leading-relaxed">
              {interaction.mechanism}
            </p>
            {interaction.cypDetail && (
              <div className="mt-2 inline-block font-mono text-[11px] bg-[#FFFFFF] border border-[#D9E0DC] px-2.5 py-1 rounded-[6px] text-[#285C50]">
                Pathway: {interaction.cypDetail}
              </div>
            )}
          </div>

          <div className="pt-2 border-t border-[#D9E0DC]/80 flex flex-wrap items-center justify-between gap-2 text-[11px] text-[#5E6863]">
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-[#17352F]">Evidence Source:</span>
              <span>{interaction.evidenceSource}</span>
            </div>
            <span className="font-medium text-[#285C50]">
              Clinical Evidence Level B (Peer-reviewed pharmacology)
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
