import { useEffect, useState } from "react";
import { summaryService } from "../services";
import type { SummaryResponse } from "../types/summary.types";

export const useSummary = () => {
  const [summary, setSummary] = useState<SummaryResponse>();
  const [monthlySummary, setMonthlySummary] = useState<SummaryResponse>();
//   const [alerts, setAlerts] = useState<SummaryResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [summaryData, monthlyData
        // , alertsData
    ] = await Promise.all([
        summaryService.summary(),
        summaryService.monthlySummary(),
        // summaryService.alerts()
      ]);

      console.log("Données brutes de l'API:", summaryData, monthlyData);

      setSummary(summaryData);
      setMonthlySummary(monthlyData);
    //   setAlerts(alertsData);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur de chargement des données';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return { 
    summary, 
    monthlySummary, 
    // alerts,
    loading,
    error,
    refetch: loadData
  };
};