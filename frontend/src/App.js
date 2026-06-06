import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaShoppingCart, FaHeart, FaStar, FaUser, FaHome, FaInfoCircle, FaEnvelope } from 'react-icons/fa';
import toast from 'react-hot-toast';
import axios from 'axios';

// Pages
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import Products from './pages/Products';
import Cart from './pages/Cart';
import ProductDetail from './pages/ProductDetail';

const API_URL = 'http://localhost:5000/api';

function App() {
  const [cartCount, setCartCount] = useState(0);
  const [userId] = useState('665a8c5e3f1d4e2a1c9b7a6d'); // Sample user ID
  const [cart, setCart] = useState([]);

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const response = await axios.get(`${API_URL}/users/${userId}/cart`);
      setCart(response.data);
      setCartCount(response.data.reduce((sum, item) => sum + item.quantity, 0));
    } catch (error) {
      console.error('Error fetching cart:', error);
    }
  };

  const addToCart = async (productId, quantity = 1, size = 'M', color = 'Default') => {
    try {
      await axios.post(`${API_URL}/users/${userId}/cart`, {
        productId,
        quantity,
        size,
        color
      });
      await fetchCart();
      toast.success('Added to cart!');
    } catch (error) {
      toast.error('Failed to add to cart');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-lg sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center py-4">
            <motion.div 
              initial={{ x: -100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              className="text-2xl font-bold text-purple-600"
            >
              <Link to="/">FashionHub</Link>
            </motion.div>
            
            <div className="hidden md:flex space-x-8">
              <Link to="/" className="flex items-center gap-2 text-gray-700 hover:text-purple-600 transition">
                <FaHome /> Home
              </Link>
              <Link to="/products" className="flex items-center gap-2 text-gray-700 hover:text-purple-600 transition">
                Shop
              </Link>
              <Link to="/about" className="flex items-center gap-2 text-gray-700 hover:text-purple-600 transition">
                <FaInfoCircle /> About
              </Link>
              <Link to="/contact" className="flex items-center gap-2 text-gray-700 hover:text-purple-600 transition">
                <FaEnvelope /> Contact
              </Link>
            </div>
            
            <div className="flex items-center gap-4">
              <Link to="/cart" className="relative">
                <FaShoppingCart className="text-2xl text-gray-700 hover:text-purple-600 transition" />
                {cartCount > 0 && (
                  <motion.span 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                  >
                    {cartCount}
                  </motion.span>
                )}
              </Link>
              <FaUser className="text-2xl text-gray-700 hover:text-purple-600 transition cursor-pointer" />
            </div>
          </div>
        </div>
      </nav>

      {/* Routes */}
      <AnimatePresence mode="wait">
        <Routes>
          <Route path="/" element={<Home addToCart={addToCart} />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/products" element={<Products addToCart={addToCart} />} />
          <Route path="/product/:id" element={<ProductDetail addToCart={addToCart} />} />
          <Route path="/cart" element={<Cart cart={cart} setCart={setCart} userId={userId} fetchCart={fetchCart} />} />
        </Routes>
      </AnimatePresence>
    </div>
  );
}

export default App;