import React, { useState } from 'react';
import { 
  Phone, MapPin, Share2, AlertCircle, 
  ShieldAlert, Navigation, Activity, X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Emergency = () => {
  const [sosActive, setSosActive] = useState(false);
  const [locationShared, setLocationShared] = useState(false);

  const handleCall = () => {
    window.location.href = "tel:102";
  };

  const handleSOS = () => {
    setSosActive(true);
    // Simulate emergency alert broadcast
    setTimeout(() => {
       alert("CRITICAL: SOS signal broadcasted to nearest hospital and 3 family contacts.");
    }, 1000);
  };

  const handleShareLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        setLocationShared(true);
        console.log(`SOS Location: ${position.coords.latitude}, ${position.coords.longitude}`);
      });
    }
  };

  return (
    <div className="min-h-screen bg-black relative overflow-hidden flex items-center justify-center p-6">
      {/* Background Pulsing Glow */}
      <div className="absolute inset-0 bg-red-600/20 animate-pulse pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-red-600/30 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-xl w-full relative z-10">
        <header className="text-center mb-16">
           <motion.div 
             animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
             transition={{ duration: 0.5, repeat: Infinity }}
             className="w-24 h-24 bg-red-600 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-[0_0_50px_rgba(220,38,38,0.5)]"
           >
              <ShieldAlert className="w-12 h-12 text-white" />
           </motion.div>
           <h1 className="text-5xl font-black text-white uppercase tracking-tighter mb-4 leading-none">Emergency SOS</h1>
           <p className="text-red-500 font-black uppercase tracking-[0.3em] text-xs">Medical Emergency Response System</p>
        </header>

        <div className="space-y-6">
           {/* Primary Call Action */}
           <motion.button 
             whileTap={{ scale: 0.95 }}
             onClick={handleCall}
             className="w-full bg-white text-red-600 py-8 rounded-[2.5rem] shadow-2xl flex flex-col items-center justify-center gap-2 group transition-all"
           >
              <div className="flex items-center gap-4">
                 <Phone className="w-10 h-10 fill-current animate-bounce" />
                 <span className="text-4xl font-black uppercase tracking-tighter">Call 102</span>
              </div>
              <p className="text-[10px] font-black uppercase tracking-widest text-red-400 group-hover:text-red-600 transition-colors">Immediate Ambulance Dispatch</p>
           </motion.button>

           {/* SOS Alert Action */}
           <motion.button 
             whileTap={{ scale: 0.95 }}
             onClick={handleSOS}
             className="w-full bg-red-600 text-white py-8 rounded-[2.5rem] shadow-2xl flex flex-col items-center justify-center gap-2 border-4 border-red-500/50 relative overflow-hidden"
           >
              <div className="absolute inset-0 bg-gradient-to-r from-red-600 via-red-500 to-red-600 animate-shimmer" />
              <div className="relative z-10 flex flex-col items-center">
                 <span className="text-4xl font-black uppercase tracking-tighter mb-1">Broadcast SOS</span>
                 <p className="text-[10px] font-black uppercase tracking-widest text-red-200">Notify All Nearby Hospitals</p>
              </div>
           </motion.button>

           {/* Location Sharing */}
           <div className="grid grid-cols-2 gap-4">
              <button 
                onClick={handleShareLocation}
                className={`py-6 rounded-3xl font-black uppercase tracking-widest text-[10px] flex flex-col items-center gap-3 transition-all ${locationShared ? 'bg-emerald-600 text-white' : 'bg-slate-900 text-slate-400 border border-white/10 hover:border-white/30'}`}
              >
                 <MapPin className="w-6 h-6" />
                 {locationShared ? 'Location Sent' : 'Share Location'}
              </button>
              <button className="bg-slate-900 text-slate-400 py-6 rounded-3xl font-black uppercase tracking-widest text-[10px] flex flex-col items-center gap-3 border border-white/10 hover:border-white/30 transition-all">
                 <Navigation className="w-6 h-6" />
                 Find Near Me
              </button>
           </div>
        </div>

        {/* Quick Contacts Grid */}
        <div className="mt-12 grid grid-cols-3 gap-3">
           {[
             { label: 'Police', val: '100', color: 'text-blue-500' },
             { label: 'Fire', val: '101', color: 'text-amber-500' },
             { label: 'Help', val: '108', color: 'text-primary' },
           ].map((contact, i) => (
             <div key={i} className="bg-slate-900/50 backdrop-blur-xl p-6 rounded-3xl border border-white/5 flex flex-col items-center">
                <p className="text-[8px] font-black uppercase tracking-widest text-slate-500 mb-2">{contact.label}</p>
                <p className={`text-2xl font-black ${contact.color}`}>{contact.val}</p>
             </div>
           ))}
        </div>

        <div className="mt-12 flex items-center justify-center gap-4">
           <Activity className="w-5 h-5 text-red-600 animate-pulse" />
           <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">System Monitoring Active</p>
        </div>

        {/* Close Button */}
        <button 
          onClick={() => window.history.back()}
          className="absolute top-0 right-0 p-4 text-slate-500 hover:text-white transition-colors"
        >
           <X className="w-8 h-8" />
        </button>
      </div>

      {/* SOS Active Overlay */}
      <AnimatePresence>
        {sosActive && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-red-600 flex flex-col items-center justify-center p-10 text-center"
          >
             <motion.div 
               animate={{ scale: [1, 1.5, 1], rotate: [0, 90, 180, 270, 360] }}
               transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
               className="w-48 h-48 bg-white/20 rounded-full blur-2xl absolute"
             />
             <div className="relative z-10">
                <ShieldAlert className="w-32 h-32 text-white mx-auto mb-10 animate-pulse" />
                <h2 className="text-6xl font-black text-white uppercase tracking-tighter mb-4 leading-none">Alerting...</h2>
                <p className="text-red-100 font-black uppercase tracking-[0.3em] text-sm mb-12">Do not close the app. Help is being routed.</p>
                <button 
                  onClick={() => setSosActive(false)}
                  className="bg-white text-red-600 px-12 py-5 rounded-full font-black uppercase tracking-widest text-xs shadow-2xl active:scale-95 transition-all"
                >
                   Cancel SOS
                </button>
             </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        .animate-shimmer {
          background-size: 200% auto;
          animation: shimmer 3s linear infinite;
        }
      `}} />
    </div>
  );
};

export default Emergency;

