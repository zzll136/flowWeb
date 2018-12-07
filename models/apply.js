//对course表,apply表,exptime表,tablestatus表的操作均写在此文件中
var pool = require('./config');

var DB_NAME = 'flowrate1023';

function User(user) { //创建User对象
    this.username = user.username;
    this.userpass = user.userpass;
};

module.exports = User;


//--------------------对course表的操作---------------------------
//1老师提交实验思考题
User.subQuestion = function subQuestion(courseid, question, callback) {
    pool.getConnection(function (err, connection) {
        var useDbSql = "USE " + DB_NAME;
        connection.query(useDbSql, function (err) { //使用回调函数的参数connection来查询数据库
            if (err) {
                console.log("USE Error: " + err.message);
                return;
            }
        });
        var subQuestion_sql = "update course set question=? where courseid=?";
        connection.query(subQuestion_sql, [question, courseid], function (err, result) {
            if (err) {
                console.log("in course table -- subQuestion_sql Error: " + err.message);
            }
            if (!connection.isRelease) {
                connection.release();
            }
            callback(err, result);
        });
    });
};
//2获取实验思考题
User.getQuestion = function getQuestion(courseid, callback) {
    pool.getConnection(function (err, connection) {
        var useDbSql = "USE " + DB_NAME;
        connection.query(useDbSql, function (err) { //使用回调函数的参数connection来查询数据库
            if (err) {
                console.log("USE Error: " + err.message);
                return;
            }
            console.log('USE succeed');
        });
        if (courseid == -1) courseid = 0;
        var getQuestion_sql = "select question from course where courseid= ? ";
        connection.query(getQuestion_sql, [courseid], function (err, result) {
            if (err) {
                console.log("in ordertime table -- getQuestion_sql Error: " + err.message);
            }
            if (!connection.isRelease) {
                connection.release();
            }
            console.log("invoked[insertautoscore]");
            callback(err, result);
        });
    });
};

//-------------------对apply表的操作---------------------------
//1获取实验开放的学校
User.getOpenSchool = function getOpenSchool(callback) {
    pool.getConnection(function (err, connection) {
        var useDbSql = "USE " + DB_NAME;
        connection.query(useDbSql, function (err) { //使用回调函数的参数connection来查询数据库
            if (err) {
                console.log("USE Error: " + err.message);
                return;
            }
            console.log('USE succeed');
        });
        var getOpenSchool_Sql = "select school from apply where state=1 group by school";
        connection.query(getOpenSchool_Sql, function (err, result) {
            if (err) {
                console.log("in manager table -- getOpenSchool_Sql Error: " + err.message);
                callback(err, null);
            }
            if (!connection.isRelease) {
                connection.release();
            }
            callback(err, result);
        });
    });
};

//2外校师生提交申请
User.subApply = function subApply(name, username, school, institute, course, phone, startDate, endDate, apply_time, callback) {
    pool.getConnection(function (err, connection) {
        var useDbSql = "USE " + DB_NAME;
        connection.query(useDbSql, function (err) { //使用回调函数的参数connection来查询数据库
            if (err) {
                console.log("USE Error: " + err.message);
                return;
            }
            console.log('USE succeed');
        });
        var subApply_Sql = "insert into apply(name,username,school,institute,course,phone,startDate,endDate,apply_time,state) value(?,?,?,?,?,?,?,?,?,0)";
        connection.query(subApply_Sql, [name, username, school, institute, course, phone, startDate, endDate, apply_time], function (err, result) {
            if (err) {
                console.log("in manager table -- subApply__Sql Error: " + err.message);
                callback(err, null);
            }
            if (!connection.isRelease) {
                connection.release();
            }
            console.log("manager invoked[subApply]");
            console.log(result);
            callback(err, result);
        });
    });
};

//---------------对exptime表的操作--------------------------------
//1管理员界面获取实验开放的时间
User.getOpenYear = function getOpenYear(callback) {
    pool.getConnection(function (err, connection) {
        var useDbSql = "USE " + DB_NAME;
        connection.query(useDbSql, function (err) { //使用回调函数的参数connection来查询数据库
            if (err) {
                console.log("USE Error: " + err.message);
                return;
            }
            console.log('USE succeed');
        });
        var getOpenYear_Sql = "select year from exptime";
        connection.query(getOpenYear_Sql, function (err, result) {
            if (err) {
                console.log("in manager table -- getOpenYear_Sql Error: " + err.message);
                callback(err, null);
            }
            if (!connection.isRelease) {
                connection.release();
            }
            console.log("manager invoked[getOpenYear]");
            console.log(result);
            callback(err, result);
        });
    });
};

