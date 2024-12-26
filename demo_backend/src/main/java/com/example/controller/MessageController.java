package com.example.controller;

import com.example.model.Message;
import com.example.model.MessagePayload;
import com.example.service.MessageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/messages")
public class MessageController {

    @Autowired
    private MessageService messageService;

    // 1. Send a Message
    @PostMapping("/send")
    public String sendMessage(@RequestParam("rEmail") String receiverEmail, @RequestBody MessagePayload message) {
    	Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName(); // Get the email (username in UserDetails)
        String content = message.getContent();
    	return messageService.sendMessage(email, receiverEmail, content);
    }

    // 2. Retrieve Conversation History
    @GetMapping("/")
    public List<Message> getPrivateMessages (@RequestParam("friend") String friend) {
    	Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName(); // Get the email (username in UserDetails)
        return messageService.getPrivateMessages(email, friend);
    }
    
}
