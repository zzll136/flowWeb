
// 学生和老师对实验进行预约界面的路由文件
var express = require('express'),
    router = express.Router(),
    Apply = require('../models/apply.js');
    OrderTime = require('../models/ordertime.js');
var year=0;//0表示默认值，页面默认显示最早实验批次的情况
//定义网站主页的路由
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
    var year=0;//0表示默认值，页面默认显示最早实验批次的情况
    if (req.query != null) {
        if (req.query.year != null)
        year = req.query.year;
    }
    try{
    Apply.getOpenYear(function (err, yearList) {
        if (err) console.log('getOpenYear err:' + err);
    Apply.getTimeByYear(year,function (err, result) {
        if (err) console.log('getTime err:' + err);
        var monthArray = [];
        var timeArray = [];
        if(result.length){
        if(result[0].expTime_char){
        var str = result[0].expTime_char;
        var time = str.split(",");
        time.splice(time.length - 1, 1);}

        var startMonth=Number(result[0].startMonth);
        var endMonth=Number(result[0].endMonth);
        if(endMonth<startMonth) endMonth=endMonth+12;
      
        for(var i=startMonth;i<=endMonth;i++){
            if(i<=12) monthArray.push(i);
            else monthArray.push(i-12);
        }
        // for (var i = Number(result[0].startMonth); i <= Number(result[0].endMonth); i++) {
        //     monthArray.push(i);
        // }
        if (req.query != null) {
            if (req.query.month != null && req.query.month!=-1)
                month = req.query.month;
            else month = monthArray[0];
        }
        for (var i = 0; i < time.length; i++) {
            var timemon = time[i].substring(5, 7);
            if (Number(timemon) == month)
                timeArray.push(time[i]);
        }
    }
        var timeFull = {};
        Apply.getdeviceNum(function (err, result1) {
            if (err) console.log('getTime err:' + err);
            // deviceNum = result1[0].num;
            deviceNum = 5;//此处设计为，默认有5台机子供用户预约。
            OrderTime.getOrderFull(function (err, result) {
                    if (err) console.log('getorder err:' + err);
                    var timefull=[];
                    for(var i=0;i<timeArray.length;i++){
                           for(var j=0;j<result.length;j++){
                           if(timeArray[i]==result[j].experdate){
                           if(result[j].num>=deviceNum*8)
                            timefull[i]=1;
                       }
                   }
                 }
                    return res.render('stuOrder', { title: '实验预约', timeArray: timeArray, timeFull: timefull, monthArray: monthArray, deviceNum: deviceNum,year:yearList });
                });
        });
    });
});}
catch(e){
    console.log("获取预约信息getOrderFull err");
    return res.end('页面加载异常');
}
});

router.post('/orderTime', function (req, res) {

    var date = req.body.date;
    try{
    OrderTime.getOrder(date, function (err, result) {
        if (err) console.log('getOrder err:' + err);
        res.send(result);
    });}
    catch(e){
        console.log("获取预约情况getOrder err");
        return res.end('页面加载异常');
    }
});

function addZero(n) {
    if (n < 10) return "0" + n;
    return n;
}
router.post('/editTime', function (req, res) {
    var date = req.body.date;
    var timeid = req.body.timeid;
    var deviceNum = req.body.deviceNum;
    var timestamp = req.body.timestamp;
    var year =req.body.year;
    var nowTime = new Date();
    try{
    OrderTime.judgeOrderrRight(req.session.username,req.session.userrole,req.session.school,year,function (err, results){
        if (err) console.log('judgeOrderrRight err:' + err);
        if(results[0].num==0) res.send("noright");
        else {
        OrderTime.insertOrder(req.session.user_id,req.session.userrole,year,date, timeid, nowTime, deviceNum, timestamp, function (err, result) {
            if (err) console.log('insertOrder err:' + err);
            res.send(result + '');
        });}
    })}
    catch(e){
        console.log("提交对实验的预约judgeOrderrRight err");
        return res.end('预约异常');
    }
});

router.post('/orderRecord', function (req, res) {
    var nowTime = req.body.nowTime;
    var year=req.body.year;
    try{
    OrderTime.new_judgedoif(req.session.user_id,req.session.userrole,year,nowTime, function (err, results) {
        if (err) {
            console.log('new_judgedoif err:' + err);
            return;
        }
        for (var i = 0; i < results.length; i++) {
            if (results[i].doif == null) {//是null的情况下才需要修改，其他的就不用改了
                if (results[i].expertimestamp <= nowTime) {//表示预约的时间的起始时间戳，比当前时间要小。有可能，这个人预约后
                    //前半小时不去做实验，而是去看自己的预约记录了，这样显示失约，但是去实验，就会再改成正常或迟到。
                    OrderTime.new_setdoif(results[i].id, function (err, resultss) {
                        if (err) {
                            console.log('new_judgedoif err:' + err);
                            return;
                        }
                    });
                }
            }
        }
        OrderTime.new_getorderRecord(req.session.user_id,year, function (err, result) {
            if (err) {
                console.log('new_getorderRecord err:' + err);
                return;
            }
            return res.send(result);
        });
    });}
    catch(e){
        console.log("获取预约记录new_judgedoif err");
        return res.end('页面加载异常');
    }
});

router.post('/delOrder', function (req, res) {
    var ordertimeid = req.body.ordertimeid;
    try{
    OrderTime.new_delOrder(ordertimeid, function (err, result) {
        if (err) console.log('new_delOrder err:' + err);
        res.send("success");
    });}
    catch(e){
        console.log("删除预约记录new_delOrder err");
        return res.end('删除异常');
    }
});

module.exports = router;