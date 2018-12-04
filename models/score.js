//对score表的操作均写在此文件中
var pool = require('./config');

var DB_NAME = 'flowrate1023';
function User(user) { //创建User对象
    this.username = user.username;
    this.userpass = user.userpass;
};
module.exports = User;

//1先将用户和实验id等信息insert表score中,根据用户实验预约次数计算预约得分和实验次数得分,满分为10分
User.getOrdertimes = function getOrdertimes(user_id, year, courseid, callback) {
    pool.getConnection(function (err, connection) {

        var useDbSql = "USE " + DB_NAME;
        connection.query(useDbSql, function (err) { //使用回调函数的参数connection来查询数据库
            if (err) {
                console.log("USE Error: " + err.message);
                return;
            }
            console.log('USE succeed');
        });

        var select_Sql = "select * from score where user_id=? and year=? and courseid=?";
        connection.query(select_Sql, [user_id, year, courseid], function (err, result1) {
            if (err) {
                console.log("in ordertime table -- getOrdertimes_Sql Error: " + err.message);
            }
            if (result1.length == 0) {
                var insertscore_Sql = "insert into score(user_id, year,courseid) values(?,?,?)";
                connection.query(insertscore_Sql, [user_id, year, courseid], function (err, result2) {
                    if (err) {
                        console.log("change_Sql Error: " + err.message);
                    }
                    console.log("invoked[updatescore_Sql]");
                })
            }
            var getOrdertimes_sql = "select * from new_ordertime where user_id=? and year=?";
            connection.query(getOrdertimes_sql, [user_id, year], function (err, result3) {
                var ordertimes = [0, 0, 0];
                var orderscore = 10;
                var timescore = 10;
                for (var i = 0; i < result3.length; i++) {
                    if (result3[i].doif == 0) ordertimes[0]++;//0表示失约
                    if (result3[i].doif == 1) ordertimes[1]++;//1表示正常
                    if (result3[i].doif == 2) ordertimes[2]++;//2表示迟到
                }
                orderscore = orderscore - ordertimes[0] * 2 - ordertimes[2] * 1;//预约的分数
                if ((ordertimes[1] + ordertimes[2]) > 9) timescore = 10 - (ordertimes[1] + ordertimes[2] - 9) * 3;
                if (orderscore < 0) orderscore = 0;
                if (timescore < 0) timescore = 0;
                if ((ordertimes[1] + ordertimes[2]) == 0) timescore = 0;
                var updatescore_Sql = "UPDATE score SET misstimes= ?,normaltimes = ?,latetimes=?,orderscore=?,timescore=? where user_id=? and year= ? and courseid= ? ";
                connection.query(updatescore_Sql, [ordertimes[0], ordertimes[1], ordertimes[2], orderscore, timescore, user_id, year, courseid], function (err, results) {
                    if (err) {
                        console.log("change_Sql Error: " + err.message);
                    }
                    if (!connection.isRelease) {
                        connection.release();
                    }
                    console.log("invoked[updatescore_Sql]");
                    console.log(results);
                    //callback(err, results);
                });
                callback(err, result3);
            });
        });
    });
};

