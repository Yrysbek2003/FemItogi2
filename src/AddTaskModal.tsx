import React, { useState } from 'react';
import { Modal } from './components/Modal';
import { FormField } from './components/FormField';
import { Task, Worker, Language } from './types';

interface AddTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (task: Omit<Task, 'id'>) => void;
  workers: Worker[];
  language: Language;
}

const clothingTypes = [
  { value: 'shirt', label: 'Рубашка' },
  { value: 'dress', label: 'Платье' },
  { value: 'pants', label: 'Брюки' },
  { value: 'jacket', label: 'Куртка' },
  { value: 'skirt', label: 'Юбка' },
  { value: 'coat', label: 'Пальто' },
  { value: 'blouse', label: 'Блузка' },
  { value: 'suit', label: 'Костюм' }
];

const partTypes = [
  { value: 'cutting', label: 'Крой' },
  { value: 'sewing', label: 'Пошив' },
  { value: 'finishing', label: 'Отделка' },
  { value: 'ironing', label: 'Глажка' },
  { value: 'packaging', label: 'Упаковка' },
  { value: 'quality_check', label: 'Контроль качества' }
];

const priorities = [
  { value: 'low', label: 'Низкий' },
  { value: 'medium', label: 'Средний' },
  { value: 'high', label: 'Высокий' }
];

export const AddTaskModal: React.FC<AddTaskModalProps> = ({
  isOpen,
  onClose,
  onAdd,
  workers,
  language
}) => {
  const [formData, setFormData] = useState({
    workerId: '',
    clothingType: '',
    partType: '',
    quantity: '',
    ratePerUnit: '',
    priority: 'medium',
    deadline: '',
    comment: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.workerId) {
      newErrors.workerId = 'Выберите сотрудника';
    }
    if (!formData.clothingType) {
      newErrors.clothingType = 'Выберите тип одежды';
    }
    if (!formData.partType) {
      newErrors.partType = 'Выберите тип работы';
    }
    if (!formData.quantity || Number(formData.quantity) <= 0) {
      newErrors.quantity = 'Количество должно быть больше 0';
    }
    if (!formData.ratePerUnit || Number(formData.ratePerUnit) <= 0) {
      newErrors.ratePerUnit = 'Ставка должна быть больше 0';
    }
    if (formData.deadline && new Date(formData.deadline) < new Date()) {
      newErrors.deadline = 'Дедлайн не может быть в прошлом';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onAdd({
        workerId: formData.workerId,
        clothingType: formData.clothingType,
        partType: formData.partType,
        quantity: Number(formData.quantity),
        ratePerUnit: Number(formData.ratePerUnit),
        priority: formData.priority as Task['priority'],
        status: 'pending',
        deadline: formData.deadline,
        comment: formData.comment.trim(),
        date: new Date().toISOString().split('T')[0]
      });
      handleClose();
    }
  };

  const handleClose = () => {
    setFormData({
      workerId: '',
      clothingType: '',
      partType: '',
      quantity: '',
      ratePerUnit: '',
      priority: 'medium',
      deadline: '',
      comment: ''
    });
    setErrors({});
    onClose();
  };

  const activeWorkers = workers.filter(w => w.status === 'active');
  const totalAmount = formData.quantity && formData.ratePerUnit 
    ? Number(formData.quantity) * Number(formData.ratePerUnit) 
    : 0;

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Добавить задачу" size="xl">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            label="Сотрудник"
            type="select"
            value={formData.workerId}
            onChange={(value) => setFormData({ ...formData, workerId: value })}
            options={activeWorkers.map(w => ({ value: w.id, label: `${w.name} (${w.role})` }))}
            required
            error={errors.workerId}
          />
          
          <FormField
            label="Приоритет"
            type="select"
            value={formData.priority}
            onChange={(value) => setFormData({ ...formData, priority: value })}
            options={priorities}
            required
          />
          
          <FormField
            label="Тип одежды"
            type="select"
            value={formData.clothingType}
            onChange={(value) => setFormData({ ...formData, clothingType: value })}
            options={clothingTypes}
            required
            error={errors.clothingType}
          />
          
          <FormField
            label="Тип работы"
            type="select"
            value={formData.partType}
            onChange={(value) => setFormData({ ...formData, partType: value })}
            options={partTypes}
            required
            error={errors.partType}
          />
          
          <FormField
            label="Количество"
            type="number"
            value={formData.quantity}
            onChange={(value) => setFormData({ ...formData, quantity: value })}
            placeholder="0"
            required
            error={errors.quantity}
          />
          
          <FormField
            label="Ставка за единицу (сом)"
            type="number"
            value={formData.ratePerUnit}
            onChange={(value) => setFormData({ ...formData, ratePerUnit: value })}
            placeholder="0"
            required
            error={errors.ratePerUnit}
          />
          
          <FormField
            label="Дедлайн"
            type="date"
            value={formData.deadline}
            onChange={(value) => setFormData({ ...formData, deadline: value })}
            error={errors.deadline}
          />
          
          <div className="md:col-span-2">
            <FormField
              label="Комментарий"
              type="textarea"
              value={formData.comment}
              onChange={(value) => setFormData({ ...formData, comment: value })}
              placeholder="Дополнительная информация о задаче"
              rows={3}
            />
          </div>
        </div>
        
        {totalAmount > 0 && (
          <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-xl">
            <p className="text-sm text-orange-700 dark:text-orange-300">
              <strong>Общая стоимость задачи: {totalAmount.toLocaleString()} сом</strong>
            </p>
          </div>
        )}
        
        <div className="flex gap-4 pt-4">
          <button
            type="submit"
            className="flex-1 bg-gradient-to-r from-orange-600 to-orange-700 text-white py-3 px-6 rounded-xl hover:from-orange-700 hover:to-orange-800 transition-all duration-200 font-medium"
          >
            Добавить задачу
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