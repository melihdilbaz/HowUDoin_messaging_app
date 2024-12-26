package com.example.model;

import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
@Data
@Document(collection = "groups")
public class Group {

    @Id
    private String id;
    private String name;
    @DBRef
    private List<Account> members; // List of user IDs
    @DBRef
    private List<Message> messages; // List of message IDs
    private String timestamp;

	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public List<Account> getMembers() {
		return members;
	}
	public void setMembers(List<Account> members) {
		this.members = members;
	}
	public List<Message> getMessages() {
		return messages;
	}
	public void setMessages(List<Message> messages) {
		this.messages = messages;
	}
	public String getId() {
		// TODO Auto-generated method stub
		return this.id;
	}
	public void addMember(Account member) {
		members.add(member);
	}
	public Group() {
		super();
		this.messages = new ArrayList<>();
		this.members = new ArrayList<>();
        this.setTimestamp(LocalDateTime.now().format(DateTimeFormatter.ISO_DATE_TIME));
	}
	public String getTimestamp() {
		return timestamp;
	}
	public void setTimestamp(String timestamp) {
		this.timestamp = timestamp;
	}

	
	

    // Getters and Setters
    
}
