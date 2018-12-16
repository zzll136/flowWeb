//实验界面的所有路由处理
var express = require('express'),
    router = express.Router(),
    Exp = require('../models/experiment.js'),
    OrderTime = require('../models/ordertime.js'),
    Apply = require('../models/apply.js'),
    Info = require('../models/info.js'),
    IHuyi = require("ihuyi106");

//------------------------从在线实验进入实验页面的逻辑处理------------------------------
router.get('/0', function (req, res) {
    if (req.cookies.islogin) {
        console.log('cookies:' + req.cookies.islogin);
        req.session.username = req.cookies.islogin;
    }
    if (req.session.username) {
        console.log('session:' + req.session.username);
        res.locals.username = req.session.username;
    }
    if (req.session.userrole) {
        console.log('role:' + req.session.userrole);
        res.locals.userrole = req.session.userrole;
    }
    else {
        res.locals.userrole = "none";
    }
    res.render('exp/exper0', { title: '远程流量/液位检测实验' });
});

router.get('/1', function (req, res) {
    if (req.cookies.islogin) {
        console.log('cookies:' + req.cookies.islogin);
        req.session.username = req.cookies.islogin;
    }

    if (req.session.username) {
        console.log('session:' + req.session.username);
        res.locals.username = req.session.username;
    }
    if (req.session.userrole) {
        console.log('role:' + req.session.userrole);
        res.locals.userrole = req.session.userrole;
    }
    else {
        res.redirect('/');
        return;
    }
    res.render('exp/exper1', { title: '基于网页的远程流量液位控制' });
});

router.get('/2', function (req, res) {
    if (req.cookies.islogin) {
        console.log('cookies:' + req.cookies.islogin);
        req.session.username = req.cookies.islogin;
    }

    if (req.session.username) {
        console.log('session:' + req.session.username);
        res.locals.username = req.session.username;
    }
    if (req.session.userrole) {
        console.log('role:' + req.session.userrole);
        res.locals.userrole = req.session.userrole;
    }
    else {
        res.redirect('/');
        return;
    }
    res.render('exp/exper2', { title: '基于网页的远程流量液位控制' });
});

router.get('/3', function (req, res) {
    if (req.cookies.islogin) {
        console.log('cookies:' + req.cookies.islogin);
        req.session.username = req.cookies.islogin;
    }

    if (req.session.username) {
        console.log('session:' + req.session.username);
        res.locals.username = req.session.username;
    }
    if (req.session.userrole) {
        console.log('role:' + req.session.userrole);
        res.locals.userrole = req.session.userrole;
    }
    else {
        res.locals.userrole = "none";
        // res.redirect('/');
        // return;
    }
    res.render('exp/exper3', { title: '基于网页的远程流量液位控制' });
});

router.get('/4', function (req, res) {
    if (req.cookies.islogin) {
        console.log('cookies:' + req.cookies.islogin);
        req.session.username = req.cookies.islogin;
    }

    if (req.session.username) {
        console.log('session:' + req.session.username);
        res.locals.username = req.session.username;
    }
    if (req.session.userrole) {
        console.log('role:' + req.session.userrole);
        res.locals.userrole = req.session.userrole;
    }
    else {
        res.locals.userrole = "none";
        // res.redirect('/');
        // return;
    }
    res.render('exp/exper4', { title: '基于网页的远程流量液位控制' });
});

router.get('/5', function (req, res) {
    if (req.cookies.islogin) {
        console.log('cookies:' + req.cookies.islogin);
        req.session.username = req.cookies.islogin;
    }

    if (req.session.username) {
        console.log('session:' + req.session.username);
        res.locals.username = req.session.username;
    }
    if (req.session.userrole) {
        console.log('role:' + req.session.userrole);
        res.locals.userrole = req.session.userrole;
    }
    else {
        res.redirect('/');
        return;
    }
    res.render('exp/exper5', { title: '基于网页的远程流量液位控制' });
});

// 涡街流量计设计实验
router.get('/6', function (req, res) {
    if (req.cookies.islogin) {
        console.log('cookies:' + req.cookies.islogin);
        req.session.username = req.cookies.islogin;
    }

    if (req.session.username) {
        console.log('session:' + req.session.username);
        res.locals.username = req.session.username;
    }
    if (req.session.userrole) {
        console.log('role:' + req.session.userrole);
        res.locals.userrole = req.session.userrole;
    }
    else {
        res.redirect('/');
        return;
    }
    res.render('exp/exper6', { title: '基于网页的远程流量液位控制' });
});

