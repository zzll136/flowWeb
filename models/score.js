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
                if ((ordertimes[1] + ordertimes[2]) > 9) timescore = 10 - (ordertimes[1] + ordertimes[2] - 9) * 2;
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
                timespan = getTimeSpanscore(result1[0].startTime, result1[0].endTime)[0];
                timespanscore = getTimeSpanscore(result1[0].startTime, result1[0].endTime)[1];
            }
            if (result1[0].explog) {
                operationScore = getOperationscore(result1[0].explog)[0];
                explog_record = getOperationscore(result1[0].explog)[1];
            }
            if (result1[0].repData) {
                if (courseid == 0 || courseid == 1) {
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
                    for (var j = 0; j < freq.length; j++) {
                        for (var i = 4; i < repdataArray.length; i=i+4) {
                            if (repdataArray[i + 1] == freq[j]) {
                                var data = repdataArray[i];
                                var ge=Number(data.substring(1, 2));
                                var shi=Number(data.substring(0, 1));
                                var miao=Number(data.substring(data.length - 2, data.length));
                                repdataArray[i] = (shi*10+ge)*60+miao;
                                time.push(repdataArray[i]);
                                repdataArray[i + 2] = Number(repdataArray[i + 2]) * 3.6;
                                weight.push(repdataArray[i + 2]);
                                VortexFlow.push(repdataArray[i + 3]);
                            }
                        }
                        // var parameter = LeastSquare1(time, weight);
                        if(time.length && weight.length){
                        var parameter = LeastSquare2(time, weight);
                        var parameterArray = parameter.split(";");
                        sys_a = Number(parameterArray[0]).toFixed(2);
                        sys_b = Number(parameterArray[1]).toFixed(2);
                        var k = average(VortexFlow);
                        if (Math.abs(sys_a - k) > 0.2) {
                            dataScore = dataScore - 5;
                            data_record = data_record + "变频器频率为" + freq[j] + "时,水体积_时间曲线为y="+sys_a+"*x+("+sys_b+"),数据误差太大;";
                        }
                        else if (Math.abs(sys_a - k) > 0.1) {
                            dataScore = dataScore - 2;
                            data_record = data_record + "变频器频率为" + freq[j] + "时，水体积_时间曲线为y="+sys_a+"*x+("+sys_b+")数据误差较大;";
                        }
                        else data_record = data_record + "变频器频率为" + freq[j] + "时，水体积_时间曲线为y="+sys_a+"*x+("+sys_b+")数据良好;";
                        time=[];
                        weight=[];
                        VortexFlow=[];
                    }}
                }
                if (courseid == 2) {
                    dataScore = 40;
                    var repdataArray = result1[0].repData.split(",");
                    var actualLevel = [];
                    var ultrasonicLevel = [];
                    // var freq = [];
                    // freq.push(repdataArray[5]);
                    // for (var i = 9; i < repdataArray.length; i = i + 4) {
                    //     if (repdataArray[i] != repdataArray[i - 4] && repdataArray[i] != 0)
                    //         freq.push(repdataArray[i]);
                    // }
                    // console.log(freq);
                    // for (var j = 0; j < freq.length; j++) {
                        for (var i = 4; i < repdataArray.length; i++) {
                            // if (repdataArray[i + 1] == freq[j]) {
                                actualLevel.push(repdataArray[i + 2]);
                                ultrasonicLevel.push(repdataArray[i + 3]);
                            // }
                        }
                        // var parameter = LeastSquare1(actualLevel, ultrasonicLevel);
                        if(actualLevel.length && ultrasonicLevel.length){
                        var parameter = LeastSquare2(actualLevel, ultrasonicLevel);
                        var parameterArray = parameter.split(";");
                        sys_a = Number(parameterArray[0]).toFixed(2);
                        sys_b = Number(parameterArray[1]).toFixed(2);
                        if (Math.abs(sys_a-1)>0.2) {
                            dataScore = dataScore - 5;
                            data_record = data_record + "变频器频率为" + freq[j] + "时，超声波液位_实际液位曲线为y="+sys_a+"*x+("+sys_b+"),数据误差太大;";
                        }
                        else if (Math.abs(sys_a-1)>0.1) {
                            dataScore = dataScore - 2;
                            data_record = data_record + "变频器频率为" + freq[j] + "时，超声波液位_实际液位曲线为y="+sys_a+"*x+("+sys_b+"),数据误差较大;";
                        }
                        else data_record = data_record + "变频器频率为" + freq[j] + "时，超声波液位_实际液位曲线为y="+sys_a+"*x+("+sys_b+"),数据良好;";}
                    // }
                }
                if (courseid == 3 || courseid == 4 || courseid == 5) {
                    dataScore = 40;
                    var repdataArray = result1[0].repData.split(",");
                    var actFlow = [];
                    var VortexFlow = [];
                    for (var i = 6; i < repdataArray.length; i = i + 4) {
                        actFlow.push(repdataArray[i]);
                        VortexFlow.push(repdataArray[i + 1]);
                    }
                    //最小二乘法
                    // var parameter = LeastSquare1(actFlow, VortexFlow);
                    if(actFlow.length && VortexFlow.length){
                    var parameter = LeastSquare2(actFlow, VortexFlow);
                    console.log("parameter的值" + parameter);
                    var parameterArray = parameter.split(";");
                    sys_a = parameterArray[0];
                    sys_a = Number(sys_a).toFixed(4);
                    sys_b = parameterArray[1];
                    sys_b = Number(sys_b).toFixed(4);
                    console.log("线性方程y=" + sys_a + "*x+" + sys_b);}
                    stu_a = result1[0].stu_a;
                    stu_b = result1[0].stu_b;
                    if(Math.abs(sys_a-1)>0.2){ dataScore -= 5;data_record += "由实验数据得到的校准曲线，斜率的误差值偏大;";}
                    if (stu_a && stu_b) {
                        if (Math.abs(sys_a - stu_a) <= 0.2 && Math.abs(sys_b - stu_b) <= 0.5) 
                        {data_record += "校准曲线方程为y=" + sys_a + "*x+" + sys_b + "，提交的参数基本正确;"; }
                        else if (Math.abs(sys_a - stu_a) <= 0.2 && Math.abs(sys_b - stu_b) > 2) { dataScore-=5; data_record += "参数误差较大，可重新提交;"; }
                        else if (Math.abs(sys_a - stu_a) > 0.2 && Math.abs(sys_b - stu_b) <=2) { dataScore-=5; data_record += "参数误差较大，可重新提交;"; }
                        else { dataScore -=10; data_record = "参数误差太大，请重新提交;"; }
                    }
                    else {dataScore=0;data_record += "未填写校准曲线方程参数;";}
                }
                if (courseid == 6 || courseid == 7) {
                    dataScore=40;
                    var repdataArray = result1[0].repData.split(",");
                    var VortexFlow = [];
                    var actFlow = [];
                    var error=0;
                    for (var i = 6; i < repdataArray.length; i = i + 4) {
                        error+=Math.abs(Number(repdataArray[i])-Number(repdataArray[i + 1]));
                        // actFlow.push(repdataArray[i]);
                        // VortexFlow.push(repdataArray[i + 1]);
                    }
                    data_record+="二次仪表计算值与标准值的平均误差为"+error+";";
                    error=(error/repdataArray.length)/toFixed(4);
                    if (error<0.1) {
                        data_record = data_record + "平均误差很小;";
                    }
                    else if (error<0.9) {
                        dataScore = (-50 * error + 45).toFixed(0);
                        data_record = data_record + "平均误差较大;";
                    }
                    else {
                        dataScore=0;
                        data_record = data_record + "平均误差极大，请重新实验;";
                    }
                }
                if (courseid == 8) {
                    dataScore=40;
                    var repdataArray = result1[0].repData.split(",");
                    var actLevel = [];
                    var ultrasonicLevel = [];
                    for (var i = 6; i < repdataArray.length; i = i + 4) {
                        actLevel.push(repdataArray[i]);
                        ultrasonicLevel.push(repdataArray[i + 1]);
                    }
                    //最小二乘法
                    // var parameter = LeastSquare1(actFlow, VortexFlow);
                    if(actLevel.length && ultrasonicLevel.length){
                    var parameter = LeastSquare2(actLevel, ultrasonicLevel);
                    var parameterArray = parameter.split(";");
                    sys_a = Number(parameterArray[0]).toFixed(4);
                    sys_b = Number(parameterArray[1]).toFixed(4);
                    data_record = "线性方程为y=" + sys_a + "*x+" + sys_b;
                    var error=Math.abs(sys_a-1.0);
                    if (error<=0.1) {
                        data_record = data_record + "数据曲线的线性良好;";
                    }
                    else if (error < 0.9) {
                        dataScore = (-50 * sys_a + 45).toFixed(0);
                        data_record = data_record + "数据曲线的线性较差;";
                    }
                    else {
                        dataScore = 0;
                        data_record = data_record + "数据曲线的线性极差;";
                    }
                }
            }
            }
            if (dataScore < 0) dataScore = 0;
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
            });
            callback(err, result1);
        });
    });
};

