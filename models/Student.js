const mongoose = require('mongoose'),
    excelStudent = require("node-xlsx"),
    fs = require("fs");


//1.声明schema
let studentSchema = new mongoose.Schema({
    sid: Number, //学生的学号
    name: String, //名字
    sex: String, //性别
    age: Number //年龄    
});
//获取某一页学生数据
studentSchema.statics.findPageData = async function (page, callback) {
    //分页:
    let pageSize = 4; //一页4条数据
    let start = (page - 1) * pageSize; //起始位置
    let count = await this.find().countDocuments(); //获取数据总条数
    this.find({}).sort({ 'sid': -1 }).skip(start).limit(pageSize).exec(function (err, results) {
        if (err) {
            callback(null);
            return;
        }
        callback({
            results,
            count, //数据总条数
            length: Math.ceil(count / pageSize), //一共多少页
            now: page // 当前在那一页
        });
    })
}
//修改学生信息:
studentSchema.statics.changeStudent = function (sid, data, callback) {
    this.find({ sid }, (err, results) => {
        //console.log(results);
        var somebody = results[0];
        somebody.name = data.uname;
        somebody.sex = data.sex;
        somebody.age = data.age;
        somebody.save((err) => {
            if (err) {
                callback(-1); //修改失败
                return;
            }
            callback(1); //修改成功
        });
    });
}
//通过正则做模糊搜索
studentSchema.statics.findStudentNames = function (reg, callback) {
    //let val = new RegExp(reg,'g');
    //let val = eval(`/${reg}/g`);
    this.find(
        { name: { $regex: reg, $options: '$g' } },
        (err, results) => {
            if (err) {
                callback({ error: 0, data: null });
                return;
            }
            callback({ error: 1, data: results });
        }
    );
}

//通过正则做模糊搜索
studentSchema.statics.findStudentExcelToDaoChu = function (reg, callback) {

    this.find(
        reg,
        (err, results) => {
            var datas = [],//存储excel表的格式;
                col = ["_id", "sid", "name", "sex", "age"]; //嘞
            //表的内容
            datas.push(col);
            results.forEach(item => {
                var arrInner = [];
                arrInner.push(item._id);
                arrInner.push(item.sid);
                arrInner.push(item.name);
                arrInner.push(item.sex);
                arrInner.push(item.age);
                datas.push(arrInner);
            });
            var mes = new Date().getTime() + Math.floor(Math.random() * 1000);
            let buffer = excelStudent.build([
                {
                    name: 'mes',
                    data: datas
                }
            ]);
            fs.writeFileSync(`excel/${mes}.xlsx`, buffer, { 'flag': 'w+' }, function (err) {
                console.log(1);
            });
        }
    );
}
//添加学生
studentSchema.statics.saveStudent = function (data, callback) {
    this.find({}, { sid: 1 }).sort({ sid: -1 }).exec(function (err, results) {
        let sid = Number(results[0]['sid']) == true ? Number(results[0]['sid']) + 1 : 10001;
        let student = new Student({
            ...data,
            sid
        })
        student.save(function (err) {
            if (err) return callback(1);
            callback("成功");
        })
    })
}

//删除学生
studentSchema.statics.deleteStudent = function (sid, callback) {
    this.find({ sid }, (err, result) => {
        var somebody = result[0];
        somebody.remove(err => {
            if (err) return callback("失败");
            return callback("成功");
        })
    })
}


//2.初始化Student类 该类会声明一个名为students的集合
let Student = mongoose.model('Student', studentSchema);

//3.导出集合
module.exports = Student;