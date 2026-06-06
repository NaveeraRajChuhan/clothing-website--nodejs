import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { FaTrash, FaPlus, FaMinus } from 'react-icons/fa';
import toast from 'react-hot-toast';

const Cart = ({ cart, setCart, userId, fetchCart }) => {
  const updateQuantity = async (itemId, change) => {
    try {
      const item = cart.find(i => i._id === itemId);
      const newQuantity = item.quantity + change;
      if (newQuantity <= 0) {
        await axios.delete(`http://localhost:5000/api/users/${userId}/cart/${itemId}`);
      } else {
        // For simplicity, we'll remove and re-add with new quantity
        await axios.delete(`http://localhost:5000/api/users/${userId}/cart/${itemId}`);
        await axios.post(`http://localhost:5000/api/users/${userId}/cart`, {
          productId: item.productId._id,
          quantity: newQuantity,
          size: item.size,
          color: item.color
        });
      }
      await fetchCart();
    } catch (error) {
      toast.error('Failed to update cart');
    }
  };

  const removeItem = async (itemId) => {
    try {
      await axios.delete(`http://localhost:5000/api/users/${userId}/cart/${itemId}`);
      await fetchCart();
      toast.success('Item removed');
    } catch (error) {
      toast.error('Failed to remove item');
    }
  };

  const total = cart.reduce((sum, item) => sum + (item.productId?.price || 0) * item.quantity, 0);

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.h1 
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="text-3xl font-bold mb-8"
      >
        Shopping Cart
      </motion.h1>

      {cart.length === 0 ? (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="text-center py-20"
        >
          <p className="text-xl text-gray-600">Your cart is empty</p>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <AnimatePresence>
              {cart.map((item, index) => (
                <motion.div
                  key={item._id}
                  initial={{ x: -100, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: 100, opacity: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-lg shadow-md p-4 mb-4 flex flex-col md:flex-row gap-4"
                >
                  <img 
                    src={item.productId?.image} 
                    alt={item.productId?.name} 
                    className="w-32 h-32 object-cover rounded"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{item.productId?.name}</h3>
                    <p className="text-gray-600">Size: {item.size}</p>
                    <p className="text-gray-600">Color: {item.color}</p>
                    <p className="text-purple-600 font-bold text-xl">${item.productId?.price}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => updateQuantity(item._id, -1)}
                        className="bg-gray-200 p-2 rounded-full hover:bg-gray-300"
                      >
                        <FaMinus />
                      </motion.button>
                      <span className="w-12 text-center font-semibold">{item.quantity}</span>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => updateQuantity(item._id, 1)}
                        className="bg-gray-200 p-2 rounded-full hover:bg-gray-300"
                      >
                        <FaPlus />
                      </motion.button>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => removeItem(item._id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <FaTrash />
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          <div className="lg:col-span-1">
            <motion.div
              initial={{ x: 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              className="bg-white rounded-lg shadow-md p-6 sticky top-24"
            >
              <h2 className="text-xl font-bold mb-4">Order Summary</h2>
              <div className="space-y-2 mb-4">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>Free</span>
                </div>
                <div className="border-t pt-2 mt-2">
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span className="text-purple-600">${total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 transition"
              >
                Proceed to Checkout
              </motion.button>
            </motion.div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;