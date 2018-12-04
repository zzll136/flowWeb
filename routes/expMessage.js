//老师界面查看学生实验情况的界面
var express = require('express'),
    router = express.Router(),
    Exp = require('../models/experiment.js'),
    Apply = require('../models/apply.js');
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
    try{
    Apply.getOpenYear(function (err, year) {
        if (err) console.log('getOpenYear err:' + err);
        var yearStr;
        if(year.length)
        yearStr = year[0].year;
        Exp.getexpMessageByYear(req.session.school, yearStr, 1,function (err, result) {
            if (err) console.log('getexpMessageByYear err:' + err);
            if (!result.length) var count = 0;
            else count = result[0].count;
            res.render('expMessage', { title: '实验情况', result: result, year: year,count:count });
        });
    });}
    catch(e){
        console.log("学生实验情况页面getexpMessageByYear err");
        return res.end('获取数据异常');
    }

});
router.post('/getdone', function (req, res) {
    var user_id = req.body.user_id;
    var status = req.body.status;
    var year=req.body.year;
    try{
    Exp.getexpMessageBystatus(user_id, status, year,function (err, result) {
        if (err) console.log('getexpMessageBystatus err:' + err);
        res.send(result);
    });}
    catch(e){
        console.log("获取实验完成情况页面getexpMessageBystatus err");
        return res.end('获取数据异常');
    }

});
router.post('/getList', function (req, res) {
    var year = req.body.year;
    var page = 1;
    if (req.body.page) page = req.body.page;
    try{
    Exp.getexpMessageByYear(req.session.school, year, page,function (err, result) {
        if (err) console.log('getexpMessageByYear err:' + err);
        if (result.length) result[0].page = page;
        return res.send(result);
    });}
    catch(e){
        console.log("获取搜索结果的实验完成情况getexpMessageByYear err");
        return res.end('获取数据异常');
    }
});
module.exports = router;