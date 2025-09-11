import React, { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import Button from "../components/ui/Button";
import { useAuth } from "../hooks/useAuth";
import type { AuthFormData, AuthProps } from "../types";
import toast from "react-hot-toast";
import { Loader } from "../components/ui/Loader";

const Auth: React.FC<AuthProps> = ({ mode }) => {
  const isSignupMode = mode === "signup";
  const initialFormData = {
    email: mode === "login" ? "user@gmail.com" : "",
    password: mode === "login" ? "12345678" : "",
    confirmPassword: "",
  };

  const [formData, setFormData] = useState<AuthFormData>(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentField, setCurrentField] = useState<string>("email");
  const [isNavigating, setIsNavigating] = useState(false);

  const { login, signup, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const isLoading = isSubmitting || authLoading;

  useEffect(() => {
    setFormData(initialFormData);
    setCurrentField("email");
  }, [mode]);

  useEffect(() => {
    if (currentField) {
      document.getElementById(currentField)?.focus();
    }
  }, [currentField]);

  const validateForm = useCallback(() => {
    const { email, password, confirmPassword } = formData;

    if (!email) {
      toast.error("Please enter your email");
      setCurrentField("email");
      return false;
    }

    if (!password) {
      toast.error("Please enter your password");
      setCurrentField("password");
      return false;
    }

    if (isSignupMode) {
      if (!confirmPassword) {
        toast.error("Please confirm your password");
        setCurrentField("confirmPassword");
        return false;
      }
      if (password !== confirmPassword) {
        toast.error("Passwords don't match");
        setCurrentField("confirmPassword");
        return false;
      }
      if (password.length < 6) {
        toast.error("Password must be at least 6 characters long");
        setCurrentField("password");
        return false;
      }
    }

    return true;
  }, [formData, isSignupMode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!validateForm()) {
      setIsSubmitting(false);
      return;
    }

    try {
      const authFunction = isSignupMode ? signup : login;
      const result = await authFunction(formData.email, formData.password);

      if (result.token) {
        const successMessage = isSignupMode ? "Account created successfully!" : "Login successful!";
        toast.success(successMessage);

        setIsNavigating(true);

        setTimeout(() => {
          navigate("/dashboard");
        }, 1000);
      }
    } catch (error: any) {
      const message = error.message?.toLowerCase() || "";
      let errorMessage = "An error occurred. Please try again.";

      if (message.includes("already exist") || message.includes("email")) {
        errorMessage = "Email already exists";
      } else if (error.message) {
        errorMessage = error.message;
      }

      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: keyof AuthFormData) => {
    return (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData(prev => ({ ...prev, [field]: e.target.value }));
    };
  };

  const formFields = [
    {
      id: "email",
      label: "Email address",
      type: "email",
      value: formData.email,
      placeholder: "Enter your email"
    },
    {
      id: "password",
      label: "Password",
      type: "password",
      value: formData.password,
      placeholder: "Enter your password"
    },
    ...(isSignupMode ? [{
      id: "confirmPassword",
      label: "Confirm Password",
      type: "password",
      value: formData.confirmPassword,
      placeholder: "Confirm your password",
      hasError: formData.confirmPassword && formData.confirmPassword !== formData.password
    }] : [])
  ];

  const buttonText = isSignupMode ? "Sign up" : "Login";
  const linkText = isSignupMode ? "Login" : "Sign up";
  const linkPath = isSignupMode ? "/login" : "/signup";
  const accountMessage = isSignupMode ? "Already have an account? " : "Don't have an account? ";
  const titleMessage = isSignupMode ? "Create a new account" : "Continue with your account";

  if (isNavigating) {
    return <Loader />;
  }

  return (
    <div className="min-h-screen flex flex-row-reverse items-center justify-around px-6 lg:px-20 bg-gradient-to-br from-blue-50 via-white to-blue-100">

      <div className="max-w-md w-full space-y-8 p-8 rounded-2xl shadow-xl bg-white/80 backdrop-blur-sm border border-gray-200">

        <div className="space-y-3 flex flex-col items-center">
          <h2 className="text-center text-4xl font-extrabold text-gray-900 tracking-tight">
            Expense Tracker
          </h2>
          <p className="text-gray-500 text-sm">
            {titleMessage}
          </p>
        </div>

        <form className="mt-6 space-y-5" onSubmit={handleSubmit}>

          <div className="space-y-5">
            {formFields.map((field) => (
              <div key={field.id}>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  {field.label}
                </label>
                <input
                  id={field.id}
                  type={field.type}
                  value={field.value}
                  onChange={handleInputChange(field.id as keyof AuthFormData)}
                  disabled={isLoading}
                  className={`w-full px-4 py-3 rounded-2xl bg-white/60 backdrop-blur-md
                    text-gray-900 placeholder-gray-400
                    border border-transparent shadow-md
                    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                    transition-all duration-300 disabled:opacity-50
                    ${field.hasError ? "focus:ring-red-500 focus:border-red-500" : ""}`}
                  placeholder={field.placeholder}
                />
                {field.hasError && (
                  <p className="mt-1 text-xs text-red-500">Passwords do not match</p>
                )}
              </div>
            ))}
          </div>

          <Button
            type="submit"
            isLoading={isLoading}
            disabled={isLoading}
            className="w-full rounded-xl py-3 font-semibold shadow-md hover:shadow-lg transition-all duration-300"
          >
            {buttonText}
          </Button>

          <p className="mt-3 text-center text-sm text-gray-600">
            {accountMessage}
            <Link
              to={linkPath}
              className="font-semibold text-blue-600 hover:text-blue-500 transition-colors"
              onClick={(e) => isLoading && e.preventDefault()}
            >
              {linkText}
            </Link>
          </p>

        </form>

      </div>

      <div className="hidden md:flex flex-col items-center space-y-4">
        <img
          src="./expense-logo.png"
          alt="Expense Tracker Logo"
          className="w-72 h-72 object-contain drop-shadow-md"
        />
        <p className="text-gray-600 text-center max-w-xs text-sm">
          Manage your expenses with ease and keep track of your finances anywhere.
        </p>
      </div>

    </div>
  );
};

export default Auth;