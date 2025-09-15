import React, { useState } from 'react';
import { Modal } from './Modal';
import { FormField } from './FormField';
import { Eye, EyeOff, User, Lock, Mail, Phone } from 'lucide-react';
import toast from 'react-hot-toast';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (username: string, password: string) => void;
  onRegister: (userData: {
    username: string;
    password: string;
    email: string;
    fullName: string;
    phone: string;
  }) => void;
  language: 'ru' | 'ky';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onLogin,
  onRegister,
  language
}) => {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [loginData, setLoginData] = useState({
    username: '',
    password: ''
  });

  const [registerData, setRegisterData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    email: '',
    fullName: '',
    phone: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateLogin = () => {
    const newErrors: Record<string, string> = {};
    
    if (!loginData.username.trim()) {
      newErrors.username = 'Имя пользователя обязательно';
    }
    if (!loginData.password) {
      newErrors.password = 'Пароль обязателен';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateRegister = () => {
    const newErrors: Record<string, string> = {};
    
    if (!registerData.username.trim()) {
      newErrors.username = 'Имя пользователя обязательно';
    } else if (registerData.username.length < 3) {
      newErrors.username = 'Имя пользователя должно быть не менее 3 символов';
    }
    
    if (!registerData.password) {
      newErrors.password = 'Пароль обязателен';
    } else if (registerData.password.length < 6) {
      newErrors.password = 'Пароль должен быть не менее 6 символов';
    }
    
    if (registerData.password !== registerData.confirmPassword) {
      newErrors.confirmPassword = 'Пароли не совпадают';
    }
    
    if (!registerData.email.trim()) {
      newErrors.email = 'Email обязателен';
    } else if (!/\S+@\S+\.\S+/.test(registerData.email)) {
      newErrors.email = 'Неверный формат email';
    }
    
    if (!registerData.fullName.trim()) {
      newErrors.fullName = 'Полное имя обязательно';
    }
    
    if (registerData.phone && !/^\+996\s?\d{3}\s?\d{3}\s?\d{3}$/.test(registerData.phone.replace(/\s/g, ''))) {
      newErrors.phone = 'Неверный формат телефона (+996 XXX XXX XXX)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateLogin()) {
      onLogin(loginData.username, loginData.password);
      handleClose();
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateRegister()) {
      onRegister({
        username: registerData.username,
        password: registerData.password,
        email: registerData.email,
        fullName: registerData.fullName,
        phone: registerData.phone
      });
      handleClose();
    }
  };

  const handleClose = () => {
    setLoginData({ username: '', password: '' });
    setRegisterData({
      username: '',
      password: '',
      confirmPassword: '',
      email: '',
      fullName: '',
      phone: ''
    });
    setErrors({});
    setShowPassword(false);
    setShowConfirmPassword(false);
    onClose();
  };

  const switchMode = () => {
    setMode(mode === 'login' ? 'register' : 'login');
    setErrors({});
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={handleClose} 
      title={mode === 'login' ? 'Вход в систему' : 'Регистрация'} 
      size="md"
    >
      {mode === 'login' ? (
        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-4">
            <div className="relative">
              <FormField
                label="Имя пользователя"
                value={loginData.username}
                onChange={(value) => setLoginData({ ...loginData, username: value })}
                placeholder="Введите имя пользователя"
                required
                error={errors.username}
              />
              <User className="absolute right-3 top-9 w-5 h-5 text-gray-400" />
            </div>
            
            <div className="relative">
              <FormField
                label="Пароль"
                type={showPassword ? 'text' : 'password'}
                value={loginData.password}
                onChange={(value) => setLoginData({ ...loginData, password: value })}
                placeholder="Введите пароль"
                required
                error={errors.password}
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
          
          <div className="space-y-4">
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 px-6 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 font-medium"
            >
              Войти
            </button>
            
            <div className="text-center">
              <span className="text-gray-600 dark:text-gray-400">Нет аккаунта? </span>
              <button
                type="button"
                onClick={switchMode}
                className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
              >
                Зарегистрироваться
              </button>
            </div>
          </div>
        </form>
      ) : (
        <form onSubmit={handleRegister} className="space-y-6">
          <div className="grid grid-cols-1 gap-4">
            <FormField
              label="Полное имя"
              value={registerData.fullName}
              onChange={(value) => setRegisterData({ ...registerData, fullName: value })}
              placeholder="Введите полное имя"
              required
              error={errors.fullName}
            />
            
            <FormField
              label="Имя пользователя"
              value={registerData.username}
              onChange={(value) => setRegisterData({ ...registerData, username: value })}
              placeholder="Введите имя пользователя"
              required
              error={errors.username}
            />
            
            <FormField
              label="Email"
              type="email"
              value={registerData.email}
              onChange={(value) => setRegisterData({ ...registerData, email: value })}
              placeholder="Введите email"
              required
              error={errors.email}
            />
            
            <FormField
              label="Телефон"
              type="tel"
              value={registerData.phone}
              onChange={(value) => setRegisterData({ ...registerData, phone: value })}
              placeholder="+996 XXX XXX XXX"
              error={errors.phone}
            />
            
            <div className="relative">
              <FormField
                label="Пароль"
                type={showPassword ? 'text' : 'password'}
                value={registerData.password}
                onChange={(value) => setRegisterData({ ...registerData, password: value })}
                placeholder="Введите пароль"
                required
                error={errors.password}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-9 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            
            <div className="relative">
              <FormField
                label="Подтвердите пароль"
                type={showConfirmPassword ? 'text' : 'password'}
                value={registerData.confirmPassword}
                onChange={(value) => setRegisterData({ ...registerData, confirmPassword: value })}
                placeholder="Повторите пароль"
                required
                error={errors.confirmPassword}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-9 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>
          
          <div className="space-y-4">
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white py-3 px-6 rounded-xl hover:from-green-700 hover:to-green-800 transition-all duration-200 font-medium"
            >
              Зарегистрироваться
            </button>
            
            <div className="text-center">
              <span className="text-gray-600 dark:text-gray-400">Уже есть аккаунт? </span>
              <button
                type="button"
                onClick={switchMode}
                className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
              >
                Войти
              </button>
            </div>
          </div>
        </form>
      )}
    </Modal>
  );
};