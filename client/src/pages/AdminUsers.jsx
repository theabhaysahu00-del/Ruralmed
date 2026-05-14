import React, { useState, useEffect, useCallback } from 'react';
import {
  Users, Search, Mail, Phone, MapPin,
  Ban, Trash2, UserCheck, Loader2, ChevronLeft, ChevronRight,
  Activity, Eye, MoreVertical, Calendar, Shield
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { adminAPI } from '../services/api';
import toast from 'react-hot-toast';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [actionMenu, setActionMenu] = useState(null);
  const limit = 15;

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const params = { role: 'patient', search, page, limit };
      if (filter !== 'all') params.status = filter;
      const res = await adminAPI.getUsers(params);
      setUsers(res.data || []);
      setTotal(res.total || 0);
    } catch (err) {
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  }, [search, filter, page]);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  const handleAction = async (id, action) => {
    try {
      if (action === 'suspend') {
        await adminAPI.updateUser(id, { isActive: false });
        toast.success('User suspended');
      } else if (action === 'activate') {
        await adminAPI.updateUser(id, { isActive: true });
        toast.success('User activated');
      } else if (action === 'delete') {
        await adminAPI.deleteUser(id);
        toast.success('User removed');
      }
      setActionMenu(null);
      fetchUsers();
    } catch (err) {
      toast.error('Action failed');
    }
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight flex items-center gap-3">
            <Users className="w-8 h-8 text-indigo-500" />
            User Management
          </h1>
          <p className="text-slate-500 dark:text-slate-400 font-bold text-[10px] uppercase tracking-widest mt-1">
            Manage all registered patients & platform users
          </p>
        </div>
        <div className="flex items-center gap-3 w-full lg:w-auto">
          <div className="relative flex-1 lg:flex-none">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search users..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="w-full lg:w-72 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl pl-11 pr-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500/20 text-sm font-bold shadow-sm transition-all"
            />
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {['all', 'active', 'suspended'].map((s) => (
          <button
            key={s}
            onClick={() => { setFilter(s); setPage(1); }}
            className={`px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${
              filter === s
                ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-lg'
                : 'bg-white dark:bg-slate-900 text-slate-500 border border-slate-200 dark:border-slate-800 hover:border-indigo-300'
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {/* Users Table */}
      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-12 h-12 text-indigo-500 animate-spin" />
        </div>
      ) : users.length === 0 ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-[3rem] p-16 text-center border border-slate-100 dark:border-slate-800 shadow-lg">
          <Users className="w-16 h-16 text-slate-200 dark:text-slate-700 mx-auto mb-6" />
          <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">No Users Found</h3>
        </motion.div>
      ) : (
        <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30">
                  <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">User</th>
                  <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Contact</th>
                  <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Village</th>
                  <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Joined</th>
                  <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Status</th>
                  <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                <AnimatePresence>
                  {users.map((user, i) => (
                    <motion.tr
                      key={user._id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.03 }}
                      className="group hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all"
                    >
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-4">
                          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white text-sm font-black shadow-md">
                            {user.name?.[0]?.toUpperCase() || 'U'}
                          </div>
                          <div>
                            <p className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight">{user.name}</p>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{user.role}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="space-y-1">
                          <p className="text-[10px] font-bold text-slate-500 flex items-center gap-1.5"><Mail className="w-3 h-3" /> {user.email}</p>
                          <p className="text-[10px] font-bold text-slate-500 flex items-center gap-1.5"><Phone className="w-3 h-3" /> {user.phone}</p>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
                          <MapPin className="w-3 h-3" /> {user.village || 'Not Set'}
                        </span>
                      </td>
                      <td className="px-6 py-5">
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
                          <Calendar className="w-3 h-3" /> {new Date(user.createdAt).toLocaleDateString()}
                        </span>
                      </td>
                      <td className="px-6 py-5">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest ${
                          user.isActive
                            ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600'
                            : 'bg-red-100 dark:bg-red-900/30 text-red-600'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${user.isActive ? 'bg-emerald-500' : 'bg-red-500'}`} />
                          {user.isActive ? 'Active' : 'Suspended'}
                        </span>
                      </td>
                      <td className="px-6 py-5 text-right relative">
                        <button
                          onClick={() => setActionMenu(actionMenu === user._id ? null : user._id)}
                          className="p-2 rounded-xl text-slate-400 hover:text-indigo-500 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </button>
                        <AnimatePresence>
                          {actionMenu === user._id && (
                            <motion.div
                              initial={{ opacity: 0, scale: 0.9 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.9 }}
                              className="absolute right-6 top-14 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-2xl z-50 w-44 overflow-hidden"
                            >
                              {user.isActive ? (
                                <button onClick={() => handleAction(user._id, 'suspend')} className="flex items-center gap-3 w-full px-4 py-3 text-xs font-bold text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-900/20">
                                  <Ban className="w-4 h-4" /> Suspend
                                </button>
                              ) : (
                                <button onClick={() => handleAction(user._id, 'activate')} className="flex items-center gap-3 w-full px-4 py-3 text-xs font-bold text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20">
                                  <UserCheck className="w-4 h-4" /> Activate
                                </button>
                              )}
                              <button onClick={() => handleAction(user._id, 'delete')} className="flex items-center gap-3 w-full px-4 py-3 text-xs font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 border-t border-slate-100 dark:border-slate-800">
                                <Trash2 className="w-4 h-4" /> Remove
                              </button>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>

          {/* Footer Stats + Pagination */}
          <div className="flex flex-col sm:flex-row justify-between items-center px-6 py-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              Showing {users.length} of {total} users
            </p>
            {totalPages > 1 && (
              <div className="flex items-center gap-3 mt-3 sm:mt-0">
                <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-400 hover:text-indigo-500 disabled:opacity-40 transition-all">
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{page} / {totalPages}</span>
                <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-400 hover:text-indigo-500 disabled:opacity-40 transition-all">
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

export default AdminUsers;
