//老师界面查看学生名单和注册信息

var express = require('express'),
    router = express.Router(),
    List = require('../models/list.js'),
    Apply = require('../models/apply.js');
var node_xlsx = require('node-xlsx');
var fs = require('fs');
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();
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
    var school=req.session.school;
    try{
    List.getListMessagebySelect(school,-1,"学生",-1,1,function (err, result) {
        if (err) console.log('getListMessagebySelect err:' + err);
        Apply.getOpenYear(function (err, year) {
            if (err) console.log('getSchool err:' + err);
            if(result.length==0)  var list_count=0;
            else list_count=result[0].count;
            return res.render('regMessage', { title: '学生注册信息', result: result,school:school,year:year,list_count:list_count});
        });
    });}
    catch(e){
        console.log("获取注册信息getListMessagebySelect err");
        return res.end('页面加载异常');
    }
});

router.get('/download', function (req, res) {
    var file = "./public/listTemplet/listTemplet.xlsx";
    try{
    res.download(file, function (err) {
        if (err)
            console.log('download err:' + err);
        else
            console.log("下载成功");
    })}
    catch(e){
        console.log("下载名单模板download err");
        return res.end('下载异常'); 
    }
});


router.post('/getList', function (req, res) {
    var year = req.body.year,
        status = req.body.status;
    var page = 1;
    var usertype="学生";
    var school=req.session.school;
    if (req.body.page) page = req.body.page;
    try{
    List.getListMessagebySelect(school, year, usertype, status, page, function (err, result) {
        if (err) console.log('getListMessagebySelect err:' + err);
        if (result.length) result[0].page = page;
        return res.send(result);
    });}
    catch(e){
        console.log("获取用户名单信息getListMessagebySelect err");
        return res.end('页面加载异常');
    }
});



// router.post('/load', multipartMiddleware,function (req, res) {
//     var usertype = req.body.usertype,
//     school = req.body.school,
//     classname = req.body.classname,
//     year = req.body.year;
//     //对excel文件进行解析，读取数据  
//     var ExcelParse = function (newPath) {
//         var obj = node_xlsx.parse(newPath);
//         var excelObj = obj[0].data;//取得第一个excel表的数据  
//         //统计上传多少个学生信息  
//         //var num = 0;
//         //循环遍历表每一行的数据  
//         for (var i = 1; i < excelObj.length; i++) {
//             var rdata = excelObj[i],
//                 // usertype = rdata[0],
//                 username = rdata[0],
//                 name = rdata[1];
//                 // organization = rdata[3];
//             // switch (organization) {
//             //     case "控制1班": organization = "1";break;
//             //     case "控制2班": organization = "2";break;
//             //     case "控制3班": organization = "3";break;
//             // }
//             // if ((usertype !== "管理员") && (usertype !== "老师") && (usertype !== "学生") || (organization != "0") && (organization != "1") && (organization != "2") && (organization != "东南大学")) {
//             //     //res.send("excel error");
//             //     //return;
//             // }
//             // else {
//                 if(username&&name){
//                 Manager.saveListMessage(req.session.username, school,usertype,year, classname,username, name,function (err, result) {
//                     if (err) console.log('saveListMessage err:' + err);
//                     //if (result == '') return;
//                 });}
//             // }
//         }
//         res.send("finished");
//     }
//     // else{
//     //  //res.send()
//     //  console.log("表格格式错误");
//     // }
//     //   console.log("成功解析excel数据并且存进相应数据库！");  

//     var tmp_path = req.files.listfile.path;
//     var target_path = './public/lists/' + req.files.listfile.name;
//     //对excel文件进行解析读取数据  
//     ExcelParse(tmp_path);
//     fs.readFile(tmp_path, function (err, data) {
//         if (err) throw err;
//         console.log('File read!');
//         // Write the file
//         fs.writeFile(target_path, data, function (err) {
//             if (err) throw err;
//             // res.write('File uploaded and moved!');
//             // res.end();
//             console.log('File written!');
//         });
//         // Delete the file
//         fs.unlink(tmp_path, function (err) {
//             if (err) throw err;
//             console.log('File deleted!');
//         });
//     });
// });
module.exports = router;