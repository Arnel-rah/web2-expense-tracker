import React from 'react';
import { logout } from '../../services/backend';
import Button from '../ui/Button';

const Header: React.FC = () => {
  const handleLogout = () => {
    logout();
    window.location.href = '/login';
  };

  return (
    <header className="bg-white shadow">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
        <div className="flex items-center text-3xl font-bold text-gray-900">
          <p>Exp</p>
          <img src="expense-logo.png" alt="expense-logo" className='size-15' />
          <p className='flex flex-col'>nse <span className='text-xs'>Tracker</span></p>
        </div>
        <div className="flex items-center space-x-4">
          <Button onClick={handleLogout}>Logout</Button>
        </div>
      </div>
    </header>
  );
};

export default Header;