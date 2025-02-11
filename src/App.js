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
      const { data, error } = await supabase.from('restaurants').select('*');
      if (error) {
        console.error("Error fetching restaurants:", error);
      } else {
        setRestaurants(data);
      }
    };

    const getSession = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) {
        console.error("Error getting session:", error);
      } else {
        setUser(session?.user ?? null);
      }
    };

    getSession();
    fetchRestaurants();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
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
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) {
      console.error("Error signing up:", error.message);
    } else {
      console.log("Signed up user:", data);
    }
  };

  const handleSignIn = async () => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      console.error("Error signing in:", error.message);
    } else {
      console.log("Signed in user:", data);
      setShowAuthModal(false);
    }
  };

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
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

      <main className="container mx-auto px-4 py-8">
        <h2 className="text-4xl font-extrabold text-center text-gray-800 mb-6">
          Halal Restaurants in Chicago
        </h2>
        <div className="flex flex-wrap gap-4 justify-center mb-6">
          <input type="text" placeholder="Search..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="p-3 rounded-lg border border-gray-300" />
          <select value={sortOption} onChange={(e) => setSortOption(e.target.value)} className="p-3 rounded-lg border border-gray-300">
            <option value="name">Sort by Name</option>
            <option value="rating">Sort by Rating</option>
          </select>
          <select value={halalFilter} onChange={(e) => setHalalFilter(e.target.value)} className="p-3 rounded-lg border border-gray-300">
            <option value="">All Halal Types</option>
            <option value="HMS">HMS</option>
            <option value="HFSAA">HFSAA</option>
            <option value="Self-Reported">Self-Reported</option>
          </select>
        </div>

        <RestaurantList restaurants={restaurants} onSelectRestaurant={setSelectedRestaurant} />
      </main>

      {showAddModal && <AddRestaurantForm onClose={() => setShowAddModal(false)} />}
      {selectedRestaurant && <RestaurantDetailModal restaurant={selectedRestaurant} onClose={() => setSelectedRestaurant(null)} />}
      {showAuthModal && <AuthModal authMode={authMode} setAuthMode={setAuthMode} email={email} setEmail={setEmail} password={password} setPassword={setPassword} onClose={() => setShowAuthModal(false)} />}
    </div>
  );
};

export default App;
