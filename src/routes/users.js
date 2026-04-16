const express = require('express');
const router = express.Router();
const users = require('../data/users');

function getUsersV1() {
  return users
}

function getUsersV2() {
  // Return non admin users and add "FLAGGED" in json response
  const nonAdminUsers = users.filter(user => user.role !== 'admin');
  const flaggedUsers = nonAdminUsers.map(user => ({ ...user, FLAGGED: true }));
  return flaggedUsers
}

// GET /api/users
router.get('/', (req, res) => {
  const users = FEATURE ? getUsersV2() : getUsersV1();
  res.json(users);
});

// GET /api/users/:id
router.get('/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const user = users.find(u => u.id === id);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  res.json(user);
});

// POST /api/users
router.post('/', (req, res) => {
  const { name, email } = req.body;
  if (!name || !email) {
    return res.status(400).json({ error: 'name and email are required' });
  }
  const newUser = {
    id: users.length + 1,
    name,
    email,
    role: 'customer',
  };
  users.push(newUser);
  res.status(201).json(newUser);
});

module.exports = router;
