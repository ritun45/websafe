import React from 'react';
import { Eye, Shield, Users, Lock, AlertCircle } from 'lucide-react';

export const ResponsibleAI: React.FC = () => {
  const principles = [
    {
      title: 'Explainable',
      icon: Eye,
      description: 'Every flagged interaction details its biological mechanism and clinical rationale in transparent language so patients and providers understand exactly why an alert appears.',
    },
    {
      title: 'Evidence-Aware',
      icon: Shield,
      description: 'Rooted in verified pharmacology guidelines, ACC/AHA statements, and FDA safety communications. Demonstrative findings are transparently delineated from peer-reviewed records.',
    },
    {
      title: 'Human-in-the-Loop',
      icon: Users,
      description: 'Engineered as a decision-support aid. Licensed physicians, pharmacists, and healthcare providers remain the authoritative decision-makers for patient therapy.',
    },
    {
      title: 'Privacy-Focused',
      icon: Lock,
      description: 'Prescription text and medication lists are screened without storing or exposing personally identifiable health information (PHI) across persistent public networks.',
    },
  ];

  return (
    <section id="safety" className="py-16 md:py-24 border-b border-[#D9E0DC]/60">
      <div className="max-w-[1200px] mx-auto px-6 md:px-8 space-y-10">
        
        {/* Section Header */}
        <div className="max-w-[760px] space-y-3">
          <div className="inline-flex items-center gap-2">
            <Shield className="w-4 h-4 text-[#285C50]" />
            <span className="text-xs font-bold uppercase tracking-wider text-[#285C50] font-heading">
              Governance & Clinical Integrity
            </span>
          </div>
          <h2 className="font-heading font-extrabold text-3xl sm:text-4xl text-[#17352F] tracking-tight">
            Built for Responsible Healthcare AI
          </h2>
          <p className="text-base text-[#5E6863] leading-relaxed">
            Medication intelligence demands rigorous safeguards, algorithmic humility, and unwavering respect for medical oversight.
          </p>
        </div>

        {/* Editorial Split Layout: Clinical Governance + 4 Responsible AI Pillars */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Clinical Boundary & Governance Authority */}
          <div className="lg:col-span-5 space-y-6">
            <div className="rounded-[14px] bg-[#EEF3EF] border border-[#285C50]/30 p-6 sm:p-7 space-y-4 shadow-sm">
              <div className="space-y-1">
                <div className="text-xs font-bold uppercase tracking-wider text-[#285C50] font-heading">
                  Clinical Boundary Notice
                </div>
                <h3 className="font-heading font-extrabold text-xl sm:text-2xl text-[#17352F] leading-snug">
                  WebSafe supports medication-safety decisions. It does not diagnose, prescribe, or change medication.
                </h3>
              </div>
              <p className="text-xs sm:text-sm text-[#5E6863] leading-relaxed">
                All dosage adjustments, therapy suspensions, and drug substitutions require explicit authorization by a licensed clinician.
              </p>
              <div className="pt-3 border-t border-[#D9E0DC] flex items-center justify-between text-xs text-[#285C50] font-medium">
                <span>Standard of Care Compliance</span>
                <span className="font-mono text-[11px] bg-[#FFFFFF] px-2 py-0.5 rounded border border-[#D9E0DC]">v2.6 Guidelines</span>
              </div>
            </div>

            {/* Quiet provenance summary */}
            <div className="p-5 bg-[#FFFFFF] rounded-[12px] border border-[#D9E0DC] space-y-2 text-xs">
              <div className="font-heading font-bold text-[#17352F] uppercase tracking-wider text-[11px]">
                Algorithm Audit Trail
              </div>
              <p className="text-[#5E6863] leading-relaxed">
                Every calculation produces a verifiable cryptographic session ID linking the active medications to peer-reviewed clinical monographs.
              </p>
            </div>
          </div>

          {/* Right Column: Four Pillars with Varied Editorial Structure */}
          <div className="lg:col-span-7 space-y-4">
            {principles.map((p, idx) => {
              const Icon = p.icon;
              const tags = [
                'AUDITED · MECHANISTIC TRANSPARENCY',
                'FDA & ACC/AHA MONOGRAPHS',
                'PHYSICIAN & PHARMACIST SUPERVISED',
                'ZERO-RETENTION PHI ENCLAVE'
              ];
              return (
                <div
                  key={idx}
                  className="bg-[#FFFFFF] rounded-[12px] border border-[#D9E0DC] p-5 shadow-[0_2px_8px_rgba(23,53,47,0.03)] hover:border-[#285C50]/50 transition-all space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-[6px] bg-[#EEF3EF] text-[#285C50] flex items-center justify-center shrink-0">
                        <Icon className="w-4 h-4" />
                      </div>
                      <h4 className="font-heading font-bold text-base text-[#17352F]">
                        {p.title}
                      </h4>
                    </div>
                    <span className="text-[10px] font-mono text-[#285C50] bg-[#EEF3EF] px-2 py-0.5 rounded font-semibold hidden sm:inline">
                      {tags[idx]}
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm text-[#5E6863] leading-relaxed pl-11">
                    {p.description}
                  </p>
                </div>
              );
            })}
          </div>

        </div>

      </div>
    </section>
  );
};
