
import React, { useState } from 'react';
import { StockEntry } from '../types';
import { FileText, Calendar, Landmark } from 'lucide-react';

interface BillingModuleProps {
  entries: StockEntry[];
  onUpdate: (entry: StockEntry) => void;
}

const BillingModule: React.FC<BillingModuleProps> = ({ entries, onUpdate }) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [billing, setBilling] = useState({
    dataEmissaoNF: '',
    cteIntertex: '',
    dataEmissaoCTEIntertex: '',
    cteTransportador: ''
  });

  const handleEdit = (item: StockEntry) => {
    setEditingId(item.id);
    setBilling({
      dataEmissaoNF: item.dataEmissaoNF || '',
      cteIntertex: item.cteIntertex || '',
      dataEmissaoCTEIntertex: item.dataEmissaoCTEIntertex || '',
      cteTransportador: item.cteTransportador || ''
    });
  };

  const handleSave = (id: string) => {
    const item = entries.find(e => e.id === id);
    if (item) {
      onUpdate({ ...item, ...billing });
      setEditingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="p-6 border-b border-slate-100">
          <h2 className="text-lg font-bold text-slate-800">Controle de Faturamento</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 text-xs font-semibold text-slate-600 uppercase">NF / Valor</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-600 uppercase">Emissão NF</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-600 uppercase">CTE Intertex</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-600 uppercase">Emissão CTE</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-600 uppercase">CTE Transportador</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-600 uppercase text-right">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {entries.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="text-sm font-bold text-slate-900">{item.nf}</div>
                    <div className="text-xs text-emerald-600 font-medium">R$ {item.valor.toLocaleString('pt-BR')}</div>
                  </td>
                  <td className="px-6 py-4">
                    {editingId === item.id ? (
                      <input type="date" className="p-1 text-xs border rounded w-full" value={billing.dataEmissaoNF} onChange={e => setBilling({...billing, dataEmissaoNF: e.target.value})} />
                    ) : (
                      <span className="text-sm text-slate-600">{item.dataEmissaoNF || '-'}</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {editingId === item.id ? (
                      <input type="text" className="p-1 text-xs border rounded w-full" value={billing.cteIntertex} onChange={e => setBilling({...billing, cteIntertex: e.target.value})} />
                    ) : (
                      <span className="text-sm text-slate-600 font-medium">{item.cteIntertex || '-'}</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {editingId === item.id ? (
                      <input type="date" className="p-1 text-xs border rounded w-full" value={billing.dataEmissaoCTEIntertex} onChange={e => setBilling({...billing, dataEmissaoCTEIntertex: e.target.value})} />
                    ) : (
                      <span className="text-sm text-slate-600">{item.dataEmissaoCTEIntertex || '-'}</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {editingId === item.id ? (
                      <input type="text" className="p-1 text-xs border rounded w-full" value={billing.cteTransportador} onChange={e => setBilling({...billing, cteTransportador: e.target.value})} />
                    ) : (
                      <span className="text-sm text-slate-600">{item.cteTransportador || '-'}</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    {editingId === item.id ? (
                      <button onClick={() => handleSave(item.id)} className="text-emerald-600 hover:text-emerald-800 font-bold text-xs uppercase bg-emerald-50 px-3 py-1 rounded">Salvar</button>
                    ) : (
                      <button onClick={() => handleEdit(item)} className="text-indigo-600 hover:text-indigo-800 font-bold text-xs uppercase bg-indigo-50 px-3 py-1 rounded">Editar</button>
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

export default BillingModule;
