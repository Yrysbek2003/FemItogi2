export interface User {
  id: string;
  username: string;
  fullName: string;
  email: string;
  phone?: string;
  role: 'admin' | 'manager' | 'employee' | 'user';
  avatar?: string;
  permissions: Permission[];
  createdAt: string;
  lastLogin?: string;
  isActive: boolean;
  settings: UserSettings;
}

export interface Permission {
  id: string;
  name: string;
  resource: string;
  action: 'create' | 'read' | 'update' | 'delete' | 'manage';
}

export interface UserSettings {
  theme: Theme;
  language: Language;
  notifications: NotificationSettings;
  dashboardLayout: DashboardWidget[];
}

export interface NotificationSettings {
  email: boolean;
  push: boolean;
  lowStock: boolean;
  taskDeadlines: boolean;
  newOrders: boolean;
  systemAlerts: boolean;
}

export interface DashboardWidget {
  id: string;
  type: 'stats' | 'chart' | 'table' | 'quick-actions';
  position: { x: number; y: number; w: number; h: number };
  visible: boolean;
}

export interface Purchase {
  id: string;
  itemName: string;
  quantity: number;
  costPerUnit: number;
  description: string;
  date: string;
  category: string;
  supplier?: Supplier;
  barcode?: string;
  location?: string;
  expiryDate?: string;
  batchNumber?: string;
  createdBy: string;
  updatedAt: string;
}

export interface Sale {
  id: string;
  itemName: string;
  quantity: number;
  costPerUnit: number;
  description: string;
  date: string;
  customer?: Customer;
  paymentMethod: 'cash' | 'card' | 'transfer' | 'credit';
  paymentStatus: 'paid' | 'pending' | 'overdue';
  discount?: number;
  tax?: number;
  createdBy: string;
  updatedAt: string;
}

export interface Worker {
  id: string;
  name: string;
  role: string;
  phone: string;
  email?: string;
  hireDate: string;
  status: 'active' | 'inactive' | 'vacation' | 'sick';
  salary?: number;
  skills: string[];
  department: string;
  supervisor?: string;
  avatar?: string;
  address?: string;
  emergencyContact?: EmergencyContact;
  documents: Document[];
  performance: PerformanceMetric[];
  createdBy: string;
  updatedAt: string;
}

export interface EmergencyContact {
  name: string;
  relationship: string;
  phone: string;
}

export interface Document {
  id: string;
  type: 'passport' | 'contract' | 'certificate' | 'other';
  name: string;
  url: string;
  uploadDate: string;
}

export interface PerformanceMetric {
  id: string;
  period: string;
  tasksCompleted: number;
  quality: number;
  efficiency: number;
  rating: number;
  feedback?: string;
}

export interface Task {
  id: string;
  workerId: string;
  clothingType: string;
  partType: string;
  quantity: number;
  ratePerUnit: number;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled' | 'on_hold';
  deadline: string;
  comment: string;
  date: string;
  estimatedHours?: number;
  actualHours?: number;
  materials: TaskMaterial[];
  attachments: string[];
  dependencies: string[];
  progress: number;
  qualityCheck?: QualityCheck;
  createdBy: string;
  updatedAt: string;
}

export interface TaskMaterial {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  cost: number;
}

export interface QualityCheck {
  id: string;
  checkedBy: string;
  checkDate: string;
  score: number;
  notes?: string;
  approved: boolean;
}

export interface Expense {
  id: string;
  type: 'electricity' | 'repair' | 'rent' | 'transport' | 'materials' | 'salary' | 'tax' | 'insurance' | 'other';
  description: string;
  amount: number;
  date: string;
  category: string;
  vendor?: string;
  receipt?: string;
  approved: boolean;
  approvedBy?: string;
  budgetCategory: string;
  recurring: boolean;
  nextDueDate?: string;
  createdBy: string;
  updatedAt: string;
}

export interface Salary {
  id: string;
  workerId: string;
  amount: number;
  bonus: number;
  deductions: number;
  date: string;
  period: string;
  overtime?: number;
  tax: number;
  socialSecurity: number;
  netAmount: number;
  paymentMethod: 'cash' | 'transfer';
  paymentDate?: string;
  status: 'pending' | 'paid' | 'cancelled';
  createdBy: string;
}

