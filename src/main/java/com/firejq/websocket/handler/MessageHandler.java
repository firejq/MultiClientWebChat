package com.firejq.websocket.handler;

import ch.qos.logback.core.db.dialect.SybaseSqlAnywhereDialect;
import com.google.gson.GsonBuilder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.socket.*;

import java.io.IOException;
import java.nio.Buffer;
import java.nio.ByteBuffer;
import java.util.ArrayList;
import java.util.List;

/**
 * @Author firejq
 * @Date 2017/7/28
 */
public class MessageHandler implements WebSocketHandler {
	//连接队列
	private static final List<WebSocketSession> sessions = new ArrayList<>();


	@Override
	public void afterConnectionEstablished(WebSocketSession webSocketSession) throws Exception {

		//TODO 完善心跳检测方案 此处只是测试
		//TODO 进度：客户端主动发ping的话不完善（如果客户端收不到回复，如何处理），服务端主动发ping的还没做
//		this.sendPingMessage(webSocketSession);

		//加入连接队列
		sessions.add(webSocketSession);
		//		System.out.println(webSocketSession);


		webSocketSession.sendMessage(new TextMessage("你与服务器连接成功了！你的sessionID为【" + webSocketSession.getId() + "】"));

		StringBuilder sessionIds = new StringBuilder("");
		for (WebSocketSession session : sessions) {
			session.sendMessage(new TextMessage("用户" + webSocketSession.getId() + "已加入聊天室"));
			sessionIds.append(" " + session.getId() + " ");
		}

		System.out.println("一个客户端连接上了服务器！webSocketSessionId为【" + webSocketSession.getId() + "】, "
				+ "当前服务器session队列中有:【" + sessionIds + "】");

		webSocketSession.sendMessage(new TextMessage("当前聊天室有id为【" + sessionIds + "】的用户"));



	}

	@Override
	public void handleMessage(WebSocketSession webSocketSession, WebSocketMessage<?> webSocketMessage) throws Exception {
		//		Record record = new Gson().fromJson(webSocketMessage.getPayload().toString(), Record.class);

		Object payload = webSocketMessage.getPayload();

		if (payload instanceof ByteBuffer) {
			System.out.println("服务器收到来自sessionId【" + webSocketSession.getId() + "】的ping消息：【" + payload + "】");

			//由于发送pingMessage的话chrome会自动答复，造成死循环，所以得发送TextMessage/binaryMessage作为服务器得pong答复
			//TODO binaryMessage还未测试
//			webSocketSession.sendMessage(new TextMessage("hb_ok"));
//			System.out.println("已答复：【hb_ok】");
		}

		if (payload instanceof String) {
			System.out.println("服务器收到来自sessionId【" + webSocketSession.getId() + "】的信息：【" + payload + "】");

			this.sendToAll("用户" + webSocketSession.getId() + "说: 【" + payload + "】");
		}



	}

	@Override
	public void handleTransportError(WebSocketSession webSocketSession, Throwable throwable) throws Exception {
		System.out.println("WebsocketSessionId为【 " + webSocketSession.getId() + "】的连接出错！");


	}

	@Override
	public void afterConnectionClosed(WebSocketSession webSocketSession, CloseStatus closeStatus) throws Exception {

		System.out.println("WebsocketSessionId为【" + webSocketSession.getId() + "】的连接关闭, reason:【" + closeStatus
				.getReason() + "】, code:【" + closeStatus.getCode() + "】");
		//将该连接从session队列中移除
		sessions.remove(webSocketSession);
		System.out.println("已将WebsocketSessionId为【" + webSocketSession.getId() + "】的连接从连接队列中移除！");

		if (!sessions.isEmpty()) {
			this.sendToAll("用户" + webSocketSession.getId() + "已退出聊天室。");
		} else {
			System.out.println("当前连接客户端数量为0！");
		}
	}

	@Override
	public boolean supportsPartialMessages() {
		return false;
	}




	/**
	 * 广播给所有客户端
	 * @param messaage
	 * @throws Exception
	 */
	private void sendToAll(String messaage) throws Exception {
		for (WebSocketSession session : sessions) {
			session.sendMessage(new TextMessage("" + messaage));
		}
	}

	/**
	 * 向客户端发送一个ping/pong信息
	 * @param webSocketSession
	 * @throws Exception
	 */
	private void sendPingMessage(WebSocketSession webSocketSession) throws Exception {
		byte[] bs = new byte[1];
		bs[0] = 'i';//TODO Why is 'i' ?
		ByteBuffer byteBuffer = ByteBuffer.wrap(bs);
		PingMessage pingMessage = new PingMessage(byteBuffer);
		webSocketSession.sendMessage(pingMessage);
		System.out.println("已发送一个ping包：【" + pingMessage.toString() + "】");
	}



}
