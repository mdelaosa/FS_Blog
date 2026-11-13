const router = require('express').Router();

router.use('/authors', require('./api_authors'));
router.use('/posts', require('./api_posts'));

module.exports = router;