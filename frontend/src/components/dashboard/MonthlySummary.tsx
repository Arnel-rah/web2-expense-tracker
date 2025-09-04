import { faChartPie, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useMemo } from 'react';

interface FinancialItem {
  id: number;
  amount: number;
  date: string;
  category?: string;
  category_id?: string
}

interface MonthlySummaryProps {
  expenses: FinancialItem[];
  incomes: FinancialItem[];
  startDate: string;
  endDate: string;
  selectedCategories: string[];
}

const MonthlySummary: React.FC<MonthlySummaryProps> = ({
  expenses,
  incomes,
  startDate,
  endDate,
  selectedCategories
}) => {
  const {
    filteredIncomes,
    filteredExpenses,
    totalIncome,
    totalExpenses,
    balance,
    savingsRate,
    largestExpense,
    isOverBudget,
    overBudgetAmount,
    expensePercentage
  } = useMemo(() => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);

    const filteredIncomes = incomes.filter(income => {
      const incomeDate = new Date(income.date);
      return incomeDate >= start && incomeDate <= end;
    });

    const filteredExpenses = expenses.filter(expense => {
      const expenseDate = new Date(expense.date);
      const matchesPeriod = expenseDate >= start && expenseDate <= end;

      const matchesCategory = selectedCategories.length === 0 ||
        (expense.category_id && selectedCategories.includes(expense.category_id));

      return matchesPeriod && matchesCategory;
    });

    const totalIncome = filteredIncomes.reduce((sum, income) => sum + income.amount, 0);
    const totalExpenses = filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0);
    const balance = totalIncome - totalExpenses;
    const savingsRate = totalIncome > 0 ? (balance / totalIncome) * 100 : 0;

    const largestExpense = filteredExpenses.length > 0
      ? filteredExpenses.reduce((max, expense) =>
        expense.amount > max.amount ? expense : max, filteredExpenses[0])
      : null;

    // Calcul des alertes budgétaires
    const isOverBudget = totalExpenses > totalIncome;
    const overBudgetAmount = totalExpenses - totalIncome;
    const expensePercentage = totalIncome > 0 ? (totalExpenses / totalIncome) * 100 : 0;

    return {
      filteredIncomes,
      filteredExpenses,
      totalIncome,
      totalExpenses,
      balance,
      savingsRate,
      largestExpense,
      isOverBudget,
      overBudgetAmount,
      expensePercentage
    };
  }, [expenses, incomes, startDate, endDate, selectedCategories]);

  const formatPeriod = () => {
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (start.toDateString() === end.toDateString()) {
      return start.toLocaleDateString('fr-FR', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });
    }

    return `${start.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })} - ${end.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })}`;
  };

  const expenseRate = totalIncome > 0 ? (totalExpenses / totalIncome) * 100 : 0;
  const expenseRateColor = totalExpenses > totalIncome ? '#ef4444' :
    expenseRate > 84 ? '#f59e0b' : '#10b981';

  const showBudgetAlert = isOverBudget || expensePercentage > 84;

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 h-full">
      <div className="flex items-center justify-between mb-6">
        <div className='flex items-center gap-2'>
          <FontAwesomeIcon icon={faChartPie} className="text-gray-700" />
          <h2 className="text-xl font-semibold text-gray-900">Résumé Financier</h2>
        </div>
        <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
          {formatPeriod()}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <FinancialCard
          title="Revenus"
          amount={totalIncome}
          count={filteredIncomes.length}
          gradient="from-green-50 to-green-100"
          border="border-green-200"
          textColor="text-green-800"
          amountColor="text-green-900"
          itemName="source"
        />

        <FinancialCard
          title="Dépenses"
          amount={totalExpenses}
          count={filteredExpenses.length}
          gradient="from-red-50 to-red-100"
          border="border-red-200"
          textColor="text-red-800"
          amountColor="text-red-900"
          itemName="dépense"
        />

        <BalanceCard
          balance={balance}
          savingsRate={savingsRate}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <ExpenseRateBar
          expenseRate={expenseRate}
          expenseRateColor={expenseRateColor}
        />

        {largestExpense && (
          <LargestExpenseCard expense={largestExpense} />
        )}
      </div>

      {/* Alerte budgétaire intégrée */}
      {showBudgetAlert && (
        <BudgetAlert
          isOverBudget={isOverBudget}
          overBudgetAmount={overBudgetAmount}
          expensePercentage={expensePercentage}
          totalIncome={totalIncome}
          totalExpenses={totalExpenses}
        />
      )}
    </div>
  );
};

