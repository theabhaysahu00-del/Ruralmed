import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, Mail, Phone, MapPin, 
  Shield, Camera, Save, Lock,
  Droplet, Activity, Heart,
  Settings, Loader2, LogOut,
  ChevronRight, Plus, X, AlertCircle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import axios from 'axios';

const PatientProfile = () => {
  const { user, setUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [newCondition, setNewCondition] = useState('');
  
  // Initialize form data with real user data or placeholders
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    village: user?.village || '',
    bloodGroup: user?.bloodGroup || 'A+',
    weight: user?.weight || '70',
    height: user?.height || '175',
    medicalConditions: Array.isArray(user?.medicalConditions) 
      ? user.medicalConditions 
      : (user?.medicalConditions && user.medicalConditions !== 'None' 
          ? user.medicalConditions.split(',').map(s => s.trim()) 
          : [])
  });

  // Sync with user changes if any
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        village: user.village || '',
        bloodGroup: user.bloodGroup || 'A+',
        weight: user.weight || '70',
        height: user.height || '175',
        medicalConditions: Array.isArray(user.medicalConditions) 
          ? user.medicalConditions 
          : (user.medicalConditions && user.medicalConditions !== 'None' 
              ? user.medicalConditions.split(',').map(s => s.trim()) 
              : [])
      });
    }
  }, [user]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Simulation of API call
      await new Promise(resolve => setTimeout(resolve, 1200));
      
      const updatedUser = { ...user, ...formData };
      setUser(updatedUser);
      setEditMode(false);
      toast.success("Profile synchronized successfully!");
    } catch (err) {
      toast.error("Cloud synchronization failed");
    } finally {
      setLoading(false);
    }
  };

  const addCondition = () => {
    if (newCondition.trim() && !formData.medicalConditions.includes(newCondition.trim())) {
      setFormData({
        ...formData,
        medicalConditions: [...formData.medicalConditions, newCondition.trim()]
      });
      setNewCondition('');
    }
  };

  const removeCondition = (index) => {
    const updated = formData.medicalConditions.filter((_, i) => i !== index);
    setFormData({ ...formData, medicalConditions: updated });
  };

  const resetVital = (key) => {
    const defaults = { bloodGroup: 'N/A', weight: '0', height: '0' };
    setFormData({ ...formData, [key]: defaults[key] });
  };

  return (
    <div className="space-y-10 pb-20 animate-in fade-in duration-700">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 bg-white dark:bg-slate-900/50 backdrop-blur-xl p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-xl">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-4xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">My <span className="text-primary">Medical Passport</span></h1>
            <div className="bg-emerald-500/10 text-emerald-500 px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest border border-emerald-500/20">Active</div>
          </div>
          <p className="text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest text-[10px]">Secure Health Identity • RuralMed India</p>
        </div>
        <div className="flex items-center gap-4">
          {!editMode ? (
            <button 
              onClick={() => setEditMode(true)}
              className="px-10 py-5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-[2rem] text-[10px] font-black uppercase tracking-[0.2em] shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center gap-3"
            >
              <Settings className="w-4 h-4" /> Manage Profile
            </button>
          ) : (
            <div className="flex items-center gap-3">
               <button 
                onClick={() => setEditMode(false)}
                className="px-8 py-5 bg-slate-100 dark:bg-slate-800 rounded-[2rem] text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 hover:bg-slate-200 transition-all"
              >
                Discard
              </button>
               <button 
                onClick={handleUpdate}
                disabled={loading}
                className="px-10 py-5 bg-primary text-white rounded-[2rem] text-[10px] font-black uppercase tracking-[0.2em] shadow-xl shadow-primary/30 flex items-center gap-3 hover:scale-105 active:scale-95 transition-all"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Synchronize
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Column: Stats & Security */}
        <div className="lg:col-span-4 space-y-10">
          {/* Identity Card */}
          <div className="bg-white dark:bg-slate-900 p-12 rounded-[3.5rem] border border-slate-100 dark:border-slate-800 shadow-premium text-center relative overflow-hidden group">
            <div className="relative inline-block mb-10">
              <div className="w-40 h-40 rounded-[3rem] bg-slate-50 dark:bg-slate-800 border-4 border-white dark:border-slate-900 shadow-2xl overflow-hidden group-hover:scale-105 transition-transform duration-500">
                <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name}`} alt="Avatar" className="w-full h-full object-cover" />
              </div>
              {editMode && (
                <button className="absolute -bottom-4 -right-4 p-5 bg-primary text-white rounded-[1.5rem] shadow-2xl shadow-primary/40 hover:scale-110 transition-all border-4 border-white dark:border-slate-900">
                  <Camera className="w-5 h-5" />
                </button>
              )}
            </div>
            
            <h2 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tighter mb-2">{user?.name}</h2>
            <div className="flex items-center justify-center gap-3 mb-10">
               <span className="text-[9px] font-black text-primary uppercase tracking-[0.3em] bg-primary/5 px-4 py-1.5 rounded-full border border-primary/10">Verified Citizen</span>
            </div>
            
            <div className="pt-10 border-t border-slate-50 dark:border-slate-800 grid grid-cols-2 gap-6">
              <div className="bg-slate-50 dark:bg-slate-800/40 p-6 rounded-[2rem] border border-slate-100 dark:border-slate-700">
                <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-2">Member Since</p>
                <p className="text-xs font-black text-slate-700 dark:text-slate-300 uppercase tracking-widest">May 2024</p>
              </div>
              <div className="bg-slate-50 dark:bg-slate-800/40 p-6 rounded-[2rem] border border-slate-100 dark:border-slate-700">
                <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-2">Trust Score</p>
                <div className="flex items-center justify-center gap-2 text-xs font-black text-emerald-500 uppercase">
                  <Activity className="w-3 h-3" /> 98%
                </div>
              </div>
            </div>
            <div className="absolute top-0 left-0 w-32 h-32 bg-primary/5 rounded-full blur-[80px] -ml-16 -mt-16" />
          </div>

          {/* Security Banner */}
          <div className="bg-slate-950 rounded-[3rem] p-10 text-white relative overflow-hidden shadow-2xl border border-white/5">
            <div className="relative z-10">
               <div className="flex items-center gap-4 mb-10">
                  <div className="w-12 h-12 bg-emerald-500/20 rounded-2xl flex items-center justify-center text-emerald-400 border border-emerald-500/20">
                     <Lock className="w-6 h-6" />
                  </div>
                  <div>
                     <h3 className="text-xl font-black uppercase tracking-tight">Security Center</h3>
                     <p className="text-[9px] text-white/30 font-black uppercase tracking-widest">End-to-End Encrypted</p>
                  </div>
               </div>
               <div className="space-y-4">
                  {[
                    { title: "Privacy Key", icon: <Shield />, status: "Active" },
                    { title: "Global Sync", icon: <Activity />, status: "Live" }
                  ].map((item, i) => (
                    <div key={i} className="flex items-center justify-between p-5 bg-white/5 rounded-[1.5rem] border border-white/5 hover:bg-white/10 transition-all cursor-pointer group">
                       <div className="flex items-center gap-4">
                          <div className="text-white/40 group-hover:text-primary transition-colors">{React.cloneElement(item.icon, { size: 18 })}</div>
                          <span className="text-[10px] font-black uppercase tracking-[0.2em]">{item.title}</span>
                       </div>
                       <span className="text-[8px] font-black uppercase text-emerald-500 bg-emerald-500/10 px-3 py-1 rounded-full">{item.status}</span>
                    </div>
                  ))}
               </div>
            </div>
            <div className="absolute bottom-0 right-0 w-48 h-48 bg-primary/10 rounded-full blur-[100px] -mr-24 -mb-24" />
          </div>
        </div>

        {/* Right Column: Information Forms */}
        <div className="lg:col-span-8 space-y-10">
          {/* Medical Vitals */}
          <div className="bg-white dark:bg-slate-900 p-12 rounded-[4rem] border border-slate-100 dark:border-slate-800 shadow-premium relative overflow-hidden">
            <h3 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tighter mb-12 flex items-center gap-5">
              <Droplet className="w-10 h-10 text-primary" /> Vital <span className="text-primary">Metrics.</span>
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { label: 'Blood Group', key: 'bloodGroup', icon: Droplet, color: 'text-red-500', bg: 'bg-red-500/5', border: 'border-red-500/10' },
                { label: 'Weight (kg)', key: 'weight', icon: Activity, color: 'text-emerald-500', bg: 'bg-emerald-500/5', border: 'border-emerald-500/10' },
                { label: 'Height (cm)', key: 'height', icon: Activity, color: 'text-blue-500', bg: 'bg-blue-500/5', border: 'border-blue-500/10' },
              ].map((field) => (
                <div key={field.key} className={`${field.bg} p-8 rounded-[2.5rem] border-2 ${field.border} relative group`}>
                  <div className="flex items-center justify-between mb-6">
                    <div className={`p-4 rounded-2xl ${field.bg} border ${field.border}`}>
                       <field.icon className={`w-6 h-6 ${field.color}`} />
                    </div>
                    {editMode ? (
                      <button onClick={() => resetVital(field.key)} className="text-[9px] font-black text-slate-400 hover:text-red-500 uppercase tracking-widest transition-colors flex items-center gap-1">
                        <X className="w-3 h-3" /> Reset
                      </button>
                    ) : (
                      <div className="text-[9px] font-black text-emerald-500 uppercase tracking-[0.2em] flex items-center gap-1">
                        <Shield className="w-3 h-3" /> Verified
                      </div>
                    )}
                  </div>
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">{field.label}</p>
                  <input 
                    type="text"
                    disabled={!editMode}
                    value={formData[field.key]}
                    onChange={(e) => setFormData({...formData, [field.key]: e.target.value})}
                    className="w-full bg-transparent border-none outline-none text-4xl font-black text-slate-900 dark:text-white p-0 disabled:opacity-100 placeholder:text-slate-200"
                  />
                </div>
              ))}
            </div>
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[100px] -mr-32 -mt-32" />
          </div>

          {/* Medical Conditions (Add/Delete functionality) */}
          <div className="bg-white dark:bg-slate-900 p-12 rounded-[4rem] border border-slate-100 dark:border-slate-800 shadow-premium relative overflow-hidden">
             <h3 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tighter mb-10 flex items-center gap-5">
                <Heart className="w-10 h-10 text-primary" /> Medical <span className="text-primary">Conditions.</span>
             </h3>

             <div className="space-y-8">
                {/* Condition Tags */}
                <div className="flex flex-wrap gap-4">
                   <AnimatePresence>
                      {formData.medicalConditions.length > 0 ? (
                        formData.medicalConditions.map((condition, index) => (
                          <motion.div
                            key={`${condition}-${index}`}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            className="flex items-center gap-3 bg-slate-50 dark:bg-slate-800 px-6 py-4 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-sm group hover:border-primary/30 transition-all"
                          >
                             <div className="w-2 h-2 bg-primary rounded-full" />
                             <span className="text-xs font-black uppercase tracking-widest text-slate-700 dark:text-slate-200">{condition}</span>
                             {editMode && (
                               <button 
                                onClick={() => removeCondition(index)}
                                className="p-1 hover:bg-red-500/10 hover:text-red-500 rounded-lg text-slate-400 transition-all"
                               >
                                 <X className="w-4 h-4" />
                               </button>
                             )}
                          </motion.div>
                        ))
                      ) : (
                        <div className="w-full p-10 border-2 border-dashed border-slate-100 dark:border-slate-800 rounded-[3rem] text-center">
                           <AlertCircle className="w-8 h-8 text-slate-300 mx-auto mb-4" />
                           <p className="text-xs font-black text-slate-400 uppercase tracking-widest">No conditions reported</p>
                        </div>
                      )}
                   </AnimatePresence>
                </div>

                {/* Add New Condition (Edit Mode Only) */}
                {editMode && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex gap-4"
                  >
                    <div className="flex-1 relative group">
                       <Plus className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-primary transition-colors" />
                       <input 
                        type="text"
                        placeholder="Add new condition (e.g. Hypertension)"
                        value={newCondition}
                        onChange={(e) => setNewCondition(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCondition())}
                        className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-800 rounded-3xl pl-16 pr-6 py-5 outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all text-sm font-bold dark:text-white"
                       />
                    </div>
                    <button 
                      onClick={addCondition}
                      className="px-8 bg-primary text-white rounded-3xl font-black uppercase tracking-widest text-[10px] shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all"
                    >
                      Add Label
                    </button>
                  </motion.div>
                )}
             </div>
          </div>

          {/* Personal Information */}
          <div className="bg-white dark:bg-slate-900 p-12 rounded-[4rem] border border-slate-100 dark:border-slate-800 shadow-premium">
            <h3 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tighter mb-12 flex items-center gap-5">
              <User className="w-10 h-10 text-primary" /> Personal <span className="text-primary">Vault.</span>
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              {[
                { label: 'Full Identity Name', key: 'name', icon: User },
                { label: 'Registered Email', key: 'email', icon: Mail, disabled: true },
                { label: 'Phone Number', key: 'phone', icon: Phone },
                { label: 'Village / District', key: 'village', icon: MapPin },
              ].map((field) => (
                <div key={field.key} className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-6">{field.label}</label>
                  <div className="relative group">
                    <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors">
                      <field.icon className="w-5 h-5" />
                    </div>
                    <input 
                      type="text"
                      disabled={field.disabled || !editMode}
                      value={formData[field.key]}
                      onChange={(e) => setFormData({...formData, [field.key]: e.target.value})}
                      className="w-full bg-slate-50 dark:bg-slate-800/50 border-2 border-transparent rounded-[2rem] pl-16 pr-8 py-5 outline-none focus:border-primary/30 focus:ring-8 focus:ring-primary/5 transition-all text-sm font-black dark:text-white disabled:opacity-60"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientProfile;
