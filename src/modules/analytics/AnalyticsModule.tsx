import React, { useState } from 'react';
import { Purchase, Sale, Worker, Task, Expense } from '../../types';
import { StatCard } from '../../components/StatCard';
import { AnalyticsChart } from '../../components/AnalyticsChart';
import { ReportsManager } from '../../components/ReportsManager';
import { 
  BarChart3, 
  TrendingUp, 
  DollarSign, 
  Users, 
  Package,
  PieChart,
  LineChart,
  Calendar
} from 'lucide-react';

interface AnalyticsModuleProps {
  purchases: Purchase[];
  sales: Sale[];
  workers: Worker[];
  tasks: Task[];
  expenses: Expense[];
}

export const AnalyticsModule: React.FC<AnalyticsModuleProps> = ({
  purchases,
  sales,
  workers,
  tasks,
  expenses
}) => {
  const [activeView, setActiveView] = useState<'overview' | 'reports' | 'charts'>('overview');
  const [timeRange, setTimeRange] = useState('month');

  // Calculations
  const totalRevenue = sales.reduce((sum, sale) => sum + (sale.quantity * sale.costPerUnit), 0);
  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const totalPurchases = purchases.reduce((sum, purchase) => sum + (purchase.quantity * purchase.costPerUnit), 0);
  const netProfit = totalRevenue - totalExpenses - totalPurchases;
  const profitMargin = totalRevenue > 0 ? (netProfit / totalRevenue) * 100 : 0;

  const completedTasks = tasks.filter(task => task.status === 'completed').length;
  const taskCompletionRate = tasks.length > 0 ? (completedTasks / tasks.length) * 100 : 0;

  // Chart data
  const salesByMonth = [
    { name: 'Янв', value: totalRevenue * 0.15 },
    { name: 'Фев', value: totalRevenue * 0.12 },
    { name: 'Мар', value: totalRevenue * 0.18 },
    { name: 'Апр', value: totalRevenue * 0.14 },
    { name: 'Май', value: totalRevenue * 0.20 },
    { name: 'Июн', value: totalRevenue * 0.11 },
    { name: 'Июл', value: totalRevenue * 0.10 }
  ];

  const expensesByCategory = [
    { name: 'Материалы', value: expenses.filter(e => e.type === 'materials').reduce((s, e) => s + e.amount, 0) },
    { name: 'Электричество', value: expenses.filter(e => e.type === 'electricity').reduce((s, e) => s + e.amount, 0) },
    { name: 'Аренда', value: expenses.filter(e => e.type === 'rent').reduce((s, e) => s + e.amount, 0) },
    { name: 'Транспорт', value: expenses.filter(e => e.type === 'transport').reduce((s, e) => s + e.amount, 0) },
    { name: 'Прочее', value: expenses.filter(e => !['materials', 'electricity', 'rent', 'transport'].includes(e.type)).reduce((s, e) => s + e.amount, 0) }
  ];

  const workerProductivity = workers.map(worker => {
    const workerTasks = tasks.filter(task => task.workerId === worker.id);
    const completedWorkerTasks = workerTasks.filter(task => task.status === 'completed');
    const productivity = workerTasks.length > 0 ? (completedWorkerTasks.length / workerTasks.length) * 100 : 0;
    
    return {
      name: worker.name,
      value: productivity
    };
  });

  const renderOverview = () => (
    <div className="space-y-8">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Общий доход"
          value={`${totalRevenue.toLocaleString()} сом`}
          icon={TrendingUp}
          color="bg-gradient-to-r from-emerald-500 to-emerald-600"
          trend={{ value: 12.5, isPositive: true, period: 'за месяц' }}
        />
        
        <StatCard
          title="Чистая прибыль"
          value={`${netProfit.toLocaleString()} сом`}
          icon={DollarSign}
          color={`bg-gradient-to-r ${netProfit >= 0 ? 'from-blue-500 to-blue-600' : 'from-red-500 to-red-600'}`}
          trend={{ value: Math.abs(profitMargin), isPositive: netProfit >= 0, period: 'рентабельность' }}
        />
        
        <StatCard
          title="Выполнение задач"
          value={`${taskCompletionRate.toFixed(1)}%`}
          icon={Package}
          color="bg-gradient-to-r from-purple-500 to-purple-600"
          trend={{ value: taskCompletionRate, isPositive: taskCompletionRate > 70, period: 'эффективность' }}
        />
        
        <StatCard
          title="Активные сотрудники"
          value={`${workers.filter(w => w.status === 'active').length}/${workers.length}`}
          icon={Users}
          color="bg-gradient-to-r from-orange-500 to-orange-600"
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AnalyticsChart
          type="line"
          data={salesByMonth}
          dataKey="value"
          title="Динамика продаж по месяцам"
          color="#10B981"
        />
        
        <AnalyticsChart
          type="pie"
          data={expensesByCategory}
          dataKey="value"
          title="Структура расходов"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AnalyticsChart
          type="bar"
          data={workerProductivity}
          dataKey="value"
          title="Производительность сотрудников"
          color="#8B5CF6"
        />
        
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Ключевые показатели
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">Средний чек</span>
              <span className="font-semibold text-gray-900 dark:text-white">
                {sales.length > 0 ? Math.round(totalRevenue / sales.length).toLocaleString() : 0} сом
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">Рентабельность</span>
              <span className={`font-semibold ${profitMargin >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {profitMargin.toFixed(1)}%
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">Всего заказов</span>
              <span className="font-semibold text-gray-900 dark:text-white">{sales.length}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">Завершенных задач</span>
              <span className="font-semibold text-gray-900 dark:text-white">
                {completedTasks}/{tasks.length}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderCharts = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AnalyticsChart
          type="bar"
          data={salesByMonth}
          dataKey="value"
          title="Продажи по месяцам (столбчатая)"
          color="#3B82F6"
        />
        
        <AnalyticsChart
          type="line"
          data={salesByMonth}
          dataKey="value"
          title="Тренд продаж (линейная)"
          color="#10B981"
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AnalyticsChart
          type="pie"
          data={expensesByCategory}
          dataKey="value"
          title="Распределение расходов"
        />
        
        <AnalyticsChart
          type="bar"
          data={workerProductivity}
          dataKey="value"
          title="Эффективность сотрудников"
          color="#F59E0B"
        />
      </div>
    </div>
  );

  const views = [
    { id: 'overview', label: 'Обзор', icon: BarChart3 },
    { id: 'charts', label: 'Графики', icon: PieChart },
    { id: 'reports', label: 'Отчеты', icon: LineChart }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Аналитика</h2>
          <p className="text-gray-600 dark:text-gray-400">Анализ данных и отчетность</p>
        </div>
        
        <div className="flex items-center gap-3">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
          >
            <option value="day">Сегодня</option>
            <option value="week">Неделя</option>
            <option value="month">Месяц</option>
            <option value="year">Год</option>
          </select>
        </div>
      </div>

      {/* View Tabs */}
      <div className="flex gap-2 p-1 bg-gray-100 dark:bg-gray-800 rounded-xl">
        {views.map((view) => {
          const Icon = view.icon;
          return (
            <button
              key={view.id}
              onClick={() => setActiveView(view.id as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                activeView === view.id
                  ? 'bg-white dark:bg-gray-700 text-blue-600 shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
              }`}
            >
              <Icon className="w-4 h-4" />
              {view.label}
            </button>
          );
        })}
      </div>

      {/* Content */}
      {activeView === 'overview' && renderOverview()}
      {activeView === 'charts' && renderCharts()}
      {activeView === 'reports' && (
        <ReportsManager
          purchases={purchases}
          sales={sales}
          workers={workers}
          tasks={tasks}
          expenses={expenses}
        />
      )}
    </div>
  );
};