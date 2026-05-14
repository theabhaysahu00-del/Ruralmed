import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Phone, Lock, ArrowRight, ShieldCheck, AlertCircle, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import Logo from '../components/Logo';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const user = await login(formData.email, formData.password);
      
      if (user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/role-selection');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 px-4 transition-colors duration-300">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-white dark:bg-slate-900 p-10 rounded-4xl shadow-2xl border border-slate-100 dark:border-slate-800 relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 blur-2xl" />
        
        <div className="flex flex-col items-center mb-10 relative z-10">
          <Logo size="lg" className="mb-4" />
          <p className="text-slate-500 dark:text-slate-400">Secure Healthcare Access</p>
        </div>

        {error && (
          <motion.div 
            initial={{ opacity: 0, x: -10 }} 
            animate={{ opacity: 1, x: 0 }}
            className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-3 text-red-600 text-sm font-bold"
          >
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            {error}
          </motion.div>
        )}

        <form onSubmit={handleLogin} className="space-y-6 relative z-10">
          <div className="relative">
            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input 
              type="email" 
              placeholder="Admin Email / User Email"
              required
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl pl-12 pr-4 py-4 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all dark:text-white"
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input 
              type="password" 
              placeholder="Password"
              required
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl pl-12 pr-4 py-4 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all dark:text-white"
              onChange={(e) => setFormData({...formData, password: e.target.value})}
            />
          </div>

          <div className="flex justify-end">
            <button type="button" className="text-sm font-bold text-primary hover:underline">Forgot Password?</button>
          </div>

          <button 
            type="submit"
            disabled={loading}
            className={`w-full bg-primary text-white py-4 rounded-2xl font-bold text-lg shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Login'}
            {!loading && <ArrowRight className="w-5 h-5" />}
          </button>
        </form>

        <p className="mt-8 text-center text-slate-600 dark:text-slate-400 relative z-10">
          Don't have an account? <Link to="/signup" className="text-primary font-bold hover:underline">Sign up for free</Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Login;
