//管理员查看设备详情的界面
var express = require('express'),
    router = express.Router(),
    Apply = require('../models/apply.js');

//定义网站主页的路由
router.get('/', function(req, res) {

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
    Apply.getTablestatus(function(err, result) {
        if (err) console.log('getTablestatus err:' + err);
        console.log('result的值',result);
        res.render('deviceDetails',{title:'设备详情',result:result});
    });}
    catch(e){
        console.log("获取设备详情界面getTablestatus err");
        return res.end('获取数据异常');
    }
});
module.exports = router;
