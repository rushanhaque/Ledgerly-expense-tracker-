import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, DollarSign, Calendar } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string;
  change?: number;
  icon: 'money' | 'up' | 'down' | 'calendar';
  gradient: string;
}

export function StatCard({ title, value, change, icon, gradient }: StatCardProps) {
  const icons = {
    money: DollarSign,
    up: TrendingUp,
    down: TrendingDown,
    calendar: Calendar,
  };

  const Icon = icons[icon];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.05, rotateY: 5 }}
      className={`stat-card ${gradient} relative overflow-hidden`}
    >
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white/80 text-sm font-medium">{title}</h3>
          <div className="p-3 bg-white/20 rounded-lg">
            <Icon className="w-5 h-5 text-white" />
          </div>
        </div>
        
        <div className="flex items-end justify-between">
          <p className="text-3xl font-bold text-white">{value}</p>
          
          {change !== undefined && (
            <div className={`flex items-center gap-1 text-sm ${change >= 0 ? 'text-green-300' : 'text-red-300'}`}>
              {change >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
              <span>{Math.abs(change)}%</span>
            </div>
          )}
        </div>
      </div>

      {/* Shimmer effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer" 
           style={{ backgroundSize: '200% 100%' }} />
    </motion.div>
  );
}
