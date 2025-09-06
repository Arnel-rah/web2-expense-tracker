import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';

const THEMES = {
  yellow: 'bg-yellow-50 border-yellow-200 text-yellow-900',
  alert: 'bg-red-50 border-red-200 text-red-900',
};

export interface BudgetAlertProps {
  isOverBudget: boolean;
  expenseRate: number;
  overBudgetAmount: number;
  totalIncome: number;
  totalExpenses: number;
}

export const BudgetAlert: React.FC<BudgetAlertProps> = ({ 
  isOverBudget, 
  expenseRate, 
  overBudgetAmount, 
  totalIncome, 
  totalExpenses 
}) => {
  const alertTheme = isOverBudget ? 'alert' : 'yellow';
  const [bgColor, borderColor, textColor] = THEMES[alertTheme].split(' ');

  return (
    <div className={`p-4 rounded-xl border ${bgColor} ${borderColor} group hover:shadow-md transition-shadow duration-200`} 
         title="Alerte budgétaire">
      <div className="flex items-start">
        <FontAwesomeIcon icon={faExclamationTriangle} className={`w-5 h-5 mt-0.5 mr-3 ${textColor}`} />
        <div className="flex-1">
          <div className="font-semibold text-base">{isOverBudget ? 'Dépassement de budget !' : 'Attention au budget'}</div>
          <p className="text-sm mt-1">
            {isOverBudget
              ? `Vous avez dépassé votre budget de Ar ${overBudgetAmount.toLocaleString('fr-FR')}`
              : `Vos dépenses représentent ${expenseRate.toFixed(1)}% de vos revenus`}
          </p>
          <div className="text-sm opacity-80 mt-2">
            Revenus: Ar {totalIncome.toLocaleString('fr-FR')} | Dépenses: Ar {totalExpenses.toLocaleString('fr-FR')}
          </div>
        </div>
      </div>
    </div>
  );
};