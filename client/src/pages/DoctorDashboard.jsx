import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Calendar, Users, MessageSquare, 
  ArrowRight, User, Loader2
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { appointmentAPI } from '../services/api';
import toast from 'react-hot-toast';

const DoctorDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const response = await appointmentAPI.list();
      setAppointments(response.data || []);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const today = new Date().toDateString();
  const todayAppointments = appointments.filter(app => new Date(app.date).toDateString() === today);
  const pendingRequests = appointments.filter(app => app.status === 'pending');
  
  // Get unique patients
  const uniquePatients = new Set(appointments.map(app => app.patientId)).size;

  const stats = [
    { label: "Today's Appointments", value: todayAppointments.length, icon: Calendar, color: 'text-doctor', bg: 'bg-doctor-light' },
    { label: 'Pending Requests', value: pendingRequests.length, icon: MessageSquare, color: 'text-admin', bg: 'bg-admin-light' },
    { label: 'Total Patients', value: uniquePatients, icon: Users, color: 'text-patient', bg: 'bg-patient-light' },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-12 h-12 text-doctor animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Welcome Dr. {user?.name || 'Doctor'}</h1>
          <p className="text-slate-500 dark:text-slate-400 font-bold">Here's what's happening today</p>
        </div>
        <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-doctor shadow-lg shadow-doctor/20">
          <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name || 'doctor'}`} alt="Doctor" />
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white dark:bg-slate-900 p-6 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-premium group hover:shadow-2xl transition-all"
          >
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">{stat.value}</h3>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-1 leading-none">{stat.label}</p>
              </div>
              <div className={`${stat.bg} ${stat.color} w-14 h-14 rounded-2xl flex items-center justify-center group-hover:rotate-6 transition-transform shadow-lg`}>
                <stat.icon className="w-7 h-7" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Recent Appointments (Fallback if no today's appointments) */}
      <div className="bg-white dark:bg-slate-900 p-8 rounded-[3rem] border border-slate-100 dark:border-slate-800 shadow-premium overflow-hidden">
        <div className="flex justify-between items-center mb-8 px-2">
          <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
            {todayAppointments.length > 0 ? "Today's Appointments" : "Recent Appointments"}
          </h3>
          <button 
            onClick={() => navigate('/doctor/appointments')}
            className="text-doctor font-black uppercase tracking-widest text-[10px] flex items-center gap-1 hover:gap-2 transition-all"
          >
            View All <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        <div className="space-y-4">
          {(todayAppointments.length > 0 ? todayAppointments : appointments.slice(0, 5)).map((app) => (
            <div key={app._id} className="flex flex-col md:flex-row items-center justify-between p-6 bg-slate-50 dark:bg-slate-800/50 rounded-[2rem] hover:bg-white dark:hover:bg-slate-800 border border-transparent hover:border-doctor/20 transition-all group">
              <div className="flex items-center gap-4 mb-4 md:mb-0 w-full md:w-auto">
                <div className="w-12 h-12 bg-doctor/10 rounded-2xl flex items-center justify-center text-doctor shrink-0 group-hover:scale-110 transition-transform">
                  <User className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-black text-slate-900 dark:text-white uppercase tracking-tight leading-none mb-1">{app.patientName}</h4>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{app.problemDescription}</p>
                </div>
              </div>

              <div className="flex items-center justify-between md:justify-center gap-8 w-full md:w-auto px-4">
                <div className="text-center">
                  <p className="text-xs font-black text-slate-900 dark:text-white">{new Date(app.date).toLocaleDateString()} {app.time}</p>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Time</p>
                </div>
                <div className="text-center px-4">
                  <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${
                    app.status === 'confirmed' ? 'bg-emerald-100 text-emerald-600' : 
                    app.status === 'pending' ? 'bg-amber-100 text-amber-600' :
                    app.status === 'cancelled' ? 'bg-red-100 text-red-600' :
                    'bg-blue-100 text-blue-600'
                  }`}>
                    {app.status}
                  </span>
                </div>
              </div>

              <div className="w-full md:w-auto mt-4 md:mt-0">
                <button 
                  onClick={() => navigate('/doctor/appointments')}
                  className="w-full md:w-auto bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 px-8 py-3 rounded-xl font-black uppercase tracking-widest text-[10px] hover:bg-doctor hover:text-white hover:border-doctor transition-all"
                >
                  View
                </button>
              </div>
            </div>
          ))}
          {appointments.length === 0 && (
             <div className="text-center p-8 text-slate-500 font-bold">No appointments found.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;