// 超声波流量计设计实验
router.get('/7', function (req, res) {
    if (req.cookies.islogin) {
        console.log('cookies:' + req.cookies.islogin);
        req.session.username = req.cookies.islogin;
    }

    if (req.session.username) {
        console.log('session:' + req.session.username);
        res.locals.username = req.session.username;
    }
    if (req.session.userrole) {
        console.log('role:' + req.session.userrole);
        res.locals.userrole = req.session.userrole;
    }
    else {
        res.redirect('/');
        return;
    }
    res.render('exp/exper7', { title: '基于网页的远程流量液位控制' });
});
//  超声波液位计设计实验
router.get('/8', function (req, res) {
    if (req.cookies.islogin) {
        console.log('cookies:' + req.cookies.islogin);
        req.session.username = req.cookies.islogin;
    }

    if (req.session.username) {
        console.log('session:' + req.session.username);
        res.locals.username = req.session.username;
    }
    if (req.session.userrole) {
        console.log('role:' + req.session.userrole);
        res.locals.userrole = req.session.userrole;
    }
    else {
        res.locals.userrole = "none";
        // res.redirect('/');
        // return;
    }
    res.render('exp/exper8', { title: '基于网页的远程流量液位控制' });
});


//------------------------提交实验数据，日志的逻辑处理------------------------------
router.post('/0', function (req, res) {
    var courseid = 0;
    var log = req.body.log;
    var expdata = req.body.expdata;
    var tableid = req.body.tableid;
    var year = req.body.year;
    var code;
    // var a = log.charAt("<");
    // var a = log.charAt("<");
    // var a = log.indexOf("<");
    // var startTime1 = log.substring(0, a);
    var startTime = log.substring(27,46);
    var endTime = new Date();
    var status = 1;
    try {
        if (req.session.userrole == "s") {
            Exp.setCourseRecord(req.session.user_id, year, courseid, log, expdata, tableid, startTime, endTime, code,function (err, results) {
                if (err) console.log('setCourseRecord err:' + err);
                    Exp.setUserCourseLog(req.session.user_id, year, courseid, log, expdata, status, startTime, endTime,code, function (err, result) {
                        if (err) console.log('setUserCourseLog err:' + err);
                        res.send(result);
                    });
            });
        }
        else res.send("none");
    }
    catch (e) {
        console.log("上传实验数据setUserCourseLog err");
        return res.end('提交异常');
    }
});

router.post('/1', function (req, res) {
    var courseid = 1;
    log = req.body.log;
    var expdata = req.body.expdata;
    var tableid = req.body.tableid;
    var year = req.body.year;
    var code;
    var startTime = log.substring(27,46);
    var endTime = new Date();
    var status = 1;
    try {
        if (req.session.userrole == "s") {
            Exp.setCourseRecord(req.session.user_id, year, courseid, log, expdata, tableid, startTime, endTime,code, function (err, results) {
                if (err) console.log('setCourseRecord err:' + err);
                    Exp.setUserCourseLog(req.session.user_id, year, courseid, log, expdata, status, startTime, endTime,code, function (err, result) {
                        if (err) console.log('setUserCourseLog err:' + err);
                        res.send(result);
                    });
            });
        }
        else res.send("none");
    }
    catch (e) {
        console.log("上传实验数据setUserCourseLog err");
        return res.end('提交异常');
    }
});

router.post('/2', function (req, res) {
    var courseid = 2;
    var log = req.body.log;
    var expdata = req.body.expdata;
    var tableid = req.body.tableid;
    var code;
    var year = req.body.year;
    var startTime = log.substring(27,46);
    var endTime = new Date();
    var status = 1;
    try {
        if (req.session.userrole == "s") {
            Exp.setCourseRecord(req.session.user_id, year, courseid, log, expdata, tableid, startTime, endTime,code, function (err, results) {
                if (err) console.log('setCourseRecord err:' + err);
                    Exp.setUserCourseLog(req.session.user_id, year, courseid, log, expdata, status, startTime, endTime, code,function (err, result) {
                        if (err) console.log('setUserCourseLog err:' + err);
                        res.send(result);
                    });
            });
        }
        else res.send("none");
    }
    catch (e) {
        console.log("上传实验数据setUserCourseLog err");
        return res.end('提交异常');
    }
});

