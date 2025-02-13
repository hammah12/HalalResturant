// src/App.js
import React, { useEffect, useState } from 'react';
import { supabase } from './supabaseClient';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import RestaurantList from './components/RestaurantList';
import RestaurantDetailModal from './components/RestaurantDetailModal';
import AuthModal from './components/AuthModal';
import AddRestaurantForm from './components/AddRestaurantForm';

const App = () => {
  // ---------------------------
  // State for Restaurants Listing
  // ---------------------------
  const [restaurants, setRestaurants] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState('name');
  const [halalFilter, setHalalFilter] = useState('');
  const [groupingOption, setGroupingOption] = useState('location'); // New grouping state
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);

  // ---------------------------
  // State for Authentication
  // ---------------------------
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authMode, setAuthMode] = useState("signin");
  const [showAuthModal, setShowAuthModal] = useState(false);
  
  // ---------------------------
  // State for New Restaurant Form
  // ---------------------------
  const [showAddModal, setShowAddModal] = useState(false);

  // ---------------------------
  // useEffect: Check Auth & Fetch Restaurants
  // ---------------------------
  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const { data, error } = await supabase.from('restaurants').select('*');
        if (error) {
          throw error;
        }
        console.log("Fetched restaurants:", data);
        setRestaurants(data);
      } catch (error) {
        console.error("Error fetching restaurants:", error);
      }
    };

    const getSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
          throw error;
        }
        console.log("Current session:", session);
        setUser(session?.user ?? null);
      } catch (error) {
        console.error("Error getting session:", error);
      }
    };

    getSession();
    fetchRestaurants();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("Auth state changed:", event, session);
      setUser(session?.user ?? null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // ---------------------------
  // Authentication Handlers
  // ---------------------------
  const handleSignUp = async () => {
    try {
      const { data, error } = await supabase.auth.signUp({ email, password });
      if (error) {
        throw error;
      }
      console.log("Signed up user:", data);
    } catch (error) {
      console.error("Error signing up:", error.message);
    }
  };

  const handleSignIn = async () => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        throw error;
      }
      console.log("Signed in user:", data);
      setShowAuthModal(false);
    } catch (error) {
      console.error("Error signing in:", error.message);
    }
  };

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        throw error;
      }
      console.log("Signed out successfully");
    } catch (error) {
      console.error("Error signing out:", error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar 
        user={user}
        onAddRestaurant={() => setShowAddModal(true)}
        onSignOut={handleSignOut}
        onSignIn={() => setShowAuthModal(true)}
      />

      <HeroSection />

      <main className="container mx-auto px-6 py-10">
        <h2 className="text-5xl font-extrabold text-center text-gray-800 mb-8">
          Halal Restaurants in Chicago
        </h2>
        <div className="flex flex-wrap justify-center gap-4 mb-10">
          <input 
            type="text" 
            placeholder="Search restaurants..." 
            value={searchTerm} 
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full md:w-1/3 p-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <select 
            value={sortOption} 
            onChange={(e) => setSortOption(e.target.value)}
            className="w-full md:w-1/5 p-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="name">Sort by Name</option>
            <option value="rating">Sort by Rating</option>
          </select>
          <select 
            value={halalFilter} 
            onChange={(e) => setHalalFilter(e.target.value)}
            className="w-full md:w-1/5 p-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">All Halal Types</option>
            <option value="HMS">HMS</option>
            <option value="HFSAA">HFSAA</option>
            <option value="Self-Reported">Self-Reported</option>
          </select>
          <select 
            value={groupingOption} 
            onChange={(e) => setGroupingOption(e.target.value)}
            className="w-full md:w-1/5 p-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="location">Group by Location</option>
            <option value="cuisine">Group by Cuisine</option>
            <option value="none">No Grouping</option>
          </select>
        </div>

        <RestaurantList 
          restaurants={restaurants} 
          onSelectRestaurant={setSelectedRestaurant} 
          groupingOption={groupingOption}
          searchTerm={searchTerm}
          sortOption={sortOption}
          halalFilter={halalFilter}
        />
      </main>

      {showAddModal && <AddRestaurantForm onClose={() => setShowAddModal(false)} />}
      {selectedRestaurant && 
        <RestaurantDetailModal 
          restaurant={selectedRestaurant} 
          onClose={() => setSelectedRestaurant(null)} 
        />}
      {showAuthModal && 
        <AuthModal 
          authMode={authMode} 
          setAuthMode={setAuthMode} 
          email={email} 
          setEmail={setEmail} 
          password={password} 
          setPassword={setPassword} 
          onClose={() => setShowAuthModal(false)} 
        />}
    </div>
  );
};

export default App;
