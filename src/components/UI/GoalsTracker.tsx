import { motion } from 'framer-motion';
import { useState } from 'react';
import { useExpenseStore } from '../../store/expenseStore';
import { Trophy, Plus, Trash2, Clock, CheckCircle } from 'lucide-react';
import { FinancialGoal } from '../../types';
import { format, differenceInDays } from 'date-fns';

export function GoalsTracker() {
  const goals = useExpenseStore((state) => state.goals);
  const addGoal = useExpenseStore((state) => state.addGoal);
  const deleteGoal = useExpenseStore((state) => state.deleteGoal);
  const [showAddForm, setShowAddForm] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    targetAmount: '',
    currentAmount: '',
    deadline: '',
    category: 'Savings',
    priority: 'medium' as 'low' | 'medium' | 'high',
  });

  const handleAddGoal = (e: React.FormEvent) => {
    e.preventDefault();
    
    const goal: FinancialGoal = {
      id: `goal-${Date.now()}`,
      name: formData.name,
      targetAmount: parseFloat(formData.targetAmount),
      currentAmount: parseFloat(formData.currentAmount || '0'),
      deadline: new Date(formData.deadline),
      category: formData.category,
      priority: formData.priority,
      status: 'active',
    };

    addGoal(goal);
    setShowAddForm(false);
    setFormData({
      name: '',
      targetAmount: '',
      currentAmount: '',
      deadline: '',
      category: 'Savings',
      priority: 'medium',
    });
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'from-red-500 to-orange-500';
      case 'medium':
        return 'from-yellow-500 to-orange-500';
      case 'low':
        return 'from-blue-500 to-cyan-500';
      default:
        return 'from-gray-500 to-gray-600';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl">
            <Trophy className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">Financial Goals</h2>
            <p className="text-white/60 text-sm">Track your savings targets</p>
          </div>
        </div>

        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="btn btn-secondary flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Add Goal
        </button>
      </div>

      {/* Add Goal Form */}
      {showAddForm && (
        <motion.form
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          onSubmit={handleAddGoal}
          className="glass-dark rounded-xl p-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-white/80 mb-2">Goal Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="input"
                placeholder="e.g., Emergency Fund"
                required
              />
            </div>

            <div>
              <label className="block text-white/80 mb-2">Target Amount ($)</label>
              <input
                type="number"
                step="0.01"
                value={formData.targetAmount}
                onChange={(e) => setFormData({ ...formData, targetAmount: e.target.value })}
                className="input"
                placeholder="10000.00"
                required
              />
            </div>

            <div>
              <label className="block text-white/80 mb-2">Current Amount ($)</label>
              <input
                type="number"
                step="0.01"
                value={formData.currentAmount}
                onChange={(e) => setFormData({ ...formData, currentAmount: e.target.value })}
                className="input"
                placeholder="0.00"
              />
            </div>

            <div>
              <label className="block text-white/80 mb-2">Deadline</label>
              <input
                type="date"
                value={formData.deadline}
                onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                className="input"
                required
              />
            </div>

            <div>
              <label className="block text-white/80 mb-2">Category</label>
              <input
                type="text"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="input"
                placeholder="e.g., Savings, Investment"
              />
            </div>

            <div>
              <label className="block text-white/80 mb-2">Priority</label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value as any })}
                className="input"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
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
            <button type="submit" className="flex-1 btn btn-secondary">
              Add Goal
            </button>
          </div>
        </motion.form>
      )}

      {/* Goals List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {goals.length === 0 ? (
          <div className="glass-dark rounded-xl p-8 text-center col-span-full">
            <Trophy className="w-12 h-12 text-white/40 mx-auto mb-3" />
            <p className="text-white/60">No goals set. Create one to start saving!</p>
          </div>
        ) : (
          goals.map((goal) => {
            const percentage = (goal.currentAmount / goal.targetAmount) * 100;
            const isCompleted = goal.currentAmount >= goal.targetAmount;
            const daysLeft = differenceInDays(new Date(goal.deadline), new Date());
            const isPastDeadline = daysLeft < 0;

            return (
              <motion.div
                key={goal.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.02 }}
                className="glass-dark rounded-xl p-6 relative overflow-hidden"
              >
                {/* Priority indicator */}
                <div
                  className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${getPriorityColor(
                    goal.priority
                  )}`}
                />

                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-xl font-bold text-white">{goal.name}</h3>
                      {isCompleted && (
                        <CheckCircle className="w-5 h-5 text-green-400" />
                      )}
                    </div>
                    <p className="text-white/60 text-sm">{goal.category}</p>
                  </div>

                  <button
                    onClick={() => deleteGoal(goal.id)}
                    className="p-2 hover:bg-red-500/20 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4 text-red-400" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="flex items-end justify-between">
                    <div>
                      <p className="text-white/60 text-sm">Current</p>
                      <p className="text-2xl font-bold text-white">
                        ${goal.currentAmount.toFixed(2)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-white/60 text-sm">Target</p>
                      <p className="text-xl font-semibold text-white/80">
                        ${goal.targetAmount.toFixed(2)}
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
                        isCompleted
                          ? 'bg-gradient-to-r from-green-500 to-emerald-500'
                          : 'bg-gradient-to-r from-purple-500 to-pink-500'
                      }`}
                    />
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="font-semibold text-white">
                      {percentage.toFixed(1)}% achieved
                    </span>
                    <span className="text-white/60">
                      ${(goal.targetAmount - goal.currentAmount).toFixed(2)} to go
                    </span>
                  </div>

                  {/* Deadline info */}
                  <div className={`flex items-center gap-2 text-sm ${
                    isPastDeadline ? 'text-red-400' : 'text-white/60'
                  }`}>
                    <Clock className="w-4 h-4" />
                    {isPastDeadline ? (
                      <span>Deadline passed {Math.abs(daysLeft)} days ago</span>
                    ) : (
                      <span>
                        {daysLeft} days left • {format(new Date(goal.deadline), 'MMM dd, yyyy')}
                      </span>
                    )}
                  </div>

                  {/* Priority badge */}
                  <div className="flex items-center justify-between">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${
                      goal.priority === 'high'
                        ? 'bg-red-500/20 text-red-300'
                        : goal.priority === 'medium'
                        ? 'bg-yellow-500/20 text-yellow-300'
                        : 'bg-blue-500/20 text-blue-300'
                    }`}>
                      {goal.priority} priority
                    </span>

                    {isCompleted && (
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-500/20 text-green-300">
                        ✓ Completed
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
}
