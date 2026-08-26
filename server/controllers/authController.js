const jwt = require('jsonwebtoken');
const User = require('../models/User');

const tokenFor = (user) => jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
const register = async (req, res, next) => { try { const { name, email, password } = req.body; if (!name || !email || !password || password.length < 6) return res.status(400).json({ success: false, message: 'Name, valid email, and password of at least 6 characters are required' }); const exists = await User.findOne({ email }); if (exists) return res.status(409).json({ success: false, message: 'An account with this email already exists' }); const user = await User.create({ name, email, password }); res.status(201).json({ success: true, data: { user, token: tokenFor(user) } }); } catch (error) { next(error); } };
const login = async (req, res, next) => { try { const email = String(req.body.email || '').trim().toLowerCase(); const user = await User.findOne({ email }); if (!user || !(await user.comparePassword(req.body.password || ''))) return res.status(401).json({ success: false, message: 'Invalid email or password' }); if (req.body.role && user.role !== req.body.role) return res.status(403).json({ success: false, message: `This account is not registered as ${req.body.role}` }); res.json({ success: true, data: { user, token: tokenFor(user) } }); } catch (error) { next(error); } };
const me = (req, res) => res.json({ success: true, data: { user: req.user } });
const updateProfile = async (req, res, next) => {
	try {
		const user = await User.findById(req.user._id);
		if (req.body.name) user.name = req.body.name.trim();
		if (req.body.email) user.email = req.body.email.trim().toLowerCase();
		if (req.body.password) user.password = req.body.password;
		if (req.body.address) user.address = req.body.address;
		if (req.body.phone !== undefined) user.phone = req.body.phone;
		await user.save();
		res.json({ success: true, data: { user, token: tokenFor(user) } });
	} catch (error) { next(error); }
};
const ensureAdmin = async () => { if (!process.env.ADMIN_EMAIL || !process.env.ADMIN_PASSWORD) return; const email = process.env.ADMIN_EMAIL.toLowerCase(); const existing = await User.findOne({ email }); if (existing) { const passwordChanged = !(await existing.comparePassword(process.env.ADMIN_PASSWORD)); if (existing.role !== 'admin' || passwordChanged) { existing.role = 'admin'; if (passwordChanged) existing.password = process.env.ADMIN_PASSWORD; await existing.save(); } console.log(`Admin account ready: ${email}`); return; } await User.create({ name: 'Admin', email, password: process.env.ADMIN_PASSWORD, role: 'admin' }); console.log(`Admin account ready: ${email}`); };
module.exports = { register, login, me, updateProfile, ensureAdmin };