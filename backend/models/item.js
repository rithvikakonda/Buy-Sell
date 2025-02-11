const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true 
  },
  price: { 
    type: Number, 
    required: true 
  },
  description: { 
    type: String, 
    required: true
  },
  category: { 
    type: String, 
    required: true
  },  // Example: clothing, grocery
  seller: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', required: true 
  },
  isAvailable: { 
    type: Boolean, 
    default: true // Initially, the item is available
  },
}, { timestamps: true });

const itemModel = mongoose.model('Item', itemSchema);

module.exports = itemModel;
// module.exports = mongoose.model('Item', itemSchema);