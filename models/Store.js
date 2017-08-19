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
  tags: [String]
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
