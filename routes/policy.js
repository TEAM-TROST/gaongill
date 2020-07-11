const express = require('express');
const router = express.Router();

const conn = require('../middleware/db')();

router.get('/list', (req, res, next) => {
    let type = 1;
    if (req.query.type && parseInt(req.query.type) !== NaN && (parseInt(req.query.type) == 1 || parseInt(req.query.type) == 2))
        type = parseInt(req.query.type);

    let page = 1;
    if (req.query.page && parseInt(req.query.page) !== NaN && parseInt(req.query.page) > 0)
        page = parseInt(req.query.page);

    const sql = (type === 1)
        ? 'SELECT * FROM policy_list'
        : 'SELECT * FROM policy_list order by hit DESC, id';
    conn.query(sql, (err, results) => {
        return res.render('policy-list', {user: req.user, data: results, type: type, page: page});
    });
});

router.get('/view', (req, res, next) => {
    const sql = 'UPDATE policy_list SET hit = hit + 1 WHERE id=?';
    conn.query(sql, [req.query.id], (err, results) => {
        const sql = 'SELECT * FROM policy_list WHERE id=?';
        conn.query(sql, [req.query.id], (err, results) => {
            console.log(results);
            return res.render('policy-view', {data: results[0], type: req.query.type, page: req.query.page});
        });
    });
});

router.get('/upload', (req, res, next) => {
    if (req.user && req.user.permission === 'admin')
        return res.render('policy-upload', {user: req.user, type: req.query.type});
    else
        return res.render('policy-list', {user: req.user, type: req.query.type});
});

module.exports = router;