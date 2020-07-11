const express = require('express');
const router = express.Router();

const conn = require('../middleware/db')();

const utilModule = require('./module/util');

router.get('/list', (req, res, next) => {
    let type = 1;
    if (req.query.type && parseInt(req.query.type) !== NaN && (parseInt(req.query.type) == 1 || parseInt(req.query.type) == 2))
        type = parseInt(req.query.type);

    let page = 1;
    if (req.query.page && parseInt(req.query.page) !== NaN && parseInt(req.query.page) > 0)
        page = parseInt(req.query.page);

    const sql = (type === 1)
        ? 'SELECT * FROM policy_list'
        : 'SELECT * FROM policy_list order by hit DESC, policy_id';
    conn.query(sql, (err, results) => {
        return res.render('policy-list', {user: req.user, data: results, type: type, page: page});
    });
});

router.get('/view', (req, res, next) => {
    const sql = 'UPDATE policy_list SET hit = hit + 1 WHERE policy_id=?';
    conn.query(sql, [req.query.id], (err, results) => {
        const sql =
            'SELECT ' +
            'L.*,  U.authId, U.user_id, U.displayName, E.eval_content, E.eval_reference, E.eval_date ' +
            'FROM policy_list L LEFT OUTER JOIN policy_evaluation E USING(policy_id) LEFT OUTER JOIN users U USING(user_id) ' +
            'WHERE L.policy_id=? ' +
            'ORDER BY E.eval_date';
        conn.query(sql, [req.query.id], (err, results) => {
            if (err) console.log(err);
            console.log(results);
            // results[0].eval_reference = JSON.parse(results[0].eval_reference);
            return res.render('policy-view', {
                user: req.user,
                data: results,
                type: req.query.type,
                page: req.query.page,
                formatDate: utilModule.formatDate
            });
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