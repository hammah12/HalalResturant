// src/components/RestaurantDetailModal.js
import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

const RestaurantDetailModal = ({ restaurant, onClose, user }) => {
  if (!restaurant) return null;

  const imageUrl = restaurant.image; // Using the 'image' column

  // Local state for review submission and fetched reviews
  const [reviewContent, setReviewContent] = useState('');
  const [reviews, setReviews] = useState([]);
  const [isFavorited, setIsFavorited] = useState(false);

  // Fetch reviews for the restaurant when the modal opens
  useEffect(() => {
    if (!restaurant) return;
    const fetchReviews = async () => {
      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .eq('restaurant_id', restaurant.id)
        .order('created_at', { ascending: false });
      if (error) {
        console.error("Error fetching reviews:", error);
      } else {
        setReviews(data);
      }
    };
    fetchReviews();
  }, [restaurant]);

  // Function to add a restaurant to favorites
  const handleAddFavorite = async () => {
    if (!user) return;
    try {
      const { data, error } = await supabase
        .from('favorites')
        .insert([{ restaurant_id: restaurant.id, user_id: user.id }]);
      if (error) throw error;
      setIsFavorited(true);
      console.log("Added to favorites:", data);
    } catch (error) {
      console.error("Error adding favorite:", error.message);
    }
  };

  // Function to submit a review
  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!user || !reviewContent) return;
    try {
      const { data, error } = await supabase
        .from('reviews')
        .insert([{ restaurant_id: restaurant.id, user_id: user.id, content: reviewContent }]);
      if (error) throw error;
      console.log("Review submitted:", data);
      setReviewContent('');
      // Optionally, update your local reviews state by re-fetching reviews:
      const { data: updatedReviews, error: fetchError } = await supabase
        .from('reviews')
        .select('*')
        .eq('restaurant_id', restaurant.id)
        .order('created_at', { ascending: false });
      if (fetchError) {
        console.error("Error fetching reviews:", fetchError);
      } else {
        setReviews(updatedReviews);
      }
    } catch (error) {
      console.error("Error submitting review:", error.message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Modal Backdrop */}
      <div 
        className="fixed inset-0 bg-black opacity-50" 
        onClick={onClose}
      ></div>

      {/* Modal Content */}
      <div className="relative bg-white rounded-xl shadow-2xl overflow-hidden w-full max-w-3xl mx-auto">
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
            {restaurant.address && (
              <p className="text-gray-700 mb-2">
                <strong>Address:</strong> {restaurant.address}
              </p>
            )}
            {restaurant.google && (
              <p className="text-gray-700 mb-2">
                <strong>Google:</strong>{" "}
                <a 
                  href={restaurant.google} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-indigo-600 underline hover:text-indigo-800"
                >
                  View on Google Maps
                </a>
              </p>
            )}
            <p className="text-gray-600 mb-4">{restaurant.reviews}</p>
            
            {/* Favorite Button */}
            {user && (
              <div className="flex space-x-4 mb-4">
                <button 
                  onClick={handleAddFavorite}
                  className={`bg-green-500 text-white font-semibold px-4 py-2 rounded-full shadow hover:bg-green-600 transition-colors duration-300 ${
                    isFavorited ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                  disabled={isFavorited}
                >
                  {isFavorited ? 'Favorited' : 'Add to Favorites'}
                </button>
              </div>
            )}

            {/* Review Submission Form */}
            {user && (
              <form onSubmit={handleSubmitReview} className="mb-4">
                <textarea
                  value={reviewContent}
                  onChange={(e) => setReviewContent(e.target.value)}
                  placeholder="Write your review here..."
                  className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  rows={3}
                />
                <button 
                  type="submit"
                  className="mt-2 bg-pink-500 text-white font-semibold px-4 py-2 rounded-full shadow hover:bg-pink-600 focus:outline-none focus:ring-2 focus:ring-pink-400"
                >
                  Submit Review
                </button>
              </form>
            )}

            {/* Reviews List */}
            {reviews.length > 0 && (
              <div className="mt-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Reviews</h3>
                <ul className="space-y-2 max-h-48 overflow-y-auto">
                  {reviews.map((rev) => (
                    <li key={rev.id} className="p-3 bg-gray-100 rounded">
                      <p className="text-gray-700">{rev.content}</p>
                      <span className="text-gray-500 text-xs">
                        {new Date(rev.created_at).toLocaleString()}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

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
