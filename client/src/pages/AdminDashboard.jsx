import React, { useState, useEffect, useCallback } from 'react';
import { 
  Users, UserCheck, Calendar, Pill, Activity, 
  AlertCircle, TrendingUp, ShoppingBag, Clock, 
  CheckCircle2, XCircle, Stethoscope, ArrowUpRight, 
  ArrowDownRight, Bell, Search, Filter, ClipboardList, 
  Video, User as UserIcon, Phone, Mail as MailIcon,
  FileText, Loader2, Globe
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, AreaChart, Area, PieChart, Pie, Cell 
} from 'recharts';
import { useTheme } from '../context/ThemeContext';
import { adminAPI } from '../services/api';
import toast, { Toaster } from 'react-hot-toast';

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];

const tooltipStyle = {
  backgroundColor: '#0f172a',
  border: 'none',
  borderRadius: '16px',
  color: '#fff',
  padding: '12px',
  fontSize: '11px',
  fontWeight: 'bold',
};

const ConsultationMonitoring = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  const fetchAppointments = async () => {
    try {
      const res = await adminAPI.getAppointments({ limit: 10 });
      setAppointments(res.data || []);
    } catch (err) {
      toast.error("Failed to load consultations");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const getStatusColor = (status) => {
    switch(status) {
      case 'pending': return 'bg-amber-100 text-amber-600';
      case 'confirmed': return 'bg-blue-100 text-blue-600';
      case 'completed': return 'bg-emerald-100 text-emerald-600';
      case 'cancelled': return 'bg-red-100 text-red-600';
      default: return 'bg-slate-100 text-slate-600';
    }
  };

  const filteredAppointments = filter === 'all' 
    ? appointments 
    : appointments.filter(a => a.status === filter);

  if (loading) return (
    <div className="p-20 bg-white dark:bg-slate-900 rounded-[3rem] border border-slate-100 dark:border-slate-800 flex flex-col items-center justify-center gap-4">
      <Loader2 className="w-10 h-10 text-indigo-500 animate-spin" />
      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Syncing medical database...</p>
    </div>
  );

  return (
    <div className="bg-white dark:bg-slate-900 p-8 rounded-[3rem] border border-slate-100 dark:border-slate-800 shadow-premium overflow-hidden">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10 px-2">
        <div>
          <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight flex items-center gap-3">
            Consultation Monitoring
            <span className="px-2 py-0.5 bg-blue-100 text-blue-600 text-[8px] rounded-md font-black uppercase">Live Records</span>
          </h3>
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">Real-time patient-doctor engagement tracking</p>
        </div>
        
        <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto">
          {['all', 'pending', 'confirmed', 'completed', 'cancelled'].map((s) => (
            <button 
              key={s}
              onClick={() => setFilter(s)}
              className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${filter === s ? 'bg-slate-900 dark:bg-white dark:text-slate-900 text-white shadow-lg' : 'bg-slate-50 dark:bg-slate-800 text-slate-400 hover:bg-slate-100'}`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-slate-50 dark:border-slate-800">
              <th className="pb-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Patient Details</th>
              <th className="pb-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Assignment</th>
              <th className="pb-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Schedule</th>
              <th className="pb-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Mode</th>
              <th className="pb-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Status</th>
              <th className="pb-4 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
            {filteredAppointments.length === 0 ? (
              <tr>
                <td colSpan="6" className="py-12 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">No consultations found matching filter</td>
              </tr>
            ) : filteredAppointments.map((apt) => (
              <tr key={apt._id} className="group hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all">
                <td className="py-6">
                  <div className="flex flex-col">
                    <span className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight">{apt.patientName}</span>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="flex items-center gap-1 text-[9px] font-bold text-slate-400 uppercase tracking-widest"><Phone className="w-2.5 h-2.5" /> {apt.patientPhone}</span>
                      <span className="flex items-center gap-1 text-[9px] font-bold text-slate-400 uppercase tracking-widest"><MailIcon className="w-2.5 h-2.5" /> {apt.patientEmail}</span>
                    </div>
                  </div>
                </td>
                <td className="py-6">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black text-slate-900 dark:text-white uppercase tracking-tight">{apt.doctorName}</span>
                    <span className="text-[9px] font-bold text-indigo-500 uppercase tracking-widest">{apt.department}</span>
                  </div>
                </td>
                <td className="py-6 text-[10px] font-black text-slate-600 dark:text-slate-400 uppercase tracking-widest">
                  <div className="flex items-center gap-1.5"><Calendar className="w-3 h-3 text-slate-400" /> {new Date(apt.date).toLocaleDateString()}</div>
                  <div className="flex items-center gap-1.5 mt-1"><Clock className="w-3 h-3 text-slate-400" /> {apt.time}</div>
                </td>
                <td className="py-6">
                  <span className="flex items-center gap-1.5 text-[9px] font-black text-slate-500 uppercase tracking-widest">
                    {apt.consultationType === 'video' ? <Video className="w-3.5 h-3.5 text-blue-500" /> : <Users className="w-3.5 h-3.5 text-emerald-500" />}
                    {apt.consultationType}
                  </span>
                </td>
                <td className="py-6">
                  <span className={`px-3 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest ${getStatusColor(apt.status)}`}>
                    {apt.status}
                  </span>
                </td>
                <td className="py-6 text-right">
                   <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg text-slate-400 hover:text-indigo-500 transition-all">
                      <ClipboardList className="w-4 h-4" />
                   </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const VerificationCenter = () => {
  const [pendingRequests, setPendingRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPending = useCallback(async () => {
    try {
      const res = await adminAPI.getPendingRequests();
      setPendingRequests(res.data || []);
    } catch (err) {
      toast.error("Failed to load pending requests");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPending();
    const interval = setInterval(fetchPending, 10000); // Poll every 10 seconds
    return () => clearInterval(interval);
  }, [fetchPending]);

  const handleVerify = async (userId, status) => {
    try {
      await adminAPI.verify(userId, status);
      toast.success(`User ${status} successfully`);
      fetchPending();
    } catch (err) {
      toast.error("Verification failed");
    }
  };

  if (loading && pendingRequests.length === 0) return (
    <div className="p-12 bg-white dark:bg-slate-900 rounded-[3rem] border border-slate-100 dark:border-slate-800 flex justify-center">
      <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
    </div>
  );

  return (
    <div className="bg-white dark:bg-slate-900 p-8 rounded-[3rem] border border-slate-100 dark:border-slate-800 shadow-premium">
      <div className="flex justify-between items-center mb-8 px-2">
        <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight flex items-center gap-3">
          Verification Center
          <span className="px-2 py-0.5 bg-amber-100 text-amber-600 text-[8px] rounded-md font-black uppercase">
            {pendingRequests.length} Pending
          </span>
        </h3>
      </div>
      
      {pendingRequests.length === 0 ? (
        <div className="py-16 text-center">
          <CheckCircle2 className="w-12 h-12 text-emerald-500/20 mx-auto mb-4" />
          <p className="text-sm font-black text-slate-400 uppercase tracking-widest">All caught up! No pending requests.</p>
        </div>
      ) : (
        <div className="space-y-4">
          <AnimatePresence mode="popLayout">
            {pendingRequests.map((req) => (
              <motion.div 
                key={req._id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-[2rem] border border-slate-100 dark:border-slate-800 group hover:border-indigo-300/30 transition-all"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="flex items-center gap-5">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-white text-xl ${req.role === 'doctor' ? 'bg-indigo-500 shadow-lg shadow-indigo-500/20' : 'bg-purple-500 shadow-lg shadow-purple-500/20'}`}>
                      {req.role?.[0].toUpperCase() || 'U'}
                    </div>
                    <div>
                      <h4 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight">{req.name}</h4>
                      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1 flex items-center gap-2">
                        <MailIcon className="w-3 h-3" /> {req.email} • <Phone className="w-3 h-3" /> {req.phone}
                      </p>
                      <div className="flex gap-2 mt-3">
                        <span className="px-2 py-0.5 bg-indigo-100 text-indigo-600 text-[8px] rounded-md font-black uppercase tracking-widest">{req.specialization || 'General'}</span>
                        <span className="px-2 py-0.5 bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400 text-[8px] rounded-md font-black uppercase tracking-widest">{req.hospital || 'Rural Health Network'}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-4">
                    {req.medicalLicenseFile && (
                      <a 
                        href={`https://ruralmed.onrender.com${req.medicalLicenseFile}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-[10px] font-black uppercase tracking-widest text-indigo-500 hover:bg-indigo-500 hover:text-white transition-all shadow-sm"
                      >
                        <FileText className="w-4 h-4" /> View License
                      </a>
                    )}
                    <div className="h-8 w-px bg-slate-200 dark:bg-slate-700 hidden md:block" />
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => handleVerify(req._id, 'approved')}
                        className="px-6 py-2.5 bg-emerald-500 text-white text-[10px] font-black uppercase rounded-xl hover:scale-105 active:scale-95 transition-all shadow-lg shadow-emerald-500/20"
                      >
                        Approve
                      </button>
                      <button 
                        onClick={() => handleVerify(req._id, 'rejected')}
                        className="px-6 py-2.5 bg-red-500 text-white text-[10px] font-black uppercase rounded-xl hover:scale-105 active:scale-95 transition-all shadow-lg shadow-red-500/20"
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

const AdminDashboard = () => {
  const { theme, liteMode } = useTheme();
  const [stats, setStats] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = useCallback(async () => {
    try {
      const [statsRes, chartRes, analyticsRes] = await Promise.all([
        adminAPI.getStats(),
        adminAPI.getChartData(),
        adminAPI.getAnalytics()
      ]);
      setStats(statsRes.data);
      setChartData(chartRes.data);
      setAnalytics(analyticsRes.data);
    } catch (err) {
      toast.error("Dashboard synchronization error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
    const interval = setInterval(fetchDashboardData, 30000); // Update every 30s
    return () => clearInterval(interval);
  }, [fetchDashboardData]);

  if (loading && !stats) return (
    <div className="flex flex-col items-center justify-center py-40 gap-6">
      <Loader2 className="w-16 h-16 text-indigo-500 animate-spin" />
      <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Initializing Command Center...</h2>
    </div>
  );

  const mainStats = [
    { label: 'Total Patients', value: stats?.totalPatients || 0, icon: Users, color: 'text-blue-500', bg: 'bg-blue-500/10', trend: '+12%' },
    { label: 'Total Doctors', value: stats?.totalDoctors || 0, icon: Stethoscope, color: 'text-emerald-500', bg: 'bg-emerald-500/10', trend: '+2' },
    { label: 'Active Doctors', value: stats?.activeDoctors || 0, icon: UserCheck, color: 'text-teal-500', bg: 'bg-teal-500/10', sub: 'Available Now' },
    { label: 'Total Appointments', value: stats?.totalAppointments || 0, icon: Calendar, color: 'text-indigo-500', bg: 'bg-indigo-500/10', trend: '+18%' },
    { label: 'Consultations', value: stats?.completedConsultations || 0, icon: CheckCircle2, color: 'text-purple-500', bg: 'bg-purple-500/10', trend: '+24%' },
    { label: 'Pending', value: stats?.pendingAppointments || 0, icon: Clock, color: 'text-amber-500', bg: 'bg-amber-500/10', trend: '-5%' },
    { label: 'Cancelled', value: stats?.cancelledAppointments || 0, icon: XCircle, color: 'text-red-500', bg: 'bg-red-500/10', trend: '+2%' },
    { label: 'Emergency', value: stats?.emergencyRequests || 0, icon: AlertCircle, color: 'text-red-600', bg: 'bg-red-600/10', pulse: true },
    { label: 'Pharmacies', value: stats?.totalPharmacies || 0, icon: ShoppingBag, color: 'text-cyan-500', bg: 'bg-cyan-500/10', trend: '+1' },
    { label: 'Meds Sold Today', value: stats?.medicinesSoldToday || 0, icon: TrendingUp, color: 'text-rose-500', bg: 'bg-rose-500/10', trend: '+45%' },
    { label: 'Low Stock', value: stats?.lowStockMedicines || 0, icon: Pill, color: 'text-orange-500', bg: 'bg-orange-500/10', sub: 'Alert Required' },
    { label: 'Platform Health', value: '99.9%', icon: Activity, color: 'text-emerald-400', bg: 'bg-emerald-400/10', sub: 'Optimized' },
  ];

  return (
    <div className="space-y-8 pb-20">
      <Toaster />
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-4xl font-black text-slate-900 dark:text-white uppercase tracking-tight flex items-center gap-3">
            Real-Time <span className="text-indigo-500">Command Center</span>
            <span className="flex h-3 w-3 rounded-full bg-emerald-500 animate-pulse" />
          </h1>
          <div className="flex items-center gap-2 mt-1">
            <Globe className="w-3 h-3 text-slate-400" />
            <p className="text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest text-[10px]">
              Monitoring 124 villages across the RuralMed network
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-3 w-full md:w-auto">
           <div className="relative flex-1 md:flex-none">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search analytics..." 
                className="w-full md:w-64 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl pl-11 pr-4 py-3 outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all text-sm font-bold shadow-sm"
              />
           </div>
           <button className="p-3 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl text-slate-400 hover:text-indigo-500 transition-all shadow-sm">
              <Filter className="w-5 h-5" />
           </button>
           <button className="relative p-3 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl text-slate-400 hover:text-indigo-500 transition-all shadow-sm">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full animate-ping" />
           </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-5">
        <AnimatePresence mode="popLayout">
          {mainStats.map((stat, i) => (
            <motion.div 
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className={`bg-white dark:bg-slate-900 p-6 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-premium relative group overflow-hidden ${stat.pulse ? 'ring-2 ring-red-500/20' : ''}`}
            >
              <div className="relative z-10">
                <div className="flex justify-between items-start mb-4">
                  <div className={`${stat.bg} ${stat.color} p-3 rounded-2xl group-hover:scale-110 transition-transform`}>
                    <stat.icon className="w-6 h-6" />
                  </div>
                  {stat.trend && (
                    <span className={`text-[10px] font-black px-2 py-1 rounded-lg flex items-center gap-1 ${stat.trend.startsWith('+') ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'}`}>
                      {stat.trend.startsWith('+') ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                      {stat.trend}
                    </span>
                  )}
                </div>
                <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight mb-1">{stat.value?.toLocaleString() || 0}</h3>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 leading-none">{stat.label}</p>
                {stat.sub && <p className="text-[9px] font-bold text-slate-500 mt-2 uppercase tracking-wider">{stat.sub}</p>}
              </div>
              
              <div className={`absolute -right-4 -bottom-4 w-16 h-16 rounded-full blur-2xl opacity-10 ${stat.color.replace('text-', 'bg-')}`} />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-8 rounded-[3rem] border border-slate-100 dark:border-slate-800 shadow-premium">
          <div className="flex justify-between items-center mb-8 px-2">
            <div>
              <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">System Utilization</h3>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">Weekly consultation vs appointment volume</p>
            </div>
            <div className="flex gap-4">
              <span className="flex items-center gap-1.5 text-[10px] font-black text-indigo-500 uppercase"><div className="w-2 h-2 rounded-full bg-indigo-500" /> Appointments</span>
              <span className="flex items-center gap-1.5 text-[10px] font-black text-emerald-500 uppercase"><div className="w-2 h-2 rounded-full bg-emerald-500" /> Consultations</span>
            </div>
          </div>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorApp" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.15}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorCons" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.15}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={theme === 'dark' ? '#1e293b' : '#f1f5f9'} />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: theme === 'dark' ? '#64748b' : '#94a3b8', fontSize: 10, fontWeight: 900 }} 
                  dy={10} 
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: theme === 'dark' ? '#64748b' : '#94a3b8', fontSize: 10, fontWeight: 900 }} 
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: theme === 'dark' ? '#0f172a' : '#ffffff', 
                    border: 'none', 
                    borderRadius: '16px', 
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                    color: theme === 'dark' ? '#fff' : '#1e293b' 
                  }} 
                />
                <Area type="monotone" dataKey="appointments" stroke="#6366f1" strokeWidth={4} fillOpacity={1} fill="url(#colorApp)" isAnimationActive={!liteMode} />
                <Area type="monotone" dataKey="consultations" stroke="#10b981" strokeWidth={4} fillOpacity={1} fill="url(#colorCons)" isAnimationActive={!liteMode} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-8 rounded-[3rem] border border-slate-100 dark:border-slate-800 shadow-premium flex flex-col">
          <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight mb-8 px-2">Department Mix</h3>
          <div className="flex-1 flex flex-col items-center justify-center">
            <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={analytics?.departmentData || []}
                    cx="50%" cy="50%"
                    innerRadius={60} outerRadius={85}
                    paddingAngle={8} dataKey="value"
                  >
                    {analytics?.departmentData?.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: theme === 'dark' ? '#0f172a' : '#ffffff', 
                      border: 'none', 
                      borderRadius: '16px', 
                      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                      color: theme === 'dark' ? '#fff' : '#1e293b' 
                    }} 
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-4 w-full mt-8">
              {analytics?.departmentData?.map((d, i) => (
                <div key={d.name} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest truncate">{d.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Regional Capacity Optimization - Addressing Nabha Staff Shortage */}
      <div className="bg-gradient-to-br from-indigo-900 to-slate-900 p-10 rounded-[3rem] border border-indigo-500/20 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-full h-full opacity-10">
          <Globe className="absolute -right-20 -top-20 w-96 h-96 text-white" />
        </div>
        
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-500/20 rounded-full text-[10px] font-black uppercase tracking-widest text-indigo-300 mb-6 border border-indigo-500/30">
              <Activity className="w-3 h-3" /> Load Balancing Active
            </div>
            <h2 className="text-3xl font-black text-white uppercase tracking-tight mb-4">Regional Resource <span className="text-indigo-400">Optimization</span></h2>
            <p className="text-indigo-200/70 text-sm font-medium mb-8 leading-relaxed max-w-xl">
              Nabha Civil Hospital is currently operating at <span className="text-white font-black text-lg">47%</span> staff capacity. 
              RuralMed AI is automatically routing non-critical video consultations to available specialists in Ludhiana and Patiala hubs to reduce wait times.
            </p>
            <div className="flex gap-4">
              <button className="px-6 py-3 bg-white text-indigo-900 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-white/10">
                Deploy Remote Staff
              </button>
              <button className="px-6 py-3 bg-indigo-500/20 border border-indigo-500/30 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-500/30 transition-all">
                View Network Load
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/5 backdrop-blur-xl p-6 rounded-[2rem] border border-white/10">
               <p className="text-[10px] font-black text-indigo-300 uppercase tracking-widest mb-1">Current Wait Time</p>
               <h4 className="text-2xl font-black text-white">12 <span className="text-xs text-indigo-300">mins</span></h4>
               <div className="mt-4 h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full w-[30%] bg-emerald-500" />
               </div>
            </div>
            <div className="bg-white/5 backdrop-blur-xl p-6 rounded-[2rem] border border-white/10">
               <p className="text-[10px] font-black text-indigo-300 uppercase tracking-widest mb-1">Remote Doctors</p>
               <h4 className="text-2xl font-black text-white">08 <span className="text-xs text-indigo-300">Active</span></h4>
               <div className="mt-4 h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full w-[80%] bg-indigo-400" />
               </div>
            </div>
          </div>
        </div>
      </div>

      {/* Monitoring & Leadership */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        <ConsultationMonitoring />
        <VerificationCenter />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* Doctor Activity */}
        <div className="bg-white dark:bg-slate-900 p-8 rounded-[3rem] border border-slate-100 dark:border-slate-800 shadow-premium overflow-hidden">
          <div className="flex justify-between items-center mb-8 px-2">
            <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight flex items-center gap-3">
              Elite Performance Monitor
              <span className="px-2 py-0.5 bg-emerald-100 text-emerald-600 text-[8px] rounded-md font-black uppercase">Real Data</span>
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-50 dark:border-slate-800">
                  <th className="pb-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Practitioner</th>
                  <th className="pb-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Domain</th>
                  <th className="pb-4 text-[10px] font-black uppercase tracking-widest text-slate-400 text-center">Consults</th>
                  <th className="pb-4 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Rating</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 dark:divide-slate-800 font-bold">
                {analytics?.doctorPerformance?.slice(0, 6).map((dr, i) => (
                  <tr key={dr._id || i} className="group hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all">
                    <td className="py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-500 to-blue-500 flex items-center justify-center text-xs font-black text-white shadow-md">
                          {dr.name?.[0] || 'D'}
                        </div>
                        <span className="text-sm text-slate-900 dark:text-white uppercase tracking-tight">{dr.name}</span>
                      </div>
                    </td>
                    <td className="py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">{dr.specialization || 'General'}</td>
                    <td className="py-4 text-center text-sm text-slate-600 dark:text-slate-400 font-black">{dr.consultations}</td>
                    <td className="py-4 text-right">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 dark:bg-amber-900/20 text-amber-600 text-[10px] font-black rounded-xl">
                        ⭐ {dr.rating}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pharmacy Monitoring */}
        <div className="bg-white dark:bg-slate-900 p-8 rounded-[3rem] border border-slate-100 dark:border-slate-800 shadow-premium">
          <div className="flex justify-between items-center mb-8 px-2">
            <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Regional Inventory Status</h3>
            <div className="flex items-center gap-2 text-emerald-500 text-[10px] font-black uppercase">
               <TrendingUp className="w-3 h-3" /> Supply Chain Stable
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-50 dark:border-slate-800">
                  <th className="pb-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Critical Stock</th>
                  <th className="pb-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Inventory</th>
                  <th className="pb-4 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 dark:divide-slate-800 font-bold">
                {[
                  { name: 'Paracetamol 500mg', stock: 450, status: 'In Stock' },
                  { name: 'Amoxicillin 250mg', stock: 12, status: 'Low Stock' },
                  { name: 'Cough Syrup', stock: 0, status: 'Out of Stock' },
                  { name: 'Vitamin C', stock: 85, status: 'In Stock' },
                  { name: 'Insulin Glargine', stock: 8, status: 'Low Stock' },
                ].map((med, i) => (
                  <tr key={i} className="group hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all">
                    <td className="py-4">
                      <span className="text-sm text-slate-900 dark:text-white uppercase tracking-tight">{med.name}</span>
                    </td>
                    <td className="py-4 text-sm text-slate-600 dark:text-slate-400 font-black">{med.stock} units</td>
                    <td className="py-4 text-right">
                      <span className={`text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${
                        med.status === 'In Stock' ? 'bg-emerald-100 text-emerald-600' : 
                        med.status === 'Low Stock' ? 'bg-amber-100 text-amber-600' : 'bg-red-100 text-red-600'
                      }`}>
                        {med.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <button className="w-full mt-8 py-4 bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-indigo-500/10 hover:text-indigo-500 transition-all">
            Open Global Supply Chain Logs
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
