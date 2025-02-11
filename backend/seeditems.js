const mongoose = require('mongoose');

// Connect to MongoDB
const dbURI = 'mongodb://localhost:27017/users'; // Replace with your database name
mongoose.connect(dbURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Connected to MongoDB');
}).catch((err) => {
  console.error('Error connecting to MongoDB:', err);
});

// Define Item Schema
const itemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

const Item = mongoose.model('Item', itemSchema);

// Sample Data
const items = [
  {
    name: "Laptop",
    price: 55000,
    description: "Dell Inspiron 15, 8GB RAM, 1TB HDD, Windows 11",
    category: "Electronics",
    seller: "67a043acfb89578997b739fe"
  },
  {
    name: "Formal Shirt",
    price: 800,
    description: "Men's slim-fit formal shirt, size M, brand new.",
    category: "Clothing",
    seller: "67a04445fb89578997b73a07"
  },
  {
    name: "Basketball",
    price: 1200,
    description: "Professional basketball, used only twice, perfect condition.",
    category: "Sports & Fitness",
    seller: "67a043acfb89578997b739fe"
  },
  {
    name: "Organic Rice (1kg)",
    price: 80,
    description: "Freshly harvested organic rice, packed and sealed.",
    category: "Groceries",
    seller: "67a04445fb89578997b73a07"
  },
  {
    name: "Fresh Tomatoes (1kg)",
    price: 40,
    description: "Farm-fresh tomatoes, ripe and juicy.",
    category: " Groceries",
    seller: "67a0646388dca6f47de0fcc1"
  },
  {
    name: "Bananas (1 dozen)",
    price: 50,
    description: "Fresh Cavendish bananas, sweet and healthy.",
    category: "Food",
    seller: "67a043acfb89578997b739fe"
  },
  {
    name: "Wireless Headphones",
    price: 2500,
    description: "Noise-canceling wireless headphones, 20 hours of battery life.",
    category: "Electronics",
    seller: "67a0652888dca6f47de0fcc6"
  },
  {
    name: "Running Shoes",
    price: 2000,
    description: "Nike running shoes, size 9, barely used.",
    category: "Clothing",
    seller: "67a04525fb89578997b73a19"
  },
  {
    name: "Chess Board",
    price: 300,
    description: "Wooden chess board with all pieces, perfect for tournaments.",
    category: "Games",
    seller: "67a044a7fb89578997b73a0e"
  },
  {
    name: "Cricket Bat",
    price: 1500,
    description: "Kashmir willow cricket bat, perfect for college tournaments.",
    category: "Sports",
    seller: "67a0646388dca6f47de0fcc1"
  },
  {
    name: "Apples (1kg)",
    price: 120,
    description: "Crisp and fresh apples, sourced directly from the orchard.",
    category: "Food",
    seller: "67a0652888dca6f47de0fcc6"
  },
  {
    name: "Carrots (1kg)",
    price: 60,
    description: "Fresh and crunchy carrots, perfect for snacking or cooking.",
    category: "Groceries",
    seller: "67a0646388dca6f47de0fcc1"
  },
  {
    name: "Facewash Pack",
    price: 400,
    description: "Pack of 2 herbal facewashes, 100ml each.",
    category: "Personal Care",
    seller: "67a0652888dca6f47de0fcc6"
  },
  {
    name: "Notebooks (Set of 5)",
    price: 250,
    description: "Set of 5 ruled notebooks, 200 pages each.",
    category: "Books",
    seller: "67a0646388dca6f47de0fcc1"
  },
  {
    name: "Water Bottle (1L)",
    price: 150,
    description: "Reusable, BPA-free water bottle, ideal for daily use.",
    category: "Materials",
    seller: "67a0652888dca6f47de0fcc6"
  },
  {
    name: "Mangoes",
    price: 150,
    description: "Crisp and sweet mangoes, sourced directly from the orchard.",
    category: "Food",
    seller: "67a0646388dca6f47de0fcc1"
  }

];

// Insert Data into MongoDB
Item.insertMany(items)
  .then(() => {
    console.log('Items added successfully!');
    mongoose.connection.close();
  })
  .catch((err) => {
    console.error('Error inserting items:', err);
    mongoose.connection.close();
  });
