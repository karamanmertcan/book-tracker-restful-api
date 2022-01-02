import express from 'express';
import { getCurrentUser, login, rankLeaderboard, register, userUpdate } from '../controllers/auth';
import { requireSignin } from '../middlewares/auth';

const router = express.Router();

router.get('/get-user', requireSignin, getCurrentUser);
router.get('/get-rank-users', requireSignin, rankLeaderboard);

router.post('/login', login);
router.post('/register', register);

router.put('/user-update', requireSignin, userUpdate);

module.exports = router;
