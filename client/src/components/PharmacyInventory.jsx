import React, { useState } from 'react';
import { Search, Plus, Edit2, Trash2, Package, AlertTriangle } from 'lucide-react';

const mockInventory = [
  { id: 1, name: 'Paracetamol 500mg', stock: 500, category: 'Painkiller', price: 10 },
  { id: 2, name: 'Amoxicillin 250mg', stock: 12, category: 'Antibiotic', price: 120 },
  { id: 3, name: 'Cetirizine 10mg', stock: 250, category: 'Antihistamine', price: 40 },
  { id: 4, name: 'Insulin Glargine', stock: 5, category: 'Diabetes', price: 1500 },
];

const PharmacyInventory = () => {
  const [inventory, setInventory] = useState(mockInventory);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
          <input 
            type="text" 
            placeholder="Search medicine inventory..." 
            className="w-full pl-12 pr-4 py-3 rounded-2xl border border-slate-200 outline-none focus:border-orange-500 transition-all"
          />
        </div>
        <button className="bg-orange-600 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-orange-700 transition-all shadow-lg shadow-orange-200">
          <Plus size={20} /> Add New Medicine
        </button>
      </div>

      <div className="bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-sm">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr>
              <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-wider">Medicine Name</th>
              <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-wider">Category</th>
              <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-wider">Stock</th>
              <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-wider">Price/Unit</th>
              <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {inventory.map((item) => (
              <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-6 py-4 font-bold text-slate-900">{item.name}</td>
                <td className="px-6 py-4 text-sm text-slate-500">{item.category}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <span className={`font-bold ${item.stock < 20 ? 'text-red-500' : 'text-slate-900'}`}>{item.stock}</span>
                    {item.stock < 20 && (
                      <div className="group relative">
                        <AlertTriangle size={14} className="text-red-500 animate-pulse" />
                        <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-slate-900 text-white text-[10px] rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                          Critically Low Stock
                        </span>
                      </div>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 text-sm font-medium">₹{item.price}</td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    <button className="p-2 text-slate-400 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-all">
                      <Edit2 size={16} />
                    </button>
                    <button className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PharmacyInventory;
