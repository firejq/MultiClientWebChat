/**
 * Created by firej on 2017/7/25.
 */
window.onload = function () {



    document.getElementById("state-info").innerHTML = "正在准备连接服务器……";
    var connect = function (url) {
        var websocket = null;

        // websocket = new SockJS("http://127.0.0.1:8080/recordHandle/sockjs");

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
            console.log("client received a message: " + message.data);
            output.log(message.data);

        };

        websocket.onerror = function (event) {
            document.getElementById("state-info").innerHTML = "连接出错";
            console.log('Error occured: ' + event.data);

        };

        //监听窗口关闭事件，窗口关闭前，主动关闭websocket连接，防止连接还没断开就关闭窗口，server端会抛异常
        window.onbeforeunload = function () {
            websocket.close();
        }
    };

    /**
     * 心跳检测工具类
     * @type {{timeout: number, timeoutObj: null, reset: reset, start: start}}
     */
    // var heartCheck = {
    //     timeout: 10000,//20s
    //     timeoutObj: null,
    //     reset: function() {
    //         clearTimeout(this.timeoutObj);
    //         this.start();
    //     },
    //     start: function(heartbeatws) {
    //
    //         this.timeoutObj = setTimeout(function() {
    //             heartbeatws.send("HeartBeat");
    //             console.log("已发送一个HeartBeat");
    //
    //             //if 没收到回应 就是连接已中断，检测传输的连接的readystate，根据状态做出选择，如重连/关闭
    //
    //         }, this.timeout);
    //     }
    // };

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


