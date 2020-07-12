const express = require('express');
const router = express.Router();

const request = require('request');

const conn = require('../middleware/db')();

/* GET home page. */
router.get('/', (req, res, next) => {
    request('https://mnd.dataportal.kr/api/kookbangIlbo', (error, response, body) => {
        const sql =
            'SELECT ' +
            'L.* ' +
            'FROM policy_list L LEFT JOIN policy_evaluation E USING(policy_id) ' +
            'GROUP BY L.policy_id ' +
            'ORDER BY E.eval_date DESC';
        conn.query(sql, (err, policyData) => {
            if (err) console.log(err);
            res.render('index', {user: req.user, newsData: JSON.parse(body), policyData: policyData});
        });
    });
});

router.get('/template', (req, res, next) => {
    res.render('template');
});

module.exports = router;
