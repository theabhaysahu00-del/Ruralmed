import React from 'react';
import { WifiOff, RefreshCw } from 'lucide-react';

const OfflineFallback = () => (
  <div className="min-h-screen bg-slate-50 flex items-center justify-center p-8">
    <div className="text-center max-w-md">
      <div className="w-24 h-24 bg-orange-100 text-orange-600 rounded-3xl flex items-center justify-center mx-auto mb-8">
        <WifiOff size={48} />
      </div>
      <h1 className="text-3xl font-black text-slate-900 mb-4">You're Offline</h1>
      <p className="text-slate-500 mb-8 leading-relaxed">
        It looks like your internet connection is unavailable. Don't worry — your previously viewed medical records and prescriptions are still accessible.
      </p>
      <button 
        onClick={() => window.location.reload()}
        className="bg-primary-600 text-white px-8 py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-2 mx-auto hover:bg-primary-700 transition-all shadow-lg shadow-primary-200"
      >
        <RefreshCw size={20} /> Try Again
      </button>
      <p className="text-xs text-slate-400 mt-10">RuralMed works offline for basic features like viewing prescriptions and medical history.</p>
    </div>
  </div>
);

export default OfflineFallback;
