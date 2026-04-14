import React from 'react';

const Loader = ({ fullScreen = false, size, className = '' }) => {
  return (
    <div className={`loader-container ${fullScreen ? 'full-screen' : ''} ${className}`}>
      <img 
        src="/images/loading.jpeg" 
        alt="Loading..." 
        className={`loader-img ${!fullScreen ? 'inline' : ''}`}
        style={size ? { width: size, height: 'auto' } : {}}
      />
    </div>
  );
};

export default Loader;
