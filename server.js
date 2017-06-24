/**
 * Created by Administrator on 2016/7/18.
 */
var http = require('http');
var express = require('express');
var request = require('request');
var querystring = require('querystring');
var moment = require('moment');
var app = express();
const PORT = 3000;    //端口
//创建一个服务器
server = http.createServer(app);
app.use(express.static(__dirname + '/dist'));
//监听80端口
server.listen(PORT);
console.log('server started at port:' + PORT);
var user_list = [];
var io = require('socket.io').listen(server);
io.on('connection', function(socket) {
    //接收并处理客户端发送的消息
    socket.on('send', function(data) {
        //将消息输出到控制台
        console.log(moment().format('HH:mm:ss') + '  ' + data.user + ":" + data.msg);
        if(data.msg.substring(0,1)==="#"){
            reply_by_tuling(data.msg.substring(1,data.length));
        }
        var reply = {
            user:data.user,
            time: moment().format('HH:mm:ss'),
            msg:data.msg,
            me:false
        };
        io.sockets.emit('broadcast', reply);

    });

    socket.on('login',function (user) {
        user_list.push({
            user:user,
            status:"1",
            img: "http://localhost:" + PORT + "/img/head.jpg"
        });
        io.sockets.emit('user', user_list);
        io.sockets.emit('broadcast', {
            user: "admin",
            time: moment().format('HH:mm:ss'),
            msg: "Welcome " + user,
            me: false
        });
    });

    socket.on('disconnect',function (data) {
        console.log("---disconnect---" + ":" + JSON.stringify(data));
    });
});
//图灵机器人自动回复
var reply_by_tuling = function (message) {
    var url = "http://www.tuling123.com/openapi/api";
    var formData = {
        key: "7e6c037f3c27f8b1156762ad1a863d36",
        info: message,
        userid: "214353555"
    };
    request.post(url,{form:formData} ,function (error, response, body) {
        io.sockets.emit('log', response);
        if (!error && response.statusCode === 200) {
            var reply = {
                user:"机器人小灵",
                time: moment().format('HH:mm:ss'),
                msg:JSON.parse(body).text,
                me:false
            };
            console.log(moment().format('HH:mm:ss') + '  ' + "机器人小灵" + ":" + JSON.parse(body).text);
            io.sockets.emit('broadcast', reply);
        }
    });

};