import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  User, Stethoscope, Pill, ArrowRight, ArrowLeft, 
  ShieldCheck, Heart, Activity, Star, 
  CheckCircle2, Globe, Users, Zap, Shield, HelpCircle
} from 'lucide-react';
import { motion } from 'framer-motion';
import Logo from '../components/Logo';

const SignUp = () => {
  const navigate = useNavigate();

  const registrationRoles = [
    {
      id: 'patient',
      title: 'Join as Patient',
      desc: 'Access instant AI symptom checks, book top-tier rural doctors, and manage your health records digitally.',
      benefits: ["AI Symptom Analysis", "Video Consultations", "Digital Prescriptions"],
      icon: <User className="w-8 h-8" />,
      path: '/patient-signup',
      color: 'bg-emerald-500',
      shadow: 'shadow-emerald-500/30'
    },
    {
      id: 'doctor',
      title: 'Join as Doctor',
      desc: 'Expand your reach to rural communities, manage appointments efficiently, and provide remote care.',
      benefits: ["Remote Practice Tools", "Verified Profile", "Patient Management"],
      icon: <Stethoscope className="w-8 h-8" />,
      path: '/doctor-signup',
      color: 'bg-blue-500',
      shadow: 'shadow-blue-500/30'
    },
    {
      id: 'pharmacy',
      title: 'Join as Pharmacy',
      desc: 'Register your medical store, manage inventory, and provide essential medicines to those in need.',
      benefits: ["Inventory Control", "Medicine Delivery", "Sales Analytics"],
      icon: <Pill className="w-8 h-8" />,
      path: '/pharmacy-signup',
      color: 'bg-purple-500',
      shadow: 'shadow-purple-500/30'
    }
  ];

  const platformStats = [
    { icon: <Users className="w-4 h-4" />, label: "Active Users", val: "12k+" },
    { icon: <Activity className="w-4 h-4" />, label: "Consultations", val: "45k+" },
    { icon: <Star className="w-4 h-4" />, label: "Rating", val: "4.9/5" }
  ];

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      {/* Left Side: Rich Branding & Benefits */}
      <div className="lg:w-2/5 bg-slate-900 relative overflow-hidden flex flex-col justify-between p-10 md:p-16">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=1200&auto=format&fit=crop&q=80')] bg-cover bg-center opacity-10 grayscale" />
        <div className="absolute inset-0 bg-gradient-to-br from-primary/90 to-slate-950/95" />
        
        <div className="relative z-10">
          <Logo size="lg" />
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-16 space-y-6"
          >
            <h1 className="text-5xl md:text-6xl font-black text-white uppercase tracking-tighter leading-none">
              Transforming <br /> Rural <br /> <span className="text-primary">Healthcare.</span>
            </h1>
            <p className="text-white/60 text-base font-bold leading-relaxed max-w-sm">
              We are building the digital backbone for India's rural health ecosystem. Join us to bridge the gap.
            </p>

            <div className="flex flex-col gap-6 pt-6">
               <div className="flex -space-x-3 group/stack">
                  {['abhay_raj.png', 'anushka_parmar.png', 'anushka_yadav.png', 'ayush_tiwari.png'].map((img, i) => (
                    <motion.div 
                      key={i}
                      whileHover={{ y: -5, scale: 1.1, zIndex: 50 }}
                      className="relative"
                    >
                      <img 
                        src={`/${img}`} 
                        alt="Community Member" 
                        className="w-10 h-10 rounded-full border-2 border-slate-900 shadow-xl object-cover" 
                      />
                    </motion.div>
                  ))}
                  <div className="w-10 h-10 rounded-full bg-emerald-500 border-2 border-slate-900 flex items-center justify-center text-[10px] font-black text-white shadow-xl relative z-10">
                     +12k
                  </div>
               </div>

               <div className="flex flex-wrap gap-4">
                  {platformStats.map((stat, i) => (
                    <div key={i} className="bg-white/5 border border-white/10 backdrop-blur-md px-4 py-2 rounded-2xl">
                       <p className="text-[10px] font-black uppercase tracking-widest text-primary mb-1 flex items-center gap-1">
                          {stat.icon} {stat.label}
                       </p>
                       <p className="text-sm font-black text-white">{stat.val}</p>
                    </div>
                  ))}
               </div>
            </div>
          </motion.div>
        </div>

        <div className="relative z-10 mt-12 space-y-6">
           <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/5 p-4 rounded-3xl border border-white/10 backdrop-blur-md flex items-center gap-3">
                 <Shield className="w-5 h-5 text-emerald-400" />
                 <p className="text-[10px] font-black uppercase tracking-widest text-white">Secure Data</p>
              </div>
              <div className="bg-white/5 p-4 rounded-3xl border border-white/10 backdrop-blur-md flex items-center gap-3">
                 <Zap className="w-5 h-5 text-amber-400" />
                 <p className="text-[10px] font-black uppercase tracking-widest text-white">Instant Sync</p>
              </div>
           </div>
           <p className="text-[10px] text-white/30 font-bold uppercase tracking-widest text-center">© 2026 RuralMed Healthcare Platform</p>
        </div>
      </div>

      {/* Right Side: Role Selection Grid */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-12 lg:p-20 overflow-y-auto">
        <div className="w-full max-w-4xl">
          <div className="mb-16 text-center lg:text-left flex flex-col lg:flex-row lg:items-end justify-between gap-8">
            <div className="space-y-4">
              <button 
                onClick={() => navigate('/')}
                className="inline-flex items-center gap-2 text-slate-400 hover:text-primary transition-colors font-black uppercase tracking-widest text-[10px] group"
              >
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Home
              </button>
              <h2 className="text-5xl font-black text-slate-900 dark:text-white uppercase tracking-tighter leading-none">Create Account</h2>
              <p className="text-slate-500 dark:text-slate-400 font-bold max-w-md">Choose your path to get started with the RuralMed ecosystem.</p>
            </div>
            
            <Link to="/help" className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-primary transition-colors bg-white dark:bg-slate-900 px-6 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
               <HelpCircle className="w-4 h-4" /> Need Help?
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {registrationRoles.map((role) => (
              <motion.div
                key={role.id}
                whileHover={{ y: -10, scale: 1.02 }}
                onClick={() => navigate(role.path)}
                className="group cursor-pointer bg-white dark:bg-slate-900 p-8 rounded-[3rem] border border-slate-200 dark:border-slate-800 shadow-xl hover:shadow-2xl transition-all flex flex-col h-full relative overflow-hidden"
              >
                {/* Accent Background */}
                <div className={`absolute top-0 right-0 w-24 h-24 ${role.color} opacity-[0.03] rounded-full -mr-12 -mt-12 group-hover:scale-150 transition-transform duration-700`} />
                
                <div className={`${role.color} w-16 h-16 rounded-[1.5rem] flex items-center justify-center text-white mb-8 shadow-xl ${role.shadow} group-hover:rotate-6 transition-all`}>
                  {role.icon}
                </div>
                
                <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight mb-4">{role.title}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 font-bold mb-8 leading-relaxed flex-grow">{role.desc}</p>
                
                <div className="space-y-3 mb-10">
                   {role.benefits.map((benefit, i) => (
                     <div key={i} className="flex items-center gap-2">
                        <CheckCircle2 className={`w-4 h-4 ${role.color.replace('bg-', 'text-')}`} />
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors">{benefit}</span>
                     </div>
                   ))}
                </div>

                <div className="w-full flex items-center justify-between pt-6 border-t border-slate-50 dark:border-slate-800">
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Get Started</span>
                  <div className={`${role.color} p-3 rounded-2xl text-white group-hover:translate-x-2 transition-transform`}>
                    <ArrowRight className="w-5 h-5" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-20 pt-10 border-t border-slate-100 dark:border-slate-800 text-center space-y-6">
             <p className="text-slate-500 dark:text-slate-400 font-bold">
                Already part of the network? <Link to="/role-selection" className="text-primary font-black hover:underline uppercase tracking-[0.2em] text-xs ml-3 bg-primary/5 px-4 py-2 rounded-xl">Login Now</Link>
             </p>
             <div className="pt-4">
                <Link to="/admin-login" className="text-[10px] font-black text-slate-400 hover:text-amber-500 transition-colors uppercase tracking-[0.4em] flex items-center justify-center gap-2">
                   <ShieldCheck className="w-3 h-3" /> Admin Entrance
                </Link>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
