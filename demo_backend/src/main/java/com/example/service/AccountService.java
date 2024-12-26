package com.example.service;

import com.example.model.Account;
import com.example.model.AccountPayload;

import java.util.List;

public interface AccountService {
    Account createAccount(AccountPayload accountPayload) throws Exception;
    List<Account> searchCustomAccount(String startDate, String endDate);
}
