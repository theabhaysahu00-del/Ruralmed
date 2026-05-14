import React, { useState, useEffect } from 'react';
import {
  BarChart3, TrendingUp, Users, Calendar, DollarSign,
  Activity, Loader2, Stethoscope, AlertCircle, ArrowUpRight
} from 'lucide-react';
import { motion } from 'framer-motion';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, AreaChart, Area, PieChart, Pie, Cell,
  LineChart, Line, Legend, RadarChart, Radar, PolarGrid,
  PolarAngleAxis, PolarRadiusAxis
} from 'recharts';
import { adminAPI } from '../services/api';
import toast from 'react-hot-toast';

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

const AdminReports = () => {
  const [analytics, setAnalytics] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState('monthly');

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      try {
        const [analyticsRes, statsRes] = await Promise.all([
          adminAPI.getAnalytics(),
          adminAPI.getStats(),
        ]);
        setAnalytics(analyticsRes.data);
        setStats(statsRes.data);
      } catch (err) {
        toast.error('Failed to load analytics');
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-32">
        <Loader2 className="w-12 h-12 text-indigo-500 animate-spin" />
      </div>
    );
  }

  const { monthlyData = [], departmentData = [], doctorPerformance = [] } = analytics || {};

  const kpiCards = [
    { label: 'Total Revenue', value: `₹${(stats?.weeklyRevenue || 125000).toLocaleString('en-IN')}`, icon: DollarSign, color: 'text-emerald-500', bg: 'bg-emerald-500/10', trend: '+18%' },
    { label: 'Total Patients', value: stats?.totalPatients || 0, icon: Users, color: 'text-blue-500', bg: 'bg-blue-500/10', trend: '+12%' },
    { label: 'Consultations', value: stats?.completedConsultations || 0, icon: Activity, color: 'text-purple-500', bg: 'bg-purple-500/10', trend: '+24%' },
    { label: 'Appointments', value: stats?.totalAppointments || 0, icon: Calendar, color: 'text-indigo-500', bg: 'bg-indigo-500/10', trend: '+15%' },
    { label: 'Active Doctors', value: stats?.activeDoctors || 0, icon: Stethoscope, color: 'text-teal-500', bg: 'bg-teal-500/10', trend: '+3' },
    { label: 'Emergency Cases', value: stats?.emergencyRequests || 0, icon: AlertCircle, color: 'text-red-500', bg: 'bg-red-500/10', trend: '-2%' },
  ];

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight flex items-center gap-3">
            <BarChart3 className="w-8 h-8 text-indigo-500" />
            Reports & Analytics
          </h1>
          <p className="text-slate-500 dark:text-slate-400 font-bold text-[10px] uppercase tracking-widest mt-1">
            Enterprise healthcare performance insights
          </p>
        </div>
        <div className="flex gap-2">
          {['weekly', 'monthly', 'yearly'].map(p => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                period === p
                  ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-lg'
                  : 'bg-white dark:bg-slate-900 text-slate-500 border border-slate-200 dark:border-slate-800'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {kpiCards.map((card, i) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="bg-white dark:bg-slate-900 p-5 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-lg group hover:shadow-xl transition-all"
          >
            <div className="flex justify-between items-start mb-3">
              <div className={`${card.bg} ${card.color} p-2.5 rounded-xl group-hover:scale-110 transition-transform`}>
                <card.icon className="w-5 h-5" />
              </div>
              <span className={`text-[9px] font-black px-2 py-0.5 rounded-lg flex items-center gap-0.5 ${
                card.trend.startsWith('+') ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'
              }`}>
                <ArrowUpRight className="w-2.5 h-2.5" />{card.trend}
              </span>
            </div>
            <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">{typeof card.value === 'number' ? card.value.toLocaleString() : card.value}</h3>
            <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mt-1">{card.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Consultation Trends */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="lg:col-span-2 bg-white dark:bg-slate-900 p-8 rounded-[3rem] border border-slate-100 dark:border-slate-800 shadow-lg"
        >
          <div className="flex justify-between items-center mb-8 px-2">
            <div>
              <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Consultation Trends</h3>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">Patients, appointments & consultations over time</p>
            </div>
          </div>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyData}>
                <defs>
                  <linearGradient id="colorP" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorA" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorC" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 900 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 900 }} />
                <Tooltip contentStyle={tooltipStyle} />
                <Area type="monotone" dataKey="patients" stroke="#3b82f6" strokeWidth={3} fill="url(#colorP)" />
                <Area type="monotone" dataKey="appointments" stroke="#10b981" strokeWidth={3} fill="url(#colorA)" />
                <Area type="monotone" dataKey="consultations" stroke="#8b5cf6" strokeWidth={3} fill="url(#colorC)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="flex gap-6 justify-center mt-4">
            {[
              { key: 'Patients', color: '#3b82f6' },
              { key: 'Appointments', color: '#10b981' },
              { key: 'Consultations', color: '#8b5cf6' },
            ].map(l => (
              <span key={l.key} className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-slate-500">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: l.color }} /> {l.key}
              </span>
            ))}
          </div>
        </motion.div>

        {/* Department Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="bg-white dark:bg-slate-900 p-8 rounded-[3rem] border border-slate-100 dark:border-slate-800 shadow-lg flex flex-col"
        >
          <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight mb-6 px-2">Department Mix</h3>
          <div className="flex-1 flex items-center justify-center">
            <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={departmentData}
                    cx="50%" cy="50%"
                    innerRadius={55} outerRadius={85}
                    paddingAngle={5} dataKey="value"
                  >
                    {departmentData.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={tooltipStyle} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 mt-4">
            {departmentData.map((d, i) => (
              <div key={d.name} className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest truncate">{d.name} ({d.value}%)</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Second Row: Revenue + Doctor Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Revenue Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="bg-white dark:bg-slate-900 p-8 rounded-[3rem] border border-slate-100 dark:border-slate-800 shadow-lg"
        >
          <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight mb-2 px-2">Revenue Analytics</h3>
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-8 px-2">Monthly platform revenue (₹)</p>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData} barCategoryGap="30%">
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 900 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 900 }} />
                <Tooltip contentStyle={tooltipStyle} formatter={(v) => [`₹${v.toLocaleString('en-IN')}`, 'Revenue']} />
                <Bar dataKey="revenue" fill="#10b981" radius={[12, 12, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Doctor Performance */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
          className="bg-white dark:bg-slate-900 p-8 rounded-[3rem] border border-slate-100 dark:border-slate-800 shadow-lg"
        >
          <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight mb-2 px-2">Doctor Performance</h3>
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-6 px-2">Top performing doctors by consultations</p>
          <div className="space-y-4">
            {doctorPerformance.map((doc, i) => (
              <motion.div
                key={doc._id || i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + i * 0.05 }}
                className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
              >
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-blue-500 flex items-center justify-center text-white font-black text-sm shadow-md">
                  {i + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight truncate">{doc.name}</p>
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{doc.specialization || 'General'}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-sm font-black text-indigo-600">{doc.consultations}</p>
                  <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">consults</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-sm font-black text-amber-500">⭐ {doc.rating}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-sm font-black text-emerald-600">₹{doc.revenue?.toLocaleString('en-IN')}</p>
                  <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">revenue</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Emergency Trends */}
      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
        className="bg-white dark:bg-slate-900 p-8 rounded-[3rem] border border-slate-100 dark:border-slate-800 shadow-lg"
      >
        <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight mb-2 px-2">Emergency Case Trends</h3>
        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-8 px-2">Monthly emergency cases across the platform</p>
        <div className="h-[250px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 900 }} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 900 }} />
              <Tooltip contentStyle={tooltipStyle} />
              <Line type="monotone" dataKey="emergency" stroke="#ef4444" strokeWidth={3} dot={{ fill: '#ef4444', r: 5 }} activeDot={{ r: 7 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminReports;
