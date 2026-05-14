import { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import toast from 'react-hot-toast';

const useDashboardSocket = () => {
  const [stats, setStats] = useState({
    totalPatients: 1250,
    totalDoctors: 45,
    activeDoctors: 12,
    totalAppointments: 850,
    completedConsultations: 620,
    pendingAppointments: 145,
    cancelledAppointments: 85,
    emergencyRequests: 3,
    totalPharmacies: 15,
    medicinesSoldToday: 156,
    lowStockMedicines: 8,
    outOfStock: 2
  });

  const [doctors, setDoctors] = useState([
    { id: 1, name: 'Dr. Amit Sharma', spec: 'Cardiologist', status: 'Available', patientsToday: 8, consultations: 42, active: true },
    { id: 2, name: 'Dr. Priya Verma', spec: 'Dermatologist', status: 'Busy', patientsToday: 12, consultations: 156, active: true },
    { id: 3, name: 'Dr. Rahul Gupta', spec: 'Pediatrician', status: 'Offline', patientsToday: 0, consultations: 89, active: false },
    { id: 4, name: 'Dr. Sneha Rao', spec: 'Neurologist', status: 'Available', patientsToday: 5, consultations: 67, active: true },
  ]);

  const [medicines, setMedicines] = useState([
    { id: 1, name: 'Paracetamol 500mg', stock: 450, sold: 120, status: 'In Stock', pharmacy: 'City Pharma' },
    { id: 2, name: 'Amoxicillin 250mg', stock: 12, sold: 85, status: 'Low Stock', pharmacy: 'Rural Care' },
    { id: 3, name: 'Cough Syrup (Adult)', stock: 0, sold: 45, status: 'Out of Stock', pharmacy: 'Apex Meds' },
    { id: 4, name: 'Vitamin C Tablets', stock: 25, sold: 200, status: 'Low Stock', pharmacy: 'City Pharma' },
  ]);

  const [chartData, setChartData] = useState([
    { name: 'Mon', appointments: 40, consultations: 24 },
    { name: 'Tue', appointments: 30, consultations: 13 },
    { name: 'Wed', appointments: 20, consultations: 38 },
    { name: 'Thu', appointments: 27, consultations: 39 },
    { name: 'Fri', appointments: 18, consultations: 48 },
    { name: 'Sat', appointments: 23, consultations: 38 },
    { name: 'Sun', appointments: 34, consultations: 43 },
  ]);

  useEffect(() => {
    // In a real app, you would connect to your backend:
    // const socket = io('http://localhost:5000');
    
    // Simulate real-time updates for demonstration
    const interval = setInterval(() => {
      // Randomly update a stat
      setStats(prev => ({
        ...prev,
        totalAppointments: prev.totalAppointments + (Math.random() > 0.7 ? 1 : 0),
        medicinesSoldToday: prev.medicinesSoldToday + (Math.random() > 0.5 ? 1 : 0),
        activeDoctors: Math.floor(Math.random() * 5) + 10
      }));

      // Randomly trigger an alert
      if (Math.random() > 0.95) {
        toast.error('Emergency request received!', {
          icon: '🚑',
          duration: 4000,
          position: 'top-right'
        });
        setStats(prev => ({ ...prev, emergencyRequests: prev.emergencyRequests + 1 }));
      }
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return { stats, doctors, medicines, chartData };
};

export default useDashboardSocket;
