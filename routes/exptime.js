
//管理员添加实验时间的界面
var express = require('express'),
    router = express.Router(),
    Apply = require('../models/apply.js');

//定义网站主页的路由
router.get('/', function (req, res) {

    if (!(req.session.userrole === 'm')) {
        res.redirect('/');
        res.render('index', { title: '主页' });
    }
    console.log("the role:", req.session.userrole);

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
    try{
    Apply.getopenTimeMessage(function (err, result) {
        if (err) console.log('getopenTimeMessage err:' + err);
        console.log('result的值', result);
        for (var i = 0; i < result.length; i++) {
            if (result[i].expTime) {
                var exp = result[i].expTime;
                exp = exp.replace(/1/, "周一");
                exp = exp.replace(/2/, "周二");
                exp = exp.replace(/3/, "周三");
                exp = exp.replace(/4/, "周四");
                exp = exp.replace(/5/, "周五");
                exp = exp.replace(/6/, "周六");
                exp = exp.replace(/0/, "周天");
                result[i].expTime = exp;
            }
            if (result[i].repTime) {
                var rep = result[i].repTime;
                rep = rep.replace(/1/, "周一");
                rep = rep.replace(/2/, "周二");
                rep = rep.replace(/3/, "周三");
                rep = rep.replace(/4/, "周四");
                rep = rep.replace(/5/, "周五");
                rep = rep.replace(/6/, "周六");
                rep = rep.replace(/0/, "周天");
                result[i].repTime = rep;
            }
        }
        res.render('exptime', { title: '设置实验时间', result: result });
    });}
    catch(e){
        console.log("获取实验开放时间页面getopenTimeMessage err");
        return res.end('获取数据异常');
    }
});
router.post('/subTime', function (req, res) {
    var startDate = req.body.startDate;
    var endDate = req.body.endDate;
    var expTimeStr = req.body.exptimeStr;
    var repTimeStr = req.body.reptimeStr;
    var expTimeJson = req.body.exptimeJson;
    var repTimeJson = req.body.reptimeJson;
    var expTime = JSON.parse(expTimeJson);
    var repTime = JSON.parse(repTimeJson);
    var yearPart = req.body.year;
    var date_all = [], i = 0;

   
    function getDate(datestr) {
        var temp = datestr.split("-");
        var date = new Date(temp[0], temp[1] - 1, temp[2]);
        console.log(date);
        return date;
    }

    var startTime = getDate(startDate);
    var endTime = getDate(endDate);
    var startMonth = startTime.getMonth() + 1;
    var endMonth = endTime.getMonth() + 1;
    while ((endTime.getTime() - startTime.getTime()) >= 0) {
        var year = startTime.getFullYear();
        var month = (startTime.getMonth() + 1).toString().length == 1 ? "0" + (startTime.getMonth() + 1).toString() : (startTime.getMonth() + 1).toString();
        var day = startTime.getDate().toString().length == 1 ? "0" + startTime.getDate() : startTime.getDate();
        date_all[i] = year + "-" + month + "-" + day;
        startTime.setDate(startTime.getDate() + 1);
        i += 1;
    }

    console.log(date_all);
    var expTime_char = "";
    var repTime_char = "";
    for (var i = 0; i < date_all.length; i++) {
        for (var j = 0; j < expTime.length; j++) {
            if (new Date(date_all[i]).getDay() == expTime[j])
                expTime_char = expTime_char + date_all[i] + ',';
        }
        for (var k = 0; k < repTime.length; k++) {
            if (new Date(date_all[i]).getDay() == repTime[k])
                repTime_char = repTime_char + date_all[i] + ',';
        }
    }
    try{
    Apply.subTime(yearPart, startDate, endDate, expTimeStr, repTimeStr, expTime_char, repTime_char, startMonth, endMonth, function (err, result) {
        if (err) console.log('subTime err:' + err);
        res.send('1');
    });}
    catch(e){
        console.log("上传实验时间subTime err");
        return res.end('提交异常');

    }
});

router.post('/getTime', function (req, res) {
    var year = req.body.year;
    try{
    Apply.getTimebyYear(year, function (err, result) {
        if (err) console.log('getTimebyYear err:' + err);
        res.send(result);
    });}
    catch(e){
        console.log("获取实验时间getTimebyYear err");
        return res.end('提交异常');
    }
});

router.post('/deleteTime', function (req, res) {
    var year = req.body.year;
    try{
    Apply.deleteTimebyYear(year, function (err, result) {
        if (err) console.log('deleteTimebyYear err:' + err);
        res.send("1");
    });}
    catch(e){
        console.log("删除实验时间deleteTimebyYear err");
        return res.end('提交异常');
    }
});
module.exports = router;