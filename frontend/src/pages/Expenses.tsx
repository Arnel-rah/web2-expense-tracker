import { useState } from "react";
import ExpenseForm from "../components/form/ExpenseForm";
import Header from "../components/layout/Header";
import List from "../components/ui/TransactionsListe";
import useGlobalFetch from "../hooks/useGlobalFetch";
import { apiFetch } from "../api/api";

export default function Expense() {
  const { data, loading, error, refetch } = useGlobalFetch("expenses");
  const [editingExpense, setEditingExpense] = useState(null); 

  const handleEdit = (expense: any) => {
    setEditingExpense(expense); 
  };

  const handleDelete = async (id: number | string) => {
    if (confirm("Are you sure you want to delete this expense?")) {
      try {
        await apiFetch(`/expenses/${id}`, { method: "DELETE" });
        refetch(); 
      } catch (err) {
        console.error("Delete error:", err);
      }
    }
  };

  const handleFormSuccess = () => {
    setEditingExpense(null); 
  };

  return (
    <>
      <Header />
      <div className="flex">
        <div className="w-2/5">
          <ExpenseForm 
            existingExpense={editingExpense} 
            onSuccess={handleFormSuccess}
          />
        </div>
        <div className="w-3/5">
          <List
            data={data || []}
            transaction="expense"
            loading={loading}
            err={error}
            onEdit={handleEdit} 
            onDelete={handleDelete} 
          />
        </div>
      </div>
    </>
  );
}