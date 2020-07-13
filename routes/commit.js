const express = require('express');
const router = express.Router();

const nodemailer = require('nodemailer');

const conn = require('../middleware/db')();

router.get('/', (req, res, next) => {
    if (req.user)
        res.render('commit', {user: req.user});
    else
        res.redirect('/auth/signin');
});

router.post('/', (req, res, next) => {
    const transporter = nodemailer.createTransport({
        sendmail: true,
        newline: 'unix',
        path: '/usr/sbin/sendmail'
    });

    transporter.sendMail({
        from: req.body.email,
        to: "sun@jupiterflow.com",
        subject: `[가온길 기여 신청] ${req.body.name}`,
        html: req.body.commit_content.replace(/\r\n|\r|\n/g, "<br />")
    }, (err, info) => {
        console.log(info.envelope);
        console.log(info.messageId);
        return res.render('commit', {user: req.user, infoMessage: '기여신청이 성공적으로 접수되었습니다.', error: 0});
    });
});

module.exports = router;
