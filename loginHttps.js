var http = require('http');
var querystring = require('querystring');
var MongoClient = require('mongodb').MongoClient;
var mongoUrl = 'mongodb://admin:123456@127.0.0.1:27017/admin';

var server = http.createServer(function (req,res) {
    res.statusCode = 200;
    res.setHeader('Content-Type','text/plain');
    res.setHeader('Access-Control-Allow-Origin','http://127.0.0.1:63342');
    res.setHeader('Access-Control-Allow-Credentials','true');//允许跨域发送COOKIE
    var post = '';
    req.on('data',function (chunk) {
        post +=chunk;
    });
    req.on('end',function () {
        post = querystring.parse(post,'&','=');
        if(post.request == 'login'){
            MongoClient.connect(mongoUrl,{useNewUrlParser:true},function (err,db) {
                if(err){
                    console.log('err');
                }
                var dbase = db.db('student');
                if(post.idName == 'student'){
                    var whereStrS = {sno:post.usename+''};
                    dbase.collection('studentinfo').find(whereStrS).toArray(function (err,result) {
                        if(err){
                            console.log('err')
                        }
                        db.close();
                        var date = new Date();
                        date.setTime(date.getTime()+ 30*60*1000);
                        if(result[0] == undefined){
                            res.end('false')
                        }else{
                            res.setHeader('Set-Cookie','data={"sno":"'+result[0].sno+'","username":"'+result[0].sname+'","pwd":'+result[0].pwd+'};expires='+date.toGMTString());
                            res.end('true');
                        }
                    });
                }
                if(post.idName == 'teacher'){
                    var whereStrT = {tno:post.usename};
                    dbase.collection('teacherinfo').find(whereStrT).toArray(function (err,result) {
                        if(err){
                            console.log('err')
                        }
                        db.close();
                        var date = new Date();
                        date.setTime(date.getTime()+ 30*60*1000);
                        if(result[0] == undefined){
                            res.end('false')
                        }else{
                            res.setHeader('Set-Cookie','data={"username":"'+result[0].tname+'","pwd":'+result[0].pwd+'};expires='+date.toGMTString());
                            res.end('true');
                        }
                    });
                }
            });
        }
        if(post.request == 'studentInfoSub'){
            MongoClient.connect(mongoUrl,{useNewUrlParser:true},function (err,db) {
                if(err){
                    console.log('connect err');
                }
                var dbase = db.db('student');

                if(post.sno == ''||post.sname == ''||post.age == ''||post.sex == ''||post.dept == ''||post.class == ''){
                    res.end('empty')
                }else{
                    var whereStr = {sno:post.sno};
                    dbase.collection('studentinfo').find(whereStr).toArray(function (err,result) {
                        if(err){
                            console.log('err')
                        }
                        if(result[0] != undefined){
                            res.end('existing')
                        }else{
                            var data = {sno:post.sno,sname:post.sname,age:post.age,sex:post.sex,dept:post.dept,sclass:post.class,pwd:post.pwd};
                            dbase.collection('studentinfo').insertOne(data,function (err,result) {
                                if(err){
                                    console.log('insertOne err')
                                }else{
                                    console.log('插入学生成功');
                                }
                                db.close();
                            });
                            dbase.collection('studentinfo').find().toArray(function (err,result) {
                                if(err){
                                    console.log('find err')
                                }else{
                                    res.end(JSON.stringify(result));
                                }
                                db.close();
                            })
                        }
                        db.close()
                    });
                }
            })
        }
        if(post.request == 'studentInfoFind'){
            MongoClient.connect(mongoUrl,{useNewUrlParser:true},function (err,db) {
                if(err){
                    console.log('err');
                }
                var dbase = db.db('student');
                if(post.sno == ''){
                    dbase.collection('studentinfo').find().toArray(function (err,result) {
                        if(err){
                            console.log('err')
                        }
                        db.close();
                        res.end(JSON.stringify(result));
                    });
                }else{
                    var whereStr = {sno:post.sno};
                    dbase.collection('studentinfo').find(whereStr).toArray(function (err,result) {
                        if(err){
                            console.log('err')
                        }
                        db.close();
                        if(result[0] == undefined){
                            res.end('false')
                        }else{
                            res.end(JSON.stringify(result));
                        }
                    });
                }
            })
        }
        if(post.request == 'studentInfoCha'){
            MongoClient.connect(mongoUrl,{useNewUrlParser:true},function (err,db) {
                if(err){
                    console.log('err');
                }
                var dbase = db.db('student');
                if(post.sno == ''){
                    res.end('emptyFind')
                }else{
                    var whereStr = {sno:post.sno};
                    if(post.sname != ''&&post.age != ''&&post.sex != ''&&post.dept != ''&& post.class != ''){
                        dbase.collection('studentinfo').find(whereStr).toArray(function (err,result) {
                            if (err) {
                                console.log('err')
                            }
                            if (result[0] == undefined) {
                                res.end('noOne')
                            } else {
                                var updataStr = {
                                    $set: {
                                        sname: post.sname,
                                        age: post.age,
                                        sex: post.sex,
                                        dept: post.dept,
                                        sclass: post.class
                                    }
                                };
                                dbase.collection('studentinfo').updateOne(whereStr, updataStr, function (err, result) {
                                    if (err) {
                                        console.log('updateOne err')
                                    }else{
                                        console.log('更新成功')
                                    }
                                    db.close()
                                });
                                dbase.collection('studentinfo').find().toArray(function (err,result) {
                                    if(err){
                                        console.log('find err')
                                    }else{
                                        res.end(JSON.stringify(result));
                                    }
                                    db.close();
                                })
                            }
                        });
                    }
                    if(post.sname == ''||post.age == ''||post.sex == ''||post.dept == ''||post.class == ''){
                        dbase.collection('studentinfo').deleteOne(whereStr,function (err,result) {
                            if(err) throw err;
                            db.close();
                        });
                        dbase.collection('studentinfo').find().toArray(function (err,result) {
                            if(err){
                                console.log('find err')
                            }else{
                                res.end(JSON.stringify(result));
                            }
                            db.close();
                        })
                    }
                }
            })
        }
        if(post.request == 'classInfoSub'){
            MongoClient.connect(mongoUrl,{useNewUrlParser:true},function (err,db) {
                if(err){
                    console.log('connect err');
                }
                var dbase = db.db('student');
                if(post.cno == ''||post.cname == ''||post.tno == ''||post.ccode == ''){
                    res.end('empty')
                }else{
                    var whereStr = {cno:post.cno};
                    dbase.collection('classinfo').find(whereStr).toArray(function (err,result) {
                        if(err){
                            console.log('err')
                        }
                        if(result[0] != undefined){
                            res.end('cexisting')
                        }else{
                            var data = {cno:post.cno,cname:post.cname,tno:post.tno,ccode:post.ccode};
                            dbase.collection('classinfo').insertOne(data,function (err,result) {
                                if(err){
                                    console.log('insertOne err')
                                }
                                console.log('插入课程成功');
                                db.close()
                            });

                            dbase.collection('classinfo').find().toArray(function (err,result) {
                                if(err){
                                    console.log('find err')
                                }else{
                                    res.end(JSON.stringify(result));
                                }
                                db.close();
                            })

                        }
                        db.close()
                    });
                }
            })
        }
        if(post.request == 'classInfoFind'){
            MongoClient.connect(mongoUrl,{useNewUrlParser:true},function (err,db) {
                if(err){
                    console.log('err');
                }
                var dbase = db.db('student');
                if(post.cno == ''){
                    dbase.collection('classinfo').find().toArray(function (err,result) {
                        if(err){
                            console.log('err')
                        }
                        db.close();
                        res.end(JSON.stringify(result));
                    });
                }else{
                    var whereStr = {cno:post.cno};
                    dbase.collection('classinfo').find(whereStr).toArray(function (err,result) {
                        if(err){
                            console.log('err')
                        }
                        db.close();
                        if(result[0] == undefined){
                            res.end('cfalse')
                        }else{
                            res.end(JSON.stringify(result));
                        }
                    });
                }
            })
        }
        if(post.request == 'classInfoCha'){
            MongoClient.connect(mongoUrl,{useNewUrlParser:true},function (err,db) {
                if(err){
                    console.log('err');
                }
                var dbase = db.db('student');
                if(post.cno == ''){
                    res.end('cemptyFind')
                }else{
                    var whereStr = {cno:post.cno};
                    if(post.cname != '' && post.tno != '' && post.ccode != ''){
                        dbase.collection('classinfo').find(whereStr).toArray(function (err,result) {
                            if (err) {
                                console.log('err')
                            }
                            if (result[0] == undefined) {
                                res.end('cnoOne')
                            } else {
                                var updataStr = {
                                    $set: {
                                        cname: post.cname,
                                        tno: post.tno,
                                        ccode: post.ccode
                                    }
                                };
                                dbase.collection('classinfo').updateOne(whereStr, updataStr, function (err, result) {
                                    if (err) {
                                        console.log('updateOne err')
                                    }else{
                                        console.log('更新成功')
                                    }
                                    db.close()
                                });
                                dbase.collection('classinfo').find().toArray(function (err,result) {
                                    if(err){
                                        console.log('find err')
                                    }else{
                                        res.end(JSON.stringify(result));
                                    }
                                    db.close();
                                })
                            }
                        });
                    }
                    if(post.cname == '' || post.tno == '' || post.ccode == ''){
                        dbase.collection('classinfo').deleteOne(whereStr,function (err,result) {
                            if(err) throw err;
                            console.log('删除成功');
                            db.close();
                        });
                        dbase.collection('classinfo').find().toArray(function (err,result) {
                            if(err){
                                console.log('find err')
                            }else{
                                res.end(JSON.stringify(result));
                            }
                            db.close();
                        })
                    }
                }
            })
        }
        if(post.request == 'studentFind'){
            MongoClient.connect(mongoUrl,{useNewUrlParser:true},function (err,db) {
                if(err){
                    console.log('err');
                }
                var dbase = db.db('student');
                if(post.sno == ''){
                    res.end('none');
                }else{
                    var whereStr = {sno:post.sno};
                    dbase.collection('studentinfo').find(whereStr).toArray(function (err,result) {
                        if(err){
                            console.log('err')
                        }
                        db.close();
                        if(result[0] == undefined){
                            res.end('false')
                        }else{
                            res.end(JSON.stringify(result));
                        }
                    });
                }
            })
        }
        if(post.request == 'classFind'){
            MongoClient.connect(mongoUrl,{useNewUrlParser:true},function (err,db) {
                if(err){
                    console.log('err');
                }
                var dbase = db.db('student');
                dbase.collection('classinfo').find().toArray(function (err,result) {
                    if(err){
                        console.log('err')
                    }
                    db.close();
                    res.end(JSON.stringify(result));
                });
            })
        }
        if(post.request == 'classSub'){
            MongoClient.connect(mongoUrl,{useNewUrlParser:true},function (err,db) {
                if(err){
                    console.log('connect err');
                }
                var dbase = db.db('student');
                for(var i = 0;i<post.cno.split(',').length;i++){
                    var data = {sno:post.sno,cno:post.cno.split(',')[i],grade:''};
                    dbase.collection('scinfo').insertOne(data,function (err,result) {
                        if(err){
                            console.log('insertOne err')
                        }else{
                            console.log('插入学生成功');
                        }
                        db.close();
                    });
                }
                dbase.collection('scinfo').find().toArray(function (err,result) {
                    if(err){
                        console.log('find err')
                    }else{
                        console.log(JSON.stringify(result));
                    }
                    db.close();
                })
            });
        }
        if(post.request == 'gradeFind'){
            MongoClient.connect(mongoUrl,{useNewUrlParser:true},function (err,db) {
                if(err){
                    console.log('err');
                }
                var dbase = db.db('student');
                dbase.collection('scinfo').find().toArray(function (err,result) {
                    if(err){
                        console.log('err')
                    }
                    db.close();
                    res.end(JSON.stringify(result));
                });
            })
        }
        if(post.request == 'gradeInfoFind'){
            MongoClient.connect(mongoUrl,{useNewUrlParser:true},function (err,db) {
                if(err){
                    console.log('err');
                }
                var dbase = db.db('student');
                var whereStr = {sno:post.sno+''};
                dbase.collection('scinfo').find(whereStr).toArray(function (err,result) {
                    if(err){
                        console.log('err')
                    }
                    db.close();
                    res.end(JSON.stringify(result));
                });
            })
        }
        if(post.request == 'gradeInfoSub'){
            MongoClient.connect(mongoUrl,{useNewUrlParser:true},function (err,db) {
                if(err){
                    console.log('connect err');
                }
                var dbase = db.db('student');
                var whereStr = {sno:post.sno+''};
                dbase.collection('scinfo').find(whereStr).toArray(function (err,result) {
                    if(err){
                        console.log('err')
                    }
                    var arr = [];
                    for(var i = 0 ; i<JSON.parse(JSON.stringify(result)).length;i++){
                        arr.push(JSON.parse(JSON.stringify(result))[i].cno)
                    }
                    for (var j = 0;j<arr.length;j++){
                        var whereStr = {cno:arr[j]+''};
                        var updataStr = {$set:{grade:post.grade.split(',')[j]}};
                        dbase.collection('scinfo').updateOne(whereStr,updataStr,function (err,res) {
                            if(err) throw err;
                            console.log('文档更新成功');
                            db.close()
                        })
                    }
                    db.close();
                });
                dbase.collection('scinfo').find().toArray(function (err,result) {
                    if(err){
                        console.log('find err')
                    }else{
                        console.log(JSON.stringify(result));
                    }
                    db.close();
                })
            });
        }
    })
}).listen(3010);