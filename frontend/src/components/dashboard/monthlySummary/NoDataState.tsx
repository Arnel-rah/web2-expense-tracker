import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartPie, faRefresh } from '@fortawesome/free-solid-svg-icons';

export interface NoDataStateProps {
  isLoading: boolean;
  onReload: () => void;
}

export const NoDataState: React.FC<NoDataStateProps> = ({ isLoading, onReload }) => (
  <div className="flex flex-col items-center justify-center py-12 text-center">
    <div className="text-gray-400 mb-4">
      <FontAwesomeIcon icon={faChartPie} size="3x" />
    </div>
    <h3 className="text-lg font-medium text-gray-500 mb-2">Aucune donnée disponible</h3>
    <p className="text-gray-400 mb-6">Les données financières n'ont pas encore été chargées.</p>
    <button
      onClick={onReload}
      disabled={isLoading}
      className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
    >
      <FontAwesomeIcon icon={faRefresh} className={isLoading ? 'animate-spin' : ''} />
      {isLoading ? 'Chargement en cours...' : 'Charger les données'}
    </button>
  </div>
);