import React, { useState, useEffect } from 'react';
import { 
  Users, Search, Phone, Mail, 
  MapPin, Calendar, Clock,
  ChevronRight, Activity, Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { appointmentAPI } from '../services/api';
import toast from 'react-hot-toast';

const DoctorPatients = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    setLoading(true);
    try {
      const { data } = await appointmentAPI.list();
      
      // Aggregate unique patients from appointments
      const patientMap = new Map();
      
      data.forEach(app => {
        if (!app.patientId) return;
        const id = app.patientId;
        
        if (!patientMap.has(id)) {
          patientMap.set(id, {
            id,
            name: app.patientName,
            phone: app.patientPhone,
            email: app.patientEmail,
            appointmentCount: 0,
            lastVisit: app.date,
            latestSymptom: app.problemDescription,
            appointments: []
          });
        }
        
        const p = patientMap.get(id);
        p.appointmentCount += 1;
        if (new Date(app.date) > new Date(p.lastVisit)) {
          p.lastVisit = app.date;
          p.latestSymptom = app.problemDescription;
        }
        p.appointments.push(app);
      });
      
      setPatients(Array.from(patientMap.values()));
    } catch (err) {
      toast.error('Failed to load patients');
    } finally {
      setLoading(false);
    }
  };

  const filteredPatients = patients.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase()) || 
    p.phone.includes(search)
  );

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight">My Patients</h1>
          <p className="text-slate-500 dark:text-slate-400 font-bold">Manage your patient records</p>
        </div>
        <div className="relative w-full md:w-auto">
          <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search patients..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full md:w-80 pl-12 pr-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl focus:outline-none focus:ring-2 focus:ring-doctor text-sm font-bold placeholder:text-slate-400 text-slate-900 dark:text-white transition-all shadow-sm"
          />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-12 h-12 text-doctor animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          <AnimatePresence>
            {filteredPatients.map((patient, i) => (
              <motion.div 
                key={patient.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: i * 0.05 }}
                className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-6 border border-slate-100 dark:border-slate-800 shadow-premium hover:shadow-2xl hover:border-doctor/20 transition-all group cursor-pointer"
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 rounded-full overflow-hidden bg-doctor/10 flex items-center justify-center shrink-0 border-2 border-transparent group-hover:border-doctor transition-all">
                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${patient.name}`} alt={patient.name} />
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight">{patient.name}</h3>
                    <div className="flex items-center gap-1 text-slate-400 text-[10px] font-bold uppercase tracking-widest mt-1">
                      <Phone className="w-3 h-3" /> {patient.phone}
                    </div>
                  </div>
                </div>

                <div className="space-y-4 mb-6">
                  <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/50 rounded-2xl">
                    <div className="flex items-center gap-2">
                      <Activity className="w-4 h-4 text-doctor" />
                      <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Latest Issue</span>
                    </div>
                    <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">{patient.latestSymptom || 'Checkup'}</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/50 rounded-2xl">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-doctor" />
                      <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Last Visit</span>
                    </div>
                    <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">{new Date(patient.lastVisit).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-4 border-t border-slate-100 dark:border-slate-800">
                  <div className="text-center">
                    <p className="text-xl font-black text-slate-900 dark:text-white leading-none">{patient.appointmentCount}</p>
                    <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400 mt-1">Visits</p>
                  </div>
                  
                  <button className="bg-doctor/10 hover:bg-doctor text-doctor hover:text-white px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2">
                    View Profile <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
      
      {!loading && filteredPatients.length === 0 && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
          className="bg-white/80 backdrop-blur-md dark:bg-slate-900/80 rounded-[3rem] p-16 text-center border border-slate-100 dark:border-slate-800 shadow-premium mt-12"
        >
          <Users className="w-16 h-16 text-slate-200 dark:text-slate-700 mx-auto mb-6" />
          <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">No Patients Found</h3>
          <p className="text-slate-400 text-xs font-bold mt-2 uppercase tracking-widest">When you complete consultations, patients will appear here.</p>
        </motion.div>
      )}
    </div>
  );
};

export default DoctorPatients;
