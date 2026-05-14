import React, { useState, useEffect } from 'react';
import { 
  ShoppingBag, Search, Filter, Loader2, 
  MapPin, Clock, Calendar, CheckCircle2,
  XCircle, Truck, Package, Info, ChevronRight,
  ExternalLink, IndianRupee, FileText
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { medicineOrderAPI } from '../services/api';
import toast from 'react-hot-toast';

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const { data } = await medicineOrderAPI.getPatientOrders();
      setOrders(data);
    } catch (err) {
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  const filteredOrders = orders.filter(order => 
    (order.trackingId?.toLowerCase() || '').includes(search.toLowerCase()) ||
    (order.pharmacyId?.name?.toLowerCase() || '').includes(search.toLowerCase())
  );

  const getStatusStyle = (status) => {
    switch (status) {
      case 'pending': return 'bg-amber-100 text-amber-600';
      case 'preparing': return 'bg-indigo-100 text-indigo-600';
      case 'out-for-delivery': return 'bg-purple-100 text-purple-600';
      case 'delivered': return 'bg-emerald-100 text-emerald-600';
      case 'cancelled': return 'bg-red-100 text-red-600';
      default: return 'bg-slate-100 text-slate-600';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return <Clock className="w-5 h-5" />;
      case 'preparing': return <Package className="w-5 h-5" />;
      case 'out-for-delivery': return <Truck className="w-5 h-5" />;
      case 'delivered': return <CheckCircle2 className="w-5 h-5" />;
      case 'cancelled': return <XCircle className="w-5 h-5" />;
      default: return <Info className="w-5 h-5" />;
    }
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
            My <span className="text-pharmacy">Orders</span>
          </h1>
          <p className="text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest text-[10px] mt-1">
            Track your medicine delivery status
          </p>
        </div>

        <div className="relative group">
          <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-pharmacy transition-colors" />
          <input 
            type="text" 
            placeholder="Search by Order ID..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl pl-10 pr-4 py-3 w-64 focus:ring-2 focus:ring-pharmacy/20 outline-none transition-all text-sm font-bold shadow-sm"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Order List */}
        <div className="lg:col-span-2 space-y-4">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="w-10 h-10 text-pharmacy animate-spin mb-4" />
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Tracking Orders...</p>
            </div>
          ) : filteredOrders.length > 0 ? (
            filteredOrders.map((order) => (
              <motion.div
                key={order._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                onClick={() => setSelectedOrder(order)}
                className={`bg-white dark:bg-slate-900 p-6 rounded-[2.5rem] border transition-all cursor-pointer shadow-premium group ${
                  selectedOrder?._id === order._id ? 'border-pharmacy ring-4 ring-pharmacy/5' : 'border-slate-100 dark:border-slate-800 hover:border-pharmacy/20'
                }`}
              >
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-5">
                    <div className={`w-16 h-16 rounded-[1.5rem] flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform ${getStatusStyle(order.status)}`}>
                      {getStatusIcon(order.status)}
                    </div>
                    <div>
                      <h4 className="font-black text-slate-900 dark:text-white uppercase tracking-tight">{order.trackingId}</h4>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest flex items-center gap-2">
                        {order.pharmacyId?.name} • {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                      <span className={`inline-block mt-2 px-3 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest ${getStatusStyle(order.status)}`}>
                        {order.status.replace('-', ' ')}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-black text-slate-900 dark:text-white tracking-tighter">₹{order.totalAmount}</p>
                    <ChevronRight className="w-5 h-5 text-slate-300 ml-auto mt-2 group-hover:text-pharmacy transition-colors" />
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="bg-white dark:bg-slate-900 rounded-[3rem] p-16 text-center border border-slate-100 dark:border-slate-800 shadow-premium">
              <ShoppingBag className="w-16 h-16 text-slate-200 mx-auto mb-6" />
              <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">No Orders Yet</h3>
              <p className="text-slate-400 text-xs font-bold mt-2 uppercase tracking-widest">Your medical delivery history will appear here</p>
            </div>
          )}
        </div>

        {/* Details Panel */}
        <div className="relative">
          <AnimatePresence mode="wait">
            {selectedOrder ? (
              <motion.div
                key={selectedOrder._id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="bg-white dark:bg-slate-900 rounded-[3rem] border border-slate-100 dark:border-slate-800 shadow-premium overflow-hidden sticky top-8"
              >
                <div className="p-8 border-b border-slate-50 dark:border-slate-800">
                  <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight mb-1">Order Summary</h2>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{selectedOrder.trackingId}</p>
                </div>

                <div className="p-8 space-y-6">
                  {/* Status Timeline */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${getStatusStyle(selectedOrder.status)}`}>
                        {getStatusIcon(selectedOrder.status)}
                      </div>
                      <div>
                        <p className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-tight">
                          Current Status: {selectedOrder.status.replace('-', ' ')}
                        </p>
                        <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Updated on {new Date(selectedOrder.updatedAt).toLocaleString()}</p>
                      </div>
                    </div>
                  </div>

                  {/* Items */}
                  <div className="space-y-3">
                    <p className="text-[10px] font-black text-slate-900 dark:text-white uppercase tracking-widest mb-2 px-2">Order Items</p>
                    {selectedOrder.items.map((item, i) => (
                      <div key={i} className="flex justify-between items-center p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800">
                        <p className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-tight">{item.name} x {item.quantity}</p>
                        <p className="text-xs font-black text-slate-900 dark:text-white">₹{item.price * item.quantity}</p>
                      </div>
                    ))}
                  </div>

                  {/* Delivery Info */}
                  <div className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-3xl border border-slate-100 dark:border-slate-800">
                    <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-2">Delivery to</p>
                    <p className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-tight flex items-start gap-2">
                      <MapPin className="w-3 h-3 text-red-500 mt-0.5 shrink-0" /> {selectedOrder.deliveryAddress}
                    </p>
                  </div>

                  <div className="flex justify-between items-center pt-4 border-t border-slate-50 dark:border-slate-800 px-2">
                    <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Paid Amount</p>
                    <p className="text-2xl font-black text-pharmacy tracking-tighter">₹{selectedOrder.totalAmount}</p>
                  </div>
                </div>
              </motion.div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center p-12 text-center bg-slate-50 dark:bg-slate-900/50 rounded-[3rem] border-2 border-dashed border-slate-200 dark:border-slate-800 py-32">
                <Package className="w-12 h-12 text-slate-200 mb-4" />
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Select an order for details</p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default MyOrders;
