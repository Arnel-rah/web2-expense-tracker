import React from 'react';

interface MonthlySummaryProps {
  expenses: any[];
  incomes: any[];
  selectedMonth: string;
  selectedCategories: string[];
}

const MonthlySummary: React.FC<MonthlySummaryProps> = ({
  expenses,
  incomes,
  selectedMonth,
  selectedCategories
}) => {
  // Calculer les totaux CORRECTEMENT
  const filteredIncomes = incomes.filter(income => 
    income.date.startsWith(selectedMonth)
  );
  
  const filteredExpenses = expenses.filter(expense => {
    const matchesMonth = expense.date.startsWith(selectedMonth);
    const matchesCategory = selectedCategories.length === 0 || 
                          selectedCategories.includes(expense.category);
    return matchesMonth && matchesCategory;
  });

  const totalIncome = filteredIncomes.reduce((sum, income) => sum + income.amount, 0);
  const totalExpenses = filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0);
  const balance = totalIncome - totalExpenses;

  console.log('Monthly Summary Debug:', {
    selectedMonth,
    incomeCount: filteredIncomes.length,
    expenseCount: filteredExpenses.length,
    totalIncome,
    totalExpenses,
    balance
  });

  return (
    <div className="bg-white shadow rounded-lg p-6 mb-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        Résumé Mensuel - {new Date(selectedMonth + '-01').toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-green-50 p-6 rounded-lg border border-green-200">
          <h3 className="text-lg font-semibold text-green-800 mb-2">Revenus</h3>
          <p className="text-3xl font-bold text-green-900">${totalIncome.toFixed(2)}</p>
          <div className="mt-2 text-sm text-green-600">
            {filteredIncomes.length} source(s) de revenu
          </div>
        </div>
        
        <div className="bg-red-50 p-6 rounded-lg border border-red-200">
          <h3 className="text-lg font-semibold text-red-800 mb-2">Dépenses</h3>
          <p className="text-3xl font-bold text-red-900">${totalExpenses.toFixed(2)}</p>
          <div className="mt-2 text-sm text-red-600">
            {filteredExpenses.length} dépense(s)
          </div>
        </div>
        
        <div className={`p-6 rounded-lg border ${
          balance >= 0 
            ? 'bg-blue-50 border-blue-200' 
            : 'bg-orange-50 border-orange-200'
        }`}>
          <h3 className={`text-lg font-semibold ${
            balance >= 0 ? 'text-blue-800' : 'text-orange-800'
          } mb-2`}>
            Solde
          </h3>
          <p className={`text-3xl font-bold ${
            balance >= 0 ? 'text-blue-900' : 'text-orange-900'
          }`}>
            ${balance.toFixed(2)}
          </p>
          <div className={`mt-2 text-sm ${
            balance >= 0 ? 'text-blue-600' : 'text-orange-600'
          }`}>
            {balance >= 0 ? '✅ Budget respecté' : '❌ Budget dépassé'}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MonthlySummary;