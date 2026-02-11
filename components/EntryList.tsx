
import React, { useState, useMemo } from 'react';
import { StockEntry, StatusType } from '../types';
import { Plus, X, Filter, Download, Calendar, RotateCcw, Tag, Hash } from 'lucide-react';

interface EntryListProps {
  entries: StockEntry[];
  onAdd: (entry: StockEntry) => void;
  onUpdate: (entry: StockEntry) => void;
}

const EntryList: React.FC<EntryListProps> = ({ entries, onAdd, onUpdate }) => {
  const [showModal, setShowModal] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [filterField, setFilterField] = useState<'dataNF' | 'dataDescarga'>('dataNF');
  const [statusFilter, setStatusFilter] = useState<'Todos' | 'Estoque' | 'Rejeitado'>('Todos');
  
  const [formData, setFormData] = useState<Partial<StockEntry>>({
    status: 'Estoque',
    mes: new Date().toLocaleString('pt-BR', { month: 'long' }),
    dataNF: new Date().toISOString().split('T')[0],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newEntry: StockEntry = {
      ...formData as StockEntry,
      id: crypto.randomUUID(),
      tonelada: Number(formData.tonelada || 0),
      valor: Number(formData.valor || 0),
    };
    onAdd(newEntry);
    setShowModal(false);
    setFormData({ status: 'Estoque', mes: new Date().toLocaleString('pt-BR', { month: 'long' }) });
  };

  const currentStock = useMemo(() => entries.filter(e => ['Estoque', 'Rejeitado'].includes(e.status)), [entries]);

  const filteredStock = useMemo(() => {
    return currentStock.filter(entry => {
      // Status filter
      if (statusFilter !== 'Todos' && entry.status !== statusFilter) return false;

      // Date range filter
      const entryDate = entry[filterField];
      if (!entryDate) return true;
      if (startDate && entryDate < startDate) return false;
      if (endDate && entryDate > endDate) return false;
      return true;
    });
  }, [currentStock, startDate, endDate, filterField, statusFilter]);

  const clearFilters = () => {
    setStartDate('');
    setEndDate('');
    setFilterField('dataNF');
    setStatusFilter('Todos');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-lg font-semibold text-slate-800">Registros de Entrada</h2>
          <p className="text-sm text-slate-500">Gerencie novos recebimentos e status inicial do produto.</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors">
            <Download className="w-4 h-4" /> Exportar
          </button>
          <button 
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" /> Nova Entrada
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-wrap items-end gap-4">
        <div className="flex-1 min-w-[150px]">
          <label className="block text-xs font-bold text-slate-500 uppercase mb-2 flex items-center gap-1">
            <Tag className="w-3 h-3" /> Status
          </label>
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="w-full p-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
          >
            <option value="Todos">Todos</option>
            <option value="Estoque">Estoque</option>
            <option value="Rejeitado">Rejeitado</option>
          </select>
        </div>
        <div className="flex-1 min-w-[150px]">
          <label className="block text-xs font-bold text-slate-500 uppercase mb-2 flex items-center gap-1">
            <Filter className="w-3 h-3" /> Campo de Data
          </label>
          <select 
            value={filterField}
            onChange={(e) => setFilterField(e.target.value as 'dataNF' | 'dataDescarga')}
            className="w-full p-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
          >
            <option value="dataNF">Data da N.F</option>
            <option value="dataDescarga">Data de Descarga</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase mb-2 flex items-center gap-1">
            <Calendar className="w-3 h-3" /> Data Inicial
          </label>
          <input 
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="p-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase mb-2 flex items-center gap-1">
            <Calendar className="w-3 h-3" /> Data Final
          </label>
          <input 
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="p-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
          />
        </div>
        {(startDate || endDate || statusFilter !== 'Todos') && (
          <button 
            onClick={clearFilters}
            className="flex items-center gap-2 px-4 py-2 text-slate-500 hover:text-rose-600 text-sm font-medium transition-colors"
          >
            <RotateCcw className="w-4 h-4" /> Limpar
          </button>
        )}
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">Mês / NF</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">Produto</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">Fornecedor</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">Peso (TON)</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-600 uppercase tracking-wider text-center">Qtd</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredStock.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-slate-400 italic">
                    {currentStock.length === 0 
                      ? "Nenhum item em estoque no momento." 
                      : "Nenhum resultado para os filtros aplicados."}
                  </td>
                </tr>
              ) : (
                filteredStock.map((entry) => (
                  <tr key={entry.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-slate-900">{entry.mes}</div>
                      <div className="text-xs text-slate-500">NF: {entry.nf}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-slate-900 line-clamp-1">{entry.descricaoProduto}</div>
                      <div className="text-xs text-slate-500">{entry.container}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{entry.fornecedor}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">{entry.tonelada.toFixed(2)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <span className="text-sm font-bold text-slate-700">1</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        entry.status === 'Estoque' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
                      }`}>
                        {entry.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                      <button className="text-indigo-600 hover:text-indigo-900 font-medium">Ver Detalhes</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Nova Entrada */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white z-10">
              <h3 className="text-xl font-bold text-slate-800">Registrar Entrada de Produto</h3>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-8 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Mês</label>
                  <input required type="text" className="w-full p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" 
                    value={formData.mes} onChange={e => setFormData({...formData, mes: e.target.value})} />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-2">Chave de Acesso NF</label>
                  <input required type="text" className="w-full p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" 
                    value={formData.chaveAcessoNF} onChange={e => setFormData({...formData, chaveAcessoNF: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Número N.F</label>
                  <input required type="text" className="w-full p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" 
                    value={formData.nf} onChange={e => setFormData({...formData, nf: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Tonelada (TON)</label>
                  <input required type="number" step="0.01" className="w-full p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" 
                    value={formData.tonelada} onChange={e => setFormData({...formData, tonelada: Number(e.target.value)})} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Valor (R$)</label>
                  <input required type="number" step="0.01" className="w-full p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" 
                    value={formData.valor} onChange={e => setFormData({...formData, valor: Number(e.target.value)})} />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Descrição do Produto</label>
                  <textarea required rows={2} className="w-full p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none resize-none" 
                    value={formData.descricaoProduto} onChange={e => setFormData({...formData, descricaoProduto: e.target.value})} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                   <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Data N.F</label>
                    <input required type="date" className="w-full p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" 
                      value={formData.dataNF} onChange={e => setFormData({...formData, dataNF: e.target.value})} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Data Descarga</label>
                    <input required type="date" className="w-full p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" 
                      value={formData.dataDescarga} onChange={e => setFormData({...formData, dataDescarga: e.target.value})} />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Status Inicial</label>
                  <select required className="w-full p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" 
                    value={formData.status} onChange={e => setFormData({...formData, status: e.target.value as StatusType})}>
                    <option value="Estoque">Estoque</option>
                    <option value="Rejeitado">Rejeitado</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Fornecedor</label>
                  <input required type="text" className="w-full p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" 
                    value={formData.fornecedor} onChange={e => setFormData({...formData, fornecedor: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Placa do Veículo</label>
                  <input required type="text" className="w-full p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" 
                    value={formData.placaVeiculo} onChange={e => setFormData({...formData, placaVeiculo: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Container</label>
                  <input required type="text" className="w-full p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" 
                    value={formData.container} onChange={e => setFormData({...formData, container: e.target.value})} />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-2">Destino</label>
                  <input required type="text" className="w-full p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" 
                    value={formData.destino} onChange={e => setFormData({...formData, destino: e.target.value})} />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-6 border-t border-slate-100">
                <button 
                  type="button" 
                  onClick={() => setShowModal(false)}
                  className="px-6 py-2 border border-slate-200 text-slate-600 rounded-lg font-medium hover:bg-slate-50 transition-colors"
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors shadow-sm"
                >
                  Salvar Registro
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default EntryList;
