function ajaxLogin(URL) {
    var xmlhttp;
    var usename = document.getElementById('usename');
    var pwd = document.getElementById('pwd');
    var input = document.getElementsByTagName('input');
    var idName = ''
    for(var i = 0;i<input.length;i++){
        if(input[i].checked){
            idName = input[i].className;
            console.log(idName)
        }
    }

    if(window.XMLHttpRequest){
        xmlhttp = new XMLHttpRequest();
        xmlhttp.withCredentials = true;
    }else{
        xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }

    xmlhttp.open('post',URL,true);
    xmlhttp.send('request'+'='+'login'+'&'+
        'usename'+'='+usename.value+'&'+
        'pwd'+'='+pwd.value+'&'+
        'idName'+'='+idName);

    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState==4 && xmlhttp.status==200){
            var flag = xmlhttp.responseText;
            if(flag == 'true' && idName =='teacher'){
                var x = document.cookie;
                if(x){
                    var t = x.split('=')[1];
                    var jsonDataT = JSON.parse(t);
                    if(pwd.value == jsonDataT.pwd){
                        location.href = 'indexteacher.html'
                    }else{
                        alert('密码错误')
                    }
                }
            }else if(flag == 'true' && idName =='student'){
                console.log(1);
                var z = document.cookie;
                if(z){
                    var e = z.split('=')[1];
                    var jsonDataS = JSON.parse(e);
                    if(pwd.value == jsonDataS.pwd){
                        location.href = 'indexstudent.html'
                    }else{
                        alert('密码错误')
                    }
                }
            }else if(flag == 'false'){
                alert('查无此人')
            }else{
                alert('你是个什么东西')
            }
        }
    };
}