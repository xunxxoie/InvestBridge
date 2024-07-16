package com.investbridge.dto;

public class LoginResponseDTO {
    private String token;
    private String userRole;

    public LoginResponseDTO() {}
    
	public LoginResponseDTO(String token, String userRole) {
		this.token = token;
		this.userRole = userRole;
	}
	public String getToken() {
		return token;
	}
	public void setToken(String token) {
		this.token = token;
	}
	public String getUserRole() {
		return userRole;
	}
	public void setUserRole(String userRole) {
		this.userRole = userRole;
	}
}
