import React from 'react';

const Card = ({ restaurant }) => {
  if (!restaurant) {
    console.warn("Card received undefined restaurant!");
    return null;
  }

  console.log("Rendering card for:", restaurant); // Debugging log

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden transform hover:scale-105 transition-transform duration-300">
      {restaurant.image ? (
        <img
          src={`https://tsdqcubdaswmhiwskufu.supabase.co/storage/v1/object/public/restaurant-images/${restaurant.image}`}
          alt={restaurant.name || "Restaurant Image"}
          className="w-full h-48 object-cover"
        />
      ) : (
        <div className="w-full h-48 bg-gray-300 flex items-center justify-center text-gray-500">
          No Image Available
        </div>
      )}
      <div className="p-6">
        <h2 className="text-2xl font-bold text-purple-600">{restaurant.name || "Unknown Restaurant"}</h2>
        <p className="text-gray-700 mt-2">{restaurant.description || "No description available."}</p>
        <p className="text-gray-600 mt-2">{restaurant.address || "No address provided."}</p>
      </div>
    </div>
  );
};

export default Card;
