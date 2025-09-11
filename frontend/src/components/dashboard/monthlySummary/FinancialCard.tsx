import React from 'react';

const THEMES = {
  green: 'from-emerald-100 to-green-200 border-green-300 text-green-900',
  red: 'from-red-100 to-rose-200 border-red-300 text-red-900',
  blue: 'from-blue-100 to-indigo-200 border-blue-300 text-blue-900',
  orange: 'from-orange-100 to-amber-200 border-orange-300 text-orange-900',
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
      className={`bg-gradient-to-br ${gradient} p-6 rounded-2xl hover:shadow-xl transition-all duration-300 group relative border-2 hover:scale-105 transform`}
      title={tooltip}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className={`text-lg font-bold ${textColor}`}>{title}</h3>
        <div className={`w-3 h-3 rounded-full ${textColor.replace('text-', 'bg-').replace('-900', '-500')}`}></div>
      </div>
      <p className={`text-4xl font-extrabold ${amountColor} mb-2`}>
        Ar {typeof amount === 'number' ? amount.toLocaleString('fr-FR') : amount}
      </p>
      {children || (count !== undefined && itemName && (
        <div className={`mt-4 text-sm font-medium ${textColor} opacity-80`}>
          📊 {count} {itemName}{count !== 1 ? 's' : ''}
        </div>
      ))}
      <div className="absolute top-2 right-2 opacity-20 group-hover:opacity-40 transition-opacity duration-300">
        <div className="w-8 h-8 rounded-full bg-white/30"></div>
      </div>
    </div>
  );
};