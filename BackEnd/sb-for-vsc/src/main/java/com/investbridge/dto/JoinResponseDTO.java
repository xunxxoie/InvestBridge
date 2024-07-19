package com.investbridge.dto;

public class JoinResponseDTO {
    String userId;

	public JoinResponseDTO(String userId) {
		this.userId = userId;
	}

	public String getUserId() {
		return userId;
	}

	public void setUserId(String userId) {
		this.userId = userId;
	}
}
