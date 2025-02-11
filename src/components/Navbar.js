// src/components/Navbar.js
import React from 'react';

const Navbar = ({ user, onAddRestaurant, onSignOut, onSignIn }) => {
  return (
    <header className="bg-gradient-to-r from-purple-600 to-pink-500 shadow-lg">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <h1 className="text-3xl font-extrabold text-white">Halal Finder</h1>
        <nav className="space-x-4">
          <button 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="text-white hover:text-gray-200"
          >
            Home
          </button>
          {user ? (
            <>
              <button 
                onClick={onAddRestaurant}
                className="text-white hover:text-gray-200"
              >
                Add Restaurant
              </button>
              <button 
                onClick={onSignOut}
                className="text-white hover:text-gray-200"
              >
                Sign Out
              </button>
            </>
          ) : (
            <button 
              onClick={onSignIn}
              className="text-white hover:text-gray-200"
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
