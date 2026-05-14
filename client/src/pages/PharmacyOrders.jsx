import React, { useState, useEffect } from 'react';
import { 
  ClipboardList, Search, Filter, Loader2, 
  MapPin, Phone, Calendar, Clock, 
  CheckCircle2, XCircle, Truck, PackageCheck,
  ChevronRight, ExternalLink, Download, FileText
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { medicineOrderAPI } from '../services/api';
import toast from 'react-hot-toast';

const PharmacyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const { data } = await medicineOrderAPI.getPharmacyOrders();
      setOrders(data);
    } catch (err) {
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      await medicineOrderAPI.updateStatus(orderId, { status: newStatus });
      toast.success(`Order marked as ${newStatus.replace('-', ' ')}`);
      fetchOrders();
      if (selectedOrder?._id === orderId) {
        setSelectedOrder(prev => ({ ...prev, status: newStatus }));
      }
    } catch (err) {
      toast.error("Status update failed");
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = (order.trackingId?.toLowerCase() || '').includes(search.toLowerCase()) || 
                          (order.patientName?.toLowerCase() || '').includes(search.toLowerCase());
    const matchesFilter = filter === 'all' || order.status === filter;
    return matchesSearch && matchesFilter;
  });

  const getStatusStyle = (status) => {
    switch (status) {
      case 'pending': return 'bg-amber-100 text-amber-600';
      case 'accepted': return 'bg-blue-100 text-blue-600';
      case 'preparing': return 'bg-indigo-100 text-indigo-600';
      case 'out-for-delivery': return 'bg-purple-100 text-purple-600';
      case 'delivered': return 'bg-emerald-100 text-emerald-600';
      case 'cancelled': return 'bg-red-100 text-red-600';
      default: return 'bg-slate-100 text-slate-600';
    }
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight flex items-center gap-4">
            Order <span className="text-pharmacy">Management</span>
            <div className="flex items-center gap-2 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[8px] font-black uppercase tracking-widest text-emerald-600 dark:text-emerald-400">Live</span>
            </div>
          </h1>
          <p className="text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest text-[10px] mt-1">
            Track and process medicine deliveries
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 bg-white/80 backdrop-blur-xl dark:bg-slate-900/80 p-1.5 rounded-2xl shadow-premium border border-slate-100 dark:border-slate-800">
          {['all', 'pending', 'preparing', 'out-for-delivery', 'delivered'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${filter === f ? 'bg-pharmacy text-white shadow-lg shadow-pharmacy/20 scale-105' : 'text-slate-400 hover:text-pharmacy hover:bg-pharmacy/5'}`}
            >
              {f.replace('-', ' ')}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 relative z-10">
        {/* Order List */}
        <div className="flex-[1.5] space-y-4">
          <div className="relative group mb-6">
            <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-pharmacy transition-colors" />
            <input 
              type="text" 
              placeholder="Search by Order ID or Patient..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white/80 backdrop-blur-xl dark:bg-slate-900/80 border border-slate-100 dark:border-slate-800 rounded-2xl pl-10 pr-4 py-4 focus:ring-2 focus:ring-pharmacy/20 outline-none transition-all text-sm font-bold shadow-sm"
            />
          </div>

          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-white dark:bg-slate-900 p-6 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 animate-pulse flex justify-between items-center">
                  <div className="flex gap-4 items-center">
                    <div className="w-14 h-14 bg-slate-200 dark:bg-slate-800 rounded-2xl" />
                    <div className="space-y-2">
                      <div className="h-4 w-32 bg-slate-200 dark:bg-slate-800 rounded" />
                      <div className="h-3 w-20 bg-slate-200 dark:bg-slate-800 rounded" />
                    </div>
                  </div>
                  <div className="space-y-2 text-right">
                    <div className="h-5 w-16 bg-slate-200 dark:bg-slate-800 rounded ml-auto" />
                    <div className="h-4 w-24 bg-slate-200 dark:bg-slate-800 rounded ml-auto" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredOrders.length > 0 ? (
            <div className="space-y-4">
              {filteredOrders.map((order, i) => (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05, type: 'spring' }}
                  key={order._id}
                  layoutId={order._id}
                  onClick={() => setSelectedOrder(order)}
                  className={`bg-white/90 backdrop-blur-md dark:bg-slate-900/90 p-6 rounded-[2.5rem] border transition-all cursor-pointer group shadow-premium ${
                    selectedOrder?._id === order._id ? 'border-pharmacy shadow-2xl ring-4 ring-pharmacy/10 scale-[1.02]' : 'border-slate-100 dark:border-slate-800 hover:border-pharmacy/30 hover:shadow-xl hover:-translate-y-1'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex gap-4">
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg transition-transform group-hover:scale-110 group-hover:rotate-3 ${getStatusStyle(order.status)}`}>
                        <ClipboardList className="w-7 h-7" />
                      </div>
                      <div>
                        <h4 className="font-black text-slate-900 dark:text-white uppercase tracking-tight">{order.trackingId}</h4>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{order.patientName}</p>
                        <div className="flex items-center gap-3 mt-2 text-[8px] font-black uppercase tracking-widest text-slate-500">
                          <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {new Date(order.createdAt).toLocaleDateString()}</span>
                          <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-black text-slate-900 dark:text-white leading-none">₹{order.totalAmount}</p>
                      <span className={`inline-block mt-2 px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest ${getStatusStyle(order.status)}`}>
                        {order.status.replace('-', ' ')}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
              className="bg-white/80 backdrop-blur-md dark:bg-slate-900/80 rounded-[3rem] p-16 text-center border border-slate-100 dark:border-slate-800 shadow-premium"
            >
              <PackageCheck className="w-16 h-16 text-slate-200 mx-auto mb-6" />
              <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">No Orders Found</h3>
              <p className="text-slate-400 text-xs font-bold mt-2 uppercase tracking-widest">We couldn't find any orders matching your criteria</p>
            </motion.div>
          )}
        </div>

        {/* Order Details Panel */}
        <div className="flex-1">
          <AnimatePresence mode="wait">
            {selectedOrder ? (
              <motion.div
                key={selectedOrder._id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="bg-white dark:bg-slate-900 rounded-[3rem] border border-slate-100 dark:border-slate-800 shadow-premium overflow-hidden sticky top-8"
              >
                <div className="p-8 border-b border-slate-50 dark:border-slate-800 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-pharmacy/10 rounded-full blur-3xl" />
                  <div className="flex justify-between items-start mb-6 relative z-10">
                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm ${getStatusStyle(selectedOrder.status)}`}>
                      {selectedOrder.status.replace('-', ' ')}
                    </span>
                    <button onClick={() => setSelectedOrder(null)} className="p-2 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-colors">
                      <XCircle className="w-6 h-6 text-slate-300" />
                    </button>
                  </div>
                  <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight leading-none mb-2 relative z-10">{selectedOrder.trackingId}</h2>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] relative z-10">Patient Medical Order Details</p>
                </div>

                <div className="p-8 space-y-8 overflow-y-auto max-h-[60vh] custom-scrollbar">
                  {/* Patient Info */}
                  <div className="grid grid-cols-2 gap-4 p-6 bg-slate-50 dark:bg-slate-800/50 rounded-3xl border border-slate-100 dark:border-slate-800">
                    <div>
                      <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Patient</p>
                      <p className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight">{selectedOrder.patientName}</p>
                    </div>
                    <div>
                      <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Contact</p>
                      <p className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight flex items-center gap-2">
                        <Phone className="w-3 h-3 text-pharmacy" /> {selectedOrder.patientPhone}
                      </p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Delivery Address</p>
                      <p className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-tight flex items-start gap-2">
                        <MapPin className="w-3 h-3 text-red-500 mt-0.5 shrink-0" /> {selectedOrder.deliveryAddress}
                      </p>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="space-y-4">
                    <h5 className="text-[10px] font-black text-slate-900 dark:text-white uppercase tracking-widest px-2">Order Items</h5>
                    <div className="space-y-3">
                      {selectedOrder.items.map((item, i) => (
                        <div key={i} className="flex justify-between items-center p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
                          <div>
                            <p className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-tight">{item.name}</p>
                            <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Qty: {item.quantity} • ₹{item.price}/unit</p>
                          </div>
                          <p className="text-sm font-black text-slate-900 dark:text-white">₹{item.price * item.quantity}</p>
                        </div>
                      ))}
                    </div>
                    <div className="flex justify-between items-center px-4 pt-4 border-t border-slate-50 dark:border-slate-800">
                      <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Total Amount</p>
                      <p className="text-2xl font-black text-pharmacy tracking-tighter">₹{selectedOrder.totalAmount}</p>
                    </div>
                  </div>

                  {/* Prescription */}
                  {selectedOrder.prescriptionImage && (
                    <div className="space-y-4">
                      <h5 className="text-[10px] font-black text-slate-900 dark:text-white uppercase tracking-widest px-2">Clinical Prescription</h5>
                      <a href={selectedOrder.prescriptionImage} target="_blank" rel="noreferrer" className="block relative group overflow-hidden rounded-3xl border border-slate-100 dark:border-slate-800 shadow-lg">
                        <img src={selectedOrder.prescriptionImage} alt="Prescription" className="w-full h-40 object-cover group-hover:scale-110 transition-transform duration-500" />
                        <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <span className="text-[10px] font-black text-white uppercase tracking-widest flex items-center gap-2">
                            View Full Document <ExternalLink className="w-3 h-3" />
                          </span>
                        </div>
                      </a>
                    </div>
                  )}

                  {/* Quick Actions */}
                  <div className="space-y-3 pt-4">
                    {selectedOrder.status === 'pending' && (
                      <button 
                        onClick={() => handleStatusUpdate(selectedOrder._id, 'preparing')}
                        className="w-full py-4 bg-pharmacy text-white rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-lg shadow-pharmacy/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
                      >
                        <CheckCircle2 className="w-4 h-4" /> Accept & Start Preparing
                      </button>
                    )}
                    {selectedOrder.status === 'preparing' && (
                      <button 
                        onClick={() => handleStatusUpdate(selectedOrder._id, 'out-for-delivery')}
                        className="w-full py-4 bg-indigo-500 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-lg shadow-indigo-500/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
                      >
                        <Truck className="w-4 h-4" /> Dispatch Order
                      </button>
                    )}
                    {selectedOrder.status === 'out-for-delivery' && (
                      <button 
                        onClick={() => handleStatusUpdate(selectedOrder._id, 'delivered')}
                        className="w-full py-4 bg-emerald-500 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-lg shadow-emerald-500/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
                      >
                        <PackageCheck className="w-4 h-4" /> Mark as Delivered
                      </button>
                    )}
                    {['pending', 'preparing'].includes(selectedOrder.status) && (
                      <button 
                        onClick={() => handleStatusUpdate(selectedOrder._id, 'cancelled')}
                        className="w-full py-4 bg-red-50 text-red-500 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-red-500 hover:text-white transition-all flex items-center justify-center gap-2"
                      >
                        <XCircle className="w-4 h-4" /> Cancel Order
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center p-12 text-center bg-slate-50 dark:bg-slate-900/50 rounded-[3rem] border-2 border-dashed border-slate-200 dark:border-slate-800">
                <div className="w-20 h-20 bg-white dark:bg-slate-900 rounded-3xl flex items-center justify-center text-slate-300 shadow-xl mb-6">
                  <FileText className="w-10 h-10" />
                </div>
                <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Select an Order</h3>
                <p className="text-slate-400 text-xs font-bold mt-2 uppercase tracking-widest leading-relaxed">Choose an order from the list to view full patient details, items, and prescription.</p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default PharmacyOrders;
