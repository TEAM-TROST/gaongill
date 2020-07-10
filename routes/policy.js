const express = require('express');
const router = express.Router();

const request = require('request');

router.get('/list', (req, res, next) => {
    res.render('policy-list', {user: req.user, type: req.query.type});
});

router.get('/upload', (req, res, next) => {
    if (req.user && req.user.permission === 'admin')
        res.render('policy-upload', {user: req.user, type: req.query.type});
    else
        res.render('policy-list', {user: req.user, type: req.query.type});
});

module.exports = router;
