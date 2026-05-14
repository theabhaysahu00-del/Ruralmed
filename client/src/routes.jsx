import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import useAuthStore from './store/useAuthStore';

import Landing from './pages/Landing';
import Login from './pages/Login';
import PatientDashboard from './pages/PatientDashboard';
import DoctorDashboard from './pages/DoctorDashboard';
import PharmacyDashboard from './pages/PharmacyDashboard';
import AdminDashboard from './pages/AdminDashboard';

const AppRoutes = () => {
  const { role, isAuthenticated } = useAuthStore();

  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      
      {/* Role Based Protected Routes */}
      <Route 
        path="/patient/*" 
        element={isAuthenticated && role === 'patient' ? <PatientDashboard /> : <Navigate to="/login" />} 
      />
      <Route 
        path="/doctor/*" 
        element={isAuthenticated && role === 'doctor' ? <DoctorDashboard /> : <Navigate to="/login" />} 
      />
      <Route 
        path="/pharmacy/*" 
        element={isAuthenticated && role === 'pharmacy' ? <PharmacyDashboard /> : <Navigate to="/login" />} 
      />
      <Route 
        path="/admin/*" 
        element={isAuthenticated && role === 'admin' ? <AdminDashboard /> : <Navigate to="/login" />} 
      />
    </Routes>
  );
};

export default AppRoutes;
