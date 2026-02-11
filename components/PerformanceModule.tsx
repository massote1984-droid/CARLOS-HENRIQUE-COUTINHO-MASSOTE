
import React, { useState } from 'react';
import { StockEntry } from '../types';
import { Clock, Timer, CheckCircle2 } from 'lucide-react';

interface PerformanceModuleProps {
  entries: StockEntry[];
  onUpdate: (entry: StockEntry) => void;
}

const PerformanceModule: React.FC<PerformanceModuleProps> = ({ entries, onUpdate }) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [times, setTimes] = useState({ che: '', ent: '', sai: '' });

  const handleEdit = (item: StockEntry) => {
    setEditingId(item.id);
    setTimes({
      che: item.horaChegada || '',
      ent: item.horaEntrada || '',
      sai: item.horaSaida || ''
    });
  };

  const handleSave = (id: string) => {
    const item = entries.find(e => e.id === id);
    if (item) {
      onUpdate({
        ...item,
        horaChegada: times.che,
        horaEntrada: times.ent,
        horaSaida: times.sai
      });
      setEditingId(null);
    }
  };

  // Helper to calculate duration between times
  const calculateDuration = (start: string, end: string) => {
    if (!start || !end) return '-';
    try {
      const [h1, m1] = start.split(':').map(Number);
      const [h2, m2] = end.split(':').map(Number);
      const totalMin = (h2 * 60 + m2) - (h1 * 60 + m1);
      if (totalMin < 0) return '-';
      const hours = Math.floor(totalMin / 60);
      const mins = totalMin % 60;
      return `${hours}h ${mins}m`;
    } catch { return '-'; }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-5 rounded-xl border-l-4 border-l-indigo-500 shadow-sm">
          <p className="text-xs font-bold text-slate-400 uppercase mb-1">Média Permanência</p>
          <h4 className="text-2xl font-bold text-slate-800">4h 15m</h4>
        </div>
        <div className="bg-white p-5 rounded-xl border-l-4 border-l-emerald-500 shadow-sm">
          <p className="text-xs font-bold text-slate-400 uppercase mb-1">Cargas Hoje</p>
          <h4 className="text-2xl font-bold text-slate-800">12</h4>
        </div>
        <div className="bg-white p-5 rounded-xl border-l-4 border-l-amber-500 shadow-sm">
          <p className="text-xs font-bold text-slate-400 uppercase mb-1">Em Operação</p>
          <h4 className="text-2xl font-bold text-slate-800">3</h4>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="p-6 border-b border-slate-100 bg-slate-50/50">
          <h2 className="text-lg font-bold text-slate-800">Log de Horários Operacionais</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50/50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 text-xs font-semibold text-slate-600 uppercase">NF / Veículo</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-600 uppercase">Hora Chegada</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-600 uppercase">Hora Entrada</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-600 uppercase">Hora Saída</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-600 uppercase text-center">Tempo Total</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-600 uppercase text-right">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {entries.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/50">
                  <td className="px-6 py-4">
                    <div className="text-sm font-bold text-slate-800">NF: {item.nf}</div>
                    <div className="text-xs text-indigo-500 font-medium">{item.placaVeiculo}</div>
                  </td>
                  <td className="px-6 py-4">
                    {editingId === item.id ? (
                      <input type="time" className="p-1 text-xs border rounded" value={times.che} onChange={e => setTimes({...times, che: e.target.value})} />
                    ) : (
                      <span className="text-sm text-slate-600 flex items-center gap-1"><Clock className="w-3 h-3 text-slate-300" /> {item.horaChegada || '--:--'}</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {editingId === item.id ? (
                      <input type="time" className="p-1 text-xs border rounded" value={times.ent} onChange={e => setTimes({...times, ent: e.target.value})} />
                    ) : (
                      <span className="text-sm text-slate-600 flex items-center gap-1"><Clock className="w-3 h-3 text-slate-300" /> {item.horaEntrada || '--:--'}</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {editingId === item.id ? (
                      <input type="time" className="p-1 text-xs border rounded" value={times.sai} onChange={e => setTimes({...times, sai: e.target.value})} />
                    ) : (
                      <span className="text-sm text-slate-600 flex items-center gap-1"><Clock className="w-3 h-3 text-slate-300" /> {item.horaSaida || '--:--'}</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-xs font-bold">
                      {calculateDuration(item.horaChegada || '', item.horaSaida || '')}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    {editingId === item.id ? (
                      <button onClick={() => handleSave(item.id)} className="text-emerald-600 hover:text-emerald-800 font-bold text-xs p-1">
                        <CheckCircle2 className="w-5 h-5" />
                      </button>
                    ) : (
                      <button onClick={() => handleEdit(item)} className="text-indigo-600 hover:text-indigo-800 font-medium text-xs">Editar</button>
                    )}
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

export default PerformanceModule;
