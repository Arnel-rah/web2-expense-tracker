import { useState, useEffect } from "react";
import Header from "../components/layout/Header";
import { apiFetch } from "../api/api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faUser, 
  faEnvelope, 
  faLock, 
  faShieldAlt, 
  faChartBar, 
  faMoneyBillWave,
  faCheckCircle,
  faTimesCircle,
  faLightbulb
} from "@fortawesome/free-solid-svg-icons";
import { Loader } from "../components/ui/Loader";

interface UserProfile {
  email: string;
  createdAt?: string;
}

export default function Profile() {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    let email = "";
    if (!email) {
      const storedUserData = localStorage.getItem("user_data");
      if (storedUserData) {
        const parsedData = JSON.parse(storedUserData);
        email = parsedData.email;
      }
    }
    if (!email) email = "";

    setUserProfile({ email });
  }, []);

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordLoading(true);
    setError("");
    setSuccess("");

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      setPasswordLoading(false);
      return;
    }


    try {
      await apiFetch("/auth/change-password", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      setSuccess("Password changed successfully!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      setError(err.message || "Feature not available. Please contact support.");
    } finally {
      setPasswordLoading(false);
    }
  };

  if (true) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
          <Loader />
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            <FontAwesomeIcon icon={faUser} className="mr-2" />
            User Profile
          </h1>

          {error && (
            <div className="p-3 bg-red-100 text-red-700 rounded-lg text-sm mb-4">
              <FontAwesomeIcon icon={faTimesCircle} className="mr-2" />
              {error}
            </div>
          )}

          {success && (
            <div className="p-3 bg-green-100 text-green-700 rounded-lg text-sm mb-4">
              <FontAwesomeIcon icon={faCheckCircle} className="mr-2" />
              {success}
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                Personal Information
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FontAwesomeIcon icon={faEnvelope} className="mr-2" />
                    Email Address
                  </label>
                  <div className="p-3 bg-gray-100 rounded-lg text-gray-600">
                    {userProfile?.email || "Not available"}
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                <FontAwesomeIcon icon={faLock} className="mr-2" />
                Change Password
              </h2>

              <form onSubmit={handlePasswordChange} className="space-y-4">
                <div>
                  <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-2">
                    Current Password
                  </label>
                  <input
                    type="password"
                    id="currentPassword"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter your current password"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-2">
                    New Password
                  </label>
                  <input
                    type="password"
                    id="newPassword"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter your new password"
                    required
                    minLength={8}
                  />
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    id="confirmPassword"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Confirm your new password"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={passwordLoading}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-3 px-4 rounded-lg transition duration-200"
                >
                  <FontAwesomeIcon icon={faShieldAlt} className="mr-2" />
                  {passwordLoading ? "Changing password..." : "Change Password"}
                </button>
              </form>

              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <h3 className="font-semibold text-blue-800 mb-2 text-sm">
                  <FontAwesomeIcon icon={faLightbulb} className="mr-2" />
                  Security Tips
                </h3>
                <ul className="text-xs text-blue-600 space-y-1">
                  <li>• Minimum 8 characters</li>
                  <li>• Use numbers and special characters</li>
                  <li>• Avoid common passwords</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-200 my-6"></div>
          
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => window.location.href = '/expenses'}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-200"
            >
              <FontAwesomeIcon icon={faChartBar} className="mr-2" />
              My Expenses
            </button>
            
            <button
              onClick={() => window.location.href = '/incomes'}
              className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-200"
            >
              <FontAwesomeIcon icon={faMoneyBillWave} className="mr-2" />
              My Incomes
            </button>
          </div>
        </div>
      </div>
    </>
  );
}