import React, { useState } from 'react';
import { Package, AlertTriangle, Plus, Search, Filter, TrendingDown, TrendingUp, BarChart3 } from 'lucide-react';
import { InventoryItem, StockMovement } from '../types';
import { Modal } from './Modal';
import { FormField } from './FormField';
import { DataTable } from './DataTable';

interface InventoryManagerProps {
  inventory: InventoryItem[];
  onAddItem: (item: Omit<InventoryItem, 'id' | 'movements' | 'createdBy' | 'updatedAt'>) => void;
  onUpdateStock: (itemId: string, movement: Omit<StockMovement, 'id' | 'createdBy'>) => void;
  onUpdateItem: (item: InventoryItem) => void;
}

export const InventoryManager: React.FC<InventoryManagerProps> = ({
  inventory,
  onAddItem,
  onUpdateStock,
  onUpdateItem
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showStockModal, setShowStockModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [view, setView] = useState<'list' | 'alerts' | 'movements'>('list');

  const [newItem, setNewItem] = useState({
    name: '',
    category: '',
    currentStock: '',
    minStock: '',
    maxStock: '',
    unit: '',
    costPerUnit: '',
    supplier: '',
    location: '',
    barcode: '',
    description: ''
  });

  const [stockMovement, setStockMovement] = useState({
    type: 'in' as StockMovement['type'],
    quantity: '',
    reason: '',
    reference: ''
  });

  const lowStockItems = inventory.filter(item => item.currentStock <= item.minStock);
  const outOfStockItems = inventory.filter(item => item.currentStock === 0);

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    onAddItem({
      name: newItem.name,
      category: newItem.category,
      currentStock: Number(newItem.currentStock),
      minStock: Number(newItem.minStock),
      maxStock: Number(newItem.maxStock),
      unit: newItem.unit,
      costPerUnit: Number(newItem.costPerUnit),
      supplier: newItem.supplier,
      location: newItem.location,
      barcode: newItem.barcode,
      description: newItem.description,
      lastRestocked: new Date().toISOString(),
      status: Number(newItem.currentStock) === 0 ? 'out_of_stock' : 
             Number(newItem.currentStock) <= Number(newItem.minStock) ? 'low_stock' : 'in_stock'
    });
    setNewItem({
      name: '',
      category: '',
      currentStock: '',
      minStock: '',
      maxStock: '',
      unit: '',
      costPerUnit: '',
      supplier: '',
      location: '',
      barcode: '',
      description: ''
    });
    setShowAddModal(false);
  };

  const handleStockMovement = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedItem) {
      onUpdateStock(selectedItem.id, {
        type: stockMovement.type,
        quantity: Number(stockMovement.quantity),
        reason: stockMovement.reason,
        date: new Date().toISOString(),
        reference: stockMovement.reference
      });
      setStockMovement({
        type: 'in',
        quantity: '',
        reason: '',
        reference: ''
      });
      setShowStockModal(false);
      setSelectedItem(null);
    }
  };

  const getStatusBadge = (status: InventoryItem['status']) => {
    const configs = {
      in_stock: { color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200', label: 'В наличии' },
      low_stock: { color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200', label: 'Мало' },
      out_of_stock: { color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200', label: 'Нет в наличии' },
      discontinued: { color: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200', label: 'Снято' }
    };
    
    const config = configs[status];
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${config.color}`}>
        {config.label}
      </span>
    );
  };

  const inventoryColumns = [
    { key: 'name', label: 'Наименование', sortable: true },
    { key: 'category', label: 'Категория' },
    { 
      key: 'currentStock', 
      label: 'Остаток', 
      sortable: true,
      render: (value: number, row: InventoryItem) => (
        <span className={value <= row.minStock ? 'text-red-600 font-semibold' : ''}>
          {value} {row.unit}
        </span>
      )
    },
    { 
      key: 'minStock', 
      label: 'Мин. остаток',
      render: (value: number, row: InventoryItem) => `${value} ${row.unit}`
    },
    { key: 'location', label: 'Местоположение' },
    { 
      key: 'status', 
      label: 'Статус',
      render: (value: InventoryItem['status']) => getStatusBadge(value)
    },
    { 
      key: 'costPerUnit', 
      label: 'Цена за ед.',
      render: (value: number) => `${value.toLocaleString()} сом`
    }
  ];

  const alertColumns = [
    { key: 'name', label: 'Товар', sortable: true },
    { 
      key: 'currentStock', 
      label: 'Текущий остаток',
      render: (value: number, row: InventoryItem) => (
        <span className="text-red-600 font-semibold">
          {value} {row.unit}
        </span>
      )
    },
    { 
      key: 'minStock', 
      label: 'Минимум',
      render: (value: number, row: InventoryItem) => `${value} ${row.unit}`
    },
    { key: 'location', label: 'Местоположение' },
    { 
      key: 'status', 
      label: 'Статус',
      render: (value: InventoryItem['status']) => getStatusBadge(value)
    }
  ];

  const renderContent = () => {
    switch (view) {
      case 'alerts':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-red-50 dark:bg-red-900/20 p-6 rounded-2xl">
                <div className="flex items-center gap-3 mb-4">
                  <AlertTriangle className="w-6 h-6 text-red-600" />
                  <h3 className="text-lg font-semibold text-red-900 dark:text-red-100">
                    Критически низкие остатки
                  </h3>
                </div>
                <p className="text-3xl font-bold text-red-600 mb-2">{lowStockItems.length}</p>
                <p className="text-sm text-red-700 dark:text-red-300">товаров требуют пополнения</p>
              </div>
              
              <div className="bg-orange-50 dark:bg-orange-900/20 p-6 rounded-2xl">
                <div className="flex items-center gap-3 mb-4">
                  <Package className="w-6 h-6 text-orange-600" />
                  <h3 className="text-lg font-semibold text-orange-900 dark:text-orange-100">
                    Нет в наличии
                  </h3>
                </div>
                <p className="text-3xl font-bold text-orange-600 mb-2">{outOfStockItems.length}</p>
                <p className="text-sm text-orange-700 dark:text-orange-300">товаров закончились</p>
              </div>
            </div>
            
            <DataTable
              data={lowStockItems}
              columns={alertColumns}
              searchPlaceholder="Поиск товаров с низкими остатками..."
              onEdit={(item) => {
                setSelectedItem(item);
                setShowStockModal(true);
              }}
            />
          </div>
        );
        
      case 'movements':
        const allMovements = inventory.flatMap(item => 
          item.movements.map(movement => ({
            ...movement,
            itemName: item.name,
            itemId: item.id
          }))
        ).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        
        const movementColumns = [
          { key: 'itemName', label: 'Товар', sortable: true },
          { 
            key: 'type', 
            label: 'Тип',
            render: (value: string) => {
              const types = {
                in: { icon: TrendingUp, color: 'text-green-600', label: 'Поступление' },
                out: { icon: TrendingDown, color: 'text-red-600', label: 'Расход' },
                adjustment: { icon: BarChart3, color: 'text-blue-600', label: 'Корректировка' },
                transfer: { icon: Package, color: 'text-purple-600', label: 'Перемещение' }
              };
              const config = types[value as keyof typeof types];
              const Icon = config.icon;
              return (
                <div className={`flex items-center gap-2 ${config.color}`}>
                  <Icon className="w-4 h-4" />
                  {config.label}
                </div>
              );
            }
          },
          { 
            key: 'quantity', 
            label: 'Количество',
            render: (value: number, row: any) => (
              <span className={row.type === 'in' ? 'text-green-600' : 'text-red-600'}>
                {row.type === 'in' ? '+' : '-'}{value}
              </span>
            )
          },
          { key: 'reason', label: 'Причина' },
          { key: 'date', label: 'Дата', sortable: true },
          { key: 'reference', label: 'Ссылка' }
        ];
        
        return (
          <DataTable
            data={allMovements}
            columns={movementColumns}
            searchPlaceholder="Поиск движений товаров..."
            actions={false}
          />
        );
        
      default:
        return (
          <DataTable
            data={inventory}
            columns={inventoryColumns}
            searchPlaceholder="Поиск товаров..."
            onEdit={(item) => {
              setSelectedItem(item);
              setShowStockModal(true);
            }}
          />
        );
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
          Управление складом
        </h2>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200"
        >
          <Plus className="w-5 h-5" />
          Добавить товар
        </button>
      </div>

      {/* View Tabs */}
      <div className="flex gap-2 p-1 bg-gray-100 dark:bg-gray-800 rounded-xl">
        {[
          { id: 'list', label: 'Все товары', icon: Package },
          { id: 'alerts', label: 'Уведомления', icon: AlertTriangle },
          { id: 'movements', label: 'Движения', icon: BarChart3 }
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setView(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                view === tab.id
                  ? 'bg-white dark:bg-gray-700 text-blue-600 shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
              {tab.id === 'alerts' && lowStockItems.length > 0 && (
                <span className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {lowStockItems.length}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {renderContent()}

      {/* Add Item Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Добавить товар на склад"
        size="xl"
      >
        <form onSubmit={handleAddItem} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              label="Наименование товара"
              value={newItem.name}
              onChange={(value) => setNewItem({ ...newItem, name: value })}
              required
            />
            
            <FormField
              label="Категория"
              type="select"
              value={newItem.category}
              onChange={(value) => setNewItem({ ...newItem, category: value })}
              options={[
                { value: 'fabric', label: 'Ткань' },
                { value: 'accessories', label: 'Фурнитура' },
                { value: 'equipment', label: 'Оборудование' },
                { value: 'materials', label: 'Материалы' }
              ]}
              required
            />
            
            <FormField
              label="Текущий остаток"
              type="number"
              value={newItem.currentStock}
              onChange={(value) => setNewItem({ ...newItem, currentStock: value })}
              required
            />
            
            <FormField
              label="Единица измерения"
              value={newItem.unit}
              onChange={(value) => setNewItem({ ...newItem, unit: value })}
              placeholder="шт, м, кг"
              required
            />
            
            <FormField
              label="Минимальный остаток"
              type="number"
              value={newItem.minStock}
              onChange={(value) => setNewItem({ ...newItem, minStock: value })}
              required
            />
            
            <FormField
              label="Максимальный остаток"
              type="number"
              value={newItem.maxStock}
              onChange={(value) => setNewItem({ ...newItem, maxStock: value })}
              required
            />
            
            <FormField
              label="Цена за единицу"
              type="number"
              value={newItem.costPerUnit}
              onChange={(value) => setNewItem({ ...newItem, costPerUnit: value })}
              required
            />
            
            <FormField
              label="Местоположение"
              value={newItem.location}
              onChange={(value) => setNewItem({ ...newItem, location: value })}
              placeholder="Склад А, Полка 1"
              required
            />
            
            <FormField
              label="Поставщик"
              value={newItem.supplier}
              onChange={(value) => setNewItem({ ...newItem, supplier: value })}
            />
            
            <FormField
              label="Штрих-код"
              value={newItem.barcode}
              onChange={(value) => setNewItem({ ...newItem, barcode: value })}
            />
            
            <div className="md:col-span-2">
              <FormField
                label="Описание"
                type="textarea"
                value={newItem.description}
                onChange={(value) => setNewItem({ ...newItem, description: value })}
                rows={3}
              />
            </div>
          </div>
          
          <div className="flex gap-4">
            <button
              type="submit"
              className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 px-6 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200"
            >
              Добавить товар
            </button>
            <button
              type="button"
              onClick={() => setShowAddModal(false)}
              className="flex-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 py-3 px-6 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              Отмена
            </button>
          </div>
        </form>
      </Modal>

      {/* Stock Movement Modal */}
      <Modal
        isOpen={showStockModal}
        onClose={() => {
          setShowStockModal(false);
          setSelectedItem(null);
        }}
        title={`Движение товара: ${selectedItem?.name}`}
        size="lg"
      >
        <form onSubmit={handleStockMovement} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              label="Тип операции"
              type="select"
              value={stockMovement.type}
              onChange={(value) => setStockMovement({ ...stockMovement, type: value as StockMovement['type'] })}
              options={[
                { value: 'in', label: 'Поступление' },
                { value: 'out', label: 'Расход' },
                { value: 'adjustment', label: 'Корректировка' },
                { value: 'transfer', label: 'Перемещение' }
              ]}
              required
            />
            
            <FormField
              label="Количество"
              type="number"
              value={stockMovement.quantity}
              onChange={(value) => setStockMovement({ ...stockMovement, quantity: value })}
              required
            />
            
            <div className="md:col-span-2">
              <FormField
                label="Причина"
                value={stockMovement.reason}
                onChange={(value) => setStockMovement({ ...stockMovement, reason: value })}
                placeholder="Причина движения товара"
                required
              />
            </div>
            
            <div className="md:col-span-2">
              <FormField
                label="Ссылка/Номер документа"
                value={stockMovement.reference}
                onChange={(value) => setStockMovement({ ...stockMovement, reference: value })}
                placeholder="Номер накладной, заказа и т.д."
              />
            </div>
          </div>
          
          {selectedItem && (
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-xl">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Текущий остаток: <span className="font-semibold">{selectedItem.currentStock} {selectedItem.unit}</span>
              </p>
              {stockMovement.quantity && (
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  После операции: <span className="font-semibold">
                    {stockMovement.type === 'in' || stockMovement.type === 'adjustment' 
                      ? selectedItem.currentStock + Number(stockMovement.quantity)
                      : selectedItem.currentStock - Number(stockMovement.quantity)
                    } {selectedItem.unit}
                  </span>
                </p>
              )}
            </div>
          )}
          
          <div className="flex gap-4">
            <button
              type="submit"
              className="flex-1 bg-gradient-to-r from-green-600 to-green-700 text-white py-3 px-6 rounded-xl hover:from-green-700 hover:to-green-800 transition-all duration-200"
            >
              Выполнить операцию
            </button>
            <button
              type="button"
              onClick={() => {
                setShowStockModal(false);
                setSelectedItem(null);
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