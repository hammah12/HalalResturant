// src/components/RestaurantDetailModal.js
import React from 'react';

const RestaurantDetailModal = ({ restaurant, onClose }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg p-8 max-w-md w-full">
        {/* Placeholder image; replace with your own as needed */}
        <img 
          src="https://via.placeholder.com/400x200" 
          alt="Restaurant" 
          className="w-full h-48 object-cover rounded-lg mb-4" 
        />
        <h2 className="text-3xl font-bold mb-4">{restaurant.name}</h2>
        <p className="text-gray-700 mb-2">{restaurant.description}</p>
        <p className="text-gray-600 mb-2">{restaurant.address}</p>
        <p className="text-gray-600 mb-2">{restaurant.hours}</p>
        <p className="text-gray-600 mb-4">{restaurant.phone}</p>
        <button 
          onClick={onClose} 
          className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition-colors"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default RestaurantDetailModal;
