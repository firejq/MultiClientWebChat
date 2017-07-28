package com.firejq.websocket.handler;

import org.springframework.web.socket.*;

import java.nio.ByteBuffer;

/**
 * @Author firejq
 * @Date 2017/7/27
 */
public class HeartbeatHandler implements WebSocketHandler {
	@Override
	public void afterConnectionEstablished(WebSocketSession webSocketSession) throws Exception {
		//发送心跳包做心跳检测
//		while (true) {
//			byte[] bs = new byte[1];
//			bs[0]='i';
//			ByteBuffer byteBuffer = ByteBuffer.wrap(bs);
////			webSocketSession.sendMessage(new PingMessage(byteBuffer));
//			webSocketSession.sendMessage(new TextMessage("测试"));
//			System.out.println("已发送一个ping");
//			Thread.sleep(3000);
//		}


	}

	@Override
	public void handleMessage(WebSocketSession webSocketSession, WebSocketMessage<?> webSocketMessage) throws Exception {


		System.out.println("收到浏览器的pong " + webSocketMessage.getPayload());


	}

	@Override
	public void handleTransportError(WebSocketSession webSocketSession, Throwable throwable) throws Exception {

	}

	@Override
	public void afterConnectionClosed(WebSocketSession webSocketSession, CloseStatus closeStatus) throws Exception {

	}

	@Override
	public boolean supportsPartialMessages() {
		return false;
	}
}
