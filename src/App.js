// App.js
import React, { useEffect, useState } from 'react';
import { supabase } from './supabaseClient'; // Ensure this path is correct
import Card from './components/Card';
import CardTitle from './components/CardTitle';
import CardDescription from './components/CardDescription';
import CardContent from './components/CardContent';

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

  // ---------------------------
  // Modal Visibility State
  // ---------------------------
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState("signin"); // "signin" or "signup"
  const [showAddModal, setShowAddModal] = useState(false);

  // ---------------------------
  // useEffect: Check Auth & Fetch Restaurants
  // ---------------------------
  useEffect(() => {
    // Get current session
    const getSession = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) {
        console.error("Error getting session:", error);
      } else {
        setUser(session?.user ?? null);
      }
    };
    getSession();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
    });

    // Fetch restaurants
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
  // Authentication Handlers (Supabase v2)
  // ---------------------------
  const handleSignUp = async () => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });
    if (error) {
      console.error("Error signing up:", error.message);
    } else {
      console.log("Signed up user:", data);
      // Optionally notify the user to verify their email.
    }
  };

  const handleSignIn = async () => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      console.error("Error signing in:", error.message);
    } else {
      console.log("Signed in user:", data);
      setShowAuthModal(false); // Close modal on success
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

  // ---------------------------
  // Handlers for New Restaurant Form Fields
  // ---------------------------
  const handleNewRestaurantChange = (e) => {
    const { name, value } = e.target;
    setNewRestaurant(prev => ({ ...prev, [name]: value }));
  };

  // ---------------------------
  // Render
  // ---------------------------
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Bar */}
      <header className="bg-white shadow">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-purple-600">Halal Finder</h1>
          <nav className="space-x-4">
            <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="text-gray-700 hover:text-purple-600">Home</button>
            {user ? (
              <>
                <button onClick={() => setShowAddModal(true)}
                  className="text-gray-700 hover:text-purple-600">Add Restaurant</button>
                <button onClick={handleSignOut}
                  className="text-gray-700 hover:text-purple-600">Sign Out</button>
              </>
            ) : (
              <button onClick={() => setShowAuthModal(true)}
                className="text-gray-700 hover:text-purple-600">Sign In</button>
            )}
          </nav>
        </div>
      </header>

      {/* Main Content: Restaurants Listing */}
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredRestaurants.map((restaurant) => (
              <Card
                key={restaurant.id}
                className="bg-white shadow-md rounded-lg overflow-hidden transform hover:scale-105 transition-transform duration-300"
              >
                <CardContent className="p-6">
                  <CardTitle
                    className="text-2xl font-bold text-purple-600 cursor-pointer"
                    onClick={() => setSelectedRestaurant(restaurant)}
                  >
                    {restaurant.name}
                  </CardTitle>
                  <CardDescription className="text-gray-700 mt-2">
                    {restaurant.description}
                  </CardDescription>
                  <p className="text-gray-600 mt-2">{restaurant.address}</p>
                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center">
                      <span className="text-yellow-500 mr-1">★</span>
                      <span className="text-gray-800 font-semibold">{restaurant.rating}</span>
                    </div>
                    <span className={`text-sm font-semibold py-1 px-2 rounded-full ${
                      restaurant.halalStatus === 'HMS' ? 'bg-green-600 text-white' :
                      restaurant.halalStatus === 'HFSAA' ? 'bg-blue-600 text-white' :
                      'bg-orange-600 text-white'
                    }`}>
                      {restaurant.halalStatus}
                    </span>
                  </div>
                  {restaurant.google && (
                    <a href={restaurant.google} target="_blank" rel="noopener noreferrer"
                      className="text-blue-500 underline mt-2 inline-block">
                      View on Google
                    </a>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Restaurant Details Modal */}
        {selectedRestaurant && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white rounded-lg p-8 max-w-md w-full">
              <h2 className="text-3xl font-bold mb-4">{selectedRestaurant.name}</h2>
              <p className="text-gray-700 mb-2">{selectedRestaurant.description}</p>
              <p className="text-gray-600 mb-2">{selectedRestaurant.address}</p>
              <p className="text-gray-600 mb-2">{selectedRestaurant.hours}</p>
              <p className="text-gray-600 mb-4">{selectedRestaurant.phone}</p>
              <button onClick={() => setSelectedRestaurant(null)}
                className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition-colors">
                Close
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Authentication Modal */}
      {showAuthModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h2 className="text-2xl font-bold mb-4">
              {authMode === "signin" ? "Sign In" : "Sign Up"}
            </h2>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 mb-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 mb-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <div className="flex justify-between items-center">
              {authMode === "signin" ? (
                <button onClick={handleSignIn}
                  className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition-colors">
                  Sign In
                </button>
              ) : (
                <button onClick={handleSignUp}
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors">
                  Sign Up
                </button>
              )}
              <button onClick={() => setShowAuthModal(false)}
                className="text-gray-500 ml-2">
                Cancel
              </button>
            </div>
            <p className="mt-4 text-sm">
              {authMode === "signin" ? "Don't have an account?" : "Already have an account?"}
              <button onClick={() => setAuthMode(authMode === "signin" ? "signup" : "signin")}
                className="text-purple-600 underline ml-1">
                {authMode === "signin" ? "Sign Up" : "Sign In"}
              </button>
            </p>
          </div>
        </div>
      )}

      {/* Add Restaurant Modal */}
      {showAddModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h2 className="text-2xl font-bold mb-4">Add a New Restaurant</h2>
            <input
              type="text"
              name="name"
              placeholder="Name"
              value={newRestaurant.name}
              onChange={handleNewRestaurantChange}
              className="w-full p-3 mb-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <input
              type="text"
              name="description"
              placeholder="Description"
              value={newRestaurant.description}
              onChange={handleNewRestaurantChange}
              className="w-full p-3 mb-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <input
              type="text"
              name="address"
              placeholder="Address"
              value={newRestaurant.address}
              onChange={handleNewRestaurantChange}
              className="w-full p-3 mb-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <input
              type="number"
              name="rating"
              placeholder="Rating"
              value={newRestaurant.rating}
              onChange={handleNewRestaurantChange}
              className="w-full p-3 mb-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <select
              name="halalStatus"
              value={newRestaurant.halalStatus}
              onChange={handleNewRestaurantChange}
              className="w-full p-3 mb-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="">Select Halal Type</option>
              <option value="HMS">HMS</option>
              <option value="HFSAA">HFSAA</option>
              <option value="Self-Reported">Self-Reported</option>
            </select>
            <input
              type="text"
              name="google"
              placeholder="Google Maps URL"
              value={newRestaurant.google}
              onChange={handleNewRestaurantChange}
              className="w-full p-3 mb-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <input
              type="text"
              name="hours"
              placeholder="Hours"
              value={newRestaurant.hours}
              onChange={handleNewRestaurantChange}
              className="w-full p-3 mb-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <input
              type="text"
              name="phone"
              placeholder="Phone"
              value={newRestaurant.phone}
              onChange={handleNewRestaurantChange}
              className="w-full p-3 mb-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <div className="flex justify-between items-center">
              <button onClick={handleAddRestaurant}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors">
                Add Restaurant
              </button>
              <button onClick={() => setShowAddModal(false)}
                className="text-gray-500 ml-2">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
