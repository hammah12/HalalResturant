// src/components/AddRestaurantModal.js
import React from 'react';

const AddRestaurantModal = ({ newRestaurant, handleNewRestaurantChange, onAddRestaurant, onClose }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <h2 className="text-2xl font-bold mb-4">Add a New Restaurant</h2>
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={newRestaurant.name}
          onChange={handleNewRestaurantChange}
          className="w-full p-3 mb-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
        <input
          type="text"
          name="description"
          placeholder="Description"
          value={newRestaurant.description}
          onChange={handleNewRestaurantChange}
          className="w-full p-3 mb-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
        <input
          type="text"
          name="address"
          placeholder="Address"
          value={newRestaurant.address}
          onChange={handleNewRestaurantChange}
          className="w-full p-3 mb-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
        <input
          type="number"
          name="rating"
          placeholder="Rating"
          value={newRestaurant.rating}
          onChange={handleNewRestaurantChange}
          className="w-full p-3 mb-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
        <select
          name="halalStatus"
          value={newRestaurant.halalStatus}
          onChange={handleNewRestaurantChange}
          className="w-full p-3 mb-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          <option value="">Select Halal Type</option>
          <option value="HMS">HMS</option>
          <option value="HFSAA">HFSAA</option>
          <option value="Self-Reported">Self-Reported</option>
        </select>
        <input
          type="text"
          name="google"
          placeholder="Google Maps URL"
          value={newRestaurant.google}
          onChange={handleNewRestaurantChange}
          className="w-full p-3 mb-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
        <input
          type="text"
          name="hours"
          placeholder="Hours"
          value={newRestaurant.hours}
          onChange={handleNewRestaurantChange}
          className="w-full p-3 mb-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
        <input
          type="text"
          name="phone"
          placeholder="Phone"
          value={newRestaurant.phone}
          onChange={handleNewRestaurantChange}
          className="w-full p-3 mb-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
        <div className="flex justify-between items-center">
          <button 
            onClick={onAddRestaurant}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
          >
            Add Restaurant
          </button>
          <button onClick={onClose} className="text-gray-500 ml-2">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddRestaurantModal;
