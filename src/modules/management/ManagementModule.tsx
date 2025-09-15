import React, { useState } from 'react';
import { 
  User, 
  Expense, 
  InventoryItem, 
  StockMovement, 
  Budget, 
  Language 
} from '../../types';
import { InventoryManager } from '../../components/InventoryManager';
import { FinancialManager } from '../../components/FinancialManager';
import { UserManagement } from '../../components/UserManagement';
import { AddExpenseModal } from '../../AddExpenseModal';
import { DataTable } from '../../components/DataTable';
import { ExportButtons } from '../../components/ExportButtons';
import { 
  Package, 
  DollarSign, 
  Users, 
  Receipt,
  Settings,
  Shield
} from 'lucide-react';

interface ManagementModuleProps {
  expenses: Expense[];
  inventory: InventoryItem[];
  budgets: Budget[];
  users: User[];
  currentUser: User;
  language: Language;
  onAddExpense: (expense: Omit<Expense, 'id'>) => void;
  onAddInventoryItem: (item: Omit<InventoryItem, 'id' | 'movements' | 'createdBy' | 'updatedAt'>) => void;
  onUpdateStock: (itemId: string, movement: Omit<StockMovement, 'id' | 'createdBy'>) => void;
  onUpdateInventoryItem: (item: InventoryItem) => void;
  onAddBudget: (budget: Omit<Budget, 'id' | 'spent' | 'alerts' | 'createdBy' | 'updatedAt'>) => void;
  onUpdateBudget: (budget: Budget) => void;
  onAddUser: (user: Omit<User, 'id' | 'createdAt' | 'lastLogin'>) => void;
  onUpdateUser: (user: User) => void;
  onDeleteUser: (userId: string) => void;
  onToggleUserStatus: (userId: string) => void;
}

export const ManagementModule: React.FC<ManagementModuleProps> = ({
  expenses,
  inventory,
  budgets,
  users,
  currentUser,
  language,
  onAddExpense,
  onAddInventoryItem,
  onUpdateStock,
  onUpdateInventoryItem,
  onAddBudget,
  onUpdateBudget,
  onAddUser,
  onUpdateUser,
  onDeleteUser,
  onToggleUserStatus
}) => {
  const [activeTab, setActiveTab] = useState('expenses');
  const [showExpenseModal, setShowExpenseModal] = useState(false);

  const tabs = [
    { id: 'expenses', label: 'Расходы', icon: Receipt, color: 'from-red-600 to-red-700' },
    { id: 'inventory', label: 'Склад', icon: Package, color: 'from-blue-600 to-blue-700' },
    { id: 'finance', label: 'Финансы', icon: DollarSign, color: 'from-green-600 to-green-700' },
    { id: 'users', label: 'Пользователи', icon: Users, color: 'from-purple-600 to-purple-700' }
  ];

  const renderExpenses = () => {
    const expenseColumns = [
      { key: 'type', label: 'Тип' },
      { key: 'description', label: 'Описание', sortable: true },
      { 
        key: 'amount', 
        label: 'Сумма',
        render: (value: number) => `${value.toLocaleString()} сом`
      },
      { key: 'date', label: 'Дата', sortable: true }
    ];

    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Расходы</h3>
            <p className="text-gray-600 dark:text-gray-400">Управление операционными расходами</p>
          </div>
          <div className="flex gap-4">
            <ExportButtons data={expenses} filename="expenses" title="Расходы" />
            <button
              onClick={() => setShowExpenseModal(true)}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl hover:from-red-700 hover:to-red-800 transition-all duration-200"
            >
              <Receipt className="w-5 h-5" />
              Добавить расход
            </button>
          </div>
        </div>
        
        <DataTable
          data={expenses}
          columns={expenseColumns}
          searchPlaceholder="Поиск расходов..."
        />
      </div>
    );
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'expenses':
        return renderExpenses();
      case 'inventory':
        return (
          <InventoryManager
            inventory={inventory}
            onAddItem={onAddInventoryItem}
            onUpdateStock={onUpdateStock}
            onUpdateItem={onUpdateInventoryItem}
          />
        );
      case 'finance':
        return (
          <FinancialManager
            expenses={expenses}
            sales={[]}
            purchases={[]}
            budgets={budgets}
            onAddBudget={onAddBudget}
            onUpdateBudget={onUpdateBudget}
          />
        );
      case 'users':
        return (
          <UserManagement
            users={users}
            currentUser={currentUser}
            onAddUser={onAddUser}
            onUpdateUser={onUpdateUser}
            onDeleteUser={onDeleteUser}
            onToggleUserStatus={onToggleUserStatus}
          />
        );
      default:
        return renderExpenses();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Управление</h2>
          <p className="text-gray-600 dark:text-gray-400">Административные функции и настройки</p>
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

      {/* Expense Modal */}
      <AddExpenseModal
        isOpen={showExpenseModal}
        onClose={() => setShowExpenseModal(false)}
        onAdd={onAddExpense}
        language={language}
      />
    </div>
  );
};