module.exports = (passport) => {
    const express = require('express');
    const router = express.Router();

    const Schema = require('validate');

    const bkfd2Password = require("pbkdf2-password");
    const hasher = bkfd2Password();

    router.get('/signup', (req, res, next) => {
        res.render('signup', {user: req.user});
    });

    router.post('/signup', (req, res, next) => {
        const reqBodySchema = new Schema({
            'name': {
                type: String,
                required: true,
                length: {min: 1, max: 12},
                message: 'name is required.'
            },
            'email': {
                type: String,
                required: true,
                match: /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/
            },
            'phone': {
                type: String,
                required: true,
                match: /^\d{2,3}-\d{3,4}-\d{4}$/
            },
            'job': {
                type: String,
                required: true,
                match: /\b(?!\bnotselect\b)\w+\b/
            },
            'password': {
                type: String,
                required: true
            },
            'password-repeat': {
                type: String,
                required: true
            }
        });

        const validError = reqBodySchema.validate(req.body);
        if (validError.length > 0) {
            return res.status(400).json({'error': 1, 'message': validError[0].message})
        }

        console.log(req.body);
        res.redirect('/');
    });

    router.get('/facebook',
        passport.authenticate(
            'facebook',
            {
                scope: ['email']
            }
        )
    );

    router.get('/facebook/callback',
        passport.authenticate(
            'facebook',
            {
                failureRedirect: '/auth/signin'
            }
        ), (req, res) => {
            req.session.save(() => {
                res.redirect('/');
            });
        }
    );

    router.get('/signin', (req, res, next) => {
        res.render('signin', {user: req.user});
    });

    router.get('/signout', (req, res, next) => {
        req.logout();
        req.session.save(() => {
            res.redirect('/');
        });
    });

    return router;
};
