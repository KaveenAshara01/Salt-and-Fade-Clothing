import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import CartModal from './components/CartModal';
import ScrollToTop from './components/ScrollToTop';
import Loader from './components/Loader';
import MetaPixelTracker from './components/MetaPixelTracker';

const App = () => {
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  useEffect(() => {
    // Initial splash screen for first visit
    const timer = setTimeout(() => {
      setIsInitialLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (isInitialLoading) {
    return <Loader fullScreen />;
  }

  return (
    <>
      <MetaPixelTracker />
      <ScrollToTop />
      <Header />
      <CartModal />
      <main style={{ minHeight: '80vh' }}>
        <Outlet />
      </main>
      <Footer />
    </>
  );
};

export default App;
