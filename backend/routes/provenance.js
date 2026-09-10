const express = require('express');
const { getPublicRegistry } = require('../services/provenance-service');
const router = express.Router();

router.get('/', (req, res) => {
  res.json(getPublicRegistry());
});

module.exports = router;
