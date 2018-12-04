//安全退出界面 就是消除session 没有对应的js文件

var express = require('express'),
     router = express.Router();

router.get('/', function(req, res) {
  req.session.destroy();
  res.redirect('/');
});

module.exports = router;