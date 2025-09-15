import React, { useState } from 'react';
import { Users, Shield, UserPlus, Edit, Trash2, Eye, EyeOff } from 'lucide-react';
import { User, Permission } from '../types';
import { Modal } from './Modal';
import { FormField } from './FormField';
import { DataTable } from './DataTable';

interface UserManagementProps {
  users: User[];
  currentUser: User;
  onAddUser: (user: Omit<User, 'id' | 'createdAt' | 'lastLogin'>) => void;
  onUpdateUser: (user: User) => void;
  onDeleteUser: (userId: string) => void;
  onToggleUserStatus: (userId: string) => void;
}

const defaultPermissions: Permission[] = [
  { id: '1', name: 'Просмотр дашборда', resource: 'dashboard', action: 'read' },
  { id: '2', name: 'Управление закупками', resource: 'purchases', action: 'manage' },
  { id: '3', name: 'Управление продажами', resource: 'sales', action: 'manage' },
  { id: '4', name: 'Управление сотрудниками', resource: 'workers', action: 'manage' },
  { id: '5', name: 'Управление задачами', resource: 'tasks', action: 'manage' },
  { id: '6', name: 'Управление расходами', resource: 'expenses', action: 'manage' },
  { id: '7', name: 'Просмотр аналитики', resource: 'analytics', action: 'read' },
  { id: '8', name: 'Управление пользователями', resource: 'users', action: 'manage' },
  { id: '9', name: 'Системные настройки', resource: 'settings', action: 'manage' }
];

