import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add JWT to headers
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message = error.response?.data?.message || 'Something went wrong';
    return Promise.reject(new Error(message));
  }
);

export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  logout: () => api.post('/auth/logout'),
  getMe: () => api.get('/auth/me'),
};

export const patientAPI = {
  getProfile: () => api.get('/patient/profile'),
  updateProfile: (data) => api.put('/patient/update', data),
  getRecords: () => api.get('/patient/records'),
};

export const medicineAPI = {
  getPublic: (params) => api.get('/medicines/public', { params }),
  getInventory: () => api.get('/medicines/inventory'),
  add: (data) => api.post('/medicines', data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  update: (id, data) => api.put(`/medicines/${id}`, data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  delete: (id) => api.delete(`/medicines/${id}`),
};

export const medicineOrderAPI = {
  create: (data) => api.post('/medicine-orders', data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  getPatientOrders: () => api.get('/medicine-orders/patient'),
  getPharmacyOrders: () => api.get('/medicine-orders/pharmacy'),
  getPharmacyStats: () => api.get('/medicine-orders/pharmacy/stats'),
  updateStatus: (id, data) => api.patch(`/medicine-orders/${id}/status`, data),
};

export const doctorAPI = {
  list: (params) => api.get('/doctors', { params }),
  getById: (id) => api.get(`/doctors/${id}`),
  updateAvailability: (data) => api.post('/doctors/availability', data),
  toggleAvailability: () => api.patch('/doctors/toggle-availability'),
};

export const appointmentAPI = {
  create: (data) => api.post('/appointments', data),
  list: () => api.get('/appointments'),
  updateStatus: (id, status) => api.put(`/appointments/${id}`, { status }),
};
export const prescriptionAPI = {
  create: (data) => api.post('/prescriptions', data),
  getPatientPrescriptions: () => api.get('/prescriptions/patient'),
  getDoctorPrescriptions: () => api.get('/prescriptions/doctor'),
  getById: (id) => api.get(`/prescriptions/${id}`),
};

export const pharmacyAPI = {
  getMedicines: (params) => api.get('/pharmacy/medicines', { params }),
  updateStock: (data) => api.post('/pharmacy/update-stock', data),
  addMedicine: (data) => api.post('/pharmacy/medicines', data),
  getDashboardStats: () => api.get('/medicine-orders/pharmacy/stats'),
};

export const symptomAPI = {
  analyze: (data) => api.post('/symptom-checker', data),
};

export const adminAPI = {
  // Dashboard
  getStats: () => api.get('/admin/stats'),
  getHeatmap: () => api.get('/admin/heatmap'),
  getChartData: () => api.get('/admin/chart-data'),
  // Verification
  getPendingRequests: () => api.get('/admin/pending-requests'),
  verify: (userId, status) => api.post('/admin/verify', { userId, status }),
  // Doctor Management
  getDoctors: (params) => api.get('/admin/all-doctors', { params }),
  updateDoctor: (id, data) => api.put(`/admin/doctors/${id}`, data),
  deleteDoctor: (id) => api.delete(`/admin/doctors/${id}`),
  // User Management
  getUsers: (params) => api.get('/admin/users', { params }),
  updateUser: (id, data) => api.put(`/admin/users/${id}`, data),
  deleteUser: (id) => api.delete(`/admin/users/${id}`),
  // Pharmacy Management
  getPharmacies: (params) => api.get('/admin/pharmacies', { params }),
  updatePharmacy: (id, data) => api.put(`/admin/pharmacies/${id}`, data),
  // Appointments
  getAppointments: (params) => api.get('/admin/appointments', { params }),
  updateAppointment: (id, data) => api.put(`/admin/appointments/${id}`, data),
  // Analytics
  getAnalytics: () => api.get('/admin/analytics'),
  // Settings
  getSettings: () => api.get('/admin/settings'),
  updateSettings: (data) => api.put('/admin/settings', data),
};

export const deliveryAPI = {
  getHistory: () => api.get('/delivery/my-deliveries'),
  initiate: (data) => api.post('/delivery/initiate', data),
  updateStatus: (id, data) => api.patch(`/delivery/${id}/status`, data),
};

export default api;
