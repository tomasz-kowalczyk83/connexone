const express = require('express');

const getsecondsSinceEpoch = require('../src/time')
const router = express.Router();

/* GET home page. */
router.get('/time', function(req, res, next) {
  res.status(200).json({ epoch: getsecondsSinceEpoch() });
});

module.exports = router;
