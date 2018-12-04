//实验链接后台程序

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
  try{
    List.getListMessagebySelect(-1, -1, -1, -1, 1, function (err, result) {
        if (err) console.log('getListMessagebySelect err:' + err);
        if (!result.length) var count = 0;
        else count = result[0].count;
        // if(result.length==0){return res.send(result); }
        Apply.getOpenSchool(function (err, school) {
            if (err) console.log('getOpenSchool err:' + err);
            Apply.getOpenYear(function (err, year) {
                if (err) console.log('getOpenYear err:' + err);
                return res.render('listMessage', { title: '用户信息', result: result,school:school,year:year,count:count});
            });
        });
    });}
    catch(e){
        console.log("获取用户名单getListMessagebySelect err");
        return res.end('获取异常');
    }
});
    router.post('/uplist', multipartMiddleware, function (req, res) {
        var usertype = req.body.usertype,
            school = req.body.school,
            classname = req.body.classname,
            year = req.body.year,
            username = [],
            name = [];
        if (req.body.usernameStr) username = JSON.parse(req.body.usernameStr);
        if (req.body.nameStr) name = JSON.parse(req.body.nameStr);
        var repeat = {};
        var j = 0;

        if (req.files) {
            //对excel文件进行解析，读取数据  
            var ExcelParse = function (newPath) {
                var obj = node_xlsx.parse(newPath);
                var excelObj = obj[0].data;//取得第一个excel表的数据  
                //统计上传多少个学生信息  
                //var num = 0;
                //循环遍历表每一行的数据  
                for (var i = 1; i < excelObj.length; i++) {
                    var rdata = excelObj[i];
                    username[i - 1] = String(rdata[0]);
                    name[i - 1] = rdata[1];
                }
            }
            var tmp_path = req.files.listfile.path;
            var target_path = './public/lists/' + req.files.listfile.name;
            //对excel文件进行解析读取数据  
            ExcelParse(tmp_path);
            fs.readFile(tmp_path, function (err, data) {
                if (err) throw err;
                console.log('File read!');
                // Write the file
                fs.writeFile(target_path, data, function (err) {
                    if (err) throw err;
                    // res.write('File uploaded and moved!');
                    // res.end();
                    console.log('File written!');
                });
                // Delete the file
                fs.unlink(tmp_path, function (err) {
                    if (err) throw err;
                    console.log('File deleted!');
                });
            });
        }
        console.log(name);
        console.log(username);
        try{
        List.getListMessageAll(school, usertype,year,function (err, result) {
            if (err) console.log('getListMessageAll err:' + err);
            for (var i = 0; i < result.length; i++) {
                var index = username.indexOf(result[i].userName);
                if (index != -1) {
                    repeat[j] = { "index": index + 1, "username": username[index], "name": name[index] };
                    j++;
                }
            }
            repeat.length = j;
            if (repeat.length != 0)
                res.send(repeat);
            else {
                List.saveListMessage(req.session.list_id, school, usertype, year, classname, username, name, function (err, result) {
                    if (err) console.log('saveListMessage err:' + err);
                    if (result.affectedRows != 0)
                        res.send("success");
                    else
                        res.send("failed");
                });
            }
        });}
        catch(e){
            console.log("上传名单saveListMessage err");
            return res.end('上传异常');
        }

        // else{
        //  //res.send()
        //  console.log("表格格式错误");
        // }
        //   console.log("成功解析excel数据并且存进相应数据库！");
    });

    router.post('/delist', function (req, res) {
        var id = req.body.id;
        try{
        List.deListMessage(id, function (err, result) {
            if (err) console.log('deListMessage err:' + err);
            else if (result.affectedRows == 0) res.send("0");
            else res.send("1");
        });}
        catch(e){
            console.log("删除名单deListMessage err");
            return res.end('删除异常');
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
            console.log("下载报告download err");
            return res.end('下载异常');
        }
    });

    router.post('/getList', function (req, res) {
        var usertype = req.body.type,
            year = req.body.year,
            school = req.body.school,
            status = req.body.status;
        var page = 1;
        if (req.body.page) page = req.body.page;
        try{
        List.getListMessagebySelect(school, year, usertype, status, page, function (err, result) {
            if (err) console.log('getListMessagebySelect err:' + err);
            if (result.length) result[0].page = page;
            return res.send(result);
        });}
        catch(e){
            console.log("获取用户名单getListMessagebySelect err");
            return res.end('页面加载异常');
        }
    });
    module.exports = router;