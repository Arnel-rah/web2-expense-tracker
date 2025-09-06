import React, { useState } from 'react';
import type { MonthlySummaryProps } from '../../types/MonthlySummary.types.ts';

import { FinancialCard } from './monthlySummary/FinancialCard';
import { ExpenseRateBar } from './monthlySummary/ExpenseRateBar';
import { LargestExpenseCard } from './monthlySummary/LargestExpenseCard';
import { BudgetAlert } from './monthlySummary/BudgetAlert';
import { NoDataState } from './monthlySummary/NoDataState.tsx';
import { Header } from './monthlySummary/Header';
import { useFinancialCalculations } from '../../hooks/useFinancialCalculations';

const LOADING_DELAY = 5000;

export const MonthlySummary: React.FC<MonthlySummaryProps> = ({
  expenses,
  incomes,
  startDate,
  endDate,
  selectedCategories,
  onReload
}) => {
  const [isLoading, setIsLoading] = useState(false);
  
  const financialData = useFinancialCalculations(
    expenses, 
    incomes, 
    startDate, 
    endDate, 
    selectedCategories
  );

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
  } = financialData;

  const handleReload = async () => {
    if (!onReload) return;
    
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, LOADING_DELAY));
      await onReload();
    } catch (error) {
      console.error("Erreur lors du rechargement:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const hasData = expenses.length > 0 || incomes.length > 0;

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100 h-full">
      <Header
        startDate={startDate}
        endDate={endDate}
        hasData={hasData}
        isLoading={isLoading}
        onReload={onReload ? handleReload : undefined}
      />

      {!hasData ? (
        <NoDataState isLoading={isLoading} onReload={handleReload} />
      ) : (
        <>
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
              <div className={`mt-3 text-sm px-3 py-1 rounded-full inline-block ${
                balance >= 0 ? 'text-blue-800 bg-blue-200/50' : 'text-orange-800 bg-orange-200/50'
              }`}>
                {balance >= 0 ? `${savingsRate.toFixed(1)}% d'épargne` : 'Déficit budgétaire'}
              </div>
            </FinancialCard>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <ExpenseRateBar expenseRate={expenseRate} />
            {largestExpense && <LargestExpenseCard largestExpense={largestExpense} />}
          </div>

          {(isOverBudget || expenseRate > 84) && (
            <BudgetAlert
              isOverBudget={isOverBudget}
              expenseRate={expenseRate}
              overBudgetAmount={overBudgetAmount}
              totalIncome={totalIncome}
              totalExpenses={totalExpenses}
            />
          )}
        </>
      )}
    </div>
  );
};

export default MonthlySummary;