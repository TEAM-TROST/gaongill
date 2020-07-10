const express = require('express');
const router = express.Router();

const request = require('request');

/* GET home page. */
router.get('/', (req, res, next) => {
    request('https://mnd.dataportal.kr/api/kookbangIlbo', (error, response, body) => {
        res.render('index', {user: req.user, newsData: JSON.parse(body)});
    });
});

router.get('/template', (req, res, next) => {
    res.render('template');
});

module.exports = router;
