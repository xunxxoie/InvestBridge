package com.investbridge.model.dto.Idea;

public class IdeaNotFoundResponse {
    private String message;

    public IdeaNotFoundResponse(String message) {
        this.message = message;
    }

    public String getMessage() {
        return message;
    }
}