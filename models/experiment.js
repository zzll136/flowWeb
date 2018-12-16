//对experiment表的操作均写在此文件中
var pool = require('./config');

var DB_NAME = 'flowrate1023';

function User(user) { //创建User对象
    this.username = user.username;
    this.userpass = user.userpass;
};

module.exports = User;

//1向exper表插入实验数据表
User.insertExperData = function insertExperData(user_id, year, callback) {
    pool.getConnection(function (err, connection) {
        var useDbSql = "USE " + DB_NAME;
        connection.query(useDbSql, function (err) { //使用回调函数的参数connection来查询数据库
            if (err) {
                console.log("USE Error: " + err.message);
                return;
            }
            console.log('USE succeed');
        });

        var judge_sql = "select * from experiment where user_id=? and year=?";

        connection.query(judge_sql, [user_id, year], function (err, result) {
            if (err) {
                console.log("insertExperData Error: " + err.message);
                return;
            }
            if (result.length == 0) {
                var insertExp_sql = "Insert into experiment(user_id,year,courseID,status,score) values(?,?,0,0,0),(?,?,1,0,0),\
                    (?,?,2,0,0),(?,?,3,0,0),(?,?,4,0,0),(?,?,5,0,0),(?,?,6,0,0),(?,?,7,0,0),(?,?,8,0,0)";
                connection.query(insertExp_sql, [user_id, year, user_id, year, user_id, year, user_id, year, user_id, year, user_id, year, user_id, year, user_id, year, user_id, year], function (err, results) {
                    if (err) {
                        console.log("insertExp_sql Error: " + err.message);
                        return;
                    }
                    if (!connection.isRelease) {
                        connection.release();
                    }
                });
            }
            else if (!connection.isRelease) {
                connection.release();
            }
            console.log("invoked[insertExperData]");
            console.log(result);
            callback(err, result);
        });
    });
};

//2获取用户的课程id和实验完成状态，用在在线实验界面和开始实验后的检查
User.getCourseStatus = function getCourseStatus(user_id, callback) {
    pool.getConnection(function (err, connection) {

        var useDbSql = "USE " + DB_NAME;
        connection.query(useDbSql, function (err) { //使用回调函数的参数connection来查询数据库
            if (err) {
                console.log("USE Error: " + err.message);
                return;
            }
            console.log('USE succeed');
        });
        var getMessageByusername_Sql = "SELECT a.ID,a.status,a.courseID,course.courseName FROM experiment\
         as a left join course on a.courseID = course.courseid left join expTime on a.year=expTime.year where a.user_id=? order by expTime.startDate desc";

        connection.query(getMessageByusername_Sql, [user_id], function (err, result) {
            if (err) {
                console.log("getCourseStatus Error: " + err.message);
                callback(err, null);
            }
            if (result == null) {
                console.log("没有实验数据");
            };
            if (!connection.isRelease) {
                connection.release();
            }
            console.log('搜索按钮的result的类型', result);
            callback(err, result);
        });
    });
};

//3根据用户user_id和year来获取用户这次实验的状态
User.getCourseStatusbyYear = function getCourseStatusbyYear(user_id, year, callback) {
    pool.getConnection(function (err, connection) {

        var useDbSql = "USE " + DB_NAME;
        connection.query(useDbSql, function (err) { //使用回调函数的参数connection来查询数据库
            if (err) {
                console.log("USE Error: " + err.message);
                return;
            }
            console.log('USE succeed');
        });
        var getCourseStatusbyYear_Sql = "SELECT a.ID,a.status,a.courseID,course.courseName FROM experiment\
         as a left join course on a.courseID = course.courseid where a.user_id=? and a.year=?";

        connection.query(getCourseStatusbyYear_Sql, [user_id, year], function (err, result) {
            if (err) {
                console.log("getCourseStatusbyYear Error: " + err.message);
                callback(err, null);
            }
            if (result == null) {
                console.log("没有实验数据");
            };
            if (!connection.isRelease) {
                connection.release();
            }
            console.log('搜索按钮的result的类型', result);
            callback(err, result);
        });
    });
};

