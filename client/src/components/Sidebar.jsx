import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, Calendar, ClipboardList, Activity, MessageSquare, 
  User, LogOut, Stethoscope, Users, Pill, 
  ShieldCheck, BarChart3, ShoppingBag, Video, 
  AlertTriangle, Settings, Package, History
} from 'lucide-react';
import { motion } from 'framer-motion';

const Sidebar = ({ role = 'Patient' }) => {
  const base = `/${role.toLowerCase()}`;
  const navigate = useNavigate();
  
  const menus = {
    Patient: [
      { id: 'Dashboard', label: 'Dashboard', icon: LayoutDashboard, hindi: 'डैशबोर्ड', path: base },
      { id: 'BookAppointment', label: 'Book Appointment', icon: Calendar, hindi: 'अपॉइंटमेंट बुक करें', path: `${base}/book-appointment` },
      { id: 'MyAppointments', label: 'My Appointments', icon: ClipboardList, hindi: 'मेरे अपॉइंटमेंट', path: `${base}/appointments` },
      { id: 'Prescriptions', label: 'Prescriptions', icon: Pill, hindi: 'प्रिस्क्रिप्शन', path: `${base}/prescriptions` },
      { id: 'HealthRecords', label: 'Health Records', icon: Activity, hindi: 'स्वास्थ्य रिकॉर्ड', path: `${base}/records` },
      { id: 'SymptomChecker', label: 'AI Symptoms Checker', icon: ShieldCheck, hindi: 'एआई लक्षण जांच', path: `${base}/symptom-checker` },
      { id: 'OrderMedicines', label: 'Order Medicines', icon: ShoppingBag, hindi: 'दवाएं ऑर्डर करें', path: `${base}/order-medicines` },
      { id: 'MyOrders', label: 'My Orders', icon: History, hindi: 'मेरे ऑर्डर', path: `${base}/my-orders` },
      { id: 'Messages', label: 'Messages', icon: MessageSquare, hindi: 'संदेश', path: `${base}/messages` },
      { id: 'Profile', label: 'Profile', icon: User, hindi: 'प्रोफ़ाइल', path: `${base}/profile` },
    ],
    Doctor: [
      { id: 'Dashboard', label: 'Dashboard', icon: LayoutDashboard, path: base },
      { id: 'Appointments', label: 'Appointments', icon: Calendar, path: `${base}/appointments` },
      { id: 'Patients', label: 'Patients', icon: Users, path: `${base}/patients` },
      { id: 'Prescriptions', label: 'Prescriptions', icon: Pill, path: `${base}/prescriptions` },
      { id: 'Messages', label: 'Chat / Messages', icon: MessageSquare, path: `${base}/messages` },
      { id: 'Consultation', label: 'Video Consult', icon: Video, path: `${base}/consultation` },
      { id: 'Profile', label: 'Profile', icon: User, path: `${base}/profile` },
    ],
    Pharmacy: [
      { id: 'Dashboard', label: 'Dashboard', icon: LayoutDashboard, path: base },
      { id: 'Inventory', label: 'Medicine Stock', icon: Package, path: `${base}/medicine-stock` },
      { id: 'Orders', label: 'Orders', icon: ShoppingBag, path: `${base}/orders` },
      { id: 'Sales', label: 'Sales', icon: BarChart3, path: `${base}/sales` },
      { id: 'Expiring', label: 'Expiring Soon', icon: AlertTriangle, path: `${base}/expiring` },
      { id: 'Customers', label: 'Customers', icon: Users, path: `${base}/customers` },
      { id: 'Profile', label: 'Profile', icon: User, path: `${base}/profile` },
    ],
    Admin: [
      { id: 'Dashboard', label: 'Dashboard', icon: LayoutDashboard, path: base },
      { id: 'Doctors', label: 'Doctor Management', icon: Stethoscope, path: `${base}/doctors` },
      { id: 'Users', label: 'User Management', icon: Users, path: `${base}/users` },
      { id: 'Pharmacy', label: 'Pharmacy Management', icon: Pill, path: `${base}/pharmacy` },
      { id: 'Appointments', label: 'Appointments', icon: Calendar, path: `${base}/appointments` },
      { id: 'Analytics', label: 'Reports & Analytics', icon: BarChart3, path: `${base}/reports` },
      { id: 'Settings', label: 'Settings', icon: Settings, path: `${base}/settings` },
    ]
  };

  const currentMenu = menus[role] || menus.Patient;

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/');
  };

  return (
    <aside className="w-20 md:w-72 bg-white dark:bg-slate-900 border-r border-slate-100 dark:border-slate-800 h-[calc(100vh-80px)] fixed left-0 bottom-0 overflow-y-auto transition-all duration-300 z-40 scrollbar-hide flex flex-col">
      <div className="p-4 flex flex-col gap-1.5">
        {currentMenu.map((item) => (
          <NavLink
            key={item.id}
            to={item.path}
            end={item.path === base}
            className={({ isActive }) => `flex items-center gap-4 p-3.5 rounded-2xl transition-all group relative ${
              isActive 
                ? 'bg-primary/10 text-primary shadow-sm shadow-primary/5' 
                : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-primary'
            }`}
          >
            {({ isActive }) => (
              <>
                <item.icon className={`w-5 h-5 shrink-0 transition-transform ${isActive ? 'scale-110' : 'group-hover:scale-110'}`} />
                <div className="hidden md:flex flex-col">
                  <span className="text-sm font-black uppercase tracking-tight">{item.label}</span>
                  {item.hindi && <span className="text-[10px] font-bold opacity-60 tracking-wider font-hindi leading-none mt-0.5">{item.hindi}</span>}
                </div>
                {isActive && (
                  <motion.div 
                    layoutId="sidebar-pill"
                    className="absolute left-0 w-1.5 h-8 bg-primary rounded-r-full"
                  />
                )}
              </>
            )}
          </NavLink>
        ))}
      </div>

      <div className="mt-auto p-4 border-t border-slate-100 dark:border-slate-800">
        <button 
          onClick={handleLogout}
          className="flex items-center gap-4 p-4 w-full rounded-2xl text-slate-500 dark:text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10 transition-all group"
        >
          <LogOut className="w-5 h-5 shrink-0 group-hover:translate-x-1 transition-transform" />
          <span className="hidden md:block text-sm font-black uppercase tracking-tight">Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;



