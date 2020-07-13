const express = require('express');
const router = express.Router();

const request = require('request');

const moment = require('moment');

const conn = require('../middleware/db')();

const serviceKey = '0B8vJo0wA6A9IP69zltMSTt1%2BlWnF9JHrVH1hS2r8CGDDO4uwxdq13xGz8tvpe45cOfcrKRf2H2k23wSUO5XRg%3D%3D';

router.get('/', (req, res, next) => {
    request('https://mnd.dataportal.kr/api/kookbangIlbo', (error, response, newsData) => {
        const sql =
            'SELECT ' +
            'L.* ' +
            'FROM policy_list L LEFT JOIN policy_evaluation E USING(policy_id) ' +
            'GROUP BY L.policy_id ' +
            'ORDER BY E.eval_date DESC';
        conn.query(sql, (err, policyData) => {
            if (err) console.log(err);
            const openDateBegin = moment().subtract(6, 'M').format('YYYYMMDD');
            const opengDateEnd = moment().format('YYYYMMDD');
            request(`http://openapi.d2b.go.kr/openapi/service/BidResultInfoService/getDmstcCmpetBidResultList?_type=json&serviceKey=${serviceKey}&opengDateBegin=${openDateBegin}&opengDateEnd=${opengDateEnd}&orntCode=EHD&numOfRows=5&pageNo=1`, (error, response, budgetData) => {
                return res.render('index', {
                    user: req.user,
                    newsData: JSON.parse(newsData),
                    policyData: policyData,
                    budgetData: JSON.parse(budgetData).response.body.items.item
                });
            });
        });
    });
});

router.get('/template', (req, res, next) => {
    res.render('template');
});

module.exports = router;
