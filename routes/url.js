const express = require('express');
const { handleGenarateNewShortUrl, handleGetAnalytics } = require('../controllers/url')
const router = express.Router();

router.post('/', handleGenarateNewShortUrl);

router.get('/analytics/:shortId', handleGetAnalytics);
module.exports = router;