//2管理员页面获取所有实验的时间，这里得到的是一个数组
User.getopenTimeMessage = function getopenTimeMessage(callback) {
    pool.getConnection(function (err, connection) {
        var useDbSql = "USE " + DB_NAME;
        connection.query(useDbSql, function (err) { //使用回调函数的参数connection来查询数据库
            if (err) {
                console.log("USE Error: " + err.message);
                return;
            }
            console.log('USE succeed');
        });
        var getopenTimeMessage_Sql = "SELECT * from exptime";
        connection.query(getopenTimeMessage_Sql, function (err, result) {
            if (err) {
                console.log("getopenTimeMessage Error: " + err.message);
                callback(err, null);
            }
            if (result == null) {
                console.log("没有实验数据");
            };
            if (!connection.isRelease) {
                connection.release();
            }
            console.log('看下result的类型', result);
            callback(err, result);
        });
    });
};

//3管理员修改实验时间
User.subTime = function subTime(year, startDate, endDate, expTimeStr, repTimeStr, expTime_char, repTime_char, startMonth, endMonth, callback) {
    pool.getConnection(function (err, connection) {

        var useDbSql = "USE " + DB_NAME;
        connection.query(useDbSql, function (err) { //使用回调函数的参数connection来查询数据库
            if (err) {
                console.log("USE Error: " + err.message);
                return;
            }
            console.log('USE succeed');
        });
        var getYear_sql = "select count(1) as num from expTime where year=?";
        connection.query(getYear_sql, [year], function (err, result) {
            if (err) {
                console.log("in manager table -- getYear_sql Error: " + err.message);
                callback(err, null);
            }
            if (result[0].num == 1)
                var editTime_Sql = "Update expTime set startDate=?,endDate=?,expTime=?,repTime=?,expTime_char=?,repTime_char=?,startMonth=?,endMonth=? where year = ?;";
            else
                var editTime_Sql = "insert into expTime(startDate,endDate,expTime,repTime,expTime_char,repTime_char,startMonth,endMonth,year) values(?,?,?,?,?,?,?,?,?)";
            connection.query(editTime_Sql, [startDate, endDate, expTimeStr, repTimeStr, expTime_char, repTime_char, startMonth, endMonth, year], function (err, result) {
                if (err) {
                    console.log("in manager table -- editTime_Sql Error: " + err.message);
                    callback(err, null);
                }
                if (!connection.isRelease) {
                    connection.release();
                }
                console.log("manager invoked[subTime]");
                console.log(result);
                callback(err, result);
            });
        });
    });
};

//4获取实验开放的时间段
User.getTimebyYear = function getTimebyYear(year, callback) {
    pool.getConnection(function (err, connection) {
        var useDbSql = "USE " + DB_NAME;
        connection.query(useDbSql, function (err) { //使用回调函数的参数connection来查询数据库
            if (err) {
                console.log("USE Error: " + err.message);
                return;
            }
            console.log('USE succeed');
        });
        var getTimebyYear_Sql = "select * from exptime where year=?";
        connection.query(getTimebyYear_Sql, [year], function (err, result) {
            if (err) {
                console.log("in manager table -- getTimebyYear_Sql Error: " + err.message);
                callback(err, null);
            }
            if (!connection.isRelease) {
                connection.release();
            }
            console.log("manager invoked[getTimebyYear]");
            console.log(result);
            callback(err, result);
        });
    });
};

//5删除实验开放的时间段
User.deleteTimebyYear = function deleteTimebyYear(year, callback) {
    pool.getConnection(function (err, connection) {
        var useDbSql = "USE " + DB_NAME;
        connection.query(useDbSql, function (err) { //使用回调函数的参数connection来查询数据库
            if (err) {
                console.log("USE Error: " + err.message);
                return;
            }
            console.log('USE succeed');
        });
        var deleteTimebyYear_Sql = "delete from exptime where year=?";
        connection.query(deleteTimebyYear_Sql, [year], function (err, result) {
            if (err) {
                console.log("in manager table -- getTimebyYear_Sql Error: " + err.message);
                callback(err, null);
            }
            if (!connection.isRelease) {
                connection.release();
            }
            console.log("manager invoked[deleteTimebyYear]");
            console.log(result);
            callback(err, result);
        });
    });
};

