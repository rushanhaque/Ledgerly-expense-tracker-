import { motion } from 'framer-motion';
import { useExpenseStore } from '../../store/expenseStore';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, LineChart, Line } from 'recharts';
import { CATEGORY_COLORS, CategoryType } from '../../types';
import { startOfMonth, endOfMonth, format, eachDayOfInterval } from 'date-fns';
import { useTheme } from '../../hooks/useTheme';

// Custom Tooltip Component for better visibility
const CustomTooltip = ({ active, payload, theme }: any) => {
  if (active && payload && payload.length) {
    const isDark = theme === 'dark';
    return (
      <div
        style={{
          backgroundColor: isDark ? 'rgba(26, 26, 26, 0.98)' : 'rgba(250, 250, 250, 0.98)',
          border: `1px solid rgba(212, 197, 160, ${isDark ? 0.4 : 0.5})`,
          borderRadius: '8px',
          padding: '10px 14px',
          boxShadow: isDark
            ? '0 4px 16px rgba(0, 0, 0, 0.6)'
            : '0 4px 16px rgba(0, 0, 0, 0.15)',
        }}
      >
        <p
          style={{
            color: isDark ? '#F5F5DC' : '#000000',
            fontWeight: 'bold',
            fontSize: '14px',
            margin: 0,
            marginBottom: '4px',
          }}
        >
          {payload[0].name}
        </p>
        <p
          style={{
            color: isDark ? '#D4C5A0' : '#B8A889',
            fontSize: '16px',
            fontWeight: '600',
            margin: 0,
          }}
        >
          ${payload[0].value.toFixed(2)}
        </p>
      </div>
    );
  }
  return null;
};

export function SpendingCharts() {
  const expenses = useExpenseStore((state) => state.expenses);
  const { getChartTooltipStyle, getChartAxisColor, theme } = useTheme();

  // Category breakdown data
  const categoryData = expenses.reduce((acc, exp) => {
    const existing = acc.find(item => item.name === exp.category);
    if (existing) {
      existing.value += exp.amount;
    } else {
      acc.push({ name: exp.category, value: exp.amount });
    }
    return acc;
  }, [] as Array<{ name: string; value: number }>);

  // Daily spending trend
  const monthStart = startOfMonth(new Date());
  const monthEnd = endOfMonth(new Date());
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const dailyData = daysInMonth.map(day => {
    const dayExpenses = expenses.filter(exp => 
      format(new Date(exp.date), 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd')
    );
    const total = dayExpenses.reduce((sum, exp) => sum + exp.amount, 0);
    return {
      date: format(day, 'MMM dd'),
      amount: total,
    };
  });

  // Top spending categories
  const topCategories = [...categoryData]
    .sort((a, b) => b.value - a.value)
    .slice(0, 5)
    .map(item => ({
      category: item.name,
      amount: item.value,
    }));

  return (
    <div className="space-y-6">
      {/* Category Breakdown */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-dark rounded-2xl p-6"
      >
        <h3 className="text-xl font-bold text-white mb-6">Spending by Category</h3>
        <div className="h-80">
          {categoryData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={CATEGORY_COLORS[entry.name as CategoryType] || '#999'} 
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip theme={theme} />} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-white/40">
              No data available
            </div>
          )}
        </div>
      </motion.div>

      {/* Top Categories Bar Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-dark rounded-2xl p-6"
      >
        <h3 className="text-xl font-bold text-white mb-6">Top Spending Categories</h3>
        <div className="h-80">
          {topCategories.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topCategories}>
                <XAxis 
                  dataKey="category" 
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
                <Bar 
                  dataKey="amount" 
                  fill="url(#colorGradient)"
                  radius={[8, 8, 0, 0]}
                />
                <defs>
                  <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#667eea" stopOpacity={1}/>
                    <stop offset="100%" stopColor="#764ba2" stopOpacity={1}/>
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-white/40">
              No data available
            </div>
          )}
        </div>
      </motion.div>

      {/* Daily Spending Trend */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass-dark rounded-2xl p-6"
      >
        <h3 className="text-xl font-bold text-white mb-6">Daily Spending Trend</h3>
        <div className="h-80">
          {dailyData.some(d => d.amount > 0) ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={dailyData}>
                <XAxis 
                  dataKey="date" 
                  stroke={getChartAxisColor()}
                  tick={{ fill: getChartAxisColor(), fontSize: 10 }}
                  interval="preserveStartEnd"
                />
                <YAxis 
                  stroke={getChartAxisColor()}
                  tick={{ fill: getChartAxisColor(), fontSize: 12 }}
                />
                <Tooltip 
                  contentStyle={getChartTooltipStyle()}
                  formatter={(value: number) => `$${value.toFixed(2)}`}
                />
                <Line 
                  type="monotone" 
                  dataKey="amount" 
                  stroke="#10b981" 
                  strokeWidth={3}
                  dot={{ fill: '#10b981', r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-white/40">
              No data available for this month
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
