module.exports = (app) => {
    const conn = require('./db')();
    const bkfd2Password = require("pbkdf2-password");
    const passport = require('passport');
    const LocalStrategy = require('passport-local').Strategy;
    const FacebookStrategy = require('passport-facebook').Strategy;
    const GithubStrategy = require('passport-github').Strategy;
    const hasher = bkfd2Password();

    const FacebookStrategySetting = require('./secure-configure.json').Facebook;

    app.use(passport.initialize(undefined));
    app.use(passport.session(undefined));

    passport.serializeUser((user, done) => {
        console.log('serializeUser', user);
        done(null, user.authId);
    });

    passport.deserializeUser((id, done) => {
        console.log('deserializeUser', id);
        const sql = 'SELECT * FROM users WHERE authId=?';

        conn.query(sql, [id], (err, results) => {
            if (err || !results[0]) {
                console.log(err);
                done('There is no user');
            } else {
                return done(null, results[0]);
            }
        });
    });

    passport.use(new LocalStrategy({
            usernameField: 'email',
            passwordField: 'password'
        },
        (username, password, done) => {
            const uname = username;
            const pwd = password;

            const sql = 'SELECT * FROM users WHERE authId=?';
            conn.query(sql, ['local:' + uname], (err, results) => {
                if (err || !results[0]) {
                    done('There is no user.');
                } else {
                    const user = results[0];
                    return hasher({password: pwd, salt: user.salt}, (err, pass, salt, hash) => {
                        if (hash === user.password) {
                            // console.log('LocalStrategy', user);
                            done(null, user);
                        } else {
                            done(null, false);
                        }
                    });
                }
            });
        }
    ));

    passport.use(new FacebookStrategy({
            clientID: FacebookStrategySetting.clientID,
            clientSecret: FacebookStrategySetting.clientSecret,
            callbackURL: "/auth/facebook/callback",
            profileFields: ['id', 'email', 'gender', 'link', 'locale', 'name', 'timezone', 'updated_time', 'verified', 'displayName']
        },
        (accessToken, refreshToken, profile, done) => {
            const authId = 'facebook:' + profile.id;
            const sql = 'SELECT * FROM users WHERE authId=?';
            conn.query(sql, [authId], (err, results) => {
                if (results.length > 0) {
                    const sql = 'UPDATE users SET email=?, name=?, displayName=? WHERE authId=?';
                    conn.query(sql, [profile.emails[0].value, profile.displayName, profile.displayName, authId], (err, updateRes) => {
                        done(null, results[0]);
                    });
                } else {
                    const newUser = {
                        'authId': authId,
                        'name': profile.displayName,
                        'displayName': profile.displayName,
                        'email': profile.emails[0].value
                    };
                    const sql = 'INSERT INTO users SET ?';
                    conn.query(sql, newUser, (err, results) => {
                        if (err) {
                            console.log(err);
                            done('Error');
                        } else {
                            done(null, newUser);
                        }
                    });
                }
            });
        }
    ));
    return passport;
};