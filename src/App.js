// App.js
import React, { useEffect, useState } from 'react';
import { supabase } from './supabaseClient'; // Ensure this path is correct
import Card from './components/Card';
import CardTitle from './components/CardTitle';
import CardDescription from './components/CardDescription';
import CardContent from './components/CardContent';

const App = () => {
  // ---------------------------
  // State for fetching & displaying restaurants
  // ---------------------------
  const [restaurants, setRestaurants] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState('name');
  const [halalFilter, setHalalFilter] = useState('');
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);

  // ---------------------------
  // State for authentication
  // ---------------------------
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // ---------------------------
  // State for adding a new restaurant
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
  // useEffect: Check auth & fetch data
  // ---------------------------
  useEffect(() => {
    // Check current auth session
    const session = supabase.auth.session();
    setUser(session?.user ?? null);

    // Listen for auth changes (login/logout)
    supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    // Fetch the list of restaurants
    fetchRestaurants();
  }, []);

  const fetchRestaurants = async () => {
    console.log('Fetching restaurants...');
    const { data, error } = await supabase.from('restaurants').select('*');
    if (error) {
      console.error('Error fetching restaurants:', error);
    } else {
      console.log('Fetched restaurants:', data);
      setRestaurants(data);
    }
  };

  // ---------------------------
  // Authentication handlers
  // ---------------------------
  const handleSignUp = async () => {
    const { user, error } = await supabase.auth.signUp({ email, password });
    if (error) {
      console.error('Error signing up:', error.message);
    } else {
      console.log('Signed up user:', user);
    }
  };

  const handleSignIn = async () => {
    const { user, error } = await supabase.auth.signIn({ email, password });
    if (error) {
      console.error('Error signing in:', error.message);
    } else {
      console.log('Signed in user:', user);
    }
  };

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Error signing out:', error.message);
    }
  };

  // ---------------------------
  // Add Restaurant handlers
  // ---------------------------
  const handleNewRestaurantChange = (e) => {
    const { name, value } = e.target;
    setNewRestaurant({
      ...newRestaurant,
      [name]: value,
    });
  };

  const handleAddRestaurant = async () => {
    if (!user) {
      console.error('You must be signed in to add a restaurant!');
      return;
    }
    const { data, error } = await supabase
      .from('restaurants')
      .insert([{ ...newRestaurant }]);

    if (error) {
      console.error('Error inserting restaurant:', error);
    } else {
      console.log('Inserted restaurant:', data);
      // Add new restaurant to state so we don't have to refetch
      setRestaurants([...restaurants, ...data]);
      // Clear the form
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
    }
  };

  // ---------------------------
  // Filtering, Sorting, & Searching
  // ---------------------------
  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSort = (event) => {
    setSortOption(event.target.value);
  };

  const handleHalalFilter = (event) => {
    setHalalFilter(event.target.value);
  };

  const handleViewDetails = (restaurant) => {
    console.log('Viewing details for:', restaurant);
    setSelectedRestaurant(restaurant);
  };

  const handleCloseDetails = () => {
    setSelectedRestaurant(null);
  };

  // Filter & Sort
  const filteredRestaurants = restaurants
    .filter((restaurant) => {
      const matchesSearch =
        restaurant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        restaurant.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        restaurant.address.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesHalal =
        halalFilter === '' || restaurant.halalStatus === halalFilter;

      return matchesSearch && matchesHalal;
    })
    .sort((a, b) => {
      if (sortOption === 'rating') {
        return b.rating - a.rating;
      } else if (sortOption === 'name') {
        return a.name.localeCompare(b.name);
      }
      return 0;
    });

  // ---------------------------
  // Render
  // ---------------------------
  return (
    <div className="min-h-screen bg-white text-gray-900 p-8">
      {/* If NOT logged in, show sign in/up form */}
      {!user ? (
        <div className="max-w-md mx-auto p-4 bg-gray-100 rounded">
          <h2 className="text-xl font-bold mb-4">Sign In or Sign Up</h2>
          <input
            type="email"
            placeholder="Email"
            className="block w-full mb-2 p-2 border"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            className="block w-full mb-4 p-2 border"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            onClick={handleSignIn}
            className="bg-purple-600 text-white px-4 py-2 rounded mr-2"
          >
            Sign In
          </button>
          <button
            onClick={handleSignUp}
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            Sign Up
          </button>
        </div>
      ) : (
        <>
          {/* If logged in, show the main UI */}
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Welcome, {user.email}!</h2>
            <button
              onClick={handleSignOut}
              className="bg-red-600 text-white px-4 py-2 rounded"
            >
              Sign Out
            </button>
          </div>

          <h1 className="text-5xl font-extrabold text-center mb-12 text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
            Halal Restaurants in Chicago
          </h1>

          {/* Search / Sort / Filter */}
          <div className="flex flex-wrap gap-4 mb-8">
            <input
              type="text"
              placeholder="Search by name, food type, or city..."
              value={searchTerm}
              onChange={handleSearch}
              className="flex-1 min-w-[200px] p-3 rounded-lg bg-gray-200 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <select
              value={sortOption}
              onChange={handleSort}
              className="p-3 rounded-lg bg-gray-200 text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="name">Sort by Name</option>
              <option value="rating">Sort by Rating</option>
            </select>
            <select
              value={halalFilter}
              onChange={handleHalalFilter}
              className="p-3 rounded-lg bg-gray-200 text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="">All Halal Types</option>
              <option value="HMS">HMS</option>
              <option value="HFSAA">HFSAA</option>
              <option value="Self-Reported">Self-Reported</option>
            </select>
          </div>

          {/* Add a New Restaurant */}
          <div className="max-w-md mb-8">
            <h2 className="text-xl font-bold mb-2">Add a New Restaurant</h2>
            <input
              type="text"
              name="name"
              placeholder="Name"
              value={newRestaurant.name}
              onChange={handleNewRestaurantChange}
              className="block w-full mb-2 p-2 border border-gray-300 rounded"
            />
            <input
              type="text"
              name="description"
              placeholder="Description"
              value={newRestaurant.description}
              onChange={handleNewRestaurantChange}
              className="block w-full mb-2 p-2 border border-gray-300 rounded"
            />
            <input
              type="text"
              name="address"
              placeholder="Address"
              value={newRestaurant.address}
              onChange={handleNewRestaurantChange}
              className="block w-full mb-2 p-2 border border-gray-300 rounded"
            />
            <input
              type="number"
              name="rating"
              placeholder="Rating"
              value={newRestaurant.rating}
              onChange={handleNewRestaurantChange}
              className="block w-full mb-2 p-2 border border-gray-300 rounded"
            />
            <se
