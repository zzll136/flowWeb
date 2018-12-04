//管理员界面查看预约情况的路由文件
var express = require('express'),
    router = express.Router(),
    Apply = require('../models/apply.js'),
    OrderTime = require('../models/ordertime.js');
var year = 0;//0表示默认值，页面默认显示最早实验批次的情况
//定义网站主页的路由
router.get('/', function (req, res) {

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
    if (req.query != null) {
        if (req.query.year != null)
            year = req.query.year;
    }
    try {
        Apply.getOpenYear(function (err, yearList) {
            if (err) console.log('getOpenYear err:' + err);
            Apply.getTimeByYear(year, function (err, result) {
                if (err) console.log('getTime err:' + err);
                console.log('result的值', result);
                var monthArray = [];
                var timeArray = [];

                if (result.length) {
                    var str = result[0].expTime_char;
                    var time = str.split(",");
                    time.splice(time.length - 1, 1);

                    var startMonth = Number(result[0].startMonth);
                    var endMonth = Number(result[0].endMonth);
                    if (endMonth < startMonth) endMonth = endMonth + 12;
                    for (var i = startMonth; i <= endMonth; i++) {
                        if (i <= 12) monthArray.push(i);
                        else monthArray.push(i - 12);
                    }
                    if (req.query != null) {
                        if (req.query.month != null && req.query.month != -1)
                            month = req.query.month;
                        else month = monthArray[0];
                    }
                    for (var i = 0; i < time.length; i++) {
                        var timemon = time[i].substring(5, 7);
                        if (Number(timemon) == month)
                            timeArray.push(time[i]);
                    }
                }
                var timeFull = {};
                Apply.getdeviceNum(function (err, result1) {
                    if (err) console.log('getTime err:' + err);
                    // deviceNum = result1[0].num;
                    deviceNum = 5;//此处设计为，默认有5台机子供用户预约。
                    OrderTime.getOrderFull(function (err, result) {
                        if (err) console.log('getorder err:' + err);
                        var timefull = [];
                        for (var i = 0; i < timeArray.length; i++) {
                            for (var j = 0; j < result.length; j++) {
                                if (timeArray[i] == result[j].experdate) {
                                    if (result[j].num >= deviceNum * 8)
                                        timefull[i] = 1;
                                }
                            }
                        }
                        return res.render('new_orderMessage', { title: '实验预约信息', timeArray: timeArray, timeFull: timefull, monthArray: monthArray, deviceNum: deviceNum, year: yearList });
                    });
                });
            });
        });
    }
    catch (e) {
        console.log("获取预约信息 getOrderFull err");
        return res.end('页面加载异常');
    }
});
router.post('/orderTime', function (req, res) {
    var date = req.body.date;
    try {
        OrderTime.getOrder(date, function (err, result) {
            if (err) console.log('getOrder err:' + err);
            res.send(result);
        });
    }
    catch (e) {
        console.log("获取预约信息getOrder err");
        return res.end('页面加载异常');
    }
});
router.post('/getDetails', function (req, res) {
    var expertime = req.body.time;
    var experdate = req.body.date;
    try {
        OrderTime.new_getOrderdetails(experdate, expertime, function (err, result) {
            if (err) console.log('new_getOrderdetails err:' + err);
            res.send(result);
        });
    }
    catch (e) {
        console.log("获取预约详情 new_getOrderdetails err");
        return res.end('页面加载异常');
    }
});

module.exports = router;