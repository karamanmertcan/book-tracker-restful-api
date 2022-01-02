import Book from '../models/Book';
import User from '../models/User';

export const getUserBooks = async (req, res) => {
  try {
    const book = await Book.find({ bookOwner: req.user._id });

    if (!book)
      return res.status(400).json({
        error: 'Kitap bulunamadı !!!'
      });

    return res.status(200).json({
      book,
      message: 'Kitaplar başarıyla getirildi'
    });
  } catch (error) {
    console.log(error);
    return res.status(404).json({
      message: 'Error getting user books'
    });
  }
};

export const getSingleBook = async (req, res) => {
  try {
    const book = await Book.findOne({ _id: req.params.id });

    if (!book)
      return res.status(400).json({
        error: 'Kitap bulunamadı !!!'
      });

    return res.status(200).json({
      book,
      message: 'Kitaplar başarıyla getirildi'
    });
  } catch (error) {
    console.log(error);
    return res.status(404).json({
      message: 'Error getting user books'
    });
  }
};

export const bookAdd = async (req, res) => {
  const { bookName, bookAuthor } = req.body;
  try {
    if (!bookName)
      return res.status(400).json({
        error: 'Kitap Adı Zorunlu Alan !!!'
      });
    if (!bookAuthor)
      return res.status(400).json({
        error: 'Yazar Adı Zorunlu Alan !!!'
      });

    const book = await Book.create({
      bookName,
      bookAuthor,
      bookOwner: req.user._id
    });

    return res.status(200).json({
      message: 'Kitap Başarıyla Eklendi !!!',
      book
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      error: 'Kitap Eklenemedi !!!'
    });
  }
};

export const bookAddPage = async (req, res) => {
  const { pageNumber, date } = req.body;
  try {
    const book = await Book.findByIdAndUpdate(
      req.body._id,
      {
        $push: {
          readPages: {
            pageNumber: pageNumber,
            date: date,
            createdBy: req.user._id
          }
        }
      },
      {
        new: true
      }
    );

    if (!book)
      return res.status(400).json({
        error: 'Kitap Bulunamadı !!!'
      });

    return res.status(200).json({
      message: 'Sayfa Başarıyla Eklendi !!!',
      book
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      error: 'Sayfa Eklenemedi !!!'
    });
  }
};

export const bookAddPageToUser = async (req, res, next) => {
  const { pageNumber, date, _id } = req.body;

  let data = {};

  try {
    const book = await Book.findById({ _id: _id });

    if (!book) return res.status(400).json({ error: 'Kitap Bulunamadı !!!' });

    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        $push: {
          readPages: {
            pageNumber: pageNumber,
            date: date,
            bookId: req.body._id,
            createdBy: req.user._id
          }
        }
      },
      {
        new: true
      }
    );

    if (!user) return res.status(404).json({ error: 'Kullanici Bulunamadi' });

    if (user) data.totalPage = user.readPages.reduce((a, b) => a + b.pageNumber, 0);

    const userTotal = await User.findByIdAndUpdate(req.user._id, data, {
      new: true
    });

    console.log(userTotal);

    next();
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      error: 'Sayfa Eklenemedi !!!'
    });
  }
};
