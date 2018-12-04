//外校用户提交申请的界面
var express = require('express'),
    router = express.Router(),
    Apply = require('../models/apply.js');
   
//定义网站主页的路由
router.get('/', function(req, res) {
    try{
    Apply.getopenTimeMessage(function(err, result) {
        if (err) console.log('getopenTimeMessage err:' + err);
        console.log('result的值',result);
        if(result.length==0) 
        result[0]={"startDate":"目前还未设置实验时间","endDate":"目前还未设置实验时间","expTime":"","repTime":""}
        res.render('apply',{title:'申请使用',result:result});
    });}
    catch (e){
        console.log("提交申请界面getopenTimeMessage err");
        return res.end('获取数据异常');
    }
});

router.post('/subApply', function(req, res) {
    var name = req.body.name,
    username=req.body.username,
    school=req.body.school,
    institute=req.body.institute,
    course=req.body.course,
    phone=req.body.phone,
    startDate=req.body.startDate,
    endDate=req.body.endDate,
    applyTime = new Date();
    try{
    Apply.subApply(name,username,school,institute,course,phone,startDate,endDate,applyTime,function(err, result) {
            if (err) console.log('subApply err:' + err);
            res.end('1');
        });
    }
    catch(e){
        console.log("提交申请subApply err");
        return res.end('提交异常');
    }
});
module.exports = router;