router.post('/3', function (req, res) {
    var courseid = 3;
    var log = req.body.log;
    var expdata = req.body.expdata;
    var tableid = req.body.tableid;
    var code;
    var year = req.body.year;
    var startTime = log.substring(27,46);
    var endTime = new Date();
    var status = 1;
    try {
        if (req.session.userrole == "s") {
            Exp.setCourseRecord(req.session.user_id, year, courseid, log, expdata, tableid, startTime, endTime,code, function (err, results) {
                if (err) console.log('setCourseRecord err:' + err);
                    Exp.setUserCourseLog(req.session.user_id, year, courseid, log, expdata, status, startTime, endTime,code, function (err, result) {
                        if (err) console.log('setUserCourseLog err:' + err);
                        res.send(result);
                    });
            });
        }
        else res.send("none");
    }
    catch (e) {
        console.log("上传实验数据setUserCourseLog err");
        return res.end('提交异常');
    }
});

router.post('/4', function (req, res) {
    var courseid = 4;
    var log = req.body.log;
    var expdata = req.body.expdata;
    var tableid = req.body.tableid;
    var code;
    var year = req.body.year;
    var startTime = log.substring(27,46);
    var endTime = new Date();
    var status = 1;
    try {
        if (req.session.userrole == "s") {
            Exp.setCourseRecord(req.session.user_id, year, courseid, log, expdata, tableid, startTime, endTime, code,function (err, results) {
                if (err) console.log('setCourseRecord err:' + err);
                    Exp.setUserCourseLog(req.session.user_id, year, courseid, log, expdata, status, startTime, endTime,code, function (err, result) {
                        if (err) console.log('setUserCourseLog err:' + err);
                        res.send(result);
                    });
            });
        }
        else res.send("none");
    }
    catch (e) {
        console.log("上传实验数据setUserCourseLog err");
        return res.end('提交异常');
    }
});

router.post('/5', function (req, res) {
    var courseid = 5;
    var log = req.body.log;
    var expdata = req.body.expdata;
    var code;
    var tableid = req.body.tableid;
    var year = req.body.year;
    var startTime = log.substring(27,46);
    var endTime = new Date();
    var status = 1;
    try {
        if (req.session.userrole == "s") {
            Exp.setCourseRecord(req.session.user_id, year, courseid, log, expdata, tableid, startTime, endTime,code, function (err, results) {
                if (err) console.log('setCourseRecord err:' + err);
                    Exp.setUserCourseLog(req.session.user_id, year, courseid, log, expdata, status, startTime, endTime,code, function (err, result) {
                        if (err) console.log('setUserCourseLog err:' + err);
                        res.send(result);
                    });
            });
        }
        else res.send("none");
    }
    catch (e) {
        console.log("上传实验数据setUserCourseLog err");
        return res.end('提交异常');
    }
});

router.post('/6', function (req, res) {
    var courseid = 6;
    var log = req.body.log;
    var expdata = req.body.expdata;
    var tableid = req.body.tableid;
    var code = decodeURIComponent(req.body.code);
    var year = req.body.year;
    var startTime = log.substring(27,46);
    var endTime = new Date();
    var status = 1;
    try {
        if (req.session.userrole == "s") {
            Exp.setCourseRecord(req.session.user_id, year, courseid, log, expdata, tableid, startTime, endTime, code,function (err, results) {
                if (err) console.log('setCourseRecord err:' + err);
                    Exp.setUserCourseLog(req.session.user_id, year, courseid, log, expdata, status, startTime, endTime,code, function (err, result) {
                        if (err) console.log('setUserCourseLog err:' + err);
                        res.send(result);
                    });
            });
        }
        else res.send("none");
    }
    catch (e) {
        console.log("上传实验数据setUserCourseLog err");
        return res.end('提交异常');
    }
});

