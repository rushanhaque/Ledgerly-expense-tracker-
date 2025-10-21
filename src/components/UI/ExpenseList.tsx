import { motion } from 'framer-motion';
import { useExpenseStore } from '../../store/expenseStore';
import { Trash2, MapPin, Tag as TagIcon } from 'lucide-react';
import { CATEGORY_COLORS, CATEGORY_ICONS, CategoryType } from '../../types';
import { format } from 'date-fns';

export function ExpenseList() {
  const expenses = useExpenseStore((state) => state.expenses);
  const deleteExpense = useExpenseStore((state) => state.deleteExpense);

  const sortedExpenses = [...expenses].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-white mb-4">Recent Expenses</h2>
      
      {sortedExpenses.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="glass-dark rounded-xl p-8 text-center"
        >
          <p className="text-white/60">No expenses yet. Add your first expense to get started!</p>
        </motion.div>
      ) : (
        <div className="space-y-3">
          {sortedExpenses.slice(0, 10).map((expense, index) => (
            <motion.div
              key={expense.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ scale: 1.02 }}
              className="glass-dark rounded-xl p-4 relative overflow-hidden group"
            >
              {/* Category color indicator */}
              <div
                className="absolute left-0 top-0 bottom-0 w-1"
                style={{ backgroundColor: CATEGORY_COLORS[expense.category as CategoryType] }}
              />

              <div className="flex items-center justify-between ml-4">
                <div className="flex items-center gap-4 flex-1">
                  {/* Icon */}
                  <div
                    className="text-3xl p-3 rounded-lg"
                    style={{ backgroundColor: `${CATEGORY_COLORS[expense.category as CategoryType]}20` }}
                  >
                    {CATEGORY_ICONS[expense.category as CategoryType]}
                  </div>

                  {/* Details */}
                  <div className="flex-1">
                    <h3 className="text-white font-semibold">{expense.description}</h3>
                    <div className="flex items-center gap-3 mt-1 text-sm text-white/60">
                      <span>{expense.category}</span>
                      <span>•</span>
                      <span>{format(new Date(expense.date), 'MMM dd, yyyy')}</span>
                      <span>•</span>
                      <span>{expense.paymentMethod}</span>
                    </div>
                    
                    {/* Tags and Location */}
                    <div className="flex items-center gap-2 mt-2">
                      {expense.location && (
                        <div className="flex items-center gap-1 px-2 py-1 bg-white/10 rounded text-xs text-white/70">
                          <MapPin className="w-3 h-3" />
                          {expense.location}
                        </div>
                      )}
                      {expense.tags.map((tag) => (
                        <div key={tag} className="flex items-center gap-1 px-2 py-1 bg-white/10 rounded text-xs text-white/70">
                          <TagIcon className="w-3 h-3" />
                          {tag}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Amount and Actions */}
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-2xl font-bold text-white">
                      ${expense.amount.toFixed(2)}
                    </p>
                  </div>

                  <button
                    onClick={() => deleteExpense(expense.id)}
                    className="p-2 hover:bg-red-500/20 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 className="w-5 h-5 text-red-400" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