//4保存按钮，向数据库写入实验日志和实验数据
User.setUserCourseLog = function setUserCourseLog(user_id, year, courseID, log, expdata, status, startTime, endTime, code,callback) {
    pool.getConnection(function (err, connection) {
        var setUserCourseLog_Sql = "update experiment set explog=?,status=?,repdata=?,startTime=?,endTime=?,code=? where user_id=? and year=? and courseID=?";
        var useDbSql = "USE " + DB_NAME;
        connection.query(useDbSql, function (err) { //使用回调函数的参数connection来查询数据库
            if (err) {
                console.log("USE Error: " + err.message);
                return;
            }
            console.log('USE succeed');
        });
        connection.query(setUserCourseLog_Sql, [log, status, expdata, startTime, endTime,code, user_id, year, courseID], function (err, result) {
            if (err) {
                console.log("setUserCourseLog Error: " + err.message);
                callback(err, null);
            }
            /*
            connection.query("SELECT LAST_INSERT_ID()", [], function(err, result) {
                var cmd = "UPDATE userinfo SET course=? WHERE username = ?";
                connection.query(cmd, [result[0]['LAST_INSERT_ID()'], username], function(err, result) {});
            });   */
            //res.send('setUserCourseLog success');
            if (!connection.isRelease) {
                connection.release()
            }
            console.log("invoked[setUserCourseLog]");
            console.log('the result is:', result);
            callback(err, result);
        });
    });
}

//5老师界面获取，根据学校，实验批次分页获取所有学生完成实验的情况,个数等,year=-1表示显示全部情况
User.getexpMessageByYear = function getexpMessageByYear(school, year, page, callback) {
    pool.getConnection(function (err, connection) {
        var useDbSql = "USE " + DB_NAME;
        connection.query(useDbSql, function (err) { //使用回调函数的参数connection来查询数据库
            if (err) {
                console.log("USE Error: " + err.message);
                return;
            }
            console.log('USE succeed');
        });

        var getexpMessageByYear_Sql = "select a.user_id,a.year,b.userName,b.name,sum(status=0) as no_num,sum(status=1) as none_num from experiment as a left join userinfo as b on a.user_id=b.id where b.school=? ";
        if (year) getexpMessageByYear_Sql += "and a.year=? GROUP BY b.userName limit " + Number(page - 1) * 15 + ",15";
        else getexpMessageByYear_Sql += " GROUP BY b.userName limit " + Number(page - 1) * 15 + ",15";
        connection.query(getexpMessageByYear_Sql, [school, year], function (err, result) {
            if (err) {
                console.log("in manager table -- getexpMessageByYear_Sql Error: " + err.message);
                callback(err, null);
            }
            var count_sql = "select count(1) as num from experiment as a left join userinfo as b on a.user_id =b.id where b.school=? ";
            if (year) count_sql += "and a.year=? group by b.userName";
            else count_sql += "group by b.userName";
            connection.query(count_sql, [school, year], function (err, results) {
                if (err) {
                    console.log("in manager table -- count_sql Error: " + err.message);
                    callback(err, null);
                }
                if (result.length) result[0].count = results[0].num;
                if (!connection.isRelease) {
                    connection.release();
                }
                console.log("manager invoked[getexpMessageByYear]");
                callback(err, result);
            });
        });
    });
};

//6老师界面根据状态获取学生实验情况
User.getexpMessageBystatus = function getexpMessageBystatus(user_id, status, year, callback) {
    pool.getConnection(function (err, connection) {
        var useDbSql = "USE " + DB_NAME;
        connection.query(useDbSql, function (err) { //使用回调函数的参数connection来查询数据库
            if (err) {
                console.log("USE Error: " + err.message);
                return;
            }
            console.log('USE succeed');
        });
        var getexpMessageBystatus_Sql = "SELECT b.userName,a.autoscore,a.score,a.startTime,a.endTime,a.status,course.courseName FROM experiment as a left join \
        userinfo as b on a.user_id=b.id left join course on a.courseID = course.courseid  where a.user_id=? and a.status=? and a.year=?";
        connection.query(getexpMessageBystatus_Sql, [user_id, status, year], function (err, result) {
            if (err) {
                console.log("in manager table -- getexpMessageBystatus_Sql Error: " + err.message);
                callback(err, null);
            }
            if (!connection.isRelease) {
                connection.release();
            }
            console.log("manager invoked[getexpMessageBystatus]");
            console.log(result);
            callback(err, result);
        });
    });
};

