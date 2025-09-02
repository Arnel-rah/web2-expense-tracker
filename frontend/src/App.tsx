import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Auth from './pages/auth/Auth';
import Dashboard from './pages/Dashboard';
import Home from './pages/Home';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          <Route path='/' element={<Home/>}/>
          <Route path="/login" element={<Auth mode="login" />} />
          <Route path="/signup" element={<Auth mode="signup" />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;