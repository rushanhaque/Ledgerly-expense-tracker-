import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { useExpenseStore } from '../../store/expenseStore';
import { Repeat, Plus, Edit2, Trash2, Play, Pause } from 'lucide-react';
import { Expense, CategoryType } from '../../types';

interface RecurringExpense {
  id: string;
  templateExpense: Omit<Expense, 'id' | 'date'>;
  frequency: 'daily' | 'weekly' | 'monthly' | 'yearly';
  startDate: Date;
  endDate?: Date;
  isActive: boolean;
  lastGenerated?: Date;
}

export function RecurringExpenseManager() {
  const addExpense = useExpenseStore((state) => state.addExpense);
  const [recurringExpenses, setRecurringExpenses] = useState<RecurringExpense[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);

  const [formData, setFormData] = useState({
    amount: '',
    category: 'Food & Dining' as CategoryType,
    description: '',
    paymentMethod: 'Cash',
    frequency: 'monthly' as 'daily' | 'weekly' | 'monthly' | 'yearly',
    startDate: new Date().toISOString().split('T')[0],
    endDate: '',
  });

  const categories: CategoryType[] = [
    'Bills & Utilities',
    'Subscriptions',
    'Food & Dining',
    'Transportation',
    'Healthcare',
    'Other',
  ];

  const handleAddRecurring = (e: React.FormEvent) => {
    e.preventDefault();

    const recurring: RecurringExpense = {
      id: `recurring-${Date.now()}`,
      templateExpense: {
        amount: parseFloat(formData.amount),
        category: formData.category,
        description: formData.description,
        paymentMethod: formData.paymentMethod,
        tags: ['recurring'],
        isRecurring: true,
        recurringFrequency: formData.frequency,
      },
      frequency: formData.frequency,
      startDate: new Date(formData.startDate),
      endDate: formData.endDate ? new Date(formData.endDate) : undefined,
      isActive: true,
    };

    setRecurringExpenses([...recurringExpenses, recurring]);
    setShowAddForm(false);
    setFormData({
      amount: '',
      category: 'Bills & Utilities',
      description: '',
      paymentMethod: 'Cash',
      frequency: 'monthly',
      startDate: new Date().toISOString().split('T')[0],
      endDate: '',
    });
  };

  const toggleRecurring = (id: string) => {
    setRecurringExpenses(
      recurringExpenses.map((r) =>
        r.id === id ? { ...r, isActive: !r.isActive } : r
      )
    );
  };

  const deleteRecurring = (id: string) => {
    setRecurringExpenses(recurringExpenses.filter((r) => r.id !== id));
  };

  const generateExpenseNow = (recurring: RecurringExpense) => {
    const expense: Expense = {
      id: `exp-${Date.now()}-recurring`,
      ...recurring.templateExpense,
      date: new Date(),
    };

    addExpense(expense);

    // Update last generated
    setRecurringExpenses(
      recurringExpenses.map((r) =>
        r.id === recurring.id ? { ...r, lastGenerated: new Date() } : r
      )
    );
  };

  const getFrequencyLabel = (frequency: string) => {
    const labels = {
      daily: 'Every Day',
      weekly: 'Every Week',
      monthly: 'Every Month',
      yearly: 'Every Year',
    };
    return labels[frequency as keyof typeof labels];
  };

  const getNextDueDate = (recurring: RecurringExpense): Date => {
    const last = recurring.lastGenerated || recurring.startDate;
    const next = new Date(last);

    switch (recurring.frequency) {
      case 'daily':
        next.setDate(next.getDate() + 1);
        break;
      case 'weekly':
        next.setDate(next.getDate() + 7);
        break;
      case 'monthly':
        next.setMonth(next.getMonth() + 1);
        break;
      case 'yearly':
        next.setFullYear(next.getFullYear() + 1);
        break;
    }

    return next;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl">
            <Repeat className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">Recurring Expenses</h2>
            <p className="text-white/60 text-sm">Automate regular payments</p>
          </div>
        </div>

        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="btn btn-primary flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Add Recurring
        </button>
      </div>

      {/* Add Form */}
      <AnimatePresence>
        {showAddForm && (
          <motion.form
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            onSubmit={handleAddRecurring}
            className="glass-dark rounded-xl p-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-white/80 mb-2">Description</label>
                <input
                  type="text"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="input"
                  placeholder="e.g., Netflix Subscription"
                  required
                />
              </div>

              <div>
                <label className="block text-white/80 mb-2">Amount ($)</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  className="input"
                  placeholder="15.99"
                  required
                />
              </div>

              <div>
                <label className="block text-white/80 mb-2">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value as CategoryType })}
                  className="input"
                  required
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-white/80 mb-2">Frequency</label>
                <select
                  value={formData.frequency}
                  onChange={(e) => setFormData({ ...formData, frequency: e.target.value as any })}
                  className="input"
                  required
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                  <option value="yearly">Yearly</option>
                </select>
              </div>

              <div>
                <label className="block text-white/80 mb-2">Start Date</label>
                <input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  className="input"
                  required
                />
              </div>

              <div>
                <label className="block text-white/80 mb-2">End Date (Optional)</label>
                <input
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  className="input"
                />
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
              <button type="submit" className="flex-1 btn btn-primary">
                Add Recurring Expense
              </button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      {/* Recurring Expenses List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {recurringExpenses.length === 0 ? (
          <div className="glass-dark rounded-xl p-8 text-center col-span-full">
            <Repeat className="w-12 h-12 text-white/40 mx-auto mb-3" />
            <p className="text-white/60">
              No recurring expenses set. Add subscriptions, bills, or regular payments!
            </p>
          </div>
        ) : (
          recurringExpenses.map((recurring) => {
            const nextDue = getNextDueDate(recurring);
            const daysUntilDue = Math.ceil(
              (nextDue.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
            );

            return (
              <motion.div
                key={recurring.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass-dark rounded-xl p-5 relative overflow-hidden"
              >
                <div className={`absolute top-0 left-0 right-0 h-1 ${
                  recurring.isActive ? 'bg-green-500' : 'bg-gray-500'
                }`} />

                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-white">
                      {recurring.templateExpense.description}
                    </h3>
                    <p className="text-white/60 text-sm">
                      {recurring.templateExpense.category}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleRecurring(recurring.id)}
                      className={`p-2 rounded-lg transition-colors ${
                        recurring.isActive
                          ? 'bg-green-500/20 hover:bg-green-500/30'
                          : 'bg-gray-500/20 hover:bg-gray-500/30'
                      }`}
                    >
                      {recurring.isActive ? (
                        <Pause className="w-4 h-4 text-green-400" />
                      ) : (
                        <Play className="w-4 h-4 text-gray-400" />
                      )}
                    </button>

                    <button
                      onClick={() => deleteRecurring(recurring.id)}
                      className="p-2 hover:bg-red-500/20 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4 text-red-400" />
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-white/60 text-sm">Amount</span>
                    <span className="text-white font-semibold text-lg">
                      ${recurring.templateExpense.amount.toFixed(2)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-white/60 text-sm">Frequency</span>
                    <span className="text-white text-sm">
                      {getFrequencyLabel(recurring.frequency)}
                    </span>
                  </div>

                  {recurring.isActive && (
                    <div className="flex items-center justify-between">
                      <span className="text-white/60 text-sm">Next Due</span>
                      <span className="text-green-400 text-sm font-medium">
                        {daysUntilDue > 0
                          ? `In ${daysUntilDue} day${daysUntilDue !== 1 ? 's' : ''}`
                          : 'Today'}
                      </span>
                    </div>
                  )}

                  <button
                    onClick={() => generateExpenseNow(recurring)}
                    className="w-full mt-3 px-4 py-2 rounded-lg bg-blue-500/20 text-blue-300 hover:bg-blue-500/30 transition-colors flex items-center justify-center gap-2 text-sm font-medium"
                  >
                    <Plus className="w-4 h-4" />
                    Add Expense Now
                  </button>
                </div>
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
}