//7学生提交实验报告页面，获取学生资料的那一栏文本框 以及学生查看实验报告页面，获取数据
User.getUserData = function getUserData(user_id, courseid, callback) {
    pool.getConnection(function (err, connection) {
        var getUserData_Sql = "SELECT a.id,a.repData,a.status,a.year,a.autoscore,a.teascore,a.score,a.comment,a.endTime,a.StartTime,\
        course.courseName,course.question,b.name,b.userName FROM experiment as a left join userinfo as b on a.user_id = b.id \
        left join course on a.courseID = course.courseid left join expTime on a.year=expTime.year where a.user_id=? and a.courseID=? order by expTime.startDate desc";
        var useDbSql = "USE " + DB_NAME;
        connection.query(useDbSql, function (err) { //使用回调函数的参数connection来查询数据库
            if (err) {
                console.log("USE Error: " + err.message);
                return;
            }
            console.log('USE succeed');
        });

        connection.query(getUserData_Sql, [user_id, courseid], function (err, result) {
            if (err) {
                console.log("getUserData Error: " + err.message);
                callback(err, null);
            }
            if (result == null) {
                console.log("用户实验资料不存在");
            };
            if (!connection.isRelease) {
                connection.release();
            }
            console.log('result的类型', result);
            callback(err, result);
        });
    });
};

//8学生向数据库上传实验报告
User.subUserReport = function subUserReport(user_id, courseid, year, status, report_path, callback) {
    pool.getConnection(function (err, connection) {
        var subUserReport_sql = "UPDATE experiment set status=?,report_path=? where user_id = ? and courseId = ? and year=?";
        var useDbSql = "USE " + DB_NAME;
        connection.query(useDbSql, function (err) { //使用回调函数的参数connection来查询数据库
            if (err) {
                console.log("USE Error: " + err.message);
                return;
            }
            console.log('USE succeed');
        });

        connection.query(subUserReport_sql, [status, report_path, user_id, courseid, year], function (err, result) {
            if (err) {
                console.log("subUserReport Error: " + err.message);
                callback(err, null);
            }
            if (!connection.isRelease) {
                connection.release();
            }
            console.log("invoked[subUserReport]");
            console.log('the result is:', result);
            callback(err, result);
        });
    });
};
//9提交校准实验的参数
User.updateParameter = function updateParameter(user_id, courseid, year, a, b, callback) {
    pool.getConnection(function (err, connection) {
        var useDbSql = "USE " + DB_NAME;
        connection.query(useDbSql, function (err) { //使用回调函数的参数connection来查询数据库
            if (err) {
                console.log("USE Error: " + err.message);
                return;
            }
            console.log('USE succeed');
        });
        var updateParameter_sql = "update experiment set stu_a=?,stu_b=? where user_id=? and courseid=? and year=?";
        connection.query(updateParameter_sql, [a, b, user_id, courseid, year], function (err, result) {
            if (err) {
                console.log("updateParameter_sql Error: " + err.message);
                callback(err, null);
            }
            if (!connection.isRelease) {
                connection.release();
            }
            console.log("invoked[updateParameter_sql]");
            callback(err, result);
        });
    });
};

