import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilter } from '@fortawesome/free-solid-svg-icons';
import type { FiltersProps } from '../../../types/';

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

  const handleCategoryToggle = (categorId: number) => {
    const newCategories = selectedCategories.includes(categorId)
      ? selectedCategories.filter(c => c !== categorId)
      : [...selectedCategories, categorId];
    onCategoriesChange(newCategories);
    setAllSelected(newCategories.length === categories.length);
  };

  const handleToggleAllCategories = () => {
    if (allSelected) {
      onCategoriesChange([]);
      setAllSelected(false);
    } else {
      onCategoriesChange(categories.map(c => c.category_id));
      setAllSelected(true);
    }
  };

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-white/20 h-full hover:shadow-2xl transition-all duration-300">
      <div className="flex items-center justify-between mb-6">
        <div className='flex items-center gap-2'>
          <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg">
            <FontAwesomeIcon icon={faFilter} className="text-white text-sm" />
          </div>
          <h2 className="text-xl font-bold text-gray-900">Filtres</h2>
        </div>
        <button 
          onClick={handleToggleAllCategories}
          className="px-4 py-2 text-xs bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700 rounded-xl hover:from-blue-100 hover:to-purple-100 transition-all duration-200 border border-blue-200 font-semibold shadow-sm hover:shadow-md"
        >
          {allSelected ? 'Aucun' : 'Tout'}
        </button>
      </div>
      
      <div className="space-y-6">
        <div>
          <label className="text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
            <div className="w-2 h-2 bg-gradient-to-r from-green-400 to-blue-500 rounded-full"></div>
            Période
          </label>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-gray-600 mb-2 font-semibold">Début</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => onStartDateChange(e.target.value)}
                className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm shadow-sm hover:shadow-md transition-all duration-200 bg-gray-50 focus:bg-white"
                data-testid="start-date-input"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-600 mb-2 font-semibold">Fin</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => onEndDateChange(e.target.value)}
                min={startDate}
                className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm shadow-sm hover:shadow-md transition-all duration-200 bg-gray-50 focus:bg-white"
                data-testid="end-date-input"
              />
            </div>
          </div>
        </div>
        
        <div>
          <label className="text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
            <div className="w-2 h-2 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full"></div>
            Catégories
          </label>
          <div className="grid grid-cols-2 gap-3 max-h-52 overflow-y-auto p-2 bg-gray-50/50 rounded-xl">
            {categories.map(category => {
              const isSelected = selectedCategories.includes(category.category_id);
              return (
                <button
                  key={category.category_id}
                  onClick={() => handleCategoryToggle(category.category_id)}
                  className={`p-2 rounded-lg flex items-center justify-center transition-all duration-200 text-sm font-medium ${
                    isSelected ? 'shadow-md transform scale-105' : 'bg-white border border-gray-200 hover:border-gray-300 hover:bg-gray-100 hover:shadow-sm'
                  }`}
                  style={isSelected ? {
                    borderLeft: `4px solid ${category.color || '#3b82f6'}`,
                    backgroundColor: `${category.color || '#3b82f6'}20`
                  } : {}}
                  aria-pressed={isSelected}
                >
                  <span className="truncate">{category.name}</span>
                </button>
              );
            })}
          </div>
          <div className="mt-4 p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-100">
            <p className="text-xs text-gray-700 text-center font-semibold">
              {selectedCategories.length === 0 ? '🎯 Toutes catégories' : `✅ ${selectedCategories.length} catégorie(s) sélectionnée(s)`}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Filters;