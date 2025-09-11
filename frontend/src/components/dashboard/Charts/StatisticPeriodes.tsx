import type { StatisticsProps } from "../../../types";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faChartBar,
    faMoneyBillWave,
    faCreditCard,
    faWallet,
    faTurnUp,
    faTurnDown
} from '@fortawesome/free-solid-svg-icons';

export const Statistics = ({ periodIncomes, periodExpenses, periodBalance }: StatisticsProps) => {
    return (
        <div className="mt-8 p-8 bg-white rounded-2xl border border-gray-100 shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between mb-8 pb-6 border-b border-gray-100">
                <div className="flex items-center gap-4">
                    <FontAwesomeIcon icon={faChartBar} className="text-blue-600 text-xl" />
                    <div>
                        <h4 className="text-xl font-bold text-gray-900">Statistiques Financières</h4>
                        <p className="text-gray-500 text-sm mt-1">Aperçu de votre période actuelle</p>
                    </div>
                </div>

                <div className="text-right">
                    <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold ${periodBalance >= 0
                        ? 'bg-green-50 text-green-700 border border-green-200'
                        : 'bg-red-50 text-red-700 border border-red-200'
                        }`}>
                        <FontAwesomeIcon
                            icon={periodBalance >= 0 ? faTurnUp : faTurnDown}
                            className="text-xs"
                        />
                    </div>
                </div>
            </div>
            <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-8">
                <div className="group relative bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-2xl border border-green-100 hover:shadow-lg hover:scale-105 transition-all duration-300">
                    <div className="absolute top-4 right-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <FontAwesomeIcon icon={faMoneyBillWave} className="text-green-600 text-6xl" />
                    </div>

                    <div className="relative z-10">
                        <div className="mt-6">
                            <div className="flex flex-col items-center gap-4 mb-4">
                                <h5 className="text-green-800 font-semibold text-lg">Revenus</h5>
                            </div>
                            <div className="text-2xl font-bold text-green-900 mb-2">
                                {periodIncomes.toLocaleString('fr-FR')}
                                <span className="text-xs">Ar</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="group relative bg-gradient-to-br from-red-50 to-rose-50 p-6 rounded-2xl border border-red-100 hover:shadow-lg hover:scale-105 transition-all duration-300">
                    <div className="absolute top-4 right-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <FontAwesomeIcon icon={faCreditCard} className="text-red-600 text-6xl" />
                    </div>

                    <div className="relative z-10">
                        <div className="mt-6">
                            <div className="flex flex-col items-center gap-4 mb-4">
                                <h5 className="text-red-800 font-semibold text-lg">Dépenses</h5>
                            </div>
                            <div className="text-2xl font-bold text-red-900 mb-2">
                                {periodExpenses.toLocaleString('fr-FR')}
                                <span className="text-xs">Ar</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className={`group relative p-6 rounded-2xl border hover:shadow-lg hover:scale-105 transition-all duration-300 ${periodBalance >= 0
                    ? 'bg-gradient-to-br from-indigo-50 to-blue-50 border-indigo-100'
                    : 'bg-gradient-to-br from-orange-50 to-amber-50 border-orange-100'
                    } lg:col-span-1 md:col-span-2`}>
                    <div className={`absolute top-4 right-4 opacity-10 group-hover:opacity-20 transition-opacity ${periodBalance >= 0 ? 'text-indigo-600' : 'text-orange-600'
                        }`}>
                        <FontAwesomeIcon icon={faWallet} className="text-6xl" />
                    </div>

                    <div className="relative z-10">
                        <div className="flex items-center gap-4 mt-6 mb-4">
                            <h5 className={`font-semibold text-lg ${periodBalance >= 0 ? 'text-indigo-800' : 'text-orange-800'
                                }`}>
                                Solde
                            </h5>
                        </div>

                        <div className="text-2xl font-bold text-orange-900 mb-2">
                            {periodBalance.toFixed(2)}
                            <span className="text-xs">Ar</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}