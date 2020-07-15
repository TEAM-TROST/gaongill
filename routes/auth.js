module.exports = (passport) => {
    const express = require('express');
    const router = express.Router();

    const conn = require('../middleware/db')();

    const Schema = require('validate');

    const bkfd2Password = require("pbkdf2-password");
    const hasher = bkfd2Password();

    router.get('/profile', (req, res, next) => {
        if (req.user) {
            res.render('user-profile', {user: req.user});
        } else {
            res.redirect('/auth/signin');
        }
    });

    router.post('/profile', (req, res, next) => {
        if (req.user) {
            const schemaData = {
                'user_id': {
                    type: String,
                    required: true,
                    message: '정상적인 경로로 시도해주세요.'
                },
                'user_auth': {
                    type: String,
                    required: true,
                    message: '정상적인 경로로 시도해주세요.'
                },
                'authId': {
                    type: String,
                    required: true,
                    message: '정상적인 경로로 시도해주세요.'
                },
                'pw_change': {
                    type: String,
                    required: true,
                    message: '정상적인 경로로 시도해주세요.'
                },
                'email': {
                    type: String,
                    required: true,
                    match: /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/,
                    message: {
                        required: '이메일을 입력해주세요.',
                        match: '정상적인 이메일을 입력해주세요.'
                    }
                },
                'displayName': {
                    type: String,
                    required: true,
                    length: {min: 1, max: 12},
                    message: '닉네임을 입력해주세요.'
                },
                'phone': {
                    type: String,
                    required: true,
                    match: /^\d{2,3}-\d{3,4}-\d{4}$/,
                    message: {
                        required: '휴대폰 번호를 입력해주세요.',
                        match: '휴대폰 번호는 xxx-xxxx-xxxx에 맞게 입력해주세요. '
                    }
                },
                'job': {
                    type: String,
                    required: true,
                    match: /\b(?!\bnotselect\b)\w+\b/,
                    message: '직업을 선택해주세요.'
                }
            };
            if (req.body.user_auth === 'local') {
                schemaData['password'] = {
                    type: String,
                    required: true,
                    message: '비밀번호를 입력해주세요.'
                };
                if (req.body.pw_change === 'true') {
                    schemaData['password-change'] = {
                        type: String,
                        required: true,
                        message: '비밀번호를 입력해주세요.'
                    };
                    schemaData['password-change-repeat'] = {
                        type: String,
                        required: true,
                        message: '비밀번호를 재입력해주세요.'
                    };
                }
            }

            const reqBodySchema = new Schema(schemaData);

            const validError = reqBodySchema.validate(req.body);
            if (validError.length > 0) {
                return res.status(400).render('user-profile', {
                    error: 1,
                    message: validError[0].message,
                    data: req.body,
                    user: req.user
                });
            }
            if (req.body.user_auth === 'local') {
                passport.authenticate('local', (err, user, info) => {
                    if (err) {
                        return res.status(400).render('user-profile', {
                            error: 1,
                            message: '정상적인 경로로 시도해주세요.',
                            data: req.body,
                            user: req.user
                        });
                    }
                    // Redirect if it fails
                    if (!user) {
                        return res.status(400).render('user-profile', {
                            error: 1,
                            message: '비밀번호가 일치하지 않습니다.',
                            data: req.body,
                            user: req.user
                        });
                    } else {
                        let sql = `
                        UPDATE  users
                        SET     displayName=?, phone=?, job=?
                        `.trim();
                        const reqData = [
                            req.body.displayName,
                            req.body.phone,
                            req.body.job
                        ];
                        if (req.body.pw_change === 'true') {
                            if (req.body['password-change'] !== req.body['password-change-repeat']) {
                                return res.status(400).render('user-profile', {
                                    error: 1,
                                    message: '변경 비밀번호가 서로 일치하지 않습니다.',
                                    data: req.body,
                                    user: req.user
                                });
                            } else {
                                sql += ', password=?, salt=?';
                                hasher({password: req.body['password-change']}, (err, pass, salt, hash) => {
                                    reqData.push(hash);
                                    reqData.push(salt);
                                    sql += ' WHERE authId=?';
                                    reqData.push(req.body.authId);
                                    conn.query(sql, reqData, (err, results) => {
                                        return res.redirect('/auth/profile');
                                    });
                                });
                            }
                        } else {
                            sql += ' WHERE authId=?';
                            reqData.push(req.body.authId);
                            conn.query(sql, reqData, (err, results) => {
                                return res.redirect('/auth/profile');
                            });
                        }
                    }
                })(req, res, next);
            } else {
                let sql = `
                        UPDATE  users
                        SET     displayName=?, phone=?, job=?
                        `.trim();
                const reqData = [
                    req.body.displayName,
                    req.body.phone,
                    req.body.job
                ];
                sql += ' WHERE authId=?';
                reqData.push(req.body.authId);
                conn.query(sql, reqData, (err, results) => {
                    return res.redirect('/auth/profile');
                });
            }
        } else {
            res.redirect('/auth/signin');
        }
    });
    router.get('/signup', (req, res, next) => {
        res.render('signup', {user: req.user, data: {}});
    });

    router.post('/signup', (req, res, next) => {
        const reqBodySchema = new Schema({
            'name': {
                type: String,
                required: true,
                length: {min: 1, max: 12},
                message: '이름을 입력해주세요.'
            },
            'email': {
                type: String,
                required: true,
                match: /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/,
                message: {
                    required: '이메일을 입력해주세요.',
                    match: '정상적인 이메일을 입력해주세요.'
                }
            },
            'phone': {
                type: String,
                required: true,
                match: /^\d{2,3}-\d{3,4}-\d{4}$/,
                message: {
                    required: '휴대폰 번호를 입력해주세요.',
                    match: '휴대폰 번호는 xxx-xxxx-xxxx에 맞게 입력해주세요. '
                }
            },
            'job': {
                type: String,
                required: true,
                match: /\b(?!\bnotselect\b)\w+\b/,
                message: '직업을 선택해주세요.'
            },
            'password': {
                type: String,
                required: true,
                message: '비밀번호를 입력해주세요.'
            },
            'password-repeat': {
                type: String,
                required: true,
                message: '비밀번호를 재입력해주세요.'
            },
            'agreement': {
                type: String,
                required: true,
                match: /(on)/,
                message: '개인정보처리방침에 동의해주세요.'
            }
        });

        const validError = reqBodySchema.validate(req.body);
        if (validError.length > 0) {
            return res.status(400).render('signup', {error: 1, message: validError[0].message, data: req.body});
        }

        if (req.body.password !== req.body['password-repeat']) {
            return res.status(400).render('signup', {error: 1, message: '입력한 두 암호가 일치하지 않습니다.', data: req.body});
        }

        const authId = 'local:' + req.body.email;
        const sql = 'SELECT * FROM users WHERE authId=?';
        conn.query(sql, [authId], (err, results) => {
            if (results.length > 0) {
                return res.status(400).render('signup', {error: 1, message: '이미 등록된 이메일입니다.', data: req.body});
            } else {
                hasher({password: req.body.password}, (err, pass, salt, hash) => {
                    const newUser = {
                        authId: 'local:' + req.body.email,
                        email: req.body.email,
                        password: hash,
                        salt: salt,
                        name: req.body.name,
                        displayName: req.body.name,
                        phone: req.body.phone,
                        job: req.body.job
                    };
                    const sql = 'INSERT INTO users SET ?';
                    conn.query(sql, newUser, (err, results) => {
                        if (err) {
                            return res.status(400).render('signup', {
                                error: 1,
                                message: '정상적인 경로로 시도해주세요.',
                                data: req.body
                            });
                        } else {
                            req.login(newUser, (err) => {
                                req.session.save(() => {
                                    return res.redirect('/');
                                });
                            });
                        }
                    });
                });
            }
        });
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
        res.render('signin', {user: req.user, data: {}});
    });

    router.post('/signin', (req, res, next) => {
        const reqBodySchema = new Schema({
            'email': {
                type: String,
                required: true,
                match: /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/,
                message: {
                    required: '이메일을 입력해주세요.',
                    match: '정상적인 이메일을 입력해주세요.'
                }
            },
            'password': {
                type: String,
                required: true,
                message: '비밀번호를 입력해주세요.'
            }
        });

        const validError = reqBodySchema.validate(req.body);
        if (validError.length > 0) {
            return res.status(400).render('signin', {error: 1, message: validError[0].message, data: req.body});
        }
        passport.authenticate('local', (err, user, info) => {
            if (err) {
                return res.status(400).render('signin', {error: 1, message: '정상적인 경로로 시도해주세요.', data: req.body});
            }
            // Redirect if it fails
            if (!user) {
                return res.status(400).render('signin', {
                    error: 1,
                    message: '가입하지 않은 아이디이거나, 잘못된 비밀번호입니다.',
                    data: req.body
                });
            }
            req.login(user, (err) => {
                if (err) {
                    return res.status(400).render('signin', {
                        error: 1,
                        message: '정상적인 경로로 시도해주세요.',
                        data: req.body
                    });
                }
                // Redirect if it succeeds
                return res.redirect('/');
            });
        })(req, res, next);
    });

    router.get('/signout', (req, res, next) => {
        req.logout();
        req.session.save(() => {
            res.redirect('/');
        });
    });
    return router;
};
