package com.example.repo;

import org.springframework.data.mongodb.repository.MongoRepository;


import com.example.model.*;

public interface FriendRequestRepo extends MongoRepository<FriendRequest, String>{
	public FriendRequest findBySenderEmailAndReceiverEmail(String sEmail, String rEmail);
}
