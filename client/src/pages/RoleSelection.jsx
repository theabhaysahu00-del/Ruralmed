import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  User, Stethoscope, Pill, ShieldCheck, 
  ArrowRight, ArrowLeft, Heart, Activity, 
  Lock, Zap, Globe
} from 'lucide-react';
import { motion } from 'framer-motion';
import ThemeToggle from '../components/ThemeToggle';
import Logo from '../components/Logo';

const roles = [
  {
    id: 'patient',
    title: 'Patient',
    desc: 'Access your health records, book appointments, and get AI health support.',
    icon: <User className="w-8 h-8" />,
    path: '/patient-login',
    color: 'bg-emerald-500',
    glow: 'shadow-emerald-500/20'
  },
  {
    id: 'doctor',
    title: 'Doctor',
    desc: 'Manage your clinical practice, consult patients, and issue digital prescriptions.',
    icon: <Stethoscope className="w-8 h-8" />,
    path: '/doctor-login',
    color: 'bg-blue-500',
    glow: 'shadow-blue-500/20'
  },
  {
    id: 'pharmacy',
    title: 'Pharmacy',
    desc: 'Monitor medicine orders, manage inventory, and handle delivery requests.',
    icon: <Pill className="w-8 h-8" />,
    path: '/pharmacy-login',
    color: 'bg-purple-500',
    glow: 'shadow-purple-500/20'
  },
  {
    id: 'admin',
    title: 'Administrator',
    desc: 'Oversee platform operations, verify medical experts, and analyze network growth.',
    icon: <ShieldCheck className="w-8 h-8" />,
    path: '/admin-login',
    color: 'bg-amber-500',
    glow: 'shadow-amber-500/20'
  }
];

const RoleSelection = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center py-20 px-6 relative overflow-hidden transition-colors duration-300">
      {/* Immersive Background Mesh */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.02)_100%)] dark:bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.2)_100%)]" />
      </div>

      <div className="w-full max-w-7xl relative z-10 flex flex-col items-center">
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-20"
        >
          <div className="flex items-center justify-center gap-4 mb-10">
             <Logo size="md" />
             <div className="w-px h-8 bg-slate-200 dark:border-slate-800" />
             <ThemeToggle />
          </div>
          
          <button 
            onClick={() => navigate('/')}
            className="mb-6 inline-flex items-center gap-2 text-slate-400 hover:text-primary transition-colors font-black uppercase tracking-[0.3em] text-[10px] group"
          >
            <ArrowLeft className="w-3 h-3 group-hover:-translate-x-1 transition-transform" /> Back to Home
          </button>
          
          <h1 className="text-5xl md:text-7xl font-black text-slate-900 dark:text-white mb-6 uppercase tracking-tighter leading-none">
            Login <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-600">Portal.</span>
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-lg max-w-2xl mx-auto font-bold leading-relaxed">
            Welcome back. Please select the portal you wish to access.
          </p>
        </motion.div>

        {/* Role Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 w-full max-w-6xl">
          {roles.map((role, index) => (
            <motion.div
              key={role.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => navigate(role.path)}
              className="group cursor-pointer h-full"
            >
              <div className="relative h-full bg-white dark:bg-slate-900/40 backdrop-blur-3xl p-10 rounded-[3.5rem] border border-slate-200 dark:border-slate-800 shadow-xl hover:shadow-2xl transition-all duration-500 flex flex-col items-center text-center group-hover:-translate-y-4">
                
                <div className={`relative z-10 w-24 h-24 rounded-[2.5rem] ${role.color} flex items-center justify-center text-white mb-10 shadow-2xl ${role.glow} group-hover:scale-110 group-hover:rotate-6 transition-all duration-500`}>
                  {React.cloneElement(role.icon, { className: "w-10 h-10" })}
                </div>
                
                <h2 className="relative z-10 text-2xl font-black text-slate-900 dark:text-white mb-4 uppercase tracking-tighter group-hover:text-primary transition-colors">
                  {role.title}
                </h2>
                
                <p className="relative z-10 text-slate-500 dark:text-slate-400 text-sm font-bold leading-relaxed mb-10 flex-1">
                  {role.desc}
                </p>

                <div className="relative z-10 w-14 h-14 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400 group-hover:bg-primary group-hover:text-white transition-all duration-500 shadow-inner">
                  <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                </div>

                {/* Decorative Accent */}
                <div className={`absolute bottom-0 left-0 w-full h-1.5 ${role.color} rounded-full opacity-0 group-hover:opacity-100 transition-opacity`} />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Footer Info */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-24 flex flex-col items-center gap-8"
        >
          <div className="flex flex-wrap justify-center gap-10">
             {[
               { icon: <Lock />, text: "Secure Access" },
               { icon: <Globe />, text: "Network Ready" },
               { icon: <Zap />, text: "Fast Sync" }
             ].map((item, i) => (
               <div key={i} className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                  <div className="text-primary">{React.cloneElement(item.icon, { size: 14 })}</div>
                  {item.text}
               </div>
             ))}
          </div>
          <p className="text-slate-500 dark:text-slate-400 font-bold text-sm">
             New to the platform? <Link to="/signup" className="text-primary font-black hover:underline uppercase tracking-widest text-xs ml-2">Create Account</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default RoleSelection;
