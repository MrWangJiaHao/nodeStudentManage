/**
 * 处理路由访问
 */
const express = require("express");
let router = express.Router(),
    loginCtrl = require('../controllers/loginCtrl.js');

router.get('/login', loginCtrl.showLogin); //访问登录页面

router.post('/login', loginCtrl.doLogin); //访问登录接口 处理登录操作

router.propfind('/login', loginCtrl.checkUser); //访问接口 验证用户名是否存在

module.exports = router;