router.post('/7', function (req, res) {
    var courseid = 7;
    var log = req.body.log;
    var tableid = req.body.tableid;
    var expdata = req.body.expdata;
    var code = decodeURIComponent(req.body.code);
    var year = req.body.year;
    var startTime = log.substring(27,46);
    var endTime = new Date();
    var status = 1;
    try {
        if (req.session.userrole == "s") {
            Exp.setCourseRecord(req.session.user_id, year, courseid, log, expdata, tableid, startTime, endTime, code,function (err, results) {
                if (err) console.log('setCourseRecord err:' + err);
                    Exp.setUserCourseLog(req.session.user_id, year, courseid, log, expdata, status, startTime, endTime, code,function (err, result) {
                        if (err) console.log('setUserCourseLog err:' + err);
                        res.send(result);
                    });
            });
        }
        else res.send("none");
    }
    catch (e) {
        console.log("上传实验数据setUserCourseLog err");
        return res.end('提交异常');
    }
});

router.post('/8', function (req, res) {
    var courseid = 8;
    var log = req.body.log;
    var tableid = req.body.tableid;
    var expdata = req.body.expdata;
    var code = decodeURIComponent(req.body.code);
    var year = req.body.year;
    var startTime = log.substring(27,46);
    var endTime = new Date();
    var status = 1;
    try {
        if (req.session.userrole == "s") {
            Exp.setCourseRecord(req.session.user_id, year, courseid, log, expdata, tableid, startTime, endTime, code,function (err, results) {
                if (err) console.log('setCourseRecord err:' + err);
                    Exp.setUserCourseLog(req.session.user_id, year, courseid, log, expdata, status, startTime, endTime, code,function (err, result) {
                        if (err) console.log('setUserCourseLog err:' + err);
                        res.send(result);
                    });
            });
        }
        else res.send("none");
    }
    catch (e) {
        console.log("上传实验数据setUserCourseLog err");
        return res.end('提交异常');
    }
});

//-------------------------------上传的代码处理-----------------------
var scriptText6 = null, scriptText7 = null, scriptText8 = null;

//敏感标签检测
function matchMaliciousCode(code) {
    var contain = 0;
    if (code.match("parent")) contain = 1;
    if (code.match("ajax")) contain = 1;
    if (code.match("activex")) contain = 1;
    if (code.match("submit")) contain = 1;
    if (code.match("document")) contain = 1;
    if (code.match("alert")) contain = 1;
    return contain;
}

//将提交的实验代码上传
router.post('/updateScript6', function (req, res) {
    console.log(req.body.code);
    scriptText6 = decodeURIComponent(req.body.code);
    if (matchMaliciousCode(scriptText6) == 1) {
        res.send("error");
        return;
    }
    else {
        res.send("received");
        return;
    }
});

router.get('/instrumentScript6', function (req, res) {
    if (matchMaliciousCode(scriptText6) == 1) { return; }
    else {
        res.locals.scriptText = scriptText6;
        res.render('scriptTemplate/6');
    }
});

router.post('/updateScript7', function (req, res) {
    console.log(req.body.code);
    scriptText7 = decodeURIComponent(req.body.code);
    if (matchMaliciousCode(scriptText7) == 1) {
        res.send("error");
        return;
    }
    else {
        res.send("received");
        return;
    }
});

router.get('/instrumentScript7', function (req, res) {
    if (matchMaliciousCode(scriptText7) == 1) { return; }
    else {
        res.locals.scriptText = scriptText7;
        res.render('scriptTemplate/7');
    }
});

//更新二次仪表程序脚本
router.post('/updateScript8', function (req, res) {
    console.log('代码显示', req.body.code);
    scriptText8 = decodeURIComponent(req.body.code);
    console.log('script8-----------', scriptText8);
    if (matchMaliciousCode(scriptText8) == 1) {
        res.send("error");
        return;
    }
    else {
        res.send("received");
        return;
    }
});

//浏览器请求虚拟仪器脚本
router.get('/instrumentScript8', function (req, res) {
    if (matchMaliciousCode(scriptText8) == 1) { return; }
    else {
        res.locals.scriptText = scriptText8;
        console.log('script8-----------', scriptText8);
        res.render('scriptTemplate/8');
    }
});

//代码重置处理，暂时未用，需要测试
router.post('/codeReset', function (req, res) {
    var codeid = req.body.codeid;
    switch (codeid) {
        case "6": scriptText6 = null;
            break;
        case "7": scriptText7 = null;
            break;
        case "8": scriptText8 = null;
            break;
    }
});

