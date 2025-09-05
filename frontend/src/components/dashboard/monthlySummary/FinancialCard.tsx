import React from 'react';

const THEMES = {
  green: 'from-green-200 to-green-200 border-green-300 text-green-900',
  red: 'from-red-200 to-green-200 border-red-300 text-red-900',
  blue: 'from-blue-200 to-blue-200 border-blue-300 text-blue-900',
  orange: 'from-orange-200 to-orange-200 border-orange-300 text-orange-900',
  yellow: 'bg-yellow-50 border-yellow-200 text-yellow-900',
  alert: 'bg-red-50 border-red-200 text-red-900',
};

export interface FinancialCardProps {
  title: string;
  amount: number;
  count?: number;
  theme: keyof typeof THEMES;
  itemName?: string;
  children?: React.ReactNode;
  tooltip?: string;
}

export const FinancialCard: React.FC<FinancialCardProps> = ({ 
  title, 
  amount, 
  count, 
  theme, 
  itemName, 
  children, 
  tooltip 
}) => {
  const [gradient, textColor, amountColor] = THEMES[theme].split(' ');

  return (
    <div
      className={`bg-gradient-to-br ${gradient} p-5 rounded-xl hover:shadow-md transition-shadow duration-200 group relative`}
      title={tooltip}
    >
      <h3 className={`text-base font-semibold ${textColor} mb-3`}>{title}</h3>
      <p className={`text-3xl font-bold ${amountColor}`}>Ar {amount.toLocaleString('fr-FR')}</p>
      {children || (count !== undefined && itemName && (
        <div className={`mt-3 text-sm ${textColor}`}>
          {count} {itemName}{count !== 1 ? 's' : ''}
        </div>
      ))}
    </div>
  );
};