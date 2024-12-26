package com.example.repo;

import com.example.model.Message;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface MessageRepository extends MongoRepository<Message, String> {
    List<Message> findBySenderEmailAndReceiverEmail(String senderEmail, String receiverEmail); // For private chats
    List<Message> findByGroupId(String groupId); // For group chats
}
