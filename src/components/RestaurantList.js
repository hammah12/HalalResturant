// src/components/RestaurantList.js
import React from 'react';

const RestaurantList = ({
  restaurants,
  onSelectRestaurant,
  groupingOption,
  searchTerm,
  sortOption,
  halalFilter
}) => {
  // Filter restaurants based on search term and halal filter
  const filteredRestaurants = restaurants.filter((restaurant) => {
    const matchesSearch = restaurant.name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesHalalFilter = halalFilter ? restaurant.halalType === halalFilter : true;
    return matchesSearch && matchesHalalFilter;
  });

  // Sort restaurants based on selected option
  const sortedRestaurants = [...filteredRestaurants].sort((a, b) => {
    if (sortOption === 'name') {
      return a.name.localeCompare(b.name);
    } else if (sortOption === 'rating') {
      return (b.rating || 0) - (a.rating || 0);
    }
    return 0;
  });

  // Group restaurants based on selected option (location, cuisine, or none)
  const groupRestaurants = (restaurants, groupBy) => {
    if (!groupBy || groupBy === 'none') return { All: restaurants };

    return restaurants.reduce((groups, restaurant) => {
      const key = restaurant[groupBy] || 'Others';
      if (!groups[key]) groups[key] = [];
      groups[key].push(restaurant);
      return groups;
    }, {});
  };

  const groupedRestaurants = groupRestaurants(sortedRestaurants, groupingOption);

  return (
    <div>
      {Object.keys(groupedRestaurants).map((groupKey) => (
        <div key={groupKey} className="mb-12">
          {/* Group Title */}
          <h3 className="text-3xl font-bold mb-6 text-pink-500">{groupKey}</h3>

          {/* Responsive Grid */}
          <ul className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {groupedRestaurants[groupKey].map((restaurant) => {
              console.log(`Restaurant object keys for ${restaurant.name}:`, Object.keys(restaurant));
              const imageUrl = restaurant.image; // Updated column name

              return (
                <li
                  key={restaurant.id}
                  className="bg-white rounded-xl overflow-hidden transform transition-all hover:scale-105 hover:shadow-2xl cursor-pointer border border-gray-200"
                >
                  <div className="flex flex-col h-full">
                    {/* Image Section */}
                    {imageUrl ? (
                      <div className="h-48 overflow-hidden">
                        <img
                          src={imageUrl}
                          alt={restaurant.name}
                          className="object-cover w-full h-full"
                          onError={(e) => {
                            console.error(`Failed to load image for ${restaurant.name} at URL: ${imageUrl}`);
                            e.target.onerror = null;
                            e.target.src = '/fallback-image.png';
                          }}
                        />
                      </div>
                    ) : (
                      <div className="h-48 flex items-center justify-center bg-gray-300 text-gray-700">
                        No Image
                      </div>
                    )}

                    {/* Text Section */}
                    <div className="p-6 flex flex-col flex-grow bg-gradient-to-br from-white to-yellow-50">
                      <h4 className="text-2xl font-bold mb-2 text-indigo-700">{restaurant.name}</h4>
                      <p className="text-md font-medium text-gray-800 mb-3">
                        {restaurant.cuisine} | {restaurant.halalType}
                        {restaurant.location ? ` | ${restaurant.location}` : ''}
                      </p>
                      <p className="text-gray-600 text-sm flex-grow">{restaurant.reviews}</p>
                      <div className="mt-4">
                        <button
                          onClick={() => {
                            console.log(`View details clicked for ${restaurant.name}`);
                            // Pass only the restaurant ID
                            onSelectRestaurant(restaurant.id);
                          }}
                          className="bg-pink-500 text-white font-semibold px-4 py-2 rounded-full shadow hover:bg-pink-600 focus:outline-none focus:ring-2 focus:ring-pink-400"
                        >
                          View Details &rarr;
                        </button>
                      </div>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default RestaurantList;
