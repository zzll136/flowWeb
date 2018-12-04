//学生查看实验成绩详情

var express = require('express'),
    router = express.Router(),
    Exp = require('../models/experiment.js'),
    Score = require('../models/score.js');
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
    var courseid;
    var year;
    var user_id;
    if (req.query != null) {
        if (req.query.courseid != null)
            courseid = req.query.courseid;
        if (req.query.courseid != null)
            user_id = req.query.user_id;
        if (req.query.courseid != null)
            year = req.query.year;
    }
    try{
    Exp.getUserDataByYear(user_id, courseid, year, function (err, result) {
        if (err) console.log('getUserData err:' + err);
        Score.getOrdertimes(user_id, year, courseid, function (err, ordertimes) {
            if (err) console.log('getOrdertimes err:' + err);
            console.log('预约次数:' + ordertimes);
            Score.getexp_timespanscore(user_id, year, courseid, function (err, exp) {
                if (err) console.log('getexp_timespanscore err:' + err);
                console.log('查看实验报告的exp:' + exp);
                Score.countAutoscore(user_id, year, courseid, function (err, score) {
                    if (err) console.log('countAutoscore err:' + err);
                    console.log('查看实验报告的results:' + score);
                    res.render('scoreDetail', { title: '查看实验成绩详情', result: result, ordertimes: ordertimes, exp: exp, score: score });
                });
            })
        })
    });}
    catch(e){
        console.log("教师查看分数详情getUserDataByYear err");
        return res.end('页面加载异常');
    }
});
module.exports = router;