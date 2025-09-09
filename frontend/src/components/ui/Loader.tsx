import { useState, useEffect } from 'react';

export const Loader = () => {
  const [dots, setDots] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => prev.length >= 3 ? '' : prev + '.');
    }, 500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full h-screen flex flex-col items-center justify-center">
      <div className="relative">
        <div className="animate-spin rounded-full border-4 border-gray-200 border-t-blue-600 h-8 w-8" />
        <div className="absolute inset-0 animate-spin rounded-full border-4 border-transparent border-r-blue-400 h-8 w-8" 
             style={{ animationDelay: '150ms', animationDuration: '1.5s' }} />
      </div>
      <p className="mt-4 text-gray-600 text-sm animate-pulse">
        Chargement{dots}
      </p>
    </div>
  );
};