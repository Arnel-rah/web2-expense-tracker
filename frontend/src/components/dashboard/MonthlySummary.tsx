import { faChartPie, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useMemo } from 'react';
import type { FinancialItem, MonthlySummaryProps } from '../../types/MonthlySummary.types.ts';
import { createDateRange, isInDateRange, formatPeriod } from '../../utils/utils.ts';

const themes = {
  green: 'from-green-200 to-green-200 border-green-300 text-green-900 text-green-900',
  red: 'from-red-200 to-red-200 border-red-300 text-red-900 text-red-900',
  blue: 'from-blue-200 to-blue-200 border-blue-300 text-blue-900 text-blue-900',
  orange: 'from-orange-200 to-orange-200 border-orange-300 text-orange-900 text-orange-900',
  yellow: 'bg-yellow-50 border-yellow-200 text-yellow-900 text-yellow-600',
  alert: 'bg-red-50 border-red-200 text-red-900 text-red-600',
};

const FinancialCard = ({ title, amount, count, theme, itemName, children, tooltip }: {
  title: string;
  amount: number;
  count?: number;
  theme: keyof typeof themes;
  itemName?: string;
  children?: React.ReactNode;
  tooltip?: string;
}) => {
  const [gradient, , textColor, amountColor] = themes[theme].split(' ');
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

const useFinancialCalculations = (
  expenses: FinancialItem[],
  incomes: FinancialItem[],
  startDate: string,
  endDate: string,
  selectedCategories: string[]
) => useMemo(() => {
  const { start, end } = createDateRange(startDate, endDate);
  const filteredIncomes = incomes.filter(income => isInDateRange(income.date, start, end));
  const filteredExpenses = expenses.filter(expense =>
    isInDateRange(expense.date, start, end) &&
    (selectedCategories.length === 0 || (expense.category_id && selectedCategories.includes(expense.category_id)))
  );

  const totalIncome = filteredIncomes.reduce((sum, { amount }) => sum + amount, 0);
  const totalExpenses = filteredExpenses.reduce((sum, { amount }) => sum + amount, 0);
  const balance = totalIncome - totalExpenses;
  const savingsRate = totalIncome > 0 ? (balance / totalIncome) * 100 : 0;
  const expenseRate = totalIncome > 0 ? (totalExpenses / totalIncome) * 100 : 0;
  const largestExpense = filteredExpenses.length > 0
    ? filteredExpenses.reduce((max, expense) => expense.amount > max.amount ? expense : max, filteredExpenses[0])
    : null;

  return {
    filteredIncomes,
    filteredExpenses,
    totalIncome,
    totalExpenses,
    balance,
    savingsRate,
    expenseRate,
    largestExpense,
    isOverBudget: totalExpenses > totalIncome,
    overBudgetAmount: Math.max(0, totalExpenses - totalIncome),
  };
}, [expenses, incomes, startDate, endDate, selectedCategories]);

const MonthlySummary: React.FC<MonthlySummaryProps> = ({
  expenses,
  incomes,
  startDate,
  endDate,
  selectedCategories,
}) => {
  const {
    filteredIncomes,
    filteredExpenses,
    totalIncome,
    totalExpenses,
    balance,
    savingsRate,
    expenseRate,
    largestExpense,
    isOverBudget,
    overBudgetAmount,
  } = useFinancialCalculations(expenses, incomes, startDate, endDate, selectedCategories);

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100 h-full">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <FontAwesomeIcon icon={faChartPie} className="text-gray-600 text-lg" />
          <h2 className="text-2xl font-bold text-gray-900">Résumé Financier</h2>
        </div>
        <span className="text-sm text-gray-600 bg-gray-50 px-4 py-2 rounded-full">
          {formatPeriod(startDate, endDate)}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <FinancialCard
          title="Revenus"
          amount={totalIncome}
          count={filteredIncomes.length}
          theme="green"
          itemName="source"
          tooltip="Total des revenus pour la période sélectionnée"
        />
        <FinancialCard
          title="Dépenses"
          amount={totalExpenses}
          count={filteredExpenses.length}
          theme="red"
          itemName="dépense"
          tooltip="Total des dépenses pour la période sélectionnée"
        />
        <FinancialCard
          title="Solde"
          amount={balance}
          theme={balance >= 0 ? 'blue' : 'orange'}
          tooltip={balance >= 0 ? 'Solde positif (épargne)' : 'Solde négatif (déficit)'}
        >
          <div className={`mt-3 text-sm px-3 py-1 rounded-full inline-block ${balance >= 0 ? 'text-blue-800 bg-blue-200/50' : 'text-orange-800 bg-orange-200/50'}`}>
            {balance >= 0 ? `${savingsRate.toFixed(1)}% d'épargne` : 'Déficit budgétaire'}
          </div>
        </FinancialCard>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-gray-50 p-4 rounded-xl group hover:shadow-md transition-shadow duration-200" title="Pourcentage des revenus dépensés">
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
        {largestExpense && (
          <div className="bg-gray-50 p-4 rounded-xl group hover:shadow-md transition-shadow duration-200" title="Dépense la plus importante">
            <div className="flex items-center justify-between text-base mb-2">
              <span className="text-gray-600 font-semibold">Plus grande dépense</span>
              <span className="font-semibold text-red-600">Ar {largestExpense.amount.toLocaleString('fr-FR')}</span>
            </div>
            <p className="text-sm text-gray-500 truncate">
              {largestExpense.category_id} - {new Date(largestExpense.date).toLocaleDateString('fr-FR')}
            </p>
          </div>
        )}
      </div>

      {(isOverBudget || expenseRate > 84) && (
        <div className={`p-4 rounded-xl border ${themes[isOverBudget ? 'alert' : 'yellow']} group hover:shadow-md transition-shadow duration-200`} title="Alerte budgétaire">
          <div className="flex items-start">
            <FontAwesomeIcon icon={faExclamationTriangle} className={`w-5 h-5 mt-0.5 mr-3 ${themes[isOverBudget ? 'alert' : 'yellow'].split(' ')[3]}`} />
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
      )}
    </div>
  );
};

export default MonthlySummary;