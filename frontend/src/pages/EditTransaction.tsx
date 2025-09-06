import { useParams, useLocation } from "react-router-dom";
import useGlobalFetch from "../hooks/useGlobalFetch";
import IncomeForm from "../components/form/IncomeForm";
import ExpenseForm from "../components/form/ExpenseForm";

export default function EditTransaction() {
  const { id } = useParams();
  const location = useLocation();

  const isIncome = location.pathname.startsWith("/income");


  const { data, loading, error } = useGlobalFetch(
    `${isIncome ? "income" : "expense"}/${id}`
  );

  if (loading) return <p>Chargement...</p>;
  if (error) return <p>Erreur : {error}</p>;
  if (!data) return <p>Aucune donnée trouvée</p>;

  return isIncome ? (
    <IncomeForm existingIncome={data} />
  ) : (
    <ExpenseForm existingExpense={data} />
  );
}
