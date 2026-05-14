import React, { useState, useEffect, useCallback } from 'react';
import {
  Calendar, Search, Clock, CheckCircle2, XCircle, Video,
  Users, Loader2, ChevronLeft, ChevronRight, Phone, Mail,
  Stethoscope, Eye, AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { adminAPI } from '../services/api';
import toast from 'react-hot-toast';

const statusConfig = {
  pending: { bg: 'bg-amber-100 dark:bg-amber-900/30', text: 'text-amber-600', icon: Clock, label: 'Pending' },
  confirmed: { bg: 'bg-blue-100 dark:bg-blue-900/30', text: 'text-blue-600', icon: CheckCircle2, label: 'Confirmed' },
  completed: { bg: 'bg-emerald-100 dark:bg-emerald-900/30', text: 'text-emerald-600', icon: CheckCircle2, label: 'Completed' },
  cancelled: { bg: 'bg-red-100 dark:bg-red-900/30', text: 'text-red-600', icon: XCircle, label: 'Cancelled' },
};

const AdminAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 15;

  const fetchAppointments = useCallback(async () => {
    setLoading(true);
    try {
      const params = { search, status: filter, page, limit };
      const res = await adminAPI.getAppointments(params);
      setAppointments(res.data || []);
      setTotal(res.total || 0);
    } catch (err) {
      toast.error('Failed to load appointments');
    } finally {
      setLoading(false);
    }
  }, [search, filter, page]);

  useEffect(() => { fetchAppointments(); }, [fetchAppointments]);

  const handleStatusChange = async (id, status) => {
    try {
      await adminAPI.updateAppointment(id, { status });
      toast.success(`Appointment ${status}`);
      fetchAppointments();
    } catch (err) {
      toast.error('Update failed');
    }
  };

  const totalPages = Math.ceil(total / limit);

  // Count stats from current page (approximation) 
  const statCounts = {
    all: total,
    pending: appointments.filter(a => a.status === 'pending').length,
    confirmed: appointments.filter(a => a.status === 'confirmed').length,
    completed: appointments.filter(a => a.status === 'completed').length,
    cancelled: appointments.filter(a => a.status === 'cancelled').length,
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight flex items-center gap-3">
            <Calendar className="w-8 h-8 text-indigo-500" />
            Appointment Management
          </h1>
          <p className="text-slate-500 dark:text-slate-400 font-bold text-[10px] uppercase tracking-widest mt-1">
            Monitor all platform consultations & appointments
          </p>
        </div>
        <div className="relative w-full lg:w-72">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search appointments..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl pl-11 pr-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500/20 text-sm font-bold shadow-sm transition-all"
          />
        </div>
      </div>

      {/* Status Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[
          { key: 'all', label: 'Total', icon: Calendar, color: 'text-slate-600', bg: 'bg-slate-50 dark:bg-slate-800/50' },
          { key: 'pending', label: 'Pending', icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50 dark:bg-amber-900/20' },
          { key: 'confirmed', label: 'Confirmed', icon: CheckCircle2, color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-900/20' },
          { key: 'completed', label: 'Completed', icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50 dark:bg-emerald-900/20' },
          { key: 'cancelled', label: 'Cancelled', icon: XCircle, color: 'text-red-600', bg: 'bg-red-50 dark:bg-red-900/20' },
        ].map((stat) => (
          <motion.button
            key={stat.key}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => { setFilter(stat.key); setPage(1); }}
            className={`p-4 rounded-2xl border transition-all text-left ${
              filter === stat.key
                ? 'border-indigo-300 dark:border-indigo-700 ring-2 ring-indigo-500/10 shadow-lg'
                : 'border-slate-100 dark:border-slate-800'
            } ${stat.bg}`}
          >
            <stat.icon className={`w-5 h-5 ${stat.color} mb-2`} />
            <p className="text-xl font-black text-slate-900 dark:text-white">{stat.key === 'all' ? total : statCounts[stat.key]}</p>
            <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mt-0.5">{stat.label}</p>
          </motion.button>
        ))}
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-12 h-12 text-indigo-500 animate-spin" />
        </div>
      ) : appointments.length === 0 ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-[3rem] p-16 text-center border border-slate-100 dark:border-slate-800 shadow-lg">
          <Calendar className="w-16 h-16 text-slate-200 dark:text-slate-700 mx-auto mb-6" />
          <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">No Appointments Found</h3>
        </motion.div>
      ) : (
        <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30">
                  <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Patient</th>
                  <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Doctor</th>
                  <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Schedule</th>
                  <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Type</th>
                  <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Status</th>
                  <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                <AnimatePresence>
                  {appointments.map((apt, i) => {
                    const sc = statusConfig[apt.status] || statusConfig.pending;
                    return (
                      <motion.tr
                        key={apt._id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: i * 0.03 }}
                        className="group hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all"
                      >
                        <td className="px-6 py-5">
                          <div>
                            <p className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight">{apt.patientName}</p>
                            <div className="flex items-center gap-3 mt-1">
                              <span className="flex items-center gap-1 text-[9px] font-bold text-slate-400"><Phone className="w-2.5 h-2.5" /> {apt.patientPhone}</span>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <div>
                            <p className="text-[10px] font-black text-slate-900 dark:text-white uppercase tracking-tight">{apt.doctorName}</p>
                            <p className="text-[9px] font-bold text-indigo-500 uppercase tracking-widest">{apt.department}</p>
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <div className="text-[10px] font-black text-slate-600 dark:text-slate-400 uppercase tracking-widest space-y-1">
                            <p className="flex items-center gap-1.5"><Calendar className="w-3 h-3" /> {new Date(apt.date).toLocaleDateString()}</p>
                            <p className="flex items-center gap-1.5"><Clock className="w-3 h-3" /> {apt.time}</p>
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <span className="flex items-center gap-1.5 text-[9px] font-black text-slate-500 uppercase tracking-widest">
                            {apt.consultationType === 'video' ? <Video className="w-3.5 h-3.5 text-blue-500" /> : <Users className="w-3.5 h-3.5 text-emerald-500" />}
                            {apt.consultationType || 'in-person'}
                          </span>
                        </td>
                        <td className="px-6 py-5">
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest ${sc.bg} ${sc.text}`}>
                            <sc.icon className="w-3 h-3" />
                            {sc.label}
                          </span>
                        </td>
                        <td className="px-6 py-5 text-right">
                          <div className="flex items-center gap-1 justify-end">
                            {apt.status === 'pending' && (
                              <>
                                <button
                                  onClick={() => handleStatusChange(apt._id, 'confirmed')}
                                  className="p-2 rounded-xl text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-all"
                                  title="Confirm"
                                >
                                  <CheckCircle2 className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleStatusChange(apt._id, 'cancelled')}
                                  className="p-2 rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
                                  title="Cancel"
                                >
                                  <XCircle className="w-4 h-4" />
                                </button>
                              </>
                            )}
                            {apt.status === 'confirmed' && (
                              <button
                                onClick={() => handleStatusChange(apt._id, 'completed')}
                                className="px-3 py-1.5 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-emerald-200 transition-all"
                              >
                                Complete
                              </button>
                            )}
                            {(apt.status === 'completed' || apt.status === 'cancelled') && (
                              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">—</span>
                            )}
                          </div>
                        </td>
                      </motion.tr>
                    );
                  })}
                </AnimatePresence>
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex flex-col sm:flex-row justify-between items-center px-6 py-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              Showing {appointments.length} of {total} appointments
            </p>
            {totalPages > 1 && (
              <div className="flex items-center gap-3 mt-3 sm:mt-0">
                <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-400 disabled:opacity-40 transition-all">
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{page} / {totalPages}</span>
                <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-400 disabled:opacity-40 transition-all">
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminAppointments;
