import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { useExpenseStore } from '../../store/expenseStore';
import { X, Calendar, Tag, DollarSign, FileText, MapPin, CreditCard } from 'lucide-react';
import { Expense, CategoryType, CATEGORY_COLORS } from '../../types';

interface AddExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AddExpenseModal({ isOpen, onClose }: AddExpenseModalProps) {
  const addExpense = useExpenseStore((state) => state.addExpense);
  const [formData, setFormData] = useState({
    amount: '',
    category: 'Food & Dining' as CategoryType,
    description: '',
    date: new Date().toISOString().split('T')[0],
    paymentMethod: 'Cash',
    tags: '',
    location: '',
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
    'Investments',
    'Personal Care',
    'Subscriptions',
    'Gifts & Donations',
    'Other',
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const expense: Expense = {
      id: `exp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      amount: parseFloat(formData.amount),
      category: formData.category,
      description: formData.description,
      date: new Date(formData.date),
      paymentMethod: formData.paymentMethod,
      tags: formData.tags.split(',').map(t => t.trim()).filter(t => t),
      isRecurring: false,
      location: formData.location,
    };

    addExpense(expense);
    onClose();
    
    // Reset form
    setFormData({
      amount: '',
      category: 'Food & Dining',
      description: '',
      date: new Date().toISOString().split('T')[0],
      paymentMethod: 'Cash',
      tags: '',
      location: '',
    });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="glass-dark rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">Add New Expense</h2>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <X className="w-6 h-6 text-white" />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Amount */}
                <div>
                  <label className="block text-white/80 mb-2 flex items-center gap-2">
                    <DollarSign className="w-4 h-4" />
                    Amount
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    className="input"
                    placeholder="0.00"
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="block text-white/80 mb-2 flex items-center gap-2">
                    <Tag className="w-4 h-4" />
                    Category
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {categories.map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setFormData({ ...formData, category: cat })}
                        className={`p-3 rounded-lg text-sm font-medium transition-all ${
                          formData.category === cat
                            ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white scale-105'
                            : 'bg-white/10 text-white/70 hover:bg-white/20'
                        }`}
                        style={{
                          borderColor: CATEGORY_COLORS[cat],
                          borderWidth: formData.category === cat ? '2px' : '0',
                        }}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-white/80 mb-2 flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    Description
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="input"
                    placeholder="e.g., Lunch at restaurant"
                  />
                </div>

                {/* Date */}
                <div>
                  <label className="block text-white/80 mb-2 flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Date
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="input"
                  />
                </div>

                {/* Payment Method */}
                <div>
                  <label className="block text-white/80 mb-2 flex items-center gap-2">
                    <CreditCard className="w-4 h-4" />
                    Payment Method
                  </label>
                  <select
                    value={formData.paymentMethod}
                    onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                    className="input"
                  >
                    <option value="Cash">Cash</option>
                    <option value="Credit Card">Credit Card</option>
                    <option value="Debit Card">Debit Card</option>
                    <option value="Digital Wallet">Digital Wallet</option>
                    <option value="Bank Transfer">Bank Transfer</option>
                  </select>
                </div>

                {/* Location (Optional) */}
                <div>
                  <label className="block text-white/80 mb-2 flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    Location (Optional)
                  </label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="input"
                    placeholder="e.g., Downtown Mall"
                  />
                </div>

                {/* Tags */}
                <div>
                  <label className="block text-white/80 mb-2 flex items-center gap-2">
                    <Tag className="w-4 h-4" />
                    Tags (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={formData.tags}
                    onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                    className="input"
                    placeholder="e.g., dining, friends, special"
                  />
                </div>

                {/* Submit Button */}
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 px-6 py-3 rounded-lg bg-white/10 text-white font-semibold hover:bg-white/20 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 btn btn-primary"
                  >
                    Add Expense
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
