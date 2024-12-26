package com.example.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

// @Builder
@ToString
public class LoginResponse {
    protected String token;
    protected String email;
	public String getEmail() {
		return email;
	}
	public void setEmail(String email) {
		this.email = email;
	}
	public String getToken() {
		return token;
	}
	public void setToken(String token) {
		this.token = token;
	}
	
	
	public LoginResponse(String token, String email) {
		super();
		this.token = token;
		this.email = email;
	}


    public static Builder builder() {
        return new Builder();
    }
	
	public static class Builder {
	    private String token;
	    private String email;

	    public Builder token(String token) {
	        this.token = token;
	        return this;
	    }

	    public Builder email(String email) {
	        this.email = email;
	        return this;
	    }

	    public LoginResponse build() {
	        return new LoginResponse(this.token, this.email);
	    }
	}
	
}