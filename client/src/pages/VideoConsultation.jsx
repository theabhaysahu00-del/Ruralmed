import React, { useState, useEffect } from 'react';
import { 
  Mic, MicOff, Video, VideoOff, PhoneOff, Send, 
  MessageSquare, User, MoreVertical, Activity, 
  Clipboard, Heart, Thermometer, Droplets,
  Wifi, Shield, Settings, Maximize2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const VideoConsultation = () => {
  const [micOn, setMicOn] = useState(true);
  const [videoOn, setVideoOn] = useState(true);
  const [showChat, setShowChat] = useState(false);
  const [showToolkit, setShowToolkit] = useState(false);
  const [message, setMessage] = useState("");
  const [vitals, setVitals] = useState({ bpm: 72, temp: 98.6, spo2: 98 });
  
  const [chat, setChat] = useState([
    { from: 'doctor', text: "Hello Rajesh! I can see your recent symptom reports. How are you feeling right now?", time: "12:45 PM" },
    { from: 'patient', text: "A bit better, but the fever is still coming back every 4-5 hours.", time: "12:46 PM" }
  ]);

  // Simulate live vitals
  useEffect(() => {
    const interval = setInterval(() => {
      setVitals(prev => ({
        ...prev,
        bpm: prev.bpm + (Math.random() > 0.5 ? 1 : -1)
      }));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!message) return;
    setChat([...chat, { from: 'patient', text: message, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
    setMessage("");
  };

  return (
    <div className="h-[calc(100vh-140px)] flex gap-6 overflow-hidden animate-in fade-in zoom-in duration-500">
      {/* Main Video Section */}
      <div className="flex-1 relative bg-slate-900 rounded-[3rem] overflow-hidden shadow-[0_40px_100px_-20px_rgba(0,0,0,0.4)] border-4 border-white/5">
        
        {/* Remote Video (Doctor) */}
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=1200&auto=format&fit=crop&q=80" 
            alt="Doctor" 
            className="w-full h-full object-cover opacity-90 transition-all duration-1000"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/40" />
          
          {/* Top Status Bar */}
          <div className="absolute top-8 left-8 right-8 flex items-center justify-between z-20">
             <div className="flex items-center gap-4 bg-black/40 backdrop-blur-2xl px-6 py-3 rounded-2xl border border-white/10">
                <div className="w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(239,68,68,0.8)]" />
                <div className="flex flex-col">
                   <span className="text-white text-xs font-black uppercase tracking-[0.2em]">Live Consultation</span>
                   <span className="text-[10px] text-white/60 font-bold uppercase tracking-widest">DR. RAJESH SHARMA • SENIOR PHYSICIAN</span>
                </div>
             </div>

             <div className="flex items-center gap-6">
                <div className="flex items-center gap-2 bg-emerald-500/20 backdrop-blur-xl px-4 py-2 rounded-xl border border-emerald-500/30">
                   <Wifi className="w-4 h-4 text-emerald-500" />
                   <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Excellent</span>
                </div>
                <div className="flex items-center gap-2 bg-blue-500/20 backdrop-blur-xl px-4 py-2 rounded-xl border border-blue-500/30">
                   <Shield className="w-4 h-4 text-blue-500" />
                   <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest">Encrypted</span>
                </div>
             </div>
          </div>
        </div>

        {/* Vitals Overlay (Left Side) */}
        <div className="absolute left-8 top-1/2 -translate-y-1/2 space-y-4 z-20">
           {[
             { icon: Heart, val: vitals.bpm, unit: 'BPM', label: 'Heart Rate', color: 'text-red-500' },
             { icon: Thermometer, val: vitals.temp, unit: '°F', label: 'Temperature', color: 'text-amber-500' },
             { icon: Droplets, val: vitals.spo2, unit: '%', label: 'SpO2', color: 'text-blue-500' },
           ].map((v, i) => (
             <motion.div 
               key={i}
               initial={{ x: -50, opacity: 0 }}
               animate={{ x: 0, opacity: 1 }}
               transition={{ delay: 0.5 + i * 0.1 }}
               className="bg-black/40 backdrop-blur-2xl p-4 rounded-[1.5rem] border border-white/10 w-32 group hover:bg-black/60 transition-all cursor-default"
             >
                <div className="flex items-center justify-between mb-1">
                   <v.icon className={`w-4 h-4 ${v.color} group-hover:scale-125 transition-transform`} />
                   <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                </div>
                <p className="text-2xl font-black text-white tracking-tighter">{v.val}<span className="text-[10px] ml-0.5 text-white/40">{v.unit}</span></p>
                <p className="text-[8px] font-black text-white/30 uppercase tracking-widest">{v.label}</p>
             </motion.div>
           ))}
        </div>

        {/* Local Video (Self) */}
        <motion.div 
          drag
          dragMomentum={false}
          className="absolute bottom-32 right-8 w-56 h-72 bg-slate-800 rounded-[2rem] border-4 border-white/10 shadow-2xl overflow-hidden cursor-move z-30 group"
        >
          {videoOn ? (
            <img 
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&auto=format&fit=crop&q=60" 
              alt="Me" 
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-slate-900">
              <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center border border-white/5">
                 <User className="w-8 h-8 text-slate-500" />
              </div>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity">
             <span className="text-[10px] font-black text-white uppercase tracking-widest bg-black/40 px-3 py-1 rounded-full backdrop-blur-md">Rajesh (Me)</span>
             <Maximize2 className="w-4 h-4 text-white/60 hover:text-white transition-colors" />
          </div>
        </motion.div>

        {/* Bottom Control Bar */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-4 bg-black/40 backdrop-blur-3xl p-5 rounded-[2.5rem] border border-white/10 z-40 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
          <button 
            onClick={() => setMicOn(!micOn)}
            className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all ${micOn ? 'bg-white/5 text-white hover:bg-white/10' : 'bg-red-500 text-white shadow-[0_0_20px_rgba(239,68,68,0.4)]'}`}
          >
            {micOn ? <Mic className="w-7 h-7" /> : <MicOff className="w-7 h-7" />}
          </button>
          
          <button 
            onClick={() => setVideoOn(!videoOn)}
            className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all ${videoOn ? 'bg-white/5 text-white hover:bg-white/10' : 'bg-red-500 text-white shadow-[0_0_20px_rgba(239,68,68,0.4)]'}`}
          >
            {videoOn ? <Video className="w-7 h-7" /> : <VideoOff className="w-7 h-7" />}
          </button>

          <button 
            className="w-20 h-16 bg-red-600 text-white rounded-2xl flex items-center justify-center hover:bg-red-500 hover:scale-110 active:scale-95 transition-all shadow-xl shadow-red-600/40"
            onClick={() => window.history.back()}
          >
            <PhoneOff className="w-8 h-8" />
          </button>

          <div className="w-px h-10 bg-white/10 mx-2" />

          <button 
            onClick={() => setShowToolkit(!showToolkit)}
            className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all ${showToolkit ? 'bg-primary text-white shadow-[0_0_20px_rgba(var(--primary-rgb),0.4)]' : 'bg-white/5 text-white hover:bg-white/10'}`}
          >
            <Clipboard className="w-7 h-7" />
          </button>

          <button 
            onClick={() => setShowChat(!showChat)}
            className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all ${showChat ? 'bg-primary text-white shadow-[0_0_20px_rgba(var(--primary-rgb),0.4)]' : 'bg-white/5 text-white hover:bg-white/10'}`}
          >
            <div className="relative">
               <MessageSquare className="w-7 h-7" />
               <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-slate-900" />
            </div>
          </button>

          <button className="w-16 h-16 rounded-2xl flex items-center justify-center bg-white/5 text-white hover:bg-white/10 transition-all">
             <Settings className="w-7 h-7" />
          </button>
        </div>
      </div>

      {/* Chat Sidebar */}
      <AnimatePresence>
        {showChat && (
          <motion.div 
            initial={{ x: 400, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 400, opacity: 0 }}
            className="w-[400px] bg-white dark:bg-slate-900 rounded-[3rem] flex flex-col shadow-2xl border border-slate-100 dark:border-slate-800 overflow-hidden"
          >
            <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div>
                 <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Live Discussion</h3>
                 <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] mt-1">Rajesh & Dr. Sharma</p>
              </div>
              <button 
                onClick={() => setShowChat(false)}
                className="w-10 h-10 bg-slate-50 dark:bg-slate-800 rounded-xl flex items-center justify-center text-slate-400 hover:text-primary transition-all"
              >
                 <MoreVertical className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-8 space-y-8 scrollbar-hide">
              {chat.map((msg, i) => (
                <div key={i} className={`flex flex-col ${msg.from === 'patient' ? 'items-end' : 'items-start'}`}>
                  <div className={`max-w-[85%] p-5 rounded-[1.8rem] text-sm font-bold shadow-sm leading-relaxed ${msg.from === 'patient' ? 'bg-primary text-white rounded-tr-none' : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-tl-none'}`}>
                    {msg.text}
                  </div>
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-3 px-2">{msg.time}</span>
                </div>
              ))}
            </div>

            <form onSubmit={handleSendMessage} className="p-8 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 backdrop-blur-xl flex gap-4">
              <input 
                type="text" 
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Message Dr. Sharma..."
                className="flex-1 bg-white dark:bg-slate-800 border-none rounded-2xl px-6 py-4 text-sm font-bold focus:ring-4 focus:ring-primary/10 transition-all dark:text-white placeholder:text-slate-400"
              />
              <button 
                type="submit"
                className="bg-primary text-white w-14 h-14 rounded-2xl shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all flex items-center justify-center"
              >
                <Send className="w-6 h-6" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toolkit Sidebar (Doctor's view or Patient Record view) */}
      <AnimatePresence>
        {showToolkit && (
          <motion.div 
            initial={{ x: 400, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 400, opacity: 0 }}
            className="w-[400px] bg-slate-900 text-white rounded-[3rem] flex flex-col shadow-2xl border border-white/5 overflow-hidden"
          >
             <div className="p-8 border-b border-white/5 flex items-center justify-between">
                <h3 className="text-xl font-black uppercase tracking-tight">Health Records</h3>
                <button 
                  onClick={() => setShowToolkit(false)}
                  className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-white/40 hover:text-white transition-all"
                >
                   <Maximize2 className="w-5 h-5" />
                </button>
             </div>
             <div className="p-8 space-y-6 flex-1 overflow-y-auto scrollbar-hide">
                <div className="bg-white/5 p-6 rounded-3xl border border-white/5 group hover:bg-white/10 transition-all cursor-pointer">
                   <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 bg-primary/20 rounded-2xl flex items-center justify-center text-primary">
                         <Activity className="w-6 h-6" />
                      </div>
                      <div>
                         <p className="text-[10px] font-black text-white/40 uppercase tracking-widest">Recent Activity</p>
                         <h4 className="text-lg font-black uppercase tracking-tight">AI Symptom Check</h4>
                      </div>
                   </div>
                   <p className="text-xs text-white/60 leading-relaxed">System flagged moderate risk of seasonal influenza. Recommendation: Direct consultation.</p>
                </div>

                <div className="bg-white/5 p-6 rounded-3xl border border-white/5">
                   <h5 className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-4">Past Prescriptions</h5>
                   <div className="space-y-4">
                      {['Paracetamol 500mg', 'Vitamin C', 'Zincovit'].map((med, i) => (
                        <div key={i} className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
                           <span className="text-xs font-bold text-white/80">{med}</span>
                           <span className="text-[10px] font-black text-primary uppercase">Apr 12</span>
                        </div>
                      ))}
                   </div>
                </div>
                
                <button className="w-full bg-primary py-5 rounded-[2rem] font-black uppercase tracking-widest text-[10px] shadow-2xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all">
                   Upload New Report
                </button>
             </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default VideoConsultation;

