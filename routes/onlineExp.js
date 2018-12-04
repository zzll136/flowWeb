//点击在线实验后的路由文件
var express = require('express'),
    router = express.Router(),
    Exp = require('../models/experiment.js');

router.get('/', function(req, res) {
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
    res.render('onlineExp', { title: '在线实验'});
});

//获取学生课程信息，看是否已经完成实验
router.get('/courseInfo', function(req, res) {
    try{
    Exp.getCourseStatus(req.session.user_id,function(err, result) {
        if (result == '') return;
        if (err) console.log('getCourseStatus err:' + err);
        console.log('result的值',result);
        res.send(result);
    });}
    catch(e){
        console.log("获取学生实验完成信息getCourseStatus err");
        return res.end('页面加载异常');
    }
});

router.get('/download',function(req, res) {
    if(req.session.userrole=="m")
    var file="./public/guide/guide_manager.pdf";
    else if(req.session.userrole=="s")
    var file="./public/guide/guide_student.pdf";
    if(req.session.userrole=="t")
    var file="./public/guide/guide_teacher.pdf";
    try{
    res.download(file,function(err){
        if(err)
        console.log('download err:' + err);
        else
        console.log("下载成功");})}
        catch(e){
        console.log("下载指导download err");
        return res.end('下载异常');
        }
    
});
// router.post('/tableMatch', function(req, res) {
//     var courseid=req.body.courseid;
//     User.distributionTable(req.session.username,courseid,function(err, result) {
//         if (err) console.log('distributionTable err:' + err);
//         //if (result == '') return;
//         console.log(result);
//        res.send(result+"");
//     });
// });
module.exports = router;