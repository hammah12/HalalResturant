// src/App.js
import React from 'react';
import './App.css';
import RestaurantCard from './components/RestaurantCard';
import restaurants from './data/restaurants'; // Import the data

function App() {
    return (
        <div className="app">
            <header className="app-header">
                <h1>Halal Restaurant Finder</h1>
            </header>
            <main className="app-main">
                {restaurants.map(restaurant => (
                    <RestaurantCard key={restaurant.id} restaurant={restaurant} />
                ))}
            </main>
        </div>
    );
}

export default App;
