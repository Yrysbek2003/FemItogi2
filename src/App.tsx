import React, { useState, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import toast from 'react-hot-toast';
import { 
  LayoutDashboard, 
  Factory, 
  BarChart3, 
  Settings
} from 'lucide-react';

// Import modules
import { AuthModule } from './modules/auth/AuthModule';
import { ProductionModule } from './modules/production/ProductionModule';
import { AnalyticsModule } from './modules/analytics/AnalyticsModule';
import { ManagementModule } from './modules/management/ManagementModule';
import { Dashboard } from './components/Dashboard';

// Import types
import { 
  User, 
  Purchase, 
  Sale, 
  Worker, 
  Task, 
  Expense, 
  Salary,
  InventoryItem,
  StockMovement,
  Budget,
  Notification,
  Language,
  Theme
} from './types';

function App() {
  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [theme, setTheme] = useState<Theme>('light');
  const [language, setLanguage] = useState<Language>('ru');

  // App state
  const [activeModule, setActiveModule] = useState('dashboard');

  // Data state
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [salaries, setSalaries] = useState<Salary[]>([]);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Load data from localStorage on mount
  useEffect(() => {
    const savedAuth = localStorage.getItem('isAuthenticated');
    const savedUser = localStorage.getItem('currentUser');
    const savedTheme = localStorage.getItem('theme') as Theme;
    const savedLanguage = localStorage.getItem('language') as Language;

    if (savedAuth === 'true' && savedUser) {
      setIsAuthenticated(true);
      setCurrentUser(JSON.parse(savedUser));
    }

    if (savedTheme) setTheme(savedTheme);
    if (savedLanguage) setLanguage(savedLanguage);

    // Load data
    const savedPurchases = localStorage.getItem('purchases');
    const savedSales = localStorage.getItem('sales');
    const savedWorkers = localStorage.getItem('workers');
    const savedTasks = localStorage.getItem('tasks');
    const savedExpenses = localStorage.getItem('expenses');
    const savedUsers = localStorage.getItem('users');
    const savedInventory = localStorage.getItem('inventory');
    const savedBudgets = localStorage.getItem('budgets');

    if (savedPurchases) setPurchases(JSON.parse(savedPurchases));
    if (savedSales) setSales(JSON.parse(savedSales));
    if (savedWorkers) setWorkers(JSON.parse(savedWorkers));
    if (savedTasks) setTasks(JSON.parse(savedTasks));
    if (savedExpenses) setExpenses(JSON.parse(savedExpenses));
    if (savedUsers) setUsers(JSON.parse(savedUsers));
    if (savedInventory) setInventory(JSON.parse(savedInventory));
    if (savedBudgets) setBudgets(JSON.parse(savedBudgets));
  }, []);

  // Save data to localStorage
  useEffect(() => {
    localStorage.setItem('purchases', JSON.stringify(purchases));
  }, [purchases]);

  useEffect(() => {
    localStorage.setItem('sales', JSON.stringify(sales));
  }, [sales]);

  useEffect(() => {
    localStorage.setItem('workers', JSON.stringify(workers));
  }, [workers]);

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('expenses', JSON.stringify(expenses));
  }, [expenses]);

  useEffect(() => {
    localStorage.setItem('users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem('inventory', JSON.stringify(inventory));
  }, [inventory]);

  useEffect(() => {
    localStorage.setItem('budgets', JSON.stringify(budgets));
  }, [budgets]);

  // Apply theme
  useEffect(() => {
    document.documentElement.className = theme === 'dark' ? 'dark' : '';
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Authentication handlers
  const handleLogin = (username: string, password: string) => {
    const user: User = {
      id: '1',
      username,
      fullName: 'Администратор',
      email: 'admin@example.com',
      role: 'admin',
      permissions: [],
      createdAt: new Date().toISOString(),
      isActive: true,
      settings: {
        theme,
        language,
        notifications: {
          email: true,
          push: true,
          lowStock: true,
          taskDeadlines: true,
          newOrders: true,
          systemAlerts: true
        },
        dashboardLayout: []
      }
    };

    setCurrentUser(user);
    setIsAuthenticated(true);
    localStorage.setItem('isAuthenticated', 'true');
    localStorage.setItem('currentUser', JSON.stringify(user));
    toast.success('Успешный вход в систему!');
  };

  const handleRegister = (userData: any) => {
    const user: User = {
      id: Date.now().toString(),
      ...userData,
      role: 'user' as const,
      permissions: [],
      createdAt: new Date().toISOString(),
      isActive: true,
      settings: {
        theme,
        language,
        notifications: {
          email: true,
          push: true,
          lowStock: true,
          taskDeadlines: true,
          newOrders: true,
          systemAlerts: true
        },
        dashboardLayout: []
      }
    };

    setUsers(prev => [...prev, user]);
    toast.success('Регистрация успешна! Теперь войдите в систему.');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentUser(null);
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('currentUser');
    toast.success('Вы вышли из системы');
  };

  // Data handlers
  const handleAddPurchase = (purchase: Omit<Purchase, 'id'>) => {
    const newPurchase: Purchase = {
      ...purchase,
      id: Date.now().toString(),
      createdBy: currentUser?.id || '',
      updatedAt: new Date().toISOString()
    };
    setPurchases(prev => [...prev, newPurchase]);
    toast.success('Закупка добавлена!');
  };

  const handleAddSale = (sale: Omit<Sale, 'id'>) => {
    const newSale: Sale = {
      ...sale,
      id: Date.now().toString(),
      paymentMethod: 'cash',
      paymentStatus: 'paid',
      createdBy: currentUser?.id || '',
      updatedAt: new Date().toISOString()
    };
    setSales(prev => [...prev, newSale]);
    toast.success('Продажа добавлена!');
  };

  const handleAddWorker = (worker: Omit<Worker, 'id'>) => {
    const newWorker: Worker = {
      ...worker,
      id: Date.now().toString(),
      skills: [],
      department: 'production',
      documents: [],
      performance: [],
      createdBy: currentUser?.id || '',
      updatedAt: new Date().toISOString()
    };
    setWorkers(prev => [...prev, newWorker]);
    toast.success('Сотрудник добавлен!');
  };

  const handleAddTask = (task: Omit<Task, 'id'>) => {
    const newTask: Task = {
      ...task,
      id: Date.now().toString(),
      materials: [],
      attachments: [],
      dependencies: [],
      progress: 0,
      createdBy: currentUser?.id || '',
      updatedAt: new Date().toISOString()
    };
    setTasks(prev => [...prev, newTask]);
    toast.success('Задача добавлена!');
  };

  const handleAddExpense = (expense: Omit<Expense, 'id'>) => {
    const newExpense: Expense = {
      ...expense,
      id: Date.now().toString(),
      category: expense.type,
      approved: true,
      budgetCategory: expense.type,
      recurring: false,
      createdBy: currentUser?.id || '',
      updatedAt: new Date().toISOString()
    };
    setExpenses(prev => [...prev, newExpense]);
    toast.success('Расход добавлен!');
  };

  const handleAddInventoryItem = (item: Omit<InventoryItem, 'id' | 'movements' | 'createdBy' | 'updatedAt'>) => {
    const newItem: InventoryItem = {
      ...item,
      id: Date.now().toString(),
      movements: [],
      createdBy: currentUser?.id || '',
      updatedAt: new Date().toISOString()
    };
    setInventory(prev => [...prev, newItem]);
    toast.success('Товар добавлен на склад!');
  };

  const handleStockMovement = (itemId: string, movement: Omit<StockMovement, 'id' | 'createdBy'>) => {
    const newMovement: StockMovement = {
      ...movement,
      id: Date.now().toString(),
      createdBy: currentUser?.id || ''
    };

    setInventory(prev => prev.map(item => {
      if (item.id === itemId) {
        const newStock = movement.type === 'in' 
          ? item.currentStock + movement.quantity
          : item.currentStock - movement.quantity;
        
        return {
          ...item,
          currentStock: Math.max(0, newStock),
          movements: [...item.movements, newMovement],
          status: newStock === 0 ? 'out_of_stock' as const :
                  newStock <= item.minStock ? 'low_stock' as const : 'in_stock' as const,
          updatedAt: new Date().toISOString()
        };
      }
      return item;
    }));
    
    toast.success('Движение товара зафиксировано!');
  };

  const handleAddBudget = (budget: Omit<Budget, 'id' | 'spent' | 'alerts' | 'createdBy' | 'updatedAt'>) => {
    const newBudget: Budget = {
      ...budget,
      id: Date.now().toString(),
      spent: 0,
      alerts: [],
      createdBy: currentUser?.id || '',
      updatedAt: new Date().toISOString()
    };
    setBudgets(prev => [...prev, newBudget]);
    toast.success('Бюджет создан!');
  };

  const handleAddUser = (user: Omit<User, 'id' | 'createdAt' | 'lastLogin'>) => {
    const newUser: User = {
      ...user,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    setUsers(prev => [...prev, newUser]);
    toast.success('Пользователь добавлен!');
  };

  // Navigation modules
  const modules = [
    { id: 'dashboard', label: 'Дашборд', icon: LayoutDashboard },
    { id: 'production', label: 'Производство', icon: Factory },
    { id: 'analytics', label: 'Аналитика', icon: BarChart3 },
    { id: 'management', label: 'Управление', icon: Settings }
  ];

  const renderContent = () => {
    switch (activeModule) {
      case 'dashboard':
        return (
          <Dashboard
            purchases={purchases}
            sales={sales}
            workers={workers}
            tasks={tasks}
            expenses={expenses}
            onNavigate={setActiveModule}
          />
        );

      case 'production':
        return (
          <ProductionModule
            purchases={purchases}
            sales={sales}
            workers={workers}
            tasks={tasks}
            language={language}
            onAddPurchase={handleAddPurchase}
            onAddSale={handleAddSale}
            onAddWorker={handleAddWorker}
            onAddTask={handleAddTask}
          />
        );

      case 'analytics':
        return (
          <AnalyticsModule
            purchases={purchases}
            sales={sales}
            workers={workers}
            tasks={tasks}
            expenses={expenses}
          />
        );

      case 'management':
        return (
          <ManagementModule
            expenses={expenses}
            inventory={inventory}
            budgets={budgets}
            users={users}
            currentUser={currentUser!}
            language={language}
            onAddExpense={handleAddExpense}
            onAddInventoryItem={handleAddInventoryItem}
            onUpdateStock={handleStockMovement}
            onUpdateInventoryItem={(item) => {
              setInventory(prev => prev.map(i => i.id === item.id ? item : i));
              toast.success('Товар обновлен!');
            }}
            onAddBudget={handleAddBudget}
            onUpdateBudget={(budget) => {
              setBudgets(prev => prev.map(b => b.id === budget.id ? budget : b));
              toast.success('Бюджет обновлен!');
            }}
            onAddUser={handleAddUser}
            onUpdateUser={(user) => {
              setUsers(prev => prev.map(u => u.id === user.id ? user : u));
              toast.success('Пользователь обновлен!');
            }}
            onDeleteUser={(userId) => {
              setUsers(prev => prev.filter(u => u.id !== userId));
              toast.success('Пользователь удален!');
            }}
            onToggleUserStatus={(userId) => {
              setUsers(prev => prev.map(u => 
                u.id === userId ? { ...u, isActive: !u.isActive } : u
              ));
              toast.success('Статус пользователя изменен!');
            }}
          />
        );

      default:
        return <div>Модуль в разработке</div>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <AuthModule
        isAuthenticated={isAuthenticated}
        currentUser={currentUser}
        theme={theme}
        language={language}
        onLogin={handleLogin}
        onRegister={handleRegister}
        onLogout={handleLogout}
        onThemeChange={setTheme}
        onLanguageChange={setLanguage}
      />

      {isAuthenticated && (
        <>
          {/* Navigation */}
          <nav className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
            <div className="px-4 sm:px-6 lg:px-8">
              <div className="flex space-x-8 overflow-x-auto">
                {modules.map((module) => {
                  const Icon = module.icon;
                  return (
                    <button
                      key={module.id}
                      onClick={() => setActiveModule(module.id)}
                      className={`flex items-center gap-2 px-3 py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                        activeModule === module.id
                          ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                          : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      {module.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </nav>

          {/* Main Content */}
          <main className="px-4 sm:px-6 lg:px-8 py-8">
            {renderContent()}
          </main>
        </>
      )}

      <Toaster position="top-right" />
    </div>
  );
}

export default App;