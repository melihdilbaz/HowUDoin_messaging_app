package com.example.service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.model.Account;
import com.example.model.Message;
import com.example.repo.AccountRepo;
import com.example.repo.FriendRequestRepo;
import com.example.repo.MessageRepository;

@Service
public class MessageService {
	
	@Autowired private MessageRepository messageRepo;
	
	@Autowired private AccountRepo accountRepo;
	
	public String sendMessage(String senderEmail, String receiverEmail, String content) {
        // Create and save the message
        Message message = new Message();
        message.setSenderEmail(senderEmail);
        message.setReceiverEmail(receiverEmail);
        message.setContent(content);
        message.setTimestamp(LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")));
        
        // Account receiver = accountRepo.findByEmail(receiverEmail);
        Account sender = accountRepo.findByEmail(senderEmail);
        if (!sender.getFriends().contains(receiverEmail)) return "Before sending a message become friends";
        
        messageRepo.save(message);

        return "Message sent successfully";
    }
	
    public List<Message> getPrivateMessages(String senderEmail, String receiverEmail) {
        // Retrieve private messages between two users
    	List<Message> p1 = messageRepo.findBySenderEmailAndReceiverEmail(senderEmail, receiverEmail);
    	List<Message> p2 = messageRepo.findBySenderEmailAndReceiverEmail(receiverEmail, senderEmail);
    	// Combine the lists
        List<Message> combinedMessages = new ArrayList<>();
        combinedMessages.addAll(p1);
        combinedMessages.addAll(p2);

        // Sort by timestamp in ascending order
        return combinedMessages.stream()
                .sorted((m1, m2) -> m1.getTimestamp().compareTo(m2.getTimestamp()))
                .collect(Collectors.toList());
        
    }
    
	
}
