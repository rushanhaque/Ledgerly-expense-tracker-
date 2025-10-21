import { motion } from 'framer-motion';
import { Search, Filter, X, Calendar, DollarSign, Tag } from 'lucide-react';
import { useState } from 'react';
import { CategoryType } from '../../types';

export interface FilterOptions {
  searchQuery: string;
  categories: CategoryType[];
  minAmount: number | null;
  maxAmount: number | null;
  startDate: string;
  endDate: string;
  paymentMethods: string[];
  tags: string[];
}

interface ExpenseFilterProps {
  onFilterChange: (filters: FilterOptions) => void;
  availableTags: string[];
}

export function ExpenseFilter({ onFilterChange, availableTags }: ExpenseFilterProps) {
  const [isOpen, setIsOpen] = useState(false);
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

  const paymentMethods = ['Cash', 'Credit Card', 'Debit Card', 'Digital Wallet', 'Bank Transfer'];

  const handleFilterChange = (key: keyof FilterOptions, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const toggleCategory = (category: CategoryType) => {
    const newCategories = filters.categories.includes(category)
      ? filters.categories.filter(c => c !== category)
      : [...filters.categories, category];
    handleFilterChange('categories', newCategories);
  };

  const togglePaymentMethod = (method: string) => {
    const newMethods = filters.paymentMethods.includes(method)
      ? filters.paymentMethods.filter(m => m !== method)
      : [...filters.paymentMethods, method];
    handleFilterChange('paymentMethods', newMethods);
  };

  const toggleTag = (tag: string) => {
    const newTags = filters.tags.includes(tag)
      ? filters.tags.filter(t => t !== tag)
      : [...filters.tags, tag];
    handleFilterChange('tags', newTags);
  };

  const clearFilters = () => {
    const emptyFilters: FilterOptions = {
      searchQuery: '',
      categories: [],
      minAmount: null,
      maxAmount: null,
      startDate: '',
      endDate: '',
      paymentMethods: [],
      tags: [],
    };
    setFilters(emptyFilters);
    onFilterChange(emptyFilters);
  };

  const activeFilterCount = 
    filters.categories.length +
    filters.paymentMethods.length +
    filters.tags.length +
    (filters.minAmount !== null ? 1 : 0) +
    (filters.maxAmount !== null ? 1 : 0) +
    (filters.startDate ? 1 : 0) +
    (filters.endDate ? 1 : 0);

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/60" />
        <input
          type="text"
          value={filters.searchQuery}
          onChange={(e) => handleFilterChange('searchQuery', e.target.value)}
          placeholder="Search expenses..."
          className="w-full pl-12 pr-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>

      {/* Filter Toggle Button */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="btn btn-secondary flex items-center gap-2 relative"
        >
          <Filter className="w-5 h-5" />
          Advanced Filters
          {activeFilterCount > 0 && (
            <span className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
              {activeFilterCount}
            </span>
          )}
        </button>

        {activeFilterCount > 0 && (
          <button
            onClick={clearFilters}
            className="px-4 py-2 rounded-lg bg-red-500/20 text-red-300 hover:bg-red-500/30 transition-colors flex items-center gap-2"
          >
            <X className="w-4 h-4" />
            Clear All
          </button>
        )}
      </div>

      {/* Filter Panel */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="glass-dark rounded-xl p-6 space-y-6"
        >
          {/* Categories */}
          <div>
            <label className="block text-white font-semibold mb-3">Categories</label>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => toggleCategory(category)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    filters.categories.includes(category)
                      ? 'bg-blue-500 text-white'
                      : 'bg-white/10 text-white/70 hover:bg-white/20'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Amount Range */}
          <div>
            <label className="block text-white font-semibold mb-3 flex items-center gap-2">
              <DollarSign className="w-4 h-4" />
              Amount Range
            </label>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <input
                  type="number"
                  step="0.01"
                  value={filters.minAmount ?? ''}
                  onChange={(e) => handleFilterChange('minAmount', e.target.value ? parseFloat(e.target.value) : null)}
                  placeholder="Min amount"
                  className="input"
                />
              </div>
              <div>
                <input
                  type="number"
                  step="0.01"
                  value={filters.maxAmount ?? ''}
                  onChange={(e) => handleFilterChange('maxAmount', e.target.value ? parseFloat(e.target.value) : null)}
                  placeholder="Max amount"
                  className="input"
                />
              </div>
            </div>
          </div>

          {/* Date Range */}
          <div>
            <label className="block text-white font-semibold mb-3 flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Date Range
            </label>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <input
                  type="date"
                  value={filters.startDate}
                  onChange={(e) => handleFilterChange('startDate', e.target.value)}
                  className="input"
                />
              </div>
              <div>
                <input
                  type="date"
                  value={filters.endDate}
                  onChange={(e) => handleFilterChange('endDate', e.target.value)}
                  className="input"
                />
              </div>
            </div>
          </div>

          {/* Payment Methods */}
          <div>
            <label className="block text-white font-semibold mb-3">Payment Methods</label>
            <div className="flex flex-wrap gap-2">
              {paymentMethods.map((method) => (
                <button
                  key={method}
                  onClick={() => togglePaymentMethod(method)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    filters.paymentMethods.includes(method)
                      ? 'bg-green-500 text-white'
                      : 'bg-white/10 text-white/70 hover:bg-white/20'
                  }`}
                >
                  {method}
                </button>
              ))}
            </div>
          </div>

          {/* Tags */}
          {availableTags.length > 0 && (
            <div>
              <label className="block text-white font-semibold mb-3 flex items-center gap-2">
                <Tag className="w-4 h-4" />
                Tags
              </label>
              <div className="flex flex-wrap gap-2">
                {availableTags.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => toggleTag(tag)}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${
                      filters.tags.includes(tag)
                        ? 'bg-purple-500 text-white'
                        : 'bg-white/10 text-white/70 hover:bg-white/20'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
}
