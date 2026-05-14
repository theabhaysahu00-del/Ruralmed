import React, { useState, useEffect } from 'react';
import { 
  MapPin, Phone, Star, Clock, ArrowRight, 
  ShieldCheck, Search, Filter, Navigation,
  Activity, Info
} from 'lucide-react';
import { motion } from 'framer-motion';
import { CardSkeleton } from '../components/Skeleton';

const hospitalData = [
  {
    id: 1,
    name: "Rural General Hospital",
    hindi: "ग्रामीण जनरल अस्पताल",
    dist: "1.2 km",
    rating: 4.5,
    status: "Open 24/7",
    specialty: "General Medicine, Emergency, Surgery",
    phone: "011-2345678",
    type: "Public",
    beds: "120 Available"
  },
  {
    id: 2,
    name: "Maternal Health Center",
    hindi: "मातृ स्वास्थ्य केंद्र",
    dist: "2.5 km",
    rating: 4.8,
    status: "Open 24/7",
    specialty: "Gynecology, Pediatrics, Neonatal",
    phone: "011-8765432",
    type: "Private",
    beds: "15 Available"
  },
  {
    id: 3,
    name: "Community Health Clinic",
    hindi: "सामुदायिक स्वास्थ्य क्लिनिक",
    dist: "4.0 km",
    rating: 4.2,
    status: "Closes 8:00 PM",
    specialty: "Primary Care, Dental, Vaccination",
    phone: "011-1234567",
    type: "Government",
    beds: "N/A"
  }
];

const Hospitals = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate data fetch for demonstration
    const timer = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  const filteredHospitals = hospitalData.filter(h => 
    h.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    h.specialty.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-10 pb-12 animate-in fade-in duration-500">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
           <h1 className="text-4xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Medical Directory</h1>
           <p className="text-slate-500 dark:text-slate-400 font-medium">Locate and connect with healthcare facilities in your region.</p>
        </div>
        <div className="flex items-center gap-3 bg-white dark:bg-slate-900 px-4 py-2 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl">
           <MapPin className="w-5 h-5 text-primary" />
           <div className="text-left">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Current Location</p>
              <p className="text-xs font-bold text-slate-700 dark:text-slate-300">Hamirpur, Himachal Pradesh</p>
           </div>
        </div>
      </header>

      {/* Search & Filter Bar */}
      <section className="flex flex-col md:flex-row gap-4">
         <div className="flex-1 relative group">
            <Search className="w-5 h-5 absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" />
            <input 
              type="text" 
              placeholder="Search hospitals, specialties, clinics..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl pl-14 pr-6 py-5 focus:ring-4 focus:ring-primary/10 outline-none transition-all text-sm font-bold shadow-lg"
            />
         </div>
         <button className="bg-slate-900 dark:bg-slate-800 text-white px-8 py-5 rounded-3xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2 hover:bg-slate-800 transition-all shadow-xl">
            <Filter className="w-4 h-4" /> Filters
         </button>
      </section>

      {/* Map Preview */}
      <section className="bg-slate-900 rounded-[2.5rem] h-64 relative overflow-hidden shadow-2xl border-4 border-white dark:border-slate-800">
         <div className="absolute inset-0 opacity-30 grayscale contrast-125 bg-[url('https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/76.5,31.7,11/1200x400?access_token=pk.mock')] bg-cover bg-center" />
         <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent" />
         <div className="relative z-10 h-full flex flex-col items-center justify-center text-center">
            <div className="relative">
               <div className="w-16 h-16 bg-primary/20 rounded-full animate-ping absolute -inset-4" />
               <MapPin className="w-12 h-12 text-primary relative z-10 drop-shadow-2xl" />
            </div>
            <p className="text-white font-black uppercase tracking-[0.3em] text-[10px] mt-6">3 Facilities found in your 5km radius</p>
         </div>
      </section>

      {/* Hospitals List */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {loading ? (
          <>
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
          </>
        ) : (
          filteredHospitals.map((h, i) => (
            <motion.div
              key={h.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white dark:bg-slate-900 p-10 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-xl hover:shadow-2xl transition-all group relative overflow-hidden"
            >
              <div className="flex justify-between items-start mb-8">
                 <div className="flex items-center gap-2 px-3 py-1 bg-primary/5 text-primary rounded-full text-[10px] font-black uppercase tracking-widest">
                    <Activity className="w-3 h-3" /> {h.type}
                 </div>
                 <div className="flex items-center gap-1 text-amber-500 font-black text-xs">
                    <Star className="w-4 h-4 fill-current" /> {h.rating}
                 </div>
              </div>

              <div className="mb-8">
                 <h3 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight leading-tight mb-1">{h.name}</h3>
                 <p className="text-sm font-hindi text-slate-500 font-medium mb-3">{h.hindi}</p>
                 <p className="text-xs font-bold text-slate-400 uppercase tracking-widest leading-relaxed">
                    {h.specialty}
                 </p>
              </div>

              <div className="space-y-4 mb-10">
                 <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Distance</span>
                    <span className="text-xs font-black text-slate-900 dark:text-white">{h.dist}</span>
                 </div>
                 <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</span>
                    <span className="text-xs font-black text-emerald-600 uppercase">{h.status}</span>
                 </div>
                 {h.beds !== 'N/A' && (
                   <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Bed Capacity</span>
                      <span className="text-xs font-black text-primary">{h.beds}</span>
                   </div>
                 )}
              </div>

              <div className="grid grid-cols-2 gap-3 relative z-10">
                 <button 
                   onClick={() => window.location.href = `tel:${h.phone}`}
                   className="bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-slate-200 transition-all flex items-center justify-center gap-2"
                 >
                   <Phone className="w-4 h-4" /> Call
                 </button>
                 <button className="bg-primary text-white py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-xl shadow-primary/20 hover:scale-105 transition-all flex items-center justify-center gap-2">
                   Navigate <Navigation className="w-4 h-4" />
                 </button>
              </div>

              {/* Background design element */}
              <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-all" />
            </motion.div>
          ))
        )}
      </section>

      {/* Info Banner */}
      <section className="bg-slate-900 p-10 rounded-[2.5rem] text-white flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl relative overflow-hidden">
         <div className="relative z-10 flex flex-col md:flex-row items-center gap-6 text-center md:text-left">
            <div className="w-16 h-16 bg-white/10 rounded-3xl flex items-center justify-center">
               <Info className="w-8 h-8 text-primary" />
            </div>
            <div>
               <h4 className="text-2xl font-black uppercase tracking-tight mb-2">Emergency Help?</h4>
               <p className="text-slate-400 font-medium max-w-lg">If you are in a life-threatening situation, please do not wait. Call 102 or head to the nearest emergency center immediately.</p>
            </div>
         </div>
         <button className="bg-primary text-white px-10 py-5 rounded-[2rem] font-black uppercase tracking-widest text-xs shadow-xl shadow-primary/20 hover:scale-105 transition-all whitespace-nowrap relative z-10">
            View Emergency Map
         </button>
         <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[100px]" />
      </section>
    </div>
  );
};

export default Hospitals;
