import React, { useState } from 'react';
import { Send, FileText, User, Clock, AlertCircle } from 'lucide-react';

const appointmentData = [
  { id: 1, patient: 'Ramesh Patel', time: '10:00 AM', status: 'Waiting', age: 45, gender: 'Male' },
  { id: 2, patient: 'Sunita Devi', time: '11:30 AM', status: 'Confirmed', age: 32, gender: 'Female' },
  { id: 3, patient: 'Amit Kumar', time: '02:00 PM', status: 'Confirmed', age: 28, gender: 'Male' },
];

const DoctorAppointments = () => {
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [prescription, setPrescription] = useState('');

  return (
    <div className="space-y-8">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Appointment List */}
        <div className="flex-1 space-y-4">
          <h3 className="text-xl font-bold text-slate-900 mb-4">Today's Schedule</h3>
          {appointmentData.map((app) => (
            <div 
              key={app.id} 
              onClick={() => setSelectedPatient(app)}
              className={`p-6 rounded-3xl border transition-all cursor-pointer bg-white ${selectedPatient?.id === app.id ? 'border-primary-500 ring-4 ring-primary-50' : 'border-slate-100 hover:border-slate-300'}`}
            >
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 font-bold">
                    {app.patient.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">{app.patient}</h4>
                    <p className="text-xs text-slate-500 font-medium">{app.age}Y • {app.gender}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1 text-primary-600 font-bold mb-1">
                    <Clock size={14} /> {app.time}
                  </div>
                  <span className={`text-[10px] uppercase font-black px-2 py-1 rounded-full ${app.status === 'Waiting' ? 'bg-orange-100 text-orange-600' : 'bg-green-100 text-green-600'}`}>
                    {app.status}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Prescription Writing / Patient Details */}
        <div className="flex-1">
          {selectedPatient ? (
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-8 sticky top-24">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-2xl font-black text-slate-900">{selectedPatient.patient}</h3>
                  <p className="text-slate-500">Documenting consultation</p>
                </div>
                <button className="bg-slate-100 p-2 rounded-xl text-slate-400 hover:text-slate-600">
                  <User size={20} />
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wider">Symptoms & Assessment</label>
                  <textarea 
                    className="w-full h-32 p-4 rounded-2xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-primary-500 outline-none transition-all"
                    placeholder="Enter patient symptoms and observations..."
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wider">Prescription (Medicines)</label>
                  <div className="border border-slate-200 rounded-2xl overflow-hidden">
                    <div className="bg-slate-50 px-4 py-2 border-b border-slate-200 flex gap-2">
                      <FileText size={16} className="text-slate-400" />
                      <span className="text-xs font-bold text-slate-500 uppercase">E-Prescription Draft</span>
                    </div>
                    <textarea 
                      value={prescription}
                      onChange={(e) => setPrescription(e.target.value)}
                      className="w-full h-40 p-4 outline-none resize-none"
                      placeholder="e.g., Paracetamol 500mg - 1-0-1 (3 Days)"
                    />
                  </div>
                </div>

                <div className="flex gap-4">
                  <button className="flex-1 py-4 rounded-2xl bg-primary-600 text-white font-bold shadow-lg shadow-primary-200 flex items-center justify-center gap-2 hover:bg-primary-700 transition-all">
                    Send to Pharmacy <Send size={18} />
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-slate-50 border border-dashed border-slate-200 rounded-3xl h-[600px] flex flex-col items-center justify-center text-slate-400 text-center px-12">
              <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mb-6 shadow-sm">
                <AlertCircle size={28} />
              </div>
              <p className="text-lg font-bold text-slate-600">No Patient Selected</p>
              <p className="text-sm">Select an appointment from the list to start the consultation or write a prescription.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DoctorAppointments;
