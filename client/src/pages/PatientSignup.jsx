import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  User, Mail, Phone, Lock, Eye, EyeOff,
  ArrowRight, ArrowLeft, Loader2, MapPin, 
  ShieldCheck, Heart, Sparkles, CheckCircle2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { authAPI } from '../services/api';
import toast from 'react-hot-toast';

const PatientSignup = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    village: ''
  });

  const handleSignup = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      return toast.error("Passwords do not match");
    }
    
    setLoading(true);
    try {
      const response = await authAPI.register({
        ...formData,
        role: 'patient'
      });
      if (response.success) {
        toast.success("Welcome to RuralMed! Your journey to better health begins.");
        navigate('/patient-login');
      }
    } catch (err) {
      toast.error(err.message || "Registration failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-6 py-20 transition-colors duration-300 relative overflow-hidden">
      {/* Immersive Background Elements */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl w-full grid grid-cols-1 lg:grid-cols-12 bg-white dark:bg-slate-900 rounded-[3rem] shadow-2xl border border-slate-200 dark:border-slate-800 relative z-10 overflow-hidden"
      >
        {/* Left Side: Benefits Panel */}
        <div className="lg:col-span-4 bg-slate-900 p-10 relative overflow-hidden hidden lg:flex flex-col justify-between">
           <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/20 to-primary/20" />
           
           <div className="relative z-10">
              <div className="w-12 h-12 bg-white/10 backdrop-blur-xl rounded-2xl flex items-center justify-center mb-12 border border-white/20">
                 <Heart className="w-6 h-6 text-emerald-400" />
              </div>
              <h2 className="text-3xl font-black text-white uppercase tracking-tighter leading-tight mb-8">
                 Health starts <br /> with <span className="text-emerald-400">RuralMed.</span>
              </h2>
              <div className="space-y-6">
                 {[
                   "Instant AI Support",
                   "Video Consultations",
                   "Secure Records",
                   "Medicine Track"
                 ].map((text, i) => (
                   <div key={i} className="flex items-center gap-3">
                      <div className="w-5 h-5 bg-emerald-500/20 rounded-full flex items-center justify-center border border-emerald-500/30">
                         <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-300">{text}</span>
                   </div>
                 ))}
              </div>
           </div>

           <div className="relative z-10 bg-white/5 backdrop-blur-xl p-6 rounded-[2rem] border border-white/10">
              <div className="flex items-center gap-4 mb-4">
                 <Sparkles className="w-5 h-5 text-amber-400" />
                 <p className="text-[10px] font-black uppercase tracking-widest text-white">Join 12k+ Patients</p>
              </div>
              <div className="flex -space-x-3 overflow-hidden">
                 {['abhay_raj.png', 'anushka_parmar.png', 'anushka_yadav.png', 'ayush_tiwari.png'].map((img, i) => (
                   <img 
                     key={i} 
                     src={`/${img}`} 
                     className="inline-block h-8 w-8 rounded-full ring-2 ring-slate-900 object-cover" 
                     alt="User"
                   />
                 ))}
                 <div className="h-8 w-8 rounded-full bg-emerald-500 ring-2 ring-slate-900 flex items-center justify-center text-[8px] font-black text-white">+12k</div>
              </div>
           </div>
        </div>

        {/* Right Side: Form */}
        <div className="lg:col-span-8 p-8 md:p-12">
          <div className="flex justify-between items-start mb-10">
            <div>
              <h1 className="text-4xl font-black text-slate-900 dark:text-white uppercase tracking-tighter mb-2">Patient Signup</h1>
              <div className="flex items-center gap-2">
                 <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Medical Journey Starts Here</p>
              </div>
            </div>
            <button 
              onClick={() => navigate('/signup')}
              className="p-3 bg-slate-50 dark:bg-slate-800 text-slate-400 hover:text-primary rounded-2xl transition-all"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSignup} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="group space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4 group-focus-within:text-emerald-500 transition-colors">Full Name</label>
              <div className="relative">
                <User className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
                <input required type="text" placeholder="Rajesh Kumar" className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-800 rounded-3xl pl-16 pr-8 py-5 outline-none focus:border-emerald-500 transition-all dark:text-white font-bold" 
                  onChange={e => setFormData({...formData, name: e.target.value})} />
              </div>
            </div>

            <div className="group space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4 group-focus-within:text-emerald-500 transition-colors">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
                <input required type="email" placeholder="rajesh@mail.com" className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-800 rounded-3xl pl-16 pr-8 py-5 outline-none focus:border-emerald-500 transition-all dark:text-white font-bold" 
                  onChange={e => setFormData({...formData, email: e.target.value})} />
              </div>
            </div>

            <div className="group space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4 group-focus-within:text-emerald-500 transition-colors">Mobile Number</label>
              <div className="relative">
                <Phone className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
                <input required type="tel" placeholder="+91 XXXXX XXXXX" className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-800 rounded-3xl pl-16 pr-8 py-5 outline-none focus:border-emerald-500 transition-all dark:text-white font-bold" 
                  onChange={e => setFormData({...formData, phone: e.target.value})} />
              </div>
            </div>

            <div className="group space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4 group-focus-within:text-emerald-500 transition-colors">Village/City</label>
              <div className="relative">
                <MapPin className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
                <input required type="text" placeholder="Hamirpur, HP" className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-800 rounded-3xl pl-16 pr-8 py-5 outline-none focus:border-emerald-500 transition-all dark:text-white font-bold" 
                  onChange={e => setFormData({...formData, village: e.target.value})} />
              </div>
            </div>

            <div className="group space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4 group-focus-within:text-emerald-500 transition-colors">Create Password</label>
              <div className="relative">
                <Lock className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
                <input required type={showPassword ? "text" : "password"} placeholder="••••••••" className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-800 rounded-3xl pl-16 pr-14 py-4 outline-none focus:border-emerald-500 transition-all dark:text-white font-bold" 
                  onChange={e => setFormData({...formData, password: e.target.value})} />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-400 hover:text-emerald-500 transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="group space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4 group-focus-within:text-emerald-500 transition-colors">Confirm Password</label>
              <div className="relative">
                <ShieldCheck className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
                <input required type="password" placeholder="••••••••" className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-800 rounded-3xl pl-16 pr-8 py-5 outline-none focus:border-emerald-500 transition-all dark:text-white font-bold" 
                  onChange={e => setFormData({...formData, confirmPassword: e.target.value})} />
              </div>
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="md:col-span-2 w-full bg-emerald-500 text-white py-6 rounded-3xl font-black uppercase tracking-widest text-sm shadow-[0_20px_50px_rgba(16,185,129,0.3)] hover:scale-[1.01] active:scale-95 transition-all flex items-center justify-center gap-4 mt-4"
            >
              {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <>Initialize Health Profile <ArrowRight className="w-5 h-5" /></>}
            </button>
          </form>

          <div className="mt-12 pt-8 border-t border-slate-100 dark:border-slate-800 flex items-center justify-center gap-8">
             <p className="text-slate-500 font-bold text-sm">
                Already have an account? <Link to="/patient-login" className="text-emerald-500 font-black hover:underline uppercase tracking-widest text-xs ml-2">Login Portal</Link>
             </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default PatientSignup;
