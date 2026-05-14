import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar, Clock, Video, MapPin, 
  ChevronRight, MoreVertical, XCircle, 
  CheckCircle2, AlertCircle, Loader2,
  CalendarDays, Filter, Search
} from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const MyAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('upcoming'); // upcoming, completed, cancelled
  const navigate = useNavigate();

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const res = await api.get('/appointments');
      if (res.success) {
        setAppointments(res.data);
      }
    } catch (err) {
      toast.error("Failed to load appointments");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (id) => {
    if (!window.confirm("Are you sure you want to cancel this appointment?")) return;
    try {
      const res = await api.put(`/appointments/${id}`, { status: 'cancelled' });
      if (res.success) {
        toast.success("Appointment cancelled");
        fetchAppointments();
      }
    } catch (err) {
      toast.error("Failed to cancel appointment");
    }
  };

  const filteredAppointments = appointments.filter(app => {
    if (filter === 'upcoming') return ['pending', 'confirmed'].includes(app.status);
    return app.status === filter;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return 'text-emerald-500 bg-emerald-500/10';
      case 'pending': return 'text-amber-500 bg-amber-500/10';
      case 'cancelled': return 'text-red-500 bg-red-500/10';
      case 'completed': return 'text-primary bg-primary/10';
      default: return 'text-slate-500 bg-slate-500/10';
    }
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight">My <span className="text-primary">Appointments</span></h1>
          <p className="text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest text-[10px] mt-1">Manage your healthcare schedule</p>
        </div>

        <div className="flex items-center gap-3 bg-white dark:bg-slate-900 p-1.5 rounded-2xl shadow-premium border border-slate-100 dark:border-slate-800">
          {['upcoming', 'completed', 'cancelled'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${filter === f ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-slate-400 hover:text-primary'}`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Appointment List */}
      <div className="space-y-6">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 space-y-4">
            <Loader2 className="w-12 h-12 text-primary animate-spin" />
            <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Loading your schedule...</p>
          </div>
        ) : filteredAppointments.length > 0 ? (
          <AnimatePresence mode="popLayout">
            {filteredAppointments.map((app, index) => (
              <motion.div
                key={app._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-premium overflow-hidden group hover:border-primary/30 transition-all"
              >
                <div className="p-8 flex flex-col lg:flex-row lg:items-center gap-8">
                  {/* Doctor Info */}
                  <div className="flex items-center gap-6 lg:min-w-[300px]">
                    <div className="relative">
                      <div className="w-20 h-20 rounded-3xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 shadow-inner group-hover:rotate-3 transition-transform">
                        <CalendarDays className="w-10 h-10" />
                      </div>
                      <div className={`absolute -bottom-2 -right-2 p-2 rounded-xl shadow-lg border-2 border-white dark:border-slate-900 ${getStatusColor(app.status)}`}>
                        {app.status === 'confirmed' ? <CheckCircle2 className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
                      </div>
                    </div>
                    <div>
                      <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">{app.doctorName || 'General Specialist'}</h3>
                      <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">{app.department || 'Healthcare'}</p>
                      <div className={`inline-block mt-2 px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest ${getStatusColor(app.status)}`}>
                        {app.status}
                      </div>
                    </div>
                  </div>

                  {/* Date & Time */}
                  <div className="flex-1 grid grid-cols-2 md:grid-cols-3 gap-6 py-6 lg:py-0 border-y lg:border-y-0 lg:border-x border-slate-100 dark:border-slate-800 px-0 lg:px-10">
                    <div>
                      <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Date</p>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-slate-400" />
                        <span className="text-sm font-bold text-slate-900 dark:text-white">{new Date(app.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Time Slot</p>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-slate-400" />
                        <span className="text-sm font-bold text-slate-900 dark:text-white uppercase">{app.time}</span>
                      </div>
                    </div>
                    <div className="col-span-2 md:col-span-1">
                      <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Type</p>
                      <div className="flex items-center gap-2">
                        {app.consultationType === 'video' ? <Video className="w-4 h-4 text-primary" /> : <MapPin className="w-4 h-4 text-amber-500" />}
                        <span className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-tighter">{app.consultationType || 'In-Person'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-3">
                    {app.status === 'confirmed' && app.consultationType === 'video' && (
                      <button 
                        onClick={() => navigate(`/patient/consultation/${app._id}`)}
                        className="flex-1 lg:flex-none px-6 py-3.5 bg-primary text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2"
                      >
                        Join Call <Video className="w-4 h-4" />
                      </button>
                    )}
                    {['pending', 'confirmed'].includes(app.status) && (
                      <button 
                        onClick={() => handleCancel(app._id)}
                        className="p-4 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-2xl transition-all"
                      >
                        <XCircle className="w-5 h-5" />
                      </button>
                    )}
                    <button className="p-4 text-slate-400 hover:text-primary hover:bg-slate-50 dark:hover:bg-slate-800 rounded-2xl transition-all">
                      <MoreVertical className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        ) : (
          <div className="bg-white dark:bg-slate-900 rounded-[3rem] p-16 text-center border border-slate-100 dark:border-slate-800 shadow-premium">
            <div className="w-24 h-24 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-8">
              <AlertCircle className="w-12 h-12 text-slate-300" />
            </div>
            <h3 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight mb-2">No {filter} appointments</h3>
            <p className="text-slate-500 dark:text-slate-400 font-bold text-sm mb-10 max-w-sm mx-auto">
              {filter === 'upcoming' 
                ? "You don't have any scheduled consultations. Stay healthy!" 
                : `You don't have any ${filter} appointments in your history.`}
            </p>
            {filter === 'upcoming' && (
              <button 
                onClick={() => navigate('/patient/book-appointment')}
                className="px-10 py-5 bg-primary text-white rounded-[2rem] text-xs font-black uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all"
              >
                Book Appointment Now
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyAppointments;
