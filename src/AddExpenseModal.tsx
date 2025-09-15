import React, { useState } from 'react';
import { Modal } from './components/Modal';
import { FormField } from './components/FormField';
import { Expense, Language } from './types';

interface AddExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (expense: Omit<Expense, 'id'>) => void;
  language: Language;
}

const expenseTypes = [
  { value: 'electricity', label: 'Электричество' },
  { value: 'repair', label: 'Ремонт оборудования' },
  { value: 'rent', label: 'Аренда помещения' },
  { value: 'transport', label: 'Транспортные расходы' },
  { value: 'materials', label: 'Материалы и расходники' },
  { value: 'other', label: 'Прочие расходы' }
];

export const AddExpenseModal: React.FC<AddExpenseModalProps> = ({
  isOpen,
  onClose,
  onAdd,
  language
}) => {
  const [formData, setFormData] = useState({
    type: '',
    description: '',
    amount: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.type) {
      newErrors.type = 'Выберите тип расхода';
    }
    if (!formData.description.trim()) {
      newErrors.description = 'Описание обязательно';
    }
    if (!formData.amount || Number(formData.amount) <= 0) {
      newErrors.amount = 'Сумма должна быть больше 0';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onAdd({
        type: formData.type as Expense['type'],
        description: formData.description.trim(),
        amount: Number(formData.amount),
        date: new Date().toISOString().split('T')[0]
      });
      handleClose();
    }
  };

  const handleClose = () => {
    setFormData({
      type: '',
      description: '',
      amount: ''
    });
    setErrors({});
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Добавить расход" size="lg">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            label="Тип расхода"
            type="select"
            value={formData.type}
            onChange={(value) => setFormData({ ...formData, type: value })}
            options={expenseTypes}
            required
            error={errors.type}
          />
          
          <FormField
            label="Сумма (сом)"
            type="number"
            value={formData.amount}
            onChange={(value) => setFormData({ ...formData, amount: value })}
            placeholder="0"
            required
            error={errors.amount}
          />
          
          <div className="md:col-span-2">
            <FormField
              label="Описание расхода"
              type="textarea"
              value={formData.description}
              onChange={(value) => setFormData({ ...formData, description: value })}
              placeholder="Подробное описание расхода"
              required
              error={errors.description}
              rows={3}
            />
          </div>
        </div>
        
        <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-xl">
          <p className="text-sm text-red-700 dark:text-red-300">
            <strong>Дата расхода:</strong> {new Date().toLocaleDateString('ru-RU')}
          </p>
        </div>
        
        <div className="flex gap-4 pt-4">
          <button
            type="submit"
            className="flex-1 bg-gradient-to-r from-red-600 to-red-700 text-white py-3 px-6 rounded-xl hover:from-red-700 hover:to-red-800 transition-all duration-200 font-medium"
          >
            Добавить расход
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