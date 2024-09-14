const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const router = express.Router();

// Mock user data for demonstration
const users = [];

// Middleware to authenticate JWT
const authenticateJWT = (req, res, next) => {
  const token = req.header('Authorization');
  if (!token)
    return res
      .status(401)
      .json({ message: 'Access denied, no token provided' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(400).json({ message: 'Invalid token' });
  }
};

// POST /api/users/signup
router.post('/signup', async (req, res) => {
  const { email, password } = req.body;
  const userExists = users.find((user) => user.email === email);

  if (userExists) {
    return res.status(400).json({ message: 'User already exists' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = { email, password: hashedPassword };
  users.push(newUser);

  res.status(201).json({ message: 'User created' });
});

// POST /api/users/signin
router.post('/signin', async (req, res) => {
  const { email, password } = req.body;
  const user = users.find((user) => user.email === email);

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(400).json({ message: 'Invalid credentials' });
  }

  const token = jwt.sign({ email: user.email }, process.env.JWT_SECRET, {
    expiresIn: '1h',
  });
  res.json({ token });
});

// POST /api/users/signout
router.post('/signout', (req, res) => {
  res.json({ message: 'User signed out (mock implementation)' });
});

// GET /api/users/currentuser
router.get('/currentuser', authenticateJWT, (req, res) => {
  res.json({ email: req.user.email });
});

module.exports = router;
