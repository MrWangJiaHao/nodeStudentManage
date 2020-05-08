const express = require("express"),
    router = express.Router(),
    studentCtrl = require('../controllers/studentCtrl'),
    loginOut = require("../controllers/loginOut"),
    loginCtrl = require('../controllers/loginCtrl.js');

router.get('/login', loginCtrl.showLogin); //访问登录页面

router.post('/login', loginCtrl.doLogin); //访问登录接口 处理登录操作

router.propfind('/login', loginCtrl.checkUser); //访问接口 验证用户名是否存在

router.get('/', studentCtrl.showIndex); //访问首页
router.get('/student/msg', studentCtrl.showList);// 处理学生数据 
router.get('/student/search', studentCtrl.searchStudent); // 处理搜索学生
router.post("/student/exportexcel", studentCtrl.exportsStudentToExcel); // 导出一个学生数据数据格式为excel
router.post('/student/:sid', studentCtrl.updateStudent);// 处理修改学生数据
router.get('/student/addStatus', studentCtrl.showAddStudents); // 来增加学生页面
router.put("/student/addStatus", studentCtrl.updateAddStudents);//处理增加学生
router.delete("student/:sid", studentCtrl.deleteStudent); //  处理删除学生

router.get("/login_out", loginOut);//退出登入

module.exports = router;