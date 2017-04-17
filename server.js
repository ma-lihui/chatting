/**
 * Created by Administrator on 2016/7/18.
 */
var http = require('http');
var express = require('express');
var request = require('request');
var querystring = require('querystring');
var app = express();
//创建一个服务器
server = http.createServer(app);
app.use(express.static(__dirname));
//监听80端口
server.listen(88);
console.log('server started');
var user_list = [];
var io = require('socket.io').listen(server);
io.on('connection', function(socket) {
    //接收并处理客户端发送的foo事件
    socket.on('send', function(data) {
        //将消息输出到控制台
        console.log(new Date().getHours()+':'+new Date().getMinutes()+':'+new Date().getSeconds()+'  '+data.user+":"+data.msg);
        if(data.msg.substring(0,1)=="#"){
            reply_by_tuling(data.msg.substring(1,data.length));
        }
        var reply = {
            user:data.user,
            time:new Date().getHours()+':'+new Date().getMinutes()+':'+new Date().getSeconds(),
            msg:data.msg,
            me:false
        };
        io.sockets.emit('broadcast', reply);


    });
    socket.on('login',function (user) {
        user_list.push({
            user:user,
            status:"1",
            img:"http://cs625730.vk.me/v625730358/1126a/qEjM1AnybRA.jpg"
        });
        io.sockets.emit('user', user_list);
    });

    socket.on('disconnect',function (data) {
        console.log("---disconnect---"+":"+socket);
        io.sockets.emit('disconnect');
    });
});

var reply_by_tuling = function (message) {
    var url = "http://www.tuling123.com/openapi/api";
    var formData = {
        key: "7e6c037f3c27f8b1156762ad1a863d36",
        info: message,
        userid: "214353555"
    };
    request.post(url,{form:formData} ,function (error, response, body) {
        io.sockets.emit('log', response);
        if (!error && response.statusCode == 200) {
            // console.log(body);// Show the HTML for the Google homepage.
            var reply = {
                user:"机器人小灵",
                time:new Date().getHours()+':'+new Date().getMinutes()+':'+new Date().getSeconds(),
                msg:JSON.parse(body).text,
                me:false
            };
            console.log(new Date().getHours()+':'+new Date().getMinutes()+':'+new Date().getSeconds()+'  '+"机器人小灵"+":"+JSON.parse(body).text);
            io.sockets.emit('broadcast', reply);
        }
    });

    // request({
    //     url: url,
    //     method: "POST",
    //     path: "/openapi/api",
    //     json: true,   // <--Very important!!!
    //     body: formData,
    //     headers: {
    //         "content-type": "application/json"  // <--Very important!!!
    //     }
    // }, function (error, response, body){
    //     io.sockets.emit('log', response);
    //     io.sockets.emit('broadcast', response.text);
    //     console.log(response);
    // });

};