import React, { useState } from 'react';
import { DollarSign, TrendingUp, TrendingDown, PieChart, BarChart3, Calculator, CreditCard, Wallet } from 'lucide-react';
import { Budget, Expense, Sale, Purchase } from '../types';
import { Modal } from './Modal';
import { FormField } from './FormField';
import { DataTable } from './DataTable';
import { AnalyticsChart } from './AnalyticsChart';

interface FinancialManagerProps {
  expenses: Expense[];
  sales: Sale[];
  purchases: Purchase[];
  budgets: Budget[];
  onAddBudget: (budget: Omit<Budget, 'id' | 'spent' | 'alerts' | 'createdBy' | 'updatedAt'>) => void;
  onUpdateBudget: (budget: Budget) => void;
}

export const FinancialManager: React.FC<FinancialManagerProps> = ({
  expenses,
  sales,
  purchases,
  budgets,
  onAddBudget,
  onUpdateBudget
}) => {
  const [view, setView] = useState<'overview' | 'budgets' | 'reports' | 'taxes'>('overview');
  const [showBudgetModal, setShowBudgetModal] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState('monthly');

  const [budgetForm, setBudgetForm] = useState({
    name: '',
    category: '',
    allocated: '',
    period: 'monthly' as Budget['period'],
    startDate: '',
    endDate: ''
  });

  // Financial calculations
  const totalRevenue = sales.reduce((sum, sale) => sum + (sale.quantity * sale.costPerUnit), 0);
  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const totalPurchases = purchases.reduce((sum, purchase) => sum + (purchase.quantity * purchase.costPerUnit), 0);
  const grossProfit = totalRevenue - totalPurchases;
  const netProfit = grossProfit - totalExpenses;
  const profitMargin = totalRevenue > 0 ? (netProfit / totalRevenue) * 100 : 0;

  // Budget analysis
  const totalBudgetAllocated = budgets.reduce((sum, budget) => sum + budget.allocated, 0);
  const totalBudgetSpent = budgets.reduce((sum, budget) => sum + budget.spent, 0);
  const budgetUtilization = totalBudgetAllocated > 0 ? (totalBudgetSpent / totalBudgetAllocated) * 100 : 0;

  // Tax calculations (simplified)
  const taxRate = 0.12; // 12% налог
  const socialRate = 0.15; // 15% соц. взносы
  const estimatedTax = netProfit > 0 ? netProfit * taxRate : 0;
  const estimatedSocial = netProfit > 0 ? netProfit * socialRate : 0;

  const handleAddBudget = (e: React.FormEvent) => {
    e.preventDefault();
    onAddBudget({
      name: budgetForm.name,
      category: budgetForm.category,
      allocated: Number(budgetForm.allocated),
      period: budgetForm.period,
      startDate: budgetForm.startDate,
      endDate: budgetForm.endDate,
      status: 'active'
    });
    setBudgetForm({
      name: '',
      category: '',
      allocated: '',
      period: 'monthly',
      startDate: '',
      endDate: ''
    });
    setShowBudgetModal(false);
  };

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-r from-green-500 to-green-600 p-6 rounded-2xl text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100">Общий доход</p>
              <p className="text-2xl font-bold">{totalRevenue.toLocaleString()} сом</p>
            </div>
            <TrendingUp className="w-8 h-8 text-green-200" />
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-red-500 to-red-600 p-6 rounded-2xl text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-100">Общие расходы</p>
              <p className="text-2xl font-bold">{totalExpenses.toLocaleString()} сом</p>
            </div>
            <TrendingDown className="w-8 h-8 text-red-200" />
          </div>
        </div>
        
        <div className={`bg-gradient-to-r ${netProfit >= 0 ? 'from-blue-500 to-blue-600' : 'from-orange-500 to-orange-600'} p-6 rounded-2xl text-white`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100">Чистая прибыль</p>
              <p className="text-2xl font-bold">{netProfit.toLocaleString()} сом</p>
            </div>
            <Wallet className="w-8 h-8 text-blue-200" />
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-6 rounded-2xl text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100">Рентабельность</p>
              <p className="text-2xl font-bold">{profitMargin.toFixed(1)}%</p>
            </div>
            <BarChart3 className="w-8 h-8 text-purple-200" />
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AnalyticsChart
          type="line"
          data={[
            { name: 'Янв', profit: netProfit * 0.8 },
            { name: 'Фев', profit: netProfit * 0.9 },
            { name: 'Мар', profit: netProfit * 1.1 },
            { name: 'Апр', profit: netProfit },
          ]}
          dataKey="profit"
          title="Динамика прибыли"
          color="#10B981"
        />
        
        <AnalyticsChart
          type="pie"
          data={[
            { name: 'Закупки', value: totalPurchases },
            { name: 'Операционные расходы', value: totalExpenses },
            { name: 'Прибыль', value: Math.max(0, netProfit) }
          ]}
          dataKey="value"
          title="Структура расходов"
        />
      </div>

      {/* Cash Flow */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Денежный поток
        </h3>
        <div className="space-y-4">
          <div className="flex justify-between items-center p-4 bg-green-50 dark:bg-green-900/20 rounded-xl">
            <span className="text-green-700 dark:text-green-300">Поступления от продаж</span>
            <span className="font-semibold text-green-600">+{totalRevenue.toLocaleString()} сом</span>
          </div>
          <div className="flex justify-between items-center p-4 bg-red-50 dark:bg-red-900/20 rounded-xl">
            <span className="text-red-700 dark:text-red-300">Закупки материалов</span>
            <span className="font-semibold text-red-600">-{totalPurchases.toLocaleString()} сом</span>
          </div>
          <div className="flex justify-between items-center p-4 bg-red-50 dark:bg-red-900/20 rounded-xl">
            <span className="text-red-700 dark:text-red-300">Операционные расходы</span>
            <span className="font-semibold text-red-600">-{totalExpenses.toLocaleString()} сом</span>
          </div>
          <div className="flex justify-between items-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border-t-2 border-blue-200 dark:border-blue-800">
            <span className="text-blue-700 dark:text-blue-300 font-semibold">Итого</span>
            <span className={`font-bold text-lg ${netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {netProfit >= 0 ? '+' : ''}{netProfit.toLocaleString()} сом
            </span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderBudgets = () => {
    const budgetColumns = [
      { key: 'name', label: 'Название', sortable: true },
      { key: 'category', label: 'Категория' },
      { 
        key: 'allocated', 
        label: 'Выделено',
        render: (value: number) => `${value.toLocaleString()} сом`
      },
      { 
        key: 'spent', 
        label: 'Потрачено',
        render: (value: number) => `${value.toLocaleString()} сом`
      },
      { 
        key: 'utilization', 
        label: 'Использование',
        render: (value: number, row: Budget) => {
          const percentage = row.allocated > 0 ? (row.spent / row.allocated) * 100 : 0;
          return (
            <div className="flex items-center gap-2">
              <div className="w-20 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full ${
                    percentage > 100 ? 'bg-red-500' : 
                    percentage > 80 ? 'bg-yellow-500' : 'bg-green-500'
                  }`}
                  style={{ width: `${Math.min(percentage, 100)}%` }}
                />
              </div>
              <span className={`text-sm font-medium ${
                percentage > 100 ? 'text-red-600' : 
                percentage > 80 ? 'text-yellow-600' : 'text-green-600'
              }`}>
                {percentage.toFixed(1)}%
              </span>
            </div>
          );
        }
      },
      { key: 'period', label: 'Период' },
      { 
        key: 'status', 
        label: 'Статус',
        render: (value: Budget['status']) => {
          const configs = {
            active: { color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200', label: 'Активен' },
            completed: { color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200', label: 'Завершен' },
            exceeded: { color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200', label: 'Превышен' }
          };
          const config = configs[value];
          return (
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${config.color}`}>
              {config.label}
            </span>
          );
        }
      }
    ];

    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
            Управление бюджетами
          </h3>
          <button
            onClick={() => setShowBudgetModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200"
          >
            <Calculator className="w-4 h-4" />
            Создать бюджет
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-2xl">
            <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">Общий бюджет</h4>
            <p className="text-2xl font-bold text-blue-600">{totalBudgetAllocated.toLocaleString()} сом</p>
          </div>
          
          <div className="bg-orange-50 dark:bg-orange-900/20 p-6 rounded-2xl">
            <h4 className="font-semibold text-orange-900 dark:text-orange-100 mb-2">Потрачено</h4>
            <p className="text-2xl font-bold text-orange-600">{totalBudgetSpent.toLocaleString()} сом</p>
          </div>
          
          <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-2xl">
            <h4 className="font-semibold text-green-900 dark:text-green-100 mb-2">Использование</h4>
            <p className="text-2xl font-bold text-green-600">{budgetUtilization.toFixed(1)}%</p>
          </div>
        </div>

        <DataTable
          data={budgets}
          columns={budgetColumns}
          searchPlaceholder="Поиск бюджетов..."
          onEdit={(budget) => console.log('Edit budget:', budget)}
        />
      </div>
    );
  };

  const renderTaxes = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
        Налоговые расчеты
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-2xl">
          <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">Налогооблагаемая база</h4>
          <p className="text-2xl font-bold text-blue-600">{Math.max(0, netProfit).toLocaleString()} сом</p>
        </div>
        
        <div className="bg-red-50 dark:bg-red-900/20 p-6 rounded-2xl">
          <h4 className="font-semibold text-red-900 dark:text-red-100 mb-2">Подоходный налог (12%)</h4>
          <p className="text-2xl font-bold text-red-600">{estimatedTax.toLocaleString()} сом</p>
        </div>
        
        <div className="bg-orange-50 dark:bg-orange-900/20 p-6 rounded-2xl">
          <h4 className="font-semibold text-orange-900 dark:text-orange-100 mb-2">Соц. взносы (15%)</h4>
          <p className="text-2xl font-bold text-orange-600">{estimatedSocial.toLocaleString()} сом</p>
        </div>
        
        <div className="bg-purple-50 dark:bg-purple-900/20 p-6 rounded-2xl">
          <h4 className="font-semibold text-purple-900 dark:text-purple-100 mb-2">Всего к доплате</h4>
          <p className="text-2xl font-bold text-purple-600">{(estimatedTax + estimatedSocial).toLocaleString()} сом</p>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Налоговый календарь
        </h4>
        <div className="space-y-3">
          <div className="flex justify-between items-center p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
            <span className="text-yellow-700 dark:text-yellow-300">Подача декларации</span>
            <span className="font-semibold text-yellow-600">до 31 марта</span>
          </div>
          <div className="flex justify-between items-center p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
            <span className="text-red-700 dark:text-red-300">Доплата подоходного налога</span>
            <span className="font-semibold text-red-600">до 15 мая</span>
          </div>
          <div className="flex justify-between items-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <span className="text-blue-700 dark:text-blue-300">Соц. взносы (ежемесячно)</span>
            <span className="font-semibold text-blue-600">до 25 числа</span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (view) {
      case 'budgets':
        return renderBudgets();
      case 'taxes':
        return renderTaxes();
      case 'reports':
        return (
          <div className="text-center py-12">
            <BarChart3 className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Финансовые отчеты
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Раздел в разработке
            </p>
          </div>
        );
      default:
        return renderOverview();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
          Финансовый менеджер
        </h2>
      </div>

      {/* View Tabs */}
      <div className="flex gap-2 p-1 bg-gray-100 dark:bg-gray-800 rounded-xl">
        {[
          { id: 'overview', label: 'Обзор', icon: DollarSign },
          { id: 'budgets', label: 'Бюджеты', icon: Calculator },
          { id: 'reports', label: 'Отчеты', icon: BarChart3 },
          { id: 'taxes', label: 'Налоги', icon: CreditCard }
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setView(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                view === tab.id
                  ? 'bg-white dark:bg-gray-700 text-blue-600 shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {renderContent()}

      {/* Add Budget Modal */}
      <Modal
        isOpen={showBudgetModal}
        onClose={() => setShowBudgetModal(false)}
        title="Создать бюджет"
        size="lg"
      >
        <form onSubmit={handleAddBudget} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              label="Название бюджета"
              value={budgetForm.name}
              onChange={(value) => setBudgetForm({ ...budgetForm, name: value })}
              required
            />
            
            <FormField
              label="Категория"
              type="select"
              value={budgetForm.category}
              onChange={(value) => setBudgetForm({ ...budgetForm, category: value })}
              options={[
                { value: 'operations', label: 'Операционные расходы' },
                { value: 'materials', label: 'Материалы' },
                { value: 'salaries', label: 'Зарплаты' },
                { value: 'marketing', label: 'Маркетинг' },
                { value: 'equipment', label: 'Оборудование' },
                { value: 'other', label: 'Прочее' }
              ]}
              required
            />
            
            <FormField
              label="Выделенная сумма (сом)"
              type="number"
              value={budgetForm.allocated}
              onChange={(value) => setBudgetForm({ ...budgetForm, allocated: value })}
              required
            />
            
            <FormField
              label="Период"
              type="select"
              value={budgetForm.period}
              onChange={(value) => setBudgetForm({ ...budgetForm, period: value as Budget['period'] })}
              options={[
                { value: 'monthly', label: 'Месячный' },
                { value: 'quarterly', label: 'Квартальный' },
                { value: 'yearly', label: 'Годовой' }
              ]}
              required
            />
            
            <FormField
              label="Дата начала"
              type="date"
              value={budgetForm.startDate}
              onChange={(value) => setBudgetForm({ ...budgetForm, startDate: value })}
              required
            />
            
            <FormField
              label="Дата окончания"
              type="date"
              value={budgetForm.endDate}
              onChange={(value) => setBudgetForm({ ...budgetForm, endDate: value })}
              required
            />
          </div>
          
          <div className="flex gap-4">
            <button
              type="submit"
              className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 px-6 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200"
            >
              Создать бюджет
            </button>
            <button
              type="button"
              onClick={() => setShowBudgetModal(false)}
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