import React, { useState } from 'react';
import { 
  User as UserIcon, Mail, Phone, MapPin, 
  Award, Briefcase, FileText, Camera,
  Shield, CheckCircle
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const DoctorProfile = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);

  if (!user) return null;

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight">My Profile</h1>
          <p className="text-slate-500 dark:text-slate-400 font-bold">Manage your personal and professional details</p>
        </div>
        <button 
          onClick={() => {
            if(isEditing) toast.success("Profile updated successfully!");
            setIsEditing(!isEditing);
          }}
          className="bg-doctor hover:bg-doctor-dark text-white px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg shadow-doctor/30"
        >
          {isEditing ? 'Save Changes' : 'Edit Profile'}
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Left Column: Avatar & Basic Info */}
        <div className="space-y-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-slate-900 rounded-[3rem] p-8 border border-slate-100 dark:border-slate-800 shadow-premium flex flex-col items-center text-center relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-doctor/20 to-transparent"></div>
            
            <div className="relative group mt-8 mb-6">
              <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white dark:border-slate-800 shadow-2xl relative z-10 bg-white">
                <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`} alt={user.name} className="w-full h-full object-cover" />
              </div>
              {isEditing && (
                <div className="absolute bottom-0 right-0 w-10 h-10 bg-doctor text-white rounded-full flex items-center justify-center cursor-pointer hover:bg-doctor-dark transition-all z-20 shadow-lg">
                  <Camera className="w-5 h-5" />
                </div>
              )}
            </div>

            <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">{user.name}</h2>
            <p className="text-doctor font-black uppercase tracking-widest text-[10px] mt-1 mb-4 flex items-center justify-center gap-1">
              <Shield className="w-3 h-3" /> Verified Doctor
            </p>

            <div className="w-full space-y-4 mt-4">
              <div className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl">
                <Mail className="w-5 h-5 text-slate-400" />
                <div className="text-left flex-1">
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Email</p>
                  <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">{user.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl">
                <Phone className="w-5 h-5 text-slate-400" />
                <div className="text-left flex-1">
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Phone</p>
                  <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">{user.phone}</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Right Column: Professional Details */}
        <div className="xl:col-span-2 space-y-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white dark:bg-slate-900 rounded-[3rem] p-8 border border-slate-100 dark:border-slate-800 shadow-premium"
          >
            <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight mb-8 flex items-center gap-3">
              <Briefcase className="w-6 h-6 text-doctor" /> Professional Details
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] text-slate-400 font-bold uppercase tracking-widest px-4">Specialization</label>
                <div className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-transparent font-semibold text-slate-700 dark:text-slate-300">
                  {user.specialization || 'Not specified'}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] text-slate-400 font-bold uppercase tracking-widest px-4">Experience</label>
                <div className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-transparent font-semibold text-slate-700 dark:text-slate-300">
                  {user.experience || 'Not specified'}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] text-slate-400 font-bold uppercase tracking-widest px-4">Hospital / Clinic</label>
                <div className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-transparent font-semibold text-slate-700 dark:text-slate-300">
                  {user.hospital || user.clinicName || 'Not specified'}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] text-slate-400 font-bold uppercase tracking-widest px-4">Medical License</label>
                <div className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-transparent font-semibold text-slate-700 dark:text-slate-300 flex items-center justify-between">
                  {user.licenseNumber || 'Not specified'}
                  {user.licenseNumber && <CheckCircle className="w-4 h-4 text-emerald-500" />}
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-doctor/5 border border-doctor/20 rounded-[3rem] p-8"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-doctor/20 text-doctor rounded-2xl flex items-center justify-center shrink-0">
                <Award className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight">Status: Active & Approved</h4>
                <p className="text-sm font-semibold text-slate-600 dark:text-slate-400 mt-2">
                  Your medical credentials have been successfully verified by the administration. You have full access to consultation features and patient management.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default DoctorProfile;
