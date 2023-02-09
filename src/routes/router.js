const express = require('express');
const authRouter = require('./authRouter');

const router = express.Router();

router.use('/user', authRouter);

module.exports = router;
