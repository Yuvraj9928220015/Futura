const express = require('express');
const router = express.Router();
const { subscribeUser } = require('../controllers/receiveControllres');  // exact filename

router.post('/subscribe', subscribeUser);

module.exports = router;