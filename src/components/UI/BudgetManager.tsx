import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { useExpenseStore } from '../../store/expenseStore';
import { Target, Plus, Edit2, Trash2, TrendingUp } from 'lucide-react';
import { Budget, CategoryType } from '../../types';

export function BudgetManager() {
  const budgets = useExpenseStore((state) => state.budgets);
  const expenses = useExpenseStore((state) => state.expenses);
  const addBudget = useExpenseStore((state) => state.addBudget);
  const deleteBudget = useExpenseStore((state) => state.deleteBudget);
  const [showAddForm, setShowAddForm] = useState(false);

  const [formData, setFormData] = useState({
    category: 'Food & Dining' as CategoryType,
    limit: '',
    period: 'monthly' as 'daily' | 'weekly' | 'monthly' | 'yearly',
  });

  const categories: CategoryType[] = [
    'Food & Dining',
    'Transportation',
    'Shopping',
    'Entertainment',
    'Bills & Utilities',
    'Healthcare',
    'Education',
    'Travel',
  ];

  const handleAddBudget = (e: React.FormEvent) => {
    e.preventDefault();
    
    const budget: Budget = {
      id: `budget-${Date.now()}`,
      category: formData.category,
      limit: parseFloat(formData.limit),
      period: formData.period,
      spent: 0,
      startDate: new Date(),
      endDate: new Date(new Date().setMonth(new Date().getMonth() + 1)),
      alerts: true,
      alertThreshold: 80,
    };

    addBudget(budget);
    setShowAddForm(false);
    setFormData({
      category: 'Food & Dining',
      limit: '',
      period: 'monthly',
    });
  };

  // Calculate spent amount for each budget
  const getBudgetSpent = (budget: Budget) => {
    return expenses
      .filter(exp => exp.category === budget.category)
      .reduce((sum, exp) => sum + exp.amount, 0);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl">
            <Target className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">Budget Manager</h2>
            <p className="text-white/60 text-sm">Track your spending limits</p>
          </div>
        </div>

        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="btn btn-success flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Add Budget
        </button>
      </div>

      {/* Add Budget Form */}
      <AnimatePresence>
        {showAddForm && (
          <motion.form
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            onSubmit={handleAddBudget}
            className="glass-dark rounded-xl p-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-white/80 mb-2">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value as CategoryType })}
                  className="input"
                  required
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-white/80 mb-2">Limit ($)</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.limit}
                  onChange={(e) => setFormData({ ...formData, limit: e.target.value })}
                  className="input"
                  placeholder="500.00"
                  required
                />
              </div>

              <div>
                <label className="block text-white/80 mb-2">Period</label>
                <select
                  value={formData.period}
                  onChange={(e) => setFormData({ ...formData, period: e.target.value as any })}
                  className="input"
                  required
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                  <option value="yearly">Yearly</option>
                </select>
              </div>
            </div>

            <div className="flex gap-3 mt-4">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="flex-1 px-6 py-3 rounded-lg bg-white/10 text-white font-semibold hover:bg-white/20 transition-colors"
              >
                Cancel
              </button>
              <button type="submit" className="flex-1 btn btn-success">
                Add Budget
              </button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      {/* Budget List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {budgets.length === 0 ? (
          <div className="glass-dark rounded-xl p-8 text-center col-span-full">
            <Target className="w-12 h-12 text-white/40 mx-auto mb-3" />
            <p className="text-white/60">No budgets set. Create one to start tracking!</p>
          </div>
        ) : (
          budgets.map((budget) => {
            const spent = getBudgetSpent(budget);
            const percentage = (spent / budget.limit) * 100;
            const isOverBudget = spent > budget.limit;
            const isNearLimit = percentage > budget.alertThreshold && !isOverBudget;

            return (
              <motion.div
                key={budget.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.02 }}
                className="glass-dark rounded-xl p-6 relative overflow-hidden"
              >
                {/* Status indicator */}
                <div
                  className={`absolute top-0 left-0 right-0 h-1 ${
                    isOverBudget
                      ? 'bg-red-500'
                      : isNearLimit
                      ? 'bg-yellow-500'
                      : 'bg-green-500'
                  }`}
                />

                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-white">{budget.category}</h3>
                    <p className="text-white/60 text-sm capitalize">{budget.period}</p>
                  </div>

                  <button
                    onClick={() => deleteBudget(budget.id)}
                    className="p-2 hover:bg-red-500/20 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4 text-red-400" />
                  </button>
                </div>

                <div className="space-y-3">
                  <div className="flex items-end justify-between">
                    <div>
                      <p className="text-white/60 text-sm">Spent</p>
                      <p className="text-2xl font-bold text-white">
                        ${spent.toFixed(2)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-white/60 text-sm">Limit</p>
                      <p className="text-xl font-semibold text-white/80">
                        ${budget.limit.toFixed(2)}
                      </p>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="relative h-3 bg-white/10 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(percentage, 100)}%` }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                      className={`absolute top-0 left-0 h-full rounded-full ${
                        isOverBudget
                          ? 'bg-gradient-to-r from-red-500 to-red-600'
                          : isNearLimit
                          ? 'bg-gradient-to-r from-yellow-500 to-orange-500'
                          : 'bg-gradient-to-r from-green-500 to-emerald-500'
                      }`}
                    />
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className={`font-semibold ${
                      isOverBudget
                        ? 'text-red-400'
                        : isNearLimit
                        ? 'text-yellow-400'
                        : 'text-green-400'
                    }`}>
                      {percentage.toFixed(1)}% used
                    </span>
                    <span className="text-white/60">
                      ${(budget.limit - spent).toFixed(2)} remaining
                    </span>
                  </div>

                  {isOverBudget && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="mt-3 p-3 bg-red-500/20 rounded-lg text-red-300 text-sm"
                    >
                      ⚠️ Budget exceeded by ${(spent - budget.limit).toFixed(2)}
                    </motion.div>
                  )}

                  {isNearLimit && !isOverBudget && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="mt-3 p-3 bg-yellow-500/20 rounded-lg text-yellow-300 text-sm"
                    >
                      ⚡ Approaching budget limit
                    </motion.div>
                  )}
                </div>
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
}
