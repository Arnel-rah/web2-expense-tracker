import { useState, useEffect, useMemo } from 'react';
import Header from "../components/layout/Header";
import MonthlySummary from '../components/dashboard/MonthlySummary';
import Charts from '../components/dashboard/Charts';
import Filters from '../components/dashboard/Filters';

interface Expense {
  id: number;
  amount: number;
  date: string;
  category_id: string;
  description?: string | null;
  type: 'one-time' | 'recurring';
  start_date?: string | null;
  end_date?: string | null;
  receipt?: string | null;
  user_id: number;
  created_at?: string;
}

interface Income {
  id: number;
  amount: number;
  date: string;
  source: string;
  description?: string | null;
  user_id: number;
  created_at?: string;
}

interface Category {
  id: number;
  name: string;
  user_id: number;
  created_at?: string;
  color?: string;
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
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const API_URL = 'http://localhost:8080/api';

  const categoriesWithColor = useMemo(() =>
    categories.map(cat => ({
      ...cat,
      color: '#F59E0B'
    })),
    [categories]
  );

  const fetchCategory = async () => {
    try {
      const response = await fetch(`${API_URL}/categories`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        }
      });

      if (!response.ok) {
        throw new Error('Erreur de récupération des catégories');
      }

      const data = await response.json();
      setCategories(data);
      setSelectedCategories(data.map((cat: Category) => cat.name));
      console.log('Categories:', data);

    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  const fetchExpense = async () => {
    try {
      const response = await fetch(`${API_URL}/expenses`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        }
      });

      if (!response.ok) {
        throw new Error('Erreur de récupération des dépenses');
      }

      const data = await response.json();
      const formattedData = data.map((expense: any) => ({
        ...expense,
        amount: parseFloat(expense.amount)
      }));
      setExpenses(formattedData);
      console.log('Expense:', formattedData);

    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  const fetchIncome = async () => {
    try {
      const response = await fetch(`${API_URL}/incomes`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        }
      });

      if (!response.ok) {
        throw new Error('Erreur de récupération des revenus');
      }

      const data = await response.json();
      const formattedData = data.map((income: any) => ({
        ...income,
        amount: parseFloat(income.amount)
      }));
      setIncomes(formattedData);
      console.log('Incomes:', formattedData);

    } catch (error) {
      console.error('Erreur:', error);
    }
  };
  
  useEffect(() => {
    fetchCategory();
    fetchExpense();
    fetchIncome();
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
            categories={categoriesWithColor}
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
          categories={categoriesWithColor}
        />
      </main>
    </div>
  );
}

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
      className="lg:hidden flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-200 hover:bg-gray-50 transition-colors"
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