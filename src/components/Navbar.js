// src/components/Navbar.js
import React from 'react';
import { useNavigate } from 'react-router-dom';

const Navbar = ({ user, onAddRestaurant, onSignIn, onSignOut }) => {
  const navigate = useNavigate();

  // Handle "Add a Restaurant" click:
  // If the user is not signed in, trigger the sign-in flow; otherwise, open the add restaurant modal.
  const handleAddRestaurant = () => {
    if (!user) {
      onSignIn();
    } else {
      onAddRestaurant();
    }
  };

  // Handle "My Profile" click:
  // If the user is not signed in, trigger the sign-in flow; otherwise, navigate to the profile page.
  const handleProfile = () => {
    if (!user) {
      onSignIn();
    } else {
      navigate('/profile');
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 shadow-lg">
      {/*
        Navbar Background:
        - "bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500" creates a horizontal gradient.
          * Adjust these Tailwind color classes to change the gradient colors.
        - "shadow-lg" adds a prominent shadow; modify or remove if needed.
      */}
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div
          className="text-3xl font-extrabold text-white cursor-pointer tracking-widest"
          onClick={() => navigate('/')}
          // Font for the title:
          // The inline style sets a cursive font; you can replace 'cursive' with any custom font.
          style={{ fontFamily: 'cursive' }}
        >
          Halal Finder
        </div>
        <div className="flex items-center space-x-4">
          <button
            onClick={handleAddRestaurant}
            className="bg-white text-pink-600 font-bold px-4 py-2 rounded-full shadow hover:bg-pink-100 transition"
            // "bg-white" sets the button background color.
            // "text-pink-600" controls the button text color.
            // "hover:bg-pink-100" changes the background on hover.
            // Adjust these classes to modify the button's appearance.
          >
            Add a Restaurant
          </button>
          <button
            onClick={handleProfile}
            className="bg-white text-indigo-600 font-bold px-4 py-2 rounded-full shadow hover:bg-indigo-100 transition"
            // "text-indigo-600" sets the text color for the profile button.
            // "hover:bg-indigo-100" changes the background color on hover.
          >
            My Profile
          </button>
          {user && (
            <button
              onClick={onSignOut}
              className="bg-white text-gray-600 font-bold px-4 py-2 rounded-full shadow hover:bg-gray-100 transition"
              // "text-gray-600" sets the text color for the sign-out button.
              // "hover:bg-gray-100" changes the background color on hover.
            >
              Sign Out
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
