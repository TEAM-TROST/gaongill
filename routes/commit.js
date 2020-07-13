const express = require('express');
const router = express.Router();

const conn = require('../middleware/db')();

router.get('/', (req, res, next) => {
    res.render('commit', {user: req.user});
});

router.post('/', (req, res, next) => {
    res.send(req.body);
});

module.exports = router;
