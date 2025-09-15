import React, { useState, useEffect } from 'react';
import { 
  Users, 
  ShoppingCart, 
  TrendingUp, 
  DollarSign, 
  FileText, 
  BarChart3,
  Settings,
  Moon,
  Sun,
  Globe,
  Menu,
  X,
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  Calendar,
  TrendingDown,
  CheckSquare,
  Wallet,
  Clock,
  AlertCircle,
  Package,
  Factory,
  PieChart,
  LogIn,
  Bell,
  Shield,
  Calculator,
  Warehouse
} from 'lucide-react';
import { Toaster } from 'react-hot-toast';
import toast from 'react-hot-toast';

import { Modal } from './components/Modal';
import { FormField } from './components/FormField';
import { StatCard } from './components/StatCard';
import { DataTable } from './components/DataTable';
import { AuthModal } from './components/AuthModal';
import { UserMenu } from './components/UserMenu';
import { NotificationCenter } from './components/NotificationCenter';
import { InventoryManager } from './components/InventoryManager';
import { UserManagement } from './components/UserManagement';
import { FinancialManager } from './components/FinancialManager';
import { AddPurchaseModal } from './AddPurchaseModal';
import { AddSaleModal } from './AddSaleModal';
import { AddWorkerModal } from './AddWorkerModal';
import { AddExpenseModal } from './AddExpenseModal';
import { AddTaskModal } from './AddTaskModal';
import { TaskStatusBadge } from './TaskStatusBadge';
import { PriorityBadge } from './PriorityBadge';
import { AnalyticsChart } from './AnalyticsChart';
import { ExportButtons } from './ExportButtons';

import { 
  Purchase, 
  Sale, 
  Worker, 
  Expense, 
  Task, 
  Salary, 
  Theme, 
  Language, 
  User,
  Notification,
  InventoryItem,
  StockMovement,
  Budget
} from './types';

const translations = {
  ru: {
    appTitle: 'Швейный Менеджер Pro',
    dashboard: 'Дашборд',
    purchases: 'Закупки',
    sales: 'Продажи',
    workers: 'Сотрудники',
    tasks: 'Задачи',
    salaries: 'Зарплата',
    expenses: 'Расходы',
    analytics: 'Аналитика',
    settings: 'Настройки',
    addNew: 'Добавить',
    search: 'Поиск...',
    filter: 'Фильтр',
    totalPurchases: 'Общие закупки',
    totalSales: 'Общие продажи',
    totalWorkers: 'Сотрудники',
    totalTasks: 'Активные задачи',
    totalExpenses: 'Расходы',
    profit: 'Прибыль',
    itemName: 'Наименование',
    quantity: 'Количество',
    cost: 'Стоимость',
    costPerUnit: 'Цена за единицу',
    description: 'Описание',
    date: 'Дата',
    actions: 'Действия',
    workerName: 'Имя сотрудника',
    name: 'Имя',
    role: 'Роль',
    phone: 'Телефон',
    status: 'Статус',
    active: 'Активен',
    inactive: 'Неактивен',
    type: 'Тип',
    amount: 'Сумма',
    electricity: 'Электричество',
    repair: 'Ремонт',
    rent: 'Аренда',
    transport: 'Транспорт',
    materials: 'Материалы',
    other: 'Прочее',
    category: 'Категория',
    fabric: 'Ткань',
    accessories: 'Фурнитура',
    equipment: 'Оборудование',
    recentTransactions: 'Последние операции',
    recentTasks: 'Последние задачи',
    thisMonth: 'За этот месяц',
    edit: 'Изменить',
    delete: 'Удалить',
    confirmDelete: 'Вы уверены, что хотите удалить этот элемент?',
    cancel: 'Отмена',
    confirm: 'Подтвердить',
    clothingType: 'Тип одежды',
    partType: 'Тип работы',
    priority: 'Приоритет',
    deadline: 'Дедлайн',
    comment: 'Комментарий',
    ratePerUnit: 'Ставка за единицу',
    totalAmount: 'Общая сумма',
    pending: 'Ожидает',
    in_progress: 'В работе',
    completed: 'Завершено',
    low: 'Низкий',
    medium: 'Средний',
    high: 'Высокий',
    monthlyProfit: 'Прибыль по месяцам',
    expenseDistribution: 'Распределение расходов',
    tasksByStatus: 'Задачи по статусам',
    salesTrend: 'Тренд продаж',
    overview: 'Обзор',
    quickActions: 'Быстрые действия',
    addPurchase: 'Добавить закупку',
    addSale: 'Добавить продажу',
    addWorker: 'Добавить сотрудника',
    addTask: 'Добавить задачу',
    addExpense: 'Добавить расход'
  },
  ky: {
    appTitle: 'Тигүү Менеджери Pro',
    dashboard: 'Башкаруу панели',
    purchases: 'Сатып алуулар',
    sales: 'Сатуулар',
    workers: 'Кызматкерлер',
    tasks: 'Тапшырмалар',
    salaries: 'Эмгек акы',
    expenses: 'Чыгашалар',
    analytics: 'Аналитика',
    settings: 'Жөндөөлөр',
    addNew: 'Кошуу',
    search: 'Издөө...',
    filter: 'Чыпка',
    totalPurchases: 'Жалпы сатып алуулар',
    totalSales: 'Жалпы сатуулар',
    totalWorkers: 'Кызматкерлер',
    totalTasks: 'Активдүү тапшырмалар',
    totalExpenses: 'Чыгашалар',
    profit: 'Пайда',
    itemName: 'Аталышы',
    quantity: 'Саны',
    cost: 'Баасы',
    costPerUnit: 'Бирдик баасы',
    description: 'Сүрөттөмө',
    date: 'Дата',
    actions: 'Аракеттер',
    workerName: 'Кызматкердин аты',
    name: 'Аты',
    role: 'Ролу',
    phone: 'Телефон',
    status: 'Абалы',
    active: 'Активдүү',
    inactive: 'Активдүү эмес',
    type: 'Түрү',
    amount: 'Сумма',
    electricity: 'Электр энергиясы',
    repair: 'Оңдоо',
    rent: 'Ижара',
    transport: 'Транспорт',
    materials: 'Материалдар',
    other: 'Башка',
    category: 'Категория',
    fabric: 'Кездеме',
    accessories: 'Аксессуарлар',
    equipment: 'Жабдуулар',
    recentTransactions: 'Акыркы операциялар',
    recentTasks: 'Акыркы тапшырмалар',
    thisMonth: 'Ушул айда',
    edit: 'Өзгөртүү',
    delete: 'Өчүрүү',
    confirmDelete: 'Бул элементти өчүрүүгө ишенесизби?',
    cancel: 'Жокко чыгаруу',
    confirm: 'Ырастоо',
    overview: 'Көз жүгүртүү',
    quickActions: 'Тез аракеттер',
    addPurchase: 'Сатып алуу кошуу',
    addSale: 'Сатуу кошуу',
    addWorker: 'Кызматкер кошуу',
    addTask: 'Тапшырма кошуу',
    addExpense: 'Чыгаша кошуу'
  }
};

