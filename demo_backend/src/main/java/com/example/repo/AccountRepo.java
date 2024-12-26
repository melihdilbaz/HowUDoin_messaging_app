package com.example.repo;
import java.time.LocalDate;
import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.example.model.*;


public interface AccountRepo extends MongoRepository<Account, String> {

	public Account findByEmail(String email);

	public List<Account> findByCreatedDateBetween(LocalDate start, LocalDate end);
	
	// public Account findByAccountId(String accountId);

}