//2根据用户实验次数，实验时间,实验日志,实验数据并分析
User.getexp_timespanscore = function getexp_timespanscore(user_id, year, courseid, callback) {
    pool.getConnection(function (err, connection) {
        var useDbSql = "USE " + DB_NAME;
        connection.query(useDbSql, function (err) { //使用回调函数的参数connection来查询数据库
            if (err) {
                console.log("USE Error: " + err.message);
                return;
            }
            console.log('USE succeed');
        });
        var getexp_timespanscore_Sql = "select startTime,endTime,explog,repData,stu_a,stu_b,code from experiment where user_id=? and year=? and courseid=?";
        connection.query(getexp_timespanscore_Sql, [user_id, year, courseid], function (err, result1) {
            if (err) {
                console.log("in ordertime table -- getexp_timespanscore_Sql Error: " + err.message);
            }
            var timespanscore = 0;
            var operationScore = 0;
            var dataScore = 0;
            var timespan = 0;
            var explog_record = "";
            var data_record = "";
            var stu_a, stu_b;
            var sys_a, sys_b;
            if (result1[0].startTime && result1[0].endTime) {
                var startTime = result1[0].startTime.substring(14, 16);
                var endTime = result1[0].endTime.substring(14, 16);
                timespan = endTime - startTime;
                if (timespan < 20) timespanscore= 10;
                else timespanscore = 30-timespan;
                if (timespanscore < 0) timespanscore = 0;
                // if (timespan < 20) timespanscore = 0.5 * timespan;
                // else if (timespan < 30) timespanscore = 10;
                // else timespanscore = 20 - 1 / 3 * timespan;
            }
            if (result1[0].explog) {
                operationScore = 30;
                var explogArray = result1[0].explog.split(">");
                for (var i = 0; i < explogArray.length; i++) {
                    var obj = explogArray[i].indexOf("<");
                    explogArray[i] = explogArray[i].substring(obj + 1, explogArray[i].length);
                }
                console.log("该次实验的实验操作数组" + explogArray);
                if (explogArray[2] != "关闭侧阀") {
                    operationScore = operationScore - 2;
                    explog_record = "开始实验后未及时关闭侧阀;"
                }
                for (var i = 0; i < explogArray.length; i++) {
                    if (explogArray[i] == "打开侧阀") {
                        operationScore = operationScore - 2;
                        explog_record = explog_record + "实验中打开侧阀;"
                    }
                    if (explogArray[i] == "重置实验") {
                        operationScore = operationScore - 2;
                        explog_record = explog_record + "重置实验一次;"
                    }
                }
            }
            if (result1[0].repData) {

                // console.log("result1[0].repData" + result1[0].repData);
                if (courseid == 0 || courseid == 1 || courseid == 2) {
                    dataScore = 40;
                    var repdataArray = result1[0].repData.split(",");
                    var VortexFlow = [];
                    var weight = [];
                    var time = [];
                    var freq = [];
                    freq.push(repdataArray[5]);
                    for (var i = 9; i < repdataArray.length; i = i + 4) {
                        if (repdataArray[i] != repdataArray[i - 4] && repdataArray[i] != 0)
                            freq.push(repdataArray[i]);
                    }
                    console.log(freq);
                    for (var j = 0; j < freq.length; j++) {
                        for (var i = 4; i < repdataArray.length; i++) {
                            if (repdataArray[i + 1] == freq[j]) {
                                var data=repdataArray[i];
                                console.log(Number(data.substring(data.length-2,data.length)));
                                console.log(Number(data.substring(0,1)));
                                repdataArray[i]=Number(data.substring(0,1))*60+Number(data.substring(data.length-2,data.length));
                                time.push(repdataArray[i]);
                                repdataArray[i + 2] = Number(repdataArray[i + 2]) * 3.6;
                                weight.push(repdataArray[i + 2]);
                                VortexFlow.push(repdataArray[i + 3]);
                            }
                        }
                        var parameter = LeastSquare(time, weight);
                        var parameterArray = parameter.split(";");
                        var sys_k = parameterArray[0];
                        var k = average(VortexFlow);
                        if (Math.abs(sys_k - k) > 0.2)
                            {dataScore = dataScore - 5;
                            data_record=data_record+"变频器频率为"+freq[j]+"时，数据误差太大";}
                    }
                }
                if (courseid == 3 || courseid == 4 || courseid == 5) {
                    var repdataArray = result1[0].repData.split(",");
                    var VortexFlow = [];
                    var actFlow = [];
                    for (var i = 6; i < repdataArray.length; i = i + 4) {
                        actFlow.push(repdataArray[i]);
                        VortexFlow.push(repdataArray[i + 1]);
                    }
                    //最小二乘法
                    var parameter = LeastSquare(actFlow, VortexFlow);
                    console.log("parameter的值" + parameter);
                    var parameterArray = parameter.split(";");
                    sys_a = parameterArray[0];
                    sys_a = Number(sys_a).toFixed(4);
                    sys_b = parameterArray[1];
                    sys_b = Number(sys_b).toFixed(4);
                    console.log("线性方程y=" + sys_a + "*x+" + sys_b);
                    stu_a = result1[0].stu_a;
                    stu_b = result1[0].stu_b;
                    if (stu_a && stu_b) {
                        if (Math.abs(sys_a - stu_a) <= 0.2 && Math.abs(sys_b - stu_b) <= 0.5) { dataScore = 40; data_record = "校准曲线方程为y=" + sys_a + "*x+" + sys_b + "，参数基本正确"; }
                        else if (Math.abs(sys_a - stu_a) <= 0.2 && Math.abs(sys_b - stu_b) > 0.5) { dataScore = 30; data_record = "参数误差较大，请重新计算"; }
                        else if (Math.abs(sys_a - stu_a) > 0.2 && Math.abs(sys_b - stu_b) <= 0.5) { dataScore = 30; data_record = "参数误差较大，请重新计算"; }
                        else { dataScore = 10; data_record = "参数误差太大，请重新计算"; }
                    }
                    else data_record = "未填写曲线方程参数";
                }
                if (courseid == 6 || courseid == 7 || courseid == 8) {
                    var repdataArray = result1[0].repData.split(",");
                    var VortexFlow = [];
                    var actFlow = [];
                    for (var i = 6; i < repdataArray.length; i = i + 4) {
                        actFlow.push(repdataArray[i]);
                        VortexFlow.push(repdataArray[i + 1]);
                    }
                    //最小二乘法
                    var parameter = LeastSquare(actFlow, VortexFlow);
                    console.log("parameter的值" + parameter);
                    var parameterArray = parameter.split(";");
                    var sys_a = Number(parameterArray[0]).toFixed(4);
                    var sys_b = Number(parameterArray[1]).toFixed(4);
                    console.log("线性方程y=" + sys_a + "*x+" + sys_b);
                    data_record = "线性方程为y=" + sys_a + "*x+" + sys_b;
                    if (sys_a > 0.5 && sys_a < 0.9) {
                        dataScore = 100 * sys_a - 50;
                        data_record = data_record + "数据曲线线性差";
                    }
                    if (sys_a >= 0.9 && sys_a <= 1.1) {
                        dataScore = 40;
                        data_record = data_record + "数据曲线线性良好";
                    }
                    if (sys_a >= 1.1 && sys_a <= 1.5) {
                        dataScore = -100 * sys_a + 150;
                        data_record = data_record + "数据曲线线性差";
                    }
                }
            }
            // if(result1[0].exptimes_count==1) timescore = 10;
            // else timescore = timescore - result1[0].exptimes_count * 2;
            // if(timescore<0) timescore=0;
            var insertscore_Sql = "UPDATE score SET timespan=?,timespanscore=?,operationScore=?,dataScore=?,explogRecord=?,dataRecord=?,stu_a=?,stu_b=?,sys_a=?,sys_b=? where user_id=? and year = ? and courseid= ? ";
            connection.query(insertscore_Sql, [timespan, timespanscore, operationScore, dataScore, explog_record, data_record, stu_a, stu_b, sys_a, sys_b, user_id, year, courseid], function (err, result2) {
                if (err) {
                    console.log("insertscore_Sql Error: " + err.message);
                }
                if (!connection.isRelease) {
                    connection.release();
                }
                console.log("invoked[insertscore_Sql]");
                console.log(result2);
                //callback(err, results);
            });
            callback(err, result1);
        });
    });
};

