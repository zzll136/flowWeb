//这个项目是用express+ejs构建一个完整的网站，包括了数据库
/*实现登陆注册和注册所需要的的访问方法，安全退出
 * res.redirect()用于跳转，可以用app.set设置基础地址basepath
 */
var express = require('express');

var path         = require('path');
var favicon      = require('serve-favicon');
var logger       = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');
var session      = require('express-session');
var multer       = require('multer');
var app          = express();

// view engine setup 模板引擎
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
//app.use(multer());
// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
//app.use(bodyParser({uploadDir:'E:\文档\流量台项目\flowWeb4.29old - 0428\public\reports'}));
app.use(bodyParser.json());
app.use(bodyParser.text());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser('Wilson'));
//app.use(express.cookieParser('Wilson'));
app.use(session());

//app.use(session({secret:'wilson'}));
app.use(express.static(path.join(__dirname, 'public')));

//Add highcharts path to static route
app.use('/highcharts', express.static(__dirname + '/node_modules/highcharts/'));
app.use('/jquery', express.static(__dirname + '/node_modules/jquery/'));
//////////////////不同页面的处理回调函数/////////////////////////
app.use('/', require('./routes/index'));
app.use('/reg', require('./routes/reg'));
// app.use('/login', require('./routes/login'));
app.use('/logout', require('./routes/logout'));
app.use('/reportMark', require('./routes/reportMark'));
app.use('/set', require('./routes/set'));
// app.use('/test', require('./routes/test'));
// app.use('/chooseTime', require('./routes/chooseTime'));
app.use('/scoreSubmit',require('./routes/scoreSubmit'));
app.use('/onlineExp', require('./routes/onlineExp'));
app.use('/experiment', require('./routes/exper'));
// app.use('/uploadReport', require('./routes/uploadReport'));
app.use('/lookupReport', require('./routes/lookupReport'));
app.use('/scoreTable', require('./routes/scoreTable'));
// app.use('/select', require('./routes/select'));
// app.use('/verify', require('./routes/verify'));
app.use('/forget', require('./routes/forget'));
// app.use('/addcourse', require('./routes/addcourse'));
app.use('/listMessage', require('./routes/listMessage'));
app.use('/regMessage', require('./routes/regMessage'));
app.use('/expMessage', require('./routes/expMessage'));
// app.use('/expOrder', require('./routes/expOrder'));
app.use('/subReport', require('./routes/subReport'));
// app.use('/orderMessage', require('./routes/orderMessage'));
app.use('/exptime', require('./routes/exptime'));
app.use('/stuOrder', require('./routes/stuOrder'));
app.use('/new_orderMessage', require('./routes/new_orderMessage'));
app.use('/deviceDetails', require('./routes/deviceDetails'));
app.use('/apply', require('./routes/apply'));
app.use('/scoreDetail', require('./routes/scoreDetail'));
// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

module.exports = app;