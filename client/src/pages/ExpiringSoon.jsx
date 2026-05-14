import React, { useState, useEffect } from 'react';
import { 
  AlertTriangle, Calendar, Package, Search, 
  Trash2, RefreshCw, Loader2, ArrowRight,
  ShieldAlert, Info, Download
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { medicineAPI } from '../services/api';
import toast from 'react-hot-toast';

const ExpiringSoon = () => {
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchExpiringMedicines();
  }, []);

  const fetchExpiringMedicines = async () => {
    setLoading(true);
    try {
      const { data } = await medicineAPI.getInventory();
      // Filter medicines expiring in the next 30 days or already expired
      const today = new Date();
      const thirtyDaysLater = new Date();
      thirtyDaysLater.setDate(today.getDate() + 30);

      const expiring = data.filter(med => {
        const expDate = new Date(med.expiryDate);
        return expDate <= thirtyDaysLater;
      }).sort((a, b) => new Date(a.expiryDate) - new Date(b.expiryDate));

      setMedicines(expiring);
    } catch (err) {
      toast.error("Failed to load expiring medicines");
    } finally {
      setLoading(false);
    }
  };

  const getDaysRemaining = (date) => {
    const diff = new Date(date) - new Date();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  const getStatusColor = (days) => {
    if (days < 0) return 'text-red-500 bg-red-500/10 border-red-500/20';
    if (days <= 7) return 'text-orange-500 bg-orange-500/10 border-orange-500/20';
    return 'text-amber-500 bg-amber-500/10 border-amber-500/20';
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
            Expiring <span className="text-red-500">Soon</span>
          </h1>
          <p className="text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest text-[10px] mt-1">
            Inventory monitoring and risk mitigation
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative group">
            <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-pharmacy transition-colors" />
            <input 
              type="text" 
              placeholder="Search critical stock..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl pl-10 pr-4 py-3 w-64 focus:ring-2 focus:ring-red-500/20 outline-none transition-all text-sm font-bold shadow-sm"
            />
          </div>
          <button 
            onClick={fetchExpiringMedicines}
            className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-premium text-slate-400 hover:text-red-500 transition-all"
          >
            <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-red-500 p-8 rounded-[2.5rem] text-white shadow-xl shadow-red-500/20 relative overflow-hidden">
          <h3 className="text-4xl font-black mb-1">{medicines.filter(m => getDaysRemaining(m.expiryDate) < 0).length}</h3>
          <p className="text-[10px] font-black uppercase tracking-widest opacity-80">Expired Medicines</p>
          <ShieldAlert className="absolute -bottom-4 -right-4 w-24 h-24 text-white/10 rotate-12" />
        </div>
        <div className="bg-orange-500 p-8 rounded-[2.5rem] text-white shadow-xl shadow-orange-500/20 relative overflow-hidden">
          <h3 className="text-4xl font-black mb-1">{medicines.filter(m => getDaysRemaining(m.expiryDate) >= 0 && getDaysRemaining(m.expiryDate) <= 7).length}</h3>
          <p className="text-[10px] font-black uppercase tracking-widest opacity-80">Critical (Next 7 Days)</p>
          <AlertTriangle className="absolute -bottom-4 -right-4 w-24 h-24 text-white/10 rotate-12" />
        </div>
        <div className="bg-amber-500 p-8 rounded-[2.5rem] text-white shadow-xl shadow-amber-500/20 relative overflow-hidden">
          <h3 className="text-4xl font-black mb-1">{medicines.filter(m => getDaysRemaining(m.expiryDate) > 7).length}</h3>
          <p className="text-[10px] font-black uppercase tracking-widest opacity-80">Warning (Next 30 Days)</p>
          <Calendar className="absolute -bottom-4 -right-4 w-24 h-24 text-white/10 rotate-12" />
        </div>
      </div>

      {/* Main List */}
      <div className="bg-white dark:bg-slate-900 rounded-[3rem] border border-slate-100 dark:border-slate-800 shadow-premium overflow-hidden">
        <div className="p-8 border-b border-slate-50 dark:border-slate-800 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Critical Inventory List</h2>
          </div>
          <button className="flex items-center gap-2 px-6 py-3 bg-slate-50 dark:bg-slate-800 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-400 hover:bg-slate-100 transition-all">
            <Download className="w-4 h-4" /> Export Report
          </button>
        </div>

        <div className="p-8">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
              {[1, 2, 3].map((i) => (
                <div key={i} className="p-6 rounded-[2rem] border bg-slate-50 dark:bg-slate-800/30 border-slate-100 dark:border-slate-800 animate-pulse">
                  <div className="flex justify-between items-start mb-6">
                    <div className="w-12 h-12 bg-slate-200 dark:bg-slate-800 rounded-2xl" />
                    <div className="w-20 h-6 bg-slate-200 dark:bg-slate-800 rounded-full" />
                  </div>
                  <div className="mb-6 space-y-2">
                    <div className="h-5 w-32 bg-slate-200 dark:bg-slate-800 rounded" />
                    <div className="h-3 w-40 bg-slate-200 dark:bg-slate-800 rounded" />
                  </div>
                  <div className="flex justify-between pt-6 border-t border-slate-200/50 dark:border-slate-700/50">
                    <div className="space-y-1">
                      <div className="h-2 w-12 bg-slate-200 dark:bg-slate-800 rounded" />
                      <div className="h-4 w-20 bg-slate-200 dark:bg-slate-800 rounded" />
                    </div>
                    <div className="space-y-1 text-right">
                      <div className="h-2 w-10 bg-slate-200 dark:bg-slate-800 rounded ml-auto" />
                      <div className="h-4 w-16 bg-slate-200 dark:bg-slate-800 rounded ml-auto" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : medicines.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {medicines.filter(m => m.name.toLowerCase().includes(search.toLowerCase())).map((med, i) => {
                const days = getDaysRemaining(med.expiryDate);
                return (
                  <motion.div
                    key={med._id}
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ delay: i * 0.05, type: 'spring' }}
                    className="p-6 rounded-[2rem] border bg-white/80 backdrop-blur-md dark:bg-slate-900/80 border-slate-100 dark:border-slate-800 shadow-premium group hover:shadow-2xl hover:-translate-y-1 transition-all relative overflow-hidden"
                  >
                    <div className="flex justify-between items-start mb-6">
                      <div className="w-12 h-12 bg-white dark:bg-slate-900 rounded-2xl flex items-center justify-center shadow-sm text-slate-400 group-hover:text-red-500 transition-colors">
                        <Package className="w-6 h-6" />
                      </div>
                      <div className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest border ${getStatusColor(days)}`}>
                        {days < 0 ? 'Expired' : `${days} Days Left`}
                      </div>
                    </div>

                    <div className="mb-6">
                      <h4 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight truncate">{med.name}</h4>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">{med.category} • {med.manufacturer}</p>
                    </div>

                    <div className="flex items-center justify-between pt-6 border-t border-slate-200/50 dark:border-slate-700/50">
                      <div>
                        <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Expiry Date</p>
                        <p className="text-xs font-black text-slate-700 dark:text-slate-300">{new Date(med.expiryDate).toLocaleDateString()}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Stock</p>
                        <p className="text-xs font-black text-red-500">{med.stock} Units</p>
                      </div>
                    </div>

                    <div className="absolute top-0 right-0 w-16 h-16 bg-red-500/5 rounded-full -mr-8 -mt-8" />
                  </motion.div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="w-20 h-20 bg-emerald-50 dark:bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <ShieldAlert className="w-10 h-10 text-emerald-500" />
              </div>
              <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">All Clear!</h3>
              <p className="text-slate-400 text-xs font-bold mt-2 uppercase tracking-widest">No medicines are nearing expiry in the next 30 days</p>
            </div>
          )}
        </div>
      </div>

      {/* Action Notice */}
      <div className="bg-slate-900 dark:bg-slate-950 p-10 rounded-[3rem] text-white flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden shadow-2xl">
        <div className="relative z-10">
          <h3 className="text-2xl font-black uppercase tracking-tight mb-2">Automated Inventory Cleanup</h3>
          <p className="text-slate-400 text-sm font-medium max-w-md">Expired medicines are automatically flagged. Ensure they are disposed of following clinical guidelines and removed from stock.</p>
        </div>
        <button className="relative z-10 px-8 py-5 bg-red-500 text-white rounded-[2rem] text-[10px] font-black uppercase tracking-widest shadow-xl shadow-red-500/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-3">
          <Trash2 className="w-4 h-4" /> Purge Expired Stock
        </button>
        <div className="absolute top-0 right-0 w-64 h-64 bg-red-500 opacity-5 rounded-full -mr-32 -mt-32 blur-3xl" />
      </div>
    </div>
  );
};

export default ExpiringSoon;