//10查看实验报告的主页面，根据左侧的导航和实验批次选择按钮，得到对应学生用户实验的experiment表
User.getUserCourseMessage = function getUserCourseMessage(school, courseid, year, page, callback) {
    pool.getConnection(function (err, connection) {

        var useDbSql = "USE " + DB_NAME;
        connection.query(useDbSql, function (err) { //使用回调函数的参数connection来查询数据库
            if (err) {
                console.log("USE Error: " + err.message);
                return;
            }
            console.log('USE succeed');
        });
        var getUserCourseMessage_Sql = "SELECT a.ID,a.status,a.teascore,a.score,b.name,b.userName,\
        course.courseName,course.question FROM experiment as a left join userinfo as b on a.user_id = b.id\
        left join course on a.courseID = course.courseid where a.status=2 and b.school=?";
        if (year) getUserCourseMessage_Sql += " and a.year = ?";
        if (courseid != -1) {
            //若批次为空，将课程id的值赋给year
            if (!year) year = courseid;
            getUserCourseMessage_Sql += " and a.courseid = ?";
        }
        getUserCourseMessage_Sql += " limit " + Number(page - 1) * 15 + ",15";
        connection.query(getUserCourseMessage_Sql, [school, year, courseid], function (err, result) {
            if (err) {
                console.log("getUserCourseMessage Error: " + err.message);
                callback(err, null);
            }
            var count_sql = "SELECT count(1) as num FROM experiment as a left join userinfo as b on a.user_id = b.id\
            left join course on a.courseID = course.courseid where a.status=2 and b.school=?";
            if (year) count_sql += " and a.year = ?";
            if (courseid != -1) {
                //若批次为空，将课程id的值赋给year
                if (!year) year = courseid;
                count_sql += " and a.courseid = ?";
            }
            connection.query(count_sql, [school, year, courseid], function (err, results) {
                if (err) {
                    console.log("count_sql Error: " + err.message);
                    callback(err, null);
                }
                if (result.length) result[0].count = results[0].num;

                if (!connection.isRelease) {
                    connection.release();
                }
                console.log('看下result的类型', result);
                callback(err, result);
            });
        });
    });
};

//11批改报告的页面，根据搜索按钮，得到对应的已提交的实验报告
User.getUserCourseMessageBynumber = function getUserCourseMessageBynumber(school, username, callback) {
    pool.getConnection(function (err, connection) {
        var useDbSql = "USE " + DB_NAME;
        connection.query(useDbSql, function (err) { //使用回调函数的参数connection来查询数据库
            if (err) {
                console.log("USE Error: " + err.message);
                return;
            }
            console.log('USE succeed');
        });
        var getUserCourseMessageBynumber_Sql = "SELECT a.ID,a.status,a.teascore,a.score,b.name,b.userName,\
        course.courseName FROM experiment as a left join userinfo as b on a.user_id = b.id left join course on a.courseID = course.courseid where b.userName=? and a.status = 2 and b.school=?";
        connection.query(getUserCourseMessageBynumber_Sql, [username, school], function (err, result) {
            if (err) {
                console.log("getUserCourseMessageBynumber Error: " + err.message);
                callback(err, null);
            }
            if (!connection.isRelease) {
                connection.release();
            }
            console.log('看下result的类型', result);
            callback(err, result);
        });
    });
};

//12评分界面，获取学生报告数据
User.getUserDataByid = function getUserDataByid(id, callback) {
    pool.getConnection(function (err, connection) {
        var getUserDataByid_Sql = "SELECT a.ID,a.comment,a.score,a.autoscore,a.teascore,a.courseid,b.school,course.courseName,b.name,\
        a.StartTime,b.userName,a.status FROM experiment as a left join userinfo as b on a.user_id = b.id \
        left join course on a.courseID = course.courseid where a.id=?";
        var useDbSql = "USE " + DB_NAME;
        connection.query(useDbSql, function (err) { //使用回调函数的参数connection来查询数据库
            if (err) {
                console.log("USE Error: " + err.message);
                return;
            }
            console.log('USE succeed');
        });

        connection.query(getUserDataByid_Sql, [id], function (err, result) {
            if (err) {
                console.log("getUserDataByid Error: " + err.message);
                callback(err, null);
            }
            if (result == null) {
                console.log("用户实验资料不存在");
            };
            if (!connection.isRelease) {
                connection.release();
            }
            console.log('result的类型', result);
            callback(err, result);
        });
    });
};

