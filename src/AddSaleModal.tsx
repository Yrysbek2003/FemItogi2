import React, { useState } from 'react';
import { Modal } from './components/Modal';
import { FormField } from './components/FormField';
import { Sale, Language } from './types';

interface AddSaleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (sale: Omit<Sale, 'id'>) => void;
  language: Language;
}

export const AddSaleModal: React.FC<AddSaleModalProps> = ({
  isOpen,
  onClose,
  onAdd,
  language
}) => {
  const [formData, setFormData] = useState({
    itemName: '',
    quantity: '',
    costPerUnit: '',
    description: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.itemName.trim()) {
      newErrors.itemName = 'Наименование обязательно';
    }
    if (!formData.quantity || Number(formData.quantity) <= 0) {
      newErrors.quantity = 'Количество должно быть больше 0';
    }
    if (!formData.costPerUnit || Number(formData.costPerUnit) <= 0) {
      newErrors.costPerUnit = 'Цена должна быть больше 0';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onAdd({
        itemName: formData.itemName.trim(),
        quantity: Number(formData.quantity),
        costPerUnit: Number(formData.costPerUnit),
        description: formData.description.trim(),
        date: new Date().toISOString().split('T')[0]
      });
      handleClose();
    }
  };

  const handleClose = () => {
    setFormData({
      itemName: '',
      quantity: '',
      costPerUnit: '',
      description: ''
    });
    setErrors({});
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Добавить продажу" size="lg">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <FormField
              label="Наименование товара"
              value={formData.itemName}
              onChange={(value) => setFormData({ ...formData, itemName: value })}
              placeholder="Введите наименование товара"
              required
              error={errors.itemName}
            />
          </div>
          
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
            label="Цена за единицу (сом)"
            type="number"
            value={formData.costPerUnit}
            onChange={(value) => setFormData({ ...formData, costPerUnit: value })}
            placeholder="0"
            required
            error={errors.costPerUnit}
          />
          
          <div className="md:col-span-2">
            <FormField
              label="Описание"
              type="textarea"
              value={formData.description}
              onChange={(value) => setFormData({ ...formData, description: value })}
              placeholder="Дополнительная информация о товаре"
              rows={3}
            />
          </div>
        </div>
        
        {formData.quantity && formData.costPerUnit && (
          <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-xl">
            <p className="text-sm text-green-700 dark:text-green-300">
              <strong>Общая сумма продажи: {(Number(formData.quantity) * Number(formData.costPerUnit)).toLocaleString()} сом</strong>
            </p>
          </div>
        )}
        
        <div className="flex gap-4 pt-4">
          <button
            type="submit"
            className="flex-1 bg-gradient-to-r from-green-600 to-green-700 text-white py-3 px-6 rounded-xl hover:from-green-700 hover:to-green-800 transition-all duration-200 font-medium"
          >
            Добавить продажу
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