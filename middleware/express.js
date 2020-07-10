const express = require('express');
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
const MySQLSetting = require('./secure-configure.json').MySQL;

const app = express();
app.set('views', 'views');
app.set('view engine', 'pug');
app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({extended: true})); // for parsing application/x-www-form-urlencoded


app.use(session({
    secret: '1234DSFs@adf1234!@#$asd',
    resave: false,
    saveUninitialized: true,
    store: new MySQLStore(MySQLSetting)
}));


module.exports = app;