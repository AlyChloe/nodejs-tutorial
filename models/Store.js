const mongoose = require('mongoose');
mongoose.Promise = global.Promise; // The way we're receving data from MongoDB
const slug = require('slugs'); // URL friendly names like a WordPress permalink

const storeSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: 'Please enter a store name!'
  },
  slug: String,
  description: {
    type: String,
    trim: true
  },
  tags: [String],
  created: {
    type: Date,
    default: Date.now
  },
  location: {
    type: {
      type: String,
      default: 'Point'
    },
    coordinates: [{
      type: Number,
      required: 'You must supply coordinates!'
    }],
    address: {
      type: 'String',
      required: 'You must supply an address!'
    }
  },
  photo: String
});

storeSchema.pre('save', function(next) {
  if (!this.isModified('name')) {
    next(); // Skip it!
    return; // Stop this function from running
  };
  this.slug = slug(this.name);
  next();
});

module.exports = mongoose.model('Store', storeSchema);
