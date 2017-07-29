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


            console.log("心跳检测启动");
            heartCheck.start();

            // pingToServer();


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
        // websocket.onclose = function (event) {
        //     document.getElementById('chat').onkeydown = null;
        //     document.getElementById("state-info").innerHTML = "连接关闭，10秒后重新连接……";
        //     console.log("Disconnected from WebSocket server. It will reconnect after 10 seconds...");
        //
        //     // 10秒后重新连接，实际效果：每10秒重连一次，直到连接成功
        //     setTimeout(function () {
        //         connect(url);
        //     }, 10000);
        //
        // };

        websocket.onmessage = function(message) {
            // 无论收到什么信息，说明当前连接正常，将心跳检测的计时器重置
            //TODO 客户端主动发ping的话不完善（如果客户端收不到回复，如何处理）
            heartCheck.reset();


            console.log("client received a message.data: " + message.data);
            if (message.data !== "hb_ok") {
                // 不要将ping的答复信息输出
                output.log(message.data);
            }


        };

        //TODO
        // websocket.onerror = function (event) {
        //     document.getElementById("state-info").innerHTML = "连接出错";
        //     console.log('Error occured: ' + event.data);
        //
        // };

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
            for(var i = 0; i < intView.length; i++) {
                intView[i] = payload.getBytes()[i];
            }
            websocket.send(intView);
            console.log("客户端已向服务器发送一个ping消息：【" + intView.toString() + "】");
        };


        /**
         * 心跳检测
         * 若30秒内没有接收到任何来自服务器的信息，则向服务器发起一个ping包
         * @type {{timeout: number, timeoutObj: null, serverTimeoutObj: null, reset: reset, start: start}}
         */
        var heartCheck = {
            timeout: 40000, //计时器设定为40s
            timeoutObj: null,
            serverTimeoutObj: null,
            reset: function() {
                clearTimeout(this.timeoutObj);
                clearTimeout(this.serverTimeoutObj);
                this.start();
            },
            start: function() {
                var self = this;
                this.timeoutObj = setTimeout(function() {
                    //向服务器发送ping消息
                    pingToServer();

                    self.serverTimeoutObj = setTimeout(function(){
                        websocket.close();//如果onclose会执行reconnect，我们执行ws.close()就行了.如果直接执行reconnect 会触发onclose导致重连两次
                    }, self.timeout);
                }, this.timeout);
            }
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


    /**
     * 执行入口
     * @type {string}
     */
    var url = "ws://127.0.0.1:8080/messageHandler";
    connect(url);



};


