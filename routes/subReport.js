//学生提交实验报告的界面

var express = require('express'),
    router = express.Router(),
    Exp = require('../models/experiment.js'),
    fs = require('fs');
var courseid='0';
//var multer = require('multer');
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();
var year;
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
        if (req.query.courseid != null)
            courseid = req.query.courseid;
    }
try{
    Exp.getUserData(req.session.user_id, courseid, function (err, result) {
        if (err) console.log('getUserData err:' + err);
        year=result[0].year;
        res.render('subReport', { title: '提交实验报告', result: result });
        console.log('hhhhhhhhhhhhhhhhhhhh:' + result);
    });}
    catch(e){
        console.log("获取实验信息getUserData err");
        return res.end('页面加载异常');
    }
});

//将实验报告的路径提交到数据库
router.post('/', multipartMiddleware, function (req, res) {
    var status = 2;
    var tmp_path = req.files.thumbnail.path;
    switch(courseid){
        case "0":var courseName="涡街流量计验证实验"; break;
        case "1":var courseName="超声波流量计验证实验"; break;
        case "2":var courseName="超声波液位计验证实验"; break;
        case "3":var courseName="涡街流量计综合实验"; break;
        case "4":var courseName="超声波流量计综合实验"; break;
        case "5":var courseName="超声波液位计综合实验"; break;
        case "6":var courseName="涡街流量计设计实验"; break;
        case "7":var courseName="超声波流量计设计实验"; break;
        case "8":var courseName="超声波液位计设计实验"; break;
    }
    req.files.thumbnail.name=req.session.school+req.session.username+courseName+".pdf";
    var target_path = './public/reports/' + req.files.thumbnail.name;
    fs.readFile(tmp_path, function (err, data) {
        if (err) throw err;
        console.log('File read!');

        // Write the file
        fs.writeFile(target_path, data, function (err) {
            if (err) throw err;
            // res.write('File uploaded and moved!');
            // res.end();
            console.log('File written!');
        });

        // Delete the file
        fs.unlink(tmp_path, function (err) {
            if (err) throw err;
            console.log('File deleted!');
        });
    });
    try{
    Exp.subUserReport(req.session.user_id, courseid,year,status, target_path, function (err, result) {
        res.send("finished!");
    });}
    catch(e){
        console.log("提交实验报告subUserReport err");
        return res.end('提交异常');
    }
});
//获取数据库中实验的实验数据表格
router.post('/show', function (req, res) {
    try{
    Exp.getUserData(req.session.user_id, courseid, function (err, result) {
        if (err) console.log('getUserData err:' + err);
        if (result == '') return;
        return res.send(result[0]);
    });}
    catch(e){
        console.log("获取实验数据表格getUserData err");
        return res.end('页面加载异常');
    }
});

//提交校准实验的参数
router.post('/subpara', function (req, res) {
var stu_a=req.body.a;
var stu_b=req.body.b;
try{
    Exp.updateParameter(req.session.user_id, courseid,year,stu_a,stu_b,function (err, result) {
        if (err) console.log('updateParameter err:' + err);
        if (result == '') return;
        return res.send("1");
    });}
    catch(e){
        console.log("提交实验参数updateParameter err");
        return res.end('提交异常');
    }
});
module.exports = router;