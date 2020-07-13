module.exports = () => {
    const mysql = require('mysql');

    const MySQLSetting = require('./secure-configure.json').MySQL;

    const conn = mysql.createConnection({
        host: MySQLSetting.host,
        user: MySQLSetting.user,
        password: MySQLSetting.password,
        database: MySQLSetting.database
    });
    return conn;
};