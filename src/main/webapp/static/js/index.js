/**
 * Created by firej on 2017/7/25.
 */
window.onload = function () {



    document.getElementById("state-info").innerHTML = "正在准备连接服务器……";
    var connect = function (url) {
        var websocket = null;

        if (window.WebSocket && window.WebSocket.prototype.send) {
            websocket = new WebSocket(url);
        } else if ('MozWebSocket' in window) {
            websocket = new MozWebSocket(url);
        } else {
            // websocket = new SockJS("http://127.0.0.1:8080/recordHandle/sockjs");
            alert("你的浏览器不支持websocket协议，请使用chrome重新打开");
            window.close();
        }

        websocket.onopen = function (event) {
            document.getElementById("state-info").innerHTML = "连接成功";
            console.log("Connected to WebSocket server.");

            // console.log("心跳检测启动");
            // var heartbeatws = new WebSocket("ws://127.0.0.1:8080/heartbeatHandle");
            // heartCheck.start(heartbeatws);

            pingToServer();


            document.getElementById("chat").onkeydown = function(KeyboardEvent) {
                if (KeyboardEvent.keyCode == 13) {//按下ENTER键时触发向服务器发送消息

                    var message = document.getElementById('chat').value;
                    if (message !== "") {
                        // var messageObj = {};//TODO convert to json
                        // websocket.send(messageObj);

                        websocket.send(message);
                        document.getElementById('chat').value = '';
                    }

                }
            };

        };

        //TODO
        websocket.onclose = function (event) {
            document.getElementById('chat').onkeydown = null;
            document.getElementById("state-info").innerHTML = "连接关闭，10秒后重新连接……";
            console.log("Disconnected from WebSocket server. It will reconnect after 10 seconds...");

            // 10秒后重新连接，实际效果：每10秒重连一次，直到连接成功
            setTimeout(function () {
                connect(url);
            }, 10000);

        };

        websocket.onmessage = function(message) {
            // heartCheck.reset();
            // obj = JSON.parse(message.data);


            console.log("client received a message: " + message);
            console.log("client received a message.data: " + message.data);
            console.log("client received the message.type: " + message.type);
            console.log("client received the message.typeof: " + typeof message.data);
            output.log(message.data);

        };

        //TODO
        websocket.onerror = function (event) {
            document.getElementById("state-info").innerHTML = "连接出错";
            console.log('Error occured: ' + event.data);

        };

        //监听窗口关闭事件，窗口关闭前，主动关闭websocket连接，防止连接还没断开就关闭窗口，server端会抛异常
        window.onbeforeunload = function () {
            websocket.close();
        };


        /**
         * 向服务器发送一个ping包
         */
        var pingToServer = function () {
            String.prototype.getBytes = function() {
                var bytes = [];
                for (var i = 0; i < this.length; i++) {
                    var charCode = this.charCodeAt(i);
                    var cLen = Math.ceil(Math.log(charCode)/Math.log(256));
                    for (var j = 0; j < cLen; j++) {
                        bytes.push((charCode << (j*8)) & 0xFF);
                    }
                }
                return bytes;
            };

            var payload = 'i';
            var buffer = new ArrayBuffer(payload.length);
            var intView = new Int8Array(buffer);
            for(var i = 0; i < intView.length; i++){
                intView[i] = payload.getBytes()[i];
            }
            websocket.send(intView);
            console.log("客户端已发送一个ping消息：【" + intView.toString() + "】");
        };


    };

    /**
     * 信息输出容器output
     * @type {{}}
     */
    var output = {};
    output.log = (function(message) {
        var op = document.getElementById('output');
        var p = document.createElement('p');
        p.style.wordWrap = 'break-word';
        p.innerHTML = message;
        op.appendChild(p);
        while (op.childNodes.length > 25) {
            op.removeChild(op.firstChild);
        }
        op.scrollTop = op.scrollHeight;
    });


    var url = "ws://127.0.0.1:8080/messageHandler";
    connect(url);


    // var heartbeat = new WebSocket("ws://127.0.0.1:8080/heartbeatHandler");
    // heartbeat.onopen = function (event) {
    //     console.log("心跳检测连接成功");
    // };
    // heartbeat.onclose = function (event) {
    //     console.log("心跳检测失去连接");
    // };
    // heartbeat.onmessage = function (event) {
    //     console.log("收到心跳ping信息:" + event.data);
    //     if( heartbeat.bufferedAmount == 0 ){
    //         heartbeat.send("我是客户端");
    //         console.log("已发送一个心跳信息");
    //     }
    // };


};


