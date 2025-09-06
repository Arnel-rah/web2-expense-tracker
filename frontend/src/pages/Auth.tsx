import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Input from '../components/common/Input';
import Button from '../components/common/Button';

interface AuthProps {
  mode: 'login' | 'signup';
}

interface AuthResponse {
  token?: string;
  message?: string;
  user?: {
    id: number;
    email: string;
    createdAt: string;
  };
}

const Auth: React.FC<AuthProps> = ({ mode }) => {
  const API_BASE_URL = 'http://localhost:8080/api';
  
  const [email, setEmail] = useState(mode === 'login' ? 'user@gmail.com' : '');
  const [password, setPassword] = useState(mode === 'login' ? '12345678' : '');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data: AuthResponse = await response.json();
      
      if (response.ok && data.token) {
        localStorage.setItem('token', data.token);
        return true;
      } else {
        setError(data.message || 'Login failed');
        return false;
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('Cannot connect to server. Please make sure the backend is running on port 8080.');
      return false;
    }
  };

  const signup = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data: AuthResponse = await response.json();
      
      if (response.ok && data.token) {
        localStorage.setItem('token', data.token);
        return true;
      } else {
        setError(data.message || 'Registration failed');
        return false;
      }
    } catch (error) {
      console.error('Signup error:', error);
      setError('Cannot connect to server. Please make sure the backend is running on port 8080.');
      return false;
    }
  };

  useEffect(() => {
    if (mode === 'login') {
      setEmail('user@gmail.com');
      setPassword('12345678');
    } else {
      setEmail('');
      setPassword('');
      setConfirmPassword('');
    }
    setError('');
  }, [mode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      if (mode === 'signup') {
        if (password !== confirmPassword) {
          setError("Passwords don't match");
          setIsLoading(false);
          return;
        }
        if (password.length < 6) {
          setError("Password must be at least 6 characters long");
          setIsLoading(false);
          return;
        }
      }

      const success = mode === 'login' 
        ? await login(email, password)
        : await signup(email, password);

      if (success) {
        navigate('/dashboard');
      }
    } catch (err) {
      setError(`An error occurred during ${mode}`);
      console.error('Auth error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const isSignupMode = mode === 'signup';
  const title = 'Expense Tracker';
  const descriptionTitle = isSignupMode ? 'Create a new account' : 'Continue with your account';
  const switchPrompt = isSignupMode ? "Already have an account? " : "Don't have an account? ";
  const switchLink = isSignupMode ? '/login' : '/signup';
  const switchText = isSignupMode ? 'Login' : 'Sign up';
  const buttonText = isSignupMode ? 'Sign up' : 'Login';

  return (
    <div className="min-h-screen flex flex-row-reverse items-center justify-around py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-md w-full space-y-10 bg-white p-8 rounded-xl shadow-lg">
        <div className='space-y-2 flex flex-col items-center'>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            {title}
          </h2>
          <p className='text-gray-400 text-xs'>
            {descriptionTitle}
          </p>
        </div>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md">
            {error}
          </div>
        )}
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <Input
              label="Email address"
              name="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            
            <Input
              label="Password"
              name="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            
            {isSignupMode && (
              <Input
                label="Confirm Password"
                name="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            )}
          </div>

          <Button
            type="submit"
            isLoading={isLoading}
            className="w-full"
            disabled={isLoading}
          >
            {buttonText}
          </Button>
          
          <p className="mt-2 text-center text-sm text-gray-600">
            {switchPrompt}
            <Link
              to={switchLink}
              className="font-medium text-blue-600 hover:text-blue-500 transition-colors"
            >
              {switchText}
            </Link>
          </p>
        </form>
      </div>
      <div>
        <img src="./expense-logo.png" alt="logo expense" />
      </div>
    </div>
  );
};

export default Auth;