import express from 'express';
import { addQuotes, getQuotes, getSingleBookQuotes } from '../controllers/quote';
import { requireSignin } from '../middlewares/auth';

const router = express.Router();

router.get('/get-user-quotes', requireSignin, getQuotes);
router.get('/get-single-book-quotes/:id', requireSignin, getSingleBookQuotes);

router.post('/add-user-quotes', requireSignin, addQuotes);

module.exports = router;
