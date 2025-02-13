// src/components/Navbar.js
import React from 'react';
import { useNavigate } from 'react-router-dom';

const Navbar = ({ user, onAddRestaurant, onSignIn }) => {
  const navigate = useNavigate();

  const handleAddRestaurant = () => {
    // If the user is not signed in, show sign in modal; otherwise, proceed
    if (!user) {
      onSignIn();
    } else {
      onAddRestaurant();
    }
  };

  const handleProfile = () => {
    if (!user) {
      onSignIn();
    } else {
      navigate('/profile');
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white shadow z-50">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div
          className="text-xl font-bold cursor-pointer"
          onClick={() => navigate('/')}
        >
          Restaurant Reviews
        </div>
        <div className="flex items-center space-x-4">
          <button
            onClick={handleAddRestaurant}
            className="bg-blue-600 text-white px-3 py-2 rounded"
          >
            Add a Restaurant
          </button>
          <button
            onClick={handleProfile}
            className="bg-green-600 text-white px-3 py-2 rounded"
          >
            My Profile
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
