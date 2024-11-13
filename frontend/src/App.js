import React, { useState, useEffect, useCallback } from "react";
import './index.css';
import Navbar from './components/Navbar';
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Authentication from './components/Authentication'; // Updated import

// Import the user dashboard and admin dashboard components
import HomePage from './components/HomePage';
import AuctioneerDashboard from './pages/AuctioneerDashboard';
import ClientDashboard from './pages/ClientDashboard';
import AdminDashboard from './pages/AdminDashboard'; // Import the existing AdminDashboard

const App = () => {
  const [userRole, setUserRole] = useState(null);
  const [showLogin, setShowLogin] = useState(true); // Toggle between login and register forms

  useEffect(() => {
    const token = localStorage.getItem("access_token");

    if (token) {
      try {
        const tokenParts = token.split(".");
        if (tokenParts.length === 3) {
          const decodedToken = JSON.parse(atob(tokenParts[1])); // Decode JWT payload
          setUserRole(decodedToken.role); // Assuming role is stored in the JWT token
        } else {
          console.error("Invalid token format");
          localStorage.removeItem("access_token");
        }
      } catch (error) {
        console.error("Failed to decode token:", error);
        localStorage.removeItem("access_token");
      }
    }
  }, []);

  const toggleForm = () => setShowLogin(!showLogin);

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    setUserRole(null);
  };

  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        {userRole && <Navbar userRole={userRole} handleLogout={handleLogout} />}
        
        <main className="container mx-auto !ml-0">
          <Routes>
            {/* Set HomePage as the default route */}
            <Route
              path="/"
              element={<HomePage userRole={userRole} handleLogout={handleLogout} />}
            />

            <Route
              path="/login"
              element={
                userRole ? (
                  <Navigate to={`/${userRole}-dashboard`} />
                ) : (
                  <Authentication setUserRole={setUserRole} /> // Use Authentication component here
                )
              }
            />

            <Route
              path="/registration"
              element={<Authentication setUserRole={setUserRole} />} // Use Authentication component here as well
            />

            <Route
              path="/admin-dashboard"
              element={userRole === "admin" ? <AdminDashboard /> : <Navigate to="/" />}
            />

            <Route
              path="/auctioneer-dashboard"
              element={userRole === "auctioneer" ? <AuctioneerDashboard /> : <Navigate to="/" />}
            />

            <Route
              path="/client-dashboard"
              element={userRole === "client" ? <ClientDashboard /> : <Navigate to="/" />}
            />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;
