import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Calendar, FileText, Activity, MessageSquare, 
  ArrowRight, Search, Heart, Clock,
  ShieldCheck, AlertCircle, Loader2,
  TrendingUp, TrendingDown, Bell, Video, Pill,
  ShoppingBag, Package
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { DashboardSkeleton } from '../components/Skeleton';

const PatientDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { theme } = useTheme();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    upcomingAppointments: 0,
    prescriptionsCount: 0,
    healthScore: 78,
    messagesCount: 0
  });
  const [recentAppointments, setRecentAppointments] = useState([]);
  const [healthData] = useState([
    { name: 'Mon', score: 72 },
    { name: 'Tue', score: 75 },
    { name: 'Wed', score: 73 },
    { name: 'Thu', score: 78 },
    { name: 'Fri', score: 80 },
    { name: 'Sat', score: 76 },
    { name: 'Sun', score: 78 },
  ]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Parallel requests for better performance
      const [apptsRes, prescRes] = await Promise.all([
        api.get('/appointments'),
        api.get('/prescriptions/patient')
      ]);

      if (apptsRes.success) {
        setRecentAppointments(apptsRes.data.slice(0, 3));
        const upcoming = apptsRes.data.filter(a => ['pending', 'confirmed'].includes(a.status)).length;
        setStats(prev => ({ ...prev, upcomingAppointments: upcoming }));
      }

      if (prescRes.success) {
        setStats(prev => ({ ...prev, prescriptionsCount: prescRes.data.length }));
      }
    } catch (err) {
      console.error("Dashboard sync error:", err);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    { label: 'Upcoming Appointments', value: stats.upcomingAppointments, icon: Calendar, color: 'text-primary', bg: 'bg-primary/10', path: '/patient/appointments' },
    { label: 'Active Prescriptions', value: stats.prescriptionsCount, icon: FileText, color: 'text-emerald-500', bg: 'bg-emerald-500/10', path: '/patient/prescriptions' },
    { label: 'Health Index', value: `${stats.healthScore}%`, icon: Activity, color: 'text-amber-500', bg: 'bg-amber-500/10', trend: '+2%', path: '/patient/records' },
    { label: 'New Messages', value: stats.messagesCount, icon: MessageSquare, color: 'text-blue-500', bg: 'bg-blue-500/10', path: '/patient/messages' },
  ];

  if (loading || !user) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="space-y-8 pb-12">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <h1 className="text-4xl font-black text-slate-900 dark:text-white uppercase tracking-tighter leading-none">
            Welcome Back, <span className="text-primary">{user?.name?.split(' ')[0] || 'Patient'}</span>
          </h1>
          <p className="text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest text-[10px] mt-2">
            Your health dashboard is up to date • {new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long' })}
          </p>
        </motion.div>

        <div className="flex items-center gap-4">
          <button className="relative p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-premium group">
            <Bell className="w-6 h-6 text-slate-400 group-hover:text-primary transition-colors" />
            <span className="absolute top-3.5 right-3.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white dark:border-slate-900" />
          </button>
          <div className="flex items-center gap-3 bg-white dark:bg-slate-900 p-2 pr-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-premium">
             <div className="w-10 h-10 rounded-xl overflow-hidden bg-slate-100 border border-slate-200">
               <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name || 'user'}`} alt="" />
             </div>
             <div className="hidden sm:block">
                <p className="text-[10px] font-black uppercase tracking-tight text-slate-900 dark:text-white leading-none mb-0.5">{user?.name || 'User'}</p>
                <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest leading-none">Patient ID: {user?._id ? user._id.slice(-6).toUpperCase() : 'N/A'}</p>
             </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            onClick={() => navigate(stat.path)}
            className="bg-white dark:bg-slate-900 p-6 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-premium group hover:shadow-2xl hover:border-primary/20 transition-all cursor-pointer relative overflow-hidden"
          >
            <div className={`${stat.bg} ${stat.color} w-14 h-14 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
              <stat.icon className="w-7 h-7" />
            </div>
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1 leading-none">{stat.label}</p>
            <div className="flex items-end gap-2">
              <h3 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">{stat.value}</h3>
              {stat.trend && <span className="text-[10px] font-black text-emerald-500 mb-1.5 flex items-center"><TrendingUp className="w-3 h-3 mr-0.5" /> {stat.trend}</span>}
            </div>
            {/* Background design */}
            <div className={`absolute top-0 right-0 w-16 h-16 ${stat.bg} opacity-10 rounded-full -mr-8 -mt-8`} />
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Chart Section */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white dark:bg-slate-900 p-10 rounded-[3rem] border border-slate-100 dark:border-slate-800 shadow-premium">
            <div className="flex justify-between items-center mb-10">
              <div>
                <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Health Index Analysis</h3>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Activity Tracking (Last 7 Days)</p>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl">
                 <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                 <span className="text-[10px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-400">Live Sync</span>
              </div>
            </div>
            
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={healthData}>
                  <defs>
                    <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#22C55E" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#22C55E" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={theme === 'dark' ? '#1e293b' : '#f1f5f9'} />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 10, fontWeight: 900, fill: theme === 'dark' ? '#64748b' : '#94a3b8' }} 
                  />
                  <YAxis hide />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: theme === 'dark' ? '#0f172a' : '#ffffff', 
                      border: 'none', 
                      borderRadius: '16px', 
                      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                      color: theme === 'dark' ? '#fff' : '#1e293b' 
                    }}
                    itemStyle={{ color: '#22C55E', fontWeight: 900, textTransform: 'uppercase', fontSize: '10px' }}
                  />
                  <Area type="monotone" dataKey="score" stroke="#22C55E" strokeWidth={4} fillOpacity={1} fill="url(#colorScore)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Quick Actions / Shortcuts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-2xl">
              <h3 className="text-xl font-black uppercase tracking-tight mb-4">Order Medicines</h3>
              <p className="text-slate-400 text-xs font-medium mb-8 leading-relaxed">Purchase essential medicines from verified pharmacies near you.</p>
              <button 
                onClick={() => navigate('/patient/order-medicines')}
                className="w-full py-4 bg-pharmacy text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-pharmacy/20 hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
              >
                <Pill className="w-4 h-4" /> Browse Shop
              </button>
              <Package className="absolute -bottom-4 -right-4 w-24 h-24 text-white/5 rotate-12" />
            </div>

            <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-premium flex flex-col">
              <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight mb-2">Track Deliveries</h3>
              <p className="text-slate-500 dark:text-slate-400 text-xs font-medium mb-8">Real-time status of your active medicine orders.</p>
              <button 
                onClick={() => navigate('/patient/my-orders')}
                className="mt-auto w-full py-4 bg-purple-500 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-purple-500/20 hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
              >
                <ShoppingBag className="w-4 h-4" /> My Orders
              </button>
            </div>
          </div>
        </div>

        {/* Sidebar Sections */}
        <div className="space-y-8">
          {/* Upcoming Consultations */}
          <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-premium">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight">Upcoming</h3>
              <button onClick={() => navigate('/patient/appointments')} className="text-[10px] font-black text-primary uppercase tracking-widest hover:underline">View All</button>
            </div>
            
            <div className="space-y-6">
              {recentAppointments.length > 0 ? (
                recentAppointments.map((app) => (
                  <div key={app._id} className="flex items-center gap-4 group">
                    <div className="w-12 h-12 rounded-2xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400 border border-slate-100 dark:border-slate-700">
                      <Clock className="w-6 h-6" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight truncate">{app.doctorName || 'Specialist'}</h4>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{app.time} • {new Date(app.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}</p>
                    </div>
                    <button className="w-8 h-8 rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-400 hover:text-primary hover:bg-primary/10 transition-all flex items-center justify-center">
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                ))
              ) : (
                <div className="text-center py-6">
                   <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">No pending visits</p>
                </div>
              )}
            </div>
          </div>

          {/* AI Recommendation Card */}
          <div className="bg-gradient-to-br from-primary to-emerald-600 rounded-[2.5rem] p-8 text-white shadow-2xl relative overflow-hidden">
            <div className="relative z-10">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-xl rounded-2xl flex items-center justify-center mb-6">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-black uppercase tracking-tight mb-2">Smart Health Check</h3>
              <p className="text-white/80 text-xs font-medium mb-8 leading-relaxed">
                Our AI noticed your activity levels are slightly down. Would you like to perform a quick symptom analysis?
              </p>
              <button 
                onClick={() => navigate('/patient/symptom-checker')}
                className="px-6 py-3 bg-white text-primary rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-black/10 hover:scale-105 transition-all"
              >
                Analyze Now
              </button>
            </div>
            {/* Design design */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl" />
          </div>

          {/* Health Metrics Mini-List */}
          <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-premium">
            <h3 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight mb-8">Vital Metrics</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-red-50 dark:bg-red-900/10 rounded-2xl border border-red-100 dark:border-red-900/20">
                <Heart className="w-5 h-5 text-red-500 mb-2" />
                <p className="text-[18px] font-black text-slate-900 dark:text-white">72 <span className="text-[10px] text-slate-400">bpm</span></p>
                <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Heart Rate</p>
              </div>
              <div className="p-4 bg-emerald-50 dark:bg-emerald-900/10 rounded-2xl border border-emerald-100 dark:border-emerald-900/20">
                <Activity className="w-5 h-5 text-emerald-500 mb-2" />
                <p className="text-[18px] font-black text-slate-900 dark:text-white">98 <span className="text-[10px] text-slate-400">%</span></p>
                <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">SpO2 Level</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientDashboard;
