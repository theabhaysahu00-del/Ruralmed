import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Pill, Mail, Phone, Lock, 
  ArrowRight, ArrowLeft, Loader2, MapPin, Building,
  Truck, CheckCircle2, ShieldCheck, ShoppingBag, 
  Clock, AlertCircle, CheckCircle, X, Eye, EyeOff
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { authAPI } from '../services/api';
import toast from 'react-hot-toast';

const PharmacySignup = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '', // Owner Name
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    clinicName: '', // Pharmacy Name
    village: '', // Location
    licenseNumber: '',
    openingTime: '09:00',
    closingTime: '21:00',
    deliveryRadius: ''
  });

  const [errors, setErrors] = useState({});

  const validateStep = (currentStep) => {
    const newErrors = {};
    if (currentStep === 1) {
      if (!formData.name) newErrors.name = "Owner name is required";
      if (!formData.clinicName) newErrors.clinicName = "Pharmacy name is required";
      if (!formData.village) newErrors.village = "Location is required";
    } else if (currentStep === 2) {
      if (!formData.licenseNumber) newErrors.licenseNumber = "License is mandatory";
      if (!formData.email) newErrors.email = "Email is required";
      if (!formData.phone) newErrors.phone = "Phone is required";
    } else if (currentStep === 3) {
      if (!formData.password) newErrors.password = "Password is required";
      if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = "Passwords match error";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(step)) setStep(prev => prev + 1);
  };

  const prevStep = () => setStep(prev => prev - 1);

  const handleSignup = async (e) => {
    e.preventDefault();
    if (!validateStep(3)) return;

    setLoading(true);
    try {
      const response = await authAPI.register({
        ...formData,
        role: 'pharmacy'
      });
      if (response.success) {
        toast.success("Pharmacy registered! Time to stock your inventory.");
        navigate('/pharmacy-login');
      }
    } catch (err) {
      toast.error(err.message || "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-4 py-20 transition-colors duration-300 relative overflow-hidden">
      {/* Background Orbs */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-5%] right-[-5%] w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-5%] left-[-5%] w-[500px] h-[500px] bg-violet-500/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-5xl w-full grid grid-cols-1 lg:grid-cols-12 bg-white dark:bg-slate-900 rounded-[3rem] shadow-2xl border border-slate-200 dark:border-slate-800 relative z-10 overflow-hidden"
      >
        {/* Progress Sidebar */}
        <div className="lg:col-span-4 bg-slate-900 p-10 relative overflow-hidden flex flex-col justify-between border-r border-white/5">
           <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 to-violet-900/40" />
           <div className="relative z-10">
              <div className="w-14 h-14 bg-white/10 backdrop-blur-xl rounded-2xl flex items-center justify-center mb-12 border border-white/20">
                 <Pill className="w-7 h-7 text-purple-400" />
              </div>
              <h2 className="text-3xl font-black text-white uppercase tracking-tighter leading-tight mb-12">
                 Supply <br /> <span className="text-purple-400 text-5xl">Network.</span>
              </h2>

              <div className="space-y-8">
                 {[
                   { s: 1, t: "Business Info", d: "Store & Owner Identity" },
                   { s: 2, t: "Legal Details", d: "Drug License & Contact" },
                   { s: 3, t: "Store Setup", d: "Security & Operations" }
                 ].map((item) => (
                   <div key={item.s} className="flex gap-4 group">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-xs transition-all duration-500 ${step >= item.s ? 'bg-purple-500 text-white shadow-[0_0_15px_rgba(168,85,247,0.5)]' : 'bg-white/10 text-white/30'}`}>
                         {step > item.s ? <CheckCircle className="w-5 h-5" /> : item.s}
                      </div>
                      <div>
                         <p className={`text-[10px] font-black uppercase tracking-widest transition-colors ${step >= item.s ? 'text-white' : 'text-white/30'}`}>{item.t}</p>
                         <p className="text-[9px] text-white/40 font-bold uppercase">{item.d}</p>
                      </div>
                   </div>
                 ))}
              </div>
           </div>

           <div className="relative z-10 mt-12 bg-white/5 backdrop-blur-xl p-6 rounded-[2rem] border border-white/10">
              <div className="flex items-center gap-3 mb-4">
                 <Truck className="w-4 h-4 text-emerald-400" />
                 <p className="text-[10px] font-black uppercase tracking-widest text-white">Logistics Ready</p>
              </div>
              <div className="flex -space-x-2 mb-4">
                 {['abhay_raj.png', 'anushka_parmar.png', 'anushka_yadav.png', 'ayush_tiwari.png'].map((img, i) => (
                   <img key={i} src={`/${img}`} className="w-6 h-6 rounded-full border border-slate-900 object-cover" alt="Partner" />
                 ))}
                 <div className="w-6 h-6 rounded-full bg-purple-500 border border-slate-900 flex items-center justify-center text-[6px] font-black text-white">+200</div>
              </div>
              <p className="text-[9px] text-white/40 font-bold uppercase leading-relaxed">Integrated delivery management for every registered pharmacy.</p>
           </div>
        </div>

        {/* Form Content */}
        <div className="lg:col-span-8 p-8 md:p-14 bg-white dark:bg-slate-900/50 backdrop-blur-3xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <div className="flex justify-between items-start">
                <div>
                   <span className="text-purple-500 font-black text-[10px] uppercase tracking-[0.3em]">Step 0{step} / 03</span>
                   <h3 className="text-4xl font-black text-slate-900 dark:text-white uppercase tracking-tighter mt-1">
                      {step === 1 ? "Business" : step === 2 ? "Legal" : "Operations"}
                   </h3>
                </div>
                {step === 1 && (
                  <button onClick={() => navigate('/signup')} className="p-3 bg-slate-50 dark:bg-slate-800 text-slate-400 hover:text-primary rounded-2xl transition-all">
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                )}
              </div>

              {step === 1 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <InputField label="Owner Name" icon={<ShoppingBag />} error={errors.name} placeholder="John Doe" value={formData.name} onChange={v => setFormData({...formData, name: v})} color="purple" />
                  <InputField label="Pharmacy Name" icon={<Building />} error={errors.clinicName} placeholder="Village Meds" value={formData.clinicName} onChange={v => setFormData({...formData, clinicName: v})} color="purple" />
                  <div className="md:col-span-2">
                    <InputField label="Pharmacy Location" icon={<MapPin />} error={errors.village} placeholder="Full store address" value={formData.village} onChange={v => setFormData({...formData, village: v})} color="purple" />
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <InputField label="Drug License No." icon={<ShieldCheck />} error={errors.licenseNumber} placeholder="DL-XXX-XXX" value={formData.licenseNumber} onChange={v => setFormData({...formData, licenseNumber: v})} color="purple" />
                  <InputField label="Contact Phone" icon={<Phone />} error={errors.phone} placeholder="+91 XXXXX XXXXX" value={formData.phone} onChange={v => setFormData({...formData, phone: v})} color="purple" />
                  <div className="md:col-span-2">
                    <InputField label="Professional Email" icon={<Mail />} error={errors.email} placeholder="store@medical.com" value={formData.email} onChange={v => setFormData({...formData, email: v})} color="purple" />
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="group space-y-2">
                       <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Opening Time</label>
                       <div className="relative">
                          <Clock className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                          <input type="time" className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-800 rounded-3xl pl-16 pr-8 py-4 outline-none focus:border-purple-500 transition-all dark:text-white font-bold" value={formData.openingTime} onChange={e => setFormData({...formData, openingTime: e.target.value})} />
                       </div>
                    </div>
                    <div className="group space-y-2">
                       <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Closing Time</label>
                       <div className="relative">
                          <Clock className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                          <input type="time" className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-800 rounded-3xl pl-16 pr-8 py-4 outline-none focus:border-purple-500 transition-all dark:text-white font-bold" value={formData.closingTime} onChange={e => setFormData({...formData, closingTime: e.target.value})} />
                       </div>
                    </div>
                    <InputField type={showPassword ? "text" : "password"} label="Create Password" icon={<Lock />} error={errors.password} placeholder="••••••••" value={formData.password} onChange={v => setFormData({...formData, password: v})} color="purple" showToggle={true} isVisible={showPassword} onToggle={() => setShowPassword(!showPassword)} />
                    <InputField type={showPassword ? "text" : "password"} label="Confirm Password" icon={<ShieldCheck />} error={errors.confirmPassword} placeholder="••••••••" value={formData.confirmPassword} onChange={v => setFormData({...formData, confirmPassword: v})} color="purple" showToggle={true} isVisible={showPassword} onToggle={() => setShowPassword(!showPassword)} />
                  </div>
                </div>
              )}

              <div className="flex gap-4 pt-6">
                {step > 1 && (
                  <button onClick={prevStep} className="flex-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 py-5 rounded-3xl font-black uppercase tracking-widest text-xs hover:bg-slate-200 transition-all flex items-center justify-center gap-2">
                    <ArrowLeft className="w-4 h-4" /> Previous
                  </button>
                )}
                {step < 3 ? (
                  <button onClick={nextStep} className="flex-[2] bg-purple-600 text-white py-5 rounded-3xl font-black uppercase tracking-widest text-xs shadow-xl shadow-purple-500/30 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2">
                    Next Section <ArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button onClick={handleSignup} disabled={loading} className="flex-[2] bg-emerald-600 text-white py-5 rounded-3xl font-black uppercase tracking-widest text-xs shadow-xl shadow-emerald-500/30 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2">
                    {loading ? <Loader2 className="animate-spin" /> : <>Register Store <CheckCircle2 className="w-5 h-5" /></>}
                  </button>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};

const InputField = ({ label, icon, placeholder, value, onChange, type = "text", error, color = "blue", showToggle, isVisible, onToggle }) => {
  const colorClass = color === "purple" ? "focus:border-purple-500 group-focus-within:text-purple-500" : "focus:border-blue-500 group-focus-within:text-blue-500";
  const iconColor = color === "purple" ? "group-focus-within:text-purple-500" : "group-focus-within:text-blue-500";

  return (
    <div className="group space-y-2">
      <label className={`text-[10px] font-black uppercase tracking-widest ml-4 transition-colors ${error ? 'text-red-500' : `text-slate-400 ${iconColor}`}`}>{label}</label>
      <div className="relative">
        <div className={`absolute left-6 top-1/2 -translate-y-1/2 transition-colors ${error ? 'text-red-500' : `text-slate-400 ${iconColor}`}`}>
          {React.cloneElement(icon, { size: 20 })}
        </div>
        <input 
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={e => onChange(e.target.value)}
          className={`w-full bg-slate-50 dark:bg-slate-800 border-2 rounded-3xl pl-16 pr-14 py-4 outline-none transition-all dark:text-white font-bold ${error ? 'border-red-500' : `border-slate-100 dark:border-slate-800 ${colorClass}`}`}
        />
        {showToggle && (
          <button 
            type="button"
            onClick={onToggle}
            className={`absolute right-6 top-1/2 -translate-y-1/2 text-slate-400 hover:${color === "purple" ? "text-purple-500" : "text-blue-500"} transition-colors`}
          >
            {isVisible ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>
      {error && <p className="text-[9px] text-red-500 font-black uppercase tracking-widest ml-4 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {error}</p>}
    </div>
  );
};

export default PharmacySignup;
