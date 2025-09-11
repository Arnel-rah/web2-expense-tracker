import { useState } from 'react';
import type { MonthlySummaryProps, Expense} from '../../../types';

import { Header } from './Header.tsx';
import { FinancialCard } from './FinancialCard.tsx';
import { ExpenseRateBar } from './ExpenseRateBar.tsx';
import { LargestExpenseCard } from './LargestExpenseCard.tsx';
import { BudgetAlert } from './BudgetAlert.tsx';
import { NoDataState } from './NoDataState.tsx';

const LOADING_DELAY = 2000;

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
    totalExpenses: 0,
    totalIncomes: 0,
    balance: 0
  };

  const savingsRate = monthlySummary.summary.totalIncomes > 0
    ? (monthlySummary.summary.balance * 100 / monthlySummary.summary.totalIncomes)
    : 0;
  const expenseRate = monthlySummary.summary.totalIncomes > 0
    ? (monthlySummary.summary.totalExpenses * 100 / monthlySummary.summary.totalIncomes)
    : 0;

  const getLargestExpense = (expenses: Expense[]) => {
    if (expenses.length === 0) return null;

    let largestExpense = expenses[0];

    for (let i = 1; i < expenses.length; i++) {
      if (Number(expenses[i].amount) > Number(largestExpense.amount)) {
        largestExpense = expenses[i];
      }
    }

    return largestExpense;
  };

  const largestExpense = getLargestExpense(monthlySummary.expenses);

  const overBudgetAmount = monthlySummary.summary.totalExpenses - monthlySummary.summary.totalIncomes;
  const isOverBudget = monthlySummary.summary.totalExpenses > monthlySummary.summary.totalIncomes;

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100 h-full">
      <Header
        startDate={monthlySummary.startDate}
        endDate={monthlySummary.endDate}
        hasData={hasData}
        isLoading={isLoading}
      />

      {!hasData ? (
        <NoDataState isLoading={isLoading} onReload={handleReload} />
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <FinancialCard
              title={"Incomes"}
              amount={Number(monthlySummary.summary.totalIncomes.toFixed(2))}
              count={monthlySummary.incomes.length}
              theme={'green'}
              itemName="source"
              tooltip="Total des revenus pour la période sélectionnée"
            />
            <FinancialCard
              title={"Depenses"}
              amount={Number(monthlySummary.summary.totalExpenses.toFixed(2))}
              count={monthlySummary.expenses.length}
              theme={'red'}
              itemName="dépense"
              tooltip="Total des dépenses pour la période sélectionnée"
            />
            <FinancialCard
              title={"Solde"}
              amount={Number(monthlySummary.summary.balance.toFixed(2))}
              theme={summaryData.balance >= 0 ? 'blue' : 'orange'}
              tooltip={summaryData.balance >= 0 ? 'Solde positif (épargne)' : 'Solde négatif (déficit)'}
            >
              <div className={`mt-3 text-sm px-3 py-1 rounded-full inline-block ${summaryData.balance >= 0 ? 'text-blue-800 bg-blue-200/50' : 'text-orange-800 bg-orange-200/50'
                }`}>
                {summaryData.balance >= 0 ? `${(savingsRate).toFixed(1)}% d'épargne` : 'Déficit budgétaire'}
              </div>
            </FinancialCard>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <ExpenseRateBar expenseRate={expenseRate} />
            {largestExpense && <LargestExpenseCard 
              largestExpense={largestExpense} 
              categories={monthlySummary.categories}
            />}
          </div>

          {(isOverBudget || expenseRate > 84) && (
            <BudgetAlert
              isOverBudget={isOverBudget}
              expenseRate={expenseRate}
              overBudgetAmount={overBudgetAmount}
              totalIncomes={Number(monthlySummary.summary.totalIncomes)}
              totalExpenses={Number(monthlySummary.summary.totalExpenses)}
            />
          )}
        </>
      )}
    </div >
  );
};

export default MonthlySummary;