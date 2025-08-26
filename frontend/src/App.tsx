import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Auth from './pages/auth/Auth';
import Dashboard from './pages/Dashboard';
import Home from './pages/Home';
import Header from './components/layout/Header';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          <Route path='/' element={<Home/>}/>
          <Route path="/login" element={<Auth mode="login" />} />
          <Route path="/signup" element={<Auth mode="signup" />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/expenses" element={<></>} />
          <Route path="/expenses/new" element={<></>} />
          <Route path="/expenses/:id/edit" element={<></>} />
          <Route path="/incomes" element={<></>} />
          <Route path="/incomes/new" element={<></>} />
          <Route path="/categories" element={<></>} />
          <Route path="/profile" element={<></>} />
          <Route path="/receipts/:idExpense" element={<></>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;