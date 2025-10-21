import { Expense, SmartInsight, SpendingPattern } from '../types';
import { 
  isWeekend, 
  differenceInDays,
  startOfMonth,
  endOfMonth
} from 'date-fns';

export class SmartInsightsEngine {
  private expenses: Expense[];

  constructor(expenses: Expense[]) {
    this.expenses = expenses;
  }

  generateAllInsights(): SmartInsight[] {
    const insights: SmartInsight[] = [];

    insights.push(...this.detectWeekendSpending());
    insights.push(...this.detectUnusualSpending());
    insights.push(...this.detectRecurringPatterns());
    insights.push(...this.detectBudgetWarnings());
    insights.push(...this.detectSavingOpportunities());
    insights.push(...this.detectAchievements());

    return insights.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }

  private detectWeekendSpending(): SmartInsight[] {
    const insights: SmartInsight[] = [];
    
    const weekdayExpenses = this.expenses.filter(exp => !isWeekend(new Date(exp.date)));
    const weekendExpenses = this.expenses.filter(exp => isWeekend(new Date(exp.date)));

    if (weekdayExpenses.length === 0 || weekendExpenses.length === 0) return insights;

    const weekdayTotal = weekdayExpenses.reduce((sum, exp) => sum + exp.amount, 0);
    const weekendTotal = weekendExpenses.reduce((sum, exp) => sum + exp.amount, 0);

    const weekdayAvg = weekdayTotal / weekdayExpenses.length;
    const weekendAvg = weekendTotal / weekendExpenses.length;

    const difference = ((weekendAvg - weekdayAvg) / weekdayAvg) * 100;

    if (Math.abs(difference) > 20) {
      insights.push({
        id: `insight-weekend-${Date.now()}`,
        type: difference > 0 ? 'pattern' : 'suggestion',
        title: difference > 0 
          ? `You spend ${Math.abs(difference).toFixed(0)}% more on weekends` 
          : `You spend ${Math.abs(difference).toFixed(0)}% less on weekends`,
        description: difference > 0
          ? `Your average weekend spending is $${weekendAvg.toFixed(2)} vs $${weekdayAvg.toFixed(2)} on weekdays. Consider planning weekend activities with a budget.`
          : `Great job! You're more mindful of spending on weekends.`,
        impact: Math.abs(difference) > 40 ? 'high' : 'medium',
        data: { weekdayAvg, weekendAvg, difference },
        timestamp: new Date(),
      });
    }

    return insights;
  }

  private detectUnusualSpending(): SmartInsight[] {
    const insights: SmartInsight[] = [];
    
    const categoryTotals = new Map<string, number[]>();
    
    this.expenses.forEach(exp => {
      if (!categoryTotals.has(exp.category)) {
        categoryTotals.set(exp.category, []);
      }
      categoryTotals.get(exp.category)!.push(exp.amount);
    });

    categoryTotals.forEach((amounts, category) => {
      if (amounts.length < 3) return;

      const avg = amounts.reduce((a, b) => a + b, 0) / amounts.length;
      const max = Math.max(...amounts);
      
      if (max > avg * 2) {
        insights.push({
          id: `insight-unusual-${category}-${Date.now()}`,
          type: 'warning',
          title: `Unusual spending detected in ${category}`,
          description: `A $${max.toFixed(2)} expense is significantly higher than your average of $${avg.toFixed(2)} in this category.`,
          impact: 'medium',
          data: { category, max, avg },
          timestamp: new Date(),
        });
      }
    });

    return insights;
  }

  private detectRecurringPatterns(): SmartInsight[] {
    const insights: SmartInsight[] = [];
    
    // Group by description similarity
    const descriptionGroups = new Map<string, Expense[]>();
    
    this.expenses.forEach(exp => {
      const key = exp.description.toLowerCase().trim();
      if (!descriptionGroups.has(key)) {
        descriptionGroups.set(key, []);
      }
      descriptionGroups.get(key)!.push(exp);
    });

    descriptionGroups.forEach((exps, description) => {
      if (exps.length >= 3) {
        const avgAmount = exps.reduce((sum, exp) => sum + exp.amount, 0) / exps.length;
        const dates = exps.map(exp => new Date(exp.date)).sort((a, b) => a.getTime() - b.getTime());
        
        if (dates.length >= 2) {
          const daysBetween = differenceInDays(dates[dates.length - 1], dates[0]) / (dates.length - 1);
          
          let frequency = 'regularly';
          if (daysBetween <= 7) frequency = 'weekly';
          else if (daysBetween <= 31) frequency = 'monthly';
          
          insights.push({
            id: `insight-recurring-${description}-${Date.now()}`,
            type: 'pattern',
            title: `Recurring expense detected: ${description}`,
            description: `You spend approximately $${avgAmount.toFixed(2)} ${frequency} on "${description}". Consider setting up a budget for this.`,
            impact: 'medium',
            data: { description, avgAmount, frequency, occurrences: exps.length },
            timestamp: new Date(),
          });
        }
      }
    });

    return insights.slice(0, 3);
  }

