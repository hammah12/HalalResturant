import React, { useEffect, useState } from 'react';
import { supabase } from './supabaseClient'; // Ensure this path is correct
import Card from './components/Card';
import CardTitle from './components/CardTitle';
import CardDescription from './components/CardDescription';
import CardContent from './components/CardContent';

const App = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState('name');
  const [halalFilter, setHalalFilter] = useState('');
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);

  useEffect(() => {
    const fetchRestaurants = async () => {
      console.log("Fetching restaurants...");
      const { data, error } = await supabase.from('restaurants').select('*');

      if (error) {
        console.error('Error fetching restaurants:', error);
      } else {
        console.log("Fetched restaurants:", data);
        setRestaurants(data);
      }
    };

    fetchRestaurants();
  }, []);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSort = (event) => {
    setSortOption(event.target.value);
  };

  const handleHalalFilter = (event) => {
    setHalalFilter(event.target.value);
  };

  const handleViewDetails = (restaurant) => {
    console.log("Viewing details for:", restaurant);
    setSelectedRestaurant(restaurant);
  };

  const handleCloseDetails = () => {
    setSelectedRestaurant(null);
  };

  const filteredRestaurants = restaurants
    .filter((restaurant) =>
      (restaurant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        restaurant.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        restaurant.address.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (halalFilter === '' || restaurant.halalStatus === halalFilter)
    )
    .sort((a, b) => {
      if (sortOption === 'rating') {
        return b.rating - a.rating;
      } else if (sortOption === 'name') {
        return a.name.localeCompare(b.name);
      }
      return 0;
    });

  return (
    <div className="min-h-screen bg-white text-gray-900 p-8">
      <h1 className="text-5xl font-extrabold text-center mb-12 text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
        Halal Restaurants in Chicago
      </h1>
      <div className="flex justify-between mb-8">
        <input
          type="text"
          placeholder="Search by name, food type, or city..."
          value={searchTerm}
          onChange={handleSearch}
          className="w-full max-w-md p-3 rounded-lg bg-gray-200 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
        <select
          value={sortOption}
          onChange={handleSort}
          className="p-3 rounded-lg bg-gray-200 text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          <option value="name">Sort by Name</option>
          <option value="rating">Sort by Rating</option>
        </select>
        <select
          value={halalFilter}
          onChange={handleHalalFilter}
          className="p-3 rounded-lg bg-gray-200 text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          <option value="">All Halal Types</option>
          <option value="HMS">HMS</option>
          <option value="HFSAA">HFSAA</option>
          <option value="Self-Reported">Self-Reported</option>
        </select>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredRestaurants.map((restaurant) => (
          <Card
            key={restaurant.id}
            className="bg-gray-100 shadow-xl rounded-xl overflow-hidden transform transition-transform duration-300 hover:scale-105"
          >
            <CardContent className="p-6">
              <CardTitle
                className="text-3xl font-extrabold mb-3 text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 to-pink-600 cursor-pointer"
                onClick={() => handleViewDetails(restaurant)}
              >
                {restaurant.name}
              </CardTitle>
              <CardDescription className="text-gray-700 mb-2">{restaurant.description}</CardDescription>
              <p className="text-gray-600 mb-4">{restaurant.address}</p>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center">
                  <span className="text-yellow-500 mr-2">★</span>
                  <span className="text-gray-800 text-lg">{restaurant.rating}</span>
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
                  className="text-blue-500 underline mt-2"
                >
                  View on Google
                </a>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
      {selectedRestaurant && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full">
            <h2 className="text-3xl font-bold mb-4">{selectedRestaurant.name}</h2>
            <p className="text-gray-700 mb-2">{selectedRestaurant.description}</p>
            <p className="text-gray-600 mb-2">{selectedRestaurant.address}</p>
            <p className="text-gray-600 mb-2">{selectedRestaurant.hours}</p>
            <p className="text-gray-600 mb-4">{selectedRestaurant.phone}</p>
            <button
              onClick={handleCloseDetails}
              className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
