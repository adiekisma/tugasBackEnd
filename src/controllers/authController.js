const { user } = require('../models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res, next) => {
  try {
    const payload = req.body;

    const hashedPassword = bcrypt.hashSync(payload.password, 8);

    const registerUser = await user.create({
      firstname: payload.firstname,
      lastname: payload.lastname,
      username: payload.username,
      email: payload.email,
      password: hashedPassword,
    });

    return res.status(201).send({
      message: 'create user success',
      //result: registerUser,
    });
  } catch (error) {
    return res.status(500).send(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    const payload = req.body;

    const getUser = await user.findOne({
      where: { email: payload.email },
    });

    const comparedPassword = bcrypt.compareSync(
      payload.password,
      getUser.dataValues.password
    );
    if (comparedPassword === false) {
      return res.status(400).send({
        message: 'Invalid Password',
      });
    } else {
      const token = jwt.sign(
        {
          id: getUser.dataValues.id,
          email: getUser.dataValues.email,
          username: getUser.dataValues.username,
        },
        process.env.JWT_KEY,
        { expiresIn: 3600 }
      );

      return res.status(400).send({
        message: 'Login success',
        token: token,
      });
    }
  } catch (error) {
    return res.status(500).send({ error });
  }
};

exports.deleteUser = async (req, res, next) => {
  const payload = req.body;
  try {
    await user.destroy
      .findAll({ where: { id: payload.id } })
      .then(async (result) => {
        if (result.length > 0) {
          await user.destroy({ where: { id: payload.id } });
          res.status(200).json({ message: 'delete user successfully' });
        } else {
          res.status(404).json({ message: 'username not found' });
        }
      });
  } catch (error) {
    res.status(404).json({ error });
  }
};
