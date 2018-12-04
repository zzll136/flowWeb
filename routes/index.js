//index通常表示首页，app.use的默认路径'/'
//主要是cookies,session登陆状态的判断
var express = require('express'),
    crypto = require('crypto'),
    Apply = require('../models/apply.js'),
    Info = require('../models/info.js'),
    router = express.Router();
var schoolObject = {};
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
    }
    try{
    Apply.getOpenSchool(function (err, result) {
        if (err) console.log('getSchool err:' + err);
        schoolObject = result;
        res.render('index', { title: '主页', school: schoolObject });
    });}
    catch(e){
        console.log("获取申请学校getOpenSchool err");
        return res.end('页面加载异常');
    }
});

router.post('/', function (req, res) {
    var userName = req.body['txtUserName'],
        userPwd = req.body['txtUserPwd'],
        isRem = req.body['chbRem'],
        userRole = req.body['role'],
        school = req.body['school_sel'],
        md5 = crypto.createHash('md5');
    
    try{
    Info.getUserByUserName(userRole, userName, school, function (err, results) {

        if (results == '') {
            res.locals.error = '用户不存在';
            res.render('index', { title: '登录', school: schoolObject });
            return;
        }
        userPwd = md5.update(userPwd).digest('hex');
        if (results[0].userPass != userPwd) {
            res.locals.error = '密码有误';
            res.render('index', { title: '登录', school: schoolObject });
            return;
        } else {
            if (isRem) {
                res.cookie('islogin', userName, { maxAge: 60000 });
            };
            res.locals = {
                username: userName,
                userrole: userRole,
                school: school,
                list_id: results[0].list_id,
                user_id: results[0].id,
            };
            // if (!results[0].read_state) {
            //     if (userRole == "m")
            //         {var file = "./public/guide/guide_manager.pdf";}
            //     else if (userRole == "s")
            //         {var file = "./public/guide/guide_student.pdf";}
            //     if (userRole == "t")
            //         {var file = "./public/guide/guide_teacher.pdf";}
            //     res.download(file, function (err) {
            //         if (err)
            //             console.log('download err:' + err);
            //         else
            //             {console.log("下载成功");
            //             Info.updateReadState(userRole,userName,school,function(err, result){
            //                 if (err) console.log('editTime err:' + err);
            //                 res.redirect('/');
            //                 return;
            //             })

            //         }
            //     })
            // }
            // else {
            req.session.username = res.locals.username;
            req.session.userrole = res.locals.userrole;
            req.session.user_id = res.locals.user_id;
            req.session.list_id = res.locals.list_id;
            req.session.school = res.locals.school;
            // console.log('index.js userName:' + req.session.username);
            // console.log('index.js userrole:' + res.locals.userrole);
            res.redirect('/');
            return;
        }
        // }
    });
    }
    catch(e){
        console.log("用户登陆getUserByUserName err");
        return res.end('登陆异常');
    }
});
module.exports = router;