package com.firejq.entity;

/**
 * @Author firejq
 * @Date 2017/7/28
 */
public class Message {

	private Long id;

	private String fromUserName;

	private String messageContent;

	private String time;

	public Message(Long id, String fromUserName, String messageContent, String time) {
		this.id = id;
		this.fromUserName = fromUserName;
		this.messageContent = messageContent;
		this.time = time;
	}

	@Override
	public String toString() {
		return "Message{" + "id=" + id + ", fromUserName='" + fromUserName + '\'' + ", messageContent='" + messageContent + '\'' + ", time='" + time + '\'' + '}';
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getFromUserName() {
		return fromUserName;
	}

	public void setFromUserName(String fromUserName) {
		this.fromUserName = fromUserName;
	}

	public String getMessageContent() {
		return messageContent;
	}

	public void setMessageContent(String messageContent) {
		this.messageContent = messageContent;
	}

	public String getTime() {
		return time;
	}

	public void setTime(String time) {
		this.time = time;
	}
}
