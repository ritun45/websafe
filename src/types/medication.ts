/**
 * WebSafe — Medication Safety & Interaction Intelligence
 * Core clinical and interaction data types
 */

export type RiskLevel = 'high' | 'moderate' | 'low' | 'info';

export type DrugCategory =
  | 'Anticoagulant'
  | 'NSAID'
  | 'Antiplatelet'
  | 'Proton Pump Inhibitor'
  | 'ACE Inhibitor'
  | 'Potassium-Sparing Diuretic'
  | 'Statin'
  | 'Biguanide'
  | 'Fluoroquinolone Antibiotic'
  | 'SSRI Antidepressant'
  | 'Opioid Analgesic'
  | 'Herbal Supplement'
  | 'Dietary Factor'
  | 'Electrolyte Supplement'
  | 'Thyroid Hormone'
  | 'General';

export interface Medicine {
  id: string;
  name: string;
  genericName: string;
  brandNames?: string[];
  dosage: string;
  category: DrugCategory;
  cypPathways?: string[];
  description: string;
  commonIndications: string[];
}

export interface DrugInteraction {
  id: string;
  drugAId: string;
  drugBId: string;
  drugAName: string;
  drugBName: string;
  severity: RiskLevel;
  severityLabel: string;
  title: string;
  mechanism: string;
  whyItMatters: string;
  clinicalAction: string;
  evidenceSource: string;
  cypDetail?: string;
  foodConsiderations?: string;
  isDemo: boolean;
}

export interface FoodInteractionItem {
  id: string;
  drugName: string;
  foodName: string;
  severity: RiskLevel;
  summary: string;
  recommendation: string;
}

export interface KnowledgeNode {
  id: string;
  label: string;
  type: 'medicine' | 'food' | 'condition' | 'side-effect';
  category?: string;
  x: number;
  y: number;
  details: string;
}

export interface KnowledgeEdge {
  id: string;
  source: string;
  target: string;
  label: string;
  severity: RiskLevel;
  mechanism: string;
}

export interface AnalysisStageItem {
  id: number;
  title: string;
  subtitle: string;
  detail: string;
}

export interface PatientExplanationData {
  language: 'en' | 'hi' | 'bn' | 'es';
  title: string;
  whatDetected: string;
  whyItMatters: string;
  whatToDiscuss: string;
  speechText: string;
}

export interface ClinicalPatient {
  id: string;
  name: string;
  age: number;
  gender: string;
  mrn: string;
  room?: string;
  allergies: string[];
  conditions: string[];
  medications: {
    name: string;
    dose: string;
    frequency: string;
    route: string;
    cyp: string;
    prescriber: string;
  }[];
  reviewStatus: 'Pending Review' | 'Flagged for Provider Call' | 'Approved with Monitoring';
  reviewNotes: string;
}
