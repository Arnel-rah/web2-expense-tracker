import { useState, useEffect } from 'react';
import Header from "../components/layout/Header";
import MonthlySummary from '../components/dashboard/MonthlySummary';
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

interface Category {
  id: string;
  name: string;
  color: string;
}

export default function Dashboard() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [incomes, setIncomes] = useState<Income[]>([]);
  const [startDate, setStartDate] = useState<string>(() => {
    const date = new Date();
    date.setDate(1);
    return date.toISOString().split('T')[0];
  });
  const [endDate, setEndDate] = useState<string>(() => {
    const date = new Date();
    return date.toISOString().split('T')[0];
  });
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Définition des catégories
  const categories: Category[] = [
    { id: '1', name: 'Loyer', color: '#FF6384' },
    { id: '2', name: 'Nourriture', color: '#36A2EB' },
    { id: '3', name: 'Shopping', color: '#FFCE56' },
    { id: '4', name: 'Transport', color: '#4BC0C0' },
    { id: '5', name: 'Abonnements', color: '#9966FF' },
    { id: '6', name: 'Santé', color: '#FF9F40' },
    { id: '7', name: 'Éducation', color: '#8AC926' },
    { id: '8', name: 'Loisirs', color: '#1982C4' },
  ];

  useEffect(() => {
    // Données d'exemple
    const sampleExpenses: Expense[] = [
      { id: '2', amount: 801_000, category: 'Nourriture', date: '2025-08-05', type: 'one-time' },
      { id: '3', amount: 50_001, category: 'Transport', date: '2025-08-10', type: 'one-time' }
    ];

    const sampleIncomes: Income[] = [
      { id: '1', amount: 1_000_500, date: '2025-08-05', source: 'Salaire Principal' },
    ];

    setExpenses(sampleExpenses);
    setIncomes(sampleIncomes);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <Header />

      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <DashboardHeader
          isFilterOpen={isFilterOpen}
          setIsFilterOpen={setIsFilterOpen}
        />

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
          <FilterSection
            isFilterOpen={isFilterOpen}
            startDate={startDate}
            endDate={endDate}
            onStartDateChange={setStartDate}
            onEndDateChange={setEndDate}
            selectedCategories={selectedCategories}
            onCategoriesChange={setSelectedCategories}
            categories={categories}
          />

          <div className="lg:col-span-3">
            <MonthlySummary
              expenses={expenses}
              incomes={incomes}
              startDate={startDate}
              endDate={endDate}
              selectedCategories={selectedCategories}
            />
          </div>
        </div>

        <Charts
          expenses={expenses}
          incomes={incomes}
          startDate={startDate}
          endDate={endDate}
          selectedCategories={selectedCategories}
          categories={categories}
        />
      </main>
    </div>
  );
}

// Sous-composants pour Dashboard
const DashboardHeader: React.FC<{
  isFilterOpen: boolean;
  setIsFilterOpen: (open: boolean) => void;
}> = ({ isFilterOpen, setIsFilterOpen }) => (
  <div className="mb-8 flex justify-between items-center">
    <div>
      <h1 className="text-3xl font-bold text-gray-900">Tableau de Bord Financier</h1>
      <p className="text-gray-600 mt-2">Visualisez et analysez vos finances personnelles</p>
    </div>

    <button
      onClick={() => setIsFilterOpen(!isFilterOpen)}
      className="lg:hidden flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-200"
    >
      <span className="text-gray-600">Filtres</span>
    </button>
  </div>
);

const FilterSection: React.FC<{
  isFilterOpen: boolean;
  startDate: string;
  endDate: string;
  onStartDateChange: (date: string) => void;
  onEndDateChange: (date: string) => void;
  selectedCategories: string[];
  onCategoriesChange: (categories: string[]) => void;
  categories: Category[];
}> = (props) => (
  <>
    <div className="hidden lg:block lg:col-span-1">
      <Filters {...props} />
    </div>

    {props.isFilterOpen && (
      <div className="lg:hidden col-span-1">
        <Filters {...props} />
      </div>
    )}
  </>
);