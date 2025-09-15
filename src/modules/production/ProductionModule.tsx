import React, { useState } from 'react';
import { Purchase, Sale, Worker, Task, Language } from '../../types';
import { DataTable } from '../../components/DataTable';
import { SearchAndFilter } from '../../components/SearchAndFilter';
import { ExportButtons } from '../../components/ExportButtons';
import { AddPurchaseModal } from '../../AddPurchaseModal';
import { AddSaleModal } from '../../AddSaleModal';
import { AddWorkerModal } from '../../AddWorkerModal';
import { AddTaskModal } from '../../AddTaskModal';
import { TaskStatusBadge } from '../../components/TaskStatusBadge';
import { PriorityBadge } from '../../components/PriorityBadge';
import { 
  ShoppingCart, 
  TrendingUp, 
  Users, 
  UserCheck,
  Package,
  BarChart3
} from 'lucide-react';

interface ProductionModuleProps {
  purchases: Purchase[];
  sales: Sale[];
  workers: Worker[];
  tasks: Task[];
  language: Language;
  onAddPurchase: (purchase: Omit<Purchase, 'id'>) => void;
  onAddSale: (sale: Omit<Sale, 'id'>) => void;
  onAddWorker: (worker: Omit<Worker, 'id'>) => void;
  onAddTask: (task: Omit<Task, 'id'>) => void;
}

