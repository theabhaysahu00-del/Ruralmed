import React, { useState, useEffect } from 'react';
import { 
  FileText, Search, Plus, 
  Calendar, Download, Edit3,
  Pill, Clock, Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { prescriptionAPI } from '../services/api';
import toast from 'react-hot-toast';

const DoctorPrescriptions = () => {
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchPrescriptions();
  }, []);

  const fetchPrescriptions = async () => {
    setLoading(true);
    try {
      const { data } = await prescriptionAPI.getDoctorPrescriptions();
      setPrescriptions(data || []);
    } catch (err) {
      toast.error('Failed to load prescriptions');
    } finally {
      setLoading(false);
    }
  };

  const filtered = prescriptions.filter(p => 
    p.patientId?.name?.toLowerCase().includes(search.toLowerCase()) || 
    p.diagnosis.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Prescriptions</h1>
          <p className="text-slate-500 dark:text-slate-400 font-bold">Manage medical prescriptions</p>
        </div>
        
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="relative w-full md:w-80">
            <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search by patient or diagnosis..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl focus:outline-none focus:ring-2 focus:ring-doctor text-sm font-bold placeholder:text-slate-400 text-slate-900 dark:text-white transition-all shadow-sm"
            />
          </div>
          <button className="bg-doctor hover:bg-doctor-dark text-white px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 transition-all shadow-lg shadow-doctor/30 shrink-0">
            <Plus className="w-4 h-4" /> New
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-12 h-12 text-doctor animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <AnimatePresence>
            {filtered.map((px, i) => (
              <motion.div 
                key={px._id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: i * 0.05 }}
                className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-6 border border-slate-100 dark:border-slate-800 shadow-premium hover:shadow-2xl hover:border-doctor/20 transition-all group"
              >
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">{px.patientId?.name || 'Unknown Patient'}</h3>
                    <div className="flex items-center gap-2 text-slate-400 text-[10px] font-bold uppercase tracking-widest mt-1">
                      <Calendar className="w-3 h-3" /> {new Date(px.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  <span className="bg-emerald-100 text-emerald-600 text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full">
                    {px.status}
                  </span>
                </div>

                <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl mb-6">
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">Diagnosis</p>
                  <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">{px.diagnosis}</p>
                </div>

                <div className="space-y-3 mb-6">
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Medicines</p>
                  {px.medicines.map((med, idx) => (
                    <div key={idx} className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2 last:border-0 last:pb-0">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-doctor/10 flex items-center justify-center text-doctor">
                          <Pill className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-700 dark:text-slate-300">{med.name}</p>
                          <p className="text-[10px] text-slate-400 font-semibold">{med.dosage} • {med.frequency}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 text-xs font-bold text-slate-500">
                        <Clock className="w-3 h-3" /> {med.duration}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex gap-2 pt-4 border-t border-slate-100 dark:border-slate-800">
                  <button className="flex-1 bg-doctor/10 hover:bg-doctor text-doctor hover:text-white py-3 rounded-xl flex items-center justify-center gap-2 transition-all">
                    <Download className="w-4 h-4" /> <span className="text-[10px] font-black uppercase tracking-widest">Download PDF</span>
                  </button>
                  <button className="w-12 h-12 bg-slate-50 dark:bg-slate-800 text-slate-400 hover:text-doctor rounded-xl flex items-center justify-center transition-all">
                    <Edit3 className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {!loading && filtered.length === 0 && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
          className="bg-white/80 backdrop-blur-md dark:bg-slate-900/80 rounded-[3rem] p-16 text-center border border-slate-100 dark:border-slate-800 shadow-premium mt-12"
        >
          <FileText className="w-16 h-16 text-slate-200 dark:text-slate-700 mx-auto mb-6" />
          <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">No Prescriptions Found</h3>
          <p className="text-slate-400 text-xs font-bold mt-2 uppercase tracking-widest">Create prescriptions for your patients here.</p>
        </motion.div>
      )}
    </div>
  );
};

export default DoctorPrescriptions;
