//对new_ordertime表的操作均写在此文件中
var pool = require('./config');

var DB_NAME = 'flowrate1023';
function User(user) { //创建User对象
    this.username = user.username;
    this.userpass = user.userpass;
};
module.exports = User;

//1获取预约情况 看是否满了
User.getOrderFull = function getOrderFull(callback) {
    pool.getConnection(function (err, connection) {
        var useDbSql = "USE " + DB_NAME;
        connection.query(useDbSql, function (err) { //使用回调函数的参数connection来查询数据库
            if (err) {
                console.log("USE Error: " + err.message);
                return;
            }
            console.log('USE succeed');
        });
        var getOrderFull_sql = "select experdate,count(1) as num from new_ordertime group by experdate";
        connection.query(getOrderFull_sql, function (err, result) {
            if (err) {
                console.log("getOrderFull Error: " + err.message);
                callback(err, null);
            }
            if (!connection.isRelease) {
                connection.release();
            }
            console.log("invoked[getOrderFull]");
            console.log('the result is:', result);
            callback(err, result);
        });
    });
};

//2预约实验时间界面，根据日期获取该时间段的预约人数
User.getOrder = function getOrder(date, callback) {
    pool.getConnection(function (err, connection) {
        var useDbSql = "USE " + DB_NAME;
        connection.query(useDbSql, function (err) { //使用回调函数的参数connection来查询数据库
            if (err) {
                console.log("USE Error: " + err.message);
                return;
            }
            console.log('USE succeed');
        });

        var getOrder_sql = "select expertime,count(1) as num from new_ordertime where experdate=? group by expertime";
        connection.query(getOrder_sql, [date], function (err, result) {
            if (err) {
                console.log("getOrder Error: " + err.message);
                callback(err, null);
            }
            if (!connection.isRelease) {
                connection.release();
            }
            console.log("invoked[getOrder]");
            console.log('the result is:', result);
            callback(err, result);
        });
    });
};

//3预约时间信息界面，判断用户有没有预约权限，必须在该实验批次的list名单里。但注意老师只要list名单里存在即可，不论哪个批次
User.judgeOrderrRight = function judgeOrderrRight(username,userrole,school,year,callback) {
    pool.getConnection(function (err, connection) {
        var useDbSql = "USE " + DB_NAME;
        connection.query(useDbSql, function (err) { //使用回调函数的参数connection来查询数据库
            if (err) {
                console.log("USE Error: " + err.message);
                return;
            }
            console.log('USE succeed');
        });
        switch (userrole) {
            case 's': var usertype = "学生"; var judgeOrderrRight_sql = "select count(1) as num from list where username=? and usertype=? and school=? and year=?";break;
            case 't': var usertype = "老师"; var judgeOrderrRight_sql = "select count(1) as num from list where username=? and usertype=? and school=?";break;
            case 'm': var usertype = "管理员"; break;
        }
        connection.query(judgeOrderrRight_sql,[username,usertype,school,year], function (err, result) {
            if (err) {
                console.log("judgedoif_sql Error: " + err.message);
                callback(err, null);
            }

            if (!connection.isRelease) {
                connection.release();
            }
            console.log("invoked[judgedoif_sql]");
            console.log('the result is:', result);
            callback(err, result);
        });
    });
};

//4写在学生和老师的预约时间界面，提交用户选的时间段(先检查该时间段有没有重复预约，再检查有没有预约满，最后再插入预约值)
User.insertOrder = function insertOrder(user_id, userrole,year,date, timeid, nowTime, deviceNum, timestamp, callback) {
    pool.getConnection(function (err, connection) {
        var useDbSql = "USE " + DB_NAME;
        connection.query(useDbSql, function (err) { //使用回调函数的参数connection来查询数据库
            if (err) {
                console.log("USE Error: " + err.message);
                return;
            }
            console.log('USE succeed');
        });
        var selectSql = "select * from new_ordertime where user_id=? and userrole=? and experdate =? and expertime= ? and year=?";
        connection.query(selectSql, [user_id,userrole, date, timeid,year], function (err, result1) {
            if (err) {
                console.log("selectSql Error: " + err.message);
                callback(err, null);
            }
            if (result1.length == 0) {
                var judgefull_sql = "select * from new_ordertime where experdate=? and expertime=?";
                connection.query(judgefull_sql, [date, timeid], function (err, result2) {
                    if (err) {
                        console.log("selectSql Error: " + err.message);
                        callback(err, null);
                    }
                    if (result2.length < deviceNum) {
                        var insertOrderinform_sql = "insert into new_ordertime(user_id,userrole,experdate,expertime,ordertime,expertimestamp,year) values(?,?,?,?,?,?,?)";
                        connection.query(insertOrderinform_sql, [user_id,userrole, date, timeid, nowTime, timestamp,year], function (err, result) {
                            if (err) {
                                console.log("insertOrder Error: " + err.message);
                                callback(err, null);
                            }
                            if (!connection.isRelease) {
                                connection.release();
                            }
                            console.log("invoked[insertOrder]");
                            callback(err, 2);
                        });
                    }
                    else {
                        if (!connection.isRelease) {
                            connection.release();
                        }
                        callback(err, 1);
                    }
                });
            }
            else {
                if (!connection.isRelease) {
                    connection.release();
                }
                callback(err, 0);
            }
        });
    });
};

