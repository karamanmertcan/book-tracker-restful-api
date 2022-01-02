import User from '../models/User';
import jwt from 'jsonwebtoken';
import { hashPassword, comparePassword } from '../helpers/auth';

//@Desc Kullanıcı girişi yapmak için kullanılır.
//@Route PUBLIC POST /api/login
export const login = async (req, res) => {
  const { email, password } = req.body;
  console.log(password);

  try {
    const user = await User.findOne({ email });
    if (!user) {
      res.json({
        message: 'Kullanici Bulunamadi'
      });
    }

    //check password
    const isMatch = await comparePassword(password, user.password);

    if (!isMatch) {
      res.json({
        message: 'Sifre Hatalidir'
      });
    }

    //token olusturma
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    user.password = undefined;
    return res.status(200).json({ token, user, ok: true });
  } catch (error) {
    console.log(error);
    return res.status(400).json('Bilgiler Hatali');
  }
};

//@Desc Kullanıcı üye olma
//@Route PUBLIC POST /api/register
export const register = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name) return res.status(400).json({ error: 'İsim Zorunlu Alandır !!!' });
  if (!email) return res.status(400).json({ error: 'Email Zorunlu Alandır !!!' });
  if (!password || password.length < 6)
    return res
      .status(400)
      .json({ error: 'Şifre Zorunlu Alandır ve 6 Karakterden Uzun Olmalıdır !!!' });

  const user = await User.findOne({ email });

  if (user) return res.status(400).json({ error: 'Bu Email Kullanılıyor !!!' });

  const hashedPassword = await hashPassword(password);

  const newUser = new User({
    name,
    email,
    password: hashedPassword
  });

  try {
    await newUser.save();
    console.log('Kayıt Başarılı');
    res.status(200).json({
      ok: true,
      message: 'Kayıt Başarılı',
      user: newUser
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ error: 'Kayıt Başarısız !!!' });
  }
};

//@Desc Kullanıcı bilgilerini güncelleme
//@Route PRIVATE PUT /api/user-update
export const userUpdate = async (req, res) => {
  try {
    const data = {};

    if (req.body.name) data.name = req.body.name;
    if (req.body.password) data.password = req.body.password;

    const user = await User.findOneAndUpdate({ _id: req.user._id }, data, { new: true });

    if (!user) {
      return res.status(400).json({ error: 'Kullanici Bulunamadi' });
    }

    user.password = undefined;
    return res.status(200).json({ user, ok: true });
  } catch (error) {
    console.log(error);
  }
};

export const getCurrentUser = async (req, res) => {
  try {
    const user = await User.find({ _id: req.user._id });
    if (!user) return res.status(404).json({ error: 'Kullanici Bulunamadi' });

    return res.status(200).json({ user, ok: true });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ error: 'Kullanici Bulunamadi' });
  }
};

export const rankLeaderboard = async (req, res) => {
  try {
    const user = await User.find().sort({ totalPage: -1 }).select('name email totalPage').limit(10);

    if (!user) return res.status(404).json({ error: 'Kullanici Bulunamadi' });

    // console.log(user.totalPage);

    // const next_player = await User.find({
    //   _id: { $ne: user._id },
    //   totalPage: { $gte: user.totalPage }
    // }).sort({ totalPage: 1, email: 1 });

    // const previous_player = await User.find({
    //   _id: { $ne: user._id },
    //   totalPage: { $lte: user.totalPage }
    // }).sort({ totalPage: -1, email: -1 });

    // console.log('previous players', previous_player);

    return res.status(200).json({ user, ok: true });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ error: 'Kullanici Bulunamadi' });
  }
};
