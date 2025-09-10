import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Button from "../components/ui/Button";
import { useAuth } from "../hooks/useAuth";
import type { AuthFormData, AuthProps } from "../types";

const Auth: React.FC<AuthProps> = ({ mode }) => {
  const formValue = {
    email: mode === "login" ? "user@gmail.com" : "",
    password: mode === "login" ? "12345678" : "",
    confirmPassword: "",
  };
  const [formData, setFormData] = useState<AuthFormData>(formValue);
  const [formError, setFormError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login, signup, loading: authLoading, error: authError } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    setFormData(formValue);
    setFormError("");
  }, [mode]);

  const validateForm = () => {
    if (!formData.email || !formData.password) {
      setFormError("Please fill in all fields");
      return false;
    }

    if (mode === "signup") {
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
    setFormError("");
    setIsSubmitting(true);

    if (!validateForm()) {
      setIsSubmitting(false);
      return;
    }

    try {
      console.log("Tentative de connexion avec:", formData.email);
      const result =
        mode === "login"
          ? await login(formData.email, formData.password)
          : await signup(formData.email, formData.password);

      console.log("Réponse reçue:", result);

      if (result.token) {
        console.log("Token reçu, navigation vers dashboard");
        navigate("/dashboard");
      }
    } catch (error) {
      console.error("Erreur complète:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange =
    (field: keyof typeof formData) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData((prev) => ({ ...prev, [field]: e.target.value }));
    };

  const isSignupMode = mode === "signup";
  const error = formError || authError;
  const isLoading = isSubmitting || authLoading;

  return (
    <div className="min-h-screen flex flex-row-reverse items-center justify-around px-6 lg:px-20 bg-gradient-to-br from-blue-50 via-white to-blue-100">
      <div className="max-w-md w-full space-y-8 p-8 rounded-2xl shadow-xl bg-white/80 backdrop-blur-sm border border-gray-200">
        <div className="space-y-3 flex flex-col items-center">
          <h2 className="text-center text-4xl font-extrabold text-gray-900 tracking-tight">
            Expense Tracker
          </h2>
          <p className="text-gray-500 text-sm">
            {isSignupMode
              ? "Create a new account"
              : "Continue with your account"}
          </p>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md text-sm text-center">
            {error}
          </div>
        )}

        <form className="mt-6 space-y-5" onSubmit={handleSubmit}>
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Email address
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={handleInputChange("email")}
                disabled={isLoading}
                className="w-full px-4 py-3 rounded-2xl bg-white/60 backdrop-blur-md
                 text-gray-900 placeholder-gray-400
                 border border-transparent shadow-md
                 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                 transition-all duration-300 disabled:opacity-50"
                placeholder="Enter your email"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Password
              </label>
              <input
                type="password"
                value={formData.password}
                onChange={handleInputChange("password")}
                disabled={isLoading}
                className="w-full px-4 py-3 rounded-2xl bg-white/60 backdrop-blur-md
                 text-gray-900 placeholder-gray-400
                 border border-transparent shadow-md
                 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                 transition-all duration-300 disabled:opacity-50"
                placeholder="Enter your password"
              />
            </div>
            {isSignupMode && (
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Confirm Password
                </label>
                <input
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleInputChange("confirmPassword")}
                  disabled={isLoading}
                  className={`w-full px-4 py-3 rounded-2xl bg-white/60 backdrop-blur-md
                    text-gray-900 placeholder-gray-400
                    border border-transparent shadow-md
                    focus:outline-none focus:ring-2
                    ${
                      formData.confirmPassword &&
                      formData.confirmPassword !== formData.password
                        ? "focus:ring-red-500 focus:border-red-500"
                        : "focus:ring-green-500 focus:border-green-500"
                    }
                    transition-all duration-300 disabled:opacity-50`}
                  placeholder="Confirm your password"
                />
                {formData.confirmPassword &&
                  formData.confirmPassword !== formData.password && (
                    <p className="mt-1 text-xs text-red-500">
                      Passwords do not match
                    </p>
                  )}
              </div>
            )}
          </div>

          <Button
            type="submit"
            isLoading={isLoading}
            disabled={isLoading}
            className="w-full rounded-xl py-3 font-semibold shadow-md hover:shadow-lg transition-all duration-300"
          >
            {isSignupMode ? "Sign up" : "Login"}
          </Button>

          <p className="mt-3 text-center text-sm text-gray-600">
            {isSignupMode
              ? "Already have an account? "
              : "Don't have an account? "}
            <Link
              to={isSignupMode ? "/login" : "/signup"}
              className="font-semibold text-blue-600 hover:text-blue-500 transition-colors"
              onClick={(e) => isLoading && e.preventDefault()}
            >
              {isSignupMode ? "Login" : "Sign up"}
            </Link>
          </p>
        </form>
      </div>

      {/* Logo */}
      <div className="hidden md:flex flex-col items-center space-y-4">
        <img
          src="./expense-logo.png"
          alt="Expense Tracker Logo"
          className="w-72 h-72 object-contain drop-shadow-md"
        />
        <p className="text-gray-600 text-center max-w-xs text-sm">
          Manage your expenses with ease and keep track of your finances
          anywhere.
        </p>
      </div>
    </div>
  );
};

export default Auth;
