import { Upload, FileJson, FileText } from 'lucide-react';
import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { useExpenseStore } from '../../store/expenseStore';
import { useNotificationStore } from './NotificationSystem';

export function DataImport() {
  const addExpense = useExpenseStore((state) => state.addExpense);
  const addBudget = useExpenseStore((state) => state.addBudget);
  const addGoal = useExpenseStore((state) => state.addGoal);
  const addNotification = useNotificationStore((state) => state.addNotification);

  const handleJSONImport = (data: any) => {
    try {
      let imported = 0;

      if (data.expenses && Array.isArray(data.expenses)) {
        data.expenses.forEach((exp: any) => {
          addExpense({
            ...exp,
            date: new Date(exp.date),
          });
          imported++;
        });
      }

      if (data.budgets && Array.isArray(data.budgets)) {
        data.budgets.forEach((budget: any) => {
          addBudget({
            ...budget,
            startDate: new Date(budget.startDate),
            endDate: new Date(budget.endDate),
          });
        });
      }

      if (data.goals && Array.isArray(data.goals)) {
        data.goals.forEach((goal: any) => {
          addGoal({
            ...goal,
            deadline: new Date(goal.deadline),
          });
        });
      }

      addNotification({
        type: 'success',
        title: 'Import Successful',
        message: `Imported ${imported} expenses and related data`,
      });
    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Import Failed',
        message: 'Failed to parse JSON file. Please check the format.',
      });
    }
  };

  const handleCSVImport = (text: string) => {
    try {
      const lines = text.split('\n');
      const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
      
      let imported = 0;
      for (let i = 1; i < lines.length; i++) {
        if (!lines[i].trim()) continue;

        const values = lines[i].split(',').map(v => v.trim().replace(/"/g, ''));
        const expense: any = {};

        headers.forEach((header, index) => {
          expense[header.toLowerCase()] = values[index];
        });

        if (expense.amount && expense.category && expense.description) {
          addExpense({
            id: `imp-${Date.now()}-${i}`,
            amount: parseFloat(expense.amount),
            category: expense.category,
            description: expense.description,
            date: expense.date ? new Date(expense.date) : new Date(),
            paymentMethod: expense['payment method'] || expense.paymentmethod || 'Cash',
            tags: expense.tags ? expense.tags.split(';').map((t: string) => t.trim()) : [],
            isRecurring: false,
            location: expense.location || '',
          });
          imported++;
        }
      }

      addNotification({
        type: 'success',
        title: 'CSV Import Successful',
        message: `Imported ${imported} expenses from CSV`,
      });
    } catch (error) {
      addNotification({
        type: 'error',
        title: 'CSV Import Failed',
        message: 'Failed to parse CSV file. Please check the format.',
      });
    }
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = (e) => {
      const content = e.target?.result as string;

      if (file.name.endsWith('.json')) {
        try {
          const data = JSON.parse(content);
          handleJSONImport(data);
        } catch (error) {
          addNotification({
            type: 'error',
            title: 'Invalid JSON',
            message: 'The JSON file is not properly formatted.',
          });
        }
      } else if (file.name.endsWith('.csv')) {
        handleCSVImport(content);
      }
    };

    reader.readAsText(file);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/json': ['.json'],
      'text/csv': ['.csv'],
    },
    multiple: false,
  });

  return (
    <div className="glass-dark rounded-2xl p-6">
      <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
        <Upload className="w-6 h-6" />
        Import Data
      </h3>

      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-all ${
          isDragActive
            ? 'border-blue-500 bg-blue-500/10'
            : 'border-white/30 hover:border-white/50 hover:bg-white/5'
        }`}
      >
        <input {...getInputProps()} />
        <Upload className="w-16 h-16 text-white/60 mx-auto mb-4" />
        <p className="text-white text-lg mb-2">
          {isDragActive
            ? 'Drop your file here'
            : 'Drag & drop a file to import'}
        </p>
        <p className="text-white/60 text-sm mb-4">or click to browse</p>
        
        <div className="flex items-center justify-center gap-4 mt-6">
          <div className="flex items-center gap-2 px-4 py-2 bg-blue-500/20 rounded-lg">
            <FileJson className="w-5 h-5 text-blue-400" />
            <span className="text-blue-300 text-sm">.json</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-green-500/20 rounded-lg">
            <FileText className="w-5 h-5 text-green-400" />
            <span className="text-green-300 text-sm">.csv</span>
          </div>
        </div>
      </div>

      <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
        <p className="text-blue-300 text-sm">
          <strong>Supported formats:</strong>
          <br />
          • JSON files exported from this app
          <br />
          • CSV files with headers: Date, Amount, Category, Description, Payment Method, Tags, Location
        </p>
      </div>
    </div>
  );
}
