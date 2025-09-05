import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartPie, faRefresh } from '@fortawesome/free-solid-svg-icons';
import { formatPeriod } from '../../../utils/utils.ts';

export interface HeaderProps {
  startDate: string;
  endDate: string;
  hasData: boolean;
  isLoading: boolean;
  onReload?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ startDate, endDate, hasData, isLoading, onReload }) => (
  <div className="flex items-center justify-between mb-8">
    <div className="flex items-center gap-3">
      <FontAwesomeIcon icon={faChartPie} className="text-gray-600 text-lg" />
      <h2 className="text-2xl font-bold text-gray-900">Résumé Financier</h2>
    </div>
    <div className="flex items-center gap-3">
      <span className="text-sm text-gray-600 bg-gray-50 px-4 py-2 rounded-full">
        {formatPeriod(startDate, endDate)}
      </span>
      {!hasData && onReload && (
        <button
          onClick={onReload}
          disabled={isLoading}
          className="flex items-center gap-2 text-sm bg-blue-100 text-blue-700 px-3 py-2 rounded-full hover:bg-blue-200 transition-colors disabled:opacity-50"
        >
          <FontAwesomeIcon icon={faRefresh} className={isLoading ? 'animate-spin' : ''} />
          {isLoading ? 'Chargement...' : 'Recharger'}
        </button>
      )}
    </div>
  </div>
);