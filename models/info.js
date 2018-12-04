//对userinfo表,teacherinfo表,managerinfo表的操作均写在此文件中
var pool = require('./config');

var DB_NAME = 'flowrate1023';

function User(user) { //创建User对象
    this.username = user.username;
    this.userpass = user.userpass;
};
// function User(user) { //创建User对象
//     this.username = user.username;
//     this.userpass = user.userpass;
//     this.phone = user.phone;
//     this.school = user.school;
//     this.name = user.name;
// };
module.exports = User;

//1根据用户名得到用户数量
User.getUserNumByName = function getUserNumByName(userRole, userName, school, phone, callback) {
    pool.getConnection(function (err, connection) {
        var useDbSql = "USE " + DB_NAME;
        connection.query(useDbSql, function (err) { //使用回调函数的参数connection来查询数据库
            if (err) {
                console.log("USE Error: " + err.message);
                return;
            }
            console.log('USE succeed');
        });
        switch (userRole) {
            case 's': var tableName = "userinfo"; break;
            case 't': var tableName = "teacherinfo"; break;
            case 'm': var tableName = "managerinfo"; break;
        }
        var getUserNumByName_Sql = "SELECT COUNT(1) AS num FROM " + tableName + " WHERE userName= ? and school=?";
        connection.query(getUserNumByName_Sql, [userName, school], function (err, result) {
            if (err) {
                console.log("getUserNumByName Error: " + err.message);
                return;
            }
            var getSumbyPhone_sql = "SELECT COUNT(1) AS phoneSum FROM " + tableName + " WHERE phonenumber= ?";
            connection.query(getSumbyPhone_sql, [phone], function (err, results) {
                if (err) {
                    console.log("getSumbyPhone_sql Error: " + err.message);
                    return;
                }
                if (!connection.isRelease) {
                    connection.release();
                }
                result[0].phoneSum = results[0].phoneSum;
                callback(err, result);
            });
        });
    });
};

//2一般用node.js连接池模块，这样查询不会堵在创建一个连接后都在这个连接中执行
//连接池模块   http://www.111cn.net/database/mysql/90774.htm
//保存数据
User.save = function save(userName,userPass,phone,school,name,userRole, list_id, callback) {
        pool.getConnection(function (err, connection) { //从创建的连接池中获取到一个我们需要的连接
            var useDbSql = "USE " + DB_NAME;
            console.log(useDbSql);
            connection.query(useDbSql, function (err) { //使用回调函数的参数connection来查询数据库
                if (err) {
                    console.log("USE Error: " + err.message);
                    return;
                }
                console.log('USE succeed');
            });
         //使用User的prototype属性来增加save函数到User函数中
        // var user = {
        //     username: this.username,
        //     userpass: this.userpass,
        //     school: this.school,
        //     phone: this.phone,
        //     name: this.name
        // };
        switch (userRole) {
            case 's': var tableName = "userinfo"; break;
            case 't': var tableName = "teacherinfo"; break;
            case 'm': var tableName = "managerinfo"; break;
        }
        var insertUser_Sql = "INSERT INTO " + tableName + " (list_id,userName,userPass,phonenumber,school,name) VALUES (?,?,?,?,?,?)";
        connection.query(insertUser_Sql, [list_id, userName, userPass, phone, school, name], function (err, result) {
            if (err) {
                console.log("insertUser_Sql Error: " + err.message);
                return;
            }
            var setstate_sql = "update list set state=1 where id=?";
            connection.query(setstate_sql, [list_id], function (err, results) {
                if (err) {
                    console.log("setstate_sql Error: " + err.message);
                    return;
                }
                var getUserId_sql = "select id from " + tableName + " where username=? and school=?";
                connection.query(getUserId_sql, [userName,school], function (err, resultss) {
                    if (err) {
                        console.log("getUserId_sql Error: " + err.message);
                        return;
                    }
                    if (!connection.isRelease) {
                        connection.release();
                    }
                    console.log("manager invoked[state]");
                    callback(err, resultss[0].id);
                });
            });
        });
    });
};

//3根据用户名得到info表的所有信息
User.getUserByUserName = function getUserByUserName(userRole, username, school, callback) {
    pool.getConnection(function (err, connection) {
        var useDbSql = "USE " + DB_NAME;
        connection.query(useDbSql, function (err) { //使用回调函数的参数connection来查询数据库
            if (err) {
                console.log("USE Error: " + err.message);
                return;
            }
            console.log('USE succeed');
        });
        switch (userRole) {
            case 's': var tableName = "userinfo"; break;
            case 't': var tableName = "teacherinfo"; break;
            case 'm': var tableName = "managerinfo"; break;
        }
        var getUserByUserName_Sql = "SELECT * FROM " + tableName + " WHERE username = ? and school=?";
        connection.query(getUserByUserName_Sql, [username, school], function (err, result) {
            if (err) {
                console.log("in manager table getUserByUserName Error: " + err.message);
                callback(err, null);
            }

            if (!connection.isRelease) {
                connection.release();
            }
            callback(err, result);
        });
    });
};

