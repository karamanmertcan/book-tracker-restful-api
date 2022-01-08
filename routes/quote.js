import express from 'express';
import { getQuotes } from '../controllers/quote';
import { requireSignin } from '../middlewares/auth';

const router = express.Router();

router.get('/get-user-quotes', requireSignin, getQuotes);

module.exports = router;
