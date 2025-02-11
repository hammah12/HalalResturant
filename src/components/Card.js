// src/Card.js
import React from 'react';

const Card = ({ restaurant }) => {
  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden transform hover:scale-105 transition-transform duration-300">
      {/* Display Image if Available */}
      {restaurant.image && (
        <img
          src={`https://tsdqcubdaswmhiwskufu.supabase.co/storage/v1/object/public/restaurant-images/${restaurant.image}`}
          alt={restaurant.name}
          className="w-full h-48 object-cover"
        />
      )}
      <div className="p-6">
        <h2 className="text-2xl font-bold text-purple-600">{restaurant.name}</h2>
        <p className="text-gray-700 mt-2">{restaurant.description}</p>
        <p className="text-gray-600 mt-2">{restaurant.address}</p>
        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center">
            <span className="text-yellow-500 mr-1">★</span>
            <span className="text-gray-800 font-semibold">{restaurant.rating}</span>
          </div>
          <span className={`text-sm font-semibold py-1 px-2 rounded-full ${
            restaurant.halalStatus === 'HMS' ? 'bg-green-600 text-white' :
            restaurant.halalStatus === 'HFSAA' ? 'bg-blue-600 text-white' :
            'bg-orange-600 text-white'
          }`}>
            {restaurant.halalStatus}
          </span>
        </div>
        {restaurant.google && (
          <a href={restaurant.google} target="_blank" rel="noopener noreferrer"
            className="text-blue-500 underline mt-2 inline-block">
            View on Google
          </a>
        )}
      </div>
    </div>
  );
};

export default Card;
