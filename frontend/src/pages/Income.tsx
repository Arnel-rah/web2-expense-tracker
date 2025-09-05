import IncomeForm from "../components/form/IncomeForm";
import Header from "../components/layout/Header";
import List from "../components/ui/TransactionsListe";
import useGlobalFetch from "../hooks/useGlobalFetch";

export default function Income() {

//   const incomeData = useGlobalFetch("expense");

//   const loading = incomeData.loading;
//   const err = incomeData.error;


//   const data = [
//     ...(incomeData.data || [])
//   ]


    const data = [
    {
      id: 1,
      title: "Achat Supermarché",
      amount: 45.99,
      category: "Courses",
      date: "2025-09-01"
    },
    {
      id: 2,
      title: "Abonnement Netflix",
      amount: 13.99,
      category: "Divertissement",
      date: "2025-09-03"
    },
    {
      id: 3,
      title: "Essence",
      amount: 60.00,
      category: "Transport",
      date: "2025-09-04"
    }
  ];


  return (
    <>
      {/* {loading && <p>...</p>}
      {err && <p>{err}</p>} */}
      <Header />
      <div className="flex">
        <div className="w-2/5">
          <IncomeForm />
        </div>
        <div className="w-3/5">
          <List data={data} transaction={"income"} />
        </div>
      </div>
    </>
  )
}