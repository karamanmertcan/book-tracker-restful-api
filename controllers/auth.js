import User from '../models/User';
import jwt from 'jsonwebtoken';
import { hashPassword, comparePassword } from '../helpers/auth';
import moment from 'moment';

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
    const user = await User.find()
      .sort({ lastWeekPage: -1 })
      .select('name email lastWeekPage')
      .limit(10);

    if (!user) return res.status(404).json({ error: 'Kullanici Bulunamadi' });

    return res.status(200).json({ user, ok: true });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ error: 'Kullanici Bulunamadi' });
  }
};

var today = new Date();
var first = today.getDate() - today.getDay();
var firstDayWeek = new Date(today.setDate(first));
var lastDayWeek = new Date(today.setDate(first + 6));

export const getLastWeekReadPages = async (req, res, next) => {
  let data = {};

  try {
    const user = await User.find({ _id: req.user._id });

    if (!user) return res.status(404).json({ error: 'Kullanici Bulunamadi' });

    const last = user[0].readPages.filter((item) => {
      return moment(item.date).isBetween(moment(firstDayWeek), moment(lastDayWeek));
    });

    const total = last.reduce((a, b) => a + b.pageNumber, 0);

    data.lastWeekPage = total;

    const newUser = await User.findOneAndUpdate({ _id: req.user._id }, data, { new: true });

    next();
  } catch (error) {
    console.log(error);
    return res.status(400).json({ error: 'Veriler Geitirilemedi !!!' });
  }
};

// export const createOrder = async (req, res) => {
//   try {
//     var request = {
//       locale: Iyzipay.LOCALE.TR,
//       conversationId: '123456789',
//       price: '1',
//       paidPrice: '1.2',
//       currency: Iyzipay.CURRENCY.TRY,
//       basketId: 'B67832',
//       paymentGroup: Iyzipay.PAYMENT_GROUP.LISTING,
//       callbackUrl: 'https://www.merchant.com/callback',
//       enabledInstallments: [2, 3, 6, 9],
//       buyer: {
//         id: 'BY789',
//         name: 'John',
//         surname: 'Doe',
//         gsmNumber: '+905350000000',
//         email: 'email@email.com',
//         identityNumber: '74300864791',
//         lastLoginDate: '2015-10-05 12:43:35',
//         registrationDate: '2013-04-21 15:12:09',
//         registrationAddress: 'Nidakule Göztepe, Merdivenköy Mah. Bora Sok. No:1',
//         ip: '85.34.78.112',
//         city: 'Istanbul',
//         country: 'Turkey',
//         zipCode: '34732'
//       },
//       shippingAddress: {
//         contactName: 'Jane Doe',
//         city: 'Istanbul',
//         country: 'Turkey',
//         address: 'Nidakule Göztepe, Merdivenköy Mah. Bora Sok. No:1',
//         zipCode: '34742'
//       },
//       billingAddress: {
//         contactName: 'Jane Doe',
//         city: 'Istanbul',
//         country: 'Turkey',
//         address: 'Nidakule Göztepe, Merdivenköy Mah. Bora Sok. No:1',
//         zipCode: '34742'
//       },
//       basketItems: [
//         {
//           id: 'BI101',
//           name: 'Binocular',
//           category1: 'Collectibles',
//           category2: 'Accessories',
//           itemType: Iyzipay.BASKET_ITEM_TYPE.PHYSICAL,
//           price: '0.3'
//         },
//         {
//           id: 'BI102',
//           name: 'Game code',
//           category1: 'Game',
//           category2: 'Online Game Items',
//           itemType: Iyzipay.BASKET_ITEM_TYPE.VIRTUAL,
//           price: '0.5'
//         },
//         {
//           id: 'BI103',
//           name: 'Usb',
//           category1: 'Electronics',
//           category2: 'Usb / Cable',
//           itemType: Iyzipay.BASKET_ITEM_TYPE.PHYSICAL,
//           price: '0.2'
//         }
//       ]
//     };
//     iyzipay.checkoutFormInitialize.create(request, function (err, result) {
//       //console.log(result);
//       console.log(
//         result.checkoutFormContent + '<div id="iyzipay-checkout-form" class="responsive"></div>'
//       );
//     });
//   } catch (error) {
//     console.log(error);
//     return res.status(400).json({ error: 'Ödeme Alınamadı' });
//   }
// };
