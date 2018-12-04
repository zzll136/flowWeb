//老师界面查看学生的成绩表

var express = require('express'),
    router = express.Router(),
    Exp = require('../models/experiment.js'),
    Apply = require('../models/apply.js');
//定义网站主页的路由
router.get('/', function (req, res) {
    if (!(req.session.userrole === 't')) {
        res.redirect('/');
        res.render('index', { title: "主页" });
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
    try {
        Apply.getOpenYear(function (err, year) {
            if (err) console.log('getOpenYear err:' + err);
            var yearStr;
            if (year.length)
                yearStr = year[0].year;
            Exp.getUserscorebyYear(req.session.school, yearStr, 1, function (err, result) {
                if (err) console.log('getUserscore err:' + err);
                if (!result.length) var count = 0;
                else count = result[0].count;
                res.render('scoreTable', { title: '学生成绩表', result: result, year: year, count: count });
            });
        });
    } catch (e) {
        console.log("查看学生成绩表getUserscorebyYear err");
        return res.end('页面加载异常');
    }
});

router.post('/getList', function (req, res) {
    var year = req.body.year;
    var page = 1;
    if (req.body.page) page = req.body.page;
    try {
        Exp.getUserscorebyYear(req.session.school, year, page, function (err, result) {
            if (err) console.log('getexpMessageByYear err:' + err);
            if (result.length) result[0].page = page;
            return res.send(result);
        });
    }
    catch (e) {
        console.log("获取成绩表名单 getUserscorebyYear err");
        return res.end('页面加载异常');
    }
});

router.post('/research', function (req, res) {
    var studentnumber = req.body.studentnumber;
    var year = req.body.year;
    console.log("学号：" + studentnumber);
    try {
        Exp.getscorebyUser(req.session.school, studentnumber, year, function (err, result) {
            if (err) console.log('getscorebyUser err:' + err);
            res.send(result);
        });
    }
    catch (e) {
        console.log("搜索学生成绩getscorebyUser err");
        return res.end('页面异常');
    }
});
module.exports = router;