
import React, { useMemo } from 'react';
import { StockEntry, StockSummary } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { Package, Truck, ArrowUpRight, TrendingUp, MapPin, Box, Activity } from 'lucide-react';

interface DashboardProps {
  entries: StockEntry[];
}

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#f43f5e'];

const Dashboard: React.FC<DashboardProps> = ({ entries }) => {
  const stats = useMemo(() => {
    const inStock = entries.filter(e => ['Estoque', 'Rejeitado'].includes(e.status));
    const totalInStock = inStock.length;
    const totalWeight = inStock.reduce((acc, curr) => acc + (curr.tonelada || 0), 0);
    const totalOut = entries.filter(e => ['Embarcado', 'Devolvido'].includes(e.status)).length;
    
    // Grouping helper
    const groupBy = (key: keyof StockEntry) => {
      const map: Record<string, { count: number; weight: number }> = {};
      inStock.forEach(e => {
        const val = String(e[key] || 'Não Informado');
        if (!map[val]) map[val] = { count: 0, weight: 0 };
        map[val].count += 1;
        map[val].weight += e.tonelada;
      });
      return Object.entries(map).map(([name, val]) => ({
        name,
        value: val.count,
        weight: Number(val.weight.toFixed(2))
      })).sort((a, b) => b.value - a.value);
    };

    // Special grouping for Status by Destination
    const getStatusByDestination = () => {
      const map: Record<string, Record<string, number>> = {};
      const destinations = new Set<string>();
      
      inStock.forEach(e => {
        const dest = e.destino || 'Não Informado';
        destinations.add(dest);
        if (!map[dest]) map[dest] = { Estoque: 0, Rejeitado: 0 };
        if (e.status === 'Estoque' || e.status === 'Rejeitado') {
          map[dest][e.status] += 1;
        }
      });

      return Array.from(destinations).map(dest => ({
        name: dest,
        Estoque: map[dest].Estoque,
        Rejeitado: map[dest].Rejeitado
      })).sort((a, b) => (b.Estoque + b.Rejeitado) - (a.Estoque + a.Rejeitado)).slice(0, 6);
    };

    const supplierData = groupBy('fornecedor').slice(0, 5);
    const destinationData = groupBy('destino').slice(0, 5);
    const productData = groupBy('descricaoProduto').slice(0, 5);
    const statusDestData = getStatusByDestination();

    return { totalInStock, totalWeight, totalOut, supplierData, destinationData, productData, statusDestData };
  }, [entries]);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-slate-100 shadow-xl rounded-lg">
          <p className="text-xs font-bold text-slate-800 mb-1">{label}</p>
          {payload.map((p: any, i: number) => (
            <p key={i} className="text-xs font-medium" style={{ color: p.color || p.fill }}>
              {p.name}: {p.value} {p.name.includes('Peso') || p.name.includes('Tonelada') ? 'TON' : ''}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-8">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-indigo-50 rounded-lg">
              <Package className="w-6 h-6 text-indigo-600" />
            </div>
          </div>
          <p className="text-sm text-slate-500 font-medium">Unidades em Estoque</p>
          <h3 className="text-3xl font-bold text-slate-800 mt-1">{stats.totalInStock}</h3>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-amber-50 rounded-lg">
              <TrendingUp className="w-6 h-6 text-amber-600" />
            </div>
          </div>
          <p className="text-sm text-slate-500 font-medium">Peso Total (TON)</p>
          <h3 className="text-3xl font-bold text-slate-800 mt-1">{stats.totalWeight.toFixed(2)}</h3>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-emerald-50 rounded-lg">
              <Truck className="w-6 h-6 text-emerald-600" />
            </div>
          </div>
          <p className="text-sm text-slate-500 font-medium">Total de Despachos</p>
          <h3 className="text-3xl font-bold text-slate-800 mt-1">{stats.totalOut}</h3>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-rose-50 rounded-lg">
              <ArrowUpRight className="w-6 h-6 text-rose-600" />
            </div>
          </div>
          <p className="text-sm text-slate-500 font-medium">Giro de Estoque</p>
          <h3 className="text-3xl font-bold text-slate-800 mt-1">
            {stats.totalInStock + stats.totalOut > 0 ? ((stats.totalOut / (stats.totalInStock + stats.totalOut)) * 100).toFixed(1) : 0}%
          </h3>
        </div>
      </div>

      {/* Main Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Row 1: Status por Destino (Novo) & Estoque por Fornecedor */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-6 flex items-center gap-2">
            <Activity className="w-4 h-4" /> Status por Destino
          </h4>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.statusDestData} margin={{ left: -20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" fontSize={10} axisLine={false} tickLine={false} />
                <YAxis fontSize={10} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '10px', paddingTop: '10px' }} />
                <Bar dataKey="Estoque" stackId="a" fill="#10b981" radius={[0, 0, 0, 0]} barSize={32} name="Estoque" />
                <Bar dataKey="Rejeitado" stackId="a" fill="#ef4444" radius={[4, 4, 0, 0]} barSize={32} name="Rejeitado" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-6 flex items-center gap-2">
            <Package className="w-4 h-4" /> Estoque por Fornecedor
          </h4>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.supplierData} margin={{ left: -20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" fontSize={10} axisLine={false} tickLine={false} />
                <YAxis fontSize={10} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="value" fill="#6366f1" radius={[4, 4, 0, 0]} barSize={32} name="Unidades" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Row 2: Produtos & Destinos */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-6 flex items-center gap-2">
            <Box className="w-4 h-4" /> Estoque por Produto
          </h4>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.productData} margin={{ left: -20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" fontSize={10} axisLine={false} tickLine={false} />
                <YAxis fontSize={10} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="value" fill="#f59e0b" radius={[4, 4, 0, 0]} barSize={32} name="Unidades" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-6 flex items-center gap-2">
            <MapPin className="w-4 h-4" /> Peso por Destino
          </h4>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.destinationData} layout="vertical" margin={{ left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                <XAxis type="number" fontSize={10} axisLine={false} tickLine={false} />
                <YAxis dataKey="name" type="category" fontSize={10} axisLine={false} tickLine={false} width={80} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="weight" fill="#8b5cf6" radius={[0, 4, 4, 0]} barSize={20} name="Toneladas" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
