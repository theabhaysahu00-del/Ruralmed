import React, { useState } from 'react';
import { Activity, ChevronRight, AlertTriangle, CheckCircle, RefreshCw } from 'lucide-react';
import { symptomAPI } from '../services/api';

const symptomsList = [
  'Fever', 'Headache', 'Cough', 'Sore Throat', 'Body Pain',
  'Fatigue', 'Nausea', 'Dizziness', 'Chest Pain', 'Breathing Difficulty',
  'Diarrhea', 'Joint Pain', 'Skin Rash', 'Loss of Appetite', 'Abdominal Pain',
];

const SymptomChecker = () => {
  const [selected, setSelected] = useState([]);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const toggleSymptom = (symptom) => {
    setSelected((prev) =>
      prev.includes(symptom)
        ? prev.filter((s) => s !== symptom)
        : [...prev, symptom]
    );
  };

  const handleCheck = async () => {
    if (selected.length < 2) return;
    setLoading(true);
    try {
      const response = await symptomAPI.analyze({ 
        symptoms: selected,
        age: 30, // Default for now
        gender: 'male'
      });
      setResult(response.data);
    } catch (error) {
      console.error('AI Assessment failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSelected([]);
    setResult(null);
  };

  if (result) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-lg">
          <div className="flex items-center gap-3 mb-6">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${result.urgency === 'low' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
              {result.urgency === 'low' ? <CheckCircle size={24} /> : <AlertTriangle size={24} />}
            </div>
            <div>
              <h3 className="text-xl font-black text-slate-900">AI Assessment Result</h3>
              <p className="text-sm text-slate-500">Confidence Score: {(result.probability * 100).toFixed(0)}%</p>
            </div>
          </div>

          <div className="space-y-4 mb-8">
            <div className="p-4 bg-slate-50 rounded-2xl">
              <p className="text-[10px] text-slate-400 font-black uppercase tracking-wider mb-1">Possible Condition</p>
              <p className="text-lg font-bold text-slate-900">{result.condition}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-slate-50 rounded-2xl">
                <p className="text-[10px] text-slate-400 font-black uppercase tracking-wider mb-1">Severity</p>
                <p className="font-bold text-healthcare-teal">{result.severity}</p>
              </div>
              <div className="p-4 bg-slate-50 rounded-2xl">
                <p className="text-[10px] text-slate-400 font-black uppercase tracking-wider mb-1">Urgency</p>
                <p className="font-bold capitalize">{result.urgency}</p>
              </div>
            </div>
            <div className="p-4 bg-primary-50 rounded-2xl border border-primary-100">
              <p className="text-[10px] text-primary-500 font-black uppercase tracking-wider mb-1">Doctor's Advice</p>
              <p className="text-sm text-primary-900 leading-relaxed">{result.advice}</p>
            </div>
          </div>

          <div className="flex gap-4">
            <button onClick={handleReset} className="flex-1 py-4 rounded-2xl bg-slate-100 font-bold text-slate-600 flex items-center justify-center gap-2">
              <RefreshCw size={18} /> Check Again
            </button>
            <button className="flex-[2] py-4 rounded-2xl bg-primary-600 text-white font-bold shadow-lg shadow-primary-200">
              Book Doctor Consultation
            </button>
          </div>
        </div>

        <p className="text-center text-xs text-slate-400 mt-6">
          ⚠️ {result.disclaimer}
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-10">
        <div className="w-16 h-16 bg-primary-100 text-primary-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Activity size={32} />
        </div>
        <h2 className="text-3xl font-black text-slate-900 mb-2">AI Symptom Checker</h2>
        <p className="text-slate-500">Select your symptoms below. Choose at least 2 for a preliminary assessment.</p>
      </div>

      <div className="flex flex-wrap gap-3 mb-8 justify-center">
        {symptomsList.map((s) => (
          <button
            key={s}
            onClick={() => toggleSymptom(s)}
            className={`px-5 py-3 rounded-2xl font-semibold text-sm border-2 transition-all ${
              selected.includes(s)
                ? 'bg-primary-600 text-white border-primary-600 shadow-lg shadow-primary-200 scale-105'
                : 'bg-white text-slate-600 border-slate-200 hover:border-primary-300'
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      <button
        onClick={handleCheck}
        disabled={selected.length < 2 || loading}
        className={`w-full py-5 rounded-2xl font-bold text-lg flex items-center justify-center gap-2 transition-all ${
          selected.length >= 2
            ? 'bg-primary-600 text-white shadow-xl shadow-primary-200 hover:bg-primary-700'
            : 'bg-slate-200 text-slate-400 cursor-not-allowed'
        }`}
      >
        {loading ? (
          <><RefreshCw size={20} className="animate-spin" /> Analyzing Symptoms...</>
        ) : (
          <>Analyze Symptoms <ChevronRight size={20} /></>
        )}
      </button>
    </div>
  );
};

export default SymptomChecker;
