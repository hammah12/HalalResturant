// AddRestaurantForm.js
import React, { useState } from 'react';
import { supabase } from '../supabaseClient';

const AddRestaurantForm = ({ onClose }) => {
  const [newRestaurant, setNewRestaurant] = useState({
    name: '',
    description: '',
    address: '',
    rating: '',
    halalStatus: '',
    google: '',
    hours: '',
    phone: '',
    image: null,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewRestaurant((prev) => ({ ...prev, [name]: value }));
  };

const handleImageUpload = async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const fileExt = file.name.split('.').pop();
  const fileName = `${Date.now()}.${fileExt}`;
  const filePath = `${fileName}`; // Don't include "restaurant-images/" in path

  console.log("Uploading file:", fileName);

  const { data, error } = await supabase.storage.from('restaurant-images').upload(filePath, file);

  if (error) {
    console.error("Error uploading image:", error);
    alert("Image upload failed.");
  } else {
    const publicUrl = `https://tsdqcubdaswmhiwskufu.supabase.co/storage/v1/object/public/restaurant-images/${data.path}`;
    console.log("Uploaded image path:", publicUrl);
    setNewRestaurant((prev) => ({ ...prev, image: publicUrl }));
  }
};


  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("Submitting restaurant:", newRestaurant);
    const { data, error } = await supabase.from('restaurants').insert([newRestaurant]);
    
    if (error) {
      console.error('Error adding restaurant:', error);
      alert("Failed to add restaurant.");
    } else {
      console.log('Restaurant added:', data);
      alert("Restaurant added successfully!");
      setNewRestaurant({
        name: '',
        description: '',
        address: '',
        rating: '',
        halalStatus: '',
        google: '',
        hours: '',
        phone: '',
        image: null,
      });
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full shadow-xl">
        <h2 className="text-2xl font-bold mb-4">Add a New Restaurant</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" name="name" placeholder="Name" value={newRestaurant.name} onChange={handleChange} className="w-full p-3 border rounded" required />
          <input type="text" name="description" placeholder="Description" value={newRestaurant.description} onChange={handleChange} className="w-full p-3 border rounded" required />
          <input type="text" name="address" placeholder="Address" value={newRestaurant.address} onChange={handleChange} className="w-full p-3 border rounded" required />
          <input type="number" name="rating" placeholder="Rating (1-5)" value={newRestaurant.rating} onChange={handleChange} className="w-full p-3 border rounded" required />
          <select name="halalStatus" value={newRestaurant.halalStatus} onChange={handleChange} className="w-full p-3 border rounded">
            <option value="">Select Halal Type</option>
            <option value="HMS">HMS</option>
            <option value="HFSAA">HFSAA</option>
            <option value="Self-Reported">Self-Reported</option>
          </select>
          <input type="text" name="google" placeholder="Google Maps URL" value={newRestaurant.google} onChange={handleChange} className="w-full p-3 border rounded" />
          <input type="text" name="hours" placeholder="Hours" value={newRestaurant.hours} onChange={handleChange} className="w-full p-3 border rounded" />
          <input type="text" name="phone" placeholder="Phone" value={newRestaurant.phone} onChange={handleChange} className="w-full p-3 border rounded" />
          <input type="file" accept="image/*" onChange={handleImageUpload} className="w-full p-3 border rounded" />
          <div className="flex justify-between">
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">Add Restaurant</button>
            <button type="button" onClick={onClose} className="text-gray-600">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddRestaurantForm;
