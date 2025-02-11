import React from 'react';

const CardDescription = ({ children, className }) => {
  return <p className={`card-description ${className}`}>{children}</p>;
};

export default CardDescription;
