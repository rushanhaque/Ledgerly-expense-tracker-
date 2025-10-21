import { motion } from 'framer-motion';
import { useExpenseStore } from '../../store/expenseStore';
import { Lightbulb, TrendingUp, AlertTriangle, Trophy } from 'lucide-react';

export function InsightsPanel() {
  const insights = useExpenseStore((state) => state.insights);

  const getIcon = (type: string) => {
    switch (type) {
      case 'pattern':
        return TrendingUp;
      case 'warning':
        return AlertTriangle;
      case 'suggestion':
        return Lightbulb;
      case 'achievement':
        return Trophy;
      default:
        return Lightbulb;
    }
  };

  const getColor = (type: string) => {
    switch (type) {
      case 'pattern':
        return 'from-blue-500 to-cyan-500';
      case 'warning':
        return 'from-orange-500 to-red-500';
      case 'suggestion':
        return 'from-purple-500 to-pink-500';
      case 'achievement':
        return 'from-green-500 to-emerald-500';
      default:
        return 'from-gray-500 to-gray-600';
    }
  };

  const getImpactBadge = (impact: string) => {
    const colors = {
      low: 'bg-blue-500/20 text-blue-300',
      medium: 'bg-yellow-500/20 text-yellow-300',
      high: 'bg-red-500/20 text-red-300',
    };
    return colors[impact as keyof typeof colors] || colors.low;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl">
          <Lightbulb className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white">Smart Insights</h2>
          <p className="text-white/60 text-sm">AI-powered spending analysis</p>
        </div>
      </div>

      <div className="space-y-3">
        {insights.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="glass-dark rounded-xl p-8 text-center"
          >
            <Lightbulb className="w-12 h-12 text-white/40 mx-auto mb-3" />
            <p className="text-white/60">
              Add some expenses to get personalized insights!
            </p>
          </motion.div>
        ) : (
          insights.slice(0, 5).map((insight, index) => {
            const Icon = getIcon(insight.type);
            const colorClass = getColor(insight.type);

            return (
              <motion.div
                key={insight.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                className="glass-dark rounded-xl p-5 relative overflow-hidden group cursor-pointer"
              >
                {/* Gradient border effect */}
                <div className={`absolute inset-0 bg-gradient-to-r ${colorClass} opacity-0 group-hover:opacity-10 transition-opacity`} />

                <div className="relative z-10">
                  <div className="flex items-start gap-4">
                    <div className={`p-3 bg-gradient-to-br ${colorClass} rounded-lg flex-shrink-0`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-white font-semibold">{insight.title}</h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getImpactBadge(insight.impact)}`}>
                          {insight.impact.toUpperCase()}
                        </span>
                      </div>
                      
                      <p className="text-white/70 text-sm leading-relaxed">
                        {insight.description}
                      </p>

                      <div className="mt-3 text-xs text-white/40">
                        {new Date(insight.timestamp).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Shimmer effect on hover */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
}
