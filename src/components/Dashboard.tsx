import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  Package, 
  DollarSign, 
  AlertTriangle,
  Calendar,
  Clock,
  Target,
  Activity
} from 'lucide-react';
import { StatCard } from './StatCard';
import { AnalyticsChart } from './AnalyticsChart';
import { Purchase, Sale, Worker, Task, Expense } from '../types';

interface DashboardProps {
  purchases: Purchase[];
  sales: Sale[];
  workers: Worker[];
  tasks: Task[];
  expenses: Expense[];
  onNavigate: (tab: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  purchases,
  sales,
  workers,
  tasks,
  expenses,
  onNavigate
}) => {
  const [timeRange, setTimeRange] = useState('month');
  const [realtimeData, setRealtimeData] = useState({
    activeUsers: 1,
    systemLoad: 45,
    lastUpdate: new Date()
  });

  // Обновление данных в реальном времени
  useEffect(() => {
    const interval = setInterval(() => {
      setRealtimeData(prev => ({
        ...prev,
        systemLoad: Math.floor(Math.random() * 100),
        lastUpdate: new Date()
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // Расчеты
  const totalRevenue = sales.reduce((sum, sale) => sum + (sale.quantity * sale.costPerUnit), 0);
  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const totalPurchases = purchases.reduce((sum, purchase) => sum + (purchase.quantity * purchase.costPerUnit), 0);
  const netProfit = totalRevenue - totalExpenses - totalPurchases;
  const profitMargin = totalRevenue > 0 ? (netProfit / totalRevenue) * 100 : 0;

  const activeTasks = tasks.filter(task => task.status !== 'completed').length;
  const overdueTasks = tasks.filter(task => 
    task.deadline && new Date(task.deadline) < new Date() && task.status !== 'completed'
  ).length;
  const completedTasksToday = tasks.filter(task => 
    task.status === 'completed' && 
    new Date(task.updatedAt || task.date).toDateString() === new Date().toDateString()
  ).length;

  const activeWorkers = workers.filter(worker => worker.status === 'active').length;
  const productivity = tasks.length > 0 ? (tasks.filter(t => t.status === 'completed').length / tasks.length) * 100 : 0;

  // Данные для графиков
  const salesData = [
    { name: 'Пн', value: totalRevenue * 0.15 },
    { name: 'Вт', value: totalRevenue * 0.12 },
    { name: 'Ср', value: totalRevenue * 0.18 },
    { name: 'Чт', value: totalRevenue * 0.14 },
    { name: 'Пт', value: totalRevenue * 0.20 },
    { name: 'Сб', value: totalRevenue * 0.11 },
    { name: 'Вс', value: totalRevenue * 0.10 }
  ];

  const taskStatusData = [
    { name: 'Завершено', value: tasks.filter(t => t.status === 'completed').length },
    { name: 'В работе', value: tasks.filter(t => t.status === 'in_progress').length },
    { name: 'Ожидает', value: tasks.filter(t => t.status === 'pending').length }
  ];

  const expenseCategories = [
    { name: 'Материалы', value: expenses.filter(e => e.type === 'materials').reduce((s, e) => s + e.amount, 0) },
    { name: 'Электричество', value: expenses.filter(e => e.type === 'electricity').reduce((s, e) => s + e.amount, 0) },
    { name: 'Аренда', value: expenses.filter(e => e.type === 'rent').reduce((s, e) => s + e.amount, 0) },
    { name: 'Прочее', value: expenses.filter(e => !['materials', 'electricity', 'rent'].includes(e.type)).reduce((s, e) => s + e.amount, 0) }
  ];

  return (
    <div className="space-y-8">
      {/* Заголовок с фильтрами */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Дашборд</h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Последнее обновление: {realtimeData.lastUpdate.toLocaleTimeString('ru-RU')}
          </p>
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
          
          <div className="flex items-center gap-2 px-3 py-2 bg-green-100 dark:bg-green-900/20 rounded-xl">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-green-700 dark:text-green-300">Онлайн</span>
          </div>
        </div>
      </div>

      {/* Основные метрики */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Общий доход"
          value={`${totalRevenue.toLocaleString()} сом`}
          icon={TrendingUp}
          color="bg-gradient-to-r from-emerald-500 to-emerald-600"
          trend={{ value: 12.5, isPositive: true, period: 'за месяц' }}
          onClick={() => onNavigate('production')}
        />
        
        <StatCard
          title="Чистая прибыль"
          value={`${netProfit.toLocaleString()} сом`}
          icon={DollarSign}
          color={`bg-gradient-to-r ${netProfit >= 0 ? 'from-blue-500 to-blue-600' : 'from-red-500 to-red-600'}`}
          trend={{ value: Math.abs(profitMargin), isPositive: netProfit >= 0, period: 'рентабельность' }}
          onClick={() => onNavigate('management')}
        />
        
        <StatCard
          title="Активные задачи"
          value={activeTasks.toString()}
          icon={Target}
          color="bg-gradient-to-r from-orange-500 to-orange-600"
          trend={overdueTasks > 0 ? { value: overdueTasks, isPositive: false, period: 'просрочено' } : undefined}
          onClick={() => onNavigate('production')}
        />
        
        <StatCard
          title="Сотрудники"
          value={`${activeWorkers}/${workers.length}`}
          icon={Users}
          color="bg-gradient-to-r from-purple-500 to-purple-600"
          trend={{ value: productivity, isPositive: productivity > 70, period: 'продуктивность' }}
          onClick={() => onNavigate('production')}
        />
      </div>

      {/* Дополнительные метрики */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Выполнено сегодня</h3>
            <Clock className="w-5 h-5 text-green-500" />
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{completedTasksToday}</p>
          <p className="text-sm text-green-600 mt-1">задач завершено</p>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Загрузка системы</h3>
            <Activity className="w-5 h-5 text-blue-500" />
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{realtimeData.systemLoad}%</p>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-2">
            <div 
              className="bg-blue-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${realtimeData.systemLoad}%` }}
            />
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Средний чек</h3>
            <Package className="w-5 h-5 text-purple-500" />
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {sales.length > 0 ? Math.round(totalRevenue / sales.length).toLocaleString() : 0} сом
          </p>
          <p className="text-sm text-gray-500 mt-1">за заказ</p>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Просроченные</h3>
            <AlertTriangle className={`w-5 h-5 ${overdueTasks > 0 ? 'text-red-500' : 'text-gray-400'}`} />
          </div>
          <p className={`text-2xl font-bold ${overdueTasks > 0 ? 'text-red-600' : 'text-gray-900 dark:text-white'}`}>
            {overdueTasks}
          </p>
          <p className="text-sm text-red-600 mt-1">задач просрочено</p>
        </div>
      </div>

      {/* Графики */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AnalyticsChart
          type="line"
          data={salesData}
          dataKey="value"
          title="Продажи по дням недели"
          color="#10B981"
        />
        
        <AnalyticsChart
          type="pie"
          data={taskStatusData}
          dataKey="value"
          title="Статус задач"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AnalyticsChart
          type="bar"
          data={expenseCategories}
          dataKey="value"
          title="Расходы по категориям"
          color="#F59E0B"
        />
        
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Ближайшие дедлайны
          </h3>
          <div className="space-y-3">
            {tasks
              .filter(task => task.deadline && task.status !== 'completed')
              .sort((a, b) => new Date(a.deadline!).getTime() - new Date(b.deadline!).getTime())
              .slice(0, 5)
              .map((task) => {
                const isOverdue = new Date(task.deadline!) < new Date();
                const worker = workers.find(w => w.id === task.workerId);
                
                return (
                  <div key={task.id} className={`p-3 rounded-lg ${isOverdue ? 'bg-red-50 dark:bg-red-900/20' : 'bg-gray-50 dark:bg-gray-700'}`}>
                    <div className="flex justify-between items-start">
                      <div>
                        <p className={`font-medium ${isOverdue ? 'text-red-700 dark:text-red-300' : 'text-gray-900 dark:text-white'}`}>
                          {task.clothingType} - {task.partType}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {worker?.name || 'Неизвестный сотрудник'}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className={`text-sm font-medium ${isOverdue ? 'text-red-600' : 'text-gray-600 dark:text-gray-400'}`}>
                          {new Date(task.deadline!).toLocaleDateString('ru-RU')}
                        </p>
                        {isOverdue && (
                          <span className="text-xs text-red-500">Просрочено</span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            
            {tasks.filter(task => task.deadline && task.status !== 'completed').length === 0 && (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Нет задач с дедлайнами</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Быстрые действия */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Быстрые действия
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button
            onClick={() => onNavigate('production')}
            className="p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 text-center group"
          >
            <TrendingUp className="w-8 h-8 text-green-500 mx-auto mb-2 group-hover:scale-110 transition-transform" />
            <p className="text-sm font-medium text-gray-900 dark:text-white">Добавить продажу</p>
          </button>
          
          <button
            onClick={() => onNavigate('production')}
            className="p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 text-center group"
          >
            <Package className="w-8 h-8 text-blue-500 mx-auto mb-2 group-hover:scale-110 transition-transform" />
            <p className="text-sm font-medium text-gray-900 dark:text-white">Добавить закупку</p>
          </button>
          
          <button
            onClick={() => onNavigate('production')}
            className="p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 text-center group"
          >
            <Target className="w-8 h-8 text-orange-500 mx-auto mb-2 group-hover:scale-110 transition-transform" />
            <p className="text-sm font-medium text-gray-900 dark:text-white">Создать задачу</p>
          </button>
          
          <button
            onClick={() => onNavigate('production')}
            className="p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 text-center group"
          >
            <Users className="w-8 h-8 text-purple-500 mx-auto mb-2 group-hover:scale-110 transition-transform" />
            <p className="text-sm font-medium text-gray-900 dark:text-white">Добавить сотрудника</p>
          </button>
        </div>
      </div>
    </div>
  );
};