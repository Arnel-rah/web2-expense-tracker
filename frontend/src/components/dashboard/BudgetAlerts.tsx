import React from 'react';

interface BudgetAlertsProps {
  expenses: any[];
  incomes: any[];
  selectedMonth: string;
}

const BudgetAlerts: React.FC<BudgetAlertsProps> = ({
  expenses,
  incomes,
  selectedMonth
}) => {
  const filteredIncomes = incomes.filter(income => 
    income.date.startsWith(selectedMonth)
  );
  
  const filteredExpenses = expenses.filter(expense => 
    expense.date.startsWith(selectedMonth)
  );

  const totalIncome = filteredIncomes.reduce((sum, income) => sum + income.amount, 0);
  const totalExpenses = filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0);

  const isOverBudget = totalExpenses > totalIncome;
  const overBudgetAmount = totalExpenses - totalIncome;
  const expensePercentage = totalIncome > 0 ? (totalExpenses / totalIncome) * 100 : 0;

  console.log('Budget Alert Debug:', {
    totalIncome,
    totalExpenses,
    isOverBudget,
    overBudgetAmount,
    expensePercentage
  });

  if (!isOverBudget && expensePercentage <= 90) return null;

  return (
    <div className={`p-4 mb-6 rounded-lg border-l-4 ${
      isOverBudget 
        ? 'bg-red-100 border-red-500 text-red-700' 
        : 'bg-yellow-100 border-yellow-500 text-yellow-700'
    }`}>
      <div className="flex items-center">
        <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
        </svg>
        <strong>
          {isOverBudget ? 'Dépassement de budget !' : 'Attention au budget'}
        </strong>
      </div>
      <p className="mt-2">
        {isOverBudget ? (
          <>Vous avez dépassé votre budget ce mois-ci de <strong>${overBudgetAmount.toFixed(2)}</strong></>
        ) : (
          <>Vos dépenses représentent <strong>{expensePercentage.toFixed(1)}%</strong> de vos revenus - proche de la limite</>
        )}
      </p>
      <div className="mt-2 text-sm">
        Revenus: ${totalIncome.toFixed(2)} | Dépenses: ${totalExpenses.toFixed(2)}
      </div>
    </div>
  );
};

export default BudgetAlerts;