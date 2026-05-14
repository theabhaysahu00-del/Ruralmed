import React, { useState, useEffect } from 'react';
import { 
  Users, Search, Phone, Mail, 
  MapPin, ShoppingBag, Calendar, 
  ChevronRight, MessageSquare, Star,
  Loader2, Filter, User
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { medicineOrderAPI } from '../services/api';
import toast from 'react-hot-toast';

const PharmacyCustomers = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const { data } = await medicineOrderAPI.getPharmacyOrders();
      // Aggregate unique customers from orders
      const customerMap = new Map();
      data.forEach(order => {
        const id = order.patientId?._id;
        if (!id) return;
        
        if (!customerMap.has(id)) {
          customerMap.set(id, {
            id,
            name: order.patientName,
            phone: order.patientPhone,
            address: order.deliveryAddress,
            orderCount: 0,
            totalSpent: 0,
            lastOrder: order.createdAt,
            orders: []
          });
        }
        
        const c = customerMap.get(id);
        c.orderCount += 1;
        c.totalSpent += order.totalAmount;
        if (new Date(order.createdAt) > new Date(c.lastOrder)) {
          c.lastOrder = order.createdAt;
        }
        c.orders.push(order);
      });
      
      setCustomers(Array.from(customerMap.values()));
    } catch (err) {
      toast.error("Failed to load customers");
    } finally {
      setLoading(false);
    }
  };

  const filteredCustomers = customers.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.phone.includes(search)
  );

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
            Our <span className="text-pharmacy">Customers</span>
          </h1>
          <p className="text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest text-[10px] mt-1">
            Patient engagement and order history
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative group">
            <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-pharmacy transition-colors" />
            <input 
              type="text" 
              placeholder="Search patients..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl pl-10 pr-4 py-3 w-64 focus:ring-2 focus:ring-pharmacy/20 outline-none transition-all text-sm font-bold shadow-sm"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Customer List */}
        <div className="lg:col-span-2 space-y-4 relative z-10">
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white dark:bg-slate-900 p-6 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 animate-pulse flex justify-between items-center">
                  <div className="flex items-center gap-5">
                    <div className="w-16 h-16 rounded-[1.5rem] bg-slate-200 dark:bg-slate-800" />
                    <div className="space-y-2">
                      <div className="h-4 w-32 bg-slate-200 dark:bg-slate-800 rounded" />
                      <div className="h-3 w-40 bg-slate-200 dark:bg-slate-800 rounded mt-2" />
                    </div>
                  </div>
                  <div className="h-6 w-6 bg-slate-200 dark:bg-slate-800 rounded-full" />
                </div>
              ))}
            </div>
          ) : filteredCustomers.length > 0 ? (
            filteredCustomers.map((c, i) => (
              <motion.div
                key={c.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05, type: 'spring' }}
                onClick={() => setSelectedCustomer(c)}
                className={`bg-white/90 backdrop-blur-md dark:bg-slate-900/90 p-6 rounded-[2.5rem] border transition-all cursor-pointer shadow-premium group hover:-translate-y-1 ${
                  selectedCustomer?.id === c.id ? 'border-pharmacy ring-4 ring-pharmacy/10 scale-[1.02]' : 'border-slate-100 dark:border-slate-800 hover:border-pharmacy/30 hover:shadow-xl'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-5">
                    <div className="w-16 h-16 rounded-[1.5rem] bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400 group-hover:bg-pharmacy group-hover:text-white transition-all shadow-lg overflow-hidden group-hover:scale-105 group-hover:rotate-3">
                      <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${c.name}`} alt="" className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <h3 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight">{c.name}</h3>
                      <div className="flex items-center gap-4 mt-1">
                        <span className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                          <ShoppingBag className="w-3 h-3 text-pharmacy" /> {c.orderCount} Orders
                        </span>
                        <span className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                          <Star className="w-3 h-3 text-amber-500" /> Frequent
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right flex flex-col items-end gap-2">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Last Order: {new Date(c.lastOrder).toLocaleDateString()}</p>
                    <ChevronRight className={`w-5 h-5 transition-transform ${selectedCustomer?.id === c.id ? 'rotate-90 text-pharmacy' : 'text-slate-300 group-hover:text-pharmacy group-hover:translate-x-1'}`} />
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="bg-white dark:bg-slate-900 rounded-[3rem] p-16 text-center border border-slate-100 dark:border-slate-800 shadow-premium">
              <Users className="w-16 h-16 text-slate-200 mx-auto mb-6" />
              <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">No Customers Found</h3>
              <p className="text-slate-400 text-xs font-bold mt-2 uppercase tracking-widest">Start processing orders to see your patient base here</p>
            </div>
          )}
        </div>

        {/* Detail Panel */}
        <div className="relative">
          <AnimatePresence mode="wait">
            {selectedCustomer ? (
              <motion.div
                key={selectedCustomer.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-white dark:bg-slate-900 rounded-[3rem] border border-slate-100 dark:border-slate-800 shadow-premium overflow-hidden sticky top-8"
              >
                <div className="p-8 border-b border-slate-50 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 flex flex-col items-center text-center">
                  <div className="w-24 h-24 rounded-[2rem] border-4 border-white dark:border-slate-900 shadow-2xl overflow-hidden mb-6">
                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${selectedCustomer.name}`} alt="" className="w-full h-full object-cover" />
                  </div>
                  <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">{selectedCustomer.name}</h2>
                  <p className="text-[10px] font-black text-pharmacy uppercase tracking-widest mt-1">Patient Since {new Date(selectedCustomer.orders[selectedCustomer.orders.length-1].createdAt).getFullYear()}</p>
                </div>

                <div className="p-8 space-y-8">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800">
                      <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Revenue</p>
                      <p className="text-xl font-black text-slate-900 dark:text-white tracking-tight">₹{selectedCustomer.totalSpent}</p>
                    </div>
                    <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800">
                      <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Orders</p>
                      <p className="text-xl font-black text-slate-900 dark:text-white tracking-tight">{selectedCustomer.orderCount}</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-[10px] font-black text-slate-900 dark:text-white uppercase tracking-widest px-2">Contact Info</h4>
                    <div className="space-y-3">
                      <div className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl">
                        <Phone className="w-4 h-4 text-slate-400" />
                        <span className="text-xs font-bold text-slate-600 dark:text-slate-400">{selectedCustomer.phone}</span>
                      </div>
                      <div className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl">
                        <MapPin className="w-4 h-4 text-slate-400" />
                        <span className="text-xs font-bold text-slate-600 dark:text-slate-400 leading-tight">{selectedCustomer.address}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-[10px] font-black text-slate-900 dark:text-white uppercase tracking-widest px-2">Recent Orders</h4>
                    <div className="space-y-3">
                      {selectedCustomer.orders.slice(0, 3).map((order) => (
                        <div key={order._id} className="p-4 border border-slate-100 dark:border-slate-800 rounded-2xl flex justify-between items-center group hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all">
                          <div>
                            <p className="text-[10px] font-black text-slate-900 dark:text-white uppercase tracking-tight">{order.trackingId}</p>
                            <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">{new Date(order.createdAt).toLocaleDateString()}</p>
                          </div>
                          <span className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest bg-emerald-100 text-emerald-600`}>
                            {order.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <button className="w-full py-5 bg-slate-900 dark:bg-slate-800 text-white rounded-[2rem] font-black uppercase tracking-widest text-[10px] shadow-xl hover:scale-105 transition-all flex items-center justify-center gap-3">
                    <MessageSquare className="w-4 h-4" /> Send Notification
                  </button>
                </div>
              </motion.div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center p-12 text-center bg-slate-50 dark:bg-slate-900/50 rounded-[3rem] border-2 border-dashed border-slate-200 dark:border-slate-800 py-32">
                <Users className="w-12 h-12 text-slate-200 mb-4" />
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Select a customer for details</p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default PharmacyCustomers;
