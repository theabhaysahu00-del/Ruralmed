import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Stethoscope, Lock, Eye, EyeOff, ArrowRight, ArrowLeft, Loader2, Mail, 
  ShieldCheck, Activity, Award, Briefcase, CheckCircle2
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const DoctorLogin = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = await login(formData.email, formData.password);
      if (user && user.role === 'doctor') {
        toast.success("Welcome back, Doctor!");
        navigate('/doctor');
      } else if (user) {
        toast.error('Invalid access for Doctor portal.');
      }
    } catch (err) {
      toast.error(err.message || 'Login failed. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-6 py-20 transition-colors duration-300 relative overflow-hidden">
      {/* Background Mesh */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-indigo-500/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-4xl w-full grid grid-cols-1 lg:grid-cols-12 bg-white dark:bg-slate-900 rounded-[3rem] shadow-2xl border border-slate-200 dark:border-slate-800 relative z-10 overflow-hidden"
      >
        {/* Left Side: Professional Panel */}
        <div className="lg:col-span-5 bg-slate-900 p-12 relative overflow-hidden hidden lg:flex flex-col justify-between">
           <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-indigo-600/20" />
           
           <div className="relative z-10">
              <div className="w-14 h-14 bg-white/10 backdrop-blur-xl rounded-2xl flex items-center justify-center mb-12 border border-white/20 shadow-xl">
                 <Stethoscope className="w-7 h-7 text-blue-400" />
              </div>
              <h2 className="text-4xl font-black text-white uppercase tracking-tighter leading-none mb-8">
                 Doctor <br /> Professional <br /> <span className="text-blue-400">Hub.</span>
              </h2>
              <div className="space-y-6">
                 {[
                   "Manage Consultations",
                   "Digital Prescriptions",
                   "Patient History Access",
                   "Secure Lab Reports"
                 ].map((text, i) => (
                   <div key={i} className="flex items-center gap-3">
                      <div className="w-5 h-5 bg-blue-500/20 rounded-full flex items-center justify-center border border-blue-500/30">
                         <CheckCircle2 className="w-3 h-3 text-blue-400" />
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-300">{text}</span>
                   </div>
                 ))}
              </div>
           </div>

           <div className="relative z-10 mt-12 bg-white/5 backdrop-blur-xl p-8 rounded-[2.5rem] border border-white/10 flex items-center gap-5">
              <div className="p-4 bg-blue-500/20 rounded-2xl text-blue-400">
                 <Award className="w-6 h-6" />
              </div>
              <div>
                 <p className="text-[10px] font-black uppercase tracking-widest text-white mb-1">MCI Verified</p>
                 <p className="text-[9px] text-white/40 font-bold uppercase">Professional standards active</p>
              </div>
           </div>
        </div>

        {/* Right Side: Login Form */}
        <div className="lg:col-span-7 p-8 md:p-16 flex flex-col justify-center bg-white dark:bg-slate-900/50 backdrop-blur-3xl">
          <div className="mb-12">
            <button 
              onClick={() => navigate('/role-selection')}
              className="mb-8 inline-flex items-center gap-2 text-slate-400 hover:text-primary transition-colors font-black uppercase tracking-[0.3em] text-[10px] group"
            >
              <ArrowLeft className="w-3 h-3 group-hover:-translate-x-1 transition-transform" /> Back to Selection
            </button>
            <h1 className="text-4xl font-black text-slate-900 dark:text-white uppercase tracking-tighter mb-2">Welcome, Expert</h1>
            <p className="text-slate-500 dark:text-slate-400 font-bold text-sm">Enter your clinical credentials to access the hub.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="group space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4 group-focus-within:text-blue-500 transition-colors">Medical Email</label>
              <div className="relative">
                <Mail className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                <input required type="email" placeholder="dr.smith@medical.com" className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-800 rounded-3xl pl-16 pr-8 py-5 outline-none focus:border-blue-500 transition-all dark:text-white font-bold" 
                  onChange={e => setFormData({...formData, email: e.target.value})} />
              </div>
            </div>

            <div className="group space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4 group-focus-within:text-blue-500 transition-colors">Password</label>
              <div className="relative">
                <Lock className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                <input required type={showPassword ? "text" : "password"} placeholder="••••••••" className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-800 rounded-3xl pl-16 pr-14 py-5 outline-none focus:border-blue-500 transition-all dark:text-white font-bold" 
                  onChange={e => setFormData({...formData, password: e.target.value})} />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-500 transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="flex justify-end pr-4">
               <button type="button" className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-blue-500 transition-colors">Forgot Password?</button>
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-6 rounded-3xl font-black uppercase tracking-widest text-sm shadow-[0_20px_50px_rgba(37,99,235,0.3)] hover:scale-[1.01] active:scale-95 transition-all flex items-center justify-center gap-4"
            >
              {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <>Access Clinical Hub <ArrowRight className="w-5 h-5" /></>}
            </button>
          </form>

          <div className="mt-12 pt-8 border-t border-slate-100 dark:border-slate-800 text-center">
             <p className="text-slate-500 font-bold text-sm">
                Need to join the network? <Link to="/doctor-signup" className="text-blue-500 font-black hover:underline uppercase tracking-widest text-xs ml-2">Request Onboarding</Link>
             </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default DoctorLogin;
