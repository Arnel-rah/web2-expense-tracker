import React from 'react';
import Button from '../ui/Button';
import { useNavigate } from 'react-router-dom';
import { storageService } from '../../services/storage.service';

const Header: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    storageService.clearAuth();
    navigate("/login");
  }

  return (
  <header className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50">
    <div className="max-w-7xl mx-auto py-4 px-6 flex justify-between items-center">
      <div className="flex items-center gap-2 text-2xl font-extrabold text-gray-900">
        <p className="tracking-tight">Exp</p>
        <img src="expense-logo.png" alt="expense-logo" className="w-10 h-10 drop-shadow-sm" />
        <p className="flex flex-col leading-none">
          nse <span className="text-xs font-medium text-blue-600">Tracker</span>
        </p>
      </div>

      <nav className="hidden md:flex items-center gap-10 font-semibold text-gray-700">
        {[
          { name: "Dashboard", path: "/dashboard" },
          { name: "Expense", path: "/expenses" },
          { name: "Income", path: "/incomes" },
          { name: "Profile", path: "/profile" },
        ].map((item) => (
          <p
            key={item.name}
            className="cursor-pointer relative group transition-all"
            onClick={() => navigate(item.path)}
          >
            {item.name}
            <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
          </p>
        ))}
      </nav>

      <div className="flex items-center gap-4">
        <Button
          onClick={handleLogout}
          className="bg-blue-600 text-white px-5 py-2.4 rounded-lg shadow-md hover:bg-blue-700 transition-colors"
        >
          Logout
        </Button>
      </div>
    </div>
  </header>
);

};

export default Header;