//3计算自动评分的值，并从数据库获取老师的评分，然后计算最终得分，写入数据库
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
        connection.query(countAutoscore_Sql, [user_id, year, courseid], function (err, result) {
            if (err) {
                console.log("in score table -- countAutoscore_Sql Error: " + err.message);
            }
            var autoscore = result[0].orderscore + result[0].timescore + result[0].timespanscore + result[0].operationScore + result[0].dataScore;
            var getTeascore_sql = "select teascore from experiment where user_id=? and courseid=? and year=?";
            connection.query(getTeascore_sql, [user_id, courseid, year], function (err, result1) {
                if (err) {
                    console.log("getTeascore_sql Error: " + err.message);
                }
                var score = autoscore * 0.5 + result1[0].teascore * 0.5;
                var insertautoscore_Sql = "UPDATE experiment SET autoscore=?,score=? where user_id=? and year = ? and courseid= ? ";
                connection.query(insertautoscore_Sql, [autoscore, score, user_id, year, courseid], function (err, results) {
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
            });
            callback(err, result);
        });
    });
};

//最小二乘法函数
function LeastSquare1(x, y) {
    var t1 = 0;
    var t2 = 0;
    var t3 = 0;
    var t4 = 0;
    for (var i = 0; i < x.length; i++) {
        t1 += x[i] * x[i];
        t2 += Number(x[i]); //x的多项和
        t3 += x[i] * y[i];
        t4 += Number(y[i]);//y的多项和
    }
    a = (t3 * (x.length) - t2 * t4) / (t1 * (x.length) - t2 * t2);
    b = (t1 * t4 - t2 * t3) / (t1 * x.length - t2 * t2);
    return a + ";" + b;
}

