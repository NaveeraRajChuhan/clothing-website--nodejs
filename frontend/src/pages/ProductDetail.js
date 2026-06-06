import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import { FaStar, FaHeart, FaShoppingCart } from 'react-icons/fa';
import toast from 'react-hot-toast';

const ProductDetail = ({ addToCart }) => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [reviewText, setReviewText] = useState('');
  const [rating, setRating] = useState(5);
  const [username, setUsername] = useState('Guest');

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/products/${id}`);
      setProduct(response.data);
      if (response.data.sizes?.length) setSelectedSize(response.data.sizes[0]);
      if (response.data.colors?.length) setSelectedColor(response.data.colors[0]);
    } catch (error) {
      toast.error('Failed to fetch product');
    }
  };

  const handleAddReview = async () => {
    if (!reviewText.trim()) {
      toast.error('Please enter a review');
      return;
    }
    try {
      await axios.post(`http://localhost:5000/api/products/${id}/reviews`, {
        username,
        rating,
        comment: reviewText
      });
      await fetchProduct();
      setReviewText('');
      setRating(5);
      toast.success('Review added!');
    } catch (error) {
      toast.error('Failed to add review');
    }
  };

  if (!product) return <div className="text-center py-20">Loading...</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Product Image */}
        <motion.div
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="rounded-lg overflow-hidden shadow-lg"
        >
          <img src={product.image} alt={product.name} className="w-full h-auto" />
        </motion.div>

        {/* Product Info */}
        <motion.div
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
        >
          <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
          <div className="flex items-center mb-4">
            {[...Array(5)].map((_, i) => (
              <FaStar key={i} className={`${i < 4 ? 'text-yellow-400' : 'text-gray-300'} text-xl`} />
            ))}
            <span className="ml-2 text-gray-600">({product.reviews?.length || 0} reviews)</span>
          </div>
          <p className="text-4xl font-bold text-purple-600 mb-4">${product.price}</p>
          <p className="text-gray-600 mb-6">{product.description}</p>

          {/* Size Selection */}
          {product.sizes && (
            <div className="mb-4">
              <h3 className="font-semibold mb-2">Select Size:</h3>
              <div className="flex gap-2">
                {product.sizes.map(size => (
                  <motion.button
                    key={size}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedSize(size)}
                    className={`px-4 py-2 border rounded ${
                      selectedSize === size 
                        ? 'bg-purple-600 text-white border-purple-600' 
                        : 'border-gray-300 hover:border-purple-600'
                    }`}
                  >
                    {size}
                  </motion.button>
                ))}
              </div>
            </div>
          )}

          {/* Color Selection */}
          {product.colors && (
            <div className="mb-6">
              <h3 className="font-semibold mb-2">Select Color:</h3>
              <div className="flex gap-2">
                {product.colors.map(color => (
                  <motion.button
                    key={color}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedColor(color)}
                    className={`px-4 py-2 border rounded ${
                      selectedColor === color 
                        ? 'bg-purple-600 text-white border-purple-600' 
                        : 'border-gray-300 hover:border-purple-600'
                    }`}
                  >
                    {color}
                  </motion.button>
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => addToCart(product._id, 1, selectedSize, selectedColor)}
              className="flex-1 bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold flex items-center justify-center gap-2 hover:bg-purple-700 transition"
            >
              <FaShoppingCart /> Add to Cart
            </motion.button>
          </div>
        </motion.div>
      </div>

      {/* Reviews Section */}
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="mt-16"
      >
        <h2 className="text-2xl font-bold mb-6">Customer Reviews</h2>
        
        {/* Add Review */}
        <div className="bg-gray-50 p-6 rounded-lg mb-8">
          <h3 className="font-semibold mb-4">Write a Review</h3>
          <input
            type="text"
            placeholder="Your name"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-4 py-2 border rounded mb-3"
          />
          <div className="flex items-center mb-3">
            <span className="mr-2">Rating:</span>
            {[1,2,3,4,5].map(r => (
              <FaStar
                key={r}
                className={`cursor-pointer text-2xl ${r <= rating ? 'text-yellow-400' : 'text-gray-300'}`}
                onClick={() => setRating(r)}
              />
            ))}
          </div>
          <textarea
            placeholder="Your review..."
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            rows="3"
            className="w-full px-4 py-2 border rounded mb-3"
          />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleAddReview}
            className="bg-purple-600 text-white px-6 py-2 rounded hover:bg-purple-700 transition"
          >
            Submit Review
          </motion.button>
        </div>

        {/* Reviews List */}
        <div className="space-y-4">
          {product.reviews?.map((review, index) => (
            <motion.div
              key={index}
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white p-4 rounded-lg shadow"
            >
              <div className="flex justify-between items-center mb-2">
                <span className="font-semibold">{review.username}</span>
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <FaStar key={i} className={`${i < review.rating ? 'text-yellow-400' : 'text-gray-300'} text-sm`} />
                  ))}
                </div>
              </div>
              <p className="text-gray-600">{review.comment}</p>
              <p className="text-xs text-gray-400 mt-2">{new Date(review.date).toLocaleDateString()}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default ProductDetail;