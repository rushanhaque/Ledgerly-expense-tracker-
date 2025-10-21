import { motion } from 'framer-motion';
import { useExpenseStore } from '../../store/expenseStore';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';
import { useState } from 'react';
import { 
  startOfMonth, 
  endOfMonth, 
  eachDayOfInterval, 
  format, 
  isSameDay,
  addMonths,
  subMonths,
  startOfWeek,
  endOfWeek,
  isSameMonth
} from 'date-fns';

export function CalendarView() {
  const expenses = useExpenseStore((state) => state.expenses);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = endOfWeek(monthEnd);

  const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  const getExpensesForDay = (date: Date) => {
    return expenses.filter((exp) => isSameDay(new Date(exp.date), date));
  };

  const getDayTotal = (date: Date) => {
    return getExpensesForDay(date).reduce((sum, exp) => sum + exp.amount, 0);
  };

  const selectedDayExpenses = selectedDate ? getExpensesForDay(selectedDate) : [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-xl">
            <CalendarIcon className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">Calendar View</h2>
            <p className="text-white/60 text-sm">Track expenses by date</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <ChevronLeft className="w-6 h-6 text-white" />
          </button>
          
          <h3 className="text-xl font-semibold text-white min-w-[180px] text-center">
            {format(currentMonth, 'MMMM yyyy')}
          </h3>
          
          <button
            onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <ChevronRight className="w-6 h-6 text-white" />
          </button>
        </div>
      </div>

      <div className="glass-dark rounded-2xl p-6">
        {/* Weekday Headers */}
        <div className="grid grid-cols-7 gap-2 mb-4">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <div key={day} className="text-center text-white/60 font-semibold text-sm py-2">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-2">
          {days.map((day) => {
            const dayExpenses = getExpensesForDay(day);
            const dayTotal = getDayTotal(day);
            const isCurrentMonth = isSameMonth(day, currentMonth);
            const isSelected = selectedDate && isSameDay(day, selectedDate);
            const isToday = isSameDay(day, new Date());

            return (
              <motion.button
                key={day.toISOString()}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedDate(day)}
                className={`
                  relative aspect-square rounded-lg p-2 transition-all
                  ${isCurrentMonth ? 'bg-white/10' : 'bg-white/5'}
                  ${isSelected ? 'ring-2 ring-blue-500 bg-blue-500/20' : ''}
                  ${isToday && !isSelected ? 'ring-2 ring-green-500' : ''}
                  ${dayExpenses.length > 0 ? 'hover:bg-white/20' : 'hover:bg-white/10'}
                `}
              >
                <div className={`text-sm font-semibold mb-1 ${
                  isCurrentMonth ? 'text-white' : 'text-white/40'
                }`}>
                  {format(day, 'd')}
                </div>

                {dayExpenses.length > 0 && (
                  <>
                    <div className="text-xs text-white/80 font-medium">
                      ${dayTotal.toFixed(0)}
                    </div>
                    <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 flex gap-0.5">
                      {dayExpenses.slice(0, 3).map((_, i) => (
                        <div
                          key={i}
                          className="w-1 h-1 rounded-full bg-blue-400"
                        />
                      ))}
                    </div>
                  </>
                )}

                {isToday && (
                  <div className="absolute top-1 right-1 w-2 h-2 rounded-full bg-green-500" />
                )}
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Selected Day Details */}
      {selectedDate && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-dark rounded-2xl p-6"
        >
          <h3 className="text-xl font-bold text-white mb-4">
            {format(selectedDate, 'EEEE, MMMM d, yyyy')}
          </h3>

          {selectedDayExpenses.length === 0 ? (
            <p className="text-white/60 text-center py-8">
              No expenses on this day
            </p>
          ) : (
            <div className="space-y-3">
              {selectedDayExpenses.map((expense) => (
                <div
                  key={expense.id}
                  className="flex items-center justify-between p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
                >
                  <div>
                    <h4 className="text-white font-semibold">{expense.description}</h4>
                    <p className="text-white/60 text-sm">{expense.category}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-white font-bold text-lg">
                      ${expense.amount.toFixed(2)}
                    </p>
                    <p className="text-white/60 text-sm">{expense.paymentMethod}</p>
                  </div>
                </div>
              ))}
              
              <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                <span className="text-white/80 font-semibold">Total</span>
                <span className="text-white font-bold text-xl">
                  ${getDayTotal(selectedDate).toFixed(2)}
                </span>
              </div>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
}