export interface InventoryItem {
  id: string;
  name: string;
  category: string;
  currentStock: number;
  minStock: number;
  maxStock: number;
  unit: string;
  costPerUnit: number;
  supplier?: string;
  location: string;
  barcode?: string;
  description?: string;
  lastRestocked: string;
  expiryDate?: string;
  status: 'in_stock' | 'low_stock' | 'out_of_stock' | 'discontinued';
  movements: StockMovement[];
  createdBy: string;
  updatedAt: string;
}

export interface StockMovement {
  id: string;
  type: 'in' | 'out' | 'adjustment' | 'transfer';
  quantity: number;
  reason: string;
  date: string;
  reference?: string;
  createdBy: string;
}

export interface Customer {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  type: 'individual' | 'corporate';
  creditLimit?: number;
  paymentTerms?: number;
  discount?: number;
  orders: string[];
  totalSpent: number;
  lastOrderDate?: string;
  status: 'active' | 'inactive';
  createdBy: string;
  updatedAt: string;
}

export interface Supplier {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  contactPerson?: string;
  paymentTerms?: number;
  rating: number;
  categories: string[];
  orders: string[];
  totalPurchased: number;
  lastOrderDate?: string;
  status: 'active' | 'inactive';
  createdBy: string;
  updatedAt: string;
}

export interface Budget {
  id: string;
  name: string;
  category: string;
  allocated: number;
  spent: number;
  period: 'monthly' | 'quarterly' | 'yearly';
  startDate: string;
  endDate: string;
  status: 'active' | 'completed' | 'exceeded';
  alerts: BudgetAlert[];
  createdBy: string;
  updatedAt: string;
}

export interface BudgetAlert {
  id: string;
  threshold: number;
  triggered: boolean;
  triggerDate?: string;
  message: string;
}

export interface Notification {
  id: string;
  userId: string;
  type: 'info' | 'warning' | 'error' | 'success';
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  actionUrl?: string;
  data?: any;
}

export interface Report {
  id: string;
  name: string;
  type: 'sales' | 'purchases' | 'inventory' | 'financial' | 'performance' | 'custom';
  parameters: ReportParameter[];
  schedule?: ReportSchedule;
  format: 'pdf' | 'excel' | 'csv';
  recipients: string[];
  lastGenerated?: string;
  createdBy: string;
  updatedAt: string;
}

export interface ReportParameter {
  key: string;
  value: any;
  type: 'date' | 'string' | 'number' | 'boolean' | 'select';
}

export interface ReportSchedule {
  frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly';
  time: string;
  enabled: boolean;
  nextRun: string;
}

export interface ActivityLog {
  id: string;
  userId: string;
  action: string;
  resource: string;
  resourceId: string;
  details?: any;
  ipAddress?: string;
  userAgent?: string;
  timestamp: string;
}

export interface SystemSettings {
  companyName: string;
  companyLogo?: string;
  currency: string;
  timezone: string;
  dateFormat: string;
  fiscalYearStart: string;
  taxRate: number;
  features: FeatureFlag[];
  backupSettings: BackupSettings;
  securitySettings: SecuritySettings;
}

export interface FeatureFlag {
  name: string;
  enabled: boolean;
  description?: string;
}

export interface BackupSettings {
  enabled: boolean;
  frequency: 'daily' | 'weekly' | 'monthly';
  retention: number;
  location: string;
}

export interface SecuritySettings {
  passwordPolicy: PasswordPolicy;
  sessionTimeout: number;
  maxLoginAttempts: number;
  twoFactorAuth: boolean;
}

export interface PasswordPolicy {
  minLength: number;
  requireUppercase: boolean;
  requireLowercase: boolean;
  requireNumbers: boolean;
  requireSpecialChars: boolean;
  expiryDays?: number;
}

export type Theme = 'light' | 'dark' | 'auto';
export type Language = 'ru' | 'ky' | 'en';

export interface ChartData {
  name: string;
  value: number;
  color?: string;
}

export interface TimeSeriesData {
  date: string;
  value: number;
  category?: string;
}

export interface KPIMetric {
  id: string;
  name: string;
  value: number;
  target?: number;
  unit: string;
  trend: 'up' | 'down' | 'stable';
  change: number;
  period: string;
}