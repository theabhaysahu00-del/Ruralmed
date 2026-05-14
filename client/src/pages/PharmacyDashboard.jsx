import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Package, AlertTriangle, ClipboardList, ShoppingBag, 
  ArrowRight, Search, IndianRupee, Loader2, TrendingUp, Bell, CheckCircle2
} from 'lucide-react';
import { motion, useAnimation, useInView } from 'framer-motion';
import { medicineOrderAPI, medicineAPI } from '../services/api';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer 
} from 'recharts';
import { useTheme } from '../context/ThemeContext';

const AnimatedCounter = ({ value, prefix = '' }) => {
  const [count, setCount] = useState(0);
  const numericValue = typeof value === 'string' ? parseFloat(value.replace(/[^0-9.-]+/g,"")) : value;

  useEffect(() => {
    let start = 0;
    const end = numericValue;
    if (start === end) return;
    let totalDuration = 1500;
    let incrementTime = (totalDuration / end);
    let timer = setInterval(() => {
      start += Math.ceil(end / 50);
      if (start > end) start = end;
      setCount(start);
      if (start === end) clearInterval(timer);
    }, incrementTime);
    return () => clearInterval(timer);
  }, [numericValue]);

  return <span>{prefix}{count.toLocaleString()}</span>;
};

const PharmacyDashboard = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const [stats, setStats] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [statsRes, ordersRes] = await Promise.all([
          medicineOrderAPI.getPharmacyStats(),
          medicineOrderAPI.getPharmacyOrders()
        ]);
        setStats(statsRes.data);
        setRecentOrders(ordersRes.data.slice(0, 5));
      } catch (err) {
        console.error("Dashboard data fetch failed", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  const statCards = [
    { label: 'Total Medicines', value: stats?.totalMedicines || 0, icon: Package, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { label: 'Total Orders', value: stats?.totalOrders || 0, icon: ShoppingBag, color: 'text-purple-500', bg: 'bg-purple-500/10' },
    { label: 'Total Revenue', value: stats?.revenue || 0, prefix: '₹', icon: IndianRupee, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
    { label: 'Expiring Soon', value: stats?.expiringSoon || 0, icon: AlertTriangle, color: 'text-red-500', bg: 'bg-red-500/10' },
  ];

  const chartData = stats?.revenueByDate?.map(item => ({
    name: new Date(item._id).toLocaleDateString('en-US', { weekday: 'short' }),
    sales: item.dailyRevenue
  })) || [
    { name: 'Mon', sales: 0 }, { name: 'Tue', sales: 0 }, { name: 'Wed', sales: 0 },
    { name: 'Thu', sales: 0 }, { name: 'Fri', sales: 0 }, { name: 'Sat', sales: 0 }, { name: 'Sun', sales: 0 },
  ];

  const demoNotifications = [
    { id: 1, text: "New order ORD-89XY received", time: "2 mins ago", icon: ShoppingBag, color: "text-blue-500" },
    { id: 2, text: "Insulin Glargine stock is critical (0)", time: "1 hour ago", icon: AlertTriangle, color: "text-red-500" },
    { id: 3, text: "4 deliveries successfully completed", time: "3 hours ago", icon: CheckCircle2, color: "text-emerald-500" },
  ];

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 space-y-4">
        <Loader2 className="w-12 h-12 text-pharmacy animate-spin" />
        <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] animate-pulse">Synchronizing pharmacy data...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12 relative">
      {/* Background Glows */}
      <div className="absolute top-0 left-0 w-full h-[300px] bg-gradient-to-b from-pharmacy/5 to-transparent pointer-events-none rounded-t-3xl" />

      {/* Header */}
      <div className="flex justify-between items-center relative z-10">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
            Pharmacy <span className="text-pharmacy">Command Center</span>
          </h1>
          <p className="text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest text-[10px] mt-1">Real-time inventory and sales metrics</p>
        </div>
        <div className="flex items-center gap-3 bg-white dark:bg-slate-900 px-4 py-2 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Live Sync Active</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
        {statCards.map((stat, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1, type: "spring" }}
            className="bg-white/80 backdrop-blur-xl dark:bg-slate-900/80 p-6 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-premium group hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 relative overflow-hidden"
          >
            <div className={`absolute -right-10 -top-10 w-32 h-32 ${stat.bg} rounded-full blur-3xl opacity-50 group-hover:opacity-100 transition-opacity`} />
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1 leading-none">{stat.label}</p>
            <div className="flex justify-between items-center relative z-10">
              <h3 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter">
                <AnimatedCounter value={stat.value} prefix={stat.prefix} />
              </h3>
              <div className={`${stat.bg} ${stat.color} w-12 h-12 rounded-2xl flex items-center justify-center group-hover:rotate-12 group-hover:scale-110 transition-all duration-300`}>
                <stat.icon className="w-6 h-6" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-10">
        {/* Sales Chart */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-2 bg-white/80 backdrop-blur-xl dark:bg-slate-900/80 p-8 rounded-[3rem] border border-slate-100 dark:border-slate-800 shadow-premium"
        >
          <div className="flex justify-between items-center mb-8">
            <div>
              <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Revenue Trends</h3>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Last 30 Days Activity</p>
            </div>
            <span className="flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 rounded-full text-[10px] font-black text-emerald-500 uppercase tracking-widest">
              <TrendingUp className="w-3 h-3" /> +18.2% vs last month
            </span>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0.2}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={theme === 'dark' ? '#1e293b' : '#f1f5f9'} opacity={0.5} />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fontWeight: 900, fill: theme === 'dark' ? '#64748b' : '#94a3b8' }} 
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fontWeight: 900, fill: theme === 'dark' ? '#64748b' : '#94a3b8' }} 
                  tickFormatter={(value) => `₹${value}`}
                />
                <Tooltip 
                  cursor={{ fill: theme === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(14, 165, 233, 0.05)' }}
                  contentStyle={{ 
                    backgroundColor: theme === 'dark' ? '#0f172a' : '#ffffff',
                    borderRadius: '16px', 
                    border: 'none', 
                    boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', 
                    fontSize: '11px', 
                    fontWeight: 'black',
                    color: theme === 'dark' ? '#fff' : '#1e293b'
                  }}
                />
                <Bar dataKey="sales" fill="url(#colorSales)" radius={[6, 6, 0, 0]} barSize={24} animationDuration={1500} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Right Sidebar Stack */}
        <div className="space-y-8">
          {/* Notifications */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-gradient-to-br from-slate-900 to-slate-800 p-8 rounded-[3rem] border border-slate-700 shadow-premium relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full blur-3xl" />
            <div className="flex justify-between items-center mb-6 relative z-10">
              <h3 className="text-lg font-black text-white uppercase tracking-tight flex items-center gap-2">
                <Bell className="w-5 h-5 text-primary" /> Live Alerts
              </h3>
            </div>
            <div className="space-y-4 relative z-10">
              {demoNotifications.map((note) => (
                <div key={note.id} className="flex gap-4 items-start bg-slate-800/50 p-4 rounded-2xl border border-slate-700/50 backdrop-blur-md">
                  <div className={`mt-1 ${note.color}`}>
                    <note.icon className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-200">{note.text}</p>
                    <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mt-1">{note.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Recent Orders Sidepanel */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white/80 backdrop-blur-xl dark:bg-slate-900/80 p-8 rounded-[3rem] border border-slate-100 dark:border-slate-800 shadow-premium"
          >
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Recent Orders</h3>
              <button onClick={() => navigate('/pharmacy/orders')} className="text-[10px] font-black text-pharmacy uppercase tracking-widest hover:underline bg-pharmacy/10 px-3 py-1.5 rounded-full">View All</button>
            </div>
            
            <div className="space-y-4">
              {recentOrders.map((order, i) => (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 + (i * 0.1) }}
                  key={order._id} 
                  className="flex items-center gap-4 group cursor-pointer p-3 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors" 
                  onClick={() => navigate('/pharmacy/orders')}
                >
                  <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center text-slate-400 group-hover:text-pharmacy group-hover:bg-pharmacy/10 transition-all shadow-sm">
                    <ShoppingBag className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-tight">{order.trackingId}</h4>
                    <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">{order.patientName}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-black text-slate-900 dark:text-white leading-none">₹{order.totalAmount}</p>
                    <p className={`text-[8px] font-bold uppercase tracking-widest mt-1 ${order.status === 'delivered' ? 'text-emerald-500' : 'text-amber-500'}`}>{order.status}</p>
                  </div>
                </motion.div>
              ))}
              {recentOrders.length === 0 && (
                <p className="text-center text-slate-400 text-[10px] font-bold uppercase tracking-widest py-10">No recent orders</p>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default PharmacyDashboard;
