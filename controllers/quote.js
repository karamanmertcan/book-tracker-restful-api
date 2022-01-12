import Quote from '../models/Quote';

export const getQuotes = async (req, res) => {
  try {
    const quotes = await Quote.find({ bookOwnerId: req.user._id });

    if (!quotes) return res.status(400).json({ error: 'Alıntılar Getirilimedi !!!' });

    return res.status(200).json({
      ok: true,
      quotes
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      error: 'Alıntılar Getirilimedi !!!'
    });
  }
};

export const addQuotes = async (req, res) => {
  const { quote, bookName } = req.body;
  try {
    if (!quote) return res.status(400).json({ error: 'Alıntı Girilmedi !!!' });
    if (!bookName) return res.status(400).json({ error: 'Kitap Adı Girilmedi !!!' });

    const quoteObj = await Quote.create({
      quote,
      bookOwnerId: req.user._id,
      bookName,
      bookId: req.body.bookId
    });

    return res.status(200).json({
      ok: true,
      message: 'Alıntı Başarıyla Eklendi !!!',
      quote: quoteObj
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ error: 'Alıntı Eklenemedi !!!' });
  }
};

export const getSingleBookQuotes = async (req, res) => {
  try {
    const quotes = await Quote.find({ bookId: req.params.id });

    if (!quotes) return res.status(400).json({ error: 'Alıntılar Getirilimedi !!!' });

    return res.status(200).json({
      ok: true,
      quotes
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      error: 'Alıntılar Getirilimedi !!!'
    });
  }
};
