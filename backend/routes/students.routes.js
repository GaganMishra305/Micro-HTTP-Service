const express = require('express');
const router = express.Router();
const { fetchAndStoreStudents, getStudents } = require('../controllers/students.controllers');
const authenticateToken = require('../middleware/auth');

// router.post('/fetch', fetchAndStoreStudents);
router.get('/', getStudents);

module.exports = router;