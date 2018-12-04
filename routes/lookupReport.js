//学生查看实验报告和成绩的界面路由文件

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

    var courseid = 0;
    if (req.query != null) {
        if (req.query.courseid != null)
            courseid = req.query.courseid;
    }
    console.log(courseid);
    try{
    Exp.getUserData(req.session.user_id, courseid, function (err, result) {
        if (err) console.log('getUserData err:' + err);
        // console.log('查看实验报告的result:' + result);
        var year=result[0].year;
        Score.getOrdertimes(req.session.user_id, year,courseid, function (err, ordertimes) {
            if (err) console.log('getOrdertimes err:' + err);
            console.log('预约次数:' + ordertimes);
            Score.getexp_timespanscore(req.session.user_id, year,courseid, function (err, exp) {
                if (err) console.log('getexp_timespanscore err:' + err);
                console.log('查看实验报告的exp:' + exp);
                Score.countAutoscore(req.session.user_id, year,courseid, function (err, score) {
                    if (err) console.log('countAutoscore err:' + err);
                    console.log('查看实验报告的results:' + score);
                    res.render('lookupReport', { title: '查看实验报告', result: result, ordertimes: ordertimes, exp: exp, score: score });
                });
            })
        })
    });}
    catch(e){
        console.log("查看实验报告getUserData err");
        return res.end('页面加载异常');
    }
});

// router.post('/show', function(req, res) {
//     var courseid=0;
//     if( req.query != null )
//         {
//             if( req.query.courseid != null )
//                 courseid = req.query.courseid;
//         }
//     User.getUserData(req.session.username,courseid,function(err, result) {
//         if (err) console.log('getUserData err:' + err);
//         if (result == '') return;
//         return res.send(result[0]);
//     });
// });
module.exports = router;