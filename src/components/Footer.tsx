import React from 'react';
import { Shield } from 'lucide-react';

interface FooterProps {
  onNavigate: (sectionId: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-[#17352F] text-[#F7F5EF] pt-16 pb-12 border-t border-[#285C50]">
      <div className="max-w-[1200px] mx-auto px-6 md:px-8 space-y-12">
        
        {/* Top row */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          
          {/* Brand info */}
          <div className="md:col-span-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-[8px] bg-[#285C50] text-[#F7F5EF] flex items-center justify-center">
                <svg
                  className="w-5 h-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="#F7F5EF" strokeWidth="1.5" />
                  <circle cx="12" cy="11" r="2" fill="#D89A28" />
                  <circle cx="7.5" cy="8" r="1.3" fill="#F7F5EF" />
                  <circle cx="16.5" cy="8" r="1.3" fill="#F7F5EF" />
                  <line x1="12" y1="11" x2="7.5" y2="8" stroke="#F7F5EF" strokeWidth="1.2" />
                  <line x1="12" y1="11" x2="16.5" y2="8" stroke="#F7F5EF" strokeWidth="1.2" />
                </svg>
              </div>
              <span className="font-heading font-extrabold text-2xl tracking-tight text-[#F7F5EF]">
                WebSafe
              </span>
            </div>

            <p className="font-heading font-semibold text-base text-[#D89A28]">
              Know Your Medicine, Stay Safer.
            </p>

            <p className="text-sm text-[#F7F5EF]/70 max-w-md leading-relaxed">
              AI-Powered Medication Safety & Interaction Intelligence. Clinically grounded decision support bridging complex pharmacokinetics with plain-language patient care.
            </p>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-3 space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider text-[#D89A28] font-heading">
              Platform Modules
            </div>
            <ul className="space-y-2 text-sm text-[#F7F5EF]/80">
              <li>
                <button
                  onClick={() => onNavigate('check-medicine')}
                  className="hover:text-[#FFFFFF] transition-colors"
                >
                  Check Medication
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('interaction-checker')}
                  className="hover:text-[#FFFFFF] transition-colors"
                >
                  Interaction Checker
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('knowledge-graph')}
                  className="hover:text-[#FFFFFF] transition-colors"
                >
                  Medication Intelligence Graph
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('patient-mode')}
                  className="hover:text-[#FFFFFF] transition-colors"
                >
                  Patient Translation Mode
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('clinical-review')}
                  className="hover:text-[#FFFFFF] transition-colors"
                >
                  Pharmacist Clinical Review
                </button>
              </li>
            </ul>
          </div>

          {/* Governance / Legal links */}
          <div className="md:col-span-3 space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider text-[#D89A28] font-heading">
              Governance & Safety
            </div>
            <ul className="space-y-2 text-sm text-[#F7F5EF]/80">
              <li>
                <button
                  onClick={() => onNavigate('safety')}
                  className="hover:text-[#FFFFFF] transition-colors"
                >
                  Responsible Healthcare AI
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('safety')}
                  className="hover:text-[#FFFFFF] transition-colors"
                >
                  Privacy & PHI Protection
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('safety')}
                  className="hover:text-[#FFFFFF] transition-colors"
                >
                  Pharmacology Data Sources
                </button>
              </li>
              <li>
                <a
                  href="#safety"
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate('safety');
                  }}
                  className="hover:text-[#FFFFFF] transition-colors"
                >
                  Emergency Contacts & Disclaimer
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Detailed Medical Disclaimer */}
        <div className="pt-8 border-t border-[#285C50]/60 space-y-3 text-xs text-[#F7F5EF]/60 leading-relaxed">
          <p>
            <strong className="text-[#F7F5EF]/90">Medical Disclaimer:</strong> WebSafe is an interactive technology prototype for healthcare innovation demonstrations and educational decision support. The software does not provide medical diagnoses, treatment recommendations, or personalized prescribing directions. Drug interactions and risk assessments presented in this application are illustrative and grounded in public guidelines. Always seek the advice of a physician, pharmacist, or other qualified healthcare provider regarding any medications or medical conditions.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-between pt-4 border-t border-[#285C50]/40 text-[11px] text-[#F7F5EF]/50 gap-2">
            <div>
              © 2026 WebSafe Healthcare Intelligence. All rights reserved. Built for Healthcare & AI Innovation.
            </div>
            <div className="flex items-center gap-4">
              <span>WCAG 2.1 AA Compliant</span>
              <span>•</span>
              <span>Zero-Pill Visual Architecture</span>
            </div>
          </div>
        </div>

      </div>
    </footer>
  );
};
