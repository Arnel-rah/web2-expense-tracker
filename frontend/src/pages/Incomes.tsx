import IncomeForm from "../components/form/IncomeForm";
import Header from "../components/layout/Header";
import List from "../components/ui/TransactionsListe";
import useGlobalFetch from "../hooks/useGlobalFetch";



export default function Income() {
    const { data, loading, error } = useGlobalFetch("incomes");

    return (
        <> 
            <Header />
            <div className="flex">
                <div className="w-2/5">
                    <IncomeForm />
                </div>
                <div className="w-3/5">
                    <List 
                        data={data ? [...data] : []}
                        transaction="income"
                        loading={loading}
                        err={error}
                    />
                </div>
            </div>
        </> 
    );
}