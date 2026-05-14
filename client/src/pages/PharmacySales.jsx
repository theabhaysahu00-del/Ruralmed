import React, { useState, useEffect } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  LineChart, Line, PieChart, Pie, Cell, AreaChart, Area 
} from 'recharts';
import { 
  TrendingUp, TrendingDown, DollarSign, ShoppingBag, 
  Users, Activity, Calendar, Download, Filter,
  ArrowUpRight, ArrowDownRight, IndianRupee
} from 'lucide-react';
import { motion } from 'framer-motion';
import { medicineOrderAPI } from '../services/api';
import toast from 'react-hot-toast';

const AnimatedCounter = ({ value, prefix = '' }) => {
  const [count, setCount] = useState(0);
  const numericValue = typeof value === 'string' ? parseFloat(value.replace(/[^0-9.-]+/g,"")) : value;

  useEffect(() => {
    let start = 0;
    const end = numericValue;
    if (start === end) {
      setCount(end);
      return;
    }
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

const PharmacySales = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('7d');

  useEffect(() => {
    fetchSalesData();
  }, [timeRange]);

  const fetchSalesData = async () => {
    setLoading(true);
    try {
      const { data } = await medicineOrderAPI.getPharmacyStats();
      setStats(data);
    } catch (err) {
      toast.error("Failed to load sales analytics");
    } finally {
      setLoading(false);
    }
  };

  const COLORS = ['#22C55E', '#3B82F6', '#F59E0B', '#EF4444', '#8B5CF6'];

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] space-y-4">
        <div className="w-12 h-12 border-4 border-pharmacy/20 border-t-pharmacy rounded-full animate-spin" />
        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 animate-pulse">Analyzing Market Data...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12 relative">
      {/* Background Glows */}
      <div className="absolute top-0 left-0 w-full h-[300px] bg-gradient-to-b from-pharmacy/5 to-transparent pointer-events-none rounded-t-3xl" />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
            Sales <span className="text-pharmacy">Analytics</span>
          </h1>
          <p className="text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest text-[10px] mt-1">
            Revenue tracking and growth insights
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-white/80 backdrop-blur-xl dark:bg-slate-900/80 p-1 rounded-xl border border-slate-100 dark:border-slate-800 flex gap-1 shadow-sm">
            {['24h', '7d', '30d', '1y'].map(range => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase transition-all ${timeRange === range ? 'bg-pharmacy text-white shadow-lg shadow-pharmacy/20' : 'text-slate-400 hover:text-pharmacy'}`}
              >
                {range}
              </button>
            ))}
          </div>
          <button className="p-3 bg-white/80 backdrop-blur-xl dark:bg-slate-900/80 rounded-xl border border-slate-100 dark:border-slate-800 text-slate-400 hover:text-pharmacy transition-all shadow-premium hover:shadow-xl hover:-translate-y-0.5">
            <Download className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
        {[
          { label: 'Gross Revenue', value: stats?.totalRevenue || 0, prefix: '₹', icon: IndianRupee, trend: '+12.5%', up: true, color: 'text-emerald-500', bg: 'bg-emerald-500/10', glow: 'bg-emerald-500' },
          { label: 'Total Orders', value: stats?.totalOrders || 0, icon: ShoppingBag, trend: '+8.2%', up: true, color: 'text-blue-500', bg: 'bg-blue-500/10', glow: 'bg-blue-500' },
          { label: 'Avg Order Value', value: stats?.totalOrders ? (stats.totalRevenue / stats.totalOrders).toFixed(0) : 0, prefix: '₹', icon: TrendingUp, trend: '-2.4%', up: false, color: 'text-amber-500', bg: 'bg-amber-500/10', glow: 'bg-amber-500' },
          { label: 'Customer Growth', value: 42, prefix: '+', icon: Users, trend: '+18%', up: true, color: 'text-purple-500', bg: 'bg-purple-500/10', glow: 'bg-purple-500' },
        ].map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1, type: 'spring' }}
            className="bg-white/90 backdrop-blur-md dark:bg-slate-900/90 p-6 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-premium group hover:shadow-2xl hover:-translate-y-1 transition-all relative overflow-hidden"
          >
            <div className={`absolute -right-10 -top-10 w-32 h-32 ${stat.glow} rounded-full blur-3xl opacity-10 group-hover:opacity-20 transition-opacity`} />
            <div className={`${stat.bg} ${stat.color} w-12 h-12 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-6 transition-all relative z-10`}>
              <stat.icon className="w-6 h-6" />
            </div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 relative z-10">{stat.label}</p>
            <div className="flex items-end justify-between relative z-10">
              <h3 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter">
                <AnimatedCounter value={stat.value} prefix={stat.prefix} />
              </h3>
              <div className={`flex items-center text-[10px] font-bold ${stat.up ? 'text-emerald-500' : 'text-red-500'}`}>
                {stat.up ? <ArrowUpRight className="w-3 h-3 mr-0.5" /> : <ArrowDownRight className="w-3 h-3 mr-0.5" />}
                {stat.trend}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Revenue Chart */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-8 rounded-[3rem] border border-slate-100 dark:border-slate-800 shadow-premium">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Revenue Forecast</h3>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Earnings timeline for selected period</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-pharmacy" />
                <span className="text-[10px] font-bold text-slate-400 uppercase">Revenue</span>
              </div>
            </div>
          </div>

          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats?.revenueByDate || []}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22C55E" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#22C55E" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="_id" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fontWeight: 700, fill: '#94A3B8' }} 
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fontWeight: 700, fill: '#94A3B8' }} 
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '16px', color: '#fff', fontSize: '10px', fontWeight: 900 }}
                  cursor={{ stroke: '#22C55E', strokeWidth: 2 }}
                />
                <Area type="monotone" dataKey="dailyRevenue" stroke="#22C55E" strokeWidth={4} fillOpacity={1} fill="url(#colorRev)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Sales by Category */}
        <div className="bg-white dark:bg-slate-900 p-8 rounded-[3rem] border border-slate-100 dark:border-slate-800 shadow-premium flex flex-col">
          <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight mb-2">Category Split</h3>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-8">Most sold medicine types</p>
          
          <div className="flex-1 min-h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={[
                    { name: 'Tablets', value: 45 },
                    { name: 'Syrups', value: 25 },
                    { name: 'Injections', value: 15 },
                    { name: 'Ointments', value: 15 },
                  ]}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {[0, 1, 2, 3].map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-3 mt-4">
            {['Tablets', 'Syrups', 'Injections', 'Ointments'].map((cat, i) => (
              <div key={cat} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[i] }} />
                  <span className="text-[10px] font-black text-slate-700 dark:text-slate-300 uppercase tracking-widest">{cat}</span>
                </div>
                <span className="text-[10px] font-black text-slate-900 dark:text-white">{(45 - i * 10)}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Products Table */}
      <div className="bg-white dark:bg-slate-900 rounded-[3rem] border border-slate-100 dark:border-slate-800 shadow-premium overflow-hidden">
        <div className="p-8 border-b border-slate-50 dark:border-slate-800 flex justify-between items-center">
          <div>
            <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Best Selling Medicines</h3>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Products driving the most volume</p>
          </div>
          <button className="text-[10px] font-black text-pharmacy uppercase tracking-widest hover:underline transition-all">View Inventory</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/50">
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Product</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Orders</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Stock Status</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Revenue</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Growth</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
              {[
                { name: 'Paracetamol 650mg', orders: 124, stock: 150, revenue: '₹1,860', growth: '+15.2%', status: 'In Stock' },
                { name: 'Amoxicillin 500mg', orders: 86, stock: 80, revenue: '₹3,870', growth: '+22.4%', status: 'In Stock' },
                { name: 'Azithromycin 500mg', orders: 54, stock: 5, revenue: '₹4,050', growth: '-5.1%', status: 'Low Stock' },
                { name: 'Cough Syrup', orders: 42, stock: 40, revenue: '₹5,040', growth: '+12.8%', status: 'In Stock' },
              ].map((prod, i) => (
                <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                  <td className="px-8 py-6">
                    <p className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight">{prod.name}</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Healthcare Pharma</p>
                  </td>
                  <td className="px-8 py-6 text-sm font-black text-slate-700 dark:text-slate-300">{prod.orders}</td>
                  <td className="px-8 py-6">
                    <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest ${prod.status === 'Low Stock' ? 'bg-amber-100 text-amber-600' : 'bg-emerald-100 text-emerald-600'}`}>
                      {prod.status}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-sm font-black text-slate-900 dark:text-white">{prod.revenue}</td>
                  <td className="px-8 py-6">
                    <div className={`flex items-center gap-1 text-[10px] font-bold ${prod.growth.startsWith('+') ? 'text-emerald-500' : 'text-red-500'}`}>
                      {prod.growth.startsWith('+') ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                      {prod.growth}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PharmacySales;
