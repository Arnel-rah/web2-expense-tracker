import React from 'react';
// import { logout } from '../../services/backend';
import Button from '../ui/Button';
import { useNavigate } from 'react-router-dom';

const Header: React.FC = () => {
  const navigate = useNavigate();
  const handleLogout = () => {
    logout();
    window.location.href = '/login';
  };

  const handleDashboard = () => {
    navigate("/dashboard")
  };
  
  const handleExpense = () => {
    navigate("/expenses")
  };

  const handleIncomes = () => {
    navigate("/incomes")
  };
  
  const handleProfil = () => {
    navigate("/profile")
  };

  return (
    <header className="bg-white shadow">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
        <div className="flex items-center text-3xl font-bold text-gray-900">
          <p>Exp</p>
          <img src="expense-logo.png" alt="expense-logo" className='size-15' />
          <p className='flex flex-col'>nse <span className='text-xs'>Tracker</span></p>
        </div>

        <div className="flex items-center gap-15 text-gray-600">
          <div className='flex items-center gap-5 font-semibold text-xl'>
            <p className='cursor-pointer hover:border-b-5 h-full border-gray-300 transition-all duration-200' onClick={handleDashboard}>Dashboard</p>
            <p className='cursor-pointer hover:border-b-5 h-full border-gray-300 transition-all duration-200' onClick={handleExpense}>Expense</p>
            <p className='cursor-pointer hover:border-b-5 h-full border-gray-300 transition-all duration-200' onClick={handleIncomes}>Income</p>
            <p className='cursor-pointer hover:border-b-5 h-full border-gray-300 transition-all duration-200' onClick={handleProfil}>Profil</p>
          </div>
          <Button onClick={handleLogout}>Logout</Button>
        </div>
      </div>
    </header>
  );
};

export default Header;