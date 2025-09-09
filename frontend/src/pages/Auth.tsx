import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { useAuth } from '../hooks/useAuth';
import type { AuthFormData, AuthProps } from '../types';

const Auth: React.FC<AuthProps> = ({ mode }) => {
  const formValue = {
    email: mode === 'login' ? 'user@gmail.com' : '',
    password: mode === 'login' ? '12345678' : '',
    confirmPassword: ''
  }
  const [formData, setFormData] = useState<AuthFormData>(formValue);
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login, signup, loading: authLoading, error: authError } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    setFormData(formValue)
    setFormError('');
  }, [mode]);

  const validateForm = () => {
    if (!formData.email || !formData.password) {
      setFormError('Please fill in all fields');
      return false;
    }

    if (mode === 'signup') {
      if (formData.password !== formData.confirmPassword) {
        setFormError("Passwords don't match");
        return false;
      }
      if (formData.password.length < 6) {
        setFormError("Password must be at least 6 characters long");
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    setIsSubmitting(true);

    if (!validateForm()) {
      setIsSubmitting(false);
      return;
    }

    try {
      console.log('Tentative de connexion avec:', formData.email);
      const result = mode === 'login'
        ? await login(formData.email, formData.password)
        : await signup(formData.email, formData.password);

      console.log('Réponse reçue:', result);

      if (result.token) {
        console.log('Token reçu, navigation vers dashboard');
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Erreur complète:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: keyof typeof formData) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData(prev => ({ ...prev, [field]: e.target.value }));
    };

  const isSignupMode = mode === 'signup';
  const error = formError || authError;
  const isLoading = isSubmitting || authLoading; // Combine les deux loadings

  return (
    <div className="min-h-screen flex flex-row-reverse items-center justify-around py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-md w-full space-y-10 bg-white p-8 rounded-xl shadow-lg">
        <div className="space-y-2 flex flex-col items-center">
          <h2 className="text-center text-3xl font-extrabold text-gray-900">
            Expense Tracker
          </h2>
          <p className="text-gray-400 text-xs">
            {isSignupMode ? 'Create a new account' : 'Continue with your account'}
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
              type="email"
              name="Email Address"
              value={formData.email}
              onChange={handleInputChange('email')}
              disabled={isLoading} // Désactive les champs pendant le loading
            />

            <Input
              label="Password"
              type="password"
              name="Password"
              value={formData.password}
              onChange={handleInputChange('password')}
              disabled={isLoading}
            />

            {isSignupMode && (
              <Input
                label="Confirm Password"
                type="password"
                name="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleInputChange('confirmPassword')}
                disabled={isLoading}
              />
            )}
          </div>

          <Button
            type="submit"
            isLoading={isLoading} // Utilise le loading combiné
            disabled={isLoading}
            className="w-full"
          >
            {isSignupMode ? 'Sign up' : 'Login'}
          </Button>

          <p className="mt-2 text-center text-sm text-gray-600">
            {isSignupMode ? 'Already have an account? ' : "Don't have an account? "}
            <Link
              to={isSignupMode ? '/login' : '/signup'}
              className="font-medium text-blue-600 hover:text-blue-500 transition-colors"
              onClick={(e) => isLoading && e.preventDefault()} // Empêche la navigation pendant le loading
            >
              {isSignupMode ? 'Login' : 'Sign up'}
            </Link>
          </p>
        </form>
      </div>

      <div>
        <img
          src="./expense-logo.png"
          alt="Expense Tracker Logo"
          className="w-64 h-64 object-contain"
        />
      </div>
    </div>
  );
};

export default Auth;