//6预约实验时间界面，根据实验批次获取实验的开放时间
User.getTimeByYear = function getTimeByYear(year, callback) {
    pool.getConnection(function (err, connection) {
        var useDbSql = "USE " + DB_NAME;
        connection.query(useDbSql, function (err) { //使用回调函数的参数connection来查询数据库
            if (err) {
                console.log("USE Error: " + err.message);
                return;
            }
            console.log('USE succeed');
        });
        var getTime_sql = "select expTime_char,startMonth,endMonth from exptime";
        if (year != 0) getTime_sql += " where year=?";
        connection.query(getTime_sql, [year], function (err, result) {
            if (err) {
                console.log("getTimeByYear Error: " + err.message);
                callback(err, null);
            }
            if (!connection.isRelease) {
                connection.release();
            }
            console.log("invoked[getTimeByYear]");
            console.log('the result is:', result);
            callback(err, result);
        });
    });
};

//---------------对tablestatus表的操作--------------------------------
//1管理员获取当前桌子状态
User.getTablestatus = function getTablestatus(callback) {
    pool.getConnection(function (err, connection) {
        var useDbSql = "USE " + DB_NAME;
        connection.query(useDbSql, function (err) { //使用回调函数的参数connection来查询数据库
            if (err) {
                console.log("USE Error: " + err.message);
                return;
            }
            console.log('USE succeed');
        });
        var getTablestatus_sql = "select * from tablestatus order by id";
        connection.query(getTablestatus_sql, function (err, result) {
            if (err) {
                console.log("getTablestatus Error: " + err.message);
                callback(err, null);
            }
            if (!connection.isRelease) {
                connection.release();
            }
            callback(err, result);
        });
    });
};

//2预约实验时间界面，获取当前开放的设备数量
User.getdeviceNum = function getdeviceNum(callback) {
    pool.getConnection(function (err, connection) {
        var useDbSql = "USE " + DB_NAME;
        connection.query(useDbSql, function (err) { //使用回调函数的参数connection来查询数据库
            if (err) {
                console.log("USE Error: " + err.message);
                return;
            }
            console.log('USE succeed');
        });
        var getdeviceNum_sql = "select count(1) as num from tablestatus where status=1 or status=2";
        connection.query(getdeviceNum_sql, function (err, result) {
            if (err) {
                console.log("getdeviceNum Error: " + err.message);
                callback(err, null);
            }
            if (!connection.isRelease) {
                connection.release();
            }
            console.log("invoked[getdeviceNum]");
            console.log('the result is:', result);
            callback(err, result);
        });
    });
};

//3给用户分配实验桌子号
User.newdistributionTable = function newdistributionTable(user_id, userrole, year, courseid, min, date, time, callback) {
    pool.getConnection(function (err, connection) {
        var useDbSql = "USE " + DB_NAME;
        connection.query(useDbSql, function (err) { //使用回调函数的参数connection来查询数据库
            if (err) {
                console.log("USE Error: " + err.message);
                return;
            }
            console.log('USE succeed');
        });
        var distributionTable_sql = "select * from tablestatus where status=1 order by id";
        connection.query(distributionTable_sql, function (err, result) {
            if (err) {
                console.log("newdistributionTable Error: " + err.message);
                callback(err, null);
            }
            var tableid = 7;
            if (result.length != 0) {
                var random = Math.random() * (result.length);
                tableid = result[parseInt(random)].tableid;
            }
            if (tableid != 7) {
                var statuschangeSql = "update tablestatus set status=2 where tableid= ?";
                connection.query(statuschangeSql, [tableid], function (err, result) {
                    if (err) {
                        console.log("statuschange Error: " + err.message);
                        callback(err, null);
                    }
                    var idupdateSql = "update experiment set tableid=? where user_id=? and year=? and courseid = ?";
                    connection.query(idupdateSql, [tableid, user_id, year, courseid], function (err, result) {
                        if (err) {
                            console.log("idupdate Error: " + err.message);
                            callback(err, null);
                        }
                        if (min <= 10) var doif = 1;
                        else var doif = 2;
                        var insertorderStatus_Sql = "update new_ordertime set doif=? where user_id=? and year=? and userrole=? and experdate=? and expertime=? and (doif is null or doif = 3)";
                        connection.query(insertorderStatus_Sql, [doif, user_id, year, userrole, date, time], function (err, result) {
                            if (err) {
                                console.log("insertorderStatus Error: " + err.message);
                                callback(err, null);
                            }
                            if (!connection.isRelease) {
                                connection.release();
                            }
                            console.log("invoked[idupdate]");
                            console.log('the result is:', result);
                            callback(err, tableid);
                        });
                    });
                });
            }
            else {
                var insertorderStatus_Sql = "update new_ordertime set doif=3 where user_id=? and year=?  and userrole=? and experdate=? and expertime=? and doif is null";
                connection.query(insertorderStatus_Sql, [user_id, year, userrole, date, time], function (err, result) {
                    if (err) {
                        console.log("insertorderStatus Error: " + err.message);
                        callback(err, null);
                    }
                    if (!connection.isRelease) {
                        connection.release();
                    }
                    callback(err, tableid);
                });
            }
        });
    });
};

