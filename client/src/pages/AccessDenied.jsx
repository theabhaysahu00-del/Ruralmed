import React from 'react';
import { motion } from 'framer-motion';
import { ShieldAlert, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AccessDenied = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 px-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full bg-white dark:bg-slate-900 p-12 rounded-[3rem] shadow-2xl border border-red-100 dark:border-red-900/30 text-center"
      >
        <div className="w-20 h-20 bg-red-100 dark:bg-red-900/20 rounded-3xl flex items-center justify-center text-red-500 mx-auto mb-8">
          <ShieldAlert className="w-10 h-10" />
        </div>
        
        <h1 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight mb-4">Access Denied</h1>
        <p className="text-slate-500 dark:text-slate-400 font-bold mb-10 leading-relaxed">
          You do not have the required permissions to access this clinical area. This attempt has been logged for security.
        </p>

        <button 
          onClick={() => navigate('/')}
          className="w-full bg-slate-900 dark:bg-white dark:text-slate-900 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:scale-105 active:scale-95 transition-all"
        >
          <ArrowLeft className="w-5 h-5" /> Return to Safety
        </button>
      </motion.div>
    </div>
  );
};

export default AccessDenied;
