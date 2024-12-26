package com.example.controller;

import java.util.ArrayList;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.service.AccountImplementation;
import com.example.demo.JwtHelperUtils;
import com.example.model.*;
import com.example.repo.AccountRepo;
@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserDetailsService userDetailsService;

    @Autowired
    private AccountImplementation accountImplementation;

    @Autowired
    private JwtHelperUtils jwtHelper;
    
    @Autowired
    private AccountRepo accountRepo;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        // Fetch user by email
        Account account = accountRepo.findByEmail(loginRequest.getEmail());
        if (account == null) {
            return ResponseEntity.status(403).body("Invalid email or password");
        }

        // Compare raw passwords
        if (!account.getPassword().equals(loginRequest.getPassword())) {
            return ResponseEntity.status(403).body("Invalid email or password");
        }

        // Generate JWT token
        String token = jwtHelper.generateToken(new org.springframework.security.core.userdetails.User(
                account.getEmail(),
                account.getPassword(),
                new ArrayList<>()
        ));

        return ResponseEntity.ok(new LoginResponse(token, account.getEmail()));
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody AccountPayload accountPayload) {
        return accountImplementation.register(accountPayload);
    }

    private void authenticate(String username, String password) {
        try {
            authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(username, password)
            );
        } catch (BadCredentialsException e) {
            throw new BadCredentialsException("Invalid username or password.");
        }
    }
}
