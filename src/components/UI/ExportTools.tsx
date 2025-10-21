import { motion } from 'framer-motion';
import { useExpenseStore } from '../../store/expenseStore';
import { Download, FileText, FileSpreadsheet, File } from 'lucide-react';
import { format } from 'date-fns';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { useNotificationStore } from './NotificationSystem';

export function ExportTools() {
  const expenses = useExpenseStore((state) => state.expenses);
  const budgets = useExpenseStore((state) => state.budgets);
  const goals = useExpenseStore((state) => state.goals);
  const addNotification = useNotificationStore((state) => state.addNotification);



  const exportToPDF = () => {
    const doc = new jsPDF();
    
    // Add title
    doc.setFontSize(20);
    doc.setTextColor(212, 197, 160);
    doc.text('Ledgerly Report', 14, 20);
    
    // Add generation date
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Generated: ${format(new Date(), 'MMMM dd, yyyy HH:mm')}`, 14, 28);
    
    // Summary section
    const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);
    doc.setFontSize(12);
    doc.setTextColor(0);
    doc.text('Summary', 14, 38);
    doc.setFontSize(10);
    doc.text(`Total Expenses: $${totalExpenses.toFixed(2)}`, 14, 45);
    doc.text(`Total Transactions: ${expenses.length}`, 14, 51);
    
    // Expenses table
    const tableData = expenses.map(exp => [
      format(new Date(exp.date), 'MM/dd/yyyy'),
      exp.category,
      exp.description,
      exp.paymentMethod,
      `$${exp.amount.toFixed(2)}`,
    ]);
    
    autoTable(doc, {
      startY: 60,
      head: [['Date', 'Category', 'Description', 'Payment', 'Amount']],
      body: tableData,
      theme: 'grid',
      headStyles: { fillColor: [102, 126, 234], textColor: 255 },
      styles: { fontSize: 8 },
      columnStyles: {
        4: { halign: 'right' },
      },
    });
    
    // Category breakdown
    const categoryTotals = expenses.reduce((acc, exp) => {
      acc[exp.category] = (acc[exp.category] || 0) + exp.amount;
      return acc;
    }, {} as Record<string, number>);
    
    const categoryData = Object.entries(categoryTotals)
      .sort((a, b) => b[1] - a[1])
      .map(([cat, amount]) => [
        cat,
        `$${amount.toFixed(2)}`,
        `${((amount / totalExpenses) * 100).toFixed(1)}%`,
      ]);
    
    if (categoryData.length > 0) {
      const finalY = (doc as any).lastAutoTable.finalY || 60;
      
      doc.setFontSize(12);
      doc.setTextColor(0);
      doc.text('Category Breakdown', 14, finalY + 15);
      
      autoTable(doc, {
        startY: finalY + 20,
        head: [['Category', 'Amount', 'Percentage']],
        body: categoryData,
        theme: 'striped',
        headStyles: { fillColor: [102, 126, 234], textColor: 255 },
        styles: { fontSize: 9 },
      });
    }
    
    // Save PDF
    doc.save(`expense-report-${format(new Date(), 'yyyy-MM-dd')}.pdf`);
    
    addNotification({
      type: 'success',
      title: 'PDF Generated',
      message: 'Report exported successfully as PDF',
    });
  };

  const exportToExcel = () => {
    // Create workbook
    const wb = XLSX.utils.book_new();
    
    // Expenses sheet
    const expensesData = expenses.map(exp => ({
      Date: format(new Date(exp.date), 'yyyy-MM-dd'),
      Amount: exp.amount,
      Category: exp.category,
      Description: exp.description,
      'Payment Method': exp.paymentMethod,
      Tags: exp.tags.join(', '),
      Location: exp.location || '',
    }));
    
    const expensesSheet = XLSX.utils.json_to_sheet(expensesData);
    XLSX.utils.book_append_sheet(wb, expensesSheet, 'Expenses');
    
    // Summary sheet
    const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);
    const categoryTotals = expenses.reduce((acc, exp) => {
      acc[exp.category] = (acc[exp.category] || 0) + exp.amount;
      return acc;
    }, {} as Record<string, number>);
    
    const summaryData = [
      { Metric: 'Total Expenses', Value: `$${totalExpenses.toFixed(2)}` },
      { Metric: 'Total Transactions', Value: expenses.length },
      { Metric: 'Average Transaction', Value: `$${(totalExpenses / expenses.length).toFixed(2)}` },
      { Metric: '', Value: '' },
      { Metric: 'Category Breakdown', Value: '' },
      ...Object.entries(categoryTotals)
        .sort((a, b) => b[1] - a[1])
        .map(([cat, amount]) => ({
          Metric: cat,
          Value: `$${amount.toFixed(2)}`,
          Percentage: `${((amount / totalExpenses) * 100).toFixed(1)}%`,
        })),
    ];
    
    const summarySheet = XLSX.utils.json_to_sheet(summaryData);
    XLSX.utils.book_append_sheet(wb, summarySheet, 'Summary');
    
    // Budgets sheet
    if (budgets.length > 0) {
      const budgetsData = budgets.map(b => ({
        Category: b.category,
        Limit: b.limit,
        Spent: b.spent,
        Remaining: b.limit - b.spent,
        Period: b.period,
        'Alert Threshold': `${b.alertThreshold}%`,
      }));
      
      const budgetsSheet = XLSX.utils.json_to_sheet(budgetsData);
      XLSX.utils.book_append_sheet(wb, budgetsSheet, 'Budgets');
    }
    
    // Goals sheet
    if (goals.length > 0) {
      const goalsData = goals.map(g => ({
        Name: g.name,
        'Target Amount': g.targetAmount,
        'Current Amount': g.currentAmount,
        Remaining: g.targetAmount - g.currentAmount,
        Progress: `${((g.currentAmount / g.targetAmount) * 100).toFixed(1)}%`,
        Deadline: format(new Date(g.deadline), 'yyyy-MM-dd'),
        Priority: g.priority,
      }));
      
      const goalsSheet = XLSX.utils.json_to_sheet(goalsData);
      XLSX.utils.book_append_sheet(wb, goalsSheet, 'Goals');
    }
    
    // Save Excel file
    XLSX.writeFile(wb, `expense-tracker-${format(new Date(), 'yyyy-MM-dd')}.xlsx`);
    
    addNotification({
      type: 'success',
      title: 'Excel Exported',
      message: 'Complete data exported successfully to Excel',
    });
  };

  const generateReport = () => {
    const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);
    const categoryTotals = expenses.reduce((acc, exp) => {
      acc[exp.category] = (acc[exp.category] || 0) + exp.amount;
      return acc;
    }, {} as Record<string, number>);

    const report = `
EXPENSE REPORT
Generated: ${format(new Date(), 'MMMM dd, yyyy')}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

SUMMARY
Total Expenses: $${totalExpenses.toFixed(2)}
Number of Transactions: ${expenses.length}

CATEGORY BREAKDOWN
${Object.entries(categoryTotals)
  .sort((a, b) => b[1] - a[1])
  .map(([cat, amount]) => `${cat}: $${amount.toFixed(2)} (${((amount / totalExpenses) * 100).toFixed(1)}%)`)
  .join('\n')}

BUDGETS
${budgets.length > 0 
  ? budgets.map(b => `${b.category}: $${b.spent.toFixed(2)} / $${b.limit.toFixed(2)} (${b.period})`).join('\n')
  : 'No budgets set'}

GOALS
${goals.length > 0
  ? goals.map(g => `${g.name}: $${g.currentAmount.toFixed(2)} / $${g.targetAmount.toFixed(2)} (${((g.currentAmount / g.targetAmount) * 100).toFixed(1)}%)`).join('\n')
  : 'No goals set'}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Report generated by Ledgerly
    `;

    const blob = new Blob([report], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `report-${format(new Date(), 'yyyy-MM-dd')}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="glass-dark rounded-2xl p-6">
      <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
        <Download className="w-6 h-6" />
        Export & Reports
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={exportToPDF}
          className="glass rounded-xl p-6 text-left group hover:bg-white/20 transition-all flex flex-col items-start h-full"
        >
          <div className="p-3 bg-red-500/20 rounded-lg w-fit mb-3 group-hover:bg-red-500/30 transition-colors">
            <File className="w-6 h-6 text-red-400" />
          </div>
          <h4 className="text-white font-semibold mb-1">Export PDF</h4>
          <p className="text-white/60 text-sm">Professional report</p>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={exportToExcel}
          className="glass rounded-xl p-6 text-left group hover:bg-white/20 transition-all flex flex-col items-start h-full"
        >
          <div className="p-3 bg-green-500/20 rounded-lg w-fit mb-3 group-hover:bg-green-500/30 transition-colors">
            <FileSpreadsheet className="w-6 h-6 text-green-400" />
          </div>
          <h4 className="text-white font-semibold mb-1">Export Excel</h4>
          <p className="text-white/60 text-sm">Complete workbook</p>
        </motion.button>



        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={generateReport}
          className="glass rounded-xl p-6 text-left group hover:bg-white/20 transition-all flex flex-col items-start h-full"
        >
          <div className="p-3 bg-purple-500/20 rounded-lg w-fit mb-3 group-hover:bg-purple-500/30 transition-colors">
            <FileText className="w-6 h-6 text-purple-400" />
          </div>
          <h4 className="text-white font-semibold mb-1">Text Report</h4>
          <p className="text-white/60 text-sm">Plain text summary</p>
        </motion.button>
      </div>
    </div>
  );
}
