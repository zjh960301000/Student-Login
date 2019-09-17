var usename = document.getElementById('usename');
var li = document.getElementsByTagName('li');
var table = document.getElementsByTagName('table');
var hstart = document.getElementById('start');
var hstudentInfo = document.getElementById('studentInfo');
var hclassInfo = document.getElementById('classInfo');
var hgradeInfo = document.getElementById('gradeInfo');
var button = document.getElementsByTagName('button');
var input = document.getElementsByTagName('input');

var flagIndex = '';
var flagName = '';
var classArrN = [] ;

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


function classArr() {
    classArrN = [];
    for(var i = 0;i<input.length;i++){
        function x(i) {
            if(input[i].checked){
                classArrN.push(input[i].parentNode.parentNode.children[0].innerHTML)
            }
        }x(i);
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
    if (flagIndex == 'studentInfo' && flagName == 'find') {
        xmlhttp.send('request' + '=' + 'studentFind' + '&' +
            'sno' + '=' + input[0].value)
    }
    if(flagIndex == 'classInfo' && flagName == 'find'){
        xmlhttp.send('request' + '=' + 'classFind'+ '&' )
    }
    if(flagIndex == 'classInfo' && flagName == 'submit'){
        classArr();
        xmlhttp.send('request' + '=' + 'classSub' + '&' +
            'sno' + '=' + JSON.parse(document.cookie.split('=')[1]).sno+ '&' +
            'cno'+ '=' + classArrN)
    }
    if(flagIndex == 'gradeInfo' && flagName == 'submit'){
        xmlhttp.send('request' + '=' + 'gradeFind' + '&' +
            'sno' + '=' + JSON.parse(document.cookie.split('=')[1]).sno)
    }
    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            var flag = xmlhttp.responseText;
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
                    tbody.appendChild(tr);
                }
                table[0].appendChild(tbody);
            }
            function addClassTable() {
                var data = JSON.parse(flag);
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
                    var td5 = document.createElement('td');
                    td5.innerHTML = '<input type = "checkbox">';
                    tr.appendChild(td5);
                    tbody.appendChild(tr);
                }
                table[1].appendChild(tbody);
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
                    td3.innerHTML = data[i].grade;
                    tr.appendChild(td3);
                    tbody.appendChild(tr);
                }
                table[2].appendChild(tbody);
            }
            if (flag == 'none') {
                alert('请输入学号')
            }
            if(flag == 'false'){
                alert('学号错误')
            }
            if(flagIndex == 'studentInfo' && flagName == 'find' && flag != 'false' && flag != 'none'){
                addStudentTable()
            }
            if(flagIndex == 'classInfo' && flagName == 'find'){
                addClassTable()
            }
            if(flagIndex == 'gradeInfo' && flagName == 'submit'){
                addGradeTable()
            }
        }
    }
}



















useNameInput();
personalInformation();