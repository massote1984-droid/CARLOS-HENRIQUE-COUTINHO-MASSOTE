
import React, { useState, useMemo, useEffect } from 'react';
import { 
  LayoutDashboard, 
  ArrowDownCircle, 
  ArrowUpCircle, 
  BarChart3, 
  Receipt, 
  Package, 
  Settings,
  Search,
  Plus,
  Truck,
  Menu,
  X
} from 'lucide-react';
import { StockEntry, StatusType } from './types';
import Dashboard from './components/Dashboard';
import EntryList from './components/EntryList';
import ExitModule from './components/ExitModule';
import PerformanceModule from './components/PerformanceModule';
import BillingModule from './components/BillingModule';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'entrada' | 'saida' | 'performance' | 'faturamento'>('dashboard');
  const [entries, setEntries] = useState<StockEntry[]>(() => {
    const saved = localStorage.getItem('stock_data');
    return saved ? JSON.parse(saved) : [];
  });
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    localStorage.setItem('stock_data', JSON.stringify(entries));
  }, [entries]);

  const addEntry = (newEntry: StockEntry) => {
    setEntries(prev => [...prev, newEntry]);
  };

  const updateEntry = (updatedEntry: StockEntry) => {
    setEntries(prev => prev.map(e => e.id === updatedEntry.id ? updatedEntry : e));
  };

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
    { id: 'entrada', label: 'Entradas (Estoque)', icon: <ArrowDownCircle className="w-5 h-5" /> },
    { id: 'saida', label: 'Saídas (Expedição)', icon: <ArrowUpCircle className="w-5 h-5" /> },
    { id: 'performance', label: 'Performance Logística', icon: <Truck className="w-5 h-5" /> },
    { id: 'faturamento', label: 'Faturamento', icon: <Receipt className="w-5 h-5" /> },
  ];

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Sidebar */}
      <aside className={`bg-slate-900 text-slate-300 transition-all duration-300 flex-shrink-0 ${isSidebarOpen ? 'w-64' : 'w-20'}`}>
        <div className="p-6 flex items-center justify-between">
          {isSidebarOpen && <span className="font-bold text-white text-xl tracking-tight">STK<span className="text-indigo-400">Manager</span></span>}
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-1 hover:bg-slate-800 rounded">
            {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5 mx-auto" />}
          </button>
        </div>
        
        <nav className="mt-6">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as any)}
              className={`w-full flex items-center gap-4 px-6 py-4 transition-colors ${
                activeTab === item.id ? 'bg-indigo-600 text-white' : 'hover:bg-slate-800'
              }`}
            >
              {item.icon}
              {isSidebarOpen && <span className="text-sm font-medium">{item.label}</span>}
            </button>
          ))}
        </nav>

        <div className="absolute bottom-4 w-full px-6">
          <div className="flex items-center gap-3 p-3 bg-slate-800 rounded-lg">
             <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-white font-bold">A</div>
             {isSidebarOpen && (
               <div className="overflow-hidden">
                 <p className="text-xs font-semibold text-white truncate">Admin Logístico</p>
                 <p className="text-[10px] text-slate-400">Verificado</p>
               </div>
             )}
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white border-b border-slate-200 px-8 py-4 flex items-center justify-between">
          <h1 className="text-xl font-semibold text-slate-800">
            {navItems.find(i => i.id === activeTab)?.label}
          </h1>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text" 
                placeholder="Pesquisar NF..." 
                className="pl-9 pr-4 py-2 bg-slate-100 border-none rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 w-64"
              />
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-8">
          {activeTab === 'dashboard' && <Dashboard entries={entries} />}
          {activeTab === 'entrada' && <EntryList entries={entries} onAdd={addEntry} onUpdate={updateEntry} />}
          {activeTab === 'saida' && <ExitModule entries={entries} onUpdate={updateEntry} />}
          {activeTab === 'performance' && <PerformanceModule entries={entries} onUpdate={updateEntry} />}
          {activeTab === 'faturamento' && <BillingModule entries={entries} onUpdate={updateEntry} />}
        </div>
      </main>
    </div>
  );
};

export default App;
