import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, PieChart, DollarSign, Target, Calendar as CalIcon, TrendingUp, Repeat, Camera, LogIn } from 'lucide-react';
import { useExpenseStore } from '../store/expenseStore';
import { useAuthStore } from '../store/authStore';
import { BackgroundScene } from '../components/3D/BackgroundScene';
import { StatCard } from '../components/UI/StatCard';
import { InsightsPanel } from '../components/UI/InsightsPanel';
import { AddExpenseModal } from '../components/UI/AddExpenseModal';
import { ExpenseList } from '../components/UI/ExpenseList';
import { SpendingCharts } from '../components/UI/SpendingCharts';
import { BudgetManager } from '../components/UI/BudgetManager';
import { GoalsTracker } from '../components/UI/GoalsTracker';
import { ExportTools } from '../components/UI/ExportTools';
import { DataImport } from '../components/UI/DataImport';
import { ExpenseFilter, FilterOptions } from '../components/UI/ExpenseFilter';
import { RecurringExpenseManager } from '../components/UI/RecurringExpenseManager';
import { CalendarView } from '../components/UI/CalendarView';
import { ComparisonCharts } from '../components/UI/ComparisonCharts';
import { ReceiptScanner } from '../components/UI/ReceiptScanner';
import { ThemeToggle } from '../components/UI/ThemeToggle';
import { NotificationCenter, NotificationToast } from '../components/UI/NotificationSystem';
import { AuthModal } from '../components/UI/AuthModal';
import { UserMenu } from '../components/UI/UserMenu';
import { Footer } from '../components/UI/Footer';
import { startOfMonth, endOfMonth, startOfWeek, endOfWeek } from 'date-fns';

