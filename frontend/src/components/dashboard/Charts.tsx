import React, { useMemo } from 'react';
import { Doughnut, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartLine } from '@fortawesome/free-solid-svg-icons';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

interface Category {
  id: number;
  name: string;
  user_id: number;
  created_at?: string;
  color?: string;
}

interface FinancialItem {
  id: number;
  amount: number;
  date: string;
  category?: string;
}

interface ChartsProps {
  expenses: FinancialItem[];
  incomes: FinancialItem[];
  startDate: string;
  endDate: string;
  selectedCategories: string[];
  categories: Category[];
}

const Charts: React.FC<ChartsProps> = ({
  expenses,
  incomes,
  startDate,
  endDate,
  selectedCategories,
  categories
}) => {
  const { periodIncome, periodExpenses, periodBalance, categoryData, lastSixMonths } = useMemo(() => {
    const start = new Date(startDate);
    const end = new Date(endDate);

    // Calcul des données de période
    const periodIncome = incomes
      .filter(income => {
        const incomeDate = new Date(income.date);
        return incomeDate >= start && incomeDate <= end;
      })
      .reduce((sum, income) => sum + income.amount, 0);

    const periodExpenses = expenses
      .filter(expense => {
        const expenseDate = new Date(expense.date);
        const matchesPeriod = expenseDate >= start && expenseDate <= end;
        const matchesCategory = selectedCategories.length === 0 ||
          (expense.category && selectedCategories.includes(expense.category));
        return matchesPeriod && matchesCategory;
      })
      .reduce((sum, expense) => sum + expense.amount, 0);

    const periodBalance = periodIncome - periodExpenses;

    // Données pour le graphique circulaire
    const categoryData = expenses
      .filter(expense => {
        const expenseDate = new Date(expense.date);
        const matchesPeriod = expenseDate >= start && expenseDate <= end;
        const matchesCategory = selectedCategories.length === 0 ||
          (expense.category && selectedCategories.includes(expense.category));
        return matchesPeriod && matchesCategory;
      })
      .reduce((acc, expense) => {
        if (expense.category) {
          acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
        }
        return acc;
      }, {} as Record<string, number>);

    // Données pour le graphique en barres (6 derniers mois)
    const getLastSixMonths = () => {
      const months = [];
      const endDateObj = new Date(endDate);

      for (let i = 5; i >= 0; i--) {
        const date = new Date(endDateObj);
        date.setMonth(date.getMonth() - i);
        months.push(date.toISOString().slice(0, 7));
      }
      return months;
    };

    return {
      periodIncome,
      periodExpenses,
      periodBalance,
      categoryData,
      lastSixMonths: getLastSixMonths()
    };
  }, [expenses, incomes, startDate, endDate, selectedCategories]);

  // Configuration des graphiques
  const doughnutData = useMemo(() => {
    const getCategoryColor = (categoryName: string): string => {
      const category = categories.find(c => c.name === categoryName);
      return category?.color || '#CCCCCC'; // Always returns a string
    };

    return {
      labels: Object.keys(categoryData),
      datasets: [{
        data: Object.values(categoryData),
        backgroundColor: Object.keys(categoryData).map(cat => getCategoryColor(cat)),
        hoverBackgroundColor: Object.keys(categoryData).map(cat => getCategoryColor(cat)),
        borderWidth: 3,
        borderColor: '#ffffff',
        hoverBorderWidth: 4,
      }],
    };
  }, [categoryData, categories]);

  const doughnutOptions = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          boxWidth: 15,
          font: { size: 11 },
          padding: 15,
          usePointStyle: true,
        }
      },
      title: {
        display: true,
        text: 'Répartition des Dépenses par Catégorie',
        font: { size: 16 }
      },
      tooltip: {
        callbacks: {
          label: function (context: any) {
            const label = context.label || '';
            const value = context.raw || 0;
            const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
            const percentage = ((value / total) * 100).toFixed(1);
            return `${label}: Ar ${value.toFixed(2)} (${percentage}%)`;
          }
        },
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 12,
        cornerRadius: 6
      }
    },
    cutout: '0',
  }), []);

  const barData = useMemo(() => {
    const calculateMonthlyData = (month: string, data: FinancialItem[]) => {
      return data
        .filter(item => item.date.startsWith(month))
        .reduce((sum, item) => sum + item.amount, 0);
    };

    return {
      labels: lastSixMonths.map(month => {
        const date = new Date(month + '-01');
        return date.toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' });
      }),
      datasets: [
        {
          label: 'Dépenses',
          data: lastSixMonths.map(month => calculateMonthlyData(month, expenses)),
          backgroundColor: 'rgba(255, 99, 132, 0.8)',
          borderColor: 'rgba(255, 99, 132, 1)',
          borderWidth: 2,
          borderRadius: 6,
        },
        {
          label: 'Revenus',
          data: lastSixMonths.map(month => calculateMonthlyData(month, incomes)),
          backgroundColor: 'rgba(54, 162, 235, 0.8)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 2,
          borderRadius: 6,
        },
      ],
    };
  }, [lastSixMonths, expenses, incomes]);

  const barOptions = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          font: { size: 12 },
          usePointStyle: true,
          padding: 20
        }
      },
      title: {
        display: true,
        text: 'Évolution Mensuelle des Revenus et Dépenses',
        font: { size: 16 }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 10,
        cornerRadius: 6,
        displayColors: true,
        callbacks: {
          label: function (context: any) {
            return `${context.dataset.label}: Ar ${context.raw.toFixed(2)}`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Montant (Ar)',
          font: { size: 12 }
        },
        grid: { color: 'rgba(0, 0, 0, 0.1)' }
      },
      x: {
        title: {
          display: true,
          text: 'Mois',
          font: { size: 12 }
        },
        grid: { display: false }
      },
    },
  }), []);

  const getCategoryColor = (categoryName: string) => {
    const category = categories.find(c => c.name === categoryName);
    return category ? category.color : '#CCCCCC';
  };

  const hasExpenseData = Object.keys(categoryData).length > 0;
  const hasBarData = lastSixMonths.some(month =>
    expenses.some(expense => expense.date.startsWith(month)) ||
    incomes.some(income => income.date.startsWith(month))
  );

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className='flex items-center gap-2 mb-6'>
        <FontAwesomeIcon icon={faChartLine} className="text-gray-700" />
        <h2 className="text-2xl font-bold text-gray-900">Visualisations</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Graphique circulaire des catégories */}
        <div>
          <h3 className="text-lg font-semibold mb-4 text-center text-gray-800">
            Répartition des Dépenses
          </h3>
          <div className="h-80">
            {hasExpenseData ? (
              <Doughnut data={doughnutData} options={doughnutOptions} />
            ) : (
              <NoDataMessage message="Aucune donnée de dépenses pour cette période" />
            )}
          </div>

          {hasExpenseData && (
            <CategoryDetails categoryData={categoryData} getCategoryColor={getCategoryColor} />
          )}
        </div>

        {/* Graphique en barres historique */}
        <div>
          <h3 className="text-lg font-semibold mb-4 text-center text-gray-800">
            Historique des Finances
          </h3>
          <div className="h-80">
            {hasBarData ? (
              <Bar data={barData} options={barOptions} />
            ) : (
              <NoDataMessage message="Aucune donnée disponible pour l'historique" />
            )}
          </div>

          <PeriodStats
            periodIncome={periodIncome}
            periodExpenses={periodExpenses}
            periodBalance={periodBalance}
          />
        </div>
      </div>
    </div>
  );
};

