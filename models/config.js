//对数据库的配置写在此文件中
var mysql = require('mysql');
var pool = mysql.createPool({
    host: '127.0.0.1',
    port: 3306,
    user: 'root',
    password: 'zhl136726'
});

module.exports = pool;