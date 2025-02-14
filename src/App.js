// src/App.js
import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { supabase } from './supabaseClient';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import RestaurantList from './components/RestaurantList';
import RestaurantDetail from './components/RestaurantDetail';
import AuthModal from './components/AuthModal';
import AddRestaurantForm from './components/AddRestaurantForm';
import UserProfile from './components/UserProfile';

const Home = ({
  restaurants,
  searchTerm,
  sortOption,
  halalFilter,
  groupingOption,
  setSearchTerm,
  setSortOption,
  setHalalFilter,
  setGroupingOption,
  onSelectRestaurant,
}) => {
  return (
    <>
      <HeroSection />
      <main className="container mx-auto px-6 py-10">
        <h2 className="text-5xl font-extrabold text-center text-gray-800 mb-8">
          Halal Restaurants in Chicago
        </h2>
        {/* (Filter inputs remain here) */}
        <RestaurantList
          restaurants={restaurants}
          onSelectRestaurant={onSelectRestaurant} // Called with restaurant.id
          groupingOption={groupingOption}
          searchTerm={searchTerm}
          sortOption={sortOption}
          halalFilter={halalFilter}
        />
      </main>
    </>
  );
};

const App = () => {
  // ... your existing states and effects ...

  const navigate = useNavigate();

  // Use this function when a restaurant is selected from the list.
  const handleSelectRestaurant = (restaurantOrId) => {
    const restaurantId =
      typeof restaurantOrId === 'object' && restaurantOrId !== null
        ? restaurantOrId.id
        : restaurantOrId;
    navigate(`/restaurant/${restaurantId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar
        user={user}
        onAddRestaurant={() => setShowAddModal(true)}
        onSignIn={() => setShowAuthModal(true)}
      />

      {/* Add top padding to prevent header overlap */}
      <div className="pt-20">
        <Routes>
          {/* Home Route */}
          <Route
            path="/"
            element={
              <Home
                restaurants={restaurants}
                searchTerm={searchTerm}
                sortOption={sortOption}
                halalFilter={halalFilter}
                groupingOption={groupingOption}
                setSearchTerm={setSearchTerm}
                setSortOption={setSortOption}
                setHalalFilter={setHalalFilter}
                setGroupingOption={setGroupingOption}
                onSelectRestaurant={handleSelectRestaurant}
              />
            }
          />

          {/* Restaurant Detail Route */}
          <Route path="/restaurant/:id" element={<RestaurantDetail />} />

          {/* User Profile Route */}
          <Route path="/profile" element={<UserProfile />} />
        </Routes>
      </div>

      {/* Global Modals */}
      {showAddModal && (
        <AddRestaurantForm onClose={() => setShowAddModal(false)} />
      )}
      {showAuthModal && (
        <AuthModal
          authMode={authMode}
          setAuthMode={setAuthMode}
          email={email}
          setEmail={setEmail}
          password={password}
          setPassword={setPassword}
          onClose={() => setShowAuthModal(false)}
        />
      )}
    </div>
  );
};

const AppWrapper = () => (
  <Router>
    <App />
  </Router>
);

export default AppWrapper;
