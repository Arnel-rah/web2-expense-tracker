import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import Home from './pages/Home';
import Income from './pages/Incomes';
import Expense from './pages/Expenses';

function App() {
  const PrivateRoute = (Component: React.FC) => {
    return () => {
      const token = localStorage.getItem("token");
      return token ? <Component /> : <Navigate to="/login" replace />;
    };
  };

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path="/login" element={<Auth mode="login" />} />
          <Route path="/signup" element={<Auth mode="signup" />} />

          <Route path="/dashboard" element={PrivateRoute(Dashboard)()} />
          <Route path="/expenses" element={PrivateRoute(Expense)()} />
          <Route path="/incomes" element={PrivateRoute(Income)()} />
          <Route path="/categories" element={PrivateRoute(() => <></>)()} />
          <Route path="/profile" element={PrivateRoute(() => <></>)()} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;