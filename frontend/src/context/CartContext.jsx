import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useUser } from './UserContext';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const { userInfo } = useUser();
  const [cartItems, setCartItems] = useState(() => {
    const localCart = localStorage.getItem('cartItems');
    return localCart ? JSON.parse(localCart) : [];
  });

  const [isLoadedFromDB, setIsLoadedFromDB] = useState(false);
  const [shippingPrice, setShippingPrice] = useState(0);
  const [itemsPrice, setItemsPrice] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Sync with DB if logged in
  useEffect(() => {
    const syncCart = async () => {
      // Only sync if we have a user and we've already loaded the latest from DB
      if (userInfo && userInfo.token && isLoadedFromDB) {
        try {
          const config = {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${userInfo.token}`,
            },
          };
          await axios.put('/api/users/cart', { cartItems }, config);
        } catch (error) {
          console.error('Error syncing cart with DB:', error);
        }
      }
    };

    syncCart();
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
    
    // Calculate prices
    const subTotal = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);
    const totalQty = cartItems.reduce((acc, item) => acc + item.qty, 0);
    const shipping = cartItems.length === 0 ? 0 : (totalQty < 3 ? 450 : 550);
    
    setItemsPrice(subTotal);
    setShippingPrice(shipping);
    setTotalPrice(subTotal + shipping);
  }, [cartItems, userInfo, isLoadedFromDB]);

  // Load and merge cart from DB on login/change
  useEffect(() => {
    const loadAndMergeCart = async () => {
      if (userInfo && userInfo.token) {
        try {
          const config = {
            headers: {
              Authorization: `Bearer ${userInfo.token}`,
            },
          };
          const { data } = await axios.get('/api/users/cart', config);
          
          if (data) {
            // Logic: Merge guest cart (current state) with DB cart
            // If item exists in both, keep guest qty for a "fresh" feel, or just combine
            const dbCart = data;
            const guestCart = JSON.parse(localStorage.getItem('cartItems')) || [];
            
            const mergedCart = [...dbCart];
            
            guestCart.forEach((gItem) => {
              const existingIndex = mergedCart.findIndex(
                (dbItem) => dbItem.product === gItem.product && dbItem.size === gItem.size
              );
              if (existingIndex > -1) {
                // If exists, respect the guest change recently
                mergedCart[existingIndex].qty = gItem.qty;
              } else {
                mergedCart.push(gItem);
              }
            });

            setCartItems(mergedCart);
            setIsLoadedFromDB(true);
          }
        } catch (error) {
          console.error('Error loading cart from DB:', error);
          // Still mark as loaded so user can start syncing their local changes
          setIsLoadedFromDB(true);
        }
      } else {
        // Reset when logged out
        setIsLoadedFromDB(false);
      }
    };
    
    loadAndMergeCart();
  }, [userInfo]);

  const addToCart = (product, size, qty) => {
    const item = {
      product: product._id,
      name: product.name,
      image: product.images[0].url,
      price: product.price,
      size,
      qty,
      countInStock: product.countInStock // Useful for validation in modal
    };

    const existItem = cartItems.find((x) => x.product === item.product && x.size === item.size);

    if (existItem) {
      setCartItems(
        cartItems.map((x) =>
          x.product === existItem.product && x.size === existItem.size ? item : x
        )
      );
    } else {
      setCartItems([...cartItems, item]);
    }
    setIsCartOpen(true);
  };

  const removeFromCart = (id, size) => {
    setCartItems(cartItems.filter((x) => !(x.product === id && x.size === size)));
  };

  const updateQty = (id, size, qty) => {
    setCartItems(
      cartItems.map((x) =>
        x.product === id && x.size === size ? { ...x, qty } : x
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem('cartItems');
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQty,
        clearCart,
        itemsPrice,
        shippingPrice,
        totalPrice,
        isCartOpen,
        setIsCartOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