export function Dashboard() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isReceiptScannerOpen, setIsReceiptScannerOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'budgets' | 'goals' | 'recurring' | 'calendar' | 'analytics'>('overview');
  const [filters, setFilters] = useState<FilterOptions>({
    searchQuery: '',
    categories: [],
    minAmount: null,
    maxAmount: null,
    startDate: '',
    endDate: '',
    paymentMethods: [],
    tags: [],
  });
  const expenses = useExpenseStore((state) => state.expenses);
  const generateInsights = useExpenseStore((state) => state.generateInsights);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  useEffect(() => {
    generateInsights();
  }, [expenses, generateInsights]);

  // Filter expenses (currently used for display filtering)
  expenses.filter((exp) => {
    // Search query
    if (filters.searchQuery && !exp.description.toLowerCase().includes(filters.searchQuery.toLowerCase())) {
      return false;
    }
    
    // Categories
    if (filters.categories.length > 0 && !filters.categories.includes(exp.category as any)) {
      return false;
    }
    
    // Amount range
    if (filters.minAmount !== null && exp.amount < filters.minAmount) return false;
    if (filters.maxAmount !== null && exp.amount > filters.maxAmount) return false;
    
    // Date range
    if (filters.startDate && new Date(exp.date) < new Date(filters.startDate)) return false;
    if (filters.endDate && new Date(exp.date) > new Date(filters.endDate)) return false;
    
    // Payment methods
    if (filters.paymentMethods.length > 0 && !filters.paymentMethods.includes(exp.paymentMethod)) {
      return false;
    }
    
    // Tags
    if (filters.tags.length > 0 && !filters.tags.some(tag => exp.tags.includes(tag))) {
      return false;
    }
    
    return true;
  });

  // Get all unique tags
  const allTags = Array.from(new Set(expenses.flatMap(exp => exp.tags)));

  // Handle receipt scan complete
  const handleReceiptScanComplete = (_data: { amount?: number; description?: string; date?: string }) => {
    setIsReceiptScannerOpen(false);
    setIsAddModalOpen(true);
  };

  // Calculate statistics
  const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);

  const thisMonth = expenses.filter(exp => {
    const expDate = new Date(exp.date);
    return expDate >= startOfMonth(new Date()) && expDate <= endOfMonth(new Date());
  });
  const monthTotal = thisMonth.reduce((sum, exp) => sum + exp.amount, 0);

  const thisWeek = expenses.filter(exp => {
    const expDate = new Date(exp.date);
    return expDate >= startOfWeek(new Date()) && expDate <= endOfWeek(new Date());
  });
  const weekTotal = thisWeek.reduce((sum, exp) => sum + exp.amount, 0);

  const lastMonth = expenses.filter(exp => {
    const expDate = new Date(exp.date);
    const lastMonthStart = new Date(new Date().setMonth(new Date().getMonth() - 1));
    return expDate >= startOfMonth(lastMonthStart) && expDate < startOfMonth(new Date());
  });
  const lastMonthTotal = lastMonth.reduce((sum, exp) => sum + exp.amount, 0);

  const monthChange = lastMonthTotal > 0 
    ? ((monthTotal - lastMonthTotal) / lastMonthTotal) * 100 
    : 0;

  const avgDailySpending = thisMonth.length > 0 
    ? monthTotal / new Date().getDate() 
    : 0;

  return (
    <div className="min-h-screen relative">
      {/* 3D Background */}
      <BackgroundScene />

      {/* Notification System */}
      <NotificationToast />

      {/* Main Content */}
      <div className="relative z-10">
        {/* Header */}
        <header className="glass-dark border-b border-white/10 relative z-[100]">
          <div className="container mx-auto px-4 py-6 relative z-[100]">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 relative z-[100]">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-4"
              >
                {/* Enhanced Logo */}
                <div className="relative group">
                  {/* Glow effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-beige-accent/30 to-beige-dark/30 rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  {/* Logo container */}
                  <div className="relative p-3 bg-gradient-to-br from-beige-primary/20 to-beige-accent/20 rounded-xl border border-beige-accent/20 shadow-lg hover-lift backdrop-blur-sm">
                    <svg width="36" height="36" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                      {/* Ledger Book - Main body */}
                      <rect x="8" y="4" width="24" height="32" rx="2" fill="#F5F5DC" opacity="0.3"/>
                      
                      {/* Book spine */}
                      <rect x="8" y="4" width="4" height="32" rx="1" fill="#D4C5A0"/>
                      
                      {/* Ledger lines */}
                      <line x1="14" y1="12" x2="28" y2="12" stroke="#F5F5DC" strokeWidth="1.5" strokeLinecap="round"/>
                      <line x1="14" y1="18" x2="28" y2="18" stroke="#F5F5DC" strokeWidth="1.5" strokeLinecap="round"/>
                      <line x1="14" y1="24" x2="24" y2="24" stroke="#F5F5DC" strokeWidth="1.5" strokeLinecap="round"/>
                      <line x1="14" y1="30" x2="28" y2="30" stroke="#F5F5DC" strokeWidth="1.5" strokeLinecap="round" opacity="0.5"/>
                      
                      {/* Dollar badge circle */}
                      <circle cx="29" cy="30" r="7" fill="#D4C5A0"/>
                      <circle cx="29" cy="30" r="5.5" fill="#1A1A1A"/>
                      
                      {/* Dollar sign */}
                      <text x="29" y="34" textAnchor="middle" fontSize="10" fill="#D4C5A0" fontWeight="bold" fontFamily="Arial">$</text>
                    </svg>
                  </div>
                </div>

                {/* App Name & Tagline */}
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold flex items-center gap-2">
                    <span className="text-white font-['Playfair_Display'] drop-shadow-lg">
                      Ledgerly
                    </span>
                  </h1>
                  <p className="text-white/70 mt-1 text-sm font-light">Mindful spending, peaceful finances</p>
                </div>
              </motion.div>

              <div className="flex items-center gap-3">
                <motion.button
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsReceiptScannerOpen(true)}
                  className="btn bg-gradient-to-r from-green-500 to-emerald-600 text-white flex items-center gap-2"
                >
                  <Camera className="w-5 h-5" />
                  <span className="hidden sm:inline">Scan Receipt</span>
                </motion.button>

                <motion.button
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsAddModalOpen(true)}
                  className="btn btn-primary flex items-center gap-2"
                >
                  <Plus className="w-5 h-5" />
                  <span className="hidden sm:inline">Add Expense</span>
                </motion.button>

                <ThemeToggle />
                
                <NotificationCenter />

                {isAuthenticated ? (
                  <UserMenu />
                ) : (
                  <motion.button
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsAuthModalOpen(true)}
                    className="btn bg-white/10 hover:bg-white/20 text-white flex items-center gap-2"
                  >
                    <LogIn className="w-5 h-5" />
                    <span className="hidden sm:inline">Login</span>
                  </motion.button>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Main Dashboard */}
        <main className="container mx-auto px-4 py-8">
          {/* Navigation Tabs */}
          <div className="flex items-center gap-4 mb-8 overflow-x-auto">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveTab('overview')}
              className={`px-6 py-3 rounded-xl font-semibold transition-all flex items-center gap-2 whitespace-nowrap ${
                activeTab === 'overview'
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                  : 'bg-white/10 text-white/70 hover:bg-white/20'
              }`}
            >
              <PieChart className="w-5 h-5" />
              Overview
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveTab('budgets')}
              className={`px-6 py-3 rounded-xl font-semibold transition-all flex items-center gap-2 whitespace-nowrap ${
                activeTab === 'budgets'
                  ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg'
                  : 'bg-white/10 text-white/70 hover:bg-white/20'
              }`}
            >
              <DollarSign className="w-5 h-5" />
              Budgets
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveTab('goals')}
              className={`px-6 py-3 rounded-xl font-semibold transition-all flex items-center gap-2 whitespace-nowrap ${
                activeTab === 'goals'
                  ? 'bg-gradient-to-r from-yellow-500 to-orange-600 text-white shadow-lg'
                  : 'bg-white/10 text-white/70 hover:bg-white/20'
              }`}
            >
              <Target className="w-5 h-5" />
              Goals
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveTab('recurring')}
              className={`px-6 py-3 rounded-xl font-semibold transition-all flex items-center gap-2 whitespace-nowrap ${
                activeTab === 'recurring'
                  ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg'
                  : 'bg-white/10 text-white/70 hover:bg-white/20'
              }`}
            >
              <Repeat className="w-5 h-5" />
              Recurring
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveTab('calendar')}
              className={`px-6 py-3 rounded-xl font-semibold transition-all flex items-center gap-2 whitespace-nowrap ${
                activeTab === 'calendar'
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg'
                  : 'bg-white/10 text-white/70 hover:bg-white/20'
              }`}
            >
              <CalIcon className="w-5 h-5" />
              Calendar
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveTab('analytics')}
              className={`px-6 py-3 rounded-xl font-semibold transition-all flex items-center gap-2 whitespace-nowrap ${
                activeTab === 'analytics'
                  ? 'bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-lg'
                  : 'bg-white/10 text-white/70 hover:bg-white/20'
              }`}
            >
              <TrendingUp className="w-5 h-5" />
              Analytics
            </motion.button>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard
              title="Total Expenses"
              value={`$${totalExpenses.toFixed(2)}`}
              icon="money"
              gradient="bg-gradient-to-br from-blue-500 to-blue-600"
            />
            <StatCard
              title="This Month"
              value={`$${monthTotal.toFixed(2)}`}
              change={monthChange}
              icon={monthChange >= 0 ? 'up' : 'down'}
              gradient="bg-gradient-to-br from-purple-500 to-purple-600"
            />
            <StatCard
              title="This Week"
              value={`$${weekTotal.toFixed(2)}`}
              icon="calendar"
              gradient="bg-gradient-to-br from-pink-500 to-pink-600"
            />
            <StatCard
              title="Daily Average"
              value={`$${avgDailySpending.toFixed(2)}`}
              icon="money"
              gradient="bg-gradient-to-br from-green-500 to-green-600"
            />
          </div>

          {/* Tab Content */}
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-8">
                <ExpenseFilter onFilterChange={setFilters} availableTags={allTags} />
                <SpendingCharts />
                <ExpenseList />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <ExportTools />
                  <DataImport />
                </div>
              </div>
              <div className="lg:col-span-1">
                <div className="sticky top-4">
                  <InsightsPanel />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'budgets' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <BudgetManager />
              </div>
              <div className="lg:col-span-1">
                <div className="sticky top-4">
                  <InsightsPanel />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'goals' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <GoalsTracker />
              </div>
              <div className="lg:col-span-1">
                <div className="sticky top-4">
                  <InsightsPanel />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'recurring' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <RecurringExpenseManager />
              </div>
              <div className="lg:col-span-1">
                <div className="sticky top-4">
                  <InsightsPanel />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'calendar' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <CalendarView />
              </div>
              <div className="lg:col-span-1">
                <div className="sticky top-4">
                  <InsightsPanel />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'analytics' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <ComparisonCharts />
              </div>
              <div className="lg:col-span-1">
                <div className="sticky top-4">
                  <InsightsPanel />
                </div>
              </div>
            </div>
          )}
        </main>

        {/* Footer */}
        <Footer />
      </div>

      {/* Modals */}
      <AddExpenseModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} />
      <ReceiptScanner 
        isOpen={isReceiptScannerOpen} 
        onClose={() => setIsReceiptScannerOpen(false)}
        onScanComplete={handleReceiptScanComplete}
      />
      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)}
      />
    </div>
  );
}
