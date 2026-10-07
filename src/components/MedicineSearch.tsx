import React, { useState, useRef, useEffect } from 'react';
import { Search, Plus, X, Pill, Shield, AlertCircle, Sparkles } from 'lucide-react';
import { MASTER_MEDICATIONS } from '../data/mockClinicalData';
import { Medicine } from '../types/medication';

interface MedicineSearchProps {
  selectedMedications: Medicine[];
  onAddMedication: (med: Medicine) => void;
  onRemoveMedication: (id: string) => void;
}

export const MedicineSearch: React.FC<MedicineSearchProps> = ({
  selectedMedications,
  onAddMedication,
  onRemoveMedication,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredMedicines = MASTER_MEDICATIONS.filter((med) => {
    const term = searchTerm.toLowerCase().trim();
    if (!term) return false;
    return (
      med.name.toLowerCase().includes(term) ||
      med.genericName.toLowerCase().includes(term) ||
      med.category.toLowerCase().includes(term) ||
      med.brandNames?.some((b) => b.toLowerCase().includes(term))
    );
  }).filter((med) => !selectedMedications.some((sel) => sel.id === med.id));

  const handleSelectMedicine = (med: Medicine) => {
    onAddMedication(med);
    setSearchTerm('');
    setIsDropdownOpen(false);
  };

  const handleAddCustom = () => {
    if (!searchTerm.trim()) return;
    const customMed: Medicine = {
      id: `custom-${Date.now()}`,
      name: searchTerm.trim(),
      genericName: searchTerm.trim(),
      dosage: 'Standard Dosage',
      category: 'General',
      description: 'Custom entry added for interaction screening.',
      commonIndications: ['Prescribed Indication'],
    };
    onAddMedication(customMed);
    setSearchTerm('');
    setIsDropdownOpen(false);
  };

  return (
    <div className="space-y-4">
      {/* Search Bar with Autocomplete Dropdown */}
      <div className="relative" ref={dropdownRef}>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#5E6863]" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setIsDropdownOpen(true);
              }}
              onFocus={() => setIsDropdownOpen(true)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  if (filteredMedicines.length > 0) {
                    handleSelectMedicine(filteredMedicines[0]);
                  } else {
                    handleAddCustom();
                  }
                }
              }}
              placeholder="Search medicine name (e.g., Warfarin, Ibuprofen, Lisinopril)..."
              className="w-full pl-10 pr-4 py-3 bg-[#FFFFFF] border border-[#D9E0DC] rounded-[8px] text-sm text-[#17201D] placeholder-[#5E6863]/70 focus:outline-none focus:ring-2 focus:ring-[#285C50] focus:border-transparent transition-all shadow-[0_2px_8px_rgba(23,53,47,0.04)]"
            />
          </div>

          <button
            onClick={handleAddCustom}
            disabled={!searchTerm.trim()}
            className="px-4 py-3 bg-[#17352F] hover:bg-[#285C50] disabled:bg-[#D9E0DC] disabled:cursor-not-allowed text-[#F7F5EF] text-sm font-semibold rounded-[8px] flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Add</span>
          </button>
        </div>

        {/* Autocomplete Results Panel */}
        {isDropdownOpen && searchTerm.trim() && (
          <div className="absolute left-0 right-0 top-full mt-1.5 bg-[#FFFFFF] border border-[#D9E0DC] rounded-[10px] shadow-[0_8px_24px_rgba(23,53,47,0.12)] z-30 max-h-64 overflow-y-auto divide-y divide-[#D9E0DC]/60">
            {filteredMedicines.length > 0 ? (
              filteredMedicines.map((med) => (
                <button
                  key={med.id}
                  onClick={() => handleSelectMedicine(med)}
                  className="w-full text-left p-3 hover:bg-[#EEF3EF] flex items-center justify-between transition-colors group"
                >
                  <div>
                    <div className="font-heading font-bold text-sm text-[#17352F] group-hover:text-[#285C50]">
                      {med.name}
                    </div>
                    <div className="text-xs text-[#5E6863] flex items-center gap-2 mt-0.5">
                      <span>{med.dosage}</span>
                      <span aria-hidden="true">•</span>
                      <span className="font-mono text-[11px] text-[#285C50]">{med.category}</span>
                      {med.brandNames && (
                        <>
                          <span aria-hidden="true">•</span>
                          <span className="text-[11px] text-[#5E6863]/80">Brand: {med.brandNames.join(', ')}</span>
                        </>
                      )}
                    </div>
                  </div>
                  <span className="text-xs font-semibold text-[#285C50] bg-[#EEF3EF] group-hover:bg-[#FFFFFF] px-2 py-1 rounded-[6px]">
                    + Select
                  </span>
                </button>
              ))
            ) : (
              <div className="p-4 text-center">
                <p className="text-sm text-[#5E6863]">
                  No exact match found in verified formulary for "<span className="font-semibold text-[#17352F]">{searchTerm}</span>".
                </p>
                <button
                  onClick={handleAddCustom}
                  className="mt-2 text-xs font-bold text-[#285C50] hover:text-[#17352F] underline inline-flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" /> Add "{searchTerm}" as custom medication
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Selected Medicine Chips */}
      <div>
        <div className="flex items-center justify-between text-xs font-semibold text-[#5E6863] mb-2">
          <span>Active Medications for Screening ({selectedMedications.length})</span>
          {selectedMedications.length === 0 && (
            <span className="text-[#B6423A] font-medium">Add at least 2 medicines to test interactions</span>
          )}
        </div>

        {selectedMedications.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {selectedMedications.map((med) => (
              <div
                key={med.id}
                className="bg-[#FFFFFF] border border-[#285C50]/30 shadow-sm rounded-[8px] pl-3 pr-2 py-2 flex items-center gap-2.5 transition-all hover:border-[#285C50]"
              >
                <div className="w-2 h-2 rounded-full bg-[#285C50]" />
                <div>
                  <div className="font-heading font-bold text-xs text-[#17352F]">
                    {med.name}
                  </div>
                  <div className="text-[11px] text-[#5E6863]">
                    {med.dosage} <span className="text-[#285C50] font-medium">• {med.category}</span>
                  </div>
                </div>

                <button
                  onClick={() => onRemoveMedication(med.id)}
                  className="p-1 text-[#5E6863] hover:text-[#B6423A] hover:bg-[#B6423A]/10 rounded-[4px] ml-1 transition-colors"
                  aria-label={`Remove ${med.name}`}
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-4 bg-[#EEF3EF]/50 border border-dashed border-[#D9E0DC] rounded-[10px] text-center text-xs text-[#5E6863]">
            No medications added yet. Use the search field above or choose from common medications below.
          </div>
        )}
      </div>

      {/* Quick Add Common Drugs pills */}
      <div className="pt-2 border-t border-[#D9E0DC]/60">
        <div className="text-[11px] font-semibold text-[#5E6863] mb-2 uppercase tracking-wider flex items-center gap-1.5">
          <Pill className="w-3.5 h-3.5 text-[#285C50]" />
          <span>Quick Select Formulary Drugs:</span>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {['Warfarin', 'Ibuprofen', 'Clopidogrel', 'Omeprazole', 'Lisinopril', 'Spironolactone', 'Sertraline', 'Tramadol', 'Atorvastatin', "St. John's Wort"].map((drugName) => {
            const med = MASTER_MEDICATIONS.find(
              (m) => m.name.toLowerCase().includes(drugName.toLowerCase()) || m.genericName.toLowerCase().includes(drugName.toLowerCase())
            );
            const isSelected = med && selectedMedications.some((s) => s.id === med.id);
            return (
              <button
                key={drugName}
                onClick={() => med && !isSelected && onAddMedication(med)}
                disabled={isSelected}
                className={`text-xs px-2.5 py-1 rounded-[6px] border transition-all ${
                  isSelected
                    ? 'bg-[#EEF3EF] border-[#D9E0DC] text-[#5E6863] opacity-60 cursor-default'
                    : 'bg-[#FFFFFF] border-[#D9E0DC] text-[#17352F] hover:border-[#285C50] hover:bg-[#EEF3EF] cursor-pointer'
                }`}
              >
                + {drugName}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
