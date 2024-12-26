package com.example.service;

import com.example.model.*;

import com.example.repo.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class GroupService {

    @Autowired
    private GroupRepository groupRepo;

    @Autowired
    private MessageRepository messageRepo;
    
    @Autowired
    private AccountRepo accountRepo;

    public String createGroup(String groupName, List<Account> members) {
        // Create and save a new group
        Group group = new Group();
        group.setName(groupName);
        group.setMembers(members);
        
        groupRepo.save(group);
        String str = "";
        for (Account member : members) {
        	str += member.getEmail();
        	member.addGroup(group.getId());
            accountRepo.save(member); 
        }
        
        return "Group created successfully.";
    }

    public String addMember(String groupId, String userEmail) {
        // Find the group and add a new member
        Optional<Group> groupOpt = groupRepo.findById(groupId);

        if (groupOpt.isEmpty()) {
            return "Group not found.";
        }

        Group group = groupOpt.get();
        if (group.getMembers().contains(accountRepo.findByEmail(userEmail))) {
            return "User is already a member of the group.";
        }
        
        Account member = accountRepo.findByEmail(userEmail);
        member.addGroup(groupId);
        accountRepo.save(member); // Save changes to the database

        group.addMember(member);
        groupRepo.save(group);

        return "User added to group successfully.";
    }

    public String sendMessage(String groupId, String senderEmail, MessagePayload content) {
        // Find the group
        Optional<Group> groupOpt = groupRepo.findById(groupId);

        if (groupOpt.isEmpty()) {
            return "Group not found.";
        }

        Group group = groupOpt.get();

        // Create and save the message
        Message message = new Message();
        message.setSenderEmail(senderEmail);
        message.setGroupId(groupId);
        message.setContent(content.getContent());
        message.setTimestamp(LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")));

        messageRepo.save(message);

        // Add the message ID to the group's messages
        group.getMessages().add(message);
        groupRepo.save(group);

        return "Message sent successfully to group.";
    }

    public ResponseEntity<?> getGroupMessages(String groupId) {
        // Find the group and return the list of message IDs
        Optional<Group> groupOpt = groupRepo.findById(groupId);

        if (groupOpt.isEmpty()) {
            return ResponseEntity.status(403).body("Groups not found");
        }

        Group group = groupOpt.get();
        return ResponseEntity.ok(group.getMessages());
    }

    public ResponseEntity<?> getGroupMembers(String groupId) {
        // Find the group and return the list of member IDs
        Optional<Group> groupOpt = groupRepo.findById(groupId);

        if (groupOpt.isEmpty()) {
            return ResponseEntity.status(403).body("Groups not found");
        }

        Group group = groupOpt.get();
        return ResponseEntity.ok(group.getMembers());
    }
    
    public ResponseEntity<?> getAll(String email) {
        // Find the group and return the list of member IDs
        Account member = accountRepo.findByEmail(email);
        List<String> groups = member.getGroups();
       
        if (groups == null || groups.isEmpty()) {
            return ResponseEntity.status(403).body("No groups joined yet");
        }

        List<Group> groupObjects = groups.stream()
            .map(groupRepo::findById)
            .filter(Optional::isPresent) // Filter out missing groups
            .map(Optional::get) // Extract the Group object
            .collect(Collectors.toList());

        return ResponseEntity.ok(groupObjects);
    }
    
}

