import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Stethoscope, Mail, Phone, Lock, FileText, 
  ArrowRight, ArrowLeft, Loader2, Award, Briefcase, 
  Building2, ShieldCheck, CheckCircle2, Star, Eye, EyeOff,
  User, MapPin, AlertCircle, CheckCircle, UploadCloud, X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { authAPI } from '../services/api';
import toast from 'react-hot-toast';

const DoctorSignup = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    specialization: '',
    experience: '',
    clinicName: '',
    licenseNumber: '',
    village: '',
    bio: '',
    consultationFee: ''
  });

  const [errors, setErrors] = useState({});

  // Cleanup preview URL
  useEffect(() => {
    return () => {
      if (filePreview) URL.revokeObjectURL(filePreview);
    };
  }, [filePreview]);

  const validateStep = (currentStep) => {
    const newErrors = {};
    if (currentStep === 1) {
      if (!formData.name) newErrors.name = "Name is required";
      if (!formData.email) newErrors.email = "Email is required";
      if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Email is invalid";
      if (!formData.phone) newErrors.phone = "Phone is required";
    } else if (currentStep === 2) {
      if (!formData.specialization) newErrors.specialization = "Specialization is required";
      if (!formData.licenseNumber) newErrors.licenseNumber = "License number is required";
      if (!formData.experience) newErrors.experience = "Experience is required";
    } else if (currentStep === 3) {
      if (!formData.password) newErrors.password = "Password is required";
      if (formData.password.length < 6) newErrors.password = "Min 6 characters";
      if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = "Passwords match error";
      if (!file) newErrors.file = "License document is mandatory";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(step)) setStep(prev => prev + 1);
  };

  const prevStep = () => setStep(prev => prev - 1);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (selectedFile.size > 5 * 1024 * 1024) {
        return toast.error("File size must be less than 5MB");
      }
      setFile(selectedFile);
      if (selectedFile.type.startsWith('image/')) {
        setFilePreview(URL.createObjectURL(selectedFile));
      } else {
        setFilePreview(null);
      }
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    if (!validateStep(3)) return;

    setLoading(true);
    try {
      const data = new FormData();
      Object.keys(formData).forEach(key => {
        if (formData[key]) data.append(key, formData[key]);
      });
      data.append('role', 'doctor');
      if (file) data.append('license', file);

      const response = await authAPI.register(data);
      if (response.success) {
        toast.success("Registration successful! Your profile is being reviewed.");
        navigate('/doctor-login');
      }
    } catch (err) {
      toast.error(err.message || "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-4 py-20 transition-colors duration-300 relative overflow-hidden">
      {/* Dynamic Backgrounds */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-5%] right-[-5%] w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-5%] left-[-5%] w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-5xl w-full grid grid-cols-1 lg:grid-cols-12 bg-white dark:bg-slate-900 rounded-[3rem] shadow-2xl border border-slate-200 dark:border-slate-800 relative z-10 overflow-hidden"
      >
        {/* Progress Sidebar */}
        <div className="lg:col-span-4 bg-slate-900 p-10 relative overflow-hidden flex flex-col justify-between border-r border-white/5">
           <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-indigo-900/40" />
           
           <div className="relative z-10">
              <div className="w-14 h-14 bg-white/10 backdrop-blur-xl rounded-2xl flex items-center justify-center mb-12 border border-white/20">
                 <Stethoscope className="w-7 h-7 text-blue-400" />
              </div>
              
              <h2 className="text-3xl font-black text-white uppercase tracking-tighter leading-tight mb-12">
                 Onboarding <br /> <span className="text-blue-400 text-5xl">Expert.</span>
              </h2>

              <div className="space-y-8">
                 {[
                   { s: 1, t: "Basic Identity", d: "Personal & Contact Info" },
                   { s: 2, t: "Medical Credentials", d: "Specialization & License" },
                   { s: 3, t: "Final Verification", d: "Security & Documents" }
                 ].map((item) => (
                   <div key={item.s} className="flex gap-4 group">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-xs transition-all duration-500 ${step >= item.s ? 'bg-blue-500 text-white shadow-[0_0_15px_rgba(59,130,246,0.5)]' : 'bg-white/10 text-white/30'}`}>
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
                 <ShieldCheck className="w-4 h-4 text-emerald-400" />
                 <p className="text-[10px] font-black uppercase tracking-widest text-white">Verified Onboarding</p>
              </div>
              <div className="flex -space-x-2 mb-4">
                 {['abhay_raj.png', 'anushka_parmar.png', 'anushka_yadav.png', 'ayush_tiwari.png'].map((img, i) => (
                   <img key={i} src={`/${img}`} className="w-6 h-6 rounded-full border border-slate-900 object-cover" alt="Expert" />
                 ))}
                 <div className="w-6 h-6 rounded-full bg-blue-500 border border-slate-900 flex items-center justify-center text-[6px] font-black text-white">+500</div>
              </div>
              <p className="text-[9px] text-white/40 font-bold uppercase leading-relaxed">RuralMed follows strict HIPAA and MCI guidelines for doctor verification.</p>
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
                   <span className="text-blue-500 font-black text-[10px] uppercase tracking-[0.3em]">Step 0{step} / 03</span>
                   <h3 className="text-4xl font-black text-slate-900 dark:text-white uppercase tracking-tighter mt-1">
                      {step === 1 ? "Identity" : step === 2 ? "Medical" : "Finish"}
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
                  <InputField label="Full Name (With Dr.)" icon={<User />} error={errors.name} placeholder="Dr. Rajesh Sharma" value={formData.name} onChange={v => setFormData({...formData, name: v})} />
                  <InputField label="Email Address" icon={<Mail />} error={errors.email} placeholder="rajesh@clinic.com" value={formData.email} onChange={v => setFormData({...formData, email: v})} />
                  <InputField label="Phone Number" icon={<Phone />} error={errors.phone} placeholder="+91 XXXXX XXXXX" value={formData.phone} onChange={v => setFormData({...formData, phone: v})} />
                  <InputField label="Village / Clinic City" icon={<MapPin />} placeholder="E.g. Hamirpur, HP" value={formData.village} onChange={v => setFormData({...formData, village: v})} />
                </div>
              )}

              {step === 2 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <InputField label="Specialization" icon={<Award />} error={errors.specialization} placeholder="E.g. Cardiologist" value={formData.specialization} onChange={v => setFormData({...formData, specialization: v})} />
                  <InputField label="Total Experience" icon={<Briefcase />} error={errors.experience} placeholder="E.g. 15 Years" value={formData.experience} onChange={v => setFormData({...formData, experience: v})} />
                  <InputField label="License Number" icon={<FileText />} error={errors.licenseNumber} placeholder="E.g. MCI-12345" value={formData.licenseNumber} onChange={v => setFormData({...formData, licenseNumber: v})} />
                  <InputField label="Consultation Fee (₹)" icon={<Star />} placeholder="E.g. 500" value={formData.consultationFee} onChange={v => setFormData({...formData, consultationFee: v})} />
                  <div className="md:col-span-2 space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Professional Bio (Optional)</label>
                    <textarea 
                      placeholder="Write a brief about your medical background..."
                      className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-800 rounded-3xl px-6 py-4 outline-none focus:border-blue-500 transition-all dark:text-white font-bold h-32"
                      value={formData.bio}
                      onChange={e => setFormData({...formData, bio: e.target.value})}
                    />
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InputField type={showPassword ? "text" : "password"} label="Create Password" icon={<Lock />} error={errors.password} placeholder="••••••••" value={formData.password} onChange={v => setFormData({...formData, password: v})} showToggle={true} isVisible={showPassword} onToggle={() => setShowPassword(!showPassword)} />
                    <InputField type={showPassword ? "text" : "password"} label="Confirm Password" icon={<ShieldCheck />} error={errors.confirmPassword} placeholder="••••••••" value={formData.confirmPassword} onChange={v => setFormData({...formData, confirmPassword: v})} showToggle={true} isVisible={showPassword} onToggle={() => setShowPassword(!showPassword)} />
                  </div>
                  
                  <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">License Document (Required)</label>
                    <div className={`relative border-2 border-dashed rounded-[2.5rem] p-10 text-center transition-all ${file ? 'border-emerald-500 bg-emerald-500/5' : 'border-slate-200 dark:border-slate-800 hover:border-blue-500'}`}>
                       <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleFileChange} />
                       {file ? (
                         <div className="space-y-4">
                            <div className="flex items-center justify-center gap-4">
                               {filePreview ? (
                                 <img src={filePreview} className="w-20 h-20 rounded-2xl object-cover border-2 border-white shadow-lg" alt="preview" />
                               ) : (
                                 <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center text-emerald-600"><FileText className="w-8 h-8" /></div>
                               )}
                               <div className="text-left">
                                  <p className="text-sm font-black text-slate-800 dark:text-white">{file.name}</p>
                                  <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">{(file.size / (1024 * 1024)).toFixed(2)} MB • Ready</p>
                               </div>
                            </div>
                            <button onClick={() => {setFile(null); setFilePreview(null)}} className="text-[10px] font-black text-red-500 uppercase tracking-widest hover:underline flex items-center gap-1 mx-auto"><X className="w-3 h-3" /> Remove File</button>
                         </div>
                       ) : (
                         <div className="space-y-2">
                            <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/20 rounded-[2rem] flex items-center justify-center mx-auto text-blue-500 mb-4"><UploadCloud className="w-8 h-8" /></div>
                            <p className="text-sm font-black text-slate-600 dark:text-slate-300">Click to upload medical license</p>
                            <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Supports PDF, PNG, JPG (Max 5MB)</p>
                         </div>
                       )}
                    </div>
                    {errors.file && <p className="text-[10px] text-red-500 font-black uppercase tracking-widest ml-4"><AlertCircle className="inline w-3 h-3 mr-1" /> {errors.file}</p>}
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
                  <button onClick={nextStep} className="flex-[2] bg-blue-600 text-white py-5 rounded-3xl font-black uppercase tracking-widest text-xs shadow-xl shadow-blue-500/30 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2">
                    Continue Journey <ArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button onClick={handleSignup} disabled={loading} className="flex-[2] bg-emerald-600 text-white py-5 rounded-3xl font-black uppercase tracking-widest text-xs shadow-xl shadow-emerald-500/30 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2">
                    {loading ? <Loader2 className="animate-spin" /> : <>Finalize Onboarding <CheckCircle2 className="w-5 h-5" /></>}
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

const InputField = ({ label, icon, placeholder, value, onChange, type = "text", error, showToggle, isVisible, onToggle }) => (
  <div className="group space-y-2">
    <label className={`text-[10px] font-black uppercase tracking-widest ml-4 transition-colors ${error ? 'text-red-500' : 'text-slate-400 group-focus-within:text-blue-500'}`}>{label}</label>
    <div className="relative">
      <div className={`absolute left-6 top-1/2 -translate-y-1/2 transition-colors ${error ? 'text-red-500' : 'text-slate-400 group-focus-within:text-blue-500'}`}>
        {React.cloneElement(icon, { size: 20 })}
      </div>
      <input 
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={e => onChange(e.target.value)}
        className={`w-full bg-slate-50 dark:bg-slate-800 border-2 rounded-3xl pl-16 pr-14 py-4 outline-none transition-all dark:text-white font-bold ${error ? 'border-red-500' : 'border-slate-100 dark:border-slate-800 focus:border-blue-500'}`}
      />
      {showToggle && (
        <button 
          type="button"
          onClick={onToggle}
          className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-500 transition-colors"
        >
          {isVisible ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      )}
    </div>
    {error && <p className="text-[9px] text-red-500 font-black uppercase tracking-widest ml-4 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {error}</p>}
  </div>
);

export default DoctorSignup;
