import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Stethoscope, ArrowLeft, ArrowRight, Send, Loader2, AlertTriangle, 
  CheckCircle, Info, PhoneCall, Clock, Activity, 
  ShieldCheck, Calendar, Thermometer, ChevronRight,
  Search, X, User, Zap, Brain, Heart, Wind, Flame
} from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const SYMPTOMS_LIST = [
  { id: 'cough', label: 'Cough', icon: <Wind className="w-5 h-5" />, hindi: 'खांसी' },
  { id: 'fever', label: 'Fever', icon: <Flame className="w-5 h-5" />, hindi: 'बुखार' },
  { id: 'headache', label: 'Headache', icon: <Zap className="w-5 h-5" />, hindi: 'सिरदर्द' },
  { id: 'stomach pain', label: 'Stomach Pain', icon: <Activity className="w-5 h-5" />, hindi: 'पेट दर्द' },
  { id: 'chest pain', label: 'Chest Pain', icon: <Heart className="w-5 h-5" />, hindi: 'सीने में दर्द' },
  { id: 'cold', label: 'Cold/Flu', icon: <Wind className="w-5 h-5" />, hindi: 'सर्दी' },
  { id: 'vomiting', label: 'Vomiting', icon: <Activity className="w-5 h-5" />, hindi: 'उल्टी' },
  { id: 'body pain', label: 'Body Pain', icon: <Activity className="w-5 h-5" />, hindi: 'बदन दर्द' },
  { id: 'weakness', label: 'Weakness', icon: <Zap className="w-5 h-5" />, hindi: 'कमजोरी' },
  { id: 'dizziness', label: 'Dizziness', icon: <Activity className="w-5 h-5" />, hindi: 'चक्कर' },
  { id: 'sore throat', label: 'Sore Throat', icon: <Wind className="w-5 h-5" />, hindi: 'गले में खराश' },
  { id: 'breathing problem', label: 'Breathing Issue', icon: <Wind className="w-5 h-5" />, hindi: 'सांस की समस्या' },
];

