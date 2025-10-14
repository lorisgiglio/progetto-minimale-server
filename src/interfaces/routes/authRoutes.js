const express = require('express');
const router = express.Router();
const AuthService = require('../../application/services/AuthService');

router.get('/secure-data', AuthService.authenticateToken, AuthService.authorizeRole('admin'), (req, res) => {
  res.json({ secretData: 'This is confidential!' });
});

module.exports = router;