  private detectBudgetWarnings(): SmartInsight[] {
    const insights: SmartInsight[] = [];
    
    const monthStart = startOfMonth(new Date());
    const monthEnd = endOfMonth(new Date());
    
    const monthExpenses = this.expenses.filter(exp => {
      const expDate = new Date(exp.date);
      return expDate >= monthStart && expDate <= monthEnd;
    });

    const categoryTotals = new Map<string, number>();
    monthExpenses.forEach(exp => {
      categoryTotals.set(
        exp.category, 
        (categoryTotals.get(exp.category) || 0) + exp.amount
      );
    });

    // Simple threshold-based warnings
    categoryTotals.forEach((total, category) => {
      if (total > 500) {
        insights.push({
          id: `insight-budget-${category}-${Date.now()}`,
          type: 'warning',
          title: `High spending in ${category} this month`,
          description: `You've spent $${total.toFixed(2)} on ${category} this month. Consider reviewing your spending in this category.`,
          impact: total > 1000 ? 'high' : 'medium',
          data: { category, total },
          timestamp: new Date(),
        });
      }
    });

    return insights.slice(0, 2);
  }

  private detectSavingOpportunities(): SmartInsight[] {
    const insights: SmartInsight[] = [];
    
    // Detect small frequent purchases
    const smallExpenses = this.expenses.filter(exp => exp.amount < 20);
    const smallExpensesTotal = smallExpenses.reduce((sum, exp) => sum + exp.amount, 0);
    
    if (smallExpenses.length > 10) {
      insights.push({
        id: `insight-small-purchases-${Date.now()}`,
        type: 'suggestion',
        title: 'Small purchases add up',
        description: `You've made ${smallExpenses.length} purchases under $20, totaling $${smallExpensesTotal.toFixed(2)}. Consider reducing impulse purchases.`,
        impact: 'medium',
        data: { count: smallExpenses.length, total: smallExpensesTotal },
        timestamp: new Date(),
      });
    }

    return insights;
  }

  private detectAchievements(): SmartInsight[] {
    const insights: SmartInsight[] = [];
    
    const thisMonth = startOfMonth(new Date());
    const lastMonth = startOfMonth(new Date(new Date().setMonth(new Date().getMonth() - 1)));
    
    const thisMonthExpenses = this.expenses.filter(exp => 
      new Date(exp.date) >= thisMonth
    );
    const lastMonthExpenses = this.expenses.filter(exp => {
      const expDate = new Date(exp.date);
      return expDate >= lastMonth && expDate < thisMonth;
    });

    const thisMonthTotal = thisMonthExpenses.reduce((sum, exp) => sum + exp.amount, 0);
    const lastMonthTotal = lastMonthExpenses.reduce((sum, exp) => sum + exp.amount, 0);

    if (lastMonthTotal > 0 && thisMonthTotal < lastMonthTotal) {
      const savings = lastMonthTotal - thisMonthTotal;
      const percentDecrease = (savings / lastMonthTotal) * 100;
      
      insights.push({
        id: `insight-achievement-${Date.now()}`,
        type: 'achievement',
        title: '🎉 Great job on reducing spending!',
        description: `You've spent ${percentDecrease.toFixed(0)}% less this month compared to last month, saving $${savings.toFixed(2)}!`,
        impact: 'high',
        data: { savings, percentDecrease },
        timestamp: new Date(),
      });
    }

    return insights;
  }

  getSpendingPatterns(): SpendingPattern[] {
    const patterns: SpendingPattern[] = [];

    // Pattern 1: Time-based patterns
    const morningExp = this.expenses.filter(exp => {
      const hour = new Date(exp.date).getHours();
      return hour >= 6 && hour < 12;
    });
    
    if (morningExp.length > this.expenses.length * 0.3) {
      patterns.push({
        pattern: 'Morning Spender',
        confidence: (morningExp.length / this.expenses.length) * 100,
        description: 'You tend to make most purchases in the morning',
        categories: [...new Set(morningExp.map(e => e.category))],
        timeframe: '6 AM - 12 PM',
      });
    }

    return patterns;
  }
}
