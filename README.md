## MultiClientWebChat
&nbsp;&nbsp;&nbsp;&nbsp;基于 [Spring Websocket][1] 的多人网页聊天室

&nbsp;&nbsp;&nbsp;&nbsp;Only for practice

[1]:https://docs.spring.io/spring/docs/current/spring-framework-reference/html/websocket.html "sad"
### Feature and Achieve
- [x] Multiple client chat
    - 当一个客户端打开，即建立一个与服务器的websocket连接，同时服务端将此 sessionId 加入到消息队列中 
    - 当一个客户端发送信息时，服务器接收信息并将其广播给连接的所有客户端
    - 当一个客户端断开时，服务器将其从消息队列中移除
- [x] Client reconnecting mechanism
    - 若 client  - server 通信发生中断，触发客户端onclose event，主动重连
- [ ] Two-way heartbeat detection
    - 若 client  - server 通信发生中断但无法触发客户端onclose event，客户端无法获知中断情况
    - 使用应用层的双边心跳检测，使 client / server 得知中断情况
    -[x] 客户端每隔n秒发送一个心跳包，若服务器响应时间超时，则说明连接中断；
    -[ ] 服务器另开一个线程每隔n秒检测任务队列是否空闲，若空闲，加入一个发送心跳包到每个客户端的任务，计算响应时间；
- [ ] MessageQueue broke
    - 使用专用消息队列作为消息中间层



