import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FileUp, ShieldAlert, CheckCircle2, XCircle, Clock, ArrowRight, Activity, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

const DoctorVerificationStatus = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [currentStatus, setCurrentStatus] = useState(user?.approvalStatus || 'pending');
  const [stage, setStage] = useState(user?.verificationStage || 'submitted');

  useEffect(() => {
    let interval;
    // Poll every 5 seconds to check for updates
    if (currentStatus === 'pending') {
      interval = setInterval(async () => {
        try {
          const res = await api.get('/auth/me');
          if (res.success) {
            const updatedUser = res.data;
            setCurrentStatus(updatedUser.approvalStatus);
            setStage(updatedUser.verificationStage);

            // Update local storage so ProtectedRoute allows us through
            localStorage.setItem('user', JSON.stringify(updatedUser));

            if (updatedUser.approvalStatus === 'approved') {
              clearInterval(interval);
              setTimeout(() => {
                window.location.href = '/doctor'; // Force reload to ensure fresh state
              }, 2000);
            }
          }
        } catch (err) {
          console.error("Failed to fetch status update");
        }
      }, 5000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [currentStatus]);

  const stages = [
    { id: 'submitted', label: 'Application Submitted', desc: 'Credentials and license uploaded successfully.', icon: FileUp },
    { id: 'pending', label: 'Under Review', desc: 'Medical Board is reviewing your application.', icon: Clock },
    { id: 'approved', label: 'Approved & Verified', desc: 'You are now an official RuralMed partner.', icon: CheckCircle2 },
  ];

  const getStageIndex = () => {
    if (currentStatus === 'rejected') return 2; // Show reject at the end
    if (currentStatus === 'approved') return 2;
    if (stage === 'under_review') return 1;
    return 0; // submitted/pending initially
  };

  const currentIndex = getStageIndex();

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-3xl w-full bg-white dark:bg-slate-900 rounded-[3rem] p-10 md:p-14 border border-slate-100 dark:border-slate-800 shadow-premium overflow-hidden relative"
      >
        {/* Background Accents */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl -ml-32 -mb-32 pointer-events-none" />

        <div className="relative z-10 text-center mb-16">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-blue-50 dark:bg-blue-900/20 text-blue-500 rounded-3xl mb-8 shadow-inner border border-blue-100 dark:border-blue-800/30">
             {currentStatus === 'approved' ? <CheckCircle2 className="w-12 h-12 text-emerald-500" /> : 
              currentStatus === 'rejected' ? <XCircle className="w-12 h-12 text-red-500" /> : 
              <Activity className="w-12 h-12 animate-pulse" />}
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white uppercase tracking-tight mb-4">
            Verification <span className="text-blue-500">Status</span>
          </h1>
          <p className="text-slate-500 font-bold uppercase tracking-widest text-xs md:text-sm">
            {currentStatus === 'approved' ? 'Congratulations! Your account is ready.' : 
             currentStatus === 'rejected' ? 'Application declined. Please contact support.' : 
             'We are processing your medical credentials...'}
          </p>
        </div>

        {/* Timeline */}
        <div className="relative z-10 max-w-lg mx-auto">
          {currentStatus !== 'rejected' ? (
            <div className="space-y-12">
              {stages.map((s, idx) => {
                const isCompleted = idx < currentIndex;
                const isCurrent = idx === currentIndex;
                const isPending = idx > currentIndex;
                
                return (
                  <div key={s.id} className="relative flex gap-6 md:gap-8">
                    {/* Connecting Line */}
                    {idx < stages.length - 1 && (
                      <div className={`absolute left-[1.125rem] md:left-[1.375rem] top-12 w-0.5 h-full -ml-px ${isCompleted ? 'bg-blue-500' : 'bg-slate-100 dark:bg-slate-800'}`} />
                    )}
                    
                    {/* Icon Node */}
                    <div className="relative z-10">
                      <div className={`w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center border-4 border-white dark:border-slate-900 shadow-sm transition-all duration-500 ${
                        isCompleted ? 'bg-blue-500 text-white' : 
                        isCurrent ? 'bg-amber-400 text-white shadow-amber-400/50 animate-pulse' : 
                        'bg-slate-100 dark:bg-slate-800 text-slate-400'
                      }`}>
                        <s.icon className={`w-4 h-4 md:w-5 md:h-5 ${isCurrent ? 'animate-bounce' : ''}`} />
                      </div>
                    </div>

                    {/* Content */}
                    <div className={`pt-1 flex-1 ${isPending ? 'opacity-40' : 'opacity-100'}`}>
                      <h3 className={`text-lg font-black uppercase tracking-tight mb-1 ${isCurrent ? 'text-amber-500 dark:text-amber-400' : 'text-slate-900 dark:text-white'}`}>
                        {s.label}
                      </h3>
                      <p className="text-[10px] md:text-xs font-bold text-slate-500 uppercase tracking-widest leading-relaxed">
                        {s.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="p-8 bg-red-50 dark:bg-red-500/10 border-2 border-red-100 dark:border-red-500/20 rounded-[2rem] text-center"
            >
              <ShieldAlert className="w-16 h-16 text-red-500 mx-auto mb-6" />
              <h3 className="text-xl font-black text-red-600 dark:text-red-400 uppercase tracking-tight mb-3">Verification Failed</h3>
              <p className="text-xs font-bold text-red-500/80 uppercase tracking-widest leading-relaxed">
                Unfortunately, your medical credentials could not be verified by our board. Please contact support@ruralmed.in for detailed feedback.
              </p>
            </motion.div>
          )}
        </div>

        {/* Action Area */}
        <div className="mt-16 text-center relative z-10">
          {currentStatus === 'pending' && (
             <div className="flex items-center justify-center gap-3 text-slate-400 font-bold uppercase tracking-widest text-[10px]">
               <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
               Auto-refreshing status...
             </div>
          )}
          {currentStatus === 'approved' && (
            <button 
              onClick={() => navigate('/doctor')}
              className="inline-flex items-center gap-3 bg-emerald-500 hover:bg-emerald-400 text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-xs transition-all shadow-xl shadow-emerald-500/20 hover:scale-105"
            >
              Enter Dashboard <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default DoctorVerificationStatus;
