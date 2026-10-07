import React, { useState, useRef } from 'react';
import { UploadCloud, FileText, Camera, Check, X, AlertCircle, Sparkles } from 'lucide-react';
import { SAMPLE_PRESETS } from '../data/mockClinicalData';

interface PrescriptionUploaderProps {
  onPrescriptionSelected: (fileName: string, presetId?: string) => void;
  selectedPresetId?: string | null;
  uploadedFileName?: string | null;
  onClear: () => void;
}

export const PrescriptionUploader: React.FC<PrescriptionUploaderProps> = ({
  onPrescriptionSelected,
  selectedPresetId,
  uploadedFileName,
  onClear,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      onPrescriptionSelected(file.name);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      onPrescriptionSelected(file.name);
    }
  };

  return (
    <div className="space-y-4">
      {/* Upload Zone */}
      {!uploadedFileName ? (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-[14px] p-6 sm:p-8 text-center transition-all cursor-pointer bg-[#FFFFFF] ${
            isDragging
              ? 'border-[#285C50] bg-[#EEF3EF]'
              : 'border-[#D9E0DC] hover:border-[#285C50]/60 hover:bg-[#F7F5EF]/60'
          }`}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              fileInputRef.current?.click();
            }
          }}
          aria-label="Upload prescription document"
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileInputChange}
            accept=".jpg,.jpeg,.png,.pdf"
            className="hidden"
          />

          <div className="w-12 h-12 rounded-[10px] bg-[#EEF3EF] text-[#285C50] mx-auto flex items-center justify-center mb-3">
            <UploadCloud className="w-6 h-6" strokeWidth={1.75} />
          </div>

          <h4 className="font-heading font-bold text-base text-[#17352F]">
            Drop your prescription here
          </h4>

          <p className="text-sm text-[#5E6863] mt-1">
            or <span className="text-[#285C50] font-semibold underline">choose a file</span> from your device
          </p>

          <div className="mt-3 flex flex-wrap items-center justify-center gap-2 text-xs text-[#5E6863]">
            <span className="bg-[#EEF3EF] px-2 py-0.5 rounded-[4px] font-mono">JPG</span>
            <span className="bg-[#EEF3EF] px-2 py-0.5 rounded-[4px] font-mono">PNG</span>
            <span className="bg-[#EEF3EF] px-2 py-0.5 rounded-[4px] font-mono">PDF</span>
            <span className="text-[#D9E0DC]" aria-hidden="true">•</span>
            <span>Up to 15 MB</span>
          </div>

          {/* Mobile Camera Option prompt */}
          <div className="mt-4 pt-3 border-t border-[#D9E0DC]/60 flex items-center justify-center gap-1.5 text-xs text-[#285C50] font-medium sm:hidden">
            <Camera className="w-4 h-4" />
            <span>Take photo with mobile camera</span>
          </div>
        </div>
      ) : (
        /* Uploaded File Selected Card */
        <div className="bg-[#FFFFFF] rounded-[14px] border border-[#285C50]/40 p-4 shadow-sm flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-[8px] bg-[#EEF3EF] text-[#285C50] flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-heading font-bold text-sm text-[#17352F]">
                  {uploadedFileName}
                </span>
                <span className="text-[11px] bg-[#3F8068]/10 text-[#3F8068] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                  <Check className="w-3 h-3" /> Ready for Analysis
                </span>
              </div>
              <p className="text-xs text-[#5E6863] mt-0.5">
                {selectedPresetId
                  ? 'Sample clinical prescription profile loaded'
                  : 'Document loaded • Ready for OCR and interaction screening'}
              </p>
            </div>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onClear();
            }}
            className="p-1.5 text-[#5E6863] hover:text-[#B6423A] hover:bg-[#B6423A]/10 rounded-[6px] transition-colors"
            title="Remove document"
            aria-label="Remove uploaded prescription"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Preset Prescription Selector (Instant test drive for competition evaluation) */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-[#5E6863]">
          <span className="font-semibold uppercase tracking-wider text-[11px] text-[#285C50] flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-[#D89A28]" />
            Or test instant clinical presets:
          </span>
          <span className="text-[11px]">Click to auto-populate</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {SAMPLE_PRESETS.map((preset) => {
            const isSelected = selectedPresetId === preset.id;
            return (
              <button
                key={preset.id}
                onClick={() => onPrescriptionSelected(`Rx_${preset.id}.pdf`, preset.id)}
                className={`text-left p-3 rounded-[10px] border transition-all ${
                  isSelected
                    ? 'border-[#285C50] bg-[#EEF3EF] shadow-sm'
                    : 'border-[#D9E0DC] bg-[#FFFFFF] hover:border-[#285C50]/50 hover:bg-[#F7F5EF]'
                }`}
              >
                <div className="font-heading font-bold text-xs text-[#17352F] flex items-center justify-between">
                  <span>{preset.name}</span>
                  {isSelected && <Check className="w-3.5 h-3.5 text-[#285C50]" />}
                </div>
                <div className="text-[11px] text-[#5E6863] mt-1 font-mono">
                  {preset.subtitle}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