function App() {
  const [currentTab, setCurrentTab] = useState('dashboard');
  const [theme, setTheme] = useState<Theme>('light');
  const [language, setLanguage] = useState<Language>('ru');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  
  // Modal states
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [showSaleModal, setShowSaleModal] = useState(false);
  const [showWorkerModal, setShowWorkerModal] = useState(false);
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [showTaskModal, setShowTaskModal] = useState(false);
  
  // New data states
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      userId: '1',
      type: 'warning',
      title: 'Низкие остатки на складе',
      message: 'У 3 товаров критически низкие остатки',
      read: false,
      createdAt: new Date().toISOString()
    },
    {
      id: '2',
      userId: '1',
      type: 'info',
      title: 'Новая задача назначена',
      message: 'Вам назначена новая задача по пошиву рубашек',
      read: false,
      createdAt: new Date(Date.now() - 3600000).toISOString()
    }
  ]);

  const [inventory, setInventory] = useState<InventoryItem[]>([
    {
      id: '1',
      name: 'Хлопковая ткань белая',
      category: 'fabric',
      currentStock: 15,
      minStock: 20,
      maxStock: 100,
      unit: 'м',
      costPerUnit: 350,
      supplier: 'ТекстильПром',
      location: 'Склад А, Полка 1',
      barcode: '1234567890123',
      description: 'Высококачественная хлопковая ткань',
      lastRestocked: '2024-01-15',
      status: 'low_stock',
      movements: [
        {
          id: '1',
          type: 'in',
          quantity: 50,
          reason: 'Поступление от поставщика',
          date: '2024-01-15',
          reference: 'ПН-001',
          createdBy: '1'
        }
      ],
      createdBy: '1',
      updatedAt: new Date().toISOString()
    }
  ]);

  const [users, setUsers] = useState<User[]>([
    {
      id: '1',
      username: 'admin',
      fullName: 'Администратор',
      email: 'admin@example.com',
      role: 'admin',
      permissions: [],
      isActive: true,
      createdAt: new Date().toISOString(),
      settings: {
        theme: 'light',
        language: 'ru',
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
    }
  ]);

  const [budgets, setBudgets] = useState<Budget[]>([
    {
      id: '1',
      name: 'Операционные расходы',
      category: 'operations',
      allocated: 100000,
      spent: 75000,
      period: 'monthly',
      startDate: '2024-01-01',
      endDate: '2024-01-31',
      status: 'active',
      alerts: [],
      createdBy: '1',
      updatedAt: new Date().toISOString()
    }
  ]);

  // Data states with enhanced sample data
  const [purchases, setPurchases] = useState<Purchase[]>([
    {
      id: '1',
      itemName: 'Хлопковая ткань премиум',
      quantity: 50,
      costPerUnit: 350,
      description: 'Высококачественная белая хлопковая ткань для рубашек',
      date: '2024-01-15',
      category: 'fabric',
      createdBy: '1',
      updatedAt: new Date().toISOString()
    },
    {
      id: '2',
      itemName: 'Пуговицы перламутровые',
      quantity: 200,
      costPerUnit: 8,
      description: 'Белые перламутровые пуговицы 12мм',
      date: '2024-01-16',
      category: 'accessories',
      createdBy: '1',
      updatedAt: new Date().toISOString()
    },
    {
      id: '3',
      itemName: 'Швейная машина Brother',
      quantity: 1,
      costPerUnit: 45000,
      description: 'Промышленная швейная машина Brother DB2-B755-3',
      date: '2024-01-10',
      category: 'equipment',
      createdBy: '1',
      updatedAt: new Date().toISOString()
    }
  ]);

  const [sales, setSales] = useState<Sale[]>([
    {
      id: '1',
      itemName: 'Мужская рубашка классик',
      quantity: 15,
      costPerUnit: 1800,
      description: 'Белая классическая рубашка из хлопка',
      date: '2024-01-20',
      paymentMethod: 'cash',
      paymentStatus: 'paid',
      createdBy: '1',
      updatedAt: new Date().toISOString()
    },
    {
      id: '2',
      itemName: 'Женское платье летнее',
      quantity: 8,
      costPerUnit: 2800,
      description: 'Летнее платье из хлопка с цветочным принтом',
      date: '2024-01-22',
      paymentMethod: 'card',
      paymentStatus: 'paid',
      createdBy: '1',
      updatedAt: new Date().toISOString()
    },
    {
      id: '3',
      itemName: 'Детская куртка',
      quantity: 12,
      costPerUnit: 2200,
      description: 'Детская демисезонная куртка',
      date: '2024-01-25',
      paymentMethod: 'transfer',
      paymentStatus: 'paid',
      createdBy: '1',
      updatedAt: new Date().toISOString()
    }
  ]);

  const [workers, setWorkers] = useState<Worker[]>([
    {
      id: '1',
      name: 'Анна Петровна Иванова',
      role: 'Швея',
      phone: '+996 555 123456',
      hireDate: '2024-01-01',
      status: 'active',
      department: 'Производство',
      skills: ['Пошив', 'Качество'],
      documents: [],
      performance: [],
      createdBy: '1',
      updatedAt: new Date().toISOString()
    },
    {
      id: '2',
      name: 'Петр Сергеевич Сидоров',
      role: 'Кройщик',
      phone: '+996 555 654321',
      hireDate: '2024-01-05',
      status: 'active',
      department: 'Производство',
      skills: ['Крой', 'Дизайн'],
      documents: [],
      performance: [],
      createdBy: '1',
      updatedAt: new Date().toISOString()
    },
    {
      id: '3',
      name: 'Мария Александровна Козлова',
      role: 'Утюжильщик',
      phone: '+996 555 789012',
      hireDate: '2024-01-08',
      status: 'active',
      department: 'Производство',
      skills: ['Глажка', 'Отделка'],
      documents: [],
      performance: [],
      createdBy: '1',
      updatedAt: new Date().toISOString()
    }
  ]);

  const [tasks, setTasks] = useState<Task[]>([
    {
      id: '1',
      workerId: '1',
      clothingType: 'shirt',
      partType: 'sewing',
      quantity: 25,
      ratePerUnit: 60,
      priority: 'high',
      status: 'in_progress',
      deadline: '2024-02-01',
      comment: 'Срочный заказ для корпоративного клиента',
      date: '2024-01-25',
      materials: [],
      attachments: [],
      dependencies: [],
      progress: 60,
      createdBy: '1',
      updatedAt: new Date().toISOString()
    },
    {
      id: '2',
      workerId: '2',
      clothingType: 'dress',
      partType: 'cutting',
      quantity: 18,
      ratePerUnit: 85,
      priority: 'medium',
      status: 'pending',
      deadline: '2024-02-05',
      comment: 'Летняя коллекция',
      date: '2024-01-26',
      materials: [],
      attachments: [],
      dependencies: [],
      progress: 0,
      createdBy: '1',
      updatedAt: new Date().toISOString()
    },
    {
      id: '3',
      workerId: '3',
      clothingType: 'jacket',
      partType: 'finishing',
      quantity: 10,
      ratePerUnit: 120,
      priority: 'low',
      status: 'completed',
      deadline: '2024-01-30',
      comment: 'Детская коллекция завершена',
      date: '2024-01-20',
      materials: [],
      attachments: [],
      dependencies: [],
      progress: 100,
      createdBy: '1',
      updatedAt: new Date().toISOString()
    }
  ]);

  const [expenses, setExpenses] = useState<Expense[]>([
    {
      id: '1',
      type: 'electricity',
      description: 'Оплата за электричество за январь',
      amount: 8500,
      date: '2024-01-10',
      category: 'utilities',
      approved: true,
      budgetCategory: 'operations',
      recurring: true,
      createdBy: '1',
      updatedAt: new Date().toISOString()
    },
    {
      id: '2',
      type: 'rent',
      description: 'Аренда производственного помещения',
      amount: 35000,
      date: '2024-01-01',
      category: 'facilities',
      approved: true,
      budgetCategory: 'operations',
      recurring: true,
      createdBy: '1',
      updatedAt: new Date().toISOString()
    },
    {
      id: '3',
      type: 'transport',
      description: 'Доставка материалов',
      amount: 2500,
      date: '2024-01-15',
      category: 'logistics',
      approved: true,
      budgetCategory: 'operations',
      recurring: false,
      createdBy: '1',
      updatedAt: new Date().toISOString()
    }
  ]);

  const t = translations[language];

  useEffect(() => {
    document.documentElement.className = theme;
  }, [theme]);

  // Check for saved user session
  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      try {
        const user = JSON.parse(savedUser);
        setCurrentUser(user);
        setIsAuthenticated(true);
      } catch (error) {
        localStorage.removeItem('currentUser');
      }
    }
  }, []);

  // Enhanced calculations
  const totalPurchases = purchases.reduce((sum, p) => sum + (p.quantity * p.costPerUnit), 0);
  const totalSales = sales.reduce((sum, s) => sum + (s.quantity * s.costPerUnit), 0);
  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
  const activeTasks = tasks.filter(t => t.status !== 'completed').length;
  const completedTasks = tasks.filter(t => t.status === 'completed').length;
  const profit = totalSales - totalPurchases - totalExpenses;
  const profitMargin = totalSales > 0 ? ((profit / totalSales) * 100) : 0;

  // Handlers
  const handleAddPurchase = (purchase: Omit<Purchase, 'id'>) => {
    const newPurchase = { 
      ...purchase, 
      id: Date.now().toString(),
      createdBy: currentUser?.id || '1',
      updatedAt: new Date().toISOString()
    };
    setPurchases([...purchases, newPurchase]);
    toast.success('Закупка успешно добавлена!');
  };

  const handleAddSale = (sale: Omit<Sale, 'id'>) => {
    const newSale = { 
      ...sale, 
      id: Date.now().toString(),
      paymentMethod: 'cash',
      paymentStatus: 'paid',
      createdBy: currentUser?.id || '1',
      updatedAt: new Date().toISOString()
    };
    setSales([...sales, newSale]);
    toast.success('Продажа успешно добавлена!');
  };

  const handleAddWorker = (worker: Omit<Worker, 'id'>) => {
    const newWorker = { 
      ...worker, 
      id: Date.now().toString(),
      department: 'Производство',
      skills: [],
      documents: [],
      performance: [],
      createdBy: currentUser?.id || '1',
      updatedAt: new Date().toISOString()
    };
    setWorkers([...workers, newWorker]);
    toast.success('Сотрудник успешно добавлен!');
  };

  const handleAddExpense = (expense: Omit<Expense, 'id'>) => {
    const newExpense = { 
      ...expense, 
      id: Date.now().toString(),
      category: 'general',
      approved: true,
      budgetCategory: 'operations',
      recurring: false,
      createdBy: currentUser?.id || '1',
      updatedAt: new Date().toISOString()
    };
    setExpenses([...expenses, newExpense]);
    toast.success('Расход успешно добавлен!');
  };

  const handleAddTask = (task: Omit<Task, 'id'>) => {
    const newTask = { 
      ...task, 
      id: Date.now().toString(),
      materials: [],
      attachments: [],
      dependencies: [],
      progress: 0,
      createdBy: currentUser?.id || '1',
      updatedAt: new Date().toISOString()
    };
    setTasks([...tasks, newTask]);
    toast.success('Задача успешно добавлена!');
  };

  const handleTaskStatusChange = (taskId: string) => {
    setTasks(tasks.map(task => {
      if (task.id === taskId) {
        const statusOrder: Task['status'][] = ['pending', 'in_progress', 'completed'];
        const currentIndex = statusOrder.indexOf(task.status);
        const nextIndex = (currentIndex + 1) % statusOrder.length;
        return { ...task, status: statusOrder[nextIndex] };
      }
      return task;
    }));
    toast.success('Статус задачи обновлен!');
  };

  const handleDelete = (id: string, type: 'purchase' | 'sale' | 'worker' | 'expense' | 'task') => {
    if (window.confirm(t.confirmDelete)) {
      switch (type) {
        case 'purchase':
          setPurchases(purchases.filter(p => p.id !== id));
          break;
        case 'sale':
          setSales(sales.filter(s => s.id !== id));
          break;
        case 'worker':
          setWorkers(workers.filter(w => w.id !== id));
          break;
        case 'expense':
          setExpenses(expenses.filter(e => e.id !== id));
          break;
        case 'task':
          setTasks(tasks.filter(t => t.id !== id));
          break;
      }
      toast.success('Элемент успешно удален!');
    }
  };

  // New handlers
  const handleMarkNotificationAsRead = (id: string) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
  };

  const handleMarkAllNotificationsAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const handleDeleteNotification = (id: string) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  const handleAddInventoryItem = (item: Omit<InventoryItem, 'id' | 'movements' | 'createdBy' | 'updatedAt'>) => {
    const newItem: InventoryItem = {
      ...item,
      id: Date.now().toString(),
      movements: [],
      createdBy: currentUser?.id || '1',
      updatedAt: new Date().toISOString()
    };
    setInventory([...inventory, newItem]);
    toast.success('Товар добавлен на склад!');
  };

  const handleUpdateStock = (itemId: string, movement: Omit<StockMovement, 'id' | 'createdBy'>) => {
    setInventory(inventory.map(item => {
      if (item.id === itemId) {
        const newMovement: StockMovement = {
          ...movement,
          id: Date.now().toString(),
          createdBy: currentUser?.id || '1'
        };
        
        let newStock = item.currentStock;
        if (movement.type === 'in' || movement.type === 'adjustment') {
          newStock += movement.quantity;
        } else {
          newStock -= movement.quantity;
        }
        
        const newStatus: InventoryItem['status'] = 
          newStock === 0 ? 'out_of_stock' :
          newStock <= item.minStock ? 'low_stock' : 'in_stock';
        
        return {
          ...item,
          currentStock: Math.max(0, newStock),
          status: newStatus,
          movements: [...item.movements, newMovement],
          updatedAt: new Date().toISOString()
        };
      }
      return item;
    }));
    toast.success('Движение товара зафиксировано!');
  };

  const handleAddUser = (userData: Omit<User, 'id' | 'createdAt' | 'lastLogin'>) => {
    const newUser: User = {
      ...userData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    setUsers([...users, newUser]);
    toast.success('Пользователь создан!');
  };

  const handleUpdateUser = (updatedUser: User) => {
    setUsers(users.map(user => 
      user.id === updatedUser.id ? updatedUser : user
    ));
    toast.success('Пользователь обновлен!');
  };

  const handleDeleteUser = (userId: string) => {
    if (window.confirm('Вы уверены, что хотите удалить этого пользователя?')) {
      setUsers(users.filter(user => user.id !== userId));
      toast.success('Пользователь удален!');
    }
  };

  const handleToggleUserStatus = (userId: string) => {
    setUsers(users.map(user => 
      user.id === userId ? { ...user, isActive: !user.isActive } : user
    ));
  };

  const handleAddBudget = (budgetData: Omit<Budget, 'id' | 'spent' | 'alerts' | 'createdBy' | 'updatedAt'>) => {
    const newBudget: Budget = {
      ...budgetData,
      id: Date.now().toString(),
      spent: 0,
      alerts: [],
      createdBy: currentUser?.id || '1',
      updatedAt: new Date().toISOString()
    };
    setBudgets([...budgets, newBudget]);
    toast.success('Бюджет создан!');
  };

  const handleUpdateBudget = (updatedBudget: Budget) => {
    setBudgets(budgets.map(budget => 
      budget.id === updatedBudget.id ? updatedBudget : budget
    ));
    toast.success('Бюджет обновлен!');
  };

  const handleLogin = (username: string, password: string) => {
    // Simulate login - in real app, this would be an API call
    if (username === 'admin' && password === 'admin123') {
      const user: User = {
        id: '1',
        username: 'admin',
        fullName: 'Администратор',
        email: 'admin@example.com',
        role: 'admin',
        permissions: [],
        isActive: true,
        createdAt: new Date().toISOString(),
        settings: {
          theme: 'light',
          language: 'ru',
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
      localStorage.setItem('currentUser', JSON.stringify(user));
      toast.success('Добро пожаловать!');
    } else {
      toast.error('Неверные данные для входа');
    }
  };

  const handleRegister = (userData: {
    username: string;
    password: string;
    email: string;
    fullName: string;
    phone: string;
  }) => {
    // Simulate registration - in real app, this would be an API call
    const user: User = {
      id: Date.now().toString(),
      username: userData.username,
      fullName: userData.fullName,
      email: userData.email,
      phone: userData.phone,
      role: 'user',
      permissions: [],
      isActive: true,
      createdAt: new Date().toISOString(),
      settings: {
        theme: 'light',
        language: 'ru',
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
    localStorage.setItem('currentUser', JSON.stringify(user));
    toast.success(`Добро пожаловать, ${userData.fullName}!`);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('currentUser');
    setCurrentTab('dashboard');
    toast.success('Вы вышли из системы');
  };

  // Show login screen if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: theme === 'dark' ? '#374151' : '#ffffff',
              color: theme === 'dark' ? '#ffffff' : '#000000',
              borderRadius: '12px',
              border: '1px solid',
              borderColor: theme === 'dark' ? '#4B5563' : '#E5E7EB',
            },
          }}
        />
        
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <Factory className="w-12 h-12 text-blue-600 mr-3" />
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {t.appTitle}
              </h1>
            </div>
            <p className="text-gray-600 dark:text-gray-400">
              Профессиональная система управления швейным производством
            </p>
          </div>
          
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-gray-200 dark:border-gray-700">
            <button
              onClick={() => setShowAuthModal(true)}
              className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 px-6 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-medium text-lg shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <LogIn className="w-6 h-6" />
              Войти в систему
            </button>
            
            <div className="mt-6 flex items-center justify-center gap-4">
              <button
                onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
                className="p-3 rounded-xl text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200"
              >
                {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
              </button>
              
              <button
                onClick={() => setLanguage(language === 'ru' ? 'ky' : 'ru')}
                className="flex items-center gap-2 p-3 rounded-xl text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200"
              >
                <Globe className="w-5 h-5" />
                <span className="text-sm font-medium">{language.toUpperCase()}</span>
              </button>
            </div>
          </div>
          
          <div className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
            <p>Демо данные: admin / admin123</p>
          </div>
        </div>
        
        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          onLogin={handleLogin}
          onRegister={handleRegister}
          language={language}
        />
      </div>
    );
  }

  const menuItems = [
    { id: 'dashboard', label: t.dashboard, icon: BarChart3, color: 'text-blue-600' },
    { id: 'purchases', label: t.purchases, icon: ShoppingCart, color: 'text-purple-600' },
    { id: 'sales', label: t.sales, icon: TrendingUp, color: 'text-green-600' },
    { id: 'workers', label: t.workers, icon: Users, color: 'text-indigo-600' },
    { id: 'tasks', label: t.tasks, icon: CheckSquare, color: 'text-orange-600' },
    { id: 'inventory', label: 'Склад', icon: Warehouse, color: 'text-teal-600' },
    { id: 'expenses', label: t.expenses, icon: DollarSign, color: 'text-red-600' },
    { id: 'financial', label: 'Финансы', icon: Calculator, color: 'text-yellow-600' },
    { id: 'users', label: 'Пользователи', icon: Shield, color: 'text-pink-600' },
    { id: 'analytics', label: t.analytics, icon: PieChart, color: 'text-teal-600' },
  ];

  const quickActions = [
    { 
      label: t.addPurchase, 
      icon: Package, 
      color: 'bg-purple-600 hover:bg-purple-700',
      action: () => setShowPurchaseModal(true)
    },
    { 
      label: t.addSale, 
      icon: TrendingUp, 
      color: 'bg-green-600 hover:bg-green-700',
      action: () => setShowSaleModal(true)
    },
    { 
      label: t.addWorker, 
      icon: Users, 
      color: 'bg-indigo-600 hover:bg-indigo-700',
      action: () => setShowWorkerModal(true)
    },
    { 
      label: t.addTask, 
      icon: CheckSquare, 
      color: 'bg-orange-600 hover:bg-orange-700',
      action: () => setShowTaskModal(true)
    },
    { 
      label: t.addExpense, 
      icon: DollarSign, 
      color: 'bg-red-600 hover:bg-red-700',
      action: () => setShowExpenseModal(true)
    }
  ];

  const renderDashboard = () => (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
        <StatCard
          title={t.totalPurchases}
          value={`${totalPurchases.toLocaleString()} сом`}
          icon={ShoppingCart}
          color="bg-gradient-to-r from-purple-500 to-purple-600"
          trend={{ value: 12, isPositive: false, period: t.thisMonth }}
        />
        <StatCard
          title={t.totalSales}
          value={`${totalSales.toLocaleString()} сом`}
          icon={TrendingUp}
          color="bg-gradient-to-r from-green-500 to-green-600"
          trend={{ value: 18, isPositive: true, period: t.thisMonth }}
        />
        <StatCard
          title={t.totalWorkers}
          value={workers.filter(w => w.status === 'active').length.toString()}
          icon={Users}
          color="bg-gradient-to-r from-indigo-500 to-indigo-600"
        />
        <StatCard
          title={t.totalTasks}
          value={activeTasks.toString()}
          icon={CheckSquare}
          color="bg-gradient-to-r from-orange-500 to-orange-600"
        />
        <StatCard
          title={t.totalExpenses}
          value={`${totalExpenses.toLocaleString()} сом`}
          icon={DollarSign}
          color="bg-gradient-to-r from-red-500 to-red-600"
          trend={{ value: 8, isPositive: false, period: t.thisMonth }}
        />
        <StatCard
          title={t.profit}
          value={`${profit.toLocaleString()} сом`}
          icon={Wallet}
          color={profit >= 0 ? "bg-gradient-to-r from-emerald-500 to-emerald-600" : "bg-gradient-to-r from-red-500 to-red-600"}
          trend={{ value: Math.abs(profitMargin), isPositive: profit >= 0, period: `${profitMargin.toFixed(1)}%` }}
        />
      </div>

      {/* Quick Actions */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
          <Factory className="w-5 h-5 mr-2" />
          {t.quickActions}
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {quickActions.map((action, index) => (
            <button
              key={index}
              onClick={action.action}
              className={`flex flex-col items-center p-4 rounded-xl text-white transition-all duration-200 hover:scale-105 ${action.color}`}
            >
              <action.icon className="w-6 h-6 mb-2" />
              <span className="text-sm font-medium text-center">{action.label}</span>
            </button>
          ))}
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Transactions */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
            <Calendar className="w-5 h-5 mr-2" />
            {t.recentTransactions}
          </h3>
          <div className="space-y-4">
            {[...purchases.slice(-3), ...sales.slice(-3)]
              .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
              .slice(0, 5)
              .map((item, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
                <div className="flex items-center">
                  <div className={`p-3 rounded-xl mr-4 ${
                    'category' in item 
                      ? 'bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-300' 
                      : 'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300'
                  }`}>
                    {'category' in item ? <ShoppingCart className="w-5 h-5" /> : <TrendingUp className="w-5 h-5" />}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">{item.itemName}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{item.date}</p>
                  </div>
                </div>
                <span className={`font-bold text-lg ${
                  'category' in item ? 'text-red-600' : 'text-green-600'
                }`}>
                  {'category' in item ? '-' : '+'}{(item.quantity * item.costPerUnit).toLocaleString()} сом
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Tasks */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
            <CheckSquare className="w-5 h-5 mr-2" />
            {t.recentTasks}
          </h3>
          <div className="space-y-4">
            {tasks.slice(-5).map((task) => {
              const worker = workers.find(w => w.id === task.workerId);
              return (
                <div key={task.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
                  <div className="flex items-center">
                    <div className="p-3 rounded-xl mr-4 bg-orange-100 text-orange-600 dark:bg-orange-900 dark:text-orange-300">
                      <CheckSquare className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {task.clothingType} - {task.partType}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {worker?.name} • {task.quantity} шт. • {(task.quantity * task.ratePerUnit).toLocaleString()} сом
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <PriorityBadge priority={task.priority} />
                    <TaskStatusBadge status={task.status} onClick={() => handleTaskStatusChange(task.id)} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );

  const renderAnalytics = () => {
    // Enhanced analytics data
    const monthlyData = Array.from({ length: 12 }, (_, i) => {
      const month = new Date(2024, i, 1).toLocaleDateString('ru-RU', { month: 'short' });
      const monthSales = sales.filter(s => new Date(s.date).getMonth() === i)
        .reduce((sum, s) => sum + (s.quantity * s.costPerUnit), 0);
      const monthPurchases = purchases.filter(p => new Date(p.date).getMonth() === i)
        .reduce((sum, p) => sum + (p.quantity * p.costPerUnit), 0);
      const monthExpenses = expenses.filter(e => new Date(e.date).getMonth() === i)
        .reduce((sum, e) => sum + e.amount, 0);
      
      return {
        name: month,
        profit: monthSales - monthPurchases - monthExpenses,
        sales: monthSales,
        expenses: monthExpenses
      };
    });

    const expenseData = Object.entries(
      expenses.reduce((acc, expense) => {
        acc[expense.type] = (acc[expense.type] || 0) + expense.amount;
        return acc;
      }, {} as Record<string, number>)
    ).map(([type, amount]) => ({
      name: t[type as keyof typeof t] || type,
      value: amount
    }));

    const taskStatusData = [
      { name: t.pending, value: tasks.filter(t => t.status === 'pending').length },
      { name: t.in_progress, value: tasks.filter(t => t.status === 'in_progress').length },
      { name: t.completed, value: tasks.filter(t => t.status === 'completed').length }
    ];

    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">{t.analytics}</h2>
          <ExportButtons 
            data={[...purchases, ...sales, ...expenses]} 
            filename="analytics-report" 
            title="Аналитический отчет"
          />
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <AnalyticsChart
            type="line"
            data={monthlyData}
            dataKey="profit"
            title={t.monthlyProfit}
            color="#10B981"
          />
          
          <AnalyticsChart
            type="bar"
            data={monthlyData}
            dataKey="sales"
            title={t.salesTrend}
            color="#3B82F6"
          />
          
          <AnalyticsChart
            type="pie"
            data={expenseData}
            dataKey="value"
            title={t.expenseDistribution}
          />
          
          <AnalyticsChart
            type="pie"
            data={taskStatusData}
            dataKey="value"
            title={t.tasksByStatus}
          />
        </div>
      </div>
    );
  };

  const renderDataView = (type: string) => {
    const getColumns = () => {
      switch (type) {
        case 'purchases':
          return [
            { key: 'itemName', label: t.itemName, sortable: true },
            { key: 'quantity', label: t.quantity, sortable: true },
            { 
              key: 'costPerUnit', 
              label: t.costPerUnit, 
              sortable: true,
              render: (value: number) => `${value.toLocaleString()} сом`
            },
            { key: 'category', label: t.category },
            { key: 'date', label: t.date, sortable: true }
          ];
        case 'sales':
          return [
            { key: 'itemName', label: t.itemName, sortable: true },
            { key: 'quantity', label: t.quantity, sortable: true },
            { 
              key: 'costPerUnit', 
              label: t.costPerUnit, 
              sortable: true,
              render: (value: number) => `${value.toLocaleString()} сом`
            },
            { key: 'date', label: t.date, sortable: true }
          ];
        case 'workers':
          return [
            { key: 'name', label: t.name, sortable: true },
            { key: 'role', label: t.role },
            { key: 'phone', label: t.phone },
            { 
              key: 'status', 
              label: t.status,
              render: (value: string) => (
                <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                  value === 'active' 
                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                    : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                }`}>
                  {t[value as keyof typeof t] || value}
                </span>
              )
            }
          ];
        case 'tasks':
          return [
            { 
              key: 'workerId', 
              label: t.workerName,
              render: (value: string) => workers.find(w => w.id === value)?.name || 'Неизвестно'
            },
            { key: 'clothingType', label: t.clothingType },
            { key: 'partType', label: t.partType },
            { key: 'quantity', label: t.quantity, sortable: true },
            { 
              key: 'ratePerUnit', 
              label: t.ratePerUnit,
              render: (value: number) => `${value.toLocaleString()} сом`
            },
            { 
              key: 'priority', 
              label: t.priority,
              render: (value: string) => <PriorityBadge priority={value as any} />
            },
            { 
              key: 'status', 
              label: t.status,
              render: (value: string, row: any) => (
                <TaskStatusBadge 
                  status={value as any} 
                  onClick={() => handleTaskStatusChange(row.id)} 
                />
              )
            },
            { key: 'deadline', label: t.deadline, sortable: true }
          ];
        case 'expenses':
          return [
            { 
              key: 'type', 
              label: t.type,
              render: (value: string) => t[value as keyof typeof t] || value
            },
            { key: 'description', label: t.description },
            { 
              key: 'amount', 
              label: t.amount, 
              sortable: true,
              render: (value: number) => `${value.toLocaleString()} сом`
            },
            { key: 'date', label: t.date, sortable: true }
          ];
        default:
          return [];
      }
    };

    const getData = () => {
      switch (type) {
        case 'purchases': return purchases;
        case 'sales': return sales;
        case 'workers': return workers;
        case 'tasks': return tasks;
        case 'expenses': return expenses;
        default: return [];
      }
    };

    const getAddButton = () => {
      const buttons = {
        purchases: { label: t.addNew, action: () => setShowPurchaseModal(true), color: 'bg-purple-600 hover:bg-purple-700' },
        sales: { label: t.addNew, action: () => setShowSaleModal(true), color: 'bg-green-600 hover:bg-green-700' },
        workers: { label: t.addNew, action: () => setShowWorkerModal(true), color: 'bg-indigo-600 hover:bg-indigo-700' },
        tasks: { label: t.addNew, action: () => setShowTaskModal(true), color: 'bg-orange-600 hover:bg-orange-700' },
        expenses: { label: t.addNew, action: () => setShowExpenseModal(true), color: 'bg-red-600 hover:bg-red-700' }
      };
      
      const button = buttons[type as keyof typeof buttons];
      if (!button) return null;

      return (
        <button
          onClick={button.action}
          className={`flex items-center gap-2 px-6 py-3 text-white rounded-xl transition-all duration-200 hover:scale-105 ${button.color}`}
        >
          <Plus className="w-5 h-5" />
          {button.label}
        </button>
      );
    };

    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            {t[type as keyof typeof t]}
          </h2>
          <div className="flex items-center gap-4">
            <ExportButtons 
              data={getData()} 
              filename={type} 
              title={t[type as keyof typeof t]}
            />
            {getAddButton()}
          </div>
        </div>
        
        <DataTable
          data={getData()}
          columns={getColumns()}
          searchPlaceholder={`${t.search} ${t[type as keyof typeof t].toLowerCase()}...`}
          onEdit={(item) => console.log('Edit:', item)}
          onDelete={(item) => handleDelete(item.id, type as any)}
        />
      </div>
    );
  };

  const renderContent = () => {
    switch (currentTab) {
      case 'dashboard':
        return renderDashboard();
      case 'analytics':
        return renderAnalytics();
      case 'inventory':
        return (
          <InventoryManager
            inventory={inventory}
            onAddItem={handleAddInventoryItem}
            onUpdateStock={handleUpdateStock}
            onUpdateItem={(item) => {
              setInventory(inventory.map(i => i.id === item.id ? item : i));
              toast.success('Товар обновлен!');
            }}
          />
        );
      case 'users':
        return currentUser?.role === 'admin' ? (
          <UserManagement
            users={users}
            currentUser={currentUser}
            onAddUser={handleAddUser}
            onUpdateUser={handleUpdateUser}
            onDeleteUser={handleDeleteUser}
            onToggleUserStatus={handleToggleUserStatus}
          />
        ) : (
          <div className="text-center py-12">
            <Shield className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Доступ запрещен
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              У вас нет прав для просмотра этого раздела
            </p>
          </div>
        );
      case 'financial':
        return (
          <FinancialManager
            expenses={expenses}
            sales={sales}
            purchases={purchases}
            budgets={budgets}
            onAddBudget={handleAddBudget}
            onUpdateBudget={handleUpdateBudget}
          />
        );
      default:
        return renderDataView(currentTab);
    }
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 transition-all duration-300`}>
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: theme === 'dark' ? '#374151' : '#ffffff',
            color: theme === 'dark' ? '#ffffff' : '#000000',
            borderRadius: '12px',
            border: '1px solid',
            borderColor: theme === 'dark' ? '#4B5563' : '#E5E7EB',
          },
        }}
      />
      
      {/* Enhanced Header */}
      <header className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg shadow-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden p-2 rounded-xl text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
              <div className="flex items-center ml-2 lg:ml-0">
                <Factory className="w-8 h-8 text-blue-600 mr-3" />
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  {t.appTitle}
                </h1>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
                className="p-3 rounded-xl text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200"
              >
                {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
              </button>
              
              <button
                onClick={() => setLanguage(language === 'ru' ? 'ky' : 'ru')}
                className="flex items-center gap-2 p-3 rounded-xl text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200"
              >
                <Globe className="w-5 h-5" />
                <span className="text-sm font-medium">{language.toUpperCase()}</span>
              </button>
              
              <NotificationCenter
                notifications={notifications}
                onMarkAsRead={handleMarkNotificationAsRead}
                onMarkAllAsRead={handleMarkAllNotificationsAsRead}
                onDelete={handleDeleteNotification}
              />
              
              {currentUser && (
                <UserMenu
                  user={currentUser}
                  onLogout={handleLogout}
                />
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Enhanced Sidebar */}
        <aside className={`${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-50 w-64 xl:w-72 bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border-r border-gray-200 dark:border-gray-700 transition-transform duration-300 ease-in-out lg:transition-none`}>
          <div className="flex flex-col h-full pt-16 lg:pt-0">
            <nav className="flex-1 px-4 xl:px-6 py-8 space-y-2 overflow-y-auto">
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setCurrentTab(item.id);
                      setSidebarOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 xl:gap-4 px-3 xl:px-4 py-3 rounded-xl text-left transition-all duration-200 group ${
                      currentTab === item.id
                        ? 'bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 shadow-sm'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:scale-105'
                    }`}
                  >
                    <Icon className={`w-5 h-5 ${currentTab === item.id ? item.color : 'text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300'}`} />
                    <span className="font-medium text-sm xl:text-base">{item.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </aside>

        {/* Overlay for mobile */}
        {sidebarOpen && (
          <div
            className="lg:hidden fixed inset-0 z-40 bg-black bg-opacity-50 backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Enhanced Main content */}
        <main className="flex-1 lg:ml-0">
          <div className="px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8 max-w-full overflow-x-hidden">
            {renderContent()}
          </div>
        </main>
      </div>

      {/* Enhanced Modals */}
      <AddPurchaseModal
        isOpen={showPurchaseModal}
        onClose={() => setShowPurchaseModal(false)}
        onAdd={handleAddPurchase}
        language={language}
      />
      
      <AddSaleModal
        isOpen={showSaleModal}
        onClose={() => setShowSaleModal(false)}
        onAdd={handleAddSale}
        language={language}
      />
      
      <AddWorkerModal
        isOpen={showWorkerModal}
        onClose={() => setShowWorkerModal(false)}
        onAdd={handleAddWorker}
        language={language}
      />
      
      <AddExpenseModal
        isOpen={showExpenseModal}
        onClose={() => setShowExpenseModal(false)}
        onAdd={handleAddExpense}
        language={language}
      />
      
      <AddTaskModal
        isOpen={showTaskModal}
        onClose={() => setShowTaskModal(false)}
        onAdd={handleAddTask}
        workers={workers}
        language={language}
      />
    </div>
  );
}

export default App;