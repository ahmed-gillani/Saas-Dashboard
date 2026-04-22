// src/components/ui/ExpenseCalculator.tsx
import { useState, useCallback } from 'react';
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import { Plus, Trash2, Calculator, TrendingUp } from 'lucide-react';

interface ExpenseEntry {
  id: string;
  category: string;
  amount: number;
  color: string;
}

const PALETTE = [
  '#6c63ff', '#00d4aa', '#f59e0b', '#ef4444',
  '#3b82f6', '#ec4899', '#10b981', '#f97316',
];

const PRESET_CATEGORIES = [
  'Housing', 'Food & Dining', 'Transport', 'Utilities',
  'Healthcare', 'Entertainment', 'Shopping', 'Savings',
];

function CustomTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null;
  const { name, value } = payload[0];
  return (
    <div className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-xs shadow-xl">
      <p className="text-gray-300 font-medium">{name}</p>
      <p className="text-white font-bold">${value.toLocaleString()}</p>
    </div>
  );
}

export default function ExpenseCalculator() {
  const [entries, setEntries] = useState<ExpenseEntry[]>([
    { id: '1', category: 'Housing',       amount: 1200, color: PALETTE[0] },
    { id: '2', category: 'Food & Dining', amount: 400,  color: PALETTE[1] },
    { id: '3', category: 'Transport',     amount: 250,  color: PALETTE[2] },
  ]);
  const [newCategory, setNewCategory] = useState('');
  const [newAmount, setNewAmount]     = useState('');
  const [income, setIncome]           = useState('5000');

  const total   = entries.reduce((s, e) => s + e.amount, 0);
  const incomeN = parseFloat(income) || 0;
  const savings = incomeN - total;

  const addEntry = useCallback(() => {
    const cat = newCategory.trim();
    const amt = parseFloat(newAmount);
    if (!cat || !amt || amt <= 0) return;
    const color = PALETTE[entries.length % PALETTE.length];
    setEntries(prev => [...prev, { id: Date.now().toString(), category: cat, amount: amt, color }]);
    setNewCategory('');
    setNewAmount('');
  }, [newCategory, newAmount, entries.length]);

  const removeEntry = (id: string) =>
    setEntries(prev => prev.filter(e => e.id !== id));

  const updateAmount = (id: string, val: string) => {
    const amt = parseFloat(val);
    if (isNaN(amt) || amt < 0) return;
    setEntries(prev => prev.map(e => e.id === id ? { ...e, amount: amt } : e));
  };

  const chartData = entries.map(e => ({ name: e.category, value: e.amount, color: e.color }));

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-800 bg-gradient-to-r from-violet-500/10 to-emerald-500/5">
        <div className="w-8 h-8 bg-violet-500/20 rounded-lg flex items-center justify-center">
          <Calculator size={16} className="text-violet-400" />
        </div>
        <div>
          <h2 className="text-sm font-semibold text-white">Monthly Expense Tracker</h2>
          <p className="text-xs text-gray-500">Add your expenses to see your spending breakdown</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 divide-y lg:divide-y-0 lg:divide-x divide-gray-800">

        {/* ── Left: Inputs ── */}
        <div className="p-5 space-y-4">

          {/* Monthly Income */}
          <div>
            <label className="text-xs text-gray-500 mb-1.5 block font-medium uppercase tracking-wider">
              Monthly Income
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
              <input
                type="number"
                value={income}
                onChange={e => setIncome(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-7 pr-4 py-2.5 text-white text-sm focus:outline-none focus:border-violet-500 transition-colors"
                placeholder="0"
                min="0"
              />
            </div>
          </div>

          {/* Expense List */}
          <div>
            <label className="text-xs text-gray-500 mb-2 block font-medium uppercase tracking-wider">
              Expenses
            </label>
            <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
              {entries.map(entry => (
                <div key={entry.id} className="flex items-center gap-2 group">
                  <div
                    className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                    style={{ backgroundColor: entry.color }}
                  />
                  <span className="flex-1 text-sm text-gray-300 truncate min-w-0">{entry.category}</span>
                  <div className="relative w-28 flex-shrink-0">
                    <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-500 text-xs">$</span>
                    <input
                      type="number"
                      value={entry.amount}
                      onChange={e => updateAmount(entry.id, e.target.value)}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-6 pr-2 py-1.5 text-white text-xs text-right focus:outline-none focus:border-violet-500 transition-colors"
                      min="0"
                    />
                  </div>
                  <button
                    onClick={() => removeEntry(entry.id)}
                    className="opacity-0 group-hover:opacity-100 text-gray-600 hover:text-red-400 transition-all flex-shrink-0"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Add New Expense */}
          <div className="pt-2 border-t border-gray-800">
            <p className="text-xs text-gray-500 mb-2 font-medium uppercase tracking-wider">Add Expense</p>
            <div className="flex gap-2 mb-2">
              <select
                value={newCategory}
                onChange={e => setNewCategory(e.target.value)}
                className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-2.5 py-2 text-sm text-gray-300 focus:outline-none focus:border-violet-500 transition-colors min-w-0"
              >
                <option value="">Select category…</option>
                {PRESET_CATEGORIES.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
                <option value="custom">Custom…</option>
              </select>
              <div className="relative w-28 flex-shrink-0">
                <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-500 text-xs">$</span>
                <input
                  type="number"
                  value={newAmount}
                  onChange={e => setNewAmount(e.target.value)}
                  placeholder="0"
                  min="0"
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-6 pr-2 py-2 text-white text-sm text-right focus:outline-none focus:border-violet-500 transition-colors"
                  onKeyDown={e => e.key === 'Enter' && addEntry()}
                />
              </div>
            </div>
            {newCategory === 'custom' && (
              <input
                type="text"
                placeholder="Category name…"
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-violet-500 transition-colors mb-2"
                onChange={e => setNewCategory(e.target.value)}
                autoFocus
              />
            )}
            <button
              onClick={addEntry}
              disabled={!newCategory || !newAmount}
              className="w-full flex items-center justify-center gap-2 bg-violet-600 hover:bg-violet-500 disabled:bg-gray-800 disabled:text-gray-600 disabled:cursor-not-allowed text-white text-sm font-medium rounded-lg py-2 transition-colors"
            >
              <Plus size={14} />
              Add Expense
            </button>
          </div>
        </div>

        {/* ── Right: Chart + Summary ── */}
        <div className="p-5 flex flex-col">
          {entries.length === 0 ? (
            <div className="flex-1 flex items-center justify-center text-gray-600 text-sm">
              Add expenses to see your chart
            </div>
          ) : (
            <>
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={85}
                    paddingAngle={3}
                    dataKey="value"
                    strokeWidth={0}
                  >
                    {chartData.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend
                    iconType="circle"
                    iconSize={8}
                    formatter={(value) => (
                      <span className="text-gray-400 text-xs">{value}</span>
                    )}
                  />
                </PieChart>
              </ResponsiveContainer>

              {/* Summary Cards */}
              <div className="grid grid-cols-3 gap-2 mt-3">
                <div className="bg-gray-800/60 rounded-xl p-3 text-center">
                  <p className="text-xs text-gray-500 mb-1">Income</p>
                  <p className="text-sm font-bold text-white">${incomeN.toLocaleString()}</p>
                </div>
                <div className="bg-gray-800/60 rounded-xl p-3 text-center">
                  <p className="text-xs text-gray-500 mb-1">Expenses</p>
                  <p className="text-sm font-bold text-red-400">${total.toLocaleString()}</p>
                </div>
                <div className={`rounded-xl p-3 text-center ${savings >= 0 ? 'bg-emerald-500/10' : 'bg-red-500/10'}`}>
                  <p className="text-xs text-gray-500 mb-1">Savings</p>
                  <p className={`text-sm font-bold flex items-center justify-center gap-1 ${savings >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                    <TrendingUp size={11} />
                    ${Math.abs(savings).toLocaleString()}
                  </p>
                </div>
              </div>

              {/* Savings rate bar */}
              {incomeN > 0 && (
                <div className="mt-3">
                  <div className="flex justify-between text-xs text-gray-500 mb-1.5">
                    <span>Spending rate</span>
                    <span className={total > incomeN ? 'text-red-400' : 'text-emerald-400'}>
                      {Math.min(Math.round((total / incomeN) * 100), 100)}%
                    </span>
                  </div>
                  <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${total > incomeN ? 'bg-red-500' : 'bg-emerald-500'}`}
                      style={{ width: `${Math.min((total / incomeN) * 100, 100)}%` }}
                    />
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}