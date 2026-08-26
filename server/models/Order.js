const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  orderItems: [{ product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' }, name: String, image: String, price: Number, quantity: Number }],
  shippingAddress: { street: String, city: String, province: String, postalCode: String, country: String },
  paymentMethod: { type: String, default: 'Stripe' }, stripePaymentId: String,
  itemsPrice: Number, shippingPrice: { type: Number, default: 0 }, totalPrice: Number,
  status: { type: String, enum: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'], default: 'Pending' },
  isPaid: { type: Boolean, default: false }, paidAt: Date,
}, { timestamps: true });
module.exports = mongoose.model('Order', orderSchema);