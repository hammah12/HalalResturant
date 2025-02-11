// src/components/Navbar.js
import React from 'react';

const Navbar = ({ user, onAddRestaurant, onSignOut, onSignIn }) => {
  return (
    <header className="bg-gradient-to-r from-purple-600 to-pink-500 shadow-lg fixed top-0 left-0 w-full z-50 backdrop-blur-md bg-opacity-90 border-b-2 border-purple-300">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <h1 className="text-3xl font-extrabold text-white tracking-wide">Halal Finder</h1>
        <nav className="flex space-x-6">
          <button 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="text-white hover:text-gray-300 transition-all duration-200"
          >
            Home
          </button>
          {user ? (
            <>
              <button 
                onClick={onAddRestaurant}
                className="bg-white text-purple-600 px-4 py-2 rounded-lg shadow-md hover:bg-purple-500 hover:text-white transition-all duration-300"
              >
                Add Restaurant
              </button>
              <button 
                onClick={onSignOut}
                className="bg-red-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-red-600 transition-all duration-300"
              >
                Sign Out
              </button>
            </>
          ) : (
            <button 
              onClick={onSignIn}
              className="bg-white text-purple-600 px-4 py-2 rounded-lg shadow-md hover:bg-purple-500 hover:text-white transition-all duration-300"
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
