// RestaurantDetail.js
import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';

/*
  RestaurantDetail Component:
  - Displays details of a specific restaurant.
  - Fetches restaurant data and associated reviews from Supabase.
  - Allows users to add a new review via a review form.
  
  Expected Database Schema:
  - restaurants: { id, name, description, address, rating, image, ... }
  - reviews: { id, restaurant_id, rating, comment, created_at, ... }
  
  Props:
  - restaurantId: The ID of the restaurant to display.
*/
const RestaurantDetail = ({ restaurantId }) => {
  const [restaurant, setRestaurant] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({
    rating: '',
    comment: '',
  });

  // Fetch restaurant details based on restaurantId
  useEffect(() => {
    const fetchRestaurant = async () => {
      const { data, error } = await supabase
        .from('restaurants')
        .select('*')
        .eq('id', restaurantId)
        .single();
      if (error) {
        console.error("Error fetching restaurant:", error);
      } else {
        setRestaurant(data);
      }
    };

    fetchRestaurant();
  }, [restaurantId]);

  // Fetch reviews for this restaurant
  useEffect(() => {
    const fetchReviews = async () => {
      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .eq('restaurant_id', restaurantId)
        .order('created_at', { ascending: false });
      if (error) {
        console.error("Error fetching reviews:", error);
      } else {
        setReviews(data);
      }
    };

    fetchReviews();
  }, [restaurantId]);

  // Handle changes in the review form inputs
  const handleReviewChange = (e) => {
    const { name, value } = e.target;
    setNewReview((prev) => ({ ...prev, [name]: value }));
  };

  // Handle submission of a new review
  const handleReviewSubmit = async (e) => {
    e.preventDefault();

    const reviewToInsert = {
      restaurant_id: restaurantId,
      rating: newReview.rating,
      comment: newReview.comment,
    };

    const { data, error } = await supabase
      .from('reviews')
      .insert([reviewToInsert]);
    if (error) {
      console.error("Error adding review:", error);
      alert("Error adding review");
    } else {
      // Prepend the new review to the list of reviews
      setReviews((prev) => [data[0], ...prev]);
      setNewReview({ rating: '', comment: '' });
    }
  };

  // Render a loading state if restaurant data is not yet available
  if (!restaurant) {
    return <div>Loading restaurant details...</div>;
  }

  return (
    <div className="restaurant-detail container mx-auto p-4">
      {/* Restaurant Information */}
      <div className="restaurant-info mb-8">
        <h1 className="text-3xl font-bold mb-2">{restaurant.name}</h1>
        {restaurant.image && (
          <img
            src={restaurant.image}
            alt={restaurant.name}
            className="w-full h-auto mb-4 rounded shadow"
          />
        )}
        <p className="mb-2">{restaurant.description}</p>
        <p className="mb-1"><strong>Address:</strong> {restaurant.address}</p>
        <p className="mb-1"><strong>Rating:</strong> {restaurant.rating}</p>
      </div>

      {/* Reviews Section */}
      <div className="reviews-section">
        <h2 className="text-2xl font-semibold mb-4">Reviews</h2>

        {/* Review Form */}
        <div className="review-form mb-6 p-4 border rounded shadow">
          <h3 className="text-xl font-medium mb-2">Add a Review</h3>
          <form onSubmit={handleReviewSubmit}>
            <div className="mb-2">
              <label className="mr-2">Rating:</label>
              <select
                name="rating"
                value={newReview.rating}
                onChange={handleReviewChange}
                className="p-1 border rounded"
                required
              >
                <option value="">Select Rating</option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
              </select>
            </div>
            <div className="mb-2">
              <label className="block mb-1">Comment:</label>
              <textarea
                name="comment"
                value={newReview.comment}
                onChange={handleReviewChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Submit Review
            </button>
          </form>
        </div>

        {/* Display Reviews */}
        <div className="reviews-list">
          {reviews.length === 0 ? (
            <p>No reviews yet. Be the first to review!</p>
          ) : (
            reviews.map((review) => (
              <div key={review.id} className="review p-4 mb-4 border rounded">
                <p className="font-semibold">Rating: {review.rating}</p>
                <p>{review.comment}</p>
                {review.created_at && (
                  <p className="text-sm text-gray-500">
                    {new Date(review.created_at).toLocaleString()}
                  </p>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default RestaurantDetail;
