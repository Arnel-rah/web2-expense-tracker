import ExpenseForm from "../components/form/ExpenseForm";
import Header from "../components/layout/Header";
import List from "../components/ui/TransactionsListe";
import useGlobalFetch from "../hooks/useGlobalFetch";

export default function Expense() {
  const { data, loading, error } = useGlobalFetch("expenses");

  return (
    <>
      <Header />
      <div className="flex">
        <div className="w-2/5">
          <ExpenseForm />
        </div>
        <div className="w-3/5">
          <List
            data={data ? [...data] : []}
            transaction="expense"
            loading={loading}
            err={error}
          />
        </div>
      </div>
    </>
  );
}
