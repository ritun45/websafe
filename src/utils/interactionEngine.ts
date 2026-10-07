import { MASTER_MEDICATIONS, KNOWN_INTERACTIONS, FOOD_INTERACTIONS } from '../data/mockClinicalData';
import { Medicine, DrugInteraction, FoodInteractionItem, RiskLevel } from '../types/medication';

export interface AnalysisResult {
  analyzedMedications: Medicine[];
  interactions: DrugInteraction[];
  foodInteractions: FoodInteractionItem[];
  riskCounts: {
    high: number;
    moderate: number;
    low: number;
    info: number;
    total: number;
  };
  overallRisk: RiskLevel;
  polypharmacyScore: number; // 0-100 index based on count and risk density
  cypOverlapCount: number;
}

export function analyzeMedications(medicationIdsOrNames: string[]): AnalysisResult {
  // Normalize and resolve medications
  const matchedMeds: Medicine[] = [];
  const processedIds = new Set<string>();

  for (const item of medicationIdsOrNames) {
    const clean = item.trim().toLowerCase();
    const found = MASTER_MEDICATIONS.find(
      (m) =>
        m.id.toLowerCase() === clean ||
        m.name.toLowerCase().includes(clean) ||
        m.genericName.toLowerCase().includes(clean)
    );

    if (found && !processedIds.has(found.id)) {
      matchedMeds.push(found);
      processedIds.add(found.id);
    } else if (!found && clean.length > 0) {
      // Create custom temporary medicine entry
      const customId = `custom-${clean.replace(/\s+/g, '-')}`;
      if (!processedIds.has(customId)) {
        matchedMeds.push({
          id: customId,
          name: item,
          genericName: item,
          dosage: 'Standard Dosage',
          category: 'General',
          description: 'Medication added for interaction screening.',
          commonIndications: ['Patient Prescribed Indication'],
        });
        processedIds.add(customId);
      }
    }
  }

  // Find interactions between any pairs
  const foundInteractions: DrugInteraction[] = [];
  const matchedIds = matchedMeds.map((m) => m.id);

  for (let i = 0; i < matchedMeds.length; i++) {
    for (let j = i + 1; j < matchedMeds.length; j++) {
      const idA = matchedMeds[i].id;
      const idB = matchedMeds[j].id;

      const direct = KNOWN_INTERACTIONS.find(
        (inter) =>
          (inter.drugAId === idA && inter.drugBId === idB) ||
          (inter.drugAId === idB && inter.drugBId === idA)
      );

      if (direct) {
        foundInteractions.push(direct);
      } else {
        // Check if NSAID + Anticoagulant or other class rule
        const catA = matchedMeds[i].category;
        const catB = matchedMeds[j].category;
        if (
          (catA === 'NSAID' && catB === 'Anticoagulant') ||
          (catB === 'NSAID' && catA === 'Anticoagulant')
        ) {
          foundInteractions.push({
            id: `class-${idA}-${idB}`,
            drugAId: idA,
            drugBId: idB,
            drugAName: matchedMeds[i].name,
            drugBName: matchedMeds[j].name,
            severity: 'high',
            severityLabel: 'HIGH RISK',
            title: 'Synergistic Hemostatic Impairment (Class Effect)',
            mechanism: 'NSAID-induced mucosal irritation and platelet dysfunction combined with systemic anticoagulation greatly elevates hemorrhagic potential.',
            whyItMatters: 'Substantially elevated bleeding incidence. Concomitant use requires clinical surveillance and gastroprotection.',
            clinicalAction: 'Evaluate alternative pain therapy or co-prescribe gastroprotective agents under clinician oversight.',
            evidenceSource: 'Clinical Pharmacology Guidelines',
            isDemo: true,
          });
        }
      }
    }
  }

  // Find food interactions
  const matchedFoods: FoodInteractionItem[] = [];
  for (const med of matchedMeds) {
    const medFoods = FOOD_INTERACTIONS.filter(
      (f) =>
        f.drugName.toLowerCase() === med.genericName.toLowerCase() ||
        f.drugName.toLowerCase() === med.name.toLowerCase()
    );
    matchedFoods.push(...medFoods);
  }

  // Calculate risk statistics
  const highCount = foundInteractions.filter((i) => i.severity === 'high').length;
  const modCount = foundInteractions.filter((i) => i.severity === 'moderate').length;
  const lowCount = foundInteractions.filter((i) => i.severity === 'low').length;
  const infoCount = matchedFoods.length;

  let overallRisk: RiskLevel = 'low';
  if (highCount > 0) {
    overallRisk = 'high';
  } else if (modCount > 0) {
    overallRisk = 'moderate';
  } else if (lowCount > 0 || infoCount > 0) {
    overallRisk = 'info';
  }

  // Polypharmacy Score (0 to 100)
  // Based on number of concurrent meds (>=5 is polypharmacy in geriatrics) + risk severity weight
  const polypharmacyScore = Math.min(
    100,
    Math.round(matchedMeds.length * 12 + highCount * 30 + modCount * 15 + matchedFoods.length * 5)
  );

  // CYP Pathway overlaps
  const cypSet = new Set<string>();
  let cypOverlapCount = 0;
  for (const m of matchedMeds) {
    if (m.cypPathways) {
      for (const p of m.cypPathways) {
        if (cypSet.has(p)) {
          cypOverlapCount++;
        }
        cypSet.add(p);
      }
    }
  }

  return {
    analyzedMedications: matchedMeds,
    interactions: foundInteractions,
    foodInteractions: matchedFoods,
    riskCounts: {
      high: highCount,
      moderate: modCount,
      low: lowCount,
      info: infoCount,
      total: foundInteractions.length,
    },
    overallRisk,
    polypharmacyScore,
    cypOverlapCount,
  };
}
