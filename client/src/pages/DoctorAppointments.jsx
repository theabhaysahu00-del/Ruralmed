import React, { useState, useEffect } from 'react';
import { 
  Calendar, Clock, Video, User, Check, X,
  FileText, MessageSquare, Loader2, RefreshCw
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { appointmentAPI } from '../services/api';
import toast from 'react-hot-toast';

const DoctorAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const { data } = await appointmentAPI.list();
      setAppointments(data || []);
    } catch (err) {
      toast.error('Failed to load appointments');
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await appointmentAPI.updateStatus(id, status);
      toast.success(`Appointment ${status} successfully`);
      fetchAppointments();
    } catch (err) {
      toast.error('Failed to update status');
    }
  };

  const filtered = filter === 'all' 
    ? appointments 
    : appointments.filter(a => a.status === filter);

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Appointments</h1>
          <p className="text-slate-500 dark:text-slate-400 font-bold">Manage your consultation schedule</p>
        </div>
        
        {/* Filters */}
        <div className="flex flex-wrap gap-2">
          {['all', 'pending', 'confirmed', 'completed', 'cancelled'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                filter === f 
                  ? 'bg-doctor text-white shadow-lg shadow-doctor/20' 
                  : 'bg-white dark:bg-slate-900 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-12 h-12 text-doctor animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          <AnimatePresence>
            {filtered.map((app, i) => (
              <motion.div
                key={app._id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: i * 0.05 }}
                className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-premium p-6 flex flex-col group hover:shadow-2xl hover:border-doctor/20 transition-all"
              >
                <div className="flex justify-between items-start mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-doctor/10 rounded-2xl flex items-center justify-center text-doctor">
                      <User className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-black text-slate-900 dark:text-white uppercase tracking-tight">{app.patientName}</h3>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{app.patientPhone}</p>
                    </div>
                  </div>
                  <span className={`text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full ${
                    app.status === 'confirmed' ? 'bg-emerald-100 text-emerald-600' :
                    app.status === 'pending' ? 'bg-amber-100 text-amber-600' :
                    app.status === 'cancelled' ? 'bg-red-100 text-red-600' :
                    'bg-slate-100 text-slate-600'
                  }`}>
                    {app.status}
                  </span>
                </div>

                <div className="space-y-4 mb-6 flex-grow">
                  <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl">
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">Symptoms</p>
                    <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">{app.problemDescription}</p>
                  </div>
                  
                  <div className="flex gap-4">
                    <div className="flex items-center gap-2 text-sm font-bold text-slate-600 dark:text-slate-400">
                      <Calendar className="w-4 h-4 text-doctor" />
                      {new Date(app.date).toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-2 text-sm font-bold text-slate-600 dark:text-slate-400">
                      <Clock className="w-4 h-4 text-doctor" />
                      {app.time}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm font-bold text-slate-600 dark:text-slate-400">
                    <Video className="w-4 h-4 text-doctor" />
                    {app.consultationType}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 mt-auto pt-4 border-t border-slate-100 dark:border-slate-800">
                  {app.status === 'pending' && (
                    <>
                      <button onClick={() => updateStatus(app._id, 'confirmed')} className="flex-1 bg-doctor hover:bg-doctor-dark text-white p-3 rounded-xl flex items-center justify-center gap-2 transition-all">
                        <Check className="w-4 h-4" /> <span className="text-[10px] font-black uppercase tracking-widest">Accept</span>
                      </button>
                      <button onClick={() => updateStatus(app._id, 'cancelled')} className="flex-1 bg-red-50 hover:bg-red-100 text-red-600 p-3 rounded-xl flex items-center justify-center gap-2 transition-all">
                        <X className="w-4 h-4" /> <span className="text-[10px] font-black uppercase tracking-widest">Reject</span>
                      </button>
                    </>
                  )}
                  {app.status === 'confirmed' && (
                    <button onClick={() => window.location.href=`/doctor/consultation/${app._id}`} className="flex-1 bg-doctor hover:bg-doctor-dark text-white p-3 rounded-xl flex items-center justify-center gap-2 transition-all group-hover:shadow-lg group-hover:shadow-doctor/30">
                      <Video className="w-4 h-4" /> <span className="text-[10px] font-black uppercase tracking-widest">Start Consult</span>
                    </button>
                  )}
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
          <Calendar className="w-16 h-16 text-slate-200 dark:text-slate-700 mx-auto mb-6" />
          <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">No Appointments Found</h3>
          <p className="text-slate-400 text-xs font-bold mt-2 uppercase tracking-widest">There are no appointments matching this filter.</p>
        </motion.div>
      )}
    </div>
  );
};

export default DoctorAppointments;