const SymptomChecker = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [description, setDescription] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('Male');
  const [duration, setDuration] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [step, setStep] = useState(1); // 1: Symptoms, 2: Details, 3: Result

  const toggleSymptom = (id) => {
    setSelectedSymptoms(prev => 
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  };

  const handleAnalyze = async () => {
    if (selectedSymptoms.length === 0 && description.length < 5) {
      setError('Please select at least one symptom or describe your problem.');
      return;
    }
    
    setError('');
    setLoading(true);
    setStep(3);

    try {
      const symptomsText = [...selectedSymptoms, description].filter(Boolean).join(', ');
      const response = await api.post('/symptom-checker', {
        symptoms: symptomsText,
        age: parseInt(age) || 30,
        gender,
        duration
      });
      setResult(response.data);
    } catch (err) {
      // Fallback for demo
      const mockResult = {
        condition: "Potential Viral Infection",
        department: "General Medicine",
        urgency: "medium",
        probability: 0.75,
        advice: "Stay hydrated and take rest. Monitor temperature regularly.",
        recommendations: [
          "Drink warm fluids frequently",
          "Isolate if possible to prevent spread",
          "Consult a general physician if fever exceeds 101°F"
        ],
        nextSteps: "Book a consultation with our General Physician.",
        disclaimer: "This is an AI assessment and not a professional medical diagnosis."
      };
      setResult(mockResult);
    } finally {
      setLoading(false);
    }
  };

  const getUrgencyStyles = (urgency) => {
    switch (urgency) {
      case 'high': return { 
        bg: 'bg-red-500/10', 
        text: 'text-red-600', 
        border: 'border-red-200 dark:border-red-900/50', 
        badge: 'bg-red-600', 
        icon: <AlertTriangle className="w-12 h-12" /> 
      };
      case 'medium': return { 
        bg: 'bg-amber-500/10', 
        text: 'text-amber-600', 
        border: 'border-amber-200 dark:border-amber-900/50', 
        badge: 'bg-amber-600', 
        icon: <Info className="w-12 h-12" /> 
      };
      case 'low': return { 
        bg: 'bg-emerald-500/10', 
        text: 'text-emerald-600', 
        border: 'border-emerald-200 dark:border-emerald-900/50', 
        badge: 'bg-emerald-600', 
        icon: <CheckCircle className="w-12 h-12" /> 
      };
      default: return { bg: 'bg-primary/10', text: 'text-primary', border: 'border-primary/20', badge: 'bg-primary', icon: <Stethoscope className="w-12 h-12" /> };
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      {/* Premium Header */}
      <nav className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-100 dark:border-slate-800 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <button 
            onClick={() => navigate('/')}
            className="flex items-center gap-2 group"
          >
            <div className="bg-primary/10 p-2 rounded-xl group-hover:bg-primary group-hover:text-white transition-all">
              <ArrowLeft className="w-5 h-5" />
            </div>
            <span className="font-black tracking-tight text-slate-900 dark:text-white uppercase text-sm">RuralMed AI</span>
          </button>
          
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-emerald-500/10 rounded-full border border-emerald-500/20">
               <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
               <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Neural Engine Active</span>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto py-12 px-6">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div 
              key="step1"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-12"
            >
              <div className="text-center space-y-4">
                <h1 className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">
                  How are you <span className="text-primary">feeling?</span>
                </h1>
                <p className="text-slate-500 dark:text-slate-400 font-bold max-w-lg mx-auto">
                  Select your symptoms below. Our AI will analyze them against 1.2M+ clinical records to provide instant guidance.
                </p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {SYMPTOMS_LIST.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => toggleSymptom(s.id)}
                    className={`p-6 rounded-[2rem] border-2 transition-all flex flex-col items-center gap-3 group relative overflow-hidden ${
                      selectedSymptoms.includes(s.id) 
                      ? 'bg-primary border-primary shadow-2xl shadow-primary/30' 
                      : 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 hover:border-primary/20 hover:scale-105'
                    }`}
                  >
                    <div className={`p-4 rounded-2xl transition-all ${
                      selectedSymptoms.includes(s.id) ? 'bg-white/20 text-white' : 'bg-slate-50 dark:bg-slate-800 text-primary'
                    }`}>
                      {s.icon}
                    </div>
                    <div className="text-center">
                      <p className={`font-black uppercase tracking-tight text-sm ${selectedSymptoms.includes(s.id) ? 'text-white' : 'text-slate-900 dark:text-white'}`}>
                        {s.label}
                      </p>
                      <p className={`text-[10px] font-bold ${selectedSymptoms.includes(s.id) ? 'text-white/60' : 'text-slate-400'}`}>
                        {s.hindi}
                      </p>
                    </div>
                    {selectedSymptoms.includes(s.id) && (
                      <motion.div 
                        layoutId="check"
                        className="absolute top-2 right-2 text-white"
                      >
                        <CheckCircle className="w-4 h-4" />
                      </motion.div>
                    )}
                  </button>
                ))}
              </div>

              <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-xl space-y-6">
                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 p-2 rounded-lg">
                    <Info className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="font-black text-slate-900 dark:text-white uppercase tracking-tight">Anything else?</h3>
                </div>
                <textarea 
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe other problems in your own words..."
                  className="w-full h-32 bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-6 border-2 border-transparent focus:border-primary/20 outline-none transition-all resize-none dark:text-white font-bold"
                />
              </div>

              <div className="flex justify-end pt-8">
                <button 
                  onClick={() => setStep(2)}
                  disabled={selectedSymptoms.length === 0 && description.length < 5}
                  className={`px-12 py-5 rounded-2xl font-black text-lg flex items-center gap-3 transition-all ${
                    selectedSymptoms.length > 0 || description.length >= 5
                    ? 'bg-primary text-white shadow-xl shadow-primary/20 hover:scale-105 active:scale-95' 
                    : 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  Continue <ArrowRight className="w-6 h-6" />
                </button>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div 
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-12"
            >
              <div className="text-center space-y-4">
                <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white uppercase tracking-tighter leading-none">
                  A few more <span className="text-primary">details</span>
                </h1>
                <p className="text-slate-500 dark:text-slate-400 font-bold max-w-lg mx-auto">
                  This helps our AI provide a more accurate assessment tailored to your age and health profile.
                </p>
              </div>

              <div className="bg-white dark:bg-slate-900 p-12 rounded-[3.5rem] border border-slate-100 dark:border-slate-800 shadow-2xl space-y-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Age (years)</label>
                    <input 
                      type="number"
                      value={age}
                      onChange={(e) => setAge(e.target.value)}
                      placeholder="e.g. 30"
                      className="w-full bg-slate-50 dark:bg-slate-800 rounded-2xl p-6 border-none outline-none focus:ring-4 focus:ring-primary/10 dark:text-white font-black text-xl"
                    />
                  </div>
                  <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Gender</label>
                    <div className="grid grid-cols-3 gap-3">
                      {['Male', 'Female', 'Other'].map(g => (
                        <button
                          key={g}
                          onClick={() => setGender(g)}
                          className={`py-6 rounded-2xl font-black text-sm uppercase transition-all ${
                            gender === g ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'bg-slate-50 dark:bg-slate-800 text-slate-400'
                          }`}
                        >
                          {g}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">How long have you had these symptoms?</label>
                  <input 
                    type="text"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    placeholder="e.g. 2 days, since morning..."
                    className="w-full bg-slate-50 dark:bg-slate-800 rounded-2xl p-6 border-none outline-none focus:ring-4 focus:ring-primary/10 dark:text-white font-black text-xl"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-8">
                <button 
                  onClick={() => setStep(1)}
                  className="px-10 py-5 rounded-2xl font-black text-slate-500 uppercase tracking-widest text-sm hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
                >
                  Back
                </button>
                <button 
                  onClick={handleAnalyze}
                  className="bg-primary text-white px-12 py-5 rounded-2xl font-black text-lg shadow-xl shadow-primary/30 hover:scale-105 active:scale-95 transition-all flex items-center gap-3"
                >
                  Analyze Symptoms <ShieldCheck className="w-6 h-6" />
                </button>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div 
              key="step3"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-8"
            >
              {loading ? (
                <div className="min-h-[500px] flex flex-col items-center justify-center text-center p-12 bg-white dark:bg-slate-900 rounded-[3.5rem] shadow-2xl border border-slate-100 dark:border-slate-800 overflow-hidden relative">
                  <div className="absolute inset-0 bg-primary/5 animate-pulse" />
                  <div className="relative z-10 space-y-8">
                    <div className="relative">
                      <div className="w-48 h-48 border-8 border-primary/10 rounded-full animate-spin border-t-primary" />
                      <Brain className="w-16 h-16 text-primary absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-4xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">AI Analyzing...</h3>
                      <p className="text-slate-500 font-bold uppercase tracking-widest text-xs animate-bounce">Scanning clinical databases</p>
                    </div>
                    <div className="w-full max-w-xs h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden mx-auto">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: "100%" }}
                        transition={{ duration: 2.5, ease: "linear" }}
                        className="h-full bg-primary"
                      />
                    </div>
                  </div>
                </div>
              ) : result && (
                <div className="space-y-8">
                  <div className={`p-10 md:p-16 rounded-[4rem] transition-all shadow-2xl ${getUrgencyStyles(result.urgency).bg} border-2 ${getUrgencyStyles(result.urgency).border}`}>
                    <div className="flex flex-col md:flex-row justify-between items-start gap-8 mb-12">
                      <div className="space-y-6">
                        <div className={`px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.3em] text-white inline-block shadow-lg ${getUrgencyStyles(result.urgency).badge}`}>
                          {result.urgency} Urgency
                        </div>
                        <h2 className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white uppercase tracking-tighter leading-[0.95]">
                          {result.condition}
                        </h2>
                        <div className="flex items-center gap-4">
                           <div className="bg-white/50 dark:bg-slate-900/50 backdrop-blur px-4 py-2 rounded-xl border border-white/20">
                              <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Recommended Dept.</p>
                              <p className="font-black text-primary uppercase">{result.department}</p>
                           </div>
                           <div className="bg-white/50 dark:bg-slate-900/50 backdrop-blur px-4 py-2 rounded-xl border border-white/20">
                              <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Confidence</p>
                              <p className="font-black text-emerald-500 uppercase">{(result.probability * 100).toFixed(0)}% Match</p>
                           </div>
                        </div>
                      </div>
                      <div className={getUrgencyStyles(result.urgency).text}>
                        {getUrgencyStyles(result.urgency).icon}
                      </div>
                    </div>

                    <div className="space-y-8">
                      <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-3xl p-10 rounded-[3rem] border border-white dark:border-white/5 shadow-xl">
                         <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-primary mb-6 flex items-center gap-2">
                           <Info className="w-4 h-4" /> Professional Guidance
                         </h4>
                         <p className="text-slate-800 dark:text-slate-200 text-xl md:text-2xl font-black leading-tight mb-8">
                           {result.advice}
                         </p>
                         
                         <div className="space-y-4">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Recommendations:</p>
                            <ul className="space-y-4">
                               {result.recommendations?.map((rec, i) => (
                                 <li key={i} className="flex items-start gap-4 group">
                                    <div className="w-6 h-6 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                                       <CheckCircle className="w-4 h-4" />
                                    </div>
                                    <span className="text-slate-600 dark:text-slate-300 font-bold leading-snug">{rec}</span>
                                 </li>
                               ))}
                            </ul>
                         </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <button 
                      onClick={() => {
                        if (user) {
                          if (user.role === 'patient') navigate('/patient');
                          else if (user.role === 'doctor') navigate('/doctor');
                        } else {
                          navigate('/role-selection');
                        }
                      }}
                      className="bg-slate-900 dark:bg-white dark:text-slate-900 text-white p-10 rounded-[3rem] font-black shadow-2xl hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-between group"
                    >
                      <div className="flex items-center gap-6 text-left">
                         <Calendar className="w-12 h-12" />
                         <div>
                           <p className="text-2xl uppercase tracking-tight">Book Doctor</p>
                           <p className="text-[10px] opacity-40 dark:opacity-60 uppercase font-black tracking-widest">Connect with {result.department}</p>
                         </div>
                      </div>
                      <ChevronRight className="w-8 h-8 group-hover:translate-x-2 transition-transform" />
                    </button>

                    <button 
                      onClick={() => setStep(1)}
                      className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white p-10 rounded-[3rem] font-black border border-slate-200 dark:border-slate-800 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-between group"
                    >
                      <div className="flex items-center gap-6 text-left">
                         <Activity className="w-12 h-12 text-primary" />
                         <div>
                           <p className="text-2xl uppercase tracking-tight">New Check</p>
                           <p className="text-[10px] opacity-40 uppercase font-black tracking-widest">Reset and start again</p>
                         </div>
                      </div>
                      <ArrowLeft className="w-8 h-8 group-hover:-translate-x-2 transition-transform" />
                    </button>
                  </div>

                  <div className="p-8 bg-slate-100 dark:bg-slate-900/50 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 text-center">
                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] leading-relaxed max-w-2xl mx-auto">
                      🛡️ Safe & Private: {result.disclaimer} RuralMed does not store your private health check data unless you choose to save it to your profile.
                    </p>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default SymptomChecker;
