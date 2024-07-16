package com.investbridge.dto;

public class LoginRequestDTO {
    private String userEmail;
    private String userPw;

    public LoginRequestDTO() {}
    
	public LoginRequestDTO(String userEmail, String userPw) {
		this.userEmail = userEmail;
		this.userPw = userPw;
	}
	public String getUserEmail() {
		return userEmail;
	}
	public void setUserEmail(String userEmail) {
		this.userEmail = userEmail;
	}
	public String getUserPw() {
		return userPw;
	}
	public void setUserPw(String userPw) {
		this.userPw = userPw;
	}
}
