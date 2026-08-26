const jwt = require('jsonwebtoken');
const User = require('../models/User');

const verifyToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.startsWith('Bearer ') ? req.headers.authorization.split(' ')[1] : null;
    if (!token) return res.status(401).json({ success: false, message: 'Authentication required' });
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select('-password');
    if (!req.user) return res.status(401).json({ success: false, message: 'User no longer exists' });
    next();
  } catch (error) { return res.status(401).json({ success: false, message: 'Invalid or expired token' }); }
};
const isAdmin = (req, res, next) => req.user?.role === 'admin' ? next() : res.status(403).json({ success: false, message: 'Admin access required' });
module.exports = { verifyToken, isAdmin };