//------------------------点击开始实验后的逻辑处理------------------------------
//判断用户是否预约了该时间段，以及取出预约的实验批次批次
router.post('/judgeOrder', function (req, res) {
    var date = req.body.t;
    var time = req.body.h;
    try {
        OrderTime.newgetExpOrder(req.session.user_id, date, time, function (err, result) {
            if (err) console.log('newgetExpOrder err:' + err);
            res.send(result[0]);
        });
    }
    catch (e) {
        console.log("检查预约情况newgetExpOrder err");
        return res.end('获取数据异常');
    }
});
var year;
//看学生课程信息，看是否已经完成实验
router.post('/courseInfo', function (req, res) {
    year = req.body.orderYear;
    try {
        if (req.session.userrole == "s") {
            Exp.getCourseStatusbyYear(req.session.user_id, year, function (err, result) {
                if (result == '') return;
                if (err) console.log('getCourseStatusbyYear err:' + err);
                console.log('result的值', result);
                res.send(result);
            });
        }
        else res.send("none");
    }
    catch (e) {
        console.log("检查实验完成情况getCourseStatusbyYear err");
        return res.end('获取数据异常');
    }
});

//预约过实验，分配桌子，并查看是否临时故障
router.post('/tableMatch', function (req, res) {
    var courseid = req.body.courseid;
    var min = req.body.min;
    var date = req.body.t;
    var time = req.body.h;
    switch (req.session.userrole) {
        case 's': var usertype = "学生"; break;
        case 't': var usertype = ""; break;
    }
    try {
        Apply.newdistributionTable(req.session.user_id, req.session.userrole, year, courseid, min, date, time, function (err, result) {
            if (err) console.log('distributionTable err:' + err);
            console.log(result);
            if (result == 7) {
                Info.getManagerPhone(function (err, result) {
                    if (err) console.log('getManagerPhone err:' + err);
                    var mobile = result[0].phonenumber;
                    var account = "C80672390";
                    var password = "e2b28581429c3efccb4141fcf0916467";
                    var content = "当前有实验桌临时故障，请及时查看。";
                    var iHuyi = new IHuyi(account, password);
                    // iHuyi.send(mobile, content, function (err, smsId) {
                    //     if (err) {
                    //         console.log(err.message);
                    //     } else {
                    //         console.log("SMS sent, and smsId is " + smsId);
                    //     }
                    // });
                });
            }
            res.send(result + "");
        });
    }
    catch (e) {
        console.log("分配桌子和通知管理员newdistributionTable getManagerPhone err");
        return res.end('获取数据异常');
    }
});

//管理员实验时，将选取的实验桌的状态设置一下
router.post('/setstatus', function (req, res) {
    var tableid = req.body.tableid;
    try {
        Apply.setTablestatus(tableid, function (err, result) {
            if (err)
                console.log('setTablestatus err:' + err);
            res.send(result[0].status + "");
            return;
        });
    }
    catch (e) {
        console.log("设置选取的实验桌状态setTablestatus err");
        return res.end('获取数据异常');
    }
});

//实验结束，释放桌子状态
router.post('/tableFree', function (req, res) {
    var tableid = req.body.tableid;
    try {
        Apply.setTableFree(tableid, function (err, result) {
            if (err) console.log('setTableFree err:' + err);
            res.send('finished');
            return;
        });
    }
    catch (e) {
        console.log("释放实验桌状态setTableFree err");
        return res.end('获取数据异常');
    }
});

//------------------------实验页面刷新时的逻辑处理-----------------------------
//管理员需要获取当前可用的实验桌数量
router.get('/getstatus', function (req, res) {
    try {
        Apply.getTablestatus(function (err, result) {
            if (err) console.log('getTablestatus err:' + err);
            res.send(result);
            return;
        });
    }
    catch (e) {
        console.log("获取实验桌状态getTablestatus err");
        return res.end('获取数据异常');
    }
});

//------------------------弃用的部分------------------------------
// 结束实验,将实验过程记录写入数据库
// router.post('/finish', function (req, res) {
//     console.log(req.body.log);
//     Exp.setUserCourseLog(req.session.username, 1, req.body.log);
//     res.send('finished!');
//     return;
// });


// router.post('/tableinsert', function (req, res) {
//     var tableid = req.body.tableid;
//     Exp.insertTable(tableid, function (err, result) {
//         if (err) console.log('distributionTable err:' + err);
//         console.log(result);
//         res.send("finished");
//     });
// });



module.exports = router;