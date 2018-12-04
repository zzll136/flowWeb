
//个人中心设置界面
var express = require('express'),
    router = express.Router(),
    Info = require('../models/info.js'),
    crypto = require('crypto');
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
    } else {
        res.redirect('/');
        return;
    }
    res.render('set', { title: '信息设置' });
});

router.get('/userinfomation', function (req, res) {

    try {
        Info.getUserinfoByUser_id(req.session.userrole, req.session.username, req.session.school, function (err, result) {
            if (err) {
                console.log('set.js in routes err:' + err)
            }
            if (result == '') {
                console.log('查询结果为空');
                return;
            }
            console.log('result:', result);
            res.json(result[0]);
        });
    }
    catch (e) {
        console.log("获取用户个人信息getUserinfoByUser_id err");
        return res.end('页面加载异常');
    }
});
router.post('/updatePassword', function (req, res) {
    try {
        Info.getUserByUserName(req.session.userrole, req.session.username, req.session.school, function (err, results) {
            if (err) {
                console.log('set.js in routes err:' + err);
            }
            if (results == '') {
                console.log('用户不存在');
                return;
            }
            console.log('results[0]:', results[0]);
            var md5 = crypto.createHash('md5'),
                oldPwd = md5.update(req.body.oldpassword).digest('hex'),
                //一个digest不能使用两次，必须创建两个对象才可以
                md55 = crypto.createHash('md5'),
                newPwd = md55.update(req.body.newpassword).digest('hex');
            console.log(' oldPwd: ' + oldPwd + ' resultsPed: ' + results[0].userPass);
            if (oldPwd === results[0].userPass) {
                Info.changeUserPasswordByUser_id(req.session.userrole, req.session.user_id, newPwd, function (err, result) {
                    if (err) console.log('changeUserPasswordByUser_id err:' + err);
                    console.log('set.js result[0] is:', result[0]);
                    res.end('1');
                })
            }
            else {
                res.send('0');
            }
        });
    }
    catch (e) {
        console.log("修改密码changeUserPasswordByUser_id err");
        return res.end('修改异常');
    }
});

router.post('/setmessage', function (req, res) {
    var newclass = req.body.newclass;
    var name = req.body.name;
    try {
            Info.changeUserMessageByUser_id(req.session.userrole, req.session.username, req.session.school, name, newclass, function (err, result) {
                if (err) console.log('changeUserMessageByUser_id err:' + err);
                res.end('1');
            });
    }
    catch (e) {
        console.log("修改信息changeUserMessageByUser_id err");
        return res.end('修改异常');
    }
});

router.post('/setnumber', function (req, res) {
    var phonenumber = req.body.phonenumber;
    try {
        Info.getUserNumByName(req.session.userrole, req.session.username, req.session.school, phonenumber, function (err, results) {
            if (results != null && results[0]['phoneSum'] > 0) {
                res.end('phone_err');
                return;
            }
            Info.changeNumberByUser_id(req.session.userrole, req.session.username, req.session.school, phonenumber, function (err, result) {
                if (err) console.log('changeNumberByUser_id err:' + err);
                res.end('1');
            });
        });
    }
    catch (e) {
        console.log("修改信息changeNumberByUser_id err");
        return res.end('修改异常');
    }
});
module.exports = router;