import React from 'react';
import { FileText, Download, Pill, Calendar, User } from 'lucide-react';

const mockPrescription = {
  id: 'RX-20260316-001',
  doctor: 'Dr. Aarav Sharma',
  specialty: 'General Physician',
  date: '16th March 2026',
  patient: 'Ramesh Patel',
  age: 45,
  medicines: [
    { name: 'Paracetamol 500mg', dosage: '1-0-1', duration: '3 Days', instructions: 'After food' },
    { name: 'Cetirizine 10mg', dosage: '0-0-1', duration: '5 Days', instructions: 'Before sleep' },
    { name: 'Vitamin C 500mg', dosage: '1-0-0', duration: '7 Days', instructions: 'After breakfast' },
  ],
  notes: 'Plenty of rest, warm fluids. Follow up in 5 days if symptoms persist.',
};

const PrescriptionViewer = () => (
  <div className="max-w-2xl mx-auto">
    <div className="bg-white rounded-3xl border border-slate-100 shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-600 to-healthcare-teal p-8 text-white">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest opacity-70 mb-1">Digital Prescription</p>
            <h2 className="text-2xl font-black">{mockPrescription.id}</h2>
          </div>
          <button className="bg-white/20 backdrop-blur p-3 rounded-2xl hover:bg-white/30 transition-all">
            <Download size={20} />
          </button>
        </div>
      </div>

      {/* Info */}
      <div className="p-8">
        <div className="grid grid-cols-2 gap-6 mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary-50 rounded-xl flex items-center justify-center text-primary-600">
              <User size={18} />
            </div>
            <div>
              <p className="text-[10px] text-slate-400 font-black uppercase">Doctor</p>
              <p className="font-bold text-sm">{mockPrescription.doctor}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary-50 rounded-xl flex items-center justify-center text-primary-600">
              <Calendar size={18} />
            </div>
            <div>
              <p className="text-[10px] text-slate-400 font-black uppercase">Date</p>
              <p className="font-bold text-sm">{mockPrescription.date}</p>
            </div>
          </div>
        </div>

        {/* Medicines Table */}
        <div className="mb-8">
          <h3 className="text-sm font-black text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
            <Pill size={16} /> Prescribed Medicines
          </h3>
          <div className="space-y-3">
            {mockPrescription.medicines.map((med, i) => (
              <div key={i} className="p-4 bg-slate-50 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-2">
                <div>
                  <p className="font-bold text-slate-900">{med.name}</p>
                  <p className="text-xs text-slate-500">{med.instructions}</p>
                </div>
                <div className="flex gap-4 text-sm">
                  <span className="bg-white px-3 py-1 rounded-lg border border-slate-200 font-bold text-primary-600">{med.dosage}</span>
                  <span className="bg-white px-3 py-1 rounded-lg border border-slate-200 font-medium text-slate-500">{med.duration}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Notes */}
        <div className="p-4 bg-orange-50 border border-orange-100 rounded-2xl">
          <p className="text-[10px] text-orange-600 font-black uppercase tracking-wider mb-1 flex items-center gap-1">
            <FileText size={12} /> Doctor's Notes
          </p>
          <p className="text-sm text-orange-900">{mockPrescription.notes}</p>
        </div>
      </div>
    </div>
  </div>
);

export default PrescriptionViewer;
