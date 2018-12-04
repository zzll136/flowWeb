//老师页面查看学生的报告列表
var express = require('express'),
    router = express.Router(),
    Exp = require('../models/experiment.js'),
    Apply = require('../models/apply.js');
var courseid = -1;
router.get('/', function (req, res) {
    if (!(req.session.userrole === 't')) {
        res.redirect('/');
        res.render('index', { title: "主页" });
    }

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
        if (req.query.courseid != null)
            courseid = req.query.courseid;
    }
    try{    
        Apply.getOpenYear(function (err, year) {
        if (err) console.log('getOpenYear err:' + err);
        var yearStr;
        if(year.length) yearStr = year[0].year;
        Exp.getUserCourseMessage(req.session.school, courseid, yearStr, 1, function (err, result) {
            if (err) console.log('getUserCourseMessage err:' + err);
            if(!result.length) var count=0;
            else count=result[0].count;
            Apply.getQuestion(courseid,function (err, results) {
                if (err) console.log('getQuestion err:' + err);
                var question=results[0].question;
            res.render('reportMark', { title: '实验报告', result: result, year: year,count:count,question:question });});
        });
    });}
    catch(e){
        console.log("查看学生报告列表getUserCourseMessage err");
        return res.end('页面加载异常');
    }
});

router.post('/getList', function (req, res) {
    var year = req.body.year;
    var page=1;
    if (req.body.page) page = req.body.page;
    try{
    Exp.getUserCourseMessage(req.session.school, courseid, year, page,function (err, result) {
        if (err) console.log('getUserCourseMessageBynumber err:' + err);
        if (result.length) result[0].page = page;
        res.send(result);
    });}
    catch(e){
        console.log("获取报告信息列表getUserCourseMessage err");
        return res.end('页面加载异常');
    }
});
router.post('/research', function (req, res) {
    var studentnumber = req.body.studentnumber;
    try{
    Exp.getUserCourseMessageBynumber(req.session.school, studentnumber, function (err, result) {
        if (err) console.log('getUserCourseMessageBynumber err:' + err);
        res.send(result);
    });}
    catch(e){
        console.log("搜索实现获取报告信息getUserCourseMessageBynumber err");
        return res.end('页面加载异常');
    }
});

router.post('/subquestion', function (req, res) {
    var question = req.body.question;
    try{
    Apply.subQuestion(courseid, question, function (err, result) {
        if (err) console.log('subQuestion err:' + err);
        else return res.send("finished");
    });}
    catch(e){
        console.log("教师上传问题subquestion err");
        return res.end('提交异常');
    }
});
module.exports = router;