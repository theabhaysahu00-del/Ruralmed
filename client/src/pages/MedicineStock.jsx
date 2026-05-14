import React, { useState, useEffect } from 'react';
import { 
  Package, Plus, Search, Edit3, Trash2, 
  MoreVertical, Filter, Loader2, AlertTriangle,
  X, Check, Upload, Calendar, IndianRupee
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { medicineAPI } from '../services/api';
import toast from 'react-hot-toast';

const MedicineStock = () => {
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingMed, setEditingMed] = useState(null);
  const [search, setSearch] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    category: 'Tablet',
    price: '',
    stock: '',
    manufacturer: '',
    expiryDate: '',
    description: '',
    requiresPrescription: false
  });
  const [image, setImage] = useState(null);

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    setLoading(true);
    try {
      const { data } = await medicineAPI.getInventory();
      setMedicines(data);
    } catch (err) {
      toast.error("Failed to load inventory");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (med = null) => {
    if (med) {
      setEditingMed(med);
      setFormData({
        name: med.name,
        category: med.category,
        price: med.price,
        stock: med.stock,
        manufacturer: med.manufacturer,
        expiryDate: med.expiryDate ? new Date(med.expiryDate).toISOString().split('T')[0] : '',
        description: med.description,
        requiresPrescription: med.requiresPrescription
      });
    } else {
      setEditingMed(null);
      setFormData({
        name: '',
        category: 'Tablet',
        price: '',
        stock: '',
        manufacturer: '',
        expiryDate: '',
        description: '',
        requiresPrescription: false
      });
    }
    setImage(null);
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const data = new FormData();
    Object.keys(formData).forEach(key => {
        if (formData[key] !== null && formData[key] !== undefined) {
            data.append(key, formData[key]);
        }
    });
    if (image) data.append('image', image);

    try {
      if (editingMed) {
        await medicineAPI.update(editingMed._id, data);
        toast.success("Medicine updated");
      } else {
        await medicineAPI.add(data);
        toast.success("Medicine added to stock");
      }
      setShowModal(false);
      fetchInventory();
    } catch (err) {
      toast.error(err.message || "Operation failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to remove this medicine?")) return;
    try {
      await medicineAPI.delete(id);
      toast.success("Medicine removed");
      fetchInventory();
    } catch (err) {
      toast.error("Delete failed");
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
            Medicine <span className="text-pharmacy">Stock</span>
          </h1>
          <p className="text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest text-[10px] mt-1">
            Manage your pharmacy inventory
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative group">
            <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-pharmacy transition-colors" />
            <input 
              type="text" 
              placeholder="Search stock..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl pl-10 pr-4 py-3 w-64 focus:ring-2 focus:ring-pharmacy/20 outline-none transition-all text-sm font-bold shadow-sm"
            />
          </div>
          <button 
            onClick={() => handleOpenModal()}
            className="bg-pharmacy text-white px-6 py-3 rounded-2xl font-black uppercase tracking-widest text-[10px] flex items-center gap-2 shadow-lg shadow-pharmacy/20 hover:scale-105 active:scale-95 transition-all"
          >
            <Plus className="w-4 h-4" /> Add Medicine
          </button>
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 relative z-10">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 animate-pulse overflow-hidden">
              <div className="h-48 bg-slate-200 dark:bg-slate-800" />
              <div className="p-6 space-y-4">
                <div className="flex justify-between items-start">
                  <div className="space-y-2">
                    <div className="h-4 w-24 bg-slate-200 dark:bg-slate-800 rounded" />
                    <div className="h-3 w-16 bg-slate-200 dark:bg-slate-800 rounded" />
                  </div>
                  <div className="h-5 w-12 bg-slate-200 dark:bg-slate-800 rounded" />
                </div>
                <div className="space-y-2">
                  <div className="h-3 w-full bg-slate-200 dark:bg-slate-800 rounded" />
                  <div className="h-1.5 w-full bg-slate-200 dark:bg-slate-800 rounded-full" />
                </div>
                <div className="flex gap-2 pt-2">
                  <div className="h-10 w-full bg-slate-200 dark:bg-slate-800 rounded-xl" />
                  <div className="h-10 w-10 bg-slate-200 dark:bg-slate-800 rounded-xl shrink-0" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : filteredMedicines.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 relative z-10">
          {filteredMedicines.map((med, i) => (
            <motion.div
              key={med._id}
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ delay: i * 0.05, type: 'spring' }}
              className="bg-white/90 backdrop-blur-md dark:bg-slate-900/90 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-premium overflow-hidden group hover:shadow-2xl hover:-translate-y-1 transition-all"
            >
              <div className="relative h-48 bg-slate-50 dark:bg-slate-800 overflow-hidden">
                {med.image ? (
                  <img src={med.image} alt={med.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-300">
                    <Package className="w-12 h-12" />
                  </div>
                )}
                <div className="absolute top-4 left-4">
                  <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest ${
                    med.stock > 20 ? 'bg-emerald-500 text-white' : 
                    med.stock > 0 ? 'bg-amber-500 text-white' : 'bg-red-500 text-white'
                  }`}>
                    {med.stock > 20 ? 'In Stock' : med.stock > 0 ? 'Low Stock' : 'Out of Stock'}
                  </span>
                </div>
              </div>

              <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-black text-slate-900 dark:text-white uppercase tracking-tight truncate max-w-[150px]">{med.name}</h3>
                    <p className="text-[10px] font-black text-pharmacy uppercase tracking-widest">{med.category}</p>
                  </div>
                  <p className="text-lg font-black text-slate-900 dark:text-white">₹{med.price}</p>
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-slate-400">
                    <span>Stock Level</span>
                    <span className="text-slate-900 dark:text-white">{med.stock} Units</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-1000 ${
                        med.stock > 20 ? 'bg-emerald-500' : med.stock > 0 ? 'bg-amber-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${Math.min((med.stock / 100) * 100, 100)}%` }}
                    />
                  </div>
                  <div className="flex items-center gap-2 text-[8px] font-bold text-slate-400 uppercase tracking-widest">
                    <Calendar className="w-3 h-3" /> Expiry: {new Date(med.expiryDate).toLocaleDateString()}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => handleOpenModal(med)}
                    className="flex-1 py-3 bg-slate-50 dark:bg-slate-800 rounded-xl text-slate-600 dark:text-slate-400 font-black uppercase tracking-widest text-[8px] hover:bg-pharmacy/10 hover:text-pharmacy transition-all flex items-center justify-center gap-2"
                  >
                    <Edit3 className="w-3 h-3" /> Edit
                  </button>
                  <button 
                    onClick={() => handleDelete(med._id)}
                    className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
          className="bg-white/80 backdrop-blur-md dark:bg-slate-900/80 rounded-[3rem] p-16 text-center border border-slate-100 dark:border-slate-800 shadow-premium mt-12"
        >
          <Package className="w-16 h-16 text-slate-200 dark:text-slate-700 mx-auto mb-6" />
          <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">No Medicines Found</h3>
          <p className="text-slate-400 text-xs font-bold mt-2 uppercase tracking-widest">Add some medicines to your stock to see them here.</p>
        </motion.div>
      )}

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowModal(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-[3rem] shadow-2xl overflow-hidden border border-slate-100 dark:border-slate-800"
            >
              <div className="p-8 border-b border-slate-50 dark:border-slate-800 flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
                    {editingMed ? 'Edit' : 'Add New'} <span className="text-pharmacy">Medicine</span>
                  </h2>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-1">Fill in the clinical inventory details</p>
                </div>
                <button onClick={() => setShowModal(false)} className="p-3 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-2xl transition-colors">
                  <X className="w-6 h-6 text-slate-400" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-8 max-h-[70vh] overflow-y-auto custom-scrollbar">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Medicine Name</label>
                    <input
                      required
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full bg-slate-50 dark:bg-slate-800/50 border-none rounded-2xl px-5 py-4 text-sm font-bold outline-none focus:ring-2 focus:ring-pharmacy/20 transition-all"
                      placeholder="e.g., Paracetamol 650mg"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Category</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({...formData, category: e.target.value})}
                      className="w-full bg-slate-50 dark:bg-slate-800/50 border-none rounded-2xl px-5 py-4 text-sm font-bold outline-none focus:ring-2 focus:ring-pharmacy/20 transition-all"
                    >
                      {['Tablet', 'Capsule', 'Syrup', 'Injection', 'Ointment', 'Powder', 'Other'].map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Price (₹)</label>
                    <div className="relative">
                      <IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        required
                        type="number"
                        value={formData.price}
                        onChange={(e) => setFormData({...formData, price: e.target.value})}
                        className="w-full bg-slate-50 dark:bg-slate-800/50 border-none rounded-2xl pl-12 pr-5 py-4 text-sm font-bold outline-none focus:ring-2 focus:ring-pharmacy/20 transition-all"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Stock Quantity</label>
                    <input
                      required
                      type="number"
                      value={formData.stock}
                      onChange={(e) => setFormData({...formData, stock: e.target.value})}
                      className="w-full bg-slate-50 dark:bg-slate-800/50 border-none rounded-2xl px-5 py-4 text-sm font-bold outline-none focus:ring-2 focus:ring-pharmacy/20 transition-all"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Expiry Date</label>
                    <input
                      required
                      type="date"
                      value={formData.expiryDate}
                      onChange={(e) => setFormData({...formData, expiryDate: e.target.value})}
                      className="w-full bg-slate-50 dark:bg-slate-800/50 border-none rounded-2xl px-5 py-4 text-sm font-bold outline-none focus:ring-2 focus:ring-pharmacy/20 transition-all"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Manufacturer</label>
                    <input
                      type="text"
                      value={formData.manufacturer}
                      onChange={(e) => setFormData({...formData, manufacturer: e.target.value})}
                      className="w-full bg-slate-50 dark:bg-slate-800/50 border-none rounded-2xl px-5 py-4 text-sm font-bold outline-none focus:ring-2 focus:ring-pharmacy/20 transition-all"
                      placeholder="e.g., Sun Pharma"
                    />
                  </div>

                  <div className="md:col-span-2 space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Description</label>
                    <textarea
                      rows="3"
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      className="w-full bg-slate-50 dark:bg-slate-800/50 border-none rounded-2xl px-5 py-4 text-sm font-bold outline-none focus:ring-2 focus:ring-pharmacy/20 transition-all resize-none"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2 mb-2 block">Medicine Image</label>
                    <div className="flex items-center gap-6">
                      <div className="w-32 h-32 rounded-[2rem] bg-slate-50 dark:bg-slate-800/50 border-2 border-dashed border-slate-200 dark:border-slate-700 flex items-center justify-center relative overflow-hidden group">
                        {image ? (
                          <img src={URL.createObjectURL(image)} className="w-full h-full object-cover" />
                        ) : editingMed?.image ? (
                          <img src={editingMed.image} className="w-full h-full object-cover" />
                        ) : (
                          <Upload className="w-8 h-8 text-slate-300" />
                        )}
                        <input
                          type="file"
                          onChange={(e) => setImage(e.target.files[0])}
                          className="absolute inset-0 opacity-0 cursor-pointer"
                        />
                      </div>
                      <div className="flex-1">
                        <p className="text-[10px] font-bold text-slate-400 leading-relaxed uppercase tracking-tight">
                          Click to upload medicine image.<br/>
                          JPG, PNG or WEBP (Max 2MB).
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="md:col-span-2 flex items-center gap-3 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl">
                    <input
                      type="checkbox"
                      id="presc"
                      checked={formData.requiresPrescription}
                      onChange={(e) => setFormData({...formData, requiresPrescription: e.target.checked})}
                      className="w-5 h-5 rounded border-slate-200 text-pharmacy focus:ring-pharmacy/20"
                    />
                    <label htmlFor="presc" className="text-xs font-black text-slate-700 dark:text-slate-300 uppercase tracking-tight">
                      Requires Doctor's Prescription
                    </label>
                  </div>
                </div>

                <div className="mt-10 flex gap-4">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="flex-1 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    disabled={isSubmitting}
                    className="flex-[2] bg-pharmacy text-white py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-lg shadow-pharmacy/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                    {editingMed ? 'Update Medicine' : 'Add to Inventory'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MedicineStock;