//13评分界面，上传教师评分和最终得分数据
User.setScoreByid = function setScoreByid(school, courseid, userName, comment, score, teascore, callback) {
    pool.getConnection(function (err, connection) {
        var useDbSql = "USE " + DB_NAME;
        connection.query(useDbSql, function (err) { //使用回调函数的参数connection来查询数据库
            if (err) {
                console.log("USE Error: " + err.message);
                return;
            }
            console.log('USE succeed');
        });
        var setScoreByid_sql = "UPDATE experiment set comment=?,score=?,teascore=?  where school = ? and courseid=? and userName=?";
        connection.query(setScoreByid_sql, [comment, score, teascore, school, courseid, userName], function (err, result) {
            if (err) {
                console.log("setScoreByid Error: " + err.message);
                callback(err, null);
            }
            switch (courseid) {
                case '0': setUserScore_sql = 'update userinfo set score0=? where school=? and userName=?'; break; case '1': setUserScore_sql = 'update userinfo set score1=? where school=? and userName=?'; break;
                case '2': setUserScore_sql = 'update userinfo set score0=? where school=? and userName=?'; break; case '3': setUserScore_sql = 'update userinfo set score0=? where school=? and userName=?'; break;
                case '4': setUserScore_sql = 'update userinfo set score0=? where school=? and userName=?'; break; case '5': setUserScore_sql = 'update userinfo set score0=? where school=? and userName=?'; break;
                case '6': setUserScore_sql = 'update userinfo set score0=? where school=? and userName=?'; break; case '7': setUserScore_sql = 'update userinfo set score0=? where school=? and userName=?'; break;
                case '8': setUserScore_sql = 'update userinfo set score0=? where school=? and userName=?'; break;
            }
            connection.query(setUserScore_sql, [score, school, userName], function (err, results) {
                if (err) {
                    console.log("setUserScore_sql Error: " + err.message);
                    callback(err, null);
                }
                if (!connection.isRelease) {
                    connection.release();
                }
                callback(err, result);
            });
        });
    });
};

//14教师下载实验报告 获取报告路径
User.getReportByid = function getReportByid(id, callback) {
    pool.getConnection(function (err, connection) {
        var getReportByid_sql = "select report_path from experiment where id = ?";
        var useDbSql = "USE " + DB_NAME;
        connection.query(useDbSql, function (err) { //使用回调函数的参数connection来查询数据库
            if (err) {
                console.log("USE Error: " + err.message);
                return;
            }
            console.log('USE succeed');
        });

        connection.query(getReportByid_sql, [id], function (err, result) {
            if (err) {
                console.log("getReportByid Error: " + err.message);
                callback(err, null);
            }
            if (!connection.isRelease) {
                connection.release();
            }
            console.log("invoked[getReportByid]");
            console.log('the result is:', result);
            callback(err, result);
        });
    });
};

//15导出学生成绩表
User.getUserscorebyYear = function getUserscorebyYear(school, year, page, callback) {
    pool.getConnection(function (err, connection) {
        var useDbSql = "USE " + DB_NAME;
        connection.query(useDbSql, function (err) { //使用回调函数的参数connection来查询数据库
            if (err) {
                console.log("USE Error: " + err.message);
                return;
            }
            console.log('USE succeed');
        });
        var getUserscorebyYear_Sql = "SELECT group_concat(a.score order by a.courseid) as score,a.user_id,a.year,b.name,b.username from experiment as\
         a left join userinfo as b on a.user_id =b.id  where b.school=? ";
        if (year) getUserscorebyYear_Sql += "and a.year=? group by a.user_id limit " + Number(page - 1) * 15 + ",15";
        else getUserscorebyYear_Sql += "group by a.user_id limit " + Number(page - 1) * 15 + ",15";
        connection.query(getUserscorebyYear_Sql, [school, year], function (err, result) {
            if (err) {
                console.log("getUserscorebyYear Error: " + err.message);
                callback(err, null);
            }
            var count_sql = "SELECT count(DISTINCT user_id) AS num FROM experiment as a left join userinfo as b on a.user_id =b.id where b.school=? ";
            if (year) count_sql += "and a.year=?";
            connection.query(count_sql, [school, year], function (err, results) {
                if (err) {
                    console.log("in manager table -- count_sql Error: " + err.message);
                    callback(err, null);
                }
                if (result.length) result[0].count = results[0].num;

                if (!connection.isRelease) {
                    connection.release();
                }
                console.log('看下result的类型', result);
                callback(err, result);
            });
        });
    });
};
//16导出学生成绩表的搜索按钮
User.getscorebyUser = function getscorebyUser(school, username, year, callback) {
    pool.getConnection(function (err, connection) {
        var useDbSql = "USE " + DB_NAME;
        connection.query(useDbSql, function (err) { //使用回调函数的参数connection来查询数据库
            if (err) {
                console.log("USE Error: " + err.message);
                return;
            }
            console.log('USE succeed');
        });

        var getscorebyUser_Sql = "SELECT group_concat(a.score order by a.courseid) as score,a.user_id,a.year,b.name,b.username from experiment as\
        a left join userinfo as b on a.user_id =b.id  where b.school=? and b.userName=? and a.year=? group by a.user_id";

        connection.query(getscorebyUser_Sql, [school, username, year], function (err, result) {
            if (err) {
                console.log("getscorebyUser Error: " + err.message);
                callback(err, null);
            }
            if (!connection.isRelease) {
                connection.release();
            }
            console.log('看下result的类型', result);
            callback(err, result);
        });
    });
};

