// src/components/RestaurantList.js
import React from 'react';
import Card from './Card';
import CardTitle from './CardTitle';
import CardDescription from './CardDescription';
import CardContent from './CardContent';

const RestaurantList = ({ restaurants, onSelectRestaurant }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {restaurants.map((restaurant) => (
        <Card key={restaurant.id} className="bg-white shadow-md rounded-lg overflow-hidden transform hover:scale-105 transition-transform duration-300">
          <CardContent className="p-6">
            <CardTitle 
              className="text-2xl font-bold text-purple-600 cursor-pointer" 
              onClick={() => onSelectRestaurant(restaurant)}
            >
              {restaurant.name}
            </CardTitle>
            <CardDescription className="text-gray-700 mt-2">
              {restaurant.description}
            </CardDescription>
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
              <a 
                href={restaurant.google} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-500 underline mt-2 inline-block"
              >
                View on Google
              </a>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default RestaurantList;
