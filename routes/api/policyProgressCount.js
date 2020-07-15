const express = require('express');
const router = express.Router();

const conn = require('../../middleware/db')();

router.get('/policyProgressCount', (req, res, next) => {
    const sql = `
        SELECT
                COUNT(*)                                            AS "progress_total",
                COUNT(CASE WHEN promise_progress=0 THEN 1 END)      AS "progress_0",
                COUNT(CASE WHEN promise_progress=25 THEN 1 END)     AS "progress_25",
                COUNT(CASE WHEN promise_progress=50 THEN 1 END)     AS "progress_50",
                COUNT(CASE WHEN promise_progress=75 THEN 1 END)     AS "progress_75",
                COUNT(CASE WHEN promise_progress=100 THEN 1 END)    AS "progress_100",
                COUNT(CASE WHEN promise_progress=125 THEN 1 END)    AS "progress_125"
        FROM    policy_list
    `;
    conn.query(sql, (err, results) => {
        res.json(results[0]);
    });
});

module.exports = router;
