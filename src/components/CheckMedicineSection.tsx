import React, { useState } from 'react';
import {
  FileText,
  Search,
  UploadCloud,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  RefreshCw,
} from 'lucide-react';
import { PrescriptionUploader } from './PrescriptionUploader';
import { MedicineSearch } from './MedicineSearch';
import { AnalysisProgress } from './AnalysisProgress';
import { SafetyReport } from './SafetyReport';
import { MASTER_MEDICATIONS, SAMPLE_PRESETS } from '../data/mockClinicalData';
import { Medicine } from '../types/medication';
import { analyzeMedications, AnalysisResult } from '../utils/interactionEngine';

interface CheckMedicineSectionProps {
  onJumpToPatientMode: () => void;
}

export const CheckMedicineSection: React.FC<CheckMedicineSectionProps> = ({
  onJumpToPatientMode,
}) => {
  const [activeTab, setActiveTab] = useState<'upload' | 'manual'>('upload');
  
  // Selected medications state (defaults to Cardiology Regimen: Warfarin, Ibuprofen, Clopidogrel, Omeprazole)
  const defaultMeds = MASTER_MEDICATIONS.filter((m) =>
    ['warfarin', 'ibuprofen', 'clopidogrel', 'omeprazole'].includes(m.id)
  );
  const [selectedMedications, setSelectedMedications] = useState<Medicine[]>(defaultMeds);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>('Cardio_Rx_Prescription_749201.pdf');
  const [selectedPresetId, setSelectedPresetId] = useState<string | null>('sample-cardio');

  // Analysis workflow states
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);

  // When prescription is selected (or preset chosen)
  const handlePrescriptionSelected = (fileName: string, presetId?: string) => {
    setUploadedFileName(fileName);
    setSelectedPresetId(presetId || null);

    if (presetId) {
      const preset = SAMPLE_PRESETS.find((p) => p.id === presetId);
      if (preset) {
        const meds = MASTER_MEDICATIONS.filter((m) => preset.meds.includes(m.id));
        setSelectedMedications(meds);
      }
    } else {
      // If user uploaded a custom file, keep current or load default multi-drug sample
      if (selectedMedications.length === 0) {
        setSelectedMedications(defaultMeds);
      }
    }
  };

  const handleClearUpload = () => {
    setUploadedFileName(null);
    setSelectedPresetId(null);
    setSelectedMedications([]);
    setAnalysisResult(null);
  };

  const handleAddMedication = (med: Medicine) => {
    if (!selectedMedications.some((m) => m.id === med.id)) {
      setSelectedMedications([...selectedMedications, med]);
      setAnalysisResult(null);
    }
  };

  const handleRemoveMedication = (id: string) => {
    setSelectedMedications(selectedMedications.filter((m) => m.id !== id));
    setAnalysisResult(null);
  };

  const handleRunAnalysis = () => {
    if (selectedMedications.length === 0) return;
    setIsAnalyzing(true);
    setAnalysisResult(null);
  };

  const handleAnalysisCompleted = () => {
    const medIds = selectedMedications.map((m) => m.id);
    const result = analyzeMedications(medIds);
    setAnalysisResult(result);
    setIsAnalyzing(false);

    // Smooth scroll down to safety report
    setTimeout(() => {
      const reportElem = document.getElementById('safety-report-container');
      if (reportElem) {
        reportElem.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 150);
  };

  const handleReset = () => {
    setAnalysisResult(null);
    setIsAnalyzing(false);
  };

  return (
    <section id="check-medicine" className="py-16 md:py-24 border-b border-[#D9E0DC]/60">
      <div className="max-w-[1200px] mx-auto px-6 md:px-8 space-y-8">
        
        {/* Section Header */}
        <div className="max-w-[760px] space-y-2">
          <div className="inline-flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#285C50]" />
            <span className="text-xs font-bold uppercase tracking-wider text-[#285C50] font-heading">
              Primary Product Experience
            </span>
          </div>
          <h2 className="font-heading font-extrabold text-3xl sm:text-4xl text-[#17352F] tracking-tight">
            Check Your Medication
          </h2>
          <p className="text-base text-[#5E6863]">
            Upload a prescription image or enter your medication list manually to screen for adverse interactions, enzyme competitions, and dietary factors.
          </p>
        </div>

        {/* Input Interface Container */}
        <div className="bg-[#FFFFFF] rounded-[18px] border border-[#D9E0DC] p-6 sm:p-8 shadow-[0_8px_24px_rgba(23,53,47,0.08)] space-y-6">
          
          {/* Two Mode Selector Tabs */}
          <div className="flex items-center p-1 bg-[#EEF3EF] rounded-[10px] max-w-md border border-[#D9E0DC]/80">
            <button
              onClick={() => setActiveTab('upload')}
              className={`flex-1 py-2.5 px-4 text-xs sm:text-sm font-semibold rounded-[8px] transition-all flex items-center justify-center gap-2 cursor-pointer ${
                activeTab === 'upload'
                  ? 'bg-[#FFFFFF] text-[#17352F] shadow-sm font-bold'
                  : 'text-[#5E6863] hover:text-[#17352F]'
              }`}
            >
              <UploadCloud className="w-4 h-4" />
              <span>Upload Prescription</span>
            </button>

            <button
              onClick={() => setActiveTab('manual')}
              className={`flex-1 py-2.5 px-4 text-xs sm:text-sm font-semibold rounded-[8px] transition-all flex items-center justify-center gap-2 cursor-pointer ${
                activeTab === 'manual'
                  ? 'bg-[#FFFFFF] text-[#17352F] shadow-sm font-bold'
                  : 'text-[#5E6863] hover:text-[#17352F]'
              }`}
            >
              <Search className="w-4 h-4" />
              <span>Enter Manually</span>
            </button>
          </div>

          {/* Mode 1: Prescription Upload */}
          {activeTab === 'upload' ? (
            <PrescriptionUploader
              onPrescriptionSelected={handlePrescriptionSelected}
              selectedPresetId={selectedPresetId}
              uploadedFileName={uploadedFileName}
              onClear={handleClearUpload}
            />
          ) : (
            /* Mode 2: Manual Medicine Search */
            <MedicineSearch
              selectedMedications={selectedMedications}
              onAddMedication={handleAddMedication}
              onRemoveMedication={handleRemoveMedication}
            />
          )}

          {/* Summary Strip & Primary Analyze Button */}
          <div className="pt-6 border-t border-[#D9E0DC] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="text-xs text-[#5E6863] space-y-0.5">
              <div className="font-semibold text-[#17352F]">
                {selectedMedications.length} Medication{selectedMedications.length === 1 ? '' : 's'} Selected for Screening
              </div>
              <p>
                {selectedMedications.map((m) => m.name).join(', ') || 'No medications loaded yet'}
              </p>
            </div>

            <button
              onClick={handleRunAnalysis}
              disabled={selectedMedications.length === 0 || isAnalyzing}
              className="px-8 py-3.5 bg-[#D89A28] hover:bg-[#c48920] active:bg-[#b07b1d] disabled:bg-[#D9E0DC] disabled:cursor-not-allowed text-[#17201D] font-bold text-sm rounded-[8px] transition-all shadow-[0_2px_8px_rgba(23,53,47,0.06)] hover:shadow-[0_6px_16px_rgba(23,53,47,0.12)] flex items-center justify-center gap-2 cursor-pointer shrink-0"
            >
              <span>Analyze Medication</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Staged Analysis Experience */}
        {isAnalyzing && (
          <AnalysisProgress onComplete={handleAnalysisCompleted} />
        )}

        {/* Safety Result Display */}
        {analysisResult && !isAnalyzing && (
          <SafetyReport
            analysis={analysisResult}
            onReset={handleReset}
            onJumpToPatientMode={onJumpToPatientMode}
          />
        )}

      </div>
    </section>
  );
};
