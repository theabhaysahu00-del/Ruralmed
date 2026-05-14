import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Calendar, Clock, User, Stethoscope, CheckCircle, 
  ArrowRight, ChevronRight, Star, ShieldCheck, 
  Activity, MessageSquare, AlertCircle, Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const doctors = [
  { 
    id: 1, 
    name: "Dr. Rajesh Sharma", 
    specialty: "General Physician", 
    rating: 4.9, 
    reviews: 128,
    img: "https://i.pravatar.cc/150?u=1",
    available: "Today"
  },
  { 
    id: 2, 
    name: "Dr. Anita Verma", 
    specialty: "Gynecologist", 
    rating: 4.8, 
    reviews: 94,
    img: "https://i.pravatar.cc/150?u=2",
    available: "Tomorrow"
  },
  { 
    id: 3, 
    name: "Dr. Vikram Singh", 
    specialty: "Pediatrician", 
    rating: 4.7, 
    reviews: 156,
    img: "https://i.pravatar.cc/150?u=3",
    available: "May 10"
  },
];

const timeSlots = ["09:00 AM", "10:30 AM", "12:00 PM", "02:30 PM", "04:00 PM", "05:30 PM"];

const BookAppointment = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [linkSymptoms, setLinkSymptoms] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleNext = () => setStep(step + 1);
  const handleConfirm = async () => {
    setLoading(true);
    try {
      const appointmentData = {
        doctorId: selectedDoctor.id.toString(), // In real app use real mongo ID
        doctorName: selectedDoctor.name,
        department: selectedDoctor.specialty,
        date: selectedDate,
        time: selectedTime,
        consultationType: 'video',
        problemDescription: `Consultation with ${selectedDoctor.name}`,
        patientName: user.name,
        patientPhone: user.phone || '9999999999',
        patientEmail: user.email,
      };

      const { data } = await axios.post('/api/appointments', appointmentData);
      
      if (data.success) {
        setStep(4);
        setTimeout(() => navigate('/patient'), 3000);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Booking failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8">
      {/* Premium Stepper */}
      <div className="flex items-center justify-between mb-16 px-4">
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex items-center flex-1 last:flex-none">
            <div className="relative group">
               <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black transition-all duration-500 ${step >= s ? 'bg-primary text-white shadow-xl shadow-primary/30 scale-110' : 'bg-white dark:bg-slate-900 text-slate-400 border border-slate-100 dark:border-slate-800'}`}>
                 {step > s ? <CheckCircle className="w-6 h-6" /> : s}
               </div>
               <p className={`absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap text-[10px] font-black uppercase tracking-widest ${step >= s ? 'text-primary' : 'text-slate-400'}`}>
                  {s === 1 ? 'Expert' : s === 2 ? 'Schedule' : 'Confirm'}
               </p>
            </div>
            {s < 3 && <div className={`flex-1 h-1 mx-6 rounded-full transition-all duration-700 ${step > s ? 'bg-primary shadow-[0_0_10px_rgba(var(--primary-rgb),0.5)]' : 'bg-slate-200 dark:bg-slate-800'}`} />}
          </div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div 
            key="step1"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <div className="mb-10 text-center md:text-left">
               <h2 className="text-4xl font-black text-slate-900 dark:text-white uppercase tracking-tight mb-2">Select Specialist</h2>
               <p className="text-slate-500 dark:text-slate-400 font-medium">Choose from our network of verified rural healthcare experts.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
              {doctors.map((doc) => (
                <motion.div 
                  key={doc.id}
                  whileHover={{ scale: 1.01 }}
                  onClick={() => { setSelectedDoctor(doc); handleNext(); }}
                  className={`p-6 bg-white dark:bg-slate-900 rounded-[2.5rem] border-2 transition-all cursor-pointer flex flex-col md:flex-row items-center gap-8 group hover:shadow-2xl ${selectedDoctor?.id === doc.id ? 'border-primary bg-primary/5' : 'border-slate-100 dark:border-slate-800 shadow-xl'}`}
                >
                  <div className="relative">
                     <img src={doc.img} alt={doc.name} className="w-24 h-24 rounded-3xl object-cover shadow-2xl group-hover:rotate-3 transition-transform" />
                     <div className="absolute -bottom-2 -right-2 bg-emerald-500 w-6 h-6 rounded-full border-4 border-white dark:border-slate-900" />
                  </div>
                  
                  <div className="flex-1 text-center md:text-left">
                    <div className="flex flex-col md:flex-row md:items-center gap-2 mb-2">
                       <h3 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">{doc.name}</h3>
                       <span className="hidden md:block w-1 h-1 bg-slate-300 rounded-full" />
                       <span className="text-emerald-600 text-xs font-black uppercase tracking-widest">{doc.available}</span>
                    </div>
                    <div className="flex flex-wrap justify-center md:justify-start gap-4">
                       <p className="text-slate-500 dark:text-slate-400 font-bold text-sm flex items-center gap-2">
                         <Stethoscope className="w-4 h-4 text-primary" /> {doc.specialty}
                       </p>
                       <p className="text-slate-500 dark:text-slate-400 font-bold text-sm flex items-center gap-2">
                         <Star className="w-4 h-4 text-amber-500 fill-current" /> {doc.rating} ({doc.reviews} reviews)
                       </p>
                    </div>
                  </div>

                  <div className="bg-primary/10 group-hover:bg-primary p-4 rounded-2xl transition-all">
                     <ChevronRight className="w-6 h-6 text-primary group-hover:text-white" />
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div 
            key="step2"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
          >
            <div className="flex items-center justify-between mb-10">
               <button onClick={() => setStep(1)} className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-primary transition-colors flex items-center gap-2">
                  <ArrowRight className="w-4 h-4 rotate-180" /> Change Doctor
               </button>
               <div className="flex items-center gap-3 bg-white dark:bg-slate-900 px-4 py-2 rounded-2xl border border-slate-100 dark:border-slate-800">
                  <img src={selectedDoctor?.img} className="w-6 h-6 rounded-lg" alt="" />
                  <span className="text-xs font-black uppercase text-slate-700 dark:text-slate-300">{selectedDoctor?.name}</span>
               </div>
            </div>

            <h2 className="text-4xl font-black text-slate-900 dark:text-white mb-12 uppercase tracking-tight text-center">Plan Consultation</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
               <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-2xl">
                 <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-6 flex items-center gap-2">
                    <Calendar className="w-4 h-4" /> Select Visitation Date
                 </label>
                 <input 
                   type="date" 
                   className="w-full bg-slate-50 dark:bg-slate-950 border-2 border-transparent rounded-2xl p-6 font-bold text-slate-900 dark:text-white outline-none focus:border-primary transition-all text-lg"
                   onChange={(e) => setSelectedDate(e.target.value)}
                 />
                 <div className="mt-8 p-4 bg-primary/5 rounded-2xl flex items-start gap-4 border border-primary/10">
                    <AlertCircle className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    <p className="text-xs font-medium text-slate-600 dark:text-slate-400 leading-relaxed">Early morning slots are highly recommended for stable video connectivity in rural zones.</p>
                 </div>
               </div>

               <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-2xl">
                 <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-6 flex items-center gap-2">
                    <Clock className="w-4 h-4" /> Available Slots
                 </label>
                 <div className="grid grid-cols-2 gap-3">
                   {timeSlots.map((time) => (
                     <button
                       key={time}
                       onClick={() => { setSelectedTime(time); handleNext(); }}
                       className={`py-5 rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all border-2 ${selectedTime === time ? 'bg-primary text-white border-primary shadow-xl shadow-primary/30 scale-105' : 'bg-slate-50 dark:bg-slate-950 text-slate-500 dark:text-slate-400 border-transparent hover:border-primary/30'}`}
                     >
                       {time}
                     </button>
                   ))}
                 </div>
               </div>
            </div>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div 
            key="step3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h2 className="text-4xl font-black text-slate-900 dark:text-white mb-12 uppercase tracking-tight">Final Verification</h2>
            
            <div className="max-w-2xl mx-auto space-y-6">
               <div className="bg-white dark:bg-slate-900 p-10 rounded-[3rem] border border-slate-100 dark:border-slate-800 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] relative overflow-hidden">
                  <div className="flex flex-col md:flex-row items-center gap-8 mb-10 pb-10 border-b border-slate-100 dark:border-slate-800">
                    <img src={selectedDoctor?.img} alt="" className="w-24 h-24 rounded-[2rem] object-cover shadow-2xl" />
                    <div className="text-center md:text-left flex-1">
                      <p className="text-[10px] font-black text-primary uppercase tracking-[0.3em] mb-2">Assigned Specialist</p>
                      <h3 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">{selectedDoctor?.name}</h3>
                      <p className="text-sm font-bold text-slate-400 mt-1 uppercase tracking-widest">{selectedDoctor?.specialty}</p>
                    </div>
                    <div className="bg-slate-50 dark:bg-slate-800 p-6 rounded-[2rem] min-w-[140px]">
                       <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Fee</p>
                       <p className="text-2xl font-black text-slate-900 dark:text-white">₹300</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-8 text-left mb-10">
                    <div className="flex items-center gap-5">
                      <div className="bg-primary/10 p-4 rounded-2xl text-primary">
                        <Calendar className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Date</p>
                        <p className="text-lg font-black text-slate-900 dark:text-white">{selectedDate || 'Not Selected'}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-5">
                      <div className="bg-primary/10 p-4 rounded-2xl text-primary">
                        <Clock className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Time</p>
                        <p className="text-lg font-black text-slate-900 dark:text-white">{selectedTime}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-50 dark:bg-slate-800 p-6 rounded-[2rem] flex items-center justify-between border border-slate-100 dark:border-slate-700">
                     <div className="flex items-center gap-4 text-left">
                        <div className="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-500">
                           <Activity className="w-6 h-6" />
                        </div>
                        <div>
                           <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">AI Sync</p>
                           <p className="text-xs font-bold text-slate-700 dark:text-slate-300">Link recent AI Symptom results</p>
                        </div>
                     </div>
                     <button 
                       onClick={() => setLinkSymptoms(!linkSymptoms)}
                       className={`w-14 h-8 rounded-full transition-all relative ${linkSymptoms ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-700'}`}
                     >
                        <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all ${linkSymptoms ? 'right-1' : 'left-1 shadow-sm'}`} />
                     </button>
                  </div>

                  {/* Design decoration */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 blur-3xl" />
               </div>

               <button 
                 onClick={handleConfirm}
                 className="w-full bg-primary text-white py-6 rounded-[2rem] font-black uppercase tracking-widest text-sm shadow-[0_20px_50px_rgba(var(--primary-rgb),0.3)] hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-4 relative overflow-hidden"
               >
                  <span className="relative z-10">{loading ? 'Processing...' : 'Confirm & Pay Securely'}</span>
                  {loading ? <Loader2 className="w-5 h-5 animate-spin relative z-10" /> : <ArrowRight className="w-5 h-5 relative z-10" />}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full hover:animate-shimmer" />
               </button>
            </div>
          </motion.div>
        )}

        {step === 4 && (
          <motion.div 
            key="step4"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-20"
          >
            <div className="relative w-32 h-32 mx-auto mb-12">
               <motion.div 
                 initial={{ scale: 0 }}
                 animate={{ scale: 1 }}
                 className="absolute inset-0 bg-primary/20 rounded-full animate-ping"
               />
               <div className="relative z-10 w-32 h-32 bg-primary text-white rounded-[2.5rem] flex items-center justify-center shadow-2xl shadow-primary/40 rotate-3">
                 <CheckCircle className="w-16 h-16" />
               </div>
            </div>
            
            <h2 className="text-5xl font-black text-slate-900 dark:text-white mb-6 uppercase tracking-tight">Booking Finalized</h2>
            <p className="text-slate-500 dark:text-slate-400 text-lg mb-12 font-medium max-w-md mx-auto leading-relaxed">
              Redirecting you to your workspace. Your consultation link will be available 5 minutes before the slot.
            </p>
            
            <div className="flex justify-center">
               <div className="h-2 w-64 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden shadow-inner">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 3 }}
                    className="h-full bg-primary shadow-[0_0_15px_rgba(var(--primary-rgb),0.6)]"
                  />
               </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .hover\\:animate-shimmer:hover {
          animation: shimmer 1.5s infinite;
        }
      `}} />
    </div>
  );
};

export default BookAppointment;

