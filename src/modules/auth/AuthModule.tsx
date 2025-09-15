import React, { useState, useEffect } from 'react';
import { User, Language, Theme } from '../../types';
import { AuthModal } from '../../components/AuthModal';
import { UserMenu } from '../../components/UserMenu';
import { NotificationCenter } from '../../components/NotificationCenter';
import { Sun, Moon, Globe } from 'lucide-react';
import toast from 'react-hot-toast';

interface AuthModuleProps {
  isAuthenticated: boolean;
  currentUser: User | null;
  theme: Theme;
  language: Language;
  onLogin: (username: string, password: string) => void;
  onRegister: (userData: any) => void;
  onLogout: () => void;
  onThemeChange: (theme: Theme) => void;
  onLanguageChange: (language: Language) => void;
}

export const AuthModule: React.FC<AuthModuleProps> = ({
  isAuthenticated,
  currentUser,
  theme,
  language,
  onLogin,
  onRegister,
  onLogout,
  onThemeChange,
  onLanguageChange
}) => {
  const [showAuthModal, setShowAuthModal] = useState(false);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="mb-8">
            <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <span className="text-3xl font-bold text-white">ШБ</span>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
              Швейный Бухгалтер
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              Система управления швейным производством
            </p>
          </div>
          
          <div className="space-y-4">
            <button
              onClick={() => setShowAuthModal(true)}
              className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-4 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 font-medium text-lg shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              Войти в систему
            </button>
            
            <div className="flex items-center justify-center gap-4 mt-6">
              <button
                onClick={() => onThemeChange(theme === 'light' ? 'dark' : 'light')}
                className="p-3 rounded-xl text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-white/50 dark:hover:bg-gray-800/50 transition-all duration-200"
              >
                {theme === 'light' ? <Moon className="w-6 h-6" /> : <Sun className="w-6 h-6" />}
              </button>
              
              <button
                onClick={() => onLanguageChange(language === 'ru' ? 'ky' : 'ru')}
                className="p-3 rounded-xl text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-white/50 dark:hover:bg-gray-800/50 transition-all duration-200"
              >
                <Globe className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>

        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          onLogin={onLogin}
          onRegister={onRegister}
          language={language}
        />
      </div>
    );
  }

  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
              <span className="text-lg font-bold text-white">ШБ</span>
            </div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">
              Швейный Бухгалтер
            </h1>
          </div>
          
          <div className="flex items-center gap-4">
            <button
              onClick={() => onThemeChange(theme === 'light' ? 'dark' : 'light')}
              className="p-2 rounded-lg text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            </button>
            
            <button
              onClick={() => onLanguageChange(language === 'ru' ? 'ky' : 'ru')}
              className="p-2 rounded-lg text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <Globe className="w-5 h-5" />
            </button>
            
            <NotificationCenter
              notifications={[]}
              onMarkAsRead={() => {}}
              onMarkAllAsRead={() => {}}
              onDelete={() => {}}
            />
            
            <UserMenu
              user={currentUser!}
              onLogout={onLogout}
            />
          </div>
        </div>
      </div>
    </header>
  );
};