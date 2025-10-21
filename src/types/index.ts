export interface Expense {
  id: string;
  amount: number;
  category: string;
  subcategory?: string;
  description: string;
  date: Date;
  paymentMethod: string;
  tags: string[];
  isRecurring: boolean;
  recurringFrequency?: 'daily' | 'weekly' | 'monthly' | 'yearly';
  receipt?: string;
  location?: string;
}

export interface Budget {
  id: string;
  category: string;
  limit: number;
  period: 'daily' | 'weekly' | 'monthly' | 'yearly';
  spent: number;
  startDate: Date;
  endDate: Date;
  alerts: boolean;
  alertThreshold: number;
}

export interface FinancialGoal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline: Date;
  category: string;
  priority: 'low' | 'medium' | 'high';
  status: 'active' | 'completed' | 'paused';
}

export interface SmartInsight {
  id: string;
  type: 'pattern' | 'warning' | 'suggestion' | 'achievement';
  title: string;
  description: string;
  impact: 'low' | 'medium' | 'high';
  data?: any;
  timestamp: Date;
}

export interface SpendingPattern {
  pattern: string;
  confidence: number;
  description: string;
  categories: string[];
  timeframe: string;
}

export type CategoryType = 
  | 'Food & Dining'
  | 'Transportation'
  | 'Shopping'
  | 'Entertainment'
  | 'Bills & Utilities'
  | 'Healthcare'
  | 'Education'
  | 'Travel'
  | 'Investments'
  | 'Personal Care'
  | 'Subscriptions'
  | 'Gifts & Donations'
  | 'Other';

export const CATEGORY_COLORS: Record<CategoryType, string> = {
  'Food & Dining': '#FF6B6B',
  'Transportation': '#4ECDC4',
  'Shopping': '#45B7D1',
  'Entertainment': '#FFA07A',
  'Bills & Utilities': '#98D8C8',
  'Healthcare': '#F7B801',
  'Education': '#6C5CE7',
  'Travel': '#00B894',
  'Investments': '#0984E3',
  'Personal Care': '#FD79A8',
  'Subscriptions': '#A29BFE',
  'Gifts & Donations': '#FAB1A0',
  'Other': '#B2BEC3',
};

export const CATEGORY_ICONS: Record<CategoryType, string> = {
  'Food & Dining': '🍽️',
  'Transportation': '🚗',
  'Shopping': '🛍️',
  'Entertainment': '🎮',
  'Bills & Utilities': '💡',
  'Healthcare': '⚕️',
  'Education': '📚',
  'Travel': '✈️',
  'Investments': '📈',
  'Personal Care': '💅',
  'Subscriptions': '📱',
  'Gifts & Donations': '🎁',
  'Other': '📦',
};
