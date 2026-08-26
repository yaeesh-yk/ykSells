const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const address = { street: String, city: String, province: String, postalCode: String, country: String };
const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true, minlength: 6 },
  role: { type: String, enum: ['customer', 'admin'], default: 'customer' },
  address,
  phone: String,
}, { timestamps: true });

userSchema.pre('save', async function save(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});
userSchema.methods.comparePassword = function comparePassword(password) { return bcrypt.compare(password, this.password); };
userSchema.methods.toJSON = function toJSON() { const value = this.toObject(); delete value.password; return value; };
module.exports = mongoose.model('User', userSchema);