export const UserManagement: React.FC<UserManagementProps> = ({
  users,
  currentUser,
  onAddUser,
  onUpdateUser,
  onDeleteUser,
  onToggleUserStatus
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    username: '',
    fullName: '',
    email: '',
    phone: '',
    role: 'user' as User['role'],
    password: '',
    permissions: [] as string[]
  });

  const resetForm = () => {
    setFormData({
      username: '',
      fullName: '',
      email: '',
      phone: '',
      role: 'user',
      password: '',
      permissions: []
    });
  };

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    
    const userPermissions = defaultPermissions.filter(p => 
      formData.permissions.includes(p.id)
    );

    onAddUser({
      username: formData.username,
      fullName: formData.fullName,
      email: formData.email,
      phone: formData.phone,
      role: formData.role,
      permissions: userPermissions,
      isActive: true,
      avatar: undefined,
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
    });

    resetForm();
    setShowAddModal(false);
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setFormData({
      username: user.username,
      fullName: user.fullName,
      email: user.email,
      phone: user.phone || '',
      role: user.role,
      password: '',
      permissions: user.permissions.map(p => p.id)
    });
    setShowEditModal(true);
  };

  const handleUpdateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;

    const userPermissions = defaultPermissions.filter(p => 
      formData.permissions.includes(p.id)
    );

    onUpdateUser({
      ...selectedUser,
      username: formData.username,
      fullName: formData.fullName,
      email: formData.email,
      phone: formData.phone,
      role: formData.role,
      permissions: userPermissions
    });

    resetForm();
    setShowEditModal(false);
    setSelectedUser(null);
  };

  const getRoleBadge = (role: User['role']) => {
    const configs = {
      admin: { color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200', label: 'Администратор' },
      manager: { color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200', label: 'Менеджер' },
      employee: { color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200', label: 'Сотрудник' },
      user: { color: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200', label: 'Пользователь' }
    };
    
    const config = configs[role];
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${config.color}`}>
        {config.label}
      </span>
    );
  };

  const getStatusBadge = (isActive: boolean) => {
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
        isActive 
          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
          : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
      }`}>
        {isActive ? 'Активен' : 'Заблокирован'}
      </span>
    );
  };

  const userColumns = [
    { 
      key: 'avatar', 
      label: '',
      render: (value: string | undefined, row: User) => (
        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-medium">
          {row.fullName.charAt(0).toUpperCase()}
        </div>
      )
    },
    { key: 'fullName', label: 'Полное имя', sortable: true },
    { key: 'username', label: 'Логин', sortable: true },
    { key: 'email', label: 'Email', sortable: true },
    { 
      key: 'role', 
      label: 'Роль',
      render: (value: User['role']) => getRoleBadge(value)
    },
    { 
      key: 'isActive', 
      label: 'Статус',
      render: (value: boolean) => getStatusBadge(value)
    },
    { 
      key: 'lastLogin', 
      label: 'Последний вход',
      render: (value: string | undefined) => value ? new Date(value).toLocaleDateString('ru-RU') : 'Никогда'
    }
  ];

  const rolePermissions = {
    admin: defaultPermissions.map(p => p.id),
    manager: defaultPermissions.filter(p => p.resource !== 'users' && p.resource !== 'settings').map(p => p.id),
    employee: defaultPermissions.filter(p => p.action === 'read' || p.resource === 'tasks').map(p => p.id),
    user: defaultPermissions.filter(p => p.action === 'read').map(p => p.id)
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
          Управление пользователями
        </h2>
        {currentUser.role === 'admin' && (
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200"
          >
            <UserPlus className="w-5 h-5" />
            Добавить пользователя
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-2xl">
          <div className="flex items-center gap-3 mb-2">
            <Users className="w-6 h-6 text-blue-600" />
            <h3 className="font-semibold text-blue-900 dark:text-blue-100">Всего пользователей</h3>
          </div>
          <p className="text-3xl font-bold text-blue-600">{users.length}</p>
        </div>
        
        <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-2xl">
          <div className="flex items-center gap-3 mb-2">
            <Shield className="w-6 h-6 text-green-600" />
            <h3 className="font-semibold text-green-900 dark:text-green-100">Активных</h3>
          </div>
          <p className="text-3xl font-bold text-green-600">
            {users.filter(u => u.isActive).length}
          </p>
        </div>
        
        <div className="bg-red-50 dark:bg-red-900/20 p-6 rounded-2xl">
          <div className="flex items-center gap-3 mb-2">
            <Shield className="w-6 h-6 text-red-600" />
            <h3 className="font-semibold text-red-900 dark:text-red-100">Администраторов</h3>
          </div>
          <p className="text-3xl font-bold text-red-600">
            {users.filter(u => u.role === 'admin').length}
          </p>
        </div>
        
        <div className="bg-purple-50 dark:bg-purple-900/20 p-6 rounded-2xl">
          <div className="flex items-center gap-3 mb-2">
            <Users className="w-6 h-6 text-purple-600" />
            <h3 className="font-semibold text-purple-900 dark:text-purple-100">Менеджеров</h3>
          </div>
          <p className="text-3xl font-bold text-purple-600">
            {users.filter(u => u.role === 'manager').length}
          </p>
        </div>
      </div>

      <DataTable
        data={users}
        columns={userColumns}
        searchPlaceholder="Поиск пользователей..."
        onEdit={currentUser.role === 'admin' ? handleEditUser : undefined}
        onDelete={currentUser.role === 'admin' ? (user) => onDeleteUser(user.id) : undefined}
        onView={(user) => {
          // Implement user profile view
          console.log('View user:', user);
        }}
      />

      {/* Add User Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => {
          setShowAddModal(false);
          resetForm();
        }}
        title="Добавить пользователя"
        size="xl"
      >
        <form onSubmit={handleAddUser} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              label="Полное имя"
              value={formData.fullName}
              onChange={(value) => setFormData({ ...formData, fullName: value })}
              required
            />
            
            <FormField
              label="Имя пользователя"
              value={formData.username}
              onChange={(value) => setFormData({ ...formData, username: value })}
              required
            />
            
            <FormField
              label="Email"
              type="email"
              value={formData.email}
              onChange={(value) => setFormData({ ...formData, email: value })}
              required
            />
            
            <FormField
              label="Телефон"
              type="tel"
              value={formData.phone}
              onChange={(value) => setFormData({ ...formData, phone: value })}
            />
            
            <FormField
              label="Роль"
              type="select"
              value={formData.role}
              onChange={(value) => {
                const role = value as User['role'];
                setFormData({ 
                  ...formData, 
                  role,
                  permissions: rolePermissions[role]
                });
              }}
              options={[
                { value: 'user', label: 'Пользователь' },
                { value: 'employee', label: 'Сотрудник' },
                { value: 'manager', label: 'Менеджер' },
                { value: 'admin', label: 'Администратор' }
              ]}
              required
            />
            
            <div className="relative">
              <FormField
                label="Пароль"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={(value) => setFormData({ ...formData, password: value })}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-9 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Разрешения
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-48 overflow-y-auto p-4 border border-gray-300 dark:border-gray-600 rounded-xl">
              {defaultPermissions.map((permission) => (
                <label key={permission.id} className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={formData.permissions.includes(permission.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setFormData({
                          ...formData,
                          permissions: [...formData.permissions, permission.id]
                        });
                      } else {
                        setFormData({
                          ...formData,
                          permissions: formData.permissions.filter(id => id !== permission.id)
                        });
                      }
                    }}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    {permission.name}
                  </span>
                </label>
              ))}
            </div>
          </div>
          
          <div className="flex gap-4">
            <button
              type="submit"
              className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 px-6 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200"
            >
              Создать пользователя
            </button>
            <button
              type="button"
              onClick={() => {
                setShowAddModal(false);
                resetForm();
              }}
              className="flex-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 py-3 px-6 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              Отмена
            </button>
          </div>
        </form>
      </Modal>

      {/* Edit User Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setSelectedUser(null);
          resetForm();
        }}
        title={`Редактировать пользователя: ${selectedUser?.fullName}`}
        size="xl"
      >
        <form onSubmit={handleUpdateUser} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              label="Полное имя"
              value={formData.fullName}
              onChange={(value) => setFormData({ ...formData, fullName: value })}
              required
            />
            
            <FormField
              label="Имя пользователя"
              value={formData.username}
              onChange={(value) => setFormData({ ...formData, username: value })}
              required
            />
            
            <FormField
              label="Email"
              type="email"
              value={formData.email}
              onChange={(value) => setFormData({ ...formData, email: value })}
              required
            />
            
            <FormField
              label="Телефон"
              type="tel"
              value={formData.phone}
              onChange={(value) => setFormData({ ...formData, phone: value })}
            />
            
            <FormField
              label="Роль"
              type="select"
              value={formData.role}
              onChange={(value) => {
                const role = value as User['role'];
                setFormData({ 
                  ...formData, 
                  role,
                  permissions: rolePermissions[role]
                });
              }}
              options={[
                { value: 'user', label: 'Пользователь' },
                { value: 'employee', label: 'Сотрудник' },
                { value: 'manager', label: 'Менеджер' },
                { value: 'admin', label: 'Администратор' }
              ]}
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Разрешения
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-48 overflow-y-auto p-4 border border-gray-300 dark:border-gray-600 rounded-xl">
              {defaultPermissions.map((permission) => (
                <label key={permission.id} className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={formData.permissions.includes(permission.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setFormData({
                          ...formData,
                          permissions: [...formData.permissions, permission.id]
                        });
                      } else {
                        setFormData({
                          ...formData,
                          permissions: formData.permissions.filter(id => id !== permission.id)
                        });
                      }
                    }}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    {permission.name}
                  </span>
                </label>
              ))}
            </div>
          </div>
          
          <div className="flex gap-4">
            <button
              type="submit"
              className="flex-1 bg-gradient-to-r from-green-600 to-green-700 text-white py-3 px-6 rounded-xl hover:from-green-700 hover:to-green-800 transition-all duration-200"
            >
              Сохранить изменения
            </button>
            <button
              type="button"
              onClick={() => {
                setShowEditModal(false);
                setSelectedUser(null);
                resetForm();
              }}
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