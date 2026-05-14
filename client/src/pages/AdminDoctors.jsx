import React, { useState, useEffect, useCallback } from 'react';
import {
  Stethoscope, Search, Filter, CheckCircle2, XCircle, Clock,
  MoreVertical, Eye, Ban, Trash2, UserCheck, UserX,
  Mail, Phone, MapPin, Award, Loader2, ChevronLeft, ChevronRight,
  Shield, Activity, X, FileText
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { adminAPI } from '../services/api';
import toast from 'react-hot-toast';

const statusColors = {
  approved: { bg: 'bg-emerald-100 dark:bg-emerald-900/30', text: 'text-emerald-600', dot: 'bg-emerald-500' },
  pending: { bg: 'bg-amber-100 dark:bg-amber-900/30', text: 'text-amber-600', dot: 'bg-amber-500' },
  rejected: { bg: 'bg-red-100 dark:bg-red-900/30', text: 'text-red-600', dot: 'bg-red-500' },
};

const AdminDoctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [actionMenu, setActionMenu] = useState(null);
  const limit = 12;

  const fetchDoctors = useCallback(async () => {
    setLoading(true);
    try {
      const res = await adminAPI.getDoctors({ search, status: filter, page, limit });
      setDoctors(res.data || []);
      setTotal(res.total || 0);
    } catch (err) {
      toast.error('Failed to load doctors');
    } finally {
      setLoading(false);
    }
  }, [search, filter, page]);

  useEffect(() => { fetchDoctors(); }, [fetchDoctors]);

  const handleAction = async (id, action) => {
    try {
      if (action === 'approve') {
        await adminAPI.updateDoctor(id, { approvalStatus: 'approved' });
        toast.success('Doctor approved');
      } else if (action === 'reject') {
        await adminAPI.updateDoctor(id, { approvalStatus: 'rejected' });
        toast.success('Doctor rejected');
      } else if (action === 'suspend') {
        await adminAPI.updateDoctor(id, { isActive: false });
        toast.success('Doctor suspended');
      } else if (action === 'activate') {
        await adminAPI.updateDoctor(id, { isActive: true });
        toast.success('Doctor activated');
      } else if (action === 'delete') {
        await adminAPI.deleteDoctor(id);
        toast.success('Doctor removed');
      }
      setActionMenu(null);
      fetchDoctors();
    } catch (err) {
      toast.error('Action failed');
    }
  };

  const totalPages = Math.ceil(total / limit);
  const statCounts = {
    all: total,
    approved: doctors.filter(d => d.approvalStatus === 'approved').length,
    pending: doctors.filter(d => d.approvalStatus === 'pending').length,
    rejected: doctors.filter(d => d.approvalStatus === 'rejected').length,
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight flex items-center gap-3">
            <Stethoscope className="w-8 h-8 text-blue-500" />
            Doctor Management
          </h1>
          <p className="text-slate-500 dark:text-slate-400 font-bold text-[10px] uppercase tracking-widest mt-1">
            Manage, verify & monitor all registered doctors
          </p>
        </div>
        <div className="flex items-center gap-3 w-full lg:w-auto">
          <div className="relative flex-1 lg:flex-none">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search doctors..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="w-full lg:w-72 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl pl-11 pr-4 py-3 outline-none focus:ring-2 focus:ring-blue-500/20 text-sm font-bold shadow-sm transition-all"
            />
          </div>
        </div>
      </div>

      {/* Status Filter Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {['all', 'approved', 'pending', 'rejected'].map((s) => (
          <button
            key={s}
            onClick={() => { setFilter(s); setPage(1); }}
            className={`px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap flex items-center gap-2 ${
              filter === s
                ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-lg'
                : 'bg-white dark:bg-slate-900 text-slate-500 border border-slate-200 dark:border-slate-800 hover:border-blue-300'
            }`}
          >
            {s === 'approved' && <CheckCircle2 className="w-3.5 h-3.5" />}
            {s === 'pending' && <Clock className="w-3.5 h-3.5" />}
            {s === 'rejected' && <XCircle className="w-3.5 h-3.5" />}
            {s}
          </button>
        ))}
      </div>

      {/* Doctor Grid */}
      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
        </div>
      ) : doctors.length === 0 ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-[3rem] p-16 text-center border border-slate-100 dark:border-slate-800 shadow-lg">
          <Stethoscope className="w-16 h-16 text-slate-200 dark:text-slate-700 mx-auto mb-6" />
          <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">No Doctors Found</h3>
          <p className="text-slate-400 text-xs font-bold mt-2 uppercase tracking-widest">Try adjusting your search or filters.</p>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {doctors.map((doc, i) => {
              const sc = statusColors[doc.approvalStatus] || statusColors.pending;
              return (
                <motion.div
                  key={doc._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: i * 0.04 }}
                  className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-6 border border-slate-100 dark:border-slate-800 shadow-lg hover:shadow-2xl hover:border-blue-200 dark:hover:border-blue-800 transition-all group relative"
                >
                  {/* Action Menu */}
                  <div className="absolute top-6 right-6">
                    <button
                      onClick={() => setActionMenu(actionMenu === doc._id ? null : doc._id)}
                      className="p-2 rounded-xl text-slate-400 hover:text-blue-500 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
                    >
                      <MoreVertical className="w-5 h-5" />
                    </button>
                    <AnimatePresence>
                      {actionMenu === doc._id && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.9, y: -5 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.9, y: -5 }}
                          className="absolute right-0 top-12 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-2xl overflow-hidden z-50 w-48"
                        >
                          {doc.approvalStatus !== 'approved' && (
                            <button onClick={() => handleAction(doc._id, 'approve')} className="flex items-center gap-3 w-full px-4 py-3 text-xs font-bold text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-all">
                              <UserCheck className="w-4 h-4" /> Approve
                            </button>
                          )}
                          {doc.approvalStatus !== 'rejected' && (
                            <button onClick={() => handleAction(doc._id, 'reject')} className="flex items-center gap-3 w-full px-4 py-3 text-xs font-bold text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all">
                              <UserX className="w-4 h-4" /> Reject
                            </button>
                          )}
                          {doc.isActive ? (
                            <button onClick={() => handleAction(doc._id, 'suspend')} className="flex items-center gap-3 w-full px-4 py-3 text-xs font-bold text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-900/20 transition-all">
                              <Ban className="w-4 h-4" /> Suspend
                            </button>
                          ) : (
                            <button onClick={() => handleAction(doc._id, 'activate')} className="flex items-center gap-3 w-full px-4 py-3 text-xs font-bold text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all">
                              <Activity className="w-4 h-4" /> Activate
                            </button>
                          )}
                          <button onClick={() => handleAction(doc._id, 'delete')} className="flex items-center gap-3 w-full px-4 py-3 text-xs font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all border-t border-slate-100 dark:border-slate-800">
                            <Trash2 className="w-4 h-4" /> Remove
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Avatar + Info */}
                  <div className="flex items-center gap-4 mb-6">
                    <div className="relative">
                      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white text-xl font-black shadow-lg shadow-blue-500/20">
                        {doc.name?.[0]?.toUpperCase() || 'D'}
                      </div>
                      <span className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white dark:border-slate-900 ${doc.isActive ? 'bg-emerald-500' : 'bg-slate-400'}`} />
                    </div>
                    <div className="min-w-0 pr-8">
                      <h3 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight truncate">{doc.name}</h3>
                      <p className="text-[10px] font-bold text-blue-500 uppercase tracking-widest">{doc.specialization || 'General Physician'}</p>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                      <Mail className="w-3.5 h-3.5 text-slate-400" /> {doc.email}
                    </div>
                    <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                      <Phone className="w-3.5 h-3.5 text-slate-400" /> {doc.phone}
                    </div>
                    <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" /> {doc.hospital || 'Rural Health Center'}
                    </div>
                    <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                      <Award className="w-3.5 h-3.5 text-slate-400" /> {doc.experience || '0'} Yrs Experience
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="flex justify-between items-center pt-4 border-t border-slate-100 dark:border-slate-800">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest ${sc.bg} ${sc.text}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${sc.dot}`} />
                      {doc.approvalStatus}
                    </span>
                    {doc.medicalLicenseFile && (
                      <a
                        href={`http://localhost:5000${doc.medicalLicenseFile}`}
                        target="_blank" rel="noopener noreferrer"
                        className="flex items-center gap-1.5 text-[9px] font-black text-blue-500 uppercase tracking-widest hover:underline"
                      >
                        <FileText className="w-3.5 h-3.5" /> License
                      </a>
                    )}
                    <span className={`text-[9px] font-black uppercase tracking-widest ${doc.isActive ? 'text-emerald-500' : 'text-slate-400'}`}>
                      {doc.isActive ? '● Online' : '○ Offline'}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 pt-8">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-400 hover:text-blue-500 disabled:opacity-40 transition-all"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-400 hover:text-blue-500 disabled:opacity-40 transition-all"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
};

export default AdminDoctors;
