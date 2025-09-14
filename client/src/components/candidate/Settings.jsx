import React, { useState, useEffect } from "react";
import axios from "axios";
import { User, Mail, Settings, Trash2, LogOut, Eye, EyeOff, Save, AlertTriangle } from "lucide-react";

function AccountSettings() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });
  const [deleteConfirmText, setDeleteConfirmText] = useState("");
  const [error, setError] = useState("");
  const token = localStorage.getItem("token");
  const API_URL = "http://localhost:4000/api/settings";

  // Fetch user info on mount
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(API_URL, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setFormData(prev => ({
          ...prev,
          username: res.data.name,
          email: res.data.email
        }));
      } catch (err) {
        console.error(err);
        setError("Failed to fetch user data.");
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [token]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({ ...prev, [field]: !prev[field] }));
  };

  // Save account info (name/email)
  const handleSaveChanges = async () => {
    setError("");
    try {
      await axios.put(
        API_URL,
        { name: formData.username, email: formData.email },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Account information updated successfully!");
    } catch (err) {
      console.error(err);
      setError("Failed to update account info.");
    }
  };

  // Update password
  const handleUpdatePassword = async () => {
    setError("");
    if (formData.newPassword !== formData.confirmPassword) {
      setError("New password and confirm password do not match.");
      return;
    }

    try {
      await axios.put(
        API_URL,
        { password: formData.newPassword },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Password updated successfully!");
      setFormData(prev => ({ ...prev, currentPassword: "", newPassword: "", confirmPassword: "" }));
    } catch (err) {
      console.error(err);
      setError("Failed to update password.");
    }
  };

  // Delete account
  const handleDeleteAccount = async () => {
    if (deleteConfirmText !== "DELETE") {
      alert("Type 'DELETE' to confirm account deletion.");
      return;
    }

    try {
      await axios.delete(API_URL, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Account deleted successfully!");
      localStorage.removeItem("token");
      window.location.href = "/login";
    } catch (err) {
      console.error(err);
      setError("Failed to delete account.");
    }
  };

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  if (loading) return <p className="text-white">Loading user data...</p>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        {error && <div className="text-red-500 mb-4">{error}</div>}

        {/* Header */}
        <div className="flex items-center space-x-3 mb-8">
          <div className="bg-blue-500 bg-opacity-20 p-3 rounded-xl">
            <Settings className="text-blue-400" size={28} />
          </div>
          <div>
            <h2 className="text-4xl font-bold text-white">Account Settings</h2>
            <p className="text-gray-400 text-lg">Manage your account preferences and security</p>
          </div>
        </div>

        {/* Account Information */}
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-600 rounded-2xl p-8">
          <h3 className="text-2xl font-bold text-white mb-6 flex items-center border-b border-gray-700 pb-3">
            <User className="mr-3 text-blue-400" size={24} />
            Account Information
          </h3>

          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-3">Username</label>
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) => handleInputChange("username", e.target.value)}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Enter username"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-3">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-gray-800 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Enter email address"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={handleSaveChanges}
                className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white rounded-xl transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                <Save size={20} />
                <span>Save Changes</span>
              </button>
            </div>
          </div>
        </div>

        {/* Security Settings */}
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-600 rounded-2xl p-8">
          <h3 className="text-2xl font-bold text-white mb-6 flex items-center border-b border-gray-700 pb-3">
            <Settings className="mr-3 text-purple-400" size={24} />
            Security Settings
          </h3>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-3">Current Password</label>
              <div className="relative">
                <input
                  type={showPasswords.current ? "text" : "password"}
                  value={formData.currentPassword}
                  onChange={(e) => handleInputChange("currentPassword", e.target.value)}
                  className="w-full px-4 py-3 pr-12 bg-gray-800 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                  placeholder="Enter current password"
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility("current")}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                >
                  {showPasswords.current ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-3">New Password</label>
                <div className="relative">
                  <input
                    type={showPasswords.new ? "text" : "password"}
                    value={formData.newPassword}
                    onChange={(e) => handleInputChange("newPassword", e.target.value)}
                    className="w-full px-4 py-3 pr-12 bg-gray-800 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                    placeholder="Enter new password"
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility("new")}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                  >
                    {showPasswords.new ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-3">Confirm New Password</label>
                <div className="relative">
                  <input
                    type={showPasswords.confirm ? "text" : "password"}
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                    className="w-full px-4 py-3 pr-12 bg-gray-800 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                    placeholder="Confirm new password"
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility("confirm")}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                  >
                    {showPasswords.confirm ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={handleUpdatePassword}
                className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 text-white rounded-xl transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                <Save size={20} />
                <span>Update Password</span>
              </button>
            </div>
          </div>
        </div>

        {/* Account Actions */}
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-600 rounded-2xl p-8">
          <h3 className="text-2xl font-bold text-white mb-6 flex items-center border-b border-gray-700 pb-3">
            <AlertTriangle className="mr-3 text-orange-400" size={24} />
            Account Actions
          </h3>

          <div className="flex flex-col md:flex-row gap-4">
            <button
              onClick={() => setShowLogoutModal(true)}
              className="flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white rounded-xl transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              <LogOut size={20} />
              <span>Logout</span>
            </button>

            <button
              onClick={() => setShowDeleteModal(true)}
              className="flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white rounded-xl transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              <Trash2 size={20} />
              <span>Delete Account Permanently</span>
            </button>
          </div>
        </div>

        {/* Modals */}
        {showLogoutModal && (
          <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-gradient-to-br from-gray-800 to-gray-750 border border-gray-600 rounded-2xl p-8 w-full max-w-md shadow-2xl transform transition-all duration-300">
              <div className="flex items-center space-x-3 mb-6">
                <div className="bg-blue-500 bg-opacity-20 p-2 rounded-lg">
                  <LogOut className="text-blue-400" size={24} />
                </div>
                <h3 className="text-2xl font-semibold text-white">Confirm Logout</h3>
              </div>

              <p className="text-gray-300 mb-6">
                Are you sure you want to logout? You'll need to sign in again to access your account.
              </p>

              <div className="flex gap-4">
                <button
                  onClick={() => setShowLogoutModal(false)}
                  className="flex-1 px-6 py-3 border border-gray-600 text-gray-300 rounded-xl hover:bg-gray-700 hover:border-gray-500 transition-all duration-200 font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleLogout}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white rounded-xl transition-all duration-200 font-semibold shadow-lg"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        )}

        {showDeleteModal && (
          <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-gradient-to-br from-gray-800 to-gray-750 border border-red-500 rounded-2xl p-8 w-full max-w-md shadow-2xl transform transition-all duration-300">
              <div className="flex items-center space-x-3 mb-6">
                <div className="bg-red-500 bg-opacity-20 p-2 rounded-lg">
                  <AlertTriangle className="text-red-400" size={24} />
                </div>
                <h3 className="text-2xl font-semibold text-white">Delete Account</h3>
              </div>

              <div className="space-y-4">
                <p className="text-gray-300">
                  This action cannot be undone. This will permanently delete your account and remove all your data from our servers.
                </p>
                
                <p className="text-red-400 font-semibold">
                  Type "DELETE" to confirm account deletion:
                </p>
                
                <input
                  type="text"
                  value={deleteConfirmText}
                  onChange={(e) => setDeleteConfirmText(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-700 border border-red-500 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
                  placeholder="Type DELETE to confirm"
                />
              </div>

              <div className="flex gap-4 mt-6">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 px-6 py-3 border border-gray-600 text-gray-300 rounded-xl hover:bg-gray-700 hover:border-gray-500 transition-all duration-200 font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteAccount}
                  disabled={deleteConfirmText !== "DELETE"}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 disabled:from-gray-600 disabled:to-gray-500 disabled:cursor-not-allowed text-white rounded-xl transition-all duration-200 font-semibold shadow-lg"
                >
                  Delete Forever
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AccountSettings;
