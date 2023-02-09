require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { sequelize } = require('./models');

const router = require('./routes/router');
const authRoute = require('./routes/authRouter');

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(cors({ origin: true, credentials: true }));

sequelize
  .authenticate()
  .then(function (err) {
    console.log('Database Connection has been established succesfully.');
  })
  .catch(function (err) {
    console.log('Unable to connect to the database:', err);
  });

app.use('/', router);
app.use('/auth', authRoute);

app.listen(process.env.SERVER_PORT, () => {
  console.log(`Server berhasil start di ${process.env.SERVER_PORT}`);
});
