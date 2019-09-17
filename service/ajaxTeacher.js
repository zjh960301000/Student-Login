var usename = document.getElementById('usename');
var hstart = document.getElementById('start');
var hstudentInfo = document.getElementById('studentInfo');
var hclassInfo = document.getElementById('classInfo');
var hgradeInfo = document.getElementById('gradeInfo');

var button = document.getElementsByTagName('button');
var input = document.getElementsByTagName('input');
var li = document.getElementsByTagName('li');
var table = document.getElementsByTagName('table');

var flagIndex = '';
var flagName = '';
var classGradeN = [];


function useNameInput() {
    var x = document.cookie;
    var t = x.split('=')[1];
    if(x&&t){
        var jsonData = JSON.parse(t);
        usename.innerHTML = jsonData.username;
    }
}
function personalInformation() {
    li[0].onclick = function () {
        hstart.style.display = 'block';
        hstudentInfo.style.display = 'none';
        hclassInfo.style.display = 'none';
        hgradeInfo.style.display = 'none';
        flagIndex = '';
        flagName = '';
    };
    li[1].onclick = function () {
        hstart.style.display = 'none';
        hstudentInfo.style.display = 'block';
        hclassInfo.style.display = 'none';
        hgradeInfo.style.display = 'none';
        buttonOn();
    };
    li[2].onclick = function () {
        hstart.style.display = 'none';
        hstudentInfo.style.display = 'none';
        hclassInfo.style.display = 'block';
        hgradeInfo.style.display = 'none';
        buttonOn();
    };
    li[3].onclick = function () {
        hstart.style.display = 'none';
        hstudentInfo.style.display = 'none';
        hclassInfo.style.display = 'none';
        hgradeInfo.style.display = 'block';
        buttonOn();
    }
}
function buttonOn() {
    flagIndex = '';
    flagName = '';
    for(var i = 0;i<button.length;i++){
        button[i].onclick = function () {
            flagIndex = this.name;
            flagName = this.innerHTML;
            ajaxTeacher('http://127.0.0.1:3010')
        }
    }
}
function classGrade() {
    for(var i = 11;i<input.length;i++){
        function x(i) {
            classGradeN.push(input[i].value)
        }x(i)
    }
}




