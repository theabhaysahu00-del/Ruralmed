import React, { useState, useEffect, useCallback } from 'react';
import {
  Pill, Search, CheckCircle2, Ban, Loader2,
  ChevronLeft, ChevronRight, MoreVertical, Mail, Phone,
  MapPin, ShoppingBag, Activity, Package
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { adminAPI } from '../services/api';
import toast from 'react-hot-toast';

const AdminPharmacies = () => {
  const [pharmacies, setPharmacies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [actionMenu, setActionMenu] = useState(null);
  const limit = 12;

  const fetchPharmacies = useCallback(async () => {
    setLoading(true);
    try {
      const params = { search, page, limit };
      if (filter !== 'all') params.status = filter;
      const res = await adminAPI.getPharmacies(params);
      setPharmacies(res.data || []);
      setTotal(res.total || 0);
    } catch (err) {
      toast.error('Failed to load pharmacies');
    } finally {
      setLoading(false);
    }
  }, [search, filter, page]);

  useEffect(() => { fetchPharmacies(); }, [fetchPharmacies]);

  const handleAction = async (id, action) => {
    try {
      if (action === 'approve') {
        await adminAPI.updatePharmacy(id, { approvalStatus: 'approved', isActive: true });
        toast.success('Pharmacy approved');
      } else if (action === 'suspend') {
        await adminAPI.updatePharmacy(id, { isActive: false });
        toast.success('Pharmacy suspended');
      } else if (action === 'activate') {
        await adminAPI.updatePharmacy(id, { isActive: true });
        toast.success('Pharmacy activated');
      }
      setActionMenu(null);
      fetchPharmacies();
    } catch (err) {
      toast.error('Action failed');
    }
  };

  const totalPages = Math.ceil(total / limit);

  // Simulated enrichment data for display
  const enrichPharmacy = (ph, i) => ({
    ...ph,
    medicinesCount: Math.floor(Math.random() * 200) + 50,
    ordersToday: Math.floor(Math.random() * 30) + 5,
    revenue: (Math.floor(Math.random() * 50000) + 15000).toLocaleString('en-IN'),
  });

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight flex items-center gap-3">
            <Pill className="w-8 h-8 text-cyan-500" />
            Pharmacy Management
          </h1>
          <p className="text-slate-500 dark:text-slate-400 font-bold text-[10px] uppercase tracking-widest mt-1">
            Monitor & manage all registered pharmacies
          </p>
        </div>
        <div className="relative w-full lg:w-72">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search pharmacies..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl pl-11 pr-4 py-3 outline-none focus:ring-2 focus:ring-cyan-500/20 text-sm font-bold shadow-sm transition-all"
          />
        </div>
      </div>

      {/* Filter */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {['all', 'active', 'suspended'].map((s) => (
          <button
            key={s}
            onClick={() => { setFilter(s); setPage(1); }}
            className={`px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${
              filter === s
                ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-lg'
                : 'bg-white dark:bg-slate-900 text-slate-500 border border-slate-200 dark:border-slate-800'
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {/* Grid */}
      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-12 h-12 text-cyan-500 animate-spin" />
        </div>
      ) : pharmacies.length === 0 ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-[3rem] p-16 text-center border border-slate-100 dark:border-slate-800 shadow-lg">
          <Package className="w-16 h-16 text-slate-200 dark:text-slate-700 mx-auto mb-6" />
          <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">No Pharmacies Found</h3>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {pharmacies.map((ph, i) => {
              const enriched = enrichPharmacy(ph, i);
              return (
                <motion.div
                  key={ph._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: i * 0.04 }}
                  className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-6 border border-slate-100 dark:border-slate-800 shadow-lg hover:shadow-2xl hover:border-cyan-200 dark:hover:border-cyan-800 transition-all group relative"
                >
                  {/* Actions */}
                  <div className="absolute top-6 right-6">
                    <button
                      onClick={() => setActionMenu(actionMenu === ph._id ? null : ph._id)}
                      className="p-2 rounded-xl text-slate-400 hover:text-cyan-500 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
                    >
                      <MoreVertical className="w-5 h-5" />
                    </button>
                    <AnimatePresence>
                      {actionMenu === ph._id && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.9 }}
                          className="absolute right-0 top-12 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-2xl z-50 w-44 overflow-hidden"
                        >
                          {ph.approvalStatus === 'pending' && (
                            <button onClick={() => handleAction(ph._id, 'approve')} className="flex items-center gap-3 w-full px-4 py-3 text-xs font-bold text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20">
                              <CheckCircle2 className="w-4 h-4" /> Approve
                            </button>
                          )}
                          {ph.isActive ? (
                            <button onClick={() => handleAction(ph._id, 'suspend')} className="flex items-center gap-3 w-full px-4 py-3 text-xs font-bold text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-900/20">
                              <Ban className="w-4 h-4" /> Suspend
                            </button>
                          ) : (
                            <button onClick={() => handleAction(ph._id, 'activate')} className="flex items-center gap-3 w-full px-4 py-3 text-xs font-bold text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20">
                              <Activity className="w-4 h-4" /> Activate
                            </button>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Avatar + Info */}
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500 to-teal-500 flex items-center justify-center text-white text-xl font-black shadow-lg shadow-cyan-500/20">
                      <Pill className="w-7 h-7" />
                    </div>
                    <div className="pr-8 min-w-0">
                      <h3 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight truncate">{ph.name}</h3>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                        <Mail className="w-3 h-3" /> {ph.email}
                      </p>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-3 mb-6">
                    <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-3 text-center">
                      <p className="text-lg font-black text-slate-900 dark:text-white">{enriched.medicinesCount}</p>
                      <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Medicines</p>
                    </div>
                    <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-3 text-center">
                      <p className="text-lg font-black text-slate-900 dark:text-white">{enriched.ordersToday}</p>
                      <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Orders</p>
                    </div>
                    <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-3 text-center">
                      <p className="text-lg font-black text-cyan-600">₹{enriched.revenue}</p>
                      <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Revenue</p>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="space-y-2 mb-6">
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
                      <Phone className="w-3 h-3 text-slate-400" /> {ph.phone}
                    </p>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
                      <MapPin className="w-3 h-3 text-slate-400" /> {ph.village || ph.clinicName || 'RuralMed Network'}
                    </p>
                  </div>

                  {/* Status Footer */}
                  <div className="flex justify-between items-center pt-4 border-t border-slate-100 dark:border-slate-800">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest ${
                      ph.approvalStatus === 'approved' ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600' :
                      ph.approvalStatus === 'pending' ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-600' :
                      'bg-red-100 dark:bg-red-900/30 text-red-600'
                    }`}>
                      {ph.approvalStatus}
                    </span>
                    <span className={`text-[9px] font-black uppercase tracking-widest ${ph.isActive ? 'text-emerald-500' : 'text-slate-400'}`}>
                      {ph.isActive ? '● Active' : '○ Inactive'}
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
          <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-400 hover:text-cyan-500 disabled:opacity-40 transition-all">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Page {page} of {totalPages}</span>
          <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-400 hover:text-cyan-500 disabled:opacity-40 transition-all">
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
};

export default AdminPharmacies;
