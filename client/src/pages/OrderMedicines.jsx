import React, { useState, useEffect } from 'react';
import { 
  Search, ShoppingCart, ShoppingBag, Loader2, 
  Plus, Minus, X, Check, MapPin, Phone, 
  Upload, FileText, IndianRupee, AlertCircle,
  Package, ChevronRight, Store, Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { medicineAPI, medicineOrderAPI } from '../services/api';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

const OrderMedicines = () => {
  const { user } = useAuth();
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [cart, setCart] = useState([]);
  const [showCheckout, setShowCheckout] = useState(false);
  const [isOrdering, setIsOrdering] = useState(false);

  // Checkout form
  const [checkoutData, setCheckoutData] = useState({
    deliveryAddress: user?.village || '',
    patientPhone: user?.phone || '',
    patientName: user?.name || ''
  });
  const [prescription, setPrescription] = useState(null);

  useEffect(() => {
    fetchMedicines();
  }, []);

  const fetchMedicines = async () => {
    setLoading(true);
    try {
      const { data } = await medicineAPI.getPublic();
      setMedicines(data);
    } catch (err) {
      toast.error("Failed to load medicines");
    } finally {
      setLoading(false);
    }
  };

  const addToCart = (med) => {
    const existing = cart.find(item => item.medicineId === med._id);
    if (existing) {
      if (existing.quantity >= med.stock) {
        toast.error("Max stock reached");
        return;
      }
      setCart(cart.map(item => 
        item.medicineId === med._id ? { ...item, quantity: item.quantity + 1 } : item
      ));
    } else {
      if (cart.length > 0 && cart[0].pharmacyId !== med.pharmacy?._id) {
        if (!window.confirm("You already have items from another pharmacy. Clear cart to add this?")) return;
        setCart([{
          medicineId: med._id,
          name: med.name,
          price: med.price,
          quantity: 1,
          pharmacyId: med.pharmacy?._id,
          requiresPrescription: med.requiresPrescription
        }]);
      } else {
        setCart([...cart, {
          medicineId: med._id,
          name: med.name,
          price: med.price,
          quantity: 1,
          pharmacyId: med.pharmacy?._id,
          requiresPrescription: med.requiresPrescription
        }]);
      }
    }
    toast.success(`${med.name} added to cart`);
  };

  const updateQuantity = (id, delta) => {
    setCart(cart.map(item => {
      if (item.medicineId === id) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const removeFromCart = (id) => {
    setCart(cart.filter(item => item.medicineId !== id));
  };

  const totalAmount = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const needsPrescription = cart.some(item => item.requiresPrescription);

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (needsPrescription && !prescription) {
      toast.error("Prescription required for some items");
      return;
    }
    
    setIsOrdering(true);
    const data = new FormData();
    data.append('pharmacyId', cart[0].pharmacyId);
    data.append('items', JSON.stringify(cart));
    data.append('totalAmount', totalAmount);
    data.append('deliveryAddress', checkoutData.deliveryAddress);
    data.append('patientPhone', checkoutData.patientPhone);
    data.append('patientName', checkoutData.patientName);
    if (prescription) data.append('prescription', prescription);

    try {
      await medicineOrderAPI.create(data);
      toast.success("Order placed successfully!");
      setCart([]);
      setShowCheckout(false);
    } catch (err) {
      toast.error(err.message || "Order placement failed");
    } finally {
      setIsOrdering(false);
    }
  };

  const filteredMedicines = medicines.filter(med => 
    med.name.toLowerCase().includes(search.toLowerCase()) ||
    med.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
            Order <span className="text-pharmacy">Medicines</span>
          </h1>
          <p className="text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest text-[10px] mt-1">
            Browse and purchase medicines from local pharmacies
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative group">
            <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-pharmacy transition-colors" />
            <input 
              type="text" 
              placeholder="Search medicine..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl pl-10 pr-4 py-3 w-64 focus:ring-2 focus:ring-pharmacy/20 outline-none transition-all text-sm font-bold shadow-sm"
            />
          </div>
          <button 
            onClick={() => cart.length > 0 && setShowCheckout(true)}
            className="relative bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-premium group hover:border-pharmacy/20 transition-all"
          >
            <ShoppingCart className="w-6 h-6 text-slate-400 group-hover:text-pharmacy transition-colors" />
            {cart.length > 0 && (
              <span className="absolute -top-2 -right-2 w-6 h-6 bg-pharmacy text-white rounded-full flex items-center justify-center text-[10px] font-black shadow-lg">
                {cart.length}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Main Grid */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-32 space-y-4">
          <Loader2 className="w-12 h-12 text-pharmacy animate-spin" />
          <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Browsing Inventory...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredMedicines.map((med, i) => (
            <motion.div
              key={med._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-premium overflow-hidden group hover:border-pharmacy/20 transition-all"
            >
              <div className="relative h-48 bg-slate-50 dark:bg-slate-800 overflow-hidden">
                {med.image ? (
                  <img src={med.image} alt={med.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-300">
                    <Package className="w-12 h-12" />
                  </div>
                )}
                {med.requiresPrescription && (
                  <div className="absolute top-4 right-4 bg-amber-500 text-white px-2 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest flex items-center gap-1 shadow-lg">
                    <FileText className="w-3 h-3" /> Prescription Req.
                  </div>
                )}
              </div>

              <div className="p-6">
                <div className="mb-4">
                  <p className="text-[10px] font-black text-pharmacy uppercase tracking-widest mb-1">{med.category}</p>
                  <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight truncate">{med.name}</h3>
                  <div className="flex items-center gap-2 mt-2 text-[8px] font-bold text-slate-400 uppercase tracking-widest">
                    <Store className="w-3 h-3" /> {med.pharmacy?.name} • {med.pharmacy?.village}
                  </div>
                </div>

                <div className="flex items-center justify-between mb-6">
                  <div>
                    <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Price</p>
                    <p className="text-2xl font-black text-slate-900 dark:text-white leading-none">₹{med.price}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Stock</p>
                    <p className={`text-xs font-black uppercase tracking-widest ${med.stock > 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                      {med.stock > 0 ? `${med.stock} Left` : 'Out of Stock'}
                    </p>
                  </div>
                </div>

                <button 
                  disabled={med.stock <= 0}
                  onClick={() => addToCart(med)}
                  className={`w-full py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-lg transition-all flex items-center justify-center gap-2 ${
                    med.stock > 0 ? 'bg-pharmacy text-white shadow-pharmacy/20 hover:scale-105 active:scale-95' : 'bg-slate-100 text-slate-400 shadow-none cursor-not-allowed'
                  }`}
                >
                  <ShoppingCart className="w-4 h-4" /> Add to Bag
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Checkout Sidebar/Modal */}
      <AnimatePresence>
        {showCheckout && (
          <div className="fixed inset-0 z-50 flex justify-end">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowCheckout(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="relative w-full max-w-lg bg-white dark:bg-slate-900 h-full shadow-2xl flex flex-col"
            >
              <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Your <span className="text-pharmacy">Cart</span></h2>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">{cart.length} items from {cart[0]?.pharmacyId ? medicines.find(m => m.pharmacy?._id === cart[0].pharmacyId)?.pharmacy?.name : 'Local Pharmacy'}</p>
                </div>
                <button onClick={() => setShowCheckout(false)} className="p-3 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-2xl transition-colors">
                  <X className="w-6 h-6 text-slate-300" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
                {/* Cart Items */}
                <div className="space-y-4">
                  {cart.map((item) => (
                    <div key={item.medicineId} className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 flex justify-between items-center group">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-white dark:bg-slate-900 rounded-xl flex items-center justify-center text-pharmacy shadow-sm">
                          <Package className="w-6 h-6" />
                        </div>
                        <div>
                          <h4 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight truncate max-w-[150px]">{item.name}</h4>
                          <p className="text-[10px] font-black text-pharmacy uppercase tracking-widest">₹{item.price} per unit</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2 bg-white dark:bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm">
                          <button onClick={() => updateQuantity(item.medicineId, -1)} className="text-slate-400 hover:text-pharmacy transition-colors"><Minus className="w-4 h-4" /></button>
                          <span className="text-xs font-black text-slate-900 dark:text-white w-6 text-center">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.medicineId, 1)} className="text-slate-400 hover:text-pharmacy transition-colors"><Plus className="w-4 h-4" /></button>
                        </div>
                        <button onClick={() => removeFromCart(item.medicineId)} className="p-2 text-slate-300 hover:text-red-500 transition-colors">
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Prescription Warning */}
                {needsPrescription && (
                  <div className="p-6 bg-amber-50 dark:bg-amber-900/10 rounded-3xl border border-amber-100 dark:border-amber-900/30 flex items-start gap-4">
                    <AlertCircle className="w-6 h-6 text-amber-500 shrink-0 mt-1" />
                    <div>
                      <p className="text-xs font-black text-amber-600 uppercase tracking-tight">Prescription Required</p>
                      <p className="text-[10px] font-bold text-amber-500 uppercase tracking-widest mt-1 leading-relaxed">Some items in your cart require a clinical prescription. Please upload it below to proceed.</p>
                      <div className="mt-4">
                        <label className="flex items-center gap-3 bg-white dark:bg-slate-900 px-4 py-3 rounded-xl border border-amber-100 dark:border-amber-900/30 cursor-pointer hover:shadow-lg transition-all">
                          <Upload className="w-4 h-4 text-amber-500" />
                          <span className="text-[10px] font-black text-slate-700 dark:text-slate-300 uppercase tracking-widest">
                            {prescription ? prescription.name : 'Upload Prescription'}
                          </span>
                          <input type="file" onChange={(e) => setPrescription(e.target.files[0])} className="hidden" />
                        </label>
                      </div>
                    </div>
                  </div>
                )}

                {/* Checkout Details */}
                <div className="space-y-6">
                  <h5 className="text-[10px] font-black text-slate-900 dark:text-white uppercase tracking-widest px-2">Delivery Details</h5>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Full Name</label>
                      <input
                        type="text"
                        value={checkoutData.patientName}
                        onChange={(e) => setCheckoutData({...checkoutData, patientName: e.target.value})}
                        className="w-full bg-slate-50 dark:bg-slate-800/50 border-none rounded-2xl px-5 py-4 text-sm font-bold outline-none focus:ring-2 focus:ring-pharmacy/20 transition-all"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Phone Number</label>
                      <input
                        type="text"
                        value={checkoutData.patientPhone}
                        onChange={(e) => setCheckoutData({...checkoutData, patientPhone: e.target.value})}
                        className="w-full bg-slate-50 dark:bg-slate-800/50 border-none rounded-2xl px-5 py-4 text-sm font-bold outline-none focus:ring-2 focus:ring-pharmacy/20 transition-all"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Delivery Address</label>
                      <textarea
                        rows="3"
                        value={checkoutData.deliveryAddress}
                        onChange={(e) => setCheckoutData({...checkoutData, deliveryAddress: e.target.value})}
                        className="w-full bg-slate-50 dark:bg-slate-800/50 border-none rounded-2xl px-5 py-4 text-sm font-bold outline-none focus:ring-2 focus:ring-pharmacy/20 transition-all resize-none"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-8 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Total to Pay</p>
                    <h3 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter">₹{totalAmount}</h3>
                  </div>
                  <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest text-right">Includes delivery<br/>and taxes</p>
                </div>
                <button 
                  disabled={isOrdering}
                  onClick={handlePlaceOrder}
                  className="w-full py-5 bg-pharmacy text-white rounded-[2rem] font-black uppercase tracking-widest text-xs shadow-xl shadow-pharmacy/20 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3"
                >
                  {isOrdering ? <Loader2 className="w-5 h-5 animate-spin" /> : <ShoppingBag className="w-5 h-5" />}
                  Confirm & Place Order
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default OrderMedicines;