export const ProductionModule: React.FC<ProductionModuleProps> = ({
  purchases,
  sales,
  workers,
  tasks,
  language,
  onAddPurchase,
  onAddSale,
  onAddWorker,
  onAddTask
}) => {
  const [activeTab, setActiveTab] = useState('purchases');
  const [searchTerms, setSearchTerms] = useState<Record<string, string>>({});
  const [showModals, setShowModals] = useState({
    purchase: false,
    sale: false,
    worker: false,
    task: false
  });

  const tabs = [
    { id: 'purchases', label: 'Закупки', icon: ShoppingCart, color: 'from-purple-600 to-purple-700' },
    { id: 'sales', label: 'Продажи', icon: TrendingUp, color: 'from-green-600 to-green-700' },
    { id: 'workers', label: 'Сотрудники', icon: Users, color: 'from-indigo-600 to-indigo-700' },
    { id: 'tasks', label: 'Задачи', icon: UserCheck, color: 'from-orange-600 to-orange-700' }
  ];

  const renderPurchases = () => {
    const filteredPurchases = purchases.filter(purchase =>
      !searchTerms.purchases || 
      Object.values(purchase).some(value =>
        value?.toString().toLowerCase().includes(searchTerms.purchases.toLowerCase())
      )
    );
    
    const purchaseColumns = [
      { key: 'itemName', label: 'Наименование', sortable: true },
      { key: 'category', label: 'Категория' },
      { key: 'quantity', label: 'Количество', sortable: true },
      { 
        key: 'costPerUnit', 
        label: 'Цена за ед.',
        render: (value: number) => `${value.toLocaleString()} сом`
      },
      { 
        key: 'total', 
        label: 'Общая стоимость',
        render: (value: any, row: Purchase) => `${(row.quantity * row.costPerUnit).toLocaleString()} сом`
      },
      { key: 'date', label: 'Дата', sortable: true }
    ];

    return (
      <div className="space-y-6">
        <SearchAndFilter
          searchTerm={searchTerms.purchases || ''}
          onSearchChange={(term) => setSearchTerms({ ...searchTerms, purchases: term })}
          placeholder="Поиск закупок..."
        />
        
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Закупки</h3>
            <p className="text-gray-600 dark:text-gray-400">Управление закупками материалов</p>
          </div>
          <div className="flex gap-4">
            <ExportButtons data={purchases} filename="purchases" title="Закупки" />
            <button
              onClick={() => setShowModals({ ...showModals, purchase: true })}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-xl hover:from-purple-700 hover:to-purple-800 transition-all duration-200"
            >
              <ShoppingCart className="w-5 h-5" />
              Добавить закупку
            </button>
          </div>
        </div>
        
        <DataTable
          data={filteredPurchases}
          columns={purchaseColumns}
          searchPlaceholder=""
        />
      </div>
    );
  };

  const renderSales = () => {
    const filteredSales = sales.filter(sale =>
      !searchTerms.sales || 
      Object.values(sale).some(value =>
        value?.toString().toLowerCase().includes(searchTerms.sales.toLowerCase())
      )
    );
    
    const salesColumns = [
      { key: 'itemName', label: 'Наименование', sortable: true },
      { key: 'quantity', label: 'Количество', sortable: true },
      { 
        key: 'costPerUnit', 
        label: 'Цена за ед.',
        render: (value: number) => `${value.toLocaleString()} сом`
      },
      { 
        key: 'total', 
        label: 'Общая сумма',
        render: (value: any, row: Sale) => `${(row.quantity * row.costPerUnit).toLocaleString()} сом`
      },
      { key: 'date', label: 'Дата', sortable: true }
    ];

    return (
      <div className="space-y-6">
        <SearchAndFilter
          searchTerm={searchTerms.sales || ''}
          onSearchChange={(term) => setSearchTerms({ ...searchTerms, sales: term })}
          placeholder="Поиск продаж..."
        />
        
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Продажи</h3>
            <p className="text-gray-600 dark:text-gray-400">Учет продаж готовой продукции</p>
          </div>
          <div className="flex gap-4">
            <ExportButtons data={sales} filename="sales" title="Продажи" />
            <button
              onClick={() => setShowModals({ ...showModals, sale: true })}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl hover:from-green-700 hover:to-green-800 transition-all duration-200"
            >
              <TrendingUp className="w-5 h-5" />
              Добавить продажу
            </button>
          </div>
        </div>
        
        <DataTable
          data={filteredSales}
          columns={salesColumns}
          searchPlaceholder=""
        />
      </div>
    );
  };

  const renderWorkers = () => {
    const workerColumns = [
      { key: 'name', label: 'Имя', sortable: true },
      { key: 'role', label: 'Должность' },
      { key: 'phone', label: 'Телефон' },
      { key: 'hireDate', label: 'Дата найма', sortable: true },
      { 
        key: 'status', 
        label: 'Статус',
        render: (value: Worker['status']) => (
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
            value === 'active' 
              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
              : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
          }`}>
            {value === 'active' ? 'Активен' : 'Неактивен'}
          </span>
        )
      }
    ];

    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Сотрудники</h3>
            <p className="text-gray-600 dark:text-gray-400">Управление персоналом</p>
          </div>
          <div className="flex gap-4">
            <ExportButtons data={workers} filename="workers" title="Сотрудники" />
            <button
              onClick={() => setShowModals({ ...showModals, worker: true })}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-xl hover:from-indigo-700 hover:to-indigo-800 transition-all duration-200"
            >
              <Users className="w-5 h-5" />
              Добавить сотрудника
            </button>
          </div>
        </div>
        
        <DataTable
          data={workers}
          columns={workerColumns}
          searchPlaceholder="Поиск сотрудников..."
        />
      </div>
    );
  };

  const renderTasks = () => {
    const taskColumns = [
      { 
        key: 'workerId', 
        label: 'Сотрудник',
        render: (value: string) => {
          const worker = workers.find(w => w.id === value);
          return worker ? worker.name : 'Неизвестно';
        }
      },
      { key: 'clothingType', label: 'Тип одежды' },
      { key: 'partType', label: 'Тип работы' },
      { key: 'quantity', label: 'Количество', sortable: true },
      { 
        key: 'ratePerUnit', 
        label: 'Ставка',
        render: (value: number) => `${value.toLocaleString()} сом`
      },
      { 
        key: 'priority', 
        label: 'Приоритет',
        render: (value: Task['priority']) => <PriorityBadge priority={value} />
      },
      { 
        key: 'status', 
        label: 'Статус',
        render: (value: Task['status']) => <TaskStatusBadge status={value} />
      },
      { key: 'deadline', label: 'Дедлайн' },
      { key: 'date', label: 'Дата создания', sortable: true }
    ];

    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Задачи</h3>
            <p className="text-gray-600 dark:text-gray-400">Распределение работы между сотрудниками</p>
          </div>
          <div className="flex gap-4">
            <ExportButtons data={tasks} filename="tasks" title="Задачи" />
            <button
              onClick={() => setShowModals({ ...showModals, task: true })}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-600 to-orange-700 text-white rounded-xl hover:from-orange-700 hover:to-orange-800 transition-all duration-200"
            >
              <UserCheck className="w-5 h-5" />
              Добавить задачу
            </button>
          </div>
        </div>
        
        <DataTable
          data={tasks}
          columns={taskColumns}
          searchPlaceholder="Поиск задач..."
        />
      </div>
    );
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'purchases':
        return renderPurchases();
      case 'sales':
        return renderSales();
      case 'workers':
        return renderWorkers();
      case 'tasks':
        return renderTasks();
      default:
        return renderPurchases();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Производство</h2>
          <p className="text-gray-600 dark:text-gray-400">Управление производственными процессами</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 p-1 bg-gray-100 dark:bg-gray-800 rounded-xl overflow-x-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 rounded-lg transition-all whitespace-nowrap ${
                activeTab === tab.id
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

      {/* Modals */}
      <AddPurchaseModal
        isOpen={showModals.purchase}
        onClose={() => setShowModals({ ...showModals, purchase: false })}
        onAdd={onAddPurchase}
        language={language}
      />

      <AddSaleModal
        isOpen={showModals.sale}
        onClose={() => setShowModals({ ...showModals, sale: false })}
        onAdd={onAddSale}
        language={language}
      />

      <AddWorkerModal
        isOpen={showModals.worker}
        onClose={() => setShowModals({ ...showModals, worker: false })}
        onAdd={onAddWorker}
        language={language}
      />

      <AddTaskModal
        isOpen={showModals.task}
        onClose={() => setShowModals({ ...showModals, task: false })}
        onAdd={onAddTask}
        workers={workers}
        language={language}
      />
    </div>
  );
};