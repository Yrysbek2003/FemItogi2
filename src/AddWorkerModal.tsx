import React, { useState } from 'react';
import { Modal } from './components/Modal';
import { FormField } from './components/FormField';
import { Worker, Language } from './types';

interface AddWorkerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (worker: Omit<Worker, 'id'>) => void;
  language: Language;
}

const roles = [
  { value: 'cutter', label: 'Кройщик' },
  { value: 'seamstress', label: 'Швея' },
  { value: 'ironer', label: 'Утюжильщик' },
  { value: 'packer', label: 'Упаковщик' },
  { value: 'manager', label: 'Менеджер' },
  { value: 'designer', label: 'Дизайнер' },
  { value: 'quality_control', label: 'Контроль качества' }
];

export const AddWorkerModal: React.FC<AddWorkerModalProps> = ({
  isOpen,
  onClose,
  onAdd,
  language
}) => {
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    phone: '',
    status: 'active'
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Имя сотрудника обязательно';
    }
    if (!formData.role) {
      newErrors.role = 'Выберите должность';
    }
    if (formData.phone && !/^\+996\s?\d{3}\s?\d{3}\s?\d{3}$/.test(formData.phone.replace(/\s/g, ''))) {
      newErrors.phone = 'Неверный формат телефона (+996 XXX XXX XXX)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onAdd({
        name: formData.name.trim(),
        role: formData.role,
        phone: formData.phone.trim(),
        hireDate: new Date().toISOString().split('T')[0],
        status: formData.status as 'active' | 'inactive'
      });
      handleClose();
    }
  };

  const handleClose = () => {
    setFormData({
      name: '',
      role: '',
      phone: '',
      status: 'active'
    });
    setErrors({});
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Добавить сотрудника" size="lg">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <FormField
              label="Полное имя сотрудника"
              value={formData.name}
              onChange={(value) => setFormData({ ...formData, name: value })}
              placeholder="Введите полное имя сотрудника"
              required
              error={errors.name}
            />
          </div>
          
          <FormField
            label="Должность"
            type="select"
            value={formData.role}
            onChange={(value) => setFormData({ ...formData, role: value })}
            options={roles}
            required
            error={errors.role}
          />
          
          <FormField
            label="Статус"
            type="select"
            value={formData.status}
            onChange={(value) => setFormData({ ...formData, status: value })}
            options={[
              { value: 'active', label: 'Активен' },
              { value: 'inactive', label: 'Неактивен' }
            ]}
            required
          />
          
          <div className="md:col-span-2">
            <FormField
              label="Номер телефона"
              type="tel"
              value={formData.phone}
              onChange={(value) => setFormData({ ...formData, phone: value })}
              placeholder="+996 XXX XXX XXX"
              error={errors.phone}
            />
          </div>
        </div>
        
        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl">
          <p className="text-sm text-blue-700 dark:text-blue-300">
            <strong>Дата найма:</strong> {new Date().toLocaleDateString('ru-RU')}
          </p>
        </div>
        
        <div className="flex gap-4 pt-4">
          <button
            type="submit"
            className="flex-1 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white py-3 px-6 rounded-xl hover:from-indigo-700 hover:to-indigo-800 transition-all duration-200 font-medium"
          >
            Добавить сотрудника
          </button>
          <button
            type="button"
            onClick={handleClose}
            className="flex-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 py-3 px-6 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors font-medium"
          >
            Отмена
          </button>
        </div>
      </form>
    </Modal>
  );
};