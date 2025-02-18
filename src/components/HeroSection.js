// src/components/HeroSection.js
import React from 'react';

const HeroSection = () => {
  return (
    <div className="relative text-center text-white py-20"
      style={{
        backgroundImage: 'url(https://halalfoundation.org/wp-content/uploads/2024/04/halal-food-1080x620.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}>
      <div className="bg-black bg-opacity-50 p-10 rounded-lg">
        <h1 className="text-5xl font-extrabold">Find the Best Halal Food in Your City</h1>
        <p className="text-lg mt-4">Discover, rate, and share your favorite halal restaurants.</p>
      </div>
    </div>
  );
};

export default HeroSection;
