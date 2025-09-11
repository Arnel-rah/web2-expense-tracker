import React from 'react';
import type { Expense, Category } from '../../../types';
import { getCategoryName } from '../../../utils';

export interface LargestExpenseCardProps {
  largestExpense: Expense;
  categories: Category[];
}

export const LargestExpenseCard: React.FC<LargestExpenseCardProps> = ({ 
  largestExpense, 
  categories 
}) => (
  <div className="bg-gray-50 p-4 rounded-xl group hover:shadow-md transition-shadow duration-200" 
       title="Dépense la plus importante">
    <div className="flex items-center justify-between text-base mb-2">
      <span className="text-gray-600 font-semibold">Plus grande dépense</span>
      <span className="font-semibold text-red-600">
        Ar {largestExpense.amount.toLocaleString('fr-FR')}
      </span>
    </div>
    <p className="text-sm text-gray-500 truncate">
      {getCategoryName(largestExpense.category_id, categories)} - {new Date(largestExpense.date).toLocaleDateString('fr-FR')}
    </p>
  </div>
);