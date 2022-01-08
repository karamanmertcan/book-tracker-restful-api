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
