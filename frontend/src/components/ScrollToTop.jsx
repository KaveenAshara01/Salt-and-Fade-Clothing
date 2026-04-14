import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
  const location = useLocation();

  useEffect(() => {
    // A tiny timeout pushes the scroll to the end of the event loop,
    // which overrides the browser's attempt to restore previous scroll position.
    const timer = setTimeout(() => {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'instant'
      });
      document.documentElement.scrollTo({
        top: 0,
        left: 0,
        behavior: 'instant'
      });
    }, 0);

    return () => clearTimeout(timer);
  }, [location]); // Watch the full location object (pathname + search)

  return null;
};

export default ScrollToTop;
