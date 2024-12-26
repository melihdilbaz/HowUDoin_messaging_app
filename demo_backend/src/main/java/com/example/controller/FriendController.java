package com.example.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.model.FriendRequest;
import com.example.model.LoginResponse;
import com.example.repo.AccountRepo;
import com.example.repo.FriendRequestRepo;
import com.example.service.FriendService;

@RestController
@RequestMapping("/friends")
public class FriendController {
	
	@Autowired private FriendRequestRepo friendRequestRepo;
	
	@Autowired private FriendService friendService;
	
	@Autowired private AccountRepo accountRepo;
	
	// 1. Send Friend Request
    @PostMapping("/add")
    public String sendFriendRequest(@RequestParam("email") String receiverEmail) {
    	Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName(); // Get the email (username in UserDetails)
        return friendService.sendFriendRequest(email, receiverEmail);
    }

    // 2. Accept Friend Request
    @PostMapping("/accept")
    public String acceptFriendRequest(@RequestParam("id") String requestId) {
    	Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName(); // Get the email (username in UserDetails)
    	return friendService.acceptFriendRequest(email, requestId);
    }

    // 3. Get Friend List
    @GetMapping("/")
    public List<String> getFriendList() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName(); // Get the email (username in UserDetails)
        
        return friendService.getFriendList(email);
        // return "here";
    }
    
    // 4. Get a Friend Request
    @GetMapping("/search")
    public ResponseEntity<?> getRequest(@RequestParam("email") String accountEmail) {
    	Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName(); // Get the email (username in UserDetails)
        
        FriendRequest temp = friendRequestRepo.findBySenderEmailAndReceiverEmail(accountEmail, email);
        if (temp == null)
        	temp = friendRequestRepo.findBySenderEmailAndReceiverEmail(email, accountEmail);
        	if (temp == null)
                return ResponseEntity.status(403).body("There is no any request for " + accountEmail);

        return ResponseEntity.ok(temp);
    }
    
}
