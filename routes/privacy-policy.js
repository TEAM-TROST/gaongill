const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/', (req, res, next) => {
    res.render('privacy-policy', {user: req.user});
});

module.exports = router;
