import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import { login, signup } from '../../services/backend';

interface AuthProps {
  mode: 'login' | 'signup';
}

const Auth: React.FC<AuthProps> = ({ mode }) => {
  // Valeurs par défaut pour le login
  const [email, setEmail] = useState(mode === 'login' ? 'demo@example.com' : '');
  const [password, setPassword] = useState(mode === 'login' ? 'password123' : '');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Réinitialiser les champs quand on change de mode (login/signup)
  useEffect(() => {
    if (mode === 'login') {
      setEmail('demo@example.com');
      setPassword('password123');
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
        else {
          navigate("/dashboard")
        }
      }

      const success = mode === 'login' 
        ? await login(email, password)
        : await signup(email, password);

      if (success) {
        navigate('/dashboard');
      } else {
        setError(mode === 'login' 
          ? 'Invalid email or password'
          : 'Failed to create account. Email might already exist.'
        );
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