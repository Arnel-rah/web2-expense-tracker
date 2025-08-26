import React from 'react';
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

// Enregistrer les composants Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

interface ChartsProps {
  expenses: any[];
  incomes: any[];
  selectedMonth: string;
  selectedCategories: string[];
}

const Charts: React.FC<ChartsProps> = ({
  expenses,
  incomes,
  selectedMonth,
  selectedCategories
}) => {
  // Données pour le graphique circulaire (Doughnut)
  const categoryData = expenses
    .filter(expense => {
      const matchesMonth = expense.date.startsWith(selectedMonth);
      const matchesCategory = selectedCategories.length === 0 || 
                            selectedCategories.includes(expense.category);
      return matchesMonth && matchesCategory;
    })
    .reduce((acc, expense) => {
      acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
      return acc;
    }, {} as Record<string, number>);

  // Couleurs pour les catégories
  const categoryColors = [
    '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', 
    '#9966FF', '#FF9F40', '#8AC926', '#1982C4',
    '#6A4C93', '#F15BB5', '#00BBF9', '#00F5D4',
    '#FB5607', '#8338EC', '#3A86FF', '#FF006E',
    '#FF9E00', '#A4036F', '#048BA8', '#16DB93'
  ];

  // Préparer les données pour le graphique circulaire
  const doughnutData = {
    labels: Object.keys(categoryData),
    datasets: [
      {
        data: Object.values(categoryData),
        backgroundColor: categoryColors.slice(0, Object.keys(categoryData).length),
        hoverBackgroundColor: categoryColors.slice(0, Object.keys(categoryData).length),
        borderWidth: 3,
        borderColor: '#ffffff',
        hoverBorderWidth: 4,
      },
    ],
  };

  // Options pour Doughnut
  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          boxWidth: 15,
          font: {
            size: 11
          },
          padding: 15,
          usePointStyle: true,
        }
      },
      title: {
        display: true,
        text: 'Répartition des Dépenses par Catégorie',
        font: {
          size: 16,
        }
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            const label = context.label || '';
            const value = context.raw || 0;
            const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
            const percentage = ((value / total) * 100).toFixed(1);
            return `${label}: $${value.toFixed(2)} (${percentage}%)`;
          }
        },
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 12,
        cornerRadius: 6
      }
    },
    cutout: '0',
  };

  // Données pour le graphique en barres (6 derniers mois)
  const getLastSixMonths = () => {
    const months = [];
    const currentDate = new Date(selectedMonth + '-01');
    
    for (let i = 5; i >= 0; i--) {
      const date = new Date(currentDate);
      date.setMonth(date.getMonth() - i);
      months.push(date.toISOString().slice(0, 7));
    }
    return months;
  };

  const lastSixMonths = getLastSixMonths();

  const calculateMonthlyData = (month: string, data: any[]) => {
    return data
      .filter(item => item.date.startsWith(month))
      .reduce((sum, item) => sum + item.amount, 0);
  };

  const barData = {
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
        hoverBackgroundColor: 'rgba(255, 99, 132, 1)',
        hoverBorderColor: 'rgba(255, 99, 132, 1)',
      },
      {
        label: 'Revenus',
        data: lastSixMonths.map(month => calculateMonthlyData(month, incomes)),
        backgroundColor: 'rgba(54, 162, 235, 0.8)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 2,
        borderRadius: 6,
        hoverBackgroundColor: 'rgba(54, 162, 235, 1)',
        hoverBorderColor: 'rgba(54, 162, 235, 1)',
      },
    ],
  };

  // Options pour Bar (simplifiées pour éviter les erreurs TypeScript)
  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          font: {
            size: 12,
          },
          usePointStyle: true,
          padding: 20
        }
      },
      title: {
        display: true,
        text: 'Évolution Mensuelle des Revenus et Dépenses',
        font: {
          size: 16,
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 10,
        cornerRadius: 6,
        displayColors: true,
        callbacks: {
          label: function(context: any) {
            return `${context.dataset.label}: $${context.raw.toFixed(2)}`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Montant ($)',
          font: {
            size: 12,
          }
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.1)'
        }
      },
      x: {
        title: {
          display: true,
          text: 'Mois',
          font: {
            size: 12,
          }
        },
        grid: {
          display: false
        }
      },
    },
  };

  // Calculer les totaux pour le mois sélectionné
  const currentMonthIncome = calculateMonthlyData(selectedMonth, incomes);
  const currentMonthExpenses = calculateMonthlyData(selectedMonth, expenses);
  const currentMonthBalance = currentMonthIncome - currentMonthExpenses;

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Visualisations</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Graphique circulaire des catégories */}
        <div>
          <h3 className="text-lg font-semibold mb-4 text-center text-gray-800">
            Répartition des Dépenses
          </h3>
          <div className="h-80">
            {Object.keys(categoryData).length > 0 ? (
              <Doughnut data={doughnutData} options={doughnutOptions} />
            ) : (
              <div className="h-full flex items-center justify-center bg-gray-50 rounded-lg">
                <p className="text-gray-500 text-center">
                  Aucune donnée de dépenses<br />pour ce mois
                </p>
              </div>
            )}
          </div>
          
          {/* Légende détaillée */}
          {Object.keys(categoryData).length > 0 && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <h4 className="font-semibold mb-3 text-gray-700 border-b pb-2">
                Détails par catégorie ({selectedMonth})
              </h4>
              <ul className="space-y-2 max-h-40 overflow-y-auto">
                {Object.entries(categoryData)
                  .sort(([, a], [, b]) => (b as number) - (a as number))
                  .map(([category, amount], index) => (
                    <li key={category} className="flex justify-between items-center text-sm">
                      <div className="flex items-center">
                        <div 
                          className="w-3 h-3 rounded-full mr-2"
                          style={{ backgroundColor: categoryColors[index] }}
                        />
                        <span className="text-gray-600">{category}</span>
                      </div>
                      <span className="font-medium text-gray-900">
                        ${(amount as number).toFixed(2)}
                      </span>
                    </li>
                  ))}
              </ul>
            </div>
          )}
        </div>

        {/* Graphique en barres historique */}
        <div>
          <h3 className="text-lg font-semibold mb-4 text-center text-gray-800">
            Historique des Finances
          </h3>
          <div className="h-80">
            {lastSixMonths.some(month => 
              calculateMonthlyData(month, expenses) > 0 || 
              calculateMonthlyData(month, incomes) > 0
            ) ? (
              <Bar data={barData} options={barOptions} />
            ) : (
              <div className="h-full flex items-center justify-center bg-gray-50 rounded-lg">
                <p className="text-gray-500 text-center">
                  Aucune donnée disponible<br />pour l'historique
                </p>
              </div>
            )}
          </div>
          
          {/* Statistiques du mois sélectionné */}
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-semibold mb-3 text-gray-700 border-b pb-2">
              Statistiques du Mois ({selectedMonth})
            </h4>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="bg-green-100 p-3 rounded">
                <div className="text-green-800 font-semibold">Revenus</div>
                <div className="text-green-900 font-bold text-lg">
                  ${currentMonthIncome.toFixed(2)}
                </div>
              </div>
              <div className="bg-red-100 p-3 rounded">
                <div className="text-red-800 font-semibold">Dépenses</div>
                <div className="text-red-900 font-bold text-lg">
                  ${currentMonthExpenses.toFixed(2)}
                </div>
              </div>
              <div className={`p-3 rounded col-span-2 ${
                currentMonthBalance >= 0 ? 'bg-blue-100' : 'bg-orange-100'
              }`}>
                <div className={
                  currentMonthBalance >= 0 ? 'text-blue-800 font-semibold' : 'text-orange-800 font-semibold'
                }>
                  Solde Final
                </div>
                <div className={
                  currentMonthBalance >= 0 ? 'text-blue-900 font-bold text-lg' : 'text-orange-900 font-bold text-lg'
                }>
                  ${currentMonthBalance.toFixed(2)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Charts;