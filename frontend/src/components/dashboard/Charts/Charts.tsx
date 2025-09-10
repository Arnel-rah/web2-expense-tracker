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
import type { Category, Expense, Income } from '../../../types';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);

interface ChartsProps {
  expenses: Expense[];
  incomes: Income[];
  startDate: string;
  endDate: string;
  selectedCategories: string[];
  categories: Category[];
}

const Charts: React.FC<ChartsProps> = ({ expenses, incomes, startDate, endDate, selectedCategories, categories }) => {
  const { periodIncome, periodExpenses, periodBalance, categoryData, lastSixMonths } = useMemo(() => {
    const start = new Date(startDate);
    const end = new Date(endDate);

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
          (expense.category_id && selectedCategories.includes(expense.category_id));
        return matchesPeriod && matchesCategory;
      })
      .reduce((sum, expense) => sum + expense.amount, 0);

    const categoryData = expenses
      .filter(expense => {
        const expenseDate = new Date(expense.date);
        const matchesPeriod = expenseDate >= start && expenseDate <= end;
        const matchesCategory = selectedCategories.length === 0 || 
          (expense.category_id && selectedCategories.includes(expense.category_id));
        return matchesPeriod && matchesCategory;
      })
      .reduce((acc, expense) => {
        if (expense.category_id) {
          acc[expense.category_id] = (acc[expense.category_id] || 0) + expense.amount;
        }
        return acc;
      }, {} as Record<string, number>);

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
      periodBalance: periodIncome - periodExpenses,
      categoryData,
      lastSixMonths: getLastSixMonths()
    };
  }, [expenses, incomes, startDate, endDate, selectedCategories]);

  const categoryColors = useMemo(() => [
    '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40', 
    '#FF6384', '#C9CBCF', '#7CFC00', '#20B2AA', '#FF00FF', '#00FFFF',
    '#FFD700', '#ADFF2F', '#FF4500', '#DA70D6', '#00BFFF', '#FF6347',
    '#40E0D0', '#EE82EE', '#F5DEB3', '#00FA9A', '#FF69B4', '#BA55D3'
  ], []);

  const doughnutData = useMemo(() => {
    const labels = Object.keys(categoryData);
    return {
      labels,
      datasets: [{
        data: Object.values(categoryData),
        backgroundColor: labels.map((_, index) => categoryColors[index % categoryColors.length]),
        hoverBackgroundColor: labels.map((_, index) => categoryColors[index % categoryColors.length]),
        borderWidth: 3,
        borderColor: '#ffffff',
        hoverBorderWidth: 4,
      }],
    };
  }, [categoryData, categoryColors]);

  const doughnutOptions = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'bottom' as const, labels: { boxWidth: 15, font: { size: 11 }, padding: 15, usePointStyle: true } },
      title: { display: true, text: 'Répartition des Dépenses par Catégorie', font: { size: 16 } },
      tooltip: {
        callbacks: {
          label: function (context: any) {
            const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
            const percentage = ((context.raw / total) * 100).toFixed(1);
            return `${context.label}: Ar ${context.raw} (${percentage}%)`;
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
    const calculateMonthlyData = (month: string, data: Expense[] | Income[]) => {
      return data.filter(item => {
        // Vérification que item.date n'est pas null avant d'utiliser startsWith
        return item.date && item.date.startsWith(month);
      }).reduce((sum, item) => sum + item.amount, 0);
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
      legend: { position: 'top' as const, labels: { font: { size: 12 }, usePointStyle: true, padding: 20 } },
      title: { display: true, text: 'Évolution Mensuelle des Revenus et Dépenses', font: { size: 16 } },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 10,
        cornerRadius: 6,
        displayColors: true,
        callbacks: { label: (context: any) => `${context.dataset.label}: Ar ${context.raw}` }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        title: { display: true, text: 'Montant (Ar)', font: { size: 12 } },
        grid: { color: 'rgba(0, 0, 0, 0.1)' }
      },
      x: {
        title: { display: true, text: 'Mois', font: { size: 12 } },
        grid: { display: false }
      },
    },
  }), []);

  const getCategoryColor = (categoryName: string) => {
    const index = Object.keys(categoryData).indexOf(categoryName);
    return index !== -1 ? categoryColors[index % categoryColors.length] : '#CCCCCC';
  };

  const hasExpenseData = Object.keys(categoryData).length > 0;
  const hasBarData = lastSixMonths.some(month =>
    expenses.some(expense => expense.date && expense.date.startsWith(month)) ||
    incomes.some(income => income.date && income.date.startsWith(month))
  );

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className='flex items-center gap-2 mb-6'>
        <FontAwesomeIcon icon={faChartLine} className="text-gray-700" />
        <h2 className="text-2xl font-bold text-gray-900">Visualisations</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <h3 className="text-lg font-semibold mb-4 text-center text-gray-800">Répartition des Dépenses</h3>
          <div className="h-80">
            {hasExpenseData ? <Doughnut data={doughnutData} options={doughnutOptions} /> : 
              <div className="h-full flex items-center justify-center bg-gray-50 rounded-lg">
                <p className="text-gray-500 text-center">Aucune donnée de dépenses pour cette période</p>
              </div>
            }
          </div>

          {hasExpenseData && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <h4 className="font-semibold mb-3 text-gray-700 border-b pb-2">Détails par catégorie</h4>
              <ul className="space-y-2 max-h-40 overflow-y-auto">
                {Object.entries(categoryData)
                  .sort(([, a], [, b]) => b - a)
                  .map(([category, amount]) => (
                    <li key={category} className="flex justify-between items-center text-sm">
                      <div className="flex items-center">
                        <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: getCategoryColor(category) }} />
                        <span className="text-gray-600">{category}</span>
                      </div>
                      <span className="font-medium text-gray-900">Ar {amount}</span>
                    </li>
                  ))}
              </ul>
            </div>
          )}
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-4 text-center text-gray-800">Historique des Finances</h3>
          <div className="h-80">
            {hasBarData ? <Bar data={barData} options={barOptions} /> : 
              <div className="h-full flex items-center justify-center bg-gray-50 rounded-lg">
                <p className="text-gray-500 text-center">Aucune donnée disponible pour l'historique</p>
              </div>
            }
          </div>

          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-semibold mb-3 text-gray-700 border-b pb-2">Statistiques de la Période</h4>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="bg-green-100 p-3 rounded">
                <div className="text-green-800 font-semibold">Revenus</div>
                <div className="text-green-900 font-bold text-lg">Ar {periodIncome}</div>
              </div>
              <div className="bg-red-100 p-3 rounded">
                <div className="text-red-800 font-semibold">Dépenses</div>
                <div className="text-red-900 font-bold text-lg">Ar {periodExpenses}</div>
              </div>
              <div className={`${periodBalance >= 0 ? 'bg-blue-100' : 'bg-orange-100'} p-3 rounded col-span-2`}>
                <div className={`${periodBalance >= 0 ? 'text-blue-800' : 'text-orange-800'} font-semibold`}>Solde Final</div>
                <div className={`${periodBalance >= 0 ? 'text-blue-900' : 'text-orange-900'} font-bold text-lg`}>Ar {periodBalance}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Charts;