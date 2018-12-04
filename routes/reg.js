//注册界面
var express = require('express'),
    router = express.Router(),
    crypto = require('crypto'),
    IHuyi = require("ihuyi106"),
    Apply = require('../models/apply.js'),
    Exper = require('../models/experiment.js'),
    Info = require('../models/info.js'),
    List = require('../models/list.js'),
    TITLE_REG = "注册";

var schoolObject = {};
router.get('/', function (req, res) {
    try{
    Apply.getOpenSchool(function (err, result) {
        if (err) console.log('getSchool err:' + err);
        schoolObject = result;
        res.render('reg', { title: '注册', school: schoolObject });
    });}
    catch(e){
        console.log("注册页面getOpenSchool err");
        return res.end('页面加载异常');
    }
});

router.post('/', function (req, res) {
    var userName = req.body['txtUserName'],
        userPwd = req.body['txtUserPwd'],
        userPhone = req.body['txtUserPhone'],
        school = req.body['school_sel'],
        userRole = req.body['role'];
    md5 = crypto.createHash('md5');
    switch (userRole) {
        case 's': var usertype = "学生"; break;
        case 't': var usertype = "老师"; break;
        case 'm': var usertype = "管理员"; break;
    }
    User = Info;
    console.log('reg.js userRole:' + userRole);
    userPwd = md5.update(userPwd).digest('hex');
try{
    //判断是否有权限注册
    List.judgeList(school, usertype, userName, function (err, result) {
        if (result[0]['num'] == 0) {
            err = '没有注册权限，请联系老师或管理员';
        }
        if (err) {
            res.locals.error = err;
            res.render('reg', { title: TITLE_REG, school: schoolObject });
            return;
        }
        var list_id = result[0].id;
        var year = result[0].year;
        //检查用户名或者手机号是否已经存在
        Info.getUserNumByName(userRole, userName,school, userPhone, function (err, results) {
            if (results != null && results[0]['phoneSum'] > 0) {
                err = '手机号已被注册';
            }
            if (results != null && results[0]['num'] > 0) {
                err = '用户名已存在';
            }
            if (err) {
                res.locals.error = err;
                res.render('reg', { title: TITLE_REG, school: schoolObject });
                return;
            }
            // var newUser = new User({
            //     username: userName,
            //     userpass: userPwd,
            //     phone: userPhone,
            //     school: school,
            //     name:result[0].name,
            // });
            Info.save(userName,userPwd,userPhone,school,result[0].name,userRole, list_id, function (err, resultss) {
                if (err) {
                    res.locals.error = err;
                    res.render('reg', { title: TITLE_REG, school: schoolObject });
                    return;
                }
                //学生注册后，将数据插入exp表格
                if(userRole=="s") {
                    var user_id=resultss;
                    Exper.insertExperData(user_id, year,function(err,result){
                        if (err) {
                            res.locals.error = err;
                            res.render('reg', { title: TITLE_REG, school: schoolObject });
                            return;
                        }
                        res.locals.success = '注册成功';
                       res.render('reg', { title: TITLE_REG, school: schoolObject });
                    })
                } else{
                res.locals.success = '注册成功';
                res.render('reg', { title: TITLE_REG, school: schoolObject });}
            });
        });
    });}
    catch(e){
        console.log("用户注册judgeList err");
        return res.end('注册异常');
    }
});
router.post('/send', function (req, res) {
    var account = "C80672390";
    var password = "e2b28581429c3efccb4141fcf0916467";
    var mobile = req.body.mobile;
    var content = req.body.content;
    var iHuyi = new IHuyi(account, password);
    try{
    iHuyi.send(mobile, content, function (err, smsId) {
        if (err) {
            console.log(err.message);
        } else {
            console.log("SMS sent, and smsId is " + smsId);
            res.send('1');
        }
    });}
    catch(e){
        console.log("短信发送send err");
        return res.end('发送异常');
    }
});
module.exports = router;