import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartPie } from '@fortawesome/free-solid-svg-icons';

export interface ExpenseRateBarProps {
  expenseRate: number;
  className?: string;
}

export const ExpenseRateBar: React.FC<ExpenseRateBarProps> = ({ 
  expenseRate, 
  className = '' 
}) => {
  const getProgressColor = (rate: number): string => {
    if (rate > 100) return '#ef4444';
    if (rate > 84) return '#f59e0b';
    if (rate > 60) return '#84cc16';
    return '#10b981';
  };

  const progressColor = getProgressColor(expenseRate);
  const displayRate = Math.min(expenseRate, 100);
  const isOverBudget = expenseRate > 100;

  return (
    <div className={`bg-white p-6 rounded-xl border border-gray-200 shadow-sm ${className}`}>
      
      <div className="flex items-center gap-3 mb-5">
        <div className="p-2.5 rounded-xl bg-blue-50">
          <FontAwesomeIcon 
            icon={faChartPie} 
            className="text-blue-600 text-base" 
          />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Taux de Dépenses
          </h3>
          <p className="text-sm text-gray-600">
            {expenseRate.toFixed(1)}% des revenus
          </p>
        </div>
      </div>

      <div className="mb-4">
        <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
          <div
            className="h-2.5 rounded-full transition-all duration-700 ease-out"
            style={{
              width: `${displayRate}%`,
              backgroundColor: progressColor
            }}
          />
        </div>
        
        <div className="flex justify-between text-xs text-gray-500 font-medium mt-1.5 px-0.5">
          <span>0%</span>
          <span>50%</span>
          <span>100%</span>
          <span className={isOverBudget ? 'text-red-600 font-bold' : ''}>
            +100%
          </span>
        </div>
      </div>

      <div className="text-xs text-gray-500 text-center">
        {isOverBudget ? (
          <span className="text-red-600 font-medium">
            Dépassement de {(expenseRate - 100).toFixed(1)}%
          </span>
        ) : (
          <span>Équilibre budgétaire</span>
        )}
      </div>
    </div>
  );
};