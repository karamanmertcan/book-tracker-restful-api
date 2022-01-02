import express from 'express';
import {
  bookAdd,
  bookAddPage,
  getUserBooks,
  getSingleBook,
  bookAddPageToUser
} from '../controllers/book';
import { requireSignin } from '../middlewares/auth';

const router = express.Router();

router.post('/book-add', requireSignin, bookAdd);

router.get('/get-user-books', requireSignin, getUserBooks);
router.get('/get-single-book/:id', requireSignin, getSingleBook);

router.put('/book-add-page', requireSignin, bookAddPageToUser, bookAddPage);

module.exports = router;
