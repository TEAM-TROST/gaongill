const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
    res.render('news', {user: req.user});
});

module.exports = router;
