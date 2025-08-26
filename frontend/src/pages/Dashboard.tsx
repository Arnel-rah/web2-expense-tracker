import { useState, useEffect } from 'react';
import Header from "../components/layout/Header";
import MonthlySummary from '../components/dashboard/MonthlySummary';
import BudgetAlerts from '../components/dashboard/BudgetAlerts';
import Charts from '../components/dashboard/Charts';
import Filters from '../components/dashboard/Filters';

// Types
interface Expense {
  id: string;
  amount: number;
  category: string;
  date: string;
  type: 'one-time' | 'recurring';
  recurringType?: 'monthly' | 'weekly' | 'yearly';
}

interface Income {
  id: string;
  amount: number;
  date: string;
  source: string;
}

export default function Dashboard() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [incomes, setIncomes] = useState<Income[]>([]);
  const [selectedMonth, setSelectedMonth] = useState<string>('2024-01');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  // Charger les données avec des valeurs réalistes comme Chart.js examples
  useEffect(() => {
    // Tous les depense
    const sampleExpenses: Expense[] = [
      { id: '1', amount: 1200, category: 'Loyer', date: '2024-01-01', type: 'recurring', recurringType: 'monthly' },
      { id: '2', amount: 450, category: 'Nourriture', date: '2024-01-05', type: 'one-time' }
    ];

    const sampleIncomes: Income[] = [
      // Tous les incomes
      { id: '1', amount: 3500, date: '2024-01-05', source: 'Salaire Principal' },
      { id: '2', amount: 800, date: '2024-01-20', source: 'Freelance' }
    ];

    setExpenses(sampleExpenses);
    setIncomes(sampleIncomes);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <Filters
          selectedMonth={selectedMonth}
          onMonthChange={setSelectedMonth}
          selectedCategories={selectedCategories}
          onCategoriesChange={setSelectedCategories}
          expenses={expenses}
        />

        <BudgetAlerts
          expenses={expenses}
          incomes={incomes}
          selectedMonth={selectedMonth}
        />

        <MonthlySummary
          expenses={expenses}
          incomes={incomes}
          selectedMonth={selectedMonth}
          selectedCategories={selectedCategories}
        />

        <Charts
          expenses={expenses}
          incomes={incomes}
          selectedMonth={selectedMonth}
          selectedCategories={selectedCategories}
        />
      </main>
    </div>
  );
}