import { useEffect, useMemo, useState } from 'react';
import Header from "../components/layout/Header";
import Charts from '../components/dashboard/Charts/Charts';
import Filters from '../components/dashboard/Filters/Filters';
import type { FiltersProps } from '../types/MonthlySummary.types';
import { useApiData } from '../hooks/useApiData';
import MonthlySummary from '../components/dashboard/MonthlySummary/MonthlySummary';
import { useSummary } from '../hooks/useSummary';
import { getDefaultDateRange } from '../utils';

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
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const defaultDates = getDefaultDateRange();
  const [startDate, setStartDate] = useState(defaultDates.start);
  const [endDate, setEndDate] = useState(defaultDates.end);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const { expenses, incomes, categories } = useApiData();

  const { summary, monthlySummary } = useSummary();

  useEffect(() => {
    console.log(getDefaultDateRange());
  },[])

  useEffect(() => {
    console.log("summary:", summary);
    console.log("expenses:", expenses);
    // console.log("incomes:", incomes);
    // console.log("date:", startDate + "--->" + endDate);
    // console.log("selectedCategories:", selectedCategories);
  }, [summary, monthlySummary, expenses, incomes, startDate, endDate, selectedCategories]);

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
    summary: monthlySummary,
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
            <MonthlySummary {...dataProps} />
          </div>
        </div>

        <Charts {...dataProps} />
      </main>
    </div>
  );
}