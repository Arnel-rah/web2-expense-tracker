import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilter } from '@fortawesome/free-solid-svg-icons';

interface Category {
  id: string;
  name: string;
  color: string;
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
  const handleCategoryToggle = (categoryName: string) => {
    const newCategories = selectedCategories.includes(categoryName)
      ? selectedCategories.filter(c => c !== categoryName)
      : [...selectedCategories, categoryName];
    onCategoriesChange(newCategories);
  };

  const selectAllCategories = () => onCategoriesChange(categories.map(c => c.name));
  const clearAllCategories = () => onCategoriesChange([]);

  return (
    <div className="bg-white rounded-2xl shadow-lg p-5 border border-gray-100 h-full">
      <div className="flex items-center justify-between mb-5">
        <div className='flex items-center gap-2'>
          <FontAwesomeIcon icon={faFilter} className="text-gray-700" />
          <h2 className="text-lg font-semibold text-gray-900">Filtres</h2>
        </div>
        <div className="flex gap-2">
          <button
            onClick={selectAllCategories}
            className="px-2 py-1 text-xs bg-blue-50 text-blue-700 rounded hover:bg-blue-100 transition-colors border border-blue-200"
          >
            Tout
          </button>
          <button
            onClick={clearAllCategories}
            className="px-2 py-1 text-xs bg-gray-50 text-gray-700 rounded hover:bg-gray-100 transition-colors border border-gray-200"
          >
            Aucun
          </button>
        </div>
      </div>

      <div className="space-y-5">
        <PeriodFilter
          startDate={startDate}
          endDate={endDate}
          onStartDateChange={onStartDateChange}
          onEndDateChange={onEndDateChange}
        />
        
        <CategoryFilter
          categories={categories}
          selectedCategories={selectedCategories}
          onCategoryToggle={handleCategoryToggle}
        />
      </div>
    </div>
  );
};

// Sous-composants
const PeriodFilter: React.FC<{
  startDate: string;
  endDate: string;
  onStartDateChange: (date: string) => void;
  onEndDateChange: (date: string) => void;
}> = ({ startDate, endDate, onStartDateChange, onEndDateChange }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-2">Période</label>
    <div className="grid grid-cols-2 gap-2">
      <DateInput
        label="Début"
        value={startDate}
        onChange={onStartDateChange}
      />
      <DateInput
        label="Fin"
        value={endDate}
        onChange={onEndDateChange}
        min={startDate}
      />
    </div>
  </div>
);

const DateInput: React.FC<{
  label: string;
  value: string;
  onChange: (value: string) => void;
  min?: string;
}> = ({ label, value, onChange, min }) => (
  <div>
    <label className="block text-xs text-gray-500 mb-1">{label}</label>
    <input
      type="date"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      min={min}
      className="w-full p-2 border border-gray-200 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
    />
  </div>
);

const CategoryFilter: React.FC<{
  categories: Category[];
  selectedCategories: string[];
  onCategoryToggle: (name: string) => void;
}> = ({ categories, selectedCategories, onCategoryToggle }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-2">Catégories</label>
    <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto p-1">
      {categories.map(category => {
        const isSelected = selectedCategories.includes(category.name);
        return (
          <CategoryButton
            key={category.id}
            category={category}
            isSelected={isSelected}
            onToggle={onCategoryToggle}
          />
        );
      })}
    </div>
    <div className="mt-2 p-2 bg-gray-50 rounded-lg">
      <p className="text-xs text-gray-600 text-center">
        {selectedCategories.length === 0
          ? 'Toutes catégories'
          : `${selectedCategories.length} catégorie(s)`
        }
      </p>
    </div>
  </div>
);

const CategoryButton: React.FC<{
  category: Category;
  isSelected: boolean;
  onToggle: (name: string) => void;
}> = ({ category, isSelected, onToggle }) => (
  <button
    onClick={() => onToggle(category.name)}
    className={`p-2 rounded-lg flex items-center justify-center transition-all duration-200 text-sm ${
      isSelected
        ? 'bg-blue-50 border border-blue-200 shadow-sm font-medium'
        : 'bg-gray-50 border border-gray-100 hover:border-gray-200'
    }`}
    style={isSelected ? {
      borderLeft: `3px solid ${category.color}`,
      backgroundColor: `${category.color}10`
    } : {}}
  >
    <span className="truncate">{category.name}</span>
  </button>
);

export default Filters;