import React, { useState } from 'react';
import { 
  FileText, 
  Download, 
  Calendar, 
  TrendingUp, 
  Users, 
  Package, 
  DollarSign,
  BarChart3,
  PieChart,
  Filter
} from 'lucide-react';
import { Purchase, Sale, Worker, Task, Expense } from '../types';
import { Modal } from './Modal';
import { FormField } from './FormField';
import { AnalyticsChart } from './AnalyticsChart';
import jsPDF from 'jspdf';
import * as XLSX from 'xlsx';
import toast from 'react-hot-toast';

interface ReportsManagerProps {
  purchases: Purchase[];
  sales: Sale[];
  workers: Worker[];
  tasks: Task[];
  expenses: Expense[];
}

export const ReportsManager: React.FC<ReportsManagerProps> = ({
  purchases,
  sales,
  workers,
  tasks,
  expenses
}) => {
  const [activeReport, setActiveReport] = useState<string | null>(null);
  const [showCustomReport, setShowCustomReport] = useState(false);
  const [dateRange, setDateRange] = useState({
    start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0]
  });

  const [customReport, setCustomReport] = useState({
    name: '',
    type: 'sales',
    dateStart: '',
    dateEnd: '',
    includeCharts: true,
    format: 'pdf'
  });

  const reportTypes = [
    {
      id: 'sales',
      title: 'Отчет по продажам',
      description: 'Анализ продаж за период',
      icon: TrendingUp,
      color: 'from-green-500 to-green-600'
    },
    {
      id: 'purchases',
      title: 'Отчет по закупкам',
      description: 'Анализ закупок и поставщиков',
      icon: Package,
      color: 'from-blue-500 to-blue-600'
    },
    {
      id: 'financial',
      title: 'Финансовый отчет',
      description: 'Прибыли, убытки, рентабельность',
      icon: DollarSign,
      color: 'from-purple-500 to-purple-600'
    },
    {
      id: 'workers',
      title: 'Отчет по сотрудникам',
      description: 'Производительность персонала',
      icon: Users,
      color: 'from-orange-500 to-orange-600'
    },
    {
      id: 'tasks',
      title: 'Отчет по задачам',
      description: 'Выполнение задач и проектов',
      icon: BarChart3,
      color: 'from-indigo-500 to-indigo-600'
    },
    {
      id: 'expenses',
      title: 'Отчет по расходам',
      description: 'Анализ операционных расходов',
      icon: PieChart,
      color: 'from-red-500 to-red-600'
    }
  ];

  const filterDataByDate = (data: any[], dateField: string = 'date') => {
    return data.filter(item => {
      const itemDate = new Date(item[dateField]);
      const startDate = new Date(dateRange.start);
      const endDate = new Date(dateRange.end);
      return itemDate >= startDate && itemDate <= endDate;
    });
  };

  const generateSalesReport = () => {
    const filteredSales = filterDataByDate(sales);
    const totalRevenue = filteredSales.reduce((sum, sale) => sum + (sale.quantity * sale.costPerUnit), 0);
    const totalQuantity = filteredSales.reduce((sum, sale) => sum + sale.quantity, 0);
    const averageCheck = filteredSales.length > 0 ? totalRevenue / filteredSales.length : 0;

    const salesByDay = filteredSales.reduce((acc, sale) => {
      const date = new Date(sale.date).toLocaleDateString('ru-RU');
      acc[date] = (acc[date] || 0) + (sale.quantity * sale.costPerUnit);
      return acc;
    }, {} as Record<string, number>);

    const chartData = Object.entries(salesByDay).map(([date, value]) => ({
      name: date,
      value
    }));

    return {
      title: 'Отчет по продажам',
      period: `${new Date(dateRange.start).toLocaleDateString('ru-RU')} - ${new Date(dateRange.end).toLocaleDateString('ru-RU')}`,
      metrics: [
        { label: 'Общий доход', value: `${totalRevenue.toLocaleString()} сом` },
        { label: 'Количество продаж', value: filteredSales.length.toString() },
        { label: 'Общее количество', value: totalQuantity.toString() },
        { label: 'Средний чек', value: `${Math.round(averageCheck).toLocaleString()} сом` }
      ],
      chartData,
      details: filteredSales
    };
  };

  const generateFinancialReport = () => {
    const filteredSales = filterDataByDate(sales);
    const filteredPurchases = filterDataByDate(purchases);
    const filteredExpenses = filterDataByDate(expenses);

    const totalRevenue = filteredSales.reduce((sum, sale) => sum + (sale.quantity * sale.costPerUnit), 0);
    const totalPurchases = filteredPurchases.reduce((sum, purchase) => sum + (purchase.quantity * purchase.costPerUnit), 0);
    const totalExpenses = filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0);
    const grossProfit = totalRevenue - totalPurchases;
    const netProfit = grossProfit - totalExpenses;
    const profitMargin = totalRevenue > 0 ? (netProfit / totalRevenue) * 100 : 0;

    const expensesByCategory = filteredExpenses.reduce((acc, expense) => {
      acc[expense.type] = (acc[expense.type] || 0) + expense.amount;
      return acc;
    }, {} as Record<string, number>);

    const chartData = Object.entries(expensesByCategory).map(([type, value]) => ({
      name: type,
      value
    }));

    return {
      title: 'Финансовый отчет',
      period: `${new Date(dateRange.start).toLocaleDateString('ru-RU')} - ${new Date(dateRange.end).toLocaleDateString('ru-RU')}`,
      metrics: [
        { label: 'Общий доход', value: `${totalRevenue.toLocaleString()} сом` },
        { label: 'Валовая прибыль', value: `${grossProfit.toLocaleString()} сом` },
        { label: 'Чистая прибыль', value: `${netProfit.toLocaleString()} сом` },
        { label: 'Рентабельность', value: `${profitMargin.toFixed(1)}%` }
      ],
      chartData,
      details: { sales: filteredSales, purchases: filteredPurchases, expenses: filteredExpenses }
    };
  };

  const generateWorkersReport = () => {
    const filteredTasks = filterDataByDate(tasks);
    
    const workerStats = workers.map(worker => {
      const workerTasks = filteredTasks.filter(task => task.workerId === worker.id);
      const completedTasks = workerTasks.filter(task => task.status === 'completed');
      const totalEarnings = completedTasks.reduce((sum, task) => sum + (task.quantity * task.ratePerUnit), 0);
      
      return {
        name: worker.name,
        role: worker.role,
        totalTasks: workerTasks.length,
        completedTasks: completedTasks.length,
        completionRate: workerTasks.length > 0 ? (completedTasks.length / workerTasks.length) * 100 : 0,
        earnings: totalEarnings
      };
    });

    const chartData = workerStats.map(worker => ({
      name: worker.name,
      value: worker.completionRate
    }));

    return {
      title: 'Отчет по сотрудникам',
      period: `${new Date(dateRange.start).toLocaleDateString('ru-RU')} - ${new Date(dateRange.end).toLocaleDateString('ru-RU')}`,
      metrics: [
        { label: 'Всего сотрудников', value: workers.length.toString() },
        { label: 'Активных сотрудников', value: workers.filter(w => w.status === 'active').length.toString() },
        { label: 'Средняя производительность', value: `${(workerStats.reduce((sum, w) => sum + w.completionRate, 0) / workerStats.length || 0).toFixed(1)}%` }
      ],
      chartData,
      details: workerStats
    };
  };

  const exportToPDF = (reportData: any) => {
    try {
      const doc = new jsPDF();
      
      // Заголовок
      doc.setFontSize(20);
      doc.text(reportData.title, 20, 20);
      
      // Период
      doc.setFontSize(12);
      doc.text(`Период: ${reportData.period}`, 20, 35);
      
      // Метрики
      let yPosition = 50;
      doc.setFontSize(14);
      doc.text('Основные показатели:', 20, yPosition);
      yPosition += 10;
      
      doc.setFontSize(12);
      reportData.metrics.forEach((metric: any) => {
        doc.text(`${metric.label}: ${metric.value}`, 20, yPosition);
        yPosition += 8;
      });
      
      doc.save(`${reportData.title.toLowerCase().replace(/\s+/g, '_')}.pdf`);
      toast.success('PDF отчет скачан!');
    } catch (error) {
      toast.error('Ошибка при создании PDF');
    }
  };

  const exportToExcel = (reportData: any) => {
    try {
      const workbook = XLSX.utils.book_new();
      
      // Основные метрики
      const metricsData = reportData.metrics.map((metric: any) => ({
        'Показатель': metric.label,
        'Значение': metric.value
      }));
      
      const metricsSheet = XLSX.utils.json_to_sheet(metricsData);
      XLSX.utils.book_append_sheet(workbook, metricsSheet, 'Метрики');
      
      // Детальные данные
      if (Array.isArray(reportData.details)) {
        const detailsSheet = XLSX.utils.json_to_sheet(reportData.details);
        XLSX.utils.book_append_sheet(workbook, detailsSheet, 'Детали');
      }
      
      XLSX.writeFile(workbook, `${reportData.title.toLowerCase().replace(/\s+/g, '_')}.xlsx`);
      toast.success('Excel отчет скачан!');
    } catch (error) {
      toast.error('Ошибка при создании Excel файла');
    }
  };

  const renderReport = (reportId: string) => {
    let reportData;
    
    switch (reportId) {
      case 'sales':
        reportData = generateSalesReport();
        break;
      case 'financial':
        reportData = generateFinancialReport();
        break;
      case 'workers':
        reportData = generateWorkersReport();
        break;
      default:
        return null;
    }

    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{reportData.title}</h3>
            <p className="text-gray-600 dark:text-gray-400">{reportData.period}</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => exportToPDF(reportData)}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              <FileText className="w-4 h-4" />
              PDF
            </button>
            <button
              onClick={() => exportToExcel(reportData)}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Download className="w-4 h-4" />
              Excel
            </button>
          </div>
        </div>

        {/* Метрики */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {reportData.metrics.map((metric: any, index: number) => (
            <div key={index} className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
              <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">{metric.label}</h4>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{metric.value}</p>
            </div>
          ))}
        </div>

        {/* График */}
        {reportData.chartData && reportData.chartData.length > 0 && (
          <AnalyticsChart
            type={reportId === 'financial' ? 'pie' : 'bar'}
            data={reportData.chartData}
            dataKey="value"
            title={`График - ${reportData.title}`}
            color="#3B82F6"
          />
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Отчеты</h2>
        <button
          onClick={() => setShowCustomReport(true)}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200"
        >
          <FileText className="w-5 h-5" />
          Создать отчет
        </button>
      </div>

      {/* Фильтр по дате */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-gray-400" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Период:</span>
          </div>
          <div className="flex items-center gap-4">
            <input
              type="date"
              value={dateRange.start}
              onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
            <span className="text-gray-500">—</span>
            <input
              type="date"
              value={dateRange.end}
              onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
        </div>
      </div>

      {activeReport ? (
        <div className="space-y-6">
          <button
            onClick={() => setActiveReport(null)}
            className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
          >
            ← Назад к списку отчетов
          </button>
          {renderReport(activeReport)}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reportTypes.map((report) => {
            const Icon = report.icon;
            return (
              <div
                key={report.id}
                onClick={() => setActiveReport(report.id)}
                className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-300 cursor-pointer group"
              >
                <div className={`w-12 h-12 bg-gradient-to-r ${report.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {report.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  {report.description}
                </p>
              </div>
            );
          })}
        </div>
      )}

      {/* Custom Report Modal */}
      <Modal
        isOpen={showCustomReport}
        onClose={() => setShowCustomReport(false)}
        title="Создать пользовательский отчет"
        size="lg"
      >
        <form className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              label="Название отчета"
              value={customReport.name}
              onChange={(value) => setCustomReport({ ...customReport, name: value })}
              required
            />
            
            <FormField
              label="Тип отчета"
              type="select"
              value={customReport.type}
              onChange={(value) => setCustomReport({ ...customReport, type: value })}
              options={reportTypes.map(r => ({ value: r.id, label: r.title }))}
              required
            />
            
            <FormField
              label="Дата начала"
              type="date"
              value={customReport.dateStart}
              onChange={(value) => setCustomReport({ ...customReport, dateStart: value })}
              required
            />
            
            <FormField
              label="Дата окончания"
              type="date"
              value={customReport.dateEnd}
              onChange={(value) => setCustomReport({ ...customReport, dateEnd: value })}
              required
            />
            
            <FormField
              label="Формат экспорта"
              type="select"
              value={customReport.format}
              onChange={(value) => setCustomReport({ ...customReport, format: value })}
              options={[
                { value: 'pdf', label: 'PDF' },
                { value: 'excel', label: 'Excel' }
              ]}
              required
            />
          </div>
          
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="includeCharts"
              checked={customReport.includeCharts}
              onChange={(e) => setCustomReport({ ...customReport, includeCharts: e.target.checked })}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="includeCharts" className="text-sm text-gray-700 dark:text-gray-300">
              Включить графики в отчет
            </label>
          </div>
          
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => {
                // Генерация пользовательского отчета
                toast.success('Отчет создан!');
                setShowCustomReport(false);
              }}
              className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 px-6 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200"
            >
              Создать отчет
            </button>
            <button
              type="button"
              onClick={() => setShowCustomReport(false)}
              className="flex-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 py-3 px-6 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              Отмена
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};