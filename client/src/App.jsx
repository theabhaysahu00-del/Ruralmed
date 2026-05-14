import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import Layout from './components/Layout';
import Landing from './pages/Landing';
import PatientLogin from './pages/PatientLogin';
import DoctorLogin from './pages/DoctorLogin';
import PharmacyLogin from './pages/PharmacyLogin';
import AdminLogin from './pages/AdminLogin';
import SignUp from './pages/SignUp';
import RoleSelection from './pages/RoleSelection';
import PatientSignup from './pages/PatientSignup';
import DoctorSignup from './pages/DoctorSignup';
import PharmacySignup from './pages/PharmacySignup';
import ConsultationBooking from './pages/ConsultationBooking';
import PatientDashboard from './pages/PatientDashboard';
import DoctorDashboard from './pages/DoctorDashboard';
import PharmacyDashboard from './pages/PharmacyDashboard';
import AdminDashboard from './pages/AdminDashboard';
import SymptomChecker from './pages/SymptomChecker';
import About from './pages/About';
import Emergency from './pages/Emergency';
import Hospitals from './pages/Hospitals';
import BookAppointment from './pages/BookAppointment';
import MyAppointments from './pages/MyAppointments';
import Prescriptions from './pages/Prescriptions';
import HealthRecords from './pages/HealthRecords';
import Messages from './pages/Messages';
import PatientProfile from './pages/PatientProfile';
import VideoConsultation from './pages/VideoConsultation';
import DoctorVerificationStatus from './pages/DoctorVerificationStatus';
import OrderMedicines from './pages/OrderMedicines';
import MyOrders from './pages/MyOrders';
import MedicineStock from './pages/MedicineStock';
import PharmacyOrders from './pages/PharmacyOrders';
import PharmacySales from './pages/PharmacySales';
import ExpiringSoon from './pages/ExpiringSoon';
import PharmacyCustomers from './pages/PharmacyCustomers';
import PharmacyProfilePage from './pages/PharmacyProfile';
import DoctorAppointments from './pages/DoctorAppointments';
import DoctorPatients from './pages/DoctorPatients';
import DoctorPrescriptions from './pages/DoctorPrescriptions';
import DoctorProfile from './pages/DoctorProfile';
import AdminDoctors from './pages/AdminDoctors';
import AdminUsers from './pages/AdminUsers';
import AdminPharmacies from './pages/AdminPharmacies';
import AdminAppointments from './pages/AdminAppointments';
import AdminReports from './pages/AdminReports';
import AdminSettings from './pages/AdminSettings';
import { useTranslation } from 'react-i18next';
import './utils/i18n';
import AccessDenied from './pages/AccessDenied';
import { useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { Toaster } from 'react-hot-toast';

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <AccessDenied />;
  }

  // Verification Status Redirection Logic
  if (user.role === 'doctor' && user.approvalStatus !== 'approved' && location.pathname !== '/doctor-verification-status') {
    return <Navigate to="/doctor-verification-status" replace />;
  }

  if (user.role === 'doctor' && user.approvalStatus === 'approved' && location.pathname === '/doctor-verification-status') {
    return <Navigate to="/doctor" replace />;
  }

  return children;
};

import Loader from './components/Loader';

