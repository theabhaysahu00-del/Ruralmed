import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Pill, Download, FileText, Calendar, 
  User, ExternalLink, Loader2, AlertCircle,
  Search, Filter, ChevronRight, Stethoscope
} from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

const Prescriptions = () => {
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchPrescriptions();
  }, []);

  const fetchPrescriptions = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get('/api/prescriptions/patient');
      if (data.success) {
        setPrescriptions(data.data);
      }
    } catch (err) {
      // Mock data for demo if API not fully ready
      setPrescriptions([
        {
          _id: '1',
          doctorName: 'Dr. Anita Verma',
          date: '2024-05-10',
          diagnosis: 'Seasonal Influenza',
          medicines: [
            { name: 'Paracetamol', dosage: '500mg', frequency: 'Thrice a day', duration: '5 days' },
            { name: 'Amoxicillin', dosage: '250mg', frequency: 'Twice a day', duration: '7 days' }
          ]
        },
        {
          _id: '2',
          doctorName: 'Dr. Rajesh Sharma',
          date: '2024-04-22',
          diagnosis: 'Mild Hypertension',
          medicines: [
            { name: 'Amlodipine', dosage: '5mg', frequency: 'Once a day (Morning)', duration: 'Ongoing' }
          ]
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const filteredPrescriptions = prescriptions.filter(p => 
    p.doctorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.diagnosis.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 pb-12">
      {/* Header & Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Digital <span className="text-primary">Prescriptions</span></h1>
          <p className="text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest text-[10px] mt-1">Access your medical prescriptions anywhere</p>
        </div>

        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="text"
            placeholder="Search by Doctor or Diagnosis..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl pl-14 pr-6 py-4 text-sm font-bold outline-none focus:ring-4 focus:ring-primary/10 shadow-premium transition-all"
          />
        </div>
      </div>

      {/* Prescription List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {loading ? (
          <div className="col-span-full flex flex-col items-center justify-center py-32 space-y-4">
            <Loader2 className="w-12 h-12 text-primary animate-spin" />
            <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Retrieving your prescriptions...</p>
          </div>
        ) : filteredPrescriptions.length > 0 ? (
          filteredPrescriptions.map((p, index) => (
            <motion.div
              key={p._id}
              initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white dark:bg-slate-900 rounded-[3rem] border border-slate-100 dark:border-slate-800 shadow-premium overflow-hidden flex flex-col group hover:border-primary/30 transition-all"
            >
              <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex items-start justify-between">
                <div className="flex items-center gap-5">
                  <div className="w-16 h-16 rounded-[1.5rem] bg-primary/10 text-primary flex items-center justify-center shadow-lg shadow-primary/5 group-hover:scale-110 transition-transform">
                    <FileText className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight">{p.diagnosis}</h3>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 mt-1">
                      <Stethoscope className="w-3 h-3" /> {p.doctorName}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs font-black text-slate-900 dark:text-white">{new Date(p.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Date Issued</p>
                </div>
              </div>

              <div className="p-8 flex-1">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Medication List</p>
                <div className="space-y-4">
                  {p.medicines.map((med, i) => (
                    <div key={i} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl group/med">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-white dark:bg-slate-800 rounded-xl flex items-center justify-center text-slate-400 group-hover/med:text-primary transition-colors">
                          <Pill className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="text-sm font-black text-slate-900 dark:text-white">{med.name}</h4>
                          <p className="text-[10px] font-bold text-slate-500">{med.dosage} • {med.frequency}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] font-black text-primary uppercase tracking-widest bg-primary/5 px-2 py-1 rounded-lg">{med.duration}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-8 bg-slate-50/50 dark:bg-slate-800/30 border-t border-slate-100 dark:border-slate-800 flex gap-4">
                <button className="flex-1 py-4 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-300 hover:border-primary hover:text-primary transition-all flex items-center justify-center gap-2">
                  View Full Details <ChevronRight className="w-4 h-4" />
                </button>
                <button className="px-6 py-4 bg-primary text-white rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-lg shadow-primary/20">
                  <Download className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="col-span-full bg-white dark:bg-slate-900 rounded-[3rem] p-20 text-center border border-slate-100 dark:border-slate-800 shadow-premium">
            <div className="w-24 h-24 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-8">
              <Pill className="w-12 h-12 text-slate-300" />
            </div>
            <h3 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight mb-2">No prescriptions found</h3>
            <p className="text-slate-500 dark:text-slate-400 font-bold text-sm max-w-sm mx-auto">Your digital prescriptions will appear here once issued by your doctor.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Prescriptions;
