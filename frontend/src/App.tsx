import { BrowserRouter as Router, Routes, Route, data } from 'react-router-dom';
import Auth from './pages/auth/Auth';
import Dashboard from './pages/Dashboard';
import Home from './pages/Home';
import List from './components/ui/TransactionsListe';
import Transaction from './pages/Transaction';
import ExpenseForm from './components/form/ExpenseForm';
import IncomeForm from './components/form/IncomeForm';
import EditTransaction from './pages/EditTransaction';

function App() {

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path="/login" element={<Auth mode="login" />} />
          <Route path="/signup" element={<Auth mode="signup" />} />
          <Route path="/dashboard" element={<Dashboard />} />


          <Route path='/transaction' element={<Transaction/>} />

          <Route path='/income/new' element={<IncomeForm/>}/>
          <Route path='/income/:id/edit' element={<EditTransaction />}/>
          <Route path='/expense/new' element={<ExpenseForm/>}/>
        </Routes>
      </div>
    </Router>
  );
}

export default App;