function App() {
  const { i18n } = useTranslation();
  const [language, setLanguage] = useState(localStorage.getItem('language') || 'en');
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    // Initial website load/refresh delay to show the medical loader
    const timer = setTimeout(() => {
      setInitialLoading(false);
    }, 2500); // 2.5 seconds looks professional
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    i18n.changeLanguage(language);
    localStorage.setItem('language', language);
  }, [language, i18n]);

  const toggleLanguage = () => setLanguage(prev => prev === 'en' ? 'hi' : 'en');

  if (initialLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white dark:bg-slate-950">
        <Loader />
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-8 text-[10px] sm:text-xs font-black uppercase tracking-[0.2em] sm:tracking-[0.4em] text-slate-400 animate-pulse text-center px-6 leading-relaxed"
        >
          Initializing RuralMed Healthcare Connect
        </motion.p>
      </div>
    );
  }

  return (
    <Router>
      <div className="antialiased selection:bg-primary/20">
        <Toaster position="top-center" />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Navigate to="/role-selection" replace />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/role-selection" element={<RoleSelection />} />
          
          {/* Role Specific Login Routes */}
          <Route path="/patient-login" element={<PatientLogin />} />
          <Route path="/doctor-login" element={<DoctorLogin />} />
          <Route path="/pharmacy-login" element={<PharmacyLogin />} />
          <Route path="/admin-login" element={<AdminLogin />} />
          
          {/* Role Specific Signup Routes */}
          <Route path="/patient-signup" element={<PatientSignup />} />
          <Route path="/doctor-signup" element={<DoctorSignup />} />
          <Route path="/pharmacy-signup" element={<PharmacySignup />} />
          
          {/* Patient Routes */}
          <Route path="/book-consultation" element={<ConsultationBooking />} />
          
          <Route path="/emergency" element={<Emergency />} />
          <Route path="/hospitals" element={<Hospitals />} />
          <Route path="/symptom-checker" element={<SymptomChecker />} />
          <Route path="/about" element={<About />} />

          {/* Patient Routes */}
          <Route path="/patient" element={
            <ProtectedRoute allowedRoles={['patient']}>
              <Layout role="Patient" language={language} onLanguageToggle={toggleLanguage}>
                <PatientDashboard language={language} />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/patient/dashboard" element={
            <ProtectedRoute allowedRoles={['patient']}>
              <Layout role="Patient" language={language} onLanguageToggle={toggleLanguage}>
                <PatientDashboard language={language} />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/patient/symptom-checker" element={
            <ProtectedRoute allowedRoles={['patient']}>
              <Layout role="Patient" language={language} onLanguageToggle={toggleLanguage}>
                <SymptomChecker />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/patient/book-appointment" element={
            <ProtectedRoute allowedRoles={['patient']}>
              <Layout role="Patient" language={language} onLanguageToggle={toggleLanguage}>
                <BookAppointment />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/patient/appointments" element={
            <ProtectedRoute allowedRoles={['patient']}>
              <Layout role="Patient" language={language} onLanguageToggle={toggleLanguage}>
                <MyAppointments />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/patient/prescriptions" element={
            <ProtectedRoute allowedRoles={['patient']}>
              <Layout role="Patient" language={language} onLanguageToggle={toggleLanguage}>
                <Prescriptions />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/patient/records" element={
            <ProtectedRoute allowedRoles={['patient']}>
              <Layout role="Patient" language={language} onLanguageToggle={toggleLanguage}>
                <HealthRecords />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/patient/messages" element={
            <ProtectedRoute allowedRoles={['patient']}>
              <Layout role="Patient" language={language} onLanguageToggle={toggleLanguage}>
                <Messages />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/patient/profile" element={
            <ProtectedRoute allowedRoles={['patient']}>
              <Layout role="Patient" language={language} onLanguageToggle={toggleLanguage}>
                <PatientProfile />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/patient/order-medicines" element={
            <ProtectedRoute allowedRoles={['patient']}>
              <Layout role="Patient" language={language} onLanguageToggle={toggleLanguage}>
                <OrderMedicines />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/patient/my-orders" element={
            <ProtectedRoute allowedRoles={['patient']}>
              <Layout role="Patient" language={language} onLanguageToggle={toggleLanguage}>
                <MyOrders />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/patient/consultation/:id" element={
            <ProtectedRoute allowedRoles={['patient']}>
              <Layout role="Patient" language={language} onLanguageToggle={toggleLanguage}>
                <VideoConsultation />
              </Layout>
            </ProtectedRoute>
          } />
          
          {/* Doctor Routes */}
          <Route path="/doctor-verification-status" element={
            <ProtectedRoute allowedRoles={['doctor']}>
              <Layout role="Doctor" language={language} onLanguageToggle={toggleLanguage}>
                <DoctorVerificationStatus />
              </Layout>
            </ProtectedRoute>
          } />
          
          <Route path="/doctor" element={
            <ProtectedRoute allowedRoles={['doctor']}>
              <Layout role="Doctor" language={language} onLanguageToggle={toggleLanguage}>
                <DoctorDashboard language={language} />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/doctor/dashboard" element={
            <ProtectedRoute allowedRoles={['doctor']}>
              <Layout role="Doctor" language={language} onLanguageToggle={toggleLanguage}>
                <DoctorDashboard language={language} />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/doctor/appointments" element={
            <ProtectedRoute allowedRoles={['doctor']}>
              <Layout role="Doctor" language={language} onLanguageToggle={toggleLanguage}>
                <DoctorAppointments />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/doctor/patients" element={
            <ProtectedRoute allowedRoles={['doctor']}>
              <Layout role="Doctor" language={language} onLanguageToggle={toggleLanguage}>
                <DoctorPatients />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/doctor/prescriptions" element={
            <ProtectedRoute allowedRoles={['doctor']}>
              <Layout role="Doctor" language={language} onLanguageToggle={toggleLanguage}>
                <DoctorPrescriptions />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/doctor/messages" element={
            <ProtectedRoute allowedRoles={['doctor']}>
              <Layout role="Doctor" language={language} onLanguageToggle={toggleLanguage}>
                <Messages />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/doctor/profile" element={
            <ProtectedRoute allowedRoles={['doctor']}>
              <Layout role="Doctor" language={language} onLanguageToggle={toggleLanguage}>
                <DoctorProfile />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/doctor/consultation" element={
            <ProtectedRoute allowedRoles={['doctor']}>
              <Layout role="Doctor" language={language} onLanguageToggle={toggleLanguage}>
                <VideoConsultation />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/doctor/consultation/:id" element={
            <ProtectedRoute allowedRoles={['doctor']}>
              <Layout role="Doctor" language={language} onLanguageToggle={toggleLanguage}>
                <VideoConsultation />
              </Layout>
            </ProtectedRoute>
          } />
          
          {/* Pharmacy Routes */}
          <Route path="/pharmacy" element={
            <ProtectedRoute allowedRoles={['pharmacy']}>
              <Layout role="Pharmacy" language={language} onLanguageToggle={toggleLanguage}>
                <PharmacyDashboard language={language} />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/pharmacy/medicine-stock" element={
            <ProtectedRoute allowedRoles={['pharmacy']}>
              <Layout role="Pharmacy" language={language} onLanguageToggle={toggleLanguage}>
                <MedicineStock />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/pharmacy/orders" element={
            <ProtectedRoute allowedRoles={['pharmacy']}>
              <Layout role="Pharmacy" language={language} onLanguageToggle={toggleLanguage}>
                <PharmacyOrders />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/pharmacy/sales" element={
            <ProtectedRoute allowedRoles={['pharmacy']}>
              <Layout role="Pharmacy" language={language} onLanguageToggle={toggleLanguage}>
                <PharmacySales />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/pharmacy/expiring" element={
            <ProtectedRoute allowedRoles={['pharmacy']}>
              <Layout role="Pharmacy" language={language} onLanguageToggle={toggleLanguage}>
                <ExpiringSoon />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/pharmacy/customers" element={
            <ProtectedRoute allowedRoles={['pharmacy']}>
              <Layout role="Pharmacy" language={language} onLanguageToggle={toggleLanguage}>
                <PharmacyCustomers />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/pharmacy/profile" element={
            <ProtectedRoute allowedRoles={['pharmacy']}>
              <Layout role="Pharmacy" language={language} onLanguageToggle={toggleLanguage}>
                <PharmacyProfilePage />
              </Layout>
            </ProtectedRoute>
          } />
          
          {/* Admin Routes */}
          <Route path="/admin" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <Layout role="Admin" language={language} onLanguageToggle={toggleLanguage}>
                <AdminDashboard language={language} />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/admin/dashboard" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <Layout role="Admin" language={language} onLanguageToggle={toggleLanguage}>
                <AdminDashboard language={language} />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/admin/doctors" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <Layout role="Admin" language={language} onLanguageToggle={toggleLanguage}>
                <AdminDoctors />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/admin/users" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <Layout role="Admin" language={language} onLanguageToggle={toggleLanguage}>
                <AdminUsers />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/admin/pharmacy" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <Layout role="Admin" language={language} onLanguageToggle={toggleLanguage}>
                <AdminPharmacies />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/admin/appointments" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <Layout role="Admin" language={language} onLanguageToggle={toggleLanguage}>
                <AdminAppointments />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/admin/reports" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <Layout role="Admin" language={language} onLanguageToggle={toggleLanguage}>
                <AdminReports />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/admin/settings" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <Layout role="Admin" language={language} onLanguageToggle={toggleLanguage}>
                <AdminSettings />
              </Layout>
            </ProtectedRoute>
          } />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>

        {/* Demo Role Switcher */}
      </div>
    </Router>
  );
}



export default App;

