import React, { useState, useEffect } from 'react';
import {
  FileText,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  ArrowRight,
  ShieldAlert,
  Activity,
  Layers,
  Sparkles,
  Info
} from 'lucide-react';
import { RiskBadge } from './RiskBadge';

interface HeroAnalyzerProps {
  onStartCheck: () => void;
  onExploreGraph: () => void;
}

export const HeroAnalyzer: React.FC<HeroAnalyzerProps> = ({ onStartCheck, onExploreGraph }) => {
  // Animation state stages:
  // 0: Initial Prescription card view
  // 1: Scanning line moves down
  // 2: Medicines extracted into chips
  // 3: Connection lines draw between nodes
  // 4: Safety result & risk alert revealed
  const [stage, setStage] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);

  useEffect(() => {
    if (!isPlaying) return;

    // Check prefers-reduced-motion
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mediaQuery.matches) {
      setStage(4);
      setIsPlaying(false);
      return;
    }

    const timer = setTimeout(() => {
      if (stage < 4) {
        setStage((prev) => prev + 1);
      } else {
        // Pause at stage 4 for 8 seconds before auto-looping gently, or keep static until replay
        setIsPlaying(false);
      }
    }, stage === 1 ? 1600 : stage === 2 ? 1200 : stage === 3 ? 1200 : 1000);

    return () => clearTimeout(timer);
  }, [stage, isPlaying]);

  const handleReplay = () => {
    setStage(0);
    setIsPlaying(true);
  };

  const handleStepJump = (targetStage: number) => {
    setStage(targetStage);
    setIsPlaying(false);
  };

  return (
    <section className="relative overflow-hidden pt-8 pb-16 md:pt-12 md:pb-24 border-b border-[#D9E0DC]/60">
      {/* Background architectural grid pattern */}
      <div
        className="absolute inset-0 pointer-events-none opacity-40"
        style={{
          backgroundImage: `radial-gradient(#285C50 0.75px, transparent 0.75px), radial-gradient(#17352F 0.5px, #F7F5EF 0.5px)`,
          backgroundSize: '36px 36px',
          backgroundPosition: '0 0, 18px 18px',
        }}
      />

      <div className="max-w-[1200px] mx-auto px-6 md:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* LEFT COLUMN: Editorial Clinical Hierarchy */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#D89A28] animate-pulse" />
              <span className="text-[12px] md:text-[13px] font-bold tracking-[0.14em] uppercase text-[#285C50] font-heading">
                MEDICATION SAFETY INTELLIGENCE
              </span>
            </div>

            <h1 className="font-heading font-extrabold text-[42px] sm:text-[52px] lg:text-[58px] leading-[1.08] text-[#17352F] tracking-tight">
              Know Your Medicine.{' '}
              <span className="block text-[#285C50] mt-1 font-semibold">Stay Safer.</span>
            </h1>

            <p className="text-[17px] sm:text-[19px] text-[#5E6863] leading-[1.6] max-w-[520px]">
              WebSafe helps identify medicines, detect potential interactions and explain medication risks in language people can understand.
            </p>

            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5">
              <button
                onClick={onStartCheck}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-[#D89A28] hover:bg-[#c48920] active:bg-[#b07b1d] text-[#17201D] font-bold text-[15px] rounded-[8px] transition-all shadow-[0_2px_8px_rgba(23,53,47,0.06)] hover:shadow-[0_6px_16px_rgba(23,53,47,0.12)] cursor-pointer"
              >
                <span>Check My Medicine</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onExploreGraph}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-[#EEF3EF] hover:bg-[#dfe8e1] text-[#17352F] font-semibold text-[15px] rounded-[8px] border border-[#D9E0DC] transition-all cursor-pointer"
              >
                <span>See How It Works</span>
              </button>
            </div>

            {/* Quiet, unboxed metadata */}
            <div className="pt-6 border-t border-[#D9E0DC]/70 flex flex-wrap items-center gap-x-4 gap-y-2 text-[13px] text-[#5E6863]">
              <div className="flex items-center gap-1.5 text-[#17352F] font-medium">
                <CheckCircle2 className="w-4 h-4 text-[#3F8068]" />
                <span>CYP450 Enzyme Screening</span>
              </div>
              <span className="text-[#D9E0DC]" aria-hidden="true">•</span>
              <div className="flex items-center gap-1.5 text-[#17352F] font-medium">
                <CheckCircle2 className="w-4 h-4 text-[#3F8068]" />
                <span>Drug-Food Interactions</span>
              </div>
              <span className="text-[#D9E0DC]" aria-hidden="true">•</span>
              <div className="flex items-center gap-1.5 text-[#17352F] font-medium">
                <CheckCircle2 className="w-4 h-4 text-[#3F8068]" />
                <span>Pharmacist Review Ready</span>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Interactive Signature Medication Safety Analyzer */}
          <div className="lg:col-span-6">
            <div className="bg-[#FFFFFF] rounded-[18px] border border-[#D9E0DC] shadow-[0_8px_24px_rgba(23,53,47,0.08)] overflow-hidden relative">
              
              {/* Header Bar */}
              <div className="bg-[#17352F] px-5 py-3.5 text-[#F7F5EF] flex items-center justify-between border-b border-[#285C50]">
                <div className="flex items-center gap-2.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#D89A28]" />
                  <span className="font-heading font-semibold text-[13px] tracking-wide uppercase text-[#F7F5EF]/90">
                    Live Prescription Analyzer
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleReplay}
                    className="flex items-center gap-1 text-[11px] font-semibold text-[#EEF3EF]/80 hover:text-[#FFFFFF] bg-[#285C50]/60 hover:bg-[#285C50] px-2.5 py-1 rounded-[6px] transition-colors"
                    title="Replay Analysis Animation"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Replay</span>
                  </button>
                </div>
              </div>

              {/* Progress Stage Tracker Bar */}
              <div className="bg-[#EEF3EF] px-5 py-2.5 border-b border-[#D9E0DC] flex items-center justify-between text-[11px] font-medium text-[#5E6863]">
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-[#17352F]">Stage {stage + 1} of 5:</span>
                  <span className="text-[#285C50]">
                    {stage === 0 && 'Prescription Ingestion'}
                    {stage === 1 && 'Scanning & Optical Recognition'}
                    {stage === 2 && 'RxNorm Entity Extraction'}
                    {stage === 3 && 'Pharmacological Knowledge Graph Analysis'}
                    {stage >= 4 && 'Clinical Safety Alert Generated'}
                  </span>
                </div>

                {/* Micro-dots to jump stages */}
                <div className="flex items-center gap-1.5">
                  {[0, 1, 2, 3, 4].map((stepIdx) => (
                    <button
                      key={stepIdx}
                      onClick={() => handleStepJump(stepIdx)}
                      className={`w-2 h-2 rounded-full transition-all ${
                        stage === stepIdx
                          ? 'w-5 bg-[#D89A28]'
                          : stage > stepIdx
                          ? 'bg-[#285C50]'
                          : 'bg-[#D9E0DC]'
                      }`}
                      aria-label={`Go to stage ${stepIdx + 1}`}
                    />
                  ))}
                </div>
              </div>

              {/* Main Visual Arena */}
              <div className="p-6 space-y-5 min-h-[440px] flex flex-col justify-between relative bg-gradient-to-b from-[#FFFFFF] to-[#F7F5EF]/30">

                {/* 1. Realistic Prescription Card */}
                <div className="relative rounded-[12px] border border-[#D9E0DC] bg-[#FFFFFF] p-4 shadow-[0_2px_8px_rgba(23,53,47,0.04)] overflow-hidden">
                  
                  {/* Scanning Laser Line */}
                  {stage === 1 && (
                    <div
                      className="absolute inset-x-0 h-[3px] bg-gradient-to-r from-transparent via-[#D89A28] to-transparent z-20 pointer-events-none animate-bounce"
                      style={{
                        boxShadow: '0 0 10px rgba(216, 154, 40, 0.7)',
                        top: '40%',
                      }}
                    />
                  )}

                  {/* Rx Document Header */}
                  <div className="flex items-start justify-between border-b border-[#D9E0DC]/80 pb-2.5 mb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-[#285C50]" />
                        <span className="font-heading font-bold text-xs uppercase tracking-wider text-[#17352F]">
                          Hospital Prescription Order #749201
                        </span>
                      </div>
                      <p className="text-[11px] text-[#5E6863] mt-0.5">
                        Cardiovascular Clinic • Dr. Arthur Vance, MD
                      </p>
                    </div>
                    <span className="text-[11px] font-mono text-[#5E6863] bg-[#EEF3EF] px-2 py-0.5 rounded-[4px]">
                      Patient: E. Vance (68y)
                    </span>
                  </div>

                  {/* Prescribed Medications on Card */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[12px]">
                    <div
                      className={`p-2 rounded-[6px] border transition-all ${
                        stage >= 2
                          ? 'border-[#B6423A]/40 bg-[#B6423A]/5 text-[#17352F]'
                          : 'border-[#D9E0DC] bg-[#F7F5EF]/60'
                      }`}
                    >
                      <div className="font-bold font-mono">1. Warfarin Sodium 5 mg</div>
                      <div className="text-[11px] text-[#5E6863]">Sig: 1 tab PO q.d. at 18:00</div>
                    </div>

                    <div
                      className={`p-2 rounded-[6px] border transition-all ${
                        stage >= 2
                          ? 'border-[#B6423A]/40 bg-[#B6423A]/5 text-[#17352F]'
                          : 'border-[#D9E0DC] bg-[#F7F5EF]/60'
                      }`}
                    >
                      <div className="font-bold font-mono">2. Ibuprofen 400 mg</div>
                      <div className="text-[11px] text-[#5E6863]">Sig: 1 tab PO t.i.d. PRN joint pain</div>
                    </div>

                    <div
                      className={`p-2 rounded-[6px] border transition-all ${
                        stage >= 2
                          ? 'border-[#C9792B]/40 bg-[#C9792B]/5 text-[#17352F]'
                          : 'border-[#D9E0DC] bg-[#F7F5EF]/60'
                      }`}
                    >
                      <div className="font-bold font-mono">3. Clopidogrel 75 mg</div>
                      <div className="text-[11px] text-[#5E6863]">Sig: 1 tab PO q.d. morning</div>
                    </div>

                    <div
                      className={`p-2 rounded-[6px] border transition-all ${
                        stage >= 2
                          ? 'border-[#C9792B]/40 bg-[#C9792B]/5 text-[#17352F]'
                          : 'border-[#D9E0DC] bg-[#F7F5EF]/60'
                      }`}
                    >
                      <div className="font-bold font-mono">4. Omeprazole 20 mg</div>
                      <div className="text-[11px] text-[#5E6863]">Sig: 1 cap PO q.d. 30m a.c.</div>
                    </div>
                  </div>
                </div>

                {/* 2. Extracted Medicine Chips & Interaction Connectors */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs font-semibold text-[#5E6863]">
                    <span className="uppercase tracking-wider font-heading text-[11px]">
                      Extracted RxNorm Entities
                    </span>
                    {stage >= 2 && (
                      <span className="text-[#3F8068] flex items-center gap-1 font-bold">
                        <CheckCircle2 className="w-3.5 h-3.5" /> 4 Normalized
                      </span>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <div
                      className={`px-3 py-1.5 rounded-[8px] text-xs font-semibold border transition-all duration-300 ${
                        stage >= 2
                          ? 'bg-[#17352F] text-[#F7F5EF] border-[#17352F] shadow-sm'
                          : 'bg-[#EEF3EF] text-[#5E6863] border-[#D9E0DC] opacity-50'
                      }`}
                    >
                      Warfarin <span className="opacity-70 text-[10px] ml-1">Anticoagulant</span>
                    </div>

                    <div
                      className={`px-3 py-1.5 rounded-[8px] text-xs font-semibold border transition-all duration-300 ${
                        stage >= 2
                          ? 'bg-[#17352F] text-[#F7F5EF] border-[#17352F] shadow-sm'
                          : 'bg-[#EEF3EF] text-[#5E6863] border-[#D9E0DC] opacity-50'
                      }`}
                    >
                      Ibuprofen <span className="opacity-70 text-[10px] ml-1">NSAID</span>
                    </div>

                    <div
                      className={`px-3 py-1.5 rounded-[8px] text-xs font-semibold border transition-all duration-300 ${
                        stage >= 2
                          ? 'bg-[#285C50] text-[#F7F5EF] border-[#285C50] shadow-sm'
                          : 'bg-[#EEF3EF] text-[#5E6863] border-[#D9E0DC] opacity-50'
                      }`}
                    >
                      Clopidogrel <span className="opacity-70 text-[10px] ml-1">Antiplatelet</span>
                    </div>

                    <div
                      className={`px-3 py-1.5 rounded-[8px] text-xs font-semibold border transition-all duration-300 ${
                        stage >= 2
                          ? 'bg-[#285C50] text-[#F7F5EF] border-[#285C50] shadow-sm'
                          : 'bg-[#EEF3EF] text-[#5E6863] border-[#D9E0DC] opacity-50'
                      }`}
                    >
                      Omeprazole <span className="opacity-70 text-[10px] ml-1">PPI</span>
                    </div>
                  </div>
                </div>

                {/* 3. Connecting Lines & Knowledge Graph Micro-Simulation */}
                {stage >= 3 && (
                  <div className="p-3 bg-[#EEF3EF]/70 rounded-[10px] border border-[#D9E0DC] space-y-2">
                    <div className="flex items-center justify-between text-[11px] font-bold text-[#17352F]">
                      <span className="flex items-center gap-1.5">
                        <Activity className="w-3.5 h-3.5 text-[#285C50]" />
                        <span>CYP450 & Hemostatic Pathways Screened</span>
                      </span>
                      <span className="text-[#B6423A] font-semibold">2 Conflicts Flagged</span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[11px]">
                      <div className="bg-[#FFFFFF] p-2 rounded-[6px] border border-[#B6423A]/30">
                        <div className="font-bold text-[#B6423A] flex items-center justify-between">
                          <span>Warfarin + Ibuprofen</span>
                          <span className="text-[10px] bg-[#B6423A]/10 px-1 rounded">High</span>
                        </div>
                        <div className="text-[#5E6863] text-[10px] mt-0.5">
                          Platelet inhibition + Gastric ulceration
                        </div>
                      </div>

                      <div className="bg-[#FFFFFF] p-2 rounded-[6px] border border-[#C9792B]/30">
                        <div className="font-bold text-[#C9792B] flex items-center justify-between">
                          <span>Clopidogrel + Omeprazole</span>
                          <span className="text-[10px] bg-[#C9792B]/10 px-1 rounded">Moderate</span>
                        </div>
                        <div className="text-[#5E6863] text-[10px] mt-0.5">
                          CYP2C19 competitive bioactivation block
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 4. Final Safety Result Banner & Explanation Card */}
                {stage >= 4 ? (
                  <div className="rounded-[12px] bg-[#FFFFFF] border-2 border-[#B6423A]/40 p-4 shadow-[0_4px_16px_rgba(182,66,58,0.08)] space-y-3 animate-fadeIn">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <RiskBadge level="high" label="2 POTENTIAL INTERACTIONS" size="sm" />
                          <span className="text-[11px] font-bold text-[#5E6863]">
                            1 High • 1 Moderate
                          </span>
                        </div>
                        <h4 className="font-heading font-extrabold text-[15px] text-[#17352F] mt-1.5">
                          Critical Bleeding Risk & Stent Vulnerability
                        </h4>
                      </div>
                    </div>

                    <p className="text-[12px] text-[#5E6863] leading-relaxed">
                      Warfarin plus Ibuprofen creates a severe risk of internal stomach bleeding. Concurrently, Omeprazole may diminish Clopidogrel's heart clot protection.
                    </p>

                    <div className="flex items-center justify-between pt-1 text-[11px]">
                      <span className="text-[#17352F] font-semibold flex items-center gap-1">
                        <ShieldAlert className="w-3.5 h-3.5 text-[#B6423A]" />
                        Clinical recommendation: Consult doctor for safer pain alternatives
                      </span>
                      <button
                        onClick={onStartCheck}
                        className="text-[#285C50] hover:text-[#17352F] font-bold underline"
                      >
                        Inspect details →
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="h-16 flex items-center justify-center text-xs text-[#5E6863] bg-[#EEF3EF]/40 rounded-[10px] border border-dashed border-[#D9E0DC]">
                    <span>Analysis in progress...</span>
                  </div>
                )}
              </div>

              {/* Bottom Clinical Grounding Notice */}
              <div className="px-5 py-2.5 bg-[#EEF3EF] border-t border-[#D9E0DC] flex items-center justify-between text-[11px] text-[#5E6863]">
                <div className="flex items-center gap-1.5">
                  <Info className="w-3.5 h-3.5 text-[#285C50]" />
                  <span>Interactive demonstration mode • Grounded in ACC/AHA pharmacology rules</span>
                </div>
                <button
                  onClick={onStartCheck}
                  className="font-bold text-[#17352F] hover:text-[#285C50]"
                >
                  Run Full Analysis
                </button>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
