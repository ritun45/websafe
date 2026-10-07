import React, { useState } from 'react';
import {
  ArrowRightLeft,
  Plus,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  HelpCircle,
  BookOpen,
  Coffee,
  Info,
  ShieldCheck,
  Search,
} from 'lucide-react';
import { MASTER_MEDICATIONS, KNOWN_INTERACTIONS, FOOD_INTERACTIONS } from '../data/mockClinicalData';
import { DrugInteraction, FoodInteractionItem } from '../types/medication';
import { RiskBadge } from './RiskBadge';

export const InteractionChecker: React.FC = () => {
  const [medInputs, setMedInputs] = useState<string[]>(['Warfarin', 'Ibuprofen']);
  const [hasChecked, setHasChecked] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [foundInteractions, setFoundInteractions] = useState<DrugInteraction[]>([]);
  const [foundFoods, setFoundFoods] = useState<FoodInteractionItem[]>([]);

  const handleAddMedField = () => {
    if (medInputs.length < 6) {
      setMedInputs([...medInputs, '']);
      setHasChecked(false);
    }
  };

  const handleRemoveField = (index: number) => {
    if (medInputs.length > 2) {
      const updated = medInputs.filter((_, idx) => idx !== index);
      setMedInputs(updated);
      setHasChecked(false);
    }
  };

  const handleInputChange = (index: number, val: string) => {
    const updated = [...medInputs];
    updated[index] = val;
    setMedInputs(updated);
    setHasChecked(false);
  };

  const handleQuickPair = (pair: [string, string]) => {
    setMedInputs([pair[0], pair[1]]);
    setHasChecked(false);
  };

  const handleCheck = () => {
    setIsSearching(true);
    setHasChecked(false);

    setTimeout(() => {
      // Resolve inputs against database
      const matchedMeds = medInputs
        .map((input) => {
          const clean = input.trim().toLowerCase();
          return MASTER_MEDICATIONS.find(
            (m) =>
              m.id.toLowerCase() === clean ||
              m.name.toLowerCase().includes(clean) ||
              m.genericName.toLowerCase().includes(clean)
          );
        })
        .filter(Boolean);

      const interactions: DrugInteraction[] = [];

      for (let i = 0; i < matchedMeds.length; i++) {
        for (let j = i + 1; j < matchedMeds.length; j++) {
          const idA = matchedMeds[i]!.id;
          const idB = matchedMeds[j]!.id;

          const match = KNOWN_INTERACTIONS.find(
            (k) =>
              (k.drugAId === idA && k.drugBId === idB) ||
              (k.drugAId === idB && k.drugBId === idA)
          );

          if (match) {
            interactions.push(match);
          } else {
            // Check category synergy
            const catA = matchedMeds[i]!.category;
            const catB = matchedMeds[j]!.category;
            if (
              (catA === 'NSAID' && catB === 'Anticoagulant') ||
              (catB === 'NSAID' && catA === 'Anticoagulant')
            ) {
              interactions.push({
                id: `cross-${idA}-${idB}`,
                drugAId: idA,
                drugBId: idB,
                drugAName: matchedMeds[i]!.name,
                drugBName: matchedMeds[j]!.name,
                severity: 'high',
                severityLabel: 'HIGH RISK',
                title: 'NSAID + Anticoagulant Hemostatic Conflict',
                mechanism: 'Additive suppression of primary platelet plug formation and secondary coagulation cascade.',
                whyItMatters: 'Extremely high gastrointestinal bleeding risk.',
                clinicalAction: 'Avoid combination unless specifically directed with endoscopic gastroprotection.',
                evidenceSource: 'Clinical Guidelines',
                isDemo: true,
              });
            }
          }
        }
      }

      // Check food items
      const foods: FoodInteractionItem[] = [];
      for (const m of matchedMeds) {
        if (!m) continue;
        const matchingFoods = FOOD_INTERACTIONS.filter(
          (f) =>
            f.drugName.toLowerCase() === m.genericName.toLowerCase() ||
            f.drugName.toLowerCase() === m.name.toLowerCase()
        );
        foods.push(...matchingFoods);
      }

      setFoundInteractions(interactions);
      setFoundFoods(foods);
      setIsSearching(false);
      setHasChecked(true);
    }, 400);
  };

  return (
    <section id="interaction-checker" className="py-16 md:py-24 border-b border-[#D9E0DC]/60">
      <div className="max-w-[1200px] mx-auto px-6 md:px-8 space-y-8">
        
        {/* Section Header */}
        <div className="max-w-[720px] space-y-2">
          <div className="inline-flex items-center gap-2">
            <ArrowRightLeft className="w-4 h-4 text-[#285C50]" />
            <span className="text-xs font-bold uppercase tracking-wider text-[#285C50] font-heading">
              Direct Interaction Screening
            </span>
          </div>
          <h2 className="font-heading font-extrabold text-3xl sm:text-4xl text-[#17352F] tracking-tight">
            Check an Interaction
          </h2>
          <p className="text-base text-[#5E6863]">
            Screen two or more medications for hepatic enzyme competition, pharmacodynamic synergy, and food contraindications.
          </p>
        </div>

        {/* Input Panel Card */}
        <div className="bg-[#FFFFFF] rounded-[18px] border border-[#D9E0DC] p-6 sm:p-8 shadow-[0_8px_24px_rgba(23,53,47,0.08)] space-y-6">
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {medInputs.map((val, idx) => (
                <div key={idx} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-heading font-bold text-[#17352F]">
                    <span>Medicine {idx + 1}</span>
                    {medInputs.length > 2 && (
                      <button
                        onClick={() => handleRemoveField(idx)}
                        className="text-[#B6423A] hover:underline flex items-center gap-1 text-[11px]"
                      >
                        <Trash2 className="w-3 h-3" /> Remove
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <input
                      type="text"
                      value={val}
                      onChange={(e) => handleInputChange(idx, e.target.value)}
                      placeholder={idx === 0 ? 'e.g. Warfarin' : idx === 1 ? 'e.g. Ibuprofen' : 'e.g. Omeprazole'}
                      className="w-full px-4 py-3 bg-[#FFFFFF] border border-[#D9E0DC] rounded-[8px] text-sm text-[#17201D] focus:outline-none focus:ring-2 focus:ring-[#285C50] focus:border-transparent transition-all"
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Add Another Medicine */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <button
                onClick={handleAddMedField}
                disabled={medInputs.length >= 6}
                className="text-xs font-bold text-[#285C50] hover:text-[#17352F] inline-flex items-center gap-1.5 px-3 py-2 bg-[#EEF3EF] rounded-[6px] border border-[#D9E0DC] transition-colors cursor-pointer disabled:opacity-50"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ Add another medicine (up to 6)</span>
              </button>

              <div className="flex items-center gap-2 text-xs text-[#5E6863]">
                <span className="font-semibold text-[#17352F]">Quick test pairs:</span>
                <button
                  onClick={() => handleQuickPair(['Warfarin', 'Ibuprofen'])}
                  className="hover:underline text-[#285C50]"
                >
                  Warfarin + Ibuprofen
                </button>
                <span>•</span>
                <button
                  onClick={() => handleQuickPair(['Clopidogrel', 'Omeprazole'])}
                  className="hover:underline text-[#285C50]"
                >
                  Clopidogrel + Omeprazole
                </button>
                <span>•</span>
                <button
                  onClick={() => handleQuickPair(['Lisinopril', 'Spironolactone'])}
                  className="hover:underline text-[#285C50]"
                >
                  Lisinopril + Spironolactone
                </button>
              </div>
            </div>
          </div>

          {/* Primary Action Button */}
          <div className="pt-4 border-t border-[#D9E0DC] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <button
              onClick={handleCheck}
              disabled={isSearching || !medInputs[0] || !medInputs[1]}
              className="px-6 py-3.5 bg-[#D89A28] hover:bg-[#c48920] active:bg-[#b07b1d] disabled:bg-[#D9E0DC] disabled:cursor-not-allowed text-[#17201D] font-bold text-sm rounded-[8px] transition-all shadow-[0_2px_8px_rgba(23,53,47,0.06)] flex items-center justify-center gap-2 cursor-pointer"
            >
              {isSearching ? (
                <>
                  <span className="w-4 h-4 border-2 border-[#17201D] border-t-transparent rounded-full animate-spin" />
                  <span>Cross-referencing database...</span>
                </>
              ) : (
                <>
                  <span>Check Interaction</span>
                  <ArrowRightLeft className="w-4 h-4" />
                </>
              )}
            </button>

            <p className="text-xs text-[#5E6863]">
              Grounded in FDA alerts and clinical pharmacology monographs.
            </p>
          </div>
        </div>

        {/* Results Render In-Place */}
        {hasChecked && (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-[#D9E0DC]">
              <h3 className="font-heading font-extrabold text-xl text-[#17352F]">
                Interaction Results for{' '}
                <span className="text-[#285C50]">
                  {medInputs.filter(Boolean).join(' + ')}
                </span>
              </h3>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-[#5E6863]">
                  {foundInteractions.length} interaction(s) found
                </span>
                <span className="text-[10px] uppercase font-bold bg-[#EEF3EF] px-2 py-0.5 rounded text-[#285C50]">
                  Grounded Formulary
                </span>
              </div>
            </div>

            {/* Pairwise Cross-Screening Matrix Grid */}
            {medInputs.filter(Boolean).length >= 2 && (
              <div className="p-4 bg-[#FFFFFF] rounded-[12px] border border-[#D9E0DC] space-y-2">
                <div className="text-xs font-bold uppercase tracking-wider text-[#5E6863] font-heading flex items-center justify-between">
                  <span>Pairwise Cross-Compatibility Matrix</span>
                  <span className="text-[10px] font-mono text-[#285C50]">Rapid Safety Scan</span>
                </div>

                <div className="overflow-x-auto">
                  <div className="inline-flex gap-2 min-w-full">
                    {medInputs.filter(Boolean).map((nameA, i) =>
                      medInputs.filter(Boolean).slice(i + 1).map((nameB, j) => {
                        const hasHigh = foundInteractions.some(
                          (inter) =>
                            inter.severity === 'high' &&
                            ((inter.drugAName.toLowerCase().includes(nameA.toLowerCase()) && inter.drugBName.toLowerCase().includes(nameB.toLowerCase())) ||
                             (inter.drugBName.toLowerCase().includes(nameA.toLowerCase()) && inter.drugAName.toLowerCase().includes(nameB.toLowerCase())))
                        );
                        const hasMod = foundInteractions.some(
                          (inter) =>
                            inter.severity === 'moderate' &&
                            ((inter.drugAName.toLowerCase().includes(nameA.toLowerCase()) && inter.drugBName.toLowerCase().includes(nameB.toLowerCase())) ||
                             (inter.drugBName.toLowerCase().includes(nameA.toLowerCase()) && inter.drugAName.toLowerCase().includes(nameB.toLowerCase())))
                        );

                        return (
                          <div
                            key={`${i}-${j}`}
                            className={`p-2.5 rounded-[8px] border text-xs flex-1 min-w-[140px] space-y-1 ${
                              hasHigh
                                ? 'bg-[#B6423A]/10 border-[#B6423A]/30 text-[#B6423A]'
                                : hasMod
                                ? 'bg-[#C9792B]/10 border-[#C9792B]/30 text-[#C9792B]'
                                : 'bg-[#3F8068]/10 border-[#3F8068]/30 text-[#3F8068]'
                            }`}
                          >
                            <div className="font-bold truncate">{nameA} × {nameB}</div>
                            <div className="text-[10px] font-semibold flex items-center gap-1">
                              {hasHigh ? '🔴 High Risk Conflict' : hasMod ? '🟠 Moderate Caution' : '🟢 Compatible Pair'}
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              </div>
            )}

            {foundInteractions.length > 0 ? (
              <div className="space-y-4">
                {foundInteractions.map((item) => (
                  <div
                    key={item.id}
                    className="bg-[#FFFFFF] border border-[#D9E0DC] rounded-[14px] p-6 shadow-sm space-y-4"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-[#D9E0DC]/80">
                      <div className="flex items-center gap-2">
                        <RiskBadge level={item.severity} label={item.severityLabel} />
                        <span className="font-heading font-bold text-base text-[#17352F]">
                          {item.drugAName} + {item.drugBName}
                        </span>
                      </div>
                      <span className="text-xs text-[#5E6863]">
                        {item.evidenceSource}
                      </span>
                    </div>

                    <div>
                      <h4 className="font-heading font-bold text-sm text-[#17352F]">
                        {item.title}
                      </h4>
                      <p className="text-xs text-[#5E6863] mt-1 font-mono">
                        Mechanism: {item.mechanism}
                      </p>
                    </div>

                    <div className="bg-[#EEF3EF] p-4 rounded-[10px] space-y-1">
                      <div className="text-xs font-bold text-[#17352F] uppercase tracking-wider font-heading flex items-center gap-1.5">
                        <HelpCircle className="w-3.5 h-3.5 text-[#285C50]" />
                        <span>Why this matters</span>
                      </div>
                      <p className="text-sm text-[#17201D] leading-relaxed">
                        {item.whyItMatters}
                      </p>
                    </div>

                    <div className="bg-[#FFFFFF] border border-[#D9E0DC] p-4 rounded-[10px] space-y-1">
                      <div className="text-xs font-bold text-[#285C50] uppercase tracking-wider font-heading flex items-center gap-1.5">
                        <ShieldCheck className="w-3.5 h-3.5 text-[#3F8068]" />
                        <span>Professional-review guidance</span>
                      </div>
                      <p className="text-sm text-[#17201D] font-medium leading-relaxed">
                        {item.clinicalAction}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-[#FFFFFF] border border-[#3F8068]/30 rounded-[14px] p-8 text-center space-y-2">
                <div className="w-12 h-12 rounded-full bg-[#3F8068]/10 text-[#3F8068] mx-auto flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h4 className="font-heading font-bold text-lg text-[#17352F]">
                  No Major Clinical Interaction Documented
                </h4>
                <p className="text-sm text-[#5E6863] max-w-md mx-auto">
                  No critical direct interaction flagged between these specific medication names in this formulary. Always report all OTC vitamins and prescriptions to your physician.
                </p>
              </div>
            )}

            {/* Food considerations if any */}
            {foundFoods.length > 0 && (
              <div className="bg-[#FFFFFF] border border-[#D9E0DC] rounded-[14px] p-6 space-y-3">
                <div className="flex items-center gap-2">
                  <Coffee className="w-4 h-4 text-[#285C50]" />
                  <h4 className="font-heading font-bold text-sm text-[#17352F]">
                    Food & Nutrient Considerations for Checked Medicines
                  </h4>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  {foundFoods.map((f) => (
                    <div key={f.id} className="p-3 bg-[#EEF3EF] rounded-[8px] space-y-1">
                      <div className="font-bold text-[#17352F]">
                        {f.drugName} + {f.foodName}
                      </div>
                      <p className="text-[#5E6863]">{f.summary}</p>
                      <p className="text-[#285C50] font-medium">{f.recommendation}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
};
