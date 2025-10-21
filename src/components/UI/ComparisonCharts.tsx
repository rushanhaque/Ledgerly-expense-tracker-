import { motion } from 'framer-motion';
import { useExpenseStore } from '../../store/expenseStore';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, LineChart, Line, CartesianGrid } from 'recharts';
import { TrendingUp, TrendingDown, Calendar } from 'lucide-react';
import { startOfMonth, endOfMonth, format, subMonths } from 'date-fns';
import { useTheme } from '../../hooks/useTheme';

export function ComparisonCharts() {
  const expenses = useExpenseStore((state) => state.expenses);
  const { getChartTooltipStyle, getChartAxisColor, getChartGridColor } = useTheme();

  // Get last 6 months data
  const getMonthlyData = () => {
    const months = [];
    for (let i = 5; i >= 0; i--) {
      const monthDate = subMonths(new Date(), i);
      const monthStart = startOfMonth(monthDate);
      const monthEnd = endOfMonth(monthDate);

      const monthExpenses = expenses.filter((exp) => {
        const expDate = new Date(exp.date);
        return expDate >= monthStart && expDate <= monthEnd;
      });

      const total = monthExpenses.reduce((sum, exp) => sum + exp.amount, 0);
      const count = monthExpenses.length;

      // Category breakdown
      const categories: Record<string, number> = {};
      monthExpenses.forEach((exp) => {
        categories[exp.category] = (categories[exp.category] || 0) + exp.amount;
      });

      months.push({
        month: format(monthDate, 'MMM yyyy'),
        shortMonth: format(monthDate, 'MMM'),
        total,
        count,
        average: count > 0 ? total / count : 0,
        categories,
      });
    }
    return months;
  };

  const monthlyData = getMonthlyData();

  // Calculate trends
  const currentMonth = monthlyData[monthlyData.length - 1];
  const previousMonth = monthlyData[monthlyData.length - 2];
  const trend = previousMonth && previousMonth.total > 0
    ? ((currentMonth.total - previousMonth.total) / previousMonth.total) * 100
    : 0;

  // Top categories comparison
  const getCategoryComparison = () => {
    const allCategories = new Set<string>();
    monthlyData.forEach(month => {
      Object.keys(month.categories).forEach(cat => allCategories.add(cat));
    });

    return Array.from(allCategories).map(category => {
      const data: any = { category };
      monthlyData.forEach(month => {
        data[month.shortMonth] = month.categories[category] || 0;
      });
      return data;
    }).slice(0, 5);
  };

  const categoryComparison = getCategoryComparison();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-3 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl">
          <Calendar className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white">Month-to-Month Comparison</h2>
          <p className="text-white/60 text-sm">Analyze spending trends over time</p>
        </div>
      </div>

      {/* Trend Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-dark rounded-xl p-6"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-white/60 text-sm">This Month</span>
            {trend !== 0 && (
              <div className={`flex items-center gap-1 ${trend > 0 ? 'text-red-400' : 'text-green-400'}`}>
                {trend > 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                <span className="text-sm font-semibold">{Math.abs(trend).toFixed(1)}%</span>
              </div>
            )}
          </div>
          <p className="text-3xl font-bold text-white">${currentMonth.total.toFixed(2)}</p>
          <p className="text-white/60 text-sm mt-1">{currentMonth.count} transactions</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-dark rounded-xl p-6"
        >
          <span className="text-white/60 text-sm">Last Month</span>
          <p className="text-3xl font-bold text-white mt-2">
            ${previousMonth ? previousMonth.total.toFixed(2) : '0.00'}
          </p>
          <p className="text-white/60 text-sm mt-1">
            {previousMonth ? previousMonth.count : 0} transactions
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-dark rounded-xl p-6"
        >
          <span className="text-white/60 text-sm">6-Month Average</span>
          <p className="text-3xl font-bold text-white mt-2">
            ${(monthlyData.reduce((sum, m) => sum + m.total, 0) / monthlyData.length).toFixed(2)}
          </p>
          <p className="text-white/60 text-sm mt-1">Monthly spending</p>
        </motion.div>
      </div>

      {/* Monthly Spending Trend */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="glass-dark rounded-2xl p-6"
      >
        <h3 className="text-xl font-bold text-white mb-6">Spending Trend (Last 6 Months)</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke={getChartGridColor()} />
              <XAxis 
                dataKey="shortMonth" 
                stroke={getChartAxisColor()}
                tick={{ fill: getChartAxisColor(), fontSize: 12 }}
              />
              <YAxis 
                stroke={getChartAxisColor()}
                tick={{ fill: getChartAxisColor(), fontSize: 12 }}
              />
              <Tooltip 
                contentStyle={getChartTooltipStyle()}
                formatter={(value: number) => `$${value.toFixed(2)}`}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="total" 
                stroke="#10b981" 
                strokeWidth={3}
                dot={{ fill: '#10b981', r: 5 }}
                activeDot={{ r: 7 }}
                name="Total Spent"
              />
              <Line 
                type="monotone" 
                dataKey="average" 
                stroke="#3b82f6" 
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={{ fill: '#3b82f6', r: 4 }}
                name="Avg per Transaction"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Category Comparison */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="glass-dark rounded-2xl p-6"
      >
        <h3 className="text-xl font-bold text-white mb-6">Category Comparison</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={categoryComparison}>
              <CartesianGrid strokeDasharray="3 3" stroke={getChartGridColor()} />
              <XAxis 
                dataKey="category" 
                stroke={getChartAxisColor()}
                tick={{ fill: getChartAxisColor(), fontSize: 10 }}
                angle={-45}
                textAnchor="end"
                height={100}
              />
              <YAxis 
                stroke={getChartAxisColor()}
                tick={{ fill: getChartAxisColor(), fontSize: 12 }}
              />
              <Tooltip 
                contentStyle={getChartTooltipStyle()}
                formatter={(value: number) => `$${value.toFixed(2)}`}
              />
              <Legend />
              {monthlyData.slice(-3).map((month, index) => {
                const colors = ['#3b82f6', '#10b981', '#f59e0b'];
                return (
                  <Bar 
                    key={month.shortMonth}
                    dataKey={month.shortMonth} 
                    fill={colors[index]}
                    radius={[8, 8, 0, 0]}
                  />
                );
              })}
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Transaction Count Trend */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="glass-dark rounded-2xl p-6"
      >
        <h3 className="text-xl font-bold text-white mb-6">Transaction Frequency</h3>
        <div className="h-60">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke={getChartGridColor()} />
              <XAxis 
                dataKey="shortMonth" 
                stroke={getChartAxisColor()}
                tick={{ fill: getChartAxisColor(), fontSize: 12 }}
              />
              <YAxis 
                stroke={getChartAxisColor()}
                tick={{ fill: getChartAxisColor(), fontSize: 12 }}
              />
              <Tooltip 
                contentStyle={getChartTooltipStyle()}
              />
              <Bar 
                dataKey="count" 
                fill="url(#countGradient)"
                radius={[8, 8, 0, 0]}
                name="Transactions"
              />
              <defs>
                <linearGradient id="countGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#8b5cf6" stopOpacity={1}/>
                  <stop offset="100%" stopColor="#ec4899" stopOpacity={1}/>
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>
    </div>
  );
}
