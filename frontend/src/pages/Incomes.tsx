import IncomeForm from "../components/form/IncomeForm";
import Header from "../components/layout/Header";
import List from "../components/ui/TransactionsListe";
import useGlobalFetch from "../hooks/useGlobalFetch";

export default function Income() {

  const incomeData = useGlobalFetch("incomes");

  const loading = incomeData.loading;
  const err = incomeData.error;


  const data = [
    ...(incomeData.data || [])
  ]




  return (
    <>
      <Header />
      <div className="flex">
        <div className="w-2/5">
          <IncomeForm />
        </div>
        <div className="w-3/5">
          <List data={data} transaction={"income"} loading={loading} err={err}/>
        </div>
      </div>
    </>
  )
}