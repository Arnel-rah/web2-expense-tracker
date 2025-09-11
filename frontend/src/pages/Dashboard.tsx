import { useEffect, useMemo, useState } from 'react';
import Header from "../components/layout/Header";
import Charts from '../components/dashboard/Charts/Charts';
import Filters from '../components/dashboard/Filters/Filters';
import type { FiltersProps } from '../types/MonthlySummary.types';
import { useApiData } from '../hooks/useApiData';
import MonthlySummary from '../components/dashboard/monthlySummary/MonthlySummary';
import { useSummary } from '../hooks/useSummary';
import { getDefaultDateRange } from '../utils';

const DashboardHeader = ({ onToggleFilter }: { onToggleFilter: () => void }) => (
  <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
    <div>
      <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
        Tableau de Bord Financier
      </h1>
      <p className="text-gray-600 mt-2 text-sm sm:text-base">
        Visualisez et analysez vos finances personnelles en temps réel
      </p>
    </div>
    <button
      onClick={onToggleFilter}
      className="lg:hidden flex items-center gap-2 bg-white px-4 py-2.5 rounded-xl shadow-md border border-gray-200 hover:bg-gray-50 hover:shadow-lg transition-all duration-200"
    >
      <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.707A1 1 0 013 7V4z" />
      </svg>
      <span className="text-gray-700 font-medium">Filtres</span>
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <Header />
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">

        <DashboardHeader
          onToggleFilter={() => setIsFilterOpen(!isFilterOpen)}
        />

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
          <FilterSection
            isOpen={isFilterOpen}
            filterProps={filterProps}
          />

          <div className="lg:col-span-3 space-y-6">
            <MonthlySummary {...dataProps} />
          </div>
        </div>

        <div className="mt-8">
          <Charts {...dataProps} />
        </div>
      </main>
    </div>
  );
}