import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import GoogleLogin from './GoogleLogin'; // Import GoogleLogin component
import auctionBackground from '../images/auction1.jpg'; // Background image

const Authentication = ({ setUserRole }) => {
  const [isLoginMode, setIsLoginMode] = useState(true); // Toggle between login and registration modes
  const [selectedRole, setSelectedRole] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState(''); // For registration
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('client'); // Default role is "client" for registration
  const [loading, setLoading] = useState(false); // Loading state for registration
  const [error, setError] = useState(''); // Error message
  const [successMessage, setSuccessMessage] = useState(''); // Success message for registration
  const navigate = useNavigate();

  const handleRoleChange = (event) => {
    setSelectedRole(event.target.value);
  };

  const handleLogin = (event) => {
    event.preventDefault();

    const token = btoa(JSON.stringify({ username, role: selectedRole }));
    localStorage.setItem("access_token", token);
    setUserRole(selectedRole);
    navigate(`/${selectedRole}-dashboard`);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccessMessage("");

    if (!username || !email || !password) {
      setError("All fields are required.");
      setLoading(false);
      return;
    }

    const mockDatabase = [
      { username: "admin", email: "admin@example.com", password: "admin123", role: "admin" },
      { username: "auctioneer", email: "auctioneer@example.com", password: "auction123", role: "auctioneer" },
      { username: "client", email: "client@example.com", password: "client123", role: "client" },
    ];

    try {
      const existingUser = mockDatabase.find(
        (user) => user.username === username || user.email === email
      );

      if (existingUser) {
        setError("Username or email already exists.");
        setLoading(false);
        return;
      }

      const existingAdmin = mockDatabase.find((user) => user.role === "admin");

      if (role === "admin" && existingAdmin) {
        setError("An admin already exists. Only one admin is allowed.");
        setLoading(false);
        return;
      }

      mockDatabase.push({ username, email, password, role });
      localStorage.setItem("newUser", JSON.stringify({ username, email, role }));
      setSuccessMessage("Registration Successful! Redirecting to login...");
      setTimeout(() => {
        setIsLoginMode(true);
      }, 2000);
    } catch (error) {
      setError("Registration Failed! Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="relative min-h-screen min-w-full bg-cover bg-center transition-opacity duration-300 hover:bg-opacity-75"
      style={{ 
        backgroundImage: `url(${auctionBackground})`, 
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        height: '100vh',
        width: '100vw'
      }}
    >
      <div className="flex items-center justify-center h-full">
        {/* Container with hover effect */}
        <div className="max-w-md p-6 bg-white rounded shadow-lg relative z-10 group hover:bg-opacity-75">
          {isLoginMode ? (
            <>
              <h2 className="text-center text-2xl font-semibold mb-4">Login</h2>
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="mb-4">
                  <label className="block text-gray-700">Login as</label>
                  <select
                    value={selectedRole}
                    onChange={handleRoleChange}
                    className="w-full p-2 border border-gray-300 rounded"
                    required
                  >
                    <option value="">Select Role</option>
                    <option value="admin">Admin</option>
                    <option value="auctioneer">Auctioneer</option>
                    <option value="client">Client</option>
                  </select>
                </div>
                <input
                  type="text"
                  placeholder="Username"
                  className="w-full p-2 border border-gray-300 rounded"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
                <input
                  type="password"
                  placeholder="Password"
                  className="w-full p-2 border border-gray-300 rounded"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded">
                  Login
                </button>
              </form>
              <div className="my-4 text-center">or continue with:</div>
              <div className="mt-4">
                <GoogleLogin setUserRole={setUserRole} />
              </div>
              <div className="mt-4 text-center">
                <button onClick={() => setIsLoginMode(false)} className="text-blue-500">
                  Don’t have an account? Register
                </button>
              </div>
            </>
          ) : (
            <>
              <h2 className="text-2xl font-bold mb-4">Create an Account</h2>
              {error && <div className="text-red-500 text-sm mb-4">{error}</div>}
              {successMessage && <div className="text-green-500 text-sm mb-4">{successMessage}</div>}
              <form onSubmit={handleRegister} className="space-y-4">
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Username"
                  className="w-full p-2 border border-gray-300 rounded"
                  required
                />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email"
                  className="w-full p-2 border border-gray-300 rounded"
                  required
                />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  className="w-full p-2 border border-gray-300 rounded"
                  required
                />
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded"
                >
                  <option value="client">Client</option>
                  <option value="auctioneer">Auctioneer</option>
                  <option value="admin">Admin</option>
                </select>
                <button
                  type="submit"
                  className="w-full bg-blue-500 text-white p-2 rounded"
                  disabled={loading}
                >
                  {loading ? "Registering..." : "Register"}
                </button>
              </form>
              <div className="mt-4 text-center">
                <button onClick={() => setIsLoginMode(true)} className="text-blue-500">
                  Already have an account? Login
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Authentication;
