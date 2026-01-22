import express from 'express';
import { authenticateJWT } from '../middleware/authMiddleware.js';

const router = express.Router();
console.log("data2");

router.get('/profile', authenticateJWT, (req, res) => {
  res.json({
    message: 'Access granted to protected route',
    user: req.user
  });
});

export default router;