//4管理员在线实验，修改当前桌子状态
User.setTablestatus = function setTablestatus(tableid, callback) {
    pool.getConnection(function (err, connection) {
        var useDbSql = "USE " + DB_NAME;
        connection.query(useDbSql, function (err) { //使用回调函数的参数connection来查询数据库
            if (err) {
                console.log("USE Error: " + err.message);
                return;
            }
            console.log('USE succeed');
        });
        var setTablestatus_sql = "select status from tablestatus where tableid=?";
        connection.query(setTablestatus_sql, [tableid], function (err, result) {
            if (err) {
                console.log("setTablestatus Error: " + err.message);
                callback(err, null);
            }
            if (result[0].status !== 1) {
                if (!connection.isRelease) {
                    connection.release();
                }
            }
            else {
                var setstatus_sql = "update tablestatus set status=2 where tableid=?";
                connection.query(setstatus_sql, [tableid], function (err, results) {
                    if (err) {
                        console.log("setstatus_sql Error: " + err.message);
                        callback(err, null);
                    }
                    if (!connection.isRelease) {
                        connection.release();
                    }
                });
            }
            callback(err, result);
        });
    });
};

//5实验结束后，将实验桌状态重置
User.setTableFree = function setTableFree(tableid, callback) {
    pool.getConnection(function (err, connection) {

        var useDbSql = "USE " + DB_NAME;
        connection.query(useDbSql, function (err) { //使用回调函数的参数connection来查询数据库
            if (err) {
                console.log("USE Error: " + err.message);
                return;
            }
            console.log('USE succeed');
        });

        var setTableFree_sql = "UPDATE tablestatus set status=1 where tableid=? and status=2";
        connection.query(setTableFree_sql, [tableid], function (err, result) {
            if (err) {
                console.log("setTableFree Error: " + err.message);
                callback(err, null);
            }
            if (!connection.isRelease) {
                connection.release();
            }
            console.log("invoked[setTableFree]");
            console.log('the result is:', result);
            callback(err, result);
        });
    });
};

//6插入实验桌子号
User.insertTable = function insertTable(tableid, callback) {
    pool.getConnection(function (err, connection) {
        var useDbSql = "USE " + DB_NAME;
        connection.query(useDbSql, function (err) { //使用回调函数的参数connection来查询数据库
            if (err) {
                console.log("USE Error: " + err.message);
                return;
            }
            console.log('USE succeed');
        });
        var insertTable_sql = "update tablestatus set status=1 where tableid=? and status=0";
        connection.query(insertTable_sql, [tableid], function (err, result) {
            if (err) {
                console.log("insertTable Error: " + err.message);
                callback(err, null);
            }
            if (!connection.isRelease) {
                connection.release();
            }
            console.log("invoked[insertTable]");
            console.log('the result is:', result);
            callback(err, result);
        });
    });
};

//7设备断开，设置实验桌子号为0
User.disconnectTable = function disconnectTable(tableid, callback) {
    pool.getConnection(function (err, connection) {
        var useDbSql = "USE " + DB_NAME;
        connection.query(useDbSql, function (err) { //使用回调函数的参数connection来查询数据库
            if (err) {
                console.log("USE Error: " + err.message);
                return;
            }
            //console.log('USE succeed');

        });
        var disconnectTable_sql = "update tablestatus set status=0 where tableid=?";
        connection.query(disconnectTable_sql, [tableid], function (err, result) {
            if (err) {
                console.log("disconnectTable Error: " + err.message);
                callback(err, null);
            }
            if (!connection.isRelease) {
                connection.release();
            }
            console.log("invoked[disconnectTable]");
            console.log('the result is:', result);
            callback(err, result);
        });
    });
};