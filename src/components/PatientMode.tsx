import React, { useState, useEffect } from 'react';
import {
  Volume2,
  VolumeX,
  Languages,
  Heart,
  MessageCircleQuestion,
  HelpCircle,
  ShieldCheck,
  Check,
  Sparkles,
} from 'lucide-react';
import { PATIENT_EXPLANATIONS } from '../data/mockClinicalData';
import { PatientExplanationData } from '../types/medication';

export const PatientMode: React.FC = () => {
  const [selectedLanguage, setSelectedLanguage] = useState<'en' | 'hi' | 'bn' | 'es'>('en');
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(true);

  const currentContent: PatientExplanationData =
    PATIENT_EXPLANATIONS[selectedLanguage] || PATIENT_EXPLANATIONS.en;

  useEffect(() => {
    if (!('speechSynthesis' in window)) {
      setSpeechSupported(false);
    }

    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Cancel speech when language changes
  useEffect(() => {
    if ('speechSynthesis' in window && isPlayingAudio) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
    }
  }, [selectedLanguage]);

  const handleToggleSpeech = () => {
    if (!('speechSynthesis' in window)) return;

    if (isPlayingAudio) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
    } else {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(currentContent.speechText);

      // Set voice language code
      const langCodes: Record<string, string> = {
        en: 'en-US',
        hi: 'hi-IN',
        bn: 'bn-IN',
        es: 'es-ES',
      };
      utterance.lang = langCodes[selectedLanguage] || 'en-US';
      utterance.rate = 0.95;

      utterance.onend = () => {
        setIsPlayingAudio(false);
      };

      utterance.onerror = () => {
        setIsPlayingAudio(false);
      };

      window.speechSynthesis.speak(utterance);
      setIsPlayingAudio(true);
    }
  };

  const languages = [
    { code: 'en', label: 'English', native: 'English' },
    { code: 'hi', label: 'Hindi', native: 'हिन्दी' },
    { code: 'bn', label: 'Bengali', native: 'বাংলা' },
    { code: 'es', label: 'Spanish', native: 'Español' },
  ];

  return (
    <section id="patient-mode" className="py-16 md:py-24 border-b border-[#D9E0DC]/60 bg-[#EEF3EF]/30">
      <div className="max-w-[1200px] mx-auto px-6 md:px-8 space-y-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="max-w-[720px] space-y-2">
            <div className="inline-flex items-center gap-2">
              <Heart className="w-4 h-4 text-[#3F8068]" />
              <span className="text-xs font-bold uppercase tracking-wider text-[#285C50] font-heading">
                Patient Mode
              </span>
            </div>
            <h2 className="font-heading font-extrabold text-3xl sm:text-4xl text-[#17352F] tracking-tight">
              Understand Your Medicine
            </h2>
            <p className="text-base text-[#5E6863]">
              Plain-language explanations designed for patients and caregivers — free from intimidating medical jargon.
            </p>
          </div>

          {/* Language Selector + Audio Controls */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Language buttons */}
            <div className="flex items-center p-1 bg-[#FFFFFF] border border-[#D9E0DC] rounded-[10px] shadow-sm">
              <Languages className="w-4 h-4 text-[#5E6863] ml-2 mr-1" />
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => setSelectedLanguage(lang.code as any)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-[6px] transition-colors cursor-pointer ${
                    selectedLanguage === lang.code
                      ? 'bg-[#17352F] text-[#F7F5EF] shadow-sm'
                      : 'text-[#5E6863] hover:text-[#17352F] hover:bg-[#EEF3EF]'
                  }`}
                >
                  {lang.native}
                </button>
              ))}
            </div>

            {/* Audio Read-Aloud Button */}
            {speechSupported && (
              <button
                onClick={handleToggleSpeech}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-[8px] text-xs font-bold transition-all shadow-sm cursor-pointer ${
                  isPlayingAudio
                    ? 'bg-[#B6423A] text-[#FFFFFF] animate-pulse'
                    : 'bg-[#D89A28] hover:bg-[#c48920] text-[#17201D]'
                }`}
                aria-label={isPlayingAudio ? 'Stop audio explanation' : 'Listen to audio explanation'}
              >
                {isPlayingAudio ? (
                  <>
                    <VolumeX className="w-4 h-4" />
                    <span>Stop Playing...</span>
                  </>
                ) : (
                  <>
                    <Volume2 className="w-4 h-4" />
                    <span>🔊 Listen</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        {/* Plain Language Card Container */}
        <div className="bg-[#FFFFFF] rounded-[18px] border border-[#D9E0DC] p-6 sm:p-10 shadow-[0_8px_24px_rgba(23,53,47,0.08)] space-y-8">
          
          {/* Header banner */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-[#D9E0DC] gap-2">
            <div>
              <span className="text-xs font-bold text-[#285C50] uppercase tracking-wider">
                {currentContent.title}
              </span>
              <h3 className="font-heading font-extrabold text-2xl text-[#17352F] mt-1">
                Your Prescription Guide
              </h3>
            </div>

            <div className="flex items-center gap-2 text-xs text-[#5E6863]">
              <span className="inline-block w-2 h-2 rounded-full bg-[#3F8068]" />
              <span>Grounded in patient health literacy standards</span>
            </div>
          </div>

          {/* Three Core Questions in Plain English / Selected Language */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* 1. What was detected? */}
            <div className="bg-[#EEF3EF]/60 rounded-[14px] p-6 border border-[#D9E0DC] space-y-3 flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-[8px] bg-[#17352F] text-[#D89A28] flex items-center justify-center mb-3">
                  <span className="font-heading font-extrabold text-base">1</span>
                </div>
                <h4 className="font-heading font-bold text-lg text-[#17352F]">
                  What was detected?
                </h4>
                <p className="text-sm text-[#17201D] mt-2 leading-relaxed">
                  {currentContent.whatDetected}
                </p>
              </div>
              <div className="pt-3 border-t border-[#D9E0DC]/70 text-[11px] text-[#5E6863]">
                Identified from your medication record
              </div>
            </div>

            {/* 2. Why might it matter? */}
            <div className="bg-[#FFFFFF] rounded-[14px] p-6 border-2 border-[#C9792B]/40 shadow-sm space-y-3 flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-[8px] bg-[#C9792B] text-[#FFFFFF] flex items-center justify-center mb-3">
                  <span className="font-heading font-extrabold text-base">2</span>
                </div>
                <h4 className="font-heading font-bold text-lg text-[#17352F]">
                  Why might it matter?
                </h4>
                <p className="text-sm text-[#17201D] mt-2 leading-relaxed">
                  {currentContent.whyItMatters}
                </p>
              </div>
              <div className="pt-3 border-t border-[#D9E0DC]/70 text-[11px] text-[#C9792B] font-semibold">
                Critical safety precaution to watch
              </div>
            </div>

            {/* 3. What should you discuss with a professional? */}
            <div className="bg-[#EEF3EF]/60 rounded-[14px] p-6 border border-[#D9E0DC] space-y-3 flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-[8px] bg-[#285C50] text-[#FFFFFF] flex items-center justify-center mb-3">
                  <span className="font-heading font-extrabold text-base">3</span>
                </div>
                <h4 className="font-heading font-bold text-lg text-[#17352F]">
                  What should you discuss?
                </h4>
                <p className="text-sm text-[#17201D] mt-2 leading-relaxed">
                  {currentContent.whatToDiscuss}
                </p>
              </div>
              <div className="pt-3 border-t border-[#D9E0DC]/70 text-[11px] text-[#285C50] font-semibold">
                Action items for your next doctor/pharmacy visit
              </div>
            </div>

          </div>

          {/* Understated Reminder */}
          <div className="p-4 bg-[#FFFFFF] rounded-[12px] border border-[#D9E0DC] flex items-center justify-between text-xs text-[#5E6863]">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#3F8068]" />
              <span>
                Do not stop taking any prescribed medication on your own without calling your healthcare team first.
              </span>
            </div>
            <span className="font-bold text-[#17352F] hidden sm:inline">
              Patient Care Guidance
            </span>
          </div>

        </div>
      </div>
    </section>
  );
};
