import React, { useState, useEffect } from 'react';
import {
  FileSearch,
  Database,
  GitBranch,
  ShieldAlert,
  CheckCircle2,
  Loader2,
} from 'lucide-react';

interface AnalysisProgressProps {
  onComplete: () => void;
  speedMultiplier?: number;
}

export const AnalysisProgress: React.FC<AnalysisProgressProps> = ({
  onComplete,
  speedMultiplier = 1,
}) => {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      id: 0,
      title: 'Reading Prescription',
      subtitle: 'OCR & handwriting analysis',
      detail: 'Processing image contrast, segmenting lines, bounding box extraction...',
      icon: FileSearch,
    },
    {
      id: 1,
      title: 'Identifying Medicines',
      subtitle: 'Drug normalization & RxNorm',
      detail: 'Resolving brand/generic synonyms, dosage extraction, ATC classification...',
      icon: Database,
    },
    {
      id: 2,
      title: 'Checking Interactions',
      subtitle: 'Knowledge graph & CYP screening',
      detail: 'Traversing hepatic CYP2C9/CYP2C19/CYP3A4 pathways & antiplatelet synergy...',
      icon: GitBranch,
    },
    {
      id: 3,
      title: 'Generating Safety Explanation',
      subtitle: 'Risk classification & clinical guidance',
      detail: 'Calibrating risk severity tiers, formulating plain-language and clinical alerts...',
      icon: ShieldAlert,
    },
  ];

  useEffect(() => {
    // Stage interval: roughly 650ms per step
    const intervalTime = 650 / speedMultiplier;
    const timer = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev < steps.length - 1) {
          return prev + 1;
        } else {
          clearInterval(timer);
          setTimeout(onComplete, 400);
          return prev;
        }
      });
    }, intervalTime);

    return () => clearInterval(timer);
  }, [onComplete, speedMultiplier]);

  return (
    <div className="bg-[#FFFFFF] border border-[#D9E0DC] rounded-[18px] p-6 sm:p-8 shadow-[0_8px_24px_rgba(23,53,47,0.08)] my-8">
      <div className="max-w-[780px] mx-auto text-center space-y-2 mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#EEF3EF] rounded-full text-xs font-bold text-[#285C50] tracking-wider uppercase">
          <Loader2 className="w-3.5 h-3.5 animate-spin" />
          <span>Multi-Stage Pharmacology Pipeline Active</span>
        </div>
        <h3 className="font-heading font-extrabold text-2xl sm:text-3xl text-[#17352F]">
          Analyzing Medication Regimen
        </h3>
        <p className="text-sm text-[#5E6863]">
          Cross-referencing drug profiles, hepatic metabolic pathways, and clinical contraindications.
        </p>
      </div>

      {/* Desktop Horizontal Progress Indicator */}
      <div className="hidden md:block relative mb-10">
        {/* Progress Background Line */}
        <div className="absolute top-6 left-12 right-12 h-1 bg-[#EEF3EF] -z-0">
          <div
            className="h-full bg-[#285C50] transition-all duration-500 ease-out"
            style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
          />
        </div>

        <div className="grid grid-cols-4 relative z-10">
          {steps.map((step, idx) => {
            const isCompleted = currentStep > idx;
            const isCurrent = currentStep === idx;
            const isPending = currentStep < idx;
            const IconComp = step.icon;

            return (
              <div key={step.id} className="flex flex-col items-center text-center px-2">
                <div
                  className={`w-12 h-12 rounded-[10px] flex items-center justify-center transition-all duration-300 ${
                    isCompleted
                      ? 'bg-[#3F8068] text-[#FFFFFF] shadow-sm'
                      : isCurrent
                      ? 'bg-[#17352F] text-[#D89A28] ring-4 ring-[#285C50]/20 shadow-md'
                      : 'bg-[#EEF3EF] text-[#5E6863] border border-[#D9E0DC]'
                  }`}
                >
                  {isCompleted ? (
                    <CheckCircle2 className="w-6 h-6" />
                  ) : isCurrent ? (
                    <Loader2 className="w-6 h-6 animate-spin text-[#D89A28]" />
                  ) : (
                    <IconComp className="w-5 h-5" />
                  )}
                </div>

                <div className="mt-3">
                  <div
                    className={`font-heading font-bold text-sm ${
                      isCurrent
                        ? 'text-[#17352F]'
                        : isCompleted
                        ? 'text-[#285C50]'
                        : 'text-[#5E6863]'
                    }`}
                  >
                    {step.title}
                  </div>
                  <div className="text-[11px] text-[#5E6863] mt-0.5">{step.subtitle}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Mobile Vertical Progress Indicator */}
      <div className="md:hidden space-y-4 mb-6">
        {steps.map((step, idx) => {
          const isCompleted = currentStep > idx;
          const isCurrent = currentStep === idx;
          const isPending = currentStep < idx;
          const IconComp = step.icon;

          return (
            <div
              key={step.id}
              className={`flex items-start gap-3 p-3 rounded-[10px] border transition-all ${
                isCurrent
                  ? 'bg-[#EEF3EF] border-[#285C50]'
                  : isCompleted
                  ? 'bg-[#FFFFFF] border-[#3F8068]/30'
                  : 'bg-[#FFFFFF] border-[#D9E0DC] opacity-60'
              }`}
            >
              <div
                className={`w-9 h-9 rounded-[8px] flex items-center justify-center shrink-0 ${
                  isCompleted
                    ? 'bg-[#3F8068] text-[#FFFFFF]'
                    : isCurrent
                    ? 'bg-[#17352F] text-[#D89A28]'
                    : 'bg-[#EEF3EF] text-[#5E6863]'
                }`}
              >
                {isCompleted ? (
                  <CheckCircle2 className="w-5 h-5" />
                ) : isCurrent ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <IconComp className="w-4 h-4" />
                )}
              </div>

              <div>
                <div className="font-heading font-bold text-sm text-[#17352F]">
                  {step.title}
                </div>
                <div className="text-xs text-[#5E6863]">{step.subtitle}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Live Pipeline Telemetry Log */}
      <div className="bg-[#17352F] text-[#F7F5EF] p-4 rounded-[10px] font-mono text-xs flex items-center justify-between border border-[#285C50]">
        <div className="flex items-center gap-2 truncate">
          <span className="text-[#D89A28] font-bold">LOG:</span>
          <span className="text-[#F7F5EF]/90 truncate">
            {steps[currentStep]?.detail}
          </span>
        </div>
        <span className="text-[#D89A28] text-[11px] font-bold ml-2 shrink-0">
          Step {currentStep + 1} / 4
        </span>
      </div>
    </div>
  );
};
