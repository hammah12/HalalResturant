// src/components/UserProfile.js
import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';

const UserProfile = ({ user }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch reviews for the current user from the 'reviews' table.
  useEffect(() => {
    if (!user) return;
    const fetchUserReviews = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      if (error) {
        console.error('Error fetching user reviews:', error);
        setError(error.message);
      } else {
        setReviews(data);
      }
      setLoading(false);
    };

    fetchUserReviews();
  }, [user]);

  // If no user is provided, ask them to sign in.
  if (!user) {
    return (
      <div className="container mx-auto p-4 text-center">
        <p>Please sign in to view your profile.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">My Profile</h1>
      <div className="mb-6">
        <p>
          <strong>Email:</strong> {user.email}
        </p>
      </div>
      <div>
        <h2 className="text-2xl font-semibold mb-2">My Reviews</h2>
        {loading ? (
          <p>Loading reviews...</p>
        ) : error ? (
          <p className="text-red-500">Error: {error}</p>
        ) : reviews.length === 0 ? (
          <p>You haven't written any reviews yet.</p>
        ) : (
          <ul className="space-y-4">
            {reviews.map((review) => (
              <li key={review.id} className="p-4 border rounded bg-white shadow">
                <p>
                  <strong>Rating:</strong> {review.rating}
                </p>
                <p>{review.comment}</p>
                {review.created_at && (
                  <p className="text-sm text-gray-500">
                    {new Date(review.created_at).toLocaleString()}
                  </p>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