//最小二乘法函数
function LeastSquare2(x, y) {
    var xsum = 0;
    var ysum = 0;
    for (var i = 0; i < x.length; i++) {
        xsum += Number(x[i]); //x的多项和
        ysum += Number(y[i]);//y的多项和
    }
    var xmean=xsum/x.length;//x的平均数
    var ymean=ysum/x.length;//y的平均数
    var num=0;//多项式和【(x-x的均值)*(y-y的均值)】
    var den=0;//多项式和【(x-x的均值)*(x-x的均值)】
    for(var i=0;i<x.length;i++){
        var x=Number(x[i]);
        var y=Number(y[i]);
        num+=(x-xmean)*(y-ymean);
        den+=(x-xmean)*(x-xmean);
    }
    a=num/den;//y=ax+b 的 系数a
    b=ymean-a*xmean;//y=ax+b 的 系数b
    return a + ";" + b;
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
//计算实验时长的得分
function getTimeSpanscore(start, end) {
    var result = [];
    var startTime = start.substring(14, 16);
    var endTime = end.substring(14, 16);
    var timespan = endTime - startTime;
    if (timespan < 20) timespanscore = 10;
    else timespanscore = 30 - timespan;
    if (timespanscore < 0) timespanscore = 0;
    result.push(timespan);
    result.push(timespanscore);
    return result;
}
//计算实验操作的得分
function getOperationscore(explog) {
    var result = [];
    var operationScore = 30;
    var explog_record = "";
    var explogArray = explog.split(">");
    for (var i = 0; i < explogArray.length; i++) {
        var obj = explogArray[i].indexOf("<");
        explogArray[i] = explogArray[i].substring(obj + 1, explogArray[i].length);
    }
    var resetTime=0;
    // console.log("该次实验的实验操作数组" + explogArray);
    for (var i = 0; i < explogArray.length; i++) {
        if (explogArray[i] == "打开侧阀") {
            operationScore = operationScore - 1;
            explog_record = explog_record + "实验中打开侧阀;"
        }
        if (explogArray[i] == "重置实验") {
            resetTime++;
            // operationScore = operationScore - 1;
            // explog_record = explog_record + "重置实验一次;"
        }
        if(resetTime>1) 
        {operationScore = operationScore+1 - resetTime;
        explog_record = explog_record + "重置实验"+resetTime+"次;";}
        if (explogArray[i].indexOf("开启变频器")!=-1) {
            var j = i;
            for (var m = 0; m < j; m++) {
                var sw1Status = true;//初始状态进水阀是打开的.此时判断最后一次操作是打开进水阀即可？
                if (explogArray[m] == "关闭进水阀") sw1Status=false;
                else if (explogArray[m] == "打开进水阀") sw1Status=true;
            }
            if (!sw1Status) {
                operationScore = operationScore - 2;
                explog_record = explog_record + "打开电机时,进水阀未打开;"
            }
        }

        if (explogArray[i]=="关闭进水阀") {
            var j = i;
            for (var m = 0; m < j; m++) {
                var sw4Status = true;//变频器默认情况下是打开的
                if (explogArray[m] == "关闭变频器") sw4Status=false;
                else if (explogArray[m].indexOf("开启变频器")!=-1) sw4Status=true;
            }
            if (!sw4Status) {
                operationScore = operationScore - 2;
                explog_record = explog_record + "关闭进水阀时，电机未关闭;"
            }
        }
    }
    if (operationScore < 0) operationScore = 0;
    result.push(operationScore);
    result.push(explog_record);
    return result;
}
