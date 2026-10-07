import React from 'react';
import { AlertTriangle, PhoneCall, ShieldCheck, HeartHandshake } from 'lucide-react';

export const SafetyNotice: React.FC = () => {
  return (
    <div className="bg-[#FFFFFF] border-b border-[#D9E0DC] py-8">
      <div className="max-w-[1200px] mx-auto px-6 md:px-8">
        <div className="rounded-[14px] bg-[#F7F5EF] border border-[#D9E0DC] p-5 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-9 h-9 rounded-[8px] bg-[#EEF3EF] text-[#285C50] flex items-center justify-center shrink-0 mt-0.5">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <div className="font-heading font-bold text-sm text-[#17352F]">
                Clinical Advisory & Educational Intended Use
              </div>
              <p className="text-xs text-[#5E6863] leading-relaxed max-w-2xl">
                WebSafe is an educational and medication-safety support tool. It does not replace professional medical advice, clinical diagnosis, or individualized treatment plans.
              </p>
            </div>
          </div>

          <div className="p-3 bg-[#FFFFFF] rounded-[8px] border border-[#B6423A]/30 text-xs text-[#17201D] space-y-1 shrink-0 md:max-w-xs">
            <div className="flex items-center gap-1.5 font-bold text-[#B6423A]">
              <AlertTriangle className="w-4 h-4" />
              <span>For Medical Emergencies:</span>
            </div>
            <p className="text-[11px] text-[#5E6863] leading-normal">
              If you are experiencing severe symptoms, suspected overdose, difficulty breathing, or another acute emergency, call emergency services (911 / local emergency number) or Poison Control immediately.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
