import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { useExpenseStore } from '../../store/expenseStore';
import { ShoppingBag, TrendingDown, TrendingUp, AlertCircle, CheckCircle, XCircle } from 'lucide-react';
import { startOfMonth, endOfMonth } from 'date-fns';

interface PurchaseAdvice {
  recommendation: 'buy' | 'reconsider' | 'avoid';
  score: number;
  reasons: string[];
  alternatives?: string[];
  financialImpact: {
    percentOfMonthlySpending: number;
    percentOfBudget?: number;
    daysOfSavingsRequired: number;
  };
}

export function PurchaseAdvisor() {
  const expenses = useExpenseStore((state) => state.expenses);
  const budgets = useExpenseStore((state) => state.budgets);
  const goals = useExpenseStore((state) => state.goals);

  const [formData, setFormData] = useState({
    itemName: '',
    description: '',
    price: '',
    need: 'want' as 'need' | 'want',
  });

  const [advice, setAdvice] = useState<PurchaseAdvice | null>(null);
  const [showResult, setShowResult] = useState(false);

  const analyzePurchase = (e: React.FormEvent) => {
    e.preventDefault();
    
    const price = parseFloat(formData.price);
    
    // Calculate monthly spending
    const monthStart = startOfMonth(new Date());
    const monthEnd = endOfMonth(new Date());
    const monthlyExpenses = expenses.filter(exp => {
      const expDate = new Date(exp.date);
      return expDate >= monthStart && expDate <= monthEnd;
    });
    const monthlyTotal = monthlyExpenses.reduce((sum, exp) => sum + exp.amount, 0);
    
    // Calculate daily average
    const avgDailySpending = monthlyTotal / new Date().getDate();
    const daysOfSavingsRequired = Math.ceil(price / (avgDailySpending || 1));
    
    // Calculate percentage of monthly spending
    const percentOfMonthly = monthlyTotal > 0 ? (price / monthlyTotal) * 100 : 0;
    
    // Scoring system (0-100)
    let score = 50; // Start neutral
    const reasons: string[] = [];
    const alternatives: string[] = [];
    
    // Factor 1: Need vs Want
    if (formData.need === 'need') {
      score += 20;
      reasons.push('✓ Essential item - necessary for daily life');
    } else {
      score -= 10;
      reasons.push('⚠ Non-essential item - consider if it aligns with your goals');
    }
    
    // Factor 2: Price relative to monthly spending
    if (percentOfMonthly < 5) {
      score += 15;
      reasons.push('✓ Low impact on monthly budget (<5%)');
    } else if (percentOfMonthly < 15) {
      score += 5;
      reasons.push('⚠ Moderate impact on monthly budget (5-15%)');
    } else if (percentOfMonthly < 30) {
      score -= 10;
      reasons.push('⚠ Significant impact on monthly budget (15-30%)');
    } else {
      score -= 25;
      reasons.push('✗ Major impact on monthly budget (>30%)');
      alternatives.push('Consider saving for this purchase over 2-3 months');
    }
    
    // Factor 3: Budget analysis
    const relevantBudgets = budgets.filter(b => b.limit > 0);
    if (relevantBudgets.length > 0) {
      const totalBudgetLimit = relevantBudgets.reduce((sum, b) => sum + b.limit, 0);
      const percentOfBudget = (price / totalBudgetLimit) * 100;
      
      if (percentOfBudget < 10) {
        score += 10;
        reasons.push('✓ Well within your budget limits');
      } else if (percentOfBudget < 25) {
        score -= 5;
        reasons.push('⚠ Will consume a notable portion of your budget');
      } else {
        score -= 15;
        reasons.push('✗ May exceed your budget limits');
        alternatives.push('Review and adjust your budgets before purchasing');
      }
    }
    
    // Factor 4: Financial goals
    const activeGoals = goals.filter(g => g.status === 'active');
    if (activeGoals.length > 0) {
      const totalGoalDeficit = activeGoals.reduce((sum, g) => 
        sum + (g.targetAmount - g.currentAmount), 0
      );
      
      if (price < totalGoalDeficit * 0.05) {
        score += 10;
        reasons.push('✓ Won\'t significantly impact your financial goals');
      } else if (price < totalGoalDeficit * 0.15) {
        score -= 5;
        reasons.push('⚠ May slow progress toward your financial goals');
      } else {
        score -= 20;
        reasons.push('✗ Could significantly delay your financial goals');
        alternatives.push(`Consider allocating to your goals: ${activeGoals.map(g => g.name).join(', ')}`);
      }
    } else {
      score -= 5;
      reasons.push('⚠ No financial goals set - consider setting savings targets');
    }
    
    // Factor 5: Spending pattern
    if (monthlyExpenses.length > 0) {
      const smallPurchases = monthlyExpenses.filter(exp => exp.amount < 50);
      if (smallPurchases.length > 15) {
        score -= 10;
        reasons.push('⚠ You have many small purchases - consider reducing impulse buying');
        alternatives.push('Wait 24-48 hours before making this purchase to avoid impulse buying');
      }
    }
    
    // Factor 6: Emergency fund consideration
    const savingsGoals = goals.filter(g => 
      g.name.toLowerCase().includes('emergency') || 
      g.name.toLowerCase().includes('savings')
    );
    
    if (savingsGoals.length === 0 && formData.need === 'want') {
      score -= 10;
      reasons.push('⚠ Consider building an emergency fund before non-essential purchases');
      alternatives.push('Set up an emergency fund goal first');
    }
    
    // Determine recommendation
    let recommendation: 'buy' | 'reconsider' | 'avoid';
    if (score >= 70) {
      recommendation = 'buy';
    } else if (score >= 40) {
      recommendation = 'reconsider';
    } else {
      recommendation = 'avoid';
    }
    
    // Add financial literacy tips
    if (daysOfSavingsRequired > 30 && formData.need === 'want') {
      alternatives.push('This would require over a month of your average daily spending');
    }
    
    if (recommendation === 'buy' && formData.need === 'want') {
      alternatives.push('Even though you can afford it, ensure it aligns with your long-term goals');
    }
    
    setAdvice({
      recommendation,
      score: Math.max(0, Math.min(100, score)),
      reasons,
      alternatives: alternatives.length > 0 ? alternatives : undefined,
      financialImpact: {
        percentOfMonthlySpending: percentOfMonthly,
        daysOfSavingsRequired,
      },
    });
    
    setShowResult(true);
  };

  const resetForm = () => {
    setFormData({
      itemName: '',
      description: '',
      price: '',
      need: 'want',
    });
    setAdvice(null);
    setShowResult(false);
  };

  const getRecommendationColor = (rec: string) => {
    switch (rec) {
      case 'buy':
        return 'from-green-500 to-emerald-600';
      case 'reconsider':
        return 'from-yellow-500 to-orange-500';
      case 'avoid':
        return 'from-red-500 to-pink-600';
      default:
        return 'from-gray-500 to-gray-600';
    }
  };

  const getRecommendationIcon = (rec: string) => {
    switch (rec) {
      case 'buy':
        return <CheckCircle className="w-12 h-12 text-green-400" />;
      case 'reconsider':
        return <AlertCircle className="w-12 h-12 text-yellow-400" />;
      case 'avoid':
        return <XCircle className="w-12 h-12 text-red-400" />;
      default:
        return <ShoppingBag className="w-12 h-12 text-gray-400" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl">
          <ShoppingBag className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white">Smart Purchase Advisor</h2>
          <p className="text-white/60 text-sm">Make informed buying decisions</p>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-dark rounded-2xl p-6"
      >
        <AnimatePresence mode="wait">
          {!showResult ? (
            <motion.form
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onSubmit={analyzePurchase}
              className="space-y-6"
            >
              <div>
                <label className="block text-white/80 mb-2 font-medium">
                  Item Name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={formData.itemName}
                  onChange={(e) => setFormData({ ...formData, itemName: e.target.value })}
                  className="input"
                  placeholder="e.g., New Headphones, Gaming Console"
                  required
                />
              </div>

              <div>
                <label className="block text-white/80 mb-2 font-medium">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="input min-h-[100px] resize-none"
                  placeholder="Describe the item and why you want/need it..."
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-white/80 mb-2 font-medium">
                    Price ($) <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="input"
                    placeholder="199.99"
                    required
                  />
                </div>

                <div>
                  <label className="block text-white/80 mb-2 font-medium">
                    Is this a Need or Want? <span className="text-red-400">*</span>
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, need: 'need' })}
                      className={`px-4 py-3 rounded-lg font-semibold transition-all ${
                        formData.need === 'need'
                          ? 'bg-gradient-to-r from-blue-500 to-cyan-600 text-white shadow-lg'
                          : 'bg-white/10 text-white/70 hover:bg-white/20'
                      }`}
                    >
                      Need
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, need: 'want' })}
                      className={`px-4 py-3 rounded-lg font-semibold transition-all ${
                        formData.need === 'want'
                          ? 'bg-gradient-to-r from-purple-500 to-pink-600 text-white shadow-lg'
                          : 'bg-white/10 text-white/70 hover:bg-white/20'
                      }`}
                    >
                      Want
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 btn bg-gradient-to-r from-purple-500 to-pink-600 text-white flex items-center justify-center gap-2"
                >
                  <TrendingUp className="w-5 h-5" />
                  Get Purchase Advice
                </button>
              </div>

              <div className="mt-4 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                <p className="text-blue-300 text-sm">
                  <strong>How it works:</strong> Our smart advisor analyzes your spending patterns, 
                  budgets, and financial goals to provide personalized recommendations.
                </p>
              </div>
            </motion.form>
          ) : (
            <motion.div
              key="result"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="space-y-6"
            >
              {/* Recommendation Header */}
              <div className={`bg-gradient-to-r ${getRecommendationColor(advice!.recommendation)} rounded-xl p-6 text-center`}>
                <div className="flex justify-center mb-4">
                  {getRecommendationIcon(advice!.recommendation)}
                </div>
                <h3 className="text-2xl font-bold text-white mb-2 capitalize">
                  {advice!.recommendation === 'buy' && 'Go Ahead!'}
                  {advice!.recommendation === 'reconsider' && 'Think It Over'}
                  {advice!.recommendation === 'avoid' && 'Better to Wait'}
                </h3>
                <p className="text-white/90 text-lg">
                  {formData.itemName}
                </p>
                <div className="mt-4">
                  <div className="text-white/80 text-sm mb-2">Confidence Score</div>
                  <div className="relative h-4 bg-white/20 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${advice!.score}%` }}
                      transition={{ duration: 1, ease: 'easeOut' }}
                      className="absolute top-0 left-0 h-full bg-white rounded-full"
                    />
                  </div>
                  <div className="text-white font-bold text-2xl mt-2">
                    {advice!.score.toFixed(0)}%
                  </div>
                </div>
              </div>

              {/* Financial Impact */}
              <div className="glass-light rounded-xl p-5">
                <h4 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <TrendingDown className="w-5 h-5" />
                  Financial Impact
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white/5 rounded-lg p-4">
                    <p className="text-white/60 text-sm mb-1">% of Monthly Spending</p>
                    <p className="text-2xl font-bold text-white">
                      {advice!.financialImpact.percentOfMonthlySpending.toFixed(1)}%
                    </p>
                  </div>
                  <div className="bg-white/5 rounded-lg p-4">
                    <p className="text-white/60 text-sm mb-1">Days of Savings</p>
                    <p className="text-2xl font-bold text-white">
                      {advice!.financialImpact.daysOfSavingsRequired}
                    </p>
                  </div>
                </div>
              </div>

              {/* Analysis Reasons */}
              <div className="glass-light rounded-xl p-5">
                <h4 className="text-lg font-bold text-white mb-4">Analysis</h4>
                <ul className="space-y-3">
                  {advice!.reasons.map((reason, index) => (
                    <motion.li
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-start gap-3 text-white/80"
                    >
                      <span className="text-lg mt-0.5">
                        {reason.startsWith('✓') ? '✅' : reason.startsWith('✗') ? '❌' : '⚠️'}
                      </span>
                      <span>{reason.replace(/^[✓✗⚠]\s*/, '')}</span>
                    </motion.li>
                  ))}
                </ul>
              </div>

              {/* Alternatives & Suggestions */}
              {advice!.alternatives && advice!.alternatives.length > 0 && (
                <div className="glass-light rounded-xl p-5 border-l-4 border-yellow-500">
                  <h4 className="text-lg font-bold text-white mb-4">💡 Suggestions</h4>
                  <ul className="space-y-2">
                    {advice!.alternatives.map((alt, index) => (
                      <motion.li
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 + index * 0.1 }}
                        className="text-yellow-300 flex items-start gap-2"
                      >
                        <span className="mt-1">•</span>
                        <span>{alt}</span>
                      </motion.li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Item Details */}
              {formData.description && (
                <div className="glass-light rounded-xl p-5">
                  <h4 className="text-lg font-bold text-white mb-3">Item Details</h4>
                  <div className="space-y-2 text-white/80">
                    <p><strong>Price:</strong> ${formData.price}</p>
                    <p><strong>Category:</strong> {formData.need === 'need' ? 'Essential Need' : 'Discretionary Want'}</p>
                    <p><strong>Description:</strong> {formData.description}</p>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  onClick={resetForm}
                  className="flex-1 px-6 py-3 rounded-lg bg-white/10 text-white font-semibold hover:bg-white/20 transition-colors"
                >
                  Analyze Another Item
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
