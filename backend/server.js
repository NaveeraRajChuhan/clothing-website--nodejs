const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect('mongodb://localhost:27017/clothing_store', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB Connected'))
.catch(err => console.log('MongoDB Connection Error:', err));

// Product Schema
const productSchema = new mongoose.Schema({
  name: String,
  price: Number,
  category: String,
  image: String,
  description: String,
  sizes: [String],
  colors: [String],
  likes: { type: Number, default: 0 },
  reviews: [{
    username: String,
    rating: Number,
    comment: String,
    date: { type: Date, default: Date.now }
  }]
});

// User Schema
const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
  cart: [{
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    quantity: Number,
    size: String,
    color: String
  }]
});

const Product = mongoose.model('Product', productSchema);
const User = mongoose.model('User', userSchema);

// Routes

// Get all products
app.get('/api/products', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single product
app.get('/api/products/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add review to product
app.post('/api/products/:id/reviews', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    product.reviews.push(req.body);
    await product.save();
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Like product
app.put('/api/products/:id/like', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    product.likes += 1;
    await product.save();
    res.json({ likes: product.likes });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get user cart
app.get('/api/users/:userId/cart', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).populate('cart.productId');
    res.json(user.cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add to cart
app.post('/api/users/:userId/cart', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    const { productId, quantity, size, color } = req.body;
    
    const existingItem = user.cart.find(item => 
      item.productId.toString() === productId && 
      item.size === size && 
      item.color === color
    );
    
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      user.cart.push({ productId, quantity, size, color });
    }
    
    await user.save();
    await user.populate('cart.productId');
    res.json(user.cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Remove from cart
app.delete('/api/users/:userId/cart/:itemId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    user.cart = user.cart.filter(item => item._id.toString() !== req.params.itemId);
    await user.save();
    await user.populate('cart.productId');
    res.json(user.cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Initialize sample data
async function initSampleData() {
  const productCount = await Product.countDocuments();
  if (productCount === 0) {
    const sampleProducts = [
      {
        name: "Classic White T-Shirt",
        price: 29.99,
        category: "Men",
        image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400",
        description: "Comfortable cotton t-shirt perfect for everyday wear",
        sizes: ["S", "M", "L", "XL"],
        colors: ["White", "Black", "Gray"]
      },
      {
        name: "Slim Fit Jeans",
        price: 59.99,
        category: "Men",
        image: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=400",
        description: "Modern slim fit jeans with stretch comfort",
        sizes: ["28", "30", "32", "34", "36"],
        colors: ["Blue", "Black"]
      },
      {
        name: "Floral Summer Dress",
        price: 49.99,
        category: "Women",
        image: "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=400",
        description: "Beautiful floral print dress for summer",
        sizes: ["XS", "S", "M", "L"],
        colors: ["Blue Floral", "Pink Floral"]
      },
      {
        name: "Leather Jacket",
        price: 129.99,
        category: "Women",
        image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400",
        description: "Stylish leather jacket for cool evenings",
        sizes: ["S", "M", "L"],
        colors: ["Black", "Brown"]
      },
      {
        name: "Running Shoes",
        price: 89.99,
        category: "Sports",
        image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400",
        description: "Comfortable running shoes with excellent support",
        sizes: ["7", "8", "9", "10", "11"],
        colors: ["Red/Black", "Blue/White"]
      },
      {
        name: "Wool Sweater",
        price: 69.99,
        category: "Men",
        image: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=400",
        description: "Warm wool sweater for winter",
        sizes: ["S", "M", "L", "XL"],
        colors: ["Navy", "Burgundy", "Gray"]
      }
    ];
    
    await Product.insertMany(sampleProducts);
    console.log('Sample products added');
    
    // Create a sample user
    const userCount = await User.countDocuments();
    if (userCount === 0) {
      await User.create({
        username: "customer",
        email: "customer@example.com",
        password: "password123",
        cart: []
      });
      console.log('Sample user created');
    }
  }
}

initSampleData();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});