const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true, trim: true },
  image: String,
  slug: { type: String, required: true, unique: true, trim: true },
}, { timestamps: true });
categorySchema.pre('validate', function createSlug(next) { if (this.name && !this.slug) this.slug = this.name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''); next(); });
module.exports = mongoose.model('Category', categorySchema);