// Sous-composants pour améliorer la lisibilité
const FinancialCard: React.FC<{
  title: string;
  amount: number;
  count: number;
  gradient: string;
  border: string;
  textColor: string;
  amountColor: string;
  itemName: string;
}> = ({ title, amount, count, gradient, border, textColor, amountColor, itemName }) => (
  <div className={`bg-gradient-to-br ${gradient} p-4 rounded-xl border ${border}`}>
    <h3 className={`text-sm font-semibold ${textColor} mb-2`}>{title}</h3>
    <p className={`text-2xl font-bold ${amountColor}`}>Ar {amount.toFixed(2)}</p>
    <div className={`mt-2 text-xs ${textColor}`}>
      {count} {itemName}{count !== 1 ? 's' : ''}
    </div>
  </div>
);

const BalanceCard: React.FC<{
  balance: number;
  savingsRate: number;
}> = ({ balance, savingsRate }) => {
  const isPositive = balance >= 0;
  const theme = isPositive ? {
    gradient: 'from-blue-50 to-blue-100',
    border: 'border-blue-200',
    text: 'text-blue-800',
    amount: 'text-blue-900',
    badge: 'text-blue-700 bg-blue-200/50'
  } : {
    gradient: 'from-orange-50 to-orange-100',
    border: 'border-orange-200',
    text: 'text-orange-800',
    amount: 'text-orange-900',
    badge: 'text-orange-700 bg-orange-200/50'
  };

  return (
    <div className={`p-4 rounded-xl border ${theme.gradient} ${theme.border}`}>
      <h3 className={`text-sm font-semibold mb-2 ${theme.text}`}>Solde</h3>
      <p className={`text-2xl font-bold ${theme.amount}`}>Ar {balance.toFixed(2)}</p>
      <div className={`mt-2 text-xs px-2 py-1 rounded-full inline-block ${theme.badge}`}>
        {isPositive ? `${savingsRate.toFixed(1)}% d'épargne` : 'Déficit budgétaire'}
      </div>
    </div>
  );
};

const ExpenseRateBar: React.FC<{
  expenseRate: number;
  expenseRateColor: string;
}> = ({ expenseRate, expenseRateColor }) => (
  <div className="bg-gray-50 p-3 rounded-xl">
    <div className="flex items-center justify-between text-sm mb-2">
      <span className="text-gray-600 font-medium">Taux de dépenses</span>
      <span className="font-semibold">{expenseRate.toFixed(1)}%</span>
    </div>
    <div className="w-full bg-gray-200 rounded-full h-2.5">
      <div
        className="h-2.5 rounded-full transition-all duration-500"
        style={{
          width: `${Math.min(expenseRate, 100)}%`,
          backgroundColor: expenseRateColor
        }}
      />
    </div>
  </div>
);

const LargestExpenseCard: React.FC<{
  expense: FinancialItem;
}> = ({ expense }) => (
  <div className="bg-gray-50 p-3 rounded-xl">
    <div className="flex items-center justify-between text-sm mb-1">
      <span className="text-gray-600 font-medium">Plus grande dépense</span>
      <span className="font-semibold text-red-600">Ar {expense.amount.toFixed(2)}</span>
    </div>
    <p className="text-xs text-gray-500 truncate">
      {expense.category_id} - {new Date(expense.date).toLocaleDateString('fr-FR')}
    </p>
  </div>
);

const BudgetAlert: React.FC<{
  isOverBudget: boolean;
  overBudgetAmount: number;
  expensePercentage: number;
  totalIncome: number;
  totalExpenses: number;
}> = ({ isOverBudget, overBudgetAmount, expensePercentage, totalIncome, totalExpenses }) => {
  const alertType = isOverBudget ? {
    bg: 'bg-red-100',
    border: 'border-red-200',
    text: 'text-red-800',
    icon: 'text-red-500'
  } : {
    bg: 'bg-yellow-100',
    border: 'border-yellow-200',
    text: 'text-yellow-800',
    icon: 'text-yellow-500'
  };

  return (
    <div className={`p-3 rounded-xl border ${alertType.bg} ${alertType.border} ${alertType.text}`}>
      <div className="flex items-start">
        <FontAwesomeIcon icon={faExclamationTriangle} className={`w-4 h-4 mt-0.5 mr-2 ${alertType.icon}`} />
        <div className="flex-1">
          <div className="font-medium text-sm">
            {isOverBudget ? 'Dépassement de budget !' : 'Attention au budget'}
          </div>
          <p className="text-xs mt-1">
            {isOverBudget ? (
              <>Vous avez dépassé votre budget de <strong>Ar {overBudgetAmount.toFixed(2)}</strong></>
            ) : (
              <>Vos dépenses représentent <strong>{expensePercentage.toFixed(1)}%</strong> de vos revenus</>
            )}
          </p>
          <div className="text-xs opacity-80 mt-1">
            Revenus: ${totalIncome.toFixed(2)} | Dépenses: Ar {totalExpenses.toFixed(2)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MonthlySummary;