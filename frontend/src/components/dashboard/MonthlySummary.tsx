import { useEffect, useState } from 'react';
import type { MonthlySummaryProps } from '../../types/MonthlySummary.types.ts';

import { FinancialCard } from './monthlySummary/FinancialCard.tsx';
import { Header } from './monthlySummary/Header.tsx';
import { ExpenseRateBar } from './monthlySummary/ExpenseRateBar.tsx';
import { LargestExpenseCard } from './monthlySummary/LargestExpenseCard.tsx';
import { BudgetAlert } from './monthlySummary/BudgetAlert.tsx';
import { NoDataState } from './monthlySummary/NoDataState.tsx';
import type { Expense } from '../../types/expenses.types.ts';

const LOADING_DELAY = 2000;

const MonthlySummary = (monthlySummary: MonthlySummaryProps) => {

  const [isLoading, setIsLoading] = useState(false);

  // useEffect(() => {
  //   console.log("summary-Expense:", monthlySummary.summary?.totalExpenses);
  //   console.log("summary-Incomes:", monthlySummary.summary?.totalIncome);
  //   console.log("summary-balance:", monthlySummary.summary?.balance);
  //   console.log("expenses:", monthlySummary.expenses);
  //   console.log("incomes:", monthlySummary.incomes);
  //   console.log("date:", monthlySummary.startDate + "--->" + monthlySummary.endDate);
  //   console.log("selectedCategories:", monthlySummary.selectedCategories);
  // }, [monthlySummary]);

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
    totalIncome: 0,
    balance: 0
  };
  console.log("summaryData", monthlySummary);

  const savingsRate = 0; // monthlySummary.summary?.balance * 100 / monthlySummary.summary?.totalIncome;
  const expenseRate = 0; // monthlySummary.summary?.totalExpenses * 100 / monthlySummary.summary?.totalIncome;
  
  const getMax = (expense: Expense[]) => {
    let max = expense[0];

    for (const key in expense) {
      if (expense[key].amount >= max.amount) {
        max = expense[key]
      }
    }
    return max;
  }
  
  const largestExpense = getMax(monthlySummary.expenses);
  
  const isOverBudget = true; // monthlySummary.summary?.totalExpenses > monthlySummary.summary?.totalIncome;
  const overBudgetAmount = 0; // monthlySummary.summary?.totalExpenses - monthlySummary.summary?.totalIncome;


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
              // amount={Number(monthlySummary.summary?.totalIncome.toFixed(2))}
              amount={Number(monthlySummary.summary?.total_income)}
              count={monthlySummary.incomes.length}
              theme={'green'}
              itemName="source"
              tooltip="Total des revenus pour la période sélectionnée"
            />
            <FinancialCard
              title={"Depenses"}
              amount={Number(monthlySummary.summary?.totalExpenses.toFixed(2))}
              count={monthlySummary.expenses.length}
              theme={'red'}
              itemName="dépense"
              tooltip="Total des dépenses pour la période sélectionnée"
            />
            <FinancialCard
              title={"Solde"}
              amount={Number(monthlySummary.summary?.balance.toFixed(2))}
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
        {largestExpense && <LargestExpenseCard largestExpense={largestExpense} />}
      </div>

      {(isOverBudget || expenseRate > 84) && (
        <BudgetAlert
          isOverBudget={isOverBudget}
          expenseRate={expenseRate}
          overBudgetAmount={overBudgetAmount}
          totalIncome={Number(monthlySummary.summary?.totalIncome)}
          totalExpenses={Number(monthlySummary.summary?.totalExpenses)}
        />
      )}
        </>
      )}
    </div >
  );
};

export default MonthlySummary;