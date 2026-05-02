import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useUser } from './UserContext';
import ReactPixel from 'react-facebook-pixel';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const { userInfo } = useUser();
  const [cartItems, setCartItems] = useState(() => {
    const localCart = localStorage.getItem('cartItems');
    if (!localCart) return [];
    try {
      const parsed = JSON.parse(localCart);
      // Safety Filter: Kill any items that are missing essential data or are corrupted
      return Array.isArray(parsed) ? parsed.filter(item => item && item.product && item.name && !isNaN(Number(item.price))) : [];
    } catch (e) {
      return [];
    }
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
    
    // Calculate prices with heavy sanitization - if we find bad data, we actually trigger a state cleanup
    const validItems = cartItems.filter(item => item && item.product && item.name && !isNaN(Number(item.price)));
    
    // If the cart has been corrupted, we silently fix it by filtering out the trash
    if (validItems.length !== cartItems.length) {
      setCartItems(validItems);
      return; // The next effect cycle will handle the corrected math
    }

    localStorage.setItem('cartItems', JSON.stringify(validItems));

    const subTotal = validItems.reduce((acc, item) => {
      const price = Number(item.price) || 0;
      const qty = Number(item.qty) || 0;
      return acc + (price * qty);
    }, 0);

    const totalQty = validItems.reduce((acc, item) => {
      const qty = Number(item.qty) || 0;
      return acc + qty;
    }, 0);
    
    // Priority 1: Free delivery over 6000
    // Priority 2: 3+ items is 550
    // Priority 3: Default is 450
    let shipping = 0;
    if (validItems.length > 0) {
      if (subTotal >= 6000) {
        shipping = 0;
      } else {
        shipping = totalQty >= 3 ? 550 : 450;
      }
    }
    
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
            // Safety Filter for DB items too
            const cleanedDbCart = Array.isArray(data) ? data.filter(item => item && item.product && item.name && !isNaN(Number(item.price))) : [];
            const dbCart = cleanedDbCart;
            const guestCart = JSON.parse(localStorage.getItem('cartItems')) || [];
            
            const mergedCart = [...dbCart];
            
            guestCart.forEach((gItem) => {
              if (!gItem || !gItem.product || !gItem.name) return; // Skip trash
              
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
    
    // Track AddToCart event
    ReactPixel.track('AddToCart', {
      content_ids: [product._id],
      content_name: product.name,
      content_type: 'product',
      currency: 'LKR',
      value: product.price * qty
    });

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
