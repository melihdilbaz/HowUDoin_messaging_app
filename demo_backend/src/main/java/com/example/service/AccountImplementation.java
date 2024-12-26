package com.example.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import java.time.LocalDate;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.example.model.Account;
import com.example.model.AccountPayload;
import com.example.repo.AccountRepo;

import jakarta.annotation.PostConstruct;

@Service
public class AccountImplementation implements AccountService{

    @Autowired
    private AccountRepo accountRepo;
    
    @Autowired
    private MongoTemplate mongoTemplate;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
	
	@Override
	public Account createAccount(AccountPayload accountPayload) throws Exception {
		return null;
	}
	
	@PostConstruct
	public void init() {
		if (accountRepo.count() == 0) {
			Account account1 = new Account("admin1", "", "admin1@hotmail.com", "admin12345");
			Account account2 = new Account("admin2", "", "admin2@hotmail.com", "admin12345");
			Account account3 = new Account("admin3", "", "admin3@hotmail.com", "admin12345");

			accountRepo.save(account1);
			accountRepo.save(account2);
			accountRepo.save(account3);

		}
	}
	
	@Override
	public List<Account> searchCustomAccount(String startDate, String endDate) {
        LocalDate start = LocalDate.parse(startDate);
        LocalDate end = LocalDate.parse(endDate);

        return accountRepo.findByCreatedDateBetween(start, end);
	}
	
	public ResponseEntity<?> register(AccountPayload accountPayload) {
	    Account account = new Account(accountPayload.getFirstName(),
	            accountPayload.getLastName(),
	            accountPayload.getEmail(),
	            accountPayload.getPassword()); // Encode password here
	    
	    if (accountRepo.findByEmail(account.getEmail()) != null)
	    	return ResponseEntity.status(403).body("This email is in use");
	    
	    return ResponseEntity.ok(accountRepo.save(account));
	}

}
