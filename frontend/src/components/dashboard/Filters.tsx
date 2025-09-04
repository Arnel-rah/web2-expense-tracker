import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilter } from '@fortawesome/free-solid-svg-icons';

interface Category {
  id: number;
  name: string;
  user_id: number;
  created_at?: string;
  color?: string;
}

interface FiltersProps {
  startDate: string;
  endDate: string;
  onStartDateChange: (date: string) => void;
  onEndDateChange: (date: string) => void;
  selectedCategories: string[];
  onCategoriesChange: (categories: string[]) => void;
  categories: Category[];
}

const Filters: React.FC<FiltersProps> = ({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  selectedCategories,
  onCategoriesChange,
  categories
}) => {
  const [allSelected, setAllSelected] = useState(true);

  const handleCategoryToggle = (categoryName: string) => {
    const newCategories = selectedCategories.includes(categoryName)
      ? selectedCategories.filter(c => c !== categoryName)
      : [...selectedCategories, categoryName];
    onCategoriesChange(newCategories);
    setAllSelected(newCategories.length === categories.length);
  };

  const handleToggleAllCategories = () => {
    if (allSelected) {
      onCategoriesChange([]);
      setAllSelected(false);
    } else {
      onCategoriesChange(categories.map(c => c.name));
      setAllSelected(true);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-5 border border-gray-100 h-full">
      <div className="flex items-center justify-between mb-5">
        <div className='flex items-center gap-2'>
          <FontAwesomeIcon icon={faFilter} className="text-gray-700" />
          <h2 className="text-lg font-semibold text-gray-900">Filtres</h2>
        </div>
        <button 
          onClick={handleToggleAllCategories}
          className="px-3 py-1 text-xs bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors border border-blue-200 font-medium"
        >
          {allSelected ? 'Aucun' : 'Tout'}
        </button>
      </div>
      
      <div className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Période</label>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-gray-500 mb-1 font-medium">Début</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => onStartDateChange(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm shadow-sm"
                data-testid="start-date-input"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1 font-medium">Fin</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => onEndDateChange(e.target.value)}
                min={startDate}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm shadow-sm"
                data-testid="end-date-input"
              />
            </div>
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Catégories</label>
          <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto p-1">
            {categories.map(category => {
              const isSelected = selectedCategories.includes(category.name);
              return (
                <button
                  key={category.id}
                  onClick={() => handleCategoryToggle(category.name)}
                  className={`p-2 rounded-lg flex items-center justify-center transition-all duration-200 text-sm font-medium ${
                    isSelected ? 'shadow-sm' : 'bg-gray-50 border-gray-200 hover:border-gray-300 hover:bg-gray-100'
                  }`}
                  style={isSelected ? {
                    borderLeft: `4px solid ${category.color || '#3b82f6'}`,
                    backgroundColor: `${category.color || '#3b82f6'}15`
                  } : {}}
                  aria-pressed={isSelected}
                >
                  <span className="truncate">{category.name}</span>
                </button>
              );
            })}
          </div>
          <div className="mt-3 p-2 bg-gray-50 rounded-lg border border-gray-200">
            <p className="text-xs text-gray-600 text-center font-medium">
              {selectedCategories.length === 0 ? 'Toutes catégories' : `${selectedCategories.length} catégorie(s) sélectionnée(s)`}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Filters;