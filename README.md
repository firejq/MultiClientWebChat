# MultiClientWebChat
基于 [Spring Websocket][1] 和心跳保活重连的多人网页聊天室

> Only for practice

[1]:https://docs.spring.io/spring/docs/current/spring-framework-reference/html/websocket.html "Spring Websocket"
## Feature and Achieve

### Schedule
- [x] Multiple client chat
- [x] Client reconnecting mechanism
- [ ] Client keep alive and reconnect using heartbeat
- [ ] MessageQueue broke

### Multiple client chat
- 当一个客户端打开，即建立一个与服务器的websocket连接，同时服务端将此 sessionId 加入到消息队列中 
- 当一个客户端发送信息时，服务器接收信息并将其广播给连接的所有客户端
- 当一个客户端断开时，服务器将其从消息队列中移除

### Client reconnecting mechanism
- 若 client-server 通信发生中断，触发客户端onclose event，主动重连

### Client keep alive and reconnect using heartbeat

存在这样的情况：

- 超过一定的时间客户端和服务器之间没有发生任何消息传输，导致websocket连接自动断开。

- websocket通信出错，但无法触发客户端 close 事件，导致客户端无法获知中断状况，编写在onclose中的重连逻辑也因此失效。

解决方法：设计客户端心跳保活+重连机制

客户端设置计时器，每次收到任何信息都将计时器归零，当计时器到时，发送一个心跳包（作用①保活，②检测连接状态），若服务器返回响应，则将计时器归零后重新启动；若服务器响应时间超时（认定为没有响应），则说明连接中断，执行重连逻辑。

<img src="http://otaivnlxc.bkt.clouddn.com/image/2017/07/websocket-%E5%AE%A2%E6%88%B7%E7%AB%AF%E4%BF%9D%E6%B4%BB+%E9%87%8D%E8%BF%9E%E6%9C%BA%E5%88%B6%E8%AE%BE%E8%AE%A1.png">

### MessageQueue broke
- 使用专用消息队列作为消息中间层
