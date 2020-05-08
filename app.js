/* 启动入口文件(主文件) */
const express = require('express'),
    //mongoose内依赖自动有mongodb,所以不需要再次安装或引入mongodb
    mongoose = require('mongoose'),
    cookieSession = require('cookie-session'),
    login = require("./route/index"),
    studentCtrl = require('./controllers/studentCtrl'),

    student = require("./route/student");

//链接数据库 端口号不需要写,最后的反斜杠是操作的数据库名称
mongoose.connect('mongodb://localhost/sm', { useUnifiedTopology: true, useNewUrlParser: true });

//起服务
let app = express();
//设置模板引擎
app.set('view engine', 'ejs');
//使用session
app.use(cookieSession({
    name: 'sess_id',
    keys: ['key1'],
    maxAge: 30 * 60 * 10000 //30min
}))

//处理静态资源请求:
app.use(express.static('public'));

//登录验证: 验证如果没有登陆过不能访问管理界面的任何内容
app.use((req, res, next) => {
    if (!req.session['s_id'] && req.url != '/login') { //没有s_id证明没有登陆过
        res.redirect('/login');
        return;
    }
    next();
});


//验证登入
app.use("/login", login);
//路径清单:
//验证进入首页管理
app.use("/", student);

//监听端口
app.listen(300);


