// src/components/RestaurantDetail.js
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../supabaseClient';

// Helper function to render star icons based on rating (1-5)
const renderStars = (rating) => {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    if (i <= rating) {
      stars.push(
        <svg
          key={i}
          className="w-5 h-5 text-yellow-400 inline-block"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.982a1 1 0 00.95.69h4.21c.969 0 1.371 1.24.588 1.81l-3.404 2.47a1 1 0 00-.364 1.118l1.286 3.982c.3.921-.755 1.688-1.54 1.118l-3.404-2.47a1 1 0 00-1.175 0l-3.404 2.47c-.784.57-1.838-.197-1.539-1.118l1.286-3.982a1 1 0 00-.364-1.118L2.225 9.41c-.783-.57-.38-1.81.588-1.81h4.21a1 1 0 00.95-.69l1.286-3.982z" />
        </svg>
      );
    } else {
      stars.push(
        <svg
          key={i}
          className="w-5 h-5 text-gray-300 inline-block"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.982a1 1 0 00.95.69h4.21c.969 0 1.371 1.24.588 1.81l-3.404 2.47a1 1 0 00-.364 1.118l1.286 3.982c.3.921-.755 1.688-1.54 1.118l-3.404-2.47a1 1 0 00-1.175 0l-3.404 2.47c-.784.57-1.838-.197-1.539-1.118l1.286-3.982a1 1 0 00-.364-1.118L2.225 9.41c-.783-.57-.38-1.81.588-1.81h4.21a1 1 0 00.95-.69l1.286-3.982z" />
        </svg>
      );
    }
  }
  return stars;
};

const RestaurantDetail = () => {
  // Extract the restaurant ID from the URL parameters.
  const { id } = useParams();
  // Ensure id is always a string.
  const restaurantId = id ? String(id) : null;
  console.log("Restaurant ID:", restaurantId);

  const [restaurant, setRestaurant] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({ rating: '', comment: '' });
  const [error, setError] = useState(null);

  // Fetch restaurant details using the provided id.
  useEffect(() => {
    if (!restaurantId) {
      setError("Invalid restaurant ID.");
      return;
    }

    const fetchRestaurant = async () => {
      const { data, error } = await supabase
        .from('restaurants')
        .select('*')
        .eq('id', restaurantId)
        .single();
      if (error) {
        console.error("Error fetching restaurant:", error);
        setError("Error fetching restaurant details.");
      } else {
        setRestaurant(data);
      }
    };

    fetchRestaurant();
  }, [restaurantId]);

  // Fetch reviews for this restaurant.
  useEffect(() => {
    if (!restaurantId) return;

    const fetchReviews = async () => {
      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .eq('restaurant_id', restaurantId)
        .order('created_at', { ascending: false });
      if (error) {
        console.error("Error fetching reviews:", error);
        setError("Error fetching reviews.");
      } else {
        setReviews(data);
      }
    };

    fetchReviews();
  }, [restaurantId]);

  // Handle changes in the review form.
  const handleReviewChange = (e) => {
    const { name, value } = e.target;
    setNewReview((prev) => ({ ...prev, [name]: value }));
  };

  // Handle submission of a new review.
  const handleReviewSubmit = async (e) => {
    e.preventDefault();

    const reviewToInsert = {
      restaurant_id: restaurantId,
      rating: newReview.rating,
      comment: newReview.comment,
      // If you have the user's id available, you can also add: user_id: user.id
    };

    // Insert the new review and ask for the inserted row to be returned.
    const { data, error } = await supabase
      .from('reviews')
      .insert([reviewToInsert], { returning: 'representation' });

    if (error) {
      console.error("Error adding review:", error);
      alert("Error adding review");
    } else if (!data || data.length === 0) {
      console.error("No data returned after insert, re-fetching reviews.");
      const { data: fetchedReviews, error: fetchError } = await supabase
        .from('reviews')
        .select('*')
        .eq('restaurant_id', restaurantId)
        .order('created_at', { ascending: false });
      if (fetchError) {
        console.error("Error fetching reviews after insert:", fetchError);
        alert("Error fetching reviews after insert");
      } else {
        setReviews(fetchedReviews);
        setNewReview({ rating: '', comment: '' });
        alert("Review added successfully!");
      }
    } else {
      setReviews((prev) => [data[0], ...prev]);
      setNewReview({ rating: '', comment: '' });
      alert("Review added successfully!");
    }
  };

  // If an error occurred, display it.
  if (error) {
    return (
      <div className="container mx-auto p-4 text-center text-red-500">
        {error}
      </div>
    );
  }

  // If restaurant details have not loaded yet, show a loading indicator.
  if (!restaurant) {
    return <div className="container mx-auto p-4">Loading restaurant details...</div>;
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
        <p className="mb-1">
          <strong>Address:</strong> {restaurant.address}
        </p>
        <p className="mb-1">
          <strong>Rating:</strong> {restaurant.rating}
        </p>
      </div>

      {/* Reviews Section */}
      <div className="reviews-section">
        <h2 className="text-2xl font-semibold mb-4">Reviews</h2>

        {/* Review Form */}
        <div className="review-form mb-6 p-4 border rounded shadow bg-white">
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
              {/* Display stars as a preview */}
              <span className="ml-2">
                {renderStars(Number(newReview.rating))}
              </span>
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
        <div className="reviews-list space-y-4">
          {reviews.length === 0 ? (
            <p>No reviews yet. Be the first to review!</p>
          ) : (
            reviews.map((review) => (
              <div
                key={review.id}
                className="review p-4 border rounded bg-white shadow"
              >
                <div className="flex items-center mb-2">
                  <span className="mr-2 font-semibold">Rating:</span>
                  {renderStars(Number(review.rating))}
                </div>
                <p className="mb-1">{review.comment}</p>
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
