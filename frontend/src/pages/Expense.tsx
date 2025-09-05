import ExpenseForm from "../components/form/ExpenseForm";
import Header from "../components/layout/Header";
import List from "../components/ui/TransactionsListe";
import useGlobalFetch from "../hooks/useGlobalFetch";

export default function Expense() {

  const expneseData = useGlobalFetch("expense");

  const loading = expneseData.loading;
  const err = expneseData.error;


  const data = [
    ...(expneseData.data || [])
  ]




  return (
    <>
      <Header />
      <div className="flex">
        <div className="w-2/5">
          <ExpenseForm />
        </div>
        <div className="w-3/5">
          <List data={data} transaction="expense" loading={loading} err={err}/>
          
        </div>
      </div>
    </>
  )
}