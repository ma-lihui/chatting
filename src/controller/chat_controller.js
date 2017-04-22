/**
 * Created by Administrator on 2016/7/18.
 */
angular.module('chat',[])
    .controller('live_chat',["$scope",function ($scope) {
        $scope.submit_user = function () {
            if ($scope.user) {
                socket.emit('login', $scope.user);
                $scope.login = true;
            }
        };
        var claerResizeScroll = function() {
            $(".messages").getNiceScroll(0).resize();
            $(".messages").getNiceScroll(0).doScrollTop(999999, 999);
        };
        var socket = io.connect('http://localhost:88');
        $scope.send = function () {
            if($scope.send_message!=''&&$scope.send_message!=undefined) {
                // console.log($scope.message);
                var msg_data = {
                    user:$scope.user,
                    msg:$scope.send_message
                };
                socket.emit('send', msg_data);
                $scope.message.push({
                    user:$scope.user,
                    time:new Date().toLocaleTimeString(),
                    msg:$scope.send_message,
                    me:true
                });
                $("#texxt").focus();
            }

            $scope.send_message = '';
            claerResizeScroll();
        };
        socket.on('broadcast',function (data) {
            // console.log(data);
            if(data.user!=$scope.user){
                $scope.message.push(data);
                $scope.$apply();
            }
            claerResizeScroll();
        });
        socket.on('log',function (data) {
            console.log(data);
        });
        $scope.key = function (event) {
            if (event.keyCode === 13) {
                $scope.send();
            }
        };
        // $scope.list_friends = [];
        socket.on('user',function (user) {
            // console.log(user);
            $scope.list_friends = user;
            $scope.$apply();
        });

        $scope.message = [];

    }]).filter('online_status',function () {
    return function (status) {
        if(status==1){
            return "在线"
        }
        if(status==0){
            return "离线"
        }
    }
});
