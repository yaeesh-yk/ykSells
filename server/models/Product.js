const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, minlength: 3 },
  description: { type: String, required: true, minlength: 20 },
  price: { type: Number, required: true, min: 0 },
  discountPrice: { type: Number, min: 0 },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  brand: String,
  images: { type: [String], required: true, validate: (value) => value.length > 0 },
  stock: { type: Number, default: 0, min: 0, validate: Number.isInteger },
  ratings: { type: Number, default: 0 },
  numReviews: { type: Number, default: 0 },
  reviews: [{ user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, rating: Number, comment: String, createdAt: { type: Date, default: Date.now } }],
  isFeatured: { type: Boolean, default: false },
}, { timestamps: true });
productSchema.pre('validate', function validateDiscount(next) { if (this.discountPrice != null && this.discountPrice >= this.price) return next(new Error('Discount price must be less than price')); next(); });
module.exports = mongoose.model('Product', productSchema);