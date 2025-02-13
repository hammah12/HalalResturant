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
  const filteredRestaurants = restaurants.filter(restaurant => {
    const matchesSearch = restaurant.name.toLowerCase().includes(searchTerm.toLowerCase());
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

  // Group restaurants based on selected option (location, cuisine or none)
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
          <h3 className="text-3xl font-bold mb-6 text-indigo-600">{groupKey}</h3>
          <ul className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {groupedRestaurants[groupKey].map((restaurant) => (
              <li 
                key={restaurant.id} 
                onClick={() => onSelectRestaurant(restaurant)}
                className="p-6 bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow cursor-pointer border border-transparent hover:border-indigo-300"
              >
                <h4 className="text-2xl font-semibold mb-2 text-gray-800">{restaurant.name}</h4>
                <p className="text-gray-600 mb-3">
                  {restaurant.cuisine} | {restaurant.halalType}
                  {restaurant.location ? ` | ${restaurant.location}` : ''}
                </p>
                <p className="text-gray-500 text-sm">{restaurant.reviews}</p>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default RestaurantList;