//5预约时间信息界面，获取可能失约实验的id
User.new_judgedoif = function new_judgedoif(user_id, userrole,year,nowTime, callback) {
    pool.getConnection(function (err, connection) {
        var useDbSql = "USE " + DB_NAME;
        connection.query(useDbSql, function (err) { //使用回调函数的参数connection来查询数据库
            if (err) {
                console.log("USE Error: " + err.message);
                return;
            }
            console.log('USE succeed');
        });
        var judgedoif_sql = "select id,doif,expertimestamp from new_ordertime where user_id=? and userrole=? and year=?";
        connection.query(judgedoif_sql,[user_id,userrole,year], function (err, result) {
            if (err) {
                console.log("judgedoif_sql Error: " + err.message);
                callback(err, null);
            }

            if (!connection.isRelease) {
                connection.release();
            }
            console.log("invoked[judgedoif_sql]");
            console.log('the result is:', result);
            callback(err, result);
        });
    });
};

//6预约时间信息界面，设置失约实验
User.new_setdoif = function new_setdoif(id, callback) {
    pool.getConnection(function (err, connection) {
        var useDbSql = "USE " + DB_NAME;
        connection.query(useDbSql, function (err) { //使用回调函数的参数connection来查询数据库
            if (err) {
                console.log("USE Error: " + err.message);
                return;
            }
            console.log('USE succeed');
        });
        var setdoif_sql = "update new_ordertime set doif=0 where id=?";
        connection.query(setdoif_sql, [id], function (err, result) {
            if (err) {
                console.log("getdoif Error: " + err.message);
                callback(err, null);
            }
            if (!connection.isRelease) {
                connection.release();
            }
            console.log("invoked[new_setdoif]");
            console.log('the result is:', result);
            callback(err, result);
        });
    });
};

//7获取预约记录
User.new_getorderRecord = function new_getorderRecord(user_id, year,callback) {
    pool.getConnection(function (err, connection) {
        var useDbSql = "USE " + DB_NAME;
        connection.query(useDbSql, function (err) { //使用回调函数的参数connection来查询数据库
            if (err) {
                console.log("USE Error: " + err.message);
                return;
            }
            console.log('USE succeed');
        });
        var getorderRecord_sql = "select a.id,a.experdate,a.expertime,a.ordertime,a.doif from new_ordertime as a where a.user_id=? and a.year=?";
        connection.query(getorderRecord_sql, [user_id, year], function (err, result) {
            if (err) {
                console.log("new_getorderRecord Error: " + err.message);
                callback(err, null);
            }
            if (!connection.isRelease) {
                connection.release();
            }
            console.log("invoked[new_getorderRecord]");
            console.log('the result is:', result);
            callback(err, result);
        });
    });
};

//8删除预约记录
User.new_delOrder = function new_delOrder(id, callback) {
    pool.getConnection(function (err, connection) {
        var useDbSql = "USE " + DB_NAME;
        connection.query(useDbSql, function (err) { //使用回调函数的参数connection来查询数据库
            if (err) {
                console.log("USE Error: " + err.message);
                return;
            }
            console.log('USE succeed');
        });
        var delOrder_sql = "delete from new_ordertime where id = ?";
        connection.query(delOrder_sql, [id], function (err, result) {
            if (err) {
                console.log("new_delOrder Error: " + err.message);
                callback(err, null);
            }
            if (!connection.isRelease) {
                connection.release();
            }
            console.log("invoked[new_delOrder]");
            console.log('the result is:', result);
            callback(err, result);
        });
    });
};

//9在线实验界面，获取用户预约情况。
User.newgetExpOrder = function newgetExpOrder(user_id, date, time, callback) {
    pool.getConnection(function (err, connection) {
        var useDbSql = "USE " + DB_NAME;
        connection.query(useDbSql, function (err) { //使用回调函数的参数connection来查询数据库
            if (err) {
                console.log("USE Error: " + err.message);
                return;
            }
            console.log('USE succeed');
        });
        var getExpOrder_sql = "select count(1) as num,year from new_ordertime where user_id=? and experdate=? and expertime=?";
        connection.query(getExpOrder_sql, [user_id, date, time], function (err, result) {
            if (err) {
                console.log("newgetExpOrder Error: " + err.message);
                callback(err, null);
            }
            if (!connection.isRelease) {
                connection.release();
            }
            console.log("invoked[newgetExpOrder]");
            console.log('the result is:', result);
            callback(err, result);
        });
    });
};

//10管理员获取预约信息
User.new_getOrderdetails = function new_getOrderdetails(experdate, expertime, callback) {
    pool.getConnection(function (err, connection) {
        var useDbSql = "USE " + DB_NAME;
        connection.query(useDbSql, function (err) { //使用回调函数的参数connection来查询数据库
            if (err) {
                console.log("USE Error: " + err.message);
                return;
            }
            console.log('USE succeed');
        });
        var getOrderdetails_sql = "select a.ordertime,a.doif,(CASE WHEN a.userrole ='s' THEN b.name else c.name end) as name,(case WHEN a.userrole ='s'\
        THEN b.userName else c.userName end) as userName,(case WHEN a.userrole ='s' THEN b.school else c.school END) as school from new_ordertime as a left join userinfo\
        as b on a.user_id=b.id and a.userrole='s' left join teacherinfo as c on a.user_id=c.id and a.userrole='t' where a.experdate=? and a.expertime=?";
        connection.query(getOrderdetails_sql, [experdate, expertime], function (err, result) {
            if (err) {
                console.log("new_getOrderdetails Error: " + err.message);
                callback(err, null);
            }
            if (!connection.isRelease) {
                connection.release();
            }
            console.log("invoked[new_getOrderdetails]");
            console.log('the result is:', result);
            callback(err, result);
        });
    });
};