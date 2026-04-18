import React from 'react';
import ReactDOM from 'react-dom/client';
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from 'react-router-dom';
import './index.css';
import App from './App.jsx';
import HomeScreen from './screens/HomeScreen.jsx';

import ProductScreen from './screens/ProductScreen.jsx';
import CartScreen from './screens/CartScreen.jsx';
import LoginScreen from './screens/LoginScreen.jsx';
import RegisterScreen from './screens/RegisterScreen.jsx';
import AboutScreen from './screens/AboutScreen.jsx';
import ReturnsPolicyScreen from './screens/ReturnsPolicyScreen.jsx';
import ShopScreen from './screens/ShopScreen.jsx';
import ForgotPasswordScreen from './screens/ForgotPasswordScreen.jsx';
import ResetPasswordScreen from './screens/ResetPasswordScreen.jsx';

// Admin Screens
import ProductListScreen from './screens/admin/ProductListScreen.jsx';
import ProductEditScreen from './screens/admin/ProductEditScreen.jsx';
import CollectionListScreen from './screens/admin/CollectionListScreen.jsx';
import CollectionEditScreen from './screens/admin/CollectionEditScreen.jsx';

import { CartProvider } from './context/CartContext.jsx';
import { UserProvider } from './context/UserContext.jsx';

import CheckoutScreen from './screens/CheckoutScreen.jsx';
import ProfileScreen from './screens/ProfileScreen.jsx';
import AdminOrderListScreen from './screens/admin/AdminOrderListScreen.jsx';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route index={true} path="/" element={<HomeScreen />} />
      <Route path="/products" element={<ShopScreen />} />
      <Route path="/product/:id" element={<ProductScreen />} />
      <Route path="/cart" element={<CartScreen />} />
      <Route path="/checkout" element={<CheckoutScreen />} />
      <Route path="/profile" element={<ProfileScreen />} />
      <Route path="/login" element={<LoginScreen />} />
      <Route path="/register" element={<RegisterScreen />} />
      <Route path="/forgot-password" element={<ForgotPasswordScreen />} />
      <Route path="/reset-password/:token" element={<ResetPasswordScreen />} />
      <Route path="/about" element={<AboutScreen />} />
      <Route path="/returns" element={<ReturnsPolicyScreen />} />
      
      {/* Admin Routes */}
      <Route path="/admin/productlist" element={<ProductListScreen />} />
      <Route path="/admin/product/create" element={<ProductEditScreen />} />
      <Route path="/admin/product/:id/edit" element={<ProductEditScreen />} />
      <Route path="/admin/collectionlist" element={<CollectionListScreen />} />
      <Route path="/admin/collection/create" element={<CollectionEditScreen />} />
      <Route path="/admin/collection/:id/edit" element={<CollectionEditScreen />} />
      <Route path="/admin/orderlist" element={<AdminOrderListScreen />} />
    </Route>
  )
);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <UserProvider>
      <CartProvider>
        <RouterProvider router={router} />
      </CartProvider>
    </UserProvider>
  </React.StrictMode>
);

console.log('%c=======================================', 'color: #1D4E3A; font-weight: bold');
console.log('%c✅ Salt & Fade Frontend Successfully Started', 'color: #1D4E3A; font-weight: bold; font-size: 14px');
console.log('%c=======================================', 'color: #1D4E3A; font-weight: bold');
