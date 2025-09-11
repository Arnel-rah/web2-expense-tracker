import { useEffect, useState } from 'react';
import type { MonthlySummaryProps } from '../../../types/MonthlySummary.types.ts';

import { FinancialCard } from './FinancialCard.tsx';
import { Header } from './Header.tsx';
import { useFinancialCalculations } from '../../../hooks/useFinancialCalculations.ts';
import { ExpenseRateBar } from './ExpenseRateBar.tsx';
import { LargestExpenseCard } from './LargestExpenseCard.tsx';
import { BudgetAlert } from './BudgetAlert.tsx';
import { NoDataState } from './NoDataState.tsx';

const LOADING_DELAY = 5000;

const MonthlySummary = (monthlySummary: MonthlySummaryProps) => {

  const [isLoading, setIsLoading] = useState(false);

  const handleReload = async () => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, LOADING_DELAY));
    } catch (error) {
      console.error("Erreur lors du rechargement:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const hasData = monthlySummary.expenses.length > 0 || monthlySummary.incomes.length > 0;

  const summaryData = monthlySummary.summary || {
    total_income: 0,
    total_expenses: 0,
    balance: 0
  };

  const financialData = useFinancialCalculations(
    monthlySummary.expenses,
    monthlySummary.incomes,
    monthlySummary.startDate,
    monthlySummary.endDate,
    monthlySummary.selectedCategories
  );

  const {
    totalIncome,
    totalExpenses,
    savingsRate,
    expenseRate,
    largestExpense,
    isOverBudget,
    overBudgetAmount
  } = financialData;


  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100 h-full">
      <Header
        startDate={monthlySummary.startDate}
        endDate={monthlySummary.endDate}
        hasData={hasData}
        isLoading={isLoading}
        onReload={handleReload}
      />

      {!hasData ? (
        <NoDataState isLoading={isLoading} onReload={handleReload} />
      ) : (
        <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <FinancialCard
          title="Revenus"
          amount={summaryData.total_income}
          count={monthlySummary.incomes.length}
          theme="green"
          itemName="source"
          tooltip="Total des revenus pour la période sélectionnée"
        />
        <FinancialCard
          title="Dépenses"
          amount={summaryData.total_expenses}
          count={monthlySummary.expenses.length}
          theme="red"
          itemName="dépense"
          tooltip="Total des dépenses pour la période sélectionnée"
        />
        <FinancialCard
          title="Solde"
          amount={summaryData.balance}
          theme={summaryData.balance >= 0 ? 'blue' : 'orange'}
          tooltip={summaryData.balance >= 0 ? 'Solde positif (épargne)' : 'Solde négatif (déficit)'}
        >
          <div className={`mt-3 text-sm px-3 py-1 rounded-full inline-block ${summaryData.balance >= 0 ? 'text-blue-800 bg-blue-200/50' : 'text-orange-800 bg-orange-200/50'
            }`}>
            {summaryData.balance >= 0 ? `${savingsRate.toFixed(1)}% d'épargne` : 'Déficit budgétaire'}
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
    </div >
  );
};

export default MonthlySummary;