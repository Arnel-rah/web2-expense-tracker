import List from "../components/ui/TransactionsListe";
import useGlobalFetch from "../hooks/useGlobalFetch";

export default function Transaction() {

  const incomeData = useGlobalFetch("income");
  const expneseData = useGlobalFetch("expense");

  const loading = incomeData.loading || expneseData.loading;
  const err = incomeData.error || expneseData.error;


  const data = [
    ...(incomeData.data || []),
    ...(expneseData.data || [])
  ]

  return (
    <>
      {/* <navbar/> */}
      {loading && <p>...</p>}
      {err && <p>{err}</p>}
      <List data={data} />
    </>
  )
}