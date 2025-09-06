import React from 'react';

export interface ExpenseRateBarProps {
  expenseRate: number;
}

export const ExpenseRateBar: React.FC<ExpenseRateBarProps> = ({ expenseRate }) => (
  <div className="bg-gray-50 p-4 rounded-xl group hover:shadow-md transition-shadow duration-200" 
       title="Pourcentage des revenus dépensés">
    <div className="flex items-center justify-between text-base mb-3">
      <span className="text-gray-600 font-semibold">Taux de dépenses</span>
      <span className="font-semibold">{expenseRate.toFixed(1)}%</span>
    </div>
    <div className="w-full bg-gray-200 rounded-full h-3">
      <div
        className="h-3 rounded-full transition-all duration-500"
        style={{
          width: `${Math.min(expenseRate, 100)}%`,
          backgroundColor: expenseRate > 100 ? '#ef4444' : expenseRate > 84 ? '#f59e0b' : '#10b981',
        }}
      />
    </div>
  </div>
);