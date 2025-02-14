// src/components/AuthModal.js
import React from 'react';

const AuthModal = ({
  authMode,
  setAuthMode,
  email,
  setEmail,
  password,
  setPassword,
  onClose,
  handleSignIn,
  handleSignUp,
}) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      {/* Modal Container */}
      <div className="bg-white p-6 rounded shadow-lg w-80">
        {/* Modal Title */}
        <h2 className="text-2xl font-bold mb-4 text-center">
          {authMode === 'signin' ? 'Sign In' : 'Sign Up'}
        </h2>
        
        {/* Email Input */}
        <input
          type="email"
          placeholder="Email"
          className="border p-2 mb-4 w-full rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        {/* Password Input */}
        <input
          type="password"
          placeholder="Password"
          className="border p-2 mb-4 w-full rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {/* Action Buttons */}
        <div className="flex justify-between">
          <button
            onClick={() => {
              if (authMode === 'signin') {
                handleSignIn();
              } else {
                handleSignUp();
              }
            }}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            {authMode === 'signin' ? 'Sign In' : 'Sign Up'}
          </button>
          <button
            onClick={onClose}
            className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 transition"
          >
            Cancel
          </button>
        </div>

        {/* Toggle between Sign In and Sign Up */}
        <div className="mt-4 text-center">
          {authMode === 'signin' ? (
            <p>
              Don't have an account?{' '}
              <button
                className="text-blue-500 underline"
                onClick={() => setAuthMode('signup')}
              >
                Sign Up
              </button>
            </p>
          ) : (
            <p>
              Already have an account?{' '}
              <button
                className="text-blue-500 underline"
                onClick={() => setAuthMode('signin')}
              >
                Sign In
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
