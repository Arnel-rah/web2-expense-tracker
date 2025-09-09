import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import Home from './pages/Home';
import Income from './pages/Incomes';
import Expense from './pages/Expenses';

function App() {

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path="/login" element={<Auth mode="login" />} />
          <Route path="/signup" element={<Auth mode="signup" />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/expenses" element={<Expense />} />
          <Route path="/incomes" element={<Income />} />
          <Route path="/categories" element={<></>} />
          <Route path="/profile" element={<></>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;