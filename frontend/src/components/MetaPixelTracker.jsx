import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import ReactPixel from 'react-facebook-pixel';

const MetaPixelTracker = () => {
  const location = useLocation();
  const [isPixelInitialized, setIsPixelInitialized] = useState(false);

  useEffect(() => {
    const pixelId = import.meta.env.VITE_META_PIXEL_ID;
    
    // Check if the Pixel ID is defined and not just a placeholder
    if (pixelId && pixelId !== 'your_meta_pixel_id_here') {
      const options = {
        autoConfig: true, // set pixel's autoConfig. More info: https://developers.facebook.com/docs/facebook-pixel/advanced/
        debug: import.meta.env.DEV, // enable logs
      };
      
      ReactPixel.init(pixelId, undefined, options);
      setIsPixelInitialized(true);
    } else {
      console.warn("Meta Pixel ID not found or is placeholder. Pixel tracking is disabled.");
    }
  }, []);

  useEffect(() => {
    if (isPixelInitialized) {
      ReactPixel.pageView();
    }
  }, [location.pathname, location.search, isPixelInitialized]);

  return null;
};

export default MetaPixelTracker;
