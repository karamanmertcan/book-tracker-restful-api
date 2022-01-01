import express from 'express';
import { login, register, userUpdate } from '../controllers/auth';
import { requireSignin } from '../middlewares/auth';

const router = express.Router();

router.post('/login', login);
router.post('/register', register);

router.put('/user-update', requireSignin, userUpdate);

module.exports = router;
