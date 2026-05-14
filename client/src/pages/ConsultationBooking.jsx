import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Stethoscope, Heart, Brain, Bone, Baby, 
  Smile, User, ArrowRight, ArrowLeft, Calendar, 
  Clock, Video, Users, CheckCircle2, Loader2, AlertCircle
} from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

const DEPARTMENTS = [
  { id: 'opd', name: 'OPD / General Physician', icon: Stethoscope, desc: 'General health checkups and consultations', color: 'bg-emerald-500' },
  { id: 'dentist', name: 'Dentist', icon: Smile, desc: 'Complete oral and dental healthcare', color: 'bg-blue-500' },
  { id: 'cardiologist', name: 'Cardiologist', icon: Heart, desc: 'Specialized heart and vascular care', color: 'bg-red-500' },
  { id: 'neurologist', name: 'Neurologist', icon: Brain, desc: 'Brain, spine, and nerve treatments', color: 'bg-purple-500' },
  { id: 'orthopedic', name: 'Orthopedic', icon: Bone, desc: 'Bone, joint, and muscle specialists', color: 'bg-amber-500' },
  { id: 'pediatrician', name: 'Pediatrician', icon: Baby, desc: 'Comprehensive care for children & infants', color: 'bg-cyan-500' },
];

const ConsultationBooking = () => {
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [selectedDept, setSelectedDept] = useState(null);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [bookingData, setBookingData] = useState({
    date: '',
    time: '',
    consultationType: 'video',
    problemDescription: ''
  });

  const fetchDoctors = async (dept) => {
    setLoading(true);
    try {
      // In a real app, you'd filter by department on the backend
      const { data } = await axios.get(`/api/doctors?department=${dept}`);
      setDoctors(data.data);
    } catch (err) {
      // Mock data if API fails or for demo
      setDoctors([
        { _id: '1', name: 'Dr. Rahul Sharma', specialization: dept, experience: 8, rating: 4.8, fee: 500 },
        { _id: '2', name: 'Dr. Sneha Verma', specialization: dept, experience: 12, rating: 4.9, fee: 800 },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleDeptSelect = (dept) => {
    setSelectedDept(dept);
    fetchDoctors(dept.name);
    setStep(2);
  };

  const handleDoctorSelect = (doctor) => {
    setSelectedDoctor(doctor);
    setStep(3);
  };

  const handleBooking = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post('/api/appointments', {
        ...bookingData,
        doctorId: selectedDoctor._id,
        doctorName: selectedDoctor.name,
        department: selectedDept.name,
        patientName: user.name,
        patientPhone: user.phone,
        patientEmail: user.email,
      });
      if (response.data.success) {
        toast.success("Consultation booked successfully!");
        setStep(4);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Booking failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-6 md:p-12">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-black text-slate-900 dark:text-white uppercase tracking-tight flex items-center gap-3">
            Book <span className="text-primary">Consultation</span>
          </h1>
          <p className="text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest text-[10px] mt-1">
            Step {step} of 4: {step === 1 ? 'Select Department' : step === 2 ? 'Select Specialist' : step === 3 ? 'Confirm Details' : 'Booking Confirmed'}
          </p>
        </div>

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div 
              key="step1"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {DEPARTMENTS.map((dept) => (
                <button
                  key={dept.id}
                  onClick={() => handleDeptSelect(dept)}
                  className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-premium hover:border-primary transition-all text-left group relative overflow-hidden"
                >
                  <div className={`${dept.color} w-16 h-16 rounded-3xl flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform shadow-lg shadow-current/10`}>
                    <dept.icon className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight mb-2">{dept.name}</h3>
                  <p className="text-slate-500 dark:text-slate-400 text-xs font-bold leading-relaxed">{dept.desc}</p>
                  <div className="mt-6 flex items-center gap-2 text-[10px] font-black text-primary uppercase tracking-widest">
                    Consult Now <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                  </div>
                </button>
              ))}
            </motion.div>
          )}

          {step === 2 && (
            <motion.div 
              key="step2"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <button onClick={() => setStep(1)} className="flex items-center gap-2 text-slate-400 hover:text-primary font-black uppercase text-[10px] tracking-widest mb-4">
                <ArrowLeft className="w-3 h-3" /> Back to Departments
              </button>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {doctors.map((dr) => (
                  <div key={dr._id} className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-premium flex flex-col md:flex-row gap-6 items-center">
                    <div className="w-32 h-32 rounded-3xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400">
                      <User className="w-16 h-16" />
                    </div>
                    <div className="flex-1 text-center md:text-left">
                      <h3 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">{dr.name}</h3>
                      <p className="text-primary font-black text-[10px] uppercase tracking-widest mb-4">{dr.specialization} • {dr.experience} Years Exp</p>
                      <div className="flex items-center justify-center md:justify-start gap-4 mb-6">
                        <span className="flex items-center gap-1 text-[10px] font-black text-amber-500 bg-amber-500/10 px-2 py-1 rounded-lg uppercase tracking-widest">★ {dr.rating}</span>
                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Fee: ₹{dr.fee}</span>
                      </div>
                      <button 
                        onClick={() => handleDoctorSelect(dr)}
                        className="w-full md:w-auto px-8 py-4 bg-slate-900 dark:bg-white dark:text-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all"
                      >
                        Select Doctor
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div 
              key="step3"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="max-w-2xl mx-auto bg-white dark:bg-slate-900 p-10 rounded-[3rem] border border-slate-100 dark:border-slate-800 shadow-premium"
            >
              <button onClick={() => setStep(2)} className="mb-8 flex items-center gap-2 text-slate-400 hover:text-primary font-black uppercase text-[10px] tracking-widest">
                <ArrowLeft className="w-3 h-3" /> Back to Doctors
              </button>
              
              <div className="flex items-center gap-4 mb-10 p-5 bg-slate-50 dark:bg-slate-800/50 rounded-3xl">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
                  <selectedDept.icon className="w-8 h-8" />
                </div>
                <div>
                  <h4 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight">{selectedDoctor.name}</h4>
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{selectedDept.name}</p>
                </div>
              </div>

              <form onSubmit={handleBooking} className="space-y-6">
                <div className="grid grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-2">Select Date</label>
                    <div className="relative">
                      <Calendar className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input 
                        type="date" 
                        required
                        className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl pl-14 pr-6 py-4 outline-none focus:ring-4 focus:ring-primary/10 transition-all font-bold text-sm"
                        onChange={(e) => setBookingData({...bookingData, date: e.target.value})}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-2">Select Slot</label>
                    <div className="relative">
                      <Clock className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <select 
                        required
                        className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl pl-14 pr-6 py-4 outline-none focus:ring-4 focus:ring-primary/10 transition-all font-bold text-sm appearance-none"
                        onChange={(e) => setBookingData({...bookingData, time: e.target.value})}
                      >
                        <option value="">Choose Time</option>
                        <option value="10:00 AM">10:00 AM</option>
                        <option value="11:30 AM">11:30 AM</option>
                        <option value="02:00 PM">02:00 PM</option>
                        <option value="04:30 PM">04:30 PM</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-2">Consultation Type</label>
                  <div className="grid grid-cols-2 gap-4">
                    <button 
                      type="button"
                      onClick={() => setBookingData({...bookingData, consultationType: 'video'})}
                      className={`flex items-center justify-center gap-3 py-4 rounded-2xl border-2 transition-all font-black text-[10px] uppercase tracking-widest ${bookingData.consultationType === 'video' ? 'border-primary bg-primary/5 text-primary' : 'border-slate-100 dark:border-slate-800 text-slate-400'}`}
                    >
                      <Video className="w-4 h-4" /> Video Call
                    </button>
                    <button 
                      type="button"
                      onClick={() => setBookingData({...bookingData, consultationType: 'in-person'})}
                      className={`flex items-center justify-center gap-3 py-4 rounded-2xl border-2 transition-all font-black text-[10px] uppercase tracking-widest ${bookingData.consultationType === 'in-person' ? 'border-primary bg-primary/5 text-primary' : 'border-slate-100 dark:border-slate-800 text-slate-400'}`}
                    >
                      <Users className="w-4 h-4" /> In-Person
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-2">Describe Your Problem</label>
                  <textarea 
                    required
                    placeholder="Briefly describe your symptoms or medical concern..."
                    rows={4}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-[2rem] p-6 outline-none focus:ring-4 focus:ring-primary/10 transition-all font-bold text-sm resize-none"
                    onChange={(e) => setBookingData({...bookingData, problemDescription: e.target.value})}
                  />
                </div>

                <button 
                  type="submit"
                  disabled={loading}
                  className="w-full py-5 bg-primary text-white rounded-2xl font-black text-lg shadow-xl shadow-primary/30 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 mt-6"
                >
                  {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <>Confirm Booking Now <CheckCircle2 className="w-6 h-6" /></>}
                </button>
              </form>
            </motion.div>
          )}

          {step === 4 && (
            <motion.div 
              key="step4"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              className="max-w-md mx-auto text-center"
            >
              <div className="w-32 h-32 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-emerald-500/10">
                <CheckCircle2 className="w-16 h-16" />
              </div>
              <h2 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight mb-4">Booking Successful!</h2>
              <p className="text-slate-500 dark:text-slate-400 font-bold mb-10 leading-relaxed uppercase tracking-widest text-[10px]">
                Your consultation has been scheduled. You will receive a confirmation message shortly.
              </p>
              <div className="space-y-4">
                <button 
                  onClick={() => navigate('/patient-dashboard')}
                  className="w-full py-5 bg-slate-900 dark:bg-white dark:text-slate-900 text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl"
                >
                  Go to Dashboard
                </button>
                <button 
                  onClick={() => setStep(1)}
                  className="w-full py-5 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 text-slate-500 rounded-2xl font-black text-sm uppercase tracking-widest"
                >
                  Book Another Appointment
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ConsultationBooking;
