package com.example.controller;

import com.example.repo.*;
import com.example.model.Account;
import com.example.model.Group;
import com.example.model.Message;
import com.example.model.MessagePayload;
import com.example.service.GroupService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/groups")
public class GroupController {

    @Autowired
    private GroupService groupService;
    
    @Autowired
    private AccountRepo accountRepo;

    // 1. Create a Group
    @PostMapping("/create")
    public String createGroup(@RequestParam("name") String groupName, @RequestBody List<String> memberEmails) {
    	Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName(); // Get the email (username in UserDetails)
        
     // Fetch accounts for all member emails
        List<Account> members = memberEmails.stream()
                .map(accountRepo::findByEmail)
                .collect(Collectors.toList());
        members.add(accountRepo.findByEmail(email));
        
        return groupService.createGroup(groupName, members);
    }

    // 2. Add a Member to a Group
    @PostMapping("/{groupId}/add-member")
    public String addMember(@PathVariable("groupId") String groupId, @RequestParam("user") String userEmail) {
        return groupService.addMember(groupId, userEmail);
    }

    // 3. Send a Message to a Group
    @PostMapping("/{groupId}/send")
    public String sendMessage(@PathVariable("groupId") String groupId, @RequestBody MessagePayload content) {
    	Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName(); // Get the email (username in UserDetails)
    	return groupService.sendMessage(groupId, email, content);
    }

    // 4. Get Group Messages
    @GetMapping("/{groupId}/messages")
    public ResponseEntity<?> getGroupMessages(@PathVariable("groupId") String groupId) {
        return groupService.getGroupMessages(groupId);
    }

    // 5. Get Group Members
    @GetMapping("/{groupId}/members")
    public ResponseEntity<?> getGroupMembers(@PathVariable("groupId") String groupId) {
        return groupService.getGroupMembers(groupId);
    }
    
    // 6. Get All Groups
    @GetMapping("/list")
    public ResponseEntity<?> getAllGroups() {
    	Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName(); // Get the email (username in UserDetails)
        return groupService.getAll(email);
    }
}
