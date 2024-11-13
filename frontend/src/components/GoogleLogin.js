import React from 'react';
import { auth, provider } from './firebase-config'; // Ensure this is the correct path
import { signInWithPopup } from 'firebase/auth';

const GoogleLogin = ({ setUserRole }) => {
  const handleGoogleLogin = async () => {
    try {
      // Trigger the Google sign-in popup
      const result = await signInWithPopup(auth, provider);

      // The signed-in user info
      const user = result.user;
      
      // Assuming you're storing the user role (e.g., based on the email domain or other logic)
      setUserRole('client'); // You can modify this based on your needs

      // Save the user to local storage (or session, or your state management solution)
      localStorage.setItem("user", JSON.stringify(user));

      // Redirect to the homepage or a dashboard
      window.location.href = "/"; // Or navigate to a specific page
    } catch (error) {
      console.error("Error during Google login", error);
      alert("Login failed, please try again!");
    }
  };

  return (
    <div>
      <button
        onClick={handleGoogleLogin}
        className="w-full bg-red-600 text-white p-2 rounded"
      >
        Sign in with Google
      </button>
    </div>
  );
};

export default GoogleLogin;
