import React from 'react';

interface FiltersProps {
  selectedMonth: string;
  onMonthChange: (month: string) => void;
  selectedCategories: string[];
  onCategoriesChange: (categories: string[]) => void;
  expenses: any[];
}

const Filters: React.FC<FiltersProps> = ({
  selectedMonth,
  onMonthChange,
  selectedCategories,
  onCategoriesChange,
  expenses
}) => {
  const categories = Array.from(new Set(expenses.map(expense => expense.category))).sort();

  const handleCategoryToggle = (category: string) => {
    const newCategories = selectedCategories.includes(category)
      ? selectedCategories.filter(c => c !== category)
      : [...selectedCategories, category];
    onCategoriesChange(newCategories);
  };

  const selectAllCategories = () => onCategoriesChange([]);
  const clearAllCategories = () => onCategoriesChange([]);

  return (
    <div className="bg-white shadow rounded-lg p-6 mb-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Filtres</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Filtre par mois */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            📅 Période
          </label>
          <input
            type="month"
            value={selectedMonth}
            onChange={(e) => onMonthChange(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            max={new Date().toISOString().slice(0, 7)}
          />
          <p className="mt-2 text-sm text-gray-500">
            Sélectionnez le mois à analyser
          </p>
        </div>

        {/* Filtre par catégorie */}
        <div>
          <div className="flex justify-between items-center mb-3">
            <label className="block text-sm font-medium text-gray-700">
              🏷️ Catégories
            </label>
            <div className="flex space-x-2">
              <button
                onClick={selectAllCategories}
                className="text-xs text-blue-600 hover:text-blue-800"
              >
                Tout
              </button>
              <button
                onClick={clearAllCategories}
                className="text-xs text-gray-600 hover:text-gray-800"
              >
                Aucun
              </button>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto p-2 bg-gray-50 rounded-lg">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => handleCategoryToggle(category)}
                className={`px-3 py-2 rounded-full text-sm transition-all ${
                  selectedCategories.length === 0 || selectedCategories.includes(category)
                    ? 'bg-blue-100 text-blue-800 border border-blue-300'
                    : 'bg-gray-200 text-gray-600 border border-gray-300'
                } hover:shadow-md`}
              >
                {category}
                {selectedCategories.includes(category) && (
                  <span className="ml-1">✓</span>
                )}
              </button>
            ))}
          </div>
          
          <p className="mt-2 text-sm text-gray-500">
            {selectedCategories.length === 0 
              ? 'Toutes les catégories sélectionnées'
              : `${selectedCategories.length} catégorie(s) sélectionnée(s)`
            }
          </p>
        </div>
      </div>
    </div>
  );
};

export default Filters;