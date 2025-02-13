// src/components/RestaurantDetail.js
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../supabaseClient';

const RestaurantDetail = () => {
  const { id } = useParams(); // Extract the restaurant ID from the URL
  const [restaurant, setRestaurant] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({
    rating: '',
    comment: '',
  });

  // Fetch restaurant details using the ID from URL
  useEffect(() => {
    if (!id) return;
    const fetchRestaurant = async () => {
      const { data, error } = await supabase
        .from('restaurants')
        .select('*')
        .eq('id', id)
        .single();
      if (error) {
        console.error("Error fetching restaurant:", error);
      } else {
        setRestaurant(data);
      }
    };

    fetchRestaurant();
  }, [id]);

  // Fetch reviews for this restaurant
  useEffect(() => {
    if (!id) return;
    const fetchReviews = async () => {
      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .eq('restaurant_id', id)
        .order('created_at', { ascending: false });
      if (error) {
        console.error("Error fetching reviews:", error);
      } else {
        setReviews(data);
      }
    };

    fetchReviews();
  }, [id]);

  const handleReviewChange = (e) => {
    const { name, value } = e.target;
    setNewReview((prev) => ({ ...prev, [name]: value }));
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();

    const reviewToInsert = {
      restaurant_id: id, // Use the id from URL
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
      // Prepend the new review to the reviews list
      setReviews((prev) => [data[0], ...prev]);
      setNewReview({ rating: '', comment: '' });
    }
  };

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
