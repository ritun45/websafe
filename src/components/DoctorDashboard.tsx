import React, { useState } from 'react';
import {
  Stethoscope,
  Users,
  FileCheck,
  AlertTriangle,
  AlertCircle,
  Clock,
  CheckCircle,
  FileText,
  UserCheck,
  Filter,
  Search,
  ExternalLink,
  PhoneCall,
  Save,
  ShieldAlert,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';
import { CLINICAL_PATIENTS, MASTER_MEDICATIONS } from '../data/mockClinicalData';
import { ClinicalPatient } from '../types/medication';
import { RiskBadge } from './RiskBadge';

export const DoctorDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'patients' | 'analysis' | 'interactions' | 'reports'>('overview');
  const [selectedPatientId, setSelectedPatientId] = useState<string>('pat-1');
  const [patientsList, setPatientsList] = useState<ClinicalPatient[]>(CLINICAL_PATIENTS);
  const [pharmacistNoteInput, setPharmacistNoteInput] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);

  const selectedPatient =
    patientsList.find((p) => p.id === selectedPatientId) || patientsList[0];

  const handleUpdateStatus = (status: ClinicalPatient['reviewStatus']) => {
    setPatientsList((prev) =>
      prev.map((pat) => (pat.id === selectedPatient.id ? { ...pat, reviewStatus: status } : pat))
    );
  };

  const handleSaveNote = () => {
    if (!pharmacistNoteInput.trim()) return;
    setPatientsList((prev) =>
      prev.map((pat) =>
        pat.id === selectedPatient.id
          ? {
              ...pat,
              reviewNotes: `${pat.reviewNotes} [Note added: ${pharmacistNoteInput.trim()}]`,
            }
          : pat
      )
    );
    setPharmacistNoteInput('');
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  return (
    <section id="clinical-review" className="py-16 md:py-24 border-b border-[#D9E0DC]/60">
      <div className="max-w-[1200px] mx-auto px-6 md:px-8 space-y-6">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="inline-flex items-center gap-2">
              <Stethoscope className="w-4 h-4 text-[#285C50]" />
              <span className="text-xs font-bold uppercase tracking-wider text-[#285C50] font-heading">
                Healthcare Provider Workspace
              </span>
            </div>
            <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-[#17352F] tracking-tight">
              Clinical Review Dashboard
            </h2>
            <p className="text-xs sm:text-sm text-[#5E6863]">
              High-density pharmacist surveillance portal for institutional polypharmacy triage.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono bg-[#EEF3EF] px-3 py-1.5 rounded-[6px] border border-[#D9E0DC] text-[#17352F]">
            <span className="w-2 h-2 rounded-full bg-[#3F8068]" />
            <span>EMR Connected: St. Jude Health Clinical Grid</span>
          </div>
        </div>

        {/* Dense Dashboard Shell */}
        <div className="bg-[#FFFFFF] rounded-[14px] border border-[#D9E0DC] shadow-[0_8px_24px_rgba(23,53,47,0.08)] overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[640px]">
          
          {/* Left Clinical Sidebar */}
          <div className="lg:col-span-3 bg-[#EEF3EF]/60 border-r border-[#D9E0DC] p-4 space-y-6">
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-[#5E6863] font-heading mb-2">
                Clinical Workflow
              </div>
              <div className="space-y-1">
                {[
                  { id: 'overview', label: 'Overview', icon: Stethoscope },
                  { id: 'patients', label: 'Patients Queue', icon: Users, badge: `${patientsList.length}` },
                  { id: 'analysis', label: 'Medication Analysis', icon: FileCheck },
                  { id: 'interactions', label: 'Interaction Monitor', icon: AlertTriangle, badge: '6' },
                  { id: 'reports', label: 'Pharmacist Reports', icon: FileText },
                ].map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id as any)}
                      className={`w-full flex items-center justify-between px-3 py-2 text-xs font-semibold rounded-[6px] transition-colors cursor-pointer ${
                        isActive
                          ? 'bg-[#17352F] text-[#F7F5EF] shadow-sm'
                          : 'text-[#5E6863] hover:text-[#17352F] hover:bg-[#EEF3EF]'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Icon className="w-4 h-4" />
                        <span>{item.label}</span>
                      </div>
                      {item.badge && (
                        <span
                          className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                            isActive
                              ? 'bg-[#D89A28] text-[#17201D] font-bold'
                              : 'bg-[#D9E0DC] text-[#17352F]'
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Inpatient / Outpatient Switcher */}
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-[#5E6863] font-heading mb-2">
                Active Inpatient Roster
              </div>
              <div className="space-y-1.5">
                {patientsList.map((pat) => {
                  const isSelected = selectedPatient.id === pat.id;
                  return (
                    <button
                      key={pat.id}
                      onClick={() => setSelectedPatientId(pat.id)}
                      className={`w-full text-left p-2.5 rounded-[8px] border transition-all text-xs cursor-pointer ${
                        isSelected
                          ? 'bg-[#FFFFFF] border-[#285C50] shadow-sm'
                          : 'bg-[#FFFFFF]/60 border-transparent hover:border-[#D9E0DC] hover:bg-[#FFFFFF]'
                      }`}
                    >
                      <div className="font-heading font-bold text-[#17352F] flex items-center justify-between">
                        <span>{pat.name}</span>
                        <span className="font-mono text-[10px] text-[#5E6863]">{pat.mrn}</span>
                      </div>
                      <div className="text-[11px] text-[#5E6863] flex items-center justify-between mt-1">
                        <span>{pat.age}y {pat.gender} • {pat.room}</span>
                      </div>
                      <div className="mt-1.5">
                        <span
                          className={`inline-block text-[10px] font-bold px-1.5 py-0.5 rounded-[4px] ${
                            pat.reviewStatus === 'Flagged for Provider Call'
                              ? 'bg-[#B6423A]/10 text-[#B6423A]'
                              : pat.reviewStatus === 'Pending Review'
                              ? 'bg-[#C9792B]/10 text-[#C9792B]'
                              : 'bg-[#3F8068]/10 text-[#3F8068]'
                          }`}
                        >
                          {pat.reviewStatus}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Pharmacist On-Call Profile */}
            <div className="p-3 bg-[#FFFFFF] rounded-[8px] border border-[#D9E0DC] text-[11px] space-y-1">
              <div className="font-bold text-[#17352F]">Reviewing Pharmacist:</div>
              <div className="text-[#285C50] font-semibold">Dr. S. Reynolds, PharmD, BCPS</div>
              <div className="text-[#5E6863]">Clinical Pharmacotherapy Specialist</div>
            </div>
          </div>

          {/* Main Dense Dashboard Panel */}
          <div className="lg:col-span-9 p-5 sm:p-6 space-y-6">
            
            {/* Patient Header Strip */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#D9E0DC] gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-heading font-extrabold text-xl text-[#17352F]">
                    {selectedPatient.name}
                  </h3>
                  <span className="text-xs font-mono text-[#5E6863] bg-[#EEF3EF] px-2 py-0.5 rounded">
                    {selectedPatient.mrn}
                  </span>
                  <span className="text-xs text-[#5E6863]">
                    ({selectedPatient.age}yo {selectedPatient.gender})
                  </span>
                </div>
                <div className="text-xs text-[#5E6863] flex flex-wrap items-center gap-x-3 gap-y-1 mt-1">
                  <span>Location: <strong className="text-[#17352F]">{selectedPatient.room}</strong></span>
                  <span>•</span>
                  <span>Allergies: <strong className="text-[#B6423A]">{selectedPatient.allergies.join(', ')}</strong></span>
                  <span>•</span>
                  <span>Conditions: <strong className="text-[#17352F]">{selectedPatient.conditions.join(', ')}</strong></span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleUpdateStatus('Flagged for Provider Call')}
                  className="px-2.5 py-1.5 bg-[#B6423A]/10 hover:bg-[#B6423A]/20 text-[#B6423A] font-bold text-xs rounded-[6px] transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <PhoneCall className="w-3.5 h-3.5" />
                  <span>Flag Provider</span>
                </button>
                <button
                  onClick={() => handleUpdateStatus('Approved with Monitoring')}
                  className="px-2.5 py-1.5 bg-[#3F8068]/10 hover:bg-[#3F8068]/20 text-[#3F8068] font-bold text-xs rounded-[6px] transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>Approve</span>
                </button>
              </div>
            </div>

            {/* Medication Risk Overview Cards */}
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-[#5E6863] font-heading mb-2">
                Medication Risk Overview
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3.5 bg-[#B6423A]/10 border border-[#B6423A]/30 rounded-[10px]">
                  <div className="flex items-center justify-between text-xs text-[#B6423A] font-bold">
                    <span>High Risk</span>
                    <AlertTriangle className="w-4 h-4" />
                  </div>
                  <div className="font-heading font-extrabold text-2xl text-[#B6423A] mt-1">
                    {selectedPatient.id === 'pat-1' ? '1' : selectedPatient.id === 'pat-2' ? '2' : selectedPatient.id === 'pat-3' ? '2' : '0'}
                  </div>
                  <div className="text-[10px] text-[#5E6863] mt-0.5">Critical contraindications</div>
                </div>

                <div className="p-3.5 bg-[#C9792B]/10 border border-[#C9792B]/30 rounded-[10px]">
                  <div className="flex items-center justify-between text-xs text-[#C9792B] font-bold">
                    <span>Moderate</span>
                    <AlertCircle className="w-4 h-4" />
                  </div>
                  <div className="font-heading font-extrabold text-2xl text-[#C9792B] mt-1">
                    {selectedPatient.id === 'pat-1' ? '1' : selectedPatient.id === 'pat-4' ? '1' : '0'}
                  </div>
                  <div className="text-[10px] text-[#5E6863] mt-0.5">Pharmacokinetic shift</div>
                </div>

                <div className="p-3.5 bg-[#285C50]/10 border border-[#285C50]/30 rounded-[10px]">
                  <div className="flex items-center justify-between text-xs text-[#285C50] font-bold">
                    <span>Informational</span>
                    <Clock className="w-4 h-4" />
                  </div>
                  <div className="font-heading font-extrabold text-2xl text-[#285C50] mt-1">
                    {selectedPatient.id === 'pat-4' ? '2' : '1'}
                  </div>
                  <div className="text-[10px] text-[#5E6863] mt-0.5">Dietary & CYP notes</div>
                </div>

                <div className="p-3.5 bg-[#EEF3EF] border border-[#D9E0DC] rounded-[10px]">
                  <div className="flex items-center justify-between text-xs text-[#17352F] font-bold">
                    <span>Polypharmacy</span>
                    <TrendingUp className="w-4 h-4 text-[#285C50]" />
                  </div>
                  <div className="font-heading font-extrabold text-2xl text-[#17352F] mt-1">
                    {selectedPatient.medications.length} Rx
                  </div>
                  <div className="text-[10px] text-[#5E6863] mt-0.5">Active daily agents</div>
                </div>
              </div>
            </div>

            {/* Current Medication Profile (Dense Table on Desktop, Cards on Mobile) */}
            <div>
              <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-[#5E6863] font-heading mb-2">
                <span>Current Medication Profile</span>
                <span className="font-mono text-[11px] text-[#285C50] lowercase">N = {selectedPatient.medications.length} orders</span>
              </div>

              {/* Desktop Table View */}
              <div className="hidden sm:block border border-[#D9E0DC] rounded-[8px] overflow-hidden">
                <table className="w-full text-left text-xs divide-y divide-[#D9E0DC]">
                  <thead className="bg-[#EEF3EF] text-[#17352F] font-bold text-[11px] uppercase tracking-wider">
                    <tr>
                      <th className="p-3">Medication</th>
                      <th className="p-3">Dose / Frequency</th>
                      <th className="p-3">Route</th>
                      <th className="p-3">Metabolic / CYP Pathway</th>
                      <th className="p-3">Prescriber</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#D9E0DC]/70 bg-[#FFFFFF]">
                    {selectedPatient.medications.map((m, idx) => (
                      <tr key={idx} className="hover:bg-[#F7F5EF] transition-colors">
                        <td className="p-3 font-bold text-[#17352F]">
                          {m.name}
                        </td>
                        <td className="p-3 font-mono text-[#5E6863]">
                          {m.dose} ({m.frequency})
                        </td>
                        <td className="p-3 text-[#5E6863]">{m.route}</td>
                        <td className="p-3 font-mono text-[#285C50] text-[11px]">
                          {m.cyp}
                        </td>
                        <td className="p-3 text-[#5E6863] text-[11px]">
                          {m.prescriber}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Stacked Card View */}
              <div className="sm:hidden space-y-2">
                {selectedPatient.medications.map((m, idx) => (
                  <div key={idx} className="p-3 bg-[#FFFFFF] border border-[#D9E0DC] rounded-[8px] space-y-1">
                    <div className="font-bold text-xs text-[#17352F] flex items-center justify-between">
                      <span>{m.name}</span>
                      <span className="text-[10px] font-mono text-[#285C50] bg-[#EEF3EF] px-1.5 py-0.5 rounded">{m.cyp}</span>
                    </div>
                    <div className="text-[11px] text-[#5E6863] flex items-center justify-between">
                      <span>{m.dose} ({m.frequency})</span>
                      <span>Route: {m.route}</span>
                    </div>
                    <div className="text-[10px] text-[#5E6863] truncate">Prescriber: {m.prescriber}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* CYP450 Isoenzyme Metabolism Matrix */}
            <div className="p-3.5 bg-[#FFFFFF] rounded-[10px] border border-[#D9E0DC] space-y-2">
              <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-[#5E6863] font-heading">
                <span>CYP450 Enzyme Clearance & Inhibition Matrix</span>
                <span className="text-[10px] font-mono text-[#285C50]">Pharmacokinetic Cross-Reference</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-6 gap-2 text-[11px]">
                <div className="p-2 rounded-[6px] bg-[#EEF3EF] border border-[#D9E0DC] text-center">
                  <div className="font-bold font-mono text-[#17352F]">CYP2C9</div>
                  <div className="text-[10px] text-[#B6423A] font-semibold mt-0.5">Warfarin Substrate</div>
                  <div className="text-[9px] text-[#5E6863]">Competed by NSAIDs</div>
                </div>
                <div className="p-2 rounded-[6px] bg-[#EEF3EF] border border-[#D9E0DC] text-center">
                  <div className="font-bold font-mono text-[#17352F]">CYP2C19</div>
                  <div className="text-[10px] text-[#C9792B] font-semibold mt-0.5">Omeprazole Inhibits</div>
                  <div className="text-[9px] text-[#5E6863]">Blunts Clopidogrel</div>
                </div>
                <div className="p-2 rounded-[6px] bg-[#EEF3EF] border border-[#D9E0DC] text-center">
                  <div className="font-bold font-mono text-[#17352F]">CYP3A4</div>
                  <div className="text-[10px] text-[#285C50] font-semibold mt-0.5">Major Hepatic Clearance</div>
                  <div className="text-[9px] text-[#5E6863]">Statin / Co-pathway</div>
                </div>
                <div className="p-2 rounded-[6px] bg-[#EEF3EF] border border-[#D9E0DC] text-center">
                  <div className="font-bold font-mono text-[#17352F]">CYP2D6</div>
                  <div className="text-[10px] text-[#3F8068] font-semibold mt-0.5">Analgesic Pathway</div>
                  <div className="text-[9px] text-[#5E6863]">Active Metabolite Rate</div>
                </div>
                <div className="p-2 rounded-[6px] bg-[#EEF3EF] border border-[#D9E0DC] text-center">
                  <div className="font-bold font-mono text-[#17352F]">CYP1A2</div>
                  <div className="text-[10px] text-[#3F8068] font-semibold mt-0.5">Stable Kinetics</div>
                  <div className="text-[9px] text-[#5E6863]">Minor Clearance</div>
                </div>
                <div className="p-2 rounded-[6px] bg-[#EEF3EF] border border-[#D9E0DC] text-center">
                  <div className="font-bold font-mono text-[#17352F]">Renal (eGFR)</div>
                  <div className="text-[10px] text-[#B6423A] font-semibold mt-0.5">Potassium Clearance</div>
                  <div className="text-[9px] text-[#5E6863]">ACE / Aldosterone</div>
                </div>
              </div>
            </div>

            {/* Visual Interaction Timeline (Chronological relationships) */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-[#5E6863] font-heading">
                <span>Interaction Timeline & Surveillance Trail</span>
                <span className="text-[10px] font-mono text-[#5E6863]">Chronological Event Detection</span>
              </div>

              <div className="p-4 bg-[#EEF3EF]/60 rounded-[10px] border border-[#D9E0DC] space-y-4 relative">
                {/* Visual timeline vertical accent line */}
                <div className="absolute left-6 top-6 bottom-6 w-0.5 bg-[#D9E0DC] hidden sm:block" />

                <div className="flex items-start gap-3.5 relative z-10">
                  <div className="w-5 h-5 rounded-full bg-[#B6423A] text-white flex items-center justify-center text-[10px] font-bold shrink-0 shadow-sm mt-0.5">
                    !
                  </div>
                  <div className="text-xs bg-[#FFFFFF] p-3 rounded-[8px] border border-[#B6423A]/30 flex-1 space-y-0.5 shadow-sm">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[#B6423A]">Acute Synergistic Hemostatic Alert</span>
                      <span className="font-mono text-[10px] text-[#5E6863]">Today 08:30 EST</span>
                    </div>
                    <p className="text-[#17201D] leading-relaxed">
                      Concurrent order for Ibuprofen 400mg added to pre-existing Warfarin regimen. Automatic e-prescribing conflict alert triggered for high mucosal hemorrhage potential.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5 relative z-10">
                  <div className="w-5 h-5 rounded-full bg-[#C9792B] text-white flex items-center justify-center text-[10px] font-bold shrink-0 shadow-sm mt-0.5">
                    ▲
                  </div>
                  <div className="text-xs bg-[#FFFFFF] p-3 rounded-[8px] border border-[#C9792B]/30 flex-1 space-y-0.5 shadow-sm">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[#C9792B]">CYP2C19 Prodrug Bioactivation Warning</span>
                      <span className="font-mono text-[10px] text-[#5E6863]">Yesterday 14:15 EST</span>
                    </div>
                    <p className="text-[#17201D] leading-relaxed">
                      Omeprazole initiation competes for CYP2C19 hepatic active site, attenuating clopidogrel conversion to thiol active metabolite. Recommended substitution: Pantoprazole or Famotidine.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5 relative z-10">
                  <div className="w-5 h-5 rounded-full bg-[#3F8068] text-white flex items-center justify-center text-[10px] font-bold shrink-0 shadow-sm mt-0.5">
                    ✓
                  </div>
                  <div className="text-xs bg-[#FFFFFF] p-3 rounded-[8px] border border-[#3F8068]/30 flex-1 space-y-0.5 shadow-sm">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[#3F8068]">Therapeutic Drug Monitoring Baseline</span>
                      <span className="font-mono text-[10px] text-[#5E6863]">3 Days Ago</span>
                    </div>
                    <p className="text-[#17201D] leading-relaxed">
                      INR target range calibrated (2.0 - 3.0). Baseline renal panel verified normal eGFR ({'>'} 60 mL/min/1.73m²).
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Review Queue and Action Notes */}
            <div className="p-4 bg-[#FFFFFF] rounded-[10px] border border-[#D9E0DC] space-y-3">
              <div className="flex items-center justify-between">
                <div className="text-xs font-bold uppercase tracking-wider text-[#17352F] font-heading flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-[#285C50]" />
                  <span>Clinical Pharmacist Review Log & Communication</span>
                </div>
                <span className="text-xs font-mono text-[#3F8068]">
                  Status: {selectedPatient.reviewStatus}
                </span>
              </div>

              <div className="p-3 bg-[#F7F5EF] rounded-[8px] border border-[#D9E0DC] text-xs text-[#17201D] leading-relaxed">
                <span className="font-bold text-[#285C50]">Active Clinical Assessment: </span>
                {selectedPatient.reviewNotes}
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={pharmacistNoteInput}
                  onChange={(e) => setPharmacistNoteInput(e.target.value)}
                  placeholder="Append clinical note (e.g., 'Spoke with Dr. Vance; PPI switched to Pantoprazole 40mg q.d.')..."
                  className="flex-1 px-3 py-2 bg-[#FFFFFF] border border-[#D9E0DC] rounded-[6px] text-xs text-[#17201D] focus:outline-none focus:ring-1 focus:ring-[#285C50]"
                />
                <button
                  onClick={handleSaveNote}
                  disabled={!pharmacistNoteInput.trim()}
                  className="px-3 py-2 bg-[#17352F] hover:bg-[#285C50] disabled:bg-[#D9E0DC] disabled:cursor-not-allowed text-[#FFFFFF] text-xs font-bold rounded-[6px] flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Append Note</span>
                </button>
              </div>

              {saveSuccess && (
                <div className="text-[11px] text-[#3F8068] font-bold flex items-center gap-1">
                  <CheckCircle className="w-3.5 h-3.5" /> Note recorded to patient institutional audit trail.
                </div>
              )}
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};
