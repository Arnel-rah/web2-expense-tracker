import { useState } from "react";
import IncomeForm from "../components/form/IncomeForm";
import Header from "../components/layout/Header";
import List from "../components/ui/TransactionsListe";
import useGlobalFetch from "../hooks/useGlobalFetch";
import { apiFetch } from "../api/api";



export default function Income() {
    const { data, loading, error, refetch } = useGlobalFetch("incomes");
    const [editingIncome, setEditingIncome] = useState(null);

    const handleEdit = (income: any) => {
        setEditingIncome(income)
    }

    const handleDelete = async (id: number | string) => {
        if (confirm("Are you sure you want to dele this income?")) {
            try {
                await apiFetch(`/expenses/${id}`, { method: "DELETE" });
                refetch();
            } catch (err) {
                console.error("Delete error:", err);
            }
        }
    };


    const handleFormSuccess = () => {
        setEditingIncome(null);
        refetch();
    }

    return (
        <>
            <Header />
            <div className="flex">
                <div className="w-2/5">
                    <IncomeForm 
                    existingIncome={editingIncome}
                    onSuccess={handleFormSuccess}
                    />
                </div>
                <div className="w-3/5">
                    <List
                        data={data || []}
                        transaction="income"
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