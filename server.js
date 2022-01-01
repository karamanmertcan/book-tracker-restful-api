import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import { readdirSync } from 'fs';

const morgan = require('morgan');
require('dotenv').config();

const app = express();
app.use(
  cors({
    origin: ['http://localhost:3000']
  })
);

//db connection
mongoose
  .connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log('DB CONNECTED'))
  .catch((err) => console.log('DB CONNECTION ERR', err));

//middleware
app.use(
  express.json({
    limit: '5mb'
  })
);
app.use(express.urlencoded({ extended: true }));

//autoload routes
readdirSync('./routes').map((r) => app.use('/api', require(`./routes/${r}`)));

const port = process.env.PORT || 8000;

app.listen(port, () => console.log(`SERVER RUNNING ON PORT ${port}`));
