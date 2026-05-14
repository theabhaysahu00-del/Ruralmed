import React, { useState, useEffect } from 'react';
import { 
  User, Mail, Phone, MapPin, 
  ShieldCheck, Camera, Save, Lock,
  Store, FileText, Globe, Loader2,
  Clock, Map
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import toast from 'react-hot-toast';

const PharmacyProfile = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || '',
    village: user?.village || '',
    licenseNumber: user?.licenseNumber || 'LIC-2024-8892',
    ownerName: user?.ownerName || user?.name || '',
  });

  const handleChange = (e) => {
    setProfileData({ ...profileData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // In a real app, this would call an API like pharmacyAPI.updateProfile
      // For now, we simulate the update
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success("Profile updated successfully!");
    } catch (err) {
      toast.error("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
          Pharmacy <span className="text-pharmacy">Profile</span>
        </h1>
        <p className="text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest text-[10px] mt-1">
          Manage your clinical identity and contact details
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Visual Identity */}
        <div className="space-y-8">
          <div className="bg-white dark:bg-slate-900 p-8 rounded-[3rem] border border-slate-100 dark:border-slate-800 shadow-premium flex flex-col items-center text-center relative overflow-hidden">
            <div className="relative group mb-6">
              <div className="w-32 h-32 rounded-[2.5rem] bg-slate-50 dark:bg-slate-800 border-4 border-white dark:border-slate-900 shadow-2xl overflow-hidden group-hover:scale-105 transition-all">
                <img src={`https://api.dicebear.com/7.x/initials/svg?seed=${profileData.name}`} alt="" className="w-full h-full object-cover" />
              </div>
              <button className="absolute bottom-0 right-0 p-3 bg-pharmacy text-white rounded-2xl shadow-xl shadow-pharmacy/20 hover:scale-110 transition-all border-4 border-white dark:border-slate-900">
                <Camera className="w-4 h-4" />
              </button>
            </div>
            
            <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">{profileData.name}</h2>
            <div className="flex items-center gap-2 mt-2 px-4 py-1 bg-emerald-500/10 text-emerald-500 rounded-full">
              <ShieldCheck className="w-3 h-3" />
              <span className="text-[10px] font-black uppercase tracking-widest">Verified Pharmacy</span>
            </div>

            <div className="grid grid-cols-2 gap-4 w-full mt-8">
              <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800">
                <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Status</p>
                <p className="text-xs font-black text-emerald-500 uppercase">Active</p>
              </div>
              <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800">
                <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Joined</p>
                <p className="text-xs font-black text-slate-900 dark:text-white uppercase">May 2024</p>
              </div>
            </div>
            
            {/* Background design */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-pharmacy/5 rounded-full -mr-16 -mt-16 blur-2xl" />
          </div>

          <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white shadow-2xl relative overflow-hidden">
            <h3 className="text-xl font-black uppercase tracking-tight mb-4">Security Center</h3>
            <p className="text-slate-400 text-xs font-medium mb-8">Maintain a secure profile and manage access credentials.</p>
            <button className="w-full py-4 bg-white/10 hover:bg-white/20 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2">
              <Lock className="w-4 h-4" /> Change Password
            </button>
            <FileText className="absolute -bottom-4 -right-4 w-24 h-24 text-white/5 rotate-12" />
          </div>
        </div>

        {/* Right Column: Profile Form */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-900 p-10 rounded-[3rem] border border-slate-100 dark:border-slate-800 shadow-premium space-y-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Basic Info */}
              <div className="space-y-6">
                <h4 className="text-[10px] font-black text-slate-900 dark:text-white uppercase tracking-[0.2em] flex items-center gap-2">
                  <Store className="w-4 h-4 text-pharmacy" /> Pharmacy Information
                </h4>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Pharmacy Name</label>
                    <input
                      type="text"
                      name="name"
                      value={profileData.name}
                      onChange={handleChange}
                      className="w-full bg-slate-50 dark:bg-slate-800/50 border-none rounded-2xl px-5 py-4 text-sm font-bold outline-none focus:ring-2 focus:ring-pharmacy/20 transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Owner Full Name</label>
                    <input
                      type="text"
                      name="ownerName"
                      value={profileData.ownerName}
                      onChange={handleChange}
                      className="w-full bg-slate-50 dark:bg-slate-800/50 border-none rounded-2xl px-5 py-4 text-sm font-bold outline-none focus:ring-2 focus:ring-pharmacy/20 transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Medical License Number</label>
                    <input
                      type="text"
                      name="licenseNumber"
                      value={profileData.licenseNumber}
                      onChange={handleChange}
                      className="w-full bg-slate-50 dark:bg-slate-800/50 border-none rounded-2xl px-5 py-4 text-sm font-bold outline-none focus:ring-2 focus:ring-pharmacy/20 transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Contact Info */}
              <div className="space-y-6">
                <h4 className="text-[10px] font-black text-slate-900 dark:text-white uppercase tracking-[0.2em] flex items-center gap-2">
                  <Globe className="w-4 h-4 text-blue-500" /> Contact & Location
                </h4>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Email Address</label>
                    <input
                      type="email"
                      name="email"
                      value={profileData.email}
                      disabled
                      className="w-full bg-slate-100 dark:bg-slate-800/30 border-none rounded-2xl px-5 py-4 text-sm font-bold text-slate-400 cursor-not-allowed"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Phone Number</label>
                    <input
                      type="text"
                      name="phone"
                      value={profileData.phone}
                      onChange={handleChange}
                      className="w-full bg-slate-50 dark:bg-slate-800/50 border-none rounded-2xl px-5 py-4 text-sm font-bold outline-none focus:ring-2 focus:ring-pharmacy/20 transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Village / Region</label>
                    <input
                      type="text"
                      name="village"
                      value={profileData.village}
                      onChange={handleChange}
                      className="w-full bg-slate-50 dark:bg-slate-800/50 border-none rounded-2xl px-5 py-4 text-sm font-bold outline-none focus:ring-2 focus:ring-pharmacy/20 transition-all"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Full Operating Address</label>
              <textarea
                name="address"
                rows="3"
                value={profileData.address}
                onChange={handleChange}
                className="w-full bg-slate-50 dark:bg-slate-800/50 border-none rounded-2xl px-5 py-4 text-sm font-bold outline-none focus:ring-2 focus:ring-pharmacy/20 transition-all resize-none"
              />
            </div>

            <div className="flex justify-end pt-4">
              <button
                type="submit"
                disabled={loading}
                className="px-12 py-5 bg-pharmacy text-white rounded-[2rem] font-black uppercase tracking-widest text-[10px] shadow-xl shadow-pharmacy/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-3"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                Update Settings
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PharmacyProfile;
