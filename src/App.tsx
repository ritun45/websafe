import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { HeroAnalyzer } from './components/HeroAnalyzer';
import { SafetyNotice } from './components/SafetyNotice';
import { CheckMedicineSection } from './components/CheckMedicineSection';
import { InteractionChecker } from './components/InteractionChecker';
import { InteractionGraph } from './components/InteractionGraph';
import { PatientMode } from './components/PatientMode';
import { DoctorDashboard } from './components/DoctorDashboard';
import { ResponsibleAI } from './components/ResponsibleAI';
import { Footer } from './components/Footer';
import { ArrowUpRight } from 'lucide-react';

export default function App() {
  const [activeSection, setActiveSection] = useState('hero');

  const scrollToSection = (sectionId: string) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else if (sectionId === 'hero') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F5EF] text-[#17201D] font-sans selection:bg-[#285C50]/20 selection:text-[#17352F] flex flex-col justify-between">
      
      {/* Sticky Compact Navbar */}
      <Navbar activeSection={activeSection} onNavigate={scrollToSection} />

      <main className="flex-1">
        {/* 1. Hero Section with Signature Interactive Medication Safety Analyzer */}
        <div id="hero">
          <HeroAnalyzer
            onStartCheck={() => scrollToSection('check-medicine')}
            onExploreGraph={() => scrollToSection('knowledge-graph')}
          />
        </div>

        {/* 2. Calm Understated Clinical Safety Advisory */}
        <SafetyNotice />

        {/* 3. Primary Product Experience: Check Your Medication */}
        <CheckMedicineSection
          onJumpToPatientMode={() => scrollToSection('patient-mode')}
        />

        {/* 4. Dedicated Interaction Checker (Dual & Polypharmacy Screen) */}
        <InteractionChecker />

        {/* 5. Signature Medication Intelligence Graph (Knowledge Graph) */}
        <InteractionGraph />

        {/* 6. Patient Mode: Understand Your Medicine (Multi-lingual & Audio Speech) */}
        <PatientMode />

        {/* 7. Healthcare Provider Workspace: Clinical Review Dashboard */}
        <DoctorDashboard />

        {/* 8. Built for Responsible Healthcare AI Principles */}
        <ResponsibleAI />
      </main>

      {/* 9. Restrained Clinical Footer with Disclaimers */}
      <Footer onNavigate={scrollToSection} />

      {/* Mobile Sticky Quick-Action Bar */}
      <div className="sm:hidden fixed bottom-4 inset-x-4 z-40">
        <button
          onClick={() => scrollToSection('check-medicine')}
          className="w-full py-3 px-4 bg-[#D89A28] active:bg-[#c48920] text-[#17201D] font-bold text-sm rounded-[10px] shadow-[0_4px_16px_rgba(23,53,47,0.18)] flex items-center justify-center gap-2 border border-[#17352F]/10 cursor-pointer"
        >
          <span>Check My Medicine</span>
          <ArrowUpRight className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
}
