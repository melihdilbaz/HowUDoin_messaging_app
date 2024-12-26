package com.example.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.model.Account;
import com.example.model.FriendRequest;
import com.example.repo.AccountRepo;
import com.example.repo.FriendRequestRepo;

@Service
public class FriendService {

    @Autowired private FriendRequestRepo friendRequestRepo;
	
	@Autowired private AccountRepo accountRepo;
	
	public String sendFriendRequest(String senderEmail, String receiverEmail) {
        // Check if both users exist
        Account sender = accountRepo.findByEmail(senderEmail);
        Account receiver = accountRepo.findByEmail(receiverEmail);
		
        if (receiver == null) {
            return "Receiver does not exist";
        }
        
        FriendRequest temp = friendRequestRepo.findBySenderEmailAndReceiverEmail(senderEmail, receiverEmail);
        FriendRequest temp2 = friendRequestRepo.findBySenderEmailAndReceiverEmail(receiverEmail, senderEmail);

        if (temp != null) {
    		if (temp.getStatus().equals("PENDING")) return "There is already a request sent";
    		else return "You are already friends"+temp.getStatus();
        }
        else {
        	if (temp2 != null) {
        		if (temp2.getStatus().equals("PENDING")) return "There is already a request sent";
        		else return "You are already friends";
        	}
        }
        
        // Create and save a new friend request
        FriendRequest friendRequest = new FriendRequest();
        friendRequest.setSenderEmail(senderEmail);
        friendRequest.setReceiverEmail(receiverEmail);
        friendRequest.setStatus("PENDING");

        friendRequestRepo.save(friendRequest);
        return "Friend request sent successfully";
	}
	// note that all requests are stored in db once they are released
	// they updated when any change on the status is passed
	public String acceptFriendRequest(String email, String requestId) {
        // Find the friend request by ID
        Optional<FriendRequest> friendRequest = friendRequestRepo.findById(requestId);

        if (friendRequest.isEmpty()) {
            return "Friend request not found";
        }

        // Update the friend request status
        FriendRequest request = friendRequest.get(); // due to Optional<>
        
        if (email.equals(request.getReceiverEmail())) {
        	if (request.getStatus().equals("ACCEPTED"))
        		return "You are already friends";
        	else {
                // Add each user to the other's friend list
                Account senderAccount = accountRepo.findByEmail(request.getSenderEmail());
                Account receiverAccount = accountRepo.findByEmail(request.getReceiverEmail());


                senderAccount.addFriend(receiverAccount.getEmail());
                receiverAccount.addFriend(senderAccount.getEmail());
                // friend updates on accounts are updates on db too
                accountRepo.save(senderAccount);
                accountRepo.save(receiverAccount);

            	request.setStatus("ACCEPTED");
                friendRequestRepo.save(request);
                
                return "Friend request accepted successfully";	
        	}
            
        }
        return "Unable to accept friend request";
    }
	
    public List<String> getFriendList(String email) {
        // Retrieve the user and return their friend list
        Account account = accountRepo.findByEmail(email);
        return account.getFriends();
    }
    
}
