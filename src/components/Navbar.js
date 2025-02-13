// src/components/Navbar.js
import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = ({ user, onAddRestaurant, onSignOut, onSignIn }) => {
  return (
    <header className="bg-gradient-to-r from-indigo-600 to-purple-500 shadow-md fixed top-0 left-0 w-full z-50 backdrop-blur-sm bg-opacity-95 border-b border-indigo-400">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <Link to="/" className="text-3xl font-bold text-white">
          Halal Finder
        </Link>
        <nav className="flex items-center space-x-6">
          <Link 
            to="/" 
            className="text-white hover:text-gray-200 transition-colors duration-200"
          >
            Home
          </Link>
          {user && (
            <Link 
              to="/profile"
              className="text-white hover:text-gray-200 transition-colors duration-200"
            >
              My Profile
            </Link>
          )}
          {user ? (
            <>
              <button 
                onClick={onAddRestaurant}
                className="bg-white text-indigo-600 px-4 py-2 rounded-md shadow hover:bg-indigo-600 hover:text-white transition-colors duration-300"
              >
                Add Restaurant
              </button>
              <button 
                onClick={onSignOut}
                className="bg-red-500 text-white px-4 py-2 rounded-md shadow hover:bg-red-600 transition-colors duration-300"
              >
                Sign Out
              </button>
            </>
          ) : (
            <button 
              onClick={onSignIn}
              className="bg-white text-indigo-600 px-4 py-2 rounded-md shadow hover:bg-indigo-600 hover:text-white transition-colors duration-300"
            >
              Sign In
            </button>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
