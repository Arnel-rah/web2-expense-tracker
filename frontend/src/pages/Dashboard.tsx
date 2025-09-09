import { useState, useEffect, useMemo } from 'react';
import Header from "../components/layout/Header";
import MonthlySummary from '../components/dashboard/MonthlySummary';
import Charts from '../components/dashboard/Charts';
import Filters from '../components/dashboard/Filters';
import type { FiltersProps } from '../types/MonthlySummary.types';
import type { Expense } from '../types/expenses.types';
import type { Income } from '../types/incomes.types';
import type { Category } from '../types/categories.types';
import { API_BASE_URL } from '../constants/api';

const getDefaultDateRange = () => ({
  start: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
  end: new Date().toISOString().split('T')[0]
});

const createAuthHeaders = () => ({
  'Authorization': `Bearer ${localStorage.getItem('token')}`,
});

const useApiData = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [incomes, setIncomes] = useState<Income[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  const fetchData = async (endpoint: string) => {
    const response = await fetch(`${API_BASE_URL}/${endpoint}`, {
      method: 'GET',
      headers: createAuthHeaders()
    });
    
    if (!response.ok) {
      throw new Error(`Erreur de récupération des ${endpoint}`);
    }
    
    return response.json();
  };

  const loadAllData = async () => {
    try {
      const [categoriesData, expensesData, incomesData] = await Promise.all([
        fetchData('categories'),
        fetchData('expenses'),
        fetchData('incomes')
      ]);

      setCategories(categoriesData);
      setExpenses(expensesData.map((expense: any) => ({
        ...expense,
        amount: parseFloat(expense.amount)
      })));
      setIncomes(incomesData.map((income: any) => ({
        ...income,
        amount: parseFloat(income.amount)
      })));
    } catch (error) {
      console.error('Erreur de chargement des données:', error);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  return { expenses, incomes, categories };
};

const DashboardHeader = ({
  onToggleFilter 
}: { 
  isFilterOpen: boolean; 
  onToggleFilter: () => void; 
}) => (
  <div className="mb-8 flex justify-between items-center">
    <div>
      <h1 className="text-3xl font-bold text-gray-900">Tableau de Bord Financier</h1>
      <p className="text-gray-600 mt-2">Visualisez et analysez vos finances personnelles</p>
    </div>
    <button
      onClick={onToggleFilter}
      className="lg:hidden flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-200 hover:bg-gray-50 transition-colors"
    >
      <span className="text-gray-600">Filtres</span>
    </button>
  </div>
);

const FilterSection = ({ 
  isOpen, 
  filterProps
}: { 
  isOpen: boolean; 
  filterProps: FiltersProps;
}) => (
  <>
    <div className="hidden lg:block lg:col-span-1">
      <Filters {...filterProps} />
    </div>
    {isOpen && (
      <div className="lg:hidden col-span-1">
        <Filters {...filterProps} />
      </div>
    )}
  </>
);

export default function Dashboard() {
  const { expenses, incomes, categories } = useApiData();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
  const defaultDates = getDefaultDateRange();
  const [startDate, setStartDate] = useState(defaultDates.start);
  const [endDate, setEndDate] = useState(defaultDates.end);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  useEffect(() => {
    if (categories.length > 0) {
      setSelectedCategories(categories.map(cat => cat.name));
    }
  }, [categories]);

  const categoriesWithColor = useMemo(() =>
    categories.map(cat => ({ ...cat, color: '#F59E0B' })),
    [categories]
  );

  const filterProps: FiltersProps = {
    startDate,
    endDate,
    onStartDateChange: setStartDate,
    onEndDateChange: setEndDate,
    selectedCategories,
    onCategoriesChange: setSelectedCategories,
    categories: categoriesWithColor
  };

  const dataProps = {
    expenses,
    incomes,
    startDate,
    endDate,
    selectedCategories,
    categories: categoriesWithColor
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <Header />
      
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <DashboardHeader
          isFilterOpen={isFilterOpen}
          onToggleFilter={() => setIsFilterOpen(!isFilterOpen)}
        />

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
          <FilterSection 
            isOpen={isFilterOpen} 
            filterProps={filterProps} 
          />
          
          <div className="lg:col-span-3">
            {/* <MonthlySummary {...dataProps} /> */}
          </div>
        </div>

        {/* <Charts {...dataProps} /> */}
      </main>
    </div>
  );
}