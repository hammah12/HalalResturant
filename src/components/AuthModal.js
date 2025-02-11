// src/components/AuthModal.js
import React from 'react';

const AuthModal = ({
  authMode,
  email,
  setEmail,
  password,
  setPassword,
  onSignIn,
  onSignUp,
  onClose,
  toggleAuthMode
}) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <h2 className="text-2xl font-bold mb-4">
          {authMode === "signin" ? "Sign In" : "Sign Up"}
        </h2>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-3 mb-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-3 mb-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
        <div className="flex justify-between items-center">
          {authMode === "signin" ? (
            <button 
              onClick={onSignIn}
              className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition-colors"
            >
              Sign In
            </button>
          ) : (
            <button 
              onClick={onSignUp}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors"
            >
              Sign Up
            </button>
          )}
          <button onClick={onClose} className="text-gray-500 ml-2">
            Cancel
          </button>
        </div>
        <p className="mt-4 text-sm">
          {authMode === "signin" ? "Don't have an account?" : "Already have an account?"}
          <button onClick={toggleAuthMode} className="text-purple-600 underline ml-1">
            {authMode === "signin" ? "Sign Up" : "Sign In"}
          </button>
        </p>
      </div>
    </div>
  );
};

export default AuthModal;
