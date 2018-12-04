//老师界面对学生报告进行打分
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
    var id;
    if( req.query != null )
    {
        if( req.query.id != null )
             id = req.query.id;
    }
    console.log('教师前往评分页面选择的id值为:'+id);
    try{
    Exp.getUserDataByid(id,function(err,result){
        if (err) console.log('getUserDataByid err:' + err);
        res.render('scoreSubmit', { title: '批改报告',result:result});
        console.log('教师前往评分页面的result:',result);
    });}
    catch(e){
        console.log("提交评分页面获取用户信息getUserDataByid err");
        return res.end('页面加载异常');
    }
});
// var id;
// if( req.query != null )
// {
//     if( req.query.id != null )
//         id = req.query.id;
// }
// // router.post('/', function(req, res) {
//     var score=req.body['score'],
//         comment=req.body['comment'];
//     var id;
//     if( req.query != null )
//     {
//         if( req.query.id != null )
//             id = req.query.id;
//     }
//     User.setScoreByid(id,score,comment,function(err,result){
//         if (err) console.log('setScoreByid err:' + err);
//         res.send('finished!');
//     });
// });
router.post('/count', function(req, res) {
    // var id=req.body.id,
    var school=req.body.school,
    userName=req.body.userName,
    courseid=req.body.courseid,
    score=req.body.score,
    comment=req.body.comment,
    teascore=req.body.teascore;
    try{
    Exp.setScoreByid(school,courseid,userName,comment,score,teascore,function(err,result){
        if (err) console.log('setScoreByid err:' + err);
        res.send('1');
    });}
    catch(e){
        console.log("提交分数setScoreByid err");
        return res.end('提交异常');
    }
});

router.get('/download', function(req, res) {
  id=req.query.id;
  try{
  Exp.getReportByid(id,function(err,result){
        if (err) console.log('getReportByid err:' + err);
        var file=result[0].report_path;
        if(file){
        res.download(file,function(err){
            if(err)
            console.log('download err:' + err);
            else
            console.log("下载成功");}
        )}
        else res.send("该生未上传实验报告！");
    });}
    catch(e){
        console.log("下载实验报告getReportByid err");
        return res.end('下载异常');
    }
});

router.post('/download', function(req, res) {
    id=req.body.id;
    try{
    Exp.getReportByid(id,function(err,result){
          if (err) console.log('getReportByid err:' + err);
          var file=result[0].report_path;
        
         res.send(file+"");
     })}
     catch(e){
        console.log("预览实验报告getReportByid err");
        return res.end('预览异常');
    }
});

module.exports = router;