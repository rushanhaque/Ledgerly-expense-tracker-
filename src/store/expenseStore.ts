import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Expense, Budget, FinancialGoal, SmartInsight } from '../types';
import { ExpenseHashMap, MaxHeap, SpendingGraph } from '../utils/dataStructures';
import { SmartInsightsEngine } from '../utils/smartInsights';

interface ExpenseStore {
  expenses: Expense[];
  budgets: Budget[];
  goals: FinancialGoal[];
  insights: SmartInsight[];
  
  // Expense actions
  addExpense: (expense: Expense) => void;
  updateExpense: (id: string, expense: Partial<Expense>) => void;
  deleteExpense: (id: string) => void;
  
  // Budget actions
  addBudget: (budget: Budget) => void;
  updateBudget: (id: string, budget: Partial<Budget>) => void;
  deleteBudget: (id: string) => void;
  
  // Goal actions
  addGoal: (goal: FinancialGoal) => void;
  updateGoal: (id: string, goal: Partial<FinancialGoal>) => void;
  deleteGoal: (id: string) => void;
  
  // Insights
  generateInsights: () => void;
  
  // Analytics
  getTopSpendingCategories: (limit?: number) => Array<{ category: string; amount: number }>;
  getCategoryTotal: (category: string) => number;
  getSpendingTrends: () => any;
  getRelatedCategories: (category: string) => Array<{ category: string; correlation: number }>;
}

export const useExpenseStore = create<ExpenseStore>()(
  persist(
    (set, get) => ({
      expenses: [],
      budgets: [],
      goals: [],
      insights: [],

      addExpense: (expense) => {
        set((state) => ({
          expenses: [...state.expenses, expense],
        }));
        get().generateInsights();
      },

      updateExpense: (id, updatedExpense) => {
        set((state) => ({
          expenses: state.expenses.map((exp) =>
            exp.id === id ? { ...exp, ...updatedExpense } : exp
          ),
        }));
        get().generateInsights();
      },

      deleteExpense: (id) => {
        set((state) => ({
          expenses: state.expenses.filter((exp) => exp.id !== id),
        }));
        get().generateInsights();
      },

      addBudget: (budget) => {
        set((state) => ({
          budgets: [...state.budgets, budget],
        }));
      },

      updateBudget: (id, updatedBudget) => {
        set((state) => ({
          budgets: state.budgets.map((budget) =>
            budget.id === id ? { ...budget, ...updatedBudget } : budget
          ),
        }));
      },

      deleteBudget: (id) => {
        set((state) => ({
          budgets: state.budgets.filter((budget) => budget.id !== id),
        }));
      },

      addGoal: (goal) => {
        set((state) => ({
          goals: [...state.goals, goal],
        }));
      },

      updateGoal: (id, updatedGoal) => {
        set((state) => ({
          goals: state.goals.map((goal) =>
            goal.id === id ? { ...goal, ...updatedGoal } : goal
          ),
        }));
      },

      deleteGoal: (id) => {
        set((state) => ({
          goals: state.goals.filter((goal) => goal.id !== id),
        }));
      },

      generateInsights: () => {
        const { expenses } = get();
        const engine = new SmartInsightsEngine(expenses);
        const insights = engine.generateAllInsights();
        set({ insights });
      },

      getTopSpendingCategories: (limit = 5) => {
        const { expenses } = get();
        const categoryMap = new ExpenseHashMap<string, Expense>();
        
        expenses.forEach((expense) => {
          categoryMap.set(expense.category, expense);
        });

        const heap = new MaxHeap<{ category: string; amount: number }>(
          (a, b) => a.amount - b.amount
        );

        categoryMap.keys().forEach((category) => {
          const total = categoryMap.getTotalByKey(category, (exp) => exp.amount);
          heap.insert({ category, amount: total });
        });

        const topCategories: Array<{ category: string; amount: number }> = [];
        for (let i = 0; i < limit && heap.size() > 0; i++) {
          const item = heap.extractMax();
          if (item) topCategories.push(item);
        }

        return topCategories;
      },

      getCategoryTotal: (category) => {
        const { expenses } = get();
        return expenses
          .filter((exp) => exp.category === category)
          .reduce((sum, exp) => sum + exp.amount, 0);
      },

      getSpendingTrends: () => {
        const { expenses } = get();
        // Group expenses by date for trend analysis
        const trends = expenses.reduce((acc, exp) => {
          const dateKey = new Date(exp.date).toLocaleDateString();
          if (!acc[dateKey]) {
            acc[dateKey] = 0;
          }
          acc[dateKey] += exp.amount;
          return acc;
        }, {} as Record<string, number>);

        return Object.entries(trends).map(([date, amount]) => ({
          date,
          amount,
        }));
      },

      getRelatedCategories: (category) => {
        const { expenses } = get();
        const graph = new SpendingGraph();
        
        // Build relationship graph based on expenses in same day
        const dateGroups = new Map<string, Expense[]>();
        expenses.forEach((exp) => {
          const dateKey = new Date(exp.date).toDateString();
          if (!dateGroups.has(dateKey)) {
            dateGroups.set(dateKey, []);
          }
          dateGroups.get(dateKey)!.push(exp);
        });

        dateGroups.forEach((exps) => {
          for (let i = 0; i < exps.length; i++) {
            for (let j = i + 1; j < exps.length; j++) {
              graph.addEdge(exps[i].category, exps[j].category, 1);
              graph.addEdge(exps[j].category, exps[i].category, 1);
            }
          }
        });

        return graph.getRelatedCategories(category);
      },
    }),
    {
      name: 'expense-storage',
    }
  )
);
