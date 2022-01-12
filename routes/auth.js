import express from 'express';
import {
  getCurrentUser,
  getLastWeekReadPages,
  login,
  rankLeaderboard,
  register,
  userUpdate
} from '../controllers/auth';
import { requireSignin } from '../middlewares/auth';

const router = express.Router();

router.get('/get-user', requireSignin, getCurrentUser);
router.get('/get-rank-users', requireSignin, getLastWeekReadPages, rankLeaderboard);

router.get('/get-last-week', requireSignin, getLastWeekReadPages);

router.post('/login', login);
router.post('/register', register);

router.put('/user-update', requireSignin, userUpdate);

// router.post('/odeme', createOrder);

module.exports = router;