//3计算各项得分，以及总分，写入数据库
User.countAutoscore = function countAutoscore(user_id, year, courseid, callback) {
    pool.getConnection(function (err, connection) {
        var useDbSql = "USE " + DB_NAME;
        connection.query(useDbSql, function (err) { //使用回调函数的参数connection来查询数据库
            if (err) {
                console.log("USE Error: " + err.message);
                return;
            }
            console.log('USE succeed');
        });
        var countAutoscore_Sql = "select * from score where user_id=? and year=? and courseid=?";
        connection.query(countAutoscore_Sql, [user_id, year,courseid], function (err, result) {
            if (err) {
                console.log("in ordertime table -- countAutoscore_Sql Error: " + err.message);
            }
            var autoscore = result[0].orderscore + result[0].timescore + result[0].timespanscore + result[0].operationScore + result[0].dataScore;
            var insertautoscore_Sql = "UPDATE experiment SET autoscore=? where user_id=? and year = ? and courseid= ? ";
            connection.query(insertautoscore_Sql, [autoscore, user_id, year, courseid], function (err, results) {
                if (err) {
                    console.log("change_Sql Error: " + err.message);
                }
                if (!connection.isRelease) {
                    connection.release();
                }
                console.log("invoked[insertautoscore]");
                console.log(results);
                //callback(err, results);
            });
            callback(err, result);
        });
    });
};

//最小二乘法函数
function LeastSquare(x, y) {
    var t1 = 0;
    var t2 = 0;
    var t3 = 0;
    var t4 = 0;
    for (var i = 0; i < x.length; i++) {
        console.log(x[i]);
        t1 += x[i] * x[i];
        t2 += Number(x[i]);
        t3 += x[i] * y[i];
        t4 += Number(y[i]);
    }
    a = (t3 * (x.length) - t2 * t4) / (t1 * (x.length) - t2 * t2);
    b = (t1 * t4 - t2 * t3) / (t1 * x.length - t2 * t2);
    return a+ ";" + b;
}

//求平均值的函数
function average(x) {
    var count = 0;
    for (var i = 0; i < x.length; i++) {
        count = count + Number(x[i]);
    }
    var x_average = (count / (x.length)).toFixed(4);
    return x_average;
}