const express = require('express');
const router = express.Router();

const request = require('request');
const moment = require('moment');
const conn = require('../middleware/db')();
const sync_mysql = require('sync-mysql');
const sync_conn = new sync_mysql(require('../middleware/secure-configure').MySQL);
const utilModule = require('./module/util');

const serviceKey = '0B8vJo0wA6A9IP69zltMSTt1%2BlWnF9JHrVH1hS2r8CGDDO4uwxdq13xGz8tvpe45cOfcrKRf2H2k23wSUO5XRg%3D%3D';

const thousandsSeparators = num => {
    let numParts = num.toString().split('.');
    numParts[0] = numParts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return numParts.join('.');
};

router.get('/supply', (req, res, next) => {
    request('https://mnd.dataportal.kr/dataset/personal_clothing_for_soldier_2019.json', (error, response, body) => {
        res.render('budget-supply', {user: req.user, supplyData: body});
    });
});

router.get('/list', (req, res, next) => {
    // const openDateBegin = moment().subtract(6, 'M').format('YYYYMMDD');
    const openDateBegin = moment().format('YYYY') + '0101';
    const opengDateEnd = moment().format('YYYYMMDD');
    request(`http://openapi.d2b.go.kr/openapi/service/BidResultInfoService/getDmstcCmpetBidResultList?_type=json&serviceKey=${serviceKey}&opengDateBegin=${openDateBegin}&opengDateEnd=${opengDateEnd}&orntCode=EHD&numOfRows=500&pageNo=1`, (error, response, body) => {
        const item = JSON.parse(body).response.body.items.item;
        for (let i = 0; i < item.length; i++) {
            const dcsNo = item[i].dcsNo;
            const demandYear = item[i].demandYear;
            const pblancNo = item[i].pblancNo;
            const pblancOdr = item[i].pblancOdr;
            const budget_id = dcsNo + ':' + demandYear + ':' + pblancNo + ':' + pblancOdr;
            const sql =
                `
            SELECT  COUNT(*) "eval_cnt"
            FROM    budget_evaluation
            WHERE   budget_id=? AND isdelete=0
            `;
            const result = sync_conn.query(sql, [budget_id]);
            item[i].eval_cnt = result[0].eval_cnt + '개';
        }
        return res.render('budget-list', {user: req.user, budgetList: item});
    });
});

router.get('/view', (req, res, next) => {
    const demandYear = req.query.demandYear;
    const orntCode = req.query.orntCode;
    const dcsNo = req.query.dcsNo;
    const pblancNo = req.query.pblancNo;
    const pblancOdr = req.query.pblancOdr;
    request(`http://openapi.d2b.go.kr/openapi/service/BidResultInfoService/getDmstcCmpetBidResultDetail?_type=json&serviceKey=${serviceKey}&demandYear=${demandYear}&orntCode=${orntCode}&dcsNo=${dcsNo}&pblancNo=${pblancNo}&pblancOdr=${pblancOdr}`, (error, response, body) => {
        const ret = JSON.parse(body).response.body.item;
        ret['budgetAmount'] = thousandsSeparators(ret['budgetAmount']);
        const budget_id = dcsNo + ':' + demandYear + ':' + pblancNo + ':' + pblancOdr;
        const sql =
            `
            SELECT  E.eval_id, E.eval_content, E.eval_reference, E.eval_date, E.isdelete,
                    U.authId, U.user_id, U.displayName
            FROM    budget_evaluation E LEFT JOIN users U USING(user_id)
            WHERE   E.budget_id=? AND E.isdelete=0
            ORDER BY E.eval_date
            `;
        conn.query(sql, [budget_id], (err, results) => {
            if (err) console.log(err);
            return res.render('budget-view', {
                user: req.user,
                budgetDetail: ret,
                data: results,
                budget_id: budget_id,
                demandYear: demandYear,
                orntCode: orntCode,
                dcsNo: dcsNo,
                pblancNo: pblancNo,
                pblancOdr: pblancOdr,
                formatDate: utilModule.formatDate
            });
        });
    });
});

router.get('/upload', (req, res, next) => {
    if (req.user && req.user.permission === 'admin') {
        const reqData = {
            user: req.user,
            bid: req.query.bid,
            eid: req.query.eid,
            demandYear: req.query.demandYear,
            orntCode: req.query.orntCode,
            dcsNo: req.query.dcsNo,
            pblancNo: req.query.pblancNo,
            pblancOdr: req.query.pblancOdr
        };
        if (req.query.eid) {
            reqData['eid'] = req.query.eid;
            const sql = 'SELECT * FROM budget_evaluation WHERE eval_id=? AND isdelete=0';
            conn.query(sql, [req.query.eid], (err, results) => {
                reqData['eval_content'] = results[0].eval_content;
                reqData['eval_reference'] = JSON.parse(results[0].eval_reference);
                return res.render('budget-upload', reqData);
            });
        } else {
            return res.render('budget-upload', reqData);
        }
    } else
        return res.redirect('/budget/list');
});

router.post('/upload', (req, res, next) => {
    let url = `/budget/view?bid=${req.body.bid}&demandYear=${req.body.demandYear}&orntCode=${req.body.orntCode}&dcsNo=${req.body.dcsNo}&pblancNo=${req.body.pblancNo}&pblancOdr=${req.body.pblancOdr}`;
    console.log(req.body);
    if (req.body.eid) {
        const sql =
            'UPDATE budget_evaluation SET ' +
            'eval_content=?,' +
            'eval_reference=?,' +
            'eval_date=CURRENT_TIMESTAMP ' +
            'WHERE eval_id=?';
        const eval_ref = [];
        if (Array.isArray(req.body.eval_ref_title)) {
            for (let i = 0; i < req.body.eval_ref_title.length; i++) {
                eval_ref.push({
                    'title': req.body.eval_ref_title[i],
                    'href': req.body.eval_ref_href[i]
                });
            }
        } else {
            if (req.body.eval_ref_title) {
                eval_ref.push({
                    'title': req.body.eval_ref_title,
                    'href': req.body.eval_ref_href
                });
            }
        }
        conn.query(sql, [req.body.eval_content, JSON.stringify(eval_ref), parseInt(req.body.eid)], (err, results) => {
            return res.redirect(url);
        });
    } else {
        const sql =
            'INSERT INTO budget_evaluation ' +
            '(budget_id, user_id, eval_content, eval_reference) ' +
            'VALUES ' +
            '(?,?,?,?)';
        const eval_ref = [];
        if (Array.isArray(req.body.eval_ref_title)) {
            for (let i = 0; i < req.body.eval_ref_title.length; i++) {
                eval_ref.push({
                    'title': req.body.eval_ref_title[i],
                    'href': req.body.eval_ref_href[i]
                });
            }
        } else {
            if (req.body.eval_ref_title) {
                eval_ref.push({
                    'title': req.body.eval_ref_title,
                    'href': req.body.eval_ref_href
                });
            }
        }
        conn.query(sql, [req.body.bid, req.user.user_id, req.body.eval_content, JSON.stringify(eval_ref)], (err, results) => {
            return res.redirect(url);
        });
    }
});

router.post('/delete', (req, res, next) => {
    const sql = 'UPDATE budget_evaluation SET isdelete=1 WHERE eval_id=?';
    conn.query(sql, [req.body.eid], (err, results) => {
        return res.redirect('back');
    });
});

module.exports = router;
