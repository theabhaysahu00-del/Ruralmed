import React, { useState } from 'react';
import { Search, Filter, Star, Clock, Calendar, CheckCircle2 } from 'lucide-react';

const doctors = [
  { id: 1, name: 'Dr. Aarav Sharma', specialty: 'General Physician', exp: 12, fee: 500, rating: 4.8 },
  { id: 2, name: 'Dr. Ishita Gupta', specialty: 'Pediatrician', exp: 8, fee: 400, rating: 4.9 },
  { id: 3, name: 'Dr. Vikram Malhotra', specialty: 'Cardiologist', exp: 20, fee: 800, rating: 4.7 },
  { id: 4, name: 'Dr. Ananya Reddy', specialty: 'Dermatologist', exp: 6, fee: 600, rating: 4.6 },
];

const DoctorBooking = () => {
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [booked, setBooked] = useState(false);

  const handleBook = () => {
    setBooked(true);
    setTimeout(() => {
      setBooked(false);
      setSelectedDoc(null);
    }, 3000);
  };

  if (booked) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center animate-in fade-in zoom-in duration-500">
        <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6">
          <CheckCircle2 size={40} />
        </div>
        <h2 className="text-3xl font-black text-slate-900 mb-2">Booking Confirmed!</h2>
        <p className="text-slate-500">You will receive a notification 10 minutes before the call.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Search and Filter */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
          <input 
            type="text" 
            placeholder="Search by name or specialty..." 
            className="w-full pl-12 pr-4 py-4 rounded-2xl border border-slate-200 focus:border-primary-500 focus:ring-4 focus:ring-primary-50 px-4 transition-all outline-none text-lg font-medium"
          />
        </div>
        <button className="flex items-center justify-center gap-2 bg-white border border-slate-200 px-6 py-4 rounded-2xl font-bold text-slate-700 hover:bg-slate-50 transition-all">
          <Filter size={20} /> Filters
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {doctors.map(doc => (
          <div key={doc.id} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-primary-100 transition-all duration-300 group">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-16 h-16 rounded-2xl bg-slate-100 overflow-hidden">
                <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${doc.name}`} alt={doc.name} />
              </div>
              <div>
                <h3 className="font-bold text-lg text-slate-900">{doc.name}</h3>
                <p className="text-primary-600 font-semibold text-sm">{doc.specialty}</p>
                <div className="flex items-center gap-1 mt-1 text-orange-500 font-bold text-xs">
                  <Star size={14} fill="currentColor" /> {doc.rating}
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="p-3 bg-slate-50 rounded-xl">
                <p className="text-[10px] text-slate-400 uppercase font-black mb-1">Experience</p>
                <p className="text-sm font-bold">{doc.exp} Years</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl">
                <p className="text-[10px] text-slate-400 uppercase font-black mb-1">Consultation</p>
                <p className="text-sm font-bold text-healthcare-teal">₹{doc.fee}</p>
              </div>
            </div>

            <button 
              onClick={() => setSelectedDoc(doc)}
              className="w-full py-4 rounded-2xl bg-slate-900 text-white font-bold group-hover:bg-primary-600 transition-colors"
            >
              Book Consultation
            </button>
          </div>
        ))}
      </div>

      {/* Booking Modal (Simplified) */}
      {selectedDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl p-8 animate-in slide-in-from-bottom-4 duration-300">
            <h2 className="text-2xl font-black text-slate-900 mb-6">Select Appointment Time</h2>
            <div className="space-y-4 mb-8">
              <div className="flex items-center gap-4 p-4 border border-slate-100 rounded-2xl bg-slate-50">
                <Calendar className="text-primary-600" />
                <div>
                  <p className="text-xs text-slate-400 font-bold">DATE</p>
                  <p className="font-bold">Tomorrow, 17th March</p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {['10:00 AM', '11:30 AM', '02:00 PM', '04:30 PM', '06:00 PM'].map(time => (
                  <button key={time} className="py-3 rounded-xl border border-slate-200 font-bold text-sm hover:border-primary-500 hover:text-primary-600 transition-all">
                    {time}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex gap-4">
              <button 
                onClick={() => setSelectedDoc(null)}
                className="flex-1 py-4 rounded-2xl bg-slate-100 font-bold text-slate-600"
              >
                Cancel
              </button>
              <button 
                onClick={handleBook}
                className="flex-[2] py-4 rounded-2xl bg-primary-600 text-white font-bold shadow-lg shadow-primary-200"
              >
                Confirm Booking
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorBooking;
