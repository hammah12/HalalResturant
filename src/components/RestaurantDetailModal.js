// src/components/RestaurantDetailModal.js
import React from 'react';

const RestaurantDetailModal = ({ restaurant, onClose }) => {
  if (!restaurant) return null;

  const imageUrl = restaurant.image; // Using the correct column name

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Modal backdrop */}
      <div 
        className="fixed inset-0 bg-black opacity-50" 
        onClick={onClose}
      ></div>

      {/* Modal content container */}
      <div className="relative bg-white rounded-xl shadow-2xl overflow-hidden w-full max-w-3xl mx-auto">
        {/* Close Button */}
        <div className="flex justify-end p-4">
          <button 
            onClick={onClose} 
            className="text-gray-700 hover:text-gray-900 focus:outline-none"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none"
              viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Modal content */}
        <div className="flex flex-col md:flex-row">
          {/* Image Section */}
          {imageUrl && (
            <div className="md:w-1/2">
              <img 
                src={imageUrl} 
                alt={restaurant.name} 
                className="object-cover w-full h-64 md:h-full"
                onError={(e) => {
                  console.error(`Failed to load image for ${restaurant.name} at URL: ${imageUrl}`);
                  e.target.onerror = null;
                  e.target.src = '/fallback-image.png';
                }}
              />
            </div>
          )}

          {/* Details Section */}
          <div className="p-6 md:w-1/2 bg-gradient-to-br from-white to-yellow-50">
            <h2 className="text-3xl font-bold text-indigo-700 mb-4">
              {restaurant.name}
            </h2>
            <p className="text-gray-800 font-medium mb-2">
              {restaurant.cuisine} | {restaurant.halalType} 
              {restaurant.location ? ` | ${restaurant.location}` : ''}
            </p>
            <p className="text-gray-600 mb-4">{restaurant.reviews}</p>
            {/* Additional restaurant details can be added here */}
            <button 
              onClick={onClose} 
              className="mt-4 bg-pink-500 text-white font-semibold px-6 py-2 rounded-full shadow hover:bg-pink-600 focus:outline-none focus:ring-2 focus:ring-pink-400"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RestaurantDetailModal;
