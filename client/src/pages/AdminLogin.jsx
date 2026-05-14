import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Lock, Eye, EyeOff, ArrowRight, ArrowLeft, Loader2, Mail, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

const AdminLogin = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const user = await login(formData.email, formData.password);
      if (user) {
        if (user.role === 'admin') {
          navigate('/admin');
        } else {
          setError(`Access Denied: You are logged in as a ${user.role}, but this portal is for Admins only.`);
        }
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Login failed';
      if (msg.toLowerCase().includes('email') || msg.toLowerCase().includes('password')) {
        setError('Invalid Admin ID or Password. Please check your credentials.');
      } else {
        setError(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-6 transition-colors duration-300">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full bg-white dark:bg-slate-900 p-10 rounded-[2.5rem] shadow-2xl border border-slate-200 dark:border-slate-800 relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full -mr-16 -mt-16 blur-3xl" />
        
        <div className="text-center mb-10 relative z-10">
          <button 
            onClick={() => navigate('/role-selection')}
            className="mb-6 inline-flex items-center gap-2 text-slate-400 hover:text-primary transition-colors font-bold uppercase tracking-widest text-[10px]"
          >
            <ArrowLeft className="w-3 h-3" /> Change Role
          </button>
          
          <div className="inline-flex items-center justify-center w-20 h-20 bg-amber-500/10 rounded-3xl text-amber-600 mb-6 shadow-xl shadow-amber-500/5">
            <ShieldCheck className="w-10 h-10" />
          </div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-2 uppercase tracking-tight">Admin Portal</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm font-bold">Secure management and analytics</p>
        </div>

        {error && (
          <motion.div 
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-600 text-xs font-black uppercase flex items-center justify-center gap-3 tracking-wider"
          >
            <AlertTriangle className="w-4 h-4" />
            {error}
          </motion.div>
        )}

        <form onSubmit={handleLogin} className="space-y-5 relative z-10">
          <div className="relative group">
            <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-amber-600 transition-colors" />
            <input 
              type="email" 
              placeholder="Admin Email"
              required
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl pl-14 pr-6 py-4 outline-none focus:ring-4 focus:ring-amber-500/10 focus:border-amber-600 transition-all dark:text-white font-bold"
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
          </div>

          <div className="relative group">
            <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-amber-600 transition-colors" />
            <input 
              type={showPassword ? "text" : "password"} 
              placeholder="Admin Password"
              required
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl pl-14 pr-14 py-4 outline-none focus:ring-4 focus:ring-amber-500/10 focus:border-amber-600 transition-all dark:text-white font-bold"
              onChange={(e) => setFormData({...formData, password: e.target.value})}
            />
            <button 
              type="button" 
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-amber-600 transition-colors"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-slate-900 dark:bg-amber-600 text-white py-5 rounded-2xl font-black text-lg shadow-xl hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 mt-4"
          >
            {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <>Authorize Access <ArrowRight className="w-6 h-6" /></>}
          </button>
        </form>

        <p className="mt-10 text-center text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] leading-relaxed">
          Warning: Restricted Access.<br />All attempts are logged and monitored.
        </p>
      </motion.div>
    </div>
  );
};

export default AdminLogin;
