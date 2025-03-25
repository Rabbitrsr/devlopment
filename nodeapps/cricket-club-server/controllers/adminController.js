const { validationResult } = require('express-validator');
const db = require('../config/db');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

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

    res.json({ token, role: user.role, message: 'Login successful' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};