// Sous-composants
const NoDataMessage: React.FC<{ message: string }> = ({ message }) => (
  <div className="h-full flex items-center justify-center bg-gray-50 rounded-lg">
    <p className="text-gray-500 text-center">{message}</p>
  </div>
);

const CategoryDetails: React.FC<{
  categoryData: Record<string, number>;
  getCategoryColor: (name: string) => string | undefined;
}> = ({ categoryData, getCategoryColor }) => (
  <div className="mt-4 p-4 bg-gray-50 rounded-lg">
    <h4 className="font-semibold mb-3 text-gray-700 border-b pb-2">Détails par catégorie</h4>
    <ul className="space-y-2 max-h-40 overflow-y-auto">
      {Object.entries(categoryData)
        .sort(([, a], [, b]) => (b as number) - (a as number))
        .map(([category, amount]) => (
          <li key={category} className="flex justify-between items-center text-sm">
            <div className="flex items-center">
              <div
                className="w-3 h-3 rounded-full mr-2"
                style={{ backgroundColor: getCategoryColor(category) }}
              />
              <span className="text-gray-600">{category}</span>
            </div>
            <span className="font-medium text-gray-900">Ar {(amount as number).toFixed(2)}</span>
          </li>
        ))}
    </ul>
  </div>
);

const PeriodStats: React.FC<{
  periodIncome: number;
  periodExpenses: number;
  periodBalance: number;
}> = ({ periodIncome, periodExpenses, periodBalance }) => (
  <div className="mt-4 p-4 bg-gray-50 rounded-lg">
    <h4 className="font-semibold mb-3 text-gray-700 border-b pb-2">Statistiques de la Période</h4>
    <div className="grid grid-cols-2 gap-3 text-sm">
      <StatCard title="Revenus" value={periodIncome} bgColor="bg-green-100" textColor="text-green-800" valueColor="text-green-900" />
      <StatCard title="Dépenses" value={periodExpenses} bgColor="bg-red-100" textColor="text-red-800" valueColor="text-red-900" />
      <StatCard
        title="Solde Final"
        value={periodBalance}
        bgColor={periodBalance >= 0 ? 'bg-blue-100' : 'bg-orange-100'}
        textColor={periodBalance >= 0 ? 'text-blue-800' : 'text-orange-800'}
        valueColor={periodBalance >= 0 ? 'text-blue-900' : 'text-orange-900'}
        fullWidth
      />
    </div>
  </div>
);

const StatCard: React.FC<{
  title: string;
  value: number;
  bgColor: string;
  textColor: string;
  valueColor: string;
  fullWidth?: boolean;
}> = ({ title, value, bgColor, textColor, valueColor, fullWidth = false }) => (
  <div className={`${bgColor} p-3 rounded ${fullWidth ? 'col-span-2' : ''}`}>
    <div className={`${textColor} font-semibold`}>{title}</div>
    <div className={`${valueColor} font-bold text-lg`}>Ar {value.toFixed(2)}</div>
  </div>
);

export default Charts;