//17教师查看学生的成绩详情页面，根据实验批次获取实验数据
User.getUserDataByYear = function getUserDataByYear(user_id, courseid, year, callback) {
    pool.getConnection(function (err, connection) {
        var getUserDataByYear_Sql = "SELECT a.id,a.repData,a.status,a.year,a.autoscore,a.teascore,a.score,a.comment,a.endTime,a.StartTime,\
        course.courseName,course.question,b.name,b.userName FROM experiment as a left join userinfo as b on a.user_id = b.id \
        left join course on a.courseID = course.courseid where a.user_id=? and a.courseID=? and a.year=?";
        var useDbSql = "USE " + DB_NAME;
        connection.query(useDbSql, function (err) { //使用回调函数的参数connection来查询数据库
            if (err) {
                console.log("USE Error: " + err.message);
                return;
            }
            console.log('USE succeed');
        });

        connection.query(getUserDataByYear_Sql, [user_id, courseid, year], function (err, result) {
            if (err) {
                console.log("getUserDataByYear Error: " + err.message);
                callback(err, null);
            }
            if (result == null) {
                console.log("用户实验资料不存在");
            };
            if (!connection.isRelease) {
                connection.release();
            }
            console.log('result的类型', result);
            callback(err, result);
        });
    });
};

//18 保存按钮后，还向数据记录表格添加数据
User.setCourseRecord = function setCourseRecord(user_id, year, courseID, log, expdata, tableid, startTime, endTime,code, callback) {
    pool.getConnection(function (err, connection) {
        var useDbSql = "USE " + DB_NAME;
        connection.query(useDbSql, function (err) { //使用回调函数的参数connection来查询数据库
            if (err) {
                console.log("USE Error: " + err.message);
                return;
            }
            console.log('USE succeed');
        });
        var getCourseRecord_Sql = "select * from experRecord where user_id=? and year=? and courseID=? and startTime = ?";
        connection.query(getCourseRecord_Sql, [user_id, year, courseID, startTime], function (err, result) {
            if (err) {
                console.log("setCourseRecord Error: " + err.message);
                callback(err, null);
            }
            if (!result.length)
                 var setCourseRecord_Sql = "insert into experRecord(code,tableID,expLog,repData,startTime,endTime,user_id,year,courseID) values(?,?,?,?,?,?,?,?,?)";
            else var setCourseRecord_Sql = "update experRecord set code=?,tableID=?,explog=?,repdata=?,startTime=?,endTime=? where user_id=? and year=? and courseID=?";
            connection.query(setCourseRecord_Sql, [code,tableid, log, expdata, startTime, endTime, user_id, year, courseID], function (err, result) {
                if (err) {
                    console.log("setCourseRecord Error: " + err.message);
                    callback(err, null);
                }
                if (!connection.isRelease) {
                    connection.release();
                }
                console.log("invoked[setUserCourseLog]");
                console.log('the result is:', result);
                callback(err, result);
            });
        });
    });
}