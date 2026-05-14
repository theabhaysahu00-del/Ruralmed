import React from 'react';
import { Map, Users, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

import { adminAPI } from '../services/api';

const AdminVillageReports = () => {
  const [villages, setVillages] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchHeatmap = async () => {
      try {
        const response = await adminAPI.getHeatmap();
        setVillages(response.data);
      } catch (error) {
        console.error('Heatmap fetch error:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchHeatmap();
  }, []);

  if (loading) return <div>Loading Reports...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-xl font-extrabold text-slate-900">Village Health Reports</h3>
        <button className="bg-primary-50 text-primary-700 px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2">
          <Map size={16} /> Export Map Data
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {villages.map((village) => (
          <div key={village.name} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h4 className="text-lg font-bold text-slate-900">{village.name}</h4>
                <p className="text-sm text-slate-500">Region: Sector 4B</p>
              </div>
              <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                village.status === 'Stable' ? 'bg-green-100 text-green-600' : 
                village.status === 'Warning' ? 'bg-orange-100 text-orange-600' : 
                'bg-red-100 text-red-600'
              }`}>
                {village.status}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-slate-50 p-3 rounded-2xl">
                <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">Active Cases</p>
                <p className="text-xl font-black text-slate-900">{village.cases}</p>
              </div>
              <div className="bg-slate-50 p-3 rounded-2xl">
                <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">Top Disease</p>
                <p className="text-xl font-bold text-slate-800 truncate text-xs">{village.topDisease}</p>
              </div>
            </div>

            {village.alerts > 0 && (
              <div className="flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-2xl text-xs font-bold">
                <AlertCircle size={14} />
                {village.alerts} emergency requests pending response.
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminVillageReports;
