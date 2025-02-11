// src/App.js
import React, { useEffect, useState } from 'react';
import { supabase } from './supabaseClient';
import Navbar from './components/Navbar';
import RestaurantList from './components/RestaurantList';
import RestaurantDetailModal from './components/RestaurantDetailModal';
import AuthModal from './components/AuthModal';
import AddRestaurantModal from './components/AddRestaurantModal';

const App = () => {
   const HeroSection = () => {
  return (
    <div className="relative text-center text-white py-20" style={{ backgroundImage: 'url(https://halalfoundation.org/wp-content/uploads/2024/04/halal-food-1080x620.jpg/1200x400)', backgroundSize: 'cover' }}>
      <div className="bg-black bg-opacity-50 p-10 rounded-lg">
        <h1 className="text-5xl font-extrabold">Find the Best Halal Food in Your City</h1>
        <p className="text-lg mt-4">Discover, rate, and share your favorite halal restaurants.</p>
        <button className="mt-6 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg shadow-md transition-all">
          Explore Now
        </button>
      </div>
    </div>
  );
};
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
  const [newRestaurant, setNewRestaurant] = useState({
    name: '',
    description: '',
    address: '',
    rating: 0,
    halalStatus: '',
    google: '',
    hours: '',
    phone: '',
  });
  const [showAddModal, setShowAddModal] = useState(false);

  // ---------------------------
  // useEffect: Check Auth & Fetch Restaurants
  // ---------------------------
  useEffect(() => {
    const getSession = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) {
        console.error("Error getting session:", error);
      } else {
        setUser(session?.user ?? null);
      }
    };
    getSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
    });

    fetchRestaurants();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchRestaurants = async () => {
    const { data, error } = await supabase.from('restaurants').select('*');
    if (error) {
      console.error("Error fetching restaurants:", error);
    } else {
      setRestaurants(data);
    }
  };

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

  // ---------------------------
  // Add Restaurant Handler
  // ---------------------------
  const handleAddRestaurant = async () => {
    if (!user) {
      console.error("You must be signed in to add a restaurant!");
      return;
    }
    const { data, error } = await supabase.from('restaurants').insert([newRestaurant]);
    if (error) {
      console.error("Error inserting restaurant:", error);
    } else {
      console.log("Inserted restaurant:", data);
      setRestaurants([...restaurants, ...data]);
      setNewRestaurant({
        name: '',
        description: '',
        address: '',
        rating: 0,
        halalStatus: '',
        google: '',
        hours: '',
        phone: '',
      });
      setShowAddModal(false);
    }
  };

  // ---------------------------
  // Filter & Sort Restaurants
  // ---------------------------
  const filteredRestaurants = restaurants
    .filter((restaurant) => {
      const matchesSearch =
        restaurant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        restaurant.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        restaurant.address.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesHalal = halalFilter === '' || restaurant.halalStatus === halalFilter;
      return matchesSearch && matchesHalal;
    })
    .sort((a, b) => {
      if (sortOption === 'rating') return b.rating - a.rating;
      if (sortOption === 'name') return a.name.localeCompare(b.name);
      return 0;
    });

  const handleNewRestaurantChange = (e) => {
    const { name, value } = e.target;
    setNewRestaurant(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar 
        user={user}
        onAddRestaurant={() => setShowAddModal(true)}
        onSignOut={handleSignOut}
        onSignIn={() => setShowAuthModal(true)}
      />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-4xl font-extrabold text-center text-gray-800 mb-6">
            Halal Restaurants in Chicago
          </h2>
          <div className="flex flex-wrap gap-4 justify-center mb-6">
            <input
              type="text"
              placeholder="Search by name, food type, or city..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className="p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="name">Sort by Name</option>
              <option value="rating">Sort by Rating</option>
            </select>
            <select
              value={halalFilter}
              onChange={(e) => setHalalFilter(e.target.value)}
              className="p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="">All Halal Types</option>
              <option value="HMS">HMS</option>
              <option value="HFSAA">HFSAA</option>
              <option value="Self-Reported">Self-Reported</option>
            </select>
          </div>

          <RestaurantList 
            restaurants={filteredRestaurants}
            onSelectRestaurant={(restaurant) => setSelectedRestaurant(restaurant)}
          />
        </div>
      </main>

      {selectedRestaurant && (
        <RestaurantDetailModal 
          restaurant={selectedRestaurant} 
          onClose={() => setSelectedRestaurant(null)}
        />
      )}

      {showAuthModal && (
        <AuthModal 
          authMode={authMode}
          email={email}
          setEmail={setEmail}
          password={password}
          setPassword={setPassword}
          onSignIn={handleSignIn}
          onSignUp={handleSignUp}
          onClose={() => setShowAuthModal(false)}
          toggleAuthMode={() => setAuthMode(authMode === "signin" ? "signup" : "signin")}
        />
      )}

      {showAddModal && (
        <AddRestaurantModal 
          newRestaurant={newRestaurant}
          handleNewRestaurantChange={handleNewRestaurantChange}
          onAddRestaurant={handleAddRestaurant}
          onClose={() => setShowAddModal(false)}
        />
      )}
    </div>
  );
};

export default App;
