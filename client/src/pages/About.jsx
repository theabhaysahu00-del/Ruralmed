import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ShieldCheck, 
  Mail, 
  Linkedin, 
  ArrowLeft, 
  Code2, 
  Cpu, 
  Globe, 
  HeartPulse,
  Users2,
  GraduationCap
} from 'lucide-react';

const TeamMemberCard = ({ name, role, email, linkedin, image }) => (
  <motion.div 
    whileHover={{ y: -15 }}
    className="relative group h-full"
  >
    {/* Animated Background Glow */}
    <div className="absolute -inset-1 bg-gradient-to-r from-primary via-cyan-500 to-primary rounded-[3rem] blur-xl opacity-20 group-hover:opacity-60 transition duration-500 animate-pulse"></div>
    
    <div className="relative h-full p-6 md:p-8 bg-white dark:bg-slate-900 rounded-[2.5rem] md:rounded-[3rem] border border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col items-center text-center overflow-hidden">
      {/* Decorative Top Accent */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-cyan-500"></div>
      
      <div className="relative mb-8 mt-2 flex-shrink-0">
        {/* Avatar Ring */}
        <div className="absolute -inset-4 bg-primary/5 rounded-full animate-spin-slow"></div>
        <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white dark:border-slate-800 bg-slate-100 dark:bg-slate-800 shadow-2xl relative z-10">
          {image ? (
            <img src={image} alt={name} className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500" />
          ) : (
            <Users2 className="w-12 h-12 text-primary/40" />
          )}
        </div>
        {/* Role Icon Badge */}
        <div className="absolute -bottom-1 -right-1 bg-primary p-2.5 rounded-2xl text-white shadow-xl z-20 transform group-hover:rotate-12 transition-transform">
          <Code2 className="w-5 h-5" />
        </div>
      </div>
      
      <div className="space-y-1 mb-4 flex-shrink-0 min-h-[64px] flex flex-col justify-center">
        <h3 className="text-xl font-black text-slate-800 dark:text-white uppercase tracking-tighter leading-tight">{name}</h3>
        <p className="text-[10px] font-black text-primary uppercase tracking-[0.3em]">{role}</p>
      </div>

      <p className="text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed mb-8 px-2 flex-grow">
        Dedicated to building innovative digital healthcare solutions for rural India.
      </p>
      
      <div className="flex gap-4 mt-auto flex-shrink-0">
        <a 
          href={`mailto:${email}`}
          className="p-3.5 bg-slate-50 dark:bg-slate-800 text-slate-500 hover:text-white hover:bg-primary rounded-2xl transition-all shadow-sm hover:shadow-primary/20"
        >
          <Mail className="w-5 h-5" />
        </a>
        <a 
          href={linkedin}
          target="_blank"
          rel="noopener noreferrer"
          className="p-3.5 bg-slate-50 dark:bg-slate-800 text-slate-500 hover:text-white hover:bg-primary rounded-2xl transition-all shadow-sm hover:shadow-primary/20"
        >
          <Linkedin className="w-5 h-5" />
        </a>
      </div>
    </div>
  </motion.div>
);

const About = () => {
  const navigate = useNavigate();

  const team = [
    {
      name: "Abhay Raj",
      role: "Full Stack Developer",
      email: "theabhaysahu00@gmail.com",
      linkedin: "https://linkedin.com/in/theabhaysahu",
      image: "/abhay_raj.png"
    },
    {
      name: "Ayush Tiwari",
      role: "AI/ML Developer",
      email: "tiwariayush882@gmail.com",
      linkedin: "https://linkedin.com/in/ayushtiwari",
      image: "/ayush_tiwari.png"
    },
    {
      name: "Anushka Yadav",
      role: "Frontend Developer",
      email: "anushkayadav@gmail.com",
      linkedin: "https://linkedin.com/in/anushkayadav",
      image: "/anushka_yadav.png"
    },
    {
      name: "Anushka Parmar",
      role: "Backend Developer",
      email: "anushkaparmar@gmail.com",
      linkedin: "https://linkedin.com/in/anushkaparmar",
      image: "/anushka_parmar.png"
    }
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 transition-colors duration-300 overflow-hidden">
      {/* Background Orbs & Particles */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }} />
        
        {/* Floating Particles */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            animate={{
              y: [0, -100, 0],
              x: [0, Math.random() * 50 - 25, 0],
              opacity: [0.1, 0.3, 0.1]
            }}
            transition={{
              duration: 5 + Math.random() * 5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute bg-primary/20 w-2 h-2 rounded-full blur-sm"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>

      <nav className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-100 dark:border-slate-800 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <button 
            onClick={() => navigate('/')}
            className="flex items-center gap-2 group"
          >
            <div className="bg-primary/10 p-2 rounded-xl group-hover:bg-primary group-hover:text-white transition-all">
              <ArrowLeft className="w-5 h-5" />
            </div>
            <span className="font-black tracking-tight text-slate-900 dark:text-white uppercase text-sm">Back to Home</span>
          </button>
          <div className="flex items-center gap-2">
            <div className="bg-primary p-2 rounded-xl">
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>
            <span className="text-sm font-black tracking-tight text-slate-900 dark:text-white uppercase">RuralMed</span>
          </div>
        </div>
      </nav>

      <main className="relative z-10 max-w-7xl mx-auto px-6 py-20">
        {/* Hero Section */}
        <section className="text-center mb-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-[10px] font-black uppercase tracking-widest text-primary mb-8"
          >
            <Cpu className="w-3 h-3" /> Empowering Rural India
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-6xl md:text-8xl font-black text-slate-900 dark:text-white mb-8 tracking-tighter leading-tight md:leading-none"
          >
            The Minds Behind <br className="hidden sm:block" /> 
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-cyan-500">
              RuralMed
            </span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-slate-500 dark:text-slate-400 max-w-3xl mx-auto leading-relaxed font-medium"
          >
            An AI-powered rural healthcare platform built to improve healthcare accessibility, digital consultations, and medicine management for rural communities.
          </motion.p>
          
          <motion.div 
            animate={{ y: [0, -15, 0], rotate: [0, 5, -5, 0] }}
            transition={{ duration: 6, repeat: Infinity }}
            className="mt-16 inline-flex p-8 bg-white dark:bg-slate-900 rounded-[3rem] border border-slate-100 dark:border-slate-800 shadow-[0_20px_50px_rgba(34,197,94,0.1)] relative"
          >
            <div className="absolute inset-0 bg-primary/5 rounded-[3rem] animate-pulse" />
            <div className="relative w-20 h-20 bg-gradient-to-tr from-primary to-cyan-500 rounded-3xl flex items-center justify-center text-white shadow-2xl shadow-primary/20">
              <Code2 className="w-10 h-10" />
            </div>
          </motion.div>
        </section>

        {/* Team Section */}
        <section className="mb-32">
          <div className="flex items-center gap-6 mb-16">
            <div className="h-[2px] flex-1 bg-gradient-to-r from-transparent to-slate-200 dark:to-slate-800" />
            <div className="flex flex-col items-center gap-2">
              <Users2 className="w-10 h-10 text-primary" />
              <h2 className="text-4xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">
                Our Team
              </h2>
            </div>
            <div className="h-[2px] flex-1 bg-gradient-to-l from-transparent to-slate-200 dark:to-slate-800" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <TeamMemberCard key={index} {...member} />
            ))}
          </div>
        </section>

        {/* Mentor Section */}
        <section className="mb-32">
          <div className="max-w-4xl mx-auto">
            <div className="relative group">
              <div className="absolute -inset-1.5 bg-gradient-to-r from-amber-400 via-orange-500 to-amber-600 rounded-[3.5rem] blur-xl opacity-30 group-hover:opacity-60 transition duration-1000 animate-gradient-x"></div>
              <div className="relative bg-white dark:bg-slate-900 rounded-[3.5rem] p-10 md:p-16 border-2 border-amber-500/10 dark:border-amber-500/5 shadow-2xl flex flex-col md:flex-row items-center gap-12">
                <div className="relative">
                  <div className="w-40 h-40 rounded-[2.5rem] bg-gradient-to-br from-amber-50 to-orange-50 dark:from-slate-800 dark:to-slate-800 flex items-center justify-center border-2 border-amber-500/20 shadow-inner">
                    <GraduationCap className="w-20 h-20 text-amber-600" />
                  </div>
                  <motion.div 
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute -bottom-4 -right-4 bg-amber-600 p-4 rounded-2xl text-white shadow-xl shadow-amber-600/20"
                  >
                    <HeartPulse className="w-6 h-6" />
                  </motion.div>
                </div>
                
                <div className="flex-1 text-center md:text-left space-y-4">
                  <span className="inline-block px-4 py-1 bg-amber-500/10 text-amber-600 rounded-full text-[10px] font-black uppercase tracking-[0.2em]">Our Mentor</span>
                  <h3 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white uppercase tracking-tighter leading-tight">Prof. Vinod Patel</h3>
                  <p className="text-lg text-slate-500 dark:text-slate-400 font-bold leading-relaxed italic">
                    "Guiding the next generation of healthcare innovators to bridge the urban-rural divide through precision engineering and empathy."
                  </p>
                  <p className="text-md text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                    Under the expert guidance of Vinod Patel, the RuralMed team has developed a robust ecosystem aimed at transforming rural healthcare in India. His mentorship in both technology and healthcare domains has been pivotal.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* RuralMed Summary Section */}
        <section className="liquid-glass rounded-[3rem] md:rounded-[4rem] p-8 md:p-16 text-white relative overflow-hidden mb-20 shadow-2xl">
          <div className="absolute inset-0 bg-slate-900/60 dark:bg-slate-950/60 backdrop-blur-3xl z-[-1]" />
          <div className="absolute top-0 right-0 w-full h-full opacity-30 pointer-events-none">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[100px] -mr-48 -mt-48" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-cyan-500 rounded-full blur-3xl -ml-48 -mb-48" />
          </div>

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <h2 className="text-2xl md:text-4xl font-black uppercase tracking-tighter leading-tight md:leading-none">
                About <span className="text-primary">RuralMed</span>
              </h2>
              <p className="text-base md:text-lg text-slate-300 leading-relaxed font-medium">
                RuralMed is an AI-powered telemedicine platform designed to improve healthcare accessibility in rural India. The platform connects patients, doctors, pharmacies, and administrators through a smart digital ecosystem featuring AI symptom analysis, online consultations, appointment booking, medical record management, and pharmacy inventory tracking.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                {[
                  { label: "AI Check", icon: <Cpu size={18} /> },
                  { label: "Video Consult", icon: <Globe size={18} /> },
                  { label: "Pharmacy", icon: <HeartPulse size={18} /> },
                  { label: "Emergency", icon: <ShieldCheck size={18} /> }
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 p-3.5 bg-white/5 rounded-2xl border border-white/10">
                    <div className="text-primary">{item.icon}</div>
                    <span className="text-[10px] md:text-xs font-black uppercase tracking-widest">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="hidden lg:flex justify-center">
              <motion.div 
                animate={{ scale: [1, 1.05, 1], rotate: [0, 5, 0] }}
                transition={{ duration: 6, repeat: Infinity }}
                className="w-48 h-48 md:w-64 md:h-64 lg:w-72 lg:h-72 bg-gradient-to-tr from-primary/20 to-cyan-500/20 rounded-[3rem] border-2 border-white/10 backdrop-blur-2xl flex items-center justify-center p-8"
              >
                <div className="bg-white/10 w-full h-full rounded-[2rem] flex items-center justify-center">
                   <ShieldCheck className="w-16 h-16 md:w-24 md:h-24 text-white drop-shadow-[0_0_20px_rgba(34,197,94,0.5)]" />
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer Branding */}
      <footer className="py-12 text-center">
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.5em]">
          © 2026 RuralMed Healthcare Platform • Future of Rural Health
        </p>
      </footer>
    </div>
  );
};

export default About;
