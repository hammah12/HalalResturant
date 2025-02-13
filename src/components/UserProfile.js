// src/components/UserProfile.js
import React, { useState, useEffect } from 'react';
// import { supabase } from '../supabaseClient'; // Uncomment and adjust if you want to fetch real data

const UserProfile = () => {
  // Tab state: 'reviews', 'favorites', or 'preferences'
  const [activeTab, setActiveTab] = useState('reviews');

  // Dummy data for demonstration; replace with data from your API
  const [reviews, setReviews] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [preferences, setPreferences] = useState({ cuisine: '', halalCertification: '' });

  // Dummy effect to simulate data fetching
  useEffect(() => {
    // Fetch reviews, favorites, and preferences here (e.g., from Supabase)
    // For now, we'll use static placeholder data
    setReviews([
      { id: 1, restaurant_name: 'Halal Delight', content: 'Great food and service!' },
      { id: 2, restaurant_name: 'Halal Heaven', content: 'Amazing ambiance and tasty dishes.' }
    ]);
    setFavorites([
      { id: 1, restaurant_name: 'Halal Delight' },
      { id: 2, restaurant_name: 'Taste of Halal' }
    ]);
    setPreferences({ cuisine: 'Indian, Mediterranean', halalCertification: 'HMS' });
  }, []);

  // Handler for saving/updating preferences (dummy implementation)
  const handlePreferencesSubmit = (e) => {
    e.preventDefault();
    // Save preferences to Supabase or your API here
    console.log('Preferences saved:', preferences);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center mb-8 text-indigo-700">My Profile</h1>

      {/* Tab Navigation */}
      <div className="flex justify-center mb-6 space-x-4">
        <button 
          onClick={() => setActiveTab('reviews')}
          className={`px-4 py-2 rounded-t-lg focus:outline-none transition-colors ${
            activeTab === 'reviews' ? 'bg-pink-500 text-white' : 'bg-gray-200 text-gray-700'
          }`}
        >
          Reviews
        </button>
        <button 
          onClick={() => setActiveTab('favorites')}
          className={`px-4 py-2 rounded-t-lg focus:outline-none transition-colors ${
            activeTab === 'favorites' ? 'bg-pink-500 text-white' : 'bg-gray-200 text-gray-700'
          }`}
        >
          Favorites
        </button>
        <button 
          onClick={() => setActiveTab('preferences')}
          className={`px-4 py-2 rounded-t-lg focus:outline-none transition-colors ${
            activeTab === 'preferences' ? 'bg-pink-500 text-white' : 'bg-gray-200 text-gray-700'
          }`}
        >
          Preferences
        </button>
      </div>

      {/* Tab Content */}
      <div className="bg-white p-6 rounded-b-lg shadow-md">
        {activeTab === 'reviews' && (
          <div>
            <h2 className="text-2xl font-semibold mb-4 text-indigo-600">My Reviews</h2>
            {reviews.length === 0 ? (
              <p className="text-gray-600">No reviews yet.</p>
            ) : (
              reviews.map(review => (
                <div key={review.id} className="mb-4 border-b pb-2">
                  <h3 className="font-bold text-lg">{review.restaurant_name}</h3>
                  <p className="text-gray-700">{review.content}</p>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'favorites' && (
          <div>
            <h2 className="text-2xl font-semibold mb-4 text-indigo-600">My Favorites</h2>
            {favorites.length === 0 ? (
              <p className="text-gray-600">No favorites yet.</p>
            ) : (
              favorites.map(fav => (
                <div key={fav.id} className="mb-4 border-b pb-2">
                  <h3 className="font-bold text-lg">{fav.restaurant_name}</h3>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'preferences' && (
          <div>
            <h2 className="text-2xl font-semibold mb-4 text-indigo-600">My Preferences</h2>
            <form onSubmit={handlePreferencesSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2" htmlFor="cuisine">
                  Cuisine Preference
                </label>
                <input 
                  id="cuisine"
                  type="text"
                  value={preferences.cuisine}
                  onChange={(e) => setPreferences({ ...preferences, cuisine: e.target.value })}
                  placeholder="e.g., Indian, Chinese"
                  className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2" htmlFor="halalCertification">
                  Halal Certification Preference
                </label>
                <select
                  id="halalCertification"
                  value={preferences.halalCertification}
                  onChange={(e) => setPreferences({ ...preferences, halalCertification: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">Select one</option>
                  <option value="HMS">HMS</option>
                  <option value="HFSAA">HFSAA</option>
                  <option value="Self-Reported">Self-Reported</option>
                </select>
              </div>
              <button 
                type="submit"
                className="bg-pink-500 text-white font-semibold px-6 py-2 rounded-full shadow hover:bg-pink-600 focus:outline-none focus:ring-2 focus:ring-pink-400"
              >
                Save Preferences
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
