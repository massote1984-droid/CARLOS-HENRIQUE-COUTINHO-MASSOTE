
import React, { useState } from 'react';
import { StockEntry, StatusType } from '../types';
import { Truck, ArrowUpRight, Search, FileEdit } from 'lucide-react';

interface ExitModuleProps {
  entries: StockEntry[];
  onUpdate: (entry: StockEntry) => void;
}

const ExitModule: React.FC<ExitModuleProps> = ({ entries, onUpdate }) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [exitData, setExitData] = useState<Partial<StockEntry>>({});

  const availableForExit = entries.filter(e => ['Estoque', 'Rejeitado'].includes(e.status));
  const shippedItems = entries.filter(e => ['Embarcado', 'Devolvido'].includes(e.status));

  const handleStartExit = (item: StockEntry) => {
    setEditingId(item.id);
    setExitData({
      status: 'Embarcado',
      dataFaturamentoVLI: new Date().toISOString().split('T')[0],
      cteVLI: ''
    });
  };

  const handleSaveExit = (id: string) => {
    const item = entries.find(e => e.id === id);
    if (item) {
      onUpdate({
        ...item,
        ...exitData,
        status: exitData.status as StatusType
      });
      setEditingId(null);
      setExitData({});
    }
  };

  return (
    <div className="space-y-8">
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <h2 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
          <Truck className="w-5 h-5 text-indigo-600" /> Itens Pendentes de Saída
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {availableForExit.map((item) => (
            <div key={item.id} className="border border-slate-100 rounded-xl p-5 hover:border-indigo-300 transition-all bg-slate-50/30">
              <div className="flex justify-between items-start mb-3">
                <span className="text-xs font-bold text-indigo-500 uppercase">NF: {item.nf}</span>
                <span className="text-xs text-slate-400">{item.dataDescarga}</span>
              </div>
              <h4 className="text-sm font-semibold text-slate-800 line-clamp-1 mb-1">{item.descricaoProduto}</h4>
              <p className="text-xs text-slate-500 mb-4">{item.fornecedor} • {item.tonelada} TON</p>
              
              {editingId === item.id ? (
                <div className="space-y-3 pt-3 border-t border-slate-100">
                  <div className="grid grid-cols-2 gap-2">
                     <div>
                      <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Status</label>
                      <select 
                        className="w-full p-2 text-xs border border-slate-200 rounded-md focus:ring-1 focus:ring-indigo-500 outline-none"
                        value={exitData.status}
                        onChange={e => setExitData({...exitData, status: e.target.value as StatusType})}
                      >
                        <option value="Embarcado">Embarcado</option>
                        <option value="Devolvido">Devolvido</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Data VLI</label>
                      <input 
                        type="date" 
                        className="w-full p-2 text-xs border border-slate-200 rounded-md focus:ring-1 focus:ring-indigo-500 outline-none"
                        value={exitData.dataFaturamentoVLI}
                        onChange={e => setExitData({...exitData, dataFaturamentoVLI: e.target.value})}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">CTE VLI</label>
                    <input 
                      placeholder="Número CTE"
                      className="w-full p-2 text-xs border border-slate-200 rounded-md focus:ring-1 focus:ring-indigo-500 outline-none"
                      value={exitData.cteVLI}
                      onChange={e => setExitData({...exitData, cteVLI: e.target.value})}
                    />
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => setEditingId(null)}
                      className="flex-1 py-2 text-xs font-bold text-slate-500 bg-slate-100 rounded-md hover:bg-slate-200 transition-colors"
                    >
                      Cancelar
                    </button>
                    <button 
                      onClick={() => handleSaveExit(item.id)}
                      className="flex-1 py-2 text-xs font-bold text-white bg-indigo-600 rounded-md hover:bg-indigo-700 transition-colors"
                    >
                      Confirmar
                    </button>
                  </div>
                </div>
              ) : (
                <button 
                  onClick={() => handleStartExit(item)}
                  className="w-full py-2.5 flex items-center justify-center gap-2 text-sm font-bold text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors"
                >
                  <ArrowUpRight className="w-4 h-4" /> Registrar Saída
                </button>
              )}
            </div>
          ))}
          {availableForExit.length === 0 && (
            <div className="col-span-full py-12 text-center text-slate-400 italic bg-slate-50 rounded-xl border-2 border-dashed border-slate-200">
              Nenhum produto em estoque aguardando saída.
            </div>
          )}
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <h2 className="text-lg font-bold text-slate-800 mb-6">Histórico de Expedição (Saídas)</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 text-xs font-semibold text-slate-600 uppercase">N.F</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-600 uppercase">Data VLI</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-600 uppercase">CTE VLI</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-600 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {shippedItems.map((item) => (
                <tr key={item.id}>
                  <td className="px-6 py-4 text-sm font-medium text-slate-900">{item.nf}</td>
                  <td className="px-6 py-4 text-sm text-slate-500">{item.dataFaturamentoVLI || '-'}</td>
                  <td className="px-6 py-4 text-sm text-slate-500">{item.cteVLI || '-'}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      item.status === 'Embarcado' ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-100 text-slate-700'
                    }`}>
                      {item.status}
                    </span>
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

export default ExitModule;
