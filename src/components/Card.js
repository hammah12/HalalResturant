// src/components/Card.js
import React from 'react';

const Card = ({ children, className, image }) => {
  return (
    <div className={`bg-white shadow-lg rounded-lg overflow-hidden transform hover:scale-105 transition-all duration-300 ${className}`}>
      {image && <img src={image} alt="Restaurant" className="w-full h-40 object-cover" />}
      <div className="p-4">
        {children}
      </div>
    </div>
  );
};

export default Card;
