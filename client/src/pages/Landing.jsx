import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { 
  ArrowRight, Video, Clipboard, Truck, Phone, 
  ShieldCheck, Activity, Users, MapPin, Search,
  Facebook, Twitter, Instagram, Linkedin, Mail, Send,
  Download, Smartphone, Monitor, ChevronRight
} from 'lucide-react';
import { motion } from 'framer-motion';
import ThemeToggle from '../components/ThemeToggle';
import Logo from '../components/Logo';
import TruckLoader from '../components/TruckLoader';
import HospitalLoader from '../components/HospitalLoader';
import TactileButton from '../components/TactileButton';
import ConsultationLoader from '../components/ConsultationLoader';
import AILoader from '../components/AILoader';
import { useAuth } from '../context/AuthContext';

const Landing = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleAction = () => {
    if (user) {
      if (user.role === 'patient') navigate('/patient');
      else if (user.role === 'doctor') navigate('/doctor');
      else if (user.role === 'pharmacy') navigate('/pharmacy');
    } else {
      navigate('/role-selection');
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-slate-950 transition-colors duration-300">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 liquid-glass border-b border-slate-200 dark:border-slate-800 px-4 md:px-6 py-4 overflow-hidden">
        <div className="max-w-7xl mx-auto flex items-center justify-between relative z-10">
          <div className="cursor-pointer" onClick={() => navigate('/')}>
            <Logo size="md" />
          </div>
          <div className="hidden lg:flex items-center gap-8">
            <a href="#services" className="text-sm font-bold text-slate-600 dark:text-slate-400 hover:text-primary transition-colors">Services</a>
            <a href="#ai-health" className="text-sm font-bold text-slate-600 dark:text-slate-400 hover:text-primary transition-colors">AI Health</a>
            <button 
              onClick={() => navigate('/about')}
              className="text-sm font-bold text-slate-600 dark:text-slate-400 hover:text-primary transition-colors"
            >
              About
            </button>
          </div>
          <div className="flex items-center gap-2 md:gap-4 relative z-10">
            <ThemeToggle />
            <button 
              onClick={() => navigate('/role-selection')}
              className="hidden sm:block text-sm font-bold text-slate-600 dark:text-slate-400 hover:text-primary transition-colors"
            >
              Login
            </button>
            <button 
              onClick={() => navigate('/signup')}
              className="bg-primary text-white px-4 md:px-5 py-2 md:py-2.5 rounded-xl font-bold text-xs md:text-sm shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all"
            >
              Sign Up
            </button>
          </div>
        </div>
      </nav>
      
      {/* Hero Section */}
      <header className="px-6 py-20 md:py-32 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full pointer-events-none opacity-10 dark:opacity-20">
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-healthcare-teal rounded-full blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <span className="inline-block px-4 py-1.5 bg-primary/10 text-primary rounded-full text-xs font-black uppercase tracking-widest mb-6">
              Empowering Rural India
            </span>
            <h1 className="text-5xl md:text-7xl font-black text-slate-800 dark:text-white mb-8 leading-[1.1]">
              Healthcare at your <br /> <span className="text-primary">Doorstep</span>, Literally.
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-400 mb-12 max-w-2xl mx-auto leading-relaxed">
              RuralMed brings high-quality video consultations, AI symptom checkers, and medicine delivery to every corner of India.
            </p>
            <div className="flex flex-col sm:flex-row gap-5 justify-center items-center scale-110 mt-12">
              <TactileButton onClick={handleAction}>
                Book Appointment <ArrowRight className="w-5 h-5" />
              </TactileButton>
              
              <button 
                onClick={() => navigate('/emergency')}
                className="bg-white dark:bg-slate-900 text-red-600 border-2 border-red-100 dark:border-red-900/30 px-10 py-4 rounded-2xl font-black text-lg hover:bg-red-50 dark:hover:bg-red-900/10 transition-all flex items-center justify-center gap-3"
              >
                <Phone className="w-6 h-6" /> Emergency Help
              </button>
            </div>
          </motion.div>
        </div>
      </header>

      {/* AI Health Banner */}
      <section id="ai-health" className="px-6 py-12">
        <div className="max-w-7xl mx-auto relative overflow-hidden rounded-[3rem] group">
          {/* Adaptive Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 to-white dark:from-slate-900 dark:to-slate-800 border border-emerald-200 dark:border-slate-700 shadow-2xl transition-colors duration-500" />
          
          {/* Animated Background Elements */}
          <div className="absolute top-0 right-0 w-full h-full opacity-30 pointer-events-none">
             <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 rounded-full blur-[80px] -mr-48 -mt-48 animate-pulse" />
             <div className="absolute bottom-0 left-0 w-64 h-64 bg-cyan-400/10 rounded-full blur-[60px] -ml-32 -mb-32" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center relative z-10 p-8 md:p-10">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary/10 rounded-full text-[10px] font-black uppercase tracking-[0.2em] text-primary">
                <Activity className="w-3 h-3 animate-pulse" /> RuralMed AI
              </div>
              
              <h2 className="text-3xl md:text-5xl font-black text-slate-800 dark:text-white leading-tight tracking-tight">
                Not feeling well? <br /> 
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-emerald-600 dark:from-primary dark:to-cyan-400">
                  Try AI Checker.
                </span>
              </h2>
              
              <p className="text-slate-600 dark:text-slate-300 text-base md:text-lg leading-relaxed font-medium max-w-md">
                Get instant recommendations. Our AI model is precision-tuned for rural healthcare needs.
              </p>
              
              <div className="pt-2">
                <TactileButton onClick={() => navigate('/symptom-checker')} className="scale-90 origin-left">
                  Start AI Check
                </TactileButton>
              </div>
            </div>

            <div className="hidden md:flex justify-end pr-8">
              <motion.div 
                animate={{ 
                  y: [0, -15, 0],
                  rotate: [0, 3, 0]
                }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                className="relative"
              >
                <div className="absolute inset-0 bg-primary/20 rounded-full blur-2xl scale-110" />
                <div className="relative w-48 h-48 bg-white/40 dark:bg-slate-800/40 border-2 border-white/60 dark:border-white/10 rounded-[3rem] backdrop-blur-2xl flex items-center justify-center shadow-xl">
                  <div className="w-32 h-32 bg-gradient-to-br from-primary to-emerald-600 rounded-[2rem] flex items-center justify-center shadow-lg">
                    <ShieldCheck className="w-16 h-16 text-white drop-shadow-lg" />
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="px-6 py-24 max-w-7xl mx-auto w-full">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-black text-slate-800 dark:text-white mb-4 uppercase tracking-tight">Our Services</h2>
          <p className="text-slate-500 dark:text-slate-400 max-w-xl mx-auto">Comprehensive healthcare solutions designed for rural India.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <ServiceCard 
            icon={<ConsultationLoader />}
            title="Online Consultation"
            desc="Connect with top doctors via secure video calls anywhere."
            color="bg-blue-500"
            onClick={handleAction}
          />
          <ServiceCard 
            icon={<AILoader />}
            title="Symptom Checker"
            desc="Check your health status instantly with our AI tool."
            color="bg-emerald-500"
            onClick={() => navigate('/symptom-checker')}
          />
          <ServiceCard 
            icon={<TruckLoader />}
            title="Medicine Delivery"
            desc="Get medicines delivered from the nearest pharmacy."
            color="bg-orange-500"
            onClick={handleAction}
          />
          <ServiceCard 
            icon={<HospitalLoader />}
            title="Nearby Hospitals"
            desc="Find and navigate to the nearest healthcare centers."
            color="bg-purple-500"
            onClick={() => navigate('/hospitals')}
          />
        </div>
      </section>

      {/* PWA Installation Section */}
      <section className="px-6 py-24 bg-white dark:bg-slate-950">
        <div className="max-w-7xl mx-auto">
          <div className="bg-slate-900 rounded-[4rem] p-12 md:p-20 text-white relative overflow-hidden shadow-2xl border border-white/5">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">
              <div className="space-y-8">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/20 rounded-full text-[10px] font-black uppercase tracking-[0.2em] text-primary border border-primary/20">
                  <Download className="w-3 h-3" /> Mobile-Ready Platform
                </div>
                <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter leading-none">
                  Install RuralMed <br /> on <span className="text-primary">Any Device.</span>
                </h2>
                <p className="text-slate-400 text-lg font-medium leading-relaxed max-w-md">
                  Experience lightning-fast access, offline records, and instant notifications by adding RuralMed to your home screen.
                </p>
                <div className="flex flex-wrap gap-4 pt-4">
                   <div className="flex items-center gap-3 bg-white/5 border border-white/10 px-6 py-3 rounded-2xl">
                      <Smartphone className="w-5 h-5 text-primary" />
                      <span className="text-xs font-black uppercase tracking-widest text-slate-300">Android & iOS</span>
                   </div>
                   <div className="flex items-center gap-3 bg-white/5 border border-white/10 px-6 py-3 rounded-2xl">
                      <Monitor className="w-5 h-5 text-blue-400" />
                      <span className="text-xs font-black uppercase tracking-widest text-slate-300">Windows & macOS</span>
                   </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white/5 p-8 rounded-[2.5rem] border border-white/10 hover:bg-white/10 transition-all group">
                   <div className="w-12 h-12 bg-primary text-white rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-primary/20">
                      <Smartphone className="w-6 h-6" />
                   </div>
                   <h4 className="text-lg font-black uppercase tracking-tight mb-4">On Mobile</h4>
                   <ul className="text-xs space-y-3 text-slate-400 font-bold uppercase tracking-widest">
                      <li className="flex items-center gap-2 text-white"><ChevronRight className="w-3 h-3 text-primary" /> Open in Chrome/Safari</li>
                      <li className="flex items-center gap-2"><ChevronRight className="w-3 h-3" /> Tap "Add to Home Screen"</li>
                      <li className="flex items-center gap-2"><ChevronRight className="w-3 h-3" /> Launch from App Drawer</li>
                   </ul>
                </div>

                <div className="bg-white/5 p-8 rounded-[2.5rem] border border-white/10 hover:bg-white/10 transition-all group">
                   <div className="w-12 h-12 bg-blue-500 text-white rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-blue-500/20">
                      <Monitor className="w-6 h-6" />
                   </div>
                   <h4 className="text-lg font-black uppercase tracking-tight mb-4">On Desktop</h4>
                   <ul className="text-xs space-y-3 text-slate-400 font-bold uppercase tracking-widest">
                      <li className="flex items-center gap-2 text-white"><ChevronRight className="w-3 h-3 text-blue-500" /> Click Install in URL Bar</li>
                      <li className="flex items-center gap-2"><ChevronRight className="w-3 h-3" /> Create Desktop Shortcut</li>
                      <li className="flex items-center gap-2"><ChevronRight className="w-3 h-3" /> Works like a Native App</li>
                   </ul>
                </div>
              </div>
            </div>
            
            {/* Background design */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-[120px] -mr-48 -mt-48" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/10 rounded-full blur-[100px] -ml-32 -mb-32" />
          </div>
        </div>
      </section>

      {/* Enhanced Footer */}
      <footer className="mt-auto bg-slate-950 text-slate-400 py-24 px-6 relative overflow-hidden">
        {/* Newsletter Section */}
        <div className="max-w-7xl mx-auto mb-20">
          <div className="bg-gradient-to-r from-primary/20 to-emerald-500/20 rounded-[3rem] p-12 md:p-20 border border-white/5 relative overflow-hidden backdrop-blur-3xl">
             <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
                <div>
                   <h3 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tighter mb-4 leading-none">
                      Stay healthy, <br /> stay <span className="text-primary">informed.</span>
                   </h3>
                   <p className="text-slate-400 font-bold max-w-sm">Join 50,000+ rural citizens receiving weekly health tips and platform updates.</p>
                </div>
                <div className="flex flex-col sm:flex-row gap-4">
                   <div className="flex-1 relative group">
                      <Mail className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-primary transition-colors" />
                      <input 
                        type="email" 
                        placeholder="Enter your email"
                        className="w-full bg-white/5 border border-white/10 rounded-2xl pl-16 pr-6 py-5 outline-none focus:border-primary/50 transition-all text-white font-bold"
                      />
                   </div>
                   <button className="bg-primary text-white px-10 py-5 rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3">
                      Subscribe <Send className="w-4 h-4" />
                   </button>
                </div>
             </div>
             {/* Design elements */}
             <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[100px] -mr-32 -mt-32" />
          </div>
        </div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 lg:gap-24 mb-24">
          <div className="space-y-8">
            <Logo size="md" />
            <p className="text-slate-400 font-medium leading-relaxed max-w-sm">
               Building the digital backbone for India's rural healthcare ecosystem. Connecting millions to world-class medical care.
            </p>
            <div className="flex gap-4">
              <SocialIcon icon={<Facebook className="w-5 h-5" />} hoverColor="hover:bg-blue-600" />
              <SocialIcon icon={<Twitter className="w-5 h-5" />} hoverColor="hover:bg-sky-500" />
              <SocialIcon icon={<Instagram className="w-5 h-5" />} hoverColor="hover:bg-pink-600" />
              <SocialIcon icon={<Linkedin className="w-5 h-5" />} hoverColor="hover:bg-blue-700" />
            </div>
          </div>

          <div>
            <h4 className="font-black text-white mb-8 uppercase tracking-[0.3em] text-[10px]">The Platform</h4>
            <ul className="space-y-4 font-bold text-sm">
              <li><a href="#" className="hover:text-primary transition-colors">Digital Pharmacy</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Video Consultations</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Health Records</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">AI Diagnostics</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Emergency Map</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-black text-white mb-8 uppercase tracking-[0.3em] text-[10px]">Quick Help</h4>
            <ul className="space-y-4 font-bold text-sm">
              <li><a href="#" className="hover:text-red-500 transition-colors text-red-500">24/7 Ambulance</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Support Center</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">FAQs & Guides</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Terms of Service</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-black text-white mb-8 uppercase tracking-[0.3em] text-[10px]">Contact Us</h4>
            <div className="space-y-6">
               <div className="flex items-start gap-4">
                  <div className="p-3 bg-white/5 rounded-xl text-primary"><MapPin size={20} /></div>
                  <p className="text-sm font-bold leading-relaxed">LNCT Campus, Raisen Rd, <br /> Bhopal, MP 462022</p>
               </div>
               <div className="flex items-center gap-4">
                  <div className="p-3 bg-white/5 rounded-xl text-primary"><Phone size={20} /></div>
                  <p className="text-sm font-bold">+91 1800-MED-RURAL</p>
               </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20">
            © 2026 RuralMed Healthcare Connect. All rights reserved.
          </p>
          <div className="flex items-center gap-8">
             <span className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-500 flex items-center gap-2">
                <ShieldCheck size={14} /> HIPAA COMPLIANT
             </span>
             <span className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-500 flex items-center gap-2">
                <Activity size={14} /> ISO 27001 CERTIFIED
             </span>
          </div>
        </div>
        
        {/* Background Accent */}
        <div className="absolute bottom-0 right-0 w-full h-1 bg-gradient-to-r from-primary via-emerald-500 to-blue-500" />
      </footer>
    </div>
  );
};

const ServiceCard = ({ icon, title, desc, color, onClick }) => (
  <motion.div 
    whileHover={{ y: -10 }}
    onClick={onClick}
    className="p-10 liquid-glass rounded-[3rem] shadow-xl hover:shadow-2xl transition-all cursor-pointer group overflow-hidden"
  >
    <div className={`${color} w-20 h-20 rounded-3xl flex items-center justify-center text-white mb-8 shadow-lg shadow-inherit/20 group-hover:scale-110 transition-transform relative z-10`}>
      {icon}
    </div>
    <h3 className="text-2xl font-black text-slate-800 dark:text-white mb-4 uppercase tracking-tight relative z-10">{title}</h3>
    <p className="text-slate-500 dark:text-slate-400 leading-relaxed text-lg relative z-10">{desc}</p>
  </motion.div>
);

const SocialIcon = ({ icon, hoverColor = "hover:bg-primary" }) => (
  <div className={`w-12 h-12 bg-white/5 text-slate-400 rounded-2xl flex items-center justify-center ${hoverColor} hover:text-white hover:scale-110 active:scale-95 transition-all cursor-pointer border border-white/5`}>
    {icon}
  </div>
);

export default Landing;

