const router = require('express').Router();

router.use('/account', require('./account'));
router.use('/chat', require('./chat'));
router.use('/file', require('./file'));
module.exports = router;