function ajaxTeacher(URL) {
    var xmlhttp;
    if (window.XMLHttpRequest) {
        xmlhttp = new XMLHttpRequest();
        xmlhttp.withCredentials = true;
    } else {
        xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }


    xmlhttp.open('post', URL, true);
    if (flagIndex == 'studentInfo' && flagName == 'submit') {
        xmlhttp.send('request' + '=' + 'studentInfoSub' + '&' +
            'sno' + '=' + input[0].value + '&' +
            'sname' + '=' + input[1].value + '&' +
            'age' + '=' + input[2].value + '&' +
            'sex' + '=' + input[3].value + '&' +
            'dept' + '=' + input[4].value + '&' +
            'class' + '=' + input[5].value + '&' +
            'pwd' + '=' + '123456');
    }
    if (flagIndex == 'studentInfo' && flagName == 'find') {
        xmlhttp.send('request' + '=' + 'studentInfoFind' + '&' +
            'sno' + '=' + input[0].value)
    }
    if (flagIndex == 'studentInfo' && flagName == 'change') {
        xmlhttp.send('request' + '=' + 'studentInfoCha' + '&' +
            'sno' + '=' + input[0].value + '&' +
            'sname' + '=' + input[1].value + '&' +
            'age' + '=' + input[2].value + '&' +
            'sex' + '=' + input[3].value + '&' +
            'dept' + '=' + input[4].value + '&' +
            'class' + '=' + input[5].value + '&')
    }
    if (flagIndex == 'classInfo' && flagName == 'submit') {
        xmlhttp.send('request' + '=' + 'classInfoSub' + '&' +
            'cno' + '=' + input[6].value + '&' +
            'cname' + '=' + input[7].value + '&' +
            'tno' + '=' + input[8].value + '&' +
            'ccode' + '=' + input[9].value)
    }
    if(flagIndex == 'classInfo' && flagName == 'find'){
        xmlhttp.send('request' + '=' + 'classInfoFind' + '&' +
            'cno' + '=' + input[6].value)
    }
    if(flagIndex == 'classInfo' && flagName == 'change'){
        xmlhttp.send('request' + '=' + 'classInfoCha' + '&' +
            'cno' + '=' + input[6].value + '&' +
            'cname' + '=' + input[7].value + '&' +
            'tno' + '=' + input[8].value + '&' +
            'ccode' + '=' + input[9].value)
    }
    if(flagIndex == 'gradeInfo' && flagName == 'find'){
        xmlhttp.send('request' + '=' + 'gradeInfoFind' + '&' +
            'sno' + '=' + input[10].value)
    }
    if(flagIndex == 'gradeInfo' && flagName == 'submit'){
        classGrade();
        xmlhttp.send('request' + '=' + 'gradeInfoSub' + '&' +
            'sno' + '=' + input[10].value+ '&' +
            'grade' + '=' + classGradeN)
    }


    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            function addStudentTable() {
                var data = JSON.parse(flag);
                if (table[0].children[2]) {
                    table[0].removeChild(table[0].children[2]);
                }
                var tbody = document.createElement('tbody');
                for (var i = 0; i < data.length; i++) {
                    var tr = document.createElement('tr');
                    var td1 = document.createElement('td');
                    td1.innerHTML = data[i].sno;
                    tr.appendChild(td1);
                    var td2 = document.createElement('td');
                    td2.innerHTML = data[i].sname;
                    tr.appendChild(td2);
                    var td3 = document.createElement('td');
                    td3.innerHTML = data[i].age;
                    tr.appendChild(td3);
                    var td4 = document.createElement('td');
                    td4.innerHTML = data[i].sex;
                    tr.appendChild(td4);
                    var td5 = document.createElement('td');
                    td5.innerHTML = data[i].dept;
                    tr.appendChild(td5);
                    var td6 = document.createElement('td');
                    td6.innerHTML = data[i].sclass;
                    tr.appendChild(td6);
                    var td7 = document.createElement('td');
                    td7.innerHTML = data[i].pwd;
                    tr.appendChild(td7);
                    tbody.appendChild(tr);
                }
                table[0].appendChild(tbody);
            }
            function addClassTable() {
                var data = JSON.parse(flag);
                if (data[0].cno != '') {
                    if (table[1].children[2]) {
                        table[1].removeChild(table[1].children[2]);
                    }
                    var tbody = document.createElement('tbody');
                    for (var i = 0; i < data.length; i++) {
                        var tr = document.createElement('tr');
                        var td1 = document.createElement('td');
                        td1.innerHTML = data[i].cno;
                        tr.appendChild(td1);
                        var td2 = document.createElement('td');
                        td2.innerHTML = data[i].cname;
                        tr.appendChild(td2);
                        var td3 = document.createElement('td');
                        td3.innerHTML = data[i].tno;
                        tr.appendChild(td3);
                        var td4 = document.createElement('td');
                        td4.innerHTML = data[i].ccode;
                        tr.appendChild(td4);
                        tbody.appendChild(tr);
                    }
                    table[1].appendChild(tbody);
                }
            }
            function addGradeTable() {
                var data = JSON.parse(flag);
                if (table[2].children[2]) {
                    table[2].removeChild(table[2].children[2]);
                }
                var tbody = document.createElement('tbody');
                for (var i = 0; i < data.length; i++) {
                    var tr = document.createElement('tr');
                    var td1 = document.createElement('td');
                    td1.innerHTML = data[i].sno;
                    tr.appendChild(td1);
                    var td2 = document.createElement('td');
                    td2.innerHTML = data[i].cno;
                    tr.appendChild(td2);
                    var td3 = document.createElement('td');
                    td3.innerHTML = '<input type="text">';
                    tr.appendChild(td3);
                    tbody.appendChild(tr);
                }
                table[2].appendChild(tbody);
            }
            var flag = xmlhttp.responseText;
            if (flag == 'delet') {
                alert('删除成功')
            }
            if (flag == 'true') {
                alert('创建成功')
            }
            if (flag == 'existing') {
                alert('学号重复')
            }
            if (flag == 'empty') {
                alert('内容为空')
            }
            if (flag == 'emptyFind') {
                alert('请输入学号')
            }
            if(flag == 'cemptyFind'){
                alert('请输入编号')
            }
            if (flag == 'noOne') {
                alert('该学生不存在')
            }
            if (flag == 'cnoOne') {
                alert('该课程不存在')
            }
            if (flag == 'false') {
                alert('该学生不存在')
            }
            if (flag == 'cfalse') {
                alert('该课程不存在')
            }
            if (flag == 'cexisting') {
                alert('课程编号重复')
            }
            if (flagIndex == 'studentInfo' && flagName == 'find' && input[0].value == '') {
                addStudentTable()
            }
            if (flagIndex == 'studentInfo' && flagName == 'find' && input[0].value != '' && flag != 'false') {
                var stu = JSON.parse(flag)[0];
                input[1].value = stu.sname;
                input[2].value = stu.age;
                input[3].value = stu.sex;
                input[4].value = stu.dept;
                input[5].value = stu.sclass
            }
            if (flagIndex == 'studentInfo' && flagName == 'submit' && input[0].value != '' && flag != 'existing') {
                addStudentTable()
            }
            if (flagIndex == 'studentInfo' && flagName == 'change' && flag != 'emptyFind' && flag != 'noOne'){
                addStudentTable()
            }
            if(flagIndex == 'classInfo' && flagName == 'submit' && flag != 'empty' && flag != 'cexisting'){
                addClassTable()
            }
            if(flagIndex == 'classInfo' && flagName == 'find' && input[6].value ==''){
                addClassTable()
            }
            if(flagIndex == 'classInfo' && flagName == 'find' && input[6].value !='' && flag != 'cfalse'){
                var cla = JSON.parse(flag)[0];
                input[7].value = cla.cname;
                input[8].value = cla.tno;
                input[9].value = cla.ccode;
            }
            if(flagIndex == 'classInfo' && flagName == 'change' && flag != 'cemptyFind' && flag != 'cnoOne'){
                addClassTable()
            }
            if(flagIndex == 'gradeInfo' && flagName == 'find' && input[10].value != ''){
                addGradeTable()
            }
        }
    }
}








personalInformation();
useNameInput();