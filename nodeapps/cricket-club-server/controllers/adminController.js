const { validationResult } = require('express-validator');
const db = require('../config/db');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

exports.registerUser = async (req, res) => {
const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const {full_name, email, password, mobile} = req.body;

  try
  {
    const result = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    if (result.rows.length >= 1)
    {
      return res.status(401).json({message: 'User already exists'});
    }

    let hashedPassword = "";

    if (password) {
      const salt = await bcrypt.genSalt(10);
      hashedPassword = await bcrypt.hash(password, salt);
    }

    await db.query(
        'INSERT INTO users (full_name, email,password, mobile) VALUES ($1, $2, $3, $4)',
        [full_name, email, hashedPassword, mobile]
    );

    res.status(200).json({ message: 'User Created successfully' });

  }
  catch (error) {
    console.log(error);
    return res.status(400).json({ errors: errors.array() });
  }

}

exports.loginUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { email, password } = req.body;

  try {
    const result = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    if (result.rows.length === 0) return res.status(401).json({ message: 'Invalid credentials' });

    const user = result.rows[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

    const payload = {
      user: { id: user.id, email: user.email, role: user.role }
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '120m' });

    res.json({ token, id:user.id, role: user.role, message: 'Login successful' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

// ✅ Get User Details
exports.getUserDetails = async (req, res) => {
  const userId = req.user.id; // Assuming `req.user` is populated from middleware

  try {
    const result = await db.query(
        'SELECT id, full_name, email, mobile, role, created_at, updated_at FROM users WHERE id = $1',
        [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error fetching user details:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// ✅ Update User Details
exports.updateUser = async (req, res) => {
  const userId = req.user.id; // Extracted from JWT authentication
  const { full_name, mobile, password } = req.body;

  try {
    // Fetch existing user
    const result = await db.query('SELECT * FROM users WHERE id = $1', [userId]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    let hashedPassword = result.rows[0].password; // Keep existing password

    if (password) {
      const salt = await bcrypt.genSalt(10);
      hashedPassword = await bcrypt.hash(password, salt);
    }

    // Update user details (email & role cannot be updated)
    await db.query(
        'UPDATE users SET full_name = $1, mobile = $2, password = $3, updated_at = CURRENT_TIMESTAMP WHERE id = $4',
        [full_name, mobile, hashedPassword, userId]
    );

    res.json({ message: 'Profile updated successfully' });
  } catch (err) {
    console.error('Error updating user:', err);
    res.status(500).json({ message: 'Server error' });
  }
};