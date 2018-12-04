//忘记密码功能的后台文件
var express = require('express'),
    router = express.Router(),
    Info = require('../models/info.js'),
    crypto = require('crypto');
   
router.get('/', function(req, res) {
    res.render('forget', { title: '忘记密码'});
})

router.post('/', function(req, res) {
    var userPwd = req.body['txtUserPwd'],
        // userRePwd = req.body['txtUserRePwd'],
        userPhone = req.body['txtUserPhone'],
        userRole = req.body['role'],
        // school=req.body['school_sel'],
        md5 = crypto.createHash('md5');

    console.log('reg.js userRole:' + userRole);
    userPwd = md5.update(userPwd).digest('hex');
   
    try{
    Info.getUserNumByPhone(userRole,userPhone, function(err, results) {
    console.log("results的值",results)
        if (results[0]['num'] == 0) {
            err = '该用户不存在';
        }
        if (err) {
            res.locals.error = err;
            res.render('forget', { title: "忘记密码"});
            return;
        }
        Info.changeUserPasswordByPhone(userRole,userPhone,userPwd,function(err, result) {
            if (err) {
                res.locals.error = err;
                res.render('forget', { title: "忘记密码"});
                return;
            }
            res.locals.success = '修改成功';
            res.render('forget', { title: "忘记密码"});
        });
    });}
    catch(e){
        console.log("忘记密码getUserNumByPhone err");
        return res.end('修改异常');
    }
});
module.exports = router;