//4根据用户手机号码得到用户数量
User.getUserNumByPhone = function getUserNumByPhone(userRole, phone, callback) {
    pool.getConnection(function (err, connection) {

        var useDbSql = "USE " + DB_NAME;
        connection.query(useDbSql, function (err) { //使用回调函数的参数connection来查询数据库
            if (err) {
                console.log("USE Error: " + err.message);
                return;
            }
            console.log('USE succeed');
        });
        switch (userRole) {
            case 's': var tableName = "userinfo"; break;
            case 't': var tableName = "teacherinfo"; break;
            case 'm': var tableName = "managerinfo"; break;
        }
        var getUserNumByPhone_Sql = "SELECT COUNT(1) AS num FROM " + tableName + " WHERE phonenumber = ?";
        connection.query(getUserNumByPhone_Sql, [phone], function (err, result) {
            if (err) {
                console.log("getUserNumByPhone Error: " + err.message);
                return;
            }

            if (!connection.isRelease) {
                connection.release();
            }
            console.log("manager invoked[getUserNumByPhone]");
            console.log(result);
            callback(err, result);
        });

    });
};

//5根据手机号修改用户密码
User.changeUserPasswordByPhone = function changeUserPasswordByPhone(userRole, phone, newPassword, callback) {
    pool.getConnection(function (err, connection) {
        var useDbSql = "USE " + DB_NAME;
        connection.query(useDbSql, function (err) { //使用回调函数的参数connection来查询数据库
            if (err) {
                console.log("USE Error: " + err.message);
                return;
            }
            console.log('USE succeed');
        });
        switch (userRole) {
            case 's': var tableName = "userinfo"; break;
            case 't': var tableName = "teacherinfo"; break;
            case 'm': var tableName = "managerinfo"; break;
        }
        var changeUserPasswordByPhone_Sql = "UPDATE " + tableName + " SET userPass = ?  where phonenumber = ?";
        connection.query(changeUserPasswordByPhone_Sql, [newPassword, phone], function (err, result) {
            if (err) {
                console.log("in manager table -- changeUserPasswordByPhone_Sql Error: " + err.message);
                callback(err, null);
            }

            if (!connection.isRelease) {
                connection.release();
            }
            console.log("manager invoked[changeUserPasswordByPhone]");
            console.log(result);
            callback(err, result);
        });
    });
};

//6根据用户id获得用户各种资料
User.getUserinfoByUser_id = function getUserinfoByUser_id(role, userName, school, callback) {
    pool.getConnection(function (err, connection) {
        var useDbSql = "USE " + DB_NAME;
        connection.query(useDbSql, function (err) { //使用回调函数的参数connection来查询数据库
            if (err) {
                console.log("USE Error: " + err.message);
                return;
            }
            console.log('USE succeed');
        });
        var tableName;
        switch (role) {
            case 'm': tableName = "managerinfo"; usertype = "管理员"; break;
            case 't': tableName = "teacherinfo"; usertype = "老师"; break;
            case 's': tableName = "userinfo"; usertype = "学生"; break;
        }
        var getUserinfoByUser_id_sql = "SELECT a.name,a.username,a.school,a.phonenumber,b.classname FROM " + tableName + " as a left join list as b on a.list_id = b.id where a.userName = ? and a.school= ?";
        connection.query(getUserinfoByUser_id_sql, [userName, school], function (err, result) {
            if (err) {
                console.log("in info table -- getUserinfoByUser_id Error: " + err.message);
            }
            if (!connection.isRelease) {
                connection.release();
            }
            console.log("invoked[getUserinfoByUser_id]");
            console.log('the result is:', result);
            callback(err, result);
        });
    });
};

//7根据用户名修改用户密码
User.changeUserPasswordByUser_id = function changeUserPasswordByUser_id(role, user_id, newPassword, callback) {
    pool.getConnection(function (err, connection) {
        var useDbSql = "USE " + DB_NAME;
        connection.query(useDbSql, function (err) { //使用回调函数的参数connection来查询数据库
            if (err) {
                console.log("USE Error: " + err.message);
                return;
            }
            console.log('USE succeed');
        });
        switch (role) {
            case 'm': tableName = "managerinfo"; break;
            case 't': tableName = "teacherinfo"; break;
            case 's': tableName = "userinfo"; break;
        }

        var changeUserPasswordByUser_id_Sql = "UPDATE " + tableName + " SET userPass = ?  where id = ?";
        connection.query(changeUserPasswordByUser_id_Sql, [newPassword, user_id], function (err, result) {
            if (err) {
                console.log("in teacher table --changeUserPasswordByUser_id_Sql Error: " + err.message);
            }

            if (!connection.isRelease) {
                connection.release();
            }

            console.log("invoked[changeUserPasswordByUser_id]");
            console.log(result);
            callback(err, result);
        });
    });
};

//8根据用户名修改用户班级和姓名信息
User.changeUserMessageByUser_id = function changeUserMessageByUser_id(role, username, school, name, newclass, callback) {
    pool.getConnection(function (err, connection) {
        var useDbSql = "USE " + DB_NAME;
        connection.query(useDbSql, function (err) { //使用回调函数的参数connection来查询数据库
            if (err) {
                console.log("USE Error: " + err.message);
                return;
            }
            console.log('USE succeed');
        });
        switch (role) {
            case 'm': { tableName = "managerinfo"; usertype = "管理员"; break; }
            case 't': { tableName = "teacherinfo"; usertype = "老师"; break; }
            case 's': { tableName = "userinfo"; usertype = "学生"; break; }
        }
        var changeUserMessageByUser_id_Sql = "UPDATE " + tableName + " SET name=?  where username = ? and school=?";
        connection.query(changeUserMessageByUser_id_Sql, [name, username, school], function (err, result) {
            if (err) {
                console.log("in info table -- changeUserMessageByUser_id_Sql Error: " + err.message);
            }
            var change_Sql = "UPDATE list SET classname = ? where userName = ? and usertype=? and school=?";
            connection.query(change_Sql, [newclass, username, usertype, school], function (err, results) {
                if (err) {
                    console.log("change_Sql Error: " + err.message);
                }
                if (!connection.isRelease) {
                    connection.release();
                }
                console.log("invoked[changeUserMessageByUser_id]");
                console.log(results);
            });
            callback(err, result);
        });
    });
};

//9获取管理员的手机号码
User.getManagerPhone = function getManagerPhone(callback) {
    pool.getConnection(function (err, connection) {
        var useDbSql = "USE " + DB_NAME;
        connection.query(useDbSql, function (err) { //使用回调函数的参数connection来查询数据库
            if (err) {
                console.log("USE Error: " + err.message);
                return;
            }
            console.log('USE succeed');
        });
        var getManagerPhone_Sql = "select phonenumber from managerinfo";
        connection.query(getManagerPhone_Sql, function (err, result) {
            if (err) {
                console.log("in manager table -- getManagerPhone_Sql Error: " + err.message);
                callback(err, null);
            }
            if (!connection.isRelease) {
                connection.release();
            }
            console.log("manager invoked[getManagerPhone]");
            console.log(result);
            callback(err, result);
        });
    });
};

//10修改阅读的状态
User.updateReadState = function updateReadState(userRole, username, school, callback) {
    pool.getConnection(function (err, connection) {
        var useDbSql = "USE " + DB_NAME;
        connection.query(useDbSql, function (err) { //使用回调函数的参数connection来查询数据库
            if (err) {
                console.log("USE Error: " + err.message);
                return;
            }
            console.log('USE succeed');
        });
        if (userRole == "m") var table = "managerinfo";
        if (userRole == "s") var table = "userinfo";
        if (userRole == "t") var table = "teacherinfo";
        var updateReadState_Sql = "update " + table + " set read_state=1 where userName= ? and school= ? ";
        connection.query(updateReadState_Sql, [username, school], function (err, result) {
            if (err) {
                console.log("in manager table -- getTimebyYear_Sql Error: " + err.message);
                callback(err, null);
            }
            if (!connection.isRelease) {
                connection.release();
            }
            console.log("manager invoked[updateReadState]");
            console.log(result);
            callback(err, result);
        });
    });
};

//11根据用户名修改手机号码
User.changeNumberByUser_id = function changeNumberByUser_id(role, username, school, number, callback) {
    pool.getConnection(function (err, connection) {
        var useDbSql = "USE " + DB_NAME;
        connection.query(useDbSql, function (err) { //使用回调函数的参数connection来查询数据库
            if (err) {
                console.log("USE Error: " + err.message);
                return;
            }
            console.log('USE succeed');
        });
        switch (role) {
            case 'm': { tableName = "managerinfo"; usertype = "管理员"; break; }
            case 't': { tableName = "teacherinfo"; usertype = "老师"; break; }
            case 's': { tableName = "userinfo"; usertype = "学生"; break; }
        }
        var changeNumberByUser_id_Sql = "UPDATE " + tableName + " SET phonenumber=?  where username = ? and school=?";
        connection.query(changeNumberByUser_id_Sql, [number, username, school], function (err, result) {
            if (err) {
                console.log("in info table -- changeUserMessageByUser_id_Sql Error: " + err.message);
            }
            if (!connection.isRelease) {
                connection.release();
            }
            console.log("invoked[changeUserMessageByUser_id]");
            console.log(result);
            callback(err, result);
        });
    });
};