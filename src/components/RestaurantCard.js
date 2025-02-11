// src/components/RestaurantCard.js
import React from 'react';
import './RestaurantCard.css';

function RestaurantCard({ restaurant }) {
    return (
        <div className="restaurant-card">
            <img src={restaurant.imageUrl} alt={restaurant.name} className="restaurant-image" />
            <div className="restaurant-info">
                <h2 className="restaurant-name">{restaurant.name}</h2>
                <p className="restaurant-address">{restaurant.address}</p>
                <p className="restaurant-cuisine">Cuisine: {restaurant.cuisine}</p>
                <p className="restaurant-rating">Rating: {restaurant.rating} / 5</p>
                <div className="restaurant-reviews">
                    <h3>Reviews</h3>
                    {restaurant.reviews.map((review, index) => (
                        <div key={index} className="review">
                            <strong>{review.user}:</strong> {review.comment}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default RestaurantCard;
