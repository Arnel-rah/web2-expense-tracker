import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { InputField } from '../ui/InputField';

const STORAGE_KEY = 'expense-tracker-data';

type Category = {
  id: string;
  name: string;
};

type Transaction = {
  id: string;
  amount: number;
  date: string;
  categoryId: string;
  description: string;
  type: 'expense' | 'income';
  expenseType: 'one-time' | 'recurring';
  startDate?: string;
  endDate?: string;
  createdAt: string;
};

const today = new Date().toISOString().split('T')[0];

export default function ExpenseForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(!!id);
  const [categories, setCategories] = useState<Category[]>([]);
  const [newCategory, setNewCategory] = useState('');

  const initialFormData = {
    amount: 0,
    date: today,
    startDate: today,
    categoryId: '',
    description: '',
    type: 'expense' as const,
    expenseType: 'one-time' as const
  };

  const [formData, setFormData] = useState<Omit<Transaction, 'id' | 'createdAt'> & { id?: string }>(initialFormData);

  useEffect(() => {
    const loadData = () => {
      const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
      setCategories(data.categories || []);

      if (id && data.transactions) {
        const transactionToEdit = data.transactions.find((t: Transaction) => t.id === id);
        transactionToEdit
          ? setFormData({ ...transactionToEdit, amount: transactionToEdit.amount })
          : toast.error('Transaction not found') && navigate('/expenses');
      } else if (!id) {
        setFormData(prev => ({ ...prev, categoryId: data.categories?.[0]?.id || '' }));
      }
      setIsLoading(false);
    };

    loadData();
  }, [id, navigate]);

  const addCategory = () => {
    if (!newCategory.trim()) return toast.error('Category name cannot be empty');

    const newCat = { id: Date.now().toString(), name: newCategory.trim() };
    const updatedCategories = [...categories, newCat];

    setCategories(updatedCategories);
    setNewCategory('');
    setFormData(prev => ({ ...prev, categoryId: newCat.id }));

    const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...data, categories: updatedCategories }));
    toast.success('Category added');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.amount <= 0) return toast.error('Amount must be greater than 0');
    if (!formData.description.trim()) return toast.error('Description is required');
    if (!formData.categoryId) return toast.error('Please select a category');
    if (formData.type === 'expense' && formData.expenseType === 'recurring' && !formData.startDate) {
      return toast.error('Start date is required for recurring expenses');
    }

    setIsLoading(true);

    try {
      const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
      const now = new Date().toISOString();
      const transaction = { ...formData, [id ? 'updatedAt' : 'id']: id ? now : Date.now().toString() };

      const updatedTransactions = id
        ? data.transactions.map((t: Transaction) => t.id === id ? transaction : t)
        : [...(data.transactions || []), { ...transaction, createdAt: now }];

      localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...data, transactions: updatedTransactions }));
      toast.success(`Transaction ${id ? 'updated' : 'added'}!`);
      navigate('/expenses');
    } catch (error) {
      toast.error('Failed to save transaction');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? (value === '' ? 0 : parseFloat(value) || 0) : value
    }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: checked ? 'recurring' : 'one-time',
      ...(name === 'expenseType' && checked && { startDate: prev.startDate || today })
    }));
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        {id ? 'Edit Transaction' : 'Add New Transaction'}
      </h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex space-x-4">
          {(['expense', 'income'] as const).map((type) => (
            <div key={type} className="flex items-center">
              <input
                id={type}
                type="radio"
                name="type"
                checked={formData.type === type}
                onChange={() => setFormData(prev => ({
                  ...prev,
                  type,
                  ...(type === 'income' && { expenseType: 'one-time' })
                }))}
                className={`h-4 w-4 ${type === 'income' ? 'text-green-600 focus:ring-green-500' : 'text-red-600 focus:ring-red-500'}`}
              />
              <label htmlFor={type} className="ml-2 block text-sm text-gray-900">
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </label>
            </div>
          ))}
        </div>

        <InputField
          label={`Amount (${formData.type === 'expense' ? '-' : '+'}$)`}
          name="amount"
          type="number"
          value={formData.amount === 0 ? '' : formData.amount}
          onChange={handleInputChange}
          step="0.01"
          min="0"
          placeholder="0.00"
          required
        />

        <InputField
          label="Date"
          name="date"
          type="date"
          value={formData.date}
          onChange={handleInputChange}
          required
        />

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
          <div className="flex gap-2">
            <select
              name="categoryId"
              value={formData.categoryId}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              required
            >
              <option value="">Select a category</option>
              {categories.map(category => (
                <option key={category.id} value={category.id}>{category.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <InputField
            name="newCategory"
            type="text"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            placeholder="New category name"
            className='w-full'
          />
          <button
            type="button"
            onClick={addCategory}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
          >
            Add
          </button>
        </div>

        <InputField
          label="Description"
          name="description"
          type="text"
          value={formData.description}
          onChange={handleInputChange}
          placeholder="Enter description"
          required
        />

        {formData.type === 'expense' && (
          <>
            <div className="flex items-center">
              <input
                id="recurring"
                type="checkbox"
                name="expenseType"
                checked={formData.expenseType === 'recurring'}
                onChange={handleCheckboxChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="recurring" className="ml-2 block text-sm text-gray-900">
                Recurring Expense
              </label>
            </div>

            {formData.expenseType === 'recurring' && (
              <div className="space-y-4 pl-4 border-l-2 border-blue-200">
                <InputField
                  label="Start Date"
                  name="startDate"
                  type="date"
                  value={formData.startDate || ''}
                  onChange={handleInputChange}
                  required
                />
                <InputField
                  label="End Date (optional)"
                  name="endDate"
                  type="date"
                  value={formData.endDate || ''}
                  onChange={handleInputChange}
                  min={formData.startDate || formData.date}
                />
              </div>
            )}
          </>
        )}

        <div className="flex justify-end space-x-3 pt-4">
          <Link to="/expenses" className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isLoading}
            className={`px-4 py-2 text-white rounded-lg hover:opacity-90 ${formData.type === 'income' ? 'bg-green-600' : 'bg-red-600'}`}
          >
            {isLoading ? 'Saving...' : (id ? 'Update' : 'Add')} {formData.type}
          </button>
        </div>
      </form>
    </div>
  );
}
