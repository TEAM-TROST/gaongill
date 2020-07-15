const express = require('express');
const router = express.Router();

const conn = require('../middleware/db')();

const utilModule = require('./module/util');

router.get('/list', (req, res, next) => {
    let type = 1;
    if (req.query.type && parseInt(req.query.type) !== NaN && [1, 2].includes(parseInt(req.query.type)))
        type = parseInt(req.query.type);

    let page = 1;
    if (req.query.page && parseInt(req.query.page) !== NaN && parseInt(req.query.page) > 0)
        page = parseInt(req.query.page);

    const sql = (type === 1)
        ?
        'SELECT ' +
        'L.* ' +
        'FROM policy_list L LEFT JOIN  (' +
        'SELECT * FROM policy_evaluation WHERE isdelete=0) E USING(policy_id) ' +
        'GROUP BY L.policy_id ' +
        'ORDER BY E.eval_date DESC, L.promise_title'
        : 'SELECT * FROM policy_list order by hit DESC, promise_title';
    conn.query(sql, (err, results) => {
        if (err) console.log(err);
        return res.render('policy-list', {user: req.user, data: results, type: type, page: page});
    });
});

router.get('/progress', (req, res, next) => {
    let type = 1;
    if (req.query.type && parseInt(req.query.type) !== NaN && [1, 2, 3, 4, 5].includes(parseInt(req.query.type)))
        type = parseInt(req.query.type);

    let page = 1;
    if (req.query.page && parseInt(req.query.page) !== NaN && parseInt(req.query.page) > 0)
        page = parseInt(req.query.page);

    const sql =
        `
        SELECT
        L.* 
        FROM policy_list L LEFT JOIN (
        SELECT * FROM policy_evaluation WHERE isdelete=0) E USING(policy_id)
        WHERE L.promise_progress=${(type - 1) * 25}
        GROUP BY L.policy_id
        ORDER BY E.eval_date DESC, L.promise_title
        `;
    conn.query(sql, (err, results) => {
        if (err) console.log(err);
        return res.render('policy-progress', {user: req.user, data: results, type: type, page: page});
    });
});

router.get('/search', (req, res, next) => {
    let type = 'search';
    let page = 1;
    if (req.query.page && parseInt(req.query.page) !== NaN && parseInt(req.query.page) > 0)
        page = parseInt(req.query.page);

    const decodeQuery = decodeURI(req.query.query);
    const sql =
        'SELECT ' +
        'L.* ' +
        'FROM policy_list L LEFT JOIN  (' +
        'SELECT * FROM policy_evaluation WHERE isdelete=0) E USING(policy_id) ' +
        'WHERE L.promise_title LIKE ? ' +
        'GROUP BY L.policy_id ' +
        'ORDER BY E.eval_date DESC, L.promise_title';
    conn.query(sql, ['%' + decodeQuery + '%'], (err, results) => {
        if (err) console.log(err);
        return res.render('policy-list', {
            user: req.user,
            data: results,
            type: type,
            page: page,
            query: req.query.query
        });
    });
});


router.get('/view', (req, res, next) => {
    const sql = 'UPDATE policy_list SET hit = hit + 1 WHERE policy_id=?';
    conn.query(sql, [req.query.id], (err, results) => {
        const sql =
            `
            SELECT  L.*,
                    E.eval_id, E.eval_content, E.eval_reference, E.eval_date, E.isdelete,
                    U.authId, U.user_id, U.displayName
            FROM    policy_list L
                    LEFT JOIN (SELECT * FROM policy_evaluation WHERE isdelete=0) E USING(policy_id)
                    LEFT JOIN users U USING(user_id)
            WHERE   L.policy_id=?
            ORDER BY E.eval_date
            `;
        conn.query(sql, [req.query.id], (err, results) => {
            if (err) console.log(err);
            // results[0].eval_reference = JSON.parse(results[0].eval_reference);
            return res.render('policy-view', {
                user: req.user,
                data: results,
                mode: req.query.mode,
                type: req.query.type,
                page: req.query.page,
                formatDate: utilModule.formatDate
            });
        });
    });
});

router.get('/upload', (req, res, next) => {
    const sql = 'SELECT * FROM policy_list WHERE policy_id=?';
    conn.query(sql, [req.query.id], (err, results) => {
        if (req.user && req.user.permission === 'admin') {
            const reqData = {
                user: req.user,
                policyData: results[0],
                mode: req.query.mode,
                type: req.query.type,
                page: req.query.page,
                id: req.query.id
            };
            if (req.query.eid) {
                reqData['eid'] = req.query.eid;
                const sql = 'SELECT * FROM policy_evaluation WHERE eval_id=? AND isdelete=0';
                conn.query(sql, [req.query.eid], (err, results) => {
                    reqData['eval_content'] = results[0].eval_content;
                    reqData['eval_reference'] = JSON.parse(results[0].eval_reference);
                    return res.render('policy-upload', reqData);
                });
            } else {
                return res.render('policy-upload', reqData);
            }
        } else
            return res.redirect(`/policy/list?type=${req.query.type}&page=${req.query.page}`);
    });
});

router.post('/upload', (req, res, next) => {
    const sql = 'UPDATE policy_list SET promise_content=?, promise_progress=? WHERE policy_id=?';
    conn.query(sql, [req.body.promise_content, req.body.promise_progress, req.body.policy_id], (err, results) => {
        let url = '/policy/view?';
        if (req.body.mode) url += 'mode=' + req.body.mode + '&';
        if (req.body.type) url += 'type=' + req.body.type + '&';
        if (req.body.page) url += 'page=' + req.body.page + '&';
        url += 'id=' + req.body.policy_id;
        if (req.body.eid) {
            const sql =
                'UPDATE policy_evaluation SET ' +
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
                'INSERT INTO policy_evaluation ' +
                '(policy_id, user_id, eval_content, eval_reference) ' +
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
            conn.query(sql, [parseInt(req.body.policy_id), req.user.user_id, req.body.eval_content, JSON.stringify(eval_ref)], (err, results) => {
                return res.redirect(url);
            });
        }
    });
});

router.post('/delete', (req, res, next) => {
    const sql = 'UPDATE policy_evaluation SET isdelete=1 WHERE eval_id=?';
    conn.query(sql, [req.body.eid], (err, results) => {
        return res.redirect('back');
    });
});

module.exports = router;