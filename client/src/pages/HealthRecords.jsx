import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileUp, FileText, Download, Trash2, 
  Plus, Calendar, Activity, Database,
  Search, Filter, Loader2, AlertCircle,
  FileCheck, Clock
} from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

const HealthRecords = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchRecords();
  }, []);

  const fetchRecords = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get('/api/patient/records');
      if (data.success) {
        setRecords(data.data);
      }
    } catch (err) {
      // Mock data for demo
      setRecords([
        { _id: '1', name: 'Blood Test Report', type: 'Lab Report', date: '2024-05-01', size: '1.2 MB' },
        { _id: '2', name: 'Chest X-Ray', type: 'Radiology', date: '2024-04-15', size: '4.5 MB' },
        { _id: '3', name: 'Vaccination Certificate', type: 'Certificate', date: '2023-12-10', size: '0.8 MB' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('record', file);
    formData.append('name', file.name);

    try {
      // In a real app, this would be a multipart/form-data post
      // const { data } = await axios.post('/api/patient/records/upload', formData);
      toast.success("File uploaded successfully! (Simulation)");
      fetchRecords();
    } catch (err) {
      toast.error("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const filteredRecords = records.filter(r => 
    r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 pb-12">
      {/* Header & Upload */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Health <span className="text-primary">Records</span></h1>
          <p className="text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest text-[10px] mt-1">Centralized digital vault for your medical documents</p>
        </div>

        <label className="cursor-pointer">
          <input type="file" className="hidden" onChange={handleUpload} disabled={uploading} />
          <div className="flex items-center gap-3 px-8 py-4 bg-primary text-white rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-xl shadow-primary/30 hover:scale-105 active:scale-95 transition-all">
            {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileUp className="w-4 h-4" />}
            Upload New Record
          </div>
        </label>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Total Files', value: records.length, icon: Database, color: 'text-primary' },
          { label: 'Lab Reports', value: records.filter(r => r.type === 'Lab Report').length, icon: FileText, color: 'text-emerald-500' },
          { label: 'Recent Uploads', value: 'This Week', icon: Clock, color: 'text-amber-500' },
        ].map((stat, i) => (
          <div key={i} className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-premium flex items-center gap-6">
            <div className={`w-14 h-14 rounded-2xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center ${stat.color}`}>
              <stat.icon className="w-7 h-7" />
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
              <h3 className="text-xl font-black text-slate-900 dark:text-white">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* Search & Table */}
      <div className="bg-white dark:bg-slate-900 rounded-[3rem] border border-slate-100 dark:border-slate-800 shadow-premium overflow-hidden">
        <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex flex-col md:flex-row gap-6">
          <div className="relative flex-1">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text"
              placeholder="Search by filename or category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-800/50 border border-transparent rounded-2xl pl-14 pr-6 py-4 text-sm font-bold outline-none focus:border-primary/30 transition-all"
            />
          </div>
          <button className="flex items-center gap-2 px-6 py-4 bg-slate-50 dark:bg-slate-800 text-slate-400 hover:text-primary rounded-2xl transition-all font-black uppercase text-[10px] tracking-widest">
            <Filter className="w-4 h-4" /> Filter By Type
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50/50 dark:bg-slate-800/30">
                <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Document Name</th>
                <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Category</th>
                <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Date</th>
                <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Size</th>
                <th className="px-8 py-5 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {loading ? (
                <tr>
                  <td colSpan="5" className="px-8 py-20 text-center">
                    <Loader2 className="w-10 h-10 text-primary animate-spin mx-auto mb-4" />
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Syncing your vault...</p>
                  </td>
                </tr>
              ) : filteredRecords.length > 0 ? (
                filteredRecords.map((record) => (
                  <motion.tr 
                    key={record._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="group hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors"
                  >
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-primary/5 text-primary rounded-xl flex items-center justify-center">
                          <FileText className="w-5 h-5" />
                        </div>
                        <span className="text-sm font-black text-slate-900 dark:text-white group-hover:text-primary transition-colors">{record.name}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-500 rounded-full text-[10px] font-black uppercase tracking-widest">{record.type}</span>
                    </td>
                    <td className="px-8 py-6 text-sm font-bold text-slate-500">{new Date(record.date).toLocaleDateString()}</td>
                    <td className="px-8 py-6 text-sm font-bold text-slate-400 uppercase">{record.size}</td>
                    <td className="px-8 py-6 text-right space-x-2">
                      <button className="p-3 text-slate-400 hover:text-primary hover:bg-white dark:hover:bg-slate-700 rounded-xl transition-all shadow-sm">
                        <Download className="w-4 h-4" />
                      </button>
                      <button className="p-3 text-slate-400 hover:text-red-500 hover:bg-white dark:hover:bg-slate-700 rounded-xl transition-all shadow-sm">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </motion.tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-8 py-20 text-center">
                    <AlertCircle className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                    <p className="text-slate-400 font-bold">No medical